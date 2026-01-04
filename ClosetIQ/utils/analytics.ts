import { ClosetItem, ClosetAnalytics, Season } from '../types';

/**
 * Calculate comprehensive closet analytics
 */
export function calculateClosetAnalytics(items: ClosetItem[]): ClosetAnalytics {
  if (items.length === 0) {
    return {
      totalItems: 0,
      mostUsedCategory: 't-shirt',
      leastUsedCategory: 't-shirt',
      underusedItems: 0,
      averageWearCount: 0,
      colorDistribution: {},
      seasonDistribution: { spring: 0, summer: 0, fall: 0, winter: 0, 'all-season': 0 },
      sustainabilityScore: 0,
    };
  }

  // Calculate category usage
  const categoryWearCounts: Record<string, number> = {};
  items.forEach(item => {
    if (!categoryWearCounts[item.category]) {
      categoryWearCounts[item.category] = 0;
    }
    categoryWearCounts[item.category] += item.wearCount;
  });

  const sortedCategories = Object.entries(categoryWearCounts).sort(
    (a, b) => b[1] - a[1]
  );

  // Calculate underused items (not worn in 30+ days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const underusedItems = items.filter(
    item => !item.lastUsed || item.lastUsed < thirtyDaysAgo
  ).length;

  // Calculate average wear count
  const averageWearCount =
    items.reduce((sum, item) => sum + item.wearCount, 0) / items.length;

  // Calculate color distribution
  const colorDistribution: Record<string, number> = {};
  items.forEach(item => {
    item.colors.forEach(color => {
      colorDistribution[color] = (colorDistribution[color] || 0) + 1;
    });
  });

  // Calculate season distribution
  const seasonDistribution: Record<Season, number> = {
    spring: 0,
    summer: 0,
    fall: 0,
    winter: 0,
    'all-season': 0,
  };
  items.forEach(item => {
    item.season.forEach(season => {
      seasonDistribution[season]++;
    });
  });

  // Calculate sustainability score
  const sustainabilityScore = calculateSustainabilityScore(items);

  return {
    totalItems: items.length,
    mostUsedCategory: sortedCategories[0]?.[0] as any || 't-shirt',
    leastUsedCategory:
      sortedCategories[sortedCategories.length - 1]?.[0] as any || 't-shirt',
    underusedItems,
    averageWearCount: Math.round(averageWearCount),
    colorDistribution,
    seasonDistribution,
    sustainabilityScore,
  };
}

/**
 * Calculate sustainability score based on usage patterns
 */
export function calculateSustainabilityScore(items: ClosetItem[]): number {
  if (items.length === 0) return 0;

  let score = 0;

  // Factor 1: Usage rate (40% of score)
  const totalWears = items.reduce((sum, item) => sum + item.wearCount, 0);
  const usageScore = Math.min(
    (totalWears / items.length / 10) * 100,
    100
  );
  score += usageScore * 0.4;

  // Factor 2: Underutilization penalty (30% of score)
  const underusedCount = items.filter(item => item.wearCount < 2).length;
  const utilizationScore = ((items.length - underusedCount) / items.length) * 100;
  score += utilizationScore * 0.3;

  // Factor 3: Cost per wear (30% of score)
  const itemsWithPrice = items.filter(item => item.price && item.wearCount > 0);
  if (itemsWithPrice.length > 0) {
    const avgCostPerWear =
      itemsWithPrice.reduce(
        (sum, item) => sum + (item.price! / item.wearCount),
        0
      ) / itemsWithPrice.length;
    // Lower cost per wear = better sustainability
    const costScore = Math.max(100 - avgCostPerWear * 2, 0);
    score += costScore * 0.3;
  } else {
    score += 70 * 0.3; // Default reasonable score if no price data
  }

  return Math.round(Math.min(score, 100));
}

/**
 * Calculate cost per wear for an item
 */
export function calculateCostPerWear(item: ClosetItem): number {
  if (!item.price || item.wearCount === 0) {
    return item.price || 0;
  }
  return item.price / item.wearCount;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Get color name from hex
 */
export function getColorName(hex: string): string {
  const colorMap: Record<string, string> = {
    '#000000': 'black',
    '#FFFFFF': 'white',
    '#808080': 'grey',
    '#0000FF': 'blue',
    '#000080': 'navy',
    '#FF0000': 'red',
    '#FFC0CB': 'pink',
    '#A52A2A': 'brown',
    '#F5F5DC': 'beige',
    '#008000': 'green',
  };
  
  return colorMap[hex.toUpperCase()] || hex;
}
