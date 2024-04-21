import { useTranslation } from "react-i18next";

function Translator({ path }: { path: string }) {
  const { t } = useTranslation(); // Função que traduz

  return t(path);
}

export default Translator;
