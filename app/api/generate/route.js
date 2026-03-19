import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TONE_INSTRUCTIONS = {
  professional: "Polished and confident without being stiff. Sound like a knowledgeable owner, not a corporate PR team.",
  friendly: "Warm and genuine — like a real person talking, not a brand account performing friendliness.",
  apologetic: "Lead with empathy. Validate their experience fully before anything else. Be humble and specific.",
  enthusiastic: "Genuinely upbeat and appreciative. Be specific about what excites you — no hollow cheerfulness.",
};

const OPENING_STYLES = [
  "Start with the reviewer's name followed by a comma, then a unique and specific reaction.",
  "Open with a direct reference to the most specific detail in their review — show you actually read it.",
  "Lead with a short, genuine emotional reaction (one sentence), then get specific.",
  "Open by naming the exact product, service, or situation they mentioned — no preamble.",
  "Start with a bold acknowledgment of their main point, positive or negative.",
  "Begin mid-thought — skip the greeting and dive straight into addressing what they said.",
];

const CLOSING_STYLES = [
  "End with a specific, relevant invitation tied to something in their review.",
  "Close by addressing the very next step — a fix, a follow-up visit, or a direct ask to contact you.",
  "End with one warm, personal sentence that makes them feel seen, not processed.",
  "Close with something forward-looking that references a specific detail from their visit.",
  "End by giving them a concrete action — a name to ask for, a number to call, or something to try next time.",
];

