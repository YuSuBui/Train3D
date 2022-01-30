import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";

export class SkyBoxGraphic extends AbstractGraphic {
    private mesh!: any;

    constructor(skyboxImage: string, size = 300) {
        super();
        this.foo(skyboxImage, size);
    }


    private foo = (skyboxImage: string, size = 1000) => {
        const materialArray = this.createMaterialArray(skyboxImage);
        const skyboxGeo = new THREE.BoxGeometry(size, size, size);
        this.mesh = new THREE.Mesh(skyboxGeo, materialArray);
        this.getNode().add(this.mesh);
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