"use client";

import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { ActionLink } from "@/components/ui/ActionLink";
import { Icon } from "@/components/ui/Icon";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/content/projects";
import { gutter } from "@/theme/layout";

const featured = projects.filter((p) => p.featured);

/** Destaques na home; a lista completa fica em /projetos. */
export function Projects() {
  return (
    <Box as="section" id="projetos" data-glow="b" aria-labelledby="projetos-titulo" px={gutter} py={{ base: 16, md: 24 }}>
      <Reveal>
        <Flex justify="space-between" align={{ base: "flex-start", md: "flex-end" }} direction={{ base: "column", md: "row" }} gap={6}>
          <Box maxW="820px">
            <Text textStyle="small" color="accent" fontWeight={700} mb={3}>
              Projetos em destaque
            </Text>
            <Heading as="h2" id="projetos-titulo" textStyle="head" sx={{ textWrap: "balance" }}>
              Projetos que já saíram do papel.
            </Heading>
            <Text textStyle="body" color="muted" mt={5} maxW="62ch">
              Trabalhos do portfólio de Gabriel Puig, um dos fundadores da EGdevs. Em cada projeto, indicamos qual foi a participação.
            </Text>
          </Box>
          <ActionLink as={NextLink} href="/projetos" variant="outline" flexShrink={0}>
            Ver todos os projetos
            <Icon name="arrow" size={18} />
          </ActionLink>
        </Flex>
      </Reveal>

      <Grid as="ul" listStyleType="none" m={0} mt={{ base: 10, md: 14 }} p={0} templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={{ base: 4, md: 5 }}>
        {featured.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </Grid>
    </Box>
  );
}
