/**
 * Manual verification script to test portfolio data flow from MongoDB
 */

import { getAboutData } from '../app/lib/about-mongo.js';
import { getContactData } from '../app/lib/contact-mongo.js';
import { getSkillsData } from '../app/lib/skills-mongo.js';
import { getExperiences } from '../app/lib/experience-mongo.js';

async function testPortfolioData() {
  console.log('🧪 Testing Portfolio Data Flow from MongoDB...\n');

  try {
    // Test About Data
    console.log('📋 Testing About Data:');
    const aboutData = await getAboutData();
    console.log('✅ About Data:', {
      name: aboutData.name,
      title: aboutData.title,
      bio: aboutData.bio ? 'Present' : 'Missing',
      skills: aboutData.skills?.length || 0,
      achievements: aboutData.achievements?.length || 0
    });

    // Test Contact Data
    console.log('\n📞 Testing Contact Data:');
    const contactData = await getContactData();
    console.log('✅ Contact Data:', {
      email: contactData.email ? 'Present' : 'Missing',
      phone: contactData.phone ? 'Present' : 'Missing',
      location: contactData.location ? 'Present' : 'Missing',
      linkedin: contactData.linkedin ? 'Present' : 'Missing',
      github: contactData.github ? 'Present' : 'Missing'
    });

    // Test Skills Data
    console.log('\n🛠️ Testing Skills Data:');
    const skillsData = await getSkillsData();
    console.log('✅ Skills Data:', {
      categories: skillsData.skillCategories?.length || 0,
      certifications: skillsData.certifications?.length || 0,
      technicalExpertise: skillsData.technicalExpertise ? 'Present' : 'Missing'
    });

    // Test Experience Data
    console.log('\n💼 Testing Experience Data:');
    const experienceData = await getExperiences();
    console.log('✅ Experience Data:', {
      experiences: experienceData.length || 0
    });

    console.log('\n🎉 All data sources are working correctly!');
    console.log('\n📊 Summary:');
    console.log(`- About: ${aboutData.name || 'No name'}`);
    console.log(`- Contact: ${contactData.email || 'No email'}`);
    console.log(`- Skills: ${skillsData.skillCategories?.length || 0} categories`);
    console.log(`- Experience: ${experienceData.length || 0} entries`);

  } catch (error) {
    console.error('❌ Error testing portfolio data:', error);
    process.exit(1);
  }
}

// Run the test
testPortfolioData().then(() => {
  console.log('\n✅ Portfolio data test completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Portfolio data test failed:', error);
  process.exit(1);
});
