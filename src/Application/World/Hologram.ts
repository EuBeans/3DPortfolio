import * as THREE from 'three';
import Application from '../Application';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import UIEventBus from '../UI/EventBus';
import Resources from '../Utils/Resources';


export default class Hologram {
    application: Application;
    scene: THREE.Scene;
    loader: OBJLoader;
    mesh: THREE.Points;
    resources: Resources;

    constructor() {
        this.application = new Application();
        this.loader = new OBJLoader();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.loadModel();
        UIEventBus.on('loadingScreenDone', () => {
            this.animate();
        });
        
    }

    loadModel(){
        const object = this.resources.items.objModel.hologramModel;
        const combinedPositions = this.combineBuffer(object, 'position');
        this.createMesh(combinedPositions, 900, 0, 0, 0, 0xFFFFFF);
        
    }
    
    combineBuffer(model: THREE.Object3D, bufferName: string) {
        let count = 0;
    
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const buffer = child.geometry.attributes[bufferName];
                count += buffer.array.length;
            }
        });
    
        const combined = new Float32Array(count);
        let offset = 0;
    
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const buffer = child.geometry.attributes[bufferName];
                combined.set(buffer.array, offset);
                offset += buffer.array.length;
            }
        });
        
        return new THREE.BufferAttribute(combined, 3);
    }

    createMesh(position: THREE.BufferAttribute, scale: number, x: number, y: number, z: number, color: number){
        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute('initialPosition', position);
        const initialPositions = position.clone(); // Clone to modify for initial random state

        // Randomize initial positions
        const initialArray = new Float32Array(initialPositions.array);
        for (let i = 0; i < initialArray.length; i += 3) {
            initialArray[i] = 0; // Set x to middle
            initialArray[i + 1] = 12.1; // Set y to middle
            initialArray[i + 2] = 0; // Set z to middle
        }
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(initialArray, 3));

        const mat = new THREE.PointsMaterial({ 
            color: 0x5e4198, 
            size: 10
        })
        mat.transparent = true;
        mat.opacity = 0.1;
        this.mesh = new THREE.Points(pointsGeometry, mat);
        this.mesh.position.set(x, y, z);
        this.mesh.scale.set(scale, scale, scale);
        this.mesh.visible = true;
        this.mesh.userData = {
            verticesUp: 0, direction: 1, speed: 1 // Only rising up
        };

        this.scene.add(this.mesh);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.render();
    }
    render() {
        if (!this.mesh) return;  
        this.mesh.rotation.y += Math.PI / 300;

        const positions = this.mesh.geometry.attributes.position;
        const initialPositions = this.mesh.geometry.attributes.initialPosition;
        const count = positions.count;
    
        for (let i = 0; i < count; i++) {
            const px = positions.getX(i);
            const py = positions.getY(i);
            const pz = positions.getZ(i);
            const ix = initialPositions.getX(i);
            const iy = initialPositions.getY(i);
            const iz = initialPositions.getZ(i);
    
            // Calculate distance to initial position
            const dx = ix - px;
            const dy = iy - py;
            const dz = iz - pz;
    
            // Move towards initial position
            if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || Math.abs(dz) > 0.01) { // Adjusted threshold to 0.01 for closer approximation
                positions.setXYZ(
                    i,
                    px + dx * 0.005, // Adjust these factors based on desired speed and smoothness
                    py + dy * 0.005,
                    pz + dz * 0.005
                );
            } else {
                this.mesh.userData.verticesUp += 1; // Count vertices that have reached their initial positions
            }
        }
    
        // Stop updating once all vertices are up
        if (this.mesh.userData.verticesUp >= count) {
            return; // Stop the animation or remove this line to keep other animations (like rotation) running
        }
        
        
        positions.needsUpdate = true;
        
    }
    update() {
    }

}
