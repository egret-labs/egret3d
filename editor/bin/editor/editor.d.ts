declare namespace paper.debug {
    /**
     * TODO 临时的
     */
    class Bootstrap extends paper.Behaviour {
        initialize(): void;
    }
}
declare namespace paper.debug {
    class GizmoPickComponent extends Behaviour {
        pickTarget: GameObject | null;
        onDestroy(): void;
    }
}
declare namespace paper.debug {
    /**
     *
     */
    const enum GUIComponentEvent {
        SceneSelected = "SceneSelected",
        SceneUnselected = "SceneUnselected",
        GameObjectHovered = "GameObjectHovered",
        GameObjectSelected = "GameObjectSelected",
        GameObjectUnselected = "GameObjectUnselected",
    }
    /**
     *
     */
    class GUIComponent extends SingletonComponent {
        /**
         * 所有选中的实体。
         */
        readonly selectedGameObjects: GameObject[];
        /**
         * 选中的场景。
         */
        selectedScene: Scene | null;
        /**
         *
         */
        hoverGameObject: GameObject | null;
        /**
         * 最后一个选中的实体。
         */
        selectedGameObject: GameObject | null;
        initialize(): void;
        select(value: Scene | GameObject | null, isReplace?: boolean): void;
        unselect(value: Scene | GameObject): void;
        hover(value: GameObject | null): void;
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
        private readonly _mouseStart;
        private readonly _startPoint;
        private readonly _endPoint;
        private _axises;
        private _hoverBox;
        private _grids;
        private _touchPlane;
        private _cameraViewFrustum;
        private _transformMode;
        private _transformAxis;
        private readonly _pickableSelected;
        private readonly _boxes;
        private readonly _pickableTool;
        private readonly _gizomsMap;
        private _positionStart;
        private _startWorldPosition;
        private _startWorldQuaternion;
        private _startWorldScale;
        private _selectedWorldPostion;
        private _selectedWorldQuaternion;
        private _cameraPosition;
        private _eye;
        private _selectGameObject(value, selected);
        private _onMouseDown;
        private _onMouseMove;
        private _onMouseUp;
        private _onKeyUp;
        private _onKeyDown;
        private _onGameObjectSelected;
        private _onGameObjectHovered;
        private _onGameObjectUnselected;
        private _transformModeHandler(value);
        private _setPoint(cameraProject, positions, x, y, z, points);
        private _updateAxises();
        private _updateBoxes();
        private _updateCameras();
        private _updateLights();
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
        private readonly _bufferedGameObjects;
        private readonly _hierarchyFolders;
        private readonly _inspectorFolders;
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
        onRemoveGameObject(gameObject: GameObject, _group: GameObjectGroup): void;
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
        static createGameObject(name: string, mesh?: egret3d.Mesh, material?: egret3d.Material, tag?: string, scene?: paper.Scene): GameObject;
        static createGrid(name: string, size?: number, divisions?: number, color1?: egret3d.Color, color2?: egret3d.Color): GameObject;
        static createTouchPlane(name: string, width?: number, height?: number): GameObject;
        static createAxises(name: string): GameObject;
        static createBox(name: string, color: egret3d.Color, scene: Scene): GameObject;
        static createCameraIcon(name: string, parent: paper.GameObject): GameObject;
        static createLightIcon(name: string, parent: paper.GameObject): GameObject;
        static createCameraWireframed(name: string, colorFrustum?: egret3d.Color, colorCone?: egret3d.Color, colorUp?: egret3d.Color, colorTarget?: egret3d.Color, colorCross?: egret3d.Color): GameObject;
    }
}
declare namespace paper.debug {
    class Helper {
        private static _raycast(ray, gameObject, raycastInfos);
        static raycast(gameObjects: paper.GameObject[], mousePositionX: number, mousePositionY: number): egret3d.RaycastInfo[];
    }
}
declare namespace helper {
    function getResAsync(uri: string, root?: string): Promise<{}>;
}
