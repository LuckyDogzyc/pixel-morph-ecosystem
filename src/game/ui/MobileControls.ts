import Phaser from 'phaser'
import { clamp } from '../utils/math'

export class MobileControls {
  private enabled: boolean
  private base: Phaser.GameObjects.Arc
  private knob: Phaser.GameObjects.Arc
  private skillButton: Phaser.GameObjects.Arc
  private skillLabel: Phaser.GameObjects.Text
  private pointerId: number | null = null
  private moveVector = new Phaser.Math.Vector2(0, 0)
  private dashRequested = false
  private radius = 28

  constructor(scene: Phaser.Scene) {
    const os = scene.sys.game.device.os
    this.enabled = Boolean(os.android || os.iOS || os.iPad || os.iPhone)

    const width = scene.cameras.main.width
    const height = scene.cameras.main.height

    const baseX = 80
    const baseY = height - 80

    this.base = scene.add.circle(baseX, baseY, this.radius, 0x111827, 0.7).setScrollFactor(0)
    this.knob = scene.add.circle(baseX, baseY, 14, 0x93c5fd, 0.9).setScrollFactor(0)

    const buttonX = width - 80
    const buttonY = height - 70

    this.skillButton = scene.add.circle(buttonX, buttonY, 26, 0xf59e0b, 0.8).setScrollFactor(0)
    this.skillLabel = scene.add.text(buttonX, buttonY - 6, 'SKILL', { fontSize: '12px', color: '#111827' }).setOrigin(0.5).setScrollFactor(0)

    if (!this.enabled) {
      this.base.setVisible(false)
      this.knob.setVisible(false)
      this.skillButton.setVisible(false)
      this.skillLabel.setVisible(false)
      return
    }

    scene.input.addPointer(1)

    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.enabled) return

      if (this.isSkillPress(pointer)) {
        this.dashRequested = true
        return
      }

      if (this.pointerId === null && pointer.x < width * 0.5) {
        this.pointerId = pointer.id
        this.updateKnob(pointer)
      }
    })

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.enabled) return
      if (this.pointerId === pointer.id) {
        this.updateKnob(pointer)
      }
    })

    scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (!this.enabled) return
      if (this.pointerId === pointer.id) {
        this.pointerId = null
        this.moveVector.set(0, 0)
        this.knob.setPosition(this.base.x, this.base.y)
      }
    })
  }

  getMoveVector() {
    return this.moveVector.clone()
  }

  consumeDash() {
    if (!this.enabled) return false
    const requested = this.dashRequested
    this.dashRequested = false
    return requested
  }

  private isSkillPress(pointer: Phaser.Input.Pointer) {
    const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.skillButton.x, this.skillButton.y)
    return dist <= this.skillButton.radius
  }

  private updateKnob(pointer: Phaser.Input.Pointer) {
    const dx = pointer.x - this.base.x
    const dy = pointer.y - this.base.y
    const dist = Math.hypot(dx, dy)
    const clamped = clamp(dist, 0, this.radius)
    const angle = Math.atan2(dy, dx)

    const x = this.base.x + Math.cos(angle) * clamped
    const y = this.base.y + Math.sin(angle) * clamped
    this.knob.setPosition(x, y)

    if (dist > 0.01) {
      this.moveVector.set(Math.cos(angle) * (clamped / this.radius), Math.sin(angle) * (clamped / this.radius))
    } else {
      this.moveVector.set(0, 0)
    }
  }
}
