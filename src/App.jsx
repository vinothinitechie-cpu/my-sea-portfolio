// ============================================================
// ENHANCED PORTFOLIO — App.jsx
// RULE: All original content is 100% preserved.
// Only UI, animations, layout, and interactions are upgraded.
// ============================================================

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, Float, Sparkles, Stars, MeshTransmissionMaterial, useScroll } from '@react-three/drei'
import * as THREE from 'three'

// ─── [ENHANCEMENT] GLOBAL STYLES ─────────────────────────────────────────────
// Injected once at mount — adds Google Font, custom cursor, scroll-snap helpers,
// and the scroll-reveal animation classes.
const GlobalStyles = () => {
  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = `
      /* ── Google Fonts ── */
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

      * { box-sizing: border-box; }
      body { cursor: none !important; }
      a, button, [role=button], [onClick] { cursor: none !important; }

      /* ── Custom Cursor ── */
      #cursor-dot {
        position: fixed; top: 0; left: 0; z-index: 99999;
        width: 8px; height: 8px; border-radius: 50%;
        background: #ffffff; pointer-events: none;
        transform: translate(-50%, -50%);
        transition: opacity .2s, transform .15s;
        mix-blend-mode: difference;
      }
      #cursor-ring {
        position: fixed; top: 0; left: 0; z-index: 99998;
        width: 36px; height: 36px; border-radius: 50%;
        border: 1.5px solid rgba(191,119,255,0.7); pointer-events: none;
        transform: translate(-50%, -50%);
        transition: width .25s, height .25s, border-color .25s, transform .08s linear;
        mix-blend-mode: exclusion;
      }
      #cursor-ring.hovered {
        width: 54px; height: 54px;
        border-color: rgba(255,119,170,0.9);
      }
      #cursor-ring.clicking {
        transform: translate(-50%, -50%) scale(0.8);
        border-color: #fff;
      }

      /* ── Back to Top Button ── */
      #back-to-top {
        position: fixed; bottom: 32px; right: 72px; z-index: 500;
        width: 46px; height: 46px; border-radius: 50%;
        background: rgba(191,119,255,0.12);
        border: 1px solid rgba(191,119,255,0.45);
        color: #bf77ff; font-size: 1.2rem;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        opacity: 0; pointer-events: none;
        transform: translateY(12px);
        transition: opacity .35s, transform .35s, background .25s, border-color .25s;
        backdrop-filter: blur(10px);
      }
      #back-to-top.visible {
        opacity: 1; pointer-events: auto; transform: translateY(0);
      }
      #back-to-top:hover {
        background: rgba(191,119,255,0.25);
        border-color: rgba(191,119,255,0.9);
        color: #fff;
        transform: translateY(-3px);
      }

      /* ── Scroll Reveal ── */
      .reveal {
        opacity: 0; transform: translateY(28px);
        transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
      }
      .reveal.revealed { opacity: 1; transform: translateY(0); }
      .reveal-left { opacity: 0; transform: translateX(-28px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
      .reveal-left.revealed { opacity: 1; transform: translateX(0); }
      .reveal-right { opacity: 0; transform: translateX(28px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
      .reveal-right.revealed { opacity: 1; transform: translateX(0); }
      .reveal-scale { opacity: 0; transform: scale(0.93); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
      .reveal-scale.revealed { opacity: 1; transform: scale(1); }

      /* ── Stagger delays for child reveals ── */
      .stagger > *:nth-child(1) { transition-delay: 0ms; }
      .stagger > *:nth-child(2) { transition-delay: 80ms; }
      .stagger > *:nth-child(3) { transition-delay: 160ms; }
      .stagger > *:nth-child(4) { transition-delay: 240ms; }
      .stagger > *:nth-child(5) { transition-delay: 320ms; }
      .stagger > *:nth-child(6) { transition-delay: 400ms; }

      /* ── Section divider shimmer ── */
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .shimmer-line {
        height: 1px; width: 100%; max-width: 800px; margin: 0 auto;
        background: linear-gradient(90deg, transparent 0%, rgba(191,119,255,0.6) 25%, rgba(0,255,255,0.6) 50%, rgba(255,119,170,0.6) 75%, transparent 100%);
        background-size: 200% auto;
        animation: shimmer 4s linear infinite;
      }

      /* ── Typing cursor blink ── */
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      .type-cursor { display: inline-block; width: 2px; height: 1em; background: #bf77ff; margin-left: 2px; vertical-align: middle; animation: blink 1s step-start infinite; }

      /* ── Floating label for nav dots ── */
      @keyframes fadeInLeft { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }

      /* ── Progress bar (top) ── */
      #scroll-progress {
        position: fixed; top: 0; left: 0; z-index: 9999;
        height: 2px; width: 0%;
        background: linear-gradient(90deg, #bf77ff, #ff77aa, #00ffff);
        transition: width .1s linear;
        pointer-events: none;
      }

      /* ── Tooltip ── */
      .tooltip-wrap { position: relative; }
      .tooltip-tip {
        position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
        background: rgba(10,4,30,0.95); border: 1px solid rgba(191,119,255,0.4);
        color: rgba(255,255,255,0.9); font-size: 0.72rem; white-space: nowrap;
        padding: 5px 12px; border-radius: 8px; pointer-events: none;
        opacity: 0; transition: opacity .2s; letter-spacing: 0.5px;
        backdrop-filter: blur(8px);
      }
      .tooltip-wrap:hover .tooltip-tip { opacity: 1; }

      /* ── Section label badge ── */
      .section-badge {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 16px; border-radius: 99px;
        font-family: 'Space Mono', monospace;
        font-size: 0.6rem; font-weight: 700; letter-spacing: 4px;
        text-transform: uppercase; margin-bottom: 24px;
      }

      /* ── Glow pulse for active elements ── */
      @keyframes glowPulse {
        0%,100%{ box-shadow:0 0 12px rgba(191,119,255,0.3); }
        50%{ box-shadow:0 0 28px rgba(191,119,255,0.7); }
      }

      /* ── Horizontal scroll for coding profiles ── */
      .profiles-scroll {
        display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; width: 100%;
        scrollbar-width: thin; scrollbar-color: rgba(191,119,255,0.3) transparent;
      }
      .profiles-scroll::-webkit-scrollbar { height: 4px; }
      .profiles-scroll::-webkit-scrollbar-track { background: transparent; }
      .profiles-scroll::-webkit-scrollbar-thumb { background: rgba(191,119,255,0.3); border-radius: 99px; }
    `
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])
  return null
}

