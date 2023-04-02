import { Quat, log } from 'cc';
import { _decorator, Component, Animation, Node, Label, UI, Sprite, Color, color, tween, v2, Vec3, math } from 'cc';
import { Cell } from '../Game/Game';
import { hare } from '../Hare/hare_base';
import LayerGame from '../Layer/LayerGame';
const { ccclass, property } = _decorator;

const CardColor = {
    正面: '#FFFFFF',
    反面: '#000000'
};

@ccclass
export default class NodeCard extends Component {
    private static instance: NodeCard;
    public static getInstance(): NodeCard {
        return NodeCard.instance;
    }
    /**  卡片文字 */
    @property(Label)
    public label: Label = null!;
    /**  卡片底板 */
    @property(Node)
    public cardBg: Node = null!;

    public cell: Cell = null!;

    public constructor() {
        super();
        NodeCard.instance = this;
    }

    public onLoad() { }

    public start() {
        this.refresh();
    }

    public update(dt: any) { }

    /**  刷新格子的cell */
    public refreshCell(cell: Cell) {
        this.cell = cell;
        this.refresh();
    }

    private refresh() {
        this.label.string = this.cell.text;
        this.label.node.active = this.cell.isShow;
        let sprite: Sprite = this.cardBg.getComponent(Sprite)!;
        let colorStr = this.cell.isShow ? CardColor.正面 : CardColor.反面;
        sprite.color = color(0, 0, 0, 255).fromHEX(colorStr);
    }

    /**  点击卡片 */
    private onclickCare(event: Event, data: string) {
        // 翻卡
        this.cell.isShow = !this.cell.isShow;
        this.node.getComponent(Animation)?.play();

        this.refresh();
        this.node.getComponent(Animation)?.once(Animation.EventType.FINISHED, async () => {
            await hare.sleep(1);
            LayerGame.getInstance().clickCell(this.cell);
        });

        log('aaaa');
    }

}
