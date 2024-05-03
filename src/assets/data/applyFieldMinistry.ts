import { Part } from "../../types/Part";

export const applyFieldMinistryParts = (lang: string) => {
  let parts: Part[] = [
    { partName: "Discussion", slug: "d" },
    { partName: "Bible reading", slug: "br" },
    { partName: "Starting a Conversation", slug: "sc" },
    { partName: "Following Up", slug: "fu" },
    { partName: "Making Disciples", slug: "md" },
    { partName: "Explaining Your Beliefs", slug: "eb" },
    { partName: "Talk", slug: "t" },
  ];
  if (lang === "pt-BR") {
    parts = [
      { partName: "Consideração", slug: "d" },
      { partName: "Leitura da Bíblia", slug: "br" },
      { partName: "Iniciando Conversas", slug: "sc" },
      { partName: "Cultivando o Interesse", slug: "fu" },
      { partName: "Fazendo Discípulos", slug: "md" },
      { partName: "Explicando suas Crenças", slug: "eb" },
      { partName: "Discurso", slug: "t" },
    ]
  }
  return parts;
};
