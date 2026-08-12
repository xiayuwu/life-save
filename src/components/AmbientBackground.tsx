import { useEffect, useRef } from 'react'

interface Star { x: number; y: number; r: number; alpha: number; velocity: number }

function secureUnit(): number {
  const value = new Uint32Array(1)
  crypto.getRandomValues(value)
  return value[0] / 0x1_0000_0000
}

export function AmbientBackground() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let stars: Star[] = []
    let width = 0, height = 0, frame = 0, raf = 0
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 2)
      width = innerWidth; height = innerHeight
      canvas.width = width * ratio; canvas.height = height * ratio
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      stars = Array.from({ length: Math.min(140, Math.round(width * height / 12000)) }, () => ({ x: secureUnit() * width, y: secureUnit() * height, r: secureUnit() * 1.2 + .25, alpha: secureUnit() * .5 + .15, velocity: secureUnit() * .007 + .002 }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      stars.forEach((star, index) => { ctx.fillStyle = `rgba(205,220,255,${star.alpha + Math.sin(frame * star.velocity + index) * .14})`; ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill() })
      frame += 1
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    resize(); draw(); addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize) }
  }, [])
  return <div className="ambient" aria-hidden="true"><canvas ref={ref} /><i className="ambient__orb ambient__orb--a" /><i className="ambient__orb ambient__orb--b" /><i className="ambient__grid" /></div>
}
