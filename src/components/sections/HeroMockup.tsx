"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@/components/ui/Icon";

/**
 * Ilustração de um site de autopeças ("Recicle Autopeças") em notebook e celular, feita em HTML/CSS
 * (sem imagem pesada). É um exemplo visual de como entregamos um site, NÃO um cliente confirmado.
 * Os tamanhos usam unidades de contêiner (cqw), então a ilustração escala inteira com a largura.
 */

const screenBg = "linear-gradient(160deg, #0d1424 0%, #070a12 70%)";

function Tire({ size, ...rest }: { size: string } & React.ComponentProps<typeof Box>) {
  return (
    <Box
      aria-hidden="true"
      w={size}
      h={size}
      borderRadius="full"
      bg="radial-gradient(circle at 50% 50%, #1f2937 0 22%, #0b0f19 23% 34%, #1a2233 35% 38%, #05070d 39% 100%)"
      boxShadow="0 0 0 1px rgb(148 163 184 / 0.2), 0 0 40px rgb(124 58 237 / 0.25)"
      {...rest}
    />
  );
}

function MiniPill({ children, filled }: { children: React.ReactNode; filled?: boolean }) {
  return (
    <Box
      as="span"
      display="inline-block"
      px="1.6cqw"
      py="0.7cqw"
      borderRadius="0.8cqw"
      fontSize="1.35cqw"
      fontWeight={700}
      color="white"
      bg={filled ? "#16a34a" : "transparent"}
      border={filled ? "none" : "1px solid rgb(148 163 184 / 0.4)"}
    >
      {children}
    </Box>
  );
}

export function HeroMockup() {
  return (
    <Box as="figure" m={0} w="100%" maxW="640px" mx="auto">
      <Box
        role="img"
        aria-label="Ilustração de exemplo: site de uma loja de autopeças exibido em um notebook e em um celular."
        position="relative"
        w="100%"
        pb={{ base: 10, md: 12 }}
        sx={{ containerType: "inline-size" }}
      >
      {/* Notebook */}
      <Box position="relative" w="88%" aria-hidden="true">
        <Box
          borderRadius="1.6cqw 1.6cqw 0.6cqw 0.6cqw"
          border="1px solid"
          borderColor="lineStrong"
          bg="#05070d"
          p="1cqw"
          boxShadow="0 30px 80px -20px rgb(124 58 237 / 0.35)"
        >
          <Box borderRadius="0.8cqw" overflow="hidden" bg={screenBg} aspectRatio="16 / 10" position="relative">
            <Flex align="center" justify="space-between" px="3cqw" py="1.8cqw" borderBottom="1px solid" borderColor="rgb(148 163 184 / 0.14)">
              <Flex align="center" gap="1cqw">
                <Box w="2.2cqw" h="2.2cqw" borderRadius="0.5cqw" bg="#16a34a" />
                <Text fontSize="1.9cqw" fontWeight={800} color="white" lineHeight={1}>
                  Recicle
                </Text>
              </Flex>
              <Flex gap="2cqw" fontSize="1.2cqw" color="muted" display={{ base: "none", sm: "flex" }}>
                <span>Peças</span>
                <span>Marcas</span>
                <span>Serviços</span>
                <span>Contato</span>
              </Flex>
              <MiniPill filled>Orçamento</MiniPill>
            </Flex>
            <Box position="absolute" left="4cqw" top="14cqw" w="38cqw">
              <Text fontSize="3.6cqw" fontWeight={800} color="white" lineHeight={1.1} letterSpacing="-0.02em">
                Peças de qualidade para o seu veículo.
              </Text>
              <Text fontSize="1.35cqw" color="muted" mt="1.4cqw" lineHeight={1.5}>
                Catálogo organizado, atendimento rápido e entrega para a sua região.
              </Text>
              <Flex gap="1.2cqw" mt="2.2cqw">
                <MiniPill filled>Buscar peças</MiniPill>
                <MiniPill>Falar no WhatsApp</MiniPill>
              </Flex>
            </Box>
            <Tire size="32cqw" position="absolute" right="-2cqw" top="8cqw" />
            <Tire size="14cqw" position="absolute" right="26cqw" bottom="-3cqw" opacity={0.7} />
          </Box>
        </Box>
        <Box h="1.6cqw" mx="-3%" borderRadius="0 0 2cqw 2cqw" bg="linear-gradient(180deg, #2b3445, #141a27)" boxShadow="0 1px 0 rgb(255 255 255 / 0.1) inset" />
      </Box>

      {/* Celular */}
      <Box
        aria-hidden="true"
        position="absolute"
        right="0"
        bottom={{ base: "10px", md: "14px" }}
        w="27%"
        aspectRatio="9 / 18.5"
        borderRadius="4cqw"
        border="1px solid"
        borderColor="lineStrong"
        bg="#05070d"
        p="0.9cqw"
        boxShadow="0 24px 60px -12px rgb(0 0 0 / 0.7), 0 0 50px rgb(59 130 246 / 0.25)"
        animation="flutuar 7s ease-in-out infinite"
        sx={{ "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}
      >
        <Box h="100%" borderRadius="3.2cqw" overflow="hidden" bg={screenBg} position="relative" px="2.4cqw" py="2.6cqw">
          <Flex align="center" justify="space-between">
            <Text fontSize="2cqw" fontWeight={800} color="white" lineHeight={1}>
              Recicle
            </Text>
            <Icon name="menu" size={10} />
          </Flex>
          <Text fontSize="3.1cqw" fontWeight={800} color="white" lineHeight={1.12} mt="5cqw" letterSpacing="-0.02em">
            Peças de qualidade para o seu veículo.
          </Text>
          <Box mt="2.6cqw">
            <MiniPill filled>Buscar peças</MiniPill>
          </Box>
          <Tire size="20cqw" position="absolute" right="-4cqw" bottom="3cqw" />
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
        <Box as="span" display="grid" placeItems="center" w="36px" h="36px" borderRadius="8px" bgGradient="linear(135deg, brandFrom, brandTo)" color="white">
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
        Ilustração de exemplo, não é um cliente.
      </Text>
    </Box>
  );
}
