import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import { ITunnelDesc } from "src/app/data/interfaces/IMockData";
import { FRESNELSHADER } from "./interfaces/IFresnelShader";
import { IPropertyChangeListener } from "src/app/data/interfaces/IPropertyChangeListener";
import { IStyle } from "src/app/data/interfaces/IStyle";
import { Style } from "src/app/data/Style";

export class TunnelGraphic extends AbstractGraphic implements IPropertyChangeListener {
    public IPropertyChangeListener = 'TunnelGraphic';

    private tunnel!: any;
    private style!: IStyle;
    private zFactor = 0.55;

    constructor(parameters: ITunnelDesc, trajectory: Vector3[]) {
        super();
        this.setStyle();
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
        
    }

    private build = (parameters: ITunnelDesc, curve: CatmullRomCurve3) => {
        const tunnelCurve = this.extractCurve(curve, parameters.startAt, parameters.length);
        const material = this.createMaterial(parameters.settings || {});
        const geometry = this.createGeometry(parameters.bodyOD, parameters.bodyID, parameters.length, tunnelCurve);
        const tunnel = new THREE.Mesh(geometry, material);
        tunnel.translateZ(-this.zFactor);

        this.tunnel = tunnel;

        this.buildOuterBox(tunnelCurve, parameters.bodyOD, parameters.settings || {});
    }

    private buildOuterBox = (tunnelCurve: CatmullRomCurve3, outerRadius: number, settings: any) => {
        const material = new THREE.MeshStandardMaterial({
            color: Number(settings.color) || new THREE.Color(0xd3d3d3),
            side: THREE.DoubleSide,
            transparent: settings.opacity < 1,
            opacity: settings.opacity
        });

        const sideGeometry = this.createBoxGeometry(tunnelCurve, outerRadius, settings.isIsometricMode);
        const sideMesh = new THREE.Mesh(sideGeometry, material);
        this.getNode().add(sideMesh);
    }

    private createBoxGeometry = (curve: CatmullRomCurve3, outerRadius: number, isIsometricMode: boolean = false) => {
        const width = 6 * outerRadius;
        const length = outerRadius + 3;
        const buildShape = isIsometricMode ? this.buildIsometricShape : this.buildNormalShape;
        const shape = buildShape(length, width, outerRadius);
        const flowSteps = Math.round(Math.round(curve.getLength()) * 3);

        return new THREE.ExtrudeGeometry(shape, {
            steps: flowSteps,
            curveSegments: flowSteps,
            bevelEnabled: false,
            extrudePath: curve
        });
    }

    private buildNormalShape = (length: number, width: number, outerRadius: number) => {
        const start = length / 2;
        const end = width / 2;
        const sAngle = THREE.MathUtils.degToRad(-120);
        const eAngle = THREE.MathUtils.degToRad(120);

        const hole = new THREE.Path();
        hole.absarc(this.zFactor, 0, outerRadius, sAngle, eAngle, false);

        const shape = new THREE.Shape();
        shape.moveTo(-start + this.zFactor, -end);
        shape.lineTo(-start + this.zFactor, end);
        shape.lineTo(start + this.zFactor, end);
        shape.lineTo(start + this.zFactor, -end);
        shape.lineTo(-start + this.zFactor, -end);

        shape.holes.push(hole);

        return shape;
    }
    
    private buildIsometricShape = (length: number, width: number, outerRadius: number) => {
        const start = length / 2;
        const end = width / 2;
        const sAngle = THREE.MathUtils.degToRad(-120);
        const eAngle = THREE.MathUtils.degToRad(120);

        const shape = new THREE.Shape();
        shape.moveTo(-start + this.zFactor, -end);
        shape.lineTo(-start + this.zFactor, end);
        shape.lineTo(this.zFactor, end);

        // Draw part of circle
        shape.lineTo(this.zFactor, 0 + outerRadius);
        shape.absarc(this.zFactor, 0, outerRadius, Math.PI / 2, eAngle, false);
        shape.absarc(this.zFactor, 0, outerRadius, sAngle, 0, false);
        shape.moveTo(this.zFactor + outerRadius, 0);

        shape.lineTo(start + this.zFactor, 0);
        shape.lineTo(start + this.zFactor, -end);
        shape.lineTo(-start + this.zFactor, -end);

        return shape;
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

        const flowSteps = Math.round(Math.round(curve.getLength()) * 2);
        return new THREE.ExtrudeGeometry(shape, {
            steps: flowSteps,
            curveSegments: flowSteps,
            bevelEnabled: false,
            extrudePath: curve
        });
    }

    private createMaterial = (settings: any) => {
        const color = Number(settings.tunnelColor) || 0x8B4513;
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
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