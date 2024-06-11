import { Scene } from 'phaser';

export class Preload extends Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');
        this.load.svg('ground', 'ground.svg');
        this.load.svg('horizon', 'horizon.svg');
        this.load.svg('meteor', 'meteor.svg');
        this.load.spritesheet('character', 'char.svg', {
            frameWidth: 200,
            frameHeight: 200,
        });
        this.load.svg('puddle', 'puddle.svg');
        this.load.svg('coin', 'coin.svg');
    }

    create() {
        this.scene.start('Game');
    }
}
