"use client";

import { Box, Grid, Heading, Link, Text } from "@chakra-ui/react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/content/services";
import { announceInterest } from "@/lib/interest";
import { gutter } from "@/theme/layout";

export function Services() {
  return (
    <Box as="section" id="servicos" data-glow="a" aria-labelledby="servicos-titulo" px={gutter} py={{ base: 16, md: 24 }}>
      <Reveal maxW="900px">
        <Text textStyle="small" color="accent" fontWeight={700} mb={3}>
          Soluções completas
        </Text>
        <Heading as="h2" id="servicos-titulo" textStyle="head" sx={{ textWrap: "balance" }}>
          Tudo o que seu negócio precisa para crescer no digital.
        </Heading>
        <Text textStyle="body" color="muted" mt={5} maxW="60ch">
          Da criação do site à atração de clientes, oferecemos soluções completas e personalizadas para o seu negócio.
        </Text>
      </Reveal>

      <Grid as="ul" listStyleType="none" m={0} mt={{ base: 10, md: 14 }} p={0} templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap={{ base: 4, md: 5 }}>
        {services.map((s, i) => (
          <Reveal as="li" key={s.id} delay={(i % 3) * 80}>
            <Box
              layerStyle="card"
              h="100%"
              p={{ base: 6, md: 7 }}
              display="flex"
              flexDirection="column"
              transition="transform 0.25s ease, box-shadow 0.25s ease"
              _hover={{ transform: "translateY(-4px)", boxShadow: "inset 0 0 0 1px rgb(167 139 250 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.08)" }}
            >
              <Box as="span" display="grid" placeItems="center" w="48px" h="48px" borderRadius="12px" bg="accentTint" color="accent" border="1px solid" borderColor="accentLine">
                <Icon name={s.icon} size={24} />
              </Box>
              <Heading as="h3" textStyle="lead" mt={5}>
                {s.title}
              </Heading>
              <Text textStyle="small" color="muted" mt={2} fontSize="md" flex="1">
                {s.description}
              </Text>
              <Link
                href="#contato"
                onClick={() => announceInterest({ service: s.id, message: `Tenho interesse em: ${s.title}.` })}
                mt={5}
                display="inline-flex"
                alignItems="center"
                gap={2}
                alignSelf="flex-start"
                textStyle="small"
                fontWeight={700}
                color="accent"
                textDecoration="none"
                _hover={{ color: "accentHover", textDecoration: "none" }}
              >
                Solicitar orçamento
                <Icon name="arrow" size={16} />
              </Link>
            </Box>
          </Reveal>
        ))}
      </Grid>
    </Box>
  );
}
