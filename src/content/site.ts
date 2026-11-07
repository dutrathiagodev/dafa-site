/**
 * Todo o conteúdo editável do site fica aqui.
 * Para adicionar um projeto novo, veja COMO-ATUALIZAR.md na raiz do projeto.
 */

export const contact = {
  whatsappNumber: "5543999001173",
  whatsappDisplay: "(43) 99900-1173",
  whatsappMessage:
    "Olá! Conheci a DAFA pelo site e gostaria de conversar sobre um projeto.",
  email: "dafagroupmarketing@gmail.com",
  instagram: "dafa_hub",
  city: "Santo Antônio da Platina",
  state: "PR",
} as const;

export const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  contact.whatsappMessage,
)}`;
export const instagramUrl = `https://www.instagram.com/${contact.instagram}/`;
export const emailUrl = `mailto:${contact.email}`;

export const brand = {
  name: "DAFA",
  tagline: "Gerenciamento de Conteúdo",
  title: "DAFA | Produtora Audiovisual e Gestão de Conteúdo",
  description:
    "Produção audiovisual, gerenciamento de conteúdo e tráfego pago em Santo Antônio da Platina e região. Conheça os projetos da DAFA.",
  pitch:
    "Unimos produção audiovisual e gerenciamento estratégico para transformar ideias em conteúdos com propósito.",
  quote:
    "Porque de nada adianta aparecer todos os dias, se ninguém entende o valor do que você oferece.",
} as const;

export type ServiceIcon =
  | "video"
  | "camera"
  | "calendar"
  | "pen"
  | "grid"
  | "megaphone";

export const services: {
  title: string;
  description: string;
  icon: ServiceIcon;
}[] = [
  {
    title: "Produção audiovisual",
    description:
      "Vídeos institucionais, comerciais, Reels e apresentação de produtos e serviços.",
    icon: "video",
  },
  {
    title: "Fotografia",
    description:
      "Fotos para comunicação comercial e apresentação de marcas, produtos e ambientes.",
    icon: "camera",
  },
  {
    title: "Gerenciamento de conteúdo",
    description:
      "Planejamento de pautas, organização da comunicação e conteúdo alinhado à marca.",
    icon: "calendar",
  },
  {
    title: "Roteiros e ideias criativas",
    description:
      "Conceitos e roteiros para vídeos, campanhas e conteúdos recorrentes.",
    icon: "pen",
  },
  {
    title: "Conteúdo para redes sociais",
    description:
      "Posts, carrosséis e materiais adaptados à identidade de cada empresa.",
    icon: "grid",
  },
  {
    title: "Tráfego pago",
    description:
      "Campanhas de anúncios para apoiar a divulgação e os objetivos comerciais.",
    icon: "megaphone",
  },
];

export const processSteps = [
  {
    title: "Entender",
    text: "Conhecemos o negócio, o público e o que precisa ser comunicado.",
  },
  {
    title: "Planejar",
    text: "Organizamos ideias, pautas e roteiros com objetivo claro.",
  },
  {
    title: "Produzir",
    text: "Captamos fotos e vídeos com cuidado de luz, enquadramento e som.",
  },
  {
    title: "Editar",
    text: "Finalizamos cada peça com ritmo, identidade e acabamento.",
  },
  {
    title: "Divulgar",
    text: "Organizamos a publicação e, quando faz sentido, o tráfego pago.",
  },
] as const;

export type Project = {
  slug: string;
  client: string;
  segment: string;
  /** Serviços realmente executados neste projeto. */
  services: string[];
  instagram?: string;
  /** "vertical" (9:16) ou "horizontal" (16:9). Nunca cortar o enquadramento. */
  format: "vertical" | "horizontal";
  media:
    | { type: "video"; src: string; preview: string; poster: string }
    | { type: "image"; src: string; width: number; height: number };
  /** Projeto da própria DAFA (institucional). */
  ownBrand?: boolean;
};

const v = (slug: string) => ({
  type: "video" as const,
  src: `/media/videos/${slug}.mp4`,
  preview: `/media/videos/${slug}-preview.mp4`,
  poster: `/media/posters/${slug}.webp`,
});

