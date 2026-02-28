import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { CombatSystem } from '../systems/CombatSystem'

export class HUD {
  private scene: Phaser.Scene
  private player: Player
  private combat: CombatSystem
  private scoreText: Phaser.GameObjects.Text
  private hpText: Phaser.GameObjects.Text
  private dashText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, player: Player, combat: CombatSystem) {
    this.scene = scene
    this.player = player
    this.combat = combat

    this.scoreText = scene.add.text(16, 16, 'Score: 0', { fontSize: '16px', color: '#f2f2f2' }).setScrollFactor(0)
    this.hpText = scene.add.text(16, 38, '❤❤❤', { fontSize: '16px', color: '#ff6b6b' }).setScrollFactor(0)
    this.dashText = scene.add.text(16, 60, 'Dash: Ready', { fontSize: '14px', color: '#f2f2f2' }).setScrollFactor(0)

    combat.setGameOverHandler((scores) => {
      const lines = scores.map((s, idx) => `${idx + 1}. ${s.name} - ${s.score}`).join('\n')
      scene
        .add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, `Game Over\nScore: ${combat.score}\n\nLeaderboard\n${lines}\n\nClick to restart`, {
          fontSize: '20px',
          color: '#ffffff',
          align: 'center',
          backgroundColor: '#000000aa',
          padding: { x: 16, y: 12 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)

      scene.input.once('pointerdown', () => {
        scene.scene.restart()
      })
    })
  }

  update() {
    this.scoreText.setText(`Score: ${this.combat.score}`)
    this.hpText.setText('❤'.repeat(Math.max(0, this.player.hp)))

    const now = this.scene.time.now
    const remaining = Math.max(0, this.player.lastDashAt + this.player.dashCooldown - now)
    this.dashText.setText(remaining > 0 ? `Dash: ${(remaining / 1000).toFixed(1)}s` : 'Dash: Ready')
  }
}
