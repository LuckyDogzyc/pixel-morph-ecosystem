from PIL import Image, ImageDraw
from pathlib import Path

SPRITE_SIZE = 24
FRAMES = 6

SPECIES = {
    "charmander": {
        "base": (245, 122, 75, 255),
        "outline": (141, 62, 33, 255),
        "accent": (255, 210, 92, 255),
    },
    "bulbasaur": {
        "base": (97, 201, 111, 255),
        "outline": (44, 120, 70, 255),
        "accent": (232, 132, 168, 255),
    },
    "squirtle": {
        "base": (90, 162, 224, 255),
        "outline": (45, 90, 150, 255),
        "accent": (236, 198, 135, 255),
    },
}


def draw_base(draw: ImageDraw.ImageDraw, base, outline, accent, blink=False, attack=False, glow=False, shrink=False):
    if shrink:
        body = [6, 8, 17, 19]
        head = [8, 5, 15, 10]
    else:
        body = [5, 8, 18, 21]
        head = [7, 3, 16, 9]

    draw.rectangle(body, fill=base, outline=outline)
    draw.rectangle(head, fill=base, outline=outline)

    # eyes
    if blink:
        draw.rectangle([10, 6, 11, 6], fill=(10, 10, 10, 255))
        draw.rectangle([14, 6, 15, 6], fill=(10, 10, 10, 255))
    else:
        draw.rectangle([10, 5, 11, 6], fill=(10, 10, 10, 255))
        draw.rectangle([14, 5, 15, 6], fill=(10, 10, 10, 255))

    # accent (tail / bulb / shell)
    draw.rectangle([18, 12, 21, 14], fill=accent)

    if attack:
        draw.rectangle([11, 10, 13, 12], fill=(200, 40, 40, 255))

    if glow:
        draw.rectangle([3, 6, 20, 22], outline=(255, 255, 255, 180))


def make_frames(colors):
    base, outline, accent = colors
    frames = []

    # idle
    img = Image.new("RGBA", (SPRITE_SIZE, SPRITE_SIZE), (0, 0, 0, 0))
    draw_base(ImageDraw.Draw(img), base, outline, accent)
    frames.append(img)

    # blink
    img = Image.new("RGBA", (SPRITE_SIZE, SPRITE_SIZE), (0, 0, 0, 0))
    draw_base(ImageDraw.Draw(img), base, outline, accent, blink=True)
    frames.append(img)

    # attack
    img = Image.new("RGBA", (SPRITE_SIZE, SPRITE_SIZE), (0, 0, 0, 0))
    draw_base(ImageDraw.Draw(img), base, outline, accent, attack=True)
    frames.append(img)

    # transform glow
    img = Image.new("RGBA", (SPRITE_SIZE, SPRITE_SIZE), (0, 0, 0, 0))
    draw_base(ImageDraw.Draw(img), base, outline, accent, glow=True)
    frames.append(img)

    # death 1 (dim)
    dim = tuple(max(0, int(c * 0.6)) if i < 3 else c for i, c in enumerate(base))
    img = Image.new("RGBA", (SPRITE_SIZE, SPRITE_SIZE), (0, 0, 0, 0))
    draw_base(ImageDraw.Draw(img), dim, outline, accent)
    frames.append(img)

    # death 2 (shrink)
    img = Image.new("RGBA", (SPRITE_SIZE, SPRITE_SIZE), (0, 0, 0, 0))
    draw_base(ImageDraw.Draw(img), dim, outline, accent, shrink=True)
    frames.append(img)

    return frames


def make_sheet(frames):
    sheet = Image.new("RGBA", (SPRITE_SIZE * FRAMES, SPRITE_SIZE), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.paste(frame, (i * SPRITE_SIZE, 0))
    return sheet


def make_food(base, outline):
    size = 10
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([1, 1, size - 2, size - 2], fill=base, outline=outline)
    draw.rectangle([3, 3, 5, 5], fill=(255, 255, 255, 200))
    return img


def main():
    root = Path(__file__).resolve().parents[1]
    sprite_dir = root / "public" / "assets" / "sprites"
    food_dir = root / "public" / "assets" / "food"
    sprite_dir.mkdir(parents=True, exist_ok=True)
    food_dir.mkdir(parents=True, exist_ok=True)

    for name, palette in SPECIES.items():
        frames = make_frames((palette["base"], palette["outline"], palette["accent"]))
        sheet = make_sheet(frames)
        sheet.save(sprite_dir / f"{name}.png")

        food = make_food(palette["base"], palette["outline"])
        food.save(food_dir / f"{name}.png")


if __name__ == "__main__":
    main()