// ─── [ENHANCEMENT] CUSTOM CURSOR ────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot = dotRef.current
    const ringEl = ringRef.current
    if (!dot || !ringEl) return

    let raf
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY } }
    const onDown = () => ringEl.classList.add('clicking')
    const onUp = () => ringEl.classList.remove('clicking')

    const addHover = () => {
      document.querySelectorAll('a,button,[role=button]').forEach(el => {
        el.addEventListener('mouseenter', () => ringEl.classList.add('hovered'))
        el.addEventListener('mouseleave', () => ringEl.classList.remove('hovered'))
      })
    }
    addHover()
    const mo = new MutationObserver(addHover)
    mo.observe(document.body, { childList: true, subtree: true })

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (dot) { dot.style.left = pos.current.x + 'px'; dot.style.top = pos.current.y + 'px' }
      if (ringEl) { ringEl.style.left = ring.current.x + 'px'; ringEl.style.top = ring.current.y + 'px' }
      raf = requestAnimationFrame(animate)
    }
    animate()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      mo.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  )
}

// ─── [ENHANCEMENT] SCROLL PROGRESS BAR ──────────────────────────────────────
function ScrollProgressBar({ scrollContainer }) {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress')
    const btn = document.getElementById('back-to-top')
    if (!bar) return
    const el = scrollContainer?.current?.el

    const handler = () => {
      const target = el || document.documentElement
      const scrollTop = el ? el.scrollTop : window.scrollY
      const total = el ? el.scrollHeight - el.clientHeight : target.scrollHeight - target.clientHeight
      const pct = total > 0 ? (scrollTop / total) * 100 : 0
      bar.style.width = pct + '%'
      if (btn) {
        if (pct > 8) btn.classList.add('visible')
        else btn.classList.remove('visible')
      }
    }

    const target = el || window
    target.addEventListener('scroll', handler)
    return () => target.removeEventListener('scroll', handler)
  }, [scrollContainer])

  return null
}

// ─── [ENHANCEMENT] SCROLL REVEAL ─────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          // Don't unobserve — keep revealed state
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    const observe = () => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => io.observe(el))
    }
    observe()
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])
}

// ─── HELPER: hex color to rgb string (original unchanged) ───────────────────
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1],16)},${parseInt(result[2],16)},${parseInt(result[3],16)}` : '0,255,255'
}

// ─── [ENHANCEMENT] SECTION HEADING COMPONENT ─────────────────────────────────
// Wraps original section headings with a shimmer underline and reveal animation
function SectionHeading({ children, color = 'white', badge, badgeColor = '#bf77ff' }) {
  return (
    <div className="reveal" style={{ textAlign: 'center', marginBottom: '60px', flexShrink: 0, width: '100%' }}>
      {badge && (
        <div className="section-badge" style={{
          background: `${badgeColor}15`, border: `1px solid ${badgeColor}40`, color: badgeColor,
          fontFamily: "'Space Mono', monospace", margin: '0 auto 20px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: badgeColor, display: 'inline-block' }} />
          {badge}
        </div>
      )}
      <h2 style={{
        color, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '8px',
        textTransform: 'uppercase', margin: '0 0 20px',
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600,
      }}>{children}</h2>
      <div className="shimmer-line" style={{ maxWidth: '240px' }} />
    </div>
  )
}

// ─── [ENHANCEMENT] GLASS CARD (visual upgrade, same props/content) ───────────
function GlassCard({ title, issuer, type, imagePath, onOpen }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="reveal-scale"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => imagePath && onOpen(imagePath)}
      style={{
        // [ENHANCEMENT] width made fluid + added min-width for grid
        width: '100%', minWidth: '260px', padding: '28px 30px', borderRadius: '20px',
        cursor: imagePath ? 'pointer' : 'default', transition: 'all 0.4s cubic-bezier(.16,1,.3,1)',
        background: hovered ? 'rgba(0,255,255,0.08)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: hovered ? '1px solid rgba(0,255,255,0.6)' : '1px solid rgba(255,255,255,0.08)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? '0 24px 48px rgba(0,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
        textAlign: 'left', position: 'relative', overflow: 'hidden',
      }}>
      {/* [ENHANCEMENT] subtle top gradient line on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: hovered ? 'linear-gradient(90deg, transparent, rgba(0,255,255,0.8), transparent)' : 'transparent',
        transition: 'background 0.4s',
      }} />
      <p style={{ color: '#00ffff', fontSize: '0.6rem', letterSpacing: '3px', fontWeight: '700', margin: '0 0 10px 0', fontFamily: "'Space Mono', monospace" }}>{type}</p>
      <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1rem', lineHeight: '1.45', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{title}</h3>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', margin: '0 0 14px 0', fontFamily: "'DM Sans', sans-serif" }}>Issued by: {issuer}</p>
      {imagePath && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: hovered ? '#00ffff' : 'rgba(0,255,255,0.5)',
          fontSize: '0.68rem', fontFamily: "'Space Mono', monospace",
          transition: 'color 0.3s', marginTop: '4px',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          CLICK TO VIEW
        </div>
      )}
    </div>
  )
}

// ─── [ENHANCEMENT] PROJECT CARD ──────────────────────────────────────────────
function ProjectCard({ title, tech, description, type, tags = [] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="reveal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '360px', padding: '36px 34px', borderRadius: '24px',
        cursor: 'default', transition: 'all 0.45s cubic-bezier(.16,1,.3,1)',
        background: hovered ? 'rgba(191,119,255,0.07)' : 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: hovered ? '1px solid rgba(191,119,255,0.55)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered ? '0 28px 56px rgba(191,119,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
        transform: hovered ? 'translateY(-12px)' : 'translateY(0)',
        textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px',
        position: 'relative', overflow: 'hidden',
      }}>
      {/* [ENHANCEMENT] decorative orb behind card */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: hovered ? 'radial-gradient(circle, rgba(191,119,255,0.15) 0%, transparent 70%)' : 'transparent',
        transition: 'background 0.5s', pointerEvents: 'none',
      }} />
      <p style={{ color: '#bf77ff', fontSize: '0.58rem', letterSpacing: '3px', fontWeight: '700', margin: 0, fontFamily: "'Space Mono', monospace" }}>{type}</p>
      <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem', lineHeight: '1.35', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{title}</h3>
      <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '0.83rem', margin: 0, lineHeight: '1.7', fontFamily: "'DM Sans', sans-serif" }}>{description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            padding: '5px 13px', borderRadius: '99px', fontSize: '0.67rem', fontWeight: '600',
            background: hovered ? 'rgba(191,119,255,0.18)' : 'rgba(191,119,255,0.1)',
            border: '1px solid rgba(191,119,255,0.28)', color: '#d4a8ff',
            transition: 'background 0.3s', letterSpacing: '0.3px',
            fontFamily: "'DM Sans', sans-serif",
          }}>{tag}</span>
        ))}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', margin: '4px 0 0 0', fontFamily: "'Space Mono', monospace" }}>// {tech}</p>
    </div>
  )
}

// ─── [ENHANCEMENT] INTERNSHIP CARD ───────────────────────────────────────────
function InternshipCard({ title, org, duration, status, color = '#00ffff', imagePath, onOpen }) {
  const [hovered, setHovered] = useState(false)
  const isClickable = !!(imagePath && onOpen)
  return (
    <div
      className="reveal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isClickable && onOpen(imagePath)}
      style={{
        width: '340px', padding: '32px', borderRadius: '22px', transition: 'all 0.4s cubic-bezier(.16,1,.3,1)',
        background: hovered ? `rgba(${hexToRgb(color)},0.07)` : 'rgba(255,255,255,0.025)',
        border: hovered ? `1px solid ${color}` : `1px solid ${color}25`,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: hovered ? `0 24px 48px ${color}18, inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
        textAlign: 'left', cursor: isClickable ? 'pointer' : 'default',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: hovered ? `linear-gradient(90deg, transparent, ${color}80, transparent)` : 'transparent',
        transition: 'background 0.4s',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <p style={{ color, fontSize: '0.58rem', letterSpacing: '3px', fontWeight: '700', margin: 0, fontFamily: "'Space Mono', monospace" }}>INTERNSHIP</p>
        <span style={{
          padding: '3px 11px', borderRadius: '99px', fontSize: '0.6rem', fontWeight: '700',
          background: status === 'Completed' ? 'rgba(0,255,136,0.12)' : 'rgba(255,200,0,0.1)',
          color: status === 'Completed' ? '#00ff88' : '#ffc800',
          border: `1px solid ${status === 'Completed' ? '#00ff8830' : '#ffc80030'}`,
          fontFamily: "'DM Sans', sans-serif",
        }}>{status}</span>
      </div>
      <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1.05rem', lineHeight: '1.5', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{title}</h3>
      <p style={{ color: color, fontSize: '0.84rem', margin: '0 0 6px 0', fontWeight: '600', opacity: 0.85, fontFamily: "'DM Sans', sans-serif" }}>{org}</p>
      {duration && <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.73rem', margin: '0 0 14px 0', fontFamily: "'DM Sans', sans-serif" }}>Duration: {duration}</p>}
      {isClickable && (
        <div style={{
          fontSize: '0.68rem', color: color, fontWeight: '700',
          letterSpacing: '1px', opacity: hovered ? 1 : 0.5, transition: 'opacity 0.3s',
          display: 'flex', alignItems: 'center', gap: '5px',
          fontFamily: "'Space Mono', monospace",
        }}>
          VIEW CERTIFICATE
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </div>
      )}
    </div>
  )
}

