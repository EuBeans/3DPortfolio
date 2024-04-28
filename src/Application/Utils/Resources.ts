import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import Application from '../Application';
import UIEventBus from '../UI/EventBus';
import EventEmitter from './EventEmitter';
import Loading from './Loading';
import { Resource, LoadedResource, LoadedModel, LoadedTexture, LoadedCubeTexture, LoadedAudio ,LoadedObjModel} from '../../types';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// Setup DRACOLoader



export default class Resources extends EventEmitter {
    sources: Resource[];
    // Not sure about this one
    items: {
        texture: { [name: string]: LoadedTexture };
        cubeTexture: { [name: string]: LoadedCubeTexture };
        gltfModel: { [name: string]: LoadedModel };
        audio: { [name: string]: LoadedAudio };
        objModel: { [name: string]: LoadedObjModel };   
    };
    toLoad: number;
    loaded: number;
    loaders: {
        gltfLoader: GLTFLoader;
        textureLoader: THREE.TextureLoader;
        objLoader: OBJLoader;
        cubeTextureLoader: THREE.CubeTextureLoader;
        audioLoader: THREE.AudioLoader;
    };
    application: Application;
    loading: Loading;

    constructor(sources: Resource[]) {
        super();

        this.sources = sources;

        this.items = { texture: {}, cubeTexture: {}, gltfModel: {}, audio: {}, objModel: {}};
        this.toLoad = this.sources.length;
        this.loaded = 0;
        this.application = new Application();
        this.loading = this.application.loading;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {
            gltfLoader: new GLTFLoader(),
            textureLoader: new THREE.TextureLoader(),
            cubeTextureLoader: new THREE.CubeTextureLoader(),
            audioLoader: new THREE.AudioLoader(),
            objLoader: new OBJLoader(),
        };
        const dracoLoader = new DRACOLoader();
        let decoderPath = 'https://www.gstatic.com/draco/v1/decoders/';

        dracoLoader.setDecoderPath(decoderPath);
        dracoLoader.setDecoderConfig({type: 'js'}); // Optional: Override detection of WASM support.
        this.loaders.gltfLoader.setDRACOLoader(dracoLoader);
    }

    startLoading() {
        // Load each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file);
                });
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file) => {
                    file.encoding = THREE.sRGBEncoding;
                    this.sourceLoaded(source, file);
                });
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file);
                });
            } else if (source.type === 'audio') {
                this.loaders.audioLoader.load(source.path, (buffer) => {
                    this.sourceLoaded(source, buffer);
                });
            } else if (source.type === 'objModel') {
                if (!this.application.isMobile) {
                    this.loaders.objLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file);
                    });
                    
                }else{
                    this.toLoad--;
                }
            }
            console.log(source.path)
        }
    }

    sourceLoaded(source: Resource, file: LoadedResource) {
        this.items[source.type][source.name] = file;

        this.loaded++;

        this.loading.trigger('loadedSource', [
            source.name,
            this.loaded,
            this.toLoad,
        ]);

        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }
}
