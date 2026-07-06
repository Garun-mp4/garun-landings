const TELEGRAM_USERNAME = 'Garun_mp4';
const LEAD_ENDPOINT = '/api/send-lead';

// Frontend sends заявки to a Vercel Serverless Function.
// Never put TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID into frontend JavaScript.
// In local file:// mode or localhost without /api/send-lead the forms fall back to safe demo mode.
const isTelegramConfigured = !TELEGRAM_USERNAME.includes('[') && !TELEGRAM_USERNAME.includes(']') && TELEGRAM_USERNAME.trim().length > 0;
const TELEGRAM_DIRECT_URL = isTelegramConfigured ? `https://t.me/${TELEGRAM_USERNAME.replace(/^@/, '')}` : '#lead';

const leadState = {
  source_cta: '',
  selected_case: '',
  selected_tariff: '',
  service_type: '',
  calculator_result: '',
  calculator_answers: '',
};

const cases = [
  {
    id: 'astra-house',
    title: 'Astra House — строительство частных домов в Астрахани',
    shortTitle: 'Astra House',
    url: 'https://astr-houses-landing.vercel.app/',
    image: 'cases-img/astr-houses.png',
    niche: 'Строительство домов / локальная услуга с высоким чеком',
    cardText: 'Создать лендинг для строительной компании, который объясняет условия строительства под ключ, фиксированную цену, этапы работы и помогает получить заявку на расчёт дома.',
    result: 'Получился лендинг для дорогой услуги, где пользователь видит обещание, понимает процесс, получает ценовые ориентиры и может отправить заявку на расчёт.',
    cta: 'Хочу лендинг для услуги с расчётом',
    done: [
      'Продуман первый экран с оффером про фиксированную цену и сроки',
      'Добавлены блоки о рисках стройки и прозрачном процессе',
      'Собрана структура с проектами домов, доверием, отзывами, FAQ и формой расчёта',
      'Форма заявки передаёт обращение через Telegram',
    ],
    features: ['Квиз/расчёт стоимости', 'Блок проектов домов', 'Договор и поэтапная оплата', 'Форма с согласием'],
    blocks: ['Первый экран', 'Проекты домов', 'Этапы строительства', 'Гарантии', 'FAQ', 'Форма расчёта'],
    functionality: ['Квиз/расчёт стоимости', 'Форма заявки', 'Telegram-заявка', 'Адаптив'],
  },
  {
    id: 'mos-reg-guide',
    title: 'МосРегГид — регистрация в Москве и Московской области',
    shortTitle: 'МосРегГид',
    url: 'https://mos-reg-guide.vercel.app/',
    image: 'cases-img/mos-reg-guide.png',
    niche: 'Документы / консультационная услуга',
    cardText: 'Сделать понятную посадочную страницу для услуги, где клиенту важно быстро разобраться в типах регистрации, документах, стоимости и способе связи.',
    result: 'Лендинг снижает юридическую путаницу: объясняет услугу простым языком, помогает выбрать сценарий и переводит пользователя к консультации.',
    cta: 'Хочу лендинг с квизом',
    done: [
      'Собрана структура с первым экраном, блоком “для кого”, видами регистрации и ответами на ключевые вопросы',
      'Добавлен квиз-подбор варианта под ситуацию клиента',
      'Сделаны блоки стоимости, процесса, документов, отзывов, FAQ и формы заявки',
      'Форма учитывает параметры квиза и отправляет их в заявку',
    ],
    features: ['Квиз-подбор', 'Бонус-чеклист', 'Форма консультации', 'Telegram/WhatsApp'],
    blocks: ['Первый экран', 'Для кого услуга', 'Виды регистрации', 'Стоимость', 'Документы', 'FAQ'],
    functionality: ['Квиз-подбор', 'Форма консультации', 'Передача параметров квиза', 'Адаптив'],
  },
  {
    id: 'farm-milk',
    title: 'Фермерское молоко — продуктовый лендинг с заявкой в Telegram',
    shortTitle: 'Фермерское молоко',
    url: 'https://farm-milk-self.vercel.app/',
    image: 'cases-img/farm-milk-self.png',
    niche: 'Фермерский продукт / прямые заказы',
    cardText: 'Создать спокойный лендинг для продукта, где важно передать натуральность, понятное происхождение, доверие к процессу и перевести заказ в Telegram без лишних форм.',
    result: 'Получилась посадочная страница для продукта, которая не давит продажей, а через спокойные аргументы переводит пользователя к заказу в Telegram.',
    cta: 'Хочу продуктовый лендинг',
    done: [
      'Сделан первый экран с ясным позиционированием продукта',
      'Показан путь от хозяйства до доставки',
      'Добавлены отзывы, блок качества, FAQ и финальный CTA',
      'Все обращения направляются напрямую в Telegram',
    ],
    features: ['Статический лендинг', 'Telegram как канал заказа', 'Фокус на доверии', 'Лёгкая структура'],
    blocks: ['Первый экран', 'Преимущества продукта', 'Происхождение', 'Качество', 'Отзывы', 'FAQ'],
    functionality: ['Кнопки связи', 'Telegram-заказ', 'Лёгкая статическая страница', 'Адаптив'],
  },
  {
    id: 'ceiling-premium',
    title: 'Потолок.Премиум — натяжные потолки в Астрахани',
    shortTitle: 'Потолок.Премиум',
    url: 'https://ceiling-premium.vercel.app/',
    image: 'cases-img/ceiling-premium.png',
    niche: 'Ремонт / локальная услуга / калькулятор стоимости',
    cardText: 'Собрать лендинг для услуги с быстрым монтажом, понятной ценой за м², калькулятором, примерами работ и заявкой на бесплатный замер.',
    result: 'Лендинг показывает услугу визуально и даёт пользователю быстрый способ оценить бюджет до консультации.',
    cta: 'Хочу лендинг с калькулятором',
    done: [
      'Сформулирован первый экран с ценой, сроком и гарантиями',
      'Добавлены виды потолков, калькулятор стоимости, примеры решений и этапы установки',
      'Собран блок отзывов и финальная форма заявки на замер',
      'Подчёркнуты договор, фиксация сметы и гарантия',
    ],
    features: ['Калькулятор стоимости', 'Карточки фактур', 'Галерея примеров', 'Форма с согласием'],
    blocks: ['Первый экран', 'Виды потолков', 'Калькулятор', 'Примеры работ', 'Этапы', 'Форма замера'],
    functionality: ['Калькулятор стоимости', 'Форма заявки', 'Галерея', 'Адаптив'],
  },
  {
    id: 'studio-18',
    title: 'Studio 18 — лендинг для beauty salon',
    shortTitle: 'Studio 18',
    url: 'https://studio-18-beauty-salon.vercel.app/',
    image: 'cases-img/studio-18-beauty-salon.png',
    niche: 'Beauty / локальная услуга / запись',
    cardText: 'Готовый лендинг для салона красоты: первый экран объясняет услуги, расположение, преимущества записи и ведёт пользователя к заявке или сообщению в мессенджер.',
    result: 'Лендинг аккуратно презентует услуги салона, показывает понятные CTA и помогает перейти к записи без лишних шагов.',
    cta: 'Хочу лендинг для записи',
    done: [
      'Собран первый экран с оффером и CTA на запись',
      'Показаны основные услуги и преимущества салона',
      'Добавлены навигация, контакты и быстрый переход к связи',
      'Страница подготовлена как посадочная для локальной услуги',
    ],
    features: ['Запись на услугу', 'Локальный бизнес', 'Контакты в первом экране', 'Визуальная подача'],
    blocks: ['Первый экран', 'Услуги', 'Преимущества', 'Контакты', 'CTA на запись'],
    functionality: ['Кнопки записи', 'Быстрые контакты', 'Навигация по странице', 'Адаптив'],
  },
  {
    id: 'bani-moscow',
    title: 'БаниГотово — готовые бани в Московской области',
    shortTitle: 'БаниГотово',
    url: 'https://bani-moscow.vercel.app/',
    image: 'cases-img/bani-moscow.png',
    niche: 'Строительство / готовые бани / локальная услуга',
    cardText: 'Готовый лендинг для услуги с доставкой и установкой бань: первый экран показывает предложение, ключевые условия, CTA на расчёт стоимости и получение каталога.',
    result: 'Лендинг помогает быстро понять формат услуги, увидеть основные преимущества и перейти к расчёту или заявке.',
    cta: 'Хочу лендинг с каталогом',
    done: [
      'Собран первый экран с предложением и двумя понятными CTA',
      'Выделены условия доставки, установки и подбора модели',
      'Подготовлена структура под каталог, комплектации, этапы и FAQ',
      'Сценарий ведёт пользователя к расчёту стоимости',
    ],
    features: ['Расчёт стоимости', 'Каталог/модели', 'Локальная услуга', 'FAQ и этапы'],
    blocks: ['Первый экран', 'Каталог моделей', 'Комплектации', 'Этапы', 'FAQ', 'Форма расчёта'],
    functionality: ['Расчёт стоимости', 'Каталог/модели', 'Форма заявки', 'Адаптив'],
  },
];

