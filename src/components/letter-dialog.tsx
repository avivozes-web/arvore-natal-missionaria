import { useEffect, useState } from "react";
import { X } from "lucide-react";
import QRCode from "qrcode";
import type { Missionary } from "@/lib/missionaries";
import { letterBody } from "@/lib/missionaries";

const AMOUNTS = [30, 50, 100];

export function LetterDialog({
  person,
  onClose,
}: {
  person: Missionary;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState("");
  const [qr, setQr] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    let cancel = false;
    const payload = `PIX-DEMO|${person.id}|${person.nome}|campo=${person.local}`;
    QRCode.toDataURL(payload, {
      margin: 1,
      width: 140,
      color: { dark: "#2a241c", light: "#fff8ee" },
    }).then((url) => {
      if (!cancel) setQr(url);
    });
    return () => {
      cancel = true;
    };
  }, [person]);

  const chosen = custom.trim() ? Number(custom.replace(",", ".")) : amount;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg-deep/75 p-3 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="letter-title">
      <article className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-card border-4 border-crimson bg-paper px-5 py-6 text-ink shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-ink/70 hover:bg-ink/5"
          aria-label="Fechar carta"
        >
          <X className="size-5" />
        </button>
        <p className="text-center font-sans text-xs tracking-[0.18em] text-crimson uppercase">Carta da árvore</p>
        <h2 id="letter-title" className="mt-2 text-center font-display text-3xl leading-tight font-medium">
          {person.nome}
        </h2>
        <p className="mt-1 text-center text-sm text-ink/70">
          {[person.idade ? `${person.idade} anos` : null, person.local, person.familia]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p className="mt-4 text-base leading-relaxed whitespace-pre-wrap">{letterBody(person)}</p>
        {!person.texto.trim() && person.gostos ? (
          <p className="mt-3 text-sm text-ink/75 italic">Gosta de {person.gostos}.</p>
        ) : null}

        <div className="mt-5 rounded-xl bg-paper px-3 py-3 text-center ring-1 ring-ink/10">
          <p className="text-sm font-semibold">Pix desta pessoa</p>
          {qr ? (
            <img src={qr} alt="" width={140} height={140} className="mx-auto mt-2" />
          ) : (
            <div className="mx-auto mt-2 size-40 animate-pulse bg-ink/5" />
          )}
          <p className="mt-2 text-xs leading-snug text-ink/60">
            Demonstração. Quando a chave do Asaas estiver ligada, este QR recebe a oferta no nome de {person.nome.split(" ")[0]}.
          </p>
        </div>

        <p className="mt-4 text-center text-sm font-semibold">Ou escolha um valor no cartão</p>
        <div className="mt-2 flex justify-center gap-2">
          {AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setAmount(value);
                setCustom("");
                setNote("");
              }}
              className={`min-h-11 min-w-16 rounded-full px-3 text-sm font-semibold ${
                !custom && amount === value ? "bg-crimson text-paper" : "bg-ink/5 text-ink"
              }`}
            >
              R$ {value}
            </button>
          ))}
        </div>
        <label className="mt-3 block text-sm">
          Outro valor
          <input
            inputMode="decimal"
            value={custom}
            onChange={(event) => {
              setCustom(event.target.value);
              setNote("");
            }}
            placeholder="R$"
            className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-base text-ink"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (!chosen || Number.isNaN(chosen) || chosen <= 0) {
              setNote("Informe um valor maior que zero.");
              return;
            }
            setNote(
              `R$ ${chosen.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ficam reservados para ${person.nome}. O checkout do Asaas abre aqui quando a conta estiver conectada.`,
            );
          }}
          className="mt-3 min-h-12 w-full rounded-full bg-crimson px-4 font-semibold text-paper hover:bg-crimson-deep"
        >
          Seguir para o checkout
        </button>
        {note ? <p className="mt-3 text-center text-sm leading-snug text-ink/80">{note}</p> : null}
      </article>
    </div>
  );
}
