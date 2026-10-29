import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LIMITE_RESPOSTAS,
  NOME_COOKIE,
  VALIDADE_SEGUNDOS,
  codificarSessao,
  lerCookie,
  lerSessao,
  montarSetCookie,
} from "../../src/agents/limite-sessao.ts";

const SEGREDO = "x".repeat(40);
const AGORA = 1_800_000_000;

test("sem cookie começa uma sessão nova com janela de 24 h", () => {
  assert.deepEqual(lerSessao(SEGREDO, undefined, AGORA), { usadas: 0, expiraEm: AGORA + VALIDADE_SEGUNDOS });
});

test("cookie assinado válido é lido de volta", () => {
  const valor = codificarSessao(SEGREDO, { usadas: 3, expiraEm: AGORA + 1000 });
  assert.deepEqual(lerSessao(SEGREDO, valor, AGORA), { usadas: 3, expiraEm: AGORA + 1000 });
});

test("diminuir a contagem no cookie invalida a assinatura (vira sessão nova)", () => {
  const valor = codificarSessao(SEGREDO, { usadas: 5, expiraEm: AGORA + 1000 });
  const [, expira, assinatura] = valor.split(".");
  const forjado = `0.${expira}.${assinatura}`;
  assert.equal(lerSessao(SEGREDO, forjado, AGORA).usadas, 0);
  // E não é lido como o valor forjado preservado: a janela também é nova, não a do cookie.
  assert.equal(lerSessao(SEGREDO, forjado, AGORA).expiraEm, AGORA + VALIDADE_SEGUNDOS);
});

test("cookie assinado com outro segredo é rejeitado", () => {
  const valor = codificarSessao("outro-segredo-outro-segredo-outro-segredo", { usadas: 4, expiraEm: AGORA + 1000 });
  assert.equal(lerSessao(SEGREDO, valor, AGORA).usadas, 0);
});

test("cookie vencido vira sessão nova", () => {
  const valor = codificarSessao(SEGREDO, { usadas: 5, expiraEm: AGORA - 1 });
  assert.equal(lerSessao(SEGREDO, valor, AGORA).usadas, 0);
});

test("lixo no cookie não quebra", () => {
  for (const lixo of ["", "abc", "1.2", "1.2.3.4", "a.b.c", "99999.1.x", "-1.5.zzz"]) {
    assert.equal(lerSessao(SEGREDO, lixo, AGORA).usadas, 0, lixo);
  }
});

test("lerCookie encontra o cookie certo no cabeçalho", () => {
  assert.equal(lerCookie(`a=1; ${NOME_COOKIE}=valor.com.pontos; b=2`, NOME_COOKIE), "valor.com.pontos");
  assert.equal(lerCookie("a=1", NOME_COOKIE), undefined);
  assert.equal(lerCookie(null, NOME_COOKIE), undefined);
});

test("Set-Cookie é HttpOnly, SameSite=Lax e só Secure em produção", () => {
  const dev = montarSetCookie("v", AGORA + 100, AGORA, false);
  assert.match(dev, /HttpOnly/);
  assert.match(dev, /SameSite=Lax/);
  assert.match(dev, /Max-Age=100/);
  assert.doesNotMatch(dev, /Secure/);
  assert.match(montarSetCookie("v", AGORA + 100, AGORA, true), /Secure/);
});

test("o limite da demo é 5", () => {
  assert.equal(LIMITE_RESPOSTAS, 5);
});
