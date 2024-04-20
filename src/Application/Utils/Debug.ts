import * as dat from 'lil-gui';

import { guiParams } from './GuiParams';

export default class Debug {
    active: boolean;
    ui: dat.GUI;

    constructor() {
        this.active = window.location.hash === '#debug';
        if (this.active) {
            this.ui = new dat.GUI();
            this.setupGUI();
        }
    }

    // Export the GUI for external access
    getGUI() {
        return this.ui;
    }

    setupGUI() {
        if (!this.active) return;

        // Bloom Effect Folder
        const bloomFolder = this.ui.addFolder('Bloom Effect');
        bloomFolder.add(guiParams.bloom, 'threshold', 0, 1).name('Threshold');
        bloomFolder.add(guiParams.bloom, 'strength', 0, 10).name('Strength');
        bloomFolder.add(guiParams.bloom, 'radius', 0, 2).name('Radius');
        bloomFolder.add(guiParams.bloom, 'exposure', 0, 2).name('Exposure');
        bloomFolder.open();


  
        //reflection folder
        const reflectionFolder = this.ui.addFolder('Reflection');
        reflectionFolder.add(guiParams.reflection, 'opacity', 0, 1).name('Opacity');
        reflectionFolder.add(guiParams.reflection, 'position', 0, 200).name('Position');
        reflectionFolder.add(guiParams.reflection, 'roughness', 0, 1).name('Roughness');
        reflectionFolder.open();


    }
}
