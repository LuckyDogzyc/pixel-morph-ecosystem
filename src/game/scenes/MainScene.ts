import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { SPECIES } from '../data/species'
import { SpawnSystem } from '../systems/SpawnSystem'
import { AISystem } from '../systems/AISystem'
import { CombatSystem } from '../systems/CombatSystem'
import { HUD } from '../ui/HUD'
import { MobileControls } from '../ui/MobileControls'

const MAP_KEY = 'test-map'

export class MainScene extends Phaser.Scene {
  private player!: Player
  private creatures!: Phaser.Physics.Arcade.Group
  private foods!: Phaser.Physics.Arcade.Group
  private spawnSystem!: SpawnSystem
  private aiSystem!: AISystem
  private combatSystem!: CombatSystem
  private hud!: HUD
  private mobileControls?: MobileControls
  private worldWidth = 0
  private worldHeight = 0

  constructor() {
    super('main')
  }

  create() {
    const map = this.make.tilemap({ key: MAP_KEY })
    const tiles = map.addTilesetImage('world', 'world-tiles')
    if (!tiles) throw new Error('Tileset not found')

    this.worldWidth = map.widthInPixels
    this.worldHeight = map.heightInPixels
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    const ground = map.createLayer('ground', tiles, 0, 0)
    const decor = map.createLayer('decor', tiles, 0, 0)
    const collision = map.createLayer('collision', tiles, 0, 0)
    if (!ground || !decor || !collision) throw new Error('Map layers missing')
    collision.setCollisionBetween(1, 1000)

    const startSpecies = SPECIES[0].id
    this.player = new Player(this, this.worldWidth / 2, this.worldHeight / 2, startSpecies)

    this.creatures = this.physics.add.group()
    this.foods = this.physics.add.group()

    this.physics.add.collider(this.player, collision)
    this.physics.add.collider(this.creatures, collision)

    this.spawnSystem = new SpawnSystem(this, this.creatures, this.foods, this.worldWidth, this.worldHeight)
    this.aiSystem = new AISystem(this, this.player, this.creatures)
    this.combatSystem = new CombatSystem(this, this.player, this.creatures, this.foods)
    this.hud = new HUD(this, this.player, this.combatSystem)
    this.mobileControls = new MobileControls(this)

    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
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

}
