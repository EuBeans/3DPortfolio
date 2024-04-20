import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
const BLOOM_SCENE_LAYER = 1;

const bloomObjects: string[]= [
    "StockScreen002",'Cube2441'
]

export default class Screens {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel: BakedModel;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.bakeModel()
        this.setModel();
    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.screensModel,
            this.resources.items.texture.screensTexture,
            this.resources.items.texture.screensRoughnessTexture,
            900
        );
        bloomObjects.forEach((objectName) => {
            const object = this.bakedModel.getModel().getObjectByName(objectName);
            if (object) {
                object.layers.enable(BLOOM_SCENE_LAYER);
            }
        });
    }

    setModel() {
        this.scene.add(this.bakedModel.getModel());
    }

    update() {}
}
