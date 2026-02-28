import { Player } from '../entities/Player'
import { Food } from '../entities/Food'

export class TransformSystem {
  transform(player: Player, food: Food) {
    player.applySpecies(food.speciesId)
    player.animateTransform()
  }
}
