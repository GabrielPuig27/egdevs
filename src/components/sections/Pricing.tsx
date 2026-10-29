"use client";

import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ActionLink } from "@/components/ui/ActionLink";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { bundles, formatMoney, monthlyPlans, moneyParts, oneTimeServices, pricingDisclaimer } from "@/content/pricing";
import { announceInterest } from "@/lib/interest";
import { gutter } from "@/theme/layout";
import type { Bundle, Money, Offer } from "@/types/pricing";

type Billing = "unico" | "mensal";

const tabs: readonly { id: Billing; label: string }[] = [
  { id: "unico", label: "Pagamento único" },
  { id: "mensal", label: "Mensalidade" },
];

const panelCopy: Record<Billing, { title: string; text: string; unit: string; offers: readonly Offer[] }> = {
  unico: {
    title: "Serviços avulsos",
    text: "Implantação com pagamento único. Cada serviço é cobrado uma vez, sem mensalidade.",
    unit: "Pagamento único",
    offers: oneTimeServices,
  },
  mensal: {
    title: "Planos mensais",
    text: "Acompanhamento recorrente, cobrado por mês. Separado da implantação.",
    unit: "por mês",
    offers: monthlyPlans,
  },
};

function Price({ money, unit, size = "lg" }: { money: Money; unit: string; size?: "lg" | "md" }) {
  const { prefix, value } = moneyParts(money);
  return (
    <Box>
      {prefix && (
        <Text textStyle="small" color="muted">
          {prefix}
        </Text>
      )}
      <Text as="p" fontSize={size === "lg" ? { base: "1.75rem", md: "2rem" } : "1.5rem"} fontWeight={800} letterSpacing="-0.02em" lineHeight={1.1}>
        {value}
      </Text>
      <Text textStyle="small" color="muted" mt={1}>
        {unit}
      </Text>
    </Box>
  );
}

function Includes({ items }: { items: readonly string[] }) {
  return (
    <Box as="ul" listStyleType="none" m={0} p={0} display="grid" gap={2}>
      {items.map((item) => (
        <Flex as="li" key={item} gap={2} align="flex-start" textStyle="small" fontSize="md" color="ink">
          <Box as="span" color="sky" mt="3px" display="inline-flex">
            <Icon name="check" size={16} />
          </Box>
          {item}
        </Flex>
      ))}
    </Box>
  );
}

function OfferCard({ offer, unit }: { offer: Offer; unit: string }) {
  return (
    <Flex layerStyle="card" direction="column" h="100%" p={{ base: 5, md: 6 }} gap={5}>
      <Box>
        <Heading as="h4" textStyle="lead" fontSize={{ base: "1.125rem", md: "1.2rem" }}>
          {offer.name}
        </Heading>
        <Text textStyle="small" color="muted" mt={1}>
          {offer.description}
        </Text>
      </Box>
      <Price money={offer.price} unit={unit} />
      <Box flex="1" display="grid" gap={4} alignContent="start">
        <Includes items={offer.includes} />
        {offer.notes?.map((n) => (
          <Text key={n} textStyle="small" color="muted">
            {n}
          </Text>
        ))}
      </Box>
      <ActionLink
        href="#contato"
        w="100%"
        onClick={() => announceInterest({ service: offer.serviceId, message: `Tenho interesse em: ${offer.name} (${formatMoney(offer.price)}, ${unit.toLowerCase()}).` })}
      >
        Tenho interesse
        <Icon name="arrow" size={16} />
      </ActionLink>
    </Flex>
  );
}

