import Phaser from 'phaser'
import { Creature } from '../entities/Creature'
import { Food } from '../entities/Food'
import { SPECIES } from '../data/species'
import type { SpeciesId } from '../data/species'

export class SpawnSystem {
  private scene: Phaser.Scene
  private creatures: Phaser.Physics.Arcade.Group
  private foods: Phaser.Physics.Arcade.Group
  private lastFoodAt = 0
  private lastCreatureAt = 0
  private foodInterval = 1200
  private creatureInterval = 2000
  private maxFood = 40
  private maxCreatures = 18
  private worldWidth: number
  private worldHeight: number

  constructor(
    scene: Phaser.Scene,
    creatures: Phaser.Physics.Arcade.Group,
    foods: Phaser.Physics.Arcade.Group,
    worldWidth: number,
    worldHeight: number,
  ) {
    this.scene = scene
    this.creatures = creatures
    this.foods = foods
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight
  }

  update(time: number) {
    if (this.foods.countActive(true) < this.maxFood && time - this.lastFoodAt > this.foodInterval) {
      this.lastFoodAt = time
      this.spawnFood()
    }

    if (this.creatures.countActive(true) < this.maxCreatures && time - this.lastCreatureAt > this.creatureInterval) {
      this.lastCreatureAt = time
      this.spawnCreature()
    }
  }

  private randomPosition() {
    return {
      x: Phaser.Math.Between(80, this.worldWidth - 80),
      y: Phaser.Math.Between(80, this.worldHeight - 80),
    }
  }

  private spawnFood() {
    const species = Phaser.Utils.Array.GetRandom(SPECIES)
    const pos = this.randomPosition()
    const food = new Food(this.scene, pos.x, pos.y, species.id)
    this.foods.add(food)
  }

  private spawnCreature() {
    const species = Phaser.Utils.Array.GetRandom(SPECIES)
    const pos = this.randomPosition()
    const creature = new Creature(this.scene, pos.x, pos.y, species.id as SpeciesId)
    this.creatures.add(creature)
  }
}
