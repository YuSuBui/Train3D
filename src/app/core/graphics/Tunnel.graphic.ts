import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { ITunnelDesc } from "src/app/data/interfaces/IMockData";

export class TunnelGraphic extends AbstractGraphic {
    private tunnel!: any;

    constructor(parameters: ITunnelDesc, trajectory: Vector3[]) {
        super();
        const curve3 = new THREE.CatmullRomCurve3(trajectory);
        this.build(parameters, curve3);
        this.getNode().add(this.tunnel);
    }

    private build = (parameters: ITunnelDesc, curve: CatmullRomCurve3) => {
        const tunnelCurve = this.extractCurve(curve, parameters.startAt, parameters.length);
        const material = this.createMaterial();
        const geometry = this.createGeometry(parameters.bodyOD, parameters.bodyID, parameters.length, tunnelCurve);
        const tunnel = new THREE.Mesh(geometry, material);

        this.tunnel = tunnel;
    }

    private extractCurve = (curve: CatmullRomCurve3, start: number, length: number) => {
        const childCurve = [];
        const sumLength = curve.getLength();
        const end = start + length;
        let i = start;

        while (i < end) {
            const p = curve.getPointAt(i / sumLength);
            childCurve.push(p);
            i += 0.05;
        }

        return new THREE.CatmullRomCurve3(childCurve);
    }

    private createGeometry = (outerRadius: number, innerRadius: number, length: number, curve: CatmullRomCurve3) => {
        const sAngle = THREE.MathUtils.degToRad(-120);
        const eAngle = THREE.MathUtils.degToRad(120);

        const shape = new THREE.Shape();

        shape.absarc(0, 0, outerRadius, sAngle, eAngle, false);
        shape.absarc(0, 0, innerRadius, eAngle, sAngle, true);
        // shape.lineTo(outerRadius, 0);
        // shape.lineTo(-outerRadius, 0);

        const flowSteps = Math.round(Math.round(curve.getLength()) * 2);
        return new THREE.ExtrudeGeometry(shape, {
            steps: flowSteps,
            curveSegments: flowSteps,
            bevelEnabled: false,
            depth: length,
            extrudePath: curve
        });
    }

    private createMaterial = () => {
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffff00),
            side: THREE.DoubleSide
        });
    }
}