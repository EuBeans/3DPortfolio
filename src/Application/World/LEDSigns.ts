import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
import { guiParams } from '../Utils/GuiParams';
const BLOOM_SCENE_LAYER = 1;

const bloomObjects: string[]= [
    "ScrewDriver",
    'SecondWord',
    'repairSignOutside',
    'greenNeons',
    'PurperNeon',
    'TextNeon',
    'GreenNeon',
    'PurpleNeon',
    'RepairSignText'
]

export default class LEDSigns {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModels: BakedModel[];

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.bakedModels = [];
        this.bakeModel()
        this.setModel();

    }

    bakeModel() {
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.ledSigns1Model,
            this.resources.items.texture.ledSigns1Texture,
            undefined,
            900
        ));
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.ledSigns2Model,
            this.resources.items.texture.ledSigns2Texture,
            undefined,
            900
        ));



        bloomObjects.forEach((objectName) => {
            this.bakedModels.forEach((bakedModel) => {
                const object = bakedModel.getModel().getObjectByName(objectName);
                if (object) {
              
                    object.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            
                            child.layers.enable(BLOOM_SCENE_LAYER);
                        }
                    });
                }
            });
        });
    }



    setModel() {
        this.bakedModels.forEach((bakedModel) => {
            this.scene.add(bakedModel.getModel());
        });
    }

    update() {
    }
}
