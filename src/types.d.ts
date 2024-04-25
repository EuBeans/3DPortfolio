type Resource =
    | TextureResource
    | CubeTextureResource
    | ModelResource
    | AudioResource
    | ObjModelResource;
    

declare interface StyleSheetCSS {
    [key: string]: React.CSSProperties;
}

type ObjModelResource = {
    name: string;
    type: 'objModel';
    path: string;
};

type TextureResource = {
    name: string;
    type: 'texture';
    path: string;
};

type CubeTextureResource = {
    name: string;
    type: 'cubeTexture';
    path: string[];
};

type ModelResource = {
    name: string;
    type: 'gltfModel';
    path: string;
};

type AudioResource = {
    name: string;
    type: 'audio';
    path: string;
};

type EnclosingPlane = {
    size: THREE.Vector2;
    position: THREE.Vector3;
    rotation: THREE.Euler;
};

type CameraKeyframe = {
    position: THREE.Vector3;
    focalPoint: THREE.Vector3;
    rotation?: THREE.Euler;
};

type LoadedResource =
    | LoadedTexture
    | LoadedCubeTexture
    | LoadedModel
    | LoadedAudio
    | LoadedObjModel;

import { Group } from 'three';
type LoadedObjModel = Group;

type LoadedTexture = THREE.Texture;

type LoadedModel = import('three/examples/jsm/loaders/GLTFLoader').GLTF;

type LoadedCubeTexture = THREE.CubeTexture;

type LoadedAudio = AudioBuffer;

type ResourceType = 'texture' | 'cubeTexture' | 'gltfModel'|'objModel';
