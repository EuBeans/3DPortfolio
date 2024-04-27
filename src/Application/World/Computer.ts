import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
const POSITION = new THREE.Vector3(3500, 2300, -2000);
const ROTATION = new THREE.Euler(0, -Math.PI/3, 0);

export default class Computer {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel: BakedModel;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;

        this.bakeModel();
        this.setModel();
    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.computerSetupModel,
            this.resources.items.texture.computerSetupTexture,
            undefined,
            900
        );

    }

    setModel() {
        this.scene.add(this.bakedModel.getModel());
    }
}
