import { promises as fs } from 'fs';
import path from 'path';

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  description: string;
  orderOfService: {
    title: string;
    description: string;
  };
}

export interface ContactData {
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  content: ContactContent;
}

const DATA_FILE = path.join(process.cwd(), 'app/data/contact.json');

const defaultContactData: ContactData = {
  contactInfo: {
    email: "vsivareddy.venna@gmail.com",
    phone: "+91 93989 61541",
    location: "Bengaluru, India"
  },
  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/sivavenna",
      icon: "linkedin"
    },
    {
      name: "GitHub",
      url: "https://github.com/avis-enna",
      icon: "github"
    },
    {
      name: "Email",
      url: "mailto:sivareddy.venna@gmail.com",
      icon: "email"
    }
  ],
  content: {
    title: "contact",
    subtitle: "Let's work together",
    description: "I'm always interested in hearing about new opportunities and exciting projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    orderOfService: {
      title: "order of service",
      description: "Available for freelance projects, full-time opportunities, and consulting work. Let's discuss how we can work together to bring your ideas to life."
    }
  }
};

export async function getContactData(): Promise<ContactData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    console.log('Contact data loaded from file');
    return JSON.parse(data);
  } catch (error) {
    console.log('Contact file not found, using defaults');
    await saveContactData(defaultContactData);
    return defaultContactData;
  }
}

export async function saveContactData(data: ContactData): Promise<void> {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Contact data saved to file');
  } catch (error) {
    console.error('Error saving contact data:', error);
    throw error;
  }
}

export async function updateContactData(updates: Partial<ContactData>): Promise<ContactData> {
  try {
    const currentData = await getContactData();
    const updatedData = { ...currentData, ...updates };
    await saveContactData(updatedData);
    console.log('Contact data updated');
    return updatedData;
  } catch (error) {
    console.error('Error updating contact data:', error);
    throw error;
  }
}

export async function updateContactInfo(updates: Partial<ContactInfo>): Promise<ContactData> {
  try {
    const currentData = await getContactData();
    currentData.contactInfo = { ...currentData.contactInfo, ...updates };
    await saveContactData(currentData);
    console.log('Contact info updated');
    return currentData;
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }
}

export async function updateSocialLink(index: number, updates: Partial<SocialLink>): Promise<ContactData> {
  try {
    const currentData = await getContactData();
    
    if (index < 0 || index >= currentData.socialLinks.length) {
      throw new Error(`Social link index ${index} out of bounds`);
    }
    
    currentData.socialLinks[index] = { ...currentData.socialLinks[index], ...updates };
    await saveContactData(currentData);
    console.log(`Social link ${index} updated`);
    return currentData;
  } catch (error) {
    console.error('Error updating social link:', error);
    throw error;
  }
}
