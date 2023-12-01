import { GameScene } from '../scenes/GameScene';
export default class Cell extends Phaser.GameObjects.Sprite {
	id: number;
	value: number;
	sum: number = 0;
	scene: GameScene;
    onClick: (cell: Cell) => void;
	constructor(scene: GameScene, 
		position: { x: number, y: number }, 
		texture: string, 
		id: number,
		onClick: (cell: Cell) => void
		) {
		super(scene, position.x, position.y, texture);
		this.id = id;
		this.scene = scene;
		this.onClick = onClick;

		this.scene.add.existing(this);
		this.setInteractive({ cursor: 'pointer' });
		this.setOrigin(0, 0);
		this.on('clickCell', this.onClick.bind(this), this);
	}
}
