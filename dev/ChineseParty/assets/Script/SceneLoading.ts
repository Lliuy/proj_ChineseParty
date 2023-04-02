import { _decorator, Component, Node, ProgressBar, director, Prefab, loader, assetManager, AssetManager, resources, Label } from 'cc';
import Configs from './Configs';
import GameData from './GameData';
import XAudio from './XModuel/XAudio';
import XTaskPool, { Task } from './XModuel/XTaskPool';
const { ccclass, property } = _decorator;

@ccclass
export default class SceneLoading extends Component {
    private static instance: SceneLoading;
    public static getInstance(): SceneLoading {
        return SceneLoading.instance;
    }
    @property(ProgressBar)
    public progressBar: ProgressBar = null!;

    @property(Label)
    public progressLabel: Label = null!;

    /** 任务池 */
    private taskPool = new XTaskPool();

    public constructor() {
        super();
        SceneLoading.instance = this;
    }


    public onLoad() {}

    public start() {
        this.loadResources();
        
    }

    public update(dt: any) {
        // 更新进度
        if (this.progressBar) {
            this.progressBar.progress = this.taskPool.progress;
            this.progressLabel.string = this.taskPool.progress.toString();
        }
    }

    /** 加载资源 */
    private async loadResources() {
        // 加载Audio目录下所有音频，不纳入进度
        this.taskPool.addTask(
            new TaskSimple(() => {
                XAudio.addResAudios();
            }),
            0
        );
        // 任务：预加载场景
        this.taskPool.addTask(new TaskPreloadScene('App'));

        // 任务：加载批量预制体，【需要修改存储加载结果】
        this.taskPool.addTask(new TaskPreloadPrefab(Configs.prefab));

        await this.taskPool.start();

        // 进入主场景
        director.loadScene('App');
    }
}

////////////////////////////////////////////////////////////////////////////////
// 下方为任务定义
////////////////////////////////////////////////////////////////////////////////
/** 简单任务，只是执行一个函数，用于与阻塞任务排序 */
class TaskSimple extends Task {
    private runner: () => void = <any>null;
    public constructor(runner: () => void) {
        super();
        this.runner = runner;
    }

    public run(): void {
        if (this.runner) {
            this.runner();
        }
        this.progress = 1;
        this.endTask(true);
    }
}

/** 场景预加载任务 */
class TaskPreloadScene extends Task {
    private sceneName = 'App';

    public constructor(sceneName: string) {
        super();
        this.sceneName = sceneName;
    }

    public run() {
        director.preloadScene(
            this.sceneName,
            (completeCount, totalCount) => {
                let progress = completeCount / totalCount;
                this.progress = Math.max(this.progress, progress);
            },
            () => {
                this.progress = 1;
            }
        );
    }
}

/** 预制体挨个加载 */
class TaskPreloadPrefab extends Task {
    private prefabNames: string[] = [];

    public constructor(prefabNames: string[]) {
        super();
        this.prefabNames = prefabNames;
    }
    public run(): void {
        let count = 0;
        if (this.prefabNames.length === 0) {
            this.progress = 1;
            return;
        }
        this.prefabNames.forEach((name: string) => {
            resources.loadDir('Prefab/', Prefab, (error: any, prefabs: Prefab[]) => {
                for (const prefab of prefabs) {
                    if (prefab.data.name === name) {
                        GameData.prefabs[<any>name] = prefab;
                    }
                    count++;
                    if (error) {
                        console.error(error);
                    }
                    this.progress = count / prefabs.length;
                }
            });
        });
    }
}
