import { useLoader} from '@react-three/fiber'
import { observer } from 'mobx-react';
import { useRef } from 'react';
import { Mesh, RepeatWrapping, TextureLoader } from 'three';
import viewerState from '../../state/ViewerState';
import * as THREE from 'three';

const OpenSimFloor = () => {

    const floorTextures =  [ 
        useLoader(TextureLoader, '/tile.jpg'),
        useLoader(TextureLoader, '/wood-floor.jpg'),
        useLoader(TextureLoader, '/Cobblestone.png'),
        useLoader(TextureLoader, '/cement.jpg'),
        useLoader(TextureLoader, '/grassy_d.png')
    ]
    const bumpTexture = new THREE.TextureLoader().load('bone-bumpmap.jpg');
    bumpTexture.repeat.set(8, 8)
    bumpTexture.wrapS = bumpTexture.wrapT = RepeatWrapping;
    var floorTexture = floorTextures[viewerState.textureIndex]
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.offset.set(0, 0);
    floorTexture.repeat.set(8, 8);
    const floorColor = "white"
    const floorRef=useRef<Mesh>(null);

    return <>
        <mesh name='Floor' ref={floorRef} rotation-x={-Math.PI / 2} 
                position-y={viewerState.floorHeight} visible={viewerState.floorVisible} receiveShadow >
        <planeGeometry attach="geometry" args={[20, 20]} />
        <meshPhongMaterial attach="material" color={floorColor} map={floorTexture} />
        </mesh>
    </>
}

export default observer(OpenSimFloor)
