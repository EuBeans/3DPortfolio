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
    bakedModels: BakedModel[];
    dimPlane: THREE.Mesh;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.bakedModels = [];
        this.bakeModel();
        this.setModel();
    }
 
    bakeModel() { 
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.wallsModel,
            this.resources.items.texture.wallsTexture,
            undefined,
            900,
        ));
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.barModel,
            this.resources.items.texture.barTexture,
            undefined,
            900,
        ));
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.floorModel,
            this.resources.items.texture.floorTexture,
            undefined,
            900,
        ));
        
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.roofExtensionModel,
            this.resources.items.texture.roofExtensionTexture,
            undefined,
            900,
        ));
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.aboutMeModel,
            this.resources.items.texture.aboutMeTexture,
            undefined,
            900,
        ));

        this.dimPlane = this.bakedModels[2].getModel().getObjectByName("Floor") as THREE.Mesh;
        if (this.dimPlane) {
            const materials = Array.isArray(this.dimPlane.material) ? this.dimPlane.material : [this.dimPlane.material];
            materials.forEach(mat => {
                mat.opacity = guiParams.reflection.opacity;
                mat.transparent = true;
            });
        }




        
        bloomObjects.forEach((objectName) => {
            this.bakedModels.forEach((bakedModel) => {
                const object = bakedModel.getModel().getObjectByName(objectName);
                if (object) {
                    object.layers.enable(BLOOM_SCENE_LAYER);
                }
            });
        });
    }

    
    updateReflection() {
        (this.dimPlane.material as THREE.MeshBasicMaterial).opacity = guiParams.reflection.opacity;
    }
    setModel() {
        this.bakedModels.forEach((bakedModel) => {
            this.scene.add(bakedModel.getModel());
        });
    }

    update() {
        this.updateReflection();

    }
}
