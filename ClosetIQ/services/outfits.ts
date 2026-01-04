import { ClosetItem, Occasion, OutfitMatch, Season } from '../types';

// Color compatibility matrix
const COLOR_COMPATIBILITY: Record<string, string[]> = {
  black: ['white', 'grey', 'red', 'blue', 'pink', 'beige', 'brown', 'green', 'yellow'],
  white: ['black', 'blue', 'red', 'green', 'brown', 'grey', 'navy', 'pink'],
  blue: ['white', 'beige', 'brown', 'grey', 'navy', 'black'],
  navy: ['white', 'beige', 'grey', 'red', 'pink'],
  grey: ['black', 'white', 'blue', 'pink', 'yellow', 'purple'],
  brown: ['beige', 'cream', 'white', 'olive', 'tan'],
  beige: ['brown', 'white', 'navy', 'blue', 'olive', 'tan'],
  red: ['black', 'white', 'navy', 'grey'],
  pink: ['white', 'grey', 'navy', 'black'],
  green: ['beige', 'brown', 'white', 'black'],
  olive: ['brown', 'beige', 'white', 'black'],
};

// Compatible clothing combinations
const OUTFIT_RULES = {
  tops: ['t-shirt', 'shirt', 'blouse', 'sweater', 'hoodie'],
  bottoms: ['jeans', 'pants', 'shorts', 'skirt'],
  dresses: ['dress'],
  outerwear: ['jacket', 'coat'],
  footwear: ['shoes', 'sneakers', 'boots'],
  accessories: ['accessories', 'hat', 'bag'],
};

interface OutfitConfig {
  requiredSlots: string[][];
  optionalSlots: string[][];
}

const OCCASION_RULES: Record<Occasion, OutfitConfig> = {
  casual: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms, OUTFIT_RULES.footwear],
    optionalSlots: [OUTFIT_RULES.accessories],
  },
  work: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms, OUTFIT_RULES.footwear],
    optionalSlots: [OUTFIT_RULES.outerwear, OUTFIT_RULES.accessories],
  },
  formal: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms, OUTFIT_RULES.footwear],
    optionalSlots: [OUTFIT_RULES.outerwear, OUTFIT_RULES.accessories],
  },
  party: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms, OUTFIT_RULES.footwear],
    optionalSlots: [OUTFIT_RULES.accessories],
  },
  date: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms, OUTFIT_RULES.footwear],
    optionalSlots: [OUTFIT_RULES.accessories],
  },
  gym: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms, OUTFIT_RULES.footwear],
    optionalSlots: [],
  },
  outdoor: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms, OUTFIT_RULES.footwear],
    optionalSlots: [OUTFIT_RULES.outerwear],
  },
  beach: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms, OUTFIT_RULES.footwear],
    optionalSlots: [OUTFIT_RULES.accessories],
  },
  other: {
    requiredSlots: [OUTFIT_RULES.tops, OUTFIT_RULES.bottoms],
    optionalSlots: [OUTFIT_RULES.footwear, OUTFIT_RULES.accessories],
  },
};

/**
 * Main outfit matching engine
 * Generates outfit suggestions based on rules and scoring
 */
export function generateOutfitMatches(
  closetItems: ClosetItem[],
  occasion: Occasion,
  season?: Season
): OutfitMatch[] {
  const matches: OutfitMatch[] = [];
  const config = OCCASION_RULES[occasion];

  // Filter items by season if specified
  const seasonalItems = season
    ? closetItems.filter(item => item.season.includes(season) || item.season.includes('all-season'))
    : closetItems;

  // Group items by category
  const itemsByCategory = groupItemsByCategory(seasonalItems);

  // Generate combinations
  const combinations = generateCombinations(itemsByCategory, config);

  // Score and filter combinations
  for (const combo of combinations) {
    const scores = scoreOutfit(combo, occasion);
    const confidence = calculateConfidence(scores);

    if (confidence > 0.5) { // Only include outfits with >50% confidence
      matches.push({
        outfit: combo,
        confidence,
        scores,
        explanation: '', // Will be filled by GPT service
        occasion,
      });
    }
  }

  // Sort by confidence and return top 10
  return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

/**
 * Score an outfit based on multiple factors
 */
function scoreOutfit(items: ClosetItem[], occasion: Occasion) {
  const colorScore = calculateColorScore(items);
  const trendScore = calculateTrendScore(items);
  const occasionScore = calculateOccasionScore(items, occasion);

  return { colorScore, trendScore, occasionScore };
}

/**
 * Calculate color compatibility score
 */
function calculateColorScore(items: ClosetItem[]): number {
  if (items.length < 2) return 1.0;

  let totalScore = 0;
  let comparisons = 0;

  for (let i = 0; i < items.length - 1; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1Colors = items[i].colors;
      const item2Colors = items[j].colors;

      const compatible = item1Colors.some(c1 =>
        item2Colors.some(c2 => 
          COLOR_COMPATIBILITY[c1.toLowerCase()]?.includes(c2.toLowerCase()) ||
          c1.toLowerCase() === c2.toLowerCase()
        )
      );

      totalScore += compatible ? 1 : 0.3;
      comparisons++;
    }
  }

  return comparisons > 0 ? totalScore / comparisons : 0.5;
}

