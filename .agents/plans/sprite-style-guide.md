# Feature: Sprite Style Guide + Batch Generation Pipeline

本计划用于统一宝可梦像素素材风格，定义明确的风格规范与批量生成流程，避免各帧/各角色出现风格漂移。目标是：保持一致的线条、配色、比例、光源与动画节奏，并能批量生成与替换。美术方向参考宝可梦彩色像素时代（GBA/早期 DS）场景质感，整体更精致。

## Feature Description

- 建立固定的像素风格规范（尺寸、线条、调色板、阴影、光源）
- 规范 spritesheet 帧顺序与动画节奏
- 规范卡片素材尺寸与装饰元素
- 规范场景 tileset 的尺寸与调色板（宝可梦彩色像素风）
- 场景素材以独立 tile 资源生成（树/草/道路等），由程序拼接 tileset
- 定义 Gemini 生成提示词模板与后处理步骤
- 建立“生成 → 审核 → 替换”流程

## User Story

作为开发者，我希望所有宝可梦素材风格一致，能够批量生成并快速替换素材，避免视觉不统一。

## Problem Statement

目前素材来自不同生成结果，容易出现风格不一致、比例不统一、颜色漂移等问题。

## Solution Statement

定义一份「像素素材风格指南」与「生成流水线」，保证所有素材遵循统一约束，并可批量生成。

## Feature Metadata

**Feature Type**: Art Pipeline / Process
**Estimated Complexity**: Low-Medium
**Primary Systems Affected**: assets, animation, generation pipeline, tileset

---

## CONTEXT REFERENCES

### Relevant Files

- `public/assets/sprites/*.png`
- `public/assets/cards/*.png`
- `public/assets/tilesets/*.png`
- `src/game/scenes/BootScene.ts`

---

## STYLE GUIDE (MVP)

### Sprite Specs

- 帧尺寸：24x24
- 帧数量：6（横向）
- 帧顺序：idle / blink / attack / transform / death_1 / death_2
- 线条：1px 深色描边（统一轮廓风格）
- 光源：左上角
- 阴影：单层（避免多层细碎像素）
- 角色保持直立，不做角度旋转，仅左右翻转朝向
- 透明背景：必须清理灰白底/白边

### Card Specs

- 卡片尺寸：16x24
- 边框：1px
- 中心插画区域：10x14
- 左上角可保留 1px 高光

### Palette Guide

- 主色 + 次色 + 描边色（3-5 色为主）
- 避免过多高饱和颜色

### Scene/Tileset Specs

- Tile 尺寸：16x16（贴近 GBA 宝可梦像素风）
- 色板：与角色统一的彩色像素风（避免高饱和、避免渐变）
- 颗粒感：轻微纹理、保持清晰块面
- 地形 tile：水 / 草地 / 城市地面 / 墙 / 桥 / 树
- 可通行/不可通行以 tile 层区分
- 独立 tile 资源 → 程序拼接 tileset

---

## IMPLEMENTATION PLAN

### Phase 1: Style Guide Doc

1. 在 repo 内新增 `docs/art-style.md`
2. 写明尺寸、帧顺序、线条、光源、颜色约束

### Phase 2: Prompt Template

1. 编写统一的 Gemini 生成 prompt 模板
2. 指定“24x24 pixel art, transparent background, 1px outline, consistent palette”

### Phase 3: Batch Generation

1. 生成小火龙/妙蛙种子/杰尼龟静帧
2. 用 Aseprite 或脚本拼成 6 帧 spritesheet
3. 导出卡片素材（16x24）

### Phase 4: Review & Replace

1. 人工审核
2. 替换 `public/assets` 对应文件

---

## STEP-BY-STEP TASKS

### CREATE style guide
- **FILE**: `docs/art-style.md`
- **CONTENT**: 统一风格规范

### DEFINE prompts
- **FILE**: `docs/art-prompts.md`
- **CONTENT**: Gemini 提示词模板

### GENERATE assets
- **OUTPUT**: `public/assets/sprites/*.png`
- **OUTPUT**: `public/assets/cards/*.png`
- **OUTPUT**: `public/assets/tilesets/*.png`

### REVIEW
- **CHECK**: 线条一致 / 色彩一致 / 帧顺序一致
- **CHECK**: tileset 与角色风格一致（调色板统一）

---

## ACCEPTANCE CRITERIA

- [ ] 三只宝可梦素材风格统一
- [ ] 帧顺序一致，动画节奏一致
- [ ] 卡片素材尺寸统一
- [ ] 角色素材透明背景无白边
- [ ] 替换后游戏显示正常

---

## NOTES

- 这一步不改动玩法逻辑，仅更新素材与风格规范
- 后续新增宝可梦必须严格遵循此风格指南
