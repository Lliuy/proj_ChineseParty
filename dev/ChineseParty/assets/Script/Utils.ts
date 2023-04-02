import * as cc from 'cc';
import GameData from './GameData';
export default class Utils {
    /** 初始化已经预加载的预制体 */
    public static instantiate(prefabName: string) {
        if (GameData.prefabs[<any>prefabName] === null) {
            console.error(`预制体【${prefabName}】未加载`);
            return null;
        }
        console.log(GameData.prefabs);

        let node = cc.instantiate(GameData.prefabs[<any>prefabName]);
        if (node == null) {
            console.error(`预制体【${prefabName}】初始化失败`);
        }
        return node;
    }

    /**  3D结点世界坐标转UI世界坐标 */
    public static covertToUiSpace(mainCamera: cc.Node, uiCamera: cc.Node, worldPos: cc.Vec3) {
        let _main = mainCamera.getComponent(cc.Camera);
        let _ui = uiCamera.getComponent(cc.Camera);
        if (_main && _ui) {
            let pos = _main.worldToScreen(worldPos);
            let posUI = _ui.screenToWorld(pos);
            posUI.z = 0;
            return posUI;
        }
        return cc.Vec3.ZERO;
    }
}
