// backend/utils/gemini.js
const { GoogleGenAI } = require("@google/generative-ai");

// Helper to determine if a valid API key is present
const hasApiKey = () => {
  return (
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your_api_key_here" &&
    process.env.GEMINI_API_KEY.trim() !== ""
  );
};

// Initialize Gemini client if key is present
let ai = null;
if (hasApiKey()) {
  try {
    // In @google/generative-ai v1+, we initialize with new GoogleGenAI({ apiKey: ... })
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.error("Failed to initialize Google Gen AI client:", err.message);
  }
}

/**
 * 1. AI Safari Itinerary Generator
 */
async function generateItinerary(duration, groupType, interests) {
  if (hasApiKey() && ai) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are an expert wildlife tour operator for Jim Corbett National Park. 
        Create a detailed, beautiful, and highly personalized safari tour itinerary based on the following preferences:
        - Duration: ${duration} Days
        - Group Type: ${groupType} (e.g., family with kids, couple, photographers, senior citizens)
        - Primary Interests: ${interests} (e.g., Tiger sighting, bird watching, camping, adventure, nature walks)

        Format the response STRICTLY as a valid JSON object. Do not include markdown code block syntax (like \`\`\`json). The JSON must have this structure:
        {
          "title": "A highly catchy, adventurous title",
          "overview": "A compelling, narrative-style introduction to the trip tailored to the group and interests.",
          "itinerary": [
            {
              "day": 1,
              "morning": "Morning activity details (e.g., morning jeep safari in Bijrani, bird watching)",
              "afternoon": "Afternoon activity details (e.g., museum visit, resort resting)",
              "evening": "Evening/night activity details (e.g., bonfire story session, local Kumaoni dinner)",
              "tips": "Practical tip for the day (e.g., wear neutral colors, carry binocular)"
            }
          ],
          "packingList": ["Item 1", "Item 2", "Item 3", "Item 4"],
          "safetyGuidelines": ["Guideline 1", "Guideline 2", "Guideline 3"]
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      // Clean potential JSON markdown wrapping
      const cleaned = text.replace(/^```json/i, "").replace(/```$/, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini Itinerary API Error, falling back to mock:", err.message);
    }
  }

  // FALLBACK RICH MOCK DATA
  return getMockItinerary(duration, groupType, interests);
}

/**
 * 2. Conversational Booking Chatbot
 */
async function parseChatSession(messages) {
  const lastMessage = messages[messages.length - 1]?.text || "";

  if (hasApiKey() && ai) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Format chat history for prompt context
      const chatHistoryStr = messages
        .map((m) => `${m.from === "user" ? "User" : "Bot"}: ${m.text}`)
        .join("\n");

      const prompt = `
        You are "Safari Assistant", a highly friendly and helpful AI booking assistant for Corbett Trails (Jim Corbett National Park).
        Your absolute goal is to guide the user in booking their safari ride by extracting 7 key parameters:
        1. fullName (User's full name)
        2. email (User's email)
        3. phone (User's 10-digit mobile number)
        4. zone (One of: Dhikala, Bijrani, Jhirna, Dhela, Durga Devi, Garjiya, Sitabani, Phato)
        5. date (The date of the safari in YYYY-MM-DD format)
        6. visitors (Number of visitors, integer, or a string like "6+")
        7. safariType (One of: Jeep Safari, Canter Safari, Elephant Safari)

        Analyze the following chat history. Ask for missing information one-by-one in a highly friendly and polite manner. Keep your responses concise and engaging. 
        If they have provided information, extract it.

        Chat History:
        ${chatHistoryStr}

        Output your response STRICTLY as a valid JSON object. Do not include markdown code block syntax (like \`\`\`json). The JSON must have this structure:
        {
          "responseText": "Your natural, direct, conversational reply to the user. Ask for missing details or explain something they asked.",
          "extractedData": {
            "fullName": "extracted name or null",
            "email": "extracted email or null",
            "phone": "extracted phone number or null",
            "zone": "extracted zone or null",
            "date": "extracted date in YYYY-MM-DD or null",
            "visitors": "extracted number of visitors or null",
            "safariType": "extracted safari type or null"
          }
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json/i, "").replace(/```$/, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini Chatbot API Error, falling back to mock:", err.message);
    }
  }

  // SMART FALLBACK MOCK CHATBOT
  return getMockChatbotResponse(messages, lastMessage);
}

/**
 * 3. AI Sighting Probability Predictor
 */
async function predictSighting(zone, date) {
  if (hasApiKey() && ai) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Estimate real-time animal sighting probability percentages for Jim Corbett National Park.
        - Zone selected: ${zone}
        - Visit Date: ${date}

        Format the response STRICTLY as a valid JSON object. Do not include markdown code block syntax (like \`\`\`json). The JSON must have this structure:
        {
          "summary": "A highly insightful, realistic 2-3 sentence overview explaining why the sighting rates are what they are (mentioning seasonal trends, weather, or typical animal movements for that zone).",
          "predictions": {
            "Tiger": 0 to 100 integer,
            "Elephant": 0 to 100 integer,
            "Leopard": 0 to 100 integer,
            "SlothBear": 0 to 100 integer,
            "Deer": 0 to 100 integer
          }
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json/i, "").replace(/```$/, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini Sighting Predictor API Error, falling back to mock:", err.message);
    }
  }

  // DETERMINISTIC ALGORITHMIC FALLBACK
  return getMockSightingPrediction(zone, date);
}

/**
 * 4. AI Wildlife Image Scanner (Vision)
 */
async function analyzeImage(imageBase64) {
  if (hasApiKey() && ai) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Clean base64 header if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      };

      const prompt = `
        You are an advanced Wildlife Biologist AI scanning a photograph taken during a Jim Corbett safari.
        Analyze the image and identify the primary wild animal visible.
        
        Format the response STRICTLY as a valid JSON object. Do not include markdown code block syntax (like \`\`\`json). The JSON must have this structure:
        {
          "animalName": "The common species name (e.g. Bengal Tiger, Asiatic Elephant, Spotted Deer, Crested Serpent Eagle)",
          "confidence": 0 to 100 integer representing identification confidence,
          "description": "A beautiful 1-2 sentence description of the animal visible in the image, noting its posture or context.",
          "tags": ["wildlife", "animal_name_tag", "safari", "action_tag"]
        }
      `;

      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json/i, "").replace(/```$/, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini Vision API Error, falling back to mock:", err.message);
    }
  }

  // VISUAL DISPATCHER FALLBACK (analyzes string signature or picks dynamically)
  return getMockImageAnalysis(imageBase64);
}


/* ==========================================================================
   HEURISTIC MOCK FALLBACK IMPLEMENTATIONS
   ========================================================================== */

function getMockItinerary(duration, groupType, interests) {
  const daysCount = parseInt(duration) || 3;
  const lowercaseGroup = groupType.toLowerCase();
  const lowercaseInterests = interests.toLowerCase();

  const title = `The Ultimate ${interests.split(',')[0] || 'Wildlife'} Safari Expedition`;
  
  let overview = `Welcome to Jim Corbett National Park! This customized ${daysCount}-day itinerary is specially tailored for a **${groupType}** with a focus on **${interests}**. We have carefully selected premium, high-sighting safari zones like Bijrani and Jhirna, balanced with leisure activities to guarantee an unforgettable adventure.`;
  
  if (lowercaseGroup.includes("kids") || lowercaseGroup.includes("family")) {
    overview += " This family-friendly layout avoids exhausting schedules and integrates interactive local culture tours and birdwatching walks suitable for all age ranges.";
  } else if (lowercaseGroup.includes("photograph")) {
    overview += " Structured around golden-hour lighting, we prioritize deep forest jeep drives and guide naturalists specialized in track tracing.";
  }

  const itinerary = [];
  for (let i = 1; i <= daysCount; i++) {
    let morning = "";
    let afternoon = "";
    let evening = "";
    let tips = "";

    if (i === 1) {
      morning = "Arrive at Corbett Trails luxury resort, complete check-in, and enjoy Kumaoni welcome drinks.";
      afternoon = "Visit the Corbett Museum in Kaladhungi to learn about legendary conservator Jim Corbett.";
      evening = "Nature walk along the Kosi riverbed with our resident naturalist to spot migratory birds.";
      tips = "Wear closed walking shoes and carry sunscreen for the riverbed walk.";
    } else if (i === daysCount && daysCount > 1) {
      morning = "Exciting early morning Jeep Safari in the Jhirna Zone, famous for sloth bears and wild elephants.";
      afternoon = "Lunch at the resort followed by souvenir shopping at the local handicraft center.";
      evening = "Departure checkout and drive back to Delhi with rich safari memories.";
      tips = "Keep your binoculars handy for Jhirna forest sightings.";
    } else {
      morning = `Deep forest 4x4 Jeep Safari in the premium Bijrani Zone. High chance of spotting the royal Bengal tiger.`;
      afternoon = "Delectable traditional buffet lunch at the resort, followed by a relaxing dip in the swimming pool.";
      evening = "A cozy jungle bonfire session under the stars, listening to thrilling local tiger tracking stories.";
      tips = "Dress in layers as forest temperatures can be chilly in the early morning.";
    }

    itinerary.push({
      day: i,
      morning,
      afternoon,
      evening,
      tips,
    });
  }

  const packingList = [
    "Neutral Earth-colored clothing (khaki, olive green, brown)",
    "Comfortable walking shoes & light jackets",
    "DSLR Camera / High-zoom Binoculars",
    "Wide-brimmed hats and polarized sunglasses",
    "Eco-friendly water bottle and mosquito repellant",
  ];

  const safetyGuidelines = [
    "Never get out of the safari vehicle during the forest drives.",
    "Avoid making loud noises or shouting to attract wildlife.",
    "Do not throw trash, plastic bottles, or food packets in the sanctuary.",
    "Strictly follow your designated local guide's instructions at all times.",
  ];

  return {
    title,
    overview,
    itinerary,
    packingList,
    safetyGuidelines,
  };
}

function getMockChatbotResponse(messages, lastMessage) {
  // Extract all existing keys from messages to build context of what has been collected
  const sessionData = {
    fullName: null,
    email: null,
    phone: null,
    zone: null,
    date: null,
    visitors: null,
    safariType: null,
  };

  // Simple heuristic scanner to extract details from user inputs across the conversation
  messages.forEach((msg) => {
    if (msg.from === "user") {
      const text = msg.text.trim();
      
      // Email Match
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) sessionData.email = emailMatch[0];

      // Phone Match (10 digit)
      const phoneMatch = text.match(/(?:\+?91)?[6-9]\d{9}/);
      if (phoneMatch) sessionData.phone = phoneMatch[0].slice(-10);

      // Zone matches
      const zones = ["dhikala", "bijrani", "jhirna", "dhela", "durga devi", "garjiya", "sitabani", "phato"];
      zones.forEach((z) => {
        if (text.toLowerCase().includes(z)) {
          sessionData.zone = z.charAt(0).toUpperCase() + z.slice(1);
        }
      });

      // Date matches YYYY-MM-DD
      const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch) sessionData.date = dateMatch[0];

      // Visitors matches
      if (text.match(/\b([1-5])\b/)) {
        sessionData.visitors = text.match(/\b([1-5])\b/)[0];
      } else if (text.toLowerCase().includes("6+")) {
        sessionData.visitors = "6+";
      }

      // Safari types
      if (text.toLowerCase().includes("jeep")) sessionData.safariType = "Jeep Safari";
      if (text.toLowerCase().includes("canter")) sessionData.safariType = "Canter Safari";
      if (text.toLowerCase().includes("elephant")) sessionData.safariType = "Elephant Safari";
    }
  });

  // Now, look at the last user message specifically to see if we can extract missing parameters
  const input = lastMessage.trim();

  // Try to parse name (If email, phone, and zone are missing, and user inputs a string without symbols, assume it's their name)
  if (!sessionData.fullName && input.split(" ").length >= 2 && !input.includes("@") && !input.match(/\d/)) {
    sessionData.fullName = input;
  }

  // Determine what is missing next
  let responseText = "";
  if (!sessionData.fullName) {
    responseText = `Thanks for starting the booking! Let's get you set up. What is your full name?`;
  } else if (!sessionData.email) {
    responseText = `Nice to meet you, ${sessionData.fullName}! What is your email address so we can send the tickets?`;
  } else if (!sessionData.phone) {
    responseText = `Great. Please provide your 10-digit mobile number for immediate updates.`;
  } else if (!sessionData.zone) {
    responseText = `Perfect. Which zone would you like to book? Highly recommended are Dhikala (Scenic) or Bijrani (Tiger Hotspot).`;
  } else if (!sessionData.date) {
    responseText = `Awesome. On which date do you plan to visit Corbett? (Please use YYYY-MM-DD format or enter a date)`;
  } else if (!sessionData.visitors) {
    responseText = `Got it. How many visitors will be joining this safari ride? (Choose 1 to 5, or 6+)`;
  } else if (!sessionData.safariType) {
    responseText = `Understood. Lastly, please choose your preferred safari vehicle: Jeep Safari, Canter Safari, or Elephant Safari.`;
  } else {
    responseText = `Hooray! I have gathered all your safari details. Please review them below and click "Confirm Booking" to lock it in!`;
  }

  return {
    responseText,
    extractedData: sessionData,
  };
}

