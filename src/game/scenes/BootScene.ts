import Phaser from 'phaser'
import { SPECIES } from '../data/species'

const FRAME_SIZE = 24

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot')
  }

  preload() {
    SPECIES.forEach((species) => {
      this.load.spritesheet(`species-${species.id}`, `/assets/sprites/${species.id}.png`, {
        frameWidth: FRAME_SIZE,
        frameHeight: FRAME_SIZE,
      })
      this.load.image(`card-${species.id}`, `/assets/cards/${species.id}.png`)
    })

    this.load.image('world-tiles', '/assets/tilesets/world.png')
    this.load.tilemapTiledJSON('world-map', '/assets/tilemaps/world.json')
  }

  create() {
    SPECIES.forEach((species) => {
      const id = species.id

      this.anims.create({
        key: `${id}-idle`,
        frames: this.anims.generateFrameNumbers(`species-${id}`, { frames: [0, 1] }),
        frameRate: 3,
        repeat: -1,
      })

      this.anims.create({
        key: `${id}-attack`,
        frames: this.anims.generateFrameNumbers(`species-${id}`, { frames: [2, 0] }),
        frameRate: 10,
        repeat: 0,
      })

      this.anims.create({
        key: `${id}-transform`,
        frames: this.anims.generateFrameNumbers(`species-${id}`, { frames: [3, 0] }),
        frameRate: 10,
        repeat: 0,
      })

      this.anims.create({
        key: `${id}-death`,
        frames: this.anims.generateFrameNumbers(`species-${id}`, { frames: [4, 5] }),
        frameRate: 8,
        repeat: 0,
      })
    })

    this.scene.start('main')
  }
}
