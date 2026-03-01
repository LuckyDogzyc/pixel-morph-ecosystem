import json
from pathlib import Path

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
MOUNTAIN = 12


def build_layers(width: int, height: int, detail: str):
    ground = []
    decor = []
    collision = []

    lake_x0 = width // 3
    lake_x1 = lake_x0 + max(4, width // 5)
    lake_y0 = height // 3
    lake_y1 = lake_y0 + max(4, height // 4)
    lake_mid_y = (lake_y0 + lake_y1) // 2

    road_start = int(width * 0.65)
    road_width = 4
    road_y0 = int(height * 0.25)
    road_y1 = int(height * 0.75)

    house_x = road_start + 2
    house_y = road_y0 + 1
    house_w = 3
    house_h = 2

    house2_x = road_start + 6
    house2_y = road_y1 - 3

    for y in range(height):
        for x in range(width):
            tile = GRASS
            if lake_x0 <= x <= lake_x1 and lake_y0 <= y <= lake_y1:
                tile = WATER
            if y == lake_mid_y and lake_x0 <= x <= lake_x1:
                tile = BRIDGE
            if road_start <= x <= road_start + road_width and road_y0 <= y <= road_y1:
                tile = ROAD
            if x == road_start and road_y0 <= y <= road_y1:
                tile = WALL
            ground.append(tile)

            deco_tile = 0
            if y in (1, 2) and x % 2 == 0 and x < road_start - 2:
                deco_tile = TREE
            if y in (height - 3, height - 2) and x % 2 == 1 and x < road_start - 4:
                deco_tile = TREE
            if tile == GRASS and (x * 3 + y * 2) % 17 == 0:
                deco_tile = FLOWER
            if tile == GRASS and lake_x0 - 2 <= x <= lake_x1 + 2 and y % 3 == 0:
                deco_tile = ROCK
            if tile == GRASS and x < lake_x0 - 3 and y in (height // 5, height // 5 + 1):
                deco_tile = MOUNTAIN
            if tile == GRASS and x < lake_x0 - 5 and y in (height // 5 + 2, height // 5 + 3):
                deco_tile = MOUNTAIN
            if tile == ROAD and y in (road_y0 + 2, road_y1 - 2) and road_start + 1 <= x <= road_start + road_width:
                deco_tile = FENCE

            if house_x <= x < house_x + house_w and house_y <= y < house_y + house_h:
                deco_tile = ROOF if y == house_y else HOUSE_WALL
            if detail == 'test':
                if house2_x <= x < house2_x + house_w and house2_y <= y < house2_y + house_h:
                    deco_tile = ROOF if y == house2_y else HOUSE_WALL
                if 4 <= x <= 9 and 6 <= y <= 9 and (x + y) % 2 == 0:
                    deco_tile = TREE
                if 12 <= x <= 16 and 18 <= y <= 21 and (x + y) % 3 == 0:
                    deco_tile = TREE

            decor.append(deco_tile)

            blocked = tile in (WATER, WALL) or deco_tile in (TREE, ROCK, FENCE, ROOF, HOUSE_WALL, MOUNTAIN)
            collision.append(1 if blocked else 0)

    return ground, decor, collision


def write_map(path: Path, width: int, height: int, detail: str):
    ground, decor, collision = build_layers(width, height, detail)

    data = {
        "compressionlevel": -1,
        "height": height,
        "width": width,
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
                "width": width,
                "height": height,
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
                "width": width,
                "height": height,
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
                "width": width,
                "height": height,
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

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2))


def main():
    write_map(Path('public/assets/tilemaps/world.json'), 64, 48, 'world')
    write_map(Path('public/assets/tilemaps/test-map.json'), 80, 60, 'test')


if __name__ == '__main__':
    main()
