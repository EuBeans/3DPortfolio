import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import Application from '../Application';
import Time from '../Utils/Time';
import Resources from '../Utils/Resources';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// @ts-ignore
import vertexShader from '../Shaders/rainEffect/vertex.glsl';
// @ts-ignore
import fragmentShader from '../Shaders/rainEffect/fragment.glsl';

export default class RainEffect {
    application: Application;
    scene: THREE.Scene;
    camera: THREE.Camera;
    mesh: THREE.Mesh;
    resources: Resources;


    constructor() {
        this.application = new Application();;
        this.scene = this.application.scene;
        this.camera = this.application.camera.instance;
        this.resources = this.application.resources;
        
        this.initMesh();
    }

    initMesh() {
        const sizes = this.application.sizes;
        const geometry = new THREE.PlaneGeometry(sizes.width * 0.1, sizes.height * 0.1);
        const material = new THREE.ShaderMaterial({  vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
              u_time: { value: 0 },
              u_texture: { value: this.resources.items.texture.monitorShadowTexture },
            },
            transparent: true,
            opacity: 0.5,
        }); // Create a material, set its color to red
        this.mesh = new THREE.Mesh(geometry, material); // Create a mesh with the geometry and material


        //this.scene.add(this.mesh);
        //this.scene.add(this.mesh);
    }

    update() {
        const distanceInFront = 100; // Adjust based on desired distance from camera

        // Assuming the camera orbits around a point, we calculate the direction it's facing.
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
    
        // Calculate a new position based on the camera's orientation and the desired distance in front.
        const newPosition = direction.normalize().multiplyScalar(distanceInFront).add(this.camera.position);
    
        // Set the object's position to the new calculated position.
        this.mesh.position.copy(newPosition);

        // Copy the camera's quaternion to the object to match its orientation.
        this.mesh.quaternion.copy(this.camera.quaternion);

        if ((this.mesh.material as THREE.ShaderMaterial).uniforms.u_time !== undefined) {
            (this.mesh.material as THREE.ShaderMaterial).uniforms.u_time.value += 0.05;
        }
        // Optionally, log the direction and new position for debugging.
    }
}

