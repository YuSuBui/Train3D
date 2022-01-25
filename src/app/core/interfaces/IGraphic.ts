import { IView } from "./IView";

export interface IGraphic {
    IGraphic: string;

    drawBegin(view: IView): void;

    drawEnd(view: IView): void;

    isDirty(): boolean;

    isPickable(): boolean;

    setDirty(value: boolean): void;

    setPickable(value: boolean): void;

    getNode(): THREE.Object3D;

    setVisible(visible: boolean): void;

    getVisible(): boolean;
}