import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
import { guiParams } from '../Utils/GuiParams';
import { AnimationMixer, LoopOnce } from 'three';
import UIEventBus from '../UI/EventBus';

const BLOOM_SCENE_LAYER = 1;

const bloomObjects: string[]= [

]

export default class GarageDoor {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel: BakedModel;
    mixer: AnimationMixer | null = null;
    garageDoorIsOpen: boolean = false;
    isLoadingScreenDone: boolean = false;
    freeCamOn: boolean = false;


    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.bakeModel();
        this.setModel();console.log(this.resources.items.gltfModel.garageDoorModel.animations)
        this.setFreeCamListeners();
        //loadingScreenDone ui event
        UIEventBus.on('loadingScreenDone', () => {
            console.log("LOADING SCREEN DONE")
            this.isLoadingScreenDone = true;
        });
        UIEventBus.on('transitionStarted', () => {
            if(this.isLoadingScreenDone && !this.freeCamOn) {                
                if(this.garageDoorIsOpen) {
                    this.playCloseAnimation();
                } else {
                    this.playOpenAnimation();
                }
            }
        });       
    }
 
    bakeModel() { 
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.garageDoorModel,
            this.resources.items.texture.garageDoorTexture,
            this.resources.items.texture.garageDoorRoughnessTexture,
            900,
        );
        this.bakedModel.getModel().castShadow = true;
        this.bakedModel.getModel().receiveShadow = true;
        this.mixer = new AnimationMixer(this.bakedModel.getModel());
        
    }


    setFreeCamListeners() {
        UIEventBus.on('freeCamToggle', (toggle: boolean) => {
            // Check if toggling out of free cam and the garage door is open
            console.log(toggle,this.garageDoorIsOpen)
            
            if (!toggle && this.garageDoorIsOpen) {
                this.playCloseAnimation(); // Play the closing animation
            } else {
                this.freeCamOn = toggle; // Update the free cam state
                // If toggling into free cam, ensure the door is considered closed without animation
                if (toggle) {
                    this.garageDoorIsOpen = false;
                    if (this.mixer) this.mixer.stopAllAction(); // Stop any ongoing animations
                    UIEventBus.dispatch('doneAnimating',true);
                }
            }
        });
    }
    playCloseAnimation() {
        UIEventBus.dispatch('doneAnimating',false);

        this.mixer ? this.mixer.stopAllAction() : null;
        const animationClip = this.resources.items.gltfModel.garageDoorModel.animations.find(clip => clip.name === 'gartentor_close');
        if (animationClip && this.mixer) {
            const action = this.mixer.clipAction(animationClip);
            action.setLoop(LoopOnce, 1);
            action.timeScale = 2;
            action.clampWhenFinished = true;
            action.play();

            this.mixer.addEventListener('finished', (e) => {
                if (e.action === action) {
                    this.garageDoorIsOpen = false;
                    UIEventBus.dispatch('doneAnimating',true);
                    console.log("DONE OPENING")

                }
            });
        }

    }

    playOpenAnimation(){
        UIEventBus.dispatch('doneAnimating',false);

        this.mixer ? this.mixer.stopAllAction() : null;
        const animationClip = this.resources.items.gltfModel.garageDoorModel.animations.find(clip => clip.name === 'gartentor_open');

        if (animationClip && this.mixer) {
            const action = this.mixer.clipAction(animationClip);
            action.setLoop(LoopOnce, 1);
            action.timeScale = 2;
            action.clampWhenFinished = true;
            action.play();

            this.mixer.addEventListener('finished', (e) => {
                if (e.action === action) {
                    this.garageDoorIsOpen = true;
                    console.log("DONE CLOSING")
                    UIEventBus.dispatch('doneAnimating',true);
                }
            });
        }

    }

 
    
    setModel() {
        this.scene.add(this.bakedModel.getModel());
    }

     update() {
        const deltaTime = this.application.clock.getDelta();
        // Call this in your animation loop
        if (this.mixer) this.mixer.update(deltaTime);
    }
}
