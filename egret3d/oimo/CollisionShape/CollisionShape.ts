namespace egret3d.oimo {
    export class CollisionShape extends paper.BaseComponent {
        protected _type=-1;
        protected _oimoShapeConfig:OIMO.ShapeConfig;
        protected _oimoShape:OIMO.Shape;

        constructor(){
            super();
            this._oimoShapeConfig=new OIMO.ShapeConfig();
        }

        protected setGeometry(geom:OIMO.Geometry){
            this._oimoShapeConfig.geometry=geom;
        }

        //TODO: 返回的是oimo的geometry
        public get geometry(){
            return this._oimoShapeConfig.geometry;
        }
        public get shape(){
            if(this._oimoShape== null){
                this._oimoShape=new OIMO.Shape(this._oimoShapeConfig);
            }
        }
        public get localTransform(){
            return this
        }
        public get type(){
            return this._type;
        }

        public getVolume (){
            return this._oimoGeometry.getVolume();
        }
    }
}