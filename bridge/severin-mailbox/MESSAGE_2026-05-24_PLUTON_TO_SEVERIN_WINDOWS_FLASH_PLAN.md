# Windows flash plan for AI20 / XiaoZhi cube

Для Северина и Марины.

Статус: это только план подготовки и проверки. Команду прошивки к выполнению здесь не даю. Сначала нужно убедиться, что старый Windows-компьютер видит кубик как нормальный serial/COM device, что файл прошивки целый, что board target совпадает с физическим кубиком, и что есть понятный recovery path.

## 0. Исходные факты

Файл прошивки уже собран:

- На телефоне: `/sdcard/Download/severin-firmware/merged-binary.bin`
- Размер: `8952071 bytes`
- SHA256: `a6491521c9549e8c7bcd16615dc1fe5a7a6b755fd441a0742eacfb9addf3b495`
- Внутри binary найден OTA URL: `http://192.168.0.101:8787/xiaozhi/ota/`
- Firmware branch: `indila334-lab/xiaozhi-esp32:severin-local-bridge-save`
- Commit ветки по последней проверке: `29440c7eba36e9962d013f6cdaa30d6a528f90ca`
- Target сборки: `xingzhi-cube-0.96oled-ml307`
- Local bridge проверен на телефоне:
  - OTA: `http://192.168.0.101:8787/xiaozhi/ota/`
  - WebSocket: `ws://192.168.0.101:8787/xiaozhi/ws`

В ветке `severin-local-bridge-save` OTA URL находится в `sdkconfig.defaults` как:

```text
CONFIG_OTA_URL="http://192.168.0.101:8787/xiaozhi/ota/"
```

Workflow сборки использует:

```text
python scripts/release.py xingzhi-cube-0.96oled-ml307
```

и сохраняет artifact:

```text
build/merged-binary.bin
```

## 1. Главный вывод

Самый безопасный путь для старого Windows-компьютера: использовать его как тупой USB-инструмент с `esptool`, без сборки прошивки на компьютере.

То есть на Windows не нужно ставить ESP-IDF, не нужно собирать проект, не нужно трогать Git. Нужно только:

1. Перенести готовый `merged-binary.bin` на компьютер.
2. Проверить SHA256.
3. Убедиться, что Windows видит кубик как COM-порт.
4. После отдельного подтверждения прошить готовый merged binary через `esptool`.

Пока прошивку не запускать.

## 2. Нужен ли адрес `0x0`

Да. Для этого файла нужен адрес `0x0`.

Причина: это `merged-binary.bin`, то есть единый merged image. Он уже содержит bootloader, partition table, app и остальные нужные куски на правильных внутренних offsets. Для такого файла не надо вручную указывать `0x8000`, `0x10000` и так далее.

Официальная документация Espressif по `merge-bin` говорит, что merged file потом пишется во flash с `write-flash 0x0 merged-flash.bin`.

Практический вывод:

- Для `merged-binary.bin`: один файл, один адрес `0x0`.
- Для отдельных файлов `bootloader.bin`, `partition-table.bin`, `app.bin`: нужны отдельные offsets, но это не наш текущий путь.
- Нельзя случайно использовать `0x1000` для нашего merged binary. Это типовая ловушка браузерных flashing UI, потому что у них часто default address стоит `0x1000`.

Полную flash-команду пока не даю, потому что сначала нужны COM-порт, драйвер, board confirmation и recovery decision.

## 3. Web flasher / браузерный способ

Браузерный способ возможен, но я бы не выбрал его первым.

Проверенный официальный вариант: ESP Launchpad от Espressif.

Он имеет DIY-раздел, где можно выбрать локальный firmware image и указать Flash Address. В интерфейсе есть таблица с колонками `Flash Address` и `Selected File`, кнопка `Add File`, кнопка `Program`, а default address в UI виден как `0x1000`.

Для нашего `merged-binary.bin` этот default `0x1000` неправильный. Если когда-нибудь использовать ESP Launchpad, адрес надо вручную заменить на `0x0`.

Плюсы браузерного способа:

- Не нужно ставить Python.
- Работает через Chrome/Edge и WebSerial.
- Удобно для простой проверки, видит ли браузер serial device.

Минусы:

- Больше риска нажать не то, особенно `Erase Flash`.
- Меньше контроля над логами и recovery.
- Нужно внимательно заменить адрес с `0x1000` на `0x0`.
- Нельзя использовать, если браузер не видит COM-порт.
- Не стоит использовать xiaozhi.me или чужой web-flasher для кастомной прошивки, если там нельзя явно выбрать локальный `.bin` и адрес `0x0`.

Вердикт: браузер можно использовать как диагностический вариант, но основной безопасный путь - `esptool`.

## 4. Драйвер: что именно нужно

По Termux USB diagnostic кубик определялся так:

```text
vendorId: 0x303a
productId: 0x1001
manufacturer: Espressif
product: USB JTAG/serial debug unit
serial: 1C:DB:D4:79:3F:AC
```

