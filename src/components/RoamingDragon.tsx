'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Low-poly "Dragon Evolved" by Quaternius (CC0 public domain).
const MODEL = '/assets/models/dragon.glb'
const SEQUENCE = ['Fast_Flying', 'Punch', 'Flying_Idle', 'Headbutt', 'Yes', 'Fast_Flying', 'No', 'HitReact', 'Flying_Idle', 'Death']
// Looping clips play for a fixed time; the rest play once and advance when finished.
const LOOP_SECONDS: Record<string, number> = { Fast_Flying: 4.2, Flying_Idle: 3 }

/** A little 3D dragon that loops around the hero, cycling through its animations. */
export function RoamingDragon() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.65
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50)
    camera.position.set(0, 0.4, 8.5)

    scene.add(new THREE.AmbientLight('#fff8ef', 1.15))
    const key = new THREE.DirectionalLight('#ffffff', 2.2)
    key.position.set(2, 5, 10)
    const rim = new THREE.DirectionalLight('#ffb48a', 1.1)
    rim.position.set(-4, 3, 5)
    const point = new THREE.PointLight('#ffe6d2', 1.5, 22)
    point.position.set(0, 1.2, 7)
    scene.add(key, rim, point, new THREE.HemisphereLight('#ffffff', '#d2cbbf', 0.7))

    const holder = new THREE.Group()
    holder.scale.setScalar(0.2805)
    scene.add(holder)

    let mixer: THREE.AnimationMixer | null = null
    const actions = new Map<string, THREE.AnimationAction>()
    let current = ''
    let step = 0
    let loopUntil = 0

    const play = (name: string, fade = 0.22) => {
      const next = actions.get(name)
      if (!next) return
      const prev = actions.get(current)
      if (prev && current !== name) prev.fadeOut(fade)
      next.reset().setEffectiveWeight(1).fadeIn(fade).play()
      const hold = LOOP_SECONDS[name]
      if (hold != null) {
        next.setLoop(THREE.LoopRepeat, Infinity)
        loopUntil = performance.now() / 1000 + hold
      } else {
        next.setLoop(THREE.LoopOnce, 1)
        next.clampWhenFinished = true
        loopUntil = 0
      }
      current = name
    }
    const advance = () => {
      step = (step + 1) % SEQUENCE.length
      play(SEQUENCE[step])
    }

    let disposed = false
    new GLTFLoader().load(MODEL, (gltf) => {
      if (disposed) return
      gltf.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        mesh.frustumCulled = false
        const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((m) => {
          const mat = (m as THREE.MeshStandardMaterial).clone()
          // Punch the colours up so the dragon reads as a bright toy against the white page.
          mat.color.offsetHSL(0, 0.38, 0.18).multiplyScalar(1.4)
          mat.roughness = 0.32
          mat.metalness = 0.05
          mat.emissive = mat.color.clone().multiplyScalar(0.22)
          return mat
        })
        mesh.material = Array.isArray(mesh.material) ? mats : mats[0]
      })
      holder.add(gltf.scene)
      mixer = new THREE.AnimationMixer(gltf.scene)
      for (const clip of gltf.animations) actions.set(clip.name.split('|').pop()!, mixer.clipAction(clip))
      if (reduce) {
        const idle = actions.get('Flying_Idle')
        idle?.play()
        if (idle) idle.paused = true
        current = 'Flying_Idle'
        holder.position.set(2, 0.35, 0.5)
        return
      }
      play(SEQUENCE[0], 0.3)
      mixer.addEventListener('finished', (e) => {
        if (actions.get(current) === e.action && LOOP_SECONDS[current] == null) advance()
      })
    })

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    let visible = true
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(wrap)

    const clock = new THREE.Clock()
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = clock.getDelta()
      if (!visible) return
      const t = clock.elapsedTime
      if (!reduce) {
        mixer?.update(dt)
        holder.position.set(3.4 * Math.sin(0.32 * t), -0.1 + 1.05 * Math.sin(0.48 * t), 0.9 * Math.cos(0.32 * t))
        if (loopUntil > 0 && performance.now() / 1000 >= loopUntil) {
          loopUntil = 0
          advance()
        }
      }
      // Always turn to face the viewer.
      const dx = camera.position.x - holder.position.x
      const dz = camera.position.z - holder.position.z
      holder.rotation.set(reduce ? 0.08 : 0.08 + 0.04 * Math.sin(1.2 * t), Math.atan2(dx, dz), 0)
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mixer?.stopAllAction()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={wrapRef} className="roaming-dragon" aria-hidden="true" />
}
