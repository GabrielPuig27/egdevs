"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Fragment } from "react";
import { textosLanchonete } from "@/content/agentes/lanchonete/textos";

const t = textosLanchonete;
export type FerramentaConhecida = keyof typeof t.chat.ferramentas;

/** Só **negrito** do texto do modelo, montado como elementos React (nunca como HTML). */
export function TextoComNegrito({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(\*\*[^*\n]+\*\*)/g).map((trecho, i) =>
        trecho.startsWith("**") && trecho.endsWith("**") && trecho.length > 4 ? (
          <strong key={i}>{trecho.slice(2, -2)}</strong>
        ) : (
          <Fragment key={i}>{trecho}</Fragment>
        ),
      )}
    </>
  );
}

export function Pontinhos() {
  return (
    <Flex aria-hidden="true" gap="6px" align="center" h="1.55em">
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          w="7px"
          h="7px"
          borderRadius="full"
          bg="muted"
          sx={{ "@media (prefers-reduced-motion: no-preference)": { animation: `pulso 1.2s ease-in-out ${i * 0.18}s infinite` } }}
        />
      ))}
    </Flex>
  );
}

/** Linha discreta que mostra o que o atendente consultou (andamento = ponto lima). */
export function ChipFerramenta({ nome, andamento }: { nome: FerramentaConhecida; andamento: boolean }) {
  const rotulos = t.chat.ferramentas[nome];
  return (
    <Flex align="center" gap={2} textStyle="small" color="muted">
      <Box as="span" w="6px" h="6px" borderRadius="full" bg={andamento ? "accent" : "muted"} flexShrink={0} aria-hidden="true" />
      {andamento ? `${rotulos.andamento}…` : rotulos.feito}
    </Flex>
  );
}

/** Bolha de mensagem. Visitante à direita (tom elevado), atendente à esquerda. */
export function Balao({ doUsuario, children }: { doUsuario: boolean; children: React.ReactNode }) {
  return (
    <Box
      maxW={{ base: "92%", md: "85%" }}
      px={4}
      py={3}
      textStyle="body"
      whiteSpace="pre-wrap"
      overflowWrap="anywhere"
      color="ink"
      bg={doUsuario ? "surfaceRaised" : "surface"}
      borderRadius="bar"
      borderBottomRightRadius={doUsuario ? "4px" : undefined}
      borderBottomLeftRadius={doUsuario ? undefined : "4px"}
      boxShadow={doUsuario ? "inset 0 0 0 1px rgb(255 255 255 / 0.14)" : "inset 0 0 0 1px rgb(255 255 255 / 0.06)"}
    >
      {children}
    </Box>
  );
}