// ─── SkillBoxCard (original kept, font & reveal enhanced) ───────────────────
function SkillBoxCard({ icon, label, labelColor, tags }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="reveal-scale"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px 22px', borderRadius: '18px', transition: 'all 0.4s cubic-bezier(.16,1,.3,1)',
        background: hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
        border: hovered ? `1px solid ${labelColor}60` : '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 16px 32px ${labelColor}12` : 'none',
      }}>
      <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{icon}</div>
      <h4 style={{ color: labelColor, margin: '0 0 12px', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{label}</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            padding: '3px 10px', borderRadius: '99px',
            background: `${labelColor}14`, border: `1px solid ${labelColor}30`,
            color: labelColor, fontSize: '0.72rem', fontFamily: "'DM Sans', sans-serif",
          }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}

// ─── MouseTracker (original 3D logic unchanged) ─────────────────────────────
function MouseTracker({ children }) {
  const { mouse, viewport } = useThree()
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.set(-(mouse.y * viewport.height / 2) * 0.05, (mouse.x * viewport.width / 2) * 0.05, 0)
  })
  return <group ref={ref}>{children}</group>
}

// ─── ScrollController (original unchanged) ──────────────────────────────────
function ScrollController({ onReady }) {
  const scroll = useScroll()
  useFrame(() => {})
  React.useEffect(() => { onReady(scroll) }, [scroll])
  return null
}

// ─── [ENHANCEMENT] ProfilePill (tooltip added) ───────────────────────────────
function ProfilePill({ icon, label, href, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 16px', borderRadius: '12px', flexShrink: 0,
        background: hovered ? `${color}20` : 'rgba(255,255,255,0.04)',
        border: hovered ? `1px solid ${color}70` : '1px solid rgba(255,255,255,0.08)',
        color: hovered ? color : 'rgba(255,255,255,0.65)',
        textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap',
        fontSize: '0.78rem', transition: 'all 0.3s cubic-bezier(.16,1,.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 20px ${color}18` : 'none',
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
      <span>{icon}</span> {label}
    </a>
  )
}

// ─── [ENHANCEMENT] NavLink (original logic + improved active indicator) ──────
function NavLink({ children, onClick, active }) {
  const [hovered, setHovered] = useState(false)
  const lit = hovered || active
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '2.5px', fontWeight: '600',
        transition: 'all 0.3s ease', color: lit ? '#ffffff' : '#cc99ee',
        textShadow: lit ? '0 0 16px #ff77aa, 0 0 36px #bf77ff' : 'none',
        display: 'inline-block',
        transform: lit ? 'scale(1.08) translateY(-1px)' : 'scale(1)',
        padding: '5px 3px', position: 'relative',
        fontFamily: "'DM Sans', sans-serif",
      }}>
      {children}
      <span style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: lit ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
        width: '100%', height: '1.5px',
        background: 'linear-gradient(90deg, transparent, #ff77aa, #bf77ff, transparent)',
        transition: 'transform 0.3s ease', borderRadius: '2px',
      }} />
    </span>
  )
}

