/*******************************************************************************
文件: ChineseLibraryManager.ts
创建: 2021年03月19日
作者: 刘义
描述:
	汉字库管理器
*******************************************************************************/
import { ChineseLibrary } from '../ChineseLibrary';
import { hare } from '../Hare/hare_base';

/**
 * 汉字对象
 * */
export interface Hanzi {
    /**  汉字1 */
    汉字1: string;
    /**  汉字2 */
    汉字2: string;
    /**  汉字1 + 汉字2 = 组成 */
    组成: string;
}
/**  汉字库类型 */
export interface HanzoLibraryType {
    1: string;
    2: string;
    文字: string;
}

export class ChineseLibraryManager {
    /**
     * 是否可以组成汉字
     * @param hanzi1: 汉字1
     * @param hanzi2: 汉字2
     *  */
    public static isComposeHanzi(hanzi1: string, hanzi2: string): Hanzi {
        let result: Hanzi = {
            汉字1: hanzi1,
            汉字2: hanzi2,
            组成: null!
        };

        let object = ChineseLibrary.汉字库;
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                if (hanzi1 === element[1] && hanzi2 === element[2]) {
                    result.组成 = element['文字'];
                    return result;
                }
                if (hanzi1 === element[2] && hanzi2 === element[1]) {
                    result.组成 = element['文字'];
                    return result;
                }
            }
        }
        return result;
    }

    /**
     * 从汉字库中选取汉字
     * @param num 选取的个数
     */
    public static selectHanzi(num: number): HanzoLibraryType[] {
        let hanziLibraryArr: HanzoLibraryType[] = [];
        let selectHanziArr: HanzoLibraryType[] = [];
        let object = ChineseLibrary.汉字库;
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                hanziLibraryArr.push(element);
            }
        }

        for (let i = 0; i < num; i++) {
            let hanziObj = hare.getRandomMember(hanziLibraryArr);
            while (selectHanziArr.indexOf(hanziObj) >= 0) {
                hanziObj = hare.getRandomMember(hanziLibraryArr);
            }
            selectHanziArr.push(hanziObj);
        }

        return selectHanziArr;
    }

    /**  获得汉字库的汉字数目 */
    private static getChineseHanziNum() {
        let num = 0;
        let object = ChineseLibrary.汉字库;
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                num++;
            }
        }
        return num;
    }
}
