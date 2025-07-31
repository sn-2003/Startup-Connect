import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';
import { seedTools } from './seed-tools';
import { seedNews } from './seed-news';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

/*  Create demo users
  const hashedPassword = await hashPassword('password123');
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'sarah@techstartup.com' },
    update: {},
    create: {
      name: 'Sarah Chen',
      email: 'sarah@techstartup.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo users');

  // Create demo startups
  const startup1 = await prisma.startup.create({
    data: {
      name: 'TechFlow',
      domain: 'techflow.com',
      stage: 'GROWTH',
      description: 'AI-powered workflow automation for modern teams',
      logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      founded: '2022',
      location: 'San Francisco, CA',
      employees: '25-50',
      funding: 'Series A',
      website: 'https://techflow.com',
      industry: 'SaaS',
      upvotes: 15,
      downvotes: 2,
      userId: user2.id,
    },
  });

  const startup2 = await prisma.startup.create({
    data: {
      name: 'DataViz Pro',
      domain: 'datavizpro.com',
      stage: 'MVP',
      description: 'Beautiful data visualization tools for businesses',
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      founded: '2023',
      location: 'New York, NY',
      employees: '5-10',
      funding: 'Seed',
      website: 'https://datavizpro.com',
      industry: 'Analytics',
      upvotes: 8,
      downvotes: 1,
      userId: user1.id,
    },
  });

  console.log('✅ Created demo startups');

  // Create demo jobs
  await prisma.job.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Senior Frontend Developer',
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        description: 'Join our growing team to build the future of workflow automation...',
        requirements: ['React', 'TypeScript', 'Next.js', '5+ years experience'],
        experienceLevel: 'SENIOR',
        salaryMin: 120000,
        salaryMax: 160000,
        remote: true,
        startupId: startup1.id,
      },
      {
        title: 'Product Designer',
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        description: 'Design beautiful and intuitive user experiences...',
        requirements: ['Figma', 'User Research', 'Prototyping', '3+ years experience'],
        experienceLevel: 'MID',
        salaryMin: 90000,
        salaryMax: 130000,
        remote: true,
        startupId: startup1.id,
      },
    ],
  });

  console.log('✅ Created demo jobs');*/

  /*// Create demo investors
  await prisma.investor.createMany({
    skipDuplicates: true,
    data: [
  {
    name: "100X.VC",
    firm: "Venture Capital",
    preferredStage: [
      "Seed"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.100x.vc/",
    linkedin: "https://www.linkedin.com/company/100x-vc/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272de4d2cec9acad5f01b_image.svg"
  },
  {
    name: "2am VC",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "SaaS"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.2amvc.com/",
    linkedin: "https://www.linkedin.com/company/2-a-m-ventures/?viewAsMember=true",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e1aad3e4f98cb5ae30_2_a_m_ventures_logo.jpeg"
  },
  {
    name: "3one4 Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.3one4capital.com/",
    linkedin: "https://www.linkedin.com/company/3one4-capital/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272dec953f00409f466f1_626e7a3689d0431cb2b36f88_logo.svg"
  },
  {
    name: "9Unicorns",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://9unicorns.in/",
    linkedin: "https://www.linkedin.com/company/9unicorns/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272decfe833d7c5080466_color-logo.svg"
  },
  {
    name: "Aakrit Vaish",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder & CEO at Haptik Inc",
    portfolio: [],
    email: "https://x.com/aakrit",
    linkedin: "https://www.linkedin.com/in/aakrit/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272ff90519204407ca984_1588917050047.jpeg"
  },
  {
    name: "Abdul Paravengal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Smart Mobility",
      "SaaS"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder & CEO at Hav",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/abdulgafoorme/?originalSubdomain=id",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272ffc22ef4f5b7b73da1_1655460036805.jpeg"
  },
  {
    name: "Abhishek Goyal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Tracxn",
    portfolio: [],
    email: "https://x.com/AbhishekTracxn",
    linkedin: "https://www.linkedin.com/in/abhishekgoyal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272fff81f6e49f70d9220_1600075955805.jpeg"
  },
  {
    name: "Abhishek Rungta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Indus Net Technologies",
    portfolio: [],
    email: "https://x.com/abhishekrungta",
    linkedin: "https://www.linkedin.com/in/abhishekrungta/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272ffabc44d2d954af131_1563164123284.jpeg"
  },
  {
    name: "Abhishek Sharma",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Fashinza",
    portfolio: [],
    email: "https://x.com/abhisheks1204?lang=en",
    linkedin: "https://www.linkedin.com/in/abhishekksharma/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272ffba40745ded4c178a_1648407178246.jpeg"
  },
  {
    name: "Accel",
    firm: "Venture Capital",
    preferredStage: [
      "Multi Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.accel.com/india-home",
    linkedin: "https://www.linkedin.com/company/accel-vc/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682733551383c464e2f53e8_330px-Accel_(Partners)_2015_logo.png"
  },
  {
    name: "Ajai Chowdhry",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & Chairman at EPIC Foundation",
    portfolio: [],
    email: "https://twitter.com/AjaiChowdhry?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor",
    linkedin: "https://www.linkedin.com/in/ajaichowdhry/?ref=ynos.in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272fff81f6e49f70d9224_1661855888370.jpeg"
  },
  {
    name: "Ajay Gupta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Vice President & Head of Strategy at Ericsson , India",
    portfolio: [],
    email: "https://twitter.com/ajay_2",
    linkedin: "https://www.linkedin.com/in/ajaygupta100/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827300a6b25177dab69ea8_1656137394796.jpeg"
  },
  {
    name: "Ajay Lavakare",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co president at Stanford Angels & Entrepreneurs India",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/ajaylavakare/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273003d36e484aca9ca45_1571383318291.jpeg"
  },
  {
    name: "Ajeet Singh",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "HealthTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Reflexical Pte Ltd",
    portfolio: [],
    email: "https://twitter.com/ajeetk",
    linkedin: "https://www.linkedin.com/in/ajeetkhurana/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273000f1cfa8a762250a4_1516197084199.jpeg"
  },
  {
    name: "Akshay Chaturvedi",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at LeverageEdu",
    portfolio: [],
    email: "https://x.com/Akshay001",
    linkedin: "https://www.linkedin.com/in/akshaychaturvedi/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827300bac8eb5e9c371b83_1712937651050.jpeg"
  },
  {
    name: "Alok Mittal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder & CEO at Indifi Technoligies pvt ltd",
    portfolio: [],
    email: "https://x.com/alokmittal001?lang=en",
    linkedin: "https://www.linkedin.com/in/alok-mittal-590a/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273003f126f9a8d89fc02_16359251131635925113Alok%2520mittal.png"
  },
  {
    name: "Aloke Bajpai",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at Ixigo",
    portfolio: [],
    email: "https://twitter.com/alokebajpai",
    linkedin: "https://www.linkedin.com/in/alokebajpai/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273004cd7d2bd48cba6d6_1594836591529.jpeg"
  },
  {
    name: "Aman Gupta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at boAt",
    portfolio: [],
    email: "https://twitter.com/amangupta0303",
    linkedin: "https://www.linkedin.com/in/aman-gupta-7217a515/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827300086f4f8f2e00a35d_1689877352229.jpeg"
  },
  {
    name: "Amit Gupta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Mobility",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder & CEO at Yulu",
    portfolio: [],
    email: "https://twitter.com/amitgupta007?ref=ynos.in",
    linkedin: "https://www.linkedin.com/in/amitgupta007/?ref=ynos.in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273012330f039c0e5168a_652f7edfbfa272ea310ac07d_78.%252520Amit%252520Gupta-p-500.webp"
  },
  {
    name: "Amit Lakhotia",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Park+",
    portfolio: [],
    email: "https://x.com/amit_lakhotia?lang=en",
    linkedin: "https://www.linkedin.com/in/amitlakhotia/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273013a6c317ef99dc46a_1516250529966.jpeg"
  },
  {
    name: "Amit Patni",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Director at Campden Family Connect, India",
    portfolio: [],
    email: "https://x.com/theamitpatni",
    linkedin: "https://www.linkedin.com/in/patniamit/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827301abc44d2d954af1dd_1556182728257.jpeg"
  },
  {
    name: "Amit Ranjan",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder at SlideShare",
    portfolio: [],
    email: "https://x.com/amitranjan",
    linkedin: "https://www.linkedin.com/in/amitranjanprofile/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827301f322e8a53562f7ec_1665600992725.jpeg"
  },
  {
    name: "Amit Singal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "HealthTech",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Director at ASR & Greenzo",
    portfolio: [],
    email: "https://x.com/amitsingalca?lang=en",
    linkedin: "https://www.linkedin.com/in/amitsingalca/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273017ac7080e3ea4f1f4_1671793896553.jpeg"
  },
  {
    name: "Anand Chandrasekaran",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Director at Facebook",
    portfolio: [],
    email: "https://twitter.com/anandc",
    linkedin: "https://www.linkedin.com/in/anandc/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827301c7b425e602519d31_1665538327207.jpeg"
  },
  {
    name: "Anand Ladsariya",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "Mobility"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Everest Flavours",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/anand-ladsariya-02667113/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827302b4bb3ce86104fb6f_anand-ladsariya-660_092215122939.jpeg"
  },
  {
    name: "Anand Shah",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Dhamiri",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/anand-shah-0817b1115/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827302622055ae6a105078_1517436738652.jpeg"
  },
  {
    name: "Ankit Mehrotra",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "EdTech",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at Dineout",
    portfolio: [],
    email: "https://twitter.com/Ankitatdineout",
    linkedin: "https://www.linkedin.com/in/ankitatdineout/?ref=ynos.in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273020464430a7bc7f1d7_1517558926933.jpeg"
  },
  {
    name: "Ankur Nagpal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Carry",
    portfolio: [],
    email: "https://twitter.com/ankurnagpal",
    linkedin: "https://www.linkedin.com/in/ankurnagpal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730259141696b3d75dab_1666551944309.jpeg"
  },
  {
    name: "Ankur Warikoo",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Nearbuy,HelpClub",
    portfolio: [],
    email: "https://twitter.com/warikoo",
    linkedin: "https://www.linkedin.com/in/warikoo/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730288b1e8bb189b565e_1706500408893.jpeg"
  },
  {
    name: "Anthill Venture Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "SaaS",
      "HealthTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://anthillventures.com/",
    linkedin: "https://www.linkedin.com/company/anthill-ventures/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e44d2cec9acad5f278_Anthill-Logo-1-300x65-1.png"
  },
  {
    name: "Anuj Srivastava",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Mobility",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Livspace",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/anujs/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273022cab3d2ecedf0a7b_1698230514884.jpeg"
  },
  {
    name: "Anupam Mittal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech",
      "Digital Entertainment"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at People Group",
    portfolio: [],
    email: "https://x.com/AnupamMittal",
    linkedin: "https://www.linkedin.com/in/anupam-mittal-4b3b0114/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273039d1432fe4701b0b0_1684481062551.jpeg"
  },
  {
    name: "Appyhigh",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "SaaS",
      "FinTech",
      "Digital Entertainment"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://appyhigh.com/",
    linkedin: "https://www.linkedin.com/company/appyhigh/",
    imageUrl: "https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg"
  },
  {
    name: "Aprameya Radhakrishna",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "FinTech",
      "EdTech",
      "Consumer"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder & CEO at Koo",
    portfolio: [],
    email: "https://twitter.com/aprameya",
    linkedin: "https://www.linkedin.com/in/aprameyaradhakrishna/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273b6612713639de527d1_1648412527350.jpg"
  },
  {
    name: "Arpan Sheth",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech",
      "FinTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Senior Partner at Bain & Company",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/arpansheth/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827303f81f6e49f70d92fe_1711983287313.jpeg"
  },
  {
    name: "Artha Ventures Fund",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "Multi Sector"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://artha.vc/",
    linkedin: "https://www.linkedin.com/company/arthaventurefund/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e23a6c317ef99daf13_AVF_2022_11_15_CorpComms_B_AVF-Logo.png"
  },
  {
    name: "Ashish Goel",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder & CFO at Fibe India",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/ashish-goel-591572/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730349390957c2cd0af8_1670490646559.jpeg"
  },
  {
    name: "Ashish Goel",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Urban Ladder",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/ashish-goel-591572/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827303ac4ca22c5675f462_1536325861892.jpeg"
  },
  {
    name: "Ashish Hemrajani",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Bigtree entertainment",
    portfolio: [],
    email: "https://twitter.com/fafsters",
    linkedin: "https://www.linkedin.com/in/ashishhemrajani/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273034f83b787540ea3b7_1688546509808.jpeg"
  },
  {
    name: "Ashish Tulsian",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder & CEO at Restroworks",
    portfolio: [],
    email: "https://twitter.com/atulsian",
    linkedin: "https://www.linkedin.com/in/ashishtulsian/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273053b744f5e2a6d0665_1712771154806.jpeg"
  },
  {
    name: "Ashneer Grover",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at BharatPe",
    portfolio: [],
    email: "https://twitter.com/Ashneer_Grover",
    linkedin: "https://www.linkedin.com/in/ashneer/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730c78514acfa241622a_1677988939103.jpeg"
  },
  {
    name: "Ashutosh Valani",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Mobility",
      "HealthTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder at Renee Cosmetics",
    portfolio: [],
    email: "https://twitter.com/ashutoshvalani",
    linkedin: "https://www.linkedin.com/in/ashutoshvalani/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730561bfb3113a16ae09_1622120840029.jpeg"
  },
  {
    name: "Asish Mohapatra",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Mobility",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at OfBusiness",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/asish-mohapatra-22685a28/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273056dbe6b8393b1f2f7_1517512010294.jpeg"
  },
  {
    name: "Auxano",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "Smart Mobility",
      "FinTech",
      "Enterprise SaaS",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://auxano.in/",
    linkedin: "https://www.linkedin.com/company/auxano-aif/about/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e56d328ee3ab45ab29_auxano-logo.png"
  },
  {
    name: "Axilor Ventures",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.axilor.com/",
    linkedin: "https://www.linkedin.com/company/axilor-ventures/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272df7163f6b86e7dd4e7_logo.png"
  },
  {
    name: "Balaji S. Srinivasan",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Cofounder at Coin Center",
    portfolio: [],
    email: "https://razorpay.com/rize/investors-list/coin-center",
    linkedin: "https://www.linkedin.com/in/balajissrinivasan/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827305fe3db1b442d56409_crypto-Balaji-Srinivasan-crypto-Balaji-Srinivasan-net-worth-social-media-news-1136x757.webp"
  },
  {
    name: "Beenext Venture Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.beenext.com/",
    linkedin: "https://www.linkedin.com/company/beenext-com/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272dfd8affc45d6df0b51_beenext_logo-1.png"
  },
  {
    name: "Beerud Sheth",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at Gupshup",
    portfolio: [],
    email: "https://razorpay.com/rize/investors-list/gupshup",
    linkedin: "https://www.linkedin.com/in/beerud/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827305fe3db1b442d56447_1638054196803.jpeg"
  },
  {
    name: "Better Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.bettercapital.vc/",
    linkedin: "https://www.linkedin.com/company/betterinc/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272dd9fc729d59aafaacf_better-capital.svg"
  },
  {
    name: "Bikky Khosla",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at Tradeindia.com",
    portfolio: [],
    email: "https://razorpay.com/rize/investors-list/tradeindia-com",
    linkedin: "https://www.linkedin.com/in/bikky-khosla-46b23/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730785c5e84b1ac266d7_1651032875984.jpeg"
  },
  {
    name: "Binny Bansal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at Flipkart",
    portfolio: [],
    email: "https://twitter.com/binnybansal",
    linkedin: "https://www.linkedin.com/in/binnybansal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827307abc44d2d954af375_1715827468010.jpeg"
  },
  {
    name: "Blume.vc",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://blume.vc/",
    linkedin: "https://www.linkedin.com/company/blume-venture-advisors/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272de0655eef0980d1853_Beliefs-1.png"
  },
  {
    name: "Chakradhar Gade",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "EdTech",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at Country Delight",
    portfolio: [],
    email: "https://twitter.com/chakrigade",
    linkedin: "https://www.linkedin.com/in/chakradhar-gade-1025a12/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827307273063b2ee226123_1549635238547.jpeg"
  },
  {
    name: "Chand Das",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility"
    ],
    geography: [
      "India"
    ],
    description: "Business & Leadership Coach at CSD Associates, India",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/chand-das-9a85bb13/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273077a3ed0f566c882a0_1648301972176.jpeg"
  },
  {
    name: "Chiratae Ventures",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.chiratae.com/",
    linkedin: "https://www.linkedin.com/company/chiratae-ventures/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e1913464424861b3ca_chiratae-logo-min.png"
  },
  {
    name: "DSG Consumer Partners",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Early Stage"
    ],
    sectors: [
      "Tech Startup",
      "Food"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.dsgcp.com/",
    linkedin: "https://www.linkedin.com/company/dsg-consumer-partners/about/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e371883f4f7fe86488_651693d7bd56eaf2cdf4c005_dsg-logo.svg"
  },
  {
    name: "Deepinder Goyal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "HealthTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Zomato",
    portfolio: [],
    email: "https://x.com/deepigoyal",
    linkedin: "https://www.linkedin.com/in/deepigoyal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273077ac7080e3ea4f40f_1636454470802.jpeg"
  },
  {
    name: "Dheeraj Jain",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Director at Redcliff Capital",
    portfolio: [],
    email: "https://twitter.com/dheeraj90179631",
    linkedin: "https://www.linkedin.com/in/dheeraj-jain-4961352/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273083430c6fa5e3088ec_1595448525038.jpeg"
  },
  {
    name: "Dholakia Ventures",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://dholakiaventures.com/",
    linkedin: "https://www.linkedin.com/company/dholakiaventures/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e18a9fd155a15cde8d_dholakiaventures_logo.jpeg"
  },
  {
    name: "Dilip Khandelwal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media"
    ],
    geography: [
      "India"
    ],
    description: "MD & CEO at Deutsche India",
    portfolio: [],
    email: "https://x.com/dilipkhandelwa?lang=en",
    linkedin: "https://www.linkedin.com/in/dilipkhandelwal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827308f7bf7d3d2cc1bb0b_652f7edfbfa272ea310ac088_66.%2520Dilip%2520Khandelwal.jpeg"
  },
  {
    name: "Dinesh Agarwal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at IndiaMART.COM",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/advanidinesh/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273084a8e3f6beaa7d173_652f7edfbfa272ea310ac22a_130.%2520Dinesh%2520Agarwal.jpeg"
  },
  {
    name: "Farid Ahsan",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder at ShareChat",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/faridahsan/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730810989d2af066b020_655464f5c732cb3fd4702d78_226.%2520Farid%2520Ahsan-p-500.webp"
  },
  {
    name: "First Cheque",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Pre-seed",
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.firstcheque.vc/",
    linkedin: "https://www.linkedin.com/company/firstcheque/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272df0c1159d45ea60c21_63d7abfd82339227a9544fd9_Firstchque_Logo%2520(1)%25201-p-500.webp"
  },
  {
    name: "Gamba.Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech",
      "Digital Entertainment",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://gembacapital.in/",
    linkedin: "https://www.linkedin.com/company/gemba-capital/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e5dbeec293a9f765e5_logo%402x.png"
  },
  {
    name: "Ganesh Krishnan",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "FinTech",
      "Digital Entertainment"
    ],
    geography: [
      "India"
    ],
    description: "Partner at Growth Story",
    portfolio: [],
    email: "https://x.com/ganeshk03?lang=en",
    linkedin: "https://www.linkedin.com/in/ganeshk/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827308d3a75a19b66cb7e7_652f7edfbfa272ea310ac084_70.%2520Ganesh%2520Krishnan.jpeg"
  },
  {
    name: "Gaurav Kapur",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Oaktree Sports, India",
    portfolio: [],
    email: "https://x.com/gauravkapur",
    linkedin: "https://www.linkedin.com/in/gaurav-kapur-15437018a/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827308aad3e4f98cb5c16f_65534df1161fce654fd65fd7_237.%2520Gaurav%2520Kapur.jpeg"
  },
  {
    name: "Gaurav Munjal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder and CEO at Unacademy",
    portfolio: [],
    email: "https://twitter.com/gauravmunjal",
    linkedin: "https://www.linkedin.com/in/gauravmunjal8/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827309c7b425e60251a05c_65546e3fa8007ac10fde384e_208.%2520Gaurav%2520Munjal.jpeg"
  },
  {
    name: "Ghazal Alagh",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Mamaearth",
    portfolio: [],
    email: "https://twitter.com/GhazalAlagh",
    linkedin: "https://www.linkedin.com/in/ghazal-alagh-9755a0128/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273090bc51721f1562ad1_1672237437305.jpeg"
  },
  {
    name: "Girish Mathrubootham",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at Freshworks",
    portfolio: [],
    email: "https://twitter.com/mrgirish",
    linkedin: "https://www.linkedin.com/in/girish1/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273096d328ee3ab45b993_652f7edfbfa272ea310ac015_60eddf32ea37df820cf3c229_girish-mathrubootham-p-500.webp"
  },
  {
    name: "Gokul Rajaram",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "HealthTech",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Product and Business Helper at DoorDash",
    portfolio: [],
    email: "https://x.com/gokulr",
    linkedin: "https://www.linkedin.com/in/gokulrajaram1/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730947a10d4c23073106_652f7edfbfa272ea310ac1f2_196.%2520Gokul%2520Rajaram.webp"
  },
  {
    name: "Good Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Series A",
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.goodcapital.vc/",
    linkedin: "https://www.linkedin.com/company/good-capital/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e39f2ba04258c5df25_goodcapital_dark_large%2B%25281%2529.png"
  },
  {
    name: "Goodwater Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Series A"
    ],
    sectors: [],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.goodwatercap.com/",
    linkedin: "https://www.linkedin.com/company/goodwater-capital/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e5064891f21d9bc87c_images.png"
  },
  {
    name: "Hari Balasubramanian",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "Director at Shopatplaces",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/bhari/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273092bfb8e5430d13cce_65546462fd4185156a0de47a_229.%2520Hari%2520Balasubramanian.webp"
  },
  {
    name: "Harish Bahl",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder & Chairman at Smile Group",
    portfolio: [],
    email: "https://x.com/Harish_Bahl",
    linkedin: "https://www.linkedin.com/in/harishbahl/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273093b744f5e2a6d08c7_1617718460799.jpeg"
  },
  {
    name: "Harpreet Singh Grover",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder & CEO at CoCubes.com, India",
    portfolio: [],
    email: "https://twitter.com/hsgrover?ref=ynos.in",
    linkedin: "https://www.linkedin.com/in/hsgrover/?ref=ynos.in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730a086f4f8f2e00a8ab_65534a993439e5a5b08b8bc0_246.%2520Harpreet%2520Singh%2520Grover.webp"
  },
  {
    name: "Harsh Shah",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech",
      "Digital Entertainment",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder at Fynd",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/harshshah/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730aedcc2d4a07e2362b_1548323779416.jpeg"
  },
  {
    name: "Haystack",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "SaaS"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://haystack.vc/",
    linkedin: "https://www.linkedin.com/company/haystackvc/about/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e2853e189b399c21e3_82h4EW1RRh22kUUIHskN.png"
  },
  {
    name: "Huddle",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.huddleventures.vc/",
    linkedin: "https://www.linkedin.com/company/huddleventures/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e44821bac3566eb3eb_poweredbyhuddle_logo.jpeg"
  },
  {
    name: "India Quotient",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.indiaquotient.in/",
    linkedin: "https://www.linkedin.com/company/india-quotient/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272df325928ea82a03be4_64fde4cb27091297566952a9_iq.svg"
  },
  {
    name: "Info Edge Ventures",
    firm: "Venture Capital",
    preferredStage: [
      "Series A",
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.infoedgeventures.in/",
    linkedin: "https://www.linkedin.com/company/infoedge-ventures/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e5d3a75a19b66ca71f_822596_d3ff45a3e8f346c383cc8217a813fd0b~mv2.png"
  },
  {
    name: "IvyCap Ventures",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://ivycapventures.com/",
    linkedin: "https://www.linkedin.com/company/ivycap-ventures-private-limited/about/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e45d0b6dc73ce039ea_logo-green.png"
  },
  {
    name: "Jitendra Gupta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Jupiter",
    portfolio: [],
    email: "https://x.com/guptajiten?lang=en",
    linkedin: "https://www.linkedin.com/in/guptajiten/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730af81f6e49f70d96f0_652f7edfbfa272ea310ac094_55.%2520Jitendra%2520Gupta.webp"
  },
  {
    name: "Kalaari Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Series A",
      "Seed"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://kalaari.com/",
    linkedin: "https://www.linkedin.com/company/kalaari-capital/?trk=tyah",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e31b1b7e1d3c4367e0_Kalaari-Logo.png"
  },
  {
    name: "Kalyan Krishnamurthy",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at Flipkart",
    portfolio: [],
    email: "https://x.com/_Kalyan_K",
    linkedin: "https://www.linkedin.com/in/kalyankrishnamurthy/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730a0464430a7bc7f7b5_652f7edfbfa272ea310ac212_155.-Kalyan-Krishnamurthy.webp"
  },
  {
    name: "Kishore Kumar Ganji",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Angel investor & mentor at Astir Ventures",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/kishoreganji/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730a73ecf0aed957d54e_images.jpeg"
  },
  {
    name: "Kumar Aakash",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "Digital Entertainment",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Senior VP at Hotstar",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/kumaraakash/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730a59141696b3d7614e_652f7edfbfa272ea310ac20d_157.%2520Kumar%2520Aakash.webp"
  },
  {
    name: "Kunal Bahl",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Jasper",
    portfolio: [],
    email: "https://twitter.com/1kunalbahl?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor",
    linkedin: "https://www.linkedin.com/in/kunalbahl/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730bb008333529d0a583_1708016890335.jpeg"
  },
  {
    name: "Kunal Shah",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Cred",
    portfolio: [],
    email: "https://twitter.com/kunalb11",
    linkedin: "https://www.linkedin.com/in/kunalshah1/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730b88eef928703987f2_652f7edfbfa272ea310ac021_kunal-shah-p-500.webp"
  },
  {
    name: "Lalit Keshre",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Groww",
    portfolio: [],
    email: "https://twitter.com/lkeshre",
    linkedin: "https://www.linkedin.com/in/lalitkeshre/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730b622055ae6a10538c_1516323715969.jpeg"
  },
  {
    name: "Lead Angels Network Venture Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://leadangels.in/",
    linkedin: "https://www.linkedin.com/in/leadangels/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e1e07e5fa520c4e7ef_LA-LOGO-O.png"
  },
  {
    name: "Maninder Gulati",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "HealthTech",
      "Digital Entertainment"
    ],
    geography: [
      "India"
    ],
    description: "Chief Strategy Officer at OYO Rooms, India",
    portfolio: [],
    email: "https://x.com/maninderg13?lang=en",
    linkedin: null,
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730bd3e011123eda36c1_oyo.jpeg"
  },
  {
    name: "Mekin Maheshwari",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Udhyan",
    portfolio: [],
    email: "https://razorpay.com/rize/investors-list/mekin-maheshwari",
    linkedin: "https://www.linkedin.com/in/mekin/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730b9fc729d59aafc221_1714998459063.jpeg"
  },
  {
    name: "Miten Sampat",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Ex-Cheif Strategy Officer at Times Internet",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/mitensampat/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730b6a6b21d1bd94fd86_652f7edfbfa272ea310ac216_151.%2520Miten%2520Sampat.webp"
  },
  {
    name: "Mohit Satyanand",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Chairman and founder at Teamwork Arts",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/mohit-satyanand-baa2b820/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730cd2ed89c50f5a81b9_1516891392139.jpeg"
  },
  {
    name: "Murugavel Janakiraman",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Matrimony.com",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/murugavel-janakiraman-0186891/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730c0924e7ed5a069b65_1655045618141.jpeg"
  },
  {
    name: "Namita Thapar",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at Emcure Pharmaceuticals",
    portfolio: [],
    email: "https://x.com/namitathapar",
    linkedin: "https://www.linkedin.com/in/namita-thapar/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730ca62e77ce89dc5230_652f7edfbfa272ea310ac231_123.%252520Namita%252520Thapar-p-500.webp"
  },
  {
    name: "Naveen Tewari",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media"
    ],
    geography: [
      "India"
    ],
    description: "Founder at InMobi",
    portfolio: [],
    email: "https://twitter.com/NaveenTewari?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor",
    linkedin: "https://www.linkedin.com/in/naveentewari/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730c0bc51721f1562c6f_652f7edfbfa272ea310ac022_naveen-tiwari-p-500.webp"
  },
  {
    name: "Nipun Mehra",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Ula",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/nipunmehra/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730c335e5e8e26756383_1611899709233.jpeg"
  },
  {
    name: "Nitin Gupta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Uni",
    portfolio: [],
    email: "https://x.com/nitinwhatever?lang=en",
    linkedin: "https://www.linkedin.com/in/nitinguptaprofile/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730c52da73506d943bc2_1602263156820.jpeg"
  },
  {
    name: "Nitish Mittersain",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO & MD at Nazara Technologies",
    portfolio: [],
    email: "https://x.com/mittersain",
    linkedin: "https://www.linkedin.com/in/nitish-mittersain-924192/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730d0f1cfa8a76225700_652f7edfbfa272ea310ac1fc_186.%2520Nitish%2520Mittersain.webp"
  },
  {
    name: "Omnivore",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "Food",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.omnivore.vc/",
    linkedin: "https://www.linkedin.com/company/omnivore-partners/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e2b7d2832da7a7b8bc_Logo.svg"
  },
  {
    name: "Pankaj Chaddah",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "HealthTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at Shyft",
    portfolio: [],
    email: "https://x.com/pankajchaddah",
    linkedin: "https://www.linkedin.com/in/pankaj-chaddah-0a54979/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730df0fc915a5fa6751d_1604291595562.jpeg"
  },
  {
    name: "Peak XV Partners",
    firm: "Venture Capital",
    preferredStage: [
      "All Stages"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.peakxv.com/",
    linkedin: "https://www.linkedin.com/company/peakxvpartners/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e51798b2a083313342_Peak_Logo_POS_RGB.jpeg"
  },
  {
    name: "Peyush Bansal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Digital Entertainment",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder & CEO at Lenskart",
    portfolio: [],
    email: "https://x.com/peyushbansal",
    linkedin: "https://www.linkedin.com/in/peyushbansal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730dfd20f806305b648f_1672947834159.jpeg"
  },
  {
    name: "Phanindra Sama",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Digital Entertainment",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Redbus",
    portfolio: [],
    email: "https://x.com/phanisama?lang=en",
    linkedin: "https://www.linkedin.com/in/phanisama/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730d6d328ee3ab45bd1e_1704271374104.jpeg"
  },
  {
    name: "PointOne Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://pointone.capital/",
    linkedin: "https://www.linkedin.com/company/pointonecapital/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e0c1769c9f929fa941_Web_Photo_Editor-24-e1602307503893.png"
  },
  {
    name: "Pras Hanuma",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech",
      "EdTech",
      "AI/ML",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at InfoQuest",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/pras-hanuma/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730e1b1b7e1d3c43960e_1666084868326.jpeg"
  },
  {
    name: "Prashant Tandon",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at 1mg, India",
    portfolio: [],
    email: "https://twitter.com/tandon_prashant",
    linkedin: "https://www.linkedin.com/in/prashant-tandon-2802a4/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730db7d2832da7a7dbd2_1674452671147.jpeg"
  },
  {
    name: "Prateek Kumar Bhowmick",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder & COO at ReviewAdda.Com",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/prateekbhowmick/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730d0924e7ed5a069bd4_652f7edfbfa272ea310ac21e_142.%252520Prateek%252520Kumar%252520Bhowmick-p-500.webp"
  },
  {
    name: "Priyank Shah",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "HealthTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Beardo",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/priyank-shah-18369237/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730e4d2cec9acad60988_1625548091596.jpeg"
  },
  {
    name: "Radhika Agarwal Ghai",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Kindlife",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/radhikaghai/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730e622055ae6a105479_65546c6034c9ab8371ab42a9_214.%2520Radhika%2520Agarwal%2520Ghai-p-500.webp"
  },
  {
    name: "Raghunandan G",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Zolve",
    portfolio: [],
    email: "https://twitter.com/raghugnandan",
    linkedin: "https://www.linkedin.com/in/graghunandan/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730e0a27460418b53370_1635406103029.jpeg"
  },
  {
    name: "Rahul Maroli",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "HealthTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at Elevate Now",
    portfolio: [],
    email: "https://twitter.com/rahulmaroli",
    linkedin: "https://www.linkedin.com/in/rahulmaroli/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730e225e9e95f765c78c_1679166540027.jpeg"
  },
  {
    name: "Rainmatter",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "Storytelling",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://rainmatter.com/",
    linkedin: "https://www.linkedin.com/company/rainmatterin/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272def100524b1be93fd9_logo-blue.svg"
  },
  {
    name: "Rajat Gupta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Unique Uniforms Pvt Ltd",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/rajat2628/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730e3f126f9a8d8a01bf_1713964889408.jpeg"
  },
  {
    name: "Rajesh Sawhney",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at GSF",
    portfolio: [],
    email: "https://twitter.com/rajeshsawhney",
    linkedin: "https://www.linkedin.com/in/rajeshgsf/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730f3d36e484aca9d466_652f7edfbfa272ea310ac235_119.%2520Rajesh%2520Sawhney.webp"
  },
  {
    name: "Rajesh Yabaji",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Mobility",
      "HealthTech",
      "FinTech",
      "EdTech",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder & CEO at BlackBuck",
    portfolio: [],
    email: "https://razorpay.com/rize/investors-list/blackbuck",
    linkedin: "https://www.linkedin.com/in/rajesh-yabaji-302347a/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730f55ff35d420091f7f_1542642297872.jpeg"
  },
  {
    name: "Ramakant Sharma",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "Mobility",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & COO at Livspace",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/sharmaramakant/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730fc7b425e60251a1b5_1523475325439.jpeg"
  },
  {
    name: "Ravi Bhushan",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at BrightChamps",
    portfolio: [],
    email: "https://twitter.com/ravibhu",
    linkedin: "https://www.linkedin.com/in/ravibk/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730f45897a6589e8db01_1625500718950.jpeg"
  },
  {
    name: "Ravi Gururaj",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at QikPod",
    portfolio: [],
    email: "https://x.com/ravigururaj?lang=en",
    linkedin: "https://www.linkedin.com/in/rgururaj/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730f2141809da5862449_1516263486806.jpeg"
  },
  {
    name: "Renu Satti",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "COO at PayTM",
    portfolio: [],
    email: "https://twitter.com/renusatti",
    linkedin: "https://www.linkedin.com/in/renusatti/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730f2b03ff1ecd0be4da_1662461094202.jpeg"
  },
  {
    name: "Revant Bhate",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder and CEO at Mosaic Wellness",
    portfolio: [],
    email: "https://twitter.com/RevantB",
    linkedin: "https://www.linkedin.com/in/revant/?ref=ynos.in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682730fe07e5fa520c4f998_1533302636564.jpeg"
  },
  {
    name: "Ritesh Malik",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Innov8 Coworking",
    portfolio: [],
    email: "https://twitter.com/drriteshmalik",
    linkedin: "https://www.linkedin.com/in/drriteshmalik/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827310eb89f63c8e26d67c_1680662922252.jpeg"
  },
  {
    name: "Rohit Chanana",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder & Managing partner at Sarcha Advisors",
    portfolio: [],
    email: "https://twitter.com/rohit_chanana",
    linkedin: "https://www.linkedin.com/in/rohit-chanana-1b22811a/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827310f735b936cc5d183a_1516840657052.jpeg"
  },
  {
    name: "Rohit Kapoor",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Mobility",
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO at OYO",
    portfolio: [],
    email: "https://twitter.com/rohitisb",
    linkedin: "https://www.linkedin.com/in/rohit-kapoor-99a30436/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682731088eef928703989fd_1601991290037.jpeg"
  },
  {
    name: "Rohit Kumar Bansal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "HealthTech",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder at Snapdeal",
    portfolio: [],
    email: "https://twitter.com/rohitkbansal",
    linkedin: "https://www.linkedin.com/in/rohitkbansal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827310551299b226ae1179_5A5B7042-tile.jpeg"
  },
  {
    name: "Rohit M A",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder & Managing Director at Cloudnine Group of Hospitals",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/rohitoncloud9/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273107163f6b86e7deff2_1694701682858.jpeg"
  },
  {
    name: "Rohit Raj",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Digital Entertainment"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder at The Glitch",
    portfolio: [],
    email: "https://twitter.com/mad_toothbrush",
    linkedin: "https://www.linkedin.com/in/rohitrajkaral/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273110b3fdd8c6a758de8_6554638c34c9ab8371a524aa_230.%2520Rohit%2520Raj.webp"
  },
  {
    name: "Roman Saini",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder at Unacademy",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/romansaini/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827316e7b010ab6b041454_1516561456269.jpeg"
  },
  {
    name: "Ruchi Kalra",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility",
      "HealthTech",
      "FinTech",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder at OfBusiness",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/ruchi-kalra-0a62512/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827311e07e5fa520c4f9ec_1516254416411.jpeg"
  },
  {
    name: "SOSV",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "Climate Tech"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://sosv.com/",
    linkedin: "https://www.linkedin.com/company/sosv/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e0d3e011123eda1dae_images.png"
  },
  {
    name: "Sachin Bansal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at Navi",
    portfolio: [],
    email: "https://twitter.com/_sachinbansal",
    linkedin: "https://www.linkedin.com/in/sachinbansal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827311b0c280d451569a1c_1632475772897.jpeg"
  },
  {
    name: "Sachin Bhatia",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech",
      "Digital Entertainment"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder & CEO at Bulbul",
    portfolio: [],
    email: "https://twitter.com/ahsachin",
    linkedin: "https://www.linkedin.com/in/sbhatia1/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273113b744f5e2a6d0bf2_1690796725000.jpeg"
  },
  {
    name: "Sahil Barua",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "Mobility",
      "HealthTech",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder at Delhivery",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/sahil-barua-42374b7/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273113452fbe82b8e0353_652f7edfbfa272ea310ac1fa_189.%2520Sahil%2520Barua.webp"
  },
  {
    name: "Sameer Mehta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Mobility"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at boAt",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/sameer-mehta-16233318/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273117068b2f1ae20734a_652f7edfbfa272ea310ac0bb_104.%2520Sameer%2520Mehta.jpeg"
  },
  {
    name: "Sandeep Aggarwal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Mobility",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder & CEO at ShopClues",
    portfolio: [],
    email: "https://twitter.com/SandeepAgg",
    linkedin: "https://www.linkedin.com/in/sandeepaggarwal/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682731203a40cecc5b387a4_652f7edfbfa272ea310ac1f9_190.%252520Sandeep%252520Aggarwal-p-500.webp"
  },
  {
    name: "Sandeep Nailwal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "FinTech",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder at Polygon Technology",
    portfolio: [],
    email: "https://twitter.com/sandeepnailwal",
    linkedin: "https://www.linkedin.com/in/sandeep-nailwal-60709a33/",
    imageUrl: "https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg"
  },
  {
    name: "Sanjay Mehta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "HealthTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at MAIA Intelligence",
    portfolio: [],
    email: "https://twitter.com/sandeepnailwal",
    linkedin: "https://www.linkedin.com/in/mehta-sanjay/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827314c7b425e60251aae1_1563262664331.jpeg"
  },
  {
    name: "Sauce",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://sauce.vc/",
    linkedin: "https://www.linkedin.com/company/sauce-vc/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e651383c464e2f1af1_Larger_Black_Logo_SAUCE.svg"
  },
  {
    name: "Saurabh Aggarwal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at Fitso",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/saurabh-aggarwal-86426723/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827312d3a75a19b66cbb49_1517020458743.jpeg"
  },
  {
    name: "Saurabh Garg",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder and CBO at NoBroker.com",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/saurabh-garg-8876171/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827313e07e5fa520c4fa97_1516294150128.jpeg"
  },
  {
    name: "Sayli Karanjkar",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Cofounder & CBO at PaySense, India",
    portfolio: [],
    email: "https://twitter.com/sayalikaranjkar",
    linkedin: "https://www.linkedin.com/in/sayalikaranjkar/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273135f638e35bf31c21c_1516268972855.jpeg"
  },
  {
    name: "Sequoia Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Multi Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.sequoiacap.com/",
    linkedin: "https://www.linkedin.com/company/sequoia/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272dfabc44d2d954acf62_Sequoia-Capital-logo-StartupTalky.jpeg"
  },
  {
    name: "Sharad Sharma",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at iSpirit Foundation",
    portfolio: [],
    email: "https://twitter.com/sharads",
    linkedin: "https://www.linkedin.com/in/sharadsharma/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827314003bed78e2cab014_1516167574868.jpeg"
  },
  {
    name: "Shashvat Nakrani",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Founder at BharatPe",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/shashvat-nakrani/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273146dbe6b8393b1fd9f_1596725742790.jpeg"
  },
  {
    name: "Shubham Gupta",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Together",
    portfolio: [],
    email: "https://twitter.com/shubg",
    linkedin: "https://www.linkedin.com/in/shubg87/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827314c1e09974ff0607d6_1641911903134.jpeg"
  },
  {
    name: "Sorabh Agarwal",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at AngelBay",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/sorabh-agarwal-52277a1/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827314a6747a94125bd231_652f7edfbfa272ea310ac21c_144.%2520Sorabh%2520Agarwal.webp"
  },
  {
    name: "Special Invest",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "Synthetic Biology",
      "Space",
      "SaaS",
      "Robotics",
      "EVs",
      "Developer Tools",
      "Climate Tech",
      "Cloud Infra"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.specialeinvest.com/",
    linkedin: "https://www.linkedin.com/company/specialeinvest/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e33452fbe82b8de68f_images.png"
  },
  {
    name: "Sriharsha Majety",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder & Chief Executive Officer at Swiggy",
    portfolio: [],
    email: "https://twitter.com/harshamjty?ref=ynos.in",
    linkedin: "https://www.linkedin.com/in/sriharsha-m-563aa217/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827315af9ea42e340294ce_1516770851147.jpeg"
  },
  {
    name: "Srinath Ramakkrushnan",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Mobility",
      "AgriTech"
    ],
    geography: [
      "India"
    ],
    description: "CoFounder at Zetwerk",
    portfolio: [],
    email: "https://twitter.com/harshamjty?ref=ynos.in",
    linkedin: "https://www.linkedin.com/in/srinath-ramakkrushnan-a658629/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682731579a9e0646cbecd60_1517667956351.jpeg"
  },
  {
    name: "Srinivas Anumolu",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Promoter at Spark TV, India",
    portfolio: [],
    email: "https://twitter.com/srinirai?ref=ynos.in",
    linkedin: "https://www.linkedin.com/in/srinirai/?ref=ynos.in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273151e6e38f9042083ff_65534b21e71a1201ccd3d159_243.%2520Srinivas%2520Anumolu.webp"
  },
  {
    name: "SucSEED Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Multi Stage"
    ],
    sectors: [
      "Tech Startup"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://sucseed-indovation.com/",
    linkedin: "https://www.linkedin.com/company/sucseed-ventures/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e0ba40745ded4c03d2_withoutbg.png"
  },
  {
    name: "Suhail Sameer",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "Media",
      "HealthTech",
      "FinTech",
      "Digital Entertainment"
    ],
    geography: [
      "India"
    ],
    description: "CEO at BharatPe",
    portfolio: [],
    email: "https://x.com/suhailsameer14?lang=en",
    linkedin: "https://www.linkedin.com/in/suhail-sameer-8226865/?originalSubdomain=in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/6682731547c55f3aca403f09_1616280698400.jpeg"
  },
  {
    name: "Sujeet Kumar",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "Mobility",
      "FinTech",
      "EdTech",
      "AI/ML"
    ],
    geography: [
      "India"
    ],
    description: "Founder at Udaan",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/sujeet-kumar-90039b16/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273157a3ed0f566c887c4_1516586249684.jpeg"
  },
  {
    name: "Sumit Jain",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media",
      "HealthTech",
      "FinTech",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-Founder & CEO at Graphy",
    portfolio: [],
    email: "https://twitter.com/sumjain?ref=ynos.in",
    linkedin: "https://www.linkedin.com/in/sumjain/?ref=ynos.in",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273150a27460418b53531_1718266256794.jpeg"
  },
  {
    name: "Surojit Chatterjee",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "FinTech"
    ],
    geography: [
      "India"
    ],
    description: "CEO & Founder at Stealth startup",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/surojitchatterjee/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827316003bed78e2cab0d1_1616395125935.jpeg"
  },
  {
    name: "T.V. Mohandas Pai",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "Media"
    ],
    geography: [
      "India"
    ],
    description: "Chairman at Manipal Global Education, (Former Director, Infosys)",
    portfolio: [],
    email: "https://twitter.com/TVMohandasPai?s=20&t=Utg2tELgDDm0XQHTl7S9OA",
    linkedin: "https://www.linkedin.com/in/mohandaspai/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/66827316eb89f63c8e26d8f1_1516827573731.jpeg"
  },
  {
    name: "Titan Capital",
    firm: "Venture Capital",
    preferredStage: [
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.titancapital.vc/",
    linkedin: "https://www.linkedin.com/company/titan-capital-vc/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272de59141696b3d74d30_Logo-Custom-dimensions-368x120-px-1.png"
  },
  {
    name: "Umang Kumar",
    firm: "Angel Investor",
    preferredStage: [
      "Seed",
      "Pre-seed"
    ],
    sectors: [
      "SaaS",
      "EdTech"
    ],
    geography: [
      "India"
    ],
    description: "Co-founder at Cardekho.com",
    portfolio: [],
    email: "https://drive.google.com/drive/folders/1oolub6rbpi54PvHU2C5xHpNUOpddm548?usp=drive_link",
    linkedin: "https://www.linkedin.com/in/umang-kumar-a4768b2/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668273162bfb8e5430d14480_1516278656295.jpeg"
  },
  {
    name: "Unicorn India Ventures",
    firm: "Venture Capital",
    preferredStage: [
      "Seed",
      "Early Stage"
    ],
    sectors: [
      "All Sectors"
    ],
    geography: [
      "India"
    ],
    description: "",
    portfolio: [],
    email: "https://www.unicornivc.com/",
    linkedin: "https://www.linkedin.com/company/unicornivc/",
    imageUrl: "https://cdn.prod.website-files.com/6509f53e6496821672d95223/668272e13f126f9a8d89ec0c_uiv-blue-logo.svg"
  },
]
  });

  console.log('✅ Created demo investors');

  // Create demo incubators
  await prisma.incubator.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "CIIE.CO - IIM Ahmedabad",
        logo: null,
        description: "One of India's leading startup incubators supporting early-stage innovation across sectors.",
        location: "Ahmedabad, Gujarat",
        focusAreas: ["Fintech", "Agritech", "Healthcare", "Social Impact"],
        website: "https://ciie.co/",
        applyLink: "https://ciie.co/entrepreneurs/",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "NSRCEL - IIM Bangalore",
        logo: null,
        description: "NSRCEL at IIMB supports startups from ideation to scale with dedicated sectoral programs.",
        location: "Bangalore, Karnataka",
        focusAreas: ["Women-led Startups", "Mobility", "Fintech", "Healthtech"],
        website: "https://nsrcel.org/",
        applyLink: "https://nsrcel.org/apply-now/",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "T-Hub",
        logo: null,
        description: "India's largest innovation hub, supporting tech-based startups through mentorship and funding.",
        location: "Hyderabad, Telangana",
        focusAreas: ["DeepTech", "AI/ML", "IoT", "HealthTech"],
        website: "https://t-hub.co/",
        applyLink: "https://t-hub.co/startups/",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "SINE - IIT Bombay",
        logo: null,
        description: "Society for Innovation and Entrepreneurship at IIT Bombay supporting deep tech ventures.",
        location: "Mumbai, Maharashtra",
        focusAreas: ["Robotics", "CleanTech", "AI/ML", "Engineering"],
        website: "https://www.sineiitb.org/",
        applyLink: "https://www.sineiitb.org/incubation-apply",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Forge Accelerator",
        logo: null,
        description: "Innovation accelerator from Coimbatore that works with industry-driven tech solutions.",
        location: "Coimbatore, Tamil Nadu",
        focusAreas: ["Industry 4.0", "Manufacturing", "IoT"],
        website: "https://forgeforward.in/",
        applyLink: "https://forgeforward.in/apply/",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Startup Oasis",
        logo: null,
        description: "Startup incubator in Jaipur promoting entrepreneurship in tier-2 cities.",
        location: "Jaipur, Rajasthan",
        focusAreas: ["Social Enterprises", "Tech for Good", "EdTech"],
        website: "https://startupoasis.in/",
        applyLink: "https://startupoasis.in/#contact",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "DERBI Foundation",
        logo: null,
        description: "Tech startup incubator supported by DST, focusing on early-stage deep-tech startups.",
        location: "Bangalore, Karnataka",
        focusAreas: ["DeepTech", "IoT", "MedTech"],
        website: "https://derbifoundation.com/",
        applyLink: "https://derbifoundation.com/contact-us/",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "AIC - Banasthali Vidyapith",
        logo: null,
        description: "Women-centric startup incubator supporting ventures from across India.",
        location: "Banasthali, Rajasthan",
        focusAreas: ["Women-led Startups", "Social Impact", "Sustainability"],
        website: "https://aicbanasthali.org/",
        applyLink: "https://aicbanasthali.org/#contact",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "AIC - Manipal University Jaipur (AIC-MUJ)",
        logo: null,
        description: "AIC–MUJ is an Atal Innovation Mission-backed incubator by Manipal University Jaipur. It supports early-stage startups with mentorship, co-working space, and access to labs in AR/VR, DeepTech, and healthcare.",
        location: "Jaipur, Rajasthan",
        focusAreas: ["AR/VR", "DeepTech", "Healthcare", "Sustainability", "Environmental Health"],
        website: "https://www.aicmuj.com/",
        applyLink: "https://connect.aicmuj.com/",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  });

  console.log('✅ Created demo incubators');*/

  // Seed tools
  await seedTools();
  
  // Seed news
  await seedNews();

 /* // ✅ Create merged resources (from your original resource list)
  await prisma.resource.createMany({
    skipDuplicates: true,
    data: [
      { title: "The Ultimate Entrepreneurship Kit", description: "Everything you need to become an entrepreneur, from a step-by-step business development guidebook to customizable project management templates and more.", category: "Startups", type: "Kit", url: "https://offers.hubspot.com/entrepreneurship-kit?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "" },
      { title: "Vendor List Template", description: "Organize and manage your vendors with our free Vendor List Excel & Google Sheets template. Streamline your procurement process for efficiency.", category: "Business, Startups", type: "Template", url: "https://www.hubspot.com/business-templates/vendor-list?hubs_content=www.hubspot.com/resources/startups&hubs_content-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/assets/directories/business-templates/screenshots/EN/vendor-list-screenshot-excel-1.png" },
      { title: "Startup Business Plan Template", description: "Launch your startup with confidence using our free professional Startup Business Plan Word & PDF template. Craft a solid foundation for your venture.", category: "Business, Startups", type: "Template", url: "https://www.hubspot.com/business-templates/startup-business-plan?hubs_content=www.hubspot.com/resources/startups&hubs_content-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/assets/directories/business-templates/screenshots/EN/startup-business-plan-screenshot-pdf-1.jpg" },
      { title: "Email Marketing Kit for Startups", description: "A free kit of templates, guides, and inspiration curated for startups.", category: "Email Marketing, Startups", type: "Kit", url: "https://offers.hubspot.com/email-marketing-startups-entrepreneurs?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/2018%20Email%20Marketing%20Kit%20for%20Startups%20and%20Entrepreneurs.png" },
      { title: "Risk assessment Template", description: "Want to conduct a risk assessment but aren't sure where to start? Download our free risk assessment template, which is available in various formats.", category: "Business, Startups", type: "Template", url: "https://www.hubspot.com/business-templates/risk-assessment-template?hubs_content=www.hubspot.com/resources/startups&hubs_content-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/assets/directories/business-templates/screenshots/EN/risk-assessment-template-5.png" },
      { title: "200+ Ways to Make Money with AI", description: "This guide gives you over 200 strategies tailored for creators, entrepreneurs, and forward-thinking professionals eager to thrive in the AI-driven economy.", category: "Marketing Automation, Startups", type: "Ebook", url: "https://offers.hubspot.com/make-money-with-ai?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/LP%20Hero_Mindstream_200%20Ways.png" },
      { title: "30-Day Plan Triple Your Inbound Sales $$", description: "A 30-day plan that will set you on the path to hit those aggressive sales goals.", category: "Inbound Marketing Strategy, Sales, Startups", type: "Partner Contribution", url: "https://huify.co/3MzYUXS", imageUrl: "https://www.huify.com/hs-fs/hubfs/Landing_Page_Resource_Files/Triple%20Your%20Inbound%20Sales%20Revenue%20Ebook%20%7C%20Cover%20Pages.png?width=1580&name=Triple%20Your%20Inbound%20Sales%20Revenue%20Ebook%20%7C%20Cover%20Pages.png" },
      { title: "300+ tools and resources for remote work", description: "Expert advice on working from home. And, the best links, tools and resources on remote working.", category: "Startups, Agencies", type: "Ebook", url: "https://www.articulatemarketing.com/blog/best-tools-and-resources-for-working-from-home", imageUrl: "https://www.articulatemarketing.com/hubfs/press%20release.jpeg" },
      { title: "4 Free Memo Templates", description: "Templates for an organizational change, financial update, problem-solving, or general business memorandum.", category: "Content Creation, Startups", type: "Template", url: "https://offers.hubspot.com/memo-templates?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://53.fs1.hubspotusercontent-na1.net/hubfs/53/memo-cover.png" },
      { title: "5 Trends That Will Define 2025: Solopreneur Opportunities", description: "Discover lucrative solopreneur opportunities in 2025's top emerging trends.", category: "Startups", type: "Ebook", url: "https://offers.hubspot.com/2025-solopreneur-trends?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/LP%20feature%20image%20solo.png" },
      { title: "8 Elevator Pitch Templates", description: "E-pitch templates to better sell your product, fund your business, or network.", category: "Startups", type: "Template", url: "https://offers.hubspot.com/elevator-pitch-templates?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://53.fs1.hubspotusercontent-na1.net/hubfs/53/epitch-ebook-cover.png" },
      { title: "B2B Brand Identity Toolkit", description: "Review this Toolkit for a comprehensive look at the key components of a strong B2B brand identity.", category: "Branding, Startups", type: "Partner Contribution", url: "https://www.sagefrog.com/resources/brand-identity-toolkit/", imageUrl: "https://455263.fs1.hubspotusercontent-na1.net/hubfs/455263/Brand%20Identity%20Toolkit%20Resource%20Thumbnails.jpg" },
      { title: "Company Values Glossary", description: "50 examples and terms to help you define your company's core values.", category: "Startups", type: "Ebook", url: "https://offers.hubspot.com/company-values-glossary?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://f.hubspotusercontent00.net/hub/53/hubfs/cover-photo-company-values.png" },
      { title: "Email Templates for Startups", description: "Spend less time overthinking the copy of your emails and more time focusing on what matters.", category: "Email Marketing, Startups", type: "Template", url: "https://offers.hubspot.com/startups/download-now-sales-and-marketing-email-template-for-startups?utm_campaign=GLOBAL%20%7C%20HSFS%20%7C%20Sales%20and%20Marketing%20Templates%20for%20Startups&utm_source=BDM%20Outreach&hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://cdn2.hubspot.net/hubfs/53/Marketing%20and%20Sales%20Email%20Templates.png" },
      { title: "Entrepreneurship Trends Report", description: "We talked to over 500 small business owners to uncover valuable strategies, data-driven insights, and expert tips for elevating your business.", category: "Startups", type: "Ebook", url: "https://offers.hubspot.com/the-hustle-entrepreneurship-report?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/State%20of%20Entrepreneurship.png" },
      { title: "Essentials of Employer Branding", description: "Learn how to build and implement an effective employer branding platform in a free guide from Sagefrog.", category: "Branding, Startups", type: "Partner Contribution", url: "https://info.sagefrog.com/the-essentials-of-effective-employer-branding", imageUrl: "https://455263.fs1.hubspotusercontent-na1.net/hubfs/455263/400x400_EmployerBranding.png" },
      { title: "Finding Market Opportunity", description: "Unlock hidden market potential and supercharge your business growth with our curated collection of tools, strategies, and expert insights.", category: "Startups", type: "Ebook", url: "https://offers.hubspot.com/find-market-opportunity?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/LP%20Feat%20Image%20-%20Finding%20Market%20Opportunity.png" },
      { title: "Franchise Startup Checklist", description: "Unlock the secrets of franchising success with this free checklist.", category: "Startups", type: "Template", url: "https://offers.hubspot.com/franchise-startup-checklist?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://offers.hubspot.com/hubfs/Feat%20Image%20-%20Franchise%20Checklist.png" },
      { title: "FREE BLUEPRINT: B2B Sales Pipeline", description: "Quick, simple steps to monitor and measure sales efforts using a comprehensive framework.", category: "Sales, Startups", type: "Partner Contribution", url: "https://www.6minded.com/sales-blueprint", imageUrl: "https://6minded.com/hubfs/thumb%20sales%20framework.png" },
      { title: "How to Get Your First 100 Customers", description: "Get the real tactics to make people fall in love with your business, plus a battle plan for getting your first 100 true fans.", category: "Startups", type: "Ebook", url: "https://offers.hubspot.com/mfm-first-100-customers?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/LP%20Featured%20Image%20mfm.png" },
      { title: "How to run the ideal meeting", description: "You want efficiency, collaboration, progress. Instead, you get doodling on the back of the handout.", category: "Inbound Marketing Strategy, Startups, Agencies", type: "Partner Contribution", url: "https://www.articulatemarketing.com/blog/ideal-meeting", imageUrl: "https://www.articulatemarketing.com/hubfs/How%20to%20use%20website%20data%20to%20prioritise%20improvements-01.png" },
      { title: "Manufacturing+ Marketing Bundle", description: "The bundle contains 10 ready-made templates to build businesses, improve processes, and generate revenue.", category: "Inbound Marketing Strategy, Startups", type: "Partner Contribution", url: "https://info.npws.net/manufacturing-marketing-bundle/", imageUrl: "https://www.npws.net/hubfs/New_Perspective_September_2022/images/manuf.png" },
      { title: "Marketing Maturity Matrix", description: "Use this free tool to score your business and get access to marketing insights, depending on your score.", category: "Inbound Marketing Strategy, Startups", type: "Partner Contribution", url: "https://www.articulatemarketing.com/marketing-maturity-matrix", imageUrl: "https://www.articulatemarketing.com/hubfs/Articulate%20-%20Mockup%20-%20Marketing%20maturity%20matrix%20for%20MSPS-01.png" },
      { title: "Pitch Deck Template for Startups", description: "Spend less time focusing on the little details that go into making your deck and more time pitching", category: "Startups", type: "Template", url: "https://offers.hubspot.com/startups/pitch-deck-template?hubs_signup-url=www.hubspot.com/resources/startups&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://cdn2.hubspot.net/hubfs/53/Pitch%20Deck%20Template.png" },
      { title: "Side Hustle Ideas Database", description: "Single streams of income in this economy? Dive into this curation of 100 unique ideas to unlock your next side quest.", category: "Startups", type: "Ebook", url: "https://offers.hubspot.com/side-hustle-ideas-database?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/The%20Hustle%20Side%20Hustle%20Database.webp" },
      { title: "Small Brands Making Big Waves", description: "Discover how 15 small brands with limited resources achieved marketing success.", category: "Content Creation, Startups", type: "Kit", url: "https://offers.hubspot.com/small-brands-big-waves?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/Featured%20Image%20-%20Small%20Brands%2c%20Big%20Waves.png" },
      { title: "Startup Business Plan Template", description: "Your business must have a formal business plan to be taken seriously. We can help you craft it.", category: "Business, Startups", type: "Ebook", url: "https://offers.hubspot.com/startups/startup-business-plan-template?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://cdn2.hubspot.net/hubfs/53/Startup%20Business%20Plan%20Template.png" },
      { title: "Startup Fundraising Kit", description: "A comprehensive and actionable resource that equips founders and entrepreneurs with the knowledge and strategies needed to excel at every stage of the fundraising journey.", category: "Startups", type: "Kit", url: "https://offers.hubspot.com/startup-fundraising-kit?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://offers.hubspot.com/hubfs/ebook%20cover%20-%20%20transparent%20-%20fundraising%20kit.png" },
      { title: "Startup Social Media Content Calendar", description: "With a super easy-to-use template you can plan your social media weeks or months in advance.", category: "Content Creation, Social Media, Startups", type: "Template", url: "https://offers.hubspot.com/startups/social-media-content-template-for-startups?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://cdn2.hubspot.net/hubfs/53/Social%20Media%20Content%20Calendar%20Template%20for%20Startups.png" },
      { title: "The 2022 B2B Trusted Brands Report", description: "Learn how we assessed audiences and developed insights on the most trusted B2B brands in this free report.", category: "Branding, Startups", type: "Partner Contribution", url: "https://www.sagefrog.com/resources/the-2022-b2b-trusted-brands-report/", imageUrl: "https://455263.fs1.hubspotusercontent-na1.net/hubfs/455263/TrustedBrandsInsta_%20MKT%20Green.jpg" },
      { title: "The Billion-Dollar Startup Bundle: Jess Mah's Entrepreneurial Playbook", description: "Gain exclusive access to the exact frameworks behind Jess Mah's billion-dollar portfolio.", category: "Startups", type: "Kit", url: "https://offers.hubspot.com/mfm-jess-mah-entrepreneurship?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/LP%20Featured%20image%20(3).png" },
      { title: "The Hustle's 2024 Entrepreneurship Trends Report", description: "We talked to over 500 small business owners to uncover valuable strategies, data-driven insights, and expert tips for elevating your business.", category: "Startups", type: "Ebook", url: "https://offers.hubspot.com/the-hustle-entrepreneurship-report?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/3%20(10)-2.png" },
      { title: "The Hustle's Business Startup Kit", description: "9 templates to help you brainstorm a business name, develop your business plan, and pitch your idea to investors.", category: "Business, Startups", type: "Template", url: "https://offers.hubspot.com/the-hustle-business-startup-kit?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/hustle-startup-kit.png" },
      { title: "Trendspotter's Playbook: 50+ Tips and Tools to Identify Market Trends", description: "From uncovering emerging opportunities to validating consumer demand, this comprehensive resource equips you with the tools to navigate the ever-evolving world of business trends and make informed decisions to drive growth.", category: "Startups", type: "Ebook", url: "https://offers.hubspot.com/trend-spotter?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://www.hubspot.com/hubfs/_Feat%20Image%20-%20Trend%20Spotting%20Guide%20(1).png" },
      { title: "Value Chain Analysis Template", description: "Outline your value chain analysis with this free template. Available as a presentation deck on Google Slides and as a workbook on Google Sheets.", category: "Inbound Marketing Strategy, Startups", type: "Template", url: "https://offers.hubspot.com/value-chain-analysis-template?hubs_signup-url=www.hubspot.com/resources/startups/p/2&hubs_signup-cta=csol-filterable-content-cta", imageUrl: "https://f.hubspotusercontent00.net/hub/53/hubfs/Copy%20of%20Memo%20Templates%20(3).png" },
      { title: "What is a Difference Engine", description: "The power of differentiation. A 48-step guidebook on how to stand out in your industry.", category: "Inbound Marketing Strategy, Lead Generation, Startups", type: "Ebook", url: "https://www.articulatemarketing.com/blog/what-is-a-difference-engine", imageUrl: "https://www.articulatemarketing.com/hubfs/Difference%20Engine%20(2).jpg" }
    ]
  });

  console.log('✅ Created merged resources');*/

  /*// Create demo feedback
  await prisma.startupFeedback.create({
    data: {
      comment: 'Great product! Really helps with our team workflow.',
      userId: user1.id,
      startupId: startup1.id,
    },
  });

  console.log('✅ Created demo feedback');*/

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
