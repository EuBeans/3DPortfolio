import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
import Camera from '../Camera/Camera';

const PAPER_SIZE = { x: 600, y: 100, z:860};
const RENDER_WIREFRAME = false;


export default class CVPaper {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    paperSize: THREE.Vector3;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    bakedModel: BakedModel;
    prevOnPaper: boolean;
    shouldLeavePaper: boolean;
    mouseClickInProgress: boolean;
    onPaper: boolean;
    camera: Camera;
    mouse: THREE.Vector2;
    raycaster: THREE.Raycaster;
    hitboxes: {
        [key: string]: {
            action: () => void;
        };
    };

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.camera = this.application.camera;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.mouseClickInProgress = false;
        this.shouldLeavePaper = false; 
        this.bakeModel();
        this.setModel();
        this.position = new THREE.Vector3(-2050, -450, 1000);
        this.paperSize = new THREE.Vector3(PAPER_SIZE.x, PAPER_SIZE.y, PAPER_SIZE.z );
        this.rotation = new THREE.Euler(0, Math.PI / 5, 0);
        this.createPaperHitBox();
        this.createRaysOnCVPaper();
    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.cvPaperModel,
            this.resources.items.texture.cvPaperTexture,
            undefined,
            900
        );
    }

    setModel() {
        this.scene.add(this.bakedModel.getModel());
    }

    createRaysOnCVPaper() {
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


            
            this.raycaster.setFromCamera(this.mouse, this.camera.instance);
            const intersects = this.raycaster.intersectObjects(this.scene.children);

             if (intersects.length > 0) {

                if(intersects[0].object.name == 'paperHitBox'){                
                    this.application.mouse.onPaper = true
                }
                
                // @ts-ignore
                this.onPaper = this.application.mouse.onPaper

                if(this.onPaper && !this.prevOnPaper){
                    this.camera.trigger('enterCVPaper');
                }

                if(!this.onPaper && this.prevOnPaper && !this.mouseClickInProgress ){
                    this.camera.trigger('leftCVPaper')
                }

                if(!this.onPaper && this.mouseClickInProgress && this.prevOnPaper){
                    this.shouldLeavePaper = true
                }else{
                    this.shouldLeavePaper = false;
                }

                this.application.mouse.trigger('mousemove', [event]);

                this.prevOnPaper = this.onPaper;
            }
        }, false);


    }

    createPaperHitBox() {
        this.createHitBox(
            'paperHitBox',
            () => {
            },
            this.position,
            this.paperSize,
            this.rotation
        );
    }

    createHitBox(
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


     

 
}
