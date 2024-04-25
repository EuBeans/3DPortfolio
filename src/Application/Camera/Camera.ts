import * as THREE from 'three';
import Application from '../Application';
import Sizes from '../Utils/Sizes';
import EventEmitter from '../Utils/EventEmitter';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';
import Renderer from '../Renderer';
import Resources from '../Utils/Resources';
import UIEventBus from '../UI/EventBus';
import Time from '../Utils/Time';
import BezierEasing from 'bezier-easing';
import {
    CameraKeyframeInstance,
    MonitorKeyframe,
    IdleKeyframe,
    LoadingKeyframe,
    OrbitControlsStart,
    ComputerCameraPathKeyframe
} from './CameraKeyframes';



export enum CameraKey {
    IDLE = 'idle',
    MONITOR = 'monitor',
    LOADING = 'loading',
    ORBIT_CONTROLS_START = 'orbitControlsStart',
    COMPUTER_CAMERA_PATH = 'computerCameraPath',
}
export default class Camera extends EventEmitter {
    application: Application;
    sizes: Sizes;
    scene: THREE.Scene;
    instance: THREE.PerspectiveCamera;
    renderer: Renderer;
    resources: Resources;
    time: Time;

    position: THREE.Vector3;
    focalPoint: THREE.Vector3;

    freeCam: boolean;
    orbitControls: OrbitControls;
    computerCameraPath: { position: THREE.Vector3, focalPoint: THREE.Vector3 }[];
    idleCameraPath: { position: THREE.Vector3, focalPoint: THREE.Vector3 }[];
    currentKeyframe: CameraKey | undefined;
    targetKeyframe: CameraKey | undefined;
    keyframes: { [key in CameraKey]: CameraKeyframeInstance };
    garageDoneAnimating: boolean = true;
    constructor() {
        super();
        this.application = new Application();
        this.sizes = this.application.sizes;
        this.scene = this.application.scene;
        this.renderer = this.application.renderer;
        this.resources = this.application.resources;
        this.time = this.application.time;
        this.computerCameraPath = [
            {
                position: new THREE.Vector3(-5000, 3500, 20110),
                focalPoint: new THREE.Vector3(3300, 3000, -1900),
            },
            {
                position: new THREE.Vector3(-4000, 3500, 5110),
                focalPoint: new THREE.Vector3(3300, 3000, -1900),
            },
        ]
        this.idleCameraPath = [
            {
                position: new THREE.Vector3(-8000, 3500, 20110),
                focalPoint: new THREE.Vector3(3300, 3000, -1900),
            },
            {
                position: new THREE.Vector3(5000, 3500, 20110),
                focalPoint: new THREE.Vector3(3300, 3000, -1900),
            },
        ];
        
        UIEventBus.on('doneAnimating',(bool:boolean)=>{
            this.garageDoneAnimating = bool;
        })

        this.position = new THREE.Vector3(0, 0, 0);
        this.focalPoint = new THREE.Vector3(0, 0, 0);

        this.freeCam = false;

        this.keyframes = {
            idle: new IdleKeyframe(),
            monitor: new MonitorKeyframe(),
            loading: new LoadingKeyframe(),
            orbitControlsStart: new OrbitControlsStart(),
            computerCameraPath: new ComputerCameraPathKeyframe(),
        };

        document.addEventListener('mousedown', (event) => {
            event.preventDefault();
            // @ts-ignore
            if (event.target.id === 'prevent-click') return;
            // print target and current keyframe
            if (
                (this.currentKeyframe === CameraKey.IDLE ||
                this.targetKeyframe === CameraKey.IDLE) && this.garageDoneAnimating
            ) {
                this.transitionAlongPath(this.computerCameraPath, 2000,CameraKey.MONITOR); // Adjust duration as needed
                
            } else if (
                (this.currentKeyframe === CameraKey.MONITOR ||
                this.targetKeyframe === CameraKey.MONITOR) && this.garageDoneAnimating
            ) {

                this.transitionAlongPath(this.idleCameraPath, 2000,CameraKey.IDLE); // Adjust duration as needed
                //this.garageDoor.playCloseAnimation();
                UIEventBus.dispatch('transitionStarted',undefined);
            }
        });
        
        this.transition(CameraKey.IDLE);
        this.setPostLoadTransition();
        this.setInstance();
        this.setFreeCamListeners();
    
    }

