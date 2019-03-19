namespace paper.editor {
    /**
     * TODO
     */
    @executeMode(PlayerMode.DebugPlayer | PlayerMode.Editor)
    export class SceneSystem extends BaseSystem<GameObject> {
        private readonly _modelComponent: ModelComponent = Application.sceneManager.globalEntity.getOrAddComponent(ModelComponent);

        private readonly _keyEscape: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.Escape);
        private readonly _keyDelete: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.Delete);
        private readonly _keyE: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyE);
        private readonly _keyW: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyW);
        private readonly _keyR: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyR);
        private readonly _keyX: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyX);
        private readonly _keyF: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyF);

        private _gizmosContainerEntity: GameObject | null = null;
        private _gizmosForwardContainerEntity: GameObject | null = null;
        private _touchContainerEntity: GameObject | null = null;
        private _transformControllerEntity: GameObject | null = null;

        private readonly _selectBox: egret3d.Box = egret3d.Box.create();

        private _updateSelectBox(camera: egret3d.Camera, viewport: egret3d.Rectangle) {
            this._selectBox.minimum.set(viewport.x, viewport.y, camera.near);
            this._selectBox.maximum.set(viewport.x + viewport.w, viewport.y + viewport.h, camera.near + camera.far);
        }

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
                Matcher.create<GameObject>(egret3d.Transform)
                    .anyOf(egret3d.MeshRenderer, egret3d.SkinnedMeshRenderer, egret3d.particle.ParticleRenderer),
                Matcher.create<GameObject>(egret3d.Transform, HoveredFlag)
                    .anyOf(egret3d.MeshRenderer, egret3d.SkinnedMeshRenderer, egret3d.particle.ParticleRenderer),
                Matcher.create<GameObject>(egret3d.Transform, LastSelectedFlag),
            ];
        }

        public onEnable() {
            const editorCamera = egret3d.Camera.editor;
            editorCamera.gameObject.addComponent(OrbitControls);
            editorCamera.enabled = true;

            this._gizmosContainerEntity = EditorMeshHelper.createGameObject("Gizmos");
            this._gizmosForwardContainerEntity = EditorMeshHelper.createGameObject("Gizmos Forward");
            this._touchContainerEntity = EditorMeshHelper.createGameObject("Touch");
            this._transformControllerEntity = EditorMeshHelper.createGameObject("Transform Controller");
            this._transformControllerEntity.enabled = false;

            this._gizmosContainerEntity.addComponent(GizmosContainerFlag);
            this._gizmosForwardContainerEntity.addComponent(GizmosContainerForwardFlag);
            this._touchContainerEntity.addComponent(TouchContainerFlag);
            this._transformControllerEntity.addComponent(TransformController);
        }

        public onDisable() {
            const editorCamera = egret3d.Camera.editor;
            editorCamera.gameObject.removeComponent(OrbitControls);
            editorCamera.enabled = false;

            this._gizmosContainerEntity!.destroy();
            this._gizmosForwardContainerEntity!.destroy();
            this._touchContainerEntity!.destroy();
            this._transformControllerEntity!.destroy();

            this._gizmosContainerEntity = null;
            this._gizmosForwardContainerEntity = null;
            this._touchContainerEntity = null;
            this._transformControllerEntity = null;
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;
        }

        public onEntityRemoved(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;
        }

        public onFrame() {
            const editorScene = paper.Application.sceneManager.editorScene;
            const editorCamera = egret3d.Camera.editor;
            const groups = this.groups;
            const hoveredEntity = groups[1].singleEntity;

            const transformController = this._transformControllerEntity!.getComponent(TransformController)!;
            const defaultPointer = egret3d.inputCollecter.defaultPointer;

            if (defaultPointer.isDown(egret3d.PointerButtonsType.LeftMouse, false)) {
                if (defaultPointer.event!.buttons & egret3d.PointerButtonsType.RightMouse) { // 正在控制摄像机。
                }
                else {
                    if (transformController.isActiveAndEnabled && transformController.hovered) {
                        transformController.start(defaultPointer.downPosition);
                    }
                    else {
                        this._gizmosForwardContainerEntity!.addComponent(SelectFrameFlag);
                    }
                }
            }

            let selectFrameFlag = this._gizmosForwardContainerEntity!.getComponent(SelectFrameFlag);

            if (defaultPointer.isUp(egret3d.PointerButtonsType.LeftMouse, false)) {
                if (transformController.isActiveAndEnabled && transformController.hovered) {
                    transformController.end();
                }
                else { // Update selected.
                    const event = defaultPointer.event!;

                    if (hoveredEntity) {
                        let pickedFlag = hoveredEntity.getComponent(PickedFlag);

                        if (hoveredEntity.renderer instanceof egret3d.SkinnedMeshRenderer && !pickedFlag) {
                            const animation = hoveredEntity.getComponentInParent(egret3d.Animation);

                            if (animation) {
                                pickedFlag = hoveredEntity.addComponent(PickedFlag);
                                pickedFlag.target = animation.entity as GameObject;
                            }
                        }

                        const targetEntity = pickedFlag ? pickedFlag.target! : hoveredEntity;

                        if (targetEntity.getComponent(SelectedFlag)) {
                            if (event.ctrlKey) {
                                this._modelComponent.unselect(targetEntity);
                            }
                        }
                        else {
                            if (defaultPointer.position.getDistance(defaultPointer.downPosition) < 5.0) {
                                this._modelComponent.select(targetEntity, !event.ctrlKey);
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
                        if (!this._modelComponent.selectedScene && !defaultPointer.downPosition.equal(SceneSystem._defalutPosition)) { // TODO
                            this._modelComponent.select(Scene.activeScene);
                        }
                    }

                    if (selectFrameFlag) {
                        this._gizmosForwardContainerEntity!.removeComponent(SelectFrameFlag);
                        selectFrameFlag = null;
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
                        if (selectFrameFlag) {
                            const { w, h } = egret3d.stage.viewport;
                            const { viewport } = selectFrameFlag;
                            const { downPosition, position } = defaultPointer;
                            const dX = position.x - downPosition.x;
                            const dY = position.y - downPosition.y;

                            if (downPosition.x <= position.x) {
                                viewport.x = downPosition.x / w;
                                viewport.w = dX / w;
                            }
                            else {
                                viewport.x = position.x / w;
                                viewport.w = -dX / w;
                            }

                            if (downPosition.y <= position.y) {
                                viewport.y = downPosition.y / h;
                                viewport.h = dY / h;
                            }
                            else {
                                viewport.y = position.y / h;
                                viewport.h = -dY / h;
                            }

                            if (Math.abs(dX) > 5.0 || Math.abs(dY) > 5.0) {
                                this._updateSelectBox(editorCamera, viewport);

                                for (const entity of groups[0].entities) {
                                    if (entity.scene === editorScene) {
                                        continue;
                                    }

                                    if (this._selectBox.intersectsSphere(entity.renderer!.boundingSphere)) {
                                        this._modelComponent.select(entity, false);
                                    }
                                    else {
                                        this._modelComponent.unselect(entity);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // 更新变换控制器的控制柄。
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

                        if (!transformController.isActiveAndEnabled || !transformController.hovered) {
                            const gameObjects = Scene.activeScene.getRootGameObjects().concat(); // TODO
                            gameObjects.unshift(this._touchContainerEntity!);

                            const raycastInfos = Helper.raycastAll(gameObjects, defaultPointer.position.x, defaultPointer.position.y, true);

                            if (raycastInfos.length > 0) {
                                const raycastEntity = raycastInfos[0].transform!.entity! as GameObject;
                                raycastEntity.addComponent(HoveredFlag);
                            }
                        }
                    }
                }
            }

            if (this._keyEscape.isUp(false) && !this._keyEscape.event!.altKey && !this._keyEscape.event!.ctrlKey && !this._keyEscape.event!.shiftKey) {
                this._modelComponent.select(null);
            }

            if (this._keyDelete.isUp(false) && !this._keyDelete.event!.altKey && !this._keyDelete.event!.ctrlKey && !this._keyDelete.event!.shiftKey) {
                if ((Application.playerMode & PlayerMode.Editor) === 0) {
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
