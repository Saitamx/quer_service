import { httpClient } from './http-client';
import { API_CONFIG } from '../config/api-config';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as similarity from 'compute-cosine-similarity';

export async function handleEmbeddingResponse(input: string) {
  try {
    const embeddingResponse = await httpClient.post(
      API_CONFIG.EMBEDDINGS_SERVICE,
      {
        input,
        model: API_CONFIG.EMBEDDING_MODEL,
      },
      {
        headers: {
          Authorization: `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return embeddingResponse.data.data[0].embedding;
  } catch (error) {
    throw new HttpException(
      'Failed to get embedding',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export function handleVectorial(
  questionContextEmbedding: any,
  parksDataEmbeddings: any,
  generalContext: string,
  numSimilarParks: number,
) {
  const parksSimilarityScores = parksDataEmbeddings.map(
    (parkEmbedding: any) => {
      return {
        park: parkEmbedding.park,
        similarity: similarity(
          questionContextEmbedding,
          parkEmbedding.embedding,
        ),
      };
    },
  );

  parksSimilarityScores.sort((a, b) => b.similarity - a.similarity);

  if (parksSimilarityScores[0].similarity === -1) {
    throw new HttpException('No matching park found', HttpStatus.NOT_FOUND);
  }

  const topSimilarParks = parksSimilarityScores.slice(0, numSimilarParks);

  const finalParksData = topSimilarParks.map((similarPark) =>
    JSON.stringify(similarPark.park),
  );
  let finalGeneralContext = generalContext + '\n' + finalParksData.join('\n');

  return { finalGeneralContext, questionContextEmbedding, finalParksData };
}
