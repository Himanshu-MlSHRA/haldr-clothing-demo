import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { reduceMotion } from '../lib/transition'

const URL = '/models/shoe.glb'

function Shoe({ variant, spinIn, onReady }) {
  const gltf = useGLTF(URL)
  const group = useRef()
  const originals = useRef(new Map())

  // Apply KHR_materials_variants
  useEffect(() => {
    const ext = gltf.userData?.gltfExtensions?.KHR_materials_variants
    if (!ext) return
    // variant names in the file are lowercase ("beach"), the catalog uses "Beach"
    const vIndex = ext.variants.findIndex((v) => v.name.toLowerCase() === String(variant).toLowerCase())
    let live = true
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = true
      if (!originals.current.has(o)) originals.current.set(o, o.material)
      const maps = o.userData?.gltfExtensions?.KHR_materials_variants?.mappings
      if (!maps) return
      const m = maps.find((mm) => mm.variants.includes(vIndex))
      // ignore late results if the colour was switched again before the material loaded
      if (m) gltf.parser.getDependency('material', m.material).then((mat) => { if (live) o.material = mat })
      else o.material = originals.current.get(o)
    })
    return () => { live = false }
  }, [variant, gltf])

  useEffect(() => { onReady?.() }, [])

  // spin in on mount, then idle float
  const t0 = useRef(performance.now())
  useFrame((state) => {
    if (!group.current) return
    const t = (performance.now() - t0.current) / 1000
    const k = reduceMotion ? 1 : Math.min(1, t / 1.6)
    const e = 1 - Math.pow(1 - k, 4)
    if (spinIn) group.current.rotation.y = (1 - e) * Math.PI * 1.5
    group.current.position.y = reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.2) * 0.012
  })

  // normalise size: longest side = 1.6 units
  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const s = box.getSize(new THREE.Vector3())
    return 1.6 / Math.max(s.x, s.y, s.z)
  }, [gltf])

  return (
    <group ref={group}>
      <Center>
        <primitive object={gltf.scene} scale={scale} rotation={[0, -Math.PI / 2.4, 0]} />
      </Center>
    </group>
  )
}

function Rig({ autoRotate }) {
  const { camera, size, gl, controls } = useThree()
  useEffect(() => { if (import.meta.env.DEV) window.__shoe = { camera, gl, get controls() { return controls } } })
  useEffect(() => {
    const aspect = size.width / size.height
    camera.position.set(0, 0.45, aspect < 0.8 ? 3.6 : 2.7)
    camera.updateProjectionMatrix()
  }, [size, camera])
  return (
    <OrbitControls
      enablePan={false} enableZoom={false} autoRotate={autoRotate && !reduceMotion} autoRotateSpeed={1.6}
      enableDamping dampingFactor={0.08} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.9} makeDefault
    />
  )
}

export default function Shoe3D({ variant = 'Beach', autoRotate = true, spinIn = true, className = '', shots = false }) {
  const [ready, setReady] = useState(false)
  return (
    <div className={`shoe3d ${ready ? 'is-ready' : ''} ${className}`}>
      {!ready && <div className="shoe3d__load"><span /><p className="mono">Loading 3D model</p></div>}
      <Canvas
        shadows dpr={[1, 2]} camera={{ fov: 32, position: [0, 0.45, 2.7] }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: shots || (import.meta.env.DEV && location.search.includes('shots')), toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense fallback={null}>
          <Shoe variant={variant} spinIn={spinIn} onReady={() => setReady(true)} />
          <ContactShadows position={[0, -0.36, 0]} opacity={0.45} scale={4} blur={2.6} far={1.2} resolution={512} color="#1b1b1b" />
          <Environment resolution={256}>
            <Lightformer intensity={2.2} position={[0, 4, 2]} scale={[6, 1, 1]} />
            <Lightformer intensity={1.4} position={[-4, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
            <Lightformer intensity={1.4} position={[4, 1, 1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
            <Lightformer intensity={0.8} position={[0, 1, -4]} scale={[6, 2, 1]} color="#ffd9bd" />
          </Environment>
        </Suspense>
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} castShadow />
        <Rig autoRotate={autoRotate} />
      </Canvas>
    </div>
  )
}

useGLTF.preload(URL)
