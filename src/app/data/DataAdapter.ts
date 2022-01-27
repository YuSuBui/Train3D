import { Vector3 } from "three";
import { IDataAdapter } from "./interfaces/IDataAdapter";
import { ITrajectoryDesc } from "./interfaces/IMockData";
import * as THREE from "three";

export class DataAdapter implements IDataAdapter {
    private trajectoryX!: number[];
    private trajectoryY!: number[];
    private trajectoryZ!: number[];
    private trajectory!: Vector3[];

    constructor(data: ITrajectoryDesc) {
        this.trajectory = new Array<Vector3>();
        this.trajectoryX = data.trajectoryX;
        this.trajectoryY = data.trajectoryY;
        this.trajectoryZ = data.trajectoryZ;
        this.computeTrajectory();
        console.log('DataAdapter length = ', this.getLength());
    }

    getLength(): number {
        return new THREE.CatmullRomCurve3(this.trajectory).getLength();
    }

    getTrajectory(): Vector3[] {
        return this.trajectory;
    }

    private readonly computeTrajectory = () => {
        const length = Math.min(this.trajectoryX.length, this.trajectoryY.length, this.trajectoryZ.length);
        if (length === 0) {
            this.trajectory.push(new Vector3(0, 0, 0));
        } else {
            for (let i = 0; i < length; i++) {
                this.trajectory.push(new Vector3(this.trajectoryX[i], this.trajectoryY[i], this.trajectoryZ[i]));
            }
        }
    }

}