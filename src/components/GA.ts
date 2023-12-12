import { Source } from '../GameConfig';
import { GameScene } from '../scenes/GameScene';
import TestKit from '../components/Test';
import { Images } from '../utils/const';
import Cell from './Cell';
import templateX from '../../assets/templateX.json';
import templateZero from '../../assets/templateZero.json';
type MyType = [Cell, Cell[], Cell[], Cell[], Cell[]];

export default class GameAlgoritm {
    scene: GameScene;
    store: Cell[] = [];
    cells: Cell[] = [];

    cellsGA: Cell[] = []; // массив сделанных ходов АИ
    cellsR: Cell[] = []; // массив сделанных ходов игрока
    cellsFieldGA: Cell[] = []; // массив возможных ходов АИ
    sampleGA: Cell[] = []; // массив лучших ходов (по w) АИ
    cellsFieldR: Cell[] = []; // массив возможных ходов игрока
    sampleR: Cell[] = []; // массив лучших ходов (по z) игрока
    testKitLastMovesR: MyType[] = []; // набор тестов для сделанных ходов игрока
    testKitGA: MyType[] = []; // набор тестов для возможных ходов АИ
    testKitR: MyType[] = []; // набор тестов для возможных ходов игрока
    bestGA: number; // id выбранной ячейки
    bestR: number; // id выбранной ячейки
    maxAttackMadeMovesR: number;
    isFinish: boolean = false;
    isYourMove: boolean = false;
    isRivalMove: boolean = false;
    templX: any = templateX;
    templZero: any = templateZero;

    constructor(scene: GameScene) {
        this.scene = scene;

    }