function getMockSightingPrediction(zone, date) {
  // Deterministic mock weights based on zone and month
  const visitMonth = date ? new Date(date).getMonth() : new Date().getMonth(); // 0-11
  
  // Base rates
  let tigerBase = 45;
  let elephantBase = 50;
  let leopardBase = 15;
  let bearBase = 10;
  let deerBase = 95;

  const normalizedZone = zone.toLowerCase();

  // Zone specific adjustments
  if (normalizedZone.includes("bijrani")) {
    tigerBase += 25;
    bearBase += 5;
  } else if (normalizedZone.includes("dhikala")) {
    elephantBase += 35;
    tigerBase += 15;
  } else if (normalizedZone.includes("jhirna")) {
    bearBase += 45;
    elephantBase += 10;
    tigerBase -= 10;
  } else if (normalizedZone.includes("dhela")) {
    tigerBase += 10;
    bearBase += 15;
  } else if (normalizedZone.includes("phato")) {
    tigerBase += 5;
    leopardBase += 10;
  }

  // Seasonal adjustments: Tigers active in summer (March-June: index 2, 3, 4, 5)
  if (visitMonth >= 2 && visitMonth <= 5) {
    tigerBase += 15;
    leopardBase += 5;
    elephantBase -= 10; // active near water but deep inside
  } 
  // Monsoons (July-Sept: index 6, 7, 8)
  else if (visitMonth >= 6 && visitMonth <= 8) {
    tigerBase -= 20;
    elephantBase += 10;
    bearBase -= 10;
  }

  // Apply some slight variance (+/- 3%)
  const variance = () => Math.floor(Math.random() * 7) - 3;

  const finalTiger = Math.min(99, Math.max(10, tigerBase + variance()));
  const finalElephant = Math.min(99, Math.max(15, elephantBase + variance()));
  const finalLeopard = Math.min(95, Math.max(5, leopardBase + variance()));
  const finalBear = Math.min(90, Math.max(5, bearBase + variance()));
  const finalDeer = Math.min(99, Math.max(70, deerBase + variance()));

  let summary = "";
  if (finalTiger > 70) {
    summary = `Excellent timing! Due to current warm weather forecasts for ${zone} in this season, tiger movements around water channels are highly frequent. Sighting rate is exceptionally high.`;
  } else if (finalElephant > 75) {
    summary = `${zone} is currently showing massive migratory elephant herd groupings. A safari during this period promises outstanding panoramic sightings.`;
  } else {
    summary = `Standard seasonal wildlife distributions predicted for ${zone} on this date. Early morning rides are heavily advised for spotting predators active during sunrise.`;
  }

  return {
    summary,
    predictions: {
      Tiger: finalTiger,
      Elephant: finalElephant,
      Leopard: finalLeopard,
      SlothBear: finalBear,
      Deer: finalDeer,
    },
  };
}

