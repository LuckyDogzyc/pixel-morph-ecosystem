import Phaser from 'phaser'
import { Creature } from '../entities/Creature'
import { Food } from '../entities/Food'
import { SPECIES, SPECIES_BY_ID } from '../data/species'
import type { SpeciesId } from '../data/species'
import type { MapData } from './MapGenerator'
import { pickSpeciesForBiome } from '../data/biomes'

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
  private viewPadding = 120
  private map: MapData

  constructor(
    scene: Phaser.Scene,
    creatures: Phaser.Physics.Arcade.Group,
    foods: Phaser.Physics.Arcade.Group,
    map: MapData,
  ) {
    this.scene = scene
    this.creatures = creatures
    this.foods = foods
    this.map = map
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

  private randomPositionOutsideView(canSwim: boolean) {
    const view = this.scene.cameras.main.worldView
    const padded = new Phaser.Geom.Rectangle(
      view.x - this.viewPadding,
      view.y - this.viewPadding,
      view.width + this.viewPadding * 2,
      view.height + this.viewPadding * 2,
    )

    const maxX = this.map.width * this.map.tileSize
    const maxY = this.map.height * this.map.tileSize

    for (let attempt = 0; attempt < 40; attempt += 1) {
      const x = Phaser.Math.Between(40, maxX - 40)
      const y = Phaser.Math.Between(40, maxY - 40)
      if (Phaser.Geom.Rectangle.Contains(padded, x, y)) continue
      if (this.map.isBlockedAtWorld(x, y, canSwim)) continue
      return { x, y }
    }

    return {
      x: Phaser.Math.Between(40, maxX - 40),
      y: Phaser.Math.Between(40, maxY - 40),
    }
  }

  private spawnFood() {
    const biomeId = this.map.getBiomeAtWorld(this.scene.cameras.main.worldView.centerX, this.scene.cameras.main.worldView.centerY)
    const speciesId = pickSpeciesForBiome(biomeId) ?? Phaser.Utils.Array.GetRandom(SPECIES).id
    const species = SPECIES_BY_ID[speciesId]
    const pos = this.randomPositionOutsideView(!!species.canSwim)
    const food = new Food(this.scene, pos.x, pos.y, species.id)
    this.foods.add(food)
  }

  private spawnCreature() {
    const biomeId = this.map.getBiomeAtWorld(this.scene.cameras.main.worldView.centerX, this.scene.cameras.main.worldView.centerY)
    const speciesId = pickSpeciesForBiome(biomeId) ?? Phaser.Utils.Array.GetRandom(SPECIES).id
    const species = SPECIES_BY_ID[speciesId]
    const pos = this.randomPositionOutsideView(!!species.canSwim)
    const creature = new Creature(this.scene, pos.x, pos.y, species.id as SpeciesId)
    this.creatures.add(creature)
  }
}
