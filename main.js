(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/admin/Desktop/My Projects/train3D/src/main.ts */"zUnb");


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "BL3H":
/*!**********************************************!*\
  !*** ./src/app/data/interfaces/IMockData.ts ***!
  \**********************************************/
/*! exports provided: TunnelType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TunnelType", function() { return TunnelType; });
var TunnelType;
(function (TunnelType) {
    TunnelType["NORMAL"] = "NORMAL";
    TunnelType["UNDER"] = "UNDER";
})(TunnelType || (TunnelType = {}));


/***/ }),

/***/ "HWwP":
/*!******************************!*\
  !*** ./src/app/core/View.ts ***!
  \******************************/
/*! exports provided: View */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View", function() { return View; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "RyHr");
/* harmony import */ var _SelectiveBloomEngine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectiveBloomEngine */ "haLD");




class View {
    constructor(canvas) {
        this.IView = 'IView';
        this.dirty = false;
        this.fov = 45;
        this.setupScene = () => {
            this.scene = new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
            this.scene.background = new three__WEBPACK_IMPORTED_MODULE_0__["Color"](0x000000);
        };
        this.setupCamera = () => {
            this.camera = new three__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"](this.fov, window.innerWidth / window.innerHeight, 0.1, 20000);
            this.camera.position.x = -5;
            this.camera.position.y = 5;
            this.camera.position.z = 5;
            this.camera.zoom = 0.5;
        };
        this.setupRenderer = () => {
            this.renderer = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderer"]({
                canvas: this.canvas,
                antialias: true,
                powerPreference: 'high-performance'
            });
            this.renderer.render(this.scene, this.camera);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        this.setupControl = () => {
            this.controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__["OrbitControls"](this.camera, this.canvas);
            this.controls.target.set(0, 0, 0);
            this.controls.maxDistance = 300;
            this.controls.update();
        };
        this.setupLights = () => {
            const lights = new three__WEBPACK_IMPORTED_MODULE_0__["AmbientLight"](0xB1E1FF, 0.7);
            this.scene.add(lights);
            this.directionalLight = new three__WEBPACK_IMPORTED_MODULE_0__["DirectionalLight"](0xFFFFFF, 1);
            this.scene.add(this.directionalLight);
        };
        this.setupBloomEngine = () => {
            this.bloomEngine = new _SelectiveBloomEngine__WEBPACK_IMPORTED_MODULE_2__["SelectiveBloomEngine"](this);
            this.bloomEngine.setupEngine(this.renderer, this.scene, this.camera);
        };
        this.canvas = document.querySelector(canvas);
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControl();
        this.setupLights();
        this.setupBloomEngine();
    }
    getCanvas() {
        return this.canvas;
    }
    setCameraPosition(value) {
        this.camera.position.set(value.x, value.y, value.z);
    }
    getCameraPosition() {
        return this.camera.position;
    }
    setWorld(world) {
        this.world = world;
        this.world.getMainGroup().setScene(this.scene);
    }
    reset() {
        // do nothing
    }
    setCenterView(point) {
        this.controls.target.set(point.x, point.y, point.z);
    }
    render() {
        // first, clear dirty flag
        this.dirty = false;
        this.onResize();
        const wd = this.camera.getWorldDirection(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]());
        this.directionalLight.position.set(-wd.x, -wd.y, -wd.z);
        this.world.drawBegin(this);
        // draw(): render the world
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        // render bloom effects
        this.bloomEngine.render(this.scene, this.camera);
        // drawEnd()
        this.world.drawEnd(this);
    }
    isDirty() {
        return this.dirty;
    }
    getCamera() {
        return this.camera;
    }
    getClientWidth() {
        return this.renderer.domElement.clientWidth;
    }
    getClientHeight() {
        return this.renderer.domElement.clientHeight;
    }
    onResize() {
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            console.log('resize');
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.bloomEngine.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    }
    resizeRendererToDisplaySize(renderer) {
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
}


/***/ }),

/***/ "I+z6":
/*!************************************************!*\
  !*** ./src/app/core/graphics/Train.graphic.ts ***!
  \************************************************/
/*! exports provided: TrainGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrainGraphic", function() { return TrainGraphic; });
/* harmony import */ var _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Abstract.graphic */ "zo7q");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var three_examples_jsm_loaders_OBJLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/loaders/OBJLoader */ "5kJi");
/* harmony import */ var src_app_data_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/data/Style */ "bQJV");
/* harmony import */ var three_examples_jsm_modifiers_CurveModifier_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/modifiers/CurveModifier.js */ "InK2");
/* harmony import */ var three_examples_jsm_loaders_MTLLoader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three/examples/jsm/loaders/MTLLoader */ "QIYC");






class TrainGraphic extends _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__["AbstractGraphic"] {
    constructor(trajectory) {
        super();
        this.IPropertyChangeListener = 'TrainGraphic';
        this.setStyle = () => {
            this.style = new src_app_data_Style__WEBPACK_IMPORTED_MODULE_3__["Style"]();
            this.style.addPropertyChangeListener(this);
        };
        this.loadModelAsync = () => {
            const loader = new three_examples_jsm_loaders_MTLLoader__WEBPACK_IMPORTED_MODULE_5__["MTLLoader"]();
            loader.load('assets/models/electrictrain.mtl', (material) => {
                material.preload();
                const objLoader = new three_examples_jsm_loaders_OBJLoader__WEBPACK_IMPORTED_MODULE_2__["OBJLoader"]();
                objLoader.setMaterials(material);
                objLoader.load('assets/models/electrictrain.obj', (model) => {
                    model.traverse(function (child) {
                        if (child instanceof three__WEBPACK_IMPORTED_MODULE_1__["Mesh"] && child.material) {
                            child.material.side = three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"];
                        }
                    });
                    if (model.children && model.children[0]) {
                        const modelNode = model.children[0];
                        modelNode.geometry.scale(0.25, 0.15, 0.1);
                        modelNode.geometry.rotateX(Math.PI * .5);
                        modelNode.geometry.rotateY(Math.PI);
                        modelNode.geometry.rotateZ(Math.PI * .5);
                    }
                    this.trainModel = model;
                    const trainModelCoor = new three__WEBPACK_IMPORTED_MODULE_1__["Box3"]().setFromObject(this.trainModel);
                    this.setModelPosition(trainModelCoor.max.x - trainModelCoor.min.x);
                });
            });
        };
        this.setModelPosition = (start) => {
            if (this.train) {
                this.train.updateCurve(0, this.path);
                this.train.uniforms.spineOffset.value = (start / 2); // to do: not hard code - BUG
            }
            else {
                this.train = new three_examples_jsm_modifiers_CurveModifier_js__WEBPACK_IMPORTED_MODULE_4__["Flow"](this.trainModel, this.flowSteps);
                this.train.updateCurve(0, this.path);
                this.train.uniforms.spineOffset.value = (start / 2); // to do: not hard code
                this.getNode().add(this.train.object3D);
            }
        };
        this.trainModel = new three__WEBPACK_IMPORTED_MODULE_1__["Object3D"]();
        this.setStyle();
        this.path = new three__WEBPACK_IMPORTED_MODULE_1__["CatmullRomCurve3"](trajectory);
        this.flowSteps = Math.round(Math.round(this.path.getLength()) * 2);
        this.loadModelAsync();
    }
    getStyle() {
        return this.style;
    }
    drawBegin(view) {
        if (this.train) {
            this.train.moveAlongCurve(1 / this.flowSteps);
        }
    }
    onPropertyChange(property, oldValue, newValue, object) {
    }
}


