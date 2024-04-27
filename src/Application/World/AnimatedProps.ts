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

export default class AnimatedProps {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModels: BakedModel[];
    mixer: AnimationMixer | null = null;
    garageDoorMixer: AnimationMixer | null = null;
    garageDoorIsOpen: boolean = false;
    isLoadingScreenDone: boolean = false;
    freeCamOn: boolean = false;


    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.bakedModels = [];
        this.bakeModel();
        this.setModel();
        this.setFreeCamListeners();
        
        //loadingScreenDone ui event
        UIEventBus.on('loadingScreenDone', () => {
            this.isLoadingScreenDone = true;
            this.playPropAnimationLoop();

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
        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.animatedPropsModel,
            this.resources.items.texture.animatedPropsTexture,
            undefined,
            900,
        ));

        this.bakedModels.push(new BakedModel(
            this.resources.items.gltfModel.garageDoorModel,
            this.resources.items.texture.garageDoorTexture,
           undefined,
            900,
        ));

       

        const satelliteObject = this.bakedModels[0].getModel().getObjectByName("Satelite");
        if (satelliteObject instanceof THREE.Mesh) {
            satelliteObject.material.side = THREE.DoubleSide;
            satelliteObject.material.transparent = false;
            satelliteObject.material.opacity = 1.0;
            satelliteObject.material.alphaMap = null;
            satelliteObject.material.alphaTest = 0.5;
            satelliteObject.material.depthWrite = true;
            satelliteObject.renderOrder = 1;
        }

        // Assuming you want to use the first model in the bakedModels array
        this.mixer = new AnimationMixer(this.bakedModels[0].getModel());
        this.garageDoorMixer = new AnimationMixer(this.bakedModels[1].getModel()); // Assuming the garage door is part of the first bakedModel
    }


    setFreeCamListeners() {
        UIEventBus.on('freeCamToggle', (toggle: boolean) => {
            // Check if toggling out of free cam and the garage door is open
            
            if (!toggle && this.garageDoorIsOpen) {
                this.playCloseAnimation(); // Play the closing animation
            } else {
                this.freeCamOn = toggle; // Update the free cam state
                // If toggling into free cam, ensure the door is considered closed without animation
                if (toggle) {
                    this.garageDoorIsOpen = false;
                    if (this.garageDoorMixer) this.garageDoorMixer.stopAllAction(); // Stop any ongoing animations
                    UIEventBus.dispatch('doneAnimating',true);
                }
            }
        });
    }
    playCloseAnimation() {
        UIEventBus.dispatch('doneAnimating',false);
    
        this.garageDoorMixer ? this.garageDoorMixer.stopAllAction() : null;
        const animationClip = this.resources.items.gltfModel.garageDoorModel.animations.find(clip => clip.name === 'gartentor_close');
        if (animationClip && this.garageDoorMixer) {
            const action = this.garageDoorMixer.clipAction(animationClip);
            action.setLoop(LoopOnce, 1);
            action.timeScale = 5;
            action.clampWhenFinished = true;
            action.play();
    
            this.garageDoorMixer.addEventListener('finished', (e) => {
                if (e.action === action) {
                    this.garageDoorIsOpen = false;
                    UIEventBus.dispatch('doneAnimating',true);
                }
            });
        }
    }
    
    playOpenAnimation(){
        UIEventBus.dispatch('doneAnimating',false);

        this.garageDoorMixer ? this.garageDoorMixer.stopAllAction() : null;
        const animationClip = this.resources.items.gltfModel.garageDoorModel.animations.find(clip => clip.name === 'gartentor_open');
        if (animationClip && this.garageDoorMixer) {
            const action = this.garageDoorMixer.clipAction(animationClip);
            action.setLoop(LoopOnce, 1);
            action.timeScale = 5;
            action.clampWhenFinished = true;
            action.play();
    
            this.garageDoorMixer.addEventListener('finished', (e) => {
                if (e.action === action) {
                    this.garageDoorIsOpen = true;
                    UIEventBus.dispatch('doneAnimating',true);
                }
            });
        }
    }

    playPropAnimationLoop(){
        console.log(this.resources.items.gltfModel.animatedPropsModel.animations)

        const animationClip = this.resources.items.gltfModel.animatedPropsModel.animations.find(clip => clip.name === 'ACAction');
        if (animationClip && this.mixer) {
            const acAction = this.mixer.clipAction(animationClip);
            acAction.setLoop(THREE.LoopOnce, 1);
            acAction.timeScale = 1;
            acAction.clampWhenFinished = true;
            acAction.play();

            this.mixer.addEventListener('finished', (e) => {
                if (e.action === acAction) {
                    acAction.reset().play();
                }
            });
        }

        const animationSatClip = this.resources.items.gltfModel.animatedPropsModel.animations.find(clip => clip.name === 'SateliteAction');
        if (animationSatClip && this.mixer) {
            const satAction = this.mixer.clipAction(animationSatClip);
            satAction.setLoop(THREE.LoopOnce, 1);
            satAction.timeScale = 1;
            satAction.clampWhenFinished = true;
            satAction.play();

            this.mixer.addEventListener('finished', (e) => {
                if (e.action === satAction) {
                    satAction.reset().play();
                }
            });
        }
    }

    setModel() {
        this.bakedModels.forEach(model => {
            this.scene.add(model.getModel());
        });
    }

    update() {
        const deltaTime = this.application.clock.getDelta();
        // Call this in your animation loop
        if (this.mixer) this.mixer.update(deltaTime);
        if (this.garageDoorMixer) this.garageDoorMixer.update(deltaTime);
    }
}
