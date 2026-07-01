exports.handler = async () => {

  try {

    const canales = [
      "HamRadioQSO", // 👈 Canal LU3IBM
      "clientepeanutnews" // 👈 Canal eHamLog
    ];

    let mensajes = [];

    for (const canal of canales) {

      const response = await fetch(`https://t.me/s/${canal}`, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const html = await response.text();

      const bloques = html.split('tgme_widget_message_wrap');

    for (const bloque of bloques) {

		const idMatch = bloque.match(/data-post="([^\/]+)\/(\d+)"/);
		const textMatch = bloque.match(/tgme_widget_message_text js-message_text[^>]*>([\s\S]*?)<\/div>/);
		const linkMatch = bloque.match(/href="(https:\/\/t\.me\/[^"]+)"/);

		if (!idMatch || !textMatch) continue;

		const canal = idMatch[1];
		const id = idMatch[2];

		let texto = textMatch[1]
			.replace(/<br\s*\/?>/g, "\n")
			.replace(/<[^>]*>/g, "")
			.replace(/🎙️\s*NUEVA ACTIVIDAD\s*🎙️/gi, "")
			.replace(/NUEVA ACTIVIDAD/gi, "")
			.trim();

		mensajes.push({
		canal,
		id,
		texto,
		link: linkMatch ? linkMatch[1] : null
	});
	}
    
    // ordenar (más nuevos primero)
    mensajes.reverse();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mensajes.slice(0, 20))
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};
