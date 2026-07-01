exports.handler = async () => {
  try {
    const response = await fetch("https://t.me/s/HamRadioQSO", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    const bloques = html.split('tgme_widget_message_wrap');

    const mensajes = [];

    for (const bloque of bloques) {

      const idMatch = bloque.match(/data-post="HamRadioQSO\/(\d+)"/);
      const textMatch = bloque.match(/tgme_widget_message_text js-message_text[^>]*>([\s\S]*?)<\/div>/);
      const linkMatch = bloque.match(/href="(https:\/\/t\.me\/HamRadioQSO\/\d+)"/);

      if (!idMatch || !textMatch) continue;

     let texto = textMatch[1]
		.replace(/<br\s*\/?>/g, "\n")
		.replace(/<[^>]*>/g, "")
		.replace(/🎙️\s*NUEVA ACTIVIDAD\s*🎙️/gi, "") // 👈 ELIMINA DUPLICADO
		.replace(/NUEVA ACTIVIDAD/gi, "") // fallback
		.trim();

      mensajes.push({
        id: idMatch[1],
        texto,
        link: linkMatch ? linkMatch[1] : null
      });
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mensajes.reverse().slice(0, 15))
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};
