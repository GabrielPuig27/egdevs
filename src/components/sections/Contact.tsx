"use client";

import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ActionLink } from "@/components/ui/ActionLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { contactEmail, emailUrl, hasContactChannel, hasEmail, hasWhatsapp, whatsappDisplay, whatsappUrl } from "@/config/contact";
import { interestOptions } from "@/content/services";
import { INTEREST_EVENT, type InterestDetail } from "@/lib/interest";
import { gutter } from "@/theme/layout";

const field = {
  bg: "surface",
  color: "ink",
  borderRadius: "control",
  border: "1px solid",
  borderColor: "line",
  h: "52px",
  px: 4,
  textStyle: "body",
  _placeholder: { color: "muted" },
  _hover: { bg: "surface", borderColor: "lineStrong" },
  _focusVisible: { outline: "2px solid", outlineColor: "accent", outlineOffset: "2px", borderColor: "accent" },
  _invalid: { outline: "2px solid", outlineColor: "danger", outlineOffset: "2px", borderColor: "danger" },
} as const;

const SELECT_CHEVRON = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

const required = (
  <Text as="span" ml={1} color="muted" aria-hidden="true">
    *
  </Text>
);

/**
 * Formulário sem backend: não envia nem guarda nada. Monta a mensagem e abre o WhatsApp ou o aplicativo
 * de e-mail, conforme os canais configurados em src/config/contact.ts. Sem nenhum canal configurado,
 * não simula envio: avisa que os canais estão em configuração.
 */
