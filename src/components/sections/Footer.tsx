import { Box, Flex, Grid, Link, Text } from "@chakra-ui/react";
import { Logo } from "@/components/ui/Logo";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { gutter } from "@/theme/layout";

const hrefFor = (id: string) => (id === "inicio" ? "/" : `/#${id}`);
const linkProps = { color: "ink", textDecoration: "none", _hover: { color: "accent", textDecoration: "none" } } as const;

export function Footer() {
  return (
    <Box as="footer" px={gutter} pt={{ base: 14, md: 20 }} pb={8} borderTop="1px solid" borderColor="line" bg="bgDeep">
      <Grid templateColumns={{ base: "1fr", md: "1.4fr 1fr 1fr" }} gap={{ base: 10, md: 12 }}>
        <Box>
          <Link href="/" aria-label="EGdevs, página inicial" display="inline-block" textDecoration="none" _hover={{ opacity: 0.85 }}>
            <Logo size={30} />
          </Link>
          <Text textStyle="small" color="muted" mt={4} maxW="38ch">
            {siteConfig.tagline}. Sites, agentes de IA, automações e estratégia para pequenas e médias empresas.
          </Text>
        </Box>
        <Box as="nav" aria-label="Rodapé">
          <Text textStyle="small" color="muted" mb={3}>
            Navegação
          </Text>
          <Flex as="ul" listStyleType="none" m={0} p={0} direction="column" gap={2} textStyle="small">
            {navigation.map((l) => (
              <li key={l.id}>
                <Link href={hrefFor(l.id)} {...linkProps}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Flex>
        </Box>
        <Box>
          <Text textStyle="small" color="muted" mb={3}>
            Mais
          </Text>
          <Flex as="ul" listStyleType="none" m={0} p={0} direction="column" gap={2} textStyle="small">
            <li>
              <Link href="/projetos" {...linkProps}>
                Todos os projetos
              </Link>
            </li>
            <li>
              <Link href="/agentes" {...linkProps}>
                Teste um agente de IA
              </Link>
            </li>
            <li>
              <Link href="/privacidade" {...linkProps}>
                Privacidade
              </Link>
            </li>
          </Flex>
        </Box>
      </Grid>
      <Flex mt={{ base: 10, md: 14 }} pt={6} borderTop="1px solid" borderColor="line" justify="space-between" gap={3} wrap="wrap" textStyle="small" color="muted">
        <Text>© {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.</Text>
        <Link href="#" {...linkProps}>
          Voltar ao topo
        </Link>
      </Flex>
    </Box>
  );
}
