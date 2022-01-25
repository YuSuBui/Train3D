import { AmbientLight, DirectionalLight, Scene, Vector3, WebGLRenderer } from "three";
import { IView } from "./interfaces/IView";
import { IWorld } from "./interfaces/IWorld";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class View implements IView {
    IView: string = 'IView';

    private dirty: boolean = false;
    private fov: number = 45;
    private canvas!: HTMLCanvasElement;
    private scene!: Scene;
    private camera!: any;
    private renderer!: WebGLRenderer;
    private controls!: OrbitControls;

    private world!: IWorld;
    private directionalLight!: any;

    constructor(canvas: string) {
        this.canvas = <HTMLCanvasElement>document.querySelector(canvas);
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControl();
        this.setupLights();
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    setCameraPosition(value: Vector3): void {
        this.camera.position.set(value);
    }

    getCameraPosition(): Vector3 {
        return this.camera.position;
    }

    setWorld(world: IWorld): void {
        this.world = world;
        this.world.getMainGroup().setScene(this.scene);
    }

    reset(): void {
        // do nothing
    }

    setCenterView(point: Vector3): void {
        this.controls.target.set(point.x, point.y, point.z);
    }

    render(): void {
        // first, clear dirty flag
        this.dirty = false;

        this.onResize();

        const wd = this.camera.getWorldDirection(new THREE.Vector3());
        this.directionalLight.position.set(-wd.x, -wd.y, -wd.z);
        this.world.drawBegin(this);

        // draw(): render the world
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);

        // drawEnd()
        this.world.drawEnd(this);
    }

    isDirty(): boolean {
        return this.dirty;
    }

    getCamera() {
        return this.camera;
    }

    getClientWidth(): number {
        return this.renderer.domElement.clientWidth;
    }

    getClientHeight(): number {
        return this.renderer.domElement.clientHeight;
    }

    private onResize() {
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            console.log('resize');
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
    }

    private resizeRendererToDisplaySize(renderer: WebGLRenderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    private readonly setupScene = (): void => {
        this.scene = new Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    private readonly setupCamera = () => {
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.x = 120;
        this.camera.position.y = 0;
        this.camera.position.z = 0;
    }

    private readonly setupRenderer = () => {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.render(this.scene, this.camera);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private readonly setupControl = () => {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.target.set(0, -20, 0);
        this.controls.update();
    }

    private readonly setupLights = (): void => {
        const lights = new THREE.AmbientLight(0xB1E1FF, 0.7);
        this.scene.add(lights);

        this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.scene.add(this.directionalLight);
    }
}