import * as THREE from 'three';
import { guiParams } from './GuiParams';
export default class BakedModel {
    model: LoadedModel;
    texture: LoadedTexture;
    roughnessTexture?: THREE.Texture; // Optional roughness texture
    material: THREE.MeshBasicMaterial | THREE.MeshStandardMaterial; // Adjusted to possibly use MeshStandardMaterial

    constructor(model: LoadedModel, texture?: LoadedTexture, roughnessTexture?: LoadedTexture,scale?: number,) {
        this.model = model;
        this.texture = texture as THREE.Texture;
        this.roughnessTexture = roughnessTexture as THREE.Texture;

        if (this.texture) {
            this.texture.flipY = false;
            this.texture.encoding = THREE.sRGBEncoding;
        }

        // Load and apply the roughness texture if provided
        if (this.roughnessTexture) {

            // Use MeshStandardMaterial to support roughness maps
            this.material = new THREE.MeshStandardMaterial({
                map: this.texture,
                roughnessMap: this.roughnessTexture,
                // Set roughness if you want a default value or control it through the texture
            });
        } else if (this.texture) {
            this.material = new THREE.MeshBasicMaterial({
                map: this.texture,
            });
        } else {
            this.material = new THREE.MeshBasicMaterial({ color: 'grey' });
        }

        // Apply the material to all child meshes
        this.model.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = this.material;
            }
        });

        // Optionally, scale the model
        if (scale) {
            this.model.scene.scale.set(scale, scale, scale);
        }

        return this;
    }

    getModel(): THREE.Group {
        return this.model.scene;
    }
}
