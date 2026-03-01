# Feature: Pixel Art Sprite Replacement (小火龙/妙蛙种子/杰尼龟)

本计划将当前“纯色方块”占位渲染替换为像素素材，并建立基础动画（攻击/变身/死亡），确保视觉反馈清晰且可扩展。

## Feature Description

- 用像素精灵图替换方块材质
- 为每个物种提供基础动画帧：idle / attack / transform / death
- 食物替换为“小型旋转的基础宝可梦卡片”素材
- 保持素材可替换（后续换美术时只替换资源和配置）

## User Story

作为玩家，我希望看到真实像素角色与清晰动画，从而更容易理解攻击、变身与死亡反馈。

## Problem Statement

当前使用纯色方块，反馈不够明确，动画仅靠 tween，不利于玩家识别不同形态。

## Solution Statement

引入 spritesheet + 动画配置：
- 每个宝可梦一张 spritesheet（24x24，横向多帧）
- 通过统一动画命名规则加载与播放
- 食物使用小型旋转卡片素材

## Feature Metadata

**Feature Type**: Visual/UX Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: BootScene, Player, Creature, Food, assets

---

## CONTEXT REFERENCES

### Relevant Files

- `src/game/scenes/BootScene.ts`
- `src/game/entities/Player.ts`
- `src/game/entities/Creature.ts`
- `src/game/entities/Food.ts`
- `src/game/data/species.ts`

### New Files / Assets

- `public/assets/sprites/charmander.png`
- `public/assets/sprites/bulbasaur.png`
- `public/assets/sprites/squirtle.png`
- `public/assets/cards/charmander.png`
- `public/assets/cards/bulbasaur.png`
- `public/assets/cards/squirtle.png`

---

## IMPLEMENTATION PLAN

### Phase 1: Asset Pipeline

1. 添加 assets 目录结构
2. 为 3 个物种准备 spritesheet（24x24 x 6 帧）
3. 食物用小型卡片素材（建议 16x24 或 24x32）

### Phase 2: Load & Animate

1. 每个宝可梦一张 spritesheet（横向 6 帧）
2. BootScene 加载 spritesheet + 卡片图
3. 统一动画命名规则（species-idle/attack/transform/death）
4. Player/Creature 使用动画切换

### Phase 3: Visual Feedback

1. 攻击动画触发时播放 attack
2. 变身动画触发时播放 transform
3. 死亡播放 death

---

## STEP-BY-STEP TASKS

### ADD assets
- **FILES**: `public/assets/sprites/*.png`, `public/assets/cards/*.png`
- **VALIDATE**: 运行时加载无报错

### UPDATE BootScene
- **FILE**: `BootScene.ts`
- **IMPLEMENT**: 使用 `this.load.spritesheet` 与 `this.load.image`
- **ADD**: 创建动画 key：`{species}-idle` / `attack` / `transform` / `death`
- **VALIDATE**: scene 启动后资源可用

### UPDATE Player/Creature
- **FILE**: `Player.ts`, `Creature.ts`
- **IMPLEMENT**: 用 spritesheet 替换 texture
- **ADD**: `playAnimation(name)` helper
- **ADD**: attack/transform/death 播完回 idle
- **VALIDATE**: idle 正常播放

### UPDATE Food
- **FILE**: `Food.ts`
- **IMPLEMENT**: 使用宝可梦卡片素材替代方块
- **ADD**: 卡片轻微旋转动画（循环，例如 -8° ~ 8°）

### UPDATE Animation Hooks
- **FILE**: `Player.ts`, `Creature.ts`
- **IMPLEMENT**: attack/transform/death 改为播放动画帧
- **VALIDATE**: 每个事件触发动画可见

---

## TESTING STRATEGY

- 运行 `npm run dev`
- 观察 3 种宝可梦外观
- 触发攻击、变身、死亡动作
- 确保卡片素材显示

---

## ACCEPTANCE CRITERIA

- [ ] 3 个宝可梦 spritesheet 正常显示
- [ ] attack/transform/death 有帧动画
- [ ] 动画播放后能回到 idle
- [ ] 食物卡片显示并旋转
- [ ] 依然保持原有玩法逻辑

---

## NOTES

- 如果暂无正式素材，可用临时像素占位图，但要求结构与帧数一致
- 建议帧顺序：idle / blink / attack / transform / death_1 / death_2
- 后续替换素材只需更新 assets，不改逻辑

## POKEMON 设定参考（用于卡片变身合理性）

- Arceus 的石板改变属性
- Silvally 的记忆芯片改变属性
- Rotom 家电形态切换
- 进化石/进化道具触发形态变化
- 宝可梦 TCG 卡片作为“形态符号”的视觉隐喻
