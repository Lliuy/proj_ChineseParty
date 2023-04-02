/*******************************************************************************
文件: GameData.ts
创建:
作者:
描述:
    游戏内的数据交互。
    切记不要将乱七八糟的数据放到这里，优先考虑模块的内聚。
    如果要放一些通知类的，应考虑优先使用消息模块。
*******************************************************************************/
import { Prefab } from 'cc';
import Archive from './Archive';

let GameData: {
    gold: number;
    prefabs: Prefab[];
} = {
    gold: 100,
    prefabs: []
};
export default GameData;

// /**  保存存档 */
// export function saveGameData() {
//     Archive.getInstance().save();
//     saveGame(GameRecordInfo);
// }
// /**  加载存档 */
// export async function loadGameData() {
//     loadGame(GameRecordInfo);
//     // 加载存档
//     await Archive.getInstance().load();

//     // 每日刷新数据
//     refreshData();
// }
