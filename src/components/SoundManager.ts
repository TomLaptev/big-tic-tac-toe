// import { StartScene } from '../scenes/StartScene';
// import { GameScene } from '../scenes/GameScene';
import { Images } from '../utils/const';
//import store from '../store';
export default class SoundManager {
  scene: Phaser.Scene;
  isMusic: boolean = false;
  //sounds: any;
  soundTreck: any;
  //isSoundsActive: boolean;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    //this.sounds.playSoundTreck = null;
  }

  initSounds() {
   // this.sounds = {}
      this.soundTreck = this.scene.sound.add(Images.THEME)
    
    this.playSoundTreck();
  }

  playSoundTreck() {
    if (!this.isMusic && localStorage.getItem('isSoundEnable') === 'true') { 
   this.soundTreck.play({ volume: 0.1, loop: true });
   this.isMusic = true;
}
   console.log(this.isMusic)
 }
  
 stopSoundTreck() {
  console.log('Hi333?')
  this.soundTreck.stop();
  this.isMusic = false;
  console.log(this.isMusic);

}

  

}
