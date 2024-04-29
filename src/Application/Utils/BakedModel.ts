import * as THREE from 'three';
import { guiParams } from './GuiParams';
import { LoadedModel, LoadedTexture } from '../../types';

export default class BakedModel {
    model: LoadedModel;
    texture: LoadedTexture;
    roughnessTexture?: THREE.Texture; // Optional roughness texture
    material: THREE.MeshBasicMaterial | THREE.MeshStandardMaterial; // Adjusted to possibly use MeshStandardMaterial

    constructor(model: LoadedModel, texture?: LoadedTexture, roughnessTexture?: LoadedTexture,scale?: number,) {
        this.model = model;
        this.texture = texture as THREE.Texture;

        if (this.texture) {
            this.texture.flipY = false;
            this.texture.encoding = THREE.sRGBEncoding;
            this.texture.minFilter = THREE.NearestMipMapNearestFilter;
            this.texture.magFilter = THREE.LinearMipMapLinearFilter;
            this.texture.type = THREE.HalfFloatType;
            this.texture.generateMipmaps = true;
            this.texture.needsUpdate = true;
            this.texture.wrapS = THREE.ClampToEdgeWrapping;
            this.texture.wrapT = THREE.ClampToEdgeWrapping;

        }

     if (this.texture) {
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
