"use client";

import { Box, Flex, IconButton, Link } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ActionLink } from "@/components/ui/ActionLink";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { navigation } from "@/config/navigation";
import { gutter } from "@/theme/layout";

const linkStyle = {
  position: "relative",
  textStyle: "small",
  fontWeight: 600,
  color: "ink",
  textDecoration: "none",
  py: 2,
  transition: "color 0.2s ease",
  _hover: { color: "accent", textDecoration: "none" },
} as const;

const hrefFor = (id: string) => (id === "inicio" ? "/" : `/#${id}`);

/**
 * Cabeçalho fixo: logo, links por âncora e a ação principal. Compacta ao rolar. O link da seção
 * visível fica destacado (só na home, `aria-current="location"`). Abaixo de `lg` os links viram
 * um painel acionado por botão (Esc fecha e devolve o foco).
 */
export function Header() {
  const home = usePathname() === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (!home) return;
      // seção ativa: a última cujo topo já passou de 35% da altura da janela
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const l of navigation) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= line) current = l.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={50}
      px={gutter}
      pt={{ base: 2, md: 3 }}
      pointerEvents="none"
      animation="rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s both"
    >
      <Box
        position="relative"
        pointerEvents="auto"
        h={scrolled ? "56px" : "64px"}
        px={{ base: 3, md: 5 }}
        bg={scrolled ? "bg" : "rgb(11 15 26 / 0.8)"}
        border="1px solid"
        borderColor="line"
        borderRadius="bar"
        transition="height 0.3s ease, background-color 0.3s ease"
      >
        <Flex h="100%" align="center" justify="space-between" gap={4}>
          <Link href="/" aria-label="EGdevs, página inicial" display="inline-flex" alignItems="center" textDecoration="none" _hover={{ textDecoration: "none", opacity: 0.85 }}>
            <Logo size={scrolled ? 26 : 30} />
          </Link>

          <Flex as="nav" aria-label="Principal" gap={{ lg: 6, xl: 8 }} display={{ base: "none", lg: "flex" }}>
            {navigation.map((l) => {
              const on = active === l.id;
              return (
                <Link
                  key={l.id}
                  href={hrefFor(l.id)}
                  aria-current={on ? "location" : undefined}
                  {...linkStyle}
                  color={on ? "accent" : "ink"}
                  _after={{
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-2px",
                    h: "2px",
                    borderRadius: "full",
                    bgGradient: "linear(to-r, violet, blue)",
                    opacity: on ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </Flex>

          <Flex align="center" gap={2}>
            <ActionLink href="/#contato" size="sm" display={{ base: "none", sm: "inline-flex" }}>
              Falar com a gente
              <Icon name="arrow" size={16} />
            </ActionLink>
            <IconButton
              ref={toggle}
              display={{ base: "inline-flex", lg: "none" }}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((o) => !o)}
              icon={<Icon name={open ? "close" : "menu"} size={22} />}
              variant="unstyled"
              alignItems="center"
              justifyContent="center"
              w="42px"
              h="42px"
              minW="42px"
              color="ink"
              border="1px solid"
              borderColor="line"
              borderRadius="control"
              _hover={{ bg: "surfaceRaised", borderColor: "lineStrong" }}
            />
          </Flex>
        </Flex>

        {open && (
          <Box
            id="menu-mobile"
            display={{ lg: "none" }}
            position="absolute"
            top="calc(100% + 8px)"
            left={0}
            right={0}
            p={3}
            bg="bg"
            border="1px solid"
            borderColor="line"
            borderRadius="bar"
          >
            <Box as="nav" aria-label="Principal (menu)" display="grid" gap={1}>
              {navigation.map((l) => (
                <Link
                  key={l.id}
                  href={hrefFor(l.id)}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.id ? "location" : undefined}
                  display="flex"
                  alignItems="center"
                  minH="48px"
                  px={4}
                  borderRadius="control"
                  textStyle="body"
                  fontWeight={600}
                  color={active === l.id ? "accent" : "ink"}
                  textDecoration="none"
                  _hover={{ bg: "surfaceRaised", textDecoration: "none" }}
                >
                  {l.label}
                </Link>
              ))}
              <ActionLink href="/#contato" mt={2} onClick={() => setOpen(false)}>
                Falar com a gente
                <Icon name="arrow" size={18} />
              </ActionLink>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
