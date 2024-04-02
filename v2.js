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
    console.log({ model });
    const result = await model.generateContent(message);
    console.log({ result });

    const response = await result.response;
    console.log({ response });

    const text = response.text();
    console.log({ text });

    return text;
  } catch (err) {
    console.log(err);
  }
}
