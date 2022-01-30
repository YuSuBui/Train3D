import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { CatmullRomCurve3, MeshStandardMaterial, Vector3 } from "three";
import { IPropertyChangeListener } from "src/app/data/interfaces/IPropertyChangeListener";
import { IStyle } from "src/app/data/interfaces/IStyle";
import { Style } from "src/app/data/Style";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";
import { IView } from "../interfaces/IView";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

export class TrainGraphic extends AbstractGraphic implements IPropertyChangeListener {
    public IPropertyChangeListener = 'TrainGraphic';

    private trainModel!: THREE.Object3D;
    private train!: Flow;
    private style!: IStyle;
    private path!: CatmullRomCurve3;

    constructor(trajectory: Vector3[]) {
        super();
        this.trainModel = new THREE.Object3D();

        this.setStyle();
        this.path = new THREE.CatmullRomCurve3(trajectory);
        this.loadModelAsync();
    }

    private readonly setStyle = () => {
        this.style = new Style();
        this.style.addPropertyChangeListener(this);
    }

    public getStyle(): IStyle {
        return this.style;
    }

    drawBegin(view: IView): void {
    }

    public onPropertyChange(property: string, oldValue: any, newValue: any, object: any): void | Promise<void> {
    }

    private readonly loadModelAsync = () => {
        const loader = new MTLLoader();
        loader.load('assets/models/electrictrain.mtl', (material) => {
            material.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(material);

            objLoader.load('assets/models/electrictrain.obj', (model) => {
                model.traverse(function (child) {
                    if (child instanceof THREE.Mesh && child.material as MeshStandardMaterial) {
                        child.material.side = THREE.DoubleSide;
                    }
                });
                if (model.children && model.children[0]) {
                    const modelNode = model.children[0] as THREE.Mesh;
                    modelNode.geometry.scale(0.25, 0.15, 0.1);
                    modelNode.geometry.rotateX(Math.PI * .5);
                    modelNode.geometry.rotateY(Math.PI);
                    modelNode.geometry.rotateZ(Math.PI * .5);
                }
                this.trainModel = model;
                const trainModelCoor = new THREE.Box3().setFromObject(this.trainModel);
                this.setModelPosition(trainModelCoor.max.x - trainModelCoor.min.x);
            });
        });
    }

    private setModelPosition = (start: number) => {
        if (this.trainModel) {
            this.train = new Flow(this.trainModel as any);
            this.train.updateCurve(0, this.path);
            this.train.uniforms.spineOffset.value = (-start / 2);
            this.getNode().add(this.train.object3D);
        }
    }

}