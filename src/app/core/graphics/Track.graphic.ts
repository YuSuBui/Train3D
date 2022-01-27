import { CatmullRomCurve3, TextureLoader, Vector3 } from "three";
import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";

export class TrackGraphic extends AbstractGraphic {
    private trajectory!: Vector3[];
    private textureLoad!: TextureLoader;
    private mesh!: THREE.Mesh;

    constructor(trajectory: Vector3[]) {
        super();
        console.log('trajectory', trajectory);
        this.textureLoad = new TextureLoader();
        this.trajectory = trajectory;

        const curve = new THREE.CatmullRomCurve3(this.trajectory, true);
        this.build(curve);
        this.getNode().add(this.mesh);

    }

    private readonly build = (curve: CatmullRomCurve3) => {
        const geometry = this.createGeometry(curve);
        const material = this.createMaterial(curve);
        this.mesh = new THREE.Mesh(geometry, material);
    }

    private createMaterial = (curve: CatmullRomCurve3) => {
        const texture = this.textureLoad.load('assets/train_track.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(curve.getLength() / 2, 2);

        const material = [
            new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide }),
        ];
        return material;
    }

    private createGeometry = (curve: CatmullRomCurve3) => {
        const ls = 1400; // length segments
        const ws = 5; // width segments 
        const lss = ls + 1;
        const wss = ws + 1;

        const points = curve.getPoints(ls);
        const len = curve.getLength();
        const lenList = curve.getLengths(ls);

        const faceCount = ls * ws * 2;
        const vertexCount = lss * wss;

        const indices = new Uint32Array(faceCount * 3);
        const vertices = new Float32Array(vertexCount * 3);
        const uvs = new Float32Array(vertexCount * 2);

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        let idxCount = 0;
        let a, b1, c1, c2;

        for (let j = 0; j < ls; j++) {
            for (let i = 0; i < ws; i++) {
                // 2 faces / segment,  3 vertex indices
                a = wss * j + i;
                b1 = wss * (j + 1) + i;		// right-bottom
                c1 = wss * (j + 1) + 1 + i;
                //  b2 = c1							// left-top
                c2 = wss * j + 1 + i;

                indices[idxCount] = a; // right-bottom
                indices[idxCount + 1] = b1;
                indices[idxCount + 2] = c1;

                indices[idxCount + 3] = a; // left-top
                indices[idxCount + 4] = c1 // = b2,
                indices[idxCount + 5] = c2;

                geometry.addGroup(idxCount, 6, i); // write group for multi material

                idxCount += 6;

            }

        }

        let uvIdxCount = 0;

        for (let j = 0; j < lss; j++) {

            for (let i = 0; i < wss; i++) {

                uvs[uvIdxCount] = lenList[j] / len;
                uvs[uvIdxCount + 1] = i / ws;

                uvIdxCount += 2;

            }

        }

        let x, y, z;
        let posIdx = 0; // position index

        let tangent;
        const normal = new THREE.Vector3();
        const binormal = new THREE.Vector3(0, 0, 1);

        const t = []; // tangents
        const n = []; // normals
        const b = []; // binormals

        for (let j = 0; j < lss; j++) {
            // to the points
            tangent = curve.getTangent(j / ls);
            t.push(tangent.clone());

            normal.crossVectors(tangent, binormal);

            normal.z = 0; // to prevent lateral slope of the road

            normal.normalize();
            n.push(normal.clone());

            binormal.crossVectors(normal, tangent); // new binormal
            b.push(binormal.clone());

        }

        const dw = [-0.36, -0.34, -0.01, 0.01, 0.34, 0.36]; // width from the center line

        for (let j = 0; j < lss; j++) {  // length
            for (let i = 0; i < wss; i++) { // width
                x = points[j].x + dw[i] * n[j].x;
                z = points[j].z;
                y = points[j].y + dw[i] * n[j].y;

                vertices[posIdx] = x;
                vertices[posIdx + 1] = y;
                vertices[posIdx + 2] = z;

                posIdx += 3;

            }

        }

        return geometry;
    }
}