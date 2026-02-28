# Feature: MVP Core Loop（像素风变形食物链）

本计划用于在空仓库基础上搭建可玩的最小闭环：渲染 + 输入 + 变形 + 生物链 + 基础 AI + 生命/得分 + 动画表现。执行前若技术栈不同，请先确认再执行。

## Feature Description

构建一个可玩的像素风开放世界小游戏 MVP：
- 鼠标控制方向
- 左键按住移动，点击冲刺（2 秒冷却）
- 食物刷新 → 吃到变形（不计分）
- 生物链闭环，NPC 互相捕食/逃跑
- 主角吃弱小生物得分，被强大生物攻击掉血
- 生命值用红心显示，清空死亡
- 攻击/变身/死亡有动画
- 排行榜（先用本地存储）

## User Story

作为玩家，我希望通过鼠标操作进行移动和冲刺，在充满生物链互动的世界中变形、捕食与生存，并获得分数和清晰的反馈动画。

## Problem Statement

需要一个简单但完整的“变形 + 食物链”可玩闭环，既能演示核心机制，又能为后续扩展打基础。

## Solution Statement

使用 Phaser + TypeScript + Vite 建立基础游戏循环；用数据驱动的生物链配置实现捕食关系；以简单状态机实现 AI 追逐/逃跑/游走；通过本地排行榜记录分数；用基础帧动画或 tween 实现攻击、变身、死亡动画。

## Feature Metadata

**Feature Type**: New Capability (MVP)
**Estimated Complexity**: Medium
**Primary Systems Affected**: 渲染/输入/实体系统/AI/得分/生命/动画
**Dependencies**: Phaser, Vite, TypeScript

---

## CONTEXT REFERENCES

### Relevant Codebase Files (必读)

- `PRD.md` — 需求与规则总览
- `CLAUDE.md` — 项目规则与约定
- `README.md` — 项目简介

### New Files to Create (建议结构)

- `index.html` — Vite 入口
- `src/main.ts` — 启动游戏
- `src/game/Game.ts` — Phaser 游戏配置
- `src/game/scenes/BootScene.ts` — 资源加载
- `src/game/scenes/MainScene.ts` — 主场景
- `src/game/entities/Player.ts` — 主角实体
- `src/game/entities/Creature.ts` — NPC 生物实体
- `src/game/entities/Food.ts` — 食物实体
- `src/game/systems/SpawnSystem.ts` — 刷新系统
- `src/game/systems/TransformSystem.ts` — 变形系统
- `src/game/systems/CombatSystem.ts` — 攻击与伤害
- `src/game/systems/AISystem.ts` — AI 追逐/逃跑
- `src/game/ui/HUD.ts` — 红心与得分 UI
- `src/game/data/species.ts` — 生物配置
- `src/game/data/food-chain.ts` — 食物链闭环
- `src/game/utils/Math.ts` — 方向/距离等

### Relevant Documentation

- https://phaser.io/docs — Scene, Arcade Physics, Input
- https://vitejs.dev/guide/ — Vite + TS

### Patterns to Follow

- 数据驱动配置（species/food-chain）
- AI 行为用状态机（chase/escape/wander）
- 所有 NPC 速度 < 主角速度

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

- 初始化 Vite + TS 项目
- 安装 Phaser
- 建立 Game / Scene 结构
- 设定基础渲染画布与世界尺寸

### Phase 2: Core Gameplay

- 主角实体
- 鼠标朝向 + 左键按住移动
- 左键点击冲刺（2 秒冷却）
- 碰撞检测框架

### Phase 3: Ecosystem + Transform

- 食物随机刷新
- 变形系统
- 生物链闭环数据结构
- NPC 刷新与基础实体

### Phase 4: AI + Combat + Score

- AI 行为逻辑（追/逃/游走）
- 生物间相互捕食/逃跑
- 攻击碰撞判定
- 得分与生命值系统

### Phase 5: Animation + UI + Leaderboard

- 攻击/变身/死亡动画（可先用简化 tween）
- 红心 UI
- 本地排行榜（LocalStorage）

---

## STEP-BY-STEP TASKS

### CREATE package.json / Vite scaffold
- **IMPLEMENT**: `npm create vite@latest . -- --template vanilla-ts`
- **GOTCHA**: 若已有结构，跳过并保持现有文件
- **VALIDATE**: `npm install`

