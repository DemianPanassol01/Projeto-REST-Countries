class Filtro {
    constructor(id) {
        this.id = id;
        this.filtro = document.getElementById('selFiltro2');
    };

    regiao() {
        //Responsável por Criar o label e adicioná-lo no DOM;
        let label = document.createElement('label');
        label.setAttribute('for', 'regiao');
        label.innerHTML = 'Região';
        this.filtro.appendChild(label);

        //Responsável por criar o select;
        let select = document.createElement('select');
        select.id = 'regiao';

        let options = ['Escolha uma região', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

        //Responsável por criar as opções;
        options.map(option => {
            let opt = document.createElement('option');
            opt.value = option;
            opt.innerHTML = option;

            select.appendChild(opt);
        })

        //Responsável por inserir o seletor no DOM;
        this.filtro.appendChild(select);
    };

    input(labelText) {
        //Responsável por criar um input dependendo do método de filtro;
        let label = document.createElement('label');
        label.setAttribute('for', 'inputFiltro');
        label.innerHTML = labelText;

        let input = document.createElement('input');
        input.id = 'inputFiltro';

        this.filtro.appendChild(label);
        this.filtro.appendChild(input);
    }

    render() {
        //Responsável por apagar o segundo filtro antes de adicionar outro;
        this.filtro.innerHTML = '';

        if (this.id === '1') this.regiao();
        if (this.id === '2') this.input('Insira uma Capital');
        if (this.id === '3') this.input('Insira uma Lingua');
        if (this.id === '4') this.input('Insira um País');
        if (this.id === '5') this.input('Insira um Código de ligação');
    };
}