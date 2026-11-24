import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gift, Lock } from "lucide-react";
import { AdminPanel } from "@/components/admin-panel";
import { LetterDialog } from "@/components/letter-dialog";
import { SEED, loadMissionaries, saveMissionaries, type Missionary } from "@/lib/missionaries";

export const Route = createFileRoute("/")({ component: Home });

const FACES = [0, 20, 40, 60, 80, 100, 120, 140, 160];

const PINS = [
  { left: "34%", top: "26%", tilt: "-8deg", delay: "0s" },
  { left: "56%", top: "30%", tilt: "7deg", delay: "0.4s" },
  { left: "28%", top: "46%", tilt: "6deg", delay: "0.8s" },
  { left: "60%", top: "48%", tilt: "-10deg", delay: "0.2s" },
  { left: "36%", top: "64%", tilt: "-4deg", delay: "1s" },
  { left: "54%", top: "66%", tilt: "9deg", delay: "0.6s" },
];

function Home() {
  const [list, setList] = useState<Missionary[]>(SEED);
  const [ready, setReady] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [gate, setGate] = useState("");
  const [gateError, setGateError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [flying, setFlying] = useState(false);
  const [drawn, setDrawn] = useState<Missionary | null>(null);

  useEffect(() => {
    setList(loadMissionaries());
    setReady(true);
  }, []);

  function update(next: Missionary[]) {
    setList(next);
    saveMissionaries(next);
  }

  function draw() {
    if (spinning || list.length === 0) return;
    setSpinning(true);
    setDrawn(null);
    window.setTimeout(() => {
      setFlying(true);
    }, 700);
    window.setTimeout(() => {
      const person = list[Math.floor(Math.random() * list.length)];
      setFlying(false);
      setSpinning(false);
      setDrawn(person);
    }, 1400);
  }

  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pt-8 pb-16">
      <Snow />
      <header className="relative z-10 text-center">
        <p className="text-xs tracking-[0.22em] text-gold uppercase">Natal na igreja</p>
        <h1 className="mt-2 font-display text-4xl leading-none text-fg sm:text-5xl">Árvore de Natal Missionária</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
          Sorteie uma carta. Dentro está uma pessoa do campo, com a vida dela em poucas linhas, e um caminho para ofertar.
        </p>
      </header>

      <div className="relative z-10 mt-2">
        <div className="stage" aria-hidden={false}>
          <div className="floor" />
          <div className={`tree-spin ${spinning ? "is-fast" : ""}`}>
            {FACES.map((angle) => (
              <img
                key={angle}
                src="/tree.webp"
                alt={angle === 0 ? "Árvore de Natal com tronco de madeira, estrela dourada e bolas vermelhas" : ""}
                className="tree-photo"
                style={{ transform: `rotateY(${angle}deg)` }}
              />
            ))}
            {PINS.map((pin) => (
              <span
                key={`${pin.left}-${pin.top}`}
                className="letter-pin"
                style={{ left: pin.left, top: pin.top, ["--tilt" as string]: pin.tilt, ["--delay" as string]: pin.delay }}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={draw}
            disabled={!ready || spinning || list.length === 0}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-crimson px-6 text-base font-semibold text-paper shadow-lg hover:bg-crimson-deep disabled:opacity-60"
          >
            <Gift className="size-5" />
            {spinning ? "Sorteando…" : "Sortear carta"}
          </button>
          <button
            type="button"
            onClick={() => {
              setAdminOpen((open) => !open);
              setGateError(false);
            }}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-gold/50 px-5 text-base font-semibold text-gold"
          >
            <Lock className="size-4" />
            Administração
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-muted">{list.length} cartas na árvore</p>
      </div>

      {adminOpen ? (
        <div className="relative z-10">
          {unlocked ? (
            <AdminPanel list={list} onChange={update} />
          ) : (
            <form
              className="mx-auto mt-6 w-full max-w-sm rounded-card border border-line bg-surface p-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (gate.trim() === "natal2026") {
                  setUnlocked(true);
                  setGateError(false);
                } else {
                  setGateError(true);
                }
              }}
            >
              <h2 className="font-display text-2xl">Área da igreja</h2>
              <p className="mt-1 text-sm text-muted">Senha de demonstração: natal2026</p>
              <label className="mt-3 block text-sm text-muted">
                Senha
                <input
                  type="password"
                  value={gate}
                  onChange={(event) => setGate(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-base text-fg"
                  autoComplete="current-password"
                />
              </label>
              {gateError ? <p className="mt-2 text-sm text-gold">Senha incorreta.</p> : null}
              <button type="submit" className="mt-3 min-h-11 w-full rounded-full bg-crimson font-semibold text-paper">
                Entrar
              </button>
            </form>
          )}
        </div>
      ) : null}

      {flying ? <span className="flying" /> : null}
      {drawn ? <LetterDialog person={drawn} onClose={() => setDrawn(null)} /> : null}
    </main>
  );
}

function Snow() {
  return (
    <div className="snow" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className="flake"
          style={{
            left: `${(index * 37) % 100}%`,
            animationDuration: `${9 + (index % 6)}s`,
            animationDelay: `${(index % 8) * 0.7}s`,
            opacity: 0.35 + (index % 4) * 0.15,
          }}
        />
      ))}
    </div>
  );
}
