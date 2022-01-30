import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { CatmullRomCurve3, Object3D, Vector3 } from "three";
import { ITunnelDesc } from "src/app/data/interfaces/IMockData";
import { CSG } from 'three-csg-ts';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

export class GangZGraphic extends AbstractGraphic {
    private tunnel!: any;
    private zFactor = 0.55;
    private mttlloader = new MTLLoader();
    private objLoader = new OBJLoader();

    constructor(parameters: ITunnelDesc, trajectory: Vector3[]) {
        super();
        this.loadFishSchool('assets/fish.obj', 'assets/fish.mtl', 0.01);
        this.loadFishSchool('assets/angel_fish.obj', 'assets/angel_fish.mtl', 0.2);
    }


    private loadFishSchool = (objUrl: string, mtlUrl: string, scale: number) => {
        this.mttlloader.load(mtlUrl, (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            // objLoader.setPath('obj/male02/');

            objLoader.load(objUrl, (fish) => {
                const loadedFishMesh = fish.children[0] as THREE.Mesh;
                const mesh = new THREE.InstancedMesh(loadedFishMesh.geometry, loadedFishMesh.material, 10);
                mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                this.getNode().add(mesh);

                for (let i = 0; i < 10; i++) {
                    const dummy = new THREE.Object3D();
                    // dummy.position.set(30 +  Math.random(), -15 + Math.random() * 2, 0 + Math.random());
                    dummy.position.set(0 + Math.random(), -0 + Math.random() * 2, -2 + Math.random());
                    dummy.scale.set(scale, scale, scale);
                    dummy.rotateX(Math.PI);
                    dummy.rotateZ(Math.PI / 2 + Math.PI / 3 * Math.random());

                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                }
            });
        });
    }
}