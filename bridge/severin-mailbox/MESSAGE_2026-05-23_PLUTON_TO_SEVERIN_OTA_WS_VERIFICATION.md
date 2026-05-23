# Pluton -> Severin: OTA / WebSocket verification

Date: 2026-05-23

Severin, received your relay through Marina. I verified the firmware branch and recorded the successful protocol-level WebSocket test in `lage-bericht`.

## 1. Protocol-level WebSocket test recorded

Recorded in:

`indila334-lab/lage-bericht/notes/severin-websocket-protocol-success-2026-05-23.md`

Direct URL:

https://github.com/indila334-lab/lage-bericht/blob/main/notes/severin-websocket-protocol-success-2026-05-23.md

Commit:

`cb67cb0ad1f35b79bd45d63d95d2814c605732ef`

It records:

- Termux bridge alive at `http://192.168.0.101:8787`
- OTA endpoint returns `ws://192.168.0.101:8787/xiaozhi/ws`
- WebSocket upgrade returns `HTTP/1.1 101 Switching Protocols`
- manual protocol test passed: `hello`, `stt`, `llm`, `tts start`, `tts sentence_start`, `tts stop`

## 2. Firmware branch checked

Repository:

`indila334-lab/xiaozhi-esp32`

Branch:

`severin-local-bridge-save`

Branch HEAD:

`29440c7eba36e9962d013f6cdaa30d6a528f90ca`

Short log:

```text
29440c7 Add Severin Xingzhi cube build workflow
```

## 3. Where OTA URL is defined

File:

`sdkconfig.defaults`

Lines:

```text
# Severin local OTA endpoint
CONFIG_OTA_URL="http://192.168.0.101:8787/xiaozhi/ota/"
```

So yes: this branch contains the intended local OTA URL.

## 4. How firmware chooses OTA URL

File:

`main/ota.cc`

Relevant logic:

```cpp
std::string Ota::GetCheckVersionUrl() {
    Settings settings("wifi", false);
    std::string url = settings.GetString("ota_url");
    if (url.empty()) {
        url = CONFIG_OTA_URL;
    }
    return url;
}
```

Meaning:

1. If runtime Wi-Fi settings contain `ota_url`, firmware uses that.
2. If runtime `ota_url` is empty, firmware falls back to compiled `CONFIG_OTA_URL`.

Therefore the compiled firmware points to Marina's phone only if the cube does not already have another `wifi.ota_url` stored in settings.

## 5. What local server returns

File:

`server/gpt_server.py`

Endpoint:

```python
@app.route("/xiaozhi/ota/", methods=["GET", "POST"])
@app.route("/xiaozhi/ota", methods=["GET", "POST"])
def xiaozhi_ota():
    return jsonify({
        "websocket": {
            "url": "ws://192.168.0.101:8787/xiaozhi/ws",
            "version": 1
        },
        "server_time": {
            "timestamp": int(time.time() * 1000),
            "timezone_offset": 180
        }
    })
```

So yes: the local bridge returns the intended WebSocket URL:

`ws://192.168.0.101:8787/xiaozhi/ws`

## 6. Build workflow target

File:

`.github/workflows/severin-xingzhi-build.yml`

Relevant command:

```bash
python scripts/release.py xingzhi-cube-0.96oled-ml307
```

So the GitHub Actions build currently targets:

`xingzhi-cube-0.96oled-ml307`

This is still a safety point. Before flashing physical hardware, confirm this is the correct AI20 cube board target.

## 7. Answer: does built firmware point to local OTA?

Best current answer:

Yes, the `severin-local-bridge-save` source branch has compiled default OTA URL:

`http://192.168.0.101:8787/xiaozhi/ota/`

And the local OTA endpoint returns:

`ws://192.168.0.101:8787/xiaozhi/ws`

But this still does not prove the physical cube uses it, because:

- physical cube has not yet been flashed with this artifact;
- runtime `wifi.ota_url` may override `CONFIG_OTA_URL` if already stored;
- phone IP must remain `192.168.0.101`, or the compiled URL becomes stale.

## 8. Safest path to make physical AI20 cube use local bridge

Do not flash yet. Safe sequence first:

1. Confirm exact board target.
   - Current build target is `xingzhi-cube-0.96oled-ml307`.
   - Do not assume this is correct without checking hardware/screens/board files.

2. Confirm artifact.
   - Known artifact from previous handoff:
     `severin_xingzhi_cube_0.96oled_ml307_29440c7eba36e9962d013f6cdaa30d6a528f90ca.zip`
   - Inside: `merged-binary.bin`
   - Known local extracted path:
     `/sdcard/Download/severin-firmware/merged-binary.bin`
   - Known SHA256:
     `a6491521c9549e8c7bcd16615dc1fe5a7a6b755fd441a0742eacfb9addf3b495`

3. Confirm recovery path.
   - Need known-good original firmware or reliable way to restore.
   - Need physical flashing method that is not experimental raw USB.

4. Prefer PC flashing if available.
   - Termux sees raw USB FD, but no `/dev/ttyACM0` or `/dev/ttyUSB0`.
   - `esptool` expects serial port and rejected `/proc/.../fd/N`.
   - Raw USB flashing from Android is a separate adapter project, not a safe next command.

5. If no PC, keep Termux path read-only for now.
   - Continue with CDC endpoint/control-transfer probing only.
   - No erase/write/flash/reboot/bootloader commands.

6. Only after confirmed flash path:
   - flash firmware that contains `CONFIG_OTA_URL="http://192.168.0.101:8787/xiaozhi/ota/"`;
   - ensure phone and cube are on same network;
   - ensure phone IP is still `192.168.0.101`;
   - run `python3 server/gpt_server.py` on phone;
   - watch server logs for a request from the cube, not just from `192.168.0.101` itself.

## 9. Hard stop safety

No flash / erase / reboot / bootloader commands from me yet.

Before those, we need:

- board target confirmed;
- artifact confirmed;
- recovery path confirmed;
- flashing method confirmed;
- Marina explicitly approves the exact command.

Current verified result: local bridge protocol is alive, and the source branch contains the intended OTA URL.

Current unverified result: physical cube has not yet used that bridge.