const calculatorSteps = [
  {
    key: 'task',
    type: 'radio',
    title: 'Что нужно сделать?',
    required: true,
    options: [
      ['new', 'Новый лендинг под ключ'],
      ['figma', 'Верстка по готовому дизайну'],
      ['repair', 'Доработка существующего сайта'],
      ['interactive', 'Отдельный интерактивный блок'],
    ],
  },
  {
    key: 'blocks',
    type: 'radio',
    title: 'Сколько примерно блоков будет на странице?',
    required: true,
    options: [
      ['up5', 'До 5'],
      ['6-8', '6–8'],
      ['9-12', '9–12'],
      ['12+', '12+'],
      ['unknown', 'Не знаю, нужна подсказка'],
    ],
  },
  {
    key: 'design',
    type: 'radio',
    title: 'Дизайн уже есть?',
    required: true,
    options: [
      ['figma', 'Есть макет Figma'],
      ['simple', 'Нужен простой дизайн по референсам'],
      ['custom', 'Нужен индивидуальный стиль'],
      ['only-code', 'Нужно только сверстать'],
    ],
  },
  {
    key: 'features',
    type: 'checkbox',
    title: 'Какие элементы нужны?',
    required: false,
    options: [
      ['form', 'Форма заявки'],
      ['popup', 'Pop-up'],
      ['faq', 'FAQ'],
      ['slider', 'Слайдер'],
      ['tabs', 'Табы'],
      ['calculator', 'Калькулятор'],
      ['quiz', 'Квиз'],
      ['animation', 'Анимации'],
      ['filter', 'Фильтр кейсов'],
      ['telegram', 'Интеграция с Telegram'],
    ],
  },
  {
    key: 'content',
    type: 'radio',
    title: 'Нужна ли помощь с текстами и структурой?',
    required: true,
    options: [
      ['ready', 'Тексты готовы'],
      ['structure', 'Нужна помощь со структурой'],
      ['texts', 'Нужно подсказать тексты для блоков'],
      ['materials', 'Нужно собрать контент из материалов'],
    ],
  },
  {
    key: 'deadline',
    type: 'radio',
    title: 'Когда хотите запустить сайт?',
    required: true,
    options: [
      ['standard', 'Стандартный срок'],
      ['fast', 'Нужно быстрее'],
      ['discuss', 'Срок обсуждается'],
    ],
  },
  {
    key: 'contact',
    type: 'contact',
    title: 'Куда отправить расчёт?',
    required: true,
  },
];

