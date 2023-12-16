import { Images } from '../utils/const';
export default class SoundManager {
  scene: Phaser.Scene;
  isMusic: boolean = false;
  soundTreck: any;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  initSounds() {
    this.soundTreck = this.scene.sound.add(Images.THEME)
    this.playSoundTreck();
  }

  playSoundTreck() {
    if (!this.isMusic && localStorage.getItem('isSoundEnable') === 'true') {
      this.soundTreck.play({ volume: 0.1, loop: true });
      this.isMusic = true;
    }
  }

  stopSoundTreck() {
    this.soundTreck.stop();
    this.isMusic = false;
  }
}
