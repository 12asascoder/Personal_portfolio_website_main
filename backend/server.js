require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const fg = require('fast-glob');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5055;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || '';
const WORKSPACE_DIR = process.env.WORKSPACE_DIR || process.cwd();
const GITHUB_BASE = 'https://api.github.com';
const DATA_DIR = path.join(__dirname, 'data');

function safeStatSync(filePath) {
  try { return fs.statSync(filePath); } catch { return null; }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/github/profile', async (_req, res) => {
  try {
    const file = path.join(DATA_DIR, 'github_profile.json');
    if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not imported' });
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/github/repos', async (_req, res) => {
  try {
    const file = path.join(DATA_DIR, 'github_repos.json');
    if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not imported' });
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Aggregate top languages across public repositories
app.get('/api/github/top-languages', async (_req, res) => {
  try {
    const file = path.join(DATA_DIR, 'github_repos.json');
    if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not imported' });
    const repos = JSON.parse(fs.readFileSync(file, 'utf8'));

    const languageTotals = {};
    for (const repo of repos) {
      if (!repo.language) continue;
      languageTotals[repo.language] = (languageTotals[repo.language] || 0) + 1;
    }

    const sorted = Object.entries(languageTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([language, count]) => ({ language, count }));
    res.json({ username: GITHUB_USERNAME, languages: sorted });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function filterInterestingProject(dir) {
  const wantedFiles = ['package.json','pom.xml','requirements.txt','Dockerfile','README.md'];
  return wantedFiles.some(f => fs.existsSync(path.join(dir, f)));
}

function inferProjectMeta(dir) {
  const meta = { name: path.basename(dir), path: dir, type: 'unknown', readme: false };
  if (fs.existsSync(path.join(dir,'package.json'))) meta.type = 'node';
  if (fs.existsSync(path.join(dir,'pom.xml'))) meta.type = meta.type==='unknown' ? 'java-maven' : meta.type+"|java-maven";
  if (fs.existsSync(path.join(dir,'requirements.txt'))) meta.type = meta.type==='unknown' ? 'python' : meta.type+"|python";
  if (fs.existsSync(path.join(dir,'Dockerfile'))) meta.docker = true;
  if (fs.existsSync(path.join(dir,'README.md'))) meta.readme = true;
  return meta;
}

app.get('/api/local-projects', async (_req, res) => {
  try {
    const ignorePatterns = ['**/node_modules/**','**/.git/**','**/target/**','**/dist/**','**/build/**','**/.next/**','**/.cache/**'];
    const pattern = `${WORKSPACE_DIR}/*`;
    const dirs = (await fg(pattern, { onlyDirectories: true, ignore: ignorePatterns }))
      .filter(p => safeStatSync(p)?.isDirectory());

    const projects = dirs
      .filter(filterInterestingProject)
      .map(inferProjectMeta);

    res.json({ root: WORKSPACE_DIR, count: projects.length, projects });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/profile', async (_req, res) => {
  try {
    const profile = {
      name: 'Arnav Puggal',
      title: 'Full‑Stack Developer',
      avatar: process.env.AVATAR_URL || '',
      linkedin: process.env.LINKEDIN_URL,
      cv: process.env.CV_URL,
      summary: 'Full‑stack engineer focused on crafting reliable backends and animated, accessible interfaces. I enjoy shipping end‑to‑end: APIs, data, and polished UX.',
      skills: [
        'JavaScript','TypeScript','React','Node.js','Express','CSS','Sass','Framer Motion','Git','REST APIs','MongoDB','PostgreSQL','Docker','CI/CD'
      ],
      experience: [
        {
          role: 'Co-Founder and Vice President',
          company: 'HackerRank Campus Crew SRMIST',
          period: 'Sep 2025 - Present',
          highlights: [
            'Co-founded the first-ever HackerRank Campus Crew student chapter in India at SRMIST',
            'Leading startup initiatives and software design projects',
            'Managing campus-wide programming competitions and workshops'
          ]
        },
        {
          role: 'Committee Member',
          company: 'Aaruush, SRM University',
          period: 'Jun 2025 - Present',
          highlights: [
            'Managing social media and digital media communications',
            'Handling media relations and production for university events',
            'Coordinating with various departments for event management'
          ]
        },
        {
          role: 'Student Volunteer',
          company: 'Aaruush, SRM University',
          period: 'Sep 2024 - Jun 2025',
          highlights: [
            'Served as PR team member for university techno-management fest',
            'Assisted in event coordination and student engagement activities',
            'Contributed to successful execution of national-level competitions'
          ]
        },
        {
          role: 'Student Volunteer',
          company: 'SRM Alumni Affairs',
          period: 'Feb 2025 - Present',
          highlights: [
            'Facilitating connections between current students and alumni',
            'Organizing networking events and mentorship programs',
            'Supporting alumni engagement initiatives'
          ]
        },
        {
          role: 'Python Developer',
          company: 'Sololearn',
          period: 'Dec 2024',
          highlights: [
            'Engaged in comprehensive training on Python fundamentals, including variables, data types, and control flow',
            'Developed problem-solving skills through coding challenges and exercises',
            'Explored data structures and algorithms with hands-on experience',
            'Utilized libraries like NumPy and Pandas for data analysis and visualization'
          ]
        },
        {
          role: 'C Developer',
          company: 'Sololearn',
          period: 'Nov 2024 - Dec 2024',
          highlights: [
            'Developed efficient and optimized C code for various software applications, enhancing performance by 30%',
            'Collaborated with cross-functional teams to troubleshoot and resolve technical issues',
            'Conducted rigorous testing and documentation, ensuring high-quality code deployment'
          ]
        },
        {
          role: 'Basic Civil and Mechanical Engineer',
          company: 'SRMIST, Kattankulathur, Chennai',
          period: 'Aug 2024 - Dec 2024',
          highlights: [
            'Developed comprehensive plans and specifications for infrastructure projects',
            'Conducted feasibility studies and site assessments for project viability',
            'Designed mechanical systems and components using CAD software',
            'Implemented sustainable practices in design and construction'
          ]
        },
        {
          role: 'Software Developer',
          company: 'TEACHNOOK (TEACHSCAPE ONLINE LEARNING SERVICES)',
          period: 'Sep 2024 - Nov 2024',
          highlights: [
            'Developed web applications and services using modern technologies',
            'Worked on responsive web design and user experience optimization',
            'Implemented web analytics and content management systems',
            'Collaborated on software infrastructure and design projects'
          ]
        },
        {
          role: 'Software Developer',
          company: 'Wipro',
          period: 'Sep 2024 - Nov 2024',
          highlights: [
            'Developed front-end applications using HTML, CSS, and JavaScript',
            'Worked on web engineering and responsive design projects',
            'Implemented web analytics and content writing solutions',
            'Contributed to web application development and optimization'
          ]
        },
        {
          role: 'Graphic Designer',
          company: 'BGS International Public School',
          period: 'Aug 2023 - Aug 2024',
          highlights: [
            'Developed graphics for company functions and events',
            'Collaborated with stakeholders to understand event vision and objectives',
            'Created design concepts aligned with company branding and themes',
            'Utilized AutoCAD, Final Cut Pro, and other design tools'
          ]
        },
        {
          role: 'Informatics Specialist',
          company: 'BGS International Public School',
          period: 'Aug 2023 - Aug 2024',
          highlights: [
            'Leveraged data analysis to understand audience preferences',
            'Applied UX design principles to enhance engagement',
            'Collaborated with cross-functional teams for branding strategies',
            'Utilized Tableau, SQL, and Python for data management'
          ]
        },
        {
          role: 'Vice Informatics Coordinator',
          company: 'BGS International Public School',
          period: 'Aug 2022 - Aug 2023',
          highlights: [
            'Developed engaging graphics for company functions',
            'Collaborated with marketing and event planning teams',
            'Applied user experience design principles for impactful graphics',
            'Drove informed design decisions through data analysis'
          ]
        },
        {
          role: 'Junior Software Developer, Robotics Engineer',
          company: 'Ethnotech Academic Solutions',
          period: 'Jul 2018 - Aug 2023',
          highlights: [
            'Developed software to monitor and optimize renewable energy systems',
            'Created algorithms to analyze energy production and consumption data',
            'Worked on UAV drone modeling and flight management systems',
            'Developed user interfaces for monitoring energy usage and efficiency'
          ]
        }
      ],
      education: [
        { 
          school: 'SRMIST, Kattankulathur, Chennai, Tamil Nadu', 
          degree: 'Bachelor of Technology - BTech, Computer Software Engineering', 
          period: 'Aug 2024 - Aug 2028', 
          details: ['Software Coding', 'Industrial Robotics', 'Data Structures & Algorithms', 'Databases', 'Operating Systems', 'Networks'] 
        },
        { 
          school: 'BGS International Public School - India', 
          degree: 'High School Diploma', 
          period: '2010 - 2024', 
          details: [
            'Grade: Montessori/UKG to 10th', 
            'Grade: 12th', 
            'Activities and societies: Basketball, cricket player and robotician',
            'Computer Science Club - Programming competitions and coding workshops',
            'Mathematics Olympiad Team - Problem-solving and analytical thinking',
            'Science Fair Coordinator - Organized annual science exhibitions',
            'Debate Society - Public speaking and logical reasoning',
            'Student Council Member - Leadership and organizational skills',
            'Robotics Club - Building and programming autonomous robots',
            'Quiz Team Captain - General knowledge and quick thinking',
            'Library Assistant - Research and information management',
            'Peer Tutoring Program - Teaching mathematics and science to juniors',
            'Environmental Club - Sustainability and project management',
            'Cultural Committee - Event planning and coordination',
            'Sports Committee - Team management and event organization',
            'Tech Support Team - Computer maintenance and troubleshooting'
          ] 
        }
      ],
      certifications: [
        'HackerRank Certifications',
        'AWS QLI Developers Workshop',
        'Python Certification (Sololearn)',
        'C Certification (Sololearn)',
        'SRM Basic Civil and Mechanical Award 2024-2025',
        'TEACHNOOK Certification of Internship Completion 2024-25',
        'WIPRO Certification of Internship Completion 2024-25',
        'BGS Graphics Designer Award 2023-2024',
        'BGS Informatics Coordinator Award 2023-24'
      ],
      projects: [
        {
          name: 'SRM VR Campus Connect',
          description: 'Virtual Reality platform for campus navigation and student engagement',
          technologies: ['Unity', 'C#', 'VR Development', '3D Modeling']
        },
        {
          name: 'Automated Turing Machine',
          description: 'Implementation of computational theory concepts with automated processing',
          technologies: ['Python', 'Algorithm Design', 'Computational Theory']
        },
        {
          name: 'B-Breaker AI Chatbot',
          description: 'Intelligent chatbot system with natural language processing capabilities',
          technologies: ['Python', 'NLP', 'Machine Learning', 'AI']
        },
        {
          name: 'Health Companion LLM',
          description: 'Large Language Model for healthcare assistance and medical guidance',
          technologies: ['Python', 'LLM', 'Healthcare AI', 'Natural Language Processing']
        },
        {
          name: 'Automated Target Locking System',
          description: 'Computer vision system for automated target detection and tracking',
          technologies: ['Python', 'Computer Vision', 'OpenCV', 'Machine Learning']
        },
        {
          name: 'UAV Swarm System',
          description: 'Coordinated drone swarm management and control system',
          technologies: ['Python', 'Drone Technology', 'Swarm Intelligence', 'Control Systems']
        },
        {
          name: 'Moody Foody App',
          description: 'Mobile application for mood-based food recommendations',
          technologies: ['React Native', 'Node.js', 'MongoDB', 'AI/ML']
        },
        {
          name: 'AI Song Writer and Composer',
          description: 'Artificial intelligence system for automated music composition',
          technologies: ['Python', 'AI/ML', 'Music Theory', 'Audio Processing']
        },
        {
          name: 'AI Agent Builder',
          description: 'Platform for creating and deploying intelligent AI agents',
          technologies: ['Python', 'AI/ML', 'Agent Systems', 'API Development']
        },
        {
          name: 'AI SaaS',
          description: 'Software as a Service platform with AI-powered features',
          technologies: ['React', 'Node.js', 'Cloud Computing', 'AI/ML']
        },
        {
          name: 'Phoenix Protocol',
          description: 'Advanced communication protocol for secure data transmission',
          technologies: ['C++', 'Network Programming', 'Security', 'Protocol Design']
        }
      ],
      achievements: [
        'Won 2nd place in Zonal level science activities and expos organised by directorate of education Delhi',
        'Won 2nd place in Central level science expo organised by directorate of education Delhi',
        'Won 3rd place in robo soccer tournament by Mount Carmel School New Delhi',
        'Was entitled Junior Robotics engineer and junior game developer as a part of BGS CREATIVE AND DESIGN LABS PROJECT',
        'Was appreciated for outstanding performance in graphics and was entitled as the informatics coordinator',
        'Won 3rd position in Unleash Hack India: Renewable energy and water access for rural development at SSRMIST',
        'Won first position in reuse and remodel product at SRMIST',
        'Was presented certificate of merit in Techknow 2024-2025'
      ]
    };
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Server error', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 for unknown API routes (must be after all route handlers)
app.use('/api', (req, res) => {
  return res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio backend running on http://0.0.0.0:${PORT}`);
});


