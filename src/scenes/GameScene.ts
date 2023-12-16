import Cell from '../components/Cell';
import Button from '../components/Button';
import { GameConfig, Source } from '../GameConfig';
import { Images } from '../utils/const';
import { default as storage } from '../store';
import Board from '../components/Board';
import GameAlgoritm from '../components/GA';
import SoundManager from '../components/SoundManager';

export class GameScene extends Phaser.Scene {
	BOARD: Board = null;
	GA: GameAlgoritm = null;
	SM: SoundManager;
	cells: Cell[] = [];
	pointer: any;
	btnXWasPressed: boolean;
	btnZeroWasPressed: boolean;
	isRu: boolean;
	sounds: any;
	turnMove: boolean;
	isConfirmStart: boolean = false;
	starsCount: any = localStorage.setItem('stars', '5');
	Timer: any;

	timeContainer: any;
	timeBar: any;
	timeMask: any;
	timeToMove: number;
	textForMove: any;
	textInTimeBar: string;
	isGameSceneBuilded: boolean;

	constructor() {
		super({
			key: 'Game',
		});
	}

	create(): void {
		this.isGameSceneBuilded = false;
		this.createBackground();
		this.BOARD = new Board(this);
		this.btnXWasPressed = true;
		this.btnZeroWasPressed = false;
		this.isConfirmStart = false;
		this.GA = new GameAlgoritm(this)
		this.isRu = storage.language !== 'ru';
		this.textInTimeBar = '';
		this.turnMove = Math.floor(Math.random() * 2) == 0;
		this.starsCount = localStorage.getItem('stars');
		this.createControl();
		this.createSounds();
		this.createTimeBar();
		this.createTimer();
		this.starsCount > 0 ? this.Start() : this.getStars();
		this.SM = new SoundManager(this);
		this.SM.initSounds();

	}

	getStars() {
		let mess: any = this.add.sprite(this.cameras.main.centerX - 300,
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerY - 240 : this.cameras.main.centerY - 300),
			Images.MESS).setOrigin(0, 0)
			.setAlpha(0.8);
		let getStarsText: string = !this.isRu ? '  Для продолжения\n\nигры вам необходимо\n\n  получить 5 звезд'
			: '    To continue\n\n the game you need\n\n   to get 5 stars';

		new Button(
			this,
			this.cameras.main.centerX + 10,
			mess.y + 150,
			null,
			null,
			'#ffffff',
			null,
			'TOYZ',
			40,
			getStarsText,
			null
		);

