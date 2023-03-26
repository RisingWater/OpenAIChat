const request = require("request");
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
var chatdb_controller = require('./db/chatdb_controller.js');
const { response } = require("express");

const configuration = new Configuration({
    organization: process.env.OPENAI_API_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

const request_headers = {
    "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
    "OpenAI-Organization": process.env.OPENAI_API_ORGANIZATION,
    "Content-Type": "application/json"
};

function get_balance() {
    var balance_url = "https://api.openai.com/dashboard/billing/credit_grants"
    const options = { headers: request_headers };

    request.get(balance_url, options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log(error);
        }
    });
}

const openai = new OpenAIApi(configuration);

function genMessages(history, current_input) {
    var messages = [];
    var total_len = 0;
    for (i = history.length; i > 0; i--) {
        total_len += history[i - 1].content.length;
        if (total_len > 1000) {
            break;
        }
    }

    for (j = i; j < history.length; j++) {
        var tmp = {"role" : "", "content" : ""};
        if (history[j].role == 0) {
            tmp.role = "user";
        } else {
            tmp.role = "assistant";
        }
        tmp.content = history[j].content;
        messages.push(tmp);
    }
    current ={ "role": "user", "content": current_input };
    messages.push(current);

    return messages;
}

exports.chat = async function (chatid, input) {
    var history = chatdb_controller.list_chat(chatid);
    var messages = genMessages(history, input);
    chatdb_controller.add_user_chat(chatid, input);
    var data = {
        result: 0,
        message: ""
    };
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 1,
        });
        data.result = 0;
        data.message = completion.data.choices[0].message.content;
        var total_tokens = completion.data.usage.total_tokens;
        console.log("use total_tokens: " + total_tokens);
        get_balance();
    } catch (error) {
        console.log(error);
        if (error.response) {
            data.result = error.response.status;
            data.message = error.response.data;
        } else {
            data.result = 1;
            data.message = "other error!";
        }
    }
    if (data.result == 0) {
        chatdb_controller.add_ai_chat(chatid, data.message)
    }
    return data;
}