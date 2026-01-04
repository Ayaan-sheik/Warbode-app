// User Types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  preferences?: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  fashionStyle: string[];
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

// Closet Item Types
export interface ClosetItem {
  id: string;
  userId: string;
  imageUrl: string;
  category: ClothingCategory;
  colors: string[];
  pattern: Pattern;
  fabric?: string;
  season: Season[];
  confidence: number;
  lastUsed?: Date;
  wearCount: number;
  price?: number;
  purchaseDate?: Date;
  tags?: string[];
  createdAt: Date;
}

export type ClothingCategory =
  | 't-shirt'
  | 'shirt'
  | 'blouse'
  | 'sweater'
  | 'hoodie'
  | 'jacket'
  | 'coat'
  | 'jeans'
  | 'pants'
  | 'shorts'
  | 'skirt'
  | 'dress'
  | 'shoes'
  | 'sneakers'
  | 'boots'
  | 'accessories'
  | 'hat'
  | 'bag'
  | 'other';

export type Pattern = 'solid' | 'striped' | 'plaid' | 'floral' | 'geometric' | 'polka-dot' | 'other';

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';

// Outfit Types
export interface Outfit {
  id: string;
  userId: string;
  name: string;
  items: string[]; // Array of ClosetItem IDs
  occasion: Occasion;
  season: Season;
  confidence: number;
  explanation?: string;
  trendScore?: number;
  createdAt: Date;
  lastWorn?: Date;
  favorite: boolean;
}

export type Occasion =
  | 'casual'
  | 'work'
  | 'formal'
  | 'party'
  | 'date'
  | 'gym'
  | 'outdoor'
  | 'beach'
  | 'other';

// Outfit Matching
export interface OutfitMatch {
  outfit: ClosetItem[];
  confidence: number;
  scores: {
    colorScore: number;
    trendScore: number;
    occasionScore: number;
  };
  explanation: string;
  occasion: Occasion;
}

// Trends Types
export interface Trend {
  id: string;
  name: string;
  status: 'trending-now' | 'rising' | 'classic' | 'fading';
  colors: string[];
  patterns?: Pattern[];
  categories?: ClothingCategory[];
  description: string;
  image?: string;
}

// Marketplace Types
export interface MarketplaceItem {
  id: string;
  name: string;
  category: ClothingCategory;
  price: number;
  imageUrl: string;
  brand: string;
  colors: string[];
  affiliateLink: string;
  reason?: string; // Why it's recommended
}

// AI Vision Response
export interface VisionAnalysis {
  category: ClothingCategory;
  colors: string[];
  pattern: Pattern;
  fabric?: string;
  season: Season[];
  confidence: number;
  labels: string[];
}

// Analytics
export interface ClosetAnalytics {
  totalItems: number;
  mostUsedCategory: ClothingCategory;
  leastUsedCategory: ClothingCategory;
  underusedItems: number; // Not worn in 30+ days
  averageWearCount: number;
  colorDistribution: Record<string, number>;
  seasonDistribution: Record<Season, number>;
  sustainabilityScore: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'outfit-suggestion' | 'trend-alert' | 'wardrobe-reminder' | 'sustainability';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}