    onCellClicked(cell: Cell) {
        if (cell.value == -1 &&
            !this.isFinish
        ) {
            this.scene.pointer.destroy();

            this.scene.sounds.card.play();

            //для крестика "обесцвечиваем" предыдущий нолик
            if (this.store.length % 2 == 0) {
                if (this.store.length > 0) {
                    this.scene.add
                        .sprite(this.store.at(-1).x, this.store.at(-1).y, Images.CELL_ZERO)
                        .setOrigin(0, 0);
                }
                this.scene.add.sprite(cell.x, cell.y, Images.CELL_X_HIGHLIGHTED).setOrigin(0, 0);
                if (this.scene.btnXWasPressed) {
                    cell.value = 1;
                    this.cellsR.push(cell);
                } else if (this.scene.btnZeroWasPressed) {
                    cell.value = 0;
                    this.cellsGA.push(cell);
                }

            } else {
                //для нолика "обесцвечиваем" предыдущий крестик
                if (this.store.length % 2) {
                    this.scene.add
                        .sprite(this.store.at(-1).x, this.store.at(-1).y, Images.CELL_X)
                        .setOrigin(0, 0);
                }

                this.scene.add.sprite(cell.x, cell.y, Images.CELL_ZERO_HIGHLIGHTED).setOrigin(0, 0);
                if (this.scene.btnXWasPressed) {
                    cell.value = 0;
                    this.cellsGA.push(cell);
                } else if (this.scene.btnZeroWasPressed) {
                    cell.value = 1;
                    this.cellsR.push(cell);
                }
            }
            this.store.push(cell);
            //========= Определяем чей ход =================================

            this.isYourMove = this.scene.btnXWasPressed && (this.store.length % 2 == 0) ||
                this.scene.btnZeroWasPressed && (this.store.length % 2 != 0); //true
 
            this.isRivalMove = this.scene.btnXWasPressed && (this.store.length % 2 != 0) ||
                this.scene.btnZeroWasPressed && (this.store.length % 2 == 0); //true

            this.scene.createTimeBar();
            this.scene.timeMask.destroy();
           this.scene.Timer.paused = false;

            console.log(this.isYourMove)
            console.log(this.isRivalMove)
            //=========================================================================================

            this.scene.createPointer();
            if (this.store.length > 1 && !this.isFinish) {
                this.scene.pointer.x = this.store.at(-2).x;
                this.scene.pointer.y = this.store.at(-2).y;
            }

            // Проверка наличия победителя
            // Запускаем createTestKit() в кл. TestKit и получаем массив,
            // для ячейки cell, содержащий в себе 4 массива
            let testWinKit: any[] = new TestKit(cell, this.scene.cells).createTestKit();

            let winLine = [];
            let count: number;
            let symbol: any = cell.value;
            if (this.scene.btnXWasPressed) {
                symbol == 1 ? (symbol = Images.CELL_X_HIGHLIGHTED) : (symbol = Images.CELL_ZERO_HIGHLIGHTED);
            }
            else if (this.scene.btnZeroWasPressed) {
                symbol == 0 ? (symbol = Images.CELL_X_HIGHLIGHTED) : (symbol = Images.CELL_ZERO_HIGHLIGHTED);
            }
            for (let i = 1; i < testWinKit.length; i++) {
                outer: while (testWinKit[i].length >= 5) {
                    winLine.length = 0;
                    count = 0;
                    for (let j = 0; j < 5; j++) {
                        if (
                            testWinKit[i][testWinKit[i].length - 1 - count].value === cell.value
                        ) {
                            winLine.push(testWinKit[i][testWinKit[i].length - 1 - count]);
                            count++;
                            if (count == 5) {
                                console.log("Ура! Победа");
                                this.isFinish = true;
                                while (winLine.length > 0) {
                                    this.scene.add
                                        .sprite(
                                            winLine[winLine.length - 1].x,
                                            winLine[winLine.length - 1].y,
                                            symbol
                                        )
                                        .setOrigin(0, 0);

                                    winLine.length--;
                                }
                                this.store.length = 0;
                                break outer;
                            }
                        }
                    }
                    testWinKit[i].pop();
                }
            }

            //====================================

            if (!this.isFinish && this.scene.btnXWasPressed && this.store.length > 0) {
                this.scene.GA.chooseFirstStepGA();
            } else this.scene.GA.chooseStepGA();

            if (this.isFinish) {
                if (this.scene.btnXWasPressed && symbol == Images.CELL_X_HIGHLIGHTED ||
                    this.scene.btnZeroWasPressed && symbol == Images.CELL_ZERO_HIGHLIGHTED) {
                    this.scene.btnXWasPressed = false;
                    this.scene.btnZeroWasPressed = false;
                    // this.scene.sounds.complete.play();

                } else if (this.scene.btnZeroWasPressed && symbol == Images.CELL_X_HIGHLIGHTED ||
                    this.scene.btnXWasPressed && symbol == Images.CELL_ZERO_HIGHLIGHTED) {
                    this.scene.btnXWasPressed = false;
                    this.scene.btnZeroWasPressed = false;
                    //this.scene.sounds.timeout.play();
                }
            }

        }
    }
    chooseFirstStepGA() {
        let correctionX: number = 0;
        let additiveX: number = 0;
        let correctionY: number = 0;
        let additiveY: number = 0;
        let indexPosition: number = 0;

        if (this.store.at(-1).x < this.scene.cells[0].x + 4 * Source.cellWidth) {
            correctionX = 1;
            additiveX = 1;
        } else if (
            this.store.at(-1).x >
            this.scene.cells.at(-1).x - 4 * Source.cellWidth
        ) {
            correctionX = -1;
            additiveX = 1;
        }
        if (
            this.store.at(-1).y <
            this.scene.cells[0].y + Math.ceil(Source.rows / 2) * Source.cellHeight
        ) {
            correctionY = 1;
        } else correctionY = -1;
        if (this.store.at(-1).y < this.scene.cells[0].y + 3 * Source.cellHeight) {
            additiveY = Source.cols;
        } else if (
            this.store.at(-1).y >
            this.scene.cells.at(-1).y - 3 * Source.cellWidth
        ) {
            additiveY = Source.cols;
        }

        if (this.store.length === 1 && !this.scene.btnZeroWasPressed) {
            indexPosition =
                this.store.at(-1).id +
                correctionY * (Source.cols + additiveY) +
                correctionX * (1 + additiveX);
            this.onCellClicked(this.scene.cells[indexPosition]);
        } else this.chooseStepGA();
    }

