'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const TOP_Y = -0.75 // rim of the pot, hanging below the hook at y = 0
const PAD = 90 // extra canvas pixels around the pot so it can swing freely
const POT_H = 0.46

function std(color: string, rough = 0.58, metal = 0.06) {
  const c = new THREE.Color(color)
  return new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: metal, emissive: c.clone().multiplyScalar(0.05) })
}

/** Builds a little terracotta pot on three chains, with leaves, trailing vines and flowers. */
function buildPot() {
  const root = new THREE.Group()
  const chainMat = std('#5c5854', 0.32, 0.75)

  // Hook ring.
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 24), chainMat)
  hook.position.y = -0.02
  root.add(hook)

  // Three chains converging on the hook.
  const link = new THREE.TorusGeometry(0.022, 0.0065, 6, 14)
  for (let c = 0; c < 3; c++) {
    const a = (c / 3) * Math.PI * 2 + 0.3
    const end = new THREE.Vector3(Math.cos(a) * 0.33, TOP_Y + 0.02, Math.sin(a) * 0.33)
    const start = new THREE.Vector3(0, -0.07, 0)
    const dir = end.clone().sub(start)
    const n = Math.round(dir.length() / 0.036)
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
    for (let i = 0; i <= n; i++) {
      const m = new THREE.Mesh(link, chainMat)
      m.position.copy(start).addScaledVector(dir, i / n)
      m.quaternion.copy(q)
      m.rotateY(i % 2 ? Math.PI / 2 : 0)
      root.add(m)
    }
  }

  // Pot body (lathe), rim and soil.
  const profile = [
    new THREE.Vector2(0.0, TOP_Y - POT_H),
    new THREE.Vector2(0.22, TOP_Y - POT_H),
    new THREE.Vector2(0.26, TOP_Y - POT_H + 0.06),
    new THREE.Vector2(0.33, TOP_Y - 0.08),
    new THREE.Vector2(0.35, TOP_Y),
  ]
  const pot = new THREE.Mesh(new THREE.LatheGeometry(profile, 40), std('#c46b45'))
  root.add(pot)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.355, 0.035, 12, 48), std('#b85f3c'))
  rim.rotation.x = Math.PI / 2
  rim.position.y = TOP_Y
  root.add(rim)
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.315, 0.3, 0.05, 40, 1, true), std('#f5d76e'))
  band.position.y = TOP_Y - 0.2
  root.add(band)
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.33, 32), std('#5c4030', 0.9))
  soil.rotation.x = -Math.PI / 2
  soil.position.y = TOP_Y - 0.02
  root.add(soil)

  // Leaves: flattened spheres.
  const leafGeo = new THREE.SphereGeometry(1, 12, 8)
  const leafMats = [std('#3f8f4a'), std('#4fa55a'), std('#2f7a3c')]
  const addLeaf = (pos: THREE.Vector3, size: number, rotZ: number, rotY: number, mat = 0) => {
    const leaf = new THREE.Mesh(leafGeo, leafMats[mat % leafMats.length])
    leaf.scale.set(size * 0.45, size, size * 0.12)
    leaf.position.copy(pos)
    leaf.rotation.set(0.2, rotY, rotZ)
    root.add(leaf)
  }

  // Upright leaves out of the soil.
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    const r = 0.12 + (i % 3) * 0.05
    addLeaf(new THREE.Vector3(Math.cos(a) * r, TOP_Y + 0.08 + (i % 2) * 0.05, Math.sin(a) * r), 0.11 + (i % 3) * 0.02, Math.cos(a) * 0.6, -a, i)
  }

  // Trailing vines spilling over the rim.
  const vineMat = std('#2f7a3c')
  for (let v = 0; v < 5; v++) {
    const a = (v / 5) * Math.PI * 2 + 0.6
    const ox = Math.cos(a) * 0.34
    const oz = Math.sin(a) * 0.34
    const len = 0.45 + (v % 3) * 0.18
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 8; i++) {
      const t = i / 8
      const out = 0.04 + Math.sin(t * Math.PI) * 0.06
      pts.push(new THREE.Vector3(ox + Math.cos(a) * out, TOP_Y + 0.02 - t * len, oz + Math.sin(a) * out))
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.008, 5, false), vineMat))
    for (let i = 1; i <= 6; i++) {
      const p = curve.getPoint(i / 6.5)
      addLeaf(p, 0.05 + (i % 2) * 0.012, (i % 2 ? 1 : -1) * 0.9, -a, v + i)
    }
  }

  // Flowers: a ring of petals around a centre.
  const petalGeo = new THREE.SphereGeometry(1, 10, 8)
  const centreGeo = new THREE.SphereGeometry(0.018, 10, 8)
  const palettes = [
    ['#f2a0c0', '#f5d76e'],
    ['#e86b9a', '#f7e08a'],
    ['#ff8fb8', '#ffe08a'],
  ]
  const flowerSpots: [number, number, number][] = [
    [0.1, TOP_Y + 0.2, 0.08],
    [-0.16, TOP_Y + 0.16, 0.12],
    [0.02, TOP_Y + 0.24, -0.12],
    [0.3, TOP_Y - 0.3, 0.2],
    [-0.32, TOP_Y - 0.42, 0.14],
  ]
  flowerSpots.forEach(([x, y, z], idx) => {
    const [petal, centre] = palettes[idx % palettes.length]
    const flower = new THREE.Group()
    const pm = std(petal)
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const p = new THREE.Mesh(petalGeo, pm)
      p.scale.set(0.028, 0.016, 0.01)
      p.position.set(Math.cos(a) * 0.026, Math.sin(a) * 0.026, 0)
      p.rotation.z = a
      flower.add(p)
    }
    flower.add(new THREE.Mesh(centreGeo, std(centre)))
    flower.position.set(x, y, z)
    flower.lookAt(x * 3, y + 0.4, 3)
    root.add(flower)
  })

  return root
}

