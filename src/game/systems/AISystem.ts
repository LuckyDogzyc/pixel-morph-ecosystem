import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { Creature } from '../entities/Creature'
import { canEat } from '../data/food-chain'
import type { SpeciesId } from '../data/species'
import { distance, normalize } from '../utils/math'

type Target = { x: number; y: number; distance: number }

type TargetSet = { predator: Target | null; prey: Target | null }

export class AISystem {
  private player: Player
  private creatures: Phaser.Physics.Arcade.Group
  private chaseRadius = 380
  private fearRadius = 320
  private npcSpeedMultiplier = 0.7

  constructor(_scene: Phaser.Scene, player: Player, creatures: Phaser.Physics.Arcade.Group) {
    this.player = player
    this.creatures = creatures
  }

  update(time: number) {
    const playerSpeed = this.player.speed
    this.creatures.getChildren().forEach((entity) => {
      const creature = entity as Creature
      if (!creature.alive) return

      const { predator, prey } = this.findTargets(creature)
      const body = creature.body as Phaser.Physics.Arcade.Body
      const maxSpeed = playerSpeed * 0.9
      const speed = Math.min(creature.baseSpeed * this.npcSpeedMultiplier, maxSpeed)

      if (predator && predator.distance < this.fearRadius) {
        const dir = normalize(creature.x - predator.x, creature.y - predator.y)
        body.setVelocity(dir.x * speed, dir.y * speed)
        creature.setRotation(Phaser.Math.Angle.Between(creature.x, creature.y, predator.x, predator.y))
        return
      }

      if (prey && prey.distance < this.chaseRadius) {
        const dir = normalize(prey.x - creature.x, prey.y - creature.y)
        body.setVelocity(dir.x * speed, dir.y * speed)
        creature.setRotation(Phaser.Math.Angle.Between(creature.x, creature.y, prey.x, prey.y))
        return
      }

      if (time > creature.wanderUntil) {
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
        creature.wanderDirection = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle))
        creature.wanderUntil = time + Phaser.Math.Between(800, 1600)
      }
      body.setVelocity(creature.wanderDirection.x * speed * 0.6, creature.wanderDirection.y * speed * 0.6)
    })
  }

  private findTargets(creature: Creature): TargetSet {
    let predator: Target | null = null
    let prey: Target | null = null

    const checkEntity = (x: number, y: number, speciesId: SpeciesId) => {
      const dist = distance(creature.x, creature.y, x, y)
      if (canEat(speciesId, creature.speciesId)) {
        if (!predator || dist < predator.distance) predator = { x, y, distance: dist }
      }
      if (canEat(creature.speciesId, speciesId)) {
        if (!prey || dist < prey.distance) prey = { x, y, distance: dist }
      }
    }

    checkEntity(this.player.x, this.player.y, this.player.speciesId)

    this.creatures.getChildren().forEach((entity) => {
      const other = entity as Creature
      if (other === creature || !other.alive) return
      checkEntity(other.x, other.y, other.speciesId)
    })

    return { predator, prey }
  }
}
