import Phaser from 'phaser'
import { SPECIES_BY_ID } from '../data/species'
import type { SpeciesId } from '../data/species'
import { normalize } from '../utils/math'

export class Player extends Phaser.Physics.Arcade.Sprite {
  speciesId: SpeciesId
  speed = 0
  dashMultiplier = 1
  lastDashAt = -9999
  dashCooldown = 2000
  dashDuration = 200
  dashActive = false
  dashDirection = { x: 0, y: 0 }
  dashEndAt = 0
  score = 0
  hp = 3
  invulnerableUntil = 0

  constructor(scene: Phaser.Scene, x: number, y: number, speciesId: SpeciesId) {
    super(scene, x, y, `species-${speciesId}`)
    this.speciesId = speciesId

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 0.5)
    this.setDepth(10)
    this.setCollideWorldBounds(true)

    this.applySpecies(speciesId)

    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) return
      const now = scene.time.now
      if (now - this.lastDashAt < this.dashCooldown) return
      this.lastDashAt = now
      this.startDash(pointer.worldX, pointer.worldY, now)
    })
  }

  applySpecies(speciesId: SpeciesId) {
    const species = SPECIES_BY_ID[speciesId]
    this.speciesId = speciesId
    this.speed = species.speed
    this.dashMultiplier = species.dashMultiplier
    this.setTexture(`species-${speciesId}`)
    this.setDisplaySize(species.size, species.size)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(species.size, species.size)
  }

  startDash(targetX: number, targetY: number, now: number) {
    const dir = normalize(targetX - this.x, targetY - this.y)
    this.dashDirection = dir
    this.dashActive = true
    this.dashEndAt = now + this.dashDuration
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(dir.x * this.speed * this.dashMultiplier, dir.y * this.speed * this.dashMultiplier)

    this.scene.tweens.add({
      targets: this,
      scale: 1.2,
      yoyo: true,
      duration: 120,
    })
  }

  update(now: number) {
    const pointer = this.scene.input.activePointer
    const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY)
    this.setRotation(angle)

    const body = this.body as Phaser.Physics.Arcade.Body

    if (this.dashActive) {
      if (now > this.dashEndAt) {
        this.dashActive = false
      } else {
        body.setVelocity(this.dashDirection.x * this.speed * this.dashMultiplier, this.dashDirection.y * this.speed * this.dashMultiplier)
        return
      }
    }

    if (pointer.isDown && (pointer.buttons & 1) === 1) {
      const dir = normalize(pointer.worldX - this.x, pointer.worldY - this.y)
      body.setVelocity(dir.x * this.speed, dir.y * this.speed)
    } else {
      body.setVelocity(0, 0)
    }
  }

  animateTransform() {
    this.scene.tweens.add({
      targets: this,
      scale: 1.4,
      yoyo: true,
      duration: 140,
    })
  }

  animateHit() {
    this.setTint(0xff6666)
    this.scene.time.delayedCall(120, () => this.clearTint())
  }
}
