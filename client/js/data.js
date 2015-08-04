angular.module('data', []).value('data', {
        "isProduction": false,
        "popupCloseLabel": "Закрыть",
        "title": "INREADO",
        "legals": {
            "year": 2015,
            "email": "team@inreado.com",
            "website": "inreado.com"
        },
        "header": {
            "title": [
                "IN",
                "READO"
            ],
            "subTitle": "beta",
            "menu": {
                "items": [
                    {
                        "text": "Возможности",
                        "state": "possibilities"
                    },
                    {
                        "text": "Преимущества",
                        "state": "advantages"
                    },
                    {
                        "text": "Стоимость",
                        "state": "pricing"
                    }
                ]
            }
        },
        "getLessonBtn": "Записаться на бесплатный урок",
        "top": {
            "header": "Обучение никогда не было таким эффективным",
            "subHeader": "Платформа для занятий по скайпу",
            "id": "possibilities"
        },
        "features": [
            {
                "id": "reading",
                "active": true,
                "title": "Развитие навыков",
                "subTitle": "чтения",
                "icon": "top__features-list__item__link_reading",
                "subFeatures": [
                    {
                        "icon": "icon-topics",
                        "active": true,
                        "title": "Адаптированные тексты на различные тематики",
                        "subTitle": "Обучающие материалы 0",
                        "subSubTitle": "На любой ступени обучения максимум внимания на уроке уделяется устной речи",
                        "text": "Вы начинаете говорить на английком уже на первом уроке, даже если пришли с нулевым уровнем. Новая лексика и грамматические конструкции изучаются и запоминаются в процессе общения."
                    },
                    {
                        "icon": "icon-adopted",
                        "active": false,
                        "title": "Выбор текстов для изучения по степени узнаваемости",
                        "subTitle": "Обучающие материалы 1",
                        "subSubTitle": "На любой ступени обучения максимум внимания на уроке уделяется устной речи",
                        "text": "Вы начинаете говорить на английком уже на первом уроке, даже если пришли с нулевым уровнем. Новая лексика и грамматические конструкции изучаются и запоминаются в процессе общения."
                    },
                    {
                        "icon": "icon-context",
                        "active": false,
                        "title": "Контекстный перевод слов",
                        "subTitle": "Обучающие материалы 2",
                        "subSubTitle": "На любой ступени обучения максимум внимания на уроке уделяется устной речи",
                        "text": "Вы начинаете говорить на английком уже на первом уроке, даже если пришли с нулевым уровнем. Новая лексика и грамматические конструкции изучаются и запоминаются в процессе общения."
                    }
                ]
            },
            {
                "icon": "top__features-list__item__link_listening",
                "active": false,
                "title": "Программные",
                "subTitle": "инструменты",
                "id": "listening",
                "subFeatures": []
            },
            {
                "id": "communication",
                "active": false,
                "title": "Озвучка",
                "subTitle": "материала",
                "icon": "top__features-list__item__link_communication",
                "subFeatures": []
            },
            {
                "id": "preparing",
                "active": false,
                "title": "Занятие",
                "subTitle": "с преподавателем",
                "icon": "top__features-list__item__link_preparing",
                "subFeatures": []
            },
            {
                "id": "effectiveStudy",
                "active": false,
                "title": "Грамматическая",
                "subTitle": "осознанность языка",
                "icon": "top__features-list__item__link_effective-study",
                "subFeatures": []
            }
        ],
        "advantages": {
            "header": "Преимущества",
            "subHeader": "Education open minds. Technology connects them. We bring you the best of both, all in one place.",
            "list": [
                {
                    "title": "Обучающие материалы",
                    "icon": "advantages__list__item__icon_materials",
                    "text": "На любой ступени обучения максимум внимания на уроке уделяется устной речи. Вы начинаете говорить на английском уже с первого урока."
                },
                {
                    "title": "С мобильного телефона",
                    "icon": "advantages__list__item__icon_studying",
                    "text": "Вы начинаете говорить на английском уже с первого урока, даже если пришли с нулевым уровнем. Новая лексика и грамматические конструкции изучаются и запоминаются в процессе общения."
                },
                {
                    "title": "Грамматика",
                    "icon": "advantages__list__item__icon_grammatic",
                    "text": "На любой ступени обучения максимум внимания на уроке уделяется устной речи. Вы начинаете говорить на английском уже с первого урока, даже если пришли с нулевым уровнем. Новая лексика и грамматические конструкции изучаются и запоминаются в процессе общения."
                },
                {
                    "title": "Индивидуальность",
                    "icon": "advantages__list__item__icon_individual",
                    "text": "На любой ступени обучения максимум внимания на уроке уделяется устной речи. Вы начинаете говорить на английском уже с первого урока, даже если пришли с нулевым уровнем. Новая лексика и грамматические конструкции изучаются и запоминаются в процессе общения."
                },
                {
                    "title": "Эффективность",
                    "icon": "advantages__list__item__icon_effective",
                    "text": "На любой ступени обучения максимум внимания на уроке уделяется устной речи. Вы начинаете говорить на английском уже с первого урока, даже если пришли с нулевым уровнем."
                }
            ],
            "id": "advantages"
        },
        "pricing": {
            "header": "Стоимость",
            "subHeader": "Education open minds. Technology conects them. We bring you the best of both, all in one place.",
            "bigPrice": {
                "amount": "1200",
                "currency": "UAH",
                "period": "месяц"
            },
            "list": [
                {
                    "icon": "pricing__list__item__icon_calendar",
                    "title": "Кол-во занятий",
                    "text": "2 в неделю"
                },
                {
                    "icon": "pricing__list__item__icon_time",
                    "title": "Длительность 1 урока",
                    "text": "1.5 часа"
                },
                {
                    "icon": "pricing__list__item__icon_card",
                    "title": "Стоимость 1 урока",
                    "text": "70 UAH"
                }
            ],
            "id": "pricing"
        },
        "feedback": {
            "id": "feedback",
            "list": [
                {
                    "title": "Ivan",
                    "text": "Hello! Your website is really good. I subscribed to updates and I'd really like to see more articles to read. Look forward to seeing new content!"
                },
                {
                    "title": "Vasiliy",
                    "text": "Awesome app"
                },
                {
                    "title": "Chuck Norris",
                    "text": "I do not always do thins like that. But when I do I do it awesome."
                }
            ]
        },
        "getLessonForm": {
            "title": "Заявка на бесплатное занятие",
            "namePlaceholder": "Имя и фамилия",
            "phonePlaceholder": "Телефон",
            "emailPlaceholder": "E-mail",
            "submitBtn": "Записаться на бесплатный урок &rarr;",
            "desktopSubmitBtn": "Отправить заявку",
            "helpText": "Возникли вопросы? Желаете записаться напрямую по телефону? Звоните прямо сейчас!",
            "phone": "+380 67 454 45 45"
        },
        "getLessonDescription": {
            "title": "Описание бесплатного урока",
            "subTitle": "Описание бесплатного урока",
            "text2": "На любой ступени обучения максимум",
            "text": "На любой ступени обучения максимум внимания на уроке уделяется устной речи. Вы начинаете говорить на английском уже с первого урока, даже если пришли с нулевым уровнем. Новая лексика и грамматические конструкции изучаются и запоминаются в процессе общения.",
            "list": [
                {
                    "icon": "icon-topics",
                    "key": "Длительность 1 урока",
                    "value": "1.5 часа"
                },
                {
                    "icon": "icon-context",
                    "key": "Стоимость 1 урока",
                    "value": "Бесплатно"
                }
            ],
            "list2": [
                "Преимущества знания",
                "Открытие навыков",
                "Преимущества знания"
            ]
        },
        "success": {
            "title": "Спасибо!",
            "text": "Ваша заявка успешно отправлена!"
        }
    }
);