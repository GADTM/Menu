exports.handler = async () => {
  try {
    const response = await fetch("https://t.me/s/HamRadioQSO", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      },
      body: html
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};