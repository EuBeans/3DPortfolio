import EventEmitter from './EventEmitter';
import Application from '../Application';
export default class Mouse extends EventEmitter {
    x: number;
    y: number;
    inComputer: boolean;
    onPaper: boolean;
    onChelve: boolean;
    application: Application;

    constructor() {
        super();

        // Setup
        this.x = 0;
        this.y = 0;
        this.inComputer = false;
        this.onPaper = false;
        this.onChelve = false;
        // this.application = new Application();
        // this.audio = this.application.world.audio;

        // Resize event
        this.on('mousemove', (event: any) => {
            if (event.clientX && event.clientY) {
                this.x = event.clientX;
                this.y = event.clientY;
            }
            this.inComputer = event.inComputer ? true : false;
            this.onPaper = event.onPaper ? true: false;
            this.onChelve = event.onChelve ? true: false;
        });
    }
}
