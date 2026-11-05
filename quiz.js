(function () {
    var quizData = [
        {
            question: 'Чем знаменито озеро Кайынды в Алматинской области?',
            answers: [
                'Розовым цветом воды',
                'Затонувшим Тянь-Шаньским еловым лесом, стволы которого возвышаются над водой',
                'Огромным количеством песчаных дюн вокруг',
                'Самым большим количеством водопадов в регионе'
            ],
            correct: 'b'
        },
        {
            question: 'Какая часть Чарынского каньона популярна у туристов из-за необычных скальных форм?',
            answers: ['Долина замков', 'Ущелье ветров', 'Каменный город', 'Каньон красных песков'],
            correct: 'a'
        },
        {
            question: 'Что символизирует золотой шар на вершине монумента Байтерек согласно казахской мифологии?',
            answers: [
                'Солнце, освещающее степь',
                'Яйцо священной птицы Самрук',
                'Каплю росы на Дереве Жизни',
                'Символ чистоты и мира'
            ],
            correct: 'b'
        },
        {
            question: 'В каком национальном парке расположен знаменитый Поющий бархан?',
            answers: ['Баянауыл', 'Бурабай', 'Алтын-Эмель', 'Катон-Карагай'],
            correct: 'c'
        },
        {
            question: 'В чём заключается главная особенность озера Балхаш?',
            answers: [
                'Оно полностью пересыхает каждое лето',
                'Оно разделено узким проливом на пресную и солёную части',
                'Оно является самым глубоким озером в Азии',
                'В нём вода меняет цвет каждые 12 часов'
            ],
            correct: 'b'
        },
        {
            question: 'В каком городе находится мавзолей Ходжи Ахмеда Ясави — объект Всемирного наследия ЮНЕСКО?',
            answers: ['Шымкент', 'Тараз', 'Туркестан', 'Кызылорда'],
            correct: 'c'
        },
        {
            question: 'Какая пикообразная вершина Центрального Тянь-Шаня является высочайшей точкой Казахстана (6995 м)?',
            answers: ['Пик Талгар', 'Пик Хан-Тенгри', 'Пик Абая', 'Пик Белуха'],
            correct: 'b'
        },
        {
            question: 'Какая скала в курортной зоне Бурабай известна тем, что с разных ракурсов напоминает сфинкса или девушку?',
            answers: ['Окжетпес', 'Жумбактас', 'Беркутчи', 'Три сестры'],
            correct: 'b'
        },
        {
            question: 'Чем известна белоснежная гора Шеркала в Мангистауской области?',
            answers: [
                'Формой, напоминающей перевёрнутую пиалу или спящего льва',
                'Наличием глубоких подземных озёр',
                'Тем, что на её вершине вечно лежит снег',
                'Действующим гейзером у подножия'
            ],
            correct: 'a'
        },
        {
            question: 'Какое высокогорное спортивное сооружение возле Алматы называют «фабрикой рекордов»?',
            answers: [
                'Трамплинный комплекс «Сункар»',
                'Горнолыжный курорт «Шымбулак»',
                'Высокогорный каток «Медеу»',
                'Стадион «Астана Арена»'
            ],
            correct: 'c'
        }
    ];

    function renderQuestions(form) {
        var questions = quizData.map(function (item, index) {
            var questionNumber = index + 1;
            var options = item.answers.map(function (answer, answerIndex) {
                var value = String.fromCharCode(97 + answerIndex);
                return '<label class="quiz-option"><input type="radio" name="q' + questionNumber +
                    '" value="' + value + '"> ' + answer + '</label>';
            }).join('');

            return '<fieldset class="quiz-question" data-answer="' + item.correct +
                '"><legend>' + questionNumber + '. ' + item.question + '</legend>' + options +
                '<p class="quiz-feedback" aria-live="polite" hidden></p></fieldset>';
        }).join('');

        form.innerHTML = '<div class="quiz-track" tabindex="0" aria-label="Вопросы викторины">' +
            questions + '</div><div class="quiz-navigation">' +
            '<button type="button" class="quiz-previous">← Назад</button>' +
            '<output class="quiz-position" aria-live="polite"></output>' +
            '<button type="button" class="quiz-next">Далее →</button></div>' +
            '<div class="quiz-actions"><button type="submit">Проверить ответы</button>' +
            '<button type="reset" class="quiz-reset" hidden>Пройти ещё раз</button>' +
            '<p class="quiz-result" role="status" aria-live="polite"></p></div>';
    }

    document.querySelectorAll('.landmarks-quiz').forEach(function (quiz) {
        var form = quiz.querySelector('form');

        if (!form) {
            quiz.innerHTML = '<h1>Проверь себя: достопримечательности Казахстана</h1>' +
                '<p class="landmarks-quiz-intro">Насколько хорошо ты знаешь удивительные места Казахстана? ' +
                'Пролистывай вопросы, выбирай ответы и проверь свой результат.</p><form></form>';
            form = quiz.querySelector('form');
            renderQuestions(form);
        }

        var questions = Array.prototype.slice.call(form.querySelectorAll('.quiz-question'));
        var track = form.querySelector('.quiz-track');
        var result = form.querySelector('.quiz-result');
        var submitButton = form.querySelector('button[type="submit"]');
        var resetButton = form.querySelector('.quiz-reset') || form.querySelector('#quizReset');
        var previousButton = form.querySelector('.quiz-previous');
        var nextButton = form.querySelector('.quiz-next');
        var position = form.querySelector('.quiz-position');
        var currentIndex = 0;
        var scrollTimer;

        if (!track) {
            track = document.createElement('div');
            track.className = 'quiz-track';
            track.setAttribute('tabindex', '0');
            track.setAttribute('aria-label', 'Вопросы викторины');
            questions[0].parentNode.insertBefore(track, questions[0]);
            questions.forEach(function (question) {
                track.appendChild(question);
            });
        }

        if (!position) {
            var navigation = document.createElement('div');
            navigation.className = 'quiz-navigation';
            navigation.innerHTML = '<button type="button" class="quiz-previous">← Назад</button>' +
                '<output class="quiz-position" aria-live="polite"></output>' +
                '<button type="button" class="quiz-next">Далее →</button>';
            track.parentNode.insertBefore(navigation, track.nextSibling);
            previousButton = navigation.querySelector('.quiz-previous');
            nextButton = navigation.querySelector('.quiz-next');
            position = navigation.querySelector('.quiz-position');
        }

        if (!result) {
            result = document.createElement('p');
            result.className = 'quiz-result';
            result.setAttribute('role', 'status');
            result.setAttribute('aria-live', 'polite');
            form.appendChild(result);
        }

        if (!resetButton) {
            resetButton = document.createElement('button');
            resetButton.type = 'reset';
            resetButton.className = 'quiz-reset';
            resetButton.textContent = 'Пройти ещё раз';
            resetButton.hidden = true;
            submitButton.parentNode.insertBefore(resetButton, submitButton.nextSibling);
        }

        function updateNavigation() {
            position.textContent = 'Вопрос ' + (currentIndex + 1) + ' из ' + questions.length;
            previousButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === questions.length - 1;
        }

        function showQuestion(index) {
            currentIndex = Math.max(0, Math.min(index, questions.length - 1));
            track.scrollTo({
                left: currentIndex * track.clientWidth,
                behavior: 'smooth'
            });
            updateNavigation();
        }

        previousButton.addEventListener('click', function () {
            showQuestion(currentIndex - 1);
        });
        nextButton.addEventListener('click', function () {
            showQuestion(currentIndex + 1);
        });

        form.addEventListener('change', function (event) {
            if (event.target.type !== 'radio') {
                return;
            }

            var question = event.target.closest('.quiz-question');
            question.querySelectorAll('.quiz-option').forEach(function (option) {
                option.classList.toggle('is-selected', option.contains(event.target));
            });
        });

        track.addEventListener('scroll', function () {
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(function () {
                currentIndex = Math.max(0, Math.min(
                    Math.round(track.scrollLeft / track.clientWidth),
                    questions.length - 1
                ));
                updateNavigation();
            }, 80);
        }, { passive: true });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var firstUnansweredIndex = questions.findIndex(function (question) {
                return !question.querySelector('input:checked');
            });

            if (firstUnansweredIndex !== -1) {
                result.textContent = 'Ответьте на все вопросы, чтобы узнать результат.';
                result.classList.add('is-incomplete');
                showQuestion(firstUnansweredIndex);
                track.focus();
                return;
            }

            var score = 0;
            questions.forEach(function (question) {
                var correctAnswer = question.getAttribute('data-answer');
                var selectedAnswer = question.querySelector('input:checked').value;
                var feedback = question.querySelector('.quiz-feedback');
                var correctOption = question.querySelector('input[value="' + correctAnswer + '"]')
                    .parentElement.textContent.trim();

                if (selectedAnswer === correctAnswer) {
                    score += 1;
                    feedback.textContent = 'Верно!';
                    feedback.classList.add('is-correct');
                } else {
                    feedback.textContent = 'Неверно. Правильный ответ: ' + correctOption;
                    feedback.classList.add('is-incorrect');
                }
                feedback.hidden = false;
                question.querySelectorAll('input').forEach(function (input) {
                    input.disabled = true;
                });
            });

            submitButton.hidden = true;
            resetButton.hidden = false;
            result.classList.remove('is-incomplete');
            result.textContent = 'Ваш результат: ' + score + ' из ' + questions.length + '.';
            showQuestion(0);
        });

        form.addEventListener('reset', function () {
            window.setTimeout(function () {
                questions.forEach(function (question) {
                    var feedback = question.querySelector('.quiz-feedback');
                    feedback.hidden = true;
                    feedback.textContent = '';
                    feedback.classList.remove('is-correct', 'is-incorrect');
                    question.querySelectorAll('.quiz-option').forEach(function (option) {
                        option.classList.remove('is-selected');
                    });
                    question.querySelectorAll('input').forEach(function (input) {
                        input.disabled = false;
                    });
                });
                submitButton.hidden = false;
                resetButton.hidden = true;
                result.textContent = '';
                result.classList.remove('is-incomplete');
                showQuestion(0);
            }, 0);
        });

        updateNavigation();
    });
}());