// Comprehensive business type context — each entry gives the AI
// industry-specific vocabulary, common pain points, and relevant response angles
export const BUSINESS_TYPE_CONTEXT = {
  // ── FOOD & DRINK ──────────────────────────────────────────────
  "restaurant": "Full-service restaurant. Relevant topics: dishes, flavors, portion size, service speed, server attentiveness, ambiance, noise level, reservations, wait times, dietary accommodations, specials, and the overall dining experience.",
  "cafe": "Café or coffee shop. Relevant topics: espresso quality, coffee sourcing, brewing methods, pastries, food items, WiFi and seating, barista skill, speed of service, loyalty programs, and atmosphere.",
  "bar": "Bar or pub. Relevant topics: drink selection, cocktail quality, draft beer, sports viewing, music/vibe, happy hour, service speed, safety, food menu, and overall nightlife experience.",
  "bakery": "Bakery or pastry shop. Relevant topics: freshness, flavor, custom orders, cakes, bread, croissants, seasonal items, packaging, order accuracy, and pickup/delivery experience.",
  "pizza": "Pizza restaurant. Relevant topics: crust style, sauce, toppings, cheese pull, delivery speed, order accuracy, dine-in experience, and value for money.",
  "fast_food": "Fast food or quick service restaurant. Relevant topics: order speed, accuracy, value, cleanliness, drive-through efficiency, staff friendliness, and food quality.",
  "food_truck": "Food truck or mobile vendor. Relevant topics: menu creativity, portion size, pricing, wait time, location convenience, social media updates, and the overall street food experience.",
  "catering": "Catering company. Relevant topics: food quality at scale, setup/breakdown, punctuality, menu customization, dietary accommodations, presentation, staff professionalism, and event coordination.",
  "winery_brewery": "Winery, brewery, or distillery. Relevant topics: tasting notes, flight selections, tour experience, ambiance, private events, merchandise, staff knowledge, and the production story.",
  "deli": "Deli or sandwich shop. Relevant topics: meat and cheese quality, bread freshness, sandwich build, portion size, speed of service, catering options, and daily specials.",
  "ice_cream": "Ice cream, frozen yogurt, or dessert shop. Relevant topics: flavor variety, freshness, portion size, toppings, seasonal flavors, service friendliness, and overall treat experience.",
  "juice_bar": "Juice bar or smoothie shop. Relevant topics: ingredient quality, freshness, customization, nutritional options, wait time, staff knowledge, and cleanliness.",

  // ── AUTOMOTIVE ────────────────────────────────────────────────
  "car_dealer_new": "New car dealership. Relevant topics: sales pressure (or lack thereof), test drive experience, financing process, trade-in value, vehicle selection, delivery experience, and after-sale follow-up.",
  "car_dealer_used": "Used car dealership. Relevant topics: vehicle condition vs. listing, transparency about history, pricing negotiation, financing options, warranty offerings, and overall trust.",
  "auto_repair": "Auto repair shop or mechanic. Relevant topics: diagnostic accuracy, repair quality, pricing transparency, turnaround time, communication, warranty on work, and whether the issue was actually fixed.",
  "tire_shop": "Tire shop. Relevant topics: tire selection, pricing, installation speed, alignment, balancing, honesty about what's needed, and overall efficiency.",
  "body_shop": "Auto body or collision repair shop. Relevant topics: paint match quality, panel alignment, repair timeline, insurance coordination, communication during repair, and final result.",
  "car_wash": "Car wash or auto detailing service. Relevant topics: interior/exterior cleanliness, attention to detail, missed spots, product quality, wait time, and value.",
  "oil_change": "Oil change and quick lube service. Relevant topics: speed, upsell pressure, price transparency, service accuracy, and vehicle condition when returned.",
  "trailer_dealer": "Trailer dealership or trailer sales/rental. Relevant topics: trailer selection (utility, flatbed, enclosed, livestock, travel), condition, pricing, financing, hitch compatibility advice, rental process, and after-sale service.",
  "rv_dealer": "RV or motorhome dealership. Relevant topics: floor plan walkthrough, feature demonstration, financing, trade-in, delivery orientation, service department, and the overall purchase experience.",
  "motorcycle_dealer": "Motorcycle dealership. Relevant topics: bike selection, sales experience, test ride, financing, gear and accessories, service department, and after-sale support.",
  "auto_parts": "Auto parts store. Relevant topics: parts availability, staff knowledge, correct fitment, pricing, return policy, and speed of service.",
  "towing": "Towing or roadside assistance. Relevant topics: response time, communication during wait, driver professionalism, vehicle handling care, pricing transparency, and overall reliability in a stressful moment.",

  // ── HEALTH & MEDICAL ──────────────────────────────────────────
  "dentist": "Dental practice. Relevant topics: pain management, bedside manner, wait time, explanation of procedures, billing/insurance handling, cleanliness, X-ray quality, and follow-up care.",
  "doctor": "Medical practice or primary care physician. Relevant topics: wait time, thoroughness of exam, listening skills, diagnosis clarity, referral process, follow-up, and office staff.",
  "chiropractor": "Chiropractic clinic. Relevant topics: adjustment technique, pain relief results, number of visits recommended, explanation of treatment plan, and overall comfort during care.",
  "optometrist": "Eye care clinic or optometrist. Relevant topics: exam thoroughness, prescription accuracy, frame selection, contact lens fitting, wait time, and insurance handling.",
  "physical_therapy": "Physical therapy clinic. Relevant topics: individualized treatment plan, therapist attentiveness, exercise instruction, pain progress, scheduling flexibility, and overall recovery support.",
  "urgent_care": "Urgent care center. Relevant topics: wait time, triage speed, diagnosis accuracy, provider bedside manner, prescription process, and overall efficiency in a time-sensitive situation.",
  "pharmacy": "Pharmacy. Relevant topics: prescription fill speed, accuracy, pharmacist consultation, pricing/insurance handling, and staff availability.",
  "mental_health": "Mental health practice or therapy office. Relevant topics: therapist empathy, appointment availability, confidentiality, scheduling ease, insurance processing, and overall feeling of being heard.",
  "dermatologist": "Dermatology practice. Relevant topics: skin evaluation thoroughness, treatment recommendations, cosmetic vs. medical service, wait times, procedure comfort, and follow-up.",
  "med_spa": "Medical spa or aesthetics clinic. Relevant topics: procedure results, provider skill, pain management, consultation thoroughness, pricing, and the overall luxury-meets-clinical experience.",

  // ── BEAUTY & PERSONAL CARE ────────────────────────────────────
  "hair_salon": "Hair salon or hair studio. Relevant topics: cut precision, color accuracy, stylist listening skills, product recommendations, appointment availability, pricing, and the overall chair experience.",
  "barbershop": "Barbershop. Relevant topics: fade precision, beard work, straight razor shave, wait time, atmosphere, conversation, and consistency between visits.",
  "nail_salon": "Nail salon. Relevant topics: polish application, gel/acrylic quality, sanitation, nail art, technician attentiveness, pricing, and how long the results lasted.",
  "spa_massage": "Spa or massage therapy. Relevant topics: therapist pressure/technique, ambiance, cleanliness, booking experience, add-on services, and the overall relaxation experience.",
  "tattoo_studio": "Tattoo studio or piercing shop. Relevant topics: artist portfolio match to final result, linework, shading, color, aftercare instructions, studio sanitation, and consultation.",
  "lash_brow": "Lash or brow studio. Relevant topics: shape, fullness, retention/longevity, application comfort, consultation, and overall enhancement of natural features.",

  // ── HOME SERVICES ─────────────────────────────────────────────
  "plumber": "Plumbing company. Relevant topics: diagnosis accuracy, repair quality, pricing transparency, speed of response (especially emergencies), cleanliness after work, and warranty.",
  "electrician": "Electrical contractor. Relevant topics: code compliance, diagnostic skill, safety, pricing, communication, permit handling, and how the work area was left.",
  "hvac": "HVAC company. Relevant topics: system diagnosis, repair vs. replace recommendation honesty, installation quality, response time (especially in extreme weather), pricing, and maintenance plans.",
  "roofer": "Roofing contractor. Relevant topics: inspection thoroughness, material quality, crew professionalism, cleanup, project timeline, insurance claim assistance, and warranty.",
  "landscaper": "Landscaping or lawn care company. Relevant topics: design creativity, plant selection, mowing quality, irrigation, seasonal cleanup, crew reliability, and overall curb appeal results.",
  "house_cleaner": "House cleaning service. Relevant topics: thoroughness, missed areas, product safety, punctuality, communication, and consistency between visits.",
  "mover": "Moving company. Relevant topics: care of belongings, packing quality, crew professionalism, timing, pricing accuracy vs. estimate, and handling of fragile items.",
  "pest_control": "Pest control company. Relevant topics: effectiveness, treatment explanation, product safety, follow-up visits, pricing, and whether the problem was resolved.",
  "contractor": "General contractor or remodeling company. Relevant topics: project scope clarity, timeline adherence, subcontractor management, budget transparency, quality of finish work, and communication throughout.",
  "handyman": "Handyman service. Relevant topics: task variety, skill level, reliability, pricing fairness, cleanup, and overall convenience.",
  "pool_service": "Pool service and maintenance. Relevant topics: water chemistry, equipment checks, reliability of schedule, communication about issues found, and overall pool condition.",
  "painter": "Painting contractor. Relevant topics: prep work quality, edge work, coverage, product used, crew tidiness, and timeline.",
  "flooring": "Flooring installation company. Relevant topics: material selection help, subfloor prep, installation precision, transition strips, cleanup, and durability of result.",

  // ── RETAIL ────────────────────────────────────────────────────
  "clothing_store": "Clothing or apparel store. Relevant topics: selection variety, sizing accuracy, staff styling help, fitting room experience, pricing, return policy, and in-store atmosphere.",
  "gift_shop": "Gift shop or boutique. Relevant topics: product uniqueness, gift wrapping, staff helpfulness in finding the right gift, pricing, and local/artisan selection.",
  "jewelry_store": "Jewelry store. Relevant topics: craftsmanship, stone quality, customization, repair services, sizing, pricing transparency, and the purchase experience for special occasions.",
  "hardware_store": "Hardware or home improvement store. Relevant topics: product availability, staff expertise, advice quality, pricing, special orders, and project-based guidance.",
  "pet_store": "Pet store or pet supply shop. Relevant topics: animal health and conditions (if live animals), product selection, staff knowledge, pricing, and grooming services.",
  "bookstore": "Bookstore. Relevant topics: selection depth, staff recommendations, events/readings, community feel, special orders, and overall browsing experience.",
  "furniture_store": "Furniture store. Relevant topics: quality, selection, delivery experience, assembly service, pricing, showroom layout, and sales pressure (or lack thereof).",
  "sporting_goods": "Sporting goods or outdoor retailer. Relevant topics: gear expertise, brand selection, fitting assistance (shoes, packs, bikes), rental availability, and trail/activity recommendations.",
  "electronics": "Electronics store. Relevant topics: product knowledge, honest recommendations, pricing competitiveness, return policy, setup assistance, and trade-in programs.",
  "antique_shop": "Antique or vintage shop. Relevant topics: inventory quality, pricing fairness, provenance knowledge, negotiation willingness, and the discovery experience.",

  // ── PROFESSIONAL SERVICES ─────────────────────────────────────
  "law_firm": "Law firm or attorney's office. Relevant topics: case communication, responsiveness, outcome, fee transparency, explanation of legal strategy, and overall trustworthiness.",
  "accountant": "Accounting firm or CPA. Relevant topics: tax accuracy, proactive advice, audit support, pricing, responsiveness during tax season, and year-round availability.",
  "real_estate": "Real estate agent or brokerage. Relevant topics: market knowledge, negotiation skill, communication frequency, listing presentation, offer strategy, and the overall buying or selling experience.",
  "insurance": "Insurance agency. Relevant topics: policy explanation clarity, coverage recommendations, claims handling, pricing, responsiveness, and long-term relationship.",
  "financial_advisor": "Financial advisory firm. Relevant topics: investment strategy communication, fee transparency, retirement planning, responsiveness, and overall trust in handling someone's financial future.",
  "marketing_agency": "Marketing or advertising agency. Relevant topics: strategy quality, creative output, communication, ROI reporting, responsiveness to feedback, and campaign results.",
  "it_services": "IT services or managed service provider. Relevant topics: response time, fix quality, communication, proactive monitoring, pricing, and ability to explain technical issues in plain language.",

  // ── HOSPITALITY & TRAVEL ──────────────────────────────────────
  "hotel": "Hotel or motel. Relevant topics: room cleanliness, bed comfort, noise level, front desk service, amenities, breakfast quality, check-in/out speed, and location convenience.",
  "bnb": "Bed & breakfast or boutique inn. Relevant topics: host warmth, room charm, breakfast quality, local recommendations, cleanliness, and the personal touch of a small property.",
  "vacation_rental": "Vacation rental (Airbnb/VRBO style). Relevant topics: listing accuracy, cleanliness, amenities provided, host responsiveness, check-in process, and neighborhood.",
  "event_venue": "Event or wedding venue. Relevant topics: space beauty, catering quality, coordinator responsiveness, setup/teardown, capacity management, acoustics, and the overall day-of experience.",

  // ── EDUCATION & CHILDCARE ─────────────────────────────────────
  "daycare": "Daycare or preschool. Relevant topics: child safety and supervision, curriculum quality, staff warmth, communication with parents, facility cleanliness, and enrichment activities.",
  "tutoring": "Tutoring center or private tutor. Relevant topics: subject expertise, student progress, communication with parents, scheduling flexibility, and teaching style match.",
  "driving_school": "Driving school. Relevant topics: instructor patience, lesson structure, vehicle condition, pass rate, scheduling, and how well students felt prepared for the test.",
  "music_school": "Music, dance, or arts school. Relevant topics: instructor skill and passion, student progress, recital/performance opportunities, scheduling, and overall creative environment.",
  "martial_arts": "Martial arts school or gym. Relevant topics: instructor patience with beginners, belt progression, class structure, facility, discipline, community feel, and safety.",

  // ── ENTERTAINMENT & FITNESS ───────────────────────────────────
  "gym": "Gym or fitness center. Relevant topics: equipment variety, cleanliness, crowding, class quality, personal training, locker rooms, staff helpfulness, and membership value.",
  "yoga_studio": "Yoga or Pilates studio. Relevant topics: instructor expertise, class variety, studio warmth and cleanliness, scheduling, modifications for different levels, and community.",
  "golf_course": "Golf course or country club. Relevant topics: course conditions, pace of play, pro shop, cart path quality, food and beverage, staff, and overall round experience.",
  "bowling": "Bowling alley or entertainment center. Relevant topics: lane conditions, shoe rental, scoring system, food and drinks, atmosphere, party/group experience, and staff friendliness.",
  "escape_room": "Escape room venue. Relevant topics: puzzle quality, story immersion, hint system, game master engagement, room design, difficulty balance, and overall fun factor.",
  "entertainment_venue": "Entertainment or recreation venue. Relevant topics: activity quality, staff engagement, safety, cleanliness, pricing, and overall experience for the group or age range.",

  // ── PETS ──────────────────────────────────────────────────────
  "veterinarian": "Veterinary clinic. Relevant topics: doctor thoroughness, bedside manner with pets and owners, diagnosis explanation, pricing transparency, emergency availability, and follow-up care.",
  "pet_grooming": "Pet grooming salon. Relevant topics: groom quality vs. the requested style, handling of anxious pets, cleanliness, timing, and communication if anything unexpected came up.",
  "pet_boarding": "Pet boarding or doggy daycare. Relevant topics: staff attentiveness, play group management, feeding accuracy, updates to owners, cleanliness, and overall peace of mind.",
  "dog_training": "Dog training or behavior specialist. Relevant topics: training method effectiveness, owner instruction, progress timeline, handling of difficult behaviors, and communication.",

  // ── INDUSTRIAL & COMMERCIAL ───────────────────────────────────
  "self_storage": "Self storage facility. Relevant topics: unit size availability, pricing, cleanliness, security (cameras, gate access, locks), climate control, access hours, staff helpfulness, and move-in/move-out experience.",
  "moving_storage": "Moving and storage company. Relevant topics: care of belongings in storage, pickup/delivery reliability, climate control, pricing, access flexibility, and communication.",
  "trucking": "Trucking, freight, or logistics company. Relevant topics: on-time delivery, load security, communication during transit, driver professionalism, damage claims handling, and overall reliability.",
  "commercial_cleaning": "Commercial cleaning service. Relevant topics: thoroughness, consistency between visits, product safety, staff trustworthiness, communication about issues found, and overall facility condition.",
  "laundromat": "Laundromat or dry cleaning service. Relevant topics: machine cleanliness and reliability, pricing, wash/dry quality, turnaround time for drop-off service, and staff helpfulness.",
  "print_shop": "Print shop or sign shop. Relevant topics: print quality, color accuracy, material options, turnaround time, file setup assistance, pricing, and accuracy of the final product vs. the proof.",
  "welding": "Welding or metal fabrication shop. Relevant topics: weld quality, structural integrity, custom work accuracy, material sourcing, turnaround time, and pricing transparency.",
  "construction": "Construction company. Relevant topics: project scope adherence, timeline, budget transparency, subcontractor management, site cleanliness, safety practices, and quality of finished work.",
  "concrete_paving": "Concrete or paving contractor. Relevant topics: surface finish quality, crack prevention, drainage, timeline, pricing, and how the site was left after completion.",
  "farm_equipment": "Farm or tractor equipment dealership. Relevant topics: equipment selection, condition, financing, parts availability, service department responsiveness, and knowledge of agricultural needs.",
  "industrial_supply": "Industrial or trade supply store. Relevant topics: inventory depth, staff product knowledge, pricing, special order capability, account setup, and delivery reliability.",
  "commercial_real_estate": "Commercial real estate agency or property management. Relevant topics: property condition, lease communication, maintenance responsiveness, listing accuracy, and overall landlord/tenant relationship.",
  "warehouse": "Warehouse or distribution center. Relevant topics: order accuracy, pick/pack speed, inventory management, receiving process, communication, and damage rates.",
  "auto_auction": "Auto auction. Relevant topics: vehicle condition vs. description, bidding process fairness, title handling, post-sale support, lot organization, and staff professionalism.",
  "equipment_rental": "Equipment rental company. Relevant topics: equipment condition and reliability, availability, delivery and pickup, pricing transparency, operator instructions, and breakdown support.",
  "waste_management": "Waste management or dumpster rental company. Relevant topics: on-time delivery and pickup, dumpster condition, weight limit communication, pricing, and responsiveness to scheduling changes.",
};


