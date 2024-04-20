import * as THREE from 'three';
import Application from '../Application';
import Camera from '../Camera/Camera';
import Mouse from '../Utils/Mouse';

const RENDER_WIREFRAME = false;

export default class Decor {
    application: Application;
    scene: THREE.Scene;
    hitboxes: {
        [key: string]: {
            action: () => void;
        };
    };
    rotation: THREE.Euler;
    onChelve: boolean;
    prevOnChelve:boolean;
    mouseClickInProgress:boolean;
    shouldLeaveChelve: boolean;
    camera: Camera;
    mouse: Mouse;
    raycaster: THREE.Raycaster;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.camera = this.application.camera;
        this.mouse = this.application.mouse;
        this.raycaster = new THREE.Raycaster();
        this.mouseClickInProgress = false;
        this.shouldLeaveChelve =  false;
        this.rotation = new THREE.Euler(0, Math.PI / 3, 0);
        this.createRaycaster();
        this.createChelveHitbox();
    }

    createRaycaster() {
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


            
            this.raycaster.setFromCamera(this.mouse, this.camera.instance);
            const intersects = this.raycaster.intersectObjects(this.scene.children);

             if (intersects.length > 0) {

                if(intersects[0].object.name == 'chelveHitbox'){                
                    this.application.mouse.onChelve = true
                }
                
                // @ts-ignore
                this.onChelve = this.application.mouse.onChelve

                if(this.onChelve && !this.prevOnChelve){
                    this.camera.trigger('enterChelve');
                }

                if(!this.onChelve && this.prevOnChelve && !this.mouseClickInProgress ){
                    this.camera.trigger('leftChelve')
                }

                if(!this.onChelve && this.mouseClickInProgress && this.prevOnChelve){
                    this.shouldLeaveChelve = true
                }else{
                    this.shouldLeaveChelve = false;
                }

                this.application.mouse.trigger('mousemove', [event]);

                this.prevOnChelve = this.onChelve;
            }
        }, false);

       
    }

    createChelveHitbox() {
        this.createHitbox(
            'chelveHitbox',
            () => {
                // this.camera.focusOnMonitor();
            },
            new THREE.Vector3(8000,-200, 1000),
            new THREE.Vector3(1700, 5000, 4500),
            this.rotation
        );
    }

    createHitbox(
        name: string,
        action: () => void,
        position: THREE.Vector3,
        size: THREE.Vector3,
        rotation: THREE.Euler
    ) {
        const wireframeOptions = RENDER_WIREFRAME
            ? {
                  //   wireframe: true,
                  //   wireframeLinewidth: 50,
                  opacity: 1,
              }
            : {};

        // create hitbox material
        const hitboxMaterial = new THREE.MeshBasicMaterial({
            color: 'grey',
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            ...wireframeOptions,
        });

        // create hitbox
        const hitbox = new THREE.Mesh(
            new THREE.BoxBufferGeometry(size.x, size.y, size.z),
            hitboxMaterial
        );

        // set name of the hitbox object
        hitbox.name = name;

        // set hitbox position
        hitbox.position.copy(position);
        hitbox.rotation.copy(rotation)
        // add hitbox to scene
        this.scene.add(hitbox);

        // add hitbox to hitboxes
        this.hitboxes = {
            ...this.hitboxes,
            [name]: {
                action,
            },
        };
    }
    update() {}
}
