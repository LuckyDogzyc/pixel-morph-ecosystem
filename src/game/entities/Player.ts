import Phaser from 'phaser'
import { SPECIES_BY_ID } from '../data/species'
import type { SpeciesId } from '../data/species'
import { normalize } from '../utils/math'

type InputKeys = {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  dash: Phaser.Input.Keyboard.Key
}

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
  private keys?: InputKeys

  constructor(scene: Phaser.Scene, x: number, y: number, speciesId: SpeciesId) {
    super(scene, x, y, `species-${speciesId}`)
    this.speciesId = speciesId

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 0.5)
    this.setDepth(10)
    this.setCollideWorldBounds(true)

    this.applySpecies(speciesId)

    const keyboard = scene.input.keyboard
    if (keyboard) {
      this.keys = keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        dash: Phaser.Input.Keyboard.KeyCodes.SPACE,
      }) as InputKeys
    }
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

    this.anims.play(`${speciesId}-idle`, true)
  }

  startDash(targetX: number, targetY: number, now: number) {
    const dir = normalize(targetX - this.x, targetY - this.y)
    this.dashDirection = dir
    this.dashActive = true
    this.dashEndAt = now + this.dashDuration
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(dir.x * this.speed * this.dashMultiplier, dir.y * this.speed * this.dashMultiplier)

    this.anims.play(`${this.speciesId}-attack`, true)

    this.scene.tweens.add({
      targets: this,
      scale: 1.2,
      yoyo: true,
      duration: 120,
    })
  }

  update(now: number, mobileVector?: Phaser.Math.Vector2, mobileDash?: boolean) {
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

    const moveVector = this.getMoveVector(mobileVector)

    if (mobileDash || (this.keys && Phaser.Input.Keyboard.JustDown(this.keys.dash))) {
      this.tryDash(now, moveVector)
    }

    if (moveVector) {
      body.setVelocity(moveVector.x * this.speed, moveVector.y * this.speed)
    } else if (pointer.isDown && (pointer.buttons & 1) === 1) {
      const dir = normalize(pointer.worldX - this.x, pointer.worldY - this.y)
      body.setVelocity(dir.x * this.speed, dir.y * this.speed)
    } else {
      body.setVelocity(0, 0)
    }
  }

  animateTransform() {
    const key = `${this.speciesId}-transform`
    this.anims.play(key, true)
    this.once(`animationcomplete-${key}`, () => this.anims.play(`${this.speciesId}-idle`, true))

    this.scene.tweens.add({
      targets: this,
      scale: 1.4,
      yoyo: true,
      duration: 140,
    })
  }

  private getMoveVector(mobileVector?: Phaser.Math.Vector2) {
    if (mobileVector && mobileVector.length() > 0.01) {
      return mobileVector.clone().normalize()
    }

    if (this.keys) {
      const x = (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0)
      const y = (this.keys.down.isDown ? 1 : 0) - (this.keys.up.isDown ? 1 : 0)
      if (x !== 0 || y !== 0) {
        const dir = normalize(x, y)
        return new Phaser.Math.Vector2(dir.x, dir.y)
      }
    }

    return null
  }

  private tryDash(now: number, moveVector: Phaser.Math.Vector2 | null) {
    if (now - this.lastDashAt < this.dashCooldown) return

    let dir: Phaser.Math.Vector2 | null = null
    if (moveVector) {
      dir = moveVector.clone().normalize()
    } else {
      const pointer = this.scene.input.activePointer
      dir = new Phaser.Math.Vector2(pointer.worldX - this.x, pointer.worldY - this.y)
      if (dir.length() > 0.01) {
        dir.normalize()
      } else {
        dir = null
      }
    }

    if (!dir) return

    this.lastDashAt = now
    this.startDash(this.x + dir.x, this.y + dir.y, now)
  }

  animateHit() {
    this.setTint(0xff6666)
    this.scene.time.delayedCall(120, () => this.clearTint())
  }

  animateDeath() {
    const key = `${this.speciesId}-death`
    this.anims.play(key, true)
  }
}
