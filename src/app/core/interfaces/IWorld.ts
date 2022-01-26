import { IGroup } from "./IGroup";
import { IView } from "./IView";

export interface IWorld {
    IWorld: string;

    getMainGroup(): IGroup;

    drawBegin(view: IView): void;

    drawEnd(view: IView): void;
}