"use client";

import { Box, type BoxProps } from "@chakra-ui/react";
import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface RevealProps extends BoxProps {
  /** Atraso em ms, para escalonar as partes de uma seção. */
  delay?: number;
}

/**
 * Entrada discreta (opacidade + 24px de deslocamento), disparada uma vez.
 * O conteúdo nasce visível: só é "armado" depois da hidratação e apenas se estiver abaixo da dobra,
 * então sem JavaScript nada fica escondido.
 */
export function Reveal({ delay = 0, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    // Blocos altos (mais de ~70% da tela, como o formulário no celular) não são escondidos:
    // esperar a entrada de algo tão grande seria um buraco na página.
    if (rect.top > window.innerHeight * 0.9 && rect.height < window.innerHeight * 0.7) setArmed(true);
  }, [reduce]);

  const hidden = armed && !inView;

  return (
    <Box
      ref={ref}
      opacity={hidden ? 0 : 1}
      transform={hidden ? "translateY(24px)" : "none"}
      transition={`opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`}
      {...rest}
    >
      {children}
    </Box>
  );
}
