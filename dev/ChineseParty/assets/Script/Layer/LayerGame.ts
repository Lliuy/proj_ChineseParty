import { _decorator, Component, Node, Prefab, instantiate, v2, Vec2 } from 'cc';
import App from '../App';
import { ChineseLibraryManager, HanzoLibraryType } from '../Game/ChineseLibraryManager';
import { Cell, Game, InstNoEliminate, InstEliminate, InstReset, InstructionType } from '../Game/Game';
import NodeCard from '../Node/NodeCard';

const { ccclass, property } = _decorator;

@ccclass
export default class LayerGame extends Component {
    private static instance: LayerGame;
    public static getInstance(): LayerGame {
        return LayerGame.instance;
    }
    /**  棋盘结点 */
    @property(Node)
    public boardNode: Node = null!;
    /**  预制体格子 */
    @property(Prefab)
    public prefabCell: Prefab = null!;
    /**  汉字翻卡片 */
    public game: Game = null!;

    /**  处理器是否进行中 */
    private dealingInstructions = false;
    /**  格子的宽 */
    private cellWidth = 100;
    /**  格子的高 */
    private cellHeight = 100;
    /**  格子间距 */
    private cellSpace = 10;
    private boardWidth = 6;
    private boardHeight = 6;
    public constructor() {
        super();
        LayerGame.instance = this;
    }

    public onLoad() {
        let data: HanzoLibraryType[] = ChineseLibraryManager.selectHanzi((this.boardHeight * this.boardWidth) / 2);
        this.game = new Game({ boardWidth: this.boardWidth, boardHeight: this.boardHeight, data });
    }

    public start() {
        this.dealInstructions();
    }

    public update(dt: any) {}

    /**  点击格子 */
    public clickCell(cell: Cell) {
        this.game.clickCell(cell);
        this.dealInstructions();
    }

    /**  返回封面 */
    private onclickReturnCover(event: Event, data: string) {
        App.getInstance().enterLayerCover();
    }

    /**  创建棋盘 */
    private createBoard() {
        this.cellWidth * this.game.boardWidth;
        for (let y = 0; y < this.game.boardWidth; y++) {
            for (let x = 0; x < this.game.boardHeight; x++) {
                let node: Node = instantiate(this.prefabCell);
                let pos = this.getCellLocation(x, y);
                node.setPosition(pos.x, pos.y);
                node.parent = this.boardNode;
            }
        }
    }

    /**  初始化格子 */
    private initCell() {
        let i = 0;
        for (const cell of this.boardNode.children) {
            cell.getComponent(NodeCard)?.refreshCell(this.game.cells[i]);
            i++;
        }
    }

    /**  获取格子的坐标 */
    private getCellLocation(x: number, y: number): Vec2 {
        let boardWidth = this.game.boardWidth * (this.cellWidth + this.cellSpace) - this.cellSpace;
        let boardHeight = this.game.boardHeight * (this.cellHeight + this.cellSpace) - this.cellSpace;
        let posX = -boardWidth / 2 + this.cellWidth / 2 + x * this.cellWidth + x * this.cellSpace;
        let posY = boardHeight / 2 - this.cellHeight / 2 - y * this.cellHeight - y * this.cellSpace;
        return v2(posX, posY);
    }
    /*********************************************
     *
     *********************************************/
    /**  处理指令 */
    public async dealInstructions() {
        if (this.dealingInstructions) {
            return;
        }
        this.dealingInstructions = true;
        let inst = this.game.popInstruction();

        while (inst != null) {
            switch (inst.type) {
                case InstructionType.Reset:
                    await this.dealInstReset(inst as InstReset);
                    break;
                case InstructionType.NoEliminate:
                    await this.dealInstNoEliminate(inst as InstNoEliminate);
                    break;
                case InstructionType.Eliminate:
                    await this.dealInstEliminate(inst as InstEliminate);
                    break;
            }
            inst = this.game.popInstruction();
        }
        this.dealingInstructions = false;
    }

    private dealInstReset(inst: InstReset): Promise<void> {
        return new Promise<void>((resolve) => {
            console.log('dealInstReset');
            this.createBoard();
            this.initCell();
            resolve();
        });
    }

    private dealInstNoEliminate(inst: InstNoEliminate): Promise<void> {
        return new Promise<void>((resolve) => {
            console.log('dealInstNoEliminate');

            for (const cellNode of this.boardNode.children) {
                let nodeCard = cellNode.getComponent(NodeCard)!;
                let cell = nodeCard.cell;
                for (const gameCell of inst.cells) {
                    if (cell.index === gameCell.index) {
                        gameCell.isShow = false;
                        nodeCard.refreshCell(gameCell);
                    }
                }
            }

            resolve();
        });
    }

    private dealInstEliminate(inst: InstEliminate): Promise<void> {
        return new Promise<void>((resolve) => {
            console.log('dealInstEliminate');
            for (const cellNode of this.boardNode.children) {
                let nodeCard = cellNode.getComponent(NodeCard)!;
                let cell = nodeCard.cell;
                for (const gameCell of inst.cells) {
                    if (cell.index === gameCell.index) {
                        gameCell.isDeath = true;
                        gameCell.isShow = false;
                        nodeCard.refreshCell(gameCell);
                        cellNode.active = false;
                    }
                }
            }
            resolve();
        });
    }
}
