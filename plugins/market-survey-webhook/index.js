const axios = require('axios');

class MarketSurveyWebhookPlugin {
  constructor() {
    this.metadata = {
      name: 'market-survey-webhook',
      version: '1.0.0',
      description: 'Sends webhook notifications when market survey responses are submitted',
      author: 'Voxer Studio',
      type: 'webhook',
      permissions: ['http_request']
    };
  }

  async initialize(context) {
    console.log(`Initializing webhook plugin for survey: ${context.surveyId}`);

    // Validar se temos as configurações necessárias
    if (!context.metadata?.templateSettings?.webhookUrl) {
      throw new Error('Webhook URL not configured in survey template settings');
    }
  }

  async execute(context) {
    const { surveyId, responseId, data, metadata } = context;
    const webhookUrl = metadata?.templateSettings?.webhookUrl;

    if (!webhookUrl) {
      throw new Error('Webhook URL not found in template settings');
    }

    const payload = {
      event: 'survey_response_submitted',
      timestamp: new Date().toISOString(),
      survey: {
        id: surveyId,
        type: metadata?.surveyType || 'market_research'
      },
      response: {
        id: responseId,
        answers: data,
        metadata: metadata?.responseMetadata
      },
      source: 'voxer-market-survey'
    };

    try {
      console.log(`Sending webhook to: ${webhookUrl}`);

      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'voxer-Webhook/1.0'
        },
        timeout: 10000 // 10 segundos
      });

      console.log(`Webhook sent successfully. Status: ${response.status}`);

      return {
        success: true,
        webhookUrl,
        statusCode: response.status,
        responseData: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Webhook failed:`, error.message);

      return {
        success: false,
        webhookUrl,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async cleanup() {
    console.log('Webhook plugin cleanup completed');
  }
}

module.exports = MarketSurveyWebhookPlugin;

