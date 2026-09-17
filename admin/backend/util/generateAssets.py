#!/usr/bin/env python3
import os
import struct
import math
from PIL import Image, ImageDraw, ImageFont

STORAGE_DIR = "admin/backend/storage"
os.makedirs(STORAGE_DIR, exist_ok=True)

# Generate valid MP3 files
def create_mp3(filename, duration_sec=30):
    frame = b'\xff\xfb\x90\x64' + b'\x00' * 414
    # ~38.28 frames per second for 1152 samples/frame at 44.1kHz
    num_frames = int(duration_sec * 38.3)
    path = os.path.join(STORAGE_DIR, filename)
    with open(path, 'wb') as f:
        for _ in range(num_frames):
            f.write(frame)
    print(f"Generated {path}")

# Generate gradient avatars with clean initials and badge
def create_avatar(filename, name, initials, color1, color2, country_tag="TZ"):
    size = (512, 512)
    img = Image.new("RGBA", size)
    draw = ImageDraw.Draw(img)

    # Diagonal gradient
    for y in range(size[1]):
        for x in range(size[0]):
            t = (x + y) / (size[0] + size[1])
            r = int(color1[0] * (1 - t) + color2[0] * t)
            g = int(color1[1] * (1 - t) + color2[1] * t)
            b = int(color1[2] * (1 - t) + color2[2] * t)
            draw.point((x, y), fill=(r, g, b, 255))

    # Inner circular ring
    draw.ellipse([30, 30, 482, 482], outline=(255, 255, 255, 120), width=6)
    draw.ellipse([45, 45, 467, 467], fill=(0, 0, 0, 40))

    # Big initials in center
    # Attempt to load a default font
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 160)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
        font_tag = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_tag = ImageFont.load_default()

    # Draw Initials
    bbox = draw.textbbox((0, 0), initials, font=font_large)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text(((size[0] - w) / 2, (size[1] - h) / 2 - 25), initials, fill=(255, 255, 255, 245), font=font_large)

    # Draw Country / Tag Badge at bottom
    badge_text = f"WUDAU • {country_tag}"
    bbox_tag = draw.textbbox((0, 0), badge_text, font=font_tag)
    tw = bbox_tag[2] - bbox_tag[0]
    th = bbox_tag[3] - bbox_tag[1]
    badge_box = [(size[0] - tw) / 2 - 20, 380, (size[0] + tw) / 2 + 20, 380 + th + 16]
    draw.rounded_rectangle(badge_box, radius=18, fill=(0, 0, 0, 140), outline=(255, 255, 255, 180), width=2)
    draw.text(((size[0] - tw) / 2, 388), badge_text, fill=(255, 255, 255, 255), font=font_tag)

    path = os.path.join(STORAGE_DIR, filename)
    img.save(path, "PNG")
    print(f"Generated avatar {path}")

# Generate 9:16 thumbnail poster
def create_thumb(filename, title, subtitle, color1, color2, icon_symbol="🎵"):
    size = (720, 1280)
    img = Image.new("RGB", size)
    draw = ImageDraw.Draw(img)

    for y in range(size[1]):
        t = y / size[1]
        r = int(color1[0] * (1 - t) + color2[0] * t)
        g = int(color1[1] * (1 - t) + color2[1] * t)
        b = int(color1[2] * (1 - t) + color2[2] * t)
        draw.line([(0, y), (size[0], y)], fill=(r, g, b))

    # Artistic geometric shapes / overlays
    draw.ellipse([-100, -100, 500, 500], fill=(255, 255, 255, 15))
    draw.ellipse([300, 700, 900, 1300], fill=(0, 0, 0, 40))

    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 52)
        font_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
        font_brand = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 38)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_brand = ImageFont.load_default()

    # Brand badge at top
    draw.text((50, 60), "WUDAU REELS", fill=(255, 255, 255, 220), font=font_brand)

    # Dark gradient card at bottom
    card_y = 920
    draw.rectangle([0, card_y, size[0], size[1]], fill=(15, 20, 25))

    draw.text((50, card_y + 40), title, fill=(255, 255, 255), font=font_title)
    draw.text((50, card_y + 110), subtitle, fill=(255, 180, 50), font=font_sub)

    path = os.path.join(STORAGE_DIR, filename)
    img.save(path, "JPEG", quality=90)
    print(f"Generated thumbnail {path}")

# Generate 1:1 post image
def create_post_image(filename, title, tag, color1, color2):
    size = (1080, 1080)
    img = Image.new("RGB", size)
    draw = ImageDraw.Draw(img)

    for y in range(size[1]):
        for x in range(size[0]):
            t = (x * 0.4 + y * 0.6) / size[1]
            t = max(0.0, min(1.0, t))
            r = int(color1[0] * (1 - t) + color2[0] * t)
            g = int(color1[1] * (1 - t) + color2[1] * t)
            b = int(color1[2] * (1 - t) + color2[2] * t)
            draw.point((x, y), fill=(r, g, b))

    # Center frosted glass frame
    draw.rectangle([80, 80, 1000, 1000], outline=(255, 255, 255, 80), width=4)

    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 64)
        font_tag = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 38)
        font_brand = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
    except:
        font_title = ImageFont.load_default()
        font_tag = ImageFont.load_default()
        font_brand = ImageFont.load_default()

    draw.text((120, 120), "WUDAU COMMUNITY", fill=(255, 255, 255, 180), font=font_brand)

    # Word wrap or split title
    draw.text((120, 480), title, fill=(255, 255, 255), font=font_title)
    draw.text((120, 570), tag, fill=(255, 200, 80), font=font_tag)

    path = os.path.join(STORAGE_DIR, filename)
    img.save(path, "JPEG", quality=90)
    print(f"Generated post image {path}")

