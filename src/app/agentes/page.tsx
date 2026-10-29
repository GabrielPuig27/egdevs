import type { Metadata } from "next";
import { Box } from "@chakra-ui/react";
import { Header } from "@/components/layout/Header";
import { Agentes } from "@/components/sections/Agentes";
import { Footer } from "@/components/sections/Footer";
import { textosLanchonete } from "@/content/agentes/lanchonete/textos";

export const metadata: Metadata = {
  title: textosLanchonete.pagina.metaTitulo,
  description: textosLanchonete.pagina.metaDescricao,
  // Fora dos buscadores até a demonstração ser validada e divulgada de propósito.
  robots: { index: false, follow: false },
};

export default function AgentesPage() {
  return (
    <>
      <Header />
      <Box h="72px" aria-hidden="true" />
      <main>
        <Agentes />
      </main>
      <Footer />
    </>
  );
}
