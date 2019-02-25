namespace paper.editor {
    /**
     * TODO
     */
    export class SceneSystem extends BaseSystem<GameObject> {
        private readonly _modelComponent: ModelComponent = GameObject.globalGameObject.getOrAddComponent(ModelComponent);

        private readonly _keyEscape: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.Escape);
        private readonly _keyDelete: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.Delete);
        private readonly _keyE: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyE);
        private readonly _keyW: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyW);
        private readonly _keyR: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyR);
        private readonly _keyX: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyX);
        private readonly _keyF: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyF);

        private _gizmosContainerEntity: GameObject | null = null;
        private _touchContainerEntity: GameObject | null = null;
        private _transformController: TransformController | null = null;

        public lookAtSelected() {
            const orbitControls = egret3d.Camera.editor.gameObject.getComponent(OrbitControls)!;
            orbitControls!.distance = 10.0;
            orbitControls!.lookAtOffset.set(0.0, 0.0, 0.0);

            const lastSelectedEntity = this.groups[2].singleEntity;

            if (lastSelectedEntity) {
                orbitControls!.lookAtPoint.copy(lastSelectedEntity.transform.position);
            }
            else {
                orbitControls!.lookAtPoint.copy(egret3d.Vector3.ZERO);
            }
        }

        protected getMatchers() {
            return [
                Matcher.create<GameObject>(egret3d.Transform, HoveredFlag)
                    .anyOf(egret3d.MeshRenderer, egret3d.SkinnedMeshRenderer, egret3d.particle.ParticleRenderer),
                Matcher.create<GameObject>(egret3d.Transform, SelectedFlag),
                Matcher.create<GameObject>(egret3d.Transform, LastSelectedFlag),
            ];
        }

        public onAwake() {
            // GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture);
            Application.systemManager.register(GizmosSystem, Application.gameObjectContext, SystemOrder.LateUpdate + 1);
        }

        public onEnable() {
            Application.systemManager.getSystem(GizmosSystem)!.enabled = true;

            const editorCamera = egret3d.Camera.editor;
            editorCamera.gameObject.addComponent(OrbitControls);
            editorCamera.enabled = true;

            this._transformController = EditorMeshHelper.createGameObject("Transform Controller").addComponent(TransformController);
            this._transformController.gameObject.activeSelf = false;

            this._gizmosContainerEntity = EditorMeshHelper.createGameObject("Drawer");
            this._touchContainerEntity = EditorMeshHelper.createGameObject("Touch Drawer");
            this._gizmosContainerEntity.addComponent(GizmosContainerEntityFlag);
            this._gizmosContainerEntity.addComponent(GridFlag);
            this._touchContainerEntity.addComponent(TouchContainerEntityFlag);
        }

        public onDisable() {
            Application.systemManager.getSystem(GizmosSystem)!.enabled = false;

            const editorCamera = egret3d.Camera.editor;
            editorCamera.gameObject.removeComponent(OrbitControls);
            editorCamera.enabled = false;

            this._gizmosContainerEntity!.destroy();
            this._touchContainerEntity!.destroy();
            this._transformController!.gameObject.destroy();

            this._gizmosContainerEntity = null;
            this._touchContainerEntity = null;
            this._transformController = null;
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;

            if (group === groups[2]) {
                this._transformController!.gameObject.enabled = true;
                // this._cameraViewFrustum!.activeSelf =
                //     selectedGameObject && selectedGameObject.getComponent(egret3d.Camera) ? true : false;
            }
        }

        public onEntityRemoved(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;

            if (group === groups[2]) {
                this._transformController!.gameObject.enabled = false;
                // this._cameraViewFrustum!.activeSelf =
                //     selectedGameObject && selectedGameObject.getComponent(egret3d.Camera) ? true : false;
            }
        }

        public onTick() {
            const groups = this.groups;
            const transformController = this._transformController!;
            let hoveredEntity = groups[0].singleEntity;

            const defaultPointer = egret3d.inputCollecter.defaultPointer;

            if (transformController.isActiveAndEnabled) {
                transformController.update(defaultPointer.position);
            }

            if (defaultPointer.isDown(egret3d.PointerButtonsType.LeftMouse, false)) {
                if (defaultPointer.event!.buttons & egret3d.PointerButtonsType.RightMouse) { // 正在控制摄像机。
                }
                else {
                    if (transformController.isActiveAndEnabled && transformController.hovered) {
                        transformController.start(defaultPointer.downPosition);
                    }
                }
            }

            if (defaultPointer.isUp(egret3d.PointerButtonsType.LeftMouse, false)) {
                if (transformController.isActiveAndEnabled && transformController.hovered) {
                    transformController.end();
                }
                else { // Update selected.
                    const event = defaultPointer.event!;

                    if (hoveredEntity) {
                        if (hoveredEntity.getComponent(SelectedFlag)) {
                            if (event.ctrlKey) {
                                this._modelComponent.unselect(hoveredEntity);
                            }
                        }
                        else {
                            if (defaultPointer.position.getDistance(defaultPointer.downPosition) < 5.0) {
                                if (hoveredEntity.renderer instanceof egret3d.SkinnedMeshRenderer) { //
                                    const animation = hoveredEntity.getComponentInParent(egret3d.Animation);
                                    if (animation) {
                                        hoveredEntity = animation.gameObject;
                                    }
                                }
                                else {
                                    const gizmoPickComponent = hoveredEntity.getComponent(GizmoPickComponent);
                                    if (gizmoPickComponent) {
                                        hoveredEntity = gizmoPickComponent.pickTarget;
                                    }
                                }

                                this._modelComponent.select(hoveredEntity, !event.ctrlKey);
                            }
                            else if (defaultPointer.event!.ctrlKey) {
                                // TODO
                            }
                            else {
                                // TODO
                            }
                        }
                    }
                    else if (!event.ctrlKey && !event.shiftKey) {
                        if (!this._modelComponent.selectedScene && !defaultPointer.downPosition.equal(SceneSystem._defalutPosition)) {
                            this._modelComponent.select(Scene.activeScene);
                        }
                    }
                }
            }

            if (defaultPointer.isUp(egret3d.PointerButtonsType.LeftMouse, false) || defaultPointer.isUp(egret3d.PointerButtonsType.RightMouse, false)) {
                this._clearDefaultPointerDownPosition();
            }

            {
                const event = defaultPointer.event;

                if (event) {
                    if (event.buttons & 0b10) { // 正在控制摄像机。

                    }
                    else if (event.buttons & 0b01) {

                    }
                    else { // Update hovered.
                        const transformController = this._transformController!;
                        if (transformController.isActiveAndEnabled) {
                            if (event.shiftKey || event.ctrlKey) {
                                transformController.hovered = null;
                            }
                            else {
                                const raycastInfos = Helper.raycastAll(transformController.mode.transform.children, defaultPointer.position.x, defaultPointer.position.y, false);
                                if (raycastInfos.length > 0) {
                                    transformController.hovered = raycastInfos[0].transform!.gameObject;
                                }
                                else {
                                    transformController.hovered = null;
                                }
                            }
                        }
                        else {
                            transformController.hovered = null;
                        }

                        if (hoveredEntity) {
                            hoveredEntity.removeComponent(HoveredFlag);
                        }

                        if (!transformController || !transformController.isActiveAndEnabled || !transformController.hovered) {
                            const gameObjects = Scene.activeScene.getRootGameObjects().concat(); // TODO
                            gameObjects.unshift(this._touchContainerEntity!);

                            const raycastInfos = Helper.raycastAll(gameObjects, defaultPointer.position.x, defaultPointer.position.y, true);
                            if (raycastInfos.length > 0) {
                                raycastInfos[0].transform!.gameObject.addComponent(HoveredFlag);
                            }
                        }
                    }
                }
            }

            if (this._keyEscape.isUp(false) && !this._keyEscape.event!.altKey && !this._keyEscape.event!.ctrlKey && !this._keyEscape.event!.shiftKey) {
                this._modelComponent.select(null);
            }

            if (this._keyDelete.isUp(false) && !this._keyDelete.event!.altKey && !this._keyDelete.event!.ctrlKey && !this._keyDelete.event!.shiftKey) {
                if (Application.playerMode !== PlayerMode.Editor) {
                    this._modelComponent.delete();
                }
            }

            if (this._keyW.isUp(false) && !this._keyW.event!.altKey && !this._keyW.event!.ctrlKey && !this._keyW.event!.shiftKey) {
                transformController.mode = transformController.translate;
            }

            if (this._keyE.isUp(false) && !this._keyE.event!.altKey && !this._keyE.event!.ctrlKey && !this._keyE.event!.shiftKey) {
                transformController.mode = transformController.rotate;
            }

            if (this._keyR.isUp(false) && !this._keyR.event!.altKey && !this._keyR.event!.ctrlKey && !this._keyR.event!.shiftKey) {
                transformController.mode = transformController.scale;
            }

            if (this._keyX.isUp(false) && !this._keyX.event!.altKey && !this._keyX.event!.ctrlKey && !this._keyX.event!.shiftKey) {
                transformController.isWorldSpace = !transformController.isWorldSpace;
            }

            if (this._keyF.isUp(false) && !this._keyF.event!.altKey && !this._keyF.event!.ctrlKey && !this._keyF.event!.shiftKey) {
                this.lookAtSelected();
            }
        }

        private static readonly _defalutPosition = egret3d.Vector3.create(-1, -1, -1);

        private _clearDefaultPointerDownPosition() {
            const defaultPointer = egret3d.inputCollecter.defaultPointer;
            defaultPointer.downPosition.copy(SceneSystem._defalutPosition);
        }
    }
}
