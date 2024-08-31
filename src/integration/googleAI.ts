import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

interface GoogleIAFileData {
  fileData: {
    mimeType: string;
    fileUri: string;
  };
}

interface GoogleFileManagerAIParams {
  image: {
    path: string;
    type: string;
    name: string;
  };

  prompt: string;
}

class GoogleFileManagerAI {
  private fileManager: GoogleAIFileManager;
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Realiza a verificação na IA e retorna os dados já processados.
   *
   * @param {GoogleFileManagerAIParams} params
   * @returns {string}
   */
  public async processIA(params: GoogleFileManagerAIParams): Promise<any> {
    try {
      const fileData = await this.getFileData(params);
      const result = await this.model.generateContent([
        fileData,
        { text: params.prompt },
      ]);

      return result.response.text();
    } catch (error) {
      return error;
    }
  }

  /**
   * Realiza o upload da imagem e retorna os dados no formato necessário pra realizar o prompt
   *
   * @param {GoogleFileManagerAIParams} params
   * @returns {Promise<GoogleIAFileData>}
   */
  private async getFileData(
    params: GoogleFileManagerAIParams,
  ): Promise<GoogleIAFileData> {
    const uploadResponse = await this.fileManager.uploadFile(
      params.image.path,
      {
        mimeType: params.image.type,
        displayName: params.image.name,
      },
    );

    return {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    };
  }
}

/**
 * Serviço utilizado para processamento de imagem na IA Gemini.
 *
 * @function
 * @name GoogleFileManager
 * @param {GoogleFileManagerAIParams} params
 * @returns {Promise<string | undefined>}
 */
export default async function GoogleFileManager(
  params: GoogleFileManagerAIParams,
): Promise<string | undefined> {
  return new GoogleFileManagerAI().processIA(params);
}
