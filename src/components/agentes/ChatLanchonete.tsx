"use client";

import { Box, Flex, Link, Text, Textarea, VisuallyHidden } from "@chakra-ui/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import NextLink from "next/link";
import type { UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Balao, ChipFerramenta, Pontinhos, TextoComNegrito, type FerramentaConhecida } from "@/components/agentes/ElementosChat";
import { ActionLink } from "@/components/ui/ActionLink";
import { Icon } from "@/components/ui/Icon";
import { MAX_CARACTERES_MENSAGEM } from "@/agents/constantes";
import { mensagemParaOVisitante } from "@/agents/erro-cliente";
import { montarCorpoChat } from "@/agents/historico-cliente";
import { agentesMensagem, contactSectionHref, emailUrl, whatsappUrl } from "@/config/contact";
import { rotuloRestantes, rotuloRestantesCurto, textosLanchonete } from "@/content/agentes/lanchonete/textos";

const t = textosLanchonete;
const contatoWhatsapp = whatsappUrl(agentesMensagem);
const contatoEmail = emailUrl(t.fim.emailAssunto);

function Mensagem({ mensagem }: { mensagem: UIMessage }) {
  const doUsuario = mensagem.role === "user";
  const textos: string[] = [];
  const ferramentas = new Map<FerramentaConhecida, boolean>(); // nome → em andamento
  for (const parte of mensagem.parts) {
    if (parte.type === "text") {
      if (parte.text.trim()) textos.push(parte.text);
    } else if (parte.type.startsWith("tool-")) {
      const nome = parte.type.slice(5) as FerramentaConhecida;
      if (!(nome in t.chat.ferramentas)) continue;
      const estado = (parte as { state?: string }).state;
      const andamento = estado !== "output-available" && estado !== "output-error";
      ferramentas.set(nome, (ferramentas.get(nome) ?? false) || andamento);
    }
  }
  if (!textos.length && !ferramentas.size) return null;

  return (
    <Flex as="article" direction="column" align={doUsuario ? "flex-end" : "flex-start"} gap={2}>
      <VisuallyHidden>{doUsuario ? t.chat.voce : t.chat.atendente}:</VisuallyHidden>
      {!doUsuario && ferramentas.size > 0 && (
        <Flex direction="column" gap={1} px={1}>
          {[...ferramentas].map(([nome, andamento]) => (
            <ChipFerramenta key={nome} nome={nome} andamento={andamento} />
          ))}
        </Flex>
      )}
      {textos.length > 0 && (
        <Balao doUsuario={doUsuario}>
          <TextoComNegrito texto={textos.join("\n\n")} />
        </Balao>
      )}
    </Flex>
  );
}

/**
 * Chat da demonstração. O servidor é a fonte da verdade do limite (cookie assinado): a interface
 * só reflete o que ele informa, pelo cabeçalho x-respostas-restantes e pelo GET /api/chat ao abrir.
 */
