// Import do "banco de dados" das misturas junto com as variavéis necessárias
import { MISTURAS_PERIGOSAS } from './dados.js';
const botaoVerificar = document.querySelector('button[type="button"]');
const seletorProduto1 = document.getElementById('produto1');
const seletorProduto2 = document.getElementById('produto2');

const caixaPerigo = document.getElementById('resultado-perigo');
const caixaSeguro = document.getElementById('resultado-seguro');

// Cópia de backup em formato de lista para dar o sort depois
const opcoesOriginaisP1 = Array.from(seletorProduto1.options);
const opcoesOriginaisP2 = Array.from(seletorProduto2.options);


// Reset do F5
window.addEventListener('DOMContentLoaded', () => {
    seletorProduto1.value = "";
    seletorProduto2.value = "";
    filtrarOpcoes(seletorProduto1, opcoesOriginaisP1, "");
    filtrarOpcoes(seletorProduto2, opcoesOriginaisP2, "");
    caixaPerigo.classList.add('hidden');
    caixaSeguro.classList.add('hidden');
});

// Função principal do script de checagem
function verificarMistura() {
    const valor1 = seletorProduto1.value;
    const valor2 = seletorProduto2.value;

    const paragrafoPerigo = document.getElementById('texto-perigo');
    const paragrafoSeguro = document.getElementById('texto-seguro');

    caixaPerigo.classList.add('hidden');
    caixaSeguro.classList.add('hidden');

    if (valor1 === "" || valor2 === "") {
        alert("Por favor, selecione os dois produtos para verificar.");
        return;
    }

    const nomeOriginal1 = seletorProduto1.options[seletorProduto1.selectedIndex].text;
    const nomeOriginal2 = seletorProduto2.options[seletorProduto2.selectedIndex].text;

    // Sort nos valores para facilitar a busca no banco de dados
    const chaveMistura = [valor1, valor2].sort().join('+');


    // REGRA MESTRE AUTOMÁTICA
    
    //Amônia
    if (valor1 === "amonia" || valor2 === "amonia") {
        paragrafoPerigo.innerHTML = `<strong>Reação: Alta Volatilidade e Toxicidade da Amônia.</strong><br><br>A Amônia é uma substância extremamente volátil e altamente reativa. Misturá-la com praticamente qualquer outro produto químico gera vapores sufocantes perigosos para os pulmões e olhos. Não misture!`;
        caixaPerigo.classList.remove('hidden');
    }
    //Soda Cáustica 
    else if (valor1 === "soda-caustica" || valor2 === "soda-caustica") {
        paragrafoPerigo.innerHTML = `<strong>Reação: Alta Corrosividade da Soda Cáustica.</strong><br><br>A Soda Cáustica é uma base forte extremamente corrosiva. Reage violentamente com quase todos os insumos domésticos, liberando calor intenso (reação exotérmica) capaz de derreter recipientes e causar queimaduras químicas severas. Não misture!`;
        caixaPerigo.classList.remove('hidden');
    }

    // BUSCA DIRETAMENTE NO BANCO DE DADOS DE MISTURAS
    else if (MISTURAS_PERIGOSAS[chaveMistura]) {
        const dados = MISTURAS_PERIGOSAS[chaveMistura];
        paragrafoPerigo.innerHTML = `<strong>Reação: ${dados.reacao}.</strong><br><br>${dados.explicacao}`;
        caixaPerigo.classList.remove('hidden');
    } 

    // CASO SEGURO PADRÃO
    else {
        paragrafoSeguro.innerHTML = `O uso de <strong>${nomeOriginal1}</strong> com <strong>${nomeOriginal2}</strong> é seguro pois esses componentes não reagem de forma violenta ou tóxica entre si!<br><br> <strong>Dica de Segurança:</strong> Mesmo sendo uma combinação estável, lembre-se de usar quantidades moderadas e manter o ambiente bem ventilado durante a faxina. A prevenção é a melhor ferramenta para um lar protegido!`;
        caixaSeguro.classList.remove('hidden');
    }
}

// Função para desabilitar as opções de placeholder(evitar bugs)
function filtrarOpcoes(selectAlvo, listaOriginal, valorBloqueado) {
    const valorAtual = selectAlvo.value;
    selectAlvo.innerHTML = '';

    listaOriginal.forEach(opcao => {
        if (opcao.value === "" || opcao.value === "Ex: Água Sanitária" || opcao.value === "Ex: Vinagre" || opcao.value !== valorBloqueado) {
            const novaOpcao = document.createElement('option');
            novaOpcao.value = opcao.value;
            novaOpcao.text = opcao.text;
            novaOpcao.disabled = opcao.disabled;
            novaOpcao.hidden = opcao.hidden;
            selectAlvo.appendChild(novaOpcao);
        }
    });

    if (valorAtual !== valorBloqueado && Array.from(selectAlvo.options).some(opt => opt.value === valorAtual)) {
        selectAlvo.value = valorAtual;
    } else {
        selectAlvo.value = "";
    }
}

// Função de mudança de campo. Apaga o valor escolhido numa lista em outra para evitar repetição do mesmo valor
seletorProduto1.addEventListener('change', () => {
    filtrarOpcoes(seletorProduto2, opcoesOriginaisP2, seletorProduto1.value);
});

seletorProduto2.addEventListener('change', () => {
    filtrarOpcoes(seletorProduto1, opcoesOriginaisP1, seletorProduto2.value);
});

//Configuração do botão principal para chamar a função principal
botaoVerificar.addEventListener('click', verificarMistura);