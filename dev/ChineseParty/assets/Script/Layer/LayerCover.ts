import { _decorator, Component, Node } from 'cc';
import App from '../App';
const { ccclass, property } = _decorator;

@ccclass('LayerCover')
export class LayerCover extends Component {
    public onLoad() {}

    private onclickEnterGame(event: Event, data: string) {
        console.log(event.target);
        App.getInstance().enterLayerGame();
    }
}
