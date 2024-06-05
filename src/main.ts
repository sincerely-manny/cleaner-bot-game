import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 375,
    height: 812,
    parent: 'game-container',
    backgroundColor: '#44ADFA',
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Boot, Preloader],
};

export default new Game(config);
