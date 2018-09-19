declare namespace paper.debug {
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
        private _selectedWorldQuaternion;
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
