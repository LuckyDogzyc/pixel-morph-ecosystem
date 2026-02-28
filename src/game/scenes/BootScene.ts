import Phaser from 'phaser'
import { SPECIES } from '../data/species'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot')
  }

  create() {
    const graphics = this.add.graphics()
    graphics.setVisible(false)

    SPECIES.forEach((species) => {
      const speciesSize = Math.round(species.size)
      const foodSize = Math.max(6, Math.round(species.size * 0.5))

      graphics.clear()
      graphics.fillStyle(species.color, 1)
      graphics.fillRect(0, 0, speciesSize, speciesSize)
      graphics.generateTexture(`species-${species.id}`, speciesSize, speciesSize)

      graphics.clear()
      graphics.fillStyle(species.color, 1)
      graphics.fillRect(0, 0, foodSize, foodSize)
      graphics.generateTexture(`food-${species.id}`, foodSize, foodSize)
    })

    graphics.destroy()
    this.scene.start('main')
  }
}
