/*******************************************************************************
文件: XTaskPool.ts
创建: 2020年07月15日
作者: 老张(zwx@xfire.mobi)
描述:
    task管理模块，目前主要用于加载进度管理
*******************************************************************************/

import { utils } from 'cc';
import { DEV } from 'cc/env';
import { hare } from '../Hare/hare_base';
import Utils from '../Utils';

export abstract class Task {
    public end = false;
    /** 任务进度0-1 */
    public progress = 0;

    /** 开始工作，并需要更新进度 */
    public abstract run(): void;

    /** 标记任务结束，不指定succ标记将根据progress判断是否成功 */
    public endTask(succ: boolean): void {
        this.end = true;
        if (succ === true) {
            this.progress = 1;
        } else if (succ === false) {
            if (this.progress >= 1) {
                this.progress = 0.99;
            }
        }
    }
}

/** 任务池 */
export default class XTaskPool {
    private totalWeight = 0;
    private tasks: { weight: number; task: Task; block: boolean }[] = [];
    private completed = false;

    /** 返回总进度 */
    public get progress() {
        if (this.completed) {
            return 1;
        }
        if (this.totalWeight <= 0) {
            this.completed = true;
            return 1;
        }
        let ret = 0;
        this.tasks.forEach((task) => {
            ret += task.weight * task.task.progress;
        });
        ret = ret / this.totalWeight;
        ret = Math.min(1, ret);
        this.completed = ret === 1;
        return ret;
    }

    /**
     * 添加任务
     * @param task 任务对象
     * @param weight 总进度中的权重
     * @param block 是否阻塞，如果阻塞，后续添加的任务需要等本任务完成才开始
     */
    public addTask(task: Task, weight = 1, block = false) {
        if (DEV && weight < 0) {
            console.error('权重不能为负数');
        }
        this.tasks.push({ weight, task, block });
        this.totalWeight += weight;
    }

    public start(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.completed = false;
            (async () => {
                for (let task of this.tasks) {
                    task.task.progress = 0;
                    task.task.end = false;
                    task.task.run();
                    while (task.block && task.task.progress < 1) {
                        await hare.sleep(0.1);
                    }
                }
                do {
                    await hare.sleep(0.1);
                    if (this.progress === 1) {
                        resolve();
                        break;
                    }
                } while (!this.completed);
            })();
        });
    }
}
