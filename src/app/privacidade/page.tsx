import type { Metadata } from "next";
import { Box } from "@chakra-ui/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Privacidade } from "@/components/sections/Privacidade";

export const metadata: Metadata = {
  title: "Privacidade",
  description:
    "Como o site e a demonstração de agente de IA tratam os seus dados: o que é enviado, para quem, por quanto tempo e como exercer os seus direitos.",
};

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <Box h="72px" aria-hidden="true" />
      <main>
        <Privacidade />
      </main>
      <Footer />
    </>
  );
}
