import Phaser from 'phaser'
import type { SpeciesId } from '../data/species'

export class Food extends Phaser.Physics.Arcade.Sprite {
  speciesId: SpeciesId

  constructor(scene: Phaser.Scene, x: number, y: number, speciesId: SpeciesId) {
    super(scene, x, y, `food-${speciesId}`)
    this.speciesId = speciesId

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setImmovable(true)
    body.setAllowGravity(false)
    this.setOrigin(0.5, 0.5)
  }
}