function BundleCard({ bundle }: { bundle: Bundle }) {
  const { highlight } = bundle;
  return (
    <Flex
      direction="column"
      h="100%"
      p={{ base: 5, md: 6 }}
      gap={5}
      borderRadius="bar"
      position="relative"
      bg="surface"
      bgImage={highlight ? "linear-gradient(180deg, rgb(124 58 237 / 0.18) 0%, rgb(59 130 246 / 0.06) 100%)" : "linear-gradient(180deg, rgb(148 163 184 / 0.07) 0%, rgb(148 163 184 / 0.02) 100%)"}
      boxShadow={highlight ? "inset 0 0 0 1px rgb(167 139 250 / 0.7), 0 0 50px -12px rgb(124 58 237 / 0.45)" : "inset 0 0 0 1px rgb(148 163 184 / 0.14), inset 0 1px 0 rgb(255 255 255 / 0.06)"}
    >
      {highlight && (
        <Text
          as="span"
          alignSelf="flex-start"
          px={3}
          py="2px"
          borderRadius="full"
          textStyle="small"
          fontWeight={700}
          color="white"
          bgGradient="linear(135deg, brandFrom, brandTo)"
        >
          Mais completo
        </Text>
      )}
      <Box>
        <Heading as="h4" textStyle="lead" fontSize={{ base: "1.125rem", md: "1.2rem" }}>
          {bundle.name}
        </Heading>
        <Text textStyle="small" color="accent" fontWeight={700} mt={1}>
          {bundle.composition}
        </Text>
        <Text textStyle="small" color="muted" mt={2}>
          {bundle.description}
        </Text>
      </Box>

      {/* Implantação (uma vez) e cobrança recorrente em campos distintos. */}
      <Box display="grid" gap={4} pt={4} borderTop="1px solid" borderColor="line">
        <Box>
          <Text textStyle="small" color="muted" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" fontSize="0.75rem">
            Implantação
          </Text>
          <Price money={bundle.setup} unit="Pagamento único" size="md" />
        </Box>
        {bundle.recurring.map((r) => (
          <Box key={r.label} pt={4} borderTop="1px dashed" borderColor="line">
            <Text textStyle="small" color="muted" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" fontSize="0.75rem">
              {r.label}
            </Text>
            <Price money={r.price} unit="por mês" size="md" />
          </Box>
        ))}
      </Box>

      <Box flex="1" display="grid" gap={4} alignContent="start">
        <Includes items={bundle.includes} />
        {bundle.notes.map((n) => (
          <Text key={n} textStyle="small" color="muted">
            {n}
          </Text>
        ))}
      </Box>
      <ActionLink
        href="#contato"
        w="100%"
        onClick={() => announceInterest({ service: "pacote", message: `Tenho interesse no pacote: ${bundle.name} (${bundle.composition}).` })}
      >
        Solicitar orçamento
        <Icon name="arrow" size={16} />
      </ActionLink>
    </Flex>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("unico");
  const tabRefs = useRef<Record<Billing, HTMLButtonElement | null>>({ unico: null, mensal: null });
  const panel = panelCopy[billing];

  const select = (next: Billing, focus = false) => {
    setBilling(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  // Teclado do padrão WAI-ARIA de abas: setas, Home e End movem a seleção.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const order: Billing[] = ["unico", "mensal"];
    const i = order.indexOf(billing);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") select(order[(i + 1) % order.length] as Billing, true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") select(order[(i + order.length - 1) % order.length] as Billing, true);
    else if (e.key === "Home") select("unico", true);
    else if (e.key === "End") select("mensal", true);
    else return;
    e.preventDefault();
  };

  return (
    <Box as="section" id="planos" data-glow="c" aria-labelledby="planos-titulo" px={gutter} py={{ base: 16, md: 24 }}>
      <Reveal>
        <Flex justify="space-between" align={{ base: "flex-start", lg: "flex-end" }} direction={{ base: "column", lg: "row" }} gap={8}>
          <Box maxW="760px">
            <Text textStyle="small" color="accent" fontWeight={700} mb={3}>
              Planos e preços
            </Text>
            <Heading as="h2" id="planos-titulo" textStyle="head" sx={{ textWrap: "balance" }}>
              Escolha o plano ideal para o seu negócio.
            </Heading>
            <Text textStyle="body" color="muted" mt={5} maxW="62ch">
              Soluções para diferentes necessidades, com transparência e foco em resultados. {pricingDisclaimer}
            </Text>
          </Box>

          <Flex role="tablist" aria-label="Forma de cobrança" p="4px" gap="4px" bg="bgDeep" border="1px solid" borderColor="line" borderRadius="control" flexShrink={0} w={{ base: "100%", sm: "auto" }}>
            {tabs.map((t) => {
              const selected = billing === t.id;
              return (
                <Box
                  key={t.id}
                  as="button"
                  type="button"
                  role="tab"
                  id={`aba-${t.id}`}
                  aria-selected={selected}
                  aria-controls="painel-planos"
                  tabIndex={selected ? 0 : -1}
                  ref={(el: HTMLButtonElement | null) => {
                    tabRefs.current[t.id] = el;
                  }}
                  onClick={() => select(t.id)}
                  onKeyDown={onKeyDown}
                  flex={{ base: 1, sm: "none" }}
                  minH="44px"
                  px={5}
                  borderRadius="8px"
                  textStyle="small"
                  fontWeight={700}
                  color={selected ? "white" : "muted"}
                  bgGradient={selected ? "linear(135deg, brandFrom, brandTo)" : undefined}
                  cursor="pointer"
                  transition="color 0.2s ease, background-color 0.2s ease"
                  _hover={{ color: selected ? "white" : "ink" }}
                >
                  {t.label}
                </Box>
              );
            })}
          </Flex>
        </Flex>
      </Reveal>

      <Box id="painel-planos" role="tabpanel" aria-labelledby={`aba-${billing}`} tabIndex={0} mt={{ base: 8, md: 10 }} borderRadius="bar">
        <Heading as="h3" textStyle="lead">
          {panel.title}
        </Heading>
        <Text textStyle="small" fontSize="md" color="muted" mt={1}>
          {panel.text}
        </Text>
        <Grid as="ul" listStyleType="none" m={0} mt={6} p={0} templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={{ base: 4, md: 5 }}>
          {panel.offers.map((offer) => (
            <li key={offer.id}>
              <OfferCard offer={offer} unit={panel.unit} />
            </li>
          ))}
        </Grid>
      </Box>

      <Box mt={{ base: 14, md: 20 }}>
        <Reveal>
          <Heading as="h3" textStyle="lead">
            Pacotes integrados
          </Heading>
          <Text textStyle="small" fontSize="md" color="muted" mt={1} maxW="70ch">
            Combinações pensadas para quem quer resolver mais de uma frente de uma vez. Aqui a implantação e a mensalidade aparecem separadas.
          </Text>
        </Reveal>
        <Grid as="ul" listStyleType="none" m={0} mt={6} p={0} templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap={{ base: 4, md: 5 }}>
          {bundles.map((b, i) => (
            <Reveal as="li" key={b.id} delay={(i % 2) * 80}>
              <BundleCard bundle={b} />
            </Reveal>
          ))}
        </Grid>
        <Text textStyle="small" color="muted" mt={8} maxW="80ch">
          {pricingDisclaimer} Integrações adicionais e a verba de anúncios (quando houver tráfego pago) devem ser avaliadas e combinadas antes da contratação.
        </Text>
      </Box>
    </Box>
  );
}
