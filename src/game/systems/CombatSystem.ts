import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { Creature } from '../entities/Creature'
import { Food } from '../entities/Food'
import { canEat } from '../data/food-chain'
import { TransformSystem } from './TransformSystem'

export class CombatSystem {
  score = 0
  gameOver = false
  private scene: Phaser.Scene
  private player: Player
  private transformSystem = new TransformSystem()
  private onGameOver: ((scores: Array<{ name: string; score: number }>) => void) | null = null

  constructor(scene: Phaser.Scene, player: Player, creatures: Phaser.Physics.Arcade.Group, foods: Phaser.Physics.Arcade.Group) {
    this.scene = scene
    this.player = player

    scene.physics.add.overlap(player, foods, (_player, food) => {
      if (this.gameOver) return
      const f = food as Food
      this.transformSystem.transform(this.player, f)
      f.destroy()
    })

    scene.physics.add.overlap(player, creatures, (_player, creature) => {
      if (this.gameOver) return
      const target = creature as Creature
      if (!target.alive) return
      if (canEat(this.player.speciesId, target.speciesId)) {
        this.score += 10
        target.animateDeath(() => target.destroy())
        return
      }
      if (canEat(target.speciesId, this.player.speciesId)) {
        this.damagePlayer()
      }
    })

    scene.physics.add.overlap(creatures, creatures, (a, b) => {
      if (this.gameOver) return
      const c1 = a as Creature
      const c2 = b as Creature
      if (!c1.alive || !c2.alive) return
      if (canEat(c1.speciesId, c2.speciesId)) {
        c1.animateAttack()
        c2.animateDeath(() => c2.destroy())
      } else if (canEat(c2.speciesId, c1.speciesId)) {
        c2.animateAttack()
        c1.animateDeath(() => c1.destroy())
      }
    })
  }

  setGameOverHandler(handler: (scores: Array<{ name: string; score: number }>) => void) {
    this.onGameOver = handler
  }

  private damagePlayer() {
    const now = this.scene.time.now
    if (now < this.player.invulnerableUntil) return
    this.player.invulnerableUntil = now + 1000
    this.player.hp -= 1
    this.player.animateHit()
    if (this.player.hp <= 0) {
      this.triggerGameOver()
    }
  }

  private triggerGameOver() {
    this.gameOver = true
    this.scene.physics.pause()
    this.player.setTint(0x555555)

    const leaderboard = this.saveScore('Player', this.score)
    this.onGameOver?.(leaderboard)
  }

  private saveScore(name: string, score: number) {
    const key = 'pme-leaderboard'
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as Array<{ name: string; score: number }>
    existing.push({ name, score })
    existing.sort((a, b) => b.score - a.score)
    const top = existing.slice(0, 8)
    localStorage.setItem(key, JSON.stringify(top))
    return top
  }
}
