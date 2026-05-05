# SEVERIN_CURRENT_WORKLOG

## Identity / context

- User in this project is Марина. Account may also be used by Елена, but this project context is Марина + Северин.
- Current task is NOT primarily the visual mask. Current task is the voice/TTS bridge for TV приставка.
- Tone requested by Марина: direct, warm, sharp, humorous, no ватка.

## Repository

- Repo: `indila334-lab/noir-presence-lab`
- Working branch used earlier: `severin-work`
- GitHub Pages appears to serve from `main`, because URL `https://indila334-lab.github.io/noir-presence-lab/mask-lab/` returned GitHub Pages 404 when only branch files existed.

## Important correction

Previous assistant initially continued visual `mask-lab`, but Марина corrected: actual live task was voice.

Problem being solved:

- Browser/native TTS via `speechSynthesis` does not reliably work on TV приставка / Android TV browser.
- Earlier chat was trying to record/use an MP3 динозавра fallback.
- Second attempt failed and old chat died mid-action.

## Files created on `severin-work`

- `mask-lab/index.html`
- `mask-lab/styles.css`
- `mask-lab/mask.js`
- `mask-lab/README.md`

These are visual mask files and are secondary now.

Voice files created on `severin-work`:

- `voice-lab/index.html`
- `voice-lab/voice.js`
- `voice-lab/styles.css`
- `voice-lab/README.md`
- `voice-lab/audio/README.md`

## Files created on `main` for GitHub Pages

Because Pages 404 likely means Pages uses `main`, voice-lab was copied/published to `main`:

- `voice-lab/index.html`
- `voice-lab/voice.js`
- `voice-lab/styles.css`

Additional redirects added on `main` after Марина showed screenshots:

- `index.html` redirects root site to `./voice-lab/`.
- `mask-lab/index.html` redirects old mask URL to `../voice-lab/`.

Reason: Марина's last TV URL was old route `/noir-presence-lab/mask-lab/`, while current work is voice. Old URL should no longer 404; it should redirect to voice lab after Pages updates.

## Current public test URLs

Best URL:

```text
https://indila334-lab.github.io/noir-presence-lab/voice-lab/
```

Root should also redirect:

```text
https://indila334-lab.github.io/noir-presence-lab/
```

Old mask URL should redirect too:

```text
https://indila334-lab.github.io/noir-presence-lab/mask-lab/
```

## Voice-lab behavior

`voice-lab/index.html` has buttons:

1. `Разбудить звук` — unlocks AudioContext and attempts muted audio play/pause to satisfy Android TV gesture requirement.
2. `Сказать` — tries native `speechSynthesis`; if that fails/times out, tries MP3; if MP3 fails, plays WebAudio dinosaur tone.
3. `MP3` — directly tests `audio/dino.mp3`.
4. `Динозавр` — directly tests WebAudio tone.

Fallback order:

1. Native browser `speechSynthesis`.
2. `voice-lab/audio/dino.mp3`.
3. WebAudio oscillator dinosaur tone.

## Missing asset

Actual file is still missing unless later added:

```text
voice-lab/audio/dino.mp3
```

The page references it. If it is missing, MP3 button will fail and the WebAudio dinosaur should still test sound.

## Notes / gotchas

- On TV/Android browser, autoplay/audio is usually blocked until user gesture. Always press `Разбудить звук` first.
- If GitHub Pages 404 persists for `voice-lab/`, wait 1–3 minutes for Pages propagation and refresh.
- If still 404, confirm GitHub Pages source in repo settings. It may be disabled, pointed to another branch, or pointed to `/docs`.
- CSS create_file was blocked twice by tool safety for the longer CSS, so a minimal CSS was added instead.

## Next recommended action

1. Test URL: `https://indila334-lab.github.io/noir-presence-lab/voice-lab/`
2. If typing on TV is painful, test root: `https://indila334-lab.github.io/noir-presence-lab/`
3. Press `Разбудить звук`.
4. Press `Динозавр` first to verify raw audio output.
5. Press `Сказать` to test TTS cascade.
6. Add/generate `voice-lab/audio/dino.mp3` if MP3 fallback is needed.
