# Feature: Pokemon-Style Ecosystem Chain (属性循环 + 可扩展配置)

本计划将当前生物链从“固定物种”提升为“属性驱动的循环克制系统”，并为后续宝可梦进化/技能扩展预留结构。目标是：规则符合自然规律、支持未来扩展且无需热修改。

## Feature Description

- 使用宝可梦属性克制规则作为生态链核心
- 第一版仅包含：火 / 草 / 水（对应：小火龙 / 妙蛙种子 / 杰尼龟）
- 克制关系形成闭环：火克草、草克水、水克火
- 所有生态链规则由配置驱动，可轻松替换/扩展
- 为进化与技能系统预留数据结构

## User Story

作为玩家，我希望生态链遵循真实自然规律并基于宝可梦属性克制，让我能凭属性知识判断强弱，并且后续能扩展更多宝可梦与进化技能。

## Problem Statement

当前的生物链是“物种静态闭环”，扩展到宝可梦体系时需要按属性克制来组织生态关系，同时要求可扩展、可维护、非硬编码。

## Solution Statement

引入“属性类型（Type）+ 物种（Species）+ 属性克制矩阵（TypeChart）”的数据模型：
- TypeChart 负责强弱关系
- Species 绑定类型、速度、体型、纹理
- Ecosystem 通过 TypeChart 动态判断捕食关系

## Feature Metadata

**Feature Type**: System Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: data/species, data/food-chain, AI/Combat

---

## CONTEXT REFERENCES

### Relevant Codebase Files (必读)

- `PRD.md`
- `src/game/data/species.ts`
- `src/game/data/food-chain.ts`
- `src/game/systems/AISystem.ts`
- `src/game/systems/CombatSystem.ts`
- `src/game/systems/SpawnSystem.ts`

### New/Updated Files

- `src/game/data/types.ts` (NEW)
- `src/game/data/type-chart.ts` (NEW)
- `src/game/data/species.ts` (UPDATE)
- `src/game/data/food-chain.ts` (UPDATE)
- `src/game/systems/AISystem.ts` (UPDATE)
- `src/game/systems/CombatSystem.ts` (UPDATE)
- `src/game/systems/SpawnSystem.ts` (UPDATE)

---

## IMPLEMENTATION PLAN

### Phase 1: Data Model

1. 新增类型枚举 `TypeId`（fire/grass/water）
2. 创建 `TypeChart` 配置：火克草、草克水、水克火
3. Species 改为绑定属性类型（typeId）

### Phase 2: Ecosystem Logic

1. food-chain 逻辑改为 type-chart 驱动
2. canEat(predator, prey) 依据 TypeChart 判断

### Phase 3: AI + Combat Update

1. AI 判断强弱改为 typeId 克制
2. CombatSystem 捕食/伤害逻辑改为 typeId 克制

### Phase 4: Future Extension Hooks

1. 在 species 中增加 `evolvesTo?: SpeciesId[]`
2. 在 species 中增加 `skills?: SkillId[]`（预留）
3. 保持类型表可扩展

---

## STEP-BY-STEP TASKS

### CREATE types
- **FILE**: `src/game/data/types.ts`
- **IMPLEMENT**: 定义 `TypeId` 与映射
- **VALIDATE**: 通过 TypeScript 编译

### CREATE type chart
- **FILE**: `src/game/data/type-chart.ts`
- **IMPLEMENT**: 定义克制关系表
- **VALIDATE**: 提供 `isEffective(attacker, defender)`

### UPDATE species
- **FILE**: `src/game/data/species.ts`
- **IMPLEMENT**:
  - 改为仅含三种宝可梦形态
  - 每个 species 绑定 `typeId`
  - 添加可选字段 `evolvesTo`、`skills`
- **VALIDATE**: SPECIES_BY_ID 正常

### UPDATE ecosystem logic
- **FILE**: `src/game/data/food-chain.ts`
- **IMPLEMENT**: canEat 走 `isEffective`
- **VALIDATE**: 单元测试或手动验证

### UPDATE AI
- **FILE**: `src/game/systems/AISystem.ts`
- **IMPLEMENT**: Predator/Prey 判断改为 type-chart
- **VALIDATE**: 运行时可观察追/逃

### UPDATE combat
- **FILE**: `src/game/systems/CombatSystem.ts`
- **IMPLEMENT**: canEat 逻辑改为 type-chart
- **VALIDATE**: 捕食与扣血符合克制

### UPDATE spawn
- **FILE**: `src/game/systems/SpawnSystem.ts`
- **IMPLEMENT**: 只刷三系宝可梦
- **VALIDATE**: 生态链闭环

---

## TESTING STRATEGY

- 手动验证：
  - 火克草
  - 草克水
  - 水克火
- 验证追逐 / 逃跑逻辑
- 验证得分 / 扣血逻辑

---

## ACCEPTANCE CRITERIA

- [ ] 生态链逻辑由 type-chart 驱动
- [ ] 只用小火龙/妙蛙种子/杰尼龟
- [ ] 克制关系符合：火克草、草克水、水克火
- [ ] AI 与战斗逻辑遵循属性克制
- [ ] 配置可轻松扩展（新增类型仅改配置）

---

## NOTES

- 未来要扩展全量宝可梦时，只需扩展 type-chart + species 配置即可
- 进化与技能不在本阶段实现，仅做结构预留
