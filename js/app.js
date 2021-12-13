//Responsável por atualizar a quantidades de botões que são mostrados no carrossel. Decidi implementar isso para deixar a aplicação o mais fiel possível ao que foi proposto no figma;
let qntBtns;
function attQntBtns () {
    if (window.innerWidth < 426) {
        qntBtns = 3;
    } else {
        qntBtns = 5;
    };
};

//Responsável por mostrar o segundo filtro;
const selOpt1 = document.getElementById('selOpt');
selOpt1.addEventListener('click', () => {
    const filtro = new Filtro(selOpt1.value);
    filtro.render();
    attQntBtns();
});

//Responsável por fazer a pesquisa;
document.getElementById('dispPesquisa').addEventListener('click', () => {
    let input = document.getElementById('selFiltro2').lastElementChild;

    if (input) {
        if (input.value !== '' && input.value !== 'Escolha uma região') {
            new Countries(input.value, selOpt1.value, qntBtns).renderPesquisa();
        };
    };
});

//Responsável pelo botão voltar. Por se tratar de uma aplicação single page, ele só irá resetar os filtros e apagar os resultados que estão renderizados;
document.getElementById('btnVoltar').addEventListener('click', () => {
    selOpt1.value = 0;
    document.getElementById('selFiltro2').innerHTML = '';
    document.getElementById('resultadoPesquisa').innerHTML = '';
});

//Responsável por controlar o carrossel. Essa função é chamada automaticamente ao fim da pesquisa e do render do carrossel;
function carrosselBtns() {
    if (document.querySelector('.carrossel-btns')) {
        return (
            document.querySelector('.carrossel-btns').addEventListener('click', (e) => {
                new ControlaCarrossel(e.target).render();
            })
        );
    };
};


document.addEventListener('click', (e) => {
    //Responsável por retornar detalhes do país quando clicado sobre sua bandeira;
    if (e.target.dataset.name) {
        new Countries().renderPais(e.target.dataset.name);
    };

    //Responsável por retornar uma nova pesquisa pela região do país mostrado em detalhes;
    if (e.target.id === 'linkRegiao') {
        document.getElementById('selFiltro2').lastElementChild.value = e.target.textContent;
        selOpt1.value = 1;
        new Countries(e.target.textContent, selOpt1.value).renderPesquisa();
    }
});


