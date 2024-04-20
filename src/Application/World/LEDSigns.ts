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
    bakedModel: BakedModel;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.bakeModel()
        this.setModel();
        this.addLighSourceToLEDS()

    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.ledSignsModel,
            this.resources.items.texture.ledSignsTexture,
            this.resources.items.texture.ledSignsRoughnessTexture,
            900
        );
        bloomObjects.forEach((objectName) => {
            const object = this.bakedModel.getModel().getObjectByName(objectName);
            if (object) {
                object.layers.enable(BLOOM_SCENE_LAYER);
                if (objectName === "greenNeons") {
                    object.traverse((child) => {
                        if (child instanceof THREE.Object3D) {
                            child.layers.enable(BLOOM_SCENE_LAYER);
                        }
                    });
                }
            }
        });
    }

    addLighSourceToLEDS(){
        //#ce0b5e
        //create folder for LEDBarLight
        const LEDBarLight = new THREE.SpotLight(0xcb0e0e, guiParams.ledLightBar.intensity, guiParams.ledLightBar.distance, guiParams.ledLightBar.angle, guiParams.ledLightBar.penumbra, guiParams.ledLightBar.decay);
        LEDBarLight.position.set(guiParams.ledLightBar.x, guiParams.ledLightBar.y, guiParams.ledLightBar.z);
        this.scene.add(LEDBarLight);

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


    setModel() {
        this.scene.add(this.bakedModel.getModel());
    }

    update() {
    }
}