export const projects: Project[] = [
  {
    slug: "arnold-gym",
    client: "Arnold Gym",
    segment: "Academia · Santo Antônio da Platina – PR",
    services: ["Vídeo promocional", "Roteiro"],
    instagram: "arnoldgym_sap",
    format: "vertical",
    media: v("arnold-gym"),
  },
  {
    slug: "flore-ser",
    client: "Clínica Flore SER",
    segment: "Terapias holísticas, PNL e constelação familiar",
    services: ["Vídeos para redes sociais"],
    instagram: "flore_serclinica",
    format: "vertical",
    media: v("flore-ser"),
  },
  {
    slug: "flash-mobilidade",
    client: "Flash Mobilidade",
    segment: "Aplicativo de mobilidade",
    services: ["Apresentação do app", "Comunicação"],
    instagram: "flashdrivemobilidade",
    format: "vertical",
    media: v("flash-mobilidade"),
  },
  {
    // TODO(DAFA): confirmar nome do cliente e serviços executados.
    slug: "imobiliario",
    client: "Lançamento imobiliário",
    segment: "Mercado imobiliário",
    services: ["Produção audiovisual"],
    format: "vertical",
    media: v("imobiliario"),
  },
  {
    slug: "dafa-conteudo",
    client: "DAFA",
    segment: "Projeto da marca",
    services: ["Conteúdo institucional"],
    instagram: "dafa_hub",
    format: "vertical",
    media: v("dafa-conteudo"),
    ownBrand: true,
  },
  {
    // TODO(DAFA): confirmar cliente/contexto da fotografia.
    slug: "fotografia",
    client: "Ensaio fotográfico",
    segment: "Fotografia",
    services: ["Fotografia"],
    format: "vertical",
    media: {
      type: "image",
      src: "/media/img/fotografia.webp",
      width: 900,
      height: 1199,
    },
  },
];

export const showreel = {
  title: "DAFA — Gerenciamento de Conteúdo",
  src: "/media/videos/dafa-chamada.mp4",
  preview: "/media/videos/dafa-chamada-preview.mp4",
  poster: "/media/posters/dafa-chamada.webp",
};

export type TeamMember = {
  name: string;
  /** Cargo em inglês, como a DAFA usa. */
  role: string;
  bio?: string[];
  /** Caminho em /public (ex.: "/media/team/daniel.webp"). Sem foto, mostra a inicial. */
  photo?: string;
};

// TODO(DAFA): adicionar as fotos em public/media/team/ e preencher `photo`.
export const team: TeamMember[] = [
  {
    name: "Daniel",
    role: "CEO",
    bio: [
      "Daniel atua com produção audiovisual, criação e gerenciamento de conteúdo e tráfego pago. Seu trabalho une olhar criativo e estratégia para transformar ideias em vídeos, imagens e conteúdos que comuniquem a identidade e o valor de cada negócio.",
      "Com atuação em Santo Antônio da Platina e região, desenvolve projetos para empresas de diferentes segmentos, cuidando tanto da qualidade visual quanto da mensagem que cada conteúdo precisa transmitir.",
    ],
  },
  { name: "Fabiano", role: "Partner" },
];

export const faq = [
  {
    q: "Em quais cidades a DAFA atende?",
    a: "Atuamos em Santo Antônio da Platina – PR e região. Fale com a gente pelo WhatsApp para conferir o atendimento na sua cidade.",
  },
  {
    q: "Preciso contratar todos os serviços?",
    a: "Não. Cada projeto pode envolver apenas parte das etapas — só a produção de um vídeo, por exemplo, ou o gerenciamento completo do conteúdo. O escopo é definido com você.",
  },
  {
    q: "Vocês fazem vídeos para Instagram e Reels?",
    a: "Sim. Produzimos vídeos para redes sociais, Reels, conteúdos institucionais, apresentações de produtos e serviços e peças promocionais.",
  },
  {
    q: "A DAFA também cuida de anúncios?",
    a: "Sim. O tráfego pago complementa o trabalho, com campanhas para apoiar a divulgação dos conteúdos e os objetivos comerciais.",
  },
  {
    q: "Como peço um orçamento?",
    a: "Clique em “Solicite um orçamento” e fale com a DAFA pelo WhatsApp. Conte um pouco sobre o seu negócio e o que você precisa.",
  },
];
