import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { IView } from "../interfaces/IView";

export class GalaxyGraphic extends AbstractGraphic {
    private timer = 0;
    private particlesMesh!: THREE.Points;

    constructor(size = 500) {
        super();
        this.buildParticles();
    }

    drawBegin(view: IView): void {
        this.timer += Math.PI / 20000;
        this.getNode().rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.005)
    }

    private buildParticles = () => {

        const { posArray, colorArray} = this.buildGalaxyGeometry();
        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            // color: '#6cf6fe' //#2aa7d8
            // color: '#2aa7d8',
            vertexColors: true
        });

        this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

        const group = new THREE.Object3D();
        group.position.set(-5, -10, -5);
        group.add(this.particlesMesh);

        this.getNode().add(group);
    }

    private buildGalaxyGeometry = () => {
        const count = 20000;
        const a = 0.1;
        const b = 0.17;
        const windings = 4.7; // radius
        const tMax = 2.0 * Math.PI * windings;
        const drift = 0.3; // density 

        const posArray = new Float32Array(count * 3);
        const colorArray = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {

            const t = tMax * Math.random();
            let x = a * Math.exp(b * t) * Math.cos(t);
            x = x + (drift * x * Math.random()) - (drift * x * Math.random());
            let y = a * Math.exp(b * t) * Math.sin(t);
            y = y + (drift * y * Math.random()) - (drift * y * Math.random());

            const random = Math.random() > 0.5 ? 1 : -1;
            posArray[i] = random * x;
            posArray[i + 1] = random * y + 10;
            posArray[i + 2] = 5 * (1 + Math.random() * drift - Math.random() * drift) + 12;

            colorArray[i] = 0.2 + Math.random() / 3;
            colorArray[i + 1] = Math.random() / 2;
            colorArray[i + 2] =  0.7;
        };

        return {
            posArray,
            colorArray
        };
    }

    private evenlySpiral1 = () => {
        // const norm = Math.random() * 100;

        //     // Random variation to theta [-0.5, 0.5]
        //     const thetaVar = Math.random() * 0.5 - 0.5;

        //     // Theta grows from 0 to Math.PI (+ random variation)
        //     const theta = norm * Math.PI + thetaVar;

        //     // Phi stays close to 0 to create galaxy ecliptic plane
        //     const phi = Math.random() * 0.2 - 0.1;

        //     // Distance grows from 0 to galaxySize
        //     const distance = norm * galaxySize;

        //     posArray[i] = distance * Math.sin(theta) * Math.cos(phi);
        //     posArray[i + 1] = distance * Math.sin(theta) * Math.sin(phi);
        //     posArray[i + 2] = distance * Math.cos(theta);
    }
}