		let confirmGetStars: Button = new Button(
			this,
			this.cameras.main.centerX + 0,
			mess.y + 350,
			null, null, null,
			Images.CONFIRM,
			null, null, null,
			() => {
				//@ts-ignore
				window.ysdk.adv.showRewardedVideo({
					callbacks: {
						onOpen: () => {
							this.SM.stopSoundTreck();
							console.log('Video ad open.');
						},
						onRewarded: () => {
							this.starsCount = 5;
							localStorage.setItem('stars', ` ${this.starsCount}`)

							console.log('Rewarded!');
						},
						onClose: () => {
							this.scene.restart();
							console.log('Video ad closed.');
						},
						onError: (e: any) => {
							console.log('Error while open video ad:', e);
						}
					}
				})
			}
		)

	}

	Start() {
		let mess: any = this.add.sprite(this.cameras.main.centerX - 300,
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerY - 240 : this.cameras.main.centerY - 300),
			Images.MESS).setOrigin(0, 0)
			.setAlpha(0.8);

		let startTextX: string = !this.isRu ? 'Вы ходите первым' : 'You go first';
		let startTextZero: string = !this.isRu ? '    соперник \n\nходит первым' : 'rival goes first';

		let confirmStart: Button = new Button(
			this,
			this.cameras.main.centerX + 0,
			mess.y + 300,
			null, null, null,
			Images.CONFIRM,
			null, null, null,
			() => {
				this.starsCount--;
				localStorage.setItem('stars', ` ${this.starsCount}`)
				this.isConfirmStart = true;
				this.BOARD.drawBoard();
				this.createPointer();

				if (this.turnMove) {
					this.pressButtonZero(); 
					//---------- Для игры с ботом -------------------
					if (this.GA.store.length === 0) {
					 this.GA.onCellClicked(this.cells[112]);
						!this.isRu ? this.textInTimeBar = '    Ваш ход' : this.textInTimeBar = 'Your move';
						this.createTimeBar();
					} else
					//----------------------------------------------
					{
						!this.isRu ? this.textInTimeBar = 'Ход соперника' : this.textInTimeBar = "Rival's move";
						this.createTimeBar();
					}



				} else {
					!this.isRu ? this.textInTimeBar = '    Ваш ход' : this.textInTimeBar = 'Your move';
					this.createTimeBar();
					this.Timer.paused = false;
				}
				this.isGameSceneBuilded = true;


			}
		)

		let textTurneMove: Button = new Button(
			this,
			this.cameras.main.centerX + 10,
			mess.y + 150,
			null,
			null,
			'#ffffff',
			null,
			'TOYZ',
			46,
			this.turnMove ? startTextZero : startTextX,
			null
		);

		for (let i = 0; i < this.starsCount; i++) {
			this.add.sprite(
				this.timeContainer.x - 60 + i * 50,
				this.timeContainer.y,
				Images.STAR)

		}

	}

	createTimeBar() {
		if (!this.GA.store.length && !this.isConfirmStart) {
			this.textInTimeBar = ''

		}

		if (this.isGameSceneBuilded && this.GA.isYourMove && !this.isRu) {
			this.textInTimeBar = '    Ваш ход';
		} else if (this.isGameSceneBuilded && this.GA.isYourMove && this.isRu) {
			this.textInTimeBar = 'Your move'
		};

		if (this.isGameSceneBuilded && this.GA.isRivalMove && !this.isRu) {
			this.textInTimeBar = 'Ход соперника';
		} else if (this.isGameSceneBuilded && this.GA.isRivalMove && this.isRu) {
			this.textInTimeBar = "Rival's move";
		}

		this.GA.isFinish ? this.textInTimeBar = '' : 1;

		this.timeToMove = Source.timeToMove;
		this.timeContainer = this.add.sprite(
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerX - 5 : this.cameras.main.centerX + 50),
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerY - 350 : this.cameras.main.centerY + 250),
			Images.TIMECONTAINER);
		this.timeBar = this.add.sprite(this.timeContainer.x + 35, this.timeContainer.y, Images.TIMEBAR);
		this.timeMask = this.add.sprite(this.timeBar.x, this.timeBar.y, Images.TIMEBAR);
		this.textForMove = this.add.text(this.timeBar.x - 120, this.timeBar.y - 20, this.textInTimeBar, {
			font: "32px Verdana",
			color: "#ffffff",
		}
		)

		this.timeMask.visible = false;
		this.timeBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.timeMask);
		
	}

	createTimer() {
		this.Timer = this.time.addEvent({
			delay: Source.delay,
			callback: function () {
				this.timeToMove--;
				
				let stepWidth = this.timeMask.displayWidth / Source.timeToMove
				this.timeMask.x -= stepWidth;
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
		this.GA.isFinish = true;
		this.createTimeBar();
		this.Timer.destroy();

		let mess: any = this.add.sprite(this.cameras.main.centerX - 300,
			(window.innerWidth > window.innerHeight ? this.cameras.main.centerY - 240 : this.cameras.main.centerY - 300),
			Images.MESS).setOrigin(0, 0)
			.setAlpha(0.8);
		let finishTextX: string = !this.isRu ? ' Поздравляем!!! \n\n   Вы победили' : 'Congratulations!!! \n\n       You won';
		let finishTextZero: string = !this.isRu ? '     Сожалеем,\n\n Победил соперник' : "  We're sorry,\n\n The rival won";

		let confirmFinish: Button = new Button(
			this,
			this.cameras.main.centerX + 0,
			mess.y + 300,
			null, null, null,
			Images.CONFIRM,
			null, null, null,
			() => {
				this.SM.stopSoundTreck();
				this.pressButtonX();
				//this.scene.restart();
				this.scene.start("Start");
			}
		)

		let textFinish: Button = new Button(
			this,
			this.cameras.main.centerX + 10,
			mess.y + 150,
			null,
			null,
			'#ffffff',
			null,
			'TOYZ',
			46,
			this.GA.isYourMove ? finishTextZero : finishTextX,
			null
		);
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
					if (this.isGameSceneBuilded && this.pointer.x > this.cells[0].x && !this.GA.isFinish) {
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
					if (this.isGameSceneBuilded && this.pointer.x < this.cells.at(-1).x && !this.GA.isFinish) {
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
					if (this.isGameSceneBuilded && this.pointer.y > this.cells[0].y && !this.GA.isFinish) {
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
					if (this.isGameSceneBuilded && this.pointer.y < this.cells.at(-1).y && !this.GA.isFinish) {
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
					if (this.isGameSceneBuilded) {
						let pos =
							(Source.cols * (this.pointer.y - this.cells[0].y)) / Source.cellHeight +
							(this.pointer.x - this.cells[0].x) / Source.cellWidth;
						this.GA.onCellClicked(this.cells[pos]);
					}

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
				this.SM.stopSoundTreck();
				this.isGameSceneBuilded = false;
				this.pressButtonX();
				//this.scene.restart();
				this.scene.start("Start");

			}
		);

	}
	pressButtonX() {
		this.GA.store.length = 0;
		this.GA.isFinish = false;
		this.btnXWasPressed = true;
		this.btnZeroWasPressed = false;
		this.cells.length = 0;
	}
	pressButtonZero() {
		//let centralCell = Math.floor(this.cells.length / 2);
		this.GA.store.length = 0;
		this.GA.isFinish = false;
		this.cells.length = 0;
		this.btnZeroWasPressed = true;
		this.btnXWasPressed = false;
		this.BOARD.drawBoard();
		//this.GA.onCellClicked(this.cells[centralCell]);
	}

}