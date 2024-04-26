import { Resource } from '../types';

const sources: Resource[] = [
    {
        name: 'computerSetupModel',
        type: 'gltfModel',
        path: 'models/Computer/computer_setup.glb',
    },
    {
        name: 'computerSetupTexture',
        type: 'texture',
        path: 'models/Computer/baked_computer.jpg',
    },
    {
        name: 'environmentModel',
        type: 'gltfModel',
        path: 'models/World/environment.glb',
    },
    {
        name: 'environmentTexture',
        type: 'texture',
        path: 'models/World/baked_environment.jpg',
    },

    {
        name: 'cvPaperModel',
        type: 'gltfModel',
        path: 'models/CVPaper/CVPaper.glb',
    },
    {
        name: 'cvPaperTexture',
        type: 'texture',
        path: 'models/CVPaper/CVPaper.jpg',
    },
    {
        name: 'wallsModel',
        type: 'gltfModel',
        path: 'models/ShopWalls/Walls.glb',
    },
    {
        name: 'wallsTexture',
        type: 'texture',
        path: 'models/ShopWalls/Walls.jpg',
    },
    {
        name: 'barModel',
        type: 'gltfModel',
        path: 'models/ShopWalls/Bar.glb',
    },
    {
        name: 'barTexture',
        type: 'texture',
        path: 'models/ShopWalls/Bar.jpg',
    },
    {
        name: 'floorModel',
        type: 'gltfModel',
        path: 'models/ShopWalls/Floor.glb',
    },
    {
        name: 'floorTexture',
        type: 'texture',
        path: 'models/ShopWalls/Floor.jpg',
    },
    {
        name: 'roofExtensionModel',
        type: 'gltfModel',
        path: 'models/ShopWalls/RoofExtension.glb',
    },
    {
        name: 'roofExtensionTexture',
        type: 'texture',
        path: 'models/ShopWalls/RoofExtension.jpg',
    },
    {
        name: 'aboutMeModel',
        type: 'gltfModel',
        path: 'models/ShopWalls/AboutMe.glb',
    },
    {
        name: 'aboutMeTexture',
        type: 'texture',
        path: 'models/ShopWalls/AboutMe.jpg',
    },
    {
        name: 'ledSigns1Model',
        type: 'gltfModel',
        path: 'models/LEDSigns/LEDSigns_1.glb',
    },
    {
        name: 'ledSigns1Texture',
        type: 'texture',
        path: 'models/LEDSigns/LEDSigns_1.jpg',
    },
    {
        name: 'ledSigns2Model',
        type: 'gltfModel',
        path: 'models/LEDSigns/LEDSigns_2.glb',
    },
    {
        name: 'ledSigns2Texture',
        type: 'texture',
        path: 'models/LEDSigns/LEDSigns_2.jpg',
    },

    {
        name: 'cablesModel',
        type: 'gltfModel',
        path: 'models/CablesAndPipes/Cables.glb',
    },
    {
        name: 'cablesTexture',
        type: 'texture',
        path: 'models/CablesAndPipes/Cables.jpg',
    },
    {
        name: 'bigCables1Model',
        type: 'gltfModel',
        path: 'models/CablesAndPipes/BigCables_1.glb',
    },
    {
        name: 'bigCables1Texture',
        type: 'texture',
        path: 'models/CablesAndPipes/BigCables_1.jpg',
    },
    {
        name: 'bigCables2Model',
        type: 'gltfModel',
        path: 'models/CablesAndPipes/BigCables_2.glb',
    },
    {
        name: 'bigCables2Texture',
        type: 'texture',
        path: 'models/CablesAndPipes/BigCables_2.jpg',
    },
    {
        name: 'bigCables3Model',
        type: 'gltfModel',
        path: 'models/CablesAndPipes/BigCables_3.glb',
    },
    {
        name: 'bigCables3Texture',
        type: 'texture',
        path: 'models/CablesAndPipes/BigCables_3.jpg',
    },
    {
        name: 'decors1Model',
        type: 'gltfModel',
        path: 'models/Decors/Decors_1.glb',
    },
    {
        name: 'decors1Texture',
        type: 'texture',
        path: 'models/Decors/Decors_1.jpg',
    },

    {
        name: 'decors2Model',
        type: 'gltfModel',
        path: 'models/Decors/Decors_2.glb',
    },
    {
        name: 'decors2Texture',
        type: 'texture',
        path: 'models/Decors/Decors_2.jpg',
    },
    {
        name: 'decors3Model',
        type: 'gltfModel',
        path: 'models/Decors/Decors_3.glb',
    },
    {
        name: 'decors3Texture',
        type: 'texture',
        path: 'models/Decors/Decors_3.jpg',
    },
    {
        name: 'decors4Model',
        type: 'gltfModel',
        path: 'models/Decors/Decors_4.glb',
    },
    {
        name: 'decors4Texture',
        type: 'texture',
        path: 'models/Decors/Decors_4.jpg',
    },
    {
        name: 'decors5Model',
        type: 'gltfModel',
        path: 'models/Decors/Decors_5.glb',
    },
    {
        name: 'decors5Texture',
        type: 'texture',
        path: 'models/Decors/Decors_5.jpg',
    },
    {
        name: 'decors6Model',
        type: 'gltfModel',
        path: 'models/Decors/Decors_6.glb',
    },
    {
        name: 'decors6Texture',
        type: 'texture',
        path: 'models/Decors/Decors_6.jpg',
    },
    {
        name: 'hologramModel',
        type: 'objModel',
        path: 'models/Decors2/Hologram.obj',
    },
    {
        name: 'animatedPropsModel',
        type: 'gltfModel',
        path: 'models/AnimatedProps/AnimatedProps.glb',
    },
    {
        name: 'hologramHelperModel',
        type: 'gltfModel',
        path: 'models/Decors2/HologramHelper.glb',
    },
    {
        name: 'animatedPropsTexture',
        type: 'texture',
        path: 'models/AnimatedProps/AnimatedProps.jpg',
    },
    {
        name: 'garageDoorModel',
        type: 'gltfModel',
        path: 'models/AnimatedProps/GarageDoor.glb',
    },
    {
        name: 'garageDoorTexture',
        type: 'texture',
        path: 'models/AnimatedProps/GarageDoor.jpg',
    },
    {
        name: 'decorsRoughnessTexture',
        type: 'texture',
        path: 'models/Decors/DecorsRoughness.jpg',
    },
    {
        name: 'screensModel',
        type: 'gltfModel',
        path: 'models/Screens/Screens.glb',
    },
    {
        name: 'screensTexture',
        type: 'texture',
        path: 'models/Screens/Screens.jpg',
    },
    {
        name: 'screensRoughnessTexture',
        type: 'texture',
        path: 'models/Screens/ScreensRoughness.jpg',
    },
    {
        name: 'monitorSmudgeTexture',
        type: 'texture',
        path: 'textures/monitor/layers/compressed/smudges.jpg',
    },
    {
        name: 'monitorShadowTexture',
        type: 'texture',
        path: 'textures/monitor/layers/compressed/shadow-compressed.png',
    },
    {
        name: 'mouseDown',
        type: 'audio',
        path: 'audio/mouse/mouse_down.mp3',
    },
    {
        name: 'mouseUp',
        type: 'audio',
        path: 'audio/mouse/mouse_up.mp3',
    },
    {
        name: 'keyboardKeydown1',
        type: 'audio',
        path: 'audio/keyboard/key_1.mp3',
    },
    {
        name: 'keyboardKeydown2',
        type: 'audio',
        path: 'audio/keyboard/key_2.mp3',
    },
    {
        name: 'keyboardKeydown3',
        type: 'audio',
        path: 'audio/keyboard/key_3.mp3',
    },
    {
        name: 'keyboardKeydown4',
        type: 'audio',
        path: 'audio/keyboard/key_4.mp3',
    },
    {
        name: 'keyboardKeydown5',
        type: 'audio',
        path: 'audio/keyboard/key_5.mp3',
    },
    {
        name: 'keyboardKeydown6',
        type: 'audio',
        path: 'audio/keyboard/key_6.mp3',
    },
    {
        name: 'startup',
        type: 'audio',
        path: 'audio/startup/startup.mp3',
    },
    {
        name: 'Ambient',
        type: 'audio',
        path: 'audio/atmosphere/Ambient.mp3',
    },
    {
        name: 'RainSound',
        type: 'audio',
        path: 'audio/atmosphere/RainSound.mp3',
    },
    {
        name: 'ccType',
        type: 'audio',
        path: 'audio/cc/type.mp3',
    },
];

export default sources;
