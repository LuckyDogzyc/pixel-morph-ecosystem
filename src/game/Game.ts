import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MainScene } from './scenes/MainScene'

export class Game extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game',
      width: 960,
      height: 540,
      backgroundColor: '#0b0d12',
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [BootScene, MainScene],
    }

    super(config)
  }
}
