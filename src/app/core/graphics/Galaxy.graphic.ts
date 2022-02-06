import { AbstractGraphic } from "./Abstract.graphic";
import * as THREE from "three";
import { IView } from "../interfaces/IView";

export class GalaxyGraphic extends AbstractGraphic {
    private timer = 0;
    private particlesMesh!: THREE.Points;
    private galaxy = new THREE.Object3D();
    private starMesh!: THREE.InstancedMesh;
    private stars: THREE.Object3D[] = [];
    private starVelocities: number[] = [];

    constructor(size = 500) {
        super();
        this.buildParticles();
        this.buildShootStars();
    }

    drawBegin(view: IView): void {
        this.timer += Math.PI / 20000;

        this.animateGalaxy();
        this.animateShootStars();        
    }

    private animateGalaxy = () => {
        if (this.galaxy) {
            this.galaxy.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.005);
        }
    }

    private animateShootStars = () => {
        if (this.stars) {
            this.stars.forEach((star: THREE.Object3D, i: number) => {
                star.position.y += this.starVelocities[i];
    
                if (star.position.y > 50) {
                    star.position.y = -70 + (Math.random() - 0.5) * 50;
                }

                star.updateMatrix();
                this.starMesh.setMatrixAt(i, star.matrix);
            });

            this.starMesh.instanceMatrix.needsUpdate = true;
        }
    }

    private buildGradientMaterial = (startcolor = 'white', endColor = 'black') => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color1: {
                    value: new THREE.Color(endColor)
                },
                color2: {
                    value: new THREE.Color(startcolor)
                }
            },
            vertexShader: `
              varying vec2 vUv;

              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position,1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 color1;
              uniform vec3 color2;
              
              varying vec2 vUv;
              
              void main() {
                gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
              }
            `,
        });
    }

    private buildShootStars = (count = 30) => {
        const geometry = new THREE.CylinderGeometry(0.1, 0.01, 10);
        const material = this.buildGradientMaterial();

        this.starMesh = new THREE.InstancedMesh(geometry, material, count);
        this.starMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.getNode().add(this.starMesh);
        this.stars = [];
        this.starVelocities = [];

        for (let i = 0; i < count; i++) {
            const dummy = new THREE.Object3D();
            this.starVelocities.push(Math.random() * 1.5 + 1);

            dummy.position.set(50 + Math.random() * 20, -70 + (Math.random() - 0.5) * 50, -1 + Math.random() * 10);
            dummy.scale.y = Math.random() + 1;
            dummy.scale.x = Math.random() * 2 + 1;
            dummy.scale.z =  dummy.scale.x;
            dummy.updateMatrix();

            this.starMesh.setMatrixAt(i, dummy.matrix);
            this.stars.push(dummy);
        }
    }

    private buildParticles = () => {

        const { posArray, colorArray } = this.buildGalaxyGeometry();
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

        this.galaxy.position.set(-5, -10, -5);
        this.galaxy.add(this.particlesMesh);

        this.getNode().add(this.galaxy);
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
            colorArray[i + 2] = 0.7;
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