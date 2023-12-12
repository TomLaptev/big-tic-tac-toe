import Cell from '../components/Cell';
import Button from '../components/Button';
import { GameConfig, Source } from '../GameConfig';
import { Images } from '../utils/const';
import { default as storage } from '../store';
import Board from '../components/Board';
import GameAlgoritm from '../components/GA';

export class GameScene extends Phaser.Scene {
	BOARD: Board = null;
	GA: GameAlgoritm = null;
	cells: Cell[] = [];
	pointer: any;
	btnXWasPressed: boolean;
	btnZeroWasPressed: boolean;
	isRu: boolean;
	sounds: any;

	Timer: any;

	timeContainer: any;
	timeBar: any;
	timeMask: any;
	timeToMove: number;
	textForMove: any;
	n: number = 0;
	constructor() {
		super({
			key: 'Game',
		});
	}

	create(): void {
		this.createBackground();
		this.BOARD = new Board(this);
		this.BOARD.drawBoard();
		this.createPointer();
		this.btnXWasPressed = true;
		this.btnZeroWasPressed = false;
		this.GA = new GameAlgoritm(this)
		this.isRu = storage.language !== 'ru';
		this.createControl();
		this.createSounds();
		this.createTimeBar();
		this.createTimer();
		this.Start()
		
	}

	Start() {this.n++;
		console.log(this.n)
		let startTextX: string = !this.isRu ? 'Вы ходите первым' : 'You go first';
		let startTextZero: string = !this.isRu ? 'соперник ходит первым' : 'rival goes first';
		if (Math.floor(Math.random() * 2) == 0) {
			this.pressButtonZero();
			alert(startTextZero);
		 } else alert(startTextX);
		
	}

