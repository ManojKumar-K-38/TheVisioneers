import { db } from "./db";
import * as schema from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  try {
    // Seed default farmer
    const farmers = await db.insert(schema.farmers).values([
      {
        id: "default-farmer",
        name: "Demo Farmer",
        location: "Punjab, India",
        language: "en",
        phoneNumber: "+91-9876543210",
        farmSize: 5.5,
      },
    ]).returning();
    console.log(`✓ Seeded ${farmers.length} farmers`);

    // Seed crops
    const crops = await db.insert(schema.crops).values([
      {
        name: "Wheat",
        season: "Rabi (Winter)",
        soilType: "loamy",
        waterRequirement: "Medium",
        expectedYield: 2500,
        profitEstimate: 45000,
        growthDuration: 120,
        description: "High-yielding wheat variety suitable for winter season",
      },
      {
        name: "Rice",
        season: "Kharif (Monsoon)",
        soilType: "clay",
        waterRequirement: "High",
        expectedYield: 3000,
        profitEstimate: 55000,
        growthDuration: 130,
        description: "Water-intensive crop ideal for monsoon cultivation",
      },
      {
        name: "Cotton",
        season: "Kharif (Monsoon)",
        soilType: "sandy",
        waterRequirement: "Medium",
        expectedYield: 1500,
        profitEstimate: 65000,
        growthDuration: 150,
        description: "Cash crop with good market demand",
      },
      {
        name: "Sugarcane",
        season: "Year-round",
        soilType: "loamy",
        waterRequirement: "High",
        expectedYield: 70000,
        profitEstimate: 120000,
        growthDuration: 365,
        description: "Long-duration crop requiring consistent irrigation",
      },
      {
        name: "Maize",
        season: "Kharif (Monsoon)",
        soilType: "loamy",
        waterRequirement: "Medium",
        expectedYield: 2800,
        profitEstimate: 42000,
        growthDuration: 90,
        description: "Versatile crop suitable for various soil types",
      },
      {
        name: "Mustard",
        season: "Rabi (Winter)",
        soilType: "sandy",
        waterRequirement: "Low",
        expectedYield: 1200,
        profitEstimate: 35000,
        growthDuration: 110,
        description: "Oil seed crop requiring minimal water",
      },
    ]).returning();
    console.log(`✓ Seeded ${crops.length} crops`);

    // Seed weather data
    const weather = await db.insert(schema.weatherData).values([
      {
        location: "Punjab, India",
        temperature: 28,
        humidity: 65,
        rainfall: 0,
        windSpeed: 12,
        condition: "Partly Cloudy",
        forecast: JSON.stringify([
          { day: "Tomorrow", temp: 29, condition: "Sunny" },
          { day: "Day 2", temp: 30, condition: "Sunny" },
          { day: "Day 3", temp: 27, condition: "Rainy" },
          { day: "Day 4", temp: 26, condition: "Cloudy" },
          { day: "Day 5", temp: 28, condition: "Partly Cloudy" },
        ]),
        advisory: "Good conditions for irrigation",
      },
    ]).returning();
    console.log(`✓ Seeded ${weather.length} weather records`);

    // Seed resources
    const resources = await db.insert(schema.resources).values([
      {
        farmerId: "default-farmer",
        resourceType: "water",
        used: 850,
        optimal: 1000,
        unit: "liters",
        month: new Date().toLocaleString("default", { month: "long" }),
        year: new Date().getFullYear(),
      },
      {
        farmerId: "default-farmer",
        resourceType: "fertilizer",
        used: 45,
        optimal: 50,
        unit: "kg",
        month: new Date().toLocaleString("default", { month: "long" }),
        year: new Date().getFullYear(),
      },
      {
        farmerId: "default-farmer",
        resourceType: "pesticide",
        used: 3.5,
        optimal: 5,
        unit: "liters",
        month: new Date().toLocaleString("default", { month: "long" }),
        year: new Date().getFullYear(),
      },
    ]).returning();
    console.log(`✓ Seeded ${resources.length} resource records`);

    // Seed advisories
    const advisories = await db.insert(schema.advisories).values([
      {
        farmerId: "default-farmer",
        title: "Optimal Time for Wheat Sowing",
        content: "Based on current weather patterns, the next 2 weeks are ideal for wheat sowing. Soil temperature is optimal at 18-22°C. Ensure proper land preparation and seed treatment before sowing.",
        category: "crop-guidance",
        severity: "info",
        source: "Agricultural Department",
      },
      {
        title: "Pest Alert: Brown Plant Hopper in Rice",
        content: "Increased brown plant hopper activity detected in nearby regions. Monitor your rice fields closely. Use recommended pesticides if infestation is noticed. Maintain proper water levels.",
        category: "pest-alert",
        severity: "warning",
        source: "Pest Surveillance Network",
      },
      {
        title: "Heavy Rainfall Expected",
        content: "Meteorological department predicts heavy rainfall in the next 48 hours. Ensure proper drainage in fields. Delay fertilizer application until after rain. Protect harvested crops.",
        category: "weather",
        severity: "critical",
        source: "Weather Department",
      },
    ]).returning();
    console.log(`✓ Seeded ${advisories.length} advisories`);

    // Seed pests and diseases
    const pestsAndDiseases = await db.insert(schema.pestsDiseases).values([
      {
        name: "Stem Borer",
        type: "pest",
        cropAffected: "Rice",
        symptoms: JSON.stringify([
          "Dead hearts in vegetative stage",
          "White ears in reproductive stage",
          "Tunnels in stem filled with frass",
          "Wilting of central shoot",
        ]),
        severity: "high",
        treatment: "Apply Cartap hydrochloride or Chlorantraniliprole as per recommendation. Use pheromone traps for monitoring. Maintain proper water level in fields.",
        prevention: "Use resistant varieties. Practice crop rotation. Remove stubbles after harvest. Avoid excessive nitrogen fertilizer.",
      },
      {
        name: "Leaf Rust",
        type: "disease",
        cropAffected: "Wheat",
        symptoms: JSON.stringify([
          "Orange-brown pustules on leaves",
          "Premature leaf drying",
          "Reduced grain filling",
          "Scattered distribution on lower leaves initially",
        ]),
        severity: "medium",
        treatment: "Spray Propiconazole or Tebuconazole at recommended doses. Apply at early infection stage. Repeat after 15 days if needed.",
        prevention: "Use resistant wheat varieties. Ensure balanced fertilization. Avoid late sowing. Remove volunteer wheat plants.",
      },
      {
        name: "Aphids",
        type: "pest",
        cropAffected: "Mustard",
        symptoms: JSON.stringify([
          "Yellowing of leaves",
          "Stunted plant growth",
          "Honeydew secretion on plants",
          "Sooty mold on leaves",
        ]),
        severity: "high",
        treatment: "Spray Dimethoate or Imidacloprid. Use neem-based organic pesticides for eco-friendly control. Apply early morning or evening.",
        prevention: "Intercrop with companion plants. Use yellow sticky traps. Encourage natural predators like ladybugs. Avoid water stress.",
      },
      {
        name: "Late Blight",
        type: "disease",
        cropAffected: "Potato",
        symptoms: JSON.stringify([
          "Water-soaked lesions on leaves",
          "White fungal growth on leaf undersides",
          "Rapid browning and death of foliage",
          "Brown rot in tubers",
        ]),
        severity: "high",
        treatment: "Apply Mancozeb or Metalaxyl + Mancozeb combination. Spray at 7-10 day intervals during favorable conditions. Destroy infected plants.",
        prevention: "Use certified disease-free seed. Plant resistant varieties. Ensure proper spacing for air circulation. Avoid overhead irrigation.",
      },
      {
        name: "White Grub",
        type: "pest",
        cropAffected: "Sugarcane",
        symptoms: JSON.stringify([
          "Yellowing and wilting of shoots",
          "Poor tillering",
          "Damaged roots with grubs present",
          "Patches of dead plants in field",
        ]),
        severity: "medium",
        treatment: "Apply Chlorpyrifos in irrigation water. Use entomopathogenic nematodes for biological control. Treat at planting time.",
        prevention: "Deep summer plowing to expose grubs. Use sett treatment before planting. Maintain field sanitation. Rotate with non-host crops.",
      },
      {
        name: "Powdery Mildew",
        type: "disease",
        cropAffected: "Cotton",
        symptoms: JSON.stringify([
          "White powdery patches on leaves",
          "Curling and distortion of leaves",
          "Reduced photosynthesis",
          "Premature leaf drop",
        ]),
        severity: "low",
        treatment: "Spray Sulphur or Triadimefon. Use wettable sulphur for organic treatment. Apply at early infection stage.",
        prevention: "Maintain proper plant spacing. Avoid excessive nitrogen fertilization. Use resistant varieties. Practice crop rotation.",
      },
    ]).returning();
    console.log(`✓ Seeded ${pestsAndDiseases.length} pests and diseases`);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed();
