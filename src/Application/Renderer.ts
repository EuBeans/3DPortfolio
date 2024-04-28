import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import Application from './Application';
import Sizes from './Utils/Sizes';
import Camera from './Camera/Camera';
import UIEventBus from './UI/EventBus';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// @ts-ignore
import screenVert from './Shaders/screen/vertex.glsl';
// @ts-ignore
import screenFrag from './Shaders/screen/fragment.glsl';
import Time from './Utils/Time';
import Debug from './Utils/Debug';
import { guiParams } from './Utils/GuiParams';

const BLOOM_SCENE = 1
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE)
const darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
const materials: { [key: string]: THREE.Material } = {};


function nonBloomed (obj: THREE.Object3D) {
    if(obj instanceof THREE.Mesh && bloomLayer.test(obj.layers) === false){
        materials[obj.uuid] = obj.material
        obj.material = darkMaterial
    }
}

function restoreMaterial(obj:THREE.Object3D){
    if(materials[obj.uuid] && obj instanceof THREE.Mesh){
        obj.material = materials[obj.uuid]
        delete materials[obj.uuid]
    }
}


const params = {
    threshold: 0,
    strength: 1.4,
    radius: 0.35,
    exposure: 1
};

export default class Renderer {
    application: Application;
    sizes: Sizes;
    scene: THREE.Scene;
    cssScene: THREE.Scene;
    time: Time;
    overlay: THREE.Mesh;
    overlayScene: THREE.Scene;
    camera: Camera;
    overlayInstance: THREE.WebGLRenderer;
    instance: THREE.WebGLRenderer;
    cssInstance: CSS3DRenderer;
    raiseExposure: boolean;
    debug: Debug;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
    composer: EffectComposer;
    bloomComposer: EffectComposer;
    rainComposer: EffectComposer;
    constructor() {
        this.application = new Application();
        this.time = this.application.time;
        this.sizes = this.application.sizes;
        this.scene = this.application.scene;
        this.cssScene = this.application.cssScene;
        this.overlayScene = this.application.overlayScene;
        this.camera = this.application.camera;
        this.debug = this.application.debug


        this.setInstance();
    }




    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        // Settings
        // this.instance.physicallyCorrectLights = true;
        this.instance.outputEncoding = THREE.sRGBEncoding;
        // this.instance.toneMapping = THREE.ACESFilmicToneMapping;
        // this.instance.toneMappingExposure = 0.9;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
        this.instance.setClearColor(0x000000, 0.0);

        // Style
        this.instance.domElement.style.position = 'absolute';
        this.instance.domElement.style.zIndex = '1px';
        this.instance.domElement.style.top = '0px';

        document.querySelector('#webgl')?.appendChild(this.instance.domElement);

        this.overlayInstance = new THREE.WebGLRenderer();
        this.overlayInstance.setSize(this.sizes.width, this.sizes.height);
        this.overlayInstance.domElement.style.position = 'absolute';
        this.overlayInstance.domElement.style.top = '0px';
        this.overlayInstance.domElement.style.mixBlendMode = 'soft-light';
        this.overlayInstance.domElement.style.opacity = '0.12';
        this.overlayInstance.domElement.style.pointerEvents = 'none';

        document
            .querySelector('#overlay')
            ?.appendChild(this.overlayInstance.domElement);

        this.cssInstance = new CSS3DRenderer();
        this.cssInstance.setSize(this.sizes.width, this.sizes.height);
        this.cssInstance.domElement.style.position = 'absolute';
        this.cssInstance.domElement.style.top = '0px';

        document
            .querySelector('#css')
            ?.appendChild(this.cssInstance.domElement);

        this.uniforms = {
            u_time: { value: 1 },
        };

        const overlayMaterial = new THREE.ShaderMaterial({
            vertexShader: screenVert,
            fragmentShader: screenFrag,
            uniforms: this.uniforms,
            depthTest: false, // Disable depth test
            depthWrite: false, // Disable depth write
            transparent: true, // Enable transparency
        });
        this.overlay = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), overlayMaterial);
        this.overlayScene.add(this.overlay);


        const bloomPass = new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height),3, 2, 0.2);
        bloomPass.threshold = params.threshold;
        bloomPass.strength = params.strength;
        bloomPass.radius = params.radius;
        this.bloomComposer = new EffectComposer(this.instance);
        const renderPass = new RenderPass(this.scene, this.camera.instance);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(renderPass);
        this.bloomComposer.addPass( bloomPass );


        const mixPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture : {value:null},
                    bloomTexture: {value : this.bloomComposer.renderTarget2.texture},
                    bloomIntensity: { value: 0.7} // Adjust this value as needed
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    }
                `,
                fragmentShader: `
                    uniform sampler2D baseTexture;
                    uniform sampler2D bloomTexture;
                    uniform float bloomIntensity; // Add a uniform to control bloom intensity
                    varying vec2 vUv;
                    void main() {
                        vec4 base = texture2D( baseTexture, vUv );
                        vec4 bloom = texture2D( bloomTexture, vUv ) * bloomIntensity; // Apply intensity control
                        gl_FragColor = base + bloom; // Blend base and bloom textures
                    }
                `,
                depthTest: false, // Disable depth test
                depthWrite: false, // Disable depth write
                transparent: true, // Enable transparency
            }),
            "baseTexture"
        );

        mixPass.needsSwap = true;
        this.composer = new EffectComposer(this.instance)
        this.composer.addPass(renderPass)
        this.composer.addPass(mixPass)

    }


    resize() {
        this.composer.setSize(this.sizes.width, this.sizes.height);
        this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
        this.bloomComposer.setSize(this.sizes.width, this.sizes.height);
        this.bloomComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

        
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

        this.cssInstance.setSize(this.sizes.width, this.sizes.height);

        this.overlayInstance.setSize(this.sizes.width, this.sizes.height);
        this.overlayInstance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    updateBloomEffect() {
        // Access the bloom effect parameters directly from guiParams
        const bloomPass = this.bloomComposer.passes[1] as UnrealBloomPass;
        bloomPass.threshold = guiParams.bloom.threshold;
        bloomPass.strength = guiParams.bloom.strength;
        bloomPass.radius = guiParams.bloom.radius;
    }
    update() {
        this.application.camera.instance.updateProjectionMatrix();
        if (this.uniforms) {
            this.uniforms.u_time.value = Math.sin(this.time.current * 0.01);
        }
        if(!this.application.isMobile){
            this.updateBloomEffect();
        
            this.scene.traverse(nonBloomed)
            
            this.bloomComposer.render()

            this.scene.traverse(restoreMaterial)
        }

        // Render the CSS3D scene
        this.cssInstance.render(this.cssScene, this.camera.instance);

        this.composer.render();
        this.overlayInstance.render(this.overlayScene, this.camera.instance);
        this.overlay.position.copy(this.camera.instance.position);

    }
}
