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
        this.addLighSourceToLEDS()

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

    addLighSourceToLEDS(){
        //0xce0b5e
        //create folder for LEDBarLight
        const LEDBarLight = new THREE.SpotLight(0x42e3f5, guiParams.ledLightBar.intensity, guiParams.ledLightBar.distance, guiParams.ledLightBar.angle, guiParams.ledLightBar.penumbra, guiParams.ledLightBar.decay);
        LEDBarLight.position.set(guiParams.ledLightBar.x, guiParams.ledLightBar.y, guiParams.ledLightBar.z);
        this.scene.add(LEDBarLight);

        if(this.application.debug.getGUI()){
                //create folder for LEDBarLight
            const LEDBarLightFolder = this.application.debug.getGUI().addFolder('LEDBarLight');
            LEDBarLightFolder.add(LEDBarLight, 'intensity', 0, 30).name('LED Bar Light Intensity').setValue(guiParams.ledLightBar.intensity);
            LEDBarLightFolder.add(LEDBarLight.position, 'x', -50000, 50000).name('LED Bar Light X').setValue(guiParams.ledLightBar.x);
            LEDBarLightFolder.add(LEDBarLight.position, 'y', 0, 20000).name('LED Bar Light Y').setValue(guiParams.ledLightBar.y);
            LEDBarLightFolder.add(LEDBarLight.position, 'z', -50000, 50000).name('LED Bar Light Z').setValue(guiParams.ledLightBar.z);
            LEDBarLightFolder.add(LEDBarLight, 'distance', 0, 70000).name('LED Bar Light Distance').setValue(guiParams.ledLightBar.distance);
            LEDBarLightFolder.add(LEDBarLight, 'decay', 0, 200).name('LED Bar Light Decay').setValue(guiParams.ledLightBar.decay);
            LEDBarLightFolder.add(LEDBarLight, 'angle', 0, Math.PI).name('LED Bar Light Angle').setValue(guiParams.ledLightBar.angle);
            LEDBarLightFolder.add(LEDBarLight, 'penumbra', 0, 1).name('LED Bar Light Penumbra').setValue(guiParams.ledLightBar.penumbra);
        }
    }
       


    setModel() {
        this.bakedModels.forEach((bakedModel) => {
            this.scene.add(bakedModel.getModel());
        });
    }

    update() {
    }
}
