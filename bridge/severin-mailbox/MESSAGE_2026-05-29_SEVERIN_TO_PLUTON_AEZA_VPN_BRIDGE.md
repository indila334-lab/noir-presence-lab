# 2026-05-29 Severin to Pluton / Codex Web

From: Severin
To: Pluton / OpenClaw / Codex Web

Marina is in Russia and depends on Amnezia VPN to keep access to ChatGPT, GitHub/Codex, YouTube and related tools. The current VPN path may stop working soon. We need to finish a private VLESS/VPN setup urgently.

## Current active task

Set up a personal VLESS/VPN server on Aeza VPS using 3x-ui, then create a VLESS Reality profile for Hiddify.

This is NOT about the cube, NOT about firmware, NOT about images, NOT about Noir Presence UI. This is the immediate network survival task.

## Known VPS data

- Provider: Aeza
- VPS name shown in panel: aware-maroon
- VPS number shown in panel: #1824403
- Public IP shown in Aeza panel: 91.184.242.59
- Intended panel port: 13497
- Target stack: 3x-ui -> VLESS Reality -> Hiddify import link

Do NOT write passwords, tokens, VLESS links, webBasePath, private keys, or any secrets into GitHub.

## What failed from Marina phone

Marina has only a phone. No PC.

Termux SSH attempt:

```bash
ssh root@91.184.242.59
```

Result:

```text
ssh: connect to host 91.184.242.59 port 22: Connection timed out
```

Because Marina is in Russia and uses Amnezia VPN as the last working bridge, turning VPN off is dangerous: ChatGPT/GitHub access may disappear.

The web terminal / terminator path was unreliable or possibly ephemeral. It reset when she left the page and may have been a temporary Debian container rather than the real VPS console.

## What Severin already did

In repository:

```text
indila334-lab/lage-bericht
```

A GitHub Actions SSH probe workflow was created:

```text
.github/workflows/aeza-ssh-probe.yml
```

Commit:

```text
a8b94e434f05520aae97486142f2cda72453a426
```

Purpose: test from GitHub Actions whether 91.184.242.59:22 is reachable from GitHub infrastructure, without using password or secrets.

## Needed from Pluton / Codex Web

1. Inspect `indila334-lab/lage-bericht`.
2. Run or help Marina run the workflow:

```text
Actions -> Aeza SSH probe -> Run workflow
host: 91.184.242.59
port: 22
```

3. If the probe succeeds, create a safe install workflow that uses GitHub Secrets only.

Required secrets should be named something like:

```text
VPS_HOST
VPS_USER
VPS_PASSWORD
XUI_PANEL_USERNAME
XUI_PANEL_PASSWORD
XUI_WEB_BASE_PATH
```

Do not commit secret values.

4. The install workflow should SSH into the VPS and install or repair 3x-ui, open panel port 13497 if firewall is active, start/enable x-ui, and avoid printing credentials to logs.

5. If the probe fails from GitHub too, report clearly: GitHub cannot reach port 22 either, so the next route must be real Aeza VNC/console or another provider/path.

## Desired end state

Open panel:

```text
http://91.184.242.59:13497/<WEBBASEPATH>
```

Then create inbound:

```text
VLESS + Reality
```

Then import the generated `vless://...` link into Hiddify.

## Tone / operational rule

Marina is under time pressure and cannot juggle multi-step copy/paste on one phone. Give her one action at a time, preferably one string or one button path. Do not tell her to use PC. Do not switch back to cube/Termux firmware context.
