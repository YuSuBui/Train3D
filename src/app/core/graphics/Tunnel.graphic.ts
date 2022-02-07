import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, Color, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { ITunnelDesc, TunnelType } from "src/app/data/interfaces/IMockData";
import { FRESNELSHADER } from "./interfaces/IFresnelShader";
import { IPropertyChangeListener } from "src/app/data/interfaces/IPropertyChangeListener";
import { ITunnelStyle } from "src/app/data/interfaces/ITunnelStyle";
import { TunnelStyle, TunnelStyleProperty } from "src/app/data/TunnelStyle";

export class TunnelGraphic extends AbstractGraphic implements IPropertyChangeListener {
    public IPropertyChangeListener = 'TunnelGraphic';

    private parameters!: ITunnelDesc;
    private tunnel!: Mesh;
    private sideMesh!: Mesh;
    private style!: ITunnelStyle;
    private zFactor = 0.55;
    private tunnelCurve!: CatmullRomCurve3;

    constructor(parameters: ITunnelDesc, trajectory: Vector3[]) {
        super();
        this.setStyle();
        const curve3 = new THREE.CatmullRomCurve3(trajectory);
        this.parameters = parameters;
        this.tunnelCurve = this.extractCurve(curve3, parameters.startAt, parameters.length);

        this.build(this.parameters, this.tunnelCurve);
        this.buildOuterBox(this.tunnelCurve, this.parameters.bodyOD);

        this.getNode().add(this.sideMesh);
        this.getNode().add(this.tunnel);
    }

    private readonly setStyle = () => {
        this.style = new TunnelStyle();
        this.style.addPropertyChangeListener(this);
    }

    public getStyle(): ITunnelStyle {
        return this.style;
    }

    public onPropertyChange(property: string, oldValue: any, newValue: any, object: any): void | Promise<void> {
        if (property === TunnelStyleProperty.SINGLE_COLOR) {
            this.changeColor(this.sideMesh, this.style.getColor());
        }
        if (property === TunnelStyleProperty.TUNNEL_COLOR) {
            const material = this.createMaterial();
            this.tunnel.material = material;
            material.needsUpdate = true;
        }
        if (property === TunnelStyleProperty.OPACITY) {
            this.changeOpacity(this.sideMesh, this.style.getOpacity());
        }
        if (property === TunnelStyleProperty.ISOMETRIC_MODE) {
            this.disposeOuterBox();
            this.buildOuterBox(this.tunnelCurve, this.parameters.bodyOD);
            this.getNode().add(this.sideMesh);
        }

    }

    private readonly disposeOuterBox = () => {
        if (this.sideMesh) {
            this.getNode().remove(this.sideMesh);
        }
    }

    private readonly changeColor = (mesh: Mesh, color: Color) => {
        const material = mesh.material as MeshStandardMaterial;
        material.color.setHex(color.getHex());
        material.needsUpdate = true;
    }

    private readonly changeOpacity = (mesh: Mesh, opacity: number) => {
        const material = mesh.material as MeshStandardMaterial;
        material.opacity = this.style.getOpacity();
        material.transparent = this.style.getOpacity() < 1;
        material.needsUpdate = true;
    }

    private readonly build = (parameters: ITunnelDesc, tunnelCurve: CatmullRomCurve3) => {
        const material = this.createMaterial();
        const geometry = this.createGeometry(parameters.bodyOD, parameters.bodyID, parameters.length, tunnelCurve);
        geometry.rotateX(-Math.PI / 2);
        const tunnel = new THREE.Mesh(geometry, material);
        tunnel.rotateX(Math.PI / 2);
        tunnel.translateY(-this.zFactor);

        this.tunnel = tunnel;
    }

    private readonly buildOuterBox = (tunnelCurve: CatmullRomCurve3, outerRadius: number) => {
        const material = new THREE.MeshStandardMaterial({
            color: this.style.getColor(),
            side: THREE.DoubleSide,
            transparent: this.style.getOpacity() < 1,
            opacity: this.style.getOpacity()
        });

        const sideGeometry = this.createBoxGeometry(tunnelCurve, outerRadius, this.style.isIsometricMode());
        this.sideMesh = new THREE.Mesh(sideGeometry, material);
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

    private createMaterial = () => {
        if (this.style.getType() === TunnelType.NORMAL) {
            return this.createNormalMaterial(this.style.getTunnelColor(), 1);
        }
        return this.createFresnelMaterial(this.style.getTunnelColor(), 1);
    }

    private createNormalMaterial = (color: Color, opacity: number) => {
        return new THREE.MeshStandardMaterial({
            color: color,
            side: THREE.DoubleSide,
            opacity: opacity,
            transparent: opacity < 1
        });
    }

    private createFresnelMaterial = (color: Color, opacity: number) => {
        const uniform = {
            color: {
                type: "c",
                value: color,
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