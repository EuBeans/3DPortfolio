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
    ShopWalls: ShopWalls;
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
            this.ShopWalls = new ShopWalls();
            this.screens = new Screens();
            this.ledSigns = new LEDSigns();
            this.decors = new Decors();
            this.cablesAndPipes = new CablesAndPipes();
            this.animatedProps = new AnimatedProps();
            //
            this.HoloHelpSreen = new HoloHelpSreen();
            if (!this.application.isMobile) {
                this.hologram = new Hologram();
                //this.rain = new Rain();
                this.addReflectiveFloor();

                

            }
            this.addBillBoardScreen();  
            this.computerSetup = new ComputerSetup();
            this.monitorScreen = new MonitorScreen();
            this.audioManager = new AudioManager();
            //this.hitbox = new Hitboxes();
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
            textureWidth: window.innerWidth * window.devicePixelRatio/ 2,
            textureHeight: window.innerHeight * window.devicePixelRatio/ 2,
            clipBias: 0.004,
            multisample: 0.05,
            });


           
            this.reflector.userData.reflector = true;
            this.reflector.layers.set(0);
            this.reflector.rotateX(-Math.PI / 2);
            this.reflector.position.y =  -10; // Adjust this value as needed
            this.scene.add(this.reflector);  

    }



    update() {
        if (this.ShopWalls) this.ShopWalls.update();
        if (this.screens) this.screens.update();
        if (this.ledSigns) this.ledSigns.update();
        if (this.cablesAndPipes) this.cablesAndPipes.update();
        if (this.decors) this.decors.update();
        if (this.BillBoardScreen) this.BillBoardScreen.forEach(screen => screen.update());
        
        if(this.rain) this.rain.update();
        if(this.animatedProps) this.animatedProps.update();
        if(this.HoloHelpSreen) this.HoloHelpSreen.update();
        if(this.hologram) this.hologram.update();

    }
}
