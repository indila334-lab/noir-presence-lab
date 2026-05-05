# SEVERIN_CURRENT_WORKLOG

## Identity / context

- User in this project is Марина. Account may also be used by Елена, but this project context is Марина + Северин.
- Current task is voice/audio bridge for TV приставка.
- Tone requested by Марина: direct, warm, sharp, humorous, no ватка.

## Repository

- Repo: `indila334-lab/noir-presence-lab`
- The actually working page is in branch `severin-work`, path `docs/index.html`.
- Марина explicitly corrected: «В северине она» = working page is in `severin-work`.
- Do NOT start by creating new random folders on `main`. Work in the actual Pages page: `severin-work/docs/index.html`.

## Core goal

Make audio for a TV приставка browser.

Final architecture:

```text
Severin reply text -> generated ready audio file MP3/WAV -> TV browser plays file
```

The TV browser is only a player, not a TTS engine.

## Critical correction

Марина confirmed:

```text
На ТВ приставке в браузере ттс не существует.
```

Therefore browser TTS / `speechSynthesis` must be treated as unavailable and should not be part of the plan.

Previous attempts with `speechSynthesis` were wrong for this target. Do not resurrect TTS zombie.

## Correct sequence

1. Work in `severin-work/docs/index.html`, because this is the page that opened on TV as «Маска Аудио».
2. First unlock audio by user gesture.
3. Test WebAudio dinosaur only as a raw sound/output check.
4. Test generated WAV/object URL as proof that the TV can play ready audio files.
5. Add actual audio asset, e.g. `docs/audio/dino.mp3`.
6. Later generate one ready audio file per Severin reply and update/play that file.

## Current `severin-work/docs/index.html`

Updated to id:

```text
audio-file-005
```

It intentionally disables/removes browser TTS path.

Buttons:

1. `Разбудить звук — теперь с коротким пиком`.
2. `Динозавр WebAudio`.
3. `Сгенерированный WAV-файл`.
4. `Проверить docs/audio/dino.mp3`.
5. `Проверить звук по очереди`.

## Real TV test results from Марина

On TV page id `audio-file-004`:

1. Button 1: no audible sound / nothing obvious clicked. Interpreted as expected because it was silent unlock. In `audio-file-005`, button 1 was changed to audible short beep.
2. Button 2: sound exists, described as “как будто что-то шмякнулось”. This confirms WebAudio/raw audio output works on TV.
3. Button 3: sound exists, described as “что-то космическое из 80х”. This confirms generated WAV/object URL playback works on TV.
4. Button 4 MP3: did not play. This is expected because `docs/audio/dino.mp3` has not been added yet.

Conclusion: the correct path is confirmed. TV can play ready generated audio. Next work is adding/generating real speech audio files, not using browser TTS.

## Existing wrong/secondary files

Earlier assistant created files that are secondary and not the live path:

- `mask-lab/*` on `severin-work`
- `voice-lab/*` on `severin-work`
- `voice-lab/*` and redirects on `main`

Do not focus on those unless Марина asks cleanup. Current live work is `severin-work/docs/index.html`.

## Public/opening notes

If GitHub Pages is configured as branch `severin-work` with folder `/docs`, then public site root is:

```text
https://indila334-lab.github.io/noir-presence-lab/
```

Do not assume `/voice-lab/` is live. It 404ed because Pages is not serving those files.

## Missing next asset

Need to add or generate real file:

```text
severin-work/docs/audio/dino.mp3
```

or use WAV if MP3 pipeline is annoying.

## Next recommended action

1. Ask Марина to refresh the working `Маска Аудио` page until id becomes `audio-file-005`.
2. Press `Разбудить звук — теперь с коротким пиком`.
3. Press `Динозавр WebAudio`.
4. Press `Сгенерированный WAV-файл`.
5. Since WAV works, next build task is generating/uploading real speech audio files, not browser TTS.
