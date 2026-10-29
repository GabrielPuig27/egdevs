import { test } from "node:test";
import assert from "node:assert/strict";
import {
  JANELA_IP_SEGUNDOS,
  LIMITE_IP_REQUISICOES,
  LIMITE_RESPOSTAS,
  NOME_COOKIE,
  PROVEDOR_MODELO,
  VALIDADE_SEGUNDOS,
} from "../../src/agents/constantes.ts";
import { NOME_COOKIE as COOKIE_DA_SESSAO, VALIDADE_SEGUNDOS as VALIDADE_DA_SESSAO } from "../../src/agents/limite-sessao.ts";
import { contactEmail } from "../../src/config/contact.ts";
import { textosLanchonete } from "../../src/content/agentes/lanchonete/textos.ts";
import { privacidade } from "../../src/content/privacidade.ts";

/**
 * A política de privacidade descreve o comportamento real do sistema. Estes testes mantêm texto e código
 * sincronizados: se um número, o cookie ou o provedor mudar, a política tem que acompanhar.
 */

const tudo = JSON.stringify(privacidade);

test("o cookie e a validade da política são os mesmos usados pelo código da sessão", () => {
  assert.equal(COOKIE_DA_SESSAO, NOME_COOKIE);
  assert.equal(VALIDADE_DA_SESSAO, VALIDADE_SEGUNDOS);
  assert.ok(tudo.includes(NOME_COOKIE), "a política deveria citar o cookie");
  assert.ok(tudo.includes(`${VALIDADE_SEGUNDOS / 3600} horas`), "a política deveria citar a validade em horas");
});

test("a política cita os limites reais de respostas e de IP", () => {
  assert.ok(tudo.includes(`${LIMITE_RESPOSTAS} respostas`));
  assert.ok(tudo.includes(`${LIMITE_IP_REQUISICOES} a cada ${JANELA_IP_SEGUNDOS / 60} minutos`));
});

test("a política e o aviso do chat citam o provedor atual do modelo", () => {
  assert.ok(tudo.includes(PROVEDOR_MODELO), "a política deveria citar o provedor");
  assert.ok(textosLanchonete.chat.aviso.includes(PROVEDOR_MODELO), "o aviso do chat deveria citar o provedor");
  assert.ok(textosLanchonete.pagina.aviso.includes(PROVEDOR_MODELO), "o aviso da página deveria citar o provedor");
});

test("o aviso do chat manda não digitar dados pessoais e há link para a política", () => {
  assert.match(textosLanchonete.chat.aviso, /dados pessoais/i);
  assert.equal(textosLanchonete.chat.politica, "Política de privacidade");
});

test("o contato da política vem da configuração e as seções que a LGPD espera existem", () => {
  assert.equal(privacidade.contatoEmail, contactEmail);
  const ids = privacidade.secoes.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, "ids repetidos");
  for (const esperado of ["responsavel", "dados", "base-legal", "compartilhamento", "retencao", "direitos"]) {
    assert.ok(ids.includes(esperado as never), `falta a seção ${esperado}`);
  }
  for (const s of privacidade.secoes) {
    const conteudo = ("paragrafos" in s ? s.paragrafos.length : 0) + ("itens" in s ? s.itens.length : 0);
    assert.ok(conteudo > 0, `seção ${s.id} sem conteúdo`);
  }
});

test("a política não afirma guardar conversas nem usar rastreadores", () => {
  assert.match(tudo, /não são guardadas pela EGdevs/);
  assert.doesNotMatch(tudo, /google analytics|pixel|remarketing/i);
});
