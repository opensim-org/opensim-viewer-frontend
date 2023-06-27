import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AnimationMixer, Scene } from 'three'

interface OpenSimSceneProps {
    curentModelPath: string
}

const OpenSimScene: React.FC<OpenSimSceneProps> = ({ curentModelPath }) => {

    const sceneRef = useRef<Scene>(null!)
    // useGLTF suspends the component, it literally stops processing
    const { scene, animations } = useGLTF(curentModelPath)
    let mixer: AnimationMixer
    if (animations.length) {
        mixer = new AnimationMixer(scene);
        animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.play();
        });
    }
    useFrame((state, delta) => {
        mixer?.update(delta)
    })
    
    useMemo(
        () =>
            scene.traverse((obj) => {
                // traverse and mutate the scene here ...
                if (obj.type === 'Mesh') {
                    obj.receiveShadow = true
                    obj.castShadow = true
                }
                //console.log(obj)
            }),
        [scene]
    )
    // By the time we're here the model is guaranteed to be available
    return <primitive ref={sceneRef} object={scene} />
}

export default OpenSimScene
