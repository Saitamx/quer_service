import { httpClient } from './http-client';
import { handleEmbeddingResponse } from './embedding-handler';
import { HttpException, HttpStatus } from '@nestjs/common';
import { API_CONFIG } from '../config/api-config';

export async function getParksData() {
  console.log(API_CONFIG)
  try {
    const response = await httpClient.get(API_CONFIG.PARKS_SERVICE);
    const promises = response.data.map(async (park: any) => {
      try {
        const parkContext = park.name + ' ' + park.id;
        const parkEmbedding = await handleEmbeddingResponse(parkContext);
        return {
          park,
          embedding: parkEmbedding,
        };
      } catch (error) {
        console.error(`Failed to get embedding for park ${park.id}: ${error}`);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const parkEmbeddings = results.filter((result) => result !== null);
    return parkEmbeddings;
  } catch (error) {
    console.log(error)
    throw new HttpException(
      'Failed to get parks data',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
