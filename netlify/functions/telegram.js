exports.handler = async () => {
  try {
    const response = await fetch("https://t.me/s/HamRadioQSO", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    // Separar por mensajes reales
    const bloques = html.split('tgme_widget_message_wrap');

    const mensajes = [];

    bloques.forEach((bloque, index) => {

      const idMatch = bloque.match(/data-post="HamRadioQSO\/(\d+)"/);
      const textoMatch = bloque.match(/tgme_widget_message_text js-message_text[^>]*>([\s\S]*?)<\/div>/);
      const linkMatch = bloque.match(/href="https:\/\/t\.me\/HamRadioQSO\/\d+"/);

      if (idMatch && textoMatch) {

        const texto = textoMatch[1]
          .replace(/<br\s*\/?>/g, "\n")
          .replace(/<[^>]*>/g, "")
          .trim();

        mensajes.push({
          id: idMatch[1],
          texto,
          link: linkMatch ? linkMatch[0].match(/href="([^"]+)"/)[1] : null
        });
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mensajes.reverse().slice(0, 10), null, 2)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};