export type Missionary = {
  id: string;
  nome: string;
  idade: number | null;
  local: string;
  familia: string;
  gostos: string;
  texto: string;
};

const STORAGE_KEY = "arvore-missionarios-v1";

export const SEED: Missionary[] = [
  {
    id: "luana",
    nome: "Luana Silva",
    idade: 7,
    local: "Moçambique",
    familia: "Família Silva",
    gostos: "desenhar, cantar e brincar de boneca",
    texto:
      "Oi. Eu sou a Luana e tenho 7 anos. Moro com meus pais em Moçambique, onde eles contam de Jesus para as crianças da nossa rua. Gosto de desenhar, de cantar e de brincar de boneca depois da escola. Se a minha carta ficar com você neste Natal, a oferta ajuda a nossa casa e o dia a dia dos meus pais. Obrigada por lembrar da gente.",
  },
  {
    id: "joao",
    nome: "João Mendes",
    idade: 42,
    local: "Índia",
    familia: "Família Mendes",
    gostos: "visitar famílias e estudar a Bíblia",
    texto:
      "Paz. Sou o João. Sirvo com a minha família na Índia, entre pessoas que ainda estão conhecendo o Evangelho. A semana é feita de visitas, oração e estudo da Bíblia. Uma oferta neste Natal nos ajuda a comprar Bíblias e a permanecer no campo com mais tranquilidade. Obrigado por caminhar com a gente.",
  },
  {
    id: "ana",
    nome: "Ana Clara",
    idade: 12,
    local: "Peru",
    familia: "Família Souza",
    gostos: "futebol e histórias da Bíblia",
    texto:
      "Oi, eu sou a Ana Clara e tenho 12 anos. Minha família está no Peru, plantando uma igreja num bairro novo. Gosto de futebol e de ouvir as histórias da Bíblia com os meus irmãos. Se você escolher a nossa carta, saiba que a oferta chega numa casa de verdade, no meio do trabalho. A gente agradece.",
  },
  {
    id: "rita",
    nome: "Rita Gomes",
    idade: 58,
    local: "Guiné-Bissau",
    familia: "Família Gomes",
    gostos: "cozinhar e visitar as vizinhas",
    texto:
      "Olá. Meu nome é Rita. Tenho 58 anos e sirvo com meu esposo na Guiné-Bissau. Boa parte do meu dia é na cozinha e na casa das vizinhas, ouvindo e orando com elas. Uma oferta agora ajuda o aluguel da nossa base e as visitas que fazemos durante a semana. Fico grata por você ter aberto esta carta.",
  },
  {
    id: "mateus",
    nome: "Mateus Oliveira",
    idade: 16,
    local: "Senegal",
    familia: "Família Oliveira",
    gostos: "violão e futebol com os meninos do bairro",
    texto:
      "Oi, eu sou o Mateus e tenho 16 anos. Meus pais são missionários no Senegal. Eu ajudo no culto dos jovens e, quando sobra tempo, toco violão e jogo bola com os meninos da rua. Se você ofertar, isso sustenta a nossa família para continuarmos aqui. Valeu por pensar na gente neste Natal.",
  },
  {
    id: "pedro",
    nome: "Pedro Sato",
    idade: 4,
    local: "Japão",
    familia: "Família Sato",
    gostos: "carrinhos e desenhar",
    texto:
      "Oi! Eu sou o Pedro e tenho 4 anos. Meus pais contam de Jesus no Japão, e eu gosto de carrinhos e de desenhar o sol. A mamãe pediu para eu dizer que a sua oferta ajuda a nossa família a ficar por aqui. Obrigado. Feliz Natal.",
  },
];

export function letterBody(person: Missionary): string {
  const custom = person.texto.trim();
  if (custom) return custom;
  const age = person.idade ? `, tenho ${person.idade} anos` : "";
  const place = person.local
    ? ` Nossa família serve em ${person.local}.`
    : " Servimos no campo missionário.";
  const likes = person.gostos ? ` No dia a dia, o que me alegra é ${person.gostos}.` : "";
  return `Sou ${person.nome}${age}.${place}${likes} Se esta carta ficou com você neste Natal, uma oferta ajuda a nossa rotina de verdade: casa, deslocamento e o cuidado com as pessoas ao redor. A gente agradece por lembrar de nós.`;
}

export function loadMissionaries(): Missionary[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as Missionary[];
    if (!Array.isArray(parsed)) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

export function saveMissionaries(list: Missionary[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