export function Contact() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [reach, setReach] = useState("");
  const [service, setService] = useState(interestOptions[0]?.value ?? "");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState<"whatsapp" | "email" | null>(null);

  // Os botões de serviços, planos e pacotes pré-selecionam o interesse e sugerem a mensagem.
  useEffect(() => {
    const onInterest = (e: Event) => {
      const detail = (e as CustomEvent<InterestDetail>).detail;
      if (interestOptions.some((o) => o.value === detail.service)) setService(detail.service);
      if (detail.message) setMessage((current) => (current.trim() ? current : detail.message ?? ""));
      setSent(null);
    };
    window.addEventListener(INTEREST_EVENT, onInterest);
    return () => window.removeEventListener(INTEREST_EVENT, onInterest);
  }, []);

  const nameError = touched && name.trim().length < 2;
  const reachError = touched && reach.trim().length < 5;
  const messageError = touched && message.trim().length < 10;
  const valid = name.trim().length >= 2 && reach.trim().length >= 5 && message.trim().length >= 10;
  const serviceLabel = interestOptions.find((o) => o.value === service)?.label ?? "";

  const compose = () =>
    [
      `Olá! Sou ${name.trim()}${company.trim() ? `, da empresa ${company.trim()}` : ""}.`,
      `Serviço de interesse: ${serviceLabel}.`,
      "",
      message.trim(),
      "",
      `Meu contato: ${reach.trim()}`,
    ].join("\n");

  const send = (via: "whatsapp" | "email") => {
    setTouched(true);
    if (!valid) {
      const firstInvalid = name.trim().length < 2 ? "contato-nome" : reach.trim().length < 5 ? "contato-retorno" : "contato-mensagem";
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    const text = compose();
    if (via === "whatsapp") {
      const url = whatsappUrl(text);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } else {
      const url = emailUrl(`Orçamento pelo site: ${serviceLabel}`, text);
      if (url) window.location.href = url;
    }
    setSent(via);
  };

  const channels: { icon: IconName; label: string; hint: string; href: string }[] = [];
  if (hasWhatsapp) channels.push({ icon: "whatsapp", label: whatsappDisplay, hint: "WhatsApp", href: whatsappUrl() ?? "" });
  if (hasEmail) channels.push({ icon: "mail", label: contactEmail, hint: "E-mail", href: emailUrl() ?? "" });

  return (
    <Box as="section" id="contato" data-glow="b" aria-labelledby="contato-titulo" px={gutter} py={{ base: 16, md: 24 }}>
      <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "5fr 6fr" }} gap={{ base: 10, lg: 16 }} alignItems="start">
        <Reveal position={{ lg: "sticky" }} top={{ lg: "15vh" }}>
          <Text textStyle="small" color="accent" fontWeight={700} mb={3}>
            Contato e orçamento
          </Text>
          <Heading as="h2" id="contato-titulo" textStyle="head" sx={{ textWrap: "balance" }}>
            Vamos conversar sobre o seu projeto?
          </Heading>
          <Text textStyle="body" color="muted" mt={5} maxW="46ch">
            Conte o que o seu negócio precisa. Deixamos a mensagem pronta para você enviar pelo canal que preferir, e respondemos por lá.
          </Text>

          {channels.length > 0 && (
            <Box as="ul" listStyleType="none" m={0} mt={8} p={0} display="grid" gap={2}>
              {channels.map((c) => (
                <Box as="li" key={c.hint}>
                  <Link href={c.href} isExternal={c.href.startsWith("http")} display="flex" alignItems="center" gap={4} py={2} color="ink" textDecoration="none" _hover={{ color: "accent", textDecoration: "none" }}>
                    <Box as="span" display="grid" placeItems="center" w="48px" h="48px" borderRadius="full" bg="surfaceRaised" color="accent" flexShrink={0}>
                      <Icon name={c.icon} size={22} />
                    </Box>
                    <Box as="span">
                      <Text as="span" display="block" textStyle="body" fontWeight={700} lineHeight={1.2}>
                        {c.label}
                      </Text>
                      <Text as="span" display="block" textStyle="small" color="muted">
                        {c.hint}
                      </Text>
                    </Box>
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </Reveal>

        <Reveal delay={100}>
          <Box
            as="form"
            noValidate
            aria-label="Pedir orçamento"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              send(hasWhatsapp ? "whatsapp" : "email");
            }}
            display="grid"
            gap={5}
            layerStyle="panel"
            p={{ base: 5, md: 9 }}
          >
            <Flex direction={{ base: "column", md: "row" }} gap={5}>
              <FormControl id="contato-nome" isRequired isInvalid={nameError} flex={1}>
                <FormLabel textStyle="small" color="muted" mb={2} requiredIndicator={required}>
                  Nome
                </FormLabel>
                <Input {...field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Seu nome" />
                <FormErrorMessage textStyle="small" color="danger">
                  Informe seu nome.
                </FormErrorMessage>
              </FormControl>
              <FormControl id="contato-empresa" flex={1}>
                <FormLabel textStyle="small" color="muted" mb={2}>
                  Empresa (opcional)
                </FormLabel>
                <Input {...field} value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" placeholder="Nome da empresa" />
              </FormControl>
            </Flex>

            <Flex direction={{ base: "column", md: "row" }} gap={5}>
              <FormControl id="contato-retorno" isRequired isInvalid={reachError} flex={1}>
                <FormLabel textStyle="small" color="muted" mb={2} requiredIndicator={required}>
                  Contato (WhatsApp ou e-mail)
                </FormLabel>
                <Input {...field} value={reach} onChange={(e) => setReach(e.target.value)} autoComplete="email" placeholder="Como podemos falar com você" />
                <FormErrorMessage textStyle="small" color="danger">
                  Informe um WhatsApp ou e-mail para retorno.
                </FormErrorMessage>
              </FormControl>
              <FormControl id="contato-servico" flex={1}>
                <FormLabel textStyle="small" color="muted" mb={2}>
                  Serviço de interesse
                </FormLabel>
                {/* select nativo estilizado: o Select do Chakra aplica o padding na raiz e desalinha o campo */}
                <Box
                  as="select"
                  {...field}
                  w="100%"
                  value={service}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setService(e.target.value)}
                  pr={10}
                  appearance="none"
                  cursor="pointer"
                  bgRepeat="no-repeat"
                  bgPosition="right 14px center"
                  bgImage={SELECT_CHEVRON}
                  sx={{ option: { background: "#111827" } }}
                >
                  {interestOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Box>
              </FormControl>
            </Flex>

            <FormControl id="contato-mensagem" isRequired isInvalid={messageError}>
              <FormLabel textStyle="small" color="muted" mb={2} requiredIndicator={required}>
                Mensagem
              </FormLabel>
              <Textarea {...field} h="auto" minH="150px" py={4} resize="vertical" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Conte em poucas linhas o que você precisa." />
              <FormErrorMessage textStyle="small" color="danger">
                Escreva pelo menos uma frase.
              </FormErrorMessage>
            </FormControl>

            {hasContactChannel ? (
              <Flex gap={3} wrap="wrap" align="center">
                {hasWhatsapp && (
                  <ActionLink as="button" type="submit" cursor="pointer" w={{ base: "100%", sm: "auto" }}>
                    <Icon name="whatsapp" size={20} />
                    Enviar pelo WhatsApp
                  </ActionLink>
                )}
                {hasEmail && (
                  <ActionLink
                    as="button"
                    type={hasWhatsapp ? "button" : "submit"}
                    variant={hasWhatsapp ? "outline" : "primary"}
                    cursor="pointer"
                    onClick={hasWhatsapp ? () => send("email") : undefined}
                    w={{ base: "100%", sm: "auto" }}
                  >
                    <Icon name="mail" size={20} />
                    Enviar por e-mail
                  </ActionLink>
                )}
              </Flex>
            ) : (
              <Box role="status" p={4} borderRadius="control" border="1px dashed" borderColor="lineStrong" textStyle="small" fontSize="md" color="muted">
                Os canais de contato da EGdevs ainda estão sendo configurados, então este formulário não envia mensagens por enquanto. Volte em breve.
              </Box>
            )}

            <Text role="status" textStyle="small" color="muted" minH="1.4em">
              {sent === "whatsapp" && "Abrimos o WhatsApp com a sua mensagem pronta. É só enviar por lá."}
              {sent === "email" && "Abrimos o seu aplicativo de e-mail com a mensagem pronta."}
            </Text>
            <Text textStyle="small" color="muted">
              O formulário não guarda nem envia seus dados por conta própria: ele só prepara a mensagem, e o envio acontece no aplicativo que abrir.
            </Text>
          </Box>
        </Reveal>
      </Box>
    </Box>
  );
}
