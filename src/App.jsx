import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, Float, Sparkles, Stars, MeshTransmissionMaterial, useScroll } from '@react-three/drei'
import * as THREE from 'three'
import emailjs from '@emailjs/browser';
 
// --- GLASS CARD COMPONENT ---
function GlassCard({ title, issuer, type, imagePath, onOpen }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={(e) => {
        setHovered(true)
        e.currentTarget.style.transform = 'scale(1.03)'
      }}
      onMouseLeave={(e) => {
        setHovered(false)
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onClick={() => imagePath && onOpen(imagePath)}
      style={{
        width: '320px', padding: '30px', borderRadius: '24px',
        cursor: imagePath ? 'pointer' : 'default',
        transition: '0.4s ease',
        background: hovered ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: hovered ? '1px solid #00ffff' : '1px solid rgba(255, 255, 255, 0.1)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px rgba(0, 255, 255, 0.2)' : 'none',
        textAlign: 'left'
      }}>
      <p style={{ color: '#00ffff', fontSize: '0.65rem', letterSpacing: '3px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{type}</p>
      <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: '1.1rem', lineHeight: '1.4' }}>{title}</h3>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: '0 0 15px 0' }}>Issued by: {issuer}</p>
      {imagePath && <div style={{ color: '#00ffff', fontSize: '0.7rem' }}>CLICK TO VIEW ↗</div>}
    </div>
  )
}
 
// --- PROJECT CARD COMPONENT ---
function ProjectCard({ title, tech, description, type, tags = [] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={(e) => { setHovered(true); e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)' }}
      onMouseLeave={(e) => { setHovered(false); e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
      style={{
        width: '360px', padding: '32px', borderRadius: '24px',
        cursor: 'default', transition: '0.4s ease',
        background: hovered ? 'rgba(191,119,255,0.08)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: hovered ? '1px solid rgba(191,119,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: hovered ? '0 24px 48px rgba(191,119,255,0.15)' : 'none',
        textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
      <p style={{ color: '#bf77ff', fontSize: '0.6rem', letterSpacing: '3px', fontWeight: 'bold', margin: 0 }}>{type}</p>
      <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem', lineHeight: '1.35' }}>{title}</h3>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', margin: 0, lineHeight: '1.65' }}>{description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            padding: '4px 12px', borderRadius: '99px', fontSize: '0.68rem', fontWeight: '600',
            background: 'rgba(191,119,255,0.12)', border: '1px solid rgba(191,119,255,0.25)',
            color: '#d4a8ff', letterSpacing: '0.5px'
          }}>{tag}</span>
        ))}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', margin: '4px 0 0 0' }}>Tech: {tech}</p>
    </div>
  )
}
 
// --- INTERNSHIP CARD COMPONENT ---
function InternshipCard({ title, org, duration, status, color = '#00ffff' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={(e) => { setHovered(true); e.currentTarget.style.transform = 'translateY(-6px)' }}
      onMouseLeave={(e) => { setHovered(false); e.currentTarget.style.transform = 'translateY(0)' }}
      style={{
        width: '340px', padding: '30px', borderRadius: '20px', transition: '0.35s ease',
        background: hovered ? `rgba(${color === '#00ffff' ? '0,255,255' : color === '#ff77aa' ? '255,119,170' : '191,119,255'},0.08)` : 'rgba(255,255,255,0.03)',
        border: hovered ? `1px solid ${color}` : `1px solid ${color}33`,
        backdropFilter: 'blur(20px)',
        boxShadow: hovered ? `0 20px 40px ${color}22` : 'none',
        textAlign: 'left'
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <p style={{ color, fontSize: '0.6rem', letterSpacing: '3px', fontWeight: 'bold', margin: 0 }}>INTERNSHIP</p>
        <span style={{
          padding: '3px 10px', borderRadius: '99px', fontSize: '0.6rem', fontWeight: '700',
          background: status === 'Completed' ? 'rgba(0,255,136,0.15)' : 'rgba(255,200,0,0.12)',
          color: status === 'Completed' ? '#00ff88' : '#ffc800',
          border: `1px solid ${status === 'Completed' ? '#00ff8844' : '#ffc80044'}`
        }}>{status}</span>
      </div>
      <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1.05rem', lineHeight: '1.45' }}>{title}</h3>
      <p style={{ color: color, fontSize: '0.85rem', margin: '0 0 6px 0', fontWeight: '600', opacity: 0.85 }}>{org}</p>
      {duration && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: 0 }}>Duration: {duration}</p>}
    </div>
  )
}
 
