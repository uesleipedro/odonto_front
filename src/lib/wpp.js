const venom = require('venom-bot')
import api from '../utils/Api'
import Cookies from 'js-cookie'

const userData = Cookies.get('user')
const id_user = userData?.user?.foundUser.id_user
const id_empresa = userData?.user?.foundUser.id_empresa

let client;

venom.create({
    session: `session`,
    multidevice: true,
    headless: true, // Rode em modo headless para permitir a captura do QR code
    qrTimeout: 60, // Tempo limite para o QR code
    catchQR: (qrCode, asciiQR) => {
        console.log('QR Code: ', qrCode); // QR code como uma string
        // Aqui você pode enviar o qrCode para o frontend, talvez via WebSocket ou API
    },
})
    .then(cli => {
        client = cli;
        start(client);
    })
    .catch((err) => {
        console.log(err);
    });

function start(client) {
    client.onMessage((message) => {
        if (message.body === 'Hi' && message.isGroupMsg === false) {
            client
                .sendText(message.from, 'Hello! How can I help you?')
                .then((result) => {
                    console.log('Result: ', result); // Retorna o resultado como um objeto
                })
                .catch((error) => {
                    console.error('Error when sending: ', error); // Retorna um objeto de erro
                });
        }
    });
}

// Função para enviar mensagem para um número específico
function sendMessage(to, message) {
    return client.sendText(to, message);
}

module.exports = { sendMessage };