const calcState = {
  step: 0,
  answers: {},
  result: null,
};

const ESTIMATE_DISCOUNT = 0.8;
const TARIFF_THRESHOLDS = {
  startMax: 60000 * ESTIMATE_DISCOUNT,
  standardMax: 95000 * ESTIMATE_DISCOUNT,
};

const formatRub = (value) => new Intl.NumberFormat('ru-RU').format(Math.round(value / 1000) * 1000);

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function setLeadState(key, value) {
  if (!key || value === undefined) return;
  leadState[key] = value;
  qsa(`[name="${key}"]`).forEach((field) => {
    if (field.tagName === 'SELECT') {
      const hasOption = [...field.options].some((option) => option.value === value || option.textContent.trim() === value);
      if (!hasOption) return;
    }
    field.value = value;
  });
  renderLeadContext();
}

function scrollToLead() {
  qs('#lead')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderLeadContext() {
  const context = qs('[data-lead-context]');
  if (!context) return;
  const sourceLabel = formatLeadSource(leadState.source_cta);
  const entries = [
    ['Выбран тариф', leadState.selected_tariff],
    ['Похожий пример', leadState.selected_case],
    ['Предварительный расчёт', leadState.calculator_result],
    ['Интересует', leadState.service_type],
    ['Переход из блока', sourceLabel],
  ].filter((entry) => entry[1]);

  const text = entries.length
    ? entries.map(([label, value]) => `${label}: ${value}`).join(' · ')
    : 'Если уже смотрели тариф, кейс или расчёт, я увижу выбранный вариант в заявке.';

  const title = entries.length ? 'Заявка по выбранному формату' : 'Можно оставить заявку сразу';
  context.innerHTML = `<strong>${title}</strong><span>${escapeHtml(text)}</span>`;
}

function formatLeadSource(value) {
  if (!value || value.startsWith('tariff_') || value.startsWith('service_') || value.startsWith('case_')) return '';
  const labels = {
    hero_mini_audit: 'мини-разбор',
    hero_cases: 'примеры работ',
    hero_calculator: 'калькулятор стоимости',
    header_mini_audit: 'кнопка в шапке',
    nav_telegram: 'Telegram',
    mini_audit: 'мини-аудит',
    mini_audit_cta: 'мини-аудит',
    audit_telegram: 'Telegram',
    final_mini_audit: 'финальный блок',
    final_calculator: 'калькулятор стоимости',
    final_telegram: 'Telegram',
    sticky_mobile: 'мобильная кнопка',
    about_mini_audit: 'блок обо мне',
    calculator_submit: 'калькулятор стоимости',
  };
  return labels[value] || value.replaceAll('_', ' ');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function telegramFallbackHtml() {
  if (isTelegramConfigured) {
    return `Напишите напрямую в Telegram: <a href="${TELEGRAM_DIRECT_URL}" target="_blank" rel="noopener">@${escapeHtml(TELEGRAM_USERNAME.replace(/^@/, ''))}</a>`;
  }
  return 'Прямая ссылка на Telegram пока не настроена. Оставьте заявку через форму на сайте.';
}

function initTelegramLinks() {
  qsa('a[href^="https://t.me/"]').forEach((link) => {
    if (isTelegramConfigured) {
      link.href = TELEGRAM_DIRECT_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      return;
    }
    link.href = '#lead';
    link.removeAttribute('target');
    link.removeAttribute('rel');
    link.title = 'Оставьте заявку через форму на сайте.';
  });
}

function initHeader() {
  const header = qs('[data-header]');
  const toggle = qs('[data-menu-toggle]');
  const menu = qs('[data-mobile-menu]');
  const links = qsa('a[href^="#"]');
  const stickyCta = qs('.sticky-mobile-cta');
  const stickyContexts = [
    ['#cases', { href: '#lead', text: 'Хочу похожий лендинг', cta: 'sticky_cases' }],
    ['#pricing', { href: '#lead', text: 'Обсудить тариф', cta: 'sticky_pricing' }],
    ['#calculator', { href: '#calculator', text: 'Получить расчёт', cta: 'sticky_calculator' }],
    ['#start-guide', { href: '#mini-audit', text: 'Подобрать формат', cta: 'sticky_start_guide' }],
  ];

  const getStickyContext = () => {
    const current = stickyContexts.find(([selector]) => {
      const section = qs(selector);
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.62 && rect.bottom > window.innerHeight * 0.24;
    });
    return current?.[1] || { href: '#mini-audit', text: 'Получить мини-разбор', cta: 'sticky_mobile' };
  };

  const syncHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 80);
    const hero = qs('#hero');
    if (stickyCta && hero) {
      const context = getStickyContext();
      stickyCta.href = context.href;
      stickyCta.textContent = context.text;
      stickyCta.dataset.cta = context.cta;

      const avoidSelectors = ['#mini-audit', '#final', '#lead', '#contacts'];
      const isInAvoidArea = avoidSelectors.some((selector) => {
        const section = qs(selector);
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight - 72 && rect.bottom > 120;
      });
      const shouldShow = window.scrollY > hero.offsetHeight - 160
        && !isInAvoidArea
        && !document.body.classList.contains('menu-open')
        && !document.body.classList.contains('modal-open');
      stickyCta.classList.toggle('is-visible', shouldShow);
    }
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    header.classList.toggle('menu-open', open);
    syncHeader();
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const cta = link.dataset.cta;
      if (cta) setLeadState('source_cta', cta);
      if (!menu?.hidden) {
        toggle?.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        document.body.classList.remove('menu-open');
        header?.classList.remove('menu-open');
        syncHeader();
      }
    });
  });

  const navLinks = qsa('.nav a');
  const sections = qsa('[data-section]').filter((section) => section.id);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
  sections.forEach((section) => observer.observe(section));
}

