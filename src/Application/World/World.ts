import Application from '../Application';
import Resources from '../Utils/Resources';
import ComputerSetup from './Computer';
import MonitorScreen from './MonitorScreen';
import ShopWalls from './ShopWalls';
import Hitboxes from './Hitboxes';
import AudioManager from '../Audio/AudioManager';
import Screens from './Screens';
import LEDSigns from './LEDSigns';
import CablesAndPipes from './CablesAndPipes';
import Decors from './Decors';
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { guiParams } from '../Utils/GuiParams';
import BillBoardScreen from './BillBoardScreen';
import Rain from './Rain';
import AnimatedProps from './AnimatedProps';
import UIEventBus from '../UI/EventBus';
import HoloHelpSreen from './HoloHelpSreen';
import Hologram from './Hologram';

const FLOOR_SIZE = 90000
export default class World {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;

    // Objects in the scene
    environment: ShopWalls;
    computerSetup: ComputerSetup;
    monitorScreen: MonitorScreen;
    audioManager: AudioManager;
    hitbox : Hitboxes
    screens: Screens
    ledSigns: LEDSigns
    cablesAndPipes: CablesAndPipes
    decors: Decors
    reflector: Reflector
    rain: Rain;
    animatedProps: AnimatedProps
    HoloHelpSreen: HoloHelpSreen
    hologram: Hologram

    dimPlane: THREE.Mesh
    BillBoardScreen: BillBoardScreen[]

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.BillBoardScreen = [];
        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.environment = new ShopWalls();
            this.screens = new Screens();
            this.ledSigns = new LEDSigns();
            this.cablesAndPipes = new CablesAndPipes();
            this.decors = new Decors();
            this.animatedProps = new AnimatedProps();
            this.rain = new Rain();
            this.HoloHelpSreen = new HoloHelpSreen();
            this.hologram = new Hologram();

           
  
