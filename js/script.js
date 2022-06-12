window.addEventListener('DOMContentLoaded', () => {

    //------------------Tabs---------------------

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabContent.forEach(item => {
            item.style.display = 'none'; //скрываем контент tabов
        });

        //когда скрываем, то убираем класс активностей у всех табов
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    //функция, которая показывает нам табы
    function showTabContent(i = 0) {
        tabContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent(0);//дефолтное значение, первый таб

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {

            tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
// ---------------TIMER--------------------------
    const deadLine = '2022-11-11';

    //функция, которая определяет разницу между текущим временем и дедлайном

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;

        //кол-во милисекунд в нашем конечном времени - наша текущая дата в милисекундах
        const t = Date.parse(endtime) - Date.parse(new Date()); 

        if(t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            //необходимо разницу в милисек преврать в количество дней/минут/секунд..
            //количество дней = колв-о милисекунд в переменной / на произведение 1000 милисек * 60 (получаем в 1 минуте) * 60(получаем в 1 часе) * 24(получаем сколько в сутках милисек) Получаем сколько суток осталось до дедлайна
            days = Math.floor( (t / (1000 * 60 * 60 * 24)) );
            // общее кол-во часов, которое осталось до дедлайна % 24(количество часов в сутках) = кол-во целых суток, но т.к. мы используем оператор остатка, мы получаем хвостик, которого не хватает до полных суток
            hours = Math.floor((t / (1000 * 60 * 60) % 24));
            minutes  = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }
  
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    //добавляем 0 перед цифрой
    function gerZero(num) {
        if(num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }


    //пишем функцию, которая устанавливает таймер на страницу

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        let timeInterval = setInterval(updateClock, 1000); //обновление каждую секунду

        updateClock(); //чтобы избежать мигание верстки

        //функция, которая обновляет таймер каждую секунду

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = gerZero(t.days);
            hours.innerHTML = gerZero(t.hours);
            minutes.innerHTML = gerZero(t.minutes);
            seconds.innerHTML = gerZero(t.seconds);
            //если время уже вышло, мы таймер не обновляем
            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadLine);


    //-------------MODAL---------------
    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');


    //функция открытия модального окна

    function openModal() {
        modal.style.display = 'block';
        // Либо вариант с toggle - но тогда назначить класс в верстке
        document.body.style.overflow = 'hidden'; // чтобы не скролилась страница, когда модальное окно открыто
        clearInterval(modalTimerId); //если пользователь сам открыл окно, оно непоявится еще раз-очистим интервал
    }


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    }); 

    //функция закрытия модального окна
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; //восстановить скрол на странице, когдазакрываем модальное окно
    }
    modalCloseBtn.addEventListener('click', closeModal);
    
    //клик на подложку закрывает модальное окно
    modal.addEventListener('click', (event) => {
        if(event.target === modal){
            closeModal();
        }
    });

    //закрытие по нажатию на Esc
    document.addEventListener('keydown', (event) => { 
        if (event.code === 'Escape' ) {
            closeModal();
        }
    });
    //чтобы МО появлялось когда пользователь долистал страницу до конца или через определнный промежуток времени

    const modalTimerId = setTimeout(openModal, 5000);

    //когда пользователь долистает до конца страницы появится МО
   function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            //удаляем обработчик события чтобы окно не выскакивало каждый раз, когда мы долистываем до конца, а только 1 раз
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

//используем классы для карточек
    class MenuCard {
        constructor(src, alt, title, description, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 2.5;
            this.changeToBY();
        }

        changeToBY() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                 <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.description}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> BYN/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }
    
    /* const div = new MenuCard();
      div.render();
    это можно записать короче*/

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        10,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню "Премиум"',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        12,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        '.menu .container'
    ).render();

        //FORMS

        const forms = document.querySelectorAll('form');

        const message = {
            loading: 'img/form/spinner.svg',
            success: 'Спасибо, скоро с вами свяжемся',
            failure: 'Что-топошло не так...'
        };

        forms.forEach((item) => {
            postData(item);
        });

        function postData(form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();//отменяем перезагрузку страницы

                const statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;   
                `;
                //form.append(statusMessage);
                //вместо append используем чтобы спиннер появлялся ниже
                form.insertAdjacentElement('afterend', statusMessage);

                const request = new XMLHttpRequest();
                request.open('POST', 'server.php');

               

                request.setRequestHeader('Content-type', 'application/json');
               
                const formData = new FormData(form);

                const object = {};
                formData.forEach(function (value, key) {
                    object[key] = value;
                });
                const json = JSON.stringify(object);

                request.send(json);

                request.addEventListener('load', () => {
                    if(request.status === 200) {
                        console.log(request.response);
                        statusMessage.textContent = message.success;
                        form.reset();//очищаем форму после отправки
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 2000); 
                    } else {
                        statusMessage.textContent = message.failure;
                    }
                });

            });
        } 
        fetch('http://localhost:3000/menu')
            .then(data => data.json())
            .then(res => console.log(res));


            //SLIDER

            const slides = document.querySelectorAll('.offer__slide'),
                  slider = document.querySelector('.offer__slider'),
                  prev = document.querySelector('.offer__slider-prev'),
                  next = document.querySelector('.offer__slider-next'),
                  total = document.querySelector('#total'),
                  current = document.querySelector('#current');

            
            let slideIndex = 1;

            showSlides(slideIndex);

            if(slides.length < 10) {
                total.textContent = `0${slides.length}`;
            } else {
                total.textContent = slides.length;
            }

            function showSlides(n) {
                if(n > slides.length) {
                    slideIndex = 1;
                }

                if(n < 1) {
                    slideIndex = slideIndex.length;
                }
     
                slides.forEach((item) => item.style.display = 'none');

                slides[slideIndex - 1].style.display = 'block';


                if(slides.length < 10) {
                    current.textContent = `0${slideIndex}`;
                } else {
                    current.textContent = slideIndex;
                }
            }
        
            //console.log(slider.style);
            // slider.style.position = 'relative';
            

            // const indicators = document.createElement('ol');
            // indicators.classList.add('carules-indicators');
            // indicators.style,cssText = `
            //     position: absolute;
            //     right: 0;
            //     bottom: 0;
            //     left: 0;
            //     z-index: 15;
            //     display: flex;
            //     justify-content: center;
            //     margin-right: 15%;
            //     margin-left: 15%;
            //     list-style: none;
            // `;
            // slider.append(indicators);

            // for (let i = 0; i < slides.length; i++) {
            //     const dot = document.createElement('li');
            //     dot.setAttribute('data-slide-to', i + 1);
            //     dot.style.cssText= `
            //         box-sizing: content-box;
            //         flex: 0 1 auto;
            //         width: 30px;
            //         height: 6px;
            //         margin-right: 3px;
            //         margin-left: 3px;
            //         cursor: pointer;
            //         background-color: #fff;
            //         background-clip: padding-box;
            //         border-top: 10px solid transparent;
            //         border-bottom: 10px solid transparent;
            //         opacity: .5;
            //         transition: opacity .6s ease;
            //     `;
            //     indicators.append(dot);
            // }




            function plusSlides(n) {
                showSlides(slideIndex += n);
            }
            prev.addEventListener('click', () => {
                plusSlides(-1);
            }); 
            next.addEventListener('click', () => {
                plusSlides(+1);
            }); 

        //calculator
        
        const result = document.querySelector('.calculating__result span');

        let sex, height, weight, age, ratio;

        //если в localStorage уже есть какая-тоинформация, то мы ее от туда берем и помещаем в переменные sex и ratio, а если нет, то установим по умолчанию

        if(localStorage.getItem('sex')) {
            sex = localStorage.getItem('sex');
        } else {
            sex = 'female';
            localStorage.setItem('sex', 'female');
        }

        if(localStorage.getItem('ratio')) {
            ratio = localStorage.getItem('ratio');
        } else {
            ratio = 1.375;
            localStorage.setItem('ratio', 1.375);
        }
        

        function initLocalSettings(selector, activeClass) {
            const elements = document.querySelectorAll(selector);

            elements.forEach(elem => {
                elem.classList.remove(activeClass);

                if(elem.getAttribute('id') === localStorage.getItem('sex')) {
                    elem.classList.add(activeClass);
                }

                if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                  elem.classList.add(activeClass);  
                }
            });
        }

        initLocalSettings('#gender div', 'calculating__choose-item_active');
        initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
    
        function calcTotal() {
            if (!sex || !height || !weight || !age || !ratio) {
                result.textContent = '____'; // Можете придумать что угодно
                return;
            }
            if (sex === 'female') {
                result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
            } else {
                result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
            }
        }
    
        calcTotal();
    
        function getStaticInformation(selector, activeClass) {
            const elements = document.querySelectorAll(selector);
    
            elements.forEach(elem => {
                elem.addEventListener('click', (e) => {
                    if (e.target.getAttribute('data-ratio')) {
                        ratio = +e.target.getAttribute('data-ratio');
                        localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                    } else {
                        sex = e.target.getAttribute('id');
                        localStorage.setItem('sex', e.target.getAttribute('id'));
                    }
        
                    elements.forEach(elem => {
                        elem.classList.remove(activeClass);
                    });
        
                    e.target.classList.add(activeClass);
        
                    calcTotal();
                });
            });
        }
    
        getStaticInformation('#gender div', 'calculating__choose-item_active');
        getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
    
        function getDynamicInformation(selector) {
            const input = document.querySelector(selector);
    
            input.addEventListener('input', () => {

                //проверка если пользовательвводит НЕ ЧИСЛО
                if (input.value.match(/\D/g)) {
                    input.style.border = '2px solid red';
                } else {
                    input.style.border = 'none';
                }

                switch(input.getAttribute('id')) {
                    case "height":
                        height = +input.value;
                        break;
                    case "weight":
                        weight = +input.value;
                        break;
                    case "age":
                        age = +input.value;
                        break;
                }
    
                calcTotal();
            });
        }
    
        getDynamicInformation('#height');
        getDynamicInformation('#weight');
        getDynamicInformation('#age');
});