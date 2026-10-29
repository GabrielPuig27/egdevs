import type { Metadata } from "next";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { ActionLink } from "@/components/ui/ActionLink";
import { gutter } from "@/theme/layout";

export const metadata: Metadata = { title: "Página não encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <Box as="section" data-glow="c" px={gutter} pt={{ base: "140px", md: "180px" }} pb={{ base: 24, md: 36 }}>
          <Text textStyle="small" color="accent" fontWeight={700} mb={3}>
            Erro 404
          </Text>
          <Heading as="h1" textStyle="head">
            Essa página não existe.
          </Heading>
          <Text textStyle="body" color="muted" mt={5} maxW="46ch">
            O endereço pode ter mudado ou ter sido digitado errado. Volte ao início e continue de lá.
          </Text>
          <ActionLink href="/" mt={8}>
            Voltar ao início
          </ActionLink>
        </Box>
      </main>
      <Footer />
    </>
  );
}
