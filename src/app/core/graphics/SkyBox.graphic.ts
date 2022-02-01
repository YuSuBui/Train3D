import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { IView } from "../interfaces/IView";

export class SkyBoxGraphic extends AbstractGraphic {
    private mesh!: THREE.Mesh;

    constructor(skyboxImage: string, size = 500) {
        super();
        this.buildCube(skyboxImage, size);
        this.buildSun();
    }

    drawBegin(view: IView): void {
        this.mesh.rotation.x += 0.001;
        this.mesh.rotation.y += 0.001;
    }


    private buildCube = (skyboxImage: string, size = 1000) => {
        const materialArray = this.createMaterialArray(skyboxImage);
        const skyboxGeo = new THREE.BoxGeometry(size, size, size);
        this.mesh = new THREE.Mesh(skyboxGeo, materialArray);
        
        this.turnOnGlowing(this.mesh);
        this.getNode().add(this.mesh);
    }

    private buildSun = () => {
        const color = new THREE.Color("#FDB813");
        const geometry = new THREE.IcosahedronGeometry(5, 15);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(10, -5, -10);

        this.turnOnGlowing(sphere);
        this.getNode().add(sphere);
    }

    private createMaterialArray = (filename: string) => {
        const skyboxImagepaths = this.createPathStrings(filename);
        const materialArray = skyboxImagepaths.map((image: string) => {
            let texture = new THREE.TextureLoader().load(image);
            return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        });
        return materialArray;
    }

    private createPathStrings = (filename: string) => {
        const baseFilename = "assets/skybox/" + filename + '/' + filename;
        const fileType = ".png";
        const sides = ["ft", "bk", "up", "dn", "rt", "lf"];

        return sides.map(side => {
            return baseFilename + "_" + side + fileType;
        });
    }
}