namespace paper {
    /**
     * 更新系统。
     */
    export class UpdateSystem extends BaseSystem {
        public readonly interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onUpdate(deltaTime: number) {
            const components = this.groups[0].components as ReadonlyArray<Behaviour | null>;
            for (const component of components) {
                if (component && component._isStarted) {
                    component.onUpdate && component.onUpdate(deltaTime);
                }
            }
        }
    }
}
