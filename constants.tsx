
import { ShotType } from './types';

export const SHOT_TYPES: ShotType[] = [
  'Extreme Close-up',
  'Close-up',
  'Medium Close-up',
  'Medium Shot',
  'Medium Full Shot',
  'Full Shot',
  'Wide Shot',
  'Extreme Wide Shot',
  'Bird\'s Eye View',
  'Low Angle Shot',
  'High Angle Shot',
  'Over the Shoulder',
  'POV',
  'Dutch Angle',
  'Cowboy Shot',
  'Two Shot',
  'Macro Shot',
  'Silhouette Shot',
  'Reflection Shot',
  'Profile Shot',
  'Establishing Shot',
  'Micro-expression',
  'Outfit Details'
];

export const SHOT_TYPES_MAP: Record<ShotType, { en: string; cn: string }> = {
  'Extreme Close-up': { en: 'Extreme Close-up', cn: '大特写' },
  'Close-up': { en: 'Close-up', cn: '特写' },
  'Medium Close-up': { en: 'Medium Close-up', cn: '中近景' },
  'Medium Shot': { en: 'Medium Shot', cn: '中景' },
  'Medium Full Shot': { en: 'Medium Full Shot', cn: '中全景' },
  'Full Shot': { en: 'Full Shot', cn: '全景' },
  'Wide Shot': { en: 'Wide Shot', cn: '远景' },
  'Extreme Wide Shot': { en: 'Extreme Wide Shot', cn: '大远景' },
  'Bird\'s Eye View': { en: 'Bird\'s Eye View', cn: '俯视 (鸟瞰)' },
  'Low Angle Shot': { en: 'Low Angle Shot', cn: '仰拍' },
  'High Angle Shot': { en: 'High Angle Shot', cn: '俯拍' },
  'Over the Shoulder': { en: 'Over the Shoulder', cn: '过肩镜头' },
  'POV': { en: 'POV', cn: '第一人称视角 (POV)' },
  'Dutch Angle': { en: 'Dutch Angle', cn: '荷兰角 (倾斜镜头)' },
  'Cowboy Shot': { en: 'Cowboy Shot', cn: '牛仔镜头 (七分身)' },
  'Two Shot': { en: 'Two Shot', cn: '双人合影镜头' },
  'Macro Shot': { en: 'Macro Shot', cn: '微距镜头' },
  'Silhouette Shot': { en: 'Silhouette Shot', cn: '剪影镜头' },
  'Reflection Shot': { en: 'Reflection Shot', cn: '反射镜头' },
  'Profile Shot': { en: 'Profile Shot', cn: '侧面镜头' },
  'Establishing Shot': { en: 'Establishing Shot', cn: '全景交代镜头' },
  'Micro-expression': { en: 'Micro-expression', cn: '微表情' },
  'Outfit Details': { en: 'Outfit Details', cn: '穿搭细节' }
};

export const DEFAULT_SHOTS: ShotType[] = [
  'Extreme Close-up',
  'Close-up',
  'Medium Close-up',
  'Medium Shot',
  'Full Shot',
  'Wide Shot',
  'Low Angle Shot',
  'Micro-expression',
  'Outfit Details'
];