function renderCases() {
  const grid = qs('[data-cases-grid]');
  if (!grid) return;

  grid.innerHTML = cases.map((item, index) => {
    const tags = (item.functionality || item.features).slice(0, 3);
    return `
    <article class="case-card" aria-labelledby="case-title-${item.id}">
      <a class="case-card__image" href="${item.url}" target="_blank" rel="noopener" aria-label="Открыть живой сайт кейса ${escapeHtml(item.shortTitle)}">
        <img src="${item.image}" alt="Скриншот лендинга ${escapeHtml(item.title)}" width="1898" height="1079" loading="lazy">
      </a>
      <div class="case-card__body">
        <div class="case-card__topline">
          <span class="case-card__number">${String(index + 1).padStart(2, '0')}</span>
          <span class="label">${escapeHtml(item.niche)}</span>
        </div>
        <div class="case-card__tags" aria-label="Ключевые элементы кейса">
          ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
        </div>
        <h3 id="case-title-${item.id}">${escapeHtml(item.title)}</h3>
        <p><strong>Задача:</strong> ${escapeHtml(item.cardText)}</p>
        <ul class="case-card__features" aria-label="Функциональность кейса">
          ${(item.functionality || item.features).slice(0, 4).map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}
        </ul>
        <div class="case-card__actions">
          <a class="btn btn--secondary" href="${item.url}" target="_blank" rel="noopener">Смотреть сайт</a>
          <button class="btn btn--secondary" type="button" data-open-case="${item.id}">Подробнее</button>
          <button class="btn btn--primary" type="button" data-case-lead="${item.id}">${escapeHtml(item.cta)}</button>
        </div>
      </div>
    </article>
  `;
  }).join('');
}