    transitionAlongPath(path: { position: THREE.Vector3, focalPoint: THREE.Vector3 }[], durationPerSegment: number = 2000, key: CameraKey) {
        if (this.currentKeyframe === key) return;
        this.currentKeyframe = undefined;
        this.targetKeyframe = CameraKey.COMPUTER_CAMERA_PATH;

        if (this.targetKeyframe) TWEEN.removeAll();
        let currentIndex = 0;
       
        //this.garageDoor.playAnimation();
        if(key === CameraKey.MONITOR) {
            UIEventBus.dispatch('transitionStarted',undefined);
        }
       


        const moveToNextPoint = () => {
            if (currentIndex >= path.length) return; // End of path
   

      
            const segment = path[currentIndex];
            const nextPosition = segment.position;
            const nextFocalPoint = segment.focalPoint;

            // Tween for camera position
            const posTween = new TWEEN.Tween(this.position)
                .to({ x: nextPosition.x, y: nextPosition.y, z: nextPosition.z }, durationPerSegment)
                .easing(TWEEN.Easing.Quadratic.InOut);

            // Tween for focal point
            const focTween = new TWEEN.Tween(this.focalPoint)
                .to({ x: nextFocalPoint.x, y: nextFocalPoint.y, z: nextFocalPoint.z }, durationPerSegment)
                .easing(TWEEN.Easing.Quadratic.InOut);

            let completeCount = 0;
            const checkComplete = () => {
                completeCount++;
                if (completeCount === 2) { // Ensure both tweens have completed
                    currentIndex++;
                    if (currentIndex === path.length - 1) { // Check if it's the last index

                        this.transition(key,3000,TWEEN.Easing.Exponential.Out); // Transition to the monitor keyframe
                    } else {
                        moveToNextPoint();
                    }
                }
            };

            // When the current segment's animation is complete, move to the next
            posTween.onComplete(checkComplete);
            focTween.onComplete(checkComplete);

            posTween.start();
            focTween.start();
        };
        
        moveToNextPoint(); // Start the path transition


    }

    transition(
        key: CameraKey,
        duration: number = 1000,
        easing?: any,
        callback?: () => void
    ) {
        if (this.currentKeyframe === key) return;

        if (this.targetKeyframe) TWEEN.removeAll();

        this.currentKeyframe = undefined;
        this.targetKeyframe = key;

        const keyframe = this.keyframes[key];

        const posTween = new TWEEN.Tween(this.position)
            .to(keyframe.position, duration)
            .easing(easing || TWEEN.Easing.Quintic.InOut)
            .onComplete(() => {
                this.currentKeyframe = key;
                this.targetKeyframe = undefined;
                if (callback) callback();
            });

        const focTween = new TWEEN.Tween(this.focalPoint)
            .to(keyframe.focalPoint, duration)
            .easing(easing || TWEEN.Easing.Quintic.InOut);

        posTween.start();
        focTween.start();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            10,
            900000
        );
        this.currentKeyframe = CameraKey.LOADING;

        this.scene.add(this.instance);
    }
    




    setFreeCamListeners() {
        UIEventBus.on('freeCamToggle', (toggle: boolean) => {
            // if (toggle === this.freeCam) return;
            if (toggle) {
                this.transition(
                    CameraKey.ORBIT_CONTROLS_START,
                    750,
                    BezierEasing(0.13, 0.99, 0, 1),
                    () => {
                        this.instance.position.copy(
                            this.keyframes.orbitControlsStart.position
                        );

                        this.orbitControls.update();
                        this.freeCam = true;
                    }
                );
                // @ts-ignore
                document.getElementById('webgl').style.pointerEvents = 'auto';
            } else {
                this.freeCam = false;
                this.transition(
                    CameraKey.IDLE,
                    4000,
                    TWEEN.Easing.Exponential.Out
                );
                // @ts-ignore
                document.getElementById('webgl').style.pointerEvents = 'none';
            }
        });
    }

    setPostLoadTransition() {
        UIEventBus.on('loadingScreenDone', () => {
            this.transition(CameraKey.IDLE, 2500, TWEEN.Easing.Exponential.Out);
        });
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    createControls() {
        this.renderer = this.application.renderer;
        this.orbitControls = new OrbitControls(
            this.instance,
            this.renderer.instance.domElement
        );

        const { x, y, z } = this.keyframes.orbitControlsStart.focalPoint;
        this.orbitControls.target.set(x, y , z);

        this.orbitControls.enablePan = false;
        this.orbitControls.enableDamping = true;
        this.orbitControls.object.position.copy(
            this.keyframes.orbitControlsStart.position
            
        );
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.maxPolarAngle = Math.PI / 2;
        this.orbitControls.minDistance = 22000;
        this.orbitControls.maxDistance = 50000;

        this.orbitControls.update();
    }


    update() {
        TWEEN.update();
        if (this.freeCam && this.orbitControls) {
            this.position.copy(this.orbitControls.object.position);
            this.focalPoint.copy(this.orbitControls.target);
            this.orbitControls.update();
            return;
        }

        for (const key in this.keyframes) {
            const _key = key as CameraKey;
            this.keyframes[_key].update();
        }

        if (this.currentKeyframe) {
            const keyframe = this.keyframes[this.currentKeyframe];
            this.position.copy(keyframe.position);
            this.focalPoint.copy(keyframe.focalPoint);
        }

        this.instance.position.copy(this.position);
        this.instance.lookAt(this.focalPoint);
    }
}
