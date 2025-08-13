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
    email: 'vsivareddy.venna@gmail.com',
    phone: '+91 93989 61541',
    location: 'Bengaluru, India',
  },
  socialLinks: [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/sivavenna',
      icon: 'linkedin',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/avis-enna',
      icon: 'github',
    },
    {
      name: 'Email',
      url: 'mailto:sivareddy.venna@gmail.com',
      icon: 'email',
    },
  ],
  content: {
    title: 'contact',
    subtitle: "Let's work together",
    description:
      "I'm always interested in hearing about new opportunities and exciting projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    orderOfService: {
      title: 'order of service',
      description:
        "Available for freelance projects, full-time opportunities, and consulting work. Let's discuss how we can work together to bring your ideas to life.",
    },
  },
};

export async function getContactData(): Promise<ContactData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (_error) {
    await saveContactData(defaultContactData);
    return defaultContactData;
  }
}

export async function saveContactData(data: ContactData): Promise<void> {
  // Ensure data directory exists
  const dataDir = path.dirname(DATA_FILE);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function updateContactData(updates: Partial<ContactData>): Promise<ContactData> {
  const currentData = await getContactData();
  const updatedData = { ...currentData, ...updates };
  await saveContactData(updatedData);
  return updatedData;
}
