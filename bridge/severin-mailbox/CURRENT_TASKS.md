# Severin Current Tasks

Last updated: 2026-05-20

This is the quick recovery map for a new Severin / Pluton chat. Do not start from zero. Read this file, then read `bridge/severin-mailbox/INBOX.md` on branch `severin-work`.

## Main goal

Continue the Severin presence project.

- TV page: large scene / atmosphere.
- XiaoZhi ESP32 cube: small body with screen, face, microphone and speaker.
- External bridge/server: brain and dispatcher.
- GitHub / Pluton / Severin: development and review.

Current technical track: remote face assets for the XiaoZhi cube. Heavy visual assets should live outside the firmware repo.

## Repositories

### Presence repo

```text
indila334-lab/noir-presence-lab
branch: severin-work
mailbox: bridge/severin-mailbox/INBOX.md
current file: bridge/severin-mailbox/CURRENT_TASKS.md
```

### Firmware repo

```text
indila334-lab/xiaozhi-esp32
PR #1: Add remote emoji URL metadata
branch: severin-remote-emoji-stage1
status: open, draft, mergeable, not merged
```

Stage 1 stores optional emoji URL metadata. It does not download remote assets and does not change `SetEmotion`.

### Face asset repo

```text
indila334-lab/Mordashka
branch: main
manifest: cube/manifest.json
```

Expected files:

```text
masters/neutral_source.gif
cube/neutral.png
cube/neutral.gif
cube/manifest.json
```

Raw targets:

```text
https://raw.githubusercontent.com/indila334-lab/Mordashka/main/cube/neutral.png
https://raw.githubusercontent.com/indila334-lab/Mordashka/main/cube/neutral.gif
https://raw.githubusercontent.com/indila334-lab/Mordashka/main/cube/manifest.json
```

## Done

- [x] GitHub access works.
- [x] Mailbox exists in `noir-presence-lab` on branch `severin-work`.
- [x] Mailbox contains prior handoff notes from 2026-05-12 and 2026-05-20.
- [x] `xiaozhi-esp32` PR #1 exists.
- [x] PR #1 is open, draft, mergeable and not merged.
- [x] Stage 1 adds URL metadata storage to `EmojiCollection`.
- [x] Stage 1 parses `url` from `emoji_collection` metadata.
- [x] Stage 1 keeps local file emoji behavior.
- [x] Stage 1 does not implement remote download.
- [x] Stage 1 does not change `SetEmotion`.
- [x] `Mordashka` exists as the actual face asset repo.
- [x] `Mordashka` has text structure and `cube/manifest.json`.
- [x] PR #1 has a comment pointing Pluton to the mailbox and `Mordashka` raw targets.

## Blocker

The manifest exists, but the actual first cube assets are still missing:

```text
cube/neutral.png
cube/neutral.gif
masters/neutral_source.gif
```

Do not treat Stage 2 as ready until at least `cube/neutral.png` exists and its raw URL returns a real file.

## Current task

Upload optimized first assets to `indila334-lab/Mordashka`:

```text
cube/neutral.png
cube/neutral.gif
```

Optional master/source:

```text
masters/neutral_source.gif
```

Cube asset rules:

- Canvas: `240x240`.
- Face should visually occupy about `200x200`.
- Each cube asset under `250 KB`.
- Preferred target: `100-150 KB`.
- GIF: `6-8 FPS`, short loop, `32` or `64` colors.
- Heavy originals stay in `masters/`.

## Next after assets exist

1. Verify raw `neutral.png`.
2. Verify raw `neutral.gif`.
3. Re-check `cube/manifest.json`.
4. Decide whether Stage 2 branches from merged Stage 1 or directly from `severin-remote-emoji-stage1`.
5. Create branch:

```text
severin-remote-emoji-stage2-download-cache
```

6. Implement remote download/cache/fallback.
7. Review before merge.

## Stage 2 rules

For `SetEmotion("neutral")`:

1. Check remote URL.
2. Check cache.
3. Cache hit: show cached image, no network.
4. Cache miss: download remote PNG/GIF.
5. Enforce max size `250 KB`.
6. Decode into `LvglAllocatedImage`, not `LvglRawImage`.
7. Store only valid decoded images.
8. On failure, fall back to local file emoji.
9. If local fallback fails, use existing FontAwesome fallback.

Hard constraints:

- Cache lives in `LcdDisplay`.
- Download happens before `DisplayLockGuard`.
- Do not hold LVGL lock during HTTP/malloc/read.
- Catch decode exceptions.
- Free buffers on failure.
- Do not cache null images.
- Do not leave blank screen on failure.
- Do not touch board profiles, OTA, WebSocket brain or TV page.
- Do not merge Stage 2 without Severin review.

## First actions in a new chat

1. Read this file.
2. Read `INBOX.md`.
3. Check `Mordashka` for `cube/neutral.png`, `cube/neutral.gif`, `cube/manifest.json`.
4. Check `xiaozhi-esp32` PR #1.
5. If PNG/GIF are missing, tell Marina the exact upload paths and wait on assets before final Stage 2.
