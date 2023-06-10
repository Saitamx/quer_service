import { Injectable } from '@nestjs/common';
import { API_CONFIG } from '../config/api-config';
import { httpClient } from '../handlers/http-client';
import {
  handleEmbeddingResponse,
  handleVectorial,
} from '../handlers/embedding-handler';
import { getParksData } from '../handlers/parks-handler';
import { preprocessText } from '../handlers/text-preprocessor';
import { handleError } from '../utils/error-handler';
import { countTokens } from '../utils/count-tokens';

@Injectable()
export class QuerService {
  private readonly ecoqueraiContext = [
    process.env.ECOQUERAI_CONTEXT_1,
    process.env.ECOQUERAI_CONTEXT_2,
  ];

  private userInfo = { name: 'Matías' };

  private generalContext = `
   ${process.env.QUER_CONTEXT}
    Estoy aquí para ayudar a los usuarios de EcoquerAI, incluido ${
      this.userInfo.name
    }, y contribuir a su experiencia enriquecedora mientras protejo la información sensible. Actualmente, estoy utilizando el siguiente contexto específico sobre EcoquerAI: ${this.ecoqueraiContext.join(
    ', ',
  )}.`;

  async handleQuestion(question: string) {
    try {
      question = preprocessText(question);

      const parksDataEmbeddings = await getParksData();
      const questionContextEmbedding = await handleEmbeddingResponse(question);

      const { finalGeneralContext } = handleVectorial(
        questionContextEmbedding,
        parksDataEmbeddings,
        this.generalContext,
        parseInt(API_CONFIG.NUM_SIMILAR_PARKS),
      );

      if (countTokens(finalGeneralContext) > API_CONFIG.MAX_TOKENS) {
        throw new Error('Message is too long');
      }

      const conversation = [
        { role: 'system', content: finalGeneralContext },
        { role: 'user', content: question },
      ];

      const totalTokens = conversation.reduce(
        (total, message) => total + countTokens(message.content),
        0,
      );

      if (totalTokens > API_CONFIG.MAX_TOKENS) {
        throw new Error('Conversation is too long');
      }

      console.log('conversation', conversation);
      console.log('totalTokens', totalTokens);

      const response = await httpClient.post(
        API_CONFIG.CHAT_SERVICE,
        {
          model: API_CONFIG.CHAT_MODEL,
          messages: conversation,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return `QUER AI: ${response.data.choices[0].message['content']}`;
    } catch (error) {
      handleError(error);
    }
  }
}
