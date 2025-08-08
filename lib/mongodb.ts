import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) {
    return { client, db };
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('MongoDB: Connecting to database...');
    client = new MongoClient(uri);
    await client.connect();
    
    // Extract database name from URI or use default
    const dbName = uri.split('/').pop()?.split('?')[0] || 'portfolio_admin';
    db = client.db(dbName);
    
    console.log('MongoDB: Connected successfully to database:', dbName);
    return { client, db };
  } catch (error) {
    console.error('MongoDB: Connection failed:', error);
    throw error;
  }
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

export async function getCollection(collectionName: string): Promise<Collection> {
  const database = await getDatabase();
  return database.collection(collectionName);
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log('MongoDB: Connection closed');
  }
}
