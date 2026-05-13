import 'dotenv/config';

type LeadPayload = {
  name?: string;
  phone?: string;
  problem?: string;
};

type SubmitLeadResult = {
  ok: boolean;
  delivered: {
    telegram: boolean;
    sheets: boolean;
  };
  error?: string;
};

const TELEGRAM_API_URL = 'https://api.telegram.org';

function getEnv(name: string): string {
  return process.env[name]?.trim() ?? '';
}

function escapeTelegramText(value: string): string {
  return value.replace(/[&<>]/g, (char) => {
    if (char === '&') return '&amp;';
    if (char === '<') return '&lt;';
    return '&gt;';
  });
}

export async function submitLead(payload: LeadPayload): Promise<SubmitLeadResult> {
  const name = payload.name?.trim() ?? '';
  const phone = payload.phone?.trim() ?? '';
  const problem = payload.problem?.trim() ?? '';

  if (!name || !phone) {
    return {
      ok: false,
      delivered: { telegram: false, sheets: false },
      error: 'Заполните имя и телефон.',
    };
  }

  const webhookUrl =
    getEnv('GOOGLE_SHEETS_WEBHOOK_URL') || getEnv('VITE_GOOGLE_SHEETS_WEBHOOK_URL');
  const tgToken = getEnv('TELEGRAM_BOT_TOKEN') || getEnv('VITE_TELEGRAM_BOT_TOKEN');
  const tgChatId = getEnv('TELEGRAM_CHAT_ID') || getEnv('VITE_TELEGRAM_CHAT_ID');

  const delivered = {
    telegram: false,
    sheets: false,
  };

  if (!webhookUrl && (!tgToken || !tgChatId)) {
    return {
      ok: false,
      delivered,
      error: 'Заявки не настроены на сервере: добавьте Telegram или Google Sheets webhook.',
    };
  }

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          problem,
          timestamp: new Date().toISOString(),
          source: 'Site Modal',
        }),
      });
      delivered.sheets = true;
    } catch (error) {
      console.error('Error sending lead to Sheets:', error);
    }
  }

  if (tgToken || tgChatId) {
    if (!tgToken || !tgChatId) {
      return {
        ok: false,
        delivered,
        error: 'Telegram настроен не полностью: нужны token и chat id.',
      };
    }

    try {
      const message = [
        '<b>Новая заявка</b>',
        '',
        `<b>Имя:</b> ${escapeTelegramText(name)}`,
        `<b>Телефон:</b> ${escapeTelegramText(phone)}`,
        `<b>Проблема:</b> ${escapeTelegramText(problem || 'Не указана')}`,
        '',
        '<b>Источник:</b> Сайт (попап)',
      ].join('\n');

      const telegramResponse = await fetch(
        `${TELEGRAM_API_URL}/bot${tgToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: message,
            parse_mode: 'HTML',
          }),
        },
      );

      const telegramResult = await telegramResponse.json().catch(() => null);
      if (!telegramResponse.ok || !telegramResult?.ok) {
        const description =
          telegramResult?.description || 'Telegram отклонил отправку сообщения.';
        return {
          ok: false,
          delivered,
          error: `Ошибка Telegram: ${description}`,
        };
      }

      delivered.telegram = true;
    } catch (error) {
      console.error('Error sending lead to Telegram:', error);
      return {
        ok: false,
        delivered,
        error: 'Не удалось отправить заявку в Telegram.',
      };
    }
  }

  if (!delivered.telegram && !delivered.sheets) {
    return {
      ok: false,
      delivered,
      error: 'Не удалось доставить заявку ни в один канал.',
    };
  }

  return {
    ok: true,
    delivered,
  };
}