    chooseStepGA() {
        this.cellsFieldGA.length = 0;
        this.sampleGA.length = 0;
        this.cellsFieldR.length = 0;
        this.sampleR.length = 0;
        this.testKitLastMovesR.length = 0;
        this.testKitGA.length = 0;
        this.testKitR.length = 0;
        let maxAttackMadeMovesR: number = 0; // номер выбранной ячейки в массиве this.cellsR

        if (this.store.length > 1 && !this.isFinish) {

            //Собираем все свободные ячейки возможных ходов ИА для создания проверочных массивов в this.cellsFieldGA
            this.createCellsField(this.cellsGA, this.cellsFieldGA);
            //Для противника в cellsFieldR
            this.createCellsField(this.cellsR, this.cellsFieldR);

            //Создаем массивы testKit(в каждом: тестируемая ячейка и 4 массива - гориз., верт. и диагон-е)
            // для последнего хода и каждой ячейки cellsField(для сравнения с шаблонами)
            this.createTestKit(this.testKitLastMovesR, this.cellsR);
            this.createTestKit(this.testKitGA, this.cellsFieldGA);
            this.createTestKit(this.testKitR, this.cellsFieldR);

            // Определяем вес возможных ходов в атаке АИ.
            this.getWeightField(this.testKitLastMovesR, this.templX);
            this.getWeightField(this.testKitR, this.templX);
            this.getWeightField(this.testKitGA, this.templZero);

            //============== Массив (this.sampleGA) 'лучших' возможных ходов АИ === start =============
            this.getBestAttackGA();
            this.getBestAttackR();

            //====================== end ====================================================
            //============ Выбираем ячейку из this.cellsR с максимальным z =================
            this.maxAttackMadeMovesR = 0;
            let Max: number = 0;
            if (this.cellsR.length >= 2) {
                for (let i = 0; i < this.cellsR.length; i++) {
                    if (this.cellsR[i].z > Max) {
                        Max = this.cellsR[i].z;
                        maxAttackMadeMovesR = i;
                    }
                }
            }

            // 	//=============================== end =========================================
            if (
                this.cellsR.length &&
                this.sampleR.length &&
                maxAttackMadeMovesR >= 0
            ) {
                console.log(this.sampleGA[0].w + "  " + this.sampleGA[0].id);
                console.log(this.sampleR[0].z + "  " + this.sampleR[0].id);
                console.log(
                    this.cellsR[maxAttackMadeMovesR].z + " " + this.cellsR[maxAttackMadeMovesR].id
                );
            }
            console.log("=============== ");
            // =====Выбор хода ====== start ===========
            if (this.store.length > 1 && this.store.at(-1).value === 1) {
                if (maxAttackMadeMovesR >= 0) {
                    if (
                        this.sampleGA[0].w >= this.templX[2].attackWeight || // 5!
                        (this.sampleGA[0].w >=
                            this.templX[4].attackWeight +
                            this.templX[19].attackWeight && //закр.4 + откр.3
                            this.cellsR[maxAttackMadeMovesR].z <
                            (this.templX[4].protectionWeight || //закр.4
                                this.sampleR[0].z < this.templX[3].protectionWeight)) || //откр.4
                        (this.sampleGA[0].w >= this.templX[10].attackWeight && //откр.3
                            this.cellsR[maxAttackMadeMovesR].z <
                            this.templX[10].protectionWeight && // откр.3
                            this.sampleR[0].z <
                            this.templX[5].protectionWeight +
                            this.templX[10].protectionWeight) || //закр.4 + откр.3
                        this.cellsR[maxAttackMadeMovesR].z <=
                        this.templX[20].protectionWeight
                    ) {
                        console.log("атака");
                        this.onCellClicked(this.scene.cells[this.sampleGA[ /*0 */this.bestGA].id]);
                    } else {
                        console.log("защита");
                        this.onCellClicked(this.scene.cells[this.sampleR[0 /* this.bestR */].id]);
                    }
                }
            }
        }
    }

    getBestAttackGA() {
        let index: number = 0;
        let field: Cell[] = [];
        field = this.cellsFieldGA.slice();
        let max: any = 0;
        for (let i = 0; i < 3; i++) {
            max = 0;
            for (let j = 0; j < field.length; j++) {
                if (field[j].w > max) {
                    max = field[j].w;
                    index = j;
                }
            }
            this.sampleGA.push(field[index]);
            field.splice(index, 1);

        }
        this.bestGA = 0;
        max = 0;
        for (let i = 0; i < this.sampleGA.length; i++) {
            if (this.sampleGA.length && this.sampleGA[i].sum > max) {
                max = this.sampleGA[i].sum;
                this.bestGA = i;
            }
        }
    }

