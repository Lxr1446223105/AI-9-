
import { GoogleGenAI, Type } from "@google/genai";
import { StoryboardShot, GeneratedPrompt } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Analyzes uploaded images to extract character/scene details in both EN and CN.
   */
  async analyzeImages(imageB64s: string[]): Promise<{ english: string; chinese: string }> {
    const parts = imageB64s.map(data => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: data.split(',')[1] || data,
      },
    }));

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          ...parts,
          { text: "Analyze these reference images. Provide a very detailed physical description of the main subject (person/object), their clothing, materials, facial features, and the lighting/environment. Output the description in both English and Chinese as a JSON object with keys 'english' and 'chinese'." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            chinese: { type: Type.STRING }
          },
          required: ["english", "chinese"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{"english": "", "chinese": ""}');
    } catch (e) {
      return { 
        english: response.text || "Could not analyze image.",
        chinese: "无法分析图片"
      };
    }
  }

  /**
   * Suggests a specific action or detail for a single shot slot in both languages.
   */
  async suggestShotDescription(baseDescription: string, shotType: string): Promise<{ en: string; cn: string }> {
    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: `
        Context: ${baseDescription}
        Shot Type: ${shotType}
        
        TASK: Suggest a short, cinematic, and descriptive action or detail for this specific shot type. 
        Return the result as a JSON object with 'en' (English) and 'cn' (Chinese) keys.
        Max 15 words for each.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            en: { type: Type.STRING },
            cn: { type: Type.STRING }
          },
          required: ["en", "cn"]
        }
      }
    });
    try {
      return JSON.parse(response.text || '{"en": "", "cn": ""}');
    } catch {
      return { en: "", cn: "" };
    }
  }

  /**
   * Generates the structured storyboard prompt in both EN and CN with expanded bilingual frame descriptions.
   */
  async generateStoryboardPrompt(
    baseDescription: string, 
    shots: StoryboardShot[],
    storyRequirements?: string
  ): Promise<GeneratedPrompt> {
    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: `
        Base Character/Scene Description: ${baseDescription}
        Narrative/Story Requirements: ${storyRequirements || "Follow a logical cinematic sequence based on the base description."}
        
        Shot Selection for 3x3 Grid:
        ${shots.map((s, i) => `Slot ${i + 1}: [Type: ${s.type}] [EN: ${s.en}] [CN: ${s.cn}]`).join('\n')}

        TASK: Create a professional AI image generation prompt for a 3x3 grid in both English and Chinese.
        The 3x3 grid must follow the Narrative/Story Requirements provided to ensure a cohesive story flow across the 9 tiles.

        STRICT FORMAT FOR ENGLISH VERSION:
        "Based on [Detailed Description], generate a cohesive [3x3] grid image containing [9] different camera shots in the same environment, strictly maintaining consistency of person/object, clothing and lighting, [8K] resolution, [16:9] aspect ratio.
        Shot 01: [Type] - [Expanded Description]
        Shot 02: [Type] - [Expanded Description]
        ...
        Shot 09: [Type] - [Expanded Description]"

        STRICT FORMAT FOR CHINESE VERSION:
        "根据[详细描述内容]，生成一张具有凝聚力的 [3x3]网格图像，包含在同一环境中的[9]个不同摄像机镜头，严格保持人物/物体、服装和光线的一致性，[8K]分辨率，[16:9]画幅。
        镜头 01: [景别] - [扩充描述内容]
        镜头 02: [景别] - [扩充描述内容]
        ...
        镜头 09: [景别] - [扩充描述内容]"

        Return as JSON with:
        'english': Full master prompt in English format above.
        'chinese': Full master prompt in Chinese format above.
        'shotDescriptionsEn': Array of the 9 expanded descriptions for the English version.
        'shotDescriptionsCn': Array of the 9 expanded descriptions for the Chinese version.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            chinese: { type: Type.STRING },
            shotDescriptionsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
            shotDescriptionsCn: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["english", "chinese", "shotDescriptionsEn", "shotDescriptionsCn"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { 
        english: "Error generating", 
        chinese: "无法生成",
        shotDescriptionsEn: [],
        shotDescriptionsCn: []
      };
    }
  }
}
