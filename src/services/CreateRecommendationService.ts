import nlu from '../api/nlu';

interface RequestType {
  car: string;
  text: string;
}

type CarNamesType =
  | ''
  | 'TORO'
  | 'DUCATO'
  | 'FIORINO'
  | 'CRONOS'
  | 'FIAT 500'
  | 'MAREA'
  | 'LINEA'
  | 'ARGO'
  | 'RENEGADE';

interface NLUType {
  usage: {
    text_units: number;
    text_characters: number;
    features: number;
  };
  sentiment: {
    document: {
      score: number;
      label: string;
    };
  };
  language: string;
  entities: Array<{
    type: string;
    text: string;
    sentiment: {
      score: number;
      label: string;
    };
    disambiguation: {
      subtype: Array<string>;
    };
    count: number;
    confidence: number;
  }>;
}

interface EntitiesType {
  entity: string;
  sentiment: number;
  mention: string;
}

interface UntieType {
  car: CarNamesType;
  sentiment: number;
  priority: number;
}

interface ResponseType {
  recommendation: CarNamesType;
  entities: EntitiesType[];
}

interface EntityPriorityType {
  priority: number;
  car: CarNamesType;
}
interface PriorityListType {
  [key: string]: EntityPriorityType;
}

const carPriorityResponse: PriorityListType = {
  SEGURANCA: { priority: 1, car: 'TORO' },
  CONSUMO: { priority: 2, car: 'ARGO' },
  DESEMPENHO: { priority: 3, car: 'MAREA' },
  MANUTENCAO: { priority: 4, car: 'FIORINO' },
  CONFORTO: { priority: 5, car: 'LINEA' },
  DESIGN: { priority: 6, car: 'RENEGADE' },
  ACESSORIOS: { priority: 7, car: 'FIAT 500' },
};

class CreateRecommendationService {
  public async execute({ car, text }: RequestType): Promise<ResponseType> {
    let recommendation: CarNamesType = '';
    const entities: EntitiesType[] = [];
    console.log('CreateRecommendationService', car, text);

    try {
      await nlu
        .post<NLUType>('', {
          text,
          version: '2020-09-12',
          features: {
            sentiment: {},
            entities: {
              model: process.env.NLU_MODEL,
              sentiment: true,
            },
          },
        })
        .then(response => {
          console.log(
            'CreateRecommendationService',
            JSON.stringify(response.data),
          );
          const results = response.data;
          const negativeEntities: UntieType[] = [];

          results.entities.forEach(entityData => {
            if (
              entityData.type !== 'MODELO' &&
              entityData.sentiment.score < 0
            ) {
              negativeEntities.push({
                car: carPriorityResponse[entityData.type].car,
                sentiment: entityData.sentiment.score,
                priority: carPriorityResponse[entityData.type].priority,
              });
            }
            entities.push({
              entity: entityData.type,
              sentiment: entityData.sentiment.score,
              mention: entityData.text,
            });
          });
          console.log('sem sort', negativeEntities);

          if (negativeEntities.length > 0) {
            // apenas com sentimentos negativos
            negativeEntities.sort(
              (a, b) =>
                Math.round(a.sentiment * 10) / 10 -
                  Math.round(b.sentiment * 10) / 10 || a.priority - b.priority,
            );
            console.log('sorted ', negativeEntities);
            if (negativeEntities[0].car !== car) {
              recommendation = negativeEntities[0].car;
            }
          }
        });
    } catch (error) {
      console.log(error);
    }

    console.log('recomendation', recommendation);
    console.log('entities', entities);
    return {
      recommendation,
      entities,
    };
  }
}

export default CreateRecommendationService;
