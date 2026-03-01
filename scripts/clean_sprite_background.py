from collections import deque
from pathlib import Path
from PIL import Image


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
    queue = deque()

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
        x, y = queue.popleft()
        pixels[x, y] = (0, 0, 0, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and is_bg(nx, ny):
                visited[ny][nx] = True
                queue.append((nx, ny))

    img.save(path)


def main():
    targets = [
        Path('public/assets/sprites/charmander.png'),
        Path('public/assets/sprites/charmander-ai-base.png'),
    ]
    for target in targets:
        if target.exists():
            clean_image(target)


if __name__ == '__main__':
    main()