/***/ }),

/***/ "ISdO":
/*!*******************************!*\
  !*** ./src/app/core/World.ts ***!
  \*******************************/
/*! exports provided: World */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "World", function() { return World; });
/* harmony import */ var _MainGroup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MainGroup */ "xuDr");

class World {
    constructor(viewer) {
        this.IWorld = 'IWorld';
        this.setupMainGroup = () => {
            this.group = new _MainGroup__WEBPACK_IMPORTED_MODULE_0__["MainGroup"]();
        };
        this.viewer = viewer;
        this.setupMainGroup();
    }
    getMainGroup() {
        return this.group;
    }
    drawBegin(view) {
        this.getMainGroup().getChildNodes().forEach(node => {
            node.drawBegin(view);
        });
    }
    drawEnd(view) {
        this.getMainGroup().getChildNodes().forEach(node => {
            node.drawEnd(view);
        });
    }
}


/***/ }),

/***/ "KVaJ":
/*!*************************************!*\
  !*** ./src/app/data/DataAdapter.ts ***!
  \*************************************/
/*! exports provided: DataAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataAdapter", function() { return DataAdapter; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");


class DataAdapter {
    constructor(data) {
        this.computeTrajectory = () => {
            const length = Math.min(this.trajectoryX.length, this.trajectoryY.length, this.trajectoryZ.length);
            if (length === 0) {
                this.trajectory.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 0, 0));
            }
            else {
                for (let i = 0; i < length; i++) {
                    this.trajectory.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](this.trajectoryX[i], this.trajectoryY[i], this.trajectoryZ[i]));
                }
            }
        };
        this.trajectory = new Array();
        this.trajectoryX = data.trajectoryX;
        this.trajectoryY = data.trajectoryY;
        this.trajectoryZ = data.trajectoryZ;
        this.computeTrajectory();
        console.log('DataAdapter length = ', this.getLength());
    }
    getLength() {
        return new three__WEBPACK_IMPORTED_MODULE_0__["CatmullRomCurve3"](this.trajectory).getLength();
    }
    getTrajectory() {
        return this.trajectory;
    }
}


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _engine_engine_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./engine/engine.service */ "eW6i");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");



const _c0 = ["canvas"];
class AppComponent {
    constructor(engineService) {
        this.engineService = engineService;
        this.title = 'Train3D';
    }
    ngOnInit() {
        // create scene of rendering and progress
        this.engineService.createScene(this.canvas);
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_engine_engine_service__WEBPACK_IMPORTED_MODULE_1__["EngineService"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], viewQuery: function AppComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, 3);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.canvas = _t.first);
    } }, decls: 3, vars: 0, consts: [["id", "canvas"], ["canvas", ""]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "canvas", 0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterOutlet"]], styles: ["[_nghost-%COMP%] {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  overflow: hidden;\n}\n\n#canvas[_ngcontent-%COMP%] {\n  flex: 1;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFlBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtFQUNBLGdCQUFBO0FBQ0o7O0FBRUE7RUFHSSxPQUFBO0FBREoiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICAgIGhlaWdodDogMTAwJTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbiNjYW52YXMge1xuICAgIC8vIGhlaWdodDogMTAwJSFpbXBvcnRhbnQ7XG4gICAgLy8gd2lkdGg6IDEwMCUhaW1wb3J0YW50O1xuICAgIGZsZXg6IDE7XG59Il19 */"] });


/***/ }),

/***/ "X31c":
/*!***********************************************!*\
  !*** ./src/app/services/mock-data.service.ts ***!
  \***********************************************/
/*! exports provided: MockDataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MockDataService", function() { return MockDataService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");



class MockDataService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.trajectory = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.tunnel = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.gangzList = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.httpClient.get('assets/mock-data.json').subscribe((data) => {
            console.log("data json from MockDataService ", data);
            this.trajectory.next(data.trajectory);
            this.tunnel.next(data.tunnel);
            this.gangzList.next(data.gangzList);
        });
    }
    getTrajectory() {
        return this.trajectory.asObservable();
    }
    getListOfGangZ() {
        return this.gangzList.asObservable();
    }
    getTunnel() {
        return this.tunnel.asObservable();
    }
}
MockDataService.ɵfac = function MockDataService_Factory(t) { return new (t || MockDataService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"])); };
MockDataService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: MockDataService, factory: MockDataService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "fXoL");





class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClientModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClientModule"]] }); })();


/***/ }),

/***/ "bQJV":
/*!*******************************!*\
  !*** ./src/app/data/Style.ts ***!
  \*******************************/
/*! exports provided: StyleProperty, Style */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StyleProperty", function() { return StyleProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Style", function() { return Style; });
/* harmony import */ var _AbstractPropertyModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractPropertyModel */ "geSu");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "Womt");


var StyleProperty;
(function (StyleProperty) {
    StyleProperty["SINGLE_COLOR"] = "SINGLE_COLOR";
    StyleProperty["OPACITY"] = "OPACITY";
})(StyleProperty || (StyleProperty = {}));
class Style extends _AbstractPropertyModel__WEBPACK_IMPORTED_MODULE_0__["AbstractPropertyModel"] {
    constructor(listener) {
        super(listener);
        this.IStyle = "IStyle";
        this.color = new three__WEBPACK_IMPORTED_MODULE_1__["Color"](0x0000ff);
        this.opacity = 1;
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        const oldValue = this.color;
        this.color = color;
        this.firePropertyChange(StyleProperty.SINGLE_COLOR, oldValue, color, this);
    }
    getOpacity() {
        return this.opacity;
    }
    setOpacity(opacity) {
        const oldValue = this.opacity;
        this.opacity = opacity;
        this.firePropertyChange(StyleProperty.OPACITY, oldValue, opacity, this);
    }
    getPropertyNames() {
        return Object.values(StyleProperty);
    }
    getPropertyValue(property) {
        switch (property) {
            case StyleProperty.SINGLE_COLOR:
                return this.getColor();
            case StyleProperty.OPACITY:
                return this.getOpacity();
        }
    }
}


/***/ }),

/***/ "eW6i":
/*!******************************************!*\
  !*** ./src/app/engine/engine.service.ts ***!
  \******************************************/