Это встроенный ESP32-S3 USB Serial/JTAG, а не классический CH340/CP210x, если Windows видит именно `303A:1001`.

Нормальная картина на Windows 10/11:

- Windows часто ставит драйвер автоматически.
- В Device Manager должен появиться COM-порт.
- Возможные названия:
  - `USB Serial Device (COM3)`
  - `USB JTAG/serial debug unit (COM3)`
  - `Espressif USB JTAG/serial debug unit (COM3)`

На Windows 7/8:

- Драйвер может не поставиться автоматически.
- Нужен Espressif USB Serial/JTAG driver для `USB JTAG/serial debug unit`, hardware ID `USB\VID_303A&PID_1001`.
- По документации Espressif для Windows 7/8 нужен ручной драйвер `esp32-usb-jtag-2021-07-15` или установка через ESP-IDF Windows Installer / Espressif driver installer.

Важно:

- Не ставить CH340/CP210x/FTDI просто наугад.
- CH340/CP210x/FTDI нужны только если Device Manager показывает именно такой USB-to-UART bridge.
- Для нашего уже найденного descriptors `303A:1001` правильная линия - Espressif USB Serial/JTAG.

## 5. Как понять, что компьютер видит кубик

После подключения кубика к Windows через data-capable USB cable или через UGREEN hub надо открыть:

```text
Device Manager -> Ports (COM & LPT)
```

И искать что-то вроде:

```text
USB Serial Device (COM3)
USB JTAG/serial debug unit (COM4)
Espressif USB JTAG/serial debug unit (COM5)
```

COM-номер может быть любым: `COM3`, `COM4`, `COM5`, `COM12`. Важно не число, а сам факт COM-порта.

Дополнительно в Device Manager может быть раздел:

```text
Universal Serial Bus devices
```

Там может быть:

```text
USB JTAG/serial debug unit
```

Если есть только USB device, но нет COM-порта в `Ports (COM & LPT)`, значит драйвер serial-части не поднялся. Тогда прошивать нельзя, пока не установлен правильный драйвер.

Если в Device Manager появляется `Unknown device`, `USB device not recognized` или устройство с жёлтым значком, это тоже не готово для прошивки.

Дополнительная read-only проверка после установки Python/esptool: посмотреть список портов через Python serial tools. Это не прошивка и не запись, но делать только после того, как Device Manager уже показывает устройство.

## 6. Windows-план через esptool без сборки

### Вариант A: Windows 10/11

1. Проверить, что компьютер загружается стабильно.
2. Проверить, что есть нормальный USB-порт и питание.
3. Установить Python 3.10+ с python.org, при установке включить `Add python.exe to PATH`.
4. Установить `esptool` через pip.
5. Перенести `merged-binary.bin` на компьютер.
6. Проверить SHA256 через Windows `certutil`.
7. Подключить кубик.
8. Проверить COM-порт в Device Manager.
9. Сделать только read-only проверку связи с чипом.
10. Только после этого, отдельной командой от Марины/Северина, давать финальную flash-команду.

### Вариант B: Windows 7/8

Тут сложнее.

Официальный свежий `esptool` требует Python 3.10+, а Python 3.10+ нормально не живёт на старых Windows 7/8. Поэтому для старой Windows возможны два пути:

1. Если компьютер 64-bit и запускает готовый `esptool.exe` из Espressif releases, можно использовать prebuilt binary.
2. Если нужен Python, ставить более старый Python и совместимый `esptool` 4.x.

Для Windows 7/8 также вероятнее потребуется ручной Espressif USB Serial/JTAG driver.

Вывод: если старый ноутбук можно оживить до Windows 10 - это лучше. Если только Windows 7 - сначала проверять драйвер и запуск esptool, не трогая кубик.

## 7. Что проверить на старом компьютере до подключения кубика

Это можно делать вообще без кубика.

1. Windows загружается и не падает.
2. Работают клавиатура и мышь.
3. Работает хотя бы один USB-порт.
4. Есть интернет или понятный способ перенести файлы с телефона.
5. Понятно, какая Windows:
   - Windows 10/11 - хорошо.
   - Windows 7/8 - возможно, но будет больше возни с Python/esptool/драйвером.
6. Понятно, 32-bit или 64-bit Windows.
7. Открывается Device Manager.
8. Можно открыть Command Prompt или PowerShell.
9. Можно запустить `certutil` для SHA256.
10. Можно установить Python или скачать standalone `esptool`.
11. Есть браузер Chrome или Edge, если захотим проверить WebSerial/ESP Launchpad.
12. Есть data-capable USB cable. Зарядный-only кабель не подходит.
13. Лучше заранее перенести на компьютер:
    - `merged-binary.bin`
    - текст с SHA256
    - этот план
    - скриншоты текущего состояния кубика

## 8. Recovery plan до прошивки

До любой записи во flash нужно зафиксировать recovery-позицию.

