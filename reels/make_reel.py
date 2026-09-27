#!/usr/bin/env python3
"""Build a vertical, silent, text-free, real-speed, dark-graded Instagram reel from raw clips with ffmpeg.

Usage:
    python3 reels/make_reel.py reels/edits/leg-day.json

The edit list (JSON) looks like:
{
  "output": "reels/out/leg-day.mp4",
  "raw_dir": "reels/raw",
  "grade": "dark",
  "segments": [
    {"file": "squat.mov", "start": 12.5, "end": 15.0, "punch_in": true},
    {"file": "squat.mov", "start": 20.0, "end": 22.0},
    ...
  ]
}

grade: "dark" (moody, default), "light" (subtle contrast only) or "none".

Per-segment options:
  file, start, end  source clip and the section to keep (seconds)
  punch_in          true = slow 1.0 -> 1.12 zoom across the segment
  focus_x           0..1 horizontal crop centre for landscape sources (default 0.5)
"""
import json
import os
import subprocess
import sys
import tempfile

W, H, FPS = 1080, 1920, 30

# Colour grades, picked per reel with "grade" in the edit list (default "dark").
GRADES = {
    # Dark, moody: crush blacks a touch, lift contrast, pull saturation,
    # cool the shadows slightly, then vignette.
    "dark": (
        "eq=contrast=1.18:brightness=-0.05:saturation=0.82:gamma=0.95,"
        "colorbalance=rs=-0.04:bs=0.05:rh=0.03,"
        "curves=master='0/0 0.15/0.08 0.5/0.47 1/0.96',"
        "vignette=PI/4.5"
    ),
    # Light touch: a little extra contrast so different gyms sit together.
    "light": "eq=contrast=1.06:saturation=0.96",
    "none": None,
}


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-3000:])
        raise SystemExit(f"ffmpeg failed: {' '.join(cmd[:6])} ...")


def frame_filter(seg, grade):
    fx = float(seg.get("focus_x", 0.5))
    # Fill 9:16 then crop around focus_x (lets you keep the lifter centred in landscape footage).
    f = [
        f"scale={W}:{H}:force_original_aspect_ratio=increase",
        f"crop={W}:{H}:(in_w-{W})*{fx}:(in_h-{H})/2",
    ]
    if seg.get("punch_in"):
        d = seg["end"] - seg["start"]
        f.append(f"scale=w='{W}*(1+0.12*t/{d})':h=-2:eval=frame,crop={W}:{H}")
    f.append(f"fps={FPS}")
    if GRADES[grade]:
        f.append(GRADES[grade])
    return f


def render_segment(seg, raw_dir, out_path, grade):
    src = os.path.join(raw_dir, seg["file"])
    start, end = float(seg["start"]), float(seg["end"])
    run([
        "ffmpeg", "-y", "-v", "error", "-ss", str(start), "-t", str(end - start), "-i", src,
        "-vf", ",".join(frame_filter(seg, grade)),
        "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", str(FPS), out_path,
    ])


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    edit_path = sys.argv[1]
    with open(edit_path) as f:
        edit = json.load(f)
    raw_dir = edit.get("raw_dir", "reels/raw")
    output = edit.get("output", "reels/out/reel.mp4")
    grade = edit.get("grade", "dark")
    if grade not in GRADES:
        raise SystemExit(f"Unknown grade {grade!r}; use one of {', '.join(GRADES)}")
    os.makedirs(os.path.dirname(output), exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        seg_files = []
        for i, seg in enumerate(edit["segments"]):
            p = os.path.join(tmp, f"seg{i:03d}.mp4")
            print(f"[{i + 1}/{len(edit['segments'])}] {seg['file']} {seg['start']}-{seg['end']}s")
            render_segment(seg, raw_dir, p, grade)
            seg_files.append(p)

        listing = os.path.join(tmp, "list.txt")
        with open(listing, "w") as f:
            f.writelines(f"file '{p}'\n" for p in seg_files)
        joined = os.path.join(tmp, "joined.mp4")
        run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", listing,
             "-c", "copy", joined])

        # Fade in from black. No audio track: Instagram sounds get added in the app.
        run(["ffmpeg", "-y", "-v", "error", "-i", joined, "-vf", "fade=in:st=0:d=0.25", "-an",
             "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
             "-r", str(FPS), "-movflags", "+faststart", output])
    print(f"Done -> {output}")


if __name__ == "__main__":
    main()
