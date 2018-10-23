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
        scrollable?: boolean;
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
}declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
    /**
     *
     */
    class GUIComponent extends SingletonComponent {
        readonly hierarchy: dat.GUI;
        readonly inspector: dat.GUI;
    }
}
declare namespace paper.editor {
    /**
     *
     */
    class ModelComponent extends SingletonComponent {
        static readonly onSceneSelected: signals.Signal;
        static readonly onSceneUnselected: signals.Signal;
        static readonly onGameObjectHovered: signals.Signal;
        static readonly onGameObjectSelectChanged: signals.Signal;
        static readonly onGameObjectSelected: signals.Signal;
        static readonly onGameObjectUnselected: signals.Signal;
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
        hoveredGameObject: GameObject | null;
        /**
         * 最后一个选中的实体。
         */
        selectedGameObject: GameObject | null;
        private _editorModel;
        private _onEditorSelectGameObjects(event);
        private _onChangeProperty(data);
        private _onChangeEditMode(mode);
        private _onChangeEditType(type);
        initialize(): void;
        private _select(value, isReplace?);
        private _unselect(value);
        hover(value: GameObject | null): void;
        select(value: Scene | GameObject | null, isReplace?: boolean): void;
        remove(value: GameObject): void;
        unselect(value: GameObject): void;
        changeProperty(propName: string, propOldValue: any, propNewValue: any, target: BaseComponent): void;
    }
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
    /**
     *
     */
    class WorldAxisesDrawer extends BaseComponent {
        readonly cube: paper.GameObject;
        readonly left: paper.GameObject;
        readonly right: paper.GameObject;
        readonly bottom: paper.GameObject;
        readonly top: paper.GameObject;
        readonly back: paper.GameObject;
        readonly forward: paper.GameObject;
        initialize(): void;
        update(): void;
    }
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
    /**
     *
     */
    class SceneSystem extends BaseSystem {
        protected readonly _interests: {
            componentClass: typeof egret3d.Transform;
        }[][];
        private readonly _cameraAndLightCollecter;
        private readonly _modelComponent;
        private readonly _keyEscape;
        private readonly _keyDelete;
        private readonly _keyE;
        private readonly _keyW;
        private readonly _keyR;
        private readonly _keyX;
        private readonly _keyF;
        private _orbitControls;
        private _transformController;
        private _boxesDrawer;
        private _boxColliderDrawer;
        private _sphereColliderDrawer;
        private _skeletonDrawer;
        private _cameraViewFrustum;
        private _worldAxisesDrawer;
        private _gridDrawer;
        private _onGameObjectHovered;
        private _onGameObjectSelectChanged;
        private _onGameObjectSelected;
        private _onGameObjectUnselected;
        private _updateCameras();
        private _updateLights();
        lookAtSelected(): void;
        onEnable(): void;
        onDisable(): void;
        onUpdate(): void;
    }
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
