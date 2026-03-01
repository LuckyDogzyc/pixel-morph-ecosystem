# Feature: Procedural Map Generation + Ecology Biome Templates

本计划用于实现纯程序生成的大地图与生态区块模板，满足“地图尺寸约为可视范围的 4 倍”、多生态区块、自然过渡、可通行规则，并支持按 151 只宝可梦进行区块分配（后续可替换）。

## Feature Description

- 纯程序生成地图（运行时生成）
- 区块：草地 / 水域 / 山地 / 城镇 / 森林 / 沙漠 / 山洞
- 地图尺寸：约为屏幕可视范围的 4 倍
- 自然过渡：区块边界不生硬（噪声/平滑/过渡 tile）
- 通行规则：道路与草地可走；树木/墙不可通行；不会游泳的宝可梦不能进水
- 生态区块模板：区块 → 生物列表 → 权重/规则
- 刷怪必须在玩家视野之外生成

## User Story

作为玩家，我希望在一个大范围、风格一致且自然过渡的地图中探索，不同生态区块刷出不同宝可梦；不会游泳的宝可梦不会进入水域，地图可通行规则清晰。

## Problem Statement

现有地图为脚本生成的测试图，区块分布与生态规则不完善，存在“空气墙”问题；生态区块刷怪规则与视野外生成限制尚未落地。

## Solution Statement

建立程序化地图生成管线：
- 使用噪声/种子点生成区块
- 使用平滑/过渡 tile 修正边界
- 以 biome 模板驱动物种刷怪
- 将碰撞/通行规则与生态模板统一

## Feature Metadata

**Feature Type**: World/Map System
**Estimated Complexity**: Medium-High
**Primary Systems Affected**: tilemap generation, spawn rules, AI movement constraints

---

## CONTEXT REFERENCES

- `src/game/Game.ts`
- `src/game/scenes/MainScene.ts`
- `src/game/systems/SpawnSystem.ts`
- `src/game/systems/AISystem.ts`
- `scripts/generate_tilemap.py`
- `scripts/generate_tileset.py`
- `public/assets/tiles/*.png`

---

## IMPLEMENTATION PLAN

### Phase 1: Map Size & Biome Grid

1. 基于屏幕可视范围计算地图尺寸
   - 当前屏幕：960x540
   - tile size：16
   - 可视范围 ≈ 60x34 tiles
   - 目标地图 ≈ 240x136 tiles（4x）
2. 定义 BiomeGrid（二维数组）
   - 通过低频噪声或多中心种子点分配 biome
   - 初始区块：草地/水域/山地/城镇/森林/沙漠/山洞

### Phase 2: Tile 生成与边界过渡

1. 为每种 biome 定义 tile 集合（独立资源 → tileset）
2. 添加边界过渡规则
   - 例如 水域 ↔ 草地 边缘
   - 山地 ↔ 森林 边缘
3. 在 tilemap 生成时应用平滑/边缘逻辑

### Phase 3: 碰撞与通行规则

1. 定义可通行规则
   - 草地/道路：可走
   - 树木/墙/山体/建筑：不可走
   - 水域：仅可游泳宝可梦可走
2. 将规则映射到 collision layer

### Phase 4: 生态区块模板

1. 增加 biome 配置文件（可替换）
   - biome → speciesIds + 权重
   - 预留未来替换（不锁定 151）
2. SpawnSystem 根据玩家所在 biome / 目标 biome 刷怪
3. 刷怪位置必须在玩家视野之外

---

## STEP-BY-STEP TASKS

### Add biome config
- **FILE**: `src/game/data/biomes.ts`
- **CONTENT**: biome 定义、tile 列表、可通行规则、spawn 权重

### Update map generator
- **FILE**: `src/game/systems/MapGenerator.ts` (new)
- **IMPLEMENT**: 运行时生成 tilemap data
- **OUTPUT**: tile layers + collision layer

### Update SpawnSystem
- **FILE**: `src/game/systems/SpawnSystem.ts`
- **IMPLEMENT**: 视野外刷怪 + biome 权重刷怪

### Update AI movement
- **FILE**: `src/game/systems/AISystem.ts`
- **IMPLEMENT**: 不会游泳生物禁止进入水域

### Update tileset pipeline
- **FILE**: `scripts/generate_tileset.py`
- **ADD**: 沙漠/山洞/城镇/森林/山地 tiles
- **OUTPUT**: `public/assets/tiles/*.png`, `public/assets/tilesets/world.png`

---

## ACCEPTANCE CRITERIA

- [ ] 地图尺寸为可视范围 4x 左右
- [ ] 生态区块包含：草地/水域/山地/城镇/森林/沙漠/山洞
- [ ] 区块边界自然过渡，无突兀切换
- [ ] 仅可游泳生物进入水域
- [ ] 道路与草地可通行
- [ ] 树木/墙/山体/建筑不可通行
- [ ] 刷怪位置在玩家视野之外

---

## NOTES

- 生态区块模板可在未来切换到更大规模宝可梦表
- 可视范围基于当前 Phaser config（960x540）
- 可以提供 debug 选项导出生成后的 tilemap JSON
