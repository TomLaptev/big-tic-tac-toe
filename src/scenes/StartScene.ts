import { GameConfig, Source } from '../GameConfig';
import Button from '../components/Button';
import { Images } from '../utils/const';
import store from '../store';

export class StartScene extends Phaser.Scene {
	topOpenButton: Button;
	lowerOpenButton: Button;
	topHiddenButton: Button;
	lowerHiddenButton: Button;
	topTitle: Button;
	backButton: Button;
	playButton: Button;
	isRu: boolean;
	isSound: boolean;
	isChoosedButton: boolean;
	langButton: Button;
	soundButton: Button;
	sounds: any;
	isMusic: boolean;
	GAMES: any;
	constructor() {
		super({
			key: 'Start',
		});
	}


	create(): void {
		this.isRu = store.language === 'ru';
		this.isSound = store.sound === 'x';
		this.createBackground();
		this.createNameGame();
		this.createMainMenu();
		if (!this.isMusic) {
			this.createSounds();
		}


	};

	createBackground() {
		let Neptune: any;
		let board: any;
		if (window.innerWidth > window.innerHeight) {
			this.add.sprite(0, 0, Images.BACKGROUND_H).setOrigin(0, 0);
		} else this.add.sprite(0, 0, Images.BACKGROUND_V).setOrigin(0, 0);

		Neptune = this.add
			.sprite(
				this.cameras.main.centerX - 40,
				this.cameras.main.centerY - 200,
				Images.NEPTUNE
			)
			.setOrigin(0, 0);

		board = this.add
			.sprite(
				this.cameras.main.centerX - 160,
				this.cameras.main.centerY - 0,
				Images.BOARD
			)
			.setOrigin(0, 0);
		board.setScale(0.7);

	}

	createNameGame() {
		this.topTitle = new Button(
			this,
			this.cameras.main.centerX + 10,
			this.cameras.main.centerY - 360,
			null,
			null,
			'#0000ff',
			null,
			'TOYZ',
			46,
			this.isRu ? '       Большие\n\n Крестики-нолики \n\n     у Нептуна' : '\n Big tic-tac-toe\n\n near Neptune',
			null
		);
	}



	createSounds() {
		this.sounds = {
			theme: this.sound.add("theme"),
		};
		this.playTheme();
	}

	playTheme() {
		if (this.isSound && !this.isMusic) {
			this.sounds.theme.play({ volume: 0.1, loop: true });
			this.isMusic = true;
		}
	}
	stopTheme() {
		this.sounds.theme.stop();
		this.isMusic = false;

	}

	createMainMenu() {
		let winnersButton: Button;
		let settingsButton: Button;
		let playButton: Button;

		winnersButton = new Button(
			this,
			this.cameras.main.centerX - 200,
			this.cameras.main.centerY + 300,
			null, null, null,
			Images.WINNERS,
			null, null, null,
			() => {
				//this.startWinnerScene()
			}
		);


		playButton = new Button(
			this,
			this.cameras.main.centerX - 0,
			this.cameras.main.centerY + 300,
			null, null, null,
			Images.PLAY,
			null, null, null,
			() => {
				//@ts-ignore
				window.ysdk.adv.showFullscreenAdv(
					{
						callbacks: {
							onClose: (() => {
								if (!this.isMusic) {
									this.playTheme();
								}
								this.startGameScene();
							}),
							onOpen: (() => {
								this.stopTheme();
							})
						}
					}
				);


			}
		);

		settingsButton = new Button(
			this,
			this.cameras.main.centerX + 220,
			this.cameras.main.centerY + 300,
			null, null, null,
			Images.SETTINGS,
			null, null, null,
			() => {
				winnersButton.container.destroy();
				playButton.container.destroy();
				settingsButton.container.destroy()
				this.createlangButton();
				this.createSoundButton();
				this.createConfirmButton()
			}
		);

	}


	createlangButton() {
		this.langButton = new Button(
			this,
			this.cameras.main.centerX - 200,
			this.cameras.main.centerY + 300,
			null,
			null,
			'#ffffff',
			Images.BUTTON_LANG,
			'NautilusPompilius',
			28,
			this.isRu ? '    Ru' : '   En',
			() => {
				if (store.language === 'eng') {
					store.language = 'ru'
					localStorage.setItem('lang', 'ru')
					this.isRu = true;
				} else {
					store.language = 'eng'
					localStorage.setItem('lang', 'eng')
					this.isRu = false;
				}
				this.langButton.container.destroy();
				this.topTitle.container.destroy();
				this.createlangButton();
				this.createNameGame();

			}
		);
	}
	createSoundButton() {

		let data: string = localStorage.getItem('sound');
		this.isSound = data === 'x';
		this.soundButton = new Button(
			this,
			this.cameras.main.centerX - 0,
			this.cameras.main.centerY + 300,
			null,
			null,
			'#ffffff',
			Images.BUTTON_SOUND,
			'Verdana',
			20,
			data ? '' : '     X',
			() => {
				if (data === 'x') {
					localStorage.setItem('sound', '');
					this.stopTheme();
				} else {
					localStorage.setItem('sound', 'x');
					this.playTheme();
				}
				this.soundButton.container.destroy();
				this.createSoundButton();
				//
				this.createSounds();
			}
		);
	}

	createConfirmButton() {
		let checkButton: Button;
		checkButton = new Button(
			this,
			this.cameras.main.centerX + 220,
			this.cameras.main.centerY + 300,
			null, null, null,
			Images.CONFIRM,
			null, null, null,
			() => {
				this.returnStart();
			}
		)
	}

	startGameScene() {
		//this.scene.sleep("UIScene");
		this.scene.start("Start");
		this.scene.start("Game");
	}

	returnStart() {
		//this.scene.sleep("UIScene");
		this.scene.start("Start");
	}
}