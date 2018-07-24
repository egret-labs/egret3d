namespace paper {
    /**
     * 
     */
    export class MissingComponent extends BaseComponent {

        public missingObject: any | null = null;

        public serialize() {
            const rarget = super.serialize();
            rarget.missingObject = this.missingObject;

            return rarget;
        }

        public deserialize(element: any): void {
            this.missingObject = element.missingObject || null;
        }
    }
}
