import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './App.css';
import LiquidEther from './components/LiquidEther.jsx';
import CardSwap, { Card } from './components/CardSwap.jsx';

function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url;
    axios.get(apiUrl)
      .then(res => mounted && setData(res.data))
      .catch(err => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, [url]);
  return { data, loading, error };
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.error('Render error', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <section className="section">
          <h2>Something went wrong</h2>
          <p>Please refresh the page. If the issue persists, try again later.</p>
        </section>
      );
    }
    return this.props.children;
  }
}

function Navbar({ profile, ghProfile }) {
  const items = [
    { href: '/about', label: 'About' },
    { href: '/highlights', label: 'Highlights' },
    { href: '/projects', label: 'Projects' },
    { href: '/experience', label: 'Experience' },
    { href: '/education', label: 'Education' },
    { href: '/achievements', label: 'Achievements' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <nav className="nav">
      <div className="logo">AP</div>
      <ul>
        {items.map((i) => (
          <li key={i.href}><Link to={i.href}>{i.label}</Link></li>
        ))}
      </ul>
      <div style={{ display:'flex', gap:12 }}>
        {ghProfile?.html_url && <a className="btn btn-ghost" href={ghProfile.html_url} target="_blank" rel="noreferrer">GitHub</a>}
      </div>
    </nav>
  );
}

function Hero({ ghProfile, profile }) {
  return (
    <section id="home" className="hero">
      <div className="grid-bg" aria-hidden="true" />
      {(() => {
        const avatar = profile?.avatar;
        const isAbsolute = avatar && /^(https?:)?\/\//.test(avatar);
        const resolved = avatar
          ? (isAbsolute ? avatar : (avatar.startsWith('/') ? avatar : `${import.meta.env.VITE_API_URL || ''}${avatar}`))
          : null;
        return resolved ? (
          <a href="/"><img src={resolved} alt="Profile" className="avatar avatar-lg" /></a>
        ) : (
        <div className="avatar avatar-placeholder">{(profile?.name || 'AP').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}</div>
        );
      })()}
      <motion.h1 className="headline" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 70 }}>
        {(profile?.name || 'Arnav Puggal').toUpperCase()}
      </motion.h1>
      <motion.p className="subtitle" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 }}>
        {profile?.title || 'Full‑Stack Developer'}
      </motion.p>
      <div className="hero-links">
        {ghProfile?.html_url && <a className="btn" href={ghProfile.html_url} target="_blank" rel="noreferrer">GitHub</a>}
        {profile?.linkedin && <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
        <a className="btn btn-ghost" href="/ArnavPuggal_resume.pdf" target="_blank" rel="noreferrer">Resume</a>
      </div>
      {/* Backdrop removed to disable continuous line/dot animation */}
    </section>
  );
}

function AnimatedBackdrop() {
  const dots = new Array(24).fill(0);
  return (
    <div className="backdrop">
      {dots.map((_, i) => (
        <motion.span key={i} className="dot" animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.05 }} />
      ))}
    </div>
  );
}

