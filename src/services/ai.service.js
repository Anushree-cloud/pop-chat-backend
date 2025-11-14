const { prisma } = require('../config/db');
const env = require('../config/env');
const axios = require('../config/axios');
const { defaultModel } = require('../config/ai');

async function callOpenAI(prompt, modelConfig) {
  // minimal call example using OpenAI REST API
  const key = env.ai.openaiKey;
  if (!key) throw new Error('OpenAI API key not set');
  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: modelConfig.modelName,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: modelConfig.maxTokens
  }, {
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    }
  });
  return res.data;
}

async function fallbackResponse(prompt) {
  return { text: "I'm currently unable to reach the AI provider. Try again later." };
}

exports.sendMessage = async ({ userId, prompt, model }) => {
  const modelConfig = model ? { modelName: model } : defaultModel;
  try {
    let data;
    if (env.ai.provider === 'openai') {
      const res = await callOpenAI(prompt, modelConfig);
      const text = (res?.choices?.[0]?.message?.content) || JSON.stringify(res);
      data = { model: modelConfig.modelName, response: text, raw: res };
    } else {
      // placeholder for other providers
      data = { model: modelConfig.modelName, response: 'provider not implemented', raw: {} };
    }

    await prisma.aIChatLog.create({
      data: {
        userId,
        prompt,
        response: data.response,
        model: data.model,
        meta: data.raw
      }
    });

    return { reply: data.response };
  } catch (err) {
    // fail-safe
    await prisma.aIChatLog.create({
      data: {
        userId,
        prompt,
        response: err.message,
        model: modelConfig.modelName,
        meta: { error: err.message }
      }
    });

    return { reply: (await fallbackResponse(prompt)).text, error: err.message };
  }
};
