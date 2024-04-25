import * as THREE from 'three';
import Application from '../Application';
import Time from '../Utils/Time';

// Assuming you have a way to import shaders similar to CoffeeSteam
// @ts-ignore
import rainVertexShader from '../Shaders/rain/vertex.glsl';
// @ts-ignore
import rainFragmentShader from '../Shaders/rain/fragment.glsl';

export default class Rain {
    application: Application;
    scene: THREE.Scene;
    time: Time;
    model: any;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.time = this.application.time;

        this.setModel();
    }

    setModel() {
        const raindropCount = 5000;
        const positions = new Float32Array(raindropCount * 3);
        for (let i = 0; i < raindropCount; i++) {
            positions[i * 3] = Math.random() * 100000 - 50000; // x-axis
            positions[i * 3 + 1] = Math.random() * 100000 - 30000; // y-axis (randomized)
            positions[i * 3 + 2] = Math.random() * 100000 - 30000; // z-axis
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }
            },
            vertexShader: rainVertexShader,
            fragmentShader: rainFragmentShader,
            transparent: true
        });

        this.model = new THREE.Points(geometry, material);
        this.model.layers.set(5); // 
        this.scene.add(this.model);
    }

    update() {

        this.model.material.uniforms.uTime.value = this.time.elapsed * 0.05; // Adjust time scale if necessary
    }
}
