# Происхождение данных

## Текст Библии

Runtime-файл:

```text
packages/bible_parser_core/src/bible_parser_core/data/rst.json
```

основан на:

```text
https://github.com/bibleonline/rst
commit 2de3062388a2c067bc602399bda7149eec918ceb
parsed66/
```

Upstream-проект указывает для текста статус `Public Domain`, то есть
общественное достояние. Лицензия исходного кода LiVerse и статус данных
`bibleonline/rst` являются разными вещами.

Файл `rst.json` является форматированной сборкой для runtime LiVerse. Он не
является ручной копией неизвестного JSON-файла. Записи Псалтири с номером
стиха `0` не включаются, потому что runtime работает со ссылками вида
`книга глава:стих`.

Ожидаемый результат сборки из полного LiVerse-проекта:

- 66 книг;
- 1189 глав;
- 31 162 адресуемых стиха;
- последовательная нумерация глав и стихов без пропусков.

Wikipedia или другие справочные страницы могут использоваться только как
независимая проверка общей структуры. Источник текста и нумерации стихов -
`bibleonline/rst`, а не Wikipedia.

## Ручные исправления

Итоговый `rst.json` может отличаться от upstream-данных, потому что поверх
источника применяются документированные исправления из:

```text
packages/bible_parser_core/src/bible_parser_core/data/rst_overrides.json
```

Исправления должны фиксировать исходный текст, исправленный текст, причину и
способ проверки. Нельзя переносить формулировки из современного защищённого
авторским правом перевода без разрешения.

Итоговый `rst.json` следует описывать как текст, основанный на `bibleonline/rst`
и содержащий документированные редакционные исправления LiVerse.

## Воспроизводимая сборка

В полном LiVerse-проекте сборка выполняется так:

```bash
git clone https://github.com/bibleonline/rst.git \
  external_sources/bibleonline-rst
git -C external_sources/bibleonline-rst checkout \
  2de3062388a2c067bc602399bda7149eec918ceb

.venv/bin/python \
  packages/bible_parser_core/tools/build_rst_from_bibleonline.py
```

Проверка без изменения файла в полном LiVerse-проекте:

```bash
.venv/bin/python \
  packages/bible_parser_core/tools/build_rst_from_bibleonline.py --check
```

В этом standalone Vosk-репозитории сборщик пока не перенесён. До его переноса
`rst.json` и `rst_overrides.json` должны рассматриваться как данные,
скопированные из полного LiVerse-проекта с описанным выше происхождением.