	createTimeBar() {
		console.log(777)
		console.log(this.GA.isRivalMove)
		console.log(this.GA.isYourMove)
		let textInString: string;
		
		if (!this.GA.store.length) {
			if (this.btnXWasPressed &&  !this.isRu) {
				textInString = '    Ваш ход';
			} else if (this.btnXWasPressed && this.isRu) {
				textInString = 'Your move'
			}
		}

		if (this.GA.isYourMove && !this.isRu) {
			textInString = '    Ваш ход';
		} else if (this.GA.isYourMove && this.isRu) {
			textInString = 'Your move'
		};

		if (this.GA.isRivalMove && !this.isRu) {
			textInString = 'Ход соперника';
		} else if (this.GA.isRivalMove && this.isRu) {
			textInString = "Rival's move";
		}

		this.timeToMove = Source.timeToMove;
		this.timeContainer = this.add.sprite(
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerX - 5 : this.cameras.main.centerX + 50),
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerY - 350 : this.cameras.main.centerY + 250),
			Images.TIMECONTAINER);
		this.timeBar = this.add.sprite(this.timeContainer.x + 35, this.timeContainer.y, Images.TIMEBAR);
		this.timeMask = this.add.sprite(this.timeBar.x, this.timeBar.y, Images.TIMEBAR);
		this.textForMove = this.add.text(this.timeBar.x - 120, this.timeBar.y - 20, textInString, {
			font: "32px Verdana",
			color: "#ffffff",
		}
		)

		this.timeMask.visible = false;
		this.timeBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.timeMask);
		//this.moveTimer.remove();
		
	}

	createTimer() {
		this.Timer = this.time.addEvent({
			delay: Source.delay,
			callback: function () {
				this.timeToMove--;

				let stepWidth = this.timeMask.displayWidth / Source.timeToMove
				this.timeMask.x -= stepWidth;
				console.log(this.timeToMove)
				if (this.timeToMove == -1 || this.GA.isFinish) {
					this.GA.isFinish = false;
					this.timeToMove = -1
					console.log(this.timeToMove)
					this.createEndSessionStart()
				} else if (this.timeToMove == -3) {
					this.createEndSessionEnd()
				}
			},
			callbackScope: this,
			paused: true,
			loop: true
		});
	}

	createEndSessionStart() { 
		this.textForMove.destroy();
		if (this.GA.isYourMove) {
			this.sounds.timeout.play()
		} else {
			this.sounds.complete.play()
		}
	}
	createEndSessionEnd() { 
		this.createTimeBar();
		if (this.GA.isYourMove) {
			alert('Вы продули!!!');
		} else {
			alert('Ура!! Вы победили!!!');
		}
		this.pressButtonX()
	}

	createBackground(): void {
		if (window.innerWidth > window.innerHeight) {
			this.add.sprite(0, 0, Images.BACKGROUND_H).setOrigin(0, 0);
		} else this.add.sprite(0, 0, Images.BACKGROUND_V).setOrigin(0, 0);
	}
	createSounds() {
		this.sounds = {
			complete: this.sound.add("complete"),
			timeout: this.sound.add("timeout"),
			card: this.sound.add("card"),
		};
	}

	createPointer() {
		this.pointer = this.add
			.sprite(
				(this.cells[0].x + this.cells.at(-1).x) / 2,
				(this.cells[0].y + this.cells.at(-1).y) / 2,
				Images.POINTER
			)
			.setOrigin(0, 0);

	}

	createControl() {
		if (window.innerWidth < window.innerHeight) {

			new Button(
				this,
				this.cameras.main.centerX - 130,
				this.cameras.main.centerY + 365,
				null, null, null,
				Images.LEFT,
				null, null, null,
				() => {
					if (this.pointer.x > this.cells[0].x && !this.GA.isFinish) {
						this.pointer.x -= Source.cellWidth;
					}
				}
			);

			new Button(
				this,
				this.cameras.main.centerX + 70,
				this.cameras.main.centerY + 365,
				null, null, null,
				Images.RIGHT,
				null, null, null,
				() => {
					if (this.pointer.x < this.cells.at(-1).x && !this.GA.isFinish) {
						this.pointer.x += Source.cellWidth;
					}
				}
			);

			new Button(
				this,
				this.cameras.main.centerX - 30,
				this.cameras.main.centerY + 325,
				null, null, null,
				Images.UP,
				null, null, null,
				() => {
					if (this.pointer.y > this.cells[0].y && !this.GA.isFinish) {
						this.pointer.y -= Source.cellHeight;
					}
				}
			);

			new Button(
				this,
				this.cameras.main.centerX - 30,
				this.cameras.main.centerY + 410,
				null, null, null,
				Images.DOWN,
				null, null, null,
				() => {
					if (this.pointer.y < this.cells.at(-1).y && !this.GA.isFinish) {
						this.pointer.y += Source.cellHeight;
					}
				}
			);

			new Button(
				this,
				this.cameras.main.centerX + 220,
				this.cameras.main.centerY + 365,
				null, null, null,
				Images.ENTER,
				null, null, null,
				() => {
					let pos =
						(Source.cols * (this.pointer.y - this.cells[0].y)) / Source.cellHeight +
						(this.pointer.x - this.cells[0].x) / Source.cellWidth;
					this.GA.onCellClicked(this.cells[pos]);
				}
			);
		}


		new Button(
			this,
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerX - 5 : this.cameras.main.centerX - 240),
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerY + 350 : this.cameras.main.centerY + 260),
			null, null, null,
			Images.BUTTON_HOME,
			null, null, null,
			() => {
				this.pressButtonX()
				
			}
		);
	}
	pressButtonX() {
		//this.scene.restart();
		this.GA.store.length = 0;
		this.GA.isFinish = false;
		this.btnXWasPressed = true;
		this.btnZeroWasPressed = false;
		this.cells.length = 0;
		this.scene.start("Start");
	}
	pressButtonZero() {
		let centralCell = Math.floor(this.cells.length / 2);
		this.GA.store.length = 0;
		this.GA.isFinish = false;
		this.cells.length = 0;
		this.btnZeroWasPressed = true;
		this.btnXWasPressed = false;
		this.BOARD.drawBoard();
		this.GA.onCellClicked(this.cells[centralCell]);
	}

}