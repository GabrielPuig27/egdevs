import type { Metadata } from "next";
import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/content/projects";
import { gutter } from "@/theme/layout";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Sites publicados e protótipos demonstrativos da EGdevs, com a participação em cada projeto indicada.",
  alternates: { canonical: "/projetos" },
};

export default function ProjetosPage() {
  return (
    <>
      <Header />
      <main>
        <Box as="section" data-glow="b" aria-labelledby="projetos-titulo" px={gutter} pt={{ base: "112px", md: "144px" }} pb={{ base: 16, md: 28 }}>
          <Box maxW="760px">
            <Heading as="h1" id="projetos-titulo" textStyle="head" sx={{ textWrap: "balance" }}>
              Todos os projetos
            </Heading>
            <Text textStyle="body" color="muted" mt={5} maxW="62ch">
              Sites publicados do portfólio de Gabriel Puig, um dos fundadores, e protótipos demonstrativos da EGdevs. Em cada projeto, indicamos qual foi a participação.
            </Text>
          </Box>
          <Grid as="ul" listStyleType="none" m={0} mt={{ base: 10, md: 14 }} p={0} templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={{ base: 4, md: 5 }}>
            {projects.map((p, i) => (
              <li key={p.slug}>
                <ProjectCard project={p} priority={i < 3} />
              </li>
            ))}
          </Grid>
        </Box>
      </main>
      <Footer />
    </>
  );
}
