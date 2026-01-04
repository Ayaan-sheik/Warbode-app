# Demo Credentials & Sample Data

## Demo User Account

For quick testing without signup:

**Email:** demo@closetiq.com  
**Password:** Demo123!

## Sample Closet Items (Auto-Generated)

The app includes mock AI responses that will automatically tag uploaded items with:

### Categories
- Tops: t-shirt, shirt, blouse, sweater, hoodie
- Bottoms: jeans, pants, shorts, skirt
- Dresses: dress
- Outerwear: jacket, coat
- Footwear: shoes, sneakers, boots
- Accessories: accessories, hat, bag

### Color Detection
- Black, White, Grey
- Blue, Navy
- Red, Pink, Burgundy
- Brown, Beige, Tan
- Green, Olive
- And more...

### Patterns
- Solid
- Striped
- Plaid
- Floral
- Geometric
- Polka-dot

### Seasons
- Spring
- Summer  
- Fall
- Winter
- All-season

## Sample Outfits (AI-Generated)

When you generate outfit suggestions, you'll see:

1. **Casual Weekend**
   - Confidence: 87%
   - Components: T-shirt + Jeans + Sneakers
   - Color Score: 95%
   - Trend Score: 78%

2. **Business Casual**
   - Confidence: 91%
   - Components: Shirt + Pants + Shoes
   - Occasion: Work
   - Color Harmony: Excellent

3. **Date Night**
   - Confidence: 88%
   - Components: Dress + Heels + Accessories
   - Trending: Yes
   - Style: Romantic

## Trends Data

8 pre-loaded fashion trends:
- Earth Tones (Trending Now)
- Oversized Comfort (Trending Now)
- Monochrome Magic (Classic)
- Denim Revival (Rising)
- Pastels & Soft Hues (Rising)
- Statement Patterns (Trending Now)
- Athleisure (Classic)
- Business Casual 2.0 (Rising)

## Marketplace Items

10 demo products across categories:
- Accessories: Watch, Scarf, Sunglasses
- Bags: Tote Bag
- Footwear: Sneakers, Chelsea Boots
- Outerwear: Jacket, Blazer, Denim Jacket
- Sweaters: Cashmere Sweater

Price range: $45 - $199

## Analytics (Mock Data)

When viewing your profile, you'll see:
- Total Items: Dynamic based on uploads
- Sustainability Score: 85%
- Average Cost Per Wear: Calculated from item data
- Underused Items: Items not worn in 30+ days

## Admin Panel Data

Access from Profile → Admin Panel to see:
- AI Confidence Scores (85-95%)
- Color Detection Details
- Pattern Recognition Results
- Outfit Matching Algorithm
- Rule Engine Output
- System Statistics

## Quick Demo Workflow

1. **Sign Up** → Use any email/password
2. **Upload 5-10 Items** → Use photos from your device or stock images
3. **Wait for AI Analysis** → Mock analysis takes ~1.5 seconds
4. **Browse Closet** → See your items organized with filters
5. **Generate Outfits** → Select occasion and get AI suggestions
6. **Check Trends** → See which trends match your wardrobe
7. **Visit Marketplace** → Get personalized recommendations
8. **Show Admin Panel** → Impress judges with technical details!

## Testing Tips

- Use bright, clear photos for best visual results
- Mix different categories for better outfit suggestions
- Try different occasions to see varied outfit recommendations
- Check the admin panel to understand the AI logic
- Explore trends to see real-time fashion intelligence

## Mock vs Real AI

**Current (Mock Mode):**
- Instant responses
- Pre-defined logic
- Works offline
- Perfect for demos

**Production Ready:**
- Uncomment real API calls in:
  - `services/vision.ts` (Google Vision)
  - `services/outfits.ts` (GPT-4)
- Add API keys to `.env`
- Slower but more accurate

---

**All data is demonstration quality and perfect for hackathon judging!**
