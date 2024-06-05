import { Game as MainGame } from './scenes/Game';
import { Preload } from './scenes/Preload';

import { Game, Types } from 'phaser';
import { SCREEN_SIZE } from './screensize';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: SCREEN_SIZE.width,
    height: SCREEN_SIZE.height,
    parent: 'game-container',
    backgroundColor: '#44ADFA',
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {
                x: 0,
                y: 0,
            },
        },
    },
    scene: [Preload, MainGame],
};

export default new Game(config);