function SkillBoxCard({ icon, label, labelColor, tags }) {
  return (
    <div style={{
      padding: '20px', borderRadius: '16px',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ fontSize: '1.5rem' }}>{icon}</div>
      <h4 style={{ color: labelColor, margin: '10px 0' }}>{label}</h4>
      <div>
        {tags.map(tag => (
          <span key={tag} style={{ marginRight: '8px', fontSize: '0.8rem', color: 'white' }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
 
// --- MOUSE TRACKING LOGIC ---
function MouseTracker({ children }) {
  const { mouse, viewport } = useThree()
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    ref.current.rotation.set(-y * 0.05, x * 0.05, 0)
  })
  return <group ref={ref}>{children}</group>
}
 
// --- SCROLL CONTROLLER ---
function ScrollController({ onReady }) {
  const scroll = useScroll()
  useFrame(() => {})
  React.useEffect(() => { onReady(scroll) }, [scroll])
  return null
}
 
function ProfilePill({ icon, label, href, color }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      padding: '10px 14px', borderRadius: '12px',
      background: 'rgba(255,255,255,0.05)', color: color,
      textDecoration: 'none', textAlign: 'center',
      fontSize: '0.8rem', transition: '0.3s'
    }}>
      {icon} {label}
    </a>
  )
}
 
// --- ENHANCED INTERACTIVE NAV LINK ---
function NavLink({ children, onClick, active }) {
  const [hovered, setHovered] = useState(false)
  const isHighlighted = hovered || active
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        cursor: 'pointer', fontSize: '0.82rem', letterSpacing: '3px', fontWeight: '700',
        transition: 'all 0.35s ease',
        color: isHighlighted ? '#ffffff' : '#cc99ee',
        textShadow: isHighlighted ? '0 0 18px #ff77aa, 0 0 40px #bf77ff, 0 0 80px rgba(191,119,255,0.4)' : 'none',
        display: 'inline-block',
        transform: isHighlighted ? 'scale(1.12) translateY(-1px)' : 'scale(1)',
        padding: '6px 4px', position: 'relative',
        outline: isHighlighted ? '1px solid rgba(191,119,255,0.5)' : '1px solid transparent',
        outlineOffset: '6px', borderRadius: '4px',
      }}>
      {children}
      <span style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: isHighlighted ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
        width: '100%', height: '1.5px',
        background: 'linear-gradient(90deg, transparent, #ff77aa, #bf77ff, transparent)',
        transition: 'transform 0.35s ease', borderRadius: '2px'
      }} />
    </span>
  )
}
 
// --- BIOLUMINESCENT MANTA RAY ---
function MantaRay({ position, color = "#00ffff" }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 3
    ref.current.position.x = position[0] + Math.cos(t * 0.3) * 2
    ref.current.rotation.z = Math.sin(t * 1) * 0.2
  })
  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[2, 0.1, 3]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.2} emissive={color} emissiveIntensity={2} />
      </mesh>
      <pointLight intensity={2} color={color} distance={10} />
    </group>
  )
}
 
// --- GLASSY RADIANT DIAMOND ---
function RadiantDiamond() {
  const outer = useRef(); const inner = useRef(); const glow = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    outer.current.rotation.y = t * 0.4
    inner.current.rotation.y = -t * 0.6
    glow.current.rotation.y = t * 0.2
  })
  return (
    <group scale={1.2}>
      <mesh ref={outer}><octahedronGeometry args={[4, 0]} /><MeshTransmissionMaterial backside samples={8} thickness={0.5} chromaticAberration={0.3} anisotropy={0.1} distortion={0.2} color="#ffffff" transmission={1} ior={1.5} /></mesh>
      <mesh ref={inner} scale={0.65}><octahedronGeometry args={[4, 0]} /><MeshTransmissionMaterial backside samples={6} thickness={0.3} chromaticAberration={0.5} color="#ffccee" transmission={0.95} ior={1.8} /></mesh>
      <mesh ref={glow} scale={1.02}><octahedronGeometry args={[4, 0]} /><meshStandardMaterial color="#ff77aa" emissive="#ff77aa" emissiveIntensity={0.8} wireframe transparent opacity={0.25} /></mesh>
      <pointLight intensity={15} color="#ff77aa" distance={25} />
    </group>
  )
}
 
// --- FREE-FLOATING JELLYFISH ---
function PearlJellyfish({ position, color, speed = 0.6, phase = 0 }) {
  const group = useRef(); const pearl = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.position.x = position[0] + Math.sin(t * speed * 0.4 + phase) * 8
    group.current.position.y = position[1] + Math.cos(t * speed * 0.7 + phase) * 5
    const s = 1 + Math.sin(t * 2 + phase) * 0.3
    if (pearl.current) pearl.current.scale.set(s, s, s)
  })
  return (
    <group ref={group}>
      <Float speed={2} floatIntensity={1}>
        <mesh><sphereGeometry args={[0.75, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} /><meshStandardMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} /></mesh>
        <mesh ref={pearl}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={18} /><pointLight intensity={5} color={color} distance={8} /></mesh>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[Math.sin((i / 8) * Math.PI * 2) * 0.38, -0.9, Math.cos((i / 8) * Math.PI * 2) * 0.38]}><cylinderGeometry args={[0.003, 0.001, 2.0]} /><meshStandardMaterial color={color} transparent opacity={0.3} /></mesh>
        ))}
      </Float>
    </group>
  )
}
 
// --- MOVING BACKGROUND ---
function MovingBackground() {
  const starsRef = useRef()
  useFrame(() => {
    starsRef.current.rotation.y += 0.0005
    starsRef.current.rotation.z += 0.0002
  })
  return (
    <>
      <Stars ref={starsRef} radius={120} depth={60} count={3000} factor={7} />
      <Sparkles count={200} scale={[35, 25, 25]} />
    </>
  )
}
 
