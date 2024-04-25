import HolographicMaterial from '../Utils/HolographicMaterialVanilla';


import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Application from '../Application';
import Resources from '../Utils/Resources';


export default class HoloHelpScreen {
    application: Application;
    scene: THREE.Scene;
    loader: GLTFLoader;
    holographicMaterial: HolographicMaterial;
    resources: Resources;

    constructor() {
        this.application =  new Application();;
        this.scene = this.application.scene;
        this.loader = new GLTFLoader();
        this.resources = this.application.resources;
        this.holographicMaterial = new HolographicMaterial({
            fresnelOpacity: 0.2,
            fresnelAmount: 0.1,
            scanlineSize: 7,
            hologramBrightness: 1,
            signalSpeed: 2,
            enableBlinking: true,
            blinkFresnelOnly: true,
            hologramOpacity: 0.7,
            blendMode: THREE.NormalBlending,
            side: THREE.DoubleSide,
            depthTest: true,
            clock: this.application.clock
        });
        this.loadModel();
        this.startAnimationLoop();

    }

    loadModel() {
        const holographicMaterial = this.holographicMaterial;
        const model = this.resources.items.gltfModel.hologramHelperModel;
        
        model.scene.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    (child as THREE.Mesh).material = holographicMaterial;
                }
            });
        // Adjust the model position and scale as needed
        model.scene.position.set(0, 0, 0);
        model.scene.scale.set(900, 900, 900);
        this.scene.add(model.scene);
        
    }

    startAnimationLoop() {
        const tick = () => {
            this.holographicMaterial.update(); // Update the holographic material time uniform
            window.requestAnimationFrame(tick);
        };

        tick();
    }


    update() {
        this.holographicMaterial.update();
    }
}