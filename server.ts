import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route: Craving Concierge Powered by Gemini
app.post("/api/concierge", async (req: Request, res: Response) => {
  try {
    const { mood, budget, dietary, userNotes, availableDishes } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback response generator if API key missing or fails
    const generateFallback = () => {
      let title = "Savorly Curated Meal Pairings";
      let reasoning = `Based on your ${mood || "current"} craving and dietary preference (${dietary?.join(", ") || "No restrictions"}), our culinary team curated this balanced meal experience for you.`;
      
      let itemsToRecommend: any[] = [];
      if (mood?.toLowerCase().includes("date") || mood?.toLowerCase().includes("romantic")) {
        title = "Candlelight Italian Romance Trio";
        reasoning = "Artisanal truffle tagliatelle paired with crisp garlic focaccia and velvety gelato for a perfect evening.";
        itemsToRecommend = [
          { name: "Truffle & Wild Mushroom Tagliatelle", quantity: 1, reason: "Silky hand-cut pasta in rich black truffle butter." },
          { name: "Artisanal Woodfired Focaccia", quantity: 1, reason: "Rosemary & olive oil sourdough." },
          { name: "Classic Italian Tiramisu", quantity: 1, reason: "Espresso-soaked mascarpone finish." }
        ];
      } else if (mood?.toLowerCase().includes("rain") || mood?.toLowerCase().includes("comfort")) {
        title = "Monsoon Madras Comfort Feast";
        reasoning = "Steaming hot filter coffee paired with crispy onion pakoda and hot ghee pongal to warm your soul.";
        itemsToRecommend = [
          { name: "Traditional Ghee Ven Pongal", quantity: 1, reason: "Piping hot rice & lentils tempered in pure cow ghee & cashews." },
          { name: "Hot Madras Filter Coffee", quantity: 2, reason: "Authentic brass tumbler frothy brew." },
          { name: "Crispy Medu Vada (2 pcs)", quantity: 1, reason: "Crispy golden lentil fritters with coconut chutney." }
        ];
      } else if (mood?.toLowerCase().includes("protein") || mood?.toLowerCase().includes("workout")) {
        title = "Ultimate Post-Workout High Protein Stack";
        reasoning = "Over 45g of clean lean protein featuring chargrilled tandoori chicken, quinoa salad, and Greek yogurt smoothie.";
        itemsToRecommend = [
          { name: "Smoked Tandoori Chicken Tikka", quantity: 1, reason: "Low-fat juicy breast cuts marinated in hung curd & spices (38g Protein)." },
          { name: "Power Quinoa & Avocado Bowl", quantity: 1, reason: "Fiber rich with toasted pumpkin seeds." },
          { name: "High Protein Berry Greek Yogurt", quantity: 1, reason: "Gut-friendly, zero added sugar." }
        ];
      } else {
        title = "Savorly Signature Chef Bundle";
        reasoning = "Our highest rated bestseller combination crafted for instant satisfaction and freshness.";
        itemsToRecommend = [
          { name: "Seeraga Samba Mutton Biryani", quantity: 1, reason: "Aromatic Tamil Nadu heirloom rice biryani slow cooked in brass degs." },
          { name: "Malabar Parotta & Chettinad Gravy", quantity: 1, reason: "Flaky layered parotta with fiery pepper curry." },
          { name: "Elaneer Payasam", quantity: 1, reason: "Chilled tender coconut dessert." }
        ];
      }

      return {
        title,
        reasoning,
        pairings: itemsToRecommend,
        estimatedCost: budget ? Math.min(budget, 850) : 650,
        estimatedPreparationMinutes: 25,
        chefTip: "Best paired with a chilled beverage. Eat within 35 minutes for optimal aroma."
      };
    };

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.log("Using Savorly smart concierge fallback (No API key set)");
      return res.json(generateFallback());
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are "Savorly Craving Concierge", a world-class AI culinary sommelier for a luxury food platform in Chennai, India.
The user is expressing a food craving or mood.
User Request Details:
- Mood/Vibe: ${mood || "General hunger"}
- Budget limit: ₹${budget || "Flexible"}
- Dietary restrictions: ${dietary?.length ? dietary.join(", ") : "None"}
- Additional preferences: ${userNotes || "None"}
- Sample menu items in inventory: ${JSON.stringify(availableDishes?.slice(0, 15) || [])}

Recommend a curated meal combo of 2 to 4 items from the inventory or inspired dish names. Ensure you strictly observe dietary restrictions (e.g. if peanut allergy or pure-veg is specified).

Respond strictly in valid JSON format matching this schema:
{
  "title": "A short, evocative title for the meal combo",
  "reasoning": "1-2 sentences explaining why this combination perfectly cures their craving",
  "pairings": [
    { "name": "Exact or recommended dish name", "quantity": 1, "reason": "Why it belongs in this bundle" }
  ],
  "estimatedCost": 650,
  "estimatedPreparationMinutes": 25,
  "chefTip": "A quick tip on how to enjoy or pair this meal"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } else {
      return res.json(generateFallback());
    }
  } catch (error) {
    console.error("Concierge API Error:", error);
    // Fallback gracefully
    res.json({
      title: "Chef's Signature Gourmet Meal",
      reasoning: "Curated with high protein, rich spices, and zero preservatives for your exact craving.",
      pairings: [
        { name: "Seeraga Samba Biryani Special", quantity: 1, reason: "Aromatic slow-cooked recipe." },
        { name: "Flaky Parotta & Pepper Gravy", quantity: 1, reason: "Perfect savory pairing." }
      ],
      estimatedCost: 590,
      estimatedPreparationMinutes: 20,
      chefTip: "Serve immediately with spiced raita."
    });
  }
});

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Savorly", timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Savorly Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
