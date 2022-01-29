import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { ITunnelDesc } from "src/app/data/interfaces/IMockData";

export class TunnelGraphic extends AbstractGraphic {
    private tunnel!: any;
    private zFactor = 0.55;

    constructor(parameters: ITunnelDesc, trajectory: Vector3[]) {
        super();
        const curve3 = new THREE.CatmullRomCurve3(trajectory);
        this.build(parameters, curve3);
        // this.getNode().add(this.tunnel);
    }

    private build = (parameters: ITunnelDesc, curve: CatmullRomCurve3) => {
        const tunnelCurve = this.extractCurve(curve, parameters.startAt, parameters.length);
        const material = this.createMaterial();
        const geometry = this.createGeometry(parameters.bodyOD, parameters.bodyID, parameters.length, tunnelCurve);
        const tunnel = new THREE.Mesh(geometry, material);
        tunnel.translateZ(-this.zFactor);

        this.buildSideTracks(tunnelCurve, parameters.bodyOD, parameters.bodyID)
        this.tunnel = tunnel;

        const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshNormalMaterial());

        tunnel.updateMatrix();
        box.updateMatrix();
    }

    private buildSideTracks = (tunnelCurve: CatmullRomCurve3, outerRadius: number, innerRadius: number) => {
        const width = 7;
        const height = 5;
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xd3d3d3),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });

        const sideGeometry = this.createSideGeometry(tunnelCurve, height, width, outerRadius, innerRadius);
        const sideMesh = new THREE.Mesh(sideGeometry, material);
        this.getNode().add(sideMesh);
    }

    private createSideGeometry = (curve: CatmullRomCurve3, length: number, width: number, outerRadius: number, innerRadius: number) => {
        const start = length / 2;
        const end = width / 2;

        const hole = new THREE.Path();
        const sAngle = THREE.MathUtils.degToRad(-120);
        const eAngle = THREE.MathUtils.degToRad(90);
        hole.absarc(this.zFactor, 0, outerRadius, sAngle, eAngle, false);

        const isometricHoles = new THREE.Path();
        isometricHoles.moveTo(0, 0);
        isometricHoles.lineTo(0, end);
        isometricHoles.lineTo(0 + start, end);
        isometricHoles.lineTo(0 + start, 0);
        isometricHoles.lineTo(0, 0);

        const shape = new THREE.Shape();
        shape.moveTo(-start + this.zFactor, -end);
        shape.lineTo(-start + this.zFactor, end);
        shape.lineTo(this.zFactor, end);
        // shape.lineTo(start / 2 - this.zFactor * 2, end);

        shape.lineTo(this.zFactor, 0 + outerRadius);
        // shape.lineTo(start / 2 - this.zFactor * 2, 0);
        shape.absarc(this.zFactor, 0, outerRadius, Math.PI / 2, Math.PI * 2 / 3, false);

        shape.absarc(this.zFactor, 0, outerRadius, -Math.PI / 2 - Math.PI / 6, 0, false);
        // shape.(this.zFactor, 0 - outerRadius);
        // shape.absarc(this.zFactor, 0, outerRadius, Math.PI / 2, 0, true);
        shape.moveTo(this.zFactor + outerRadius, 0);
        // shape.lineTo(start - this.zFactor, -end);
        shape.lineTo(start + this.zFactor, 0);

        // shape.lineTo(start + this.zFactor, end); // v1
        shape.lineTo(start + this.zFactor, -end);
        shape.lineTo(-start + this.zFactor, -end);

        // shape.holes.push(hole);
        // shape.holes.push(isometricHoles);

        const flowSteps = Math.round(Math.round(curve.getLength()) * 3);
        return new THREE.ExtrudeGeometry(shape, {
            steps: flowSteps,
            curveSegments: flowSteps,
            bevelEnabled: false,
            extrudePath: curve
        });
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
            // depth: length,
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