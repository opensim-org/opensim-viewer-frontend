import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useEffect, useRef } from 'react'
import { AnimationMixer, BoxHelper, Object3D, Scene } from 'three'

import SceneTreeModel from '../../helpers/SceneTreeModel'
import { modelUIState } from '../../state/ModelUIState'

interface OpenSimSceneProps {
    currentModelPath: string,
    supportControls:boolean
}

const OpenSimScene: React.FC<OpenSimSceneProps> = ({ currentModelPath, supportControls }) => {

    const sceneRef = useRef<Scene>(null!)
    // useGLTF suspends the component, it literally stops processing
    const { scene, animations } = useGLTF(currentModelPath);
    // eslint-disable-next-line no-mixed-operators
    let uuid2ObjectMap = new Map<string, Object3D>();
    let uuid2SelectionMap = new Map<string, BoxHelper>();
    if (supportControls) {
      scene.traverse((o) => {
          uuid2ObjectMap.set(o.uuid, o)
          if (o.type === "Mesh") {
            let helper : BoxHelper = new BoxHelper(o)
            uuid2SelectionMap.set(o.uuid, helper);
            helper.visible = false;
            scene.add(helper);
          }
         })
    }
    
    let mixer: AnimationMixer
    if (animations.length > 0) {
        mixer = new AnimationMixer(scene);
        animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.play()
        });
    }
    useFrame((state, delta) => {
      if (modelUIState !== undefined) {
        if (supportControls ) {
          if (modelUIState.deSelected!==""){
            let deselectedBox = uuid2SelectionMap.get(modelUIState.deSelected)
            if (deselectedBox !== undefined) {
              deselectedBox.visible = false;
            }
          }
          let selectedObject = uuid2ObjectMap.get(modelUIState.selected)!
          if (selectedObject !== undefined && selectedObject.type === "Mesh") {
            uuid2SelectionMap.get(modelUIState.selected)!.visible = true
          }
        }
        if (supportControls && modelUIState.animating){
            mixer?.update(delta * modelUIState.animationSpeed)
        }
      }
    })

    useEffect(() => {
        if (supportControls) {
            modelUIState.setCurrentModelPath(currentModelPath)
            modelUIState.setSceneTree(new SceneTreeModel(sceneRef.current))
            modelUIState.setAnimationList(animations)
        }
      }, [scene, animations, supportControls, currentModelPath])

    // By the time we're here the model is guaranteed to be available
    return <primitive ref={sceneRef} object={scene} 
      onPointerDown={(e: any) => modelUIState.setSelected(e.object.uuid)}
      onPointerMissed={() => modelUIState.setSelected("")}/>
}

export default OpenSimScene
