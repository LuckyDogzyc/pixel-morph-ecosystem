import Phaser from 'phaser'
import type { SpeciesId } from '../data/species'

export class Food extends Phaser.Physics.Arcade.Sprite {
  speciesId: SpeciesId

  constructor(scene: Phaser.Scene, x: number, y: number, speciesId: SpeciesId) {
    super(scene, x, y, `card-${speciesId}`)
    this.speciesId = speciesId

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setImmovable(true)
    body.setAllowGravity(false)
    this.setOrigin(0.5, 0.5)
    this.setDisplaySize(16, 24)
    body.setSize(16, 24)

    this.setAngle(-8)
    scene.tweens.add({
      targets: this,
      angle: 8,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }
}