    getBestAttackR() {
        let index: number = 0;
        let field: Cell[] = [];
        field = this.cellsFieldR.slice();
        let max: any = 0;
        for (let i = 0; i < 3; i++) {
            max = 0;
            for (let j = 0; j < field.length; j++) {
                if (field[j].z > max) {
                    max = field[j].z;
                    index = j;
                }
            }
            this.sampleR.push(field[index]);
            field.splice(index, 1);

        }

        this.bestR = 0; // id выбранной ячейки
        max = 0;
        for (let i = 0; i < this.sampleR.length; i++) {
            if (this.sampleR.length > 0 && this.sampleR[i].z > max) {
                max = this.sampleR[i].z;

                this.bestR = i;
            }
        }
    }

    createCellsField(ARRAY: Cell[], FIELD: Cell[]) {
        //Собираем все ячейки возможных ходов для АИ и игрока в свой массив
        for (let i = 0; i < ARRAY.length; i++) {
            for (let j = 0; j < this.templX[1].arr.length; j++) {
                if (
                    this.scene.cells[ARRAY[i].id + this.templX[1].arr[j]] != null && // ячейка существует
                    this.scene.cells[ARRAY[i].id + this.templX[1].arr[j]].value == -1 && // ячейка свободна
                    Math.abs(
                        this.scene.cells[ARRAY[i].id + this.templX[1].arr[j]].x - ARRAY[i].x
                    ) <
                    3 * Source.cellWidth //ячейка не далее 2 длин своей ширины
                ) {
                    this.scene.cells[ARRAY[i].id + this.templX[1].arr[j]].value = 1; // обозначаем ее как занятую
                    FIELD.push(this.scene.cells[ARRAY[i].id + this.templX[1].arr[j]]); // отправляем в массив
                }
            }
        }
        FIELD.forEach((el: Cell) => {
            el.value = -1; // вновь обозначаем ячейки как свободные
        });
        return FIELD;
    }

    createTestKit(ARR: any[], FIELD: Cell[]) {
        for (let i = 0; i < FIELD.length; i++) {
            ARR[i] = new TestKit(FIELD[i], this.scene.cells).createTestKit();
        }
        return ARR;
    }

    getWeightField(TEST: any[], TEMPLATE: any[]) {
        let count: number = 0;
        let test: any[] = [];

        for (let i = 0; i < TEST.length; i++) {
            if (TEST === this.testKitGA) {
                TEST[i][0].value = 0;
                this.testKitGA[i][0].w = 0;
            } else if (TEST === this.testKitR) {
                TEST[i][0].value = 1;
                this.testKitR[i][0].z = 0;
            } else if (TEST === this.testKitLastMovesR) {
                this.testKitLastMovesR[i][0].z = 0;
            }
            outer: for (let j = 1; j < 5; j++) {
                // проходим по шаблонам
                for (let k = 2; k < TEMPLATE.length; k++) {
                    count = 0;
                    // выбираем тест из набора и создаем его копию
                    test = TEST[i][j].slice();
                    while (test.length >= TEMPLATE[k].arr.length) {
                        // проходим по тесту и шаблону с конца
                        if (
                            test[test.length - 1 - count].value ===
                            TEMPLATE[k].arr[TEMPLATE[k].arr.length - 1 - count]
                        ) {
                            count++;
                            if (count === TEMPLATE[k].arr.length) {
                                if (TEST === this.testKitGA) {
                                    this.testKitGA[i][0].w += TEMPLATE[k].attackWeight;
                                } else if (TEST === this.testKitR) {
                                    this.testKitR[i][0].z += TEMPLATE[k].protectionWeight;
                                } else if (TEST === this.testKitLastMovesR) {
                                    this.testKitLastMovesR[i][0].z +=
                                        TEMPLATE[k].protectionWeight;
                                }

                                continue outer;
                            }
                        } else {
                            test.pop();
                            count = 0;
                        }
                    }
                }
            }
            TEST[i][0].sum = TEST[i][0].w + TEST[i][0].z;
            if (TEST !== this.testKitLastMovesR) {
                TEST[i][0].value = -1;
            }
        }
    }
}


















