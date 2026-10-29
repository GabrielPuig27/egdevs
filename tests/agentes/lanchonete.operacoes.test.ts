import { test } from "node:test";
import assert from "node:assert/strict";
import { catalogoLanchonete } from "../../src/content/agentes/lanchonete/catalogo.ts";
import { buscarItens, calcularPedido, formatarReais } from "../../src/agents/lanchonete/operacoes.ts";

test("formatarReais usa vírgula e duas casas", () => {
  assert.equal(formatarReais(2200), "R$ 22,00");
  assert.equal(formatarReais(5), "R$ 0,05");
});

test("pedido para retirada: 2 X-Burger + 1 Batata = R$ 62,00", () => {
  const r = calcularPedido(catalogoLanchonete, {
    itens: [
      { id: "x-burger", quantidade: 2 },
      { id: "batata-frita", quantidade: 1 },
    ],
    entrega: false,
  });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.subtotal, "R$ 62,00");
    assert.equal(r.taxaEntrega, "R$ 0,00");
    assert.equal(r.total, "R$ 62,00");
  }
});

test("pedido para entrega soma a taxa: R$ 68,00", () => {
  const r = calcularPedido(catalogoLanchonete, {
    itens: [
      { id: "x-burger", quantidade: 2 },
      { id: "batata-frita", quantidade: 1 },
    ],
    entrega: true,
  });
  assert.equal(r.ok && r.total, "R$ 68,00");
});

test("quantidades repetidas do mesmo item são somadas", () => {
  const r = calcularPedido(catalogoLanchonete, {
    itens: [
      { id: "x-burger", quantidade: 1 },
      { id: "x-burger", quantidade: 2 },
    ],
    entrega: false,
  });
  assert.equal(r.ok && r.linhas[0]?.quantidade, 3);
  assert.equal(r.ok && r.total, "R$ 66,00");
});

test("item indisponível recusa o pedido e nomeia o item", () => {
  const r = calcularPedido(catalogoLanchonete, { itens: [{ id: "x-bacon", quantidade: 1 }], entrega: false });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.problemas.join(" "), /X-Bacon.*indisponível/);
});

test("item inexistente recusa o pedido", () => {
  const r = calcularPedido(catalogoLanchonete, { itens: [{ id: "pizza", quantidade: 1 }], entrega: false });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.problemas.join(" "), /não existe/);
});

test("quantidade inválida e pedido vazio são recusados", () => {
  const negativa = calcularPedido(catalogoLanchonete, { itens: [{ id: "x-burger", quantidade: -1 }], entrega: false });
  assert.equal(negativa.ok, false);
  const vazio = calcularPedido(catalogoLanchonete, { itens: [], entrega: false });
  assert.equal(vazio.ok, false);
});

test("entrega abaixo do pedido mínimo é recusada, retirada não", () => {
  const entrega = calcularPedido(catalogoLanchonete, { itens: [{ id: "agua", quantidade: 1 }], entrega: true });
  assert.equal(entrega.ok, false);
  const retirada = calcularPedido(catalogoLanchonete, { itens: [{ id: "agua", quantidade: 1 }], entrega: false });
  assert.equal(retirada.ok, true);
});

test("busca sem filtros devolve o cardápio inteiro", () => {
  assert.equal(buscarItens(catalogoLanchonete, {}).length, catalogoLanchonete.itens.length);
});

test("busca vegetariana só traz vegetarianos", () => {
  const itens = buscarItens(catalogoLanchonete, { vegetariano: true });
  assert.ok(itens.length > 0);
  assert.ok(itens.every((i) => i.vegetariano));
});

test("busca ignora acento e maiúsculas, e item indisponível volta marcado", () => {
  const grao = buscarItens(catalogoLanchonete, { consulta: "GRAO" });
  assert.equal(grao[0]?.id, "burger-grao-de-bico");
  const bacon = buscarItens(catalogoLanchonete, { consulta: "bacon" });
  assert.equal(bacon[0]?.disponivel, false);
});

test("item fora do cardápio não é encontrado", () => {
  assert.deepEqual(buscarItens(catalogoLanchonete, { consulta: "pizza" }), []);
});
