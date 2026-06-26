# Third-party data notices

## Russian Synodal Bible text

Runtime Bible text in
`packages/bible_parser_core/src/bible_parser_core/data/rst.json` is based on:

- Project: `bibleonline/rst`
- Repository: https://github.com/bibleonline/rst
- Source revision: `2de3062388a2c067bc602399bda7149eec918ceb`
- Input dataset: `parsed66`, the 66-book edition
- Upstream status stated by the project: Public Domain

The JSON file is a format conversion for LiVerse with documented editorial
corrections stored in
`packages/bible_parser_core/src/bible_parser_core/data/rst_overrides.json`.
It excludes Psalm title records numbered as verse `0` because they cannot be
addressed by the runtime reference format.

The resulting file may therefore differ from the upstream dataset. LiVerse
does not claim that its corrected runtime file is an unmodified copy of
`bibleonline/rst`. Corrections must not be copied from a copyright-protected
modern translation without permission.

Rebuild command:

```bash
git clone https://github.com/bibleonline/rst.git \
  external_sources/bibleonline-rst
git -C external_sources/bibleonline-rst checkout \
  2de3062388a2c067bc602399bda7149eec918ceb

.venv/bin/python \
  packages/bible_parser_core/tools/build_rst_from_bibleonline.py
```

The project source-code license and the stated Public Domain status of the
upstream Bible data are separate matters. See `docs/DATA_PROVENANCE.md` for the
correction procedure and provenance records.

The previously used gist and archived JSON files are not sources of the
published runtime Bible data.

## Excluded old runtime data

This standalone Vosk edition does not include the old LiVerse Whisper NER
model, sermon transcripts, annotation datasets, or web slide background.
