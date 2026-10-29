"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

/**
 * Capturas reais do protótipo demonstrativo da Recicle Auto Peças em moldura de notebook e de celular.
 * É um exemplo do que entregamos, não um cliente confirmado: a legenda e a própria captura (faixa
 * "Protótipo demonstrativo") dizem isso.
 */
export function HeroMockup() {
  return (
    <Box as="figure" m={0} w="100%" maxW="640px" mx="auto">
      <Box position="relative" w="100%" pb={{ base: 10, md: 12 }}>
        {/* Notebook */}
        <Box position="relative" w="88%">
          <Box borderRadius="14px 14px 6px 6px" border="1px solid" borderColor="lineStrong" bg="#05070d" p="6px" boxShadow="0 30px 80px -20px rgb(249 115 22 / 0.3)">
            <Box borderRadius="8px" overflow="hidden" aspectRatio="16 / 10" position="relative">
              <Image
                src="/images/projects/recicle-auto-pecas/desktop-home-hero.webp"
                alt="Site de demonstração da Recicle Auto Peças em um notebook: página inicial com busca de peças por veículo."
                fill
                priority
                sizes="(min-width: 1024px) 560px, 90vw"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </Box>
          </Box>
          <Box aria-hidden="true" h="10px" mx="-3%" borderRadius="0 0 14px 14px" bg="linear-gradient(180deg, #2b3445, #141a27)" boxShadow="0 1px 0 rgb(255 255 255 / 0.1) inset" />
        </Box>

        {/* Celular */}
        <Box
          position="absolute"
          right="0"
          bottom={{ base: "10px", md: "14px" }}
          w="27%"
          aspectRatio="9 / 18.5"
          borderRadius="clamp(12px, 3.4vw, 26px)"
          border="1px solid"
          borderColor="lineStrong"
          bg="#05070d"
          p="4px"
          boxShadow="0 24px 60px -12px rgb(0 0 0 / 0.7), 0 0 50px rgb(249 115 22 / 0.22)"
          animation="flutuar 7s ease-in-out infinite"
          sx={{ "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}
        >
          <Box position="relative" h="100%" borderRadius="inherit" overflow="hidden" sx={{ borderRadius: "calc(clamp(12px, 3.4vw, 26px) - 4px)" }}>
            <Image
              src="/images/projects/recicle-auto-pecas/mobile-home-hero.webp"
              alt="Site de demonstração da Recicle Auto Peças em um celular."
              fill
              sizes="180px"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </Box>
        </Box>

        {/* Selo de IA */}
        <Flex
          aria-hidden="true"
          position="absolute"
          left={{ base: "2%", md: "6%" }}
          bottom="0"
          align="center"
          gap={3}
          pl={2}
          pr={4}
          py={2}
          bg="surface"
          border="1px solid"
          borderColor="lineStrong"
          borderRadius="control"
          boxShadow="0 16px 40px -12px rgb(0 0 0 / 0.6)"
        >
          <Box as="span" display="grid" placeItems="center" w="36px" h="36px" borderRadius="8px" bgGradient="linear(135deg, brandFrom, brandTo)" color="onBrand">
            <Icon name="bot" size={20} />
          </Box>
          <Text textStyle="small" fontWeight={600} lineHeight={1.25}>
            Atendimento com
            <br />
            IA no seu site
          </Text>
        </Flex>
      </Box>
      <Text as="figcaption" textStyle="small" color="muted" mt={3} textAlign="center">
        Protótipo demonstrativo da Recicle Auto Peças, não é um cliente. Dados e anúncios são ilustrativos.
      </Text>
    </Box>
  );
}
