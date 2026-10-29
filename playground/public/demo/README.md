# Mídias de demo do hero (locais, fora do git)

O `PageVideoHero` do playground, no modo **Loop**, usa um clipe de fundo que
**não** é versionado (ver `.gitignore`): é pesado e não deve carregar material
real de paciente no repositório do design system. Dropar aqui os arquivos
abaixo para o demo rodar:

| Arquivo             | Uso                  | Formato sugerido                       |
|---------------------|----------------------|----------------------------------------|
| `clip.mp4`          | Hero tipo **Loop**   | paisagem 16:9, ~1280×720, mudo, 8–12s  |
| `clip-poster.jpg`   | Capa do Loop         | 16:9, 1 frame do clip                  |

Clipes ambiente devem ser **genéricos** (sem pessoa real identificável) —
preferir stock livre ou geração por IA.

## Modo Player → não precisa de arquivo local

O hero tipo **Player** agora roda **o próprio vídeo do YouTube** (`h3a7DHFd6L4`)
mudo, em repetição, como fundo (16:9, cobrindo o cartão). Ao apertar o som, o
vídeo remonta do zero, com áudio e controles. Não há mais prévia local para o
Player — os antigos `mariangela.mp4` / `mariangela-poster.jpg` ficaram sem uso.
O quadro parado de movimento reduzido vem da miniatura do próprio YouTube
(`i.ytimg.com/vi/<id>/maxresdefault.jpg`), ou de um `poster` passado na prop.
