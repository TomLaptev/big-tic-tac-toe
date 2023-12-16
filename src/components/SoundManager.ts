// import { StartScene } from '../scenes/StartScene';
// import { GameScene } from '../scenes/GameScene';
import { Images } from '../utils/const';
//import store from '../store';
export default class SoundManager {
	scene: Phaser.Scene;
	soundTrack: any;
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.soundTrack = this.scene.sound.add(Images.THEME);
		this.soundTrack.play({ volume: 0.1, loop: true });
	}
}
