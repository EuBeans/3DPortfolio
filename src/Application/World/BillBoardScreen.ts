import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import GUI from 'lil-gui';
import Application from '../Application';
import Debug from '../Utils/Debug';
import Resources from '../Utils/Resources';
import Camera from '../Camera/Camera';
import EventEmitter from '../Utils/EventEmitter';


interface BillBoardScreenOptions {
    position: THREE.Vector3;
    screenSize: { w: number, h: number };
    rotation: THREE.Euler;
    iframeURL?: string;
    loadStockLayer?: boolean;
    showAnimeVideo?: boolean;
    showPorsheVideo?: boolean;
    id?:string,
    title?:string
}
const IFRAME_PADDING = 32;

export default class BillBoardScreen extends EventEmitter {
    mesh: THREE.Mesh;
    texture?: THREE.Texture; // For texture-based billboards
    application: Application;
    scene: THREE.Scene;
    cssScene: THREE.Scene;
    resources: Resources;
    debug: Debug;
    screenSize: THREE.Vector2;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    camera: Camera;
    dimmingPlane: THREE.Mesh;
    videoTextures: { [key in string]: THREE.VideoTexture };
    iframeURL?: string;
    iframeSize: { w: number, h: number };
    id: string | '';
    title: string | '';
    loadStockLayer: boolean | false;
    showAnimeVideo: boolean | false;
    showPorsheVideo: boolean | false;
    stockMeshLayer: THREE.Mesh;

    constructor(options: BillBoardScreenOptions) {
        super();
        this.application = new Application();
        this.scene = this.application.scene;
        this.cssScene = this.application.cssScene;
        this.resources = this.application.resources;
        this.screenSize = new THREE.Vector2(options.screenSize.w, options.screenSize.h);
        this.position = options.position;
        this.rotation = options.rotation;
        this.camera = this.application.camera;
        this.videoTextures = {};

        this.iframeSize = {
            w: options.screenSize.w - IFRAME_PADDING,
            h: options.screenSize.h - IFRAME_PADDING,
        };
        this.id = options.id ?? '';
        this.title = options.title ?? '';
        this.loadStockLayer = options.loadStockLayer ?? false;
        this.showAnimeVideo = options.showAnimeVideo ?? false;
        this.showPorsheVideo = options.showPorsheVideo ?? false;

        if (options.iframeURL) {
            this.createIframe(options.iframeURL, options.screenSize);
        } 

        const maxOffset = this.createTextureLayers();
        this.createEnclosingPlanes(maxOffset);
        this.createPerspectiveDimmer(maxOffset);
    }


    createIframe(iframeURL: string, screenSize: { w: number, h: number }) {
        const container = this.setupContainer(screenSize);
        const iframe = this.setupIframe(iframeURL, screenSize);
        container.appendChild(iframe);
        this.createCssPlane(container);
    }

    setupContainer(screenSize: { w: number, h: number }): HTMLDivElement {
        const container = document.createElement('div');
        Object.assign(container.style, {
            width: `${screenSize.w}px`,
            height: `${screenSize.h}px`,
            opacity: '1',
            background: '#1d2e2f'
        });
        return container;
    }

    setupIframe(iframeURL: string, screenSize: { w: number, h: number }): HTMLIFrameElement {
        const iframe = document.createElement('iframe');
        Object.assign(iframe.style, {
            width: `${screenSize.w}px`,
            height: `${screenSize.h}px`,
            padding: `${IFRAME_PADDING}px`,
            boxSizing: 'border-box',
            opacity: '1'
        });
        iframe.src = iframeURL;
        iframe.className = 'jitter';
        iframe.id = this.id;
        iframe.frameBorder = '0';
        iframe.title = this.title;
        return iframe;
    }

    createCssPlane(element: HTMLElement) {
        // Create CSS3D object
        const object = new CSS3DObject(element);

        // copy monitor position and rotation
        object.position.copy(this.position);
        object.rotation.copy(this.rotation);

        // Add to CSS scene
        this.cssScene.add(object);

        // Create GL plane
        const material = new THREE.MeshLambertMaterial();
        material.side = THREE.DoubleSide;
        material.opacity = 0;
        material.transparent = true;
        // NoBlending allows the GL plane to occlude the CSS plane
        material.blending = THREE.NoBlending;

        // Create plane geometry
        const geometry = new THREE.PlaneGeometry(
            this.screenSize.width,
            this.screenSize.height
        );

        // Create the GL plane mesh
        const mesh = new THREE.Mesh(geometry, material);

        // Copy the position, rotation and scale of the CSS plane to the GL plane
        mesh.position.copy(object.position);
        mesh.rotation.copy(object.rotation);
        mesh.scale.copy(object.scale);

        // Add to gl scene
        this.scene.add(mesh);
    }



