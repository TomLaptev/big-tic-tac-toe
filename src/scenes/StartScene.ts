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
	langButton: Button;
	soundButton: Button;
	settingsButton: Button;
	winnersButton: Button;
	confirmButton: Button;
	messWindow: any;
	isMusicEnabled: boolean = localStorage.getItem('isSoundEnable') === 'true' ? true : false;
	constructor() {
		super({
			key: 'Start',
		});
	}

	create(): void {
		this.isRu = store.language === 'ru';
		this.createBackground();
		this.createNameGame();
		this.createMainMenu();
		if (this.isMusicEnabled) {
			this.game.sound.resumeAll();
		}
	}

	createBackground() {
		let Neptune: any;
		let board: any;
		if (window.innerWidth > window.innerHeight) {
			this.add.sprite(0, 0, Images.BACKGROUND_H).setOrigin(0, 0);
		} else this.add.sprite(0, 0, Images.BACKGROUND_V).setOrigin(0, 0);

		Neptune = this.add
			.sprite(this.cameras.main.centerX - 40, this.cameras.main.centerY - 200, Images.NEPTUNE)
			.setOrigin(0, 0);

		board = this.add
			.sprite(this.cameras.main.centerX - 160, this.cameras.main.centerY - 0, Images.BOARD)
			.setOrigin(0, 0);
		board.setScale(0.7);
	}

	createNameGame() {
		let title: string =
			window.innerWidth < window.innerHeight
				? '\n      Большие\n\n Крестики-нолики \n\n     у Нептуна'
				: '       \n\n Большие Крестики-нолики \n\n            у Нептуна';
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
			this.isRu ? title : '\n Big tic-tac-toe\n\n near Neptune',
			null
		);
	}

	createMainMenu() {
		this.winnersButton = new Button(
			this,
			this.cameras.main.centerX - 200,
			this.cameras.main.centerY + 300,
			null,
			null,
			null,
			Images.WINNERS,
			null,
			null,
			null,
			() => {}
		);

		this.playButton = new Button(
			this,
			this.cameras.main.centerX - 0,
			this.cameras.main.centerY + 300,
			null,
			null,
			null,
			Images.PLAY,
			null,
			null,
			null,
			() => {
				// this.SM.stopSoundTrack();
				//@ts-ignore
				window.ysdk.adv.showFullscreenAdv({
					callbacks: {
						onClose: () => {
							// if (!this.SM.isMusic && localStorage.getItem('isSoundEnable') === 'true') {
							// }
							this.scene.start('Game');
						},
						onOpen: () => {},
					},
				});
			}
		);

		this.settingsButton = new Button(
			this,
			this.cameras.main.centerX + 200,
			this.cameras.main.centerY + 300,
			null,
			null,
			null,
			Images.SETTINGS,
			null,
			null,
			null,
			() => {
				this.winnersButton.container.destroy();
				this.playButton.container.destroy();
				this.settingsButton.container.destroy();
				this.messWindow = this.add
					.sprite(
						this.cameras.main.centerX - 300,
						this.cameras.main.centerY - 240,
						Images.MESS
					)
					.setOrigin(0, 0)
					.setAlpha(0.8);
				this.createlangButton();
				this.createSoundButton();
				this.createConfirmButton();
			}
		);
	}

	createlangButton() {
		this.langButton = new Button(
			this,
			this.cameras.main.centerX - 210,
			this.cameras.main.centerY + 0,
			null,
			null,
			'#ffffff',
			Images.BUTTON_LANG,
			'NautilusPompilius',
			28,
			this.isRu ? '    Ru' : '   En',
			() => {
				if (store.language === 'eng') {
					store.language = 'ru';
					localStorage.setItem('lang', 'ru');
					this.isRu = true;
				} else {
					store.language = 'eng';
					localStorage.setItem('lang', 'eng');
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
		let data: string = localStorage.getItem('isSoundEnable');
		this.soundButton = new Button(
			this,
			this.cameras.main.centerX - 10,
			this.cameras.main.centerY + 0,
			null,
			null,
			'#ffffff',
			Images.BUTTON_SOUND,
			'Verdana',
			20,
			data === 'true' ? '' : '     X',
			() => {
				if (this.isMusicEnabled) {
					this.game.sound.pauseAll();
					localStorage.setItem('isSoundEnable', 'false');
				} else {
					this.game.sound.resumeAll();
					localStorage.setItem('isSoundEnable', 'true');
				}
				this.isMusicEnabled = !this.isMusicEnabled;
				this.soundButton.container.destroy();
				this.createSoundButton();
			}
		);
	}

	createConfirmButton() {
		this.confirmButton = new Button(
			this,
			this.cameras.main.centerX + 210,
			this.cameras.main.centerY + 0,
			null,
			null,
			null,
			Images.CONFIRM,
			null,
			null,
			null,
			() => {
				this.langButton.container.destroy();
				this.soundButton.container.destroy();
				this.confirmButton.container.destroy();
				this.messWindow.destroy();
				this.createMainMenu();
			}
		);
	}
}
