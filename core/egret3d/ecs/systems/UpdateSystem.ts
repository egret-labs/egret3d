namespace paper {
    /**
     * 更新系统。
     */
    export class UpdateSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onUpdate(deltaTime: number) {
            const components = this._groups[0].components as ReadonlyArray<Behaviour | null>;

            if (Application.playerMode === PlayerMode.Editor) {
                for (const component of components) {
                    if (component && (component.constructor as IComponentClass<Behaviour>).executeInEditMode) {
                        component.onUpdate && component.onUpdate(deltaTime);
                    }
                }
            }
            else {
                for (const component of components) {
                    if (component) {
                        component.onUpdate && component.onUpdate(deltaTime);
                    }
                }
            }
        }
    }
}
