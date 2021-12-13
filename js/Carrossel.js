class ControlaCarrossel {
    constructor(target) {
        this.slides = document.querySelectorAll('.carrossel-slide');
        this.btnSlides = document.querySelectorAll('.btn-slide');
        this.target = target;
    };

    //Responsável por mostrar a seção ativa de seletores, mantendo visível o slide ativo;
    passaArray(val) {
        let array = Array.prototype.slice.call(this.btnSlides).find(selec => selec.classList.contains('selec'));

        if (val) {
            if (array.parentElement.previousElementSibling) {
                array.parentElement.previousElementSibling.classList.remove('show');
            };
            
        } else {
            if (array.parentElement.nextElementSibling) {
                array.parentElement.nextElementSibling.classList.remove('show');
            };
        };

        array.parentElement.classList.add('show');
    };

    //Responsável por retornar ao slide anterior;
    prevSlide() {
        for (let i = 0; i < this.slides.length; i++) {
            if (i - 1 !== -1) {
                if (this.slides[i].classList.contains('show-left') || this.slides[i].classList.contains('show-right')) {

                    if (this.slides[i].classList.contains('show-left')) {
                        this.slides[i].classList.remove('show-left');
                    };

                    if (this.slides[i].classList.contains('show-right')) {
                        this.slides[i].classList.remove('show-right')
                    };

                    this.slides[i - 1].classList.add('show-right');
                    this.btnSlides[i].classList.remove('selec');
                    this.btnSlides[i - 1].classList.add('selec');

                    this.passaArray(false);
                    break;
                };
            };
        };
    };

    //Responsável por passar para o próximo slide;
    nextSlide() {
        for (let i = 0; i < this.slides.length; i++) {
            if (i + 1 !== this.slides.length) {
                if (this.slides[i].classList.contains('show-left') || this.slides[i].classList.contains('show-right')) {

                    if (this.slides[i].classList.contains('show-left')) {
                        this.slides[i].classList.remove('show-left');
                    };

                    if (this.slides[i].classList.contains('show-right')) {
                        this.slides[i].classList.remove('show-right')
                    };

                    this.slides[i + 1].classList.add('show-left');
                    this.btnSlides[i].classList.remove('selec');
                    this.btnSlides[i + 1].classList.add('selec');

                    this.passaArray(true);
                    break;
                };
            };
        };
    };

    //Responsável por identidicar os eventos e repassá-los para as devidas funções;
    render() {
        const btnPrev = this.target.classList.contains('btn-prev') || this.target.classList.contains('fa-chevron-left');
        const btnNext = this.target.classList.contains('btn-next') || this.target.classList.contains('fa-chevron-right');

        if (btnPrev) this.prevSlide();
        if (btnNext) this.nextSlide();
    };
};