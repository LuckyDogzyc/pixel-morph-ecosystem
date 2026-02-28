import Phaser from 'phaser'
import { SPECIES_BY_ID } from '../data/species'
import type { SpeciesId } from '../data/species'

export class Creature extends Phaser.Physics.Arcade.Sprite {
  speciesId: SpeciesId
  baseSpeed: number
  alive = true
  wanderDirection = new Phaser.Math.Vector2(1, 0)
  wanderUntil = 0

  constructor(scene: Phaser.Scene, x: number, y: number, speciesId: SpeciesId) {
    super(scene, x, y, `species-${speciesId}`)
    this.speciesId = speciesId

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 0.5)
    this.setCollideWorldBounds(true)

    const species = SPECIES_BY_ID[speciesId]
    this.baseSpeed = species.speed
    this.setDisplaySize(species.size, species.size)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(species.size, species.size)
  }

  setSpeed(speed: number) {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(body.velocity.x, body.velocity.y)
    this.baseSpeed = speed
  }

  animateAttack() {
    this.scene.tweens.add({
      targets: this,
      scale: 1.15,
      yoyo: true,
      duration: 120,
    })
  }

  animateDeath(onComplete: () => void) {
    this.alive = false
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0.1,
      duration: 300,
      onComplete,
    })
  }
}
