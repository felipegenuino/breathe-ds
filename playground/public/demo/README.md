# Mídias de demo do hero (locais, fora do git)

O `PageVideoHero` do playground, no modo **Loop**, usa um clipe de fundo que
**não** é versionado (ver `.gitignore`): é pesado e não deve carregar material
real de paciente no repositório do design system. Dropar aqui os arquivos
abaixo para o demo rodar:

| Arquivo             | Uso                  | Formato sugerido                       |
|---------------------|----------------------|----------------------------------------|
| `clip.mp4`          | Hero tipo **Loop**   | paisagem 16:9, ~1280×720, mudo, 8–12s  |
| `clip-poster.jpg`   | Capa do Loop         | 16:9, 1 frame do clip                  |
| `clip-vertical.mp4` | VideoStoryCard (9:16) | retrato 720×1280, mudo, recorte central do clip gerado |
| `clip-poster-vertical.jpg` | Capa do vertical | 9:16, 1 frame                          |
| `map-preview.webp`  | MapCard (prévia parada) | captura larga do mapa (2200×517), alfinete perto do topo/meio |
| `person.mp4` / `person-poster.jpg` | CtaCard (convite), retratos | clipe GERADO de uma pessoa (720×1280, mudo, 10s) |
| `person-vertical.mp4` / `person-poster-vertical.jpg` | VideoStoryCard | o mesmo clipe (já é 9:16) |
| `person-avatar.jpg` | Avatar / Byline / PersonChip | recorte quadrado do rosto, 320×320 |
| `invite-loop.mp4` / `invite-loop-poster.jpg` | VideoInviteCard (fase parada) | clipe GERADO da pessoa sorrindo, 1280×720, MUDO, 8s |
| `invite.mp4` / `invite-poster.jpg` | VideoInviteCard (ao tocar) | clipe GERADO da pessoa falando EM INGLÊS (convite para entrar em contato), 1280×720, com som, 10s; a versão anterior está em `~/Developer/_agent-temp/breathe-demo-prev/` |

Clipes ambiente devem ser **genéricos** (sem pessoa real identificável) —
preferir stock livre ou geração por IA. Os que estão aqui são o clipe gerado
(animação 2D) e o seu recorte vertical:

```bash
ffmpeg -i gerado.mp4 -vf "crop=405:720:437:0,scale=720:1280" -an -crf 24 clip-vertical.mp4
ffmpeg -ss 1 -i clip-vertical.mp4 -frames:v 1 -q:v 3 clip-poster-vertical.jpg
```

Nunca usar aqui filmagem real de paciente, mesmo fora do git: o playground é
visto em tela compartilhada e em capturas.

## Modo Player → MP4 gerado ou YouTube

O hero tipo **Player** roda **o próprio vídeo** mudo, em repetição, como fundo;
ao apertar o som, remonta do zero com áudio e controles. Duas fontes na demo:

| Arquivo | Origem | Uso |
|---|---|---|
| `podcast.mp4` + `podcast-poster.jpg` | `Woman_speaking_in_podcast_studio_7d7f2157.mp4` (gerado, 10 s, 1280×720, com fala) | Player · MP4 |
| YouTube `DdOoWDQutmk` | vídeo genérico, sem arquivo local | Player · YouTube |
| `assessment.jpg` | quadro aos 3 s de `invite.mp4` (horizontal, rosto ao centro) | CareSteps · passo 02 |

```bash
ffmpeg -i gerado.mp4 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k podcast.mp4
ffmpeg -ss 1 -i podcast.mp4 -frames:v 1 -q:v 4 podcast-poster.jpg
```

Antes (até 29/10/2026 à tarde) o Player usava o vídeo real da Mariangela no
YouTube (`h3a7DHFd6L4`); saiu da demo pela mesma regra das outras mídias reais.
No modo YouTube, o quadro parado de movimento reduzido vem da miniatura do
próprio YouTube (`i.ytimg.com/vi/<id>/maxresdefault.jpg`), ou de um `poster`.

## No GitHub Pages

O playground publicado em https://felipegenuino.github.io/breathe-ds/ pega estas
mídias do release `demo-media-1` (asset `breathe-demo-media.zip`), não do git.
Para trocar: gerar o zip de novo (só arquivos gerados, nunca paciente real) e
subir com `gh release upload demo-media-1 breathe-demo-media.zip --clobber`,
depois rodar o workflow "Playground on GitHub Pages".
