import * as THREE from 'three';
import { CameraKey } from './Camera';
import Time from '../Utils/Time';
import Application from '../Application';
import Mouse from '../Utils/Mouse';
import Sizes from '../Utils/Sizes';
import { guiParams } from '../Utils/GuiParams';
export class CameraKeyframeInstance {
    position: THREE.Vector3;
    focalPoint: THREE.Vector3;

    constructor(keyframe: CameraKeyframe) {
        this.position = keyframe.position;
        this.focalPoint = keyframe.focalPoint;
    }

    update() {}
}




const keys: { [key in CameraKey]: CameraKeyframe } = {
    //guiParams use t
    idle: {            
        position: new THREE.Vector3(guiParams.camera.orbitalPosition_x, guiParams.camera.orbitalPosition_y, guiParams.camera.orbitalPosition_z),
        focalPoint: new THREE.Vector3(guiParams.camera.orbitalFocalPoint_x, guiParams.camera.orbitalFocalPoint_y, guiParams.camera.orbitalFocalPoint_z),
    },

    monitor: {
        position: new THREE.Vector3(2200, 3100, -1200),
        focalPoint: new THREE.Vector3(3300, 3000, -1900),
    },
    loading: {
        position: new THREE.Vector3(-35000, 40000, 40000),
        focalPoint: new THREE.Vector3(0, -5000, 0),
    },
    orbitControlsStart: {
        position: new THREE.Vector3(guiParams.camera.orbitalPosition_x, guiParams.camera.orbitalPosition_y, guiParams.camera.orbitalPosition_z),
        focalPoint: new THREE.Vector3(guiParams.camera.orbitalFocalPoint_x, guiParams.camera.orbitalFocalPoint_y, guiParams.camera.orbitalFocalPoint_z),
    },
    computerCameraPath: {
        position: new THREE.Vector3(3000, 650, 9500),
        focalPoint: new THREE.Vector3(8000, 200, 1000),
    }
};

export class ComputerCameraPathKeyframe extends CameraKeyframeInstance {
    constructor() {
        const keyframe = keys.computerCameraPath;
        super(keyframe);
    }

    update() {}
}




export class MonitorKeyframe extends CameraKeyframeInstance {
    application: Application;
    sizes: Sizes;
    targetPos: THREE.Vector3;
    origin: THREE.Vector3;

    constructor() {
        const keyframe = keys.monitor;
        super(keyframe);
        this.application = new Application();
        this.sizes = this.application.sizes;
        this.origin = new THREE.Vector3().copy(keyframe.position);
        this.targetPos = new THREE.Vector3().copy(keyframe.position);
    }

    update() {
        const aspect = this.sizes.height / this.sizes.width;
        const additionalZoom = this.sizes.width < 768 ? 0 : 600;
        this.targetPos.z = this.origin.z + aspect * 1200 - additionalZoom;
        this.position.copy(this.targetPos);
    }
}

export class LoadingKeyframe extends CameraKeyframeInstance {
    constructor() {
        const keyframe = keys.loading;
        super(keyframe);
    }

    update() {}
}


export class IdleKeyframe extends CameraKeyframeInstance {
    time: Time;
    origin: THREE.Vector3;

    constructor() {
        const keyframe = keys.idle;
        super(keyframe);
        this.origin = new THREE.Vector3().copy(keyframe.position);
        this.time = new Time();
    }

    update() {
        // Spin around the x-axis
        this.position.x = 
            Math.sin((this.time.elapsed + 19000) * 0.00008) * 5000 + this.origin.x;
    
        // Existing y-axis movement
        this.position.y =
            Math.sin(-(this.time.elapsed + 1000) * 0.000004) * 4000 +
            this.origin.y -
            3000;
    
        // Spin around the z-axis
        this.position.z = 
            Math.cos((this.time.elapsed + 40000) * 0.00005) * 5000;
    }
}

export class OrbitControlsStart extends CameraKeyframeInstance {
    constructor() {
        const keyframe = keys.orbitControlsStart;
        super(keyframe);
    }

    update() {}
}
