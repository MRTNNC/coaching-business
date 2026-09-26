#!/usr/bin/env python3
"""Build a vertical, silent, dark-graded Instagram reel from raw clips with ffmpeg.

Usage:
    python3 reels/make_reel.py reels/edits/leg-day.json

The edit list (JSON) looks like:
{
  "output": "reels/out/leg-day.mp4",
  "raw_dir": "reels/raw",
  "handle": "@yourpage",
  "segments": [
    {"file": "squat.mov", "start": 12.5, "end": 15.0, "text": "LEG DAY", "speed": 1.0},
    {"file": "squat.mov", "start": 20.0, "end": 22.0, "slowmo": [0.8, 1.6]},
    ...
  ]
}

Per-segment options:
  file, start, end  source clip and the section to keep (seconds)
  text              optional overlay (big, centred, lower third)
  speed             playback speed for the whole segment (default 1.0)
  slowmo            [from, to] seconds *within the segment* played at half speed
                    (a speed ramp on the hardest rep)
  punch_in          true = slow 1.0 -> 1.12 zoom across the segment
  focus_x           0..1 horizontal crop centre for landscape sources (default 0.5)
"""
import json
import os
import subprocess
import sys
import tempfile

W, H, FPS = 1080, 1920, 30
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# Dark, moody grade: crush blacks a touch, lift contrast, pull saturation,
# cool the shadows slightly, then vignette.
GRADE = (
    "eq=contrast=1.18:brightness=-0.05:saturation=0.82:gamma=0.95,"
    "colorbalance=rs=-0.04:bs=0.05:rh=0.03,"
    "curves=master='0/0 0.15/0.08 0.5/0.47 1/0.96',"
    "vignette=PI/4.5"
)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-3000:])
        raise SystemExit(f"ffmpeg failed: {' '.join(cmd[:6])} ...")


def esc(text):
    return text.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


def frame_filter(seg):
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
    f.append(GRADE)
    return f


def text_filter(text, y_expr="h*0.70", size=96, dur=None):
    # Shrink long captions so they fit inside ~86% of the frame width
    # (DejaVu Sans Bold caps average ~0.68em wide).
    size = min(size, int(W * 0.86 / (0.68 * max(len(text), 1))))
    fade = f":alpha='min(1,t/0.15)'" if dur else ""
    return (
        f"drawtext=fontfile={FONT}:text='{esc(text)}':fontsize={size}:fontcolor=white"
        f":borderw=0:shadowcolor=black@0.8:shadowx=0:shadowy=6"
        f":box=1:boxcolor=black@0.55:boxborderw=28"
        f":x=(w-text_w)/2:y={y_expr}{fade}"
    )


def render_segment(seg, raw_dir, out_path):
    src = os.path.join(raw_dir, seg["file"])
    start, end = float(seg["start"]), float(seg["end"])
    speed = float(seg.get("speed", 1.0))
    base = frame_filter(seg)

    slow = seg.get("slowmo")
    if slow:
        a, b = start + slow[0], start + slow[1]
        pieces = [(start, a, speed), (a, b, 0.5), (b, end, speed)]
    else:
        pieces = [(start, end, speed)]

    chains, labels = [], []
    for i, (s, e, sp) in enumerate(p for p in pieces if p[1] - p[0] > 0.01):
        chains.append(
            f"[0:v]trim={s}:{e},setpts=(PTS-STARTPTS)/{sp},{','.join(base)}[p{i}]"
        )
        labels.append(f"[p{i}]")
    graph = ";".join(chains) + f";{''.join(labels)}concat=n={len(labels)}:v=1:a=0[v]"
    if seg.get("text"):
        graph = graph[:-3] + "[c];[c]" + text_filter(seg["text"], dur=True) + "[v]"

    run([
        "ffmpeg", "-y", "-v", "error", "-i", src, "-filter_complex", graph,
        "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
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
    os.makedirs(os.path.dirname(output), exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        seg_files = []
        for i, seg in enumerate(edit["segments"]):
            p = os.path.join(tmp, f"seg{i:03d}.mp4")
            print(f"[{i + 1}/{len(edit['segments'])}] {seg['file']} {seg['start']}-{seg['end']}s")
            render_segment(seg, raw_dir, p)
            seg_files.append(p)

        listing = os.path.join(tmp, "list.txt")
        with open(listing, "w") as f:
            f.writelines(f"file '{p}'\n" for p in seg_files)
        joined = os.path.join(tmp, "joined.mp4")
        run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", listing,
             "-c", "copy", joined])

        # Persistent handle watermark + fade-in from black. No audio track:
        # Instagram sounds get added in the app.
        post = "fade=in:st=0:d=0.25"
        if edit.get("handle"):
            post += "," + text_filter(edit["handle"], y_expr="h*0.06", size=44)
        run(["ffmpeg", "-y", "-v", "error", "-i", joined, "-vf", post, "-an",
             "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
             "-r", str(FPS), "-movflags", "+faststart", output])
    print(f"Done -> {output}")


if __name__ == "__main__":
    main()