function initCaseModal() {
  const modal = qs('[data-case-modal]');
  const panel = qs('.modal__panel', modal);
  const content = qs('[data-modal-content]', modal);
  let lastFocused = null;

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    window.dispatchEvent(new Event('scroll'));
    lastFocused?.focus();
  };

  const openModal = (caseId) => {
    const item = cases.find((entry) => entry.id === caseId);
    if (!item) return;
    lastFocused = document.activeElement;
    content.innerHTML = `
      <div class="modal__case">
        <div class="modal__case-preview">
          <img src="${item.image}" alt="Превью кейса ${escapeHtml(item.title)}" width="1898" height="1079">
        </div>
        <div class="modal__case-details">
          <p class="section-kicker">${escapeHtml(item.niche)}</p>
          <h2 id="case-modal-title">Как был собран этот лендинг</h2>
          <h3>${escapeHtml(item.title)}</h3>
          <p><strong>Задача проекта:</strong> ${escapeHtml(item.cardText)}</p>
          <h3>Что было сделано</h3>
          <ul class="check-list">${item.done.map((text) => `<li>${escapeHtml(text)}</li>`).join('')}</ul>
          <h3>Блоки на лендинге</h3>
          <p>${escapeHtml((item.blocks || []).join(' · '))}</p>
          <h3>Функциональность</h3>
          <p>${escapeHtml((item.functionality || item.features).join(' · '))}</p>
          <h3>Ключевые особенности</h3>
          <p>${escapeHtml(item.features.join(' · '))}</p>
          <h3>Результат</h3>
          <p>${escapeHtml(item.result)}</p>
          <p>Даже без выдуманных метрик можно честно показать качественный результат: лендинг готов к запуску рекламы, понятно объясняет предложение, показывает преимущества и ведёт пользователя к заявке.</p>
          <div class="modal__actions">
            <a class="btn btn--secondary" href="${item.url}" target="_blank" rel="noopener">Смотреть сайт</a>
            <button class="btn btn--primary" type="button" data-case-lead="${item.id}">Хочу похожий</button>
          </div>
        </div>
      </div>
    `;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    window.dispatchEvent(new Event('scroll'));
    panel.focus();
  };

  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-open-case]');
    const leadButton = event.target.closest('[data-case-lead]');
    const closeButton = event.target.closest('[data-modal-close]');

    if (openButton) openModal(openButton.dataset.openCase);

    if (leadButton) {
      const item = cases.find((entry) => entry.id === leadButton.dataset.caseLead);
      if (item) {
        setLeadState('selected_case', item.title);
        setLeadState('source_cta', `case_${item.id}`);
        closeModal();
        scrollToLead();
      }
    }

    if (closeButton) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key !== 'Tab') return;

    const focusable = qsa('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', modal)
      .filter((node) => !node.hasAttribute('disabled') && node.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function initPrefillButtons() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-prefill]');
    if (!button) return;
    const key = button.dataset.prefill;
    const value = button.dataset.value;
    setLeadState(key, value);
    if (key === 'selected_tariff') setLeadState('source_cta', `tariff_${value}`);
    if (key === 'service_type') setLeadState('source_cta', `service_${value}`);
    scrollToLead();
  });
}

