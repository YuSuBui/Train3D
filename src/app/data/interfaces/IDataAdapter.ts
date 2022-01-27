import { Vector3 } from "three";

export interface IDataAdapter {
    getTrajectory(): Vector3[];

    getLength(): number;
}