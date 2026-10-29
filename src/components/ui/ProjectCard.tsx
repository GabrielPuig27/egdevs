"use client";

import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/types/project";

/** Card de projeto: captura, participação real, resumo e link para o site (só quando existe). */
export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const { title, category, participation, summary, image, url } = project;
  return (
    <Box layerStyle="card" h="100%" display="flex" flexDirection="column" transition="transform 0.25s ease" _hover={{ transform: "translateY(-4px)" }}>
      <Box position="relative" aspectRatio="16 / 10" bg="bgDeep" borderBottom="1px solid" borderColor="line">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 92vw"
          priority={priority}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
      </Box>
      <Flex direction="column" flex="1" p={{ base: 5, md: 6 }}>
        <Flex gap={2} wrap="wrap" align="center" textStyle="small" color="muted">
          <Text as="span" px={2} py="1px" borderRadius="full" bg="accentTint" color="accent" fontWeight={700}>
            {participation}
          </Text>
          <Text as="span">{category}</Text>
        </Flex>
        <Heading as="h3" textStyle="lead" mt={2}>
          {title}
        </Heading>
        <Text textStyle="body" fontSize="md" color="muted" mt={2} flex="1">
          {summary}
        </Text>
        {url && (
          <Link
            href={url}
            isExternal
            aria-label={`Visitar o site ${title} (abre em nova aba)`}
            mt={5}
            display="inline-flex"
            alignItems="center"
            gap={2}
            alignSelf="flex-start"
            textStyle="small"
            fontWeight={700}
            color="accent"
            textDecoration="none"
            _hover={{ color: "accentHover", textDecoration: "none" }}
          >
            Ver projeto
            <Icon name="external" size={16} />
          </Link>
        )}
      </Flex>
    </Box>
  );
}
