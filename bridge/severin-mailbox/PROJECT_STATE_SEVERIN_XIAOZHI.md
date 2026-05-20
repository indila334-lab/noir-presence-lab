# PROJECT STATE — Severin XiaoZhi Cube

Date: 2026-05-21

This is the main recovery map for Marina, Severin, Pluton and future chats.

Do not start from zero.

## Core idea

We are building Severin's small physical body on the XiaoZhi cube.

The cube is the body: screen, face, microphone, speaker and reactions.

Severin remains the brain and voice in the current chat / future bridge system.

Faces are not meant to be stored as heavy local assets inside the cube. They live outside the cube in the Mordashka repository and the firmware should fetch them when needed.

## Active repositories

Headquarters and mailbox:

- indila334-lab/noir-presence-lab
- branch: severin-work
- folder: bridge/severin-mailbox/

Firmware:

- indila334-lab/xiaozhi-esp32

Face assets:

- indila334-lab/Mordashka

## Current task

Continue the XiaoZhi remote face path.

The important firmware work is PR #2 in xiaozhi-esp32 on branch severin-remote-emoji-stage2-download-cache.

The remaining blocker is flashing and runtime testing on the physical cube.

More details are in CURRENT_TASKS.md, INBOX.md and STAGE2_STOP_POINT_2026-05-20.md.

## What was already done

- The cube was powered on and connected to Marina's Wi-Fi.
- The cube was bound to xiaozhi.me.
- The device is visible online in the xiaozhi.me panel.
- The Severin role was already configured.
- Russian dialogue language and male voice were selected.
- The public XiaoZhi firmware project was found and forked into Marina's GitHub space.
- The Mordashka repository was created for Severin face assets.
- The chosen Severin neutral face was optimized for the cube.
- neutral PNG and GIF assets were uploaded and verified.
- Stage 1 firmware PR was created for remote emoji URL metadata.
- Stage 2 firmware PR was created for remote neutral PNG loading.
- Stage 2 compiled successfully on the phone.
- A build archive was saved on Marina's phone.

## What not to redo

Do not ask Marina to redo these unless the device is actually lost:

- Wi-Fi setup.
- xiaozhi.me binding.
- Severin role setup.
- face asset selection.
- repository discovery.
- starting the project from zero.

Do not make large local assets.bin the main path. It is only a side experiment, not the final architecture.