    /**
     * Creates the texture layers for the computer screen
     * @returns the maximum offset of the texture layers
     */
    createTextureLayers() {
        const textures = this.resources.items.texture;

        this.getVideoTextures('video-1');
        this.getVideoTextures('video-2');
        if (this.loadStockLayer) {
            this.getVideoTextures('video-3');
            this.getVideoTextures('video-4');
        }
        if(this.showAnimeVideo) {
            this.getVideoTextures('video-5');
        }
        if(this.showPorsheVideo) {
            this.getVideoTextures('video-6');
        }

        // Scale factor to multiply depth offset by
        const scaleFactor = 5;

        // Adjusted layers object with index signature
        const layers: { [key: string]: { texture: THREE.Texture, blending: THREE.Blending, opacity: number, offset: number } } = {
            smudge: {
                texture: textures.monitorSmudgeTexture,
                blending: THREE.AdditiveBlending,
                opacity: 0.12,
                offset: 27,
            },
            innerShadow: {
                texture: textures.monitorShadowTexture,
                blending: THREE.NormalBlending,
                opacity: 1,
                offset: 20,
            },
            video: {
                texture: this.videoTextures['video-1'],
                blending: THREE.AdditiveBlending,
                opacity: 0.5,
                offset: 15,
            },
            video2: {
                texture: this.videoTextures['video-2'],
                blending: THREE.AdditiveBlending,
                opacity: 0.1,
                offset: 10,
            },
        };

        if (this.loadStockLayer) {
            layers['video-3'] = {
                texture: this.videoTextures['video-3'],
                blending: THREE.AdditiveBlending,
                opacity: 0.6,
                offset: 25,
            };
        }
        if(this.showAnimeVideo ) {
            
            layers['video-5'] = {
                texture: this.videoTextures['video-5'],
                blending: THREE.AdditiveBlending,
                opacity: 0.6,
                offset: 25,
            };
        }
        if(this.showPorsheVideo) {
            layers['video-6'] = {
                texture: this.videoTextures['video-6'],
                blending: THREE.AdditiveBlending,
                opacity: 0.6,
                offset: 25,
            };
        }
        // Declare max offset
        let maxOffset = -1;

        // Add the texture layers to the screen
        for (const [_, layer] of Object.entries(layers)) {
            const offset = layer.offset * scaleFactor;
            const layerName = layer.texture === this.videoTextures['video-3'] ? 'video-3' : undefined;
            this.addTextureLayer(
                layer.texture,
                layer.blending,
                layer.opacity,
                offset,
                layerName
                
            );
            // Calculate the max offset
            if (offset > maxOffset) maxOffset = offset;
        }

        // Return the max offset
        return maxOffset;
    }

    getVideoTextures(videoId: string) {
        const video = document.getElementById(videoId) as HTMLVideoElement;
        if (!video) {
            setTimeout(() => {
                this.getVideoTextures(videoId);
            }, 100);
        } else {
            this.videoTextures[videoId] = new THREE.VideoTexture(video);
            video.playbackRate = 0.5; // Set playback speed to half the normal speed
            video.muted = true; // Ensure the video is muted to comply with autoplay policies
            video.play().catch(e => console.error("Error playing video:", e));
            this.videoTextures[videoId].needsUpdate = true;

            if (videoId === 'video-3' || videoId === 'video-4') {
                video.loop = false; // Ensure loop is false
                video.onended = () => {
                    const nextVideoId = videoId === 'video-3' ? 'video-4' : 'video-3';
                    const nextVideo = document.getElementById(nextVideoId) as HTMLVideoElement;
                    
                    if (nextVideo) {
                        // Update the video texture for the next video
                        this.videoTextures[nextVideoId] = new THREE.VideoTexture(nextVideo);
                        nextVideo.playbackRate = 0.5; // Set playback speed for the next video
                        nextVideo.play(); // Ensure the video starts playing
                        
                        if (this.stockMeshLayer && (this.stockMeshLayer.material instanceof THREE.MeshBasicMaterial || this.stockMeshLayer.material instanceof THREE.MeshLambertMaterial)) {
                            this.stockMeshLayer.material.map = this.videoTextures[nextVideoId];
                            this.stockMeshLayer.material.needsUpdate = true; // Important to let Three.js know the texture needs to be updated
                            this.videoTextures[nextVideoId].needsUpdate = true; // Force the texture to update
                        }
                    }
                };       
            } else if (videoId === 'video-5'){
                video.loop = true; // Ensure the video loops
                this.videoTextures[videoId].wrapS = THREE.RepeatWrapping;
                this.videoTextures[videoId].wrapT = THREE.RepeatWrapping;
                this.videoTextures[videoId].minFilter = THREE.LinearFilter;
                this.videoTextures[videoId].repeat.set(1, 1);
                video.play(); // Ensure the video plays
            }
            else if (videoId === 'video-6'){
                video.loop = true; // Ensure the video loops
                this.videoTextures[videoId].wrapS = THREE.RepeatWrapping;
                this.videoTextures[videoId].wrapT = THREE.RepeatWrapping;
                this.videoTextures[videoId].minFilter = THREE.LinearFilter;
                this.videoTextures[videoId].repeat.set(1, 1);
                video.play(); // Ensure the video plays

            }
            else {
                this.videoTextures[videoId].wrapS = THREE.RepeatWrapping;
                this.videoTextures[videoId].wrapT = THREE.RepeatWrapping;
                this.videoTextures[videoId].minFilter = THREE.LinearFilter;
                this.videoTextures[videoId].repeat.set(5, 5);
                video.play(); // Ensure the video starts playing immediately for non-looping videos
            }
        }
    }

