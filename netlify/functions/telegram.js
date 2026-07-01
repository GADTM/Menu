exports.handler = async () => {
  try {
    const response = await fetch("https://t.me/s/HamRadioQSO", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    // Extraer bloques de mensajes
    const regex = /tgme_widget_message_text js-message_text[\s\S]*?<div class="tgme_widget_message_footer/g;

    const matches = [...html.matchAll(regex)];

    const mensajes = matches.slice(0, 10).map((m, i) => {

      const bloque = m[0];

      // texto
      const textoMatch = bloque.match(/<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/);
      const texto = textoMatch ? textoMatch[1]
        .replace(/<[^>]*>/g, "")
        .trim() : "";

      // link
      const linkMatch = bloque.match(/href="(https:\/\/t\.me\/HamRadioQSO\/\d+)"/);

      return {
        id: i,
        texto,
        link: linkMatch ? linkMatch[1] : null
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mensajes, null, 2)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};
