from PIL import Image, ImageDraw
from pathlib import Path

TILE = 16
GRID = 8  # 8x8 tiles

PALETTE = {
    'grass': (96, 200, 112, 255),
    'grass_light': (124, 220, 140, 255),
    'grass_dark': (64, 160, 96, 255),
    'water': (72, 152, 216, 255),
    'water_light': (112, 192, 232, 255),
    'water_dark': (52, 120, 184, 255),
    'road': (190, 170, 120, 255),
    'road_light': (210, 190, 140, 255),
    'road_dark': (150, 120, 80, 255),
    'wall': (112, 112, 120, 255),
    'wall_light': (140, 140, 150, 255),
    'wall_dark': (80, 80, 90, 255),
    'bridge': (200, 160, 100, 255),
    'bridge_light': (220, 180, 120, 255),
    'bridge_dark': (150, 110, 70, 255),
}


def draw_grass(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['grass'])
    for dx, dy in [(2, 3), (9, 6), (5, 10), (12, 2)]:
        draw.rectangle([x + dx, y + dy, x + dx + 1, y + dy + 1], fill=PALETTE['grass_dark'])
    for dx, dy in [(4, 5), (7, 1), (11, 9)]:
        draw.rectangle([x + dx, y + dy, x + dx, y + dy], fill=PALETTE['grass_light'])


def draw_water(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['water'])
    for row in range(2, TILE, 4):
        draw.line([x + 1, y + row, x + TILE - 2, y + row], fill=PALETTE['water_dark'])
    for row in range(0, TILE, 6):
        draw.line([x + 3, y + row, x + 6, y + row], fill=PALETTE['water_light'])


def draw_road(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['road'])
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], outline=PALETTE['road_dark'])
    for dx, dy in [(3, 4), (8, 7), (12, 3), (6, 11)]:
        draw.rectangle([x + dx, y + dy, x + dx, y + dy], fill=PALETTE['road_light'])


def draw_wall(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['wall'])
    draw.line([x, y, x + TILE - 1, y], fill=PALETTE['wall_light'])
    for col in range(0, TILE, 4):
        draw.line([x + col, y + 4, x + col, y + TILE - 1], fill=PALETTE['wall_dark'])
    draw.line([x + 1, y + 8, x + TILE - 2, y + 8], fill=PALETTE['wall_dark'])


def draw_bridge(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['bridge'])
    for row in range(0, TILE, 4):
        draw.line([x + 1, y + row, x + TILE - 2, y + row], fill=PALETTE['bridge_dark'])
    draw.line([x + 2, y + 1, x + TILE - 3, y + 1], fill=PALETTE['bridge_light'])


def main():
    img = Image.new('RGBA', (TILE * GRID, TILE * GRID), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Row 0
    draw_grass(draw, 0, 0)
    draw_water(draw, TILE, 0)
    draw_road(draw, TILE * 2, 0)
    draw_wall(draw, TILE * 3, 0)
    draw_bridge(draw, TILE * 4, 0)

    out = Path('public/assets/tilesets/world.png')
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)


if __name__ == '__main__':
    main()
