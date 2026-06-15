function safeValue(value, limit = 1200) {
  if (value === undefined || value === null) return '';
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return text.trim().slice(0, limit);
}

function normalizeBoolean(value) {
  return value === true || value === 'true' || value === 'on' || value === '1';
}

function formatCalculatorAnswers(value) {
  if (!value) return '';
  if (typeof value === 'string') return safeValue(value, 1600);
  return Object.entries(value)
    .filter(([key]) => key !== 'calc_consent')
    .map(([key, answer]) => `${key}: ${Array.isArray(answer) ? answer.join(', ') : answer}`)
    .join('\n');
}

function composeMessage(payload, req) {
  const utm = [payload.utm_source, payload.utm_medium, payload.utm_campaign]
    .filter(Boolean)
    .join(' / ');
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();

  const fields = [
    ['Тип формы', payload.form_type || 'Заявка'],
    ['Имя', payload.name],
    ['Контакт', payload.contact],
    ['Услуга', payload.service_type],
    ['Бюджет', payload.budget],
    ['Срок', payload.deadline],
    ['Комментарий', payload.message],
    ['Референсы/сайт', payload.references],
    ['Выбранный кейс', payload.selected_case],
    ['Выбранный тариф', payload.selected_tariff],
    ['Расчёт', payload.calculator_result],
    ['Параметры калькулятора', formatCalculatorAnswers(payload.calculator_answers)],
    ['CTA / источник', payload.source_cta],
    ['URL страницы', payload.current_url],
    ['Referrer', payload.referrer],
    ['UTM', utm],
    ['Дата', payload.timestamp || new Date().toISOString()],
    ['IP', ip],
  ];

  const lines = ['Новая заявка с сайта-портфолио'];
  for (const [label, value] of fields) {
    const text = safeValue(value);
    if (text) lines.push(`\n${label}:\n${text}`);
  }
  return lines.join('\n').slice(0, 3900);
}

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const threadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;

  if (!token || !chatId) {
    return {
      ok: false,
      status: 501,
      data: { description: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' },
    };
  }

  const body = {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
  };

  if (threadId) body.message_thread_id = Number(threadId);

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok && data.ok !== false, status: response.status, data };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const payload = typeof req.body === 'object' && req.body ? req.body : {};

  if (payload.website) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const name = safeValue(payload.name, 160);
  const contact = safeValue(payload.contact, 220);

  if (!name || !contact) {
    return res.status(400).json({ ok: false, error: 'Name and contact are required' });
  }

  if (!normalizeBoolean(payload.consent)) {
    return res.status(400).json({ ok: false, error: 'Consent is required' });
  }

  try {
    const text = composeMessage({ ...payload, name, contact }, req);
    const telegram = await sendTelegramMessage(text);

    if (!telegram.ok) {
      return res.status(telegram.status || 502).json({
        ok: false,
        error: telegram.data?.description || 'Telegram request failed',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
}