// ─── 3D Objects (all original — MantaRay, RadiantDiamond, PearlJellyfish, MovingBackground) ──
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
          <mesh key={i} position={[Math.sin((i/8)*Math.PI*2)*0.38, -0.9, Math.cos((i/8)*Math.PI*2)*0.38]}><cylinderGeometry args={[0.003, 0.001, 2.0]} /><meshStandardMaterial color={color} transparent opacity={0.3} /></mesh>
        ))}
      </Float>
    </group>
  )
}

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

// ─── [ENHANCEMENT] ACHIEVEMENT ITEM ─────────────────────────────────────────
function AchievementItem({ text }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="reveal-left"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '22px 32px', borderRadius: '16px', transition: 'all 0.35s cubic-bezier(.16,1,.3,1)',
        border: hovered ? '1px solid #ffd700' : '1px solid rgba(255,215,0,0.2)',
        background: hovered ? 'rgba(255,215,0,0.07)' : 'rgba(255,215,0,0.02)',
        color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '16px',
        transform: hovered ? 'translateX(10px)' : 'translateX(0)',
        maxWidth: '620px', width: '100%',
        boxShadow: hovered ? '0 8px 24px rgba(255,215,0,0.08)' : 'none',
        fontFamily: "'DM Sans', sans-serif",
      }}>
      <span style={{ color: '#ffd700', fontSize: '1.3rem', flexShrink: 0 }}>★</span>
      <span style={{ lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

// ─── [ENHANCEMENT] SIDE PROGRESS DOTS ────────────────────────────────────────
function SideProgressDots({ activeSection, navItems, onNav }) {
  return (
    <div style={{
      position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)',
      zIndex: 200, display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center',
    }}>
      {navItems.map(({ label, page }) => {
        const isActive = activeSection === page
        return (
          <div key={label} onClick={() => onNav(page)} title={label}
            className="tooltip-wrap"
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <span className="tooltip-tip" style={{ right: '22px', left: 'auto', bottom: 'auto', top: '50%', transform: 'translateY(-50%)' }}>{label}</span>
            <div style={{
              width: isActive ? '10px' : '6px', height: isActive ? '10px' : '6px',
              borderRadius: '50%',
              background: isActive ? '#bf77ff' : 'rgba(255,255,255,0.2)',
              border: isActive ? '2px solid rgba(191,119,255,0.5)' : '1.5px solid rgba(255,255,255,0.15)',
              boxShadow: isActive ? '0 0 10px #bf77ff, 0 0 20px rgba(191,119,255,0.4)' : 'none',
              transition: 'all 0.4s ease',
              animation: isActive ? 'glowPulse 2s ease infinite' : 'none',
            }} />
          </div>
        )
      })}
    </div>
  )
}

// ─── [ENHANCEMENT] CERTIFICATE MODAL (original logic + font upgrade) ─────────
function CertModal({ src, onClose }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', handleKey) }
  }, [onClose])
  const handleClose = () => { setVisible(false); setTimeout(onClose, 280) }
  return (
    <div onClick={handleClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      background: `rgba(0,0,0,${visible ? 0.94 : 0})`,
      backdropFilter: `blur(${visible ? 16 : 0}px)`,
      transition: 'background 0.28s ease, backdrop-filter 0.28s ease', cursor: 'zoom-out',
    }}>
      <button onClick={handleClose} style={{
        position: 'fixed', top: '20px', right: '24px',
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)',
        color: 'white', width: '44px', height: '44px', borderRadius: '50%',
        fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', transition: 'all 0.2s', zIndex: 1001, lineHeight: 1,
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      >×</button>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(24px)',
        transition: 'opacity 0.28s ease, transform 0.28s ease', cursor: 'default',
      }}>
        <img src={src} alt="Certificate" style={{
          maxHeight: '88vh', maxWidth: '88vw', objectFit: 'contain', borderRadius: '16px',
          boxShadow: '0 0 60px rgba(0,255,255,0.2), 0 40px 80px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.12)', display: 'block',
        }} />
        <a href={src} download onClick={e => e.stopPropagation()} style={{
          position: 'absolute', bottom: '-52px', left: '50%', transform: 'translateX(-50%)',
          padding: '10px 28px', borderRadius: '99px',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)',
          color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', fontWeight: '600',
          cursor: 'pointer', letterSpacing: '0.5px', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
          Download Certificate
        </a>
      </div>
    </div>
  )
}

// ─── [ENHANCEMENT] TYPED TEXT HOOK ──────────────────────────────────────────
function useTypedText(phrases, speed = 60, pause = 2000) {
  const [display, setDisplay] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]
    if (!deleting && charIdx <= current.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), speed)
      return () => clearTimeout(t)
    } else if (!deleting && charIdx > current.length) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    } else if (deleting && charIdx > 0) {
      const t = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
      return () => clearTimeout(t)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setPhraseIdx(i => (i + 1) % phrases.length)
    }
    setDisplay(current.slice(0, charIdx))
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause])

  useEffect(() => { setDisplay(phrases[phraseIdx].slice(0, charIdx)) }, [charIdx])
  return display
}

