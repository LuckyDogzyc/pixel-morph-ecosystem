import json
from pathlib import Path

WIDTH = 32
HEIGHT = 24

# Tile ids (1-based)
GRASS = 1
WATER = 2
ROAD = 3
WALL = 4
BRIDGE = 5
TREE = 6
FLOWER = 7
ROCK = 8
FENCE = 9
ROOF = 10
HOUSE_WALL = 11


def build_layers():
    ground = []
    decor = []
    collision = []

    house_x = 24
    house_y = 7
    house_w = 3
    house_h = 2

    for y in range(HEIGHT):
        for x in range(WIDTH):
            tile = GRASS
            if 10 <= x <= 17 and 8 <= y <= 15:
                tile = WATER
            if y == 12 and 10 <= x <= 17:
                tile = BRIDGE
            if x >= 22 and 6 <= y <= 18:
                tile = ROAD
            if x == 22 and 6 <= y <= 18:
                tile = WALL
            ground.append(tile)

            deco_tile = 0
            if y in (1, 2) and x % 2 == 0 and x < 20:
                deco_tile = TREE
            if y == 20 and 3 <= x <= 18 and x % 2 == 1:
                deco_tile = TREE
            if tile == GRASS and (x + y) % 11 == 0:
                deco_tile = FLOWER
            if tile == GRASS and 8 <= x <= 18 and y in (7, 16) and (x + y) % 3 == 0:
                deco_tile = ROCK
            if tile == ROAD and y in (9, 14) and 24 <= x <= 29:
                deco_tile = FENCE

            if house_x <= x < house_x + house_w and house_y <= y < house_y + house_h:
                deco_tile = ROOF if y == house_y else HOUSE_WALL

            decor.append(deco_tile)

            blocked = tile in (WATER, WALL) or deco_tile in (TREE, ROCK, FENCE, ROOF, HOUSE_WALL)
            collision.append(1 if blocked else 0)

    return ground, decor, collision


def main():
    ground, decor, collision = build_layers()

    data = {
        "compressionlevel": -1,
        "height": HEIGHT,
        "width": WIDTH,
        "infinite": False,
        "orientation": "orthogonal",
        "renderorder": "right-down",
        "tiledversion": "1.10.2",
        "type": "map",
        "version": "1.10",
        "tileheight": 16,
        "tilewidth": 16,
        "nextlayerid": 4,
        "nextobjectid": 1,
        "layers": [
            {
                "id": 1,
                "name": "ground",
                "type": "tilelayer",
                "width": WIDTH,
                "height": HEIGHT,
                "opacity": 1,
                "visible": True,
                "x": 0,
                "y": 0,
                "data": ground,
            },
            {
                "id": 2,
                "name": "decor",
                "type": "tilelayer",
                "width": WIDTH,
                "height": HEIGHT,
                "opacity": 1,
                "visible": True,
                "x": 0,
                "y": 0,
                "data": decor,
            },
            {
                "id": 3,
                "name": "collision",
                "type": "tilelayer",
                "width": WIDTH,
                "height": HEIGHT,
                "opacity": 1,
                "visible": True,
                "x": 0,
                "y": 0,
                "data": collision,
            },
        ],
        "tilesets": [
            {
                "firstgid": 1,
                "name": "world",
                "tilewidth": 16,
                "tileheight": 16,
                "tilecount": 64,
                "columns": 8,
                "image": "../tilesets/world.png",
                "imagewidth": 128,
                "imageheight": 128,
                "margin": 0,
                "spacing": 0,
            }
        ],
    }

    out = Path('public/assets/tilemaps/world.json')
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
