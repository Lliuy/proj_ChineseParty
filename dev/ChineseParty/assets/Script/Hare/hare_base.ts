/*******************************************************************************
文件: hare_base.ts
创建: 2021年03月19日
作者: Ly
描述:
	常用方法
*******************************************************************************/

import { Component, Game, game, SystemEventType, v2, Vec2 } from 'cc';

class HareApp {
    private static instance: HareApp = null!;
    public static getInstance(): HareApp {
        return HareApp.instance;
    }

    public constructor() {
        HareApp.instance = this;
    }

    /**
     * 获取当前时间戳，单位：毫秒
     */
    public get currentTimeMillis() {
        return Date.now();
    }

    /**
     * 延迟指定秒
     * @param timeSecond 单位秒
     * @param driveComponent 驱动组件，不指定将使用setTimeout(游戏进入后台都可能运行)
     */
    public sleep(timeSecond: number, driveComponent?: Component): Promise<number> {
        return new Promise<number>((resolve) => {
            if (driveComponent) {
                driveComponent.scheduleOnce(() => {
                    resolve(timeSecond);
                }, timeSecond);
            } else {
                setTimeout(() => {
                    resolve(timeSecond);
                }, timeSecond * 1000);
            }
        });
    }

    /**
     * 指定范围内取整数
     * @param startInc 开始（含）
     * @param endExc 结束（不含）
     */
    public getRandomInteger(startInc: number, endExc: number) {
        let start = Math.floor(startInc);
        let end = Math.floor(endExc);
        return Math.floor(start + (end - start) * Math.random());
    }

    /**
     * 随机获取一个数组成员
     * @param ary 成员数组
     */
    public getRandomMember<T>(ary: T[]): T {
        return ary[Math.floor(Math.random() * ary.length)];
    }

    /**
     * 排除指定下标后随机取数组下标，用途如随机武器更换，在武器数组排除当前武器
     * 再取随机
     * @param arySize 数组大小
     * @param exclude 排除下标
     * 出错返回-1
     */
    public getRandomIndexExcept(arySize: number, exclude: number): number {
        if (arySize < 1) {
            return -1;
        }
        if (arySize === 1 && exclude === 0) {
            return -1;
        }
        let dec = 0;
        if (exclude >= 0 && exclude < arySize) {
            dec = 1;
        }
        let index = Math.floor(Math.random() * (arySize - dec));
        if (dec === 1 && index >= exclude) {
            return index + 1;
        }
        return index;
    }

    /**
     * 按权重随机取数组下标
     * @param ary 权重数组或者包含weight属性的对象数组
     */
    public getRandomIndexByWeight(ary: number[] | { weight: number }[]): number {
        let weights: number[] = [];
        if (typeof ary[0] === 'number') {
            weights = ary as number[];
        } else {
            for (let obj of ary as { weight: number }[]) {
                weights.push(obj.weight);
            }
        }
        let rand = Math.random();
        // 计算权重总值
        let totalWeight = 0;
        for (let weight of weights) {
            totalWeight += weight > 0 ? weight : 0;
        }
        if (totalWeight === 0) {
            return Math.floor(weights.length * rand);
        }
        rand *= totalWeight;
        // 取下标
        let searchWeight = 0;
        let index = 0;
        for (let weight of weights) {
            searchWeight += weight > 0 ? weight : 0;
            if (searchWeight > rand) {
                return index;
            }
            index++;
        }

        return index;
    }

    /**
     * 在圆内【均匀】取随机点
     * @param origin 圆心坐标
     * @param radius 圆半径
     */
    public getRandomPointInCircle(origin: Vec2, radius: number): Vec2 {
        let angle = Math.PI * 2 * Math.random();
        let r = Math.sqrt(radius * radius * Math.random());
        return v2(Math.cos(angle) * r + origin.x, Math.sin(angle) * r + origin.y);
    }

    public onHide(callBack: () => void) {
        game.on(Game.EVENT_HIDE, () => {
            callBack();
        });
    }

    public onShow(callBack: () => void) {
        game.on(Game.EVENT_SHOW, () => {
            callBack();
        });
    }
}

export let hare: HareApp = new HareApp();
