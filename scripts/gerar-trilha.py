"""Trilha de fundo dos vídeos do site, composta aqui por síntese (sem obra de
terceiros, sem amostra de ninguém). Acordes Am7, Fmaj7, Cmaj7, G6 em pad
suave, arpejo discreto e pulso leve. Feita para ficar baixa por baixo do texto.

Uso: python -I scripts/gerar-trilha.py <segundos> <saida.mp3> [ffmpeg]
"""
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

TAXA = 44100
BPM = 92
BATIDA = 60 / BPM
COMPASSO = 4 * BATIDA

# notas MIDI de cada acorde (pad) e do arpejo
ACORDES = [
    [57, 60, 64, 67],  # Am7
    [53, 57, 60, 64],  # Fmaj7
    [48, 52, 55, 59],  # Cmaj7
    [55, 59, 62, 64],  # G6
]


def hz(nota):
    return 440.0 * 2 ** ((nota - 69) / 12)


def pad(nota, dur):
    t = np.arange(int(dur * TAXA)) / TAXA
    f = hz(nota)
    som = sum(np.sin(2 * np.pi * f * d * t + fase) / (k + 1) ** 1.6
              for k, (d, fase) in enumerate([(1.0, 0), (1.003, 1.1), (0.997, 2.3), (2.0, 0.4), (3.0, 1.7)]))
    ataque = np.clip(t / 0.9, 0, 1)
    soltura = np.clip((dur - t) / 0.9, 0, 1)
    return som * ataque * soltura * 0.09


def pluck(nota, dur=0.9):
    t = np.arange(int(dur * TAXA)) / TAXA
    f = hz(nota + 12)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 5.5) * 0.05


def pulso(dur=0.35):
    t = np.arange(int(dur * TAXA)) / TAXA
    f = 55 * np.exp(-t * 18) + 42
    return np.sin(2 * np.pi * np.cumsum(f) / TAXA) * np.exp(-t * 11) * 0.16


def somar(saida, sinal, inicio):
    i = int(inicio * TAXA)
    fim = min(len(saida), i + len(sinal))
    if i < len(saida):
        saida[i:fim] += sinal[: fim - i]


def gerar(segundos):
    total = np.zeros(int(segundos * TAXA) + TAXA)
    n_compassos = int(np.ceil(segundos / COMPASSO))
    for c in range(n_compassos):
        t0 = c * COMPASSO
        acorde = ACORDES[c % len(ACORDES)]
        for nota in acorde:
            somar(total, pad(nota, COMPASSO + 0.6), t0)
        if c >= 1:  # arpejo entra no segundo compasso
            for b in range(8):
                somar(total, pluck(acorde[[0, 2, 1, 3, 2, 1, 3, 2][b]]), t0 + b * BATIDA / 2)
        if c >= 2:  # pulso leve no 1 e no 3
            for b in (0, 2):
                somar(total, pulso(), t0 + b * BATIDA)
    total = total[: int(segundos * TAXA)]
    # entrada e saída suaves
    n = len(total)
    env = np.ones(n)
    a, s = int(1.5 * TAXA), int(2.5 * TAXA)
    env[:a] = np.linspace(0, 1, a)
    env[-s:] = np.linspace(1, 0, s)
    total *= env
    total /= max(1e-9, np.max(np.abs(total))) / 0.5  # pico em -6 dB; o vídeo baixa mais
    estereo = np.stack([total, np.roll(total, int(0.012 * TAXA))], axis=1)
    return (estereo * 32767).astype(np.int16)


def main():
    segundos = float(sys.argv[1])
    saida = Path(sys.argv[2])
    ffmpeg = sys.argv[3] if len(sys.argv) > 3 else "ffmpeg"
    saida.parent.mkdir(parents=True, exist_ok=True)
    wav = saida.with_suffix(".wav")
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(TAXA)
        w.writeframes(gerar(segundos).tobytes())
    subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "128k", str(saida)], check=True)
    wav.unlink()
    print(saida, saida.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
