# Reels

Scripted reel pipeline (ffmpeg). Produces a 1080x1920, 30fps, **silent** MP4
with a dark, light or no colour grade and optional slow zoom-ins. No on-screen text, and footage plays at real speed.
Add the music in Instagram using its sounds.

1. Drop raw clips in `reels/raw/` (git-ignored).
2. Edit `reels/edits/leg-day.json`: pick each clip's start/end.
3. `python3 reels/make_reel.py reels/edits/leg-day.json` → `reels/out/leg-day.mp4`

Requires `ffmpeg` (`apt-get install ffmpeg`).