/** A 3D hanging plant at the top-left of the hero, swaying gently and swinging when you scroll. */
export function HangingFlowerPot() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40)
    scene.add(new THREE.AmbientLight('#ffffff', 1.05))
    const key = new THREE.DirectionalLight('#ffffff', 1.65)
    key.position.set(2, 3, 5)
    const warm = new THREE.DirectionalLight('#ffd2a8', 0.5)
    warm.position.set(-2, 1, 2)
    scene.add(key, warm, new THREE.HemisphereLight('#ffffff', '#cfc7bc', 0.45))

    const pivot = new THREE.Group()
    pivot.add(buildPot())
    scene.add(pivot)

    // The wrapper sets the pot's size; the canvas is drawn larger than it (PAD on the sides and bottom)
    // so the swinging vines and flowers have room and never get clipped at the edges.
    const canvas = renderer.domElement
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = `${-PAD}px`
    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect()
      const w = width + PAD * 2
      const h = height + PAD
      renderer.setSize(w, h)
      const pxPerUnit = height / 1.69
      camera.left = -w / 2
      camera.right = w / 2
      camera.top = h / 2
      camera.bottom = -h / 2
      camera.zoom = pxPerUnit
      // Keep the hook at the top edge: shift the view down by half the extra bottom padding.
      const centreY = -0.845 - PAD / 2 / pxPerUnit
      camera.position.set(0.4, centreY, 10)
      camera.lookAt(0.02, centreY, 0)
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // Scroll gives the pot a push; a damped spring settles it back.
    let swing = 0
    let swingV = 0
    let lastY = window.scrollY
    const onScroll = () => {
      const dy = window.scrollY - lastY
      lastY = window.scrollY
      swingV += THREE.MathUtils.clamp(dy * 0.0006, -0.03, 0.03)
    }
    if (!reduce) window.addEventListener('scroll', onScroll, { passive: true })

    const clock = new THREE.Clock()
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      if (reduce) {
        pivot.rotation.set(0.03, 0.12, 0.015)
      } else {
        swingV += -swing * 0.04
        swingV *= 0.94
        swing += swingV
        pivot.rotation.z = 0.055 * Math.sin(0.65 * t) + swing
        pivot.rotation.x = 0.03 + 0.02 * Math.sin(0.4 * t)
        pivot.rotation.y = 0.12 + 0.03 * Math.sin(0.22 * t) + 0.25 * Math.sin(0.15 * t)
      }
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={wrapRef} className="hanging-flower-pot" aria-hidden="true" />
}
