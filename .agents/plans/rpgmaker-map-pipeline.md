# Feature: RPG Maker Map Pipeline for Web (Phaser)

本计划用于把 RPG Maker MV/MZ 产出的地图与 tileset 作为权威来源导入到网页游戏（Phaser），并保持地图尺寸约为屏幕可视范围的 4x，满足生态区块、通行规则与刷怪要求。

## Feature Description

- 统一使用 RPG Maker MV/MZ 产出地图（Map JSON + tileset PNG）
- 导入 Phaser 作为 web 端运行地图
- 维护地图尺寸约为屏幕可视范围 4x（可扩展）
- 配置碰撞与通行规则（道路/草地可走，树/墙/山体不可走，水域仅可游泳生物）
- 生态区块模板与刷怪规则
- 刷怪位置必须在玩家视野范围之外

## User Story

作为玩家，我希望在 RPG Maker 风格的地图上探索并战斗，地图尺寸足够大且边界自然过渡，生态区块刷怪合理，所有规则适配网页端运行。

## Problem Statement

当前地图为程序生成，存在风格差异和贴图缺失导致的黑屏问题，且缺少 RPG Maker 标准化地图管线。

## Solution Statement

建立 RPG Maker → Phaser 导入管线：
- RPG Maker 产出地图与 tileset
- 转换/加载到 Phaser tilemap
- 配置碰撞层与生态刷怪规则

## Feature Metadata

**Feature Type**: World/Map System
**Estimated Complexity**: Medium
**Primary Systems Affected**: tilemap loading, spawn rules, collision

---

## CONTEXT REFERENCES

- `src/game/scenes/MainScene.ts`
- `src/game/systems/SpawnSystem.ts`
- `src/game/data/tiles.ts`
- `src/game/data/biomes.ts`
- `src/game/systems/MapGenerator.ts`

---

## IMPLEMENTATION PLAN

### Phase 1: Define RPG Maker Import Spec

1. 选择 RPG Maker MV/MZ JSON 格式作为输入
2. 规范目录结构
   - `public/assets/rpgmaker/tilesets/*.png`
   - `public/assets/rpgmaker/maps/MapXXX.json`
3. 定义 tile index 映射表（RPG Maker → Phaser）

### Phase 2: Phaser Loader + Adapter

1. 新增 `RpgMakerLoader`
   - 读取 Map JSON
   - 解析 layers 与 tileIds
2. 适配成 Phaser tilemap layer

### Phase 3: Collision & Swim Rules

1. 确定阻挡 tile
2. 水域仅可游泳生物通行

### Phase 4: Biome & Spawn

1. biome 模板与宝可梦分配规则
2. 刷怪必须在玩家视野之外

---

## STEP-BY-STEP TASKS

### ADD import assets
- **FILES**: `public/assets/rpgmaker/tilesets/*.png`
- **FILES**: `public/assets/rpgmaker/maps/*.json`
- **VALIDATE**: 资源可被加载

### CREATE adapter
- **FILE**: `src/game/systems/RpgMakerLoader.ts`
- **IMPLEMENT**: Map JSON → Phaser tilemap

### UPDATE MainScene
- **FILE**: `src/game/scenes/MainScene.ts`
- **IMPLEMENT**: 使用 RpgMakerLoader 替换 MapGenerator

### UPDATE SpawnSystem
- **FILE**: `src/game/systems/SpawnSystem.ts`
- **IMPLEMENT**: biome + 视野外刷怪

---

## ACCEPTANCE CRITERIA

- [ ] RPG Maker MV/MZ 地图可正常渲染
- [ ] 地图尺寸约为屏幕可视范围 4x
- [ ] 道路/草地可通行
- [ ] 树/墙/山体不可通行
- [ ] 水域仅可游泳生物进入
- [ ] 刷怪位置在视野外

---

## NOTES

- 需要确定 RPG Maker 版本（MV/MZ）与地图 JSON 结构
- 资产授权需合规（自制或许可素材）
- 本计划不包含 RPG Maker 编辑器操作，只处理导入与运行
