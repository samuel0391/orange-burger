

const numeroWhatsApp = "559182307182";

const produtos = [
    {
        nome: "X-Burger",
        preco: 18,
        emoji: "🍔",
        descricao: "Hambúrguer, queijo e molho especial.",
        tipo: "lanche"
    },
    {
        nome: "X-Bacon",
        preco: 23,
        emoji: "🥓",
        descricao: "Hambúrguer, queijo e bacon crocante.",
        tipo: "lanche"
    },
    {
        nome: "X-Salada",
        preco: 20,
        emoji: "🥬",
        descricao: "Hambúrguer, queijo, alface e tomate.",
        tipo: "lanche"
    },
    {
        nome: "Batata Frita",
        preco: 12,
        emoji: "🍟",
        descricao: "Porção de batatas crocantes.",
        tipo: "lanche"
    },
    {
        nome: "Coca-Cola",
        emoji: "🥤",
        tipo: "bebida",
        tamanhos: [
            { nome: "500 ml", preco: 7 },
            { nome: "1 litro", preco: 10 },
            { nome: "2 litros", preco: 14 }
        ]
    },
    {
        nome: "Pepsi",
        emoji: "🥤",
        tipo: "bebida",
        tamanhos: [
            { nome: "500 ml", preco: 7 },
            { nome: "1 litro", preco: 10 },
            { nome: "2 litros", preco: 14 }
        ]
    },
    {
        nome: "Fanta Uva",
        emoji: "🍇",
        tipo: "bebida",
        tamanhos: [
            { nome: "500 ml", preco: 7 },
            { nome: "1 litro", preco: 10 },
            { nome: "2 litros", preco: 14 }
        ]
    },
    {
        nome: "Fanta Laranja",
        emoji: "🍊",
        tipo: "bebida",
        tamanhos: [
            { nome: "500 ml", preco: 7 },
            { nome: "1 litro", preco: 10 },
            { nome: "2 litros", preco: 14 }
        ]
    }
];

const adicionais = [
    { nome: "Queijo extra", preco: 3 },
    { nome: "Bacon extra", preco: 5 },
    { nome: "Ovo", preco: 2 }
];

let carrinho = [];

function dinheiro(valor) {
    return valor.toFixed(2).replace(".", ",");
}

function mostrarCardapio() {
    const area = document.getElementById("cardapio");

    area.innerHTML = produtos.map((produto, indice) => `
        <div class="produto">
            <div class="emoji">${produto.emoji}</div>

            <h3>${produto.nome}</h3>

            ${produto.descricao ? `<p>${produto.descricao}</p>` : ""}

            ${produto.tipo === "bebida" ? `
                <div class="adicionais">
                    <strong>Escolha o tamanho:</strong>

                    ${produto.tamanhos.map((tamanho, i) => `
                        <label>
                            <input
                                type="radio"
                                name="tamanho-${indice}"
                                value="${i}"
                                ${i === 0 ? "checked" : ""}
                            >
                            ${tamanho.nome} - R$ ${dinheiro(tamanho.preco)}
                        </label>
                    `).join("")}
                </div>
            ` : `
                <h3>R$ ${dinheiro(produto.preco)}</h3>

                <div class="adicionais">
                    <strong>Escolha os adicionais:</strong>

                    ${adicionais.map((adicional, i) => `
                        <label>
                            <input
                                type="checkbox"
                                class="extra-${indice}"
                                value="${i}"
                            >
                            ${adicional.nome} (+ R$ ${dinheiro(adicional.preco)})
                        </label>
                    `).join("")}
                </div>
            `}

            <button onclick="adicionarCarrinho(${indice})">
                ADICIONAR PEDIDO
            </button>
        </div>
    `).join("");
}

function adicionarCarrinho(indice) {
    const produto = produtos[indice];

    if (produto.tipo === "bebida") {
        const escolha = document.querySelector(
            `input[name="tamanho-${indice}"]:checked`
        );

        const tamanho = produto.tamanhos[Number(escolha.value)];

        carrinho.push({
            nome: produto.nome,
            tamanho: tamanho.nome,
            preco: tamanho.preco,
            extras: []
        });

    } else {
        const selecionados = document.querySelectorAll(
            `.extra-${indice}:checked`
        );

        const extras = Array.from(selecionados).map(input =>
            adicionais[Number(input.value)]
        );

        carrinho.push({
            nome: produto.nome,
            preco: produto.preco,
            extras: extras
        });

        document.querySelectorAll(`.extra-${indice}`).forEach(input => {
            input.checked = false;
        });
    }

    mostrarCarrinho();
    alert("Produto adicionado ao carrinho!");
}

function calcularTotal() {
    return carrinho.reduce((soma, item) =>
        soma + item.preco +
        item.extras.reduce((valor, extra) => valor + extra.preco, 0),
        0
    );
}

function mostrarCarrinho() {
    const area = document.getElementById("itensCarrinho");

    if (carrinho.length === 0) {
        area.innerHTML = "Seu carrinho está vazio.";
    } else {
        area.innerHTML = carrinho.map((item, indice) => `
            <div class="carrinho-item">
                <strong>${item.nome}</strong>

                ${item.tamanho ? `<p>Tamanho: ${item.tamanho}</p>` : ""}

                <p>R$ ${dinheiro(item.preco)}</p>

                ${item.extras.map(extra => `
                    <p>+ ${extra.nome} - R$ ${dinheiro(extra.preco)}</p>
                `).join("")}

                <button onclick="removerItem(${indice})">
                    REMOVER
                </button>
            </div>
        `).join("");
    }

    document.getElementById("total").textContent =
        "Total: R$ " + dinheiro(calcularTotal());
}

function removerItem(indice) {
    carrinho.splice(indice, 1);
    mostrarCarrinho();
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Adicione algum produto antes de concluir!");
        return;
    }

    let mensagem = "🍔 *NOVO PEDIDO - ORANGE BURGER*\n\n";

    carrinho.forEach((item, indice) => {
        mensagem += `${indice + 1}. ${item.nome}\n`;

        if (item.tamanho) {
            mensagem += `   Tamanho: ${item.tamanho}\n`;
        }

        item.extras.forEach(extra => {
            mensagem += `   + ${extra.nome}\n`;
        });

        const precoFinal = item.preco +
            item.extras.reduce((soma, extra) => soma + extra.preco, 0);

        mensagem += `   Preço: R$ ${dinheiro(precoFinal)}\n\n`;
    });

    mensagem += `*TOTAL: R$ ${dinheiro(calcularTotal())}*`;

    mensagem += "\n\nOlá! Gostaria de confirmar meu pedido. Vou informar meu endereço por aqui.";

    const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(link, "_blank");
}

mostrarCardapio();
mostrarCarrinho();