/**
 * Calculate trend alignment score (simplified)
 */
function calculateTrendScore(items: ClosetItem[]): number {
  // For hackathon: simplified trend scoring
  // Check if colors match current trends
  const trendingColors = ['beige', 'brown', 'olive', 'cream', 'tan']; // Earth tones
  
  const trendyItems = items.filter(item =>
    item.colors.some(color => trendingColors.includes(color.toLowerCase()))
  );

  return trendyItems.length / items.length;
}

/**
 * Calculate occasion appropriateness score
 */
function calculateOccasionScore(items: ClosetItem[], occasion: Occasion): number {
  // Simplified occasion scoring
  const formalCategories = ['shirt', 'blouse', 'dress', 'coat'];
  const casualCategories = ['t-shirt', 'jeans', 'sneakers', 'hoodie'];

  if (['formal', 'work'].includes(occasion)) {
    const formalItems = items.filter(item => formalCategories.includes(item.category));
    return formalItems.length / items.length;
  } else if (['casual', 'gym'].includes(occasion)) {
    const casualItems = items.filter(item => casualCategories.includes(item.category));
    return casualItems.length / items.length;
  }

  return 0.7; // Default medium score for other occasions
}

/**
 * Calculate overall confidence score
 */
function calculateConfidence(scores: {
  colorScore: number;
  trendScore: number;
  occasionScore: number;
}): number {
  return scores.colorScore * 0.4 + scores.trendScore * 0.3 + scores.occasionScore * 0.3;
}

/**
 * Group items by their category type
 */
function groupItemsByCategory(items: ClosetItem[]): Record<string, ClosetItem[]> {
  const grouped: Record<string, ClosetItem[]> = {
    tops: [],
    bottoms: [],
    dresses: [],
    outerwear: [],
    footwear: [],
    accessories: [],
  };

  items.forEach(item => {
    if (OUTFIT_RULES.tops.includes(item.category)) grouped.tops.push(item);
    else if (OUTFIT_RULES.bottoms.includes(item.category)) grouped.bottoms.push(item);
    else if (OUTFIT_RULES.dresses.includes(item.category)) grouped.dresses.push(item);
    else if (OUTFIT_RULES.outerwear.includes(item.category)) grouped.outerwear.push(item);
    else if (OUTFIT_RULES.footwear.includes(item.category)) grouped.footwear.push(item);
    else if (OUTFIT_RULES.accessories.includes(item.category)) grouped.accessories.push(item);
  });

  return grouped;
}

/**
 * Generate valid outfit combinations
 */
function generateCombinations(
  itemsByCategory: Record<string, ClosetItem[]>,
  config: OutfitConfig
): ClosetItem[][] {
  const combinations: ClosetItem[][] = [];

  // Simple combination generation (limit to avoid performance issues)
  // In production, use more sophisticated algorithm

  const maxCombinations = 50;
  let count = 0;

  // Try dress-based outfits first
  if (itemsByCategory.dresses.length > 0) {
    for (const dress of itemsByCategory.dresses.slice(0, 5)) {
      for (const shoes of itemsByCategory.footwear.slice(0, 3)) {
        combinations.push([dress, shoes]);
        if (++count >= maxCombinations) return combinations;
      }
    }
  }

  // Try top + bottom combinations
  for (const top of itemsByCategory.tops.slice(0, 5)) {
    for (const bottom of itemsByCategory.bottoms.slice(0, 3)) {
      for (const shoes of itemsByCategory.footwear.slice(0, 3)) {
        combinations.push([top, bottom, shoes]);
        if (++count >= maxCombinations) return combinations;
        
        // Add outerwear if available
        if (itemsByCategory.outerwear.length > 0) {
          const outerwear = itemsByCategory.outerwear[0];
          combinations.push([top, bottom, shoes, outerwear]);
          if (++count >= maxCombinations) return combinations;
        }
      }
    }
  }

  return combinations;
}

/**
 * Get GPT explanation for why an outfit works
 * (Simplified for hackathon - can integrate real GPT-4 API)
 */
export async function getOutfitExplanation(outfit: ClosetItem[]): Promise<string> {
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate explanation based on outfit characteristics
  const categories = outfit.map(item => item.category).join(', ');
  const colors = [...new Set(outfit.flatMap(item => item.colors))].join(', ');

  const explanations = [
    `This ${categories} combination works beautifully with the ${colors} color palette, creating a harmonious and balanced look.`,
    `The ${colors} tones complement each other perfectly, following classic color theory principles for a cohesive outfit.`,
    `This outfit balances structure and comfort, with the ${categories} creating visual interest while maintaining wearability.`,
    `The color coordination between ${colors} creates a sophisticated aesthetic that's both trendy and timeless.`,
  ];

  return explanations[Math.floor(Math.random() * explanations.length)];
}

/*
// Real Google Gemini integration (for production)
export async function getGeminiOutfitExplanation(outfit: ClosetItem[]): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  const outfitDescription = outfit.map(item => 
    `${item.category} in ${item.colors.join('/')} (${item.pattern})`
  ).join(', ');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a fashion expert. Explain why this outfit works using color theory and trends: ${outfitDescription}. Keep it under 100 words.`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 0.7,
      }
    }),
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
*/
