import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/multer';
import speech from '../api/speech';

interface RequestType {
  audio: Express.Multer.File;
}

interface SpeechType {
  result_index: number;
  results: Array<{
    final: boolean;
    alternatives: Array<{
      transcript: string;
      confidence: number;
    }>;
  }>;
}

interface ResponseType {
  convertedText: string;
}

class SpeechToTextService {
  public async execute({ audio }: RequestType): Promise<ResponseType> {
    if (!audio) {
      return {
        convertedText: '',
      };
    }
    const audiofile = path.resolve(uploadConfig.audioFolder, audio.filename);

    let textFromSpeech = '';
    try {
      await speech
        .post<SpeechType>('', fs.createReadStream(audiofile))
        .then(response => {
          console.log('SpeechToTextService', JSON.stringify(response.data));
          const { results } = response.data;
          textFromSpeech = results.reduce((previous, current) => {
            return (
              previous +
              current.alternatives.reduce((alt_previous, alt_current) => {
                return alt_previous + alt_current.transcript;
              }, '')
            );
          }, '');
        });
    } catch (error) {
      console.log(error);
    } finally {
      await fs.promises.unlink(audiofile);
    }

    return {
      convertedText: textFromSpeech,
    };
  }
}

export default SpeechToTextService;
