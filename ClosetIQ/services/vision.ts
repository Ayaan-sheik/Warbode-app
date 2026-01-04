import { VisionAnalysis, ClothingCategory, Pattern, Season } from '../types';
import Constants from 'expo-constants';

// Mock vision analysis for demo purposes
// In production, integrate with Google Vision API, AWS Rekognition, or Azure Vision
export async function analyzeClothingImage(imageUri: string): Promise<VisionAnalysis> {
  // Simulated API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock analysis - in production, send to AI vision service
  const mockAnalysis: VisionAnalysis = {
    category: getRandomCategory(),
    colors: getRandomColors(),
    pattern: getRandomPattern(),
    fabric: getRandomFabric(),
    season: getRandomSeasons(),
    confidence: 0.85 + Math.random() * 0.1,
    labels: ['clothing', 'apparel', 'fashion'],
  };

  return mockAnalysis;
}

// Real Google Vision API integration (commented for hackathon)
/*
export async function analyzeWithGoogleVision(imageUri: string): Promise<VisionAnalysis> {
  const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
  
  const base64Image = await convertImageToBase64(imageUri);
  
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'IMAGE_PROPERTIES' },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return mapVisionResponseToAnalysis(data);
}
*/

// Helper functions for mock data
function getRandomCategory(): ClothingCategory {
  const categories: ClothingCategory[] = [
    't-shirt', 'shirt', 'jeans', 'pants', 'dress', 'jacket', 
    'sweater', 'shorts', 'skirt', 'shoes', 'sneakers'
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomColors(): string[] {
  const colorPools = [
    ['black'],
    ['white'],
    ['blue', 'navy'],
    ['red', 'burgundy'],
    ['grey', 'charcoal'],
    ['brown', 'tan'],
    ['green', 'olive'],
    ['pink', 'rose'],
    ['beige', 'cream'],
  ];
  return colorPools[Math.floor(Math.random() * colorPools.length)];
}

function getRandomPattern(): Pattern {
  const patterns: Pattern[] = ['solid', 'striped', 'plaid', 'floral', 'geometric'];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

function getRandomFabric(): string {
  const fabrics = ['cotton', 'denim', 'polyester', 'wool', 'silk', 'linen'];
  return fabrics[Math.floor(Math.random() * fabrics.length)];
}

function getRandomSeasons(): Season[] {
  const seasonSets: Season[][] = [
    ['summer'],
    ['winter'],
    ['spring', 'fall'],
    ['all-season'],
  ];
  return seasonSets[Math.floor(Math.random() * seasonSets.length)];
}

// Fallback manual tagging interface
export interface ManualTagInput {
  category: ClothingCategory;
  colors: string[];
  pattern: Pattern;
  fabric?: string;
  season: Season[];
}

export function createManualAnalysis(input: ManualTagInput): VisionAnalysis {
  return {
    ...input,
    confidence: 1.0,
    labels: ['manually-tagged'],
  };
}
