import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, Object3D, Vector3 } from "three";
import { IGangZData } from "src/app/data/interfaces/IMockData";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { IView } from "../interfaces/IView";

export class GangZGraphic extends AbstractGraphic {
    private gangzMesh!: any;
    private gangs!: Object3D[];
    private mttlloader = new MTLLoader();
    private dataAdapter: IGangZData;
    private timer = 0;

    constructor(params: IGangZData) {
        super();
        this.dataAdapter = params;
        this.loadGangZ(params);
    }

    drawBegin(view: IView): void {
        this.timer += Math.PI / 150;
        if (this.gangzMesh) {
            this.move();
        }
    }

    private move = () => {
        for (let i = 0; i < this.dataAdapter.count; i++) {
            const dummy = this.gangs[i] as Object3D;

            const position = this.dataAdapter.data.position || { x: 0, y: 0, z: 0 };
            const range = this.dataAdapter.data.range || { x: 0, y: 0, z: 0 };

            dummy.rotation.z = this.timer + Math.PI * this.dataAdapter.rotation.z;
            dummy.position.z += 0.05 * Math.random() * Math.cos(this.timer);
            dummy.position.y = range.y * Math.cos(this.timer) + position.y + i / 20;
            dummy.position.x = range.x * Math.sin(this.timer) + position.x - i / 30;

            dummy.updateMatrix();
            this.gangzMesh.setMatrixAt(i, dummy.matrix);
        }
        this.gangzMesh.instanceMatrix.needsUpdate = true;
    }

    private loadGangZ = (params: IGangZData) => {
        this.mttlloader.load(params.mtlPath || '', (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            // objLoader.setPath('obj/male02/');

            objLoader.load(params.objPath, (model) => {
                const loadedMesh = model.children[0] as THREE.Mesh;
                const mesh = new THREE.InstancedMesh(loadedMesh.geometry, loadedMesh.material, params.count || 10);
                mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                this.getNode().add(mesh);
                this.gangs = [];

                for (let i = 0; i < params.count; i++) {
                    const dummy = new THREE.Object3D();

                    // dummy.position.set(30 +  Math.random(), -15 + Math.random() * 2, 0 + Math.random());
                    dummy.position.set(0 + Math.random(), -0 + Math.random() * 2, -2 + Math.random());
                    dummy.scale.set(params.scale, params.scale, params.scale);
                    dummy.rotateX(Math.PI);
                    dummy.rotateZ(Math.PI * params.rotation.z + Math.PI / 3 * Math.random());

                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                    this.gangs.push(dummy);
                }

                this.gangzMesh = mesh;
            });
        });
    }
}