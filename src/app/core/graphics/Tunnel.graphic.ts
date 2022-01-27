import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";
import { ITunnelDesc } from "src/app/data/interfaces/IMockData";

export class TunnelGraphic extends AbstractGraphic {
    private tunnel!: any;

    constructor(parameters: ITunnelDesc, trajectory: Vector3[]) {
        super();
        const curve3 = new THREE.CatmullRomCurve3(trajectory);
        this.build(parameters, curve3);
        this.getNode().add(this.tunnel.object3D);
    }

    private build = (parameters: ITunnelDesc, curve: CatmullRomCurve3) => {
        const geometry = this.createGeometry(parameters.bodyOD, parameters.bodyID, parameters.length);
        geometry.rotateY(Math.PI / 2);
        geometry.rotateX(-Math.PI / 2);
        const material = this.createMaterial();

        const tunnel = new THREE.Mesh(geometry, material);
        const flowSteps = Math.round(Math.round(curve.getLength()) * 2);

        this.tunnel = new Flow(tunnel, flowSteps);
        this.tunnel.updateCurve(0, curve);
        this.tunnel.uniforms.spineOffset.value = (parameters.startAt);
    }

    private createGeometry = (outerRadius: number, innerRadius: number, length: number) => {
        const sAngle = THREE.MathUtils.degToRad(0);
        const eAngle = THREE.MathUtils.degToRad(180);

        const shape = new THREE.Shape();

        shape.absarc(0, 0, outerRadius, sAngle, eAngle, false);
        shape.absarc(0, 0, innerRadius, eAngle, sAngle, true);
        shape.lineTo(outerRadius, 0);
        shape.lineTo(-outerRadius, 0);

        return new THREE.ExtrudeGeometry(shape, {
            steps: 100,
            curveSegments: 100,
            bevelEnabled: false,
            depth: length
        });
    }

    private createMaterial = () => {
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffff00),
            side: THREE.DoubleSide
        });
    }
}