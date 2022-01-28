import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, MeshStandardMaterial, Vector3 } from "three";
import { ITunnelDesc, TunnelType } from "src/app/data/interfaces/IMockData";
import { FRESNELSHADER } from "./interfaces/IFresnelShader";
import { IPropertyChangeListener } from "src/app/data/interfaces/IPropertyChangeListener";
import { IStyle } from "src/app/data/interfaces/IStyle";
import { Style, StyleProperty } from "src/app/data/Style";

export class TunnelGraphic extends AbstractGraphic implements IPropertyChangeListener {
    public IPropertyChangeListener = 'TunnelGraphic';

    private tunnel!: any;
    private type!: TunnelType;
    private style!: IStyle;

    constructor(parameters: ITunnelDesc, trajectory: Vector3[]) {
        super();
        this.setStyle();
        this.type = parameters.type;
        const curve3 = new THREE.CatmullRomCurve3(trajectory);
        this.build(parameters, curve3);
        this.getNode().add(this.tunnel);
    }

    private readonly setStyle = () => {
        this.style = new Style();
        this.style.addPropertyChangeListener(this);
    }

    public getStyle(): IStyle {
        return this.style;
    }

    public onPropertyChange(property: string, oldValue: any, newValue: any, object: any): void | Promise<void> {
        if (property === StyleProperty.SINGLE_COLOR) {
            this.rebuildMaterial();
        }
        if (property === StyleProperty.OPACITY) {
            this.rebuildMaterial();
        }
        
    }

    private readonly rebuildMaterial = () => {
        const newMaterial = this.createMaterial();
        this.tunnel.material = newMaterial;
        this.tunnel.material.needsUpdate = true;
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
            return this.createFresnelMaterial();
        }
        return this.createNormalMaterial()
    }

    private createNormalMaterial = () => {
        return new THREE.MeshStandardMaterial({
            color: this.style.getColor(),
            side: THREE.DoubleSide
        });
    }

    private createFresnelMaterial = () => {
        const uniform = {
            color: {
              type: "c",
              value: this.style.getColor(),
            },
            u_opacity: { value: this.style.getOpacity() }
          }
          return new THREE.ShaderMaterial({
            uniforms: uniform,
            vertexShader: FRESNELSHADER.vertexShader,
            fragmentShader: FRESNELSHADER.fragmentShader,
            transparent: this.style.getOpacity() < 1
          });
    }
}