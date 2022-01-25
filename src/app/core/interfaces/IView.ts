import { Vector3 } from "three";
import { IWorld } from "./IWorld";

export interface IView {
    IView: string;

    getCanvas(): HTMLCanvasElement;

    setCameraPosition(value: Vector3): void;

    getCameraPosition(): Vector3;

    setWorld(world: IWorld): void;

    reset(): void;

    setCenterView(point: THREE.Vector3): void;

    render(): void;

    isDirty(): boolean;

    getCamera(): any;

    getClientWidth(): number;

    getClientHeight(): number;
}