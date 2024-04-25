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
    bakedModel: BakedModel;
    baked2Model: BakedModel;
    mixer: THREE.AnimationMixer;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.mixer = new THREE.AnimationMixer(this.scene);
        this.bakeModel()
        this.setModel();
        this.addLighSource();
    }

    animate(){
        this.scene.animations.forEach((animation) => {
            this.mixer.clipAction(animation).play();
        });
    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.decorsModel,
            this.resources.items.texture.decorsTexture,
            this.resources.items.texture.decorsRoughnessTexture,
            900
        );
        this.baked2Model = new BakedModel(
            this.resources.items.gltfModel.decors2Model,
            this.resources.items.texture.decors2Texture,
            this.resources.items.texture.decors2RoughnessTexture,
            900
        );

        bloomObjects.forEach((objectName) => {
            const object = this.bakedModel.getModel().getObjectByName(objectName);
            if (object) {
                console.log(object.name);
                object.layers.enable(BLOOM_SCENE_LAYER);
            }
        });
    }






    addLighSource(){
        //#ce0b5e
        //create folder for hologramLightSource
        const hologramLightSource = new THREE.PointLight(0x08ceff, guiParams.hologramLightSource.intensity, guiParams.hologramLightSource.distance, guiParams.hologramLightSource.decay);
        hologramLightSource.position.set(guiParams.hologramLightSource.x, guiParams.hologramLightSource.y, guiParams.hologramLightSource.z);
        this.scene.add(hologramLightSource);

        //create folder for hologramLightSource
        const hologramLightSourceFolder = this.application.debug.getGUI().addFolder('HologramLightSource');
        hologramLightSourceFolder.add(hologramLightSource, 'intensity', 0, 30).name('Hologram Light Source Intensity').setValue(guiParams.hologramLightSource.intensity);
        hologramLightSourceFolder.add(hologramLightSource.position, 'x', -50000, 50000).name('Hologram Light Source X').setValue(guiParams.hologramLightSource.x);
        hologramLightSourceFolder.add(hologramLightSource.position, 'y', 0, 20000).name('Hologram Light Source Y').setValue(guiParams.hologramLightSource.y);
        hologramLightSourceFolder.add(hologramLightSource.position, 'z', -50000, 50000).name('Hologram Light Source Z').setValue(guiParams.hologramLightSource.z);
        hologramLightSourceFolder.add(hologramLightSource, 'distance', 0, 70000).name('Hologram Light Source Distance').setValue(guiParams.hologramLightSource.distance);
        hologramLightSourceFolder.add(hologramLightSource, 'decay', 0, 200).name('Hologram Light Source Decay').setValue(guiParams.hologramLightSource.decay);
    
        const hologramLightSource2 = new THREE.PointLight(0x08ceff, 10, 1000, 1);
        hologramLightSource2.position.set(0, 1000, 0);
        this.scene.add(hologramLightSource2);

        // create folder for hologramLightSource2
        const hologramLightSource2Folder = this.application.debug.getGUI().addFolder('HologramLightSource2');
        hologramLightSource2Folder.add(hologramLightSource2, 'intensity', 0, 30).name('Hologram  2 Intensity').setValue(guiParams.hologramLightSource2.intensity);
        hologramLightSource2Folder.add(hologramLightSource2.position, 'x', -20000, 20000).name('Hologram 2 X').setValue(guiParams.hologramLightSource2.x);
        hologramLightSource2Folder.add(hologramLightSource2.position, 'y', 0, 20000).name('Hologram 2 Y').setValue(guiParams.hologramLightSource2.y);
        hologramLightSource2Folder.add(hologramLightSource2.position, 'z', -20000, 20000).name('Hologram 2 Z').setValue(guiParams.hologramLightSource2.z);
        hologramLightSource2Folder.add(hologramLightSource2, 'distance', 0, 50000).name('Hologram 2 Distance').setValue(guiParams.hologramLightSource2.distance);
        hologramLightSource2Folder.add(hologramLightSource2, 'decay', 0, 200).name('Hologram 2 Decay').setValue(guiParams.hologramLightSource2.decay);

        
    
    }       
    setModel() {
        this.scene.add(this.bakedModel.getModel());
        this.scene.add(this.baked2Model.getModel());
    }

    update() {}
}
