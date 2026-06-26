# LiVerse

Минимальный проект для распознавания библейских ссылок из живой русской речи через Vosk и вывода результата в Holyrics.

## Что есть внутри

- `tools/vosk_grammar_probe.py` - основной скрипт.
- `tools/analyze_vosk_probe_logs.py` - разбор логов распознавания.
- `packages/bible_parser_core` - парсер библейских ссылок и данные `rst.json`.

## Происхождение `rst.json`

Runtime-текст Библии в `packages/bible_parser_core/src/bible_parser_core/data/rst.json`
основан на `bibleonline/rst`, ревизия `2de3062388a2c067bc602399bda7149eec918ceb`,
набор `parsed66`. Подробности и команда воспроизводимой сборки описаны в
[`docs/DATA_PROVENANCE.md`](docs/DATA_PROVENANCE.md).

## Модель Vosk

Репозиторий включает модель:

`models/vosk-model-small-ru-0.22`

## Запуск

```bash
python3 tools/vosk_grammar_probe.py --text "неемия первая глава пятый стих"
```

Для микрофона:

```bash
python3 tools/vosk_grammar_probe.py
```

Чтобы вместе с JSONL-логом сохранить аудио последнего запуска:

```bash
python3 tools/vosk_grammar_probe.py --log-audio
```

Аудио пишется в `audio.wav` рядом с `events.jsonl`.

Если нужен вывод в Holyrics, задайте переменные окружения:

- `HOLYRICS_URL`
- `HOLYRICS_TOKEN`
- `HOLYRICS_ACTION`
- `HOLYRICS_THEME`

## Установка на Windows 10

1. Установите Python 3.10+.
2. Распакуйте проект.
3. Запустите `install-windows.ps1`.
4. Запускайте `run-liverse.cmd`.

## Установка на Linux

1. Установите Python 3.10+ и `make`.
2. Если `python3 -m venv` не работает, поставьте пакет `python3-venv` или аналогичный для вашего дистрибутива.
3. Запустите:

```bash
./install-linux.sh
make liverse
```

После установки можно запускать и напрямую:

```bash
liverse
```
