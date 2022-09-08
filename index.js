const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '5644782212:AAHaEuc9AXwRb7ytFIwJ912KfL6gcbbsdkM';

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру, а ты должен угадать за минимальное количество раз`)
    const randomNumber = Math.ceil(Math.random() * 5)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Попробуй отгадать!', gameOptions)    

}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Запусти меня уже!'},
        {command: '/game', description: 'Сыграть в игру'},
        {command: '/info', description: 'Информация о создателе'},
    ])
    
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start'){
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/e/emojis_edited/emojis_edited_021.webp')
            return bot.sendMessage(chatId,`Добро пожаловать в моего тестового бота ${msg.from.username|| ''}!`)
        }
        
        if (text === '/game'){
            return startGame(chatId)
        }

        if(text === '/info'){
            return bot.sendMessage(chatId, `Данный бот был создан с целью моего изучения node-telegram-api-bot и разработки собственного бота. Для обратной связи: @Wavelent`)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробую выбрать одну из существующих команд')

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data == chats[chatId]){
            return bot.sendMessage(chatId, 'Поздравляю, ты угадал! Возьми с полки пирожок', againOptions)
        } else {
            return bot.sendMessage(chatId, `Неудача, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()