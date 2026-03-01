import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { SPECIES } from '../data/species'
import { SpawnSystem } from '../systems/SpawnSystem'
import { AISystem } from '../systems/AISystem'
import { CombatSystem } from '../systems/CombatSystem'
import { HUD } from '../ui/HUD'
import { MobileControls } from '../ui/MobileControls'
import { generateMap } from '../systems/MapGenerator'
import { TILE } from '../data/tiles'

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
    const tileSize = 16
    const mapData = generateMap({
      viewWidth: this.scale.width,
      viewHeight: this.scale.height,
      tileSize,
      scaleMultiplier: 4,
    })

    const map = this.make.tilemap({
      tileWidth: tileSize,
      tileHeight: tileSize,
      width: mapData.width,
      height: mapData.height,
    })
    const tiles = map.addTilesetImage('world', 'world-tiles')
    if (!tiles) throw new Error('Tileset not found')

    const ground = map.createBlankLayer('ground', tiles, 0, 0)
    const decor = map.createBlankLayer('decor', tiles, 0, 0)
    const collision = map.createBlankLayer('collision', tiles, 0, 0)
    if (!ground || !decor || !collision) throw new Error('Map layers missing')

    ground.putTilesAt(mapData.ground, 0, 0)
    decor.putTilesAt(mapData.decor, 0, 0)
    collision.putTilesAt(mapData.collision, 0, 0)
    collision.setCollisionBetween(1, 1000)

    this.worldWidth = mapData.width * tileSize
    this.worldHeight = mapData.height * tileSize
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    const startSpecies = SPECIES[0].id
    this.player = new Player(this, this.worldWidth / 2, this.worldHeight / 2, startSpecies)

    this.creatures = this.physics.add.group()
    this.foods = this.physics.add.group()

    const canCollide = (obj1: unknown, obj2: unknown) => {
      const tile = obj1 instanceof Phaser.Tilemaps.Tile ? obj1 : obj2 instanceof Phaser.Tilemaps.Tile ? obj2 : null
      if (!tile) return true
      if (tile.index === TILE.WATER) {
        const sprite = (obj1 instanceof Phaser.Tilemaps.Tile ? obj2 : obj1) as { canSwim?: boolean }
        return !sprite?.canSwim
      }
      return true
    }

    this.physics.add.collider(this.player, collision, undefined, canCollide)
    this.physics.add.collider(this.creatures, collision, undefined, canCollide)

    this.spawnSystem = new SpawnSystem(this, this.creatures, this.foods, mapData)
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