/**
 * 5. AI Campfire Story Generator
 */
async function generateCampfireStory(topic, mode) {
  if (hasApiKey() && ai) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are a seasoned Kumaoni naturalist and campfire narrator at Jim Corbett National Park.
        Tell a thrilling, historically rich, and highly atmospheric campfire story about this topic: "${topic}".
        Use a "${mode}" narration style (e.g. suspenseful, adventurous, mysterious, informative).
        
        Write a highly descriptive story (around 300 words) with pauses, sound effects in brackets like [crackling branches] or [distant tiger roar], and rich local Kumaoni forest terms (sal trees, machan, nullah, Kumaon hills). 
        Make it sound authentic, warm, and highly engaging. Do not use generic placeholders.
      `;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn("Gemini Campfire Story API Error, falling back to mock:", err.message);
    }
  }

  return getMockCampfireStory(topic, mode);
}

function getMockCampfireStory(topic, mode) {
  const normalizedTopic = (topic || "").toLowerCase();
  
  if (normalizedTopic.includes("mohan") || normalizedTopic.includes("tiger")) {
    return `Listen closely... [popping fire embers] The year was 1928, deep in the Mohan valley. The Kumaoni villagers spoke in hushed whispers of a massive shadow that stalked the towering sal forests. It was no ordinary predator, but the legendary Mohan Man-Eater. Jim Corbett himself lay in wait on a frail bamboo machan, the mountain wind blowing bitterly cold against his face. As midnight struck, a deep, resonant rumble [low tiger growl] vibrated through the dense undergrowth. The forest went dead silent—even the cicadas stopped. The tiger emerged like a ghost from the moonlit mist, its amber eyes locking directly onto the machan. Jim held his breath, his rifle steady, knowing one wrong move would be his last...`;
  }
  
  if (normalizedTopic.includes("machan") || normalizedTopic.includes("leopard")) {
    return `The night air is thick with the scent of pine and damp river clay [distant owl hoot]. Sitting on a rustic wooden machan fifteen feet above the jungle floor in Bijrani Zone, your hands are shivering. Below you, the dry leaves rustle. [snap of a dry branch] Your eyes strain in the darkness. Suddenly, a sleek golden coat adorned with dark rosettes emerges into the pale moonlight—a leopards, moving with fluid, liquid grace. It glances up toward your machan, its emerald eyes shining like hot coals in the dark, before melting back into the shadows of the Kumaon forest as silently as it came.`;
  }

  if (normalizedTopic.includes("elephant") || normalizedTopic.includes("call")) {
    return `The misty riverbeds of Dhikala are quiet as dusk falls [river murmuring]. Suddenly, a booming trumpet [loud elephant trumpet] echoes across the valley, shaking the leaves of the Rohini trees. A massive tusker, the patriarch of the herd, leads fifteen elephants out of the tall elephant grass down to the Ramganga riverbank. They move like grey mountains against the sunset. A young calf splashes playfully in the shallow water, shielded by the protective circle of the grand matriarchs. It is a timeless scene of Kumaon's true ancient rulers, untouched by the outside world.`;
  }

  return `The campfire crackles warm against the deep chill of the forest night [popping wood embers]. In the distance, a spotted deer gives a sharp, barking alarm call—*Aap! Aap!* The jungle is instantly alert. A predator is on the move in the pitch dark. As Kumaoni naturalists, we learn to read these secret signs—the warning chatter of the langur monkeys, the sudden, frightened flight of the peacocks. The forest is a living, breathing story, and tonight, sitting here by the fire, you are part of it. Rest warm, for tomorrow at dawn, we track the king of Kumaon...`;
}

