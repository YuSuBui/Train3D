import { IView } from "./IView";
import { IWorld } from "./IWorld";

export interface IViewer {
    IViewer: string;

    getView(): IView;

    getWorld(): IWorld;
}