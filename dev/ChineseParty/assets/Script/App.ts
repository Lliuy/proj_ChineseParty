import { _decorator, Component, Node, instantiate, utils } from 'cc';
import Utils from './Utils';
const { ccclass, property } = _decorator;

@ccclass
export default class App extends Component {
    private static instance: App;
    public static getInstance(): App {
        return App.instance;
    }

    private layerCover: Node = null!;
    private layerGame: Node = null!;

    public constructor() {
        super();
        App.instance = this;
    }

    public onLoad() {}

    public start() {
        console.clear();

        this.enterLayerCover();
    }

    public update(dt: any) {}

    /**  进入层_封面 */
    public enterLayerCover() {
        this.hideAllLayer();
        this.layerCover = Utils.instantiate('层_封面')!;
        this.layerCover.parent = this.node;
    }

    /**  进入层游戏 */
    public enterLayerGame() {
        this.hideAllLayer();
        this.layerGame = Utils.instantiate('层_游戏')!;
        this.layerGame.parent = this.node;
    }

    /**  隐藏层 */
    private hideAllLayer() {
        if (this.layerCover) this.layerCover.destroy();
        if (this.layerGame) this.layerGame.destroy();
    }
}
