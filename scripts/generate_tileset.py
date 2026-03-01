from pathlib import Path
from PIL import Image, ImageDraw

TILE = 16
GRID = 8

PALETTE = {
    'grass': (88, 196, 112, 255),
    'grass_light': (124, 220, 140, 255),
    'grass_dark': (64, 156, 96, 255),
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
    'tree': (88, 168, 96, 255),
    'tree_dark': (56, 120, 72, 255),
    'tree_light': (120, 200, 128, 255),
    'trunk': (150, 110, 70, 255),
    'trunk_dark': (120, 84, 54, 255),
}


def new_tile():
    return Image.new('RGBA', (TILE, TILE), (0, 0, 0, 0))


def draw_grass(tile: Image.Image):
    draw = ImageDraw.Draw(tile)
    draw.rectangle([0, 0, TILE - 1, TILE - 1], fill=PALETTE['grass'])
    for dx, dy in [(2, 3), (9, 6), (5, 10), (12, 2)]:
        draw.rectangle([dx, dy, dx + 1, dy + 1], fill=PALETTE['grass_dark'])
    for dx, dy in [(4, 5), (7, 1), (11, 9)]:
        draw.rectangle([dx, dy, dx, dy], fill=PALETTE['grass_light'])


def draw_water(tile: Image.Image):
    draw = ImageDraw.Draw(tile)
    draw.rectangle([0, 0, TILE - 1, TILE - 1], fill=PALETTE['water'])
    for row in range(2, TILE, 4):
        draw.line([1, row, TILE - 2, row], fill=PALETTE['water_dark'])
    for row in range(0, TILE, 6):
        draw.line([3, row, 6, row], fill=PALETTE['water_light'])


def draw_road(tile: Image.Image):
    draw = ImageDraw.Draw(tile)
    draw.rectangle([0, 0, TILE - 1, TILE - 1], fill=PALETTE['road'])
    draw.rectangle([0, 0, TILE - 1, TILE - 1], outline=PALETTE['road_dark'])
    for dx, dy in [(3, 4), (8, 7), (12, 3), (6, 11)]:
        draw.rectangle([dx, dy, dx, dy], fill=PALETTE['road_light'])


def draw_wall(tile: Image.Image):
    draw = ImageDraw.Draw(tile)
    draw.rectangle([0, 0, TILE - 1, TILE - 1], fill=PALETTE['wall'])
    draw.line([0, 0, TILE - 1, 0], fill=PALETTE['wall_light'])
    for col in range(0, TILE, 4):
        draw.line([col, 4, col, TILE - 1], fill=PALETTE['wall_dark'])
    draw.line([1, 8, TILE - 2, 8], fill=PALETTE['wall_dark'])


def draw_bridge(tile: Image.Image):
    draw = ImageDraw.Draw(tile)
    draw.rectangle([0, 0, TILE - 1, TILE - 1], fill=PALETTE['bridge'])
    for row in range(0, TILE, 4):
        draw.line([1, row, TILE - 2, row], fill=PALETTE['bridge_dark'])
    draw.line([2, 1, TILE - 3, 1], fill=PALETTE['bridge_light'])


def draw_tree(tile: Image.Image):
    draw = ImageDraw.Draw(tile)
    draw.rectangle([0, 0, TILE - 1, TILE - 1], fill=PALETTE['grass'])
    # canopy
    draw.ellipse([1, 1, 14, 12], fill=PALETTE['tree'])
    draw.ellipse([3, 2, 12, 10], fill=PALETTE['tree_light'])
    draw.ellipse([2, 4, 10, 13], fill=PALETTE['tree_dark'])
    # trunk
    draw.rectangle([7, 10, 8, 15], fill=PALETTE['trunk'])
    draw.rectangle([7, 12, 7, 15], fill=PALETTE['trunk_dark'])


def save_tile(tile: Image.Image, name: str):
    out = Path('public/assets/tiles') / f'{name}.png'
    out.parent.mkdir(parents=True, exist_ok=True)
    tile.save(out)


def assemble_tileset(tiles):
    img = Image.new('RGBA', (TILE * GRID, TILE * GRID), (0, 0, 0, 0))
    for idx, tile in enumerate(tiles):
        x = (idx % GRID) * TILE
        y = (idx // GRID) * TILE
        img.paste(tile, (x, y))
    out = Path('public/assets/tilesets/world.png')
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)


def main():
    tiles = []

    grass = new_tile()
    draw_grass(grass)
    save_tile(grass, 'grass')
    tiles.append(grass)

    water = new_tile()
    draw_water(water)
    save_tile(water, 'water')
    tiles.append(water)

    road = new_tile()
    draw_road(road)
    save_tile(road, 'road')
    tiles.append(road)

    wall = new_tile()
    draw_wall(wall)
    save_tile(wall, 'wall')
    tiles.append(wall)

    bridge = new_tile()
    draw_bridge(bridge)
    save_tile(bridge, 'bridge')
    tiles.append(bridge)

    tree = new_tile()
    draw_tree(tree)
    save_tile(tree, 'tree')
    tiles.append(tree)

    assemble_tileset(tiles)


if __name__ == '__main__':
    main()
