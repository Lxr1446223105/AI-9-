
export type ShotType = 
  | 'Extreme Close-up' 
  | 'Close-up' 
  | 'Medium Close-up'
  | 'Medium Shot' 
  | 'Medium Full Shot' 
  | 'Full Shot' 
  | 'Wide Shot' 
  | 'Extreme Wide Shot' 
  | 'Bird\'s Eye View' 
  | 'Low Angle Shot' 
  | 'High Angle Shot' 
  | 'Over the Shoulder'
  | 'POV'
  | 'Dutch Angle'
  | 'Cowboy Shot'
  | 'Two Shot'
  | 'Macro Shot'
  | 'Silhouette Shot'
  | 'Reflection Shot'
  | 'Profile Shot'
  | 'Establishing Shot';

export interface StoryboardShot {
  id: number;
  type: ShotType;
  en: string;
  cn: string;
}

export interface GeneratedPrompt {
  english: string;
  chinese: string;
  shotDescriptionsEn: string[];
  shotDescriptionsCn: string[];
}

export interface AnalysisResult {
  description: string;
  suggestedShots: StoryboardShot[];
}
