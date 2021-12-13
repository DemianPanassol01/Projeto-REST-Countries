class Countries {
    constructor(value, selectedOption, btnView) {
        this.value = value;
        this.btnView = btnView;
        this.selectedOption = selectedOption;
        this.resultadoPesquisa = document.getElementById('resultadoPesquisa');
        this.url = 'https://restcountries.com/v3.1/';
    };

    //Responsável por realizar a pesquisa de acordo com o filtro escolhido;
    async pesquisaRegiao(value) {
        try {
            let resultado;

            if (this.selectedOption === '1') resultado = await axios.get(`${this.url}region/${value}?fields=flags,name`);

            if (this.selectedOption === '2') resultado = await axios.get(`${this.url}capital/${value}?fields=flags,name`);

            if (this.selectedOption === '3') resultado = await axios.get(`${this.url}lang/${value}?fields=flags,name`);

            if (this.selectedOption === '4') resultado = await axios.get(`${this.url}name/${value}?fields=flags,name`);

            if (this.selectedOption === '5') resultado = await axios.get(`https://restcountries.com/v2/callingcode/${value}?fields=flags,name`);

            let flags = [];
            for (let i = 0; i < resultado.data.length; i++) {
                let img = resultado.data[i].flags.png;
                let name;
                if (this.selectedOption === '5') {
                    name = resultado.data[i].name;
                } else {
                    name = resultado.data[i].name.official;
                };

                flags.push({ img, name });
            };

            //Responnsável por mostrar a mensagem de erro quando a pesquisa é bem sucedida mas não retorna resultados;
            if (flags.length === 0) throw new Error;

            this.criaCarrossel(flags, this.btnView);
        } catch (error) {
            this.mensagemErro();
        };
    };

    //Responsável por realizar a pesquisa de acordo com a bandeira clicada;
    async pesquisaPais(value) {
        try {
            let resultado = await axios.get(`${this.url}name/${value}?fields=flags,name,capital,region,subregion,population,languages,nativeName,borders`);

            let pais = {
                nome: resultado.data[0].name.common,
                nomenativo: Array(resultado.data[0].name.nativeName)[0],
                bandeira: resultado.data[0].flags.png,
                capital: resultado.data[0].capital,
                regiao: resultado.data[0].region,
                subregiao: resultado.data[0].subregion,
                linguas: Array(resultado.data[0].languages),
                populacao: resultado.data[0].population,
                bordas: resultado.data[0].borders
            };

            //Responsável por transformar um "objeto de objetos" em uma Array para tornar possível o uso de um loop;
            pais.linguas = pais.linguas.map(obj => {
                return Object.keys(obj).map(lingua => {
                    return obj[lingua];
                });
            })[0];

            //Responsável por fazer a mesma coisa que o código acima, só que devido a inconsistência dos dados de resposta da API, achei necessário o uso desses códigos para tornar o construtor da seção de detalhes de cada pais mais simples e fácil de entender;
            let nomeNativo = [];
            for (const key in pais.nomenativo) {
                let nome = `${pais.nomenativo[key].official}(${key})`;
                nomeNativo.push(nome);
            };
            pais.nomenativo = nomeNativo;

            await this.criaResultadoPesquisaPais(pais);

        } catch (error) {
            this.mensagemErro();
        };
    };

    //Responsável por renderizar o resultado da pesquisa de acordo com a bandeira clicada;
    async criaResultadoPesquisaPais(obj) {
        let section = document.createElement('section'),
            divContainer = document.createElement('div'),
            img = document.createElement('img'),
            divInfo = document.createElement('div'),
            h2 = document.createElement('h2');

        section.classList.add('pesquisa-pais');
        divContainer.classList.add('pesquisa-pais-container');
        divInfo.classList.add('pesquisa-pais-info');

        img.setAttribute('src', obj.bandeira);
        img.setAttribute('alt', 'Bandeira do país pesquisado');

        divInfo.innerHTML = `
            <p>Nome: ${obj.nome}</p>
            <p>Capital: ${obj.capital.join(', ')}</p>
            <p>Região: <a id="linkRegiao">${obj.regiao}</a></p>
            <p>Sub-Região: ${obj.subregiao}</p>
            <p>População: ${obj.populacao.toLocaleString('pt-BR')} Hab.</p>
            <p>Linguas: ${obj.linguas.join(', ')}</p>
            <p>Nome nativo: ${obj.nomenativo.join(', ')}</p>
        `;

        h2.textContent = "Países Vizinhos:";

        divContainer.appendChild(img);
        divContainer.appendChild(divInfo);

        section.appendChild(divContainer);
        section.appendChild(h2);

        this.resultadoPesquisa.appendChild(section);

        let paisesVizinhos = [];

        for (let i = 0; i < obj.bordas.length; i++) {
            let pesquisa = await axios.get(`${this.url}alpha/${obj.bordas[i]}?fields=flags,name`);
            let img = pesquisa.data.flags.png;
            let name = pesquisa.data.name.common;
            paisesVizinhos.push({ img, name });
        };

        //Caso o país não faça fronteira com nenhum outro.
        if (paisesVizinhos.length === 0) {
            this.mensagemErro('País não faz fronteira com nenhuma outra nação')
        } else {
            this.criaCarrossel(paisesVizinhos, this.btnView);
        };
    };

    //Responsável por criar o carrossel usando dados vindo da pesquisa através do filtro e dos países vizinhos;
    criaCarrossel(array, btnView = 5) {
        let flagsView = [];
        for (let i = 0; i < array.length; i++) {
            //Responsável por criar um Array contendo elementos img com o resultado da pesquisa;
            let carrosselImg = document.createElement('img');
            carrosselImg.setAttribute('src', array[i].img);
            carrosselImg.setAttribute('data-name', array[i].name)
            carrosselImg.setAttribute('alt', 'Imagem de uma bandeira de um país');
            flagsView.push(carrosselImg);
        };

        //Responsável por criar o carrossel e popular cada slide;
        let carrosselDiv = document.createElement('div');
        carrosselDiv.classList.add('carrossel');

        for (let i = 0; i < Math.ceil(array.length / 3); i++) {

            let carrosselSlide = document.createElement('div');
            carrosselSlide.classList.add('carrossel-slide');
            if (i === 0) carrosselSlide.classList.add('show-left');

            for (let f = 0; f < 3; f++) {
                let img = flagsView.shift();
                if (img !== undefined) {
                    carrosselSlide.appendChild(img);
                };
            }

            carrosselDiv.appendChild(carrosselSlide);
        }

        //Responsável por adicionar os slides no DOM;
        this.resultadoPesquisa.appendChild(carrosselDiv);

        //Responsável por criar os elementos que contém os botões;
        let divBtn = document.createElement('div');
        divBtn.classList.add('carrossel-btns');

        divBtn.innerHTML = `
            <button class="btn btn-prev"><i class="fas fa-chevron-left"></i></button>
                <div id="carrBtn">
                </div>
            <button class="btn btn-next"><i class="fas fa-chevron-right"></i></button>
            `;

        //Responsável por adicionar os elementos que contém os botões no DOM;
        this.resultadoPesquisa.appendChild(divBtn);

        //Responsável por criar os id para cada botão;
        let seletorId = [];
        for (let i = 0; i < document.querySelectorAll('.carrossel-slide').length; i++) {
            let id = i + 1;
            seletorId.push(id);
        };

        //Responsável por criar cada div que irá abrigar a seção de botões;
        for (let i = 0; i < Math.ceil(carrosselDiv.childElementCount / btnView); i++) {
            let btnArray = document.createElement('div');
            btnArray.id = 'btnArray';
            if (i === 0) btnArray.classList.add('show');

            //Responsável por criar os botões correspondentes para cada slide;
            for (let f = 0; f < btnView; f++) {
                let seletor = seletorId.shift();
                if (seletor !== undefined) {
                    let btn = document.createElement('button');
                    btn.classList.add('btn');
                    btn.classList.add('btn-slide');
                    if (i === 0 && f === 0) btn.classList.add('selec');

                    btn.textContent = seletor;
                    btnArray.appendChild(btn);
                };
            };

            document.getElementById('carrBtn').appendChild(btnArray);
        };

    };

    //Responsável por mostrar uma mensagem de erro caso a pesquisa não retorne resultados;
    mensagemErro(msg) {
        let h1 = document.createElement('h1');
        h1.classList.add('msg-erro');

        if(msg) {
            h1.textContent = msg
        } else {
            h1.textContent = "Erro na pesquisa: Sua pesquisa não retornou resultados. Por favor, tente novamente";
        };
        
        this.resultadoPesquisa.appendChild(h1);
    };

    //Responsável por resetar o campo de resultado e chamar o método que realiza a pesquisa pelo filtro escolhido;
    async renderPesquisa() {
        this.resultadoPesquisa.innerHTML = '';

        await this.pesquisaRegiao(this.value);

        return carrosselBtns();
    };

    //Responsável por resetar o campo de resultado e chamar o méto que realiza a pesquisa por bandeira clicada;
    async renderPais(val) {
        this.resultadoPesquisa.innerHTML = '';

        await this.pesquisaPais(val);
        return carrosselBtns();
    };
};



