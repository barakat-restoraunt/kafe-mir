import os, subprocess, urllib.request, re, sys

base = os.path.dirname(os.path.abspath(__file__))
img_dir = os.path.join(base, "images", "menu")
html_path = os.path.join(base, "index.html")

os.makedirs(img_dir, exist_ok=True)

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

urls = list(set(re.findall(r'src="(https://i\.ibb\.co/[^"]+)"', html)))
urls.sort()

print(f"Found {len(urls)} images")

for i, url in enumerate(urls):
    hash_id = url.split("/")[3]
    jpg_path = os.path.join(img_dir, f"{hash_id}.jpg")
    webp_path = os.path.join(img_dir, f"{hash_id}.webp")

    for p in [jpg_path, webp_path]:
        if os.path.exists(p):
            os.remove(p)

    print(f"[{i+1}/{len(urls)}] {hash_id}...", end=" ", flush=True)

    try:
        urllib.request.urlretrieve(url, jpg_path)
        orig_kb = os.path.getsize(jpg_path) // 1024

        result = subprocess.run([
            "ffmpeg", "-i", jpg_path,
            "-vf", "scale='min(1200,iw)':'-1'",
            "-c:v", "libwebp",
            "-lossless", "0",
            "-q:v", "80",
            "-preset", "photo",
            "-an", "-y", webp_path
        ], capture_output=True, timeout=60)

        if os.path.exists(webp_path):
            new_kb = os.path.getsize(webp_path) // 1024
            print(f"{orig_kb}KB -> {new_kb}KB")
            os.remove(jpg_path)
        else:
            # fallback to jpg
            new_jpg = os.path.join(img_dir, f"{hash_id}.jpg")
            subprocess.run([
                "ffmpeg", "-i", jpg_path,
                "-vf", "scale='min(1200,iw)':'-1'",
                "-q:v", "2",
                "-an", "-y", new_jpg
            ], capture_output=True, timeout=60)
            if os.path.exists(new_jpg):
                new_kb = os.path.getsize(new_jpg) // 1024
                print(f"{orig_kb}KB -> {new_kb}KB (jpg)")
                os.remove(jpg_path)
            else:
                print("FAIL")
    except Exception as e:
        print(f"ERROR: {e}")

print("\nDone!")
