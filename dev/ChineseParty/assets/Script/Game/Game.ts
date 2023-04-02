/*******************************************************************************
文件: Game.ts
创建: 2021年03月19日
作者: 刘义
描述:
    记忆翻卡玩法
*******************************************************************************/

import { ChineseLibraryManager, HanzoLibraryType as HanziLibraryType } from './ChineseLibraryManager';

export class Game {
    /**  棋盘格子数组 */
    public cells: Cell[] = [];
    /**  行 */
    public boardWidth = 4;
    /**  列 */
    public boardHeight = 4;
    /** 指令集 */
    private instructions: Instruction[] = [];

    public constructor(_params?: { boardWidth?: number; boardHeight?: number; data: HanziLibraryType[] }) {
        this.reset(_params);
    }

    public reset(_params?: { boardWidth?: number; boardHeight?: number; data: HanziLibraryType[] }) {
        this.boardWidth = _params?.boardWidth!;
        this.boardHeight = _params?.boardHeight!;

        this.instructions.push(new InstReset());
        // 初始化格子
        this.initCell(_params!.data);
        // 打乱数组
        this.upSetCell();
    }

    public setCell() {}

    public getCell(index: number): Cell {
        return this.cells[index];
    }

    /** 弹出并返回指令，没有指令后就返回null */
    public popInstruction() {
        return this.instructions.shift();
    }

    /**  点击格子 */
    public clickCell(cell: Cell) {
        // 判断是否可以消除
        let showCells: Cell[] = [];
        for (const cell of this.cells) {
            if (cell.isShow && !cell.isDeath) {
                showCells.push(cell);
            }
        }

        if (showCells.length === 2) {
            let res = ChineseLibraryManager.isComposeHanzi(showCells[0].text, showCells[1].text);
            console.log(res);

            if (res.组成 != null) {
                this.instructions.push(new InstEliminate(showCells));
            } else {
                this.instructions.push(new InstNoEliminate(showCells));
            }
        }
    }

    /**  初始化格子 */
    private initCell(data: HanziLibraryType[]) {
        let i = 0;

        for (const hanziLibrary of data) {
            console.log(hanziLibrary);
            let cell1: Cell = {
                index: i,
                text: hanziLibrary[1],
                isDeath: false,
                isShow: false
            };
            this.cells.push(cell1);
            i++;
            let cell2: Cell = {
                index: i,
                text: hanziLibrary[2],
                isDeath: false,
                isShow: false
            };
            this.cells.push(cell2);
            i++;
        }
    }

    /**  打乱格子的顺序 */
    private upSetCell() {
        this.cells = this.cells.sort((a, b) => {
            return Math.random() > 0.5 ? 1 : -1;
        });
    }
}

/**
 * 格子
 * @param index 格子的下标
 * @param text 格子的文字
 * @param isShow  是否是正面
 * @param isDeath 是否消除
 **/
export interface Cell {
    index: number;
    text: string;
    isShow: boolean;
    isDeath: boolean;
}

/**
 * 指令的类型
 * @param Reset 重置游戏
 * @param NoEliminate 两个不能消除
 * @param Eliminate 两个可以消除
 */
export enum InstructionType {
    Reset = 1,
    NoEliminate = 2,
    Eliminate = 3
}

/**  操作指令 */
export class Instruction {
    public type: InstructionType = 1;
}

/**  游戏初始化指令 */
export class InstReset extends Instruction {
    public constructor() {
        super();
        this.type = InstructionType.Reset;
    }
}

/**  不能消除 */
export class InstNoEliminate extends Instruction {
    public cells: Cell[] = [];
    public constructor(cells: Cell[]) {
        super();
        this.type = InstructionType.NoEliminate;
        this.cells = cells;
    }
}

/**  消除 */
export class InstEliminate extends Instruction {
    public cells: Cell[] = [];
    public constructor(cells: Cell[]) {
        super();
        this.type = InstructionType.Eliminate;
        this.cells = cells;
    }
}