export function ChatLanchonete() {
  const [restantes, setRestantes] = useState<number | null>(null);
  const [texto, setTexto] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);
  const colado = useRef(true); // o leitor está no fim da conversa?

  // fetch próprio só para ler o cabeçalho do limite; o resto é o transporte padrão do AI SDK.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        // Só o texto das mensagens vai ao servidor (ver historico-cliente.ts).
        prepareSendMessagesRequest: ({ messages }) => ({ body: montarCorpoChat(messages) }),
        fetch: async (entrada, opcoes) => {
          const resposta = await fetch(entrada, opcoes);
          const cabecalho = resposta.headers.get("x-respostas-restantes");
          if (cabecalho !== null && Number.isFinite(Number(cabecalho))) setRestantes(Number(cabecalho));
          // 429 também é o limite por IP: só o "limite-atingido" encerra a demonstração.
          if (resposta.status === 429) {
            const corpo = (await resposta.clone().json().catch(() => null)) as { codigo?: string } | null;
            if (corpo?.codigo === "limite-atingido") setRestantes(0);
          }
          return resposta;
        },
      }),
    [],
  );
  const { messages, sendMessage, status, error, stop, regenerate, clearError } = useChat({ transport });

  useEffect(() => {
    let ativo = true;
    fetch("/api/chat")
      .then((r) => (r.ok ? r.json() : null))
      .then((dados: { restantes?: unknown } | null) => {
        if (ativo && typeof dados?.restantes === "number") setRestantes(dados.restantes);
      })
      .catch(() => undefined); // sem o status, a interface mostra o limite total e o servidor decide
    return () => {
      ativo = false;
    };
  }, []);

  const ocupado = status === "submitted" || status === "streaming";
  const encerrado = restantes === 0 && !ocupado;
  const ultima = messages.at(-1);
  const aguardandoTexto = ocupado && (ultima?.role === "user" || !ultima?.parts.some((p) => p.type === "text" && p.text.trim()));

  // Acompanha o fim da conversa, a menos que a pessoa tenha rolado para ler algo acima.
  useEffect(() => {
    const el = log.current;
    if (el && colado.current) el.scrollTop = el.scrollHeight;
  }, [messages, status, error, encerrado]);

  const enviar = useCallback(
    (conteudo: string) => {
      const limpo = conteudo.trim();
      if (!limpo || ocupado || encerrado) return;
      colado.current = true;
      if (error) clearError();
      void sendMessage({ text: limpo });
      setTexto("");
      if (campo.current) campo.current.style.height = "auto";
    },
    [ocupado, encerrado, error, clearError, sendMessage],
  );

  const mostrarErro = Boolean(error) && !ocupado && !encerrado;

  return (
    <Flex
      layerStyle="panel"
      direction="column"
      h={{ base: "min(640px, 82dvh)", lg: "min(700px, calc(100dvh - 150px))" }}
      minH="480px"
      aria-label={t.chat.rotuloConversa}
      role="region"
    >
      <Flex align="center" justify="space-between" gap={4} px={{ base: 4, md: 6 }} py={4} bg="surface">
        <Flex align="center" gap={3} minW={0}>
          <Box as="span" display="grid" placeItems="center" w="44px" h="44px" borderRadius="full" bg="surfaceRaised" color="accent" flexShrink={0}>
            <Icon name="chat" size={20} />
          </Box>
          <Box minW={0}>
            <Text textStyle="body" fontWeight={700} lineHeight={1.2} noOfLines={1}>
              {t.chat.nome}
            </Text>
            <Text textStyle="small" color="muted" noOfLines={1}>
              <Box as="span" display={{ base: "none", sm: "inline" }}>
                {t.chat.papel}
              </Box>
              <Box as="span" display={{ base: "inline", sm: "none" }}>
                {t.chat.papelCurto}
              </Box>
            </Text>
          </Box>
        </Flex>
        <Text role="status" textStyle="small" color={restantes !== null && restantes <= 1 ? "ink" : "muted"} textAlign="right" flexShrink={0}>
          <Box as="span" display={{ base: "none", sm: "inline" }}>
            {rotuloRestantes(restantes)}
          </Box>
          <Box as="span" display={{ base: "inline", sm: "none" }}>
            {rotuloRestantesCurto(restantes)}
          </Box>
        </Text>
      </Flex>

      <Box
        ref={log}
        role="log"
        aria-label={t.chat.rotuloConversa}
        tabIndex={0}
        flex="1"
        minH={0}
        overflowY="auto"
        px={{ base: 4, md: 6 }}
        py={5}
        onScroll={(e) => {
          const el = e.currentTarget;
          colado.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
        }}
      >
        {messages.length === 0 && !encerrado ? (
          <Flex direction="column" justify="center" h="100%" gap={4}>
            <Text textStyle="body" color="muted" maxW="38ch">
              {t.chat.vazio}
            </Text>
            <Flex wrap="wrap" gap={2}>
              {t.chat.sugestoes.map((s) => (
                <Box
                  key={s}
                  as="button"
                  type="button"
                  onClick={() => enviar(s)}
                  disabled={ocupado}
                  textStyle="small"
                  fontWeight={600}
                  textAlign="left"
                  minH="44px"
                  px={4}
                  py={2}
                  borderRadius="control"
                  border="1px solid"
                  borderColor="line"
                  bg="surface"
                  color="ink"
                  cursor="pointer"
                  transition="background-color 0.2s ease, border-color 0.2s ease"
                  _hover={{ bg: "surfaceRaised", borderColor: "lineStrong" }}
                  _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                >
                  {s}
                </Box>
              ))}
            </Flex>
          </Flex>
        ) : (
          <Flex direction="column" gap={5}>
            {messages.map((m) => (
              <Mensagem key={m.id} mensagem={m} />
            ))}
            {aguardandoTexto && (
              <Box role="status">
                <VisuallyHidden>{t.chat.escrevendo}</VisuallyHidden>
                <Box bg="surface" borderRadius="bar" borderBottomLeftRadius="4px" px={4} py={3} display="inline-block" boxShadow="inset 0 0 0 1px rgb(255 255 255 / 0.06)">
                  <Pontinhos />
                </Box>
              </Box>
            )}
            {mostrarErro && (
              <Flex role="alert" align="center" justify="space-between" gap={3} wrap="wrap" px={4} py={3} borderRadius="bar" border="1px solid" borderColor="danger" color="ink" textStyle="small">
                <Text as="span" textStyle="small">
                  {mensagemParaOVisitante(error)}
                </Text>
                <ActionLink as="button" type="button" variant="ghost" size="sm" cursor="pointer" onClick={() => void regenerate()}>
                  {t.chat.tentarDeNovo}
                </ActionLink>
              </Flex>
            )}
          </Flex>
        )}
      </Box>

      {encerrado ? (
        <Box role="status" px={{ base: 4, md: 6 }} py={6} bg="surface">
          <Text as="h2" textStyle="lead">
            {t.fim.titulo}
          </Text>
          <Text textStyle="body" color="muted" mt={2} maxW="52ch">
            {t.fim.texto}
          </Text>
          <Flex gap={3} mt={5} wrap="wrap">
            {contatoWhatsapp && (
              <ActionLink href={contatoWhatsapp} target="_blank" rel="noopener noreferrer" w={{ base: "100%", sm: "auto" }}>
                <Icon name="whatsapp" size={20} />
                {t.fim.whatsapp}
              </ActionLink>
            )}
            {contatoEmail && (
              <ActionLink href={contatoEmail} variant={contatoWhatsapp ? "outline" : "primary"} w={{ base: "100%", sm: "auto" }}>
                <Icon name="mail" size={20} />
                {t.fim.email}
              </ActionLink>
            )}
            {!contatoWhatsapp && !contatoEmail && (
              <ActionLink href={contactSectionHref} w={{ base: "100%", sm: "auto" }}>
                {t.fim.contato}
              </ActionLink>
            )}
          </Flex>
        </Box>
      ) : (
        <Box
          as="form"
          px={{ base: 3, md: 4 }}
          py={3}
          bg="surface"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            enviar(texto);
          }}
        >
          <Flex gap={2} align="flex-end">
            <Textarea
              ref={campo}
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  enviar(texto);
                }
              }}
              aria-label={t.chat.campo}
              placeholder={t.chat.placeholder}
              maxLength={MAX_CARACTERES_MENSAGEM}
              rows={1}
              resize="none"
              minH="52px"
              py={3}
              px={4}
              bg="bgDeep"
              color="ink"
              textStyle="body"
              borderRadius="control"
              border="1px solid"
              borderColor="line"
              _placeholder={{ color: "muted" }}
              _hover={{ borderColor: "lineStrong" }}
              _focusVisible={{ outline: "2px solid", outlineColor: "accent", outlineOffset: "2px", borderColor: "accent" }}
            />
            {ocupado ? (
              <ActionLink as="button" type="button" variant="outline" cursor="pointer" onClick={() => void stop()} flexShrink={0}>
                <Icon name="stop" size={18} />
                {t.chat.parar}
              </ActionLink>
            ) : (
              <ActionLink as="button" type="submit" cursor="pointer" aria-disabled={!texto.trim()} opacity={texto.trim() ? 1 : 0.55} flexShrink={0}>
                <Icon name="send" size={18} />
                {t.chat.enviar}
              </ActionLink>
            )}
          </Flex>
          <Text textStyle="small" color="muted" mt={2} px={1}>
            {t.chat.aviso}{" "}
            <Link as={NextLink} href="/privacidade" color="ink" textDecoration="underline" _hover={{ color: "accent" }}>
              {t.chat.politica}
            </Link>
          </Text>
        </Box>
      )}
    </Flex>
  );
}
