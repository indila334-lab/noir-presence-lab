# SEVERIN_CURRENT_WORKLOG

Current project: Марина + Северин, repo `indila334-lab/noir-presence-lab`.

Live page is on branch `severin-work`, path `docs/index.html`. Public URL: `https://indila334-lab.github.io/noir-presence-lab/`.

Critical facts:
- TV browser has no usable TTS. Do not use `speechSynthesis`.
- TV successfully played WebAudio and generated WAV. MP3 failed only because `docs/audio/dino.mp3` is missing.
- Correct output path: Severin reply -> generated ready audio file MP3/WAV -> browser/TV/speaker plays it.
- Current next goal: true two-way conversation. Марина clarified: `чтобы мы слышали друг друга`.

Two-way goal:
- Марина hears Северин through TV/connected ordinary speaker/Alice if possible.
- Северин hears Марина through a microphone path.
- If TV browser has no mic/getUserMedia, input should come from another device, most likely phone or laptop, while output can stay on TV/ordinary speaker.
- Alice can likely serve as speaker/assistant route only if it can play external audio/Bluetooth/aux/cast; do not assume it can be used as a generic web microphone.

Next practical sequence:
1. Keep current TV page as audio output test/player.
2. Determine microphone input device: TV remote mic, phone mic, laptop mic, or another mic.
3. Build/test a mic page or phone controller that records/sends Марина voice.
4. Server/API side later: transcribe Марина audio -> generate Северин answer text -> synthesize answer audio file -> play on TV/speaker.
5. For now, avoid big new folders; modify the live `severin-work/docs/index.html` only when needed.