export async function POST(req) {
  try {
    const {
      bizName,
      bizType,
      stars,
      reviewText,
      reviewerName,
      tone = "professional",
      previousResponses = [],
    } = await req.json();

    if (!reviewText?.trim()) {
      return Response.json({ error: "Review text is required" }, { status: 400 });
    }

    const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional;
    const bizContext = BUSINESS_TYPE_CONTEXT[bizType] || `Local business called "${bizName || "our business"}". Write a response appropriate to the industry based on the review content.`;

    // Pick random opening/closing styles to enforce structural variety
    const openingStyle = OPENING_STYLES[Math.floor(Math.random() * OPENING_STYLES.length)];
    const closingStyle = CLOSING_STYLES[Math.floor(Math.random() * CLOSING_STYLES.length)];

    // Extract first sentences from all previously generated responses
    const usedOpenings = previousResponses
      .map((r) => r.split(/[.!?]/)[0].trim())
      .filter(Boolean)
      .slice(0, 15);

    const avoidSection =
      usedOpenings.length > 0
        ? `\n\nCRITICAL — These opening lines are ALREADY USED on other reviews. Do not start with any variation of them:\n${usedOpenings.map((s) => `• "${s}"`).join("\n")}`
        : "";

    const starStrategy =
      stars <= 2
        ? `This is a ${stars}-star review. Priorities in order:
1. Apologize sincerely and specifically — name what went wrong
2. Validate their frustration without making excuses
3. Offer a concrete next step (call us, come back, ask for [name], etc.)
4. End with a genuine desire to make it right — not a hollow promise`
        : stars === 3
        ? `This is a 3-star review — a mixed experience. Priorities:
1. Acknowledge both what worked and what didn't
2. Show that you heard the specific criticism
3. Briefly explain what's being done about it (one line max)
4. Invite them back with a reason to believe it'll be better`
        : `This is a ${stars}-star review. Priorities:
1. Express genuine, specific gratitude about what they praised
2. Mirror their energy without overdoing it
3. Make them feel like a real person, not just a customer
4. Leave them with a reason to return or tell a friend`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 350,
      messages: [
        {
          role: "user",
          content: `You are an expert reputation manager writing a Google review response for "${bizName || "our business"}".

BUSINESS CONTEXT: ${bizContext}

TONE: ${toneInstruction}

STRUCTURE:
- Opening: ${openingStyle}
- Closing: ${closingStyle}

REVIEWER: ${reviewerName || "Anonymous"} — ${stars} star${stars !== 1 ? "s" : ""}
THEIR REVIEW: "${reviewText}"

STRATEGY:
${starStrategy}

HARD RULES:
- 65–115 words. Natural variation in length — never hit the exact same word count twice.
- Reference at least one specific detail from the review. Generic responses are unacceptable.
- Use industry-relevant language appropriate to the business context above.
- BANNED phrases (never use any variation of): "We value your feedback", "We appreciate your business", "We strive to", "We look forward to", "Thank you for taking the time", "Thank you for your review", "We're sorry to hear", "It was a pleasure serving you", "We hope to see you again soon", "Your satisfaction is our priority", "means the world to us", "We take [X] seriously"
- Never start with "Thank you for your"
- Maximum 1 exclamation point per response
- Sound like a human business owner, not a template${avoidSection}

Output the response text ONLY. No quotes, no labels, no explanation.`,
        },
      ],
    });

    return Response.json({ response: message.content[0].text });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
