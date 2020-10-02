import { Request, Response } from 'express';

import CreateRecommendationService from '../services/CreateRecommendationService';
import SpeechToTextService from '../services/SpeechToTextService';

export default class FCAController {
  public async createRecommendation(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { car, text } = request.body;
    const audio = request.file;
    let textToNLU = '';

    const createRecommendationService = new CreateRecommendationService();

    if (text) {
      textToNLU = text;
    } else if (audio) {
      const speechToTextService = new SpeechToTextService();

      const { convertedText } = await speechToTextService.execute({ audio });
      console.log('createAudio file', audio.filename);

      if (convertedText) {
        textToNLU = convertedText;
      }
    }

    if (car && textToNLU) {
      const {
        recommendation,
        entities,
      } = await createRecommendationService.execute({
        car,
        text: textToNLU,
      });
      return response.json({
        recommendation,
        entities,
      });
    }

    return response.json({
      recommendation: '',
      entities: [],
    });
  }
}