// --- SKILL GROUP CARD ---
function SkillGroup({ title, color, items }) {
  return (
    <div style={{
      padding: '28px 32px', borderRadius: '20px', minWidth: '240px', maxWidth: '300px', flex: '1 1 240px',
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}44`,
      backdropFilter: 'blur(20px)', textAlign: 'left'
    }}>
      <p style={{ color: color, fontSize: '0.65rem', letterSpacing: '3px', fontWeight: 'bold', margin: '0 0 16px 0', textTransform: 'uppercase' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
 
// --- ACHIEVEMENT ITEM ---
function AchievementItem({ text }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '22px 32px', borderRadius: '16px', transition: '0.3s ease',
        border: hovered ? '1px solid #ffd700' : '1px solid rgba(255,215,0,0.3)',
        background: hovered ? 'rgba(255,215,0,0.08)' : 'rgba(255,215,0,0.02)',
        color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '16px',
        transform: hovered ? 'translateX(8px)' : 'translateX(0)',
        maxWidth: '600px', width: '100%'
      }}>
      <span style={{ color: '#ffd700', fontSize: '1.4rem', flexShrink: 0 }}>★</span>
      <span style={{ lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}
 
// --- HOME SECTION BUTTON ---
function HomeSectionBtn({ num, label, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: hovered ? 'rgba(191,119,255,0.12)' : 'rgba(255,255,255,0.03)',
        border: hovered ? '1px solid #bf77ff' : '1px solid rgba(255,255,255,0.12)',
        borderRadius: '14px', padding: '14px 20px', cursor: 'pointer',
        transition: 'all 0.3s ease', textAlign: 'left',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(191,119,255,0.18)' : 'none',
        outline: 'none'
      }}>
      <div style={{ color: '#bf77ff', fontSize: '0.58rem', letterSpacing: '2px', marginBottom: '5px', fontWeight: 'bold' }}>{num}</div>
      <div style={{ color: hovered ? '#ffffff' : 'rgba(255,255,255,0.75)', fontSize: '0.78rem', letterSpacing: '1px', fontWeight: '500' }}>{label}</div>
    </button>
  )
}
 
// --- SIDE PROGRESS DOTS ---
function SideProgressDots({ activeSection, navItems, onNav }) {
  return (
    <div style={{
      position: 'fixed', right: '28px', top: '50%', transform: 'translateY(-50%)',
      zIndex: 200, display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center',
    }}>
      {navItems.map(({ label, page }) => {
        const isActive = activeSection === page
        return (
          <div key={label} onClick={() => onNav(page)} title={label}
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'row-reverse' }}>
            <span style={{
              position: 'absolute', right: '22px',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: '0.62rem', letterSpacing: '2px', whiteSpace: 'nowrap',
              transition: 'all 0.3s', textTransform: 'uppercase',
              fontWeight: isActive ? '700' : '400',
              textShadow: isActive ? '0 0 12px #bf77ff' : 'none',
              pointerEvents: 'none', opacity: isActive ? 1 : 0,
            }}>{label}</span>
            <div style={{
              width: isActive ? '12px' : '7px', height: isActive ? '12px' : '7px',
              borderRadius: '50%',
              background: isActive ? '#bf77ff' : 'rgba(255,255,255,0.25)',
              border: isActive ? '2px solid rgba(191,119,255,0.6)' : '1.5px solid rgba(255,255,255,0.2)',
              boxShadow: isActive ? '0 0 12px #bf77ff, 0 0 24px rgba(191,119,255,0.5)' : 'none',
              transition: 'all 0.4s ease',
            }} />
          </div>
        )
      })}
    </div>
  )
}
 
// --- CERTIFICATE MODAL ---
function CertModal({ src, onClose }) {
  const [visible, setVisible] = useState(false)
 
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', handleKey) }
  }, [onClose])
 
  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 280)
  }
 
  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        background: `rgba(0,0,0,${visible ? 0.92 : 0})`,
        backdropFilter: `blur(${visible ? 14 : 0}px)`,
        transition: 'background 0.28s ease, backdrop-filter 0.28s ease',
        cursor: 'zoom-out',
      }}>
      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: 'fixed', top: '20px', right: '24px',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', width: '44px', height: '44px', borderRadius: '50%',
          fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', transition: 'all 0.2s', zIndex: 1001,
          lineHeight: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
      >×</button>
 
      {/* Image container */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(20px)',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
          cursor: 'default',
        }}>
        <img
          src={src}
          alt="Certificate"
          style={{
            maxHeight: '88vh', maxWidth: '88vw',
            objectFit: 'contain', borderRadius: '14px',
            boxShadow: '0 0 60px rgba(0,255,255,0.25), 0 40px 80px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'block',
          }}
        />
        {/* Download button */}
        <a
          href={src}
          download
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: '-52px', left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 28px', borderRadius: '99px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem',
            fontWeight: '600', cursor: 'pointer', letterSpacing: '1px',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
          Download Certificate
        </a>
      </div>
    </div>
  )
}
 
// --- MAIN APP ---
export default function App() {
  const [selectedCert, setSelectedCert] = useState(null)
  const [activeSection, setActiveSection] = useState(0)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [formSent, setFormSent] = useState(false)
  const scrollRef = useRef(null)
 
  const handleSend = (e) => {
    e.preventDefault()
    emailjs.send(
      'service_dk5n62j', 'template_8l15ldm',
      { from_name: contactForm.name, from_email: contactForm.email, message: contactForm.message },
      'oaVNdX9Rnp2ZwgBAE'
    ).then(() => {
      setFormSent(true)
      setContactForm({ name: '', email: '', message: '' })
      setTimeout(() => setFormSent(false), 3000)
    }).catch(() => alert("❌ Failed to send message"))
  }
 
  const TOTAL_PAGES = 18
 
  const sectionIds = ['home','about','skills','projects','internships','certs','workshops','hackathons','achievements','contact']
 
  const goToPage = (page) => {
    const id = sectionIds[page]
    if (!id) return
    if (scrollRef.current) {
      const el = scrollRef.current.el
      const target = el.querySelector('#section-' + id)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setActiveSection(page)
        return
      }
    }
    const target = document.getElementById('section-' + id)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(page)
  }
 
  useEffect(() => {
    const timer = setInterval(() => {
      if (!scrollRef.current) return
      const el = scrollRef.current.el
      const containerRect = el.getBoundingClientRect()
      let best = 0, bestOverlap = -1
      sectionIds.forEach((id, idx) => {
        const sec = el.querySelector('#section-' + id)
        if (!sec) return
        const r = sec.getBoundingClientRect()
        const top = Math.max(r.top, containerRect.top)
        const bot = Math.min(r.bottom, containerRect.bottom)
        const overlap = bot - top
        if (overlap > bestOverlap) { bestOverlap = overlap; best = idx }
      })
      setActiveSection(best)
    }, 200)
    return () => clearInterval(timer)
  }, [])
 
  const navItems = [
    { label: 'Home',         page: 0 },
    { label: 'About',        page: 1 },
    { label: 'Skills',       page: 2 },
    { label: 'Projects',     page: 3 },
    { label: 'Internships',  page: 4 },
    { label: 'Certs',        page: 5 },
    { label: 'Workshops',    page: 6 },
    { label: 'Hackathons',   page: 7 },
    { label: 'Achievements', page: 8 },
    { label: 'Contact',      page: 9 },
  ]
 
  const Section = ({ id, title, color = "white", children, tall = false, extraTall = false }) => (
    <section id={id} style={{
      minHeight: extraTall ? '180vh' : tall ? '130vh' : '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '120px 5% 80px 5%', boxSizing: 'border-box',
    }}>
      <h2 style={{ color, fontSize: '3.5rem', marginBottom: '60px', letterSpacing: '8px', textTransform: 'uppercase', textAlign: 'center', flexShrink: 0 }}>{title}</h2>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  )
 
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }}>
 
      {/* ===== NAV ===== */}
      <nav style={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', gap: '6px', padding: '0 10px',
        background: 'rgba(4, 2, 18, 0.55)', backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)', borderRadius: '999px',
        border: '1px solid rgba(191,119,255,0.45)',
        boxShadow: `0 0 0 1px rgba(255,119,170,0.18), 0 0 0 3px rgba(191,119,255,0.10), 0 0 24px rgba(191,119,255,0.25), 0 0 60px rgba(191,119,255,0.10), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)`,
        width: 'fit-content',
      }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '999px', background: 'linear-gradient(135deg, rgba(191,119,255,0.06) 0%, transparent 50%, rgba(0,255,255,0.04) 100%)', pointerEvents: 'none' }} />
        {navItems.map(({ label, page }, i) => (
          <React.Fragment key={label}>
            <div style={{ padding: '14px 10px' }}>
              <NavLink onClick={() => goToPage(page)} active={activeSection === page}>{label}</NavLink>
            </div>
            {i < navItems.length - 1 && (
              <div style={{ width: '1px', height: '14px', background: 'linear-gradient(to bottom, transparent, rgba(191,119,255,0.3), transparent)', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </nav>
 
      <SideProgressDots activeSection={activeSection} navItems={navItems} onNav={goToPage} />
 
      <Canvas camera={{ position: [0, 0, 18], fov: 50 }}>
        <color attach="background" args={['#000000']} />
        <MovingBackground />
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#bf77ff" />
        <pointLight position={[-10, -10, 5]} intensity={2} color="#00ffff" />
 
        <ScrollControls pages={TOTAL_PAGES} damping={0.2}>
          <ScrollController onReady={(s) => { scrollRef.current = s }} />
          <Scroll>
            <MouseTracker>
              <RadiantDiamond />
              <PearlJellyfish position={[-8, 5, -2]} color="#bf77ff" />
              <PearlJellyfish position={[9, -1, -4]} color="#ff77aa" />
              <PearlJellyfish position={[-5, -7, -3]} color="#00ffff" />
              <MantaRay position={[-12, 0, -8]} color="#00ffff" />
            </MouseTracker>
          </Scroll>
 
          <Scroll html style={{ width: '100%' }}>
 
            {/* ========== 0. HOME ========== */}
            <section id="section-home" style={{
              height: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: 'white', textAlign: 'center', padding: '0 5%', pointerEvents: 'auto',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', letterSpacing: '3px', marginBottom: '16px', fontFamily: '"Courier New", monospace' }}>Hi, my name is</p>
              <h1 style={{
                fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: '900', margin: '0 0 20px 0', lineHeight: 1.05,
                background: 'linear-gradient(135deg, #ffffff 30%, #ffb3d9 65%, #bf77ff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '-1px',
              }}>VINOTHINI D</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: '500' }}>
                Computer Science Student&nbsp;&nbsp;|&nbsp;&nbsp;Curious Learner
              </p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.88rem', marginBottom: '44px', maxWidth: '520px', lineHeight: 1.7 }}>
                Building real-world software with Python, Java &amp; modern web technologies.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '38px' }}>
                <button onClick={() => { const el = document.getElementById('section-projects'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                  style={{ padding: '13px 28px', borderRadius: '999px', border: 'none', background: 'rgba(255,255,255,0.92)', color: '#0a0414', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.target.style.background = '#ffffff'}
                  onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.92)'}
                >View Projects</button>
                <a href="#" download style={{ padding: '13px 28px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.3s', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
                  Download Resume
                </a>
                <button onClick={() => { const el = document.getElementById('section-contact'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                  style={{ padding: '13px 28px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Contact Me
                </button>
              </div>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                <a href="https://www.linkedin.com/in/vinothini-d-0a2934373" target="_blank" rel="noopener noreferrer"
                  style={{ width: '46px', height: '46px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,102,194,0.3)'; e.currentTarget.style.borderColor = '#0a66c2'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="https://github.com/vinothinitechie-cpu" target="_blank" rel="noopener noreferrer"
                  style={{ width: '46px', height: '46px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(110,84,148,0.3)'; e.currentTarget.style.borderColor = '#6e5494'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                </a>
              </div>
            </section>
 
            {/* ========== 1. ABOUT ========== */}
            <Section id="section-about" title="About Me">
              <div style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '40px' }}>
                <div style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: '2px solid rgba(191,119,255,0.4)', boxShadow: '0 0 25px rgba(191,119,255,0.25)' }} />
                <img src="/VinothiniProfile.jpg" alt="VINOTHINI D" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #000', filter: 'grayscale(0.1) brightness(1.05)' }} />
              </div>
              <div style={{ maxWidth: '800px', textAlign: 'center' }}>
                <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '20px', fontFamily: 'Georgia, serif' }}>A Passionate Developer & Tech Enthusiast</h3>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>
                  I am a Computer Science Engineering student currently pursuing my degree at <strong>Sri Manakula Vinayagar Engineering College</strong>. My journey in tech is driven by a curiosity to solve real-world problems through code. I specialize in <strong>Java Full Stack Development</strong> and have a keen interest in <strong>Generative AI</strong> and <strong>Cloud Computing</strong>. I thrive in collaborative environments like hackathons and am constantly looking for ways to bridge the gap between complex data and user-friendly software.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ padding: '12px 24px', borderRadius: '99px', background: 'rgba(191,119,255,0.1)', border: '1px solid rgba(191,119,255,0.3)', color: '#bf77ff', fontSize: '0.85rem', fontWeight: '600' }}>🎓 B.Tech CSE & BS (2024-2028)</div>
                  <div style={{ padding: '12px 24px', borderRadius: '99px', background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.3)', color: '#00ffff', fontSize: '0.85rem', fontWeight: '600' }}>📍 Puducherry, India</div>
                  <div style={{ padding: '12px 24px', borderRadius: '99px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(53,121,135,0.85)', color: 'rgba(242,147,198,0.8)', fontSize: '0.85rem', fontWeight: '600' }}>💻 Software Engineer In Progress</div>
                </div>
              </div>
            </Section>
 
            {/* ========== 2. SKILLS ========== */}
            <section id="section-skills" style={{
              minHeight: '170vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-start',
              padding: '120px 5% 100px', boxSizing: 'border-box', background: 'transparent',
            }}>
              <h2 style={{ color: '#80cfd4', fontSize: '3.5rem', marginBottom: '64px', letterSpacing: '8px', textTransform: 'uppercase', textAlign: 'center' }}>Skills</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', maxWidth: '1160px', marginBottom: '60px' }}>
                <SkillBoxCard icon="🖥️" label="Languages" labelColor="#8ecae6" tags={['C', 'C++', 'Java', 'Python']} />
                <SkillBoxCard icon="🌐" label="Frontend" labelColor="#b8c0ff" tags={['HTML', 'CSS', 'React.js']} />
                <SkillBoxCard icon="⚙️" label="Tools & Platforms" labelColor="#ffd6a5" tags={['GitHub', 'VS Code', 'AWS', 'Android']} />
                <SkillBoxCard icon="🧠" label="CS Fundamentals" labelColor="#cdb4db" tags={['DSA', 'OOP', 'SDLC', 'Algorithms']} />
                <SkillBoxCard icon="🤖" label="AI & Cloud" labelColor="#a8dadc" tags={['AI/ML', 'Data Engineering', 'Cloud']} />
                <SkillBoxCard icon="🔍" label="Competitive Coding" labelColor="#f1c0e8" tags={['LeetCode', 'HackerRank', 'CodeChef', 'SkillRack']} />
              </div>
              <div style={{ width: '100%', maxWidth: '1160px' }}>
                <p style={{ color: '#00ffc8', fontSize: '0.65rem', letterSpacing: '5px', fontWeight: '800', fontFamily: '"Courier New", monospace', marginBottom: '20px' }}>// CODING PROFILES</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '18px' }}>
                  <ProfilePill icon="⚡"  label="LeetCode"   href="https://leetcode.com/u/Vinothini_dk/"                                                                   color="#f89f1b" />
                  <ProfilePill icon="🏆"  label="HackerRank" href="https://www.hackerrank.com/profile/vinothinidk81"                                                       color="#2ec866" />
                  <ProfilePill icon="👩‍🍳" label="CodeChef"   href="https://www.codechef.com/users/vinothini_dk"                                                            color="#c97d3a" />
                  <ProfilePill icon="🎯"  label="SkillRack"  href="http://www.skillrack.com/profile/523863/74ca754f4a7dc3e78c0fa4337a6cf0991c8c06de"                    color="#ff4e6a" />
                  <ProfilePill icon="🐙"  label="GitHub"     href="https://github.com/vinothinitechie-cpu"                                                                 color="#bf77ff" />
                  <ProfilePill icon="💼"  label="LinkedIn"   href="https://www.linkedin.com/in/vinothini-d-0a2934373"                                                      color="#00ffc8" />
                </div>
              </div>
            </section>
 
            {/* ========== 3. PROJECTS ========== */}
            <section id="section-projects" style={{
              minHeight: '110vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '60px', letterSpacing: '8px', textTransform: 'uppercase', textAlign: 'center' }}>Projects</h2>
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', alignItems: 'flex-start' }}>
                <ProjectCard
                  type="WEB DEVELOPMENT"
                  title="Personal Portfolio Website"
                  description="An immersive 3D portfolio built with React and Three.js, featuring interactive WebGL animations, scroll-driven storytelling, bioluminescent jellyfish, and a glassmorphism UI."
                  tech="React, Three.js, @react-three/fiber, @react-three/drei"
                  tags={['React', 'Three.js', 'WebGL', 'R3F']}
                />
                <ProjectCard
                  type="FULL STACK APPLICATION"
                  title="Student Management System"
                  description="A full-featured CRUD application for managing student records, attendance, grades, and reports. Features a clean dashboard with role-based access and database integration."
                  tech="Java / Python + MySQL / SQLite"
                  tags={['Java', 'Python', 'MySQL', 'CRUD', 'OOP']}
                />
              </div>
            </section>
 
            {/* ========== 4. INTERNSHIPS ========== */}
            <section id="section-internships" style={{
              minHeight: '130vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <h2 style={{ color: '#ff77aa', fontSize: '3.5rem', marginBottom: '60px', letterSpacing: '8px', textTransform: 'uppercase', textAlign: 'center' }}>Internships</h2>
              <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', alignItems: 'flex-start' }}>
                <InternshipCard
                  title="AI-ML Virtual Internship - cohort 13"
                  org="EduSkills / AICTE"
                  duration="Virtual Internship"
                  imagePath="/JavaFullStackDeveloper.npng"
                  status="Completed"
                  color="#ff77aa"
                />
                <InternshipCard
                  title="AWS Data Engineering Virtual Internship – Cohort 14"
                  org="AWS Academy / EduSkills / AICTE"
                  duration="10 Weeks"
                  status="Completed"
                  color="#ff9900"
                />
                <InternshipCard
                  title="Java Full Stack Developer – Cohort 15"
                  org="Wipro / NASSCOM / EduSkills"
                  duration="Virtual Internship"
                  status="Completed"

                  color="#bf77ff"
                />
              
              </div>
            </section>
 
            {/* ========== 5. CERTIFICATIONS ========== */}
            <section id="section-certs" style={{
              minHeight: '220vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-start',
              padding: '120px 5% 100px', boxSizing: 'border-box',
            }}>
              <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '20px', letterSpacing: '8px', textTransform: 'uppercase', textAlign: 'center' }}>Certifications</h2>
 
              {/* Category: AI & Machine Learning */}
              <div style={{ width: '100%', maxWidth: '1160px', marginBottom: '48px' }}>
                <p style={{ color: '#00ffff', fontSize: '0.6rem', letterSpacing: '4px', fontWeight: '800', fontFamily: '"Courier New", monospace', marginBottom: '20px', marginTop: '40px' }}>// AI & MACHINE LEARNING</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <GlassCard title="Generative AI Professional Certificate" issuer="LinkedIn Learning"      type="CERTIFICATION" imagePath="/gen-ai-linkedin.png"       onOpen={setSelectedCert} />
                  <GlassCard title="GenAI Powered Data Analytics"           issuer="TCS (Forage)"          type="CERTIFICATION" imagePath="/tcs-genai-analytics.png"   onOpen={setSelectedCert} />
                  <GlassCard title="Gen AI: Beyond the Chatbot"             issuer="Google Cloud (Coursera)" type="CERTIFICATION" imagePath="/google-genai-coursera.png" onOpen={setSelectedCert} />
                  <GlassCard title="Machine Learning Foundations"           issuer="LearnTube.ai"           type="CERTIFICATION" imagePath="/ml-learntube.png"          onOpen={setSelectedCert} />
                  <GlassCard title="Generative AI Certification"            issuer="LearnTube.ai"           type="CERTIFICATION" imagePath="/genai-learntube.png"       onOpen={setSelectedCert} />
                  <GlassCard title="Generative AI Mastermind"               issuer="Outskill"               type="CERTIFICATION" imagePath="/genai-outskill.png"        onOpen={setSelectedCert} />
                </div>
              </div>
 
              {/* Category: Cloud & AWS */}
              <div style={{ width: '100%', maxWidth: '1160px', marginBottom: '48px' }}>
                <p style={{ color: '#ff9900', fontSize: '0.6rem', letterSpacing: '4px', fontWeight: '800', fontFamily: '"Courier New", monospace', marginBottom: '20px' }}>// CLOUD & AWS</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <GlassCard title="AWS Academy Graduate"              issuer="Amazon Web Services"   type="CERTIFICATION" imagePath="/aws_badge.jpg"            onOpen={setSelectedCert} />
                  <GlassCard title="AWS Solutions Architecture"        issuer="AWS (Forage)"          type="CERTIFICATION" imagePath="/aws-solutions-arch.jpg"   onOpen={setSelectedCert} />
                  <GlassCard title="AWS Machine Learning Foundations"  issuer="AWS Academy"           type="CERTIFICATION" imagePath="/aws-ml-foundations.jpg"   onOpen={setSelectedCert} />
                  <GlassCard title="Azure AI Fundamentals"             issuer="Microsoft Azure"       type="CERTIFICATION" imagePath="/azure-ai.jpg"             onOpen={setSelectedCert} />
                </div>
              </div>
 
              {/* Category: Full Stack & Programming */}
              <div style={{ width: '100%', maxWidth: '1160px', marginBottom: '48px' }}>
                <p style={{ color: '#bf77ff', fontSize: '0.6rem', letterSpacing: '4px', fontWeight: '800', fontFamily: '"Courier New", monospace', marginBottom: '20px' }}>// FULL STACK & PROGRAMMING</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <GlassCard title="Java Full Stack Developer"            issuer="Wipro / NASSCOM"          type="CERTIFICATION" imagePath="/JavaFullStackDeveloper.jpg" onOpen={setSelectedCert} />
                  <GlassCard title="React JS Certification"               issuer="CareerNinja Digital"       type="CERTIFICATION" imagePath="/react-careerninja.jpg"     onOpen={setSelectedCert} />
                  <GlassCard title="Java & Object-Oriented Programming"   issuer="Saylor University"         type="CERTIFICATION" imagePath="/java-saylor.jpg"           onOpen={setSelectedCert} />
                  <GlassCard title="Infosys Java Certification"           issuer="Infosys"                   type="CERTIFICATION" imagePath="/infosys-java.jpg"          onOpen={setSelectedCert} />
                  <GlassCard title="Infosys Python Certification"         issuer="Infosys"                   type="CERTIFICATION" imagePath="/infosys-python.jpg"        onOpen={setSelectedCert} />
                  <GlassCard title="C++ Programming"                      issuer="LearnTube.ai"              type="CERTIFICATION" imagePath="/cpp-learntube.jpg"         onOpen={setSelectedCert} />
                </div>
              </div>
 
              {/* Category: Design & Security */}
              <div style={{ width: '100%', maxWidth: '1160px', marginBottom: '48px' }}>
                <p style={{ color: '#ff77aa', fontSize: '0.6rem', letterSpacing: '4px', fontWeight: '800', fontFamily: '"Courier New", monospace', marginBottom: '20px' }}>// DESIGN & SECURITY</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <GlassCard title="UI/UX Fundamentals"             issuer="LearnTube + Media.net"  type="CERTIFICATION" imagePath="/uiux-learntube.jpg"        onOpen={setSelectedCert} />
                  <GlassCard title="Cybersecurity Analyst Simulation" issuer="TCS (Forage)"         type="CERTIFICATION" imagePath="/tcs-cybersecurity.jpg"     onOpen={setSelectedCert} />
                </div>
              </div>
            </section>
 
            {/* ========== 6. WORKSHOPS & TRAINING ========== */}
            <section id="section-workshops" style={{
              minHeight: '140vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <h2 style={{ color: '#bf77ff', fontSize: '3.5rem', marginBottom: '60px', letterSpacing: '8px', textTransform: 'uppercase', textAlign: 'center' }}>Workshops</h2>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', maxWidth: '1200px', alignItems: 'flex-start' }}>
                <GlassCard title="Google Cloud: Build AI Apps with Gemini & Firebase" issuer="Google Cloud"            type="WORKSHOP" imagePath="/googlecloud.png"  onOpen={setSelectedCert} />
                <GlassCard title="Gen AI Workshop"                                     issuer="Technical Community"    type="WORKSHOP"  onOpen={setSelectedCert} />
                <GlassCard title="AI Unplugged Workshop"                               issuer="Community Event"        type="WORKSHOP"  onOpen={setSelectedCert} />
                <GlassCard title="Tech Camp"                                           issuer="EduSkills"              type="TRAINING"  onOpen={setSelectedCert} />
                <GlassCard title="Yatri Cloud Event"                                   issuer="Cloud Community"        type="EVENT"     onOpen={setSelectedCert} />

              </div>
            </section>
 
            {/* ========== 7. HACKATHONS & EVENTS ========== */}
            <section id="section-hackathons" style={{
              minHeight: '120vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '60px', letterSpacing: '8px', textTransform: 'uppercase', textAlign: 'center' }}>Hackathons</h2>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', alignItems: 'flex-start' }}>
                <GlassCard title="Global AI Hackathon 2026"     issuer="Aspire Institute"              type="PARTICIPANT"  onOpen={setSelectedCert} />
                <GlassCard title="HackIndia 2026"               issuer="Mailam Engineering College"    type="PARTICIPANT"  onOpen={setSelectedCert} />
                <GlassCard title="AI Hackathon – Youthfest"     issuer="SVCE & T / Pondicherry"        type="PARTICIPANT"  onOpen={setSelectedCert} />
              </div>
            </section>
 
            {/* ========== 8. ACHIEVEMENTS ========== */}
            <Section id="section-achievements" title="Achievements" color="#ffd700" tall={true}>
              <AchievementItem text="Completed 15+ professional technical certifications across AI, Cloud, Full Stack and Cybersecurity domains" />
              <AchievementItem text="Participated in Global AI Hackathon 2026 (Aspire Institute) and HackIndia 2026 (Mailam Engineering College)" />
              <AchievementItem text="Completed 4 virtual internships: Google AI-ML, AWS Data Engineering, Java Full Stack, and AI-ML via EduSkills/AICTE" />
              <AchievementItem text="Active competitive coder on LeetCode, HackerRank, CodeChef, and SkillRack" />
              <AchievementItem text="Continuous learner with expertise in Generative AI, AWS Cloud, and Java Full Stack Development" />
            </Section>
 
            {/* ========== 9. CONTACT ========== */}
            <section id="section-contact" style={{
              minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '60px 5%', pointerEvents: 'auto', boxSizing: 'border-box',
            }}>
              <div style={{
                width: '100%', maxWidth: '860px',
                background: 'linear-gradient(160deg, rgba(8,4,24,0.96) 0%, rgba(4,8,28,0.98) 60%, rgba(2,12,28,0.96) 100%)',
                borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)',
                padding: '60px 56px 52px', backdropFilter: 'blur(60px)',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
              }}>
                <div style={{ position: 'absolute', bottom: '-100px', right: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,30,100,0.55) 0%, transparent 65%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,10,80,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <span style={{ position: 'absolute', top: 22, left: 26, fontSize: '1.15rem', opacity: 0.55 }}>💡</span>
                <span style={{ position: 'absolute', top: 18, right: 26, fontSize: '1.2rem', opacity: 0.65, color: '#c8a96e' }}>✦</span>
                <span style={{ position: 'absolute', bottom: 22, left: 26, fontSize: '1rem', opacity: 0.5 }}>🚀</span>
                <span style={{ position: 'absolute', bottom: 20, right: 26, fontSize: '1rem', opacity: 0.5, color: '#c8a96e' }}>★</span>
 
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '22px', textAlign: 'center', fontWeight: '600', fontFamily: '"Courier New", monospace' }}>GET IN TOUCH</p>
                <h2 style={{ fontSize: 'clamp(2.6rem, 6.5vw, 4.4rem)', fontWeight: '900', color: 'white', lineHeight: 1.1, textAlign: 'center', marginBottom: '16px', fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '-1.5px' }}>
                  Let's build something<br />with data.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '40px', letterSpacing: '0.3px', fontStyle: 'italic' }}>
                  Open to full-time roles, freelance projects &amp; collaborations.
                </p>
 
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', letterSpacing: '3px', display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700', fontFamily: '"Courier New", monospace' }}>Name</label>
                    <input value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
                      style={{ width: '100%', padding: '15px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.93rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.25s, background 0.25s' }}
                      onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.18)' }}
                      onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.07)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', letterSpacing: '3px', display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700', fontFamily: '"Courier New", monospace' }}>Email</label>
                    <input value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" type="email"
                      style={{ width: '100%', padding: '15px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.93rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.25s, background 0.25s' }}
                      onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.18)' }}
                      onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.07)' }} />
                  </div>
                </div>
 
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', letterSpacing: '3px', display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700', fontFamily: '"Courier New", monospace' }}>Message</label>
                  <textarea value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell me about your project or opportunity..." rows={5}
                    style={{ width: '100%', padding: '16px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.93rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.65, transition: 'border-color 0.25s, background 0.25s' }}
                    onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.18)' }}
                    onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.07)' }} />
                </div>
 
                <button
                  onClick={handleSend}
                  style={{
                    width: '100%', padding: '18px', borderRadius: '10px', border: 'none',
                    background: formSent ? '#1acc8f' : '#ffffff',
                    color: formSent ? '#fff' : '#0a0414',
                    fontSize: '0.98rem', fontWeight: '700', cursor: 'pointer',
                    letterSpacing: '0.5px', transition: 'all 0.35s ease',
                    fontFamily: 'inherit', marginBottom: '20px',
                    boxShadow: formSent ? '0 0 24px rgba(26,204,143,0.5)' : 'none',
                  }}
                  onMouseEnter={e => { if (!formSent) e.currentTarget.style.background = '#e8e8e8' }}
                  onMouseLeave={e => { if (!formSent) e.currentTarget.style.background = '#ffffff' }}
                >
                  {formSent ? '✓ Message Sent!' : 'Send Message →'}
                </button>
 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <a href="https://www.linkedin.com/in/vinothini-d-0a2934373" target="_blank" rel="noopener noreferrer"
                    style={{ padding: '13px 36px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.5px', fontFamily: 'inherit', transition: 'all 0.3s ease', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                  >LinkedIn ↗</a>
                </div>
              </div>
            </section>
 
          </Scroll>
        </ScrollControls>
      </Canvas>
 
      {/* ===== CERTIFICATE MODAL ===== */}
      {selectedCert && (
        <CertModal src={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
 
    </div>
  )
}