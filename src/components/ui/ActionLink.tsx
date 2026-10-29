"use client";

import { Link, type LinkProps } from "@chakra-ui/react";

export type ActionVariant = "primary" | "outline" | "ghost";

interface ActionLinkProps extends LinkProps {
  /** primary: ação principal (degradê da marca). outline: ação secundária (contorno laranja). ghost: ação neutra. */
  variant?: ActionVariant;
  /** md: 52px (padrão). sm: 42px (cabeçalho, cartões). */
  size?: "md" | "sm";
}

const variants = {
  primary: {
    bgGradient: "linear(135deg, brandFrom, brandTo)",
    color: "onBrand",
    border: "1px solid",
    borderColor: "transparent",
    _hover: { filter: "brightness(1.15)", transform: "translateY(-2px)" },
  },
  outline: {
    bg: "transparent",
    color: "ink",
    border: "1px solid",
    borderColor: "accentLine",
    _hover: { bg: "accentTint", borderColor: "accent", transform: "translateY(-2px)" },
  },
  ghost: {
    bg: "transparent",
    color: "ink",
    border: "1px solid",
    borderColor: "line",
    _hover: { bg: "surfaceRaised", borderColor: "lineStrong", transform: "translateY(-2px)" },
  },
} as const;

/**
 * Botão do site (sempre um link real ou um `as="button"`): três variantes com a mesma altura, raio,
 * tipografia e transição. Hierarquia: um primário por área, o resto outline ou ghost.
 */
export function ActionLink({ variant = "primary", size = "md", children, ...rest }: ActionLinkProps) {
  const v = variants[variant];
  const small = size === "sm";
  return (
    <Link
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      gap={2}
      px={small ? 4 : 6}
      minH={small ? "42px" : "52px"}
      textStyle={small ? "small" : "body"}
      fontWeight={700}
      borderRadius="control"
      textDecoration="none"
      whiteSpace="nowrap"
      transition="transform 0.2s ease, filter 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease"
      {...v}
      _hover={{ textDecoration: "none", ...v._hover }}
      _active={{ transform: "translateY(0)" }}
      _focusVisible={{ outline: "2px solid", outlineColor: "accent", outlineOffset: "3px" }}
      _disabled={{ opacity: 0.45, cursor: "not-allowed", transform: "none", pointerEvents: "none" }}
      {...rest}
    >
      {children}
    </Link>
  );
}