            this.computerSetup = new ComputerSetup();
            this.monitorScreen = new MonitorScreen();
            this.audioManager = new AudioManager();
            //this.hitbox = new Hitboxes();
            this.addBillBoardScreen()
            this.addReflectiveFloor();
            this.addSpotLight();
            this.addHemisphereLighting();
        });
    }

    addBillBoardScreen() {
        this.BillBoardScreen.push(new BillBoardScreen({
            position: new THREE.Vector3(150, 6400, -3950),
            screenSize: { w: 7700, h: 1500 },
            rotation: new THREE.Euler(0, Math.PI, 0),
            id: 'stock_screen',
            loadStockLayer: true,
            title: 'stock Market',
        }));

        this.BillBoardScreen.push(new BillBoardScreen({
            position: new THREE.Vector3(-250, 9100, -4390),
            screenSize: { w: 8100, h: 1600 },
            rotation: new THREE.Euler(0, Math.PI, 0),
            id: 'screen_3',
            title: 'Screen 3',
            showAnimeVideo: true
        }));

    }


    addReflectiveFloor() {
        // Create a plane geometry for the reflector
       const planeGeometry = new THREE.PlaneGeometry(FLOOR_SIZE ,FLOOR_SIZE);
        // Create the Reflector

        this.reflector = new Reflector(planeGeometry, {
            color: 0x777777,
            textureWidth: window.innerWidth * window.devicePixelRatio/ 4,
            textureHeight: window.innerHeight * window.devicePixelRatio/ 4,
            clipBias: 0.004,
            multisample: 0.05,
            });
            const dimPlaneMaterial = new THREE.MeshStandardMaterial({
                //#595980 
                color: 0x595980, // black color to dim the reflection
                transparent: true,
                opacity: guiParams.reflection.opacity, // low opacity to allow the reflection to be visible, but dimmed
                roughness: guiParams.reflection.roughness
            });


            const circleGeometry = new THREE.CircleGeometry(FLOOR_SIZE / 2, 64);
            this.dimPlane = new THREE.Mesh(circleGeometry, dimPlaneMaterial);
            this.dimPlane.receiveShadow = true;
            this.dimPlane.rotateX(-Math.PI / 2);
            this.dimPlane.position.y = guiParams.reflection.position; // slightly above the reflector
            this.scene.add(this.dimPlane);
            this.reflector.userData.reflector = true;
            this.reflector.layers.set(0);
            this.reflector.rotateX(-Math.PI / 2);
            this.reflector.position.y =  -10; // Adjust this value as needed
            this.scene.add(this.reflector);  

    }

    addHemisphereLighting() {
        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, guiParams.hemisphereLight.intensity);
        this.scene.add(hemisphereLight);
        if(this.application.debug.getGUI()){
            this.application.debug.getGUI().add(hemisphereLight, 'intensity', 0, 10).name('Hemisphere Light Intensity').setValue(guiParams.hemisphereLight.intensity);  
        }
    }

    addSpotLight() {
        // Define an array of spotlight configurations
        const spotLightsConfig = [
            { color: 0x61c4e0, params: guiParams.spotLight1, folderName: 'Spotlight 1' },
            { color: 0x5e4198, params: guiParams.spotLight2, folderName: 'Spotlight 2' },
            { color: 0x61c4e0, params: guiParams.spotLight3, folderName: 'Spotlight 3' },
            { color: 0x5e4198, params: guiParams.spotLight4, folderName: 'Spotlight 4' }
        ];

        // Loop through each spotlight configuration and create the spotlight and its GUI folder
        spotLightsConfig.forEach((config, index) => {
            const spotlight = new THREE.SpotLight(config.color, config.params.intensity, config.params.distance, config.params.angle, config.params.penumbra, config.params.decay);
            spotlight.position.set(config.params.x, config.params.y, config.params.z);
            this.scene.add(spotlight);

            if(this.application.debug.getGUI()){
                    // Create GUI folder for the spotlight
                const spotlightFolder = this.application.debug.getGUI().addFolder(config.folderName);
                spotlightFolder.add(spotlight, 'intensity', 0, 30).name(`${config.folderName} Intensity`).setValue(config.params.intensity);
                spotlightFolder.add(spotlight.position, 'x', -50000, 50000).name(`${config.folderName} X`).setValue(config.params.x);
                spotlightFolder.add(spotlight.position, 'y', 0, 20000).name(`${config.folderName} Y`).setValue(config.params.y);
                spotlightFolder.add(spotlight.position, 'z', -50000, 50000).name(`${config.folderName} Z`).setValue(config.params.z);
                spotlightFolder.add(spotlight, 'distance', 0, 70000).name(`${config.folderName} Distance`).setValue(config.params.distance);
                spotlightFolder.add(spotlight, 'decay', 0, 200).name(`${config.folderName} Decay`).setValue(config.params.decay);
                spotlightFolder.add(spotlight, 'angle', 0, Math.PI).name(`${config.folderName} Angle`).setValue(config.params.angle);
                spotlightFolder.add(spotlight, 'penumbra', 0, 1).name(`${config.folderName} Penumbra`).setValue(config.params.penumbra);
            }
            
        });
    }

    updateReflection() {
        (this.dimPlane.material as THREE.MeshBasicMaterial).opacity = guiParams.reflection.opacity;
        this.dimPlane.position.y = guiParams.reflection.position;
        (this.dimPlane.material as THREE.MeshStandardMaterial).roughness = guiParams.reflection.roughness;
    }


    update() {
        if (this.environment) this.environment.update();
        if (this.screens) this.screens.update();
        if (this.ledSigns) this.ledSigns.update();
        if (this.cablesAndPipes) this.cablesAndPipes.update();
        if (this.decors) this.decors.update();
        if (this.BillBoardScreen) this.BillBoardScreen.forEach(screen => screen.update());
        if(this.dimPlane) this.updateReflection();
        if(this.rain) this.rain.update();
        if(this.animatedProps) this.animatedProps.update();
        if(this.HoloHelpSreen) this.HoloHelpSreen.update();
        if(this.hologram) this.hologram.update();

    }
}
