import { Object3D } from "three";
import { IGraphic } from "./interfaces/IGraphic";
import { IGroup } from "./interfaces/IGroup";

export class MainGroup implements IGroup {
    IGroup: string = 'MainGroup';

    private group!: Object3D;
    private children: IGraphic[] = [];
    private pickableList: IGraphic[] = [];


    constructor() {
        this.group = new Object3D();
    }

    getPickableNodes(): IGraphic[] {
        return this.pickableList;
    }

    getChildNodes(): IGraphic[] {
        return this.children;
    }

    addNode(node: IGraphic) {
        this.group.add(node.getNode());
        this.children.push(node);
        if (node.isPickable()) {
            this.pickableList.push(node);
        }
    }

    setScene(scene: THREE.Scene) {
        scene.add(this.group);
    }
}