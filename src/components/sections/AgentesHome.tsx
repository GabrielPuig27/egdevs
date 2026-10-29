"use client";

import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Balao, ChipFerramenta, TextoComNegrito } from "@/components/agentes/ElementosChat";
import { ActionLink } from "@/components/ui/ActionLink";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { agentesMensagem, contactSectionHref, whatsappUrl } from "@/config/contact";
import { textosLanchonete } from "@/content/agentes/lanchonete/textos";
import { gutter } from "@/theme/layout";

const { home, chat } = textosLanchonete;
const contratarUrl = whatsappUrl(agentesMensagem);

/**
 * Apresenta a demonstração dos agentes e leva a /agentes. À esquerda, um trecho REAL de conversa
 * (resposta obtida do agente, não inventada); à direita, o texto e as ações. No celular o texto vem primeiro.
 */
export function AgentesHome() {
  return (
    <Box as="section" id="agentes" data-glow="agentes-home" aria-labelledby="agentes-home-titulo" px={gutter} py={{ base: 20, md: 28 }} overflow="hidden">
      {/* Um único Reveal para a grade toda: no celular ela passa de 70% da tela e o Reveal não a esconde. */}
      <Reveal>
        <Grid templateColumns={{ base: "1fr", lg: "6fr 5fr" }} gap={{ base: 12, lg: 20 }} alignItems="center">
          <Box order={{ base: 2, lg: 1 }}>
            <Box as="figure" m={0} aria-label={home.rotuloExemplo}>
              <Flex layerStyle="panel" direction="column">
                <Flex align="center" gap={3} px={{ base: 4, md: 6 }} py={4} bg="surface">
                  <Box as="span" display="grid" placeItems="center" w="44px" h="44px" borderRadius="full" bg="surfaceRaised" color="accent" flexShrink={0}>
                    <Icon name="chat" size={20} />
                  </Box>
                  <Box minW={0}>
                    <Text textStyle="body" fontWeight={700} lineHeight={1.2} noOfLines={1}>
                      {chat.nome}
                    </Text>
                    <Text textStyle="small" color="muted" noOfLines={1}>
                      {chat.papel}
                    </Text>
                  </Box>
                </Flex>
                <Flex direction="column" gap={5} px={{ base: 4, md: 6 }} py={6}>
                  <Flex direction="column" align="flex-end">
                    <Balao doUsuario>{home.exemplo.pergunta}</Balao>
                  </Flex>
                  <Flex direction="column" align="flex-start" gap={2}>
                    <Flex direction="column" gap={1} px={1}>
                      {home.exemplo.ferramentas.map((nome) => (
                        <ChipFerramenta key={nome} nome={nome} andamento={false} />
                      ))}
                    </Flex>
                    <Balao doUsuario={false}>
                      <TextoComNegrito texto={home.exemplo.resposta} />
                    </Balao>
                  </Flex>
                </Flex>
              </Flex>
              <Text as="figcaption" textStyle="small" color="muted" mt={4}>
                {home.legendaExemplo}
              </Text>
            </Box>
          </Box>

          <Box order={{ base: 1, lg: 2 }}>
            <Heading as="h2" id="agentes-home-titulo" textStyle="head" sx={{ textWrap: "balance" }}>
              {home.titulo}
            </Heading>
            <Text textStyle="body" color="muted" mt={5} maxW="46ch">
              {home.texto}
            </Text>
            <Text textStyle="body" mt={4} maxW="46ch">
              {home.demo}
            </Text>
            <Flex gap={3} mt={8} wrap="wrap">
              <ActionLink as={NextLink} href="/agentes" w={{ base: "100%", sm: "auto" }}>
                {home.testar}
                <Icon name="arrow" size={20} />
              </ActionLink>
              {contratarUrl ? (
                <ActionLink href={contratarUrl} target="_blank" rel="noopener noreferrer" variant="outline" w={{ base: "100%", sm: "auto" }}>
                  <Icon name="whatsapp" size={20} />
                  {home.contratar}
                </ActionLink>
              ) : (
                <ActionLink href={contactSectionHref} variant="outline" w={{ base: "100%", sm: "auto" }}>
                  {home.contratar}
                </ActionLink>
              )}
            </Flex>
          </Box>
        </Grid>
      </Reveal>
    </Box>
  );
}
