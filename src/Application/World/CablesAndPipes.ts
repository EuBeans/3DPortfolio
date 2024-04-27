import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
const BLOOM_SCENE_LAYER = 1;

const bloomObjects: string[]= [

]

export default class CablesAndPipes {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModels: BakedModel[];

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.bakedModels = [];
        //this.loadModel();
        this.bakeModel()
        this.setModel();
    }


    bakeModel() {
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.cablesModel,
            this.resources.items.texture.cablesTexture,
            undefined,
            900
        ))
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.bigCables1Model,
            this.resources.items.texture.bigCables1Texture,
            undefined,
            900
        ))
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.bigCables2Model,
            this.resources.items.texture.bigCables2Texture,
            undefined,
            900
        ))
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.bigCables3Model,
            this.resources.items.texture.bigCables3Texture,
            undefined,
            900
        ))
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.pipesModel,
            this.resources.items.texture.pipesTexture,
            undefined,
            900
        ))

        bloomObjects.forEach((objectName) => {
            if (objectName.includes('PowerCableBig')) {
                for (let i = 1; i <= 5; i++) {
                    const object = this.bakedModels[0].getModel().getObjectByName(objectName.replace('X', i.toString()));
                    if (object) {
                        object.layers.enable(BLOOM_SCENE_LAYER);
                    }
                }
            } else if (objectName.includes('PowerCableSmall')) {
                for (let i = 1; i <= 7; i++) {
                    const object = this.bakedModels[0].getModel().getObjectByName(objectName.replace('XLights', i.toString() + 'Lights'));
                    if (object) {
                        object.layers.enable(BLOOM_SCENE_LAYER);
                    }
                }
            }
        });

        
    }

    setModel() {
        this.bakedModels.forEach((bakedModel) => {
            this.scene.add(bakedModel.getModel());
        });
    }

    update() {}
}
