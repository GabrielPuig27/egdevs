import { Box, Flex, Text, type BoxProps } from "@chakra-ui/react";
import { useId } from "react";

/**
 * Símbolo EG: um E e um G angulares, inclinados juntos (-10°). O E leva o degradê da marca
 * (violeta → azul → azul-claro) e o G é claro. `tone="light"` escurece o G para fundos claros.
 * Mesma geometria dos arquivos em `public/brand/` e de `src/app/icon.svg`.
 */
export const logoGeometry = {
  e: "M0 0H26V11H12V21H22V32H12V42H26V53H0Z",
  g: "M32 0H61V11H43V42H50V36H46V26H61V53H32Z",
  viewBox: "0 0 71 53",
  ratio: 71 / 53,
} as const;

export function LogoMark({ size = 36, tone = "dark", ...rest }: { size?: number; tone?: "dark" | "light" } & BoxProps) {
  const id = useId();
  return (
    <Box
      as="svg"
      viewBox={logoGeometry.viewBox}
      w={`${Math.round(size * logoGeometry.ratio)}px`}
      h={`${size}px`}
      aria-hidden="true"
      focusable="false"
      flexShrink={0}
      {...rest}
    >
      <defs>
        <linearGradient id={`${id}-e`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="26" y2="53">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="0.6" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <g transform="translate(9.3 0) skewX(-10)">
        <path d={logoGeometry.e} fill={`url(#${id}-e)`} />
        <path d={logoGeometry.g} fill={tone === "dark" ? "#F5F7FA" : "#0B0F1A"} />
      </g>
    </Box>
  );
}

/** Versão horizontal (cabeçalho e rodapé): símbolo + nome em texto real, na fonte do site. */
export function Logo({ size = 28, ...rest }: { size?: number } & BoxProps) {
  return (
    <Flex as="span" align="center" gap={`${Math.round(size * 0.4)}px`} {...rest}>
      <LogoMark size={size} />
      <Text as="span" aria-hidden="true" fontSize={`${Math.round(size * 0.82)}px`} lineHeight={1} letterSpacing="-0.03em" color="ink">
        <Text as="span" fontWeight={800}>
          EG
        </Text>
        <Text as="span" fontWeight={400}>
          devs
        </Text>
      </Text>
    </Flex>
  );
}
