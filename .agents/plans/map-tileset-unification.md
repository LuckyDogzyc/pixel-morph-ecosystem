# Feature: Map Regions + Tileset Style Unification

本计划用于实现大地图分区生态与地形碰撞，并统一场景 tileset 风格为宝可梦彩色像素时代。

## Feature Description

- 构建大地图与区块化生态
- 引入 tile-based 地形（草地/水域/桥/墙/城市）
- 统一 tileset 与调色板，保证和角色一致
- 支持可通行/不可通行区域

## User Story

作为玩家，我希望在一个分区生态的大地图里探索，不同地形具有一致的宝可梦像素美术风格，并有明确可通行/不可通行区域。

## Problem Statement

目前场景只有简单背景，缺少地形与区块概念，无法体现生态区差异，也不符合“宝可梦彩色像素时代”视觉统一要求。

## Solution Statement

采用 tilemap 方案：
- 使用 16x16 tileset（与角色风格统一）
- 地图分层：地表层 + 碰撞层
- 配置化区块与生态分布

## Feature Metadata

**Feature Type**: World/Map System
**Estimated Complexity**: Medium
**Primary Systems Affected**: scene rendering, physics collision, spawn logic

---

## CONTEXT REFERENCES

- `PRD.md`
- `src/game/scenes/MainScene.ts`
- `src/game/systems/SpawnSystem.ts`
- `public/assets/tilesets/*.png` (new)

---

## IMPLEMENTATION PLAN

### Phase 1: Tileset & Tilemap Setup

1. 准备 tileset（16x16）
2. 引入 Phaser tilemap
3. 创建基础地图层（草地、水域、道路/城市、墙、桥）

### Phase 2: Collision Layer

1. 创建碰撞层（不可通行）
2. Player 与 NPC 碰撞检测

### Phase 3: Region Ecology

1. 将地图分区（例如：草地区、湖泊区、城市区）
2. SpawnSystem 根据区域生成生物与食物

---

## STEP-BY-STEP TASKS

### ADD tileset assets
- **FILES**: `public/assets/tilesets/world.png`
- **VALIDATE**: BootScene 能正确加载

### CREATE tilemap data
- **FILES**: `public/assets/tilemaps/world.json`
- **VALIDATE**: MainScene 渲染地图

### UPDATE MainScene
- **IMPLEMENT**: 加载 tilemap + tileset
- **IMPLEMENT**: 碰撞层设置

### UPDATE SpawnSystem
- **IMPLEMENT**: 根据 tile/region 标签生成生物

---

## ACCEPTANCE CRITERIA

- [ ] 地图显示为宝可梦彩色像素风格
- [ ] 地形可通行/不可通行生效
- [ ] 区块生态差异可见
- [ ] 角色/怪物不穿墙、不进水（除非允许）

---

## NOTES

- tileset 与 sprite 使用相同调色板规范
- 先做手工 tilemap，后续可加程序化生成
