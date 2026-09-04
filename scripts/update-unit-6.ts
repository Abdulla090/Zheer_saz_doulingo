import fs from 'fs';
import unit06 from '../src/data/normal-english/unit-6-travel-and-exploring';

const ruData = [
  // Lesson 0: Immigration & Customs
  {
    topicRu: "Иммиграционный и таможенный контроль",
    wordsRu: [
      "Цель вашего визита",
      "Декларировать что-либо (подлежащее пошлине)",
      "Срок пребывания",
      "Стыковочный рейс (пересадка)",
      "Обратный билет"
    ],
    voicesRu: [
      { promptRu: "Вопрос пограничника", targetRussian: "Какова цель вашего визита в эту страну?" },
      { promptRu: "Указать дату возвращения", targetRussian: "У меня есть обратный билет на 15-е число следующего месяца." }
    ],
    sentencesRu: [
      "У вас есть что декларировать на таможне?",
      "Срок моего пребывания составит две недели."
    ],
    fillBlanksRu: [
      {
        russianHint: "Я здесь в отпуске. Цель моего визита — туризм.",
        russianParts: ["Я здесь в отпуске. ", " моего визита — туризм."] as [string, string],
        russianAnswer: "Цель",
        russianWrongs: ["Причина", "Способ", "Идея"] as [string, string, string]
      },
      {
        russianHint: "Мне нужно успеть на стыковочный рейс в Лондон у выхода 4.",
        russianParts: ["Мне нужно успеть на свой ", " рейс в Лондон у выхода 4."] as [string, string],
        russianAnswer: "стыковочный",
        russianWrongs: ["второй", "следующий", "быстрый"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "Перед сотрудником паспортного контроля",
        theyAskRu: "Добро пожаловать. Могу я взглянуть на ваш паспорт? Какова цель вашего визита?",
        correctRu: "Вот мой паспорт. Цель моего визита — туризм. Срок моего пребывания — ровно две недели.",
        wrong1Ru: "Я здесь в отпуске на две недели.",
        wrong2Ru: "Я посещаю страну как турист.",
        wrong3Ru: "Я пробуду здесь ровно две недели.",
        explanationRu: "'Purpose of your visit' (цель визита) и 'duration of stay' (срок пребывания) — стандартные официальные вопросы в любом аэропорту."
      }
    ]
  },

  // Lesson 1: Renting a Car Abroad
  {
    topicRu: "Аренда автомобиля",
    wordsRu: [
      "Международное водительское удостоверение",
      "Полная страховка (КАСКО)",
      "Безлимитный пробег",
      "Место возврата автомобиля",
      "Механика или автомат"
    ],
    voicesRu: [
      { promptRu: "Спросить о страховке", targetRussian: "Я бы хотел добавить полную страховку к аренде." },
      { promptRu: "Место возврата машины", targetRussian: "Могу ли я выбрать другое место возврата автомобиля?" }
    ],
    sentencesRu: [
      "Вам здесь требуется международное водительское удостоверение?",
      "У этого автомобиля безлимитный пробег?"
    ],
    fillBlanksRu: [
      {
        russianHint: "Я умею водить только машину с автоматической коробкой передач.",
        russianParts: ["Я умею водить только коробку-", "."] as [string, string],
        russianAnswer: "автомат",
        russianWrongs: ["механику", "стандарт", "спорт"] as [string, string, string]
      },
      {
        russianHint: "Убедитесь, что у вас есть полная страховка на всякий случай.",
        russianParts: ["Убедитесь, что у вас есть полная ", " на всякий случай."] as [string, string],
        russianAnswer: "страховка",
        russianWrongs: ["оплата", "бумага", "защита"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "В офисе проката автомобилей",
        theyAskRu: "У нас свободен внедорожник. Вы хотите базовую или полную страховку?",
        correctRu: "Я возьму полную страховку, пожалуйста. И ещё: аренда включает безлимитный пробег?",
        wrong1Ru: "Я предпочитаю вариант с полной страховкой.",
        wrong2Ru: "Полное покрытие включает повреждения автомобиля?",
        wrong3Ru: "Есть ли ограничение по пробегу при аренде?",
        explanationRu: "Прокатные компании используют термины 'coverage' (страховое покрытие) и 'mileage' (пробег)."
      }
    ]
  },

  // Lesson 2: Navigating Public Transport
  {
    topicRu: "Общественный транспорт",
    wordsRu: [
      "Какая линия идёт до...",
      "Билет туда и обратно",
      "Осторожно, зазор (между вагоном и платформой)",
      "Час пик",
      "Пересадка на следующей остановке"
    ],
    voicesRu: [
      { promptRu: "Купить билет туда и обратно", targetRussian: "Я бы хотел один билет туда и обратно до центра города." },
      { promptRu: "Спросить дорогу", targetRussian: "Извините, какая линия идёт до центрального вокзала?" }
    ],
    sentencesRu: [
      "Вам нужно сделать пересадку на следующей остановке.",
      "Поезда сильно переполнены в час пик."
    ],
    fillBlanksRu: [
      {
        russianHint: "Пожалуйста, отойдите назад и будьте осторожны у края платформы.",
        russianParts: ["Пожалуйста, отойдите назад и будьте осторожны, не оступитесь в ", "."] as [string, string],
        russianAnswer: "зазор",
        russianWrongs: ["поезд", "дверь", "путь"] as [string, string, string]
      },
      {
        russianHint: "Билет в один конец стоит 5 долларов, а туда и обратно — 9 долларов.",
        russianParts: ["Билет в один конец стоит 5 долларов, а билет туда и ", " — 9 долларов."] as [string, string],
        russianAnswer: "обратно",
        russianWrongs: ["вместе", "назад", "снова"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "Разговор с сотрудником метро",
        theyAskRu: "Помочь вам найти нужный поезд?",
        correctRu: "Да, пожалуйста. Какая линия идёт до музея? И нужно ли пересаживаться на следующей остановке?",
        wrong1Ru: "Да, на какой поезд мне сесть до музея?",
        wrong2Ru: "Не подскажете, нужно ли мне менять поезда?",
        wrong3Ru: "Какая линия метро останавливается около музея?",
        explanationRu: "'Which line goes to' (какая линия идёт до) и 'transfer' (пересадка) — ключевые фразы в общественном транспорте."
      }
    ]
  },

  // Lesson 3: Dealing with Lost Luggage
  {
    topicRu: "Утерянный багаж",
    wordsRu: [
      "Мой багаж не прибыл",
      "Зона выдачи багажа",
      "Подать заявление об утере багажа",
      "Багажная бирка",
      "Доставить его в мой отель"
    ],
    voicesRu: [
      { promptRu: "Сообщить об утере", targetRussian: "Мой багаж ещё не прибыл. Где я могу составить заявление?" },
      { promptRu: "Запрос на доставку", targetRussian: "Когда его найдут, вы сможете доставить его в мой отель?" }
    ],
    sentencesRu: [
      "Вот моя багажная бирка и посадочный талон.",
      "Я прождал у зоны выдачи багажа целый час."
    ],
    fillBlanksRu: [
      {
        russianHint: "Мне нужно немедленно составить заявление об утере багажа.",
        russianParts: ["Мне нужно немедленно составить ", " об утере багажа."] as [string, string],
        russianAnswer: "заявление",
        russianWrongs: ["бумагу", "форму", "чек"] as [string, string, string]
      },
      {
        russianHint: "Пожалуйста, проверьте номер моей багажной бирки.",
        russianParts: ["Пожалуйста, проверьте номер моей багажной ", "."] as [string, string],
        russianAnswer: "бирки",
        russianWrongs: ["наклейки", "бумажки", "карты"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "В отделе розыска багажа в аэропорту",
        theyAskRu: "Сожалею, что вашей сумки нет на ленте. У вас есть квитанция?",
        correctRu: "Да, вот моя багажная бирка. Мой багаж не прибыл. Мне нужно составить акт об утере багажа и оформить доставку в отель.",
        wrong1Ru: "Да, вот бирка от моей пропавшей сумки.",
        wrong2Ru: "Мой чемодан так и не появился в зоне выдачи багажа.",
        wrong3Ru: "Не могли бы вы помочь мне заявить о пропаже багажа?",
        explanationRu: "'File a report' (подать заявление) и предъявление 'luggage tag' (багажной бирки) — официальная процедура в аэропортах."
      }
    ]
  },

  // Lesson 4: Checking into an Airbnb
  {
    topicRu: "Airbnb и аренда жилья",
    wordsRu: [
      "Инструкции по самостоятельному заселению",
      "Код от сейфа с ключами (мини-сейфа)",
      "Правила проживания в доме",
      "Пароль от Wi-Fi",
      "Оставить отзыв"
    ],
    voicesRu: [
      { promptRu: "Спросить об инструкциях", targetRussian: "Не могли бы вы прислать мне инструкции по самостоятельному заселению?" },
      { promptRu: "Код от ключей", targetRussian: "Код от сейфа с ключами не подходит." }
    ],
    sentencesRu: [
      "Пожалуйста, обязательно ознакомьтесь с правилами дома.",
      "Где я могу найти пароль от Wi-Fi?"
    ],
    fillBlanksRu: [
      {
        russianHint: "Мы отлично провели время и обязательно оставим положительный отзыв.",
        russianParts: ["Мы отлично провели время и обязательно оставим положительный ", "."] as [string, string],
        russianAnswer: "отзыв",
        russianWrongs: ["комментарий", "сообщение", "текст"] as [string, string, string]
      },
      {
        russianHint: "Я не смог открыть дверь. Напомните код от сейфа для ключей?",
        russianParts: ["Я не смог открыть дверь. Напомните код от ", " для ключей?"] as [string, string],
        russianAnswer: "сейфа",
        russianWrongs: ["замка", "двери", "ящика"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "Переписка с хозяином жилья",
        theyAskRu: "Здравствуйте! Вы заселяетесь сегодня. Дайте знать, если что-то понадобится.",
        correctRu: "Здравствуйте! Я только что приехал. Код от мини-сейфа не работает. Могли бы вы снова отправить инструкции по самостоятельному заселению?",
        wrong1Ru: "Здравствуйте, я на месте, но не могу войти.",
        wrong2Ru: "Не подскажете, как открыть сейф с ключом?",
        wrong3Ru: "Я приехал, и коробка с ключами, кажется, сломана.",
        explanationRu: "'Self check-in' (самозаселение) и 'lockbox' (бокс для ключей) — стандартные термины сервисов аренды вроде Airbnb."
      }
    ]
  },

  // Lesson 5: Medical Emergencies Abroad
  {
    topicRu: "Неотложная медицинская помощь",
    wordsRu: [
      "Мне нужна скорая помощь",
      "Туристическая страховка",
      "Рецептурное лекарство",
      "Аллергическая реакция",
      "Пищевое отравление"
    ],
    voicesRu: [
      { promptRu: "Срочный вызов помощи", targetRussian: "Пожалуйста, вызовите скорую, это экстренный случай!" },
      { promptRu: "Описать проблему со здоровьем", targetRussian: "Кажется, у меня сильное пищевое отравление." }
    ],
    sentencesRu: [
      "Покрывает ли ваша туристическая страховка посещение больницы?",
      "У меня сильная аллергическая реакция."
    ],
    fillBlanksRu: [
      {
        russianHint: "Вы не можете купить эти таблетки здесь без рецепта.",
        russianParts: ["Вы не можете купить эти таблетки здесь без ", "."] as [string, string],
        russianAnswer: "рецепта",
        russianWrongs: ["врача", "бумаги", "справки"] as [string, string, string]
      },
      {
        russianHint: "Обязательно купите туристическую страховку перед полётом.",
        russianParts: ["Обязательно оформите туристическую ", " перед полётом."] as [string, string],
        russianAnswer: "страховку",
        russianWrongs: ["путёвку", "карту", "визу"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "В аптеке за границей",
        theyAskRu: "Вам плохо? Вам нужен врач?",
        correctRu: "Кажется, у меня аллергическая реакция на то, что я съел. У вас есть лекарство, или мне нужен рецепт?",
        wrong1Ru: "Думаю, съеденное вызвало у меня аллергию.",
        wrong2Ru: "У меня сыпь, мне нужно что-нибудь от аллергии.",
        wrong3Ru: "Не подскажете, нужно ли мне показаться врачу?",
        explanationRu: "За границей есть строгое разделение между безрецептурными препаратами и лекарствами 'by prescription' (только по рецепту врача)."
      }
    ]
  },

  // Lesson 6: Haggling & Buying Souvenirs
  {
    topicRu: "Торг на рынке",
    wordsRu: [
      "Можете снизить цену?",
      "Это дороговато (высокая цена)",
      "Какова ваша окончательная цена? (лучшая цена)",
      "Я дам вам... (предлагаю сумму)",
      "Грабеж среди бела дня (обдираловка)"
    ],
    voicesRu: [
      { promptRu: "Попросить снизить цену", targetRussian: "Это дороговато. Не могли бы вы уступить в цене?" },
      { promptRu: "Спросить окончательную цену", targetRussian: "Если я возьму три штуки, какую лучшую цену вы предложите?" }
    ],
    sentencesRu: [
      "Не покупай это там, это чистой воды обдираловка.",
      "Я дам вам за это двадцать долларов."
    ],
    fillBlanksRu: [
      {
        russianHint: "Пятьдесят долларов? Это дороговато для маленькой рубашки.",
        russianParts: ["Пятьдесят долларов? Это ", " для простой футболки."] as [string, string],
        russianAnswer: "дороговато",
        russianWrongs: ["высоко", "много", "тяжело"] as [string, string, string]
      },
      {
        russianHint: "100 долларов — это чистый грабёж. Я видел это за 20 долларов в другом месте.",
        russianParts: ["100 долларов — это чистый ", ". Я видел то же самое за 20 долларов в другом месте."] as [string, string],
        russianAnswer: "грабёж",
        russianWrongs: ["обман", "плохо", "подделка"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "На восточном рынке покупаешь сувенир",
        theyAskRu: "Только для тебя, друг мой, специальная цена: 50 долларов.",
        correctRu: "Это дороговато для маленького сувенира. Какова ваша лучшая цена? Я отдам за него 30 долларов.",
        wrong1Ru: "Пятьдесят — это больше, чем я рассчитывал потратить.",
        wrong2Ru: "Согласитесь ли вы взять тридцать долларов?",
        wrong3Ru: "Есть ли возможность немного уступить в цене?",
        explanationRu: "'That's a bit steep' (дороговато) и 'What's your best price' (ваша лучшая цена) — вежливые и естественные обороты при торге."
      }
    ]
  },

  // Lesson 7: Guided Tours
  {
    topicRu: "Экскурсии с гидом",
    wordsRu: [
      "Экскурсовод (гид)",
      "Место встречи (сбора группы)",
      "Свободное время",
      "Входная плата (билет)",
      "Проход без очереди"
    ],
    voicesRu: [
      { promptRu: "Спросить гида", targetRussian: "Простите, где находится место сбора после нашего свободного времени?" },
      { promptRu: "Стоимость входа", targetRussian: "Включает ли билет входную плату в музей?" }
    ],
    sentencesRu: [
      "Мы купили билеты без очереди онлайн.",
      "Наш экскурсовод был очень эрудированным."
    ],
    fillBlanksRu: [
      {
        russianHint: "У нас будет 30 минут свободного времени, чтобы сделать фотографии.",
        russianParts: ["У нас будет 30 минут ", " времени, чтобы сделать фотографии."] as [string, string],
        russianAnswer: "свободного",
        russianWrongs: ["пустого", "хорошего", "лёгкого"] as [string, string, string]
      },
      {
        russianHint: "Место сбора на автобус находится рядом с фонтаном.",
        russianParts: ["Место ", " на автобус находится рядом с фонтаном."] as [string, string],
        russianAnswer: "сбора",
        russianWrongs: ["старта", "ожидания", "встреч"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "Разговор с гидом на экскурсии",
        theyAskRu: "Сейчас мы зайдем в замок. У всех есть билеты?",
        correctRu: "У меня есть билет, но я хотел спросить: входной билет включен, и мы проходим без очереди?",
        wrong1Ru: "У меня есть билет. Нам нужно стоять в общей очереди?",
        wrong2Ru: "Включает ли этот билет вход в замок?",
        wrong3Ru: "Где мне нужно показать свой билет?",
        explanationRu: "'Skip the line' (без очереди) — популярная услуга на туристических объектах, позволяющая пройти без ожидания."
      }
    ]
  },

  // Lesson 8: Eating at Street Food Stalls
  {
    topicRu: "Уличная еда",
    wordsRu: [
      "Это острое блюдо?",
      "Какое здесь местное фирменное блюдо?",
      "Ларёк с уличной едой (киоск)",
      "На вынос (с собой)",
      "Вегетарианские блюда"
    ],
    voicesRu: [
      { promptRu: "Спросить о местном блюде", targetRussian: "Какое здесь фирменное местное блюдо?" },
      { promptRu: "Заказ с собой", targetRussian: "Мне две порции вот этого с собой, пожалуйста." }
    ],
    sentencesRu: [
      "Есть ли у вас вегетарианские блюда?",
      "Тот уличный ларёк выглядит очень популярным среди местных жителей."
    ],
    fillBlanksRu: [
      {
        russianHint: "Вы могли бы сделать не слишком острым? Я плохо переношу перец чили.",
        russianParts: ["Вы могли бы сделать не слишком ", "? Я не переношу чили."] as [string, string],
        russianAnswer: "острым",
        russianWrongs: ["горячим", "красным", "крепким"] as [string, string, string]
      },
      {
        russianHint: "Я бы хотел этот сэндвич с собой, пожалуйста.",
        russianParts: ["Мне этот сэндвич с ", ", пожалуйста."] as [string, string],
        russianAnswer: "собой",
        russianWrongs: ["на вынос", "домой", "назад"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "У уличного киоска с едой в Бангкоке или Мехико",
        theyAskRu: "Привет! Что вам приготовить сегодня?",
        correctRu: "Я хотел бы попробовать местное фирменное блюдо, но оно острое? Если да, можно сделать не слишком острым? И мне с собой.",
        wrong1Ru: "Какое местное блюдо вы бы посоветовали?",
        wrong2Ru: "Я бы хотел что-нибудь неострое навынос.",
        wrong3Ru: "Не могли бы вы приготовить фирменное блюдо без большого количества перца чили?",
        explanationRu: "В США говорят 'to go', а в Великобритании 'takeaway' для обозначения еды навынос."
      }
    ]
  },

  // Lesson 9: Meeting Other Travelers
  {
    topicRu: "Знакомство с другими путешественниками",
    wordsRu: [
      "Куда направляетесь дальше?",
      "Как долго вы уже путешествуете?",
      "Есть какие-нибудь рекомендации?",
      "Путешественник-одиночка (соло-путешественник)",
      "Быть на связи (поддерживать контакт)"
    ],
    voicesRu: [
      { promptRu: "Спросить о дальнейших планах", targetRussian: "Куда ты держишь путь дальше в этой поездке?" },
      { promptRu: "Попрощаться с новым другом", targetRussian: "Был очень рад познакомиться. Будем на связи!" }
    ],
    sentencesRu: [
      "У тебя есть рекомендации по хорошим ресторанам?",
      "Я соло-путешественник и исследую Европу."
    ],
    fillBlanksRu: [
      {
        russianHint: "Куда ты направляешься дальше после того, как уедешь отсюда?",
        russianParts: ["Куда ты ", " дальше после того, как уедешь отсюда?"] as [string, string],
        russianAnswer: "направляешься",
        russianWrongs: ["едешь", "путешествуешь", "гуляешь"] as [string, string, string]
      },
      {
        russianHint: "Надеюсь, наши пути ещё пересекутся. Давай оставаться на связи.",
        russianParts: ["Надеюсь, мы ещё пересечемся. Давай оставаться на ", "."] as [string, string],
        russianAnswer: "связи",
        russianWrongs: ["контакте", "беседе", "номере"] as [string, string, string]
      }
    ],
    conversationsRu: [
      {
        situationRu: "Разговор с другим путешественником в хостеле",
        theyAskRu: "Я приехал сюда только вчера. Путешествую уже целый месяц.",
        correctRu: "Ого, целый месяц! Я тоже путешествую один. Куда держишь путь дальше? Есть какие-нибудь советы по этому городу?",
        wrong1Ru: "Месяц — это долгая поездка. Куда ты едешь дальше?",
        wrong2Ru: "Я тоже путешествую в одиночку. Есть уже любимые места?",
        wrong3Ru: "Есть какие-нибудь советы для новичка в этом городе?",
        explanationRu: "'Where are you heading next' (куда направляешься дальше) — самый распространенный вопрос среди путешественников."
      }
    ]
  }
];

// Apply Russian fields to each lesson
unit06.forEach((lesson, i) => {
  const ru = ruData[i];
  if (!ru) throw new Error(`Missing Russian data for lesson ${i}`);

  lesson.topicRu = ru.topicRu;

  lesson.words.forEach((w, wIdx) => {
    w.russian = ru.wordsRu[wIdx];
  });

  lesson.voices.forEach((v, vIdx) => {
    v.promptRu = ru.voicesRu[vIdx].promptRu;
    v.targetRussian = ru.voicesRu[vIdx].targetRussian;
  });

  lesson.sentences.forEach((s, sIdx) => {
    s.russian = ru.sentencesRu[sIdx];
  });

  lesson.fillBlanks.forEach((fb, fbIdx) => {
    const fbRu = ru.fillBlanksRu[fbIdx];
    fb.russianHint = fbRu.russianHint;
    fb.russianParts = fbRu.russianParts;
    fb.russianAnswer = fbRu.russianAnswer;
    fb.russianWrongs = fbRu.russianWrongs;
  });

  lesson.conversations.forEach((c, cIdx) => {
    const cRu = ru.conversationsRu[cIdx];
    c.situationRu = cRu.situationRu;
    c.theyAskRu = cRu.theyAskRu;
    c.correctRu = cRu.correctRu;
    c.wrong1Ru = cRu.wrong1Ru;
    c.wrong2Ru = cRu.wrong2Ru;
    c.wrong3Ru = cRu.wrong3Ru;
    c.explanationRu = cRu.explanationRu;
  });
});

// Format as TypeScript file
const header = `import { UnitBank } from "../types";

// ── Visible Unit 9: Travel & Exploring — 10 unique lessons ───────────────────
// Advanced travel vocabulary for navigating airports, cities, emergencies, and new cultures.

const normalUnit05: UnitBank = `;

const fileContent = header + JSON.stringify(unit06, null, 2) + `;\n\nexport default normalUnit05;\n`;
fs.writeFileSync('src/data/normal-english/unit-6-travel-and-exploring.ts', fileContent, 'utf8');
console.log('Successfully updated unit-6-travel-and-exploring.ts with Russian localization!');
