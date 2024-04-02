const wppconnect = require('@wppconnect-team/wppconnect');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyDh6OW7y3hx8ZrR1WMfm5FBUqMFnhzb43k');

wppconnect
  .create({
    session: 'sessionName',
    catchQR: (_, qrCode) => {
      console.log(qrCode);
    },
    headless: 'new',
  })
  .then((client) => {
    client.onMessage(async (message) => {
      // condição adicionais para responder somente chats privados
      if (
        message.isGroupMsg ||
        message.chatId === 'status@broadcast' ||
        message.type !== 'chat'
      )
        return;

      const response = await callGemini(message.body);
      await client.sendText(message.from, response);
    });
  })
  .catch((err) => console.log('err', err));

async function callGemini(message) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const modelConfigured = await model.startChat({
      history: [
        {
          role: 'user',
          parts: `
          Você é um atendente da FADERGS 
          (Faculdade de Desenvolvimento do Rio Grande do Sul)
          e deve responder dúvidas dos alunos
          `,
        },
        {
          role: 'model',
          parts: 'entendido'
        }
      ],
    });

    const result = await modelConfigured.sendMessage(message);

    const response = await result.response;

    const text = response.text();
    console.log({ text });

    return text;
  } catch (err) {
    console.log(err);
  }
}
