const produtos = [
  { nome: "Clássico da Casa", preco: 34, qtd: 0 },
  { nome: "Egg Burger", preco: 35, qtd: 0 },
  { nome: "Smash Tradicional", preco: 37, qtd: 0 }
];

let desconto = 0;

const cupons = {
  "LUANABURG10": 10,
  "LUANALANCHES20": 20
};

function aplicarCupom() {
  const codigo = document.getElementById("cupom-input").value.toUpperCase();

  if (cupons[codigo]) {
    desconto = cupons[codigo];
    alert(`Cupom aplicado! ${desconto}% de desconto`);
    atualizarTotal();
  } else {
    alert("Cupom inválido ❌");
  }
}

function alterarQtd(index, valor) {
  produtos[index].qtd += valor;
  if (produtos[index].qtd < 0) produtos[index].qtd = 0;

  document.getElementById(`qtd${index}`).innerText = produtos[index].qtd;
  atualizarTotal();
}

function atualizarTotal() {
  let total = 0;
  produtos.forEach(p => total += p.preco * p.qtd);

  if (desconto > 0) {
    total = total - (total * desconto / 100);
  }

  document.getElementById("total").innerText =
    `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function abrirModal() {
  const resumo = document.getElementById("resumo-carrinho");
  resumo.innerHTML = "";

  let total = 0;

  produtos.forEach(p => {
    if (p.qtd > 0) {
      const subtotal = p.preco * p.qtd;
      resumo.innerHTML += `
        <p>${p.qtd}x ${p.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
      `;
      total += subtotal;
    }
  });

  if (desconto > 0) {
    total = total - (total * desconto / 100);
  }

  document.getElementById("total-modal").innerText =
    `R$ ${total.toFixed(2).replace('.', ',')}`;

  document.getElementById("modal-checkout").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal-checkout").classList.add("hidden");
}

function enviarPedidoWhatsApp(event) {
  event.preventDefault();

  const nome = document.getElementById("cliente-nome").value;
  const endereco = document.getElementById("cliente-endereco").value;
  const pagamento = document.getElementById("cliente-pagamento").value;
  const observacoes = document.getElementById("cliente-observacoes").value;

  let mensagem = `*NOVO PEDIDO - OLD BURGUER* 🍔\n\n`;
  mensagem += `*Cliente:* ${nome}\n`;
  mensagem += `*Endereço:* ${endereco}\n`;
  mensagem += `*Pagamento:* ${pagamento}\n`;

  if (observacoes.trim() !== "") {
    mensagem += `*Observações:* ${observacoes}\n`;
  }

  mensagem += `\n*ITENS:*\n`;

  let total = 0;
  produtos.forEach(p => {
    if (p.qtd > 0) {
      const subtotal = p.preco * p.qtd;
      mensagem += `• ${p.qtd}x ${p.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
      total += subtotal;
    }
  });

  if (desconto > 0) {
    total = total - (total * desconto / 100);
    mensagem += `\n*Desconto aplicado:* ${desconto}%`;
  }

  mensagem += `\n\n*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*`;

  const numeroWhatsApp = "5511999999999";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");

  fecharModal();
  limparCarrinho();
}

function limparCarrinho() {
  produtos.forEach((p, i) => {
    p.qtd = 0;
    document.getElementById(`qtd${i}`).innerText = 0;
  });

  desconto = 0;
  document.getElementById("cupom-input").value = "";
  document.getElementById("cliente-observacoes").value = "";

  atualizarTotal();
}
