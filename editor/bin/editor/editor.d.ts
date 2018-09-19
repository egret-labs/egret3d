// Type definitions for dat.GUI 0.6
// Project: https://github.com/dataarts/dat.gui
// Definitions by: Satoru Kimura <https://github.com/gyohk>, ZongJing Lu <https://github.com/sonic3d>, Richard Roylance <https://github.com/rroylance>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace dat {
    class GUI {
        instance?: any; // Modify add instance.
        onClick?: (gui: GUI) => void; // Modify add onClick.

        constructor(option?: GUIParams);

        __controllers: GUIController[];
        __folders: GUI[];
        domElement: HTMLElement;

        add(target: Object, propName: string): GUIController;
        add(target: Object, propName: string, min: number, max: number): GUIController;
        add(target: Object, propName: string, status: boolean): GUIController;
        add(target: Object, propName: string, items: string[]): GUIController;
        add(target: Object, propName: string, items: number[]): GUIController;
        add(target: Object, propName: string, items: Object): GUIController;

        addColor(target: Object, propName: string): GUIController;
        addColor(target: Object, propName: string, color: string): GUIController;
        addColor(target: Object, propName: string, rgba: number[]): GUIController; // rgb or rgba
        addColor(target: Object, propName: string, hsv: { h: number; s: number; v: number }): GUIController;

        remove(controller: GUIController): void;
        destroy(): void;

        addFolder(propName: string, label?: string): GUI; // Modify add label.
        removeFolder(value: GUI): void;

        open(): void;
        close(): void;

        remember(target: Object, ...additionalTargets: Object[]): void;
        getRoot(): GUI;

        getSaveObject(): Object;
        save(): void;
        saveAs(presetName: string): void;
        revert(gui: GUI): void;

        listen(controller: GUIController): void;
        updateDisplay(): void;

        // gui properties in dat/gui/GUI.js
        readonly parent: GUI;
        readonly scrollable: boolean;
        readonly autoPlace: boolean;
        preset: string;
        width: number;
        name: string;
        closed: boolean;
        selected: boolean;
        readonly load: Object;
        useLocalStorage: boolean;
    }

    interface GUIParams {
        autoPlace?: boolean;
        closed?: boolean;
        closeOnTop?: boolean;
        load?: any;
        name?: string;
        preset?: string;
        width?: number;
    }

    class GUIController {
        destroy(): void;

        // Controller
        onChange: (value?: any) => void;
        onFinishChange: (value?: any) => void;

        setValue(value: any): GUIController;
        getValue(): any;
        updateDisplay(): void;
        isModified(): boolean;

        // NumberController
        min(n: number): GUIController;
        max(n: number): GUIController;
        step(n: number): GUIController;

        // FunctionController
        fire(): GUIController;

        // augmentController in dat/gui/GUI.js
        options(option: any): GUIController;
        name(s: string): GUIController;
        listen(): GUIController;
        remove(): GUIController;
    }
}declare namespace paper.debug {
    /**
     *
     */
    const enum GUIComponentEvent {
        SceneSelected = "SceneSelected",
        SceneUnselected = "SceneUnselected",
        GameObjectSelected = "GameObjectSelected",
        GameObjectUnselected = "GameObjectUnselected",
    }
    /**
     *
     */
    class GUIComponent extends SingletonComponent {
        readonly inspector: dat.GUI;
        readonly hierarchy: dat.GUI;
        /**
         * 所有选中的实体。
         */
        readonly selectedGameObjects: GameObject[];
        /**
         * 选中的场景。
         */
        selectedScene: Scene | null;
        /**
         * 最后一个选中的实体。
         */
        selectedGameObject: GameObject | null;
        initialize(): void;
        select(value: Scene | GameObject | null, isReplace?: boolean): void;
    }
}
declare namespace paper.debug {
    class GUISceneSystem extends paper.BaseSystem {
        protected readonly _interests: {
            componentClass: typeof egret3d.Transform;
        }[][];
        private readonly _camerasAndLights;
        private readonly _guiComponent;
        private _orbitControls;
        private _touchPlane;
        private _grids;
        private _axises;
        private _box;
        private _skeletonDrawer;
        private _transformMode;
        private _transformAxis;
        private _pickableTool;
        private _pickableSelected;
        private _isDragging;
        private _startPoint;
        private _endPoint;
        private _positionStart;
        private _startWorldPosition;
        private _startWorldQuaternion;
        private _startWorldScale;
        private _selectedWorldPostion;
        private _cameraPosition;
        private _eye;
        private _selectGameObject(select);
        private _onMouseDown;
        private _onMouseUp;
        private _onMouseHover;
        private _onMouseMove;
        private _onKeyUp;
        private _onKeyDown;
        private _gameObjectSelectedHandler;
        private _gameObjectUnselectedHandler;
        private _transformModeHandler(value);
        private _setPoint(cameraProject, positions, x, y, z, points);
        private _updateAxises();
        private _updateBox();
        private _updateCamera();
        private _updateTouchPlane();
        onAwake(): void;
        onEnable(): void;
        onDisable(): void;
        onUpdate(dt: number): void;
    }
}
declare namespace paper.debug {
    class GUISystem extends BaseSystem {
        protected readonly _interests: {
            componentClass: typeof egret3d.Transform;
        }[][];
        private readonly _disposeCollecter;
        private readonly _guiComponent;
        private readonly _hierarchyFolders;
        private readonly _inspectorFolders;
        private _selectGameObject;
        private _selectFolder;
        private _sceneSelectedHandler;
        private _sceneUnselectedHandler;
        private _gameObjectSelectedHandler;
        private _gameObjectUnselectedHandler;
        private _createGameObject;
        private _destroySceneOrGameObject;
        private _nodeClickHandler;
        private _openFolder(folder);
        private _selectSceneOrGameObject(sceneOrGameObject);
        private _addToHierarchy(gameObject);
        private _addToInspector(gui);
        onAwake(): void;
        onEnable(): void;
        onAddGameObject(gameObject: GameObject, _group: GameObjectGroup): void;
        onUpdate(dt: number): void;
        onDisable(): void;
    }
}
declare namespace paper.debug {
    /**
     *
     */
    class OrbitControls extends paper.Behaviour {
        lookAtPoint: egret3d.Vector3;
        lookAtTarget: egret3d.Transform;
        lookAtOffset: egret3d.Vector3;
        distance: number;
        minPanAngle: number;
        maxPanAngle: number;
        minTileAngle: number;
        maxTileAngle: number;
        moveSpped: number;
        scaleSpeed: number;
        private _enableMove;
        private bindTouch;
        private bindMouse;
        private _lastMouseX;
        private _lastMouseY;
        private _mouseDown;
        private _lastTouchX;
        private _lastTouchY;
        private _fingerTwo;
        private _lastDistance;
        private _panAngle;
        private _panRad;
        private _tiltAngle;
        private _tiltRad;
        panAngle: number;
        tiltAngle: number;
        enableMove: boolean;
        onStart(): any;
        onEnable(): void;
        onDisable(): void;
        onUpdate(delta: number): any;
        private _mouseDownHandler;
        private _mouseUpHandler;
        private _mouseMoveHandler;
        private _mouseWheelHandler;
        private move();
    }
}
declare namespace paper.debug {
    class EditorMeshHelper {
        static _createGameObject(name: string, mesh?: egret3d.Mesh, material?: egret3d.Material, tag?: string, scene?: paper.Scene): GameObject;
        static createGrid(name: string, size?: number, divisions?: number, color1?: egret3d.Color, color2?: egret3d.Color): GameObject;
        static createTouchPlane(name: string, width?: number, height?: number): GameObject;
        static createAxises(name: string): GameObject;
        static createBox(name: string, color: egret3d.Color): GameObject;
        static createCameraWireframed(name: string, tag: string, scene: paper.Scene, colorFrustum?: egret3d.Color, colorCone?: egret3d.Color, colorUp?: egret3d.Color, colorTarget?: egret3d.Color, colorCross?: egret3d.Color): GameObject;
    }
}
declare namespace paper.debug {
    class Helper {
        private static _rayCastGameObject(ray, gameObject, raycastInfos);
        static getPickObjects(pickables: paper.GameObject[], mousePositionX: number, mousePositionY: number): egret3d.RaycastInfo[];
    }
}
declare namespace helper {
    function getResAsync(uri: string, root?: string): Promise<{}>;
}
