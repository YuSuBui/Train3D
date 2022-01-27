import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { Vector3 } from "three";
import { IDataAdapter } from "src/app/data/interfaces/IDataAdapter";

export class DirectionPlanGraphic extends AbstractGraphic {
    private trajectory!: Vector3[];
    private directionPlan!: THREE.Mesh;

    constructor(dataAdapter: IDataAdapter) {
        super();
        this.trajectory = dataAdapter.getTrajectory();
        this.build(this.trajectory);
        this.getNode().add(this.directionPlan);

        // const axesHelper = new THREE.AxesHelper( 10 );
        // this.getNode().add( axesHelper );
    }

    private readonly build = (trajectory: Vector3[]) => {
        const path = new THREE.CatmullRomCurve3(trajectory);
        const tubularSegment = Math.round(path.getLength()) * 2;
        const geometry = new THREE.TubeGeometry(path, tubularSegment, 0.01, 64, true);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x0000ff),
            side: THREE.DoubleSide,
            opacity: 1
        });
        this.directionPlan = new THREE.Mesh(geometry, material);
    }
}