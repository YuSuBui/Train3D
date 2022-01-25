import { IGroup } from "./interfaces/IGroup";
import { IView } from "./interfaces/IView";
import { IViewer } from "./interfaces/IViewer";
import { IWorld } from "./interfaces/IWorld";
import { MainGroup } from "./MainGroup";

export class World implements IWorld {
    IWorld: string = 'IWorld';

    private group!: IGroup;
    private viewer: IViewer;

    constructor(viewer: IViewer) {
        this.viewer = viewer;
        this.setupMainGroup();
    }

    public getMainGroup(): IGroup {
        return this.group;
    }

    drawBegin(view: IView): void {
        this.getMainGroup().getChildNodes().forEach(node => {
            node.drawBegin(view);
        });
    }

    drawEnd(view: IView): void {
        this.getMainGroup().getChildNodes().forEach(node => {
            node.drawEnd(view);
        });
    }

    private readonly setupMainGroup = () => {
        this.group = new MainGroup();
    }

}