ffmpeg -y -i $1  -vf fps=24,scale=512:-1:flags=lanczos,palettegen palette.png

ffmpeg -i $1 -i palette.png -filter_complex "fps=24,scale=512:-1:flags=lanczos[x];[x][1:v]paletteuse" out.gif