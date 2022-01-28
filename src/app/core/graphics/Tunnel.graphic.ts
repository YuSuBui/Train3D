import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { ITunnelDesc, TunnelType } from "src/app/data/interfaces/IMockData";
import { FRESNELSHADER } from "./interfaces/IFresnelShader";

export class TunnelGraphic extends AbstractGraphic {
    private tunnel!: any;
    private type!: TunnelType;

    constructor(parameters: ITunnelDesc, trajectory: Vector3[]) {
        super();
        this.type = parameters.type;
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
        const segment = 2;
        const childCurve = [];
        const flowSteps = Math.round(Math.round(curve.getLength()) * segment);
        const points = curve.getPoints(flowSteps);
        const end = start + length;

        for (let i = start * segment; i <= end * segment; i++) {
            childCurve.push(points[i]);
        }

        return new THREE.CatmullRomCurve3(childCurve);
    }

    private createGeometry = (outerRadius: number, innerRadius: number, length: number, curve: CatmullRomCurve3) => {
        let sAngle = 0;
        let eAngle = 0;

        switch (this.type) {
            case TunnelType.UNDER:
                sAngle = THREE.MathUtils.degToRad(0);
                eAngle = THREE.MathUtils.degToRad(360);
                break;
            case TunnelType.NORMAL:
            default:
                sAngle = THREE.MathUtils.degToRad(-90);
                eAngle = THREE.MathUtils.degToRad(90);
        }

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
        if (this.type === TunnelType.UNDER) {
            return this.createFresnelMaterial(0x0000FF, 0.5);
        }
        return this.createNormalMaterial()
    }

    private createNormalMaterial = () => {
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffff00),
            side: THREE.DoubleSide
        });
    }

    private createFresnelMaterial = (color: number, opacity: number) => {
        const uniform = {
            color: {
              type: "c",
              value: new THREE.Color(color),
            },
            u_opacity: { value: opacity }
          }
          return new THREE.ShaderMaterial({
            uniforms: uniform,
            vertexShader: FRESNELSHADER.vertexShader,
            fragmentShader: FRESNELSHADER.fragmentShader,
            transparent: opacity < 1
          });
    }
}