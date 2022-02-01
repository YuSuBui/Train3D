import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import * as THREE from "three";
import { IView } from "./interfaces/IView";

export class SelectiveBloomEngine {
    
    private readonly ENTIRE_SCENE = 0;
    private readonly BLOOM_SCENE = 1;
    private readonly bloomLayer = new THREE.Layers();
    private readonly darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    private materials: any = {};
    private bloomComposer!: EffectComposer;
    private finalComposer!: EffectComposer;
    private view: IView;

    constructor(view: IView) {
        this.view = view;
    }

    public readonly setupEngine = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
        this.bloomLayer.set(this.BLOOM_SCENE);

        const renderScene = new RenderPass(scene, camera);
        const bloomPass = this.buildBloomPass();
        
        this.bloomComposer = new EffectComposer(renderer);
        // this.bloomComposer.setSize(window.innerWidth, window.innerHeight);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(renderScene);
        this.bloomComposer.addPass(bloomPass);
        
        const finalPass = this.buildFinalPass(this.bloomComposer);
        
        this.finalComposer = new EffectComposer(renderer);
        this.finalComposer.addPass(renderScene);
        this.finalComposer.addPass(finalPass);
    }

    public readonly render = (scene: THREE.Scene, camera: THREE.Camera, mask = true) => {
        if (mask === true) {
            scene.traverse(this.darkenNonBloomed);
            this.bloomComposer.render();
            scene.traverse(this.restoreMaterial);
        } else {
            camera.layers.set(this.BLOOM_SCENE);
            this.bloomComposer.render();
            camera.layers.set(this.ENTIRE_SCENE);
        }
        this.finalComposer.render();
    }

    public readonly setSize = (innerWidth: number, innerHeight: number) => {
        this.bloomComposer.setSize(innerWidth, innerHeight);
        this.finalComposer.setSize(innerWidth, innerHeight);
    }

    private buildBloomPass = () => {
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 2; //intensity of glow
        bloomPass.radius = 0;

        return bloomPass;
    }

    private buildFinalPass = (bloomComposer: EffectComposer) => {
        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: this.getVertexShader(),
                fragmentShader: this.getFragmentShader(),
                defines: {}
            }), 'baseTexture'
        );
        finalPass.needsSwap = true;

        return finalPass;
    }

    private darkenNonBloomed = (obj: any) => {
        if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
            this.materials[obj.uuid] = obj.material;
            obj.material = this.darkMaterial;
        }
    }

    private restoreMaterial = (obj: any) => {
        if (this.materials[obj.uuid]) {
            obj.material = this.materials[obj.uuid];
            delete this.materials[obj.uuid];
        }
    }

    
    private getFragmentShader = () => {
        return `
            uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {
				gl_FragColor = (texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv));
			}
        `
    }

    private getVertexShader = () => {
        return `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `
    }
}