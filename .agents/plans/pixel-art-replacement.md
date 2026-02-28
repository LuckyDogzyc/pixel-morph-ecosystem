# Feature: Pixel Art Replacement (占位 → 像素素材)

本计划用于把当前纯色矩形占位替换成像素风素材，同时保持动画与克制逻辑不变。所有美术资源需可维护、可替换，并支持后续扩展更多宝可梦。

## Feature Description

- 使用像素风 sprite sheet 替换当前程序生成的矩形纹理
- 支持三种宝可梦（小火龙 / 妙蛙种子 / 杰尼龟）
- 保持攻击/变身/死亡动画触发
- 资源组织清晰，后续新增宝可梦只需添加素材与配置

## User Story

作为玩家，我希望角色与食物以像素风素材呈现，动画更有手感，同时未来可以轻松扩展更多宝可梦形象。

## Problem Statement

当前画面是程序生成的色块，缺乏像素风表现。需要引入可维护的像素素材结构，并保持既有逻辑与动画不破坏。

## Solution Statement

引入 `public/assets/sprites` 与 `public/assets/food` 目录，使用 sprite sheet 或单帧图替代 `BootScene` 生成的矩形纹理；在 `species` 配置中定义素材路径，并在 `BootScene` 中加载；动画沿用现有 tween，后续可升级为帧动画。

## Feature Metadata

**Feature Type**: UX/Visual Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: BootScene, species data, assets

---

## CONTEXT REFERENCES

### Relevant Codebase Files (必读)

- `PRD.md`
- `src/game/data/species.ts`
- `src/game/scenes/BootScene.ts`
- `src/game/entities/Player.ts`
- `src/game/entities/Creature.ts`
- `src/game/entities/Food.ts`

### New/Updated Files

- `public/assets/sprites/*.png`
- `public/assets/food/*.png`
- `src/game/data/species.ts` (UPDATE: add sprite paths)
- `src/game/scenes/BootScene.ts` (UPDATE: load textures)

---

## IMPLEMENTATION PLAN

### Phase 1: Asset Structure

1. 创建 `public/assets/sprites` 与 `public/assets/food`
2. 每个宝可梦放置一个 sprite（单帧或多帧）

### Phase 2: Data Config

1. 在 `species.ts` 中新增 `spritePath`、`foodPath`
2. 保持 typeId 结构不变

### Phase 3: BootScene Load

1. 在 `BootScene` 中加载素材
2. 替换 `generateTexture` 逻辑

### Phase 4: Animation Compatibility

1. 保留当前 tween 动画（攻击/变身/死亡）
2. 可选：如果提供 sprite sheet，增加帧动画

---

## STEP-BY-STEP TASKS

### ADD assets directory
- **FILES**: `public/assets/sprites`, `public/assets/food`
- **IMPLEMENT**: 放入三系宝可梦素材
- **VALIDATE**: 资源可通过 URL 访问

### UPDATE species config
- **FILE**: `src/game/data/species.ts`
- **IMPLEMENT**:
  - add `spritePath` and `foodPath`
  - 指向 `public/assets/...`
- **VALIDATE**: 运行时路径正确

### UPDATE BootScene
- **FILE**: `src/game/scenes/BootScene.ts`
- **IMPLEMENT**:
  - preload 纹理
  - 删除矩形生成逻辑
- **VALIDATE**: 精灵渲染正常

### VERIFY animations
- **FILES**: `Player.ts`, `Creature.ts`
- **IMPLEMENT**: 不改逻辑，仅验证 Tween 动画仍可触发
- **VALIDATE**: 攻击/变身/死亡动画可见

---

## TESTING STRATEGY

- 运行 `npm run dev`
- 验证三种宝可梦正常显示
- 触发变身/攻击/死亡动画

---

## ACCEPTANCE CRITERIA

- [ ] 三种宝可梦素材正确显示
- [ ] 食物素材正确显示
- [ ] 动画仍可触发
- [ ] 结构可扩展（新增宝可梦只需加素材与配置）

---

## NOTES

- 如果你没有现成素材，可先用占位像素块再替换
- 未来若改成 sprite sheet，建议统一帧尺寸