# Generate Banner
def create_banner(filename, headline, subhead, color1, color2):
    size = (1200, 450)
    img = Image.new("RGB", size)
    draw = ImageDraw.Draw(img)

    for x in range(size[0]):
        t = x / size[0]
        r = int(color1[0] * (1 - t) + color2[0] * t)
        g = int(color1[1] * (1 - t) + color2[2] * t)
        b = int(color1[2] * (1 - t) + color2[2] * t)
        draw.line([(x, 0), (x, size[1])], fill=(r, g, b))

    try:
        font_h = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 58)
        font_s = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
        font_b = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        font_h = ImageFont.load_default()
        font_s = ImageFont.load_default()
        font_b = ImageFont.load_default()

    draw.text((70, 70), "FEATURED SPOTLIGHT", fill=(255, 255, 255, 180), font=font_b)
    draw.text((70, 130), headline, fill=(255, 255, 255), font=font_h)
    draw.text((70, 220), subhead, fill=(255, 220, 100), font=font_s)

    path = os.path.join(STORAGE_DIR, filename)
    img.save(path, "JPEG", quality=90)
    print(f"Generated banner {path}")

# Run generation
if __name__ == "__main__":
    # MP3s
    create_mp3("song_bongo_1.mp3", 45)
    create_mp3("song_singeli_1.mp3", 35)
    create_mp3("song_acoustic_tz.mp3", 50)
    create_mp3("song_maasai_chant.mp3", 40)
    create_mp3("song_amapiano.mp3", 55)
    create_mp3("song_tokyo_fusion.mp3", 42)

    # Tanzanian Creator Avatars
    create_avatar("avatar_kassim.png", "Kassim Mwambao", "KM", (255, 75, 31), (255, 159, 0), "TZ 🇹🇿")
    create_avatar("avatar_zuhura.png", "Zuhura Bakari", "ZB", (0, 180, 219), (0, 131, 176), "ZANZIBAR 🌴")
    create_avatar("avatar_mollel.png", "Emmanuel Mollel", "EM", (203, 45, 62), (239, 71, 58), "ARUSHA 🏔️")
    create_avatar("avatar_amani.png", "Amani Juma", "AJ", (142, 45, 226), (74, 0, 224), "SINGELI ⚡")
    create_avatar("avatar_rehema.png", "Rehema Mushi", "RM", (17, 153, 142), (56, 239, 125), "SERENGETI 🦁")
    create_avatar("avatar_jay.png", "Juma Temba", "JT", (33, 147, 176), (109, 213, 250), "BONGO 🎙️")

    # Continental & Global Avatars
    create_avatar("avatar_nolwazi.png", "Nolwazi Khumalo", "NK", (241, 39, 17), (245, 175, 25), "SA 🇿🇦")
    create_avatar("avatar_kofi.png", "Kofi Mensah", "KM", (247, 151, 30), (255, 210, 0), "GH 🇬🇭")
    create_avatar("avatar_kenji.png", "Kenji Takahashi", "KT", (15, 32, 67), (133, 66, 215), "TOKYO 🇯🇵")
    create_avatar("avatar_camille.png", "Camille Laurent", "CL", (75, 108, 183), (24, 40, 72), "PARIS 🇫🇷")

    # Categories
    create_post_image("category_bongo.jpg", "Bongo Flava & Singeli", "Tanzanian Hitmakers 🇹🇿", (255, 75, 31), (255, 159, 0))
    create_post_image("category_nature.jpg", "Serengeti & Coastal Vibes", "Acoustic Nature & Wildlife 🦁", (17, 153, 142), (56, 239, 125))
    create_post_image("category_afrobeats.jpg", "Afrobeats & Amapiano", "Continental Rhythms 🌍", (241, 39, 17), (245, 175, 25))
    create_post_image("category_global.jpg", "Global Fusion Tokyo & Paris", "Electronic & World Beats 🌐", (15, 32, 67), (133, 66, 215))

    # Banners
    create_banner("banner_tz_nature.jpg", "Serengeti & Zanzibar Nature Festival", "Discover authentic sights & sounds of Tanzania 🇹🇿", (255, 75, 31), (30, 80, 160))
    create_banner("banner_bongo_spotlight.jpg", "Bongo & Singeli Dance Contest", "Upload your 30s reel & win 50,000 WUDAU coins! 🔥", (142, 45, 226), (255, 159, 0))

    # More Thumbnails
    create_thumb("thumb5.jpg", "Maasai Rhythm", "Mount Meru Sunrise", (203, 45, 62), (239, 71, 58))
    create_thumb("thumb6.jpg", "Amapiano Rush", "Johannesburg Beats", (241, 39, 17), (245, 175, 25))
    create_thumb("thumb7.jpg", "Shibuya Afro Beat", "Tokyo Loop Sessions", (15, 32, 67), (133, 66, 215))
    create_thumb("thumb8.jpg", "Parisian Dance", "Montmartre Steps", (75, 108, 183), (24, 40, 72))

    # More Post Images
    create_post_image("post4.jpg", "Zanzibar Spice Tour", "#ZanzibarVibes", (0, 180, 219), (0, 131, 176))
    create_post_image("post5.jpg", "Ngorongoro Crater Safari", "#TanzaniaUnforgettable", (17, 153, 142), (56, 239, 125))
    create_post_image("post6.jpg", "Kinondoni Night Market", "#DarEsSalaam", (255, 75, 31), (142, 45, 226))
