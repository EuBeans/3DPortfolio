import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
const BLOOM_SCENE_LAYER = 1;

const bloomObjects: string[]= [
    'PowerCableBigXLights',
    'PowerCableSmallXLights'
]

export default class CablesAndPipes {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel: BakedModel;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        //this.loadModel();
        this.bakeModel()
        this.setModel();
    }
    loadModel(){
        this.resources.items.gltfModel.cablesAndPipesModel.scene.scale.set(900,900,900)
        this.resources.items.gltfModel.cablesAndPipesModel.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && (child.material.name === 'CableLight' || child.material.name === 'PowerCableNeon' )) {
                child.layers.enable(BLOOM_SCENE_LAYER);
            }
        });
        this.scene.add(this.resources.items.gltfModel.cablesAndPipesModel.scene)
    }



    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.cablesAndPipesModel,
            this.resources.items.texture.cablesAndPipesTexture,
            this.resources.items.texture.cablesAndPipesRoughnessTexture,
            900
        );

    bloomObjects.forEach((objectName) => {
        if (objectName.includes('PowerCableBig')) {
            for (let i = 1; i <= 4; i++) {
                const object = this.bakedModel.getModel().getObjectByName(objectName.replace('X', i.toString()));
                if (object) {
                    object.layers.enable(BLOOM_SCENE_LAYER);
                }
            }
        } else if (objectName.includes('PowerCableSmall')) {
            for (let i = 1; i <= 7; i++) {
                const object = this.bakedModel.getModel().getObjectByName(objectName.replace('XLights', i.toString() + 'Lights'));
                if (object) {
                    object.layers.enable(BLOOM_SCENE_LAYER);
                }
            }
        }
    });

        
    }

    setModel() {
        this.scene.add(this.bakedModel.getModel());
    }

    update() {}
}
