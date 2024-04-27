import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
import { guiParams } from '../Utils/GuiParams';
const BLOOM_SCENE_LAYER = 1;

const bloomObjects: string[]= [
    'BatteryLight',
    'BateryLight2',
    'HologramLight',
    'StreetLightNeon',
    'StreeLightExtensionNeon',
    'StreetLightNeon2',
    'StreeLightExtensionNeon2'
]

export default class Decords {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    mixer: THREE.AnimationMixer;
    bakedModels: BakedModel[];

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.mixer = new THREE.AnimationMixer(this.scene);
        this.bakedModels = [];
        this.bakeModel()
        this.setModel();
    }

    animate(){
        this.scene.animations.forEach((animation) => {
            this.mixer.clipAction(animation).play();
        });
    }

    bakeModel() {
        const decorsModels = [
            'decors1Model', 'decors2Model', 'decors3Model', 
            'decors4Model', 'decors5Model', 'decors6Model', 'decors7Model', 'decors8Model'
        ];
        const decorsTextures = [
            'decors1Texture', 'decors2Texture', 'decors3Texture', 
            'decors4Texture', 'decors5Texture', 'decors6Texture', 'decors7Texture', 'decors8Texture'
        ];

        decorsModels.forEach((model, index) => {
            this.bakedModels.push(new BakedModel(
                this.resources.items.gltfModel[model],
                this.resources.items.texture[decorsTextures[index]],
                undefined,
                900
            ));
        });

        bloomObjects.forEach((objectName) => {
            this.bakedModels.forEach((bakedModel) => {
                const object = bakedModel.getModel().getObjectByName(objectName);
                if (object) {
                    object.layers.enable(BLOOM_SCENE_LAYER);
                }
            });
        });
    }

      
    setModel() {
        this.bakedModels.forEach((bakedModel) => {
            this.scene.add(bakedModel.getModel());
        });
    }

    update() {}
}
