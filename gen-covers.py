#!/usr/bin/env python3
import os
import json
import base64
import subprocess
import urllib.request
import urllib.error

API_KEY = os.environ["GEMINI_API_KEY"]
MODEL = "gemini-3.1-flash-image-preview"
BATCH = "nb-3"
OUT_DIR = os.path.join("project-cards-cover-art", BATCH)
os.makedirs(OUT_DIR, exist_ok=True)

PROJECTS = [
    "blender-agents",
    "blubry",
    "claude-loop",
    "deep-codebase",
    "dotfiles",
    "graphrag-claude-code",
    "little-loops",
    "lmc-voice",
    "mc-vault",
    "mission-control",
    "swan",
    "untie-ai",
]

def get_prompt(project):
    result = subprocess.run(["/opt/homebrew/bin/bash", "gen-prompt.sh", project], capture_output=True, text=True, check=True)
    return result.stdout.strip()

def generate_image(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]},
    }).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.load(resp)
    except urllib.error.HTTPError as e:
        raise ValueError(f"HTTP {e.code}: {e.read().decode()[:1000]}") from e
    for part in data["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            mime = part["inlineData"]["mimeType"]
            ext = mime.split("/")[-1].replace("jpeg", "jpg")
            return ext, base64.b64decode(part["inlineData"]["data"])
    raise ValueError(f"No image in response: {json.dumps(data)[:500]}")

for project in PROJECTS:
    out_path_check = os.path.join(OUT_DIR, f"{project}.jpg")
    if os.path.exists(out_path_check) or os.path.exists(out_path_check.replace(".jpg", ".png")):
        print(f"  skip {project} (already exists)")
        continue
    print(f"  generating {project}...")
    prompt = get_prompt(project)
    ext, image_bytes = generate_image(prompt)
    out_path = os.path.join(OUT_DIR, f"{project}.{ext}")
    with open(out_path, "wb") as f:
        f.write(image_bytes)
    print(f"  saved {out_path} ({len(image_bytes):,} bytes)")

print("Done.")
