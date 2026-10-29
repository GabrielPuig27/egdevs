"use client";

import { Box, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { ActionLink } from "@/components/ui/ActionLink";
import { contactSectionHref } from "@/config/contact";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { privacidade } from "@/content/privacidade";
import { gutter } from "@/theme/layout";

/** Política de privacidade: resumo e contato à esquerda (fixos ao rolar), seções à direita. */
export function Privacidade() {
  return (
    <Box as="section" data-glow="privacidade" aria-labelledby="privacidade-titulo" px={gutter} pt={{ base: 8, md: 12 }} pb={{ base: 16, md: 28 }}>
      <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "4fr 7fr" }} gap={{ base: 10, lg: 20 }} alignItems="start">
        <Box position={{ lg: "sticky" }} top={{ lg: "15vh" }}>
          <Heading as="h1" id="privacidade-titulo" textStyle="head" sx={{ textWrap: "balance" }}>
            {privacidade.titulo}
          </Heading>
          <Text textStyle="body" color="muted" mt={6} maxW="46ch">
            {privacidade.resumo}
          </Text>
          <Text textStyle="small" color="muted" mt={4}>
            Atualizada em {privacidade.atualizadaEm}
          </Text>
          <Box display="flex" flexWrap="wrap" gap={3} mt={8}>
            <ActionLink href={privacidade.contatoEmail ? `mailto:${privacidade.contatoEmail}?subject=${encodeURIComponent("Privacidade")}` : contactSectionHref} w={{ base: "100%", sm: "auto" }}>
              <Icon name="mail" size={20} />
              {privacidade.contatoRotulo}
            </ActionLink>
            <ActionLink as={NextLink} href="/agentes" variant="outline" w={{ base: "100%", sm: "auto" }}>
              {privacidade.voltar}
              <Icon name="arrow" size={20} />
            </ActionLink>
          </Box>
        </Box>

        <Box as="article" display="grid" gap={{ base: 10, md: 12 }} maxW="68ch">
          {privacidade.secoes.map((secao, i) => (
            <Reveal as="section" key={secao.id} delay={Math.min(i, 3) * 60} aria-labelledby={`priv-${secao.id}`}>
              <Heading as="h2" id={`priv-${secao.id}`} textStyle="lead" fontWeight={700}>
                {secao.titulo}
              </Heading>
              {"paragrafos" in secao &&
                secao.paragrafos.map((texto) => (
                  <Text key={texto} textStyle="body" color="ink" mt={4}>
                    {texto}
                  </Text>
                ))}
              {"itens" in secao && (
                <Box as="ul" listStyleType="none" m={0} mt={4} p={0} display="grid" gap={4}>
                  {secao.itens.map((item) => (
                    <Box as="li" key={item.titulo}>
                      <Text textStyle="body" fontWeight={700} lineHeight={1.3}>
                        {item.titulo}
                      </Text>
                      <Text textStyle="body" color="muted" mt={1}>
                        {item.texto}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
            </Reveal>
          ))}
          <Text textStyle="small" color="muted">
            Dúvidas sobre esta página?{" "}
            {privacidade.contatoEmail ? (
              <>
                Escreva para{" "}
                <Link href={`mailto:${privacidade.contatoEmail}`} color="ink" textDecoration="underline" _hover={{ color: "accent" }}>
                  {privacidade.contatoEmail}
                </Link>
                .
              </>
            ) : (
              <>
                Fale com a gente pelo{" "}
                <Link as={NextLink} href={contactSectionHref} color="ink" textDecoration="underline" _hover={{ color: "accent" }}>
                  formulário de contato
                </Link>
                .
              </>
            )}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