    /**
     * Adds a texture layer to the screen
     * @param texture the texture to add
     * @param blending the blending mode
     * @param opacity the opacity of the texture
     * @param offset the offset of the texture, higher values are further from the screen
     */
    addTextureLayer(
        texture: THREE.Texture,
        blendingMode: THREE.Blending,
        opacity: number,
        offset: number,
        layerName?: string
    ) {
        // Create material
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            blending: blendingMode,
            side: THREE.DoubleSide,
            opacity,
            transparent: true,
        });

        // Create geometry
        const geometry = new THREE.PlaneGeometry(
            this.screenSize.width,
            this.screenSize.height
        );

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);

        // Copy position and apply the depth offset
        mesh.position.copy(
            this.offsetPosition(this.position, new THREE.Vector3(0, 0, offset))
        );

        // Copy rotation
        mesh.rotation.copy(this.rotation);

        // If layerName is 'video-3', reference this mesh layer to meshStockLayer
        if (layerName === 'video-3') {
            this.stockMeshLayer = mesh;
        }

        this.scene.add(mesh);
    }

    /**
     * Creates enclosing planes for the computer screen
     * @param maxOffset the maximum offset of the texture layers
     */
    createEnclosingPlanes(maxOffset: number) {
        // Create planes, lots of boiler plate code here because I'm lazy
        const planes = {
            left: {
                size: new THREE.Vector2(maxOffset, this.screenSize.height),
                position: this.offsetPosition(
                    this.position,
                    new THREE.Vector3(
                        -this.screenSize.width / 2,
                        0,
                        maxOffset / 2
                    )
                ),
                rotation: new THREE.Euler(0, 90 * THREE.MathUtils.DEG2RAD, 0),
            },
            right: {
                size: new THREE.Vector2(maxOffset, this.screenSize.height),
                position: this.offsetPosition(
                    this.position,
                    new THREE.Vector3(
                        this.screenSize.width / 2,
                        0,
                        maxOffset / 2
                    )
                ),
                rotation: new THREE.Euler(0, 90 * THREE.MathUtils.DEG2RAD, 0),
            },
            top: {
                size: new THREE.Vector2(this.screenSize.width, maxOffset),
                position: this.offsetPosition(
                    this.position,
                    new THREE.Vector3(
                        0,
                        this.screenSize.height / 2,
                        maxOffset / 2
                    )
                ),
                rotation: new THREE.Euler(90 * THREE.MathUtils.DEG2RAD, 0, 0),
            },
            bottom: {
                size: new THREE.Vector2(this.screenSize.width, maxOffset),
                position: this.offsetPosition(
                    this.position,
                    new THREE.Vector3(
                        0,
                        -this.screenSize.height / 2,
                        maxOffset / 2
                    )
                ),
                rotation: new THREE.Euler(90 * THREE.MathUtils.DEG2RAD, 0, 0),
            },
        };
    }
    
    createPerspectiveDimmer(maxOffset: number) {
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x000000,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });

        const plane = new THREE.PlaneGeometry(
            this.screenSize.width,
            this.screenSize.height
        );

        const mesh = new THREE.Mesh(plane, material);

        mesh.position.copy(
            this.offsetPosition(
                this.position,
                new THREE.Vector3(0, 0, maxOffset - 5)
            )
        );

        mesh.rotation.copy(this.rotation);

        this.dimmingPlane = mesh;

        this.scene.add(mesh);
    }

    /**
     * Offsets a position vector by another vector
     * @param position the position to offset
     * @param offset the offset to apply
     * @returns the new offset position
     */
    offsetPosition(position: THREE.Vector3, offset: THREE.Vector3) {
        const newPosition = new THREE.Vector3();
        newPosition.copy(position);
        newPosition.add(offset);
        return newPosition;
    }

    update() {
        if (this.dimmingPlane) {
            const planeNormal = new THREE.Vector3(0, 0, 1);
            const viewVector = new THREE.Vector3();
            viewVector.copy(this.camera.instance.position);
            viewVector.sub(this.position);
            viewVector.normalize();

            const dot = viewVector.dot(planeNormal);

            // calculate the distance from the camera vector to the plane vector
            const dimPos = this.dimmingPlane.position;
            const camPos = this.camera.instance.position;

            const distance = Math.sqrt(
                (camPos.x - dimPos.x) ** 2 +
                    (camPos.y - dimPos.y) ** 2 +
                    (camPos.z - dimPos.z) ** 2
            );

            const opacity = 1 / (distance / 10000);

            const DIM_FACTOR = 0.7;

            // @ts-ignore
            this.dimmingPlane.material.opacity =
                (1 - opacity) * DIM_FACTOR + (1 - dot) * DIM_FACTOR;
        }


        
    }
}