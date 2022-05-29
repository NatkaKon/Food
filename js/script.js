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



});