function Projects({ local, repos, profile }) {
  const customProjects = profile?.projects || [];
  return (
    <section id="projects" className="section">
      <h2>Projects</h2>
      <div className="grid">
        {customProjects.map((p, idx) => (
          <motion.div 
            key={idx} 
            className="card" 
            whileHover={{ 
              y: -12, 
              scale: 1.05, 
              rotate: -0.5,
              transition: { duration: 0.3 }
            }}
            style={{ 
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            <div className="card-title">{p.name}</div>
            <div className="card-type">{p.description}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {p.technologies.map((tech, i) => (
                <span key={i} style={{ 
                  background: 'rgba(107, 156, 255, 0.1)', 
                  color: '#6b9cff', 
                  padding: '2px 6px', 
                  borderRadius: 4, 
                  fontSize: '12px' 
                }}>
                  {tech}
                </span>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.3, delay: 0.1 }
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                padding: '20px 16px 16px',
                color: 'white',
                fontSize: '14px',
                lineHeight: '1.4'
              }}
            >
              <p style={{ margin: 0, fontSize: '13px' }}>
                {p.description}
              </p>
            </motion.div>
          </motion.div>
        ))}
        {Array.isArray(repos) && repos.map((r) => (
          <motion.a 
            key={r.id} 
            className="card" 
            whileHover={{ 
              y: -12, 
              scale: 1.05, 
              rotate: 0.5,
              transition: { duration: 0.3 }
            }}
            href={r.html_url} 
            target="_blank" 
            rel="noreferrer"
            style={{ 
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <div className="card-title">{r.name}</div>
            <div className="card-type">★ {r.stargazers_count ?? 0} • {r.language || 'Code'}</div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.3, delay: 0.1 }
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                padding: '20px 16px 16px',
                color: 'white',
                fontSize: '14px',
                lineHeight: '1.4'
              }}
            >
              <p style={{ margin: 0, fontSize: '13px' }}>
                {r.description || 'GitHub repository - Click to view on GitHub'}
              </p>
            </motion.div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Highlights() {
  const highlights = [
    {
      name: 'HORTICULTURE DAY 2024',
      photos: ['/highlights/horticulture_day_2024/image1.jpg','/highlights/horticulture_day_2024/image2.jpg','/highlights/horticulture_day_2024/image3.jpg'],
      description: 'Participated in the annual horticulture day celebration, showcasing sustainable practices and environmental awareness initiatives.'
    },
    {
      name: 'AARUUSH \'24 AT SRMIST',
      photos: ['/highlights/aaruush_24/image1.jpg','/highlights/aaruush_24/image2.jpg','/highlights/aaruush_24/image3.jpg','/highlights/aaruush_24/image4.jpg','/highlights/aaruush_24/image5.jpg','/highlights/aaruush_24/image6.jpg'],
      description: 'Attended the national level techno-management fest of SRMIST KTR College, engaging with cutting-edge technology and innovation.'
    },
    {
      name: 'FOUNDATHON 2.0 (Ideathon)',
      photos: ['/highlights/foundathon_2_0/image1.jpg','/highlights/foundathon_2_0/image2.jpg','/highlights/foundathon_2_0/image3.jpg'],
      description: 'Business-focused ideathon featuring startup pitches and product strategy sessions.'
    },
    {
      name: 'ROBOCON Trainee Rounds',
      photos: ['/highlights/robocon_trainee_rounds/image1.jpg','/highlights/robocon_trainee_rounds/image2.jpg','/highlights/robocon_trainee_rounds/image3.jpg'],
      description: 'Robotics Club training program with hands-on mechanical design and robot control basics.'
    },
    {
      name: 'AWS QLI DEVELOPERS WORKSHOP',
      photos: ['/highlights/aws_workshop/image1.jpg','/highlights/aws_workshop/image2.jpg','/highlights/aws_workshop/image3.jpg'],
      description: 'Completed AWS QLI Developers Workshop, gaining hands-on experience with cloud computing and serverless architectures.'
    },
    {
      name: 'AARUUSH25',
      photos: ['/highlights/aaruush_25/image1.jpg','/highlights/aaruush_25/image2.jpg','/highlights/aaruush_25/image3.jpg','/highlights/aaruush_25/image4.jpg','/highlights/aaruush_25/image5.jpg','/highlights/aaruush_25/image6.jpg','/highlights/aaruush_25/image7.jpg','/highlights/aaruush_25/image8.jpg','/highlights/aaruush_25/image9.jpg'],
      description: 'Participated in AARUUSH25, the premier techno-management fest, exploring latest trends in technology and management.'
    },
    {
      name: 'HACKERRANK CAMPUS CREW INAUGURAL AT SRMIST',
      photos: ['/highlights/hackerrank_inaugural/image1.jpg','/highlights/hackerrank_inaugural/image2.jpg','/highlights/hackerrank_inaugural/image3.jpg'],
      description: 'Attended the inaugural event of the first-ever HackerRank Campus Crew student chapter in India at SRMIST.'
    }
  ];
  const [zoomSrc, setZoomSrc] = React.useState(null);
  return (
    <section id="highlights" className="section">
      <h2>Highlights</h2>
      <div style={{ height: '400px', position: 'relative', width:'100%', maxWidth:900 }}>
        <CardSwap cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={false}>
          <Card><div style={{width:'100%',height:'100%',display:'grid',placeItems:'center'}}>🌟 AARUUSH</div></Card>
          <Card><div style={{width:'100%',height:'100%',display:'grid',placeItems:'center'}}>🎓 SRMIST</div></Card>
          <Card><div style={{width:'100%',height:'100%',display:'grid',placeItems:'center'}}>🤖 Robotics</div></Card>
        </CardSwap>
      </div>
      <div style={{ display:'grid', gap: 18, width:'100%', maxWidth: 900, padding: '0 16px' }}>
        {highlights.map((e, idx) => (
          <div key={idx} className="card">
            <div className="card-title">{e.name}</div>
            <div className="grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
              {e.photos.map((p,i)=> (
                <img 
                  key={i} 
                  src={p} 
                  alt={e.name+" photo"} 
                  onClick={()=> setZoomSrc(p)}
                  style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8, cursor:'zoom-in', transition:'transform .2s ease' }} 
                />
              ))}
            </div>
            <p style={{ margin: 0 }}>{e.description}</p>
          </div>
        ))}
      </div>
      {zoomSrc && (
        <div onClick={()=> setZoomSrc(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'grid', placeItems:'center', zIndex:9999, cursor:'zoom-out' }}>
          <img src={zoomSrc} alt="zoom" style={{ maxWidth:'92vw', maxHeight:'92vh', borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,0.6)' }} />
        </div>
      )}
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>About</motion.h2>
      <motion.div 
        style={{ maxWidth: 900, textAlign: 'left', padding: '0 16px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.p 
          whileHover={{ scale: 1.02, x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ margin: '0 0 8px 0' }}
        >Hi! Name's Arnav Puggal. I have always been intrigued by the sight of technology. So, to follow my dreams 'legally' I have inspired to be a master in the field of quantum mechanics for as long as I can remember. Now, I am on my path to chase my ambition and achieve what I had always aimed for.</motion.p>
        <motion.p 
          whileHover={{ scale: 1.02, x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ margin: '0 0 8px 0' }}
        >I believe in making the best use of my knowledge physical and mental strength to promote the best use of tech world around me. Looking out for a fixed aim aids me to become a good basketball player by the day. Indeed that came out from practising the sport with full passion.</motion.p>
        <motion.p 
          whileHover={{ scale: 1.02, x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ margin: '0 0 8px 0' }}
        >When I was introduced to the field of coding and mechanics I was as bad as the rabbit in the race of tortoise. I am an ardent believer of returning to the society. So, I try to partake all of my skills as much as possible, by participating in various activities and improving my IQ and trying to be the best in as many fields as possible.</motion.p>
        <motion.p 
          whileHover={{ scale: 1.02, x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ margin: '0 0 8px 0' }}
        >I am Arnav Puggal, Co Founder at HRCC SRMIST and a BTech Computer Science Engineering student with a specialization in Software Engineering at SRM Institute of Science and Technology. I am passionate about building technology that creates real impact and continuously explore the intersections of full stack software development, frontend and backend engineering, API integration, cybersecurity, mechatronic systems, and artificial intelligence and machine learning.</motion.p>
        <motion.p 
          whileHover={{ scale: 1.02, x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ margin: '0 0 8px 0' }}
        >As a developer I enjoy designing scalable architectures, writing clean and efficient code, and ensuring that applications are secure and reliable. I am equally comfortable building intuitive user experiences on the frontend and optimizing logic and data flow on the backend. My interest in cybersecurity drives me to understand system vulnerabilities and implement solutions that protect against evolving threats, while my curiosity for AI and ML pushes me to experiment with models that can solve practical problems in innovative ways.</motion.p>
        <motion.p 
          whileHover={{ scale: 1.02, x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ margin: '0' }}
        >Outside of academics I am an active basketball player, where I have cultivated teamwork, resilience, and strategic thinking. These qualities naturally extend into my professional work, helping me collaborate effectively, lead when required, and stay focused on continuous improvement. My mission is to contribute to building next generation systems that support social progress and industrial innovation, while developing my skills alongside teams that value curiosity, growth, and a vision for the future.</motion.p>
      </motion.div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Contact</motion.h2>
      <motion.ul 
        style={{ textAlign:'left', maxWidth: 520, margin: '0 auto', padding: '0 16px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.li whileHover={{ scale: 1.05, x: 10 }} transition={{ type: "spring", stiffness: 300 }} style={{ marginBottom: '8px' }}>Email: <a href="mailto:arnavpuggal21@gmail.com">arnavpuggal21@gmail.com</a></motion.li>
        <motion.li whileHover={{ scale: 1.05, x: 10 }} transition={{ type: "spring", stiffness: 300 }} style={{ marginBottom: '8px' }}>Email: <a href="mailto:arnavpuggal21@yahoo.com">arnavpuggal21@yahoo.com</a></motion.li>
        <motion.li whileHover={{ scale: 1.05, x: 10 }} transition={{ type: "spring", stiffness: 300 }} style={{ marginBottom: '8px' }}>Email: <a href="mailto:ap9271@srmist.du.in">ap9271@srmist.du.in</a></motion.li>
        <motion.li whileHover={{ scale: 1.05, x: 10 }} transition={{ type: "spring", stiffness: 300 }} style={{ marginBottom: '8px' }}>Email: <a href="mailto:techgamers17082006@smail.com">techgamers17082006@smail.com</a></motion.li>
        <motion.li whileHover={{ scale: 1.05, x: 10 }} transition={{ type: "spring", stiffness: 300 }} style={{ marginBottom: '8px' }}>Phone: <a href="tel:+919910948788">+91 99109 48788</a></motion.li>
        <motion.li whileHover={{ scale: 1.05, x: 10 }} transition={{ type: "spring", stiffness: 300 }} style={{ marginBottom: '8px' }}>GitHub: <a href="https://github.com/12asascoder" target="_blank" rel="noreferrer">12asascoder</a></motion.li>
        <motion.li whileHover={{ scale: 1.05, x: 10 }} transition={{ type: "spring", stiffness: 300 }} style={{ marginBottom: '8px' }}>LinkedIn: <a href="https://www.linkedin.com/in/arnav-puggal/" target="_blank" rel="noreferrer">/in/arnav-puggal</a></motion.li>
        <motion.li whileHover={{ scale: 1.05, x: 10 }} transition={{ type: "spring", stiffness: 300 }} style={{ marginBottom: '0' }}>Instagram: <a href="https://instagram.com/arnav_puggal" target="_blank" rel="noreferrer">@arnav_puggal</a></motion.li>
      </motion.ul>
    </section>
  );
}

function Skills() {
  const { data: profile, loading, error } = useApi('/api/profile');
  const langs = (profile?.skills || []).slice(0, 12);
  const certifications = profile?.certifications || [];
  return (
    <section id="skills" className="section">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Skills</motion.h2>
      {loading && <p>Loading…</p>}
      {error && <p>Failed to load.</p>}
      {!loading && !error && (
        <motion.div 
          style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 900, padding: '0 16px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div>
            <motion.h3 
              style={{ fontSize: '20px', margin: '0 0 12px 0' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >Technical Skills</motion.h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {langs.map((item, index) => (
                <motion.span 
                  key={item} 
                  style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: 999 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  // FIX: Remove duplicate transition prop
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
          {certifications.length > 0 && (
            <div>
              <motion.h3 
                style={{ fontSize: '20px', margin: '0 0 12px 0' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >Licenses & Certifications</motion.h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {certifications.map((item, index) => (
                  <motion.span 
                    key={item} 
                    style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: 999 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    // FIX: Remove duplicate transition prop
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
function Experience() {
  const { data: profile, loading, error } = useApi('/api/profile');
  const items = profile?.experience || [];
  return (
    <section id="experience" className="section">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Experience</motion.h2>
      {loading && <p>Loading experience…</p>}
      {error && <p>Could not load experience.</p>}
      <div className="timeline">
        {items.map((x, i) => (
          <motion.div 
            key={i} 
            className="tl-card" 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="tl-head">
              <div className="tl-role">{x.role}</div>
              <div className="tl-meta">{x.company} • {x.period}</div>
            </div>
            <ul>
              {(x.highlights||[]).map((h, j) => (
                <motion.li 
                  key={j}
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >{h}</motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Education() {
  const { data: profile, loading, error } = useApi('/api/profile');
  const items = profile?.education || [];
  return (
    <section id="education" className="section">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Education</motion.h2>
      {loading && <p>Loading education…</p>}
      {error && <p>Could not load education.</p>}
      <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 900, padding: '0 16px' }}>
        {items.map((x, i) => (
          <motion.div 
            key={i} 
            className="card" 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="card-title">{x.degree}</div>
            <div className="card-type">{x.school} • {x.period}</div>
            {x.details?.length && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '8px', 
                marginTop: '12px' 
              }}>
                {x.details.map((d, j) => (
                  <motion.div 
                    key={j}
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      background: 'rgba(107, 156, 255, 0.1)',
                      color: '#6b9cff',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      border: '1px solid rgba(107, 156, 255, 0.2)'
                    }}
                  >
                    {d}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Achievements() {
  const { data: profile, loading, error } = useApi('/api/profile');
  const achievements = profile?.achievements || [];
  return (
    <section id="achievements" className="section">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Achievements</motion.h2>
      {loading && <p>Loading achievements…</p>}
      {error && <p>Could not load achievements.</p>}
      <div className="timeline">
        {achievements.map((achievement, i) => (
          <motion.div 
            key={i} 
            className="tl-card" 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="tl-head">
              <div className="tl-role">🏆 Achievement</div>
            </div>
            <motion.p 
              style={{ margin: 0 }}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >{achievement}</motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function App({ section }) {
  const { data: profile } = useApi('/api/profile');
  const { data: ghProfile } = useApi('/api/github/profile');
  const { data: repos } = useApi('/api/github/repos');
  const { data: local } = useApi('/api/local-projects');
  return (
    <ErrorBoundary>
    <div className="app">
        <LiquidEther />
        <Navbar profile={profile} ghProfile={ghProfile} />
        {!section && <Hero ghProfile={ghProfile} profile={profile} />}
        {section === 'about' && <About />}
        {section === 'highlights' && <Highlights />}
        {section === 'projects' && <Projects local={local} repos={repos} profile={profile} />}
        {section === 'experience' && <Experience />}
        {section === 'education' && <Education />}
        {section === 'achievements' && <Achievements />}
        {section === 'contact' && <Contact />}
    </div>
    </ErrorBoundary>
  );
}
