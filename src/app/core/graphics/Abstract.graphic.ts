import { Object3D, Event } from "three";
import { IGraphic } from "../interfaces/IGraphic";
import { IView } from "../interfaces/IView";

export class AbstractGraphic implements IGraphic {
    IGraphic: string = 'AbstractGraphic';

    private dirty: boolean = false;
    private pickable: boolean = false;
    private readonly root: Object3D = new Object3D();

    drawBegin(view: IView): void {

    }

    drawEnd(view: IView): void {

    }

    isDirty(): boolean {
        return this.dirty;
    }

    isPickable(): boolean {
        return this.pickable;
    }

    setDirty(value: boolean): void {
        this.dirty = value;
    }

    setPickable(value: boolean): void {
        this.pickable = value;
    }

    getNode(): Object3D<Event> {
        return this.root;
    }

    setVisible(visible: boolean): void {
        this.root.visible = visible;
    }

    getVisible(): boolean {
        return this.root.visible;
    }
}