/*! exports provided: EngineService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineService", function() { return EngineService; });
/* harmony import */ var _core_graphics_DirectionPlan_graphic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/graphics/DirectionPlan.graphic */ "h76x");
/* harmony import */ var _core_graphics_Galaxy_graphic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/graphics/Galaxy.graphic */ "zbWN");
/* harmony import */ var _core_graphics_SkyBox_graphic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/graphics/SkyBox.graphic */ "wR3q");
/* harmony import */ var _core_graphics_Train_graphic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/graphics/Train.graphic */ "I+z6");
/* harmony import */ var _data_DataAdapter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../data/DataAdapter */ "KVaJ");
/* harmony import */ var _data_interfaces_IMockData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../data/interfaces/IMockData */ "BL3H");
/* harmony import */ var _engine_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./engine.common */ "lFSJ");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services_mock_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/mock-data.service */ "X31c");









class EngineService {
    constructor(mockData) {
        this.mockData = mockData;
        this.subscriptions = [];
        this.loadSkyBox = () => {
            const skybox = new _core_graphics_SkyBox_graphic__WEBPACK_IMPORTED_MODULE_2__["SkyBoxGraphic"]('purplenebula');
            this.mainGroup.addNode(skybox);
            const galaxy = new _core_graphics_Galaxy_graphic__WEBPACK_IMPORTED_MODULE_1__["GalaxyGraphic"]();
            this.mainGroup.addNode(galaxy);
        };
        this.loadListOfGangZ = () => {
            const subscription = this.mockData.getListOfGangZ().subscribe((gangs) => {
                gangs.forEach((gang) => {
                    const gangzGraphic = _engine_common__WEBPACK_IMPORTED_MODULE_6__["EngineCommon"].createGangZ(gang);
                    this.mainGroup.addNode(gangzGraphic);
                });
            });
            this.subscriptions.push(subscription);
        };
    }
    createScene(canvasElement) {
        this.canvasElement = canvasElement;
        _engine_common__WEBPACK_IMPORTED_MODULE_6__["EngineCommon"].createViewer(this.canvasElement).then((viewer) => {
            this.viewer = viewer;
            this.mainGroup = viewer.getWorld().getMainGroup();
            this.loadSkyBox();
            this.mockData.getTrajectory().subscribe((trajectory) => {
                this.dataAdapter = new _data_DataAdapter__WEBPACK_IMPORTED_MODULE_4__["DataAdapter"](trajectory);
                const directionPlanGraphic = new _core_graphics_DirectionPlan_graphic__WEBPACK_IMPORTED_MODULE_0__["DirectionPlanGraphic"](this.dataAdapter);
                this.mainGroup.addNode(directionPlanGraphic);
                // create train track graphic
                const trackGraphic = _engine_common__WEBPACK_IMPORTED_MODULE_6__["EngineCommon"].createTrack(this.dataAdapter.getTrajectory());
                this.mainGroup.addNode(trackGraphic);
                // create train model graphic
                const trainGraphic = new _core_graphics_Train_graphic__WEBPACK_IMPORTED_MODULE_3__["TrainGraphic"](this.dataAdapter.getTrajectory());
                this.mainGroup.addNode(trainGraphic);
            });
            this.mockData.getTunnel().subscribe((tunnels) => {
                tunnels.forEach((tunnel) => {
                    const tunnelGraphic = _engine_common__WEBPACK_IMPORTED_MODULE_6__["EngineCommon"].createTunnel(tunnel, this.dataAdapter.getTrajectory());
                    if (tunnel.type === _data_interfaces_IMockData__WEBPACK_IMPORTED_MODULE_5__["TunnelType"].UNDER) {
                        tunnelGraphic.getStyle().setOpacity(0.5);
                    }
                    this.mainGroup.addNode(tunnelGraphic);
                });
            });
            this.loadListOfGangZ();
        });
    }
}
EngineService.ɵfac = function EngineService_Factory(t) { return new (t || EngineService)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_services_mock_data_service__WEBPACK_IMPORTED_MODULE_8__["MockDataService"])); };
EngineService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({ token: EngineService, factory: EngineService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "geSu":
/*!***********************************************!*\
  !*** ./src/app/data/AbstractPropertyModel.ts ***!
  \***********************************************/
/*! exports provided: AbstractPropertyModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractPropertyModel", function() { return AbstractPropertyModel; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");

class AbstractPropertyModel {
    constructor(listener) {
        this.IPropertyModel = 'AbstractPropertyModel';
        this.specializedListeners = [];
        this.globalListeners = [];
        if (listener) {
            this.globalListeners.push(listener);
        }
    }
    addPropertyChangeListener(listener, property) {
        if (!property) {
            if (this.globalListeners.indexOf(listener) < 0) {
                this.globalListeners.push(listener);
            }
        }
        else if (this.hasProperty(property)) {
            if (this.specializedListeners[property] === undefined) {
                this.specializedListeners[property] = [];
            }
            const propertyListeners = this.specializedListeners[property];
            if (propertyListeners.indexOf(listener) < 0) {
                propertyListeners.push(listener);
            }
        }
        else {
            throw new Error(`Object ${this} doesn't contain the property '${property}'`);
        }
    }
    removePropertyChangeListener(listener, property) {
        if (!property) {
            const id = this.globalListeners.indexOf(listener);
            if (id >= 0) {
                this.globalListeners.splice(id, 1);
            }
        }
        else if (this.hasProperty(property)) {
            const propertyListeners = this.specializedListeners[property];
            if (propertyListeners !== undefined) {
                const id = propertyListeners.indexOf(listener);
                if (id >= 0) {
                    propertyListeners.splice(id, 1);
                }
            }
        }
    }
    hasProperty(property) {
        const properties = this.getPropertyNames();
        return properties.indexOf(property) >= 0;
    }
    firePropertyChange(property, oldValue, newValue, object) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const responses = this.globalListeners.map((listener) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                yield listener.onPropertyChange(property, oldValue, newValue, object);
            }));
            const specListenersResponses = this.specializedListeners.map((specListener) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                const listenerResponses = specListener.map((listener) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                    yield listener.onPropertyChange(property, oldValue, newValue, object);
                }));
                yield Promise.all(listenerResponses);
            }));
            yield Promise.all(responses);
            yield Promise.all(specListenersResponses);
            return Promise.resolve();
        });
    }
}


/***/ }),

/***/ "h76x":
/*!********************************************************!*\
  !*** ./src/app/core/graphics/DirectionPlan.graphic.ts ***!
  \********************************************************/
/*! exports provided: DirectionPlanGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DirectionPlanGraphic", function() { return DirectionPlanGraphic; });
/* harmony import */ var _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Abstract.graphic */ "zo7q");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "Womt");


