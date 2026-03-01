import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { SPECIES } from '../data/species'
import { SpawnSystem } from '../systems/SpawnSystem'
import { AISystem } from '../systems/AISystem'
import { CombatSystem } from '../systems/CombatSystem'
import { HUD } from '../ui/HUD'
import { MobileControls } from '../ui/MobileControls'

export class MainScene extends Phaser.Scene {
  private player!: Player
  private creatures!: Phaser.Physics.Arcade.Group
  private foods!: Phaser.Physics.Arcade.Group
  private spawnSystem!: SpawnSystem
  private aiSystem!: AISystem
  private combatSystem!: CombatSystem
  private hud!: HUD
  private mobileControls?: MobileControls
  private worldWidth = 2000
  private worldHeight = 1400

  constructor() {
    super('main')
  }

  create() {
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    const startSpecies = SPECIES[0].id
    this.player = new Player(this, this.worldWidth / 2, this.worldHeight / 2, startSpecies)

    this.creatures = this.physics.add.group()
    this.foods = this.physics.add.group()

    this.spawnSystem = new SpawnSystem(this, this.creatures, this.foods, this.worldWidth, this.worldHeight)
    this.aiSystem = new AISystem(this, this.player, this.creatures)
    this.combatSystem = new CombatSystem(this, this.player, this.creatures, this.foods)
    this.hud = new HUD(this, this.player, this.combatSystem)
    this.mobileControls = new MobileControls(this)

    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)

    this.createBackground()
  }

  update(time: number) {
    if (!this.combatSystem.gameOver) {
      const mobileVector = this.mobileControls?.getMoveVector()
      const mobileDash = this.mobileControls?.consumeDash()
      this.player.update(time, mobileVector, mobileDash)
      this.aiSystem.update(time)
      this.spawnSystem.update(time)
    }
    this.hud.update()
  }

  private createBackground() {
    const grid = this.add.graphics()
    grid.lineStyle(1, 0x1d2230, 0.6)
    const size = 80
    for (let x = 0; x <= this.worldWidth; x += size) {
      grid.lineBetween(x, 0, x, this.worldHeight)
    }
    for (let y = 0; y <= this.worldHeight; y += size) {
      grid.lineBetween(0, y, this.worldWidth, y)
    }
  }
}
