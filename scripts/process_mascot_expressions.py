from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SHEETS_DIR = ROOT / "assets" / "images" / "mascots" / "expressions" / "sheets"
POSES_DIR = ROOT / "assets" / "images" / "mascots" / "expressions" / "poses"

PETS = (
    "pingo",
    "violet",
    "biscuit",
    "waddle",
    "sparkle",
    "orbit",
    "ember",
    "quacks",
    "momo",
    "buzzwell",
    "sprout",
    "moonbun",
)

EXPRESSIONS = (
    "happy",
    "winning",
    "losing",
    "comfy",
    "encouraging",
    "thinking",
    "surprised",
    "sleepy",
)

OUTPUT_SIZE = 320
CONTENT_SIZE = 292
ALPHA_THRESHOLD = 16


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= ALPHA_THRESHOLD else 0)
    bbox = mask.getbbox()
    if bbox is None:
        raise ValueError("Expression cell has no visible mascot pixels")
    return bbox


def normalize_pose(cell: Image.Image) -> Image.Image:
    left, top, right, bottom = alpha_bbox(cell)
    margin = 4
    crop = cell.crop(
        (
            max(0, left - margin),
            max(0, top - margin),
            min(cell.width, right + margin),
            min(cell.height, bottom + margin),
        )
    )

    scale = min(CONTENT_SIZE / crop.width, CONTENT_SIZE / crop.height)
    resized = crop.resize(
        (max(1, round(crop.width * scale)), max(1, round(crop.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(
        resized,
        ((OUTPUT_SIZE - resized.width) // 2, (OUTPUT_SIZE - resized.height) // 2),
    )
    return canvas


def save_webp(image: Image.Image, path: Path, *, quality: int) -> None:
    image.save(path, "WEBP", quality=quality, method=4, exact=True)


def process_pet(pet: str) -> None:
    output_sheet = SHEETS_DIR / f"pet-{pet}-expressions.webp"
    pose_paths = [
        POSES_DIR / f"pet-{pet}-{expression}.webp"
        for expression in EXPRESSIONS
    ]
    if output_sheet.exists() and all(path.exists() for path in pose_paths):
        return

    rgba_path = SHEETS_DIR / f"pet-{pet}-sheet-rgba.png"
    sheet = Image.open(rgba_path).convert("RGBA")
    if sheet.width % 4 or sheet.height % 2:
        raise ValueError(f"Unexpected grid dimensions for {pet}: {sheet.size}")

    cell_width = sheet.width // 4
    cell_height = sheet.height // 2
    for index, expression in enumerate(EXPRESSIONS):
        output_path = POSES_DIR / f"pet-{pet}-{expression}.webp"
        if output_path.exists():
            continue
        column = index % 4
        row = index // 4
        cell = sheet.crop(
            (
                column * cell_width,
                row * cell_height,
                (column + 1) * cell_width,
                (row + 1) * cell_height,
            )
        )
        pose = normalize_pose(cell)
        save_webp(
            pose,
            output_path,
            quality=84,
        )

    if not output_sheet.exists():
        save_webp(sheet, output_sheet, quality=82)


def validate_outputs() -> None:
    for pet in PETS:
        for expression in EXPRESSIONS:
            path = POSES_DIR / f"pet-{pet}-{expression}.webp"
            image = Image.open(path).convert("RGBA")
            if image.size != (OUTPUT_SIZE, OUTPUT_SIZE):
                raise ValueError(f"Unexpected output size: {path} {image.size}")
            alpha = image.getchannel("A")
            if any(alpha.getpixel(point) != 0 for point in ((0, 0), (319, 0), (0, 319), (319, 319))):
                raise ValueError(f"Transparent corner validation failed: {path}")
            if alpha_bbox(image) is None:
                raise ValueError(f"Missing mascot pixels: {path}")


def cleanup_intermediates() -> None:
    for pet in PETS:
        for suffix in ("sheet-source.png", "sheet-rgba.png"):
            path = SHEETS_DIR / f"pet-{pet}-{suffix}"
            if path.exists():
                path.unlink()


def main() -> None:
    POSES_DIR.mkdir(parents=True, exist_ok=True)
    for pet in PETS:
        process_pet(pet)
    validate_outputs()
    cleanup_intermediates()
    print(f"Created {len(PETS) * len(EXPRESSIONS)} transparent pose assets")


if __name__ == "__main__":
    main()
