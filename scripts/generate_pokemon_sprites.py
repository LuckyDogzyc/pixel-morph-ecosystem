import base64
import json
import os
import time
from pathlib import Path
from urllib import request

from PIL import Image, ImageEnhance

OUTPUT_DIR = Path('public/assets/sprites')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MODEL_CANDIDATES = [
    'gemini-2.5-flash-image',
    'gemini-2.0-flash-exp-image-generation',
]

FRAME_SIZE = 96
SHRINK_SIZE = 80
BLINK_SHIFT = 2

SPECIES = {
    'charmander': 'Charmander (Pokemon) facing right',
    'bulbasaur': 'Bulbasaur (Pokemon) facing right',
    'squirtle': 'Squirtle (Pokemon) facing right',
}


def avg_color(samples):
    r = sum(s[0] for s in samples) / len(samples)
    g = sum(s[1] for s in samples) / len(samples)
    b = sum(s[2] for s in samples) / len(samples)
    return (r, g, b)


def color_dist(c1, c2):
    return abs(c1[0] - c2[0]) + abs(c1[1] - c2[1]) + abs(c1[2] - c2[2])


def clean_image(path: Path, threshold: int = 40):
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    pixels = img.load()

    samples = []
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for x, y in corners:
        r, g, b, a = pixels[x, y]
        if a > 0:
            samples.append((r, g, b))

    if not samples:
        img.save(path)
        return

    bg = avg_color(samples)

    def is_bg(x, y):
        r, g, b, a = pixels[x, y]
        if a == 0:
            return True
        return color_dist((r, g, b), bg) <= threshold

    visited = [[False] * w for _ in range(h)]
    queue = []

    for x in range(w):
        if is_bg(x, 0):
            queue.append((x, 0))
            visited[0][x] = True
        if is_bg(x, h - 1):
            queue.append((x, h - 1))
            visited[h - 1][x] = True
    for y in range(h):
        if is_bg(0, y):
            queue.append((0, y))
            visited[y][0] = True
        if is_bg(w - 1, y):
            queue.append((w - 1, y))
            visited[y][w - 1] = True

    while queue:
        x, y = queue.pop()
        pixels[x, y] = (0, 0, 0, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and is_bg(nx, ny):
                visited[ny][nx] = True
                queue.append((nx, ny))

    img.save(path)


def request_image(prompt: str) -> bytes:
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        raise SystemExit('GEMINI_API_KEY not set in environment')

    body = {
        'contents': [
            {
                'role': 'user',
                'parts': [{'text': prompt}],
            }
        ],
        'generationConfig': {
            'responseModalities': ['IMAGE'],
        },
    }

    for model in MODEL_CANDIDATES:
        url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}'
        for attempt in range(3):
            try:
                req = request.Request(
                    url,
                    data=json.dumps(body).encode('utf-8'),
                    headers={'Content-Type': 'application/json'},
                )
                with request.urlopen(req, timeout=60) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                parts = data.get('candidates', [{}])[0].get('content', {}).get('parts', [])
                for part in parts:
                    if 'inlineData' in part:
                        return base64.b64decode(part['inlineData']['data'])
                raise RuntimeError('No image data returned')
            except Exception:
                if attempt == 2:
                    break
                time.sleep(5 * (attempt + 1))
        # try next model

    raise RuntimeError('All models failed to return image data')


def build_spritesheet(base: Image.Image) -> Image.Image:
    base = base.resize((FRAME_SIZE, FRAME_SIZE), Image.NEAREST)

    frames = []
    frames.append(base)

    blink = Image.new('RGBA', base.size, (0, 0, 0, 0))
    blink.paste(base, (0, -BLINK_SHIFT))
    frames.append(blink)

    attack = ImageEnhance.Color(base).enhance(1.35)
    frames.append(attack)

    transform = base.copy()
    px = transform.load()
    for y in range(transform.height):
        for x in range(transform.width):
            r, g, b, a = px[x, y]
            if a > 0:
                px[x, y] = (min(255, r + 30), min(255, g + 30), min(255, b + 30), a)
    frames.append(transform)

    dim = ImageEnhance.Brightness(base).enhance(0.6)
    frames.append(dim)

    shrink = base.resize((SHRINK_SIZE, SHRINK_SIZE), Image.NEAREST)
    canvas = Image.new('RGBA', base.size, (0, 0, 0, 0))
    offset = (FRAME_SIZE - SHRINK_SIZE) // 2
    canvas.paste(shrink, (offset, offset))
    frames.append(canvas)

    sheet = Image.new('RGBA', (FRAME_SIZE * len(frames), FRAME_SIZE), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.paste(frame, (i * FRAME_SIZE, 0))

    return sheet


def generate_species(species_id: str, description: str):
    prompt = (
        f'Create a single {FRAME_SIZE}x{FRAME_SIZE} pixel art sprite of {description}, '
        'detailed pixel art, transparent background, 1px outline, no text.'
    )
    img_data = request_image(prompt)

    base_path = OUTPUT_DIR / f'{species_id}-ai-base.png'
    base_path.write_bytes(img_data)

    base = Image.open(base_path).convert('RGBA')
    sheet = build_spritesheet(base)

    sheet_path = OUTPUT_DIR / f'{species_id}.png'
    sheet.save(sheet_path)

    clean_image(base_path)
    clean_image(sheet_path)


def main():
    for species_id, description in SPECIES.items():
        generate_species(species_id, description)


if __name__ == '__main__':
    main()
