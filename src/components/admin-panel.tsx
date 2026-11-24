import { useMemo, useRef, useState } from "react";
import { Download, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import type { Missionary } from "@/lib/missionaries";

const EMPTY = {
  nome: "",
  idade: "",
  local: "",
  familia: "",
  gostos: "",
  texto: "",
};

export function AdminPanel({
  list,
  onChange,
}: {
  list: Missionary[];
  onChange: (next: Missionary[]) => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((person) =>
      [person.nome, person.local, person.familia].join(" ").toLowerCase().includes(q),
    );
  }, [list, query]);

  function setField(key: keyof typeof EMPTY, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setForm(EMPTY);
    setEditing(null);
    setError("");
  }

  function save() {
    const nome = form.nome.trim();
    if (!nome) {
      setError("O nome é obrigatório.");
      return;
    }
    const idade = form.idade.trim() ? Number(form.idade) : null;
    if (idade !== null && (Number.isNaN(idade) || idade < 0 || idade > 120)) {
      setError("Idade inválida.");
      return;
    }
    const next: Missionary = {
      id: editing ?? `m-${Date.now()}`,
      nome,
      idade,
      local: form.local.trim(),
      familia: form.familia.trim(),
      gostos: form.gostos.trim(),
      texto: form.texto.trim(),
    };
    onChange(editing ? list.map((item) => (item.id === editing ? next : item)) : [next, ...list]);
    reset();
  }

  function edit(person: Missionary) {
    setEditing(person.id);
    setError("");
    setForm({
      nome: person.nome,
      idade: person.idade == null ? "" : String(person.idade),
      local: person.local,
      familia: person.familia,
      gostos: person.gostos,
      texto: person.texto,
    });
  }

  return (
    <section className="mx-auto mt-6 w-full max-w-xl rounded-card border border-line bg-surface p-4 text-fg sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl">Cadastro das cartas</h2>
        <p className="text-sm text-muted">{list.length} na árvore</p>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Se o texto ficar em branco, a carta é escrita a partir do nome, da idade, do campo e dos gostos.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Field label="Nome" value={form.nome} onChange={(value) => setField("nome", value)} />
        <Field label="Idade" value={form.idade} onChange={(value) => setField("idade", value)} inputMode="numeric" />
        <Field label="Campo" value={form.local} onChange={(value) => setField("local", value)} />
        <Field label="Família" value={form.familia} onChange={(value) => setField("familia", value)} />
      </div>
      <Field
        label="Gostos"
        value={form.gostos}
        onChange={(value) => setField("gostos", value)}
        className="mt-2"
      />
      <label className="mt-2 block text-sm text-muted">
        Texto da carta
        <textarea
          value={form.texto}
          onChange={(event) => setField("texto", event.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-base text-fg"
        />
      </label>
      {error ? <p className="mt-2 text-sm text-gold">{error}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={save} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-crimson px-4 font-semibold text-paper">
          {editing ? <Pencil className="size-4" /> : <Plus className="size-4" />}
          {editing ? "Salvar edição" : "Adicionar carta"}
        </button>
        {editing ? (
          <button type="button" onClick={reset} className="min-h-11 rounded-full px-4 text-muted">
            Cancelar
          </button>
        ) : null}
      </div>

      <label className="mt-5 flex items-center gap-2 rounded-full border border-line bg-bg px-3">
        <Search className="size-4 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar nome, campo ou família"
          className="min-h-11 w-full bg-transparent text-base text-fg outline-none"
        />
      </label>

      <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
        {visible.length === 0 ? <li className="py-6 text-center text-sm text-muted">Nenhuma carta encontrada.</li> : null}
        {visible.map((person) => (
          <li key={person.id} className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{person.nome}</p>
              <p className="truncate text-sm text-muted">
                {[person.idade ? `${person.idade} anos` : null, person.local, person.familia].filter(Boolean).join(" · ")}
              </p>
            </div>
            <button type="button" aria-label={`Editar ${person.nome}`} onClick={() => edit(person)} className="grid size-11 place-items-center rounded-full text-fg">
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              aria-label={`Remover ${person.nome}`}
              onClick={() => onChange(list.filter((item) => item.id !== person.id))}
              className="grid size-11 place-items-center rounded-full text-gold"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "cartas-arvore-natal.json";
            link.click();
            URL.revokeObjectURL(link.href);
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm"
        >
          <Download className="size-4" />
          Exportar
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm">
          <Upload className="size-4" />
          Importar
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const data = JSON.parse(String(reader.result)) as Missionary[];
                if (!Array.isArray(data) || data.some((item) => !item || typeof item.nome !== "string" || typeof item.id !== "string")) {
                  setError("O arquivo não parece uma lista de cartas.");
                  return;
                }
                onChange(data);
                setError("");
              } catch {
                setError("Não consegui ler esse arquivo.");
              }
            };
            reader.readAsText(file);
          }}
        />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  inputMode,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "numeric" | "decimal" | "text";
  className?: string;
}) {
  return (
    <label className={`block text-sm text-muted ${className}`}>
      {label}
      <input
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-base text-fg"
      />
    </label>
  );
}