### ADD Phaser dependency
- **IMPLEMENT**: `npm i phaser`
- **VALIDATE**: `npm ls phaser`

### CREATE game bootstrap
- **FILES**: `src/main.ts`, `src/game/Game.ts`
- **IMPLEMENT**: 初始化 Phaser.Game，设置尺寸/背景色
- **VALIDATE**: `npm run dev`（页面可打开且无报错）

### CREATE scenes
- **FILES**: `src/game/scenes/BootScene.ts`, `src/game/scenes/MainScene.ts`
- **IMPLEMENT**: Boot 预留资源加载，Main 建立世界与更新循环
- **VALIDATE**: 启动后能进入 MainScene

### CREATE data configs
- **FILES**: `src/game/data/species.ts`, `src/game/data/food-chain.ts`
- **IMPLEMENT**: 定义 6-10 种生物，环状闭环（无最强/最弱）
- **GOTCHA**: 强弱关系必须可逆闭环
- **VALIDATE**: 单元函数验证 `next/prev` 关系

### CREATE entities (Player/Food/Creature)
- **FILES**: `src/game/entities/Player.ts`, `Food.ts`, `Creature.ts`
- **IMPLEMENT**: 基础位置/速度/形态/碰撞框
- **VALIDATE**: 场景中可创建并渲染

### ADD input + movement
- **FILES**: `Player.ts`, `MainScene.ts`
- **IMPLEMENT**: 鼠标方向朝向；左键按住移动；左键点击冲刺
- **GOTCHA**: 冲刺冷却 2 秒，需可视化反馈或状态判断
- **VALIDATE**: 手动测试移动与冲刺

### ADD food spawn + transform
- **FILES**: `SpawnSystem.ts`, `TransformSystem.ts`
- **IMPLEMENT**: 食物随机刷新；触碰食物变形（不加分）
- **VALIDATE**: 变形后形态变化可见

### ADD AI behavior
- **FILES**: `AISystem.ts`, `Creature.ts`
- **IMPLEMENT**: 强者追逐主角，弱者逃离主角，同级中立游走
- **IMPLEMENT**: NPC 之间同样遵循食物链逻辑
- **GOTCHA**: NPC 速度始终略慢于主角
- **VALIDATE**: 观察追逐/逃跑行为

### ADD combat + health + score
- **FILES**: `CombatSystem.ts`, `HUD.ts`
- **IMPLEMENT**: 碰撞判定；主角吃弱者得分，被强者碰到扣血
- **IMPLEMENT**: 红心 UI；死亡触发 game over
- **VALIDATE**: 分数与血量变化正确

### ADD animations
- **FILES**: `Player.ts`, `Creature.ts`
- **IMPLEMENT**: 攻击/变身/死亡动画（帧动画或 tween）
- **GOTCHA**: MVP 允许简化动画但必须可见
- **VALIDATE**: 触发动作时动画可见

### ADD local leaderboard
- **FILES**: `HUD.ts` 或 `Leaderboard.ts`
- **IMPLEMENT**: LocalStorage 记录与展示 Top N
- **VALIDATE**: 死亡后可看到排行榜

---

## TESTING STRATEGY

- MVP 阶段以手动测试为主
- 核心验证项：
  - 移动/冲刺冷却
  - 变形触发
  - 捕食得分
  - 生命值清零死亡
  - NPC 追/逃行为
  - 动画存在

## VALIDATION COMMANDS

### Level 1: Build/Run
- `npm run dev`
- `npm run build`（如配置）

### Level 2: Manual Validation
- 主角移动/冲刺
- 变形成功
- NPC 行为正确
- 得分与血量正确
- 动画触发

---

## ACCEPTANCE CRITERIA

- [ ] 左键按住移动，点击冲刺且 2 秒冷却生效
- [ ] 食物刷新并触发变形
- [ ] 生物链闭环（无最强/最弱）
- [ ] NPC 互相捕食/逃跑
- [ ] 主角得分与扣血规则正确
- [ ] 红心生命值可视化
- [ ] 攻击/变形/死亡动画可见
- [ ] 排行榜可展示

---

## NOTES

- 如果最终技术栈不是 Phaser，请先更新此计划再执行。
