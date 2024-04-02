const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create({
    session: 'sessionName',
    headless: 'new',
    catchQR: (_, qrCode) => {
      console.log(qrCode);
    },
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

      await client.sendText(message.from, 'Olá FADERGS!');
    });
  });
