const { Configuration, OpenAIApi } = require("openai");
const { add_ai_chat } = require("./chatdb_controller");
require('dotenv').config();
var chatdb_controller = require('./chatdb_controller.js')

const configuration = new Configuration({
    organization: process.env.OPENAI_API_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.chat = async function (input) {
    chatdb_controller.add_user_chat(input);
    var data = {
        result : 0,
        message : ""
    };
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": input}],
            temperature: 1,
        });
        data.result = 0;
        data.message = completion.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            data.result = error.response.status;
            data.message = error.response.data;
        } else {
            data.result = 1;
            data.message = error.response.message;
        }
    }
    if (data.result == 0) {
        chatdb_controller.add_ai_chat(data.message)
    }
    return data;
}