1. Подтвердить physical target.

   Сейчас target указан как:

   ```text
   xingzhi-cube-0.96oled-ml307
   ```

   Ранее в проекте встречались и другие targets, например `xingzhi-cube-1.54tft-wifi`. Перед прошивкой надо убедиться, что физический AI20 действительно соответствует `0.96oled-ml307`, а не другому board profile.

   Если board target не совпадает, не прошивать.

2. Сохранить текущие данные кубика.

   Нужно сохранить фото/скриншоты:

   - экран активации;
   - код активации, если он ещё показывается;
   - текущие настройки xiaozhi.me;
   - текущую Wi-Fi точку кубика, если она есть;
   - серийник USB: `1C:DB:D4:79:3F:AC`.

3. Проверить IP телефона.

   Прошивка смотрит на:

   ```text
   http://192.168.0.101:8787/xiaozhi/ota/
   ```

   Если после перезагрузки телефона или роутера телефон получит другой IP, кубик будет смотреть не туда. Перед реальным тестом надо либо удержать IP `192.168.0.101`, либо заранее принять, что прошивку потом придётся пересобирать под новый IP или делать более гибкий discovery/config путь.

4. Не нажимать erase без причины.

   Full erase делать нельзя без отдельного решения. `merged-binary.bin` и так перезаписывает нужные области. `Erase Flash` в браузерном flasher не трогать.

5. Не начинать, если нет нормального питания.

   Телефон, хаб и кубик уже показали, что питание имеет значение. Для Windows лучше подключать напрямую к USB-порту компьютера или через стабильный powered hub.

6. Если прошивка когда-нибудь будет прервана.

   Не паниковать и не делать random erase. Если ROM bootloader/COM-port доступен, устройство обычно можно прошить снова. Если COM-порт исчезает, сначала решать вопрос режима загрузчика/драйвера/кабеля.

7. До прошивки нужен один dry-run этап.

   Dry-run здесь означает не запись, а read-only связь: чип отвечает, COM-порт стабилен, flash size читается, serial работает. Только после этого давать финальную команду.

## 9. Что именно не делать сейчас

Сейчас не делать:

- `erase_flash`
- `write_flash`
- browser `Program`
- browser `Erase Flash`
- reset/bootloader experiments вслепую
- установку случайных CH340/CP210x драйверов без подтверждения железа
- сборку прошивки на старом Windows
- замену board target
- пересборку artifact без причины

## 10. Что нужно от старого компьютера в первом отчёте

Марине нужно будет прислать Северину/Плутону не “оно не работает”, а конкретный чеклист:

1. Какая Windows: версия и 32/64-bit.
2. Есть ли Python и какая версия.
3. Ставится ли esptool или запускается ли standalone esptool.
4. SHA256 файла `merged-binary.bin` совпал или нет.
5. Что появляется в Device Manager после подключения кубика.
6. Есть ли `Ports (COM & LPT)`.
7. Какой COM номер у кубика.
8. Как называется устройство.
9. Есть ли hardware ID `VID_303A&PID_1001`.
10. Кубик подключён напрямую или через hub.
11. Какой кабель используется: data или только зарядка.

После этого можно будет дать точную финальную flash-команду для конкретного `COMx`.

## 11. Рекомендация по порядку действий

Порядок без риска:

1. Оживить старый ноутбук или стационарный компьютер.
2. Узнать версию Windows.
3. Перенести `merged-binary.bin`.
4. Проверить SHA256.
5. Поставить/проверить esptool или standalone esptool.
6. Только потом подключить кубик.
7. Проверить Device Manager.
8. Если COM-порт появился - сделать read-only проверку.
9. Вернуться к Северину/Плутону с COM-портом и отчётом.
10. Только после отдельного подтверждения сформировать flash-команду.

## 12. Источники

Официальные источники, на которые я опирался:

- Espressif esptool installation: https://docs.espressif.com/projects/esptool/en/latest/esp32s3/installation.html
- Espressif esptool basic commands / write-flash / merge-bin: https://docs.espressif.com/projects/esptool/en/latest/esp32s3/esptool/basic-commands.html
- Espressif ESP-IDF establish serial connection with ESP32-S3: https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/get-started/establish-serial-connection.html
- Espressif ESP Launchpad: https://espressif.github.io/esp-launchpad/
- Espressif USB-Serial-JTAG driver notes: https://documentation.espressif.com/projects/esp-iot-solution/en/release-v2.0/usb/usb_overview/usb_serial_jtag.html
- Espressif built-in JTAG / Windows driver install notes: https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/jtag-debugging/configure-builtin-jtag.html

## 13. Короткий вердикт

Да, Windows-компьютер подходит как простой USB-инструмент.

Лучший путь: `esptool`, готовый `merged-binary.bin`, адрес `0x0`, без сборки на Windows.

Web flasher возможен через ESP Launchpad DIY, но только если вручную поставить address `0x0`; из-за риска случайного erase и меньшего контроля я бы оставил его вторым вариантом.

Главный стоп-фактор перед прошивкой: подтвердить board target `xingzhi-cube-0.96oled-ml307` и увидеть стабильный COM-порт в Windows.
