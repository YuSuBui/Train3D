import { IGraphic } from "./IGraphic";

export interface IGroup {
    IGroup: string;

    addNode(node: IGraphic): void;

    getChildNodes(): IGraphic[];

    setScene(scene: THREE.Scene): void;

    getPickableNodes(): IGraphic[];
}