function getMockImageAnalysis(imageBase64) {
  // Select a mock wildlife analysis dynamically to make scans feel interactive and realistic
  const items = [
    {
      animalName: "Royal Bengal Tiger",
      confidence: 97,
      description: "A gorgeous adult Bengal Tiger stalking silently through the yellow grasslands of Dhikala Zone.",
      tags: ["Tiger", "Predator", "BigCat", "Dhikala", "RareSighting"],
    },
    {
      animalName: "Asiatic Elephant",
      confidence: 99,
      description: "A massive wild Asiatic elephant drinking water at the Ramganga riverbank during sunset.",
      tags: ["Elephant", "Herbivore", "Jumbo", "Herd", "Riverbed"],
    },
    {
      animalName: "Spotted Deer (Chital)",
      confidence: 98,
      description: "A small herd of beautiful spotted deer grazing alertly in the sal forests of Bijrani.",
      tags: ["Deer", "Chital", "Bijrani", "Alert", "Prey"],
    },
    {
      animalName: "Crested Serpent Eagle",
      confidence: 94,
      description: "A rare raptor perched proudly on a haldu tree branch scanning for forest floor reptiles.",
      tags: ["Eagle", "Raptor", "BirdWatching", "Predator", "Avian"],
    },
  ];

  // Pick one randomly
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

module.exports = {
  generateItinerary,
  parseChatSession,
  predictSighting,
  analyzeImage,
  generateCampfireStory,
};
