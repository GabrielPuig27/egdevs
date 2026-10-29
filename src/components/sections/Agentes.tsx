"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import { ChatLanchonete } from "@/components/agentes/ChatLanchonete";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { textosLanchonete } from "@/content/agentes/lanchonete/textos";
import { gutter } from "@/theme/layout";

const { pagina } = textosLanchonete;

/** Demonstração do agente: explicação à esquerda, conversa à direita (a conversa é o objeto aceso da página). */
export function Agentes() {
  return (
    <Box as="section" data-glow="agentes" aria-labelledby="agentes-titulo" px={gutter} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 28 }} overflow="hidden">
      <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "5fr 7fr" }} gap={{ base: 10, lg: 16 }} alignItems="start">
        {/* No celular o wrapper "some" (display: contents) para que o chat venha logo depois da
            introdução e as capacidades fiquem abaixo dele; no desktop é uma coluna fixa ao rolar. */}
        <Reveal display={{ base: "contents", lg: "block" }} position={{ lg: "sticky" }} top={{ lg: "15vh" }}>
          <Box order={1}>
            <Heading as="h1" id="agentes-titulo" textStyle="head" fontSize={{ base: "10vw", md: "clamp(2.75rem, 4.4vw, 4.25rem)" }} sx={{ textWrap: "balance" }}>
              {pagina.titulo}
            </Heading>
            <Text textStyle="body" color="muted" mt={6} maxW="46ch">
              {pagina.descricao}
            </Text>
          </Box>
          <Box order={3}>
            <Box as="ul" listStyleType="none" m={0} mt={{ lg: 8 }} p={0} display="grid" gap={4}>
              {pagina.capacidades.map((c) => (
                <Box as="li" key={c.titulo} display="flex" alignItems="flex-start" gap={4}>
                  <Box as="span" display="grid" placeItems="center" w="44px" h="44px" borderRadius="full" bg="surfaceRaised" color="accent" flexShrink={0}>
                    <Icon name={c.icone} size={20} />
                  </Box>
                  <Box>
                    <Text textStyle="body" fontWeight={700} lineHeight={1.2}>
                      {c.titulo}
                    </Text>
                    <Text textStyle="small" color="muted" mt={1} maxW="44ch">
                      {c.texto}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
            <Text textStyle="small" color="muted" mt={8} maxW="48ch">
              {pagina.aviso}
            </Text>
          </Box>
        </Reveal>

        <Reveal delay={100} order={2}>
          <ChatLanchonete />
        </Reveal>
      </Box>
    </Box>
  );
}
