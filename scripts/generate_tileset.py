from PIL import Image, ImageDraw
from pathlib import Path

TILE = 16
GRID = 8  # 8x8 tiles

PALETTE = {
    'grass': (96, 200, 112, 255),
    'grass_dark': (72, 170, 96, 255),
    'water': (90, 162, 224, 255),
    'water_dark': (70, 130, 200, 255),
    'road': (176, 156, 120, 255),
    'road_dark': (150, 130, 100, 255),
    'wall': (110, 110, 120, 255),
    'wall_dark': (80, 80, 90, 255),
    'bridge': (190, 150, 90, 255),
    'bridge_dark': (160, 120, 70, 255),
}


def draw_grass(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['grass'])
    draw.rectangle([x + 2, y + 3, x + 3, y + 4], fill=PALETTE['grass_dark'])
    draw.rectangle([x + 9, y + 6, x + 10, y + 7], fill=PALETTE['grass_dark'])


def draw_water(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['water'])
    draw.rectangle([x + 1, y + 2, x + 4, y + 2], fill=PALETTE['water_dark'])
    draw.rectangle([x + 8, y + 10, x + 12, y + 10], fill=PALETTE['water_dark'])


def draw_road(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['road'])
    draw.rectangle([x + 1, y + 1, x + TILE - 2, y + TILE - 2], outline=PALETTE['road_dark'])


def draw_wall(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['wall'])
    draw.rectangle([x + 2, y + 2, x + TILE - 3, y + TILE - 3], outline=PALETTE['wall_dark'])


def draw_bridge(draw, x, y):
    draw.rectangle([x, y, x + TILE - 1, y + TILE - 1], fill=PALETTE['bridge'])
    for i in range(0, TILE, 4):
        draw.rectangle([x + i, y, x + i + 1, y + TILE - 1], fill=PALETTE['bridge_dark'])


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
