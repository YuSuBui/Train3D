import { IView } from "./interfaces/IView";
import { IViewer } from "./interfaces/IViewer";
import { IWorld } from "./interfaces/IWorld";
import { View } from "./View";
import { World } from "./World";

export class Viewer implements IViewer {
    IViewer: string = 'IView';

    private view: IView;
    private world: IWorld;
    private animationRequestID: number = -1;

    constructor(canvas: string) {
        this.view = new View(canvas);
        this.world = new World(this);
        this.view.setWorld(this.world);
        this.view.reset();

        this.mainLoop();
    }

    getView(): IView {
        return this.view;
    }

    getWorld(): IWorld {
        return this.world;
    }

    private mainLoop = () => {
        // repaint the ViewCanvas when it's View is dirty
        if (this.view.isDirty()) {
        }
        this.view.render();

        // tells the browser to schedule a next iteration
        this.animationRequestID = requestAnimationFrame(this.mainLoop);
    }
}
