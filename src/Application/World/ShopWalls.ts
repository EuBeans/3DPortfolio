import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
import { guiParams } from '../Utils/GuiParams';
const BLOOM_SCENE_LAYER = 1;

const bloomObjects: string[]= [
    "RoofTiles1",
    "RoofTiles2",
    "RoofTiles3",
    "RoofTiles4",
    "Cube005",
    "Fluorescent_Light_2",
    "Plane018"
]

export default class ShopWalls {
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
            this.resources.items.gltfModel.shopWallsModel,
            this.resources.items.texture.shopWallsTexture,
            this.resources.items.texture.shopWallsRoughnessTexture,
            900,
        );
        this.bakedModel.getModel().castShadow = true;
        this.bakedModel.getModel().receiveShadow = true;
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

    update() {
        

    }
}
