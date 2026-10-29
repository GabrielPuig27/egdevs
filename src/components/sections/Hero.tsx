"use client";

import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { HeroMockup } from "@/components/sections/HeroMockup";
import { ActionLink } from "@/components/ui/ActionLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import { gutter } from "@/theme/layout";

const highlights: readonly { icon: IconName; label: string }[] = [
  { icon: "target", label: "Projetos sob medida" },
  { icon: "check", label: "Foco em resultados" },
  { icon: "headset", label: "Suporte contínuo" },
  { icon: "shield", label: "Tecnologias modernas" },
];

export function Hero() {
  return (
    <Box as="section" id="inicio" data-glow="hero" aria-labelledby="hero-titulo" px={gutter} pt={{ base: "112px", md: "136px" }} pb={{ base: 12, md: 16 }} overflow="hidden">
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 12, lg: 10 }} alignItems="center">
        <Box animation="rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s both">
          <Flex
            as="p"
            display="inline-flex"
            align="center"
            gap={2}
            px={3}
            py={1}
            mb={6}
            textStyle="small"
            color="accent"
            border="1px solid"
            borderColor="accentLine"
            bg="accentTint"
            borderRadius="full"
          >
            <Icon name="bot" size={14} />
            Soluções digitais para o seu negócio
          </Flex>
          <Heading as="h1" id="hero-titulo" textStyle="display" sx={{ textWrap: "balance" }}>
            Sites, IA e Estratégia para{" "}
            <Box as="span" bgGradient="linear(to-r, #FB923C, #FBBF24)" bgClip="text" color="transparent">
              negócios reais.
            </Box>
          </Heading>
          <Text textStyle="body" color="muted" mt={6} maxW="52ch">
            Desenvolvemos sites modernos, agentes de IA, automações e estratégias digitais para ajudar empresas a atrair clientes e crescer no digital.
          </Text>
          <Flex gap={3} mt={8} wrap="wrap">
            <ActionLink href="#contato" w={{ base: "100%", sm: "auto" }}>
              Quero um orçamento
              <Icon name="arrow" size={18} />
            </ActionLink>
            <ActionLink href="#projetos" variant="outline" w={{ base: "100%", sm: "auto" }}>
              Ver nossos projetos
            </ActionLink>
          </Flex>
          <Grid as="ul" listStyleType="none" m={0} mt={{ base: 10, md: 12 }} p={0} templateColumns={{ base: "1fr 1fr", xl: "repeat(4, auto)" }} gap={{ base: 4, xl: 8 }} justifyContent="start">
            {highlights.map((h) => (
              <Flex as="li" key={h.label} align="center" gap={2} textStyle="small" color="muted">
                <Box as="span" color="accent" display="inline-flex">
                  <Icon name={h.icon} size={18} />
                </Box>
                {h.label}
              </Flex>
            ))}
          </Grid>
        </Box>

        <Box animation="rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.35s both">
          <HeroMockup />
        </Box>
      </Grid>
    </Box>
  );
}