function initRevealAnimations() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealGroups = qsa('[data-section], .footer');
  const itemSelector = [
    '.section-head',
    '.hero__content',
    '.mini-audit > *',
    '.split > *',
    '.about > *',
    '.lead-layout > *',
    '.faq-layout > *',
    '.final-cta__inner > *',
    '.info-card',
    '.service-card',
    '.case-card',
    '.price-card',
    '.proof-card',
    '.start-card',
    '.process-guarantee article',
    '.included-grid > *',
    '.channel-list span',
    '.timeline li',
    '.calc-note',
    '.calculator',
    '.form',
    '.lead-quick',
    '.lead-helper',
    '.faq-item',
    '.business-result',
    '.honest-note',
  ].join(',');

  const revealItems = [];
  revealGroups.forEach((group) => {
    const items = qsa(itemSelector, group)
      .filter((item) => item.offsetParent !== null && !item.closest('.modal'));
    const targets = items.length ? items : [group];

    targets.forEach((item, index) => {
      if (item.dataset.reveal) return;
      item.dataset.reveal = '';
      item.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 70}ms`);
      revealItems.push(item);
    });
  });

  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.94) item.classList.add('is-revealed');
  });

  document.documentElement.classList.add('reveal-enabled');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12,
  });

  revealItems
    .filter((item) => !item.classList.contains('is-revealed'))
    .forEach((item) => observer.observe(item));
}

function getLabel(step, value) {
  const option = step.options?.find(([key]) => key === value);
  return option ? option[1] : value;
}

function renderCalculator() {
  const form = qs('[data-calculator]');
  if (!form) return;
  const step = calculatorSteps[calcState.step];
  const stepLabel = qs('[data-step-label]', form);
  const progress = qs('[data-progress-bar]', form);
  const container = qs('[data-step-container]', form);
  const back = qs('[data-calc-back]', form);
  const next = qs('[data-calc-next]', form);
  const error = qs('[data-calc-error]', form);

  error.textContent = '';
  stepLabel.textContent = `Шаг ${calcState.step + 1} из ${calculatorSteps.length}`;
  progress.style.width = `${((calcState.step + 1) / calculatorSteps.length) * 100}%`;
  back.disabled = calcState.step === 0;
  next.textContent = calcState.step === calculatorSteps.length - 1 ? 'Показать расчёт' : 'Далее';

  if (calcState.result && calcState.step === calculatorSteps.length - 1) {
    renderCalcResult(container, next);
  } else if (step.type === 'contact') {
    container.innerHTML = `
      <h3>${step.title}</h3>
      <div class="contact-grid">
        <label>Имя *<input name="calc_name" autocomplete="name" value="${escapeHtml(calcState.answers.calc_name || '')}" required></label>
        <label>Telegram / телефон / email *<input name="calc_contact" autocomplete="email" value="${escapeHtml(calcState.answers.calc_contact || '')}" required></label>
        <label>Комментарий<textarea name="calc_comment" rows="3" placeholder="Коротко опишите нишу, задачу или ссылку на текущий сайт">${escapeHtml(calcState.answers.calc_comment || '')}</textarea></label>
        <label class="checkbox contact-grid__wide"><input type="checkbox" name="calc_consent" ${calcState.answers.calc_consent ? 'checked' : ''} required> <span>Я соглашаюсь на обработку персональных данных и ознакомлен(а) с <a href="privacy.html" target="_blank" rel="noopener">Политикой конфиденциальности</a>.</span></label>
      </div>
    `;
  } else {
    const current = calcState.answers[step.key] || (step.type === 'checkbox' ? [] : '');
    container.innerHTML = `
      <h3>${step.title}</h3>
      <div class="option-grid">
        ${step.options.map(([value, label]) => `
          <label class="option-card">
            <input type="${step.type}" name="${step.key}" value="${value}" ${step.type === 'checkbox' ? current.includes(value) ? 'checked' : '' : current === value ? 'checked' : ''}>
            <span>${label}</span>
          </label>
        `).join('')}
      </div>
    `;
  }
  renderCalcSummary();
}

function buildCalcDrivers() {
  const importantKeys = ['task', 'blocks', 'features', 'content', 'deadline'];
  return calculatorSteps
    .filter((step) => importantKeys.includes(step.key))
    .map((step) => {
      const value = calcState.answers[step.key];
      if (!value || (Array.isArray(value) && !value.length)) return '';
      const label = Array.isArray(value)
        ? value.map((entry) => getLabel(step, entry)).join(', ')
        : getLabel(step, value);
      return `<li><strong>${escapeHtml(step.title.replace('?', ''))}:</strong> ${escapeHtml(label)}</li>`;
    })
    .filter(Boolean);
}

function renderCalcResult(container, next) {
  const result = calcState.result;
  const drivers = buildCalcDrivers();
  next.textContent = 'Отправить расчёт в Telegram';
  container.innerHTML = `
    <div class="calc-result">
      <h3>Ваш предварительный расчёт готов</h3>
      <strong>${escapeHtml(result.range)}</strong>
      <p>По выбранным параметрам вам подойдёт тариф “${escapeHtml(result.tariff)}”.</p>
      <p>${escapeHtml(result.includes)}</p>
      ${drivers.length ? `<ul class="calc-result__details">${drivers.join('')}</ul>` : ''}
      <p>Это предварительная оценка. После короткого обсуждения я уточню объём, сроки и назову точную стоимость.</p>
      <button class="btn btn--secondary" type="button" data-prefill="calculator_result" data-value="${escapeHtml(result.range)}">Отправить расчёт и получить точную оценку</button>
    </div>
  `;
}

function renderCalcSummary() {
  const summary = qs('[data-calc-summary]');
  if (!summary) return;
  const lines = calculatorSteps
    .filter((step) => step.key !== 'contact')
    .map((step) => {
      const value = calcState.answers[step.key];
      if (!value || (Array.isArray(value) && !value.length)) return '';
      const label = Array.isArray(value)
        ? value.map((entry) => getLabel(step, entry)).join(', ')
        : getLabel(step, value);
      return `<span><strong>${escapeHtml(step.title.replace('?', ''))}:</strong> ${escapeHtml(label)}</span>`;
    })
    .filter(Boolean);
  summary.innerHTML = lines.length ? lines.join('') : '<span>Выбранные параметры появятся здесь.</span>';
}

function saveCurrentStep() {
  const form = qs('[data-calculator]');
  const step = calculatorSteps[calcState.step];
  if (step.type === 'contact') {
    calcState.answers.calc_name = qs('[name="calc_name"]', form)?.value.trim() || '';
    calcState.answers.calc_contact = qs('[name="calc_contact"]', form)?.value.trim() || '';
    calcState.answers.calc_comment = qs('[name="calc_comment"]', form)?.value.trim() || '';
    calcState.answers.calc_consent = Boolean(qs('[name="calc_consent"]', form)?.checked);
    return;
  }
  const checked = qsa(`[name="${step.key}"]:checked`, form).map((input) => input.value);
  calcState.answers[step.key] = step.type === 'checkbox' ? checked : checked[0] || '';
}

function validateCurrentStep() {
  saveCurrentStep();
  const step = calculatorSteps[calcState.step];
  const error = qs('[data-calc-error]');
  if (step.type === 'contact') {
    if (!calcState.answers.calc_name || !calcState.answers.calc_contact) {
      error.textContent = 'Укажите имя и контакт, чтобы получить расчёт.';
      return false;
    }
    if (!calcState.answers.calc_consent) {
      error.textContent = 'Подтвердите согласие с политикой, чтобы отправить расчёт.';
      return false;
    }
  } else if (step.required && !calcState.answers[step.key]) {
    error.textContent = 'Выберите один из вариантов, чтобы перейти дальше.';
    return false;
  }
  error.textContent = '';
  return true;
}

function calculateEstimate() {
  const a = calcState.answers;
  const base = { new: 52000, figma: 32000, repair: 22000, interactive: 18000 }[a.task] || 42000;
  const blockAdd = { up5: 0, '6-8': 11000, '9-12': 23000, '12+': 38000, unknown: 15000 }[a.blocks] || 0;
  const designAdd = { figma: 0, simple: 15000, custom: 32000, 'only-code': 0 }[a.design] || 0;
  const featureAdd = (a.features || []).reduce((sum, feature) => {
    const values = { form: 4500, popup: 3500, faq: 2500, slider: 5000, tabs: 3500, calculator: 12000, quiz: 13500, animation: 6500, filter: 6000, telegram: 7000 };
    return sum + (values[feature] || 0);
  }, 0);
  const contentAdd = { ready: 0, structure: 9000, texts: 12000, materials: 16000 }[a.content] || 0;
  const urgency = a.deadline === 'fast' ? 1.2 : 1;
  const low = (base + blockAdd + designAdd + featureAdd + contentAdd) * urgency * ESTIMATE_DISCOUNT;
  const high = low * 1.28;
  const tariff = high < TARIFF_THRESHOLDS.startMax ? 'Старт' : high < TARIFF_THRESHOLDS.standardMax ? 'Бизнес' : 'Продажи+';
  const includes = tariff === 'Старт'
    ? 'В проект войдут базовые блоки, адаптивная верстка, форма заявки и подготовка к запуску.'
    : tariff === 'Бизнес'
      ? 'В проект войдут 7–10 блоков, адаптивная верстка, форма заявки, базовый интерактив, подключение отправки в Telegram и подготовка к запуску.'
      : 'В проект войдут расширенная структура, интерактив, калькулятор/квиз при необходимости, формы и подготовка к запуску.';

  return {
    range: `Ориентировочная стоимость: ${formatRub(low)}–${formatRub(high)} ₽`,
    tariff,
    includes,
  };
}

function initCalculator() {
  const form = qs('[data-calculator]');
  if (!form) return;

  form.addEventListener('change', () => {
    saveCurrentStep();
    renderCalcSummary();
  });

  qs('[data-calc-back]', form).addEventListener('click', () => {
    if (calcState.step === 0) return;
    calcState.result = null;
    calcState.step -= 1;
    renderCalculator();
  });

  qs('[data-calc-next]', form).addEventListener('click', async () => {
    if (calcState.result && calcState.step === calculatorSteps.length - 1) {
      await submitCalculatorResult();
      return;
    }
    if (!validateCurrentStep()) return;
    if (calcState.step < calculatorSteps.length - 1) {
      calcState.step += 1;
      renderCalculator();
      return;
    }
    calcState.result = calculateEstimate();
    setLeadState('calculator_result', calcState.result.range);
    setLeadState('calculator_answers', JSON.stringify(calcState.answers));
    setLeadState('selected_tariff', calcState.result.tariff);
    renderCalculator();
  });

  renderCalculator();
}

async function submitCalculatorResult() {
  const result = calcState.result || calculateEstimate();
  const payload = buildPayload({
    form_type: 'Калькулятор',
    name: calcState.answers.calc_name,
    contact: calcState.answers.calc_contact,
    message: calcState.answers.calc_comment,
    calculator_result: result.range,
    calculator_answers: calcState.answers,
    selected_tariff: result.tariff,
    source_cta: 'calculator_submit',
    consent: Boolean(calcState.answers.calc_consent),
  });
  const status = qs('[data-calc-error]');
  status.textContent = 'Отправляю расчёт...';
  try {
    const result = await sendLead(payload);
    status.classList.remove('is-error');
    status.textContent = result.demo
      ? 'Демо-режим: расчёт сформирован. На Vercel заявки будут уходить через /api/send-lead в Telegram-бот.'
      : 'Спасибо! Я получил параметры проекта и свяжусь с вами, чтобы уточнить детали.';
  } catch {
    status.classList.add('is-error');
    status.innerHTML = `Не удалось отправить заявку. ${telegramFallbackHtml()}`;
  }
}

function initFaq() {
  qsa('.faq-item button').forEach((button) => {
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      qsa('.faq-item button').forEach((other) => other.setAttribute('aria-expanded', 'false'));
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

function buildPayload(extra = {}) {
  const url = new URL(window.location.href);
  return {
    ...leadState,
    ...extra,
    current_url: window.location.href,
    referrer: document.referrer,
    utm_source: url.searchParams.get('utm_source') || '',
    utm_medium: url.searchParams.get('utm_medium') || '',
    utm_campaign: url.searchParams.get('utm_campaign') || '',
    timestamp: new Date().toISOString(),
  };
}

async function sendLead(payload) {
  if (!LEAD_ENDPOINT || window.location.protocol === 'file:') {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { ok: true, demo: true, payload };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if ((response.status === 404 || response.status === 501) && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      return { ok: true, demo: true, payload };
    }
    if (!response.ok) throw new Error('Lead endpoint failed');
    return response.json().catch(() => ({ ok: true }));
  } finally {
    clearTimeout(timeout);
  }
}

function initForms() {
  qsa('[data-lead-form]').forEach((form) => {
    const startedAt = Date.now();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = qs('.form-status', form);
      status.className = 'form-status';
      qsa('[aria-invalid="true"]', form).forEach((field) => field.removeAttribute('aria-invalid'));

      const data = Object.fromEntries(new FormData(form).entries());
      if (data.website) return;

      const nameField = qs('[name="name"]', form);
      const contactField = qs('[name="contact"]', form);
      const consentField = qs('[name="consent"]', form);
      const errors = [];
      if (!nameField.value.trim()) {
        errors.push('укажите имя');
        nameField.setAttribute('aria-invalid', 'true');
      }
      if (!contactField.value.trim()) {
        errors.push('укажите контакт');
        contactField.setAttribute('aria-invalid', 'true');
      }
      if (!consentField.checked) {
        errors.push('подтвердите согласие с политикой');
        consentField.setAttribute('aria-invalid', 'true');
      }
      if (!errors.length && Date.now() - startedAt < 1200) {
        errors.push('попробуйте отправить форму ещё раз через секунду');
      }

      if (errors.length) {
        status.textContent = `Проверьте форму: ${errors.join(', ')}.`;
        status.classList.add('is-error');
        return;
      }

      const submit = qs('[type="submit"]', form);
      submit.disabled = true;
      submit.textContent = 'Отправляю...';
      status.textContent = '';

      const payload = buildPayload({
        ...data,
        form_type: form.dataset.formType || 'Заявка',
        consent: true,
      });

      try {
        const result = await sendLead(payload);
        if (result.demo) {
          status.textContent = 'Демо-режим: заявка сформирована. На Vercel заявки будут уходить через /api/send-lead в Telegram-бот.';
        } else {
          status.textContent = form.dataset.formType === 'Мини-аудит'
            ? 'Спасибо! Я получил описание идеи и свяжусь с вами, чтобы подсказать оптимальный формат лендинга.'
            : 'Заявка отправлена. Спасибо! Я получил вашу заявку в Telegram-бот и свяжусь с вами, чтобы уточнить детали проекта.';
        }
        status.classList.add('is-success');
        setTimeout(() => {
          submit.disabled = false;
          submit.textContent = form.dataset.formType === 'Мини-аудит' ? 'Получить мини-аудит' : 'Отправить заявку';
        }, 10000);
      } catch {
        status.innerHTML = `Похоже, возникла техническая ошибка. Проверьте контакт и попробуйте ещё раз. ${telegramFallbackHtml()}`;
        status.classList.add('is-error');
        submit.disabled = false;
        submit.textContent = form.dataset.formType === 'Мини-аудит' ? 'Получить мини-аудит' : 'Отправить заявку';
      }
    });
  });
}

function hydrateHiddenFields() {
  const url = new URL(window.location.href);
  qsa('[name="current_url"]').forEach((field) => { field.value = window.location.href; });
  qsa('[name="referrer"]').forEach((field) => { field.value = document.referrer; });
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach((key) => {
    qsa(`[name="${key}"]`).forEach((field) => { field.value = url.searchParams.get(key) || ''; });
  });
  qsa('[name="timestamp"]').forEach((field) => { field.value = new Date().toISOString(); });
}

document.addEventListener('DOMContentLoaded', () => {
  initTelegramLinks();
  initHeader();
  renderCases();
  initCaseModal();
  initPrefillButtons();
  initCalculator();
  initFaq();
  initForms();
  hydrateHiddenFields();
  renderLeadContext();
  initRevealAnimations();
});
