"use client";

import { Box, Flex, Grid, Heading, Link, Text } from "@chakra-ui/react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { aboutPrinciples, team } from "@/content/team";
import { gutter } from "@/theme/layout";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function About() {
  return (
    <Box as="section" id="sobre" data-glow="a" aria-labelledby="sobre-titulo" px={gutter} py={{ base: 16, md: 24 }}>
      <Grid templateColumns={{ base: "1fr", lg: "6fr 5fr" }} gap={{ base: 12, lg: 20 }} alignItems="start">
        <Reveal>
          <Text textStyle="small" color="accent" fontWeight={700} mb={3}>
            Sobre a EGdevs
          </Text>
          <Heading as="h2" id="sobre-titulo" textStyle="head" sx={{ textWrap: "balance" }}>
            Dois desenvolvedores, uma parceria para resolver problemas reais.
          </Heading>
          <Text textStyle="body" color="muted" mt={6} maxW="58ch">
            A EGdevs nasceu da parceria entre dois desenvolvedores que querem ajudar pequenas e médias empresas a usar a tecnologia a favor do negócio:
            sites que apresentam bem a empresa, atendimento que não deixa cliente sem resposta e campanhas que levam as pessoas certas até você.
          </Text>
          <Text textStyle="body" color="muted" mt={4} maxW="58ch">
            Estamos começando, e por isso o contato é direto: você fala com quem realmente desenvolve o seu projeto.
          </Text>

          <Grid as="ul" listStyleType="none" m={0} mt={10} p={0} gap={5}>
            {aboutPrinciples.map((p) => (
              <Flex as="li" key={p.title} gap={4} align="flex-start">
                <Box as="span" display="grid" placeItems="center" w="40px" h="40px" borderRadius="full" bg="accentTint" color="accent" flexShrink={0}>
                  <Icon name="check" size={20} />
                </Box>
                <Box>
                  <Text textStyle="body" fontWeight={700} lineHeight={1.3}>
                    {p.title}
                  </Text>
                  <Text textStyle="small" fontSize="md" color="muted" mt={1} maxW="52ch">
                    {p.text}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Grid>
        </Reveal>

        <Reveal delay={100}>
          <Heading as="h3" textStyle="lead" mb={4}>
            Quem desenvolve
          </Heading>
          <Grid as="ul" listStyleType="none" m={0} p={0} gap={4}>
            {team.map((m) => (
              <Flex as="li" key={m.name} layerStyle="card" p={5} gap={4} align="center">
                <Box
                  as="span"
                  display="grid"
                  placeItems="center"
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  bgGradient="linear(135deg, brandFrom, brandTo)"
                  color="white"
                  fontWeight={800}
                  fontSize="1.25rem"
                  flexShrink={0}
                  aria-hidden="true"
                >
                  {initials(m.name)}
                </Box>
                <Box minW={0}>
                  <Text textStyle="body" fontWeight={700} lineHeight={1.2}>
                    {m.name}
                  </Text>
                  <Text textStyle="small" color="muted">
                    {m.role}
                  </Text>
                  <Flex gap={4} mt={2}>
                    {m.links.map((l) => (
                      <Link key={l.href} href={l.href} isExternal textStyle="small" color="accent" fontWeight={700} textDecoration="none" _hover={{ color: "accentHover", textDecoration: "none" }}>
                        {l.label}
                      </Link>
                    ))}
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Grid>
        </Reveal>
      </Grid>
    </Box>
  );
}