// ─── [ENHANCEMENT] HOME SECTION BUTTON ──────────────────────────────────────
function HomeSectionBtn({ num, label, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick}
      style={{
        background: hovered ? 'rgba(191,119,255,0.1)' : 'rgba(255,255,255,0.025)',
        border: hovered ? '1px solid #bf77ff' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px', padding: '14px 20px', cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(.16,1,.3,1)', textAlign: 'left',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 10px 28px rgba(191,119,255,0.15)' : 'none', outline: 'none',
      }}>
      <div style={{ color: '#bf77ff', fontSize: '0.56rem', letterSpacing: '2px', marginBottom: '5px', fontWeight: '700', fontFamily: "'Space Mono', monospace" }}>{num}</div>
      <div style={{ color: hovered ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: '0.76rem', letterSpacing: '0.5px', fontWeight: '500', fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── MAIN APP ────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedCert, setSelectedCert] = useState(null)
  const [activeSection, setActiveSection] = useState(0)
  const scrollRef = useRef(null)

  // [ENHANCEMENT] typed text for hero subtitle
  const typedText = useTypedText([
    'Computer Science Student',
    'Java Full Stack Developer',
    'Generative AI Enthusiast',
    'Cloud Computing Explorer',
  ], 55, 2200)

  // Activate scroll reveal
  useScrollReveal()

  const TOTAL_PAGES = 10
  const sectionIds = ['home','about','skills','projects','internships','certs','workshops','hackathons','achievements','contact']

  const goToPage = useCallback((page) => {
    const id = sectionIds[page]
    if (!id) return
    if (scrollRef.current?.el) {
      const target = scrollRef.current.el.querySelector('#section-' + id)
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveSection(page); return }
    }
    const target = document.getElementById('section-' + id)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(page)
  }, [])

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
        const overlap = Math.min(r.bottom, containerRect.bottom) - Math.max(r.top, containerRect.top)
        if (overlap > bestOverlap) { bestOverlap = overlap; best = idx }
      })
      setActiveSection(best)
    }, 200)
    return () => clearInterval(timer)
  }, [])

  const navItems = [
    { label: 'Home', page: 0 }, { label: 'About', page: 1 },
    { label: 'Skills', page: 2 }, { label: 'Projects', page: 3 },
    { label: 'Internships', page: 4 }, { label: 'Certs', page: 5 },
    { label: 'Workshops', page: 6 }, { label: 'Hackathons', page: 7 },
    { label: 'Contact', page: 8 },
  ]

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── [ENHANCEMENT] Global styles, cursor, scroll bar ── */}
      <GlobalStyles />
      <CustomCursor />
      <div id="scroll-progress" />
      <ScrollProgressBar scrollContainer={scrollRef} />

      {/* ── [ENHANCEMENT] Back to Top button ── */}
      <button id="back-to-top" onClick={() => goToPage(0)} title="Back to top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
      </button>

      {/* ──────── NAV (original structure, enhanced styling) ──────── */}
      <nav style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px',
        background: 'rgba(4,2,18,0.6)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '999px', border: '1px solid rgba(191,119,255,0.4)',
        boxShadow: '0 0 0 1px rgba(255,119,170,0.12), 0 0 24px rgba(191,119,255,0.2), 0 0 60px rgba(191,119,255,0.08), inset 0 1px 0 rgba(255,255,255,0.07)',
        width: 'fit-content',
      }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '999px', background: 'linear-gradient(135deg, rgba(191,119,255,0.05) 0%, transparent 50%, rgba(0,255,255,0.03) 100%)', pointerEvents: 'none' }} />
        {navItems.map(({ label, page }, i) => (
          <React.Fragment key={label}>
            <div style={{ padding: '12px 8px' }}>
              <NavLink onClick={() => goToPage(page)} active={activeSection === page}>{label}</NavLink>
            </div>
            {i < navItems.length - 1 && (
              <div style={{ width: '1px', height: '12px', background: 'linear-gradient(to bottom, transparent, rgba(191,119,255,0.25), transparent)', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </nav>

      <SideProgressDots activeSection={activeSection} navItems={navItems} onNav={goToPage} />

      {/* ──────── THREE.JS CANVAS (original unchanged) ──────── */}
      <Canvas camera={{ position: [0, 0, 18], fov: 50 }}>
        <color attach="background" args={['#000000']} />
        <MovingBackground />
        <ambientLight intensity={1.2} />
        <pointLight position={[10,10,10]} intensity={2.5} color="#bf77ff" />
        <pointLight position={[-10,-10,5]} intensity={2} color="#00ffff" />
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

            {/* ══════════════════ 0. HOME ══════════════════ */}
            <section id="section-home" style={{
              height: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: 'white', textAlign: 'center', padding: '0 5%', pointerEvents: 'auto',
            }}>
              {/* [ENHANCEMENT] staggered fade-in for hero elements */}
              <p className="reveal" style={{
                color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', letterSpacing: '4px',
                marginBottom: '18px', fontFamily: "'Space Mono', monospace",
                transitionDelay: '100ms',
              }}>Hi, my name is</p>

              <h1 className="reveal" style={{
                fontSize: 'clamp(3rem,8vw,6.5rem)', fontWeight: '600', margin: '0 0 22px 0', lineHeight: 1.02,
                background: 'linear-gradient(135deg, #ffffff 30%, #ffb3d9 65%, #bf77ff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                // [ENHANCEMENT] upgraded to Cormorant for editorial elegance
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '-1px', transitionDelay: '200ms',
              }}>VINOTHINI D</h1>

              {/* [ENHANCEMENT] Typing animation for subtitle — content unchanged */}
              <p className="reveal" style={{
                color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', letterSpacing: '0.5px',
                marginBottom: '10px', fontWeight: '400', minHeight: '1.5em',
                fontFamily: "'DM Sans', sans-serif", transitionDelay: '300ms',
              }}>
                {typedText}<span className="type-cursor" />
              </p>

              <p className="reveal" style={{
                color: 'rgba(255,255,255,0.35)', fontSize: '0.87rem', marginBottom: '48px',
                maxWidth: '500px', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif",
                transitionDelay: '400ms',
              }}>
                Building real-world software with Python, Java &amp; modern web technologies.
              </p>

              {/* [ENHANCEMENT] CTA buttons — staggered reveal, same href/actions */}
              <div className="reveal stagger" style={{
                display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center',
                marginBottom: '40px', transitionDelay: '500ms',
              }}>
                <button onClick={() => { const el = document.getElementById('section-projects'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}) }}
                  style={{
                    padding: '13px 28px', borderRadius: '999px', border: 'none',
                    background: 'rgba(255,255,255,0.92)', color: '#0a0414',
                    fontSize: '0.87rem', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px',
                    transition: 'all 0.3s', fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => { e.target.style.background='#fff'; e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 8px 24px rgba(255,255,255,0.2)' }}
                  onMouseLeave={e => { e.target.style.background='rgba(255,255,255,0.92)'; e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none' }}
                >View Projects</button>

                <a href="/Vinothini_Resume1.pdf" download="Vinothini_Resume.pdf" style={{
                  padding: '13px 28px', borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.8)', fontSize: '0.87rem', fontWeight: '600',
                  cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.3s',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.11)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
                  Download Resume
                </a>

                <button onClick={() => { const el = document.getElementById('section-contact'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}) }}
                  style={{
                    padding: '13px 28px', borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.8)', fontSize: '0.87rem', fontWeight: '600',
                    cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.11)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Contact Me
                </button>
              </div>

              {/* Social icons — original hrefs preserved */}
              <div className="reveal stagger" style={{ display: 'flex', gap: '14px', justifyContent: 'center', transitionDelay: '600ms' }}>
                <a href="https://www.linkedin.com/in/vinothini-d-0a2934373" target="_blank" rel="noopener noreferrer"
                  style={{ width: '46px', height: '46px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(10,102,194,0.28)'; e.currentTarget.style.borderColor='#0a66c2'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="https://github.com/vinothinitechie-cpu" target="_blank" rel="noopener noreferrer"
                  style={{ width: '46px', height: '46px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(110,84,148,0.28)'; e.currentTarget.style.borderColor='#6e5494'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                </a>
              </div>

              {/* [ENHANCEMENT] animated scroll indicator */}
              <div className="reveal" style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', transitionDelay: '800ms' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '3px', color: 'white', fontFamily: "'Space Mono', monospace" }}>SCROLL</span>
                  <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(191,119,255,0.8), transparent)', animation: 'shimmer 2s linear infinite' }} />
                </div>
              </div>
            </section>

            {/* ══════════════════ 1. ABOUT ══════════════════ */}
            <section id="section-about" style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <SectionHeading badge="01 / WHO I AM">About Me</SectionHeading>

              {/* [ENHANCEMENT] profile photo ring + glow upgrade */}
              <div className="reveal-scale" style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '44px' }}>
                <div style={{
                  position: 'absolute', inset: '-12px', borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, #bf77ff, #ff77aa, #00ffff, #bf77ff)',
                  animation: 'glowPulse 3s ease infinite', opacity: 0.4,
                }} />
                <div style={{ position: 'absolute', inset: '-6px', borderRadius: '50%', border: '1px solid rgba(191,119,255,0.3)' }} />
                <img src="/VinothiniProfile.jpg" alt="VINOTHINI D" style={{
                  width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                  border: '3px solid #000', filter: 'brightness(1.05)',
                  position: 'relative', zIndex: 1,
                }} />
              </div>

              {/* original about text — preserved exactly */}
              <div className="reveal" style={{ maxWidth: '780px', textAlign: 'center' }}>
                <h3 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '22px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: 'italic' }}>
                  A Passionate Developer &amp; Tech Enthusiast
                </h3>
                <p style={{ fontSize: '1.03rem', lineHeight: '1.85', color: 'rgba(255,255,255,0.68)', marginBottom: '40px', fontFamily: "'DM Sans', sans-serif" }}>
                  I am a Computer Science Engineering student currently pursuing my degree at{' '}
                  <strong style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Sri Manakula Vinayagar Engineering College</strong>.
                  {' '}My journey in tech is driven by a curiosity to solve real-world problems through code. I specialize in{' '}
                  <strong style={{ color: '#bf77ff', fontWeight: 600 }}>Java Full Stack Development</strong> and have a keen interest in{' '}
                  <strong style={{ color: '#00ffff', fontWeight: 600 }}>Generative AI</strong> and{' '}
                  <strong style={{ color: '#ff77aa', fontWeight: 600 }}>Cloud Computing</strong>. I thrive in collaborative environments like hackathons and am constantly looking for ways to bridge the gap between complex data and user-friendly software.
                </p>
                <div className="stagger" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { text: '🎓 B.Tech CSE & BS (2024-2028)', color: '#bf77ff' },
                    { text: '📍 Puducherry, India', color: '#00ffff' },
                    { text: '💻 Software Engineer In Progress', color: 'rgba(242,147,198,0.85)' },
                  ].map(({ text, color }) => (
                    <div key={text} className="reveal-scale" style={{
                      padding: '11px 22px', borderRadius: '99px',
                      background: `${color}10`, border: `1px solid ${color}35`,
                      color, fontSize: '0.84rem', fontWeight: '500', fontFamily: "'DM Sans', sans-serif",
                    }}>{text}</div>
                  ))}
                </div>
              </div>
            </section>

            {/* ══════════════════ 2. SKILLS ══════════════════ */}
            <section id="section-skills" style={{
              minHeight: '170vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-start',
              padding: '120px 5% 100px', boxSizing: 'border-box',
            }}>
              <SectionHeading color="#80cfd4" badge="02 / EXPERTISE">Skills</SectionHeading>

              {/* [ENHANCEMENT] 3-col grid — same SkillBoxCards, enhanced component above */}
              <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', maxWidth: '1120px', marginBottom: '64px' }}>
                <SkillBoxCard icon="🖥️" label="Languages"          labelColor="#8ecae6" tags={['C','C++','Java','Python']} />
                <SkillBoxCard icon="🌐" label="Frontend"            labelColor="#b8c0ff" tags={['HTML','CSS','React.js']} />
                <SkillBoxCard icon="⚙️" label="Tools & Platforms"   labelColor="#ffd6a5" tags={['GitHub','VS Code','AWS','Android']} />
                <SkillBoxCard icon="🧠" label="CS Fundamentals"     labelColor="#cdb4db" tags={['DSA','OOP','SDLC','Algorithms']} />
                <SkillBoxCard icon="🤖" label="AI & Cloud"          labelColor="#a8dadc" tags={['AI/ML','Data Engineering','Cloud']} />
                <SkillBoxCard icon="🔍" label="Competitive Coding"  labelColor="#f1c0e8" tags={['LeetCode','HackerRank','CodeChef','SkillRack']} />
              </div>

              {/* Coding profiles — original links preserved */}
              <div className="reveal" style={{ width: '100%', maxWidth: '1120px' }}>
                <p style={{ color: '#00ffc8', fontSize: '0.6rem', letterSpacing: '5px', fontWeight: '800', fontFamily: "'Space Mono', monospace", marginBottom: '20px' }}>// CODING PROFILES</p>
                {/* [ENHANCEMENT] horizontal scroll wrapper for profiles */}
                <div className="profiles-scroll">
                  <ProfilePill icon="⚡"  label="LeetCode"   href="https://leetcode.com/u/Vinothini_dk/"                                                                color="#f89f1b" />
                  <ProfilePill icon="🏆"  label="HackerRank" href="https://www.hackerrank.com/profile/vinothinidk81"                                                    color="#2ec866" />
                  <ProfilePill icon="👩‍🍳" label="CodeChef"   href="https://www.codechef.com/users/vinothini_dk"                                                         color="#c97d3a" />
                  <ProfilePill icon="🎯"  label="SkillRack"  href="http://www.skillrack.com/profile/523863/74ca754f4a7dc3e78c0fa4337a6cf0991c8c06de"                 color="#ff4e6a" />
                  <ProfilePill icon="🐙"  label="GitHub"     href="https://github.com/vinothinitechie-cpu"                                                              color="#bf77ff" />
                  <ProfilePill icon="💼"  label="LinkedIn"   href="https://www.linkedin.com/in/vinothini-d-0a2934373"                                                   color="#00ffc8" />
                </div>
              </div>
            </section>

            {/* ══════════════════ 3. PROJECTS ══════════════════ */}
            <section id="section-projects" style={{
              minHeight: '110vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <SectionHeading badge="03 / BUILDS">Projects</SectionHeading>
              <div className="stagger" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', alignItems: 'flex-start' }}>
                <ProjectCard
                  type="WEB DEVELOPMENT"
                  title="Personal Portfolio Website"
                  description="An immersive 3D portfolio built with React and Three.js, featuring interactive WebGL animations, scroll-driven storytelling, bioluminescent jellyfish, and a glassmorphism UI."
                  tech="React, Three.js, @react-three/fiber, @react-three/drei"
                  tags={['React','Three.js','WebGL','R3F']}
                />
                <ProjectCard
                  type="FULL STACK APPLICATION"
                  title="Student Management System"
                  description="A full-featured CRUD application for managing student records, attendance, grades, and reports. Features a clean dashboard with role-based access and database integration."
                  tech="Java / Python + MySQL / SQLite"
                  tags={['Java','Python','MySQL','CRUD','OOP']}
                />
              </div>
            </section>

            {/* ══════════════════ 4. INTERNSHIPS ══════════════════ */}
            <section id="section-internships" style={{
              minHeight: '130vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <SectionHeading color="#ff77aa" badge="04 / EXPERIENCE">Internships</SectionHeading>
              <div className="stagger" style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', alignItems: 'flex-start' }}>
                <InternshipCard title="AI-ML Virtual Internship - cohort 13" org="EduSkills / AICTE"              duration="Virtual Internship" imagePath="/aiml_acite_page-0001.jpg" status="Completed" color="#ff77aa" onOpen={setSelectedCert} />
                <InternshipCard title="AWS Data Engineering Virtual Internship – Cohort 14" org="AWS Academy / EduSkills / AICTE" duration="10 Weeks"            imagePath="/image.png"               status="Completed" color="#ff9900" onOpen={setSelectedCert} />
                <InternshipCard title="Java Full Stack Developer – Cohort 15"  org="Wipro / NASSCOM / EduSkills"  duration="Virtual Internship" imagePath="/JavaFullStackDeveloper.jpg" status="Completed" color="#bf77ff" onOpen={setSelectedCert} />
              </div>
            </section>

            {/* ══════════════════ 5. CERTIFICATIONS ══════════════════ */}
            <section id="section-certs" style={{
              minHeight: '220vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-start',
              padding: '120px 5% 100px', boxSizing: 'border-box',
            }}>
              <SectionHeading badge="05 / CREDENTIALS">Certifications</SectionHeading>

              {/* ── AI & Machine Learning ── */}
              <div className="reveal" style={{ width: '100%', maxWidth: '1120px', marginBottom: '52px' }}>
                <p style={{ color: '#00ffff', fontSize: '0.58rem', letterSpacing: '4px', fontWeight: '800', fontFamily: "'Space Mono', monospace", marginBottom: '20px', marginTop: '24px' }}>// AI &amp; MACHINE LEARNING</p>
                <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <GlassCard title="Generative AI Professional Certificate" issuer="LinkedIn Learning"        type="CERTIFICATION" imagePath="/gen-ai-linkedin.png"       onOpen={setSelectedCert} />
                  <GlassCard title="GenAI Powered Data Analytics"           issuer="TCS (Forage)"            type="CERTIFICATION" imagePath="/tcs-genai-analytics.png"   onOpen={setSelectedCert} />
                  <GlassCard title="Gen AI: Beyond the Chatbot"             issuer="Google Cloud (Coursera)" type="CERTIFICATION" imagePath="/google-genai-coursera.png" onOpen={setSelectedCert} />
                  <GlassCard title="Machine Learning Foundations"           issuer="LearnTube.ai"            type="CERTIFICATION" imagePath="/ml-learntube.png"          onOpen={setSelectedCert} />
                  <GlassCard title="Generative AI Certification"            issuer="LearnTube.ai"            type="CERTIFICATION" imagePath="/genai-learntube.png"       onOpen={setSelectedCert} />
                  <GlassCard title="Generative AI Mastermind"               issuer="Outskill"                type="CERTIFICATION" imagePath="/genai-outskill.png"        onOpen={setSelectedCert} />
                </div>
              </div>

              {/* ── Cloud & AWS ── */}
              <div className="reveal" style={{ width: '100%', maxWidth: '1120px', marginBottom: '52px' }}>
                <p style={{ color: '#ff9900', fontSize: '0.58rem', letterSpacing: '4px', fontWeight: '800', fontFamily: "'Space Mono', monospace", marginBottom: '20px' }}>// CLOUD &amp; AWS</p>
                <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <GlassCard title="AWS Academy Graduate"             issuer="Amazon Web Services" type="CERTIFICATION" imagePath="/aws_badge.jpg"            onOpen={setSelectedCert} />
                  <GlassCard title="AWS Solutions Architecture"       issuer="AWS (Forage)"        type="CERTIFICATION" imagePath="/aws-solutions-arch.jpg"   onOpen={setSelectedCert} />
                  <GlassCard title="AWS Machine Learning Foundations" issuer="AWS Academy"         type="CERTIFICATION" imagePath="/aws-ml-foundations.jpg"   onOpen={setSelectedCert} />
                </div>
              </div>

              {/* ── Full Stack & Programming ── */}
              <div className="reveal" style={{ width: '100%', maxWidth: '1120px', marginBottom: '52px' }}>
                <p style={{ color: '#bf77ff', fontSize: '0.58rem', letterSpacing: '4px', fontWeight: '800', fontFamily: "'Space Mono', monospace", marginBottom: '20px' }}>// FULL STACK &amp; PROGRAMMING</p>
                <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <GlassCard title="Java Full Stack Developer"            issuer="Wipro / NASSCOM"    type="CERTIFICATION" imagePath="/JavaFullStackDeveloper.jpg" onOpen={setSelectedCert} />
                  <GlassCard title="React JS Certification"               issuer="CareerNinja Digital" type="CERTIFICATION" imagePath="/react-careerninja.jpg"     onOpen={setSelectedCert} />
                  <GlassCard title="Java & Object-Oriented Programming"   issuer="Saylor University"  type="CERTIFICATION" imagePath="/java-saylor.jpg"           onOpen={setSelectedCert} />
                  <GlassCard title="Infosys Java Certification"           issuer="Infosys"            type="CERTIFICATION" imagePath="/infosys-java.jpg"          onOpen={setSelectedCert} />
                  <GlassCard title="Infosys Python Certification"         issuer="Infosys"            type="CERTIFICATION" imagePath="/infosys-python.jpg"        onOpen={setSelectedCert} />
                  <GlassCard title="C++ Programming"                      issuer="LearnTube.ai"       type="CERTIFICATION" imagePath="/cpp-learntube.jpg"         onOpen={setSelectedCert} />
                </div>
              </div>

              {/* ── Design & Security ── */}
              <div className="reveal" style={{ width: '100%', maxWidth: '1120px', marginBottom: '52px' }}>
                <p style={{ color: '#ff77aa', fontSize: '0.58rem', letterSpacing: '4px', fontWeight: '800', fontFamily: "'Space Mono', monospace", marginBottom: '20px' }}>// DESIGN &amp; SECURITY</p>
                <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <GlassCard title="UI/UX Fundamentals"               issuer="LearnTube + Media.net" type="CERTIFICATION" imagePath="/uiux-learntube.jpg"    onOpen={setSelectedCert} />
                  <GlassCard title="Cybersecurity Analyst Simulation"  issuer="TCS (Forage)"          type="CERTIFICATION" imagePath="/tcs-cybersecurity.jpg" onOpen={setSelectedCert} />
                </div>
              </div>
            </section>

            {/* ══════════════════ 6. WORKSHOPS ══════════════════ */}
            <section id="section-workshops" style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <SectionHeading color="#00ffc8" badge="06 / LEARNING">Workshops</SectionHeading>
              <div className="stagger" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', alignItems: 'flex-start', maxWidth: '1120px' }}>
                <GlassCard title="AI-Unplugged"                                          issuer="SMVEC-YouthFest"        type="WORKSHOP" onOpen={setSelectedCert} imagePath="/googlecloud.png" />
                <GlassCard title="Google Cloud: Build AI Apps With Gemini & Firebase"    issuer="Google Cloud"           type="WORKSHOP" onOpen={setSelectedCert} imagePath="/googlecloud.png" />
                <GlassCard title="Gen AI Workshop"                                       issuer="Technical Community"    type="WORKSHOP" onOpen={setSelectedCert} imagePath="/googlecloud.png" />
              </div>
            </section>

            {/* ══════════════════ 7. HACKATHONS ══════════════════ */}
            <section id="section-hackathons" style={{
              minHeight: '120vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <SectionHeading badge="07 / COMPETITIONS">Hackathons</SectionHeading>
              <div className="stagger" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto', width: '100%', alignItems: 'flex-start' }}>
                <GlassCard title="Global AI Hackathon 2026"  issuer="Aspire Institute"           type="PARTICIPANT" onOpen={setSelectedCert} />
                <GlassCard title="HackIndia 2026"            issuer="Mailam Engineering College" type="PARTICIPANT" onOpen={setSelectedCert} />
                <GlassCard title="AI Hackathon – Youthfest"  issuer="SVCE & T / Pondicherry"     type="PARTICIPANT" onOpen={setSelectedCert} />
              </div>
            </section>

            {/* ══════════════════ 8. CONTACT ══════════════════ */}
            <section id="section-contact" style={{
              minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '120px 5% 80px', boxSizing: 'border-box',
            }}>
              <div className="reveal-scale" style={{
                width: '100%', maxWidth: '820px', textAlign: 'center',
                padding: '64px 56px', borderRadius: '32px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* [ENHANCEMENT] decorative background orbs */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,119,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <p style={{ color: '#bf77ff', fontSize: '0.65rem', letterSpacing: '5px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>Contact</p>
                <h2 style={{ color: 'white', fontSize: 'clamp(2.2rem,5vw,3.8rem)', marginBottom: '22px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Let's Connect</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: '1.8', maxWidth: '580px', margin: '0 auto 48px', fontFamily: "'DM Sans', sans-serif" }}>
                  I'm always excited to connect with fellow developers, recruiters, innovators, and learners. Feel free to reach out for opportunities, collaborations, or simply a tech conversation.
                </p>

                <div className="stagger" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {[
                    { href: 'mailto:vinothinidk81@gmail.com', label: '📧 Email Me', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
                    { href: 'https://www.linkedin.com/in/vinothini-d-0a2934373', label: '💼 LinkedIn', bg: 'rgba(10,102,194,0.1)', border: 'rgba(10,102,194,0.28)', target: '_blank' },
                    { href: 'https://github.com/vinothinitechie-cpu', label: '💻 GitHub', bg: 'rgba(191,119,255,0.1)', border: 'rgba(191,119,255,0.28)', target: '_blank' },
                  ].map(({ href, label, bg, border, target }) => (
                    <a key={label} href={href} target={target} rel={target ? 'noopener noreferrer' : undefined} style={{
                      padding: '14px 28px', borderRadius: '999px',
                      background: bg, border: `1px solid ${border}`,
                      color: '#fff', textDecoration: 'none', transition: 'all 0.3s',
                      fontWeight: '500', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                    >{label}</a>
                  ))}
                </div>

                <div style={{ marginTop: '36px', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", letterSpacing: '1px' }}>
                  vinothinidk81@gmail.com
                </div>
              </div>
            </section>

            {/* [ENHANCEMENT] Footer shimmer */}
            <div style={{ height: '2px', background: 'transparent', margin: '0 5%' }}>
              <div className="shimmer-line" />
            </div>

          </Scroll>
        </ScrollControls>
      </Canvas>

      {/* ──── Certificate Modal (original + enhanced) ──── */}
      {selectedCert && <CertModal src={selectedCert} onClose={() => setSelectedCert(null)} />}

    </div>
  )
}