class DirectionPlanGraphic extends _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__["AbstractGraphic"] {
    constructor(dataAdapter) {
        super();
        this.build = (trajectory) => {
            const path = new three__WEBPACK_IMPORTED_MODULE_1__["CatmullRomCurve3"](trajectory);
            const tubularSegment = Math.round(path.getLength()) * 2;
            const geometry = new three__WEBPACK_IMPORTED_MODULE_1__["TubeGeometry"](path, tubularSegment, 0.01, 64, true);
            const material = new three__WEBPACK_IMPORTED_MODULE_1__["MeshStandardMaterial"]({
                color: new three__WEBPACK_IMPORTED_MODULE_1__["Color"](0x0000ff),
                side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"],
                opacity: 1
            });
            this.directionPlan = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
        };
        this.trajectory = dataAdapter.getTrajectory();
        this.build(this.trajectory);
        this.getNode().add(this.directionPlan);
        // const axesHelper = new THREE.AxesHelper( 10 );
        // this.getNode().add( axesHelper );
    }
}


/***/ }),

/***/ "haLD":
/*!**********************************************!*\
  !*** ./src/app/core/SelectiveBloomEngine.ts ***!
  \**********************************************/
/*! exports provided: SelectiveBloomEngine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectiveBloomEngine", function() { return SelectiveBloomEngine; });
/* harmony import */ var three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/postprocessing/EffectComposer.js */ "Mtn/");
/* harmony import */ var three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/postprocessing/RenderPass.js */ "k+my");
/* harmony import */ var three_examples_jsm_postprocessing_UnrealBloomPass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/postprocessing/UnrealBloomPass.js */ "mrLe");
/* harmony import */ var three_examples_jsm_postprocessing_ShaderPass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/postprocessing/ShaderPass */ "Ng1w");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three */ "Womt");





class SelectiveBloomEngine {
    constructor(view) {
        this.ENTIRE_SCENE = 0;
        this.BLOOM_SCENE = 1;
        this.bloomLayer = new three__WEBPACK_IMPORTED_MODULE_4__["Layers"]();
        this.darkMaterial = new three__WEBPACK_IMPORTED_MODULE_4__["MeshBasicMaterial"]({ color: 'black' });
        this.materials = {};
        this.setupEngine = (renderer, scene, camera) => {
            this.bloomLayer.set(this.BLOOM_SCENE);
            const renderScene = new three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_1__["RenderPass"](scene, camera);
            const bloomPass = this.buildBloomPass();
            this.bloomComposer = new three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_0__["EffectComposer"](renderer);
            // this.bloomComposer.setSize(window.innerWidth, window.innerHeight);
            this.bloomComposer.renderToScreen = false;
            this.bloomComposer.addPass(renderScene);
            this.bloomComposer.addPass(bloomPass);
            const finalPass = this.buildFinalPass(this.bloomComposer);
            this.finalComposer = new three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_0__["EffectComposer"](renderer);
            this.finalComposer.addPass(renderScene);
            this.finalComposer.addPass(finalPass);
        };
        this.render = (scene, camera, mask = true) => {
            if (mask === true) {
                scene.traverse(this.darkenNonBloomed);
                this.bloomComposer.render();
                scene.traverse(this.restoreMaterial);
            }
            else {
                camera.layers.set(this.BLOOM_SCENE);
                this.bloomComposer.render();
                camera.layers.set(this.ENTIRE_SCENE);
            }
            this.finalComposer.render();
        };
        this.setSize = (innerWidth, innerHeight) => {
            this.bloomComposer.setSize(innerWidth, innerHeight);
            this.finalComposer.setSize(innerWidth, innerHeight);
        };
        this.buildBloomPass = () => {
            const bloomPass = new three_examples_jsm_postprocessing_UnrealBloomPass_js__WEBPACK_IMPORTED_MODULE_2__["UnrealBloomPass"](new three__WEBPACK_IMPORTED_MODULE_4__["Vector2"](window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
            bloomPass.threshold = 0;
            bloomPass.strength = 2; //intensity of glow
            bloomPass.radius = 0;
            return bloomPass;
        };
        this.buildFinalPass = (bloomComposer) => {
            const finalPass = new three_examples_jsm_postprocessing_ShaderPass__WEBPACK_IMPORTED_MODULE_3__["ShaderPass"](new three__WEBPACK_IMPORTED_MODULE_4__["ShaderMaterial"]({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: this.getVertexShader(),
                fragmentShader: this.getFragmentShader(),
                defines: {}
            }), 'baseTexture');
            finalPass.needsSwap = true;
            return finalPass;
        };
        this.darkenNonBloomed = (obj) => {
            if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
                this.materials[obj.uuid] = obj.material;
                obj.material = this.darkMaterial;
            }
        };
        this.restoreMaterial = (obj) => {
            if (this.materials[obj.uuid]) {
                obj.material = this.materials[obj.uuid];
                delete this.materials[obj.uuid];
            }
        };
        this.getFragmentShader = () => {
            return `
            uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {
				gl_FragColor = (texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv));
			}
        `;
        };
        this.getVertexShader = () => {
            return `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        };
        this.view = view;
    }
}


/***/ }),

/***/ "hvU+":
/*!************************************************!*\
  !*** ./src/app/core/graphics/Track.graphic.ts ***!
  \************************************************/
/*! exports provided: TrackGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrackGraphic", function() { return TrackGraphic; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var _Abstract_graphic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Abstract.graphic */ "zo7q");



class TrackGraphic extends _Abstract_graphic__WEBPACK_IMPORTED_MODULE_1__["AbstractGraphic"] {
    constructor(trajectory) {
        super();
        this.leftRailTrack = [];
        this.rightRailTrack = [];
        this.build = (curve) => {
            const geometry = this.createGeometry(curve);
            const material = this.createMaterial(curve);
            this.mesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geometry, material);
            this.buildSideTracks();
        };
        this.buildSideTracks = () => {
            const width = 0.1;
            const height = 0.05;
            const material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshStandardMaterial"]({
                color: new three__WEBPACK_IMPORTED_MODULE_0__["Color"](0xd3d3d3),
                side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"]
            });
            const sideGeometry = this.createSideGeometry(height, width, this.leftRailTrack);
            const sideMesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](sideGeometry, material);
            this.getNode().add(sideMesh);
            const sideGeometry2 = this.createSideGeometry(height, width, this.rightRailTrack);
            const sideMesh2 = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](sideGeometry2, material);
            this.getNode().add(sideMesh2);
        };
        this.createSideGeometry = (length, width, points) => {
            const shape = new three__WEBPACK_IMPORTED_MODULE_0__["Shape"]();
            shape.moveTo(0, 0);
            shape.lineTo(0, width);
            shape.lineTo(length, width);
            shape.lineTo(length, 0);
            shape.lineTo(0, 0);
            const curve = new three__WEBPACK_IMPORTED_MODULE_0__["CatmullRomCurve3"](points);
            const flowSteps = Math.round(Math.round(curve.getLength()) * 2);
            return new three__WEBPACK_IMPORTED_MODULE_0__["ExtrudeGeometry"](shape, {
                steps: flowSteps,
                curveSegments: flowSteps,
                bevelEnabled: false,
                depth: length,
                extrudePath: curve
            });
        };
        this.createMaterial = (curve) => {
            const texture = this.textureLoad.load('assets/train_track.png');
            texture.wrapS = three__WEBPACK_IMPORTED_MODULE_0__["RepeatWrapping"];
            texture.wrapT = three__WEBPACK_IMPORTED_MODULE_0__["RepeatWrapping"];
            texture.repeat.set(curve.getLength() * 2, 2);
            const material = [
                new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ color: 0xd3d3d3, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] }),
                new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ map: texture, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] }),
                new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ map: texture, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] }),
                new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ map: texture, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] }),
                new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ map: texture, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] }),
                new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ map: texture, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] }),
                new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ color: 0xd3d3d3, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] }),
            ];
            return material;
        };
        this.foo = (curve, ls) => {
            const lss = ls + 1;
            let tangent;
            const normal = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
            const binormal = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 0, 1);
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
            return {
                tangents: t,
                normals: n,
                binormals: b
            };
        };
        this.calculateVertices = (vertices, trajectory) => {
            const { tangents, normals, binormals } = this.foo(trajectory.curve, trajectory.lengthSegment);
            let x, y, z;
            let posIdx = 0; // position index
            const points = trajectory.curve.getPoints(trajectory.lengthSegment);
            const lss = trajectory.lengthSegment + 1;
            const wss = trajectory.widthSegment + 1;
            const dw = [-1, -0.55, -0.45, -0.35, 0.35, 0.45, 0.55, 1]; // width from the center line
            for (let j = 0; j < lss; j++) { // length
                for (let i = 0; i < wss; i++) { // width
                    x = points[j].x + dw[i] * normals[j].x;
                    z = points[j].z;
                    y = points[j].y + dw[i] * normals[j].y;
                    vertices[posIdx] = x;
                    vertices[posIdx + 1] = y;
                    vertices[posIdx + 2] = z;
                    posIdx += 3;
                    if (i === 3) {
                        this.leftRailTrack.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](x, y, z));
                    }
                    if (i === 5) {
                        this.rightRailTrack.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](x, y, z));
                    }
                }
            }
        };
        this.calculateUVs = (uvs, trajectory) => {
            const lss = trajectory.lengthSegment + 1;
            const wss = trajectory.widthSegment + 1;
            const len = trajectory.curve.getLength();
            const lenList = trajectory.curve.getLengths(trajectory.lengthSegment);
            let uvIdxCount = 0;
            for (let j = 0; j < lss; j++) {
                for (let i = 0; i < wss; i++) {
                    uvs[uvIdxCount] = lenList[j] / len;
                    uvs[uvIdxCount + 1] = i / trajectory.widthSegment;
                    uvIdxCount += 2;
                }
            }
        };
        this.createGeometry = (curve) => {
            const flowSteps = Math.round(Math.round(curve.getLength()) * 2);
            const ls = flowSteps; // length segments
            const ws = 7; // width segments 
            const lss = ls + 1;
            const wss = ws + 1;
            const trajectory = { curve, lengthSegment: ls, widthSegment: ws };
            const faceCount = ls * ws * 2;
            const vertexCount = lss * wss;
            const indices = new Uint32Array(faceCount * 3);
            const vertices = new Float32Array(vertexCount * 3);
            const uvs = new Float32Array(vertexCount * 2);
            const geometry = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]();
            geometry.setIndex(new three__WEBPACK_IMPORTED_MODULE_0__["BufferAttribute"](indices, 1));
            let idxCount = 0;
            let a, b1, c1, c2;
            for (let j = 0; j < ls; j++) {
                for (let i = 0; i < ws; i++) {
                    // 2 faces / segment,  3 vertex indices
                    a = wss * j + i;
                    b1 = wss * (j + 1) + i; // right-bottom
                    c1 = wss * (j + 1) + 1 + i;
                    //  b2 = c1							// left-top
                    c2 = wss * j + 1 + i;
                    indices[idxCount] = a; // right-bottom
                    indices[idxCount + 1] = b1;
                    indices[idxCount + 2] = c1;
                    indices[idxCount + 3] = a; // left-top
                    indices[idxCount + 4] = c1; // = b2,
                    indices[idxCount + 5] = c2;
                    geometry.addGroup(idxCount, 6, i); // write group for multi material
                    idxCount += 6;
                }
            }
            this.calculateUVs(uvs, trajectory);
            this.calculateVertices(vertices, trajectory);
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_0__["BufferAttribute"](vertices, 3));
            geometry.setAttribute('uv', new three__WEBPACK_IMPORTED_MODULE_0__["BufferAttribute"](uvs, 2));
            return geometry;
        };
        console.log('trajectory', trajectory);
        this.textureLoad = new three__WEBPACK_IMPORTED_MODULE_0__["TextureLoader"]();
        this.trajectory = trajectory;
        const curve = new three__WEBPACK_IMPORTED_MODULE_0__["CatmullRomCurve3"](this.trajectory, true);
        this.build(curve);
        this.getNode().add(this.mesh);
    }
}


/***/ }),

/***/ "jj21":
/*!************************************************************!*\
  !*** ./src/app/core/graphics/interfaces/IFresnelShader.ts ***!
  \************************************************************/
/*! exports provided: FRESNELSHADER */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FRESNELSHADER", function() { return FRESNELSHADER; });
const FRESNELSHADER = {
    vertexShader: `
      varying vec3 vPositionW;
      varying vec3 vNormalW;
  
      void main() {

          vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);
          vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );

          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }

  `,
    fragmentShader: `
      varying vec3 vPositionW;
      varying vec3 vNormalW;
      uniform vec3 color;
      uniform float u_opacity;
  
      void main() {
      
          vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
          float fresnelTerm = dot(viewDirectionW, vNormalW);
          fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);

          gl_FragColor = vec4( color * fresnelTerm, u_opacity);
      }
  `
};


/***/ }),

/***/ "lFSJ":
/*!*****************************************!*\
  !*** ./src/app/engine/engine.common.ts ***!
  \*****************************************/
/*! exports provided: EngineCommon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineCommon", function() { return EngineCommon; });
/* harmony import */ var _core_graphics_GangZ_graphic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/graphics/GangZ.graphic */ "lv3Q");
/* harmony import */ var _core_graphics_Track_graphic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/graphics/Track.graphic */ "hvU+");
/* harmony import */ var _core_graphics_Tunnel_graphic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/graphics/Tunnel.graphic */ "lUpa");
/* harmony import */ var _core_ViewerFactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/ViewerFactory */ "pEVu");




class EngineCommon {
}
EngineCommon.factoryViewer = new _core_ViewerFactory__WEBPACK_IMPORTED_MODULE_3__["ViewerFactory"]();
EngineCommon.createViewer = (canvasElement) => {
    return EngineCommon.factoryViewer.createViewer(canvasElement.nativeElement.id);
};
EngineCommon.createTrack = (trajectory) => {
    return new _core_graphics_Track_graphic__WEBPACK_IMPORTED_MODULE_1__["TrackGraphic"](trajectory);
};
EngineCommon.createTunnel = (parameters, trajectory) => {
    return new _core_graphics_Tunnel_graphic__WEBPACK_IMPORTED_MODULE_2__["TunnelGraphic"](parameters, trajectory);
};
EngineCommon.createGangZ = (parameters) => {
    return new _core_graphics_GangZ_graphic__WEBPACK_IMPORTED_MODULE_0__["GangZGraphic"](parameters);
};


/***/ }),

/***/ "lUpa":
/*!*************************************************!*\
  !*** ./src/app/core/graphics/Tunnel.graphic.ts ***!
  \*************************************************/
/*! exports provided: TunnelGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TunnelGraphic", function() { return TunnelGraphic; });
/* harmony import */ var _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Abstract.graphic */ "zo7q");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var _interfaces_IFresnelShader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interfaces/IFresnelShader */ "jj21");
/* harmony import */ var src_app_data_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/data/Style */ "bQJV");




class TunnelGraphic extends _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__["AbstractGraphic"] {
    constructor(parameters, trajectory) {
        super();
        this.IPropertyChangeListener = 'TunnelGraphic';
        this.zFactor = 0.55;
        this.setStyle = () => {
            this.style = new src_app_data_Style__WEBPACK_IMPORTED_MODULE_3__["Style"]();
            this.style.addPropertyChangeListener(this);
        };
        this.build = (parameters, curve) => {
            const tunnelCurve = this.extractCurve(curve, parameters.startAt, parameters.length);
            const material = this.createMaterial(parameters.settings || {});
            const geometry = this.createGeometry(parameters.bodyOD, parameters.bodyID, parameters.length, tunnelCurve);
            const tunnel = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
            tunnel.translateZ(-this.zFactor);
            this.tunnel = tunnel;
            this.buildOuterBox(tunnelCurve, parameters.bodyOD, parameters.settings || {});
        };
        this.buildOuterBox = (tunnelCurve, outerRadius, settings) => {
            const material = new three__WEBPACK_IMPORTED_MODULE_1__["MeshStandardMaterial"]({
                color: Number(settings.color) || new three__WEBPACK_IMPORTED_MODULE_1__["Color"](0xd3d3d3),
                side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"],
                transparent: settings.opacity < 1,
                opacity: settings.opacity
            });
            const sideGeometry = this.createBoxGeometry(tunnelCurve, outerRadius, settings.isIsometricMode);
            const sideMesh = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](sideGeometry, material);
            this.getNode().add(sideMesh);
        };
        this.createBoxGeometry = (curve, outerRadius, isIsometricMode = false) => {
            const width = 6 * outerRadius;
            const length = outerRadius + 3;
            const buildShape = isIsometricMode ? this.buildIsometricShape : this.buildNormalShape;
            const shape = buildShape(length, width, outerRadius);
            const flowSteps = Math.round(Math.round(curve.getLength()) * 3);
            return new three__WEBPACK_IMPORTED_MODULE_1__["ExtrudeGeometry"](shape, {
                steps: flowSteps,
                curveSegments: flowSteps,
                bevelEnabled: false,
                extrudePath: curve
            });
        };
        this.buildNormalShape = (length, width, outerRadius) => {
            const start = length / 2;
            const end = width / 2;
            const sAngle = three__WEBPACK_IMPORTED_MODULE_1__["MathUtils"].degToRad(-120);
            const eAngle = three__WEBPACK_IMPORTED_MODULE_1__["MathUtils"].degToRad(120);
            const hole = new three__WEBPACK_IMPORTED_MODULE_1__["Path"]();
            hole.absarc(this.zFactor, 0, outerRadius, sAngle, eAngle, false);
            const shape = new three__WEBPACK_IMPORTED_MODULE_1__["Shape"]();
            shape.moveTo(-start + this.zFactor, -end);
            shape.lineTo(-start + this.zFactor, end);
            shape.lineTo(start + this.zFactor, end);
            shape.lineTo(start + this.zFactor, -end);
            shape.lineTo(-start + this.zFactor, -end);
            shape.holes.push(hole);
            return shape;
        };
        this.buildIsometricShape = (length, width, outerRadius) => {
            const start = length / 2;
            const end = width / 2;
            const sAngle = three__WEBPACK_IMPORTED_MODULE_1__["MathUtils"].degToRad(-120);
            const eAngle = three__WEBPACK_IMPORTED_MODULE_1__["MathUtils"].degToRad(120);
            const shape = new three__WEBPACK_IMPORTED_MODULE_1__["Shape"]();
            shape.moveTo(-start + this.zFactor, -end);
            shape.lineTo(-start + this.zFactor, end);
            shape.lineTo(this.zFactor, end);
            // Draw part of circle
            shape.lineTo(this.zFactor, 0 + outerRadius);
            shape.absarc(this.zFactor, 0, outerRadius, Math.PI / 2, eAngle, false);
            shape.absarc(this.zFactor, 0, outerRadius, sAngle, 0, false);
            shape.moveTo(this.zFactor + outerRadius, 0);
            shape.lineTo(start + this.zFactor, 0);
            shape.lineTo(start + this.zFactor, -end);
            shape.lineTo(-start + this.zFactor, -end);
            return shape;
        };
        this.extractCurve = (curve, start, length) => {
            const childCurve = [];
            const sumLength = curve.getLength();
            const end = start + length;
            let i = start;
            while (i < end) {
                const p = curve.getPointAt(i / sumLength);
                childCurve.push(p);
                i += 0.05;
            }
            return new three__WEBPACK_IMPORTED_MODULE_1__["CatmullRomCurve3"](childCurve);
        };
        this.createGeometry = (outerRadius, innerRadius, length, curve) => {
            const sAngle = three__WEBPACK_IMPORTED_MODULE_1__["MathUtils"].degToRad(-120);
            const eAngle = three__WEBPACK_IMPORTED_MODULE_1__["MathUtils"].degToRad(120);
            const shape = new three__WEBPACK_IMPORTED_MODULE_1__["Shape"]();
            shape.absarc(0, 0, outerRadius, sAngle, eAngle, false);
            shape.absarc(0, 0, innerRadius, eAngle, sAngle, true);
            const flowSteps = Math.round(Math.round(curve.getLength()) * 2);
            return new three__WEBPACK_IMPORTED_MODULE_1__["ExtrudeGeometry"](shape, {
                steps: flowSteps,
                curveSegments: flowSteps,
                bevelEnabled: false,
                extrudePath: curve
            });
        };
        this.createMaterial = (settings) => {
            const color = Number(settings.tunnelColor) || 0x8B4513;
            return new three__WEBPACK_IMPORTED_MODULE_1__["MeshStandardMaterial"]({
                color: new three__WEBPACK_IMPORTED_MODULE_1__["Color"](color),
                side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"]
            });
        };
        this.createFresnelMaterial = () => {
            const uniform = {
                color: {
                    type: "c",
                    value: this.style.getColor(),
                },
                u_opacity: { value: this.style.getOpacity() }
            };
            return new three__WEBPACK_IMPORTED_MODULE_1__["ShaderMaterial"]({
                uniforms: uniform,
                vertexShader: _interfaces_IFresnelShader__WEBPACK_IMPORTED_MODULE_2__["FRESNELSHADER"].vertexShader,
                fragmentShader: _interfaces_IFresnelShader__WEBPACK_IMPORTED_MODULE_2__["FRESNELSHADER"].fragmentShader,
                transparent: this.style.getOpacity() < 1
            });
        };
        this.setStyle();
        const curve3 = new three__WEBPACK_IMPORTED_MODULE_1__["CatmullRomCurve3"](trajectory);
        this.build(parameters, curve3);
        this.getNode().add(this.tunnel);
    }
    getStyle() {
        return this.style;
    }
    onPropertyChange(property, oldValue, newValue, object) {
    }
}


/***/ }),

/***/ "lv3Q":
/*!************************************************!*\
  !*** ./src/app/core/graphics/GangZ.graphic.ts ***!
  \************************************************/
/*! exports provided: GangZGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GangZGraphic", function() { return GangZGraphic; });
/* harmony import */ var _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Abstract.graphic */ "zo7q");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var three_examples_jsm_loaders_OBJLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/loaders/OBJLoader */ "5kJi");
/* harmony import */ var three_examples_jsm_loaders_MTLLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/loaders/MTLLoader */ "QIYC");




class GangZGraphic extends _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__["AbstractGraphic"] {
    constructor(params) {
        super();
        this.mttlloader = new three_examples_jsm_loaders_MTLLoader__WEBPACK_IMPORTED_MODULE_3__["MTLLoader"]();
        this.timer = 0;
        this.move = () => {
            for (let i = 0; i < this.dataAdapter.count; i++) {
                const dummy = this.gangs[i];
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
        };
        this.loadGangZ = (params) => {
            this.mttlloader.load(params.mtlPath || '', (materials) => {
                materials.preload();
                const objLoader = new three_examples_jsm_loaders_OBJLoader__WEBPACK_IMPORTED_MODULE_2__["OBJLoader"]();
                objLoader.setMaterials(materials);
                // objLoader.setPath('obj/male02/');
                objLoader.load(params.objPath, (model) => {
                    const loadedMesh = model.children[0];
                    const mesh = new three__WEBPACK_IMPORTED_MODULE_1__["InstancedMesh"](loadedMesh.geometry, loadedMesh.material, params.count || 10);
                    mesh.instanceMatrix.setUsage(three__WEBPACK_IMPORTED_MODULE_1__["DynamicDrawUsage"]);
                    this.getNode().add(mesh);
                    this.gangs = [];
                    for (let i = 0; i < params.count; i++) {
                        const dummy = new three__WEBPACK_IMPORTED_MODULE_1__["Object3D"]();
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
        };
        this.dataAdapter = params;
        this.loadGangZ(params);
    }
    drawBegin(view) {
        this.timer += Math.PI / 150;
        if (this.gangzMesh) {
            this.move();
        }
    }
}


/***/ }),

/***/ "pEVu":
/*!***************************************!*\
  !*** ./src/app/core/ViewerFactory.ts ***!
  \***************************************/
/*! exports provided: ViewerFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewerFactory", function() { return ViewerFactory; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _Viewer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Viewer */ "rW1V");


class ViewerFactory {
    constructor() { }
    createViewer(htmlElemId) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.viewer = new _Viewer__WEBPACK_IMPORTED_MODULE_1__["Viewer"](htmlElemId);
            return this.viewer;
        });
    }
}


/***/ }),

/***/ "rW1V":
/*!********************************!*\
  !*** ./src/app/core/Viewer.ts ***!
  \********************************/
/*! exports provided: Viewer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Viewer", function() { return Viewer; });
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ "HWwP");
/* harmony import */ var _World__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./World */ "ISdO");


class Viewer {
    constructor(canvas) {
        this.IViewer = 'IView';
        this.animationRequestID = -1;
        this.mainLoop = () => {
            // repaint the ViewCanvas when it's View is dirty
            if (this.view.isDirty()) {
            }
            this.view.render();
            // tells the browser to schedule a next iteration
            this.animationRequestID = requestAnimationFrame(this.mainLoop);
        };
        this.view = new _View__WEBPACK_IMPORTED_MODULE_0__["View"](canvas);
        this.world = new _World__WEBPACK_IMPORTED_MODULE_1__["World"](this);
        this.view.setWorld(this.world);
        this.view.reset();
        this.mainLoop();
    }
    getView() {
        return this.view;
    }
    getWorld() {
        return this.world;
    }
}


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");



const routes = [];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "wR3q":
/*!*************************************************!*\
  !*** ./src/app/core/graphics/SkyBox.graphic.ts ***!
  \*************************************************/
/*! exports provided: SkyBoxGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkyBoxGraphic", function() { return SkyBoxGraphic; });
/* harmony import */ var _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Abstract.graphic */ "zo7q");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "Womt");


class SkyBoxGraphic extends _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__["AbstractGraphic"] {
    constructor(skyboxImage, size = 500) {
        super();
        this.timer = 0;
        this.buildCube = (skyboxImage, size = 1000) => {
            const materialArray = this.createMaterialArray(skyboxImage);
            const skyboxGeo = new three__WEBPACK_IMPORTED_MODULE_1__["BoxGeometry"](size, size, size);
            this.mesh = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](skyboxGeo, materialArray);
            this.turnOnGlowing(this.mesh);
            this.getNode().add(this.mesh);
        };
        this.buildSun = () => {
            const color = new three__WEBPACK_IMPORTED_MODULE_1__["Color"]("#FDB813");
            const geometry = new three__WEBPACK_IMPORTED_MODULE_1__["IcosahedronGeometry"](5, 15);
            const material = new three__WEBPACK_IMPORTED_MODULE_1__["MeshBasicMaterial"]({ color: color });
            this.sun = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
            this.sun.position.set(10, -5, -10);
            this.turnOnGlowing(this.sun);
            this.getNode().add(this.sun);
        };
        this.createMaterialArray = (filename) => {
            const skyboxImagepaths = this.createPathStrings(filename);
            const materialArray = skyboxImagepaths.map((image) => {
                let texture = new three__WEBPACK_IMPORTED_MODULE_1__["TextureLoader"]().load(image);
                return new three__WEBPACK_IMPORTED_MODULE_1__["MeshBasicMaterial"]({ map: texture, side: three__WEBPACK_IMPORTED_MODULE_1__["BackSide"] });
            });
            return materialArray;
        };
        this.createPathStrings = (filename) => {
            const baseFilename = "assets/skybox/" + filename + '/' + filename;
            const fileType = ".png";
            const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
            return sides.map(side => {
                return baseFilename + "_" + side + fileType;
            });
        };
        this.buildCube(skyboxImage, size);
        this.buildSun();
    }
    drawBegin(view) {
        this.timer += Math.PI / 20;
        this.mesh.rotation.x += 0.001;
        this.mesh.rotation.y += 0.001;
    }
}


/***/ }),

/***/ "xuDr":
/*!***********************************!*\
  !*** ./src/app/core/MainGroup.ts ***!
  \***********************************/
/*! exports provided: MainGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainGroup", function() { return MainGroup; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");

class MainGroup {
    constructor() {
        this.IGroup = 'MainGroup';
        this.children = [];
        this.pickableList = [];
        this.group = new three__WEBPACK_IMPORTED_MODULE_0__["Object3D"]();
        this.group.rotateX(Math.PI / 2);
    }
    getPickableNodes() {
        return this.pickableList;
    }
    getChildNodes() {
        return this.children;
    }
    addNode(node) {
        this.group.add(node.getNode());
        this.children.push(node);
        if (node.isPickable()) {
            this.pickableList.push(node);
        }
    }
    setScene(scene) {
        scene.add(this.group);
    }
}


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zbWN":
/*!*************************************************!*\
  !*** ./src/app/core/graphics/Galaxy.graphic.ts ***!
  \*************************************************/
/*! exports provided: GalaxyGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GalaxyGraphic", function() { return GalaxyGraphic; });
/* harmony import */ var _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Abstract.graphic */ "zo7q");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "Womt");


class GalaxyGraphic extends _Abstract_graphic__WEBPACK_IMPORTED_MODULE_0__["AbstractGraphic"] {
    constructor(size = 500) {
        super();
        this.timer = 0;
        this.galaxy = new three__WEBPACK_IMPORTED_MODULE_1__["Object3D"]();
        this.stars = [];
        this.starVelocities = [];
        this.animateGalaxy = () => {
            if (this.galaxy) {
                this.galaxy.rotateOnAxis(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](0, 0, 1), -0.005);
            }
        };
        this.animateShootStars = () => {
            if (this.stars) {
                this.stars.forEach((star, i) => {
                    star.position.y += this.starVelocities[i];
                    if (star.position.y > 50) {
                        star.position.y = -70 + (Math.random() - 0.5) * 50;
                    }
                    star.updateMatrix();
                    this.starMesh.setMatrixAt(i, star.matrix);
                });
                this.starMesh.instanceMatrix.needsUpdate = true;
            }
        };
        this.buildGradientMaterial = (startcolor = 'white', endColor = 'black') => {
            return new three__WEBPACK_IMPORTED_MODULE_1__["ShaderMaterial"]({
                uniforms: {
                    color1: {
                        value: new three__WEBPACK_IMPORTED_MODULE_1__["Color"](endColor)
                    },
                    color2: {
                        value: new three__WEBPACK_IMPORTED_MODULE_1__["Color"](startcolor)
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
        };
        this.buildShootStars = (count = 30) => {
            const geometry = new three__WEBPACK_IMPORTED_MODULE_1__["CylinderGeometry"](0.1, 0.01, 10);
            const material = this.buildGradientMaterial();
            this.starMesh = new three__WEBPACK_IMPORTED_MODULE_1__["InstancedMesh"](geometry, material, count);
            this.starMesh.instanceMatrix.setUsage(three__WEBPACK_IMPORTED_MODULE_1__["DynamicDrawUsage"]);
            this.getNode().add(this.starMesh);
            this.stars = [];
            this.starVelocities = [];
            for (let i = 0; i < count; i++) {
                const dummy = new three__WEBPACK_IMPORTED_MODULE_1__["Object3D"]();
                this.starVelocities.push(Math.random() * 1.5 + 1);
                dummy.position.set(50 + Math.random() * 20, -70 + (Math.random() - 0.5) * 50, -1 + Math.random() * 10);
                dummy.scale.y = Math.random() + 1;
                dummy.scale.x = Math.random() * 2 + 1;
                dummy.scale.z = dummy.scale.x;
                dummy.updateMatrix();
                this.starMesh.setMatrixAt(i, dummy.matrix);
                this.stars.push(dummy);
            }
        };
        this.buildParticles = () => {
            const { posArray, colorArray } = this.buildGalaxyGeometry();
            const particlesGeometry = new three__WEBPACK_IMPORTED_MODULE_1__["BufferGeometry"]();
            particlesGeometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__["BufferAttribute"](posArray, 3));
            particlesGeometry.setAttribute('color', new three__WEBPACK_IMPORTED_MODULE_1__["BufferAttribute"](colorArray, 3));
            const particlesMaterial = new three__WEBPACK_IMPORTED_MODULE_1__["PointsMaterial"]({
                size: 0.05,
                // color: '#6cf6fe' //#2aa7d8
                vertexColors: true
            });
            this.particlesMesh = new three__WEBPACK_IMPORTED_MODULE_1__["Points"](particlesGeometry, particlesMaterial);
            this.galaxy.position.set(-5, -10, -5);
            this.galaxy.add(this.particlesMesh);
            this.getNode().add(this.galaxy);
        };
        this.buildGalaxyGeometry = () => {
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
            }
            ;
            return {
                posArray,
                colorArray
            };
        };
        this.evenlySpiral1 = () => {
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
        };
        this.buildParticles();
        this.buildShootStars();
    }
    drawBegin(view) {
        this.timer += Math.PI / 20000;
        this.animateGalaxy();
        this.animateShootStars();
    }
}


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ }),

/***/ "zo7q":
/*!***************************************************!*\
  !*** ./src/app/core/graphics/Abstract.graphic.ts ***!
  \***************************************************/
/*! exports provided: AbstractGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractGraphic", function() { return AbstractGraphic; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");

class AbstractGraphic {
    constructor() {
        this.IGraphic = 'AbstractGraphic';
        this.dirty = false;
        this.pickable = false;
        this.root = new three__WEBPACK_IMPORTED_MODULE_0__["Object3D"]();
    }
    drawBegin(view) {
    }
    drawEnd(view) {
    }
    isDirty() {
        return this.dirty;
    }
    isPickable() {
        return this.pickable;
    }
    setDirty(value) {
        this.dirty = value;
    }
    setPickable(value) {
        this.pickable = value;
    }
    getNode() {
        return this.root;
    }
    setVisible(visible) {
        this.root.visible = visible;
    }
    getVisible() {
        return this.root.visible;
    }
    turnOnGlowing(child, level = 1) {
        child.layers.enable(level);
    }
}


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map