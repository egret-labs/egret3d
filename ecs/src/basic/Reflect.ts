import {
    ecs,
    editor,

    Application,
    Asset,
    BaseComponent,
    BaseRenderer,
    Behaviour,
    Clock,
    GameEntity,
    HideFlagsComponent,
    MissingComponent,
    Node,
    Releasable,
    Scene,
    SceneManager,
    SystemManager,
    UUID,
} from "..";

const {
    Collector,
    Component,
    Context,
    Entity,
    Group,
    GroupComponent,
    Matcher,
    System,
} = ecs;

const {
    PropertyInfo,
} = editor;

(Asset as any).__class__ = 'Asset';
(Releasable as any).__class__ = 'Releasable';
(UUID as any).__class__ = 'UUID';
(Collector as any).__class__ = 'Collector';
(Component as any).__class__ = 'Component';
(Context as any).__class__ = 'Context';
(Entity as any).__class__ = 'Entity';
(Group as any).__class__ = 'Group';
(GroupComponent as any).__class__ = 'GroupComponent';
(Matcher as any).__class__ = 'Matcher';
(System as any).__class__ = 'System';
(PropertyInfo as any).__class__ = 'PropertyInfo';
(Application as any).__class__ = 'Application';
(BaseComponent as any).__class__ = 'BaseComponent';
(BaseRenderer as any).__class__ = 'BaseRenderer';
(Behaviour as any).__class__ = 'Behaviour';
(Node as any).__class__ = 'Node';
(Scene as any).__class__ = 'Scene';
(Clock as any).__class__ = 'Clock';
(GameEntity as any).__class__ = 'GameEntity';
(SceneManager as any).__class__ = 'SceneManager';
(SystemManager as any).__class__ = 'SystemManager';
(MissingComponent as any).__class__ = 'MissingComponent';
(HideFlagsComponent as any).__class__ = 'HideFlagsComponent';

const map: { [key: string]: any } = {
    Application: Application,
    Asset: Asset,
    BaseComponent: BaseComponent,
    BaseRenderer: BaseRenderer,
    Behaviour: Behaviour,
    Clock: Clock,
    Collector: Collector,
    Component: Component,
    Context: Context,
    Entity: Entity,
    GameEntity: GameEntity,
    Group: Group,
    GroupComponent: GroupComponent,
    HideFlagsComponent: HideFlagsComponent,
    Matcher: Matcher,
    MissingComponent: MissingComponent,
    Node: Node,
    PropertyInfo: PropertyInfo,
    Releasable: Releasable,
    Scene: Scene,
    SceneManager: SceneManager,
    System: System,
    SystemManager: SystemManager,
    UUID: UUID,
}

export { Reflect }

class Reflect {
    public static getQualifiedClassName(objectOrClass: any): string {
        if (!objectOrClass) { return ''; }
        if (objectOrClass.__class__) { return objectOrClass.__class__; }
        if (objectOrClass.constructor) { return objectOrClass.constructor.__class__ || ''; }

        return '';
    }
    public static getDefinitionByName(className: string): any {
        return (window && (window as any)[className]) || map[className] || null;
    }
}