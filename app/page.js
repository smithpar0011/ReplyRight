"use client";
import { useState, useEffect } from "react";
import { BUSINESS_TYPE_OPTIONS } from "./lib/businessTypes";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{background:"var(--white)",border:"1.5px solid var(--cream-dark)",borderRadius:12,padding:"1.2rem 1.4rem",cursor:"pointer",transition:"box-shadow .2s",boxShadow:open?"0 4px 20px rgba(15,31,56,.08)":"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem"}}>
        <div style={{fontSize:".92rem",fontWeight:600,color:"var(--navy)"}}>{q}</div>
        <div style={{fontSize:"1.1rem",color:"var(--text-light)",flexShrink:0,transform:open?"rotate(45deg)":"none",transition:"transform .2s"}}>+</div>
      </div>
      {open && <div style={{fontSize:".88rem",color:"var(--text-mid)",lineHeight:1.7,marginTop:".8rem",paddingTop:".8rem",borderTop:"1px solid var(--cream-dark)"}}>{a}</div>}
    </div>
  );
}

export default function Home() {
  const DEMO_BY_TYPE = {
    // Food & Drink
    restaurant:        { name: "Mario's Italian Kitchen",        review: "The food was absolutely amazing — the pasta was perfectly cooked and the tiramisu was to die for. Service was a little slow but our waiter was very friendly. Will definitely come back!" },
    cafe:              { name: "The Morning Roast Café",          review: "Best coffee in the neighborhood! The barista knew exactly how to make my oat latte. Only wish they had more seating on weekends. Will be back tomorrow!" },
    bar:               { name: "The Tap Room",                    review: "Great selection of craft beers and the staff really knows their stuff. Got a little loud on Friday night but that's expected. Solid spot for happy hour." },
    bakery:            { name: "Sweet & Simple Bakery",           review: "Their croissants are unreal — flaky, buttery, perfect. The cinnamon rolls sell out fast so get there early. Friendly staff and a cozy atmosphere." },
    pizza:             { name: "Brick Oven Pizza Co.",            review: "Hands down the best pizza in town. The crust is crispy, the sauce is fresh, and the portions are generous. Our family orders here almost every Friday night." },
    fast_food:         { name: "QuickBite Burgers",               review: "Fastest drive-through I've ever been through and the food was actually hot and fresh. Order was right every time. Great value for the price." },
    food_truck:        { name: "Street Eats Food Truck",          review: "Stumbled across this truck at the farmers market and it did not disappoint. The tacos were incredible and the owner was super friendly. Will be following their schedule." },
    catering:          { name: "Harvest Table Catering",          review: "Used them for our company event and everything was flawless. Food arrived on time, beautifully presented, and every dish was delicious. Got so many compliments from guests." },
    winery_brewery:    { name: "Stone Ridge Brewing Co.",         review: "The tasting flight was excellent and the staff walked us through every beer with real knowledge and passion. The taproom has a great vibe. Perfect afternoon outing." },
    deli:              { name: "Corner Deli & Sandwiches",        review: "The Reuben here is unbeatable. Fresh bread, generous portions, and they remember my order every time. Best lunch spot in the area by a mile." },
    ice_cream:         { name: "Scoops & Swirls Ice Cream",      review: "So many unique flavors and everything is made in-house. My kids dragged us back the very next day. The staff is always cheerful and patient with indecisive little ones." },
    juice_bar:         { name: "Pure Press Juice Bar",            review: "The green smoothie I had was so good I canceled my gym protein shake subscription. Clean ingredients, fast service, and the staff gave great recommendations. Love this place." },
    // Automotive
    car_dealer_new:    { name: "Greenway Ford",                   review: "Bought my first new truck here and the sales team made it completely stress-free. No pressure tactics, transparent pricing, and they walked me through every feature. Couldn't be happier." },
    car_dealer_used:   { name: "Prime Auto Sales",                review: "Found a great deal on a certified pre-owned SUV. The salesperson was honest about the vehicle history and let me take it for a long test drive. Very smooth transaction." },
    auto_repair:       { name: "AutoFix Garage",                  review: "Brought my car in for a brake job and they had it done same day. Fair pricing, no upselling, and they explained everything. This is my new go-to shop." },
    tire_shop:         { name: "All-Season Tire Center",          review: "In and out in under an hour for four new tires. Great price, no hidden fees, and they caught a nail in my spare I didn't even know about. Will be back for sure." },
    body_shop:         { name: "Precision Auto Body",             review: "After a fender bender I brought my car here and it came back looking brand new. They handled the insurance directly which made everything so easy. Excellent work." },
    car_wash:          { name: "Crystal Clear Auto Detailing",    review: "Full detail package and my 10-year-old car looks like it just rolled off the lot. The team was thorough, professional, and done faster than expected. Absolutely worth it." },
    oil_change:        { name: "Speedy Lube & Oil",               review: "15-minute oil change, no appointment needed, and they topped off all my fluids without being asked. Staff was friendly and didn't try to upsell me on things I didn't need." },
    trailer_dealer:    { name: "Hauler's Choice Trailer Sales",   review: "Found exactly the cargo trailer I needed at a fair price. The staff knew their inventory inside and out and helped me pick the right hitch setup. Great buying experience." },
    rv_dealer:         { name: "Open Road RV Center",             review: "Just picked up a travel trailer for our family and the team here made the whole process enjoyable. Thorough walkthrough, no pressure, and they were available for questions after the sale." },
    motorcycle_dealer: { name: "Ridgeline Powersports",           review: "Great selection of bikes and the staff are clearly riders themselves. Got a fair trade-in value and they took care of all the paperwork quickly. Rode out happy." },
    auto_parts:        { name: "Pro Parts Auto Supply",           review: "Staff actually knows what they're talking about. Helped me find the right part for an older model I was struggling with online. Fast, knowledgeable, and good prices." },
    towing:            { name: "Quick Response Towing",           review: "Showed up in under 30 minutes on a Sunday night when I was stranded on the highway. Driver was calm, professional, and got me to the shop safely. Saved my night." },
    // Health & Medical
    dentist:           { name: "Bright Smile Dental",             review: "I used to dread the dentist but this office changed that. The hygienist was gentle and thorough and Dr. Patel explained everything clearly. Highly recommend." },
    doctor:            { name: "Valley Family Health Clinic",     review: "Quick appointment, minimal wait time, and the doctor actually listened to my concerns. Front desk staff were helpful and friendly too." },
    chiropractor:      { name: "Align Chiropractic Care",         review: "After months of back pain I finally feel like myself again. Dr. Nguyen took time to understand my issues and created a treatment plan that actually worked. Can't recommend enough." },
    optometrist:       { name: "ClearView Eye Care",              review: "Great experience from start to finish. The exam was thorough and Dr. Kim was patient explaining my prescription. Huge frame selection and glasses were ready ahead of schedule." },
    physical_therapy:  { name: "Motion Physical Therapy",         review: "After my knee surgery I was nervous about recovery. The therapists here pushed me at exactly the right pace and always explained what we were doing and why. Back to full strength now." },
    urgent_care:       { name: "QuickCare Urgent Care",           review: "Walked in with my son on a Saturday morning and were seen within 20 minutes. The provider was thorough and kind with him. So much better than the ER for non-emergencies." },
    pharmacy:          { name: "Community Rx Pharmacy",           review: "The pharmacist took 10 minutes to walk me through my new medication and flagged a potential interaction my doctor missed. That kind of attention is rare and means a lot." },
    mental_health:     { name: "Calm Path Counseling",            review: "Finding the right therapist is hard but I'm so glad I found this practice. My counselor is warm, non-judgmental, and genuinely helpful. Scheduling is easy and the office is peaceful." },
    dermatologist:     { name: "Clear Skin Dermatology",          review: "Dr. Torres identified my skin issue on the first visit and had a treatment plan ready immediately. My skin has improved dramatically. The whole team is professional and welcoming." },
    med_spa:           { name: "Glow Aesthetics Med Spa",         review: "Got a hydrafacial and the results were visible immediately. The aesthetician explained every step and customized the treatment for my skin type. Already booked my next appointment." },
    // Beauty & Personal Care
    hair_salon:        { name: "Studio K Hair Salon",             review: "Got exactly the cut I asked for and my stylist gave great advice on products. Only reason for 4 stars is parking was a little tough. Team was super professional." },
    barbershop:        { name: "The Classic Cut Barbershop",      review: "Best fade I've had in years. Quick, clean, and my barber was easy to talk to. Already booked my next appointment before I left." },
    nail_salon:        { name: "Polish & Glow Nail Studio",       review: "My nails look incredible and lasted over two weeks. The gel color selection is huge. It was a little busy but the wait was worth it." },
    spa_massage:       { name: "Serenity Spa & Wellness",         review: "Absolutely the most relaxing massage I've ever had. The staff was calm, professional, and made me feel completely at ease. Already booked my next visit." },
    tattoo_studio:     { name: "Inkwell Tattoo Studio",           review: "My artist nailed the design on the first sketch. Clean studio, all sterile equipment, and they walked me through aftercare in detail. Couldn't be happier with how it turned out." },
    lash_brow:         { name: "Frame Beauty Lash & Brow Bar",    review: "My lashes have never looked this good. The artist took her time to make sure the shape suited my eyes. Got so many compliments the same day. Already rebooked." },
    // Home Services
    plumber:           { name: "Reliable Plumbing Solutions",     review: "Called for an emergency leak on a Sunday and they showed up within an hour. Fixed it quickly, explained what caused it, and cleaned up before leaving. Fair price too." },
    electrician:       { name: "Bright Wire Electric",            review: "Installed new outlets and a panel upgrade. The electrician was on time, clean, and walked me through everything they did. Passed inspection on the first try. Very impressed." },
    hvac:              { name: "Comfort Zone HVAC",               review: "AC went out in the middle of summer and they came out the same day. Diagnosed the issue fast, had the part on the truck, and had us cool again within two hours. Lifesavers." },
    roofer:            { name: "Summit Roofing Group",            review: "Got three quotes and Summit was honest about what I actually needed instead of selling me a full replacement. The work was done in one day and passed the insurance inspection. Solid company." },
    landscaper:        { name: "Green Thumb Landscaping",         review: "Completely transformed our backyard. The team came with a clear plan, stayed on schedule, and the cleanup was spotless. Multiple neighbors have already asked for their number." },
    house_cleaner:     { name: "Sparkle Pro Cleaning",            review: "My house has never looked this clean. They didn't miss a single corner and were done in under 3 hours. Will definitely be booking monthly." },
    mover:             { name: "EasyMove Relocation Co.",         review: "These guys took all the stress out of moving day. They wrapped everything carefully, were efficient, and not a single item was damaged. Worth every penny." },
    pest_control:      { name: "Shield Pest Solutions",           review: "Had a bad ant problem and they took care of it completely in one visit. The technician explained what they used and why it was safe around our pets. Haven't seen an ant since." },
    contractor:        { name: "Keystone Remodeling",             review: "Hired them for a full kitchen remodel and the result is stunning. The project manager kept us updated daily and they finished two days ahead of schedule. Truly exceeded our expectations." },
    handyman:          { name: "Fix-It Right Handyman",           review: "Knocked out 6 things on my to-do list in one visit. Showed up on time, worked efficiently, and everything was done right. Finally found a handyman I can actually rely on." },
    pool_service:      { name: "Clear Blue Pool Care",            review: "Our pool has never looked better. They're consistent, professional, and flag any potential issues early before they become expensive problems. Worth having a reliable service." },
    painter:           { name: "True Coat Painting",              review: "They painted the entire exterior of our home and it looks absolutely fresh. Crew was respectful of our property, covered everything carefully, and the edges are clean and crisp." },
    flooring:          { name: "Premier Floors Installation",     review: "New hardwood floors throughout the downstairs and the craftsmanship is beautiful. They worked around our schedule and cleaned up completely each day. Highly recommend." },
    // Retail
    clothing_store:    { name: "The Wardrobe Boutique",           review: "Amazing selection and the staff genuinely helped me put together a full outfit without being pushy. Found pieces I never would have picked myself. Will be back every season." },
    gift_shop:         { name: "The Gift Nook",                   review: "Found the perfect gift for my mom here and the staff helped me narrow it down in minutes. They even did beautiful wrapping at no charge. Such a thoughtful little shop." },
    jewelry_store:     { name: "Sterling & Stone Jewelers",       review: "Bought my wife's anniversary ring here and the jeweler listened carefully to what I described. The piece was even more beautiful in person. She cried. Best purchase I've ever made." },
    hardware_store:    { name: "Ace Hardware on Main",            review: "Walked in confused about a plumbing repair and walked out with exactly what I needed and a clear explanation of how to do it. This is why I'll never go to a big box store." },
    pet_store:         { name: "Happy Paws Pet Supply",           review: "Staff is incredibly knowledgeable about pet nutrition. They helped me transition my dog to a better food and explained why. Selection is great and the store is always clean." },
    bookstore:         { name: "Chapter One Books",               review: "A real gem of a local bookstore. The staff recommendations are spot on and they always have something interesting featured. Spent way more than I planned and have zero regrets." },
    furniture_store:   { name: "HomeForm Furniture Co.",          review: "Bought a full living room set and the quality is excellent. The designer helped us figure out layout and scale. Delivery team was careful and efficient. Very happy with the purchase." },
    sporting_goods:    { name: "Peak Outdoor & Sports",           review: "Knowledgeable staff who are actually into the sports they sell. Got fitted for trail running shoes properly for the first time and the difference is huge. Great local alternative to big chains." },
    electronics:       { name: "TechSource Electronics",          review: "Staff actually explains things in plain English instead of drowning you in specs. They helped me find a laptop that fit my budget and needs perfectly. Great post-sale support too." },
    antique_shop:      { name: "Timeless Antique Market",         review: "Could spend hours in here. Incredible variety and fair prices. The owner knows the history behind almost every piece. Found a lamp I'd been searching for for years." },
    // Professional Services
    law_firm:          { name: "Harper & Associates Law",         review: "Went through a difficult business dispute and my attorney was sharp, responsive, and kept me informed at every step. Reached a great outcome. Highly recommend for any business matter." },
    accountant:        { name: "Summit CPA & Tax Services",       review: "Switched to this firm after years of doing my own taxes and wish I'd done it sooner. They found deductions I'd been missing and explained everything clearly. Very trustworthy." },
    real_estate:       { name: "Landmark Realty Group",           review: "Our agent found us our dream home in a tough market. She was responsive, strategic, and never made us feel rushed. Smooth closing and we got a great deal." },
    insurance:         { name: "Cornerstone Insurance Agency",    review: "Reviewed all my policies and found I was overpaying for gaps in coverage. They restructured everything for less money and better protection. Actually feel taken care of now." },
    financial_advisor: { name: "Clarity Wealth Advisors",        review: "Finally feel like I have a real plan for retirement. My advisor is patient, doesn't talk down to me, and explains every decision. I actually look forward to our quarterly reviews." },
    marketing_agency:  { name: "Elevate Digital Marketing",      review: "Hired them for SEO and social and traffic to our site has grown significantly. They send clear monthly reports and are always available to answer questions. Solid investment." },
    it_services:       { name: "NetPro IT Solutions",             review: "When our server went down on a Monday morning they had us back online fast. Professional team, clear communication, and their managed services plan has prevented issues ever since." },
    // Hospitality & Travel
    hotel:             { name: "Harbor View Hotel",               review: "The room was spotless and the view of the water was stunning. Check-in was smooth and the staff went above and beyond. Will absolutely stay again." },
    bnb:               { name: "The Maple Inn Bed & Breakfast",   review: "Quaint, charming, and the breakfast was genuinely the highlight of our trip. The hosts were warm and gave us great local recommendations. Felt like staying with family." },
    vacation_rental:   { name: "Sunset Cove Vacation Rentals",   review: "The property was exactly as pictured, spotlessly clean, and the host responded to every question within minutes. Best vacation rental experience we've had. Already planning to return." },
    event_venue:       { name: "The Grand Oak Event Center",      review: "Hosted our daughter's wedding here and everything was perfect. The coordinator handled every detail and the staff was attentive all evening. Our guests are still talking about it." },
    // Education & Childcare
    daycare:           { name: "Little Sprouts Learning Center",  review: "My daughter has thrived here. The staff are warm, attentive, and genuinely care about the kids. Daily updates through the app give me such peace of mind while I'm at work." },
    tutoring:          { name: "Bright Minds Tutoring Center",    review: "My son's math grade went from a D to a B in one semester. His tutor is patient, keeps sessions engaging, and communicates with us weekly. Huge difference in his confidence." },
    driving_school:    { name: "Safe Road Driving School",        review: "My teenager was nervous about driving but his instructor was calm and encouraging. Passed the road test on the first try. The structured lessons made a real difference." },
    music_school:      { name: "Melody Music Academy",           review: "My daughter has been taking piano lessons here for a year and her progress is remarkable. The instructor makes lessons fun while still pushing her to improve. Wonderful school." },
    martial_arts:      { name: "Iron Tiger Martial Arts",         review: "My son has grown so much in discipline and confidence since joining. The instructors are encouraging but firm and the classes are well-structured for every age and level." },
    // Entertainment & Fitness
    gym:               { name: "Peak Performance Gym",            review: "Great equipment and the trainers are super knowledgeable. Gets crowded after 5pm but mornings are perfect. Glad I switched from my old gym." },
    yoga_studio:       { name: "Breathe Yoga Studio",             review: "The instructor was incredibly calming and the flow class was exactly what I needed. Studio is clean and welcoming. Love the community here." },
    golf_course:       { name: "Fairway Pines Golf Club",         review: "Course is beautifully maintained and the staff at the pro shop are helpful without being stuffy. Pace of play was great for a weekend round. One of my favorite courses in the area." },
    bowling:           { name: "Strike Zone Bowling & Arcade",    review: "Brought the whole family here for a birthday party and it was a hit. Lanes are clean, staff kept everything running smoothly, and the arcade is a great bonus for the kids." },
    escape_room:       { name: "The Locked Room Escape Games",    review: "Brought a group of coworkers and it was the best team-building activity we've ever done. The game master was entertaining and gave just the right amount of hints. Highly recommend." },
    entertainment_venue:{ name: "The Venue at Riverside",        review: "Saw a live show here and the sound and lighting were excellent. Great sightlines from every spot in the room and the staff was friendly and efficient at the bar." },
    // Pets
    veterinarian:      { name: "Caring Hands Veterinary Clinic",  review: "Dr. Ellis is exactly the kind of vet you want for your pet. She's thorough, explains everything, and you can tell she genuinely loves animals. My dog actually wags his tail walking in." },
    pet_grooming:      { name: "Paws & Polish Pet Grooming",      review: "My golden retriever looks like a show dog after every visit. The groomer is gentle with him and he comes home calm and happy. Never going anywhere else." },
    pet_boarding:      { name: "Happy Tails Pet Resort",          review: "Left my two dogs here for a week and had zero anxiety about it. Daily photo updates, attentive staff, and both dogs came back healthy and happy. Total peace of mind." },
    dog_training:      { name: "Good Dog Training Co.",           review: "Our rescue had serious leash aggression and after just a few sessions with the trainer we saw real progress. The techniques are positive and work for the dog AND the owner." },
    // Industrial & Commercial
    self_storage:      { name: "SecureSpace Self Storage",        review: "Clean, well-lit, and the access hours are flexible. The manager was helpful in figuring out the right unit size for me. Great security and very easy to get in and out." },
    moving_storage:    { name: "Atlas Moving & Storage",          review: "Used them for a cross-state move with a month of storage in between. Not a single item was damaged, nothing went missing, and the communication was excellent throughout." },
    trucking:          { name: "Reliable Freight Solutions",      review: "Needed a time-sensitive shipment handled and they delivered on every commitment. Driver was professional and the tracking updates were accurate. Will use for all future freight needs." },
    commercial_cleaning:{ name: "ProClean Commercial Services",  review: "Our office has never been this consistently clean. The crew is thorough, professional, and they work around our schedule without any disruption to our team." },
    laundromat:        { name: "FreshSpin Laundry",               review: "Machines are always clean and working, which you can't say for most laundromats. The drop-off service is quick and they fold everything neatly. My new go-to." },
    print_shop:        { name: "FastPrint & Signs",               review: "Needed large format prints for a trade show on short notice and they came through perfectly. Quality was excellent and the staff caught a small bleed error before printing. Saved us." },
    welding:           { name: "SteelCraft Welding & Fab",        review: "Had a custom gate fabricated and the craftsmanship is impressive. The team was upfront about the timeline, communicated well, and delivered exactly what we discussed." },
    construction:      { name: "Foundation First Construction",   review: "Hired them for a commercial build-out and they kept the project on schedule despite some material delays. Transparent communication, solid subcontractors, and quality finished work." },
    concrete_paving:   { name: "SolidSet Concrete & Paving",     review: "New driveway looks incredible and the crew was efficient and professional. They prepped the base properly and the finish is smooth and even. Several neighbors have already asked for their card." },
    farm_equipment:    { name: "Harvest Pro Equipment",           review: "Bought a used tractor here and the salesperson was knowledgeable and honest about hours and condition. Fair trade-in, quick paperwork, and parts availability is great." },
    industrial_supply: { name: "National Industrial Supply Co.",  review: "They stock hard-to-find items and their counter staff actually knows what they're selling. Same-day availability on most orders and pricing is competitive. Our shop's primary supplier." },
    commercial_real_estate: { name: "Anchor Commercial Realty",   review: "Found our new warehouse space through this team and the broker was sharp. Negotiated favorable lease terms and guided us through every step of the process." },
    warehouse:         { name: "Midwest Distribution Center",     review: "Used their fulfillment services and the accuracy rate is excellent. Inventory management is transparent through their portal and customer service is responsive when issues arise." },
    auto_auction:      { name: "Metro Auto Auction",              review: "Bought two fleet vehicles here at great prices. The process was straightforward and the team helped us navigate the paperwork. Much better value than retail for commercial purchases." },
    equipment_rental:  { name: "ProRent Equipment",               review: "Rented a mini excavator for a weekend project and it was clean, well-maintained, and ready when promised. The walkthrough on operation was thorough. Reasonable rates and great service." },
    waste_management:  { name: "CleanSweep Dumpster Rentals",     review: "Ordered a dumpster for a renovation and it was dropped off right on time and picked up same day I called. Straightforward pricing with no surprise fees. Will rent from them again." },
    // Default fallback
    default:           { name: "Your Business",                   review: "Great experience overall. The team was professional and made everything easy. I'll definitely be recommending this place to friends and family." },
  };

  const [bizName, setBizName] = useState(DEMO_BY_TYPE.restaurant.name);
  const [bizType, setBizType] = useState("restaurant");
  const [reviewText, setReviewText] = useState(DEMO_BY_TYPE.restaurant.review);
  const [stars, setStars] = useState(4);
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Signup modal
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [planStep, setPlanStep] = useState(1); // 1 = pick plan, 2 = create account, 3 = connect google, 4 = payment
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Account creation (Step 2)
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinLoading, setSigninLoading] = useState(false);

  // Google connect state (Step 3)
  const [googleConnected, setGoogleConnected] = useState(false);
  const [connectedGoogleUser, setConnectedGoogleUser] = useState(null);

  // Contact modal
  const [showContact, setShowContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const sendContact = () => {
    if (!contactEmail.trim() || !contactMsg.trim()) return;
    const subject = encodeURIComponent(`ReplyRight Support${contactName ? ` — ${contactName}` : ""}`);
    const body = encodeURIComponent(`Name: ${contactName || "Not provided"}\nEmail: ${contactEmail}\n\nMessage:\n${contactMsg}`);
    window.location.href = `mailto:Support@replyrightapp.com?subject=${subject}&body=${body}`;
    setTimeout(() => { setShowContact(false); setContactName(""); setContactEmail(""); setContactMsg(""); }, 400);
  };

  // Improvement 4: Response history
  const [history, setHistory] = useState([]);

  // Improvement 5: Annual pricing toggle
  const [annual, setAnnual] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  // Improvement 3: Activity ticker
  const [tickerIdx, setTickerIdx] = useState(0);

  const TICKER_ITEMS = [
    "Mario's Italian Kitchen · 5-star reply sent · just now",
    "Studio K Hair Salon · 4-star review addressed · 1 min ago",
    "Downtown Dental · responded to 2-star review · 2 min ago",
    "AutoFix Garage · 5-star reply sent · 3 min ago",
    "Peak Performance Gym · 3-star review addressed · 4 min ago",
    "Harbor Hotel · 5-star reply sent · 5 min ago",
    "Bloom Florist · 1-star review turned around · 6 min ago",
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rr_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        const cutoff = Date.now() - 15 * 60 * 1000; // 15 minutes
        const fresh = parsed.filter(h => h.id > cutoff);
        setHistory(fresh);
        if (fresh.length !== parsed.length) {
          localStorage.setItem("rr_history", JSON.stringify(fresh));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setTickerIdx((i) => (i + 1) % TICKER_ITEMS.length),
      3200
    );
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const generate = async () => {
    if (!reviewText.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bizName, bizType, stars, reviewText, tone }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setResult(data.response);
        const entry = {
          id: Date.now(),
          bizName: bizName || "Your Business",
          bizType,
          stars,
          tone,
          reviewSnippet:
            reviewText.slice(0, 72) + (reviewText.length > 72 ? "…" : ""),
          response: data.response,
        };
        const cutoff = Date.now() - 15 * 60 * 1000;
        const newHistory = [entry, ...history.filter(h => h.id > cutoff)].slice(0, 3);
        setHistory(newHistory);
        try {
          localStorage.setItem("rr_history", JSON.stringify(newHistory));
        } catch {}
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const startCheckout = async (plan) => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing: annual ? "annual" : "monthly" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Something went wrong. Please try again.");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const openModal = (plan = null) => {
    setShowModal(true);
    setModalSubmitted(false);
    setSignupError("");
    setShowSignin(false);
    if (plan) {
      setSelectedPlan(plan);
      // If user is already logged in, skip account creation and go to connect Google
      const isLoggedIn = typeof document !== "undefined" && !!document.cookie.match(/rr_session=/);
      if (isLoggedIn) {
        document.cookie = `rr_signup=${encodeURIComponent(JSON.stringify({
          plan,
          billing: annual ? "annual" : "monthly",
        }))}; Path=/; SameSite=Lax; Max-Age=1800`;
        setPlanStep(3);
      } else {
        setPlanStep(2);
      }
    } else {
      setSelectedPlan(null);
      setPlanStep(1);
    }
  };

  // Handle sign-in within checkout flow (Step 2 — existing users)
  const handleSigninToCheckout = async () => {
    setSignupError("");
    if (!signinEmail || !signinPassword) {
      setSignupError("Email and password are required");
      return;
    }
    setSigninLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signinEmail, password: signinPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSignupError(data.error || "Invalid email or password");
        return;
      }
      document.cookie = `rr_signup=${encodeURIComponent(JSON.stringify({
        plan: selectedPlan,
        billing: annual ? "annual" : "monthly",
      }))}; Path=/; SameSite=Lax; Max-Age=1800`;
      setPlanStep(3);
    } catch {
      setSignupError("Something went wrong. Please try again.");
    } finally {
      setSigninLoading(false);
    }
  };

  // Handle account creation (Step 2)
  const handleSignup = async () => {
    setSignupError("");
    if (!signupEmail || !signupPassword) {
      setSignupError("Email and password are required");
      return;
    }
    if (signupPassword.length < 8) {
      setSignupError("Password must be at least 8 characters");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match");
      return;
    }
    setSignupLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, password: signupPassword, name: signupName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSignupError(data.error || "Failed to create account");
        return;
      }
      // Store signup state in cookie for after Google OAuth redirect
      document.cookie = `rr_signup=${encodeURIComponent(JSON.stringify({
        plan: selectedPlan,
        billing: annual ? "annual" : "monthly",
      }))}; Path=/; SameSite=Lax; Max-Age=1800`;
      setPlanStep(3);
    } catch {
      setSignupError("Something went wrong. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  // Check for ?upgrade=1 on mount (redirected from /dashboard without a plan)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("upgrade") === "1") {
        window.history.replaceState({}, "", "/");
        // Small delay so the page renders before scrolling/opening modal
        setTimeout(() => {
          const el = document.getElementById("pricing");
          if (el) el.scrollIntoView({ behavior: "smooth" });
          setShowModal(true);
          setPlanStep(1);
          setSelectedPlan(null);
        }, 300);
      }
    }
  }, []);

  // Check for ?signup=payment on mount (returning from Google OAuth)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("signup") === "payment") {
        // Read signup cookie to restore state
        const match = document.cookie.match(/rr_signup=([^;]+)/);
        if (match) {
          try {
            const data = JSON.parse(decodeURIComponent(match[1]));
            setSelectedPlan(data.plan || "Pro");
            setAnnual(data.billing === "annual");
          } catch {}
        }
        // Read connected Google user info
        const userMatch = document.cookie.match(/rr_user=([^;]+)/);
        if (userMatch) {
          try {
            const userData = JSON.parse(decodeURIComponent(userMatch[1]));
            setConnectedGoogleUser(userData);
            setGoogleConnected(true);
          } catch {}
        }
        setShowModal(true);
        setPlanStep(4);
        // Clean URL
        window.history.replaceState({}, "", "/");
      }
    }
  }, []);

  const submitModal = (e) => {
    e.preventDefault();
    if (!modalEmail.trim()) return;
    try {
      const leads = JSON.parse(localStorage.getItem("rr_leads") || "[]");
      leads.push({ name: modalName, email: modalEmail, ts: Date.now() });
      localStorage.setItem("rr_leads", JSON.stringify(leads));
    } catch {}
    setModalSubmitted(true);
  };

  const PRICES = {
    Starter: { monthly: 29, annual: 25 },
    Pro: { monthly: 59, annual: 50 },
    Agency: { monthly: 149, annual: 127 },
  };

  const starLabel = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Poppins:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, textarea, button { font-family: 'DM Sans', sans-serif; font-size: inherit; }
        :root {
          --navy: #0f1f38; --blue: #1e4d8c; --accent: #2e7df7;
          --accent-light: #5b9bff; --gold: #c8a96e; --gold-light: #e8cfa0;
          --cream: #f8f5ef; --cream-dark: #ede8de; --white: #ffffff;
          --text-dark: #0f1f38; --text-mid: #4a5568; --text-light: #8896a7;
          --success: #16a34a; --star: #f59e0b;
        }
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @keyframes dotBounce { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes tickerFade { 0%{opacity:0;transform:translateY(6px)} 15%,85%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-6px)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes orbDrift { 0%,100%{transform:scale(1) translate(0,0)} 40%{transform:scale(1.1) translate(15px,-12px)} 70%{transform:scale(.93) translate(-8px,14px)} }
        @keyframes shimmerSlide { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes heroGlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-glow {
          position:absolute; inset:0; z-index:0;
          background: linear-gradient(135deg,
            rgba(46,125,247,0.08) 0%,
            rgba(200,169,110,0.06) 25%,
            rgba(91,155,255,0.10) 50%,
            rgba(200,169,110,0.04) 75%,
            rgba(46,125,247,0.08) 100%
          );
          background-size: 400% 400%;
          animation: heroGlow 12s ease infinite;
        }

        /* Floating decoration cards in hero */
        .float-card { position:absolute; background:rgba(255,255,255,0.72); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border-radius:16px; box-shadow:0 12px 40px rgba(15,31,56,.14); border:1px solid rgba(255,255,255,0.5); padding:1rem 1.3rem; pointer-events:none; z-index:4; }
        .float-card-1 { bottom:14%; left:6%; animation:float 5s ease-in-out infinite; }
        .float-card-2 { top:22%; right:5%; animation:float 6s 1.8s ease-in-out infinite; }

        /* Color orbs */
        .orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; animation:orbDrift 10s ease-in-out infinite; }

        /* Dot grid background */
        .dot-bg { background-image:radial-gradient(circle, rgba(30,77,140,.065) 1px, transparent 1px); background-size:26px 26px; }

        /* Gradient accent line on cards */
        .accent-top::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--gold),var(--gold-light),var(--accent-light)); border-radius:3px 3px 0 0; }

        /* Enhanced testi */
        .testi { background:var(--white); border-radius:18px; padding:1.8rem; border:1px solid var(--cream-dark); position:relative; overflow:hidden; transition:transform .25s,box-shadow .25s; }
        .testi:hover { transform:translateY(-5px); box-shadow:0 20px 56px rgba(15,31,56,.11); }
        .testi-avatar-img { width:46px; height:46px; border-radius:50%; object-fit:cover; flex-shrink:0; border:2.5px solid var(--gold-light); }
        .testi-quote-mark { font-family:'Instrument Serif',serif; font-size:3.5rem; line-height:.8; color:var(--gold-light); display:block; margin-bottom:.4rem; }

        /* Enhanced steps */
        .step { background:var(--white); border-radius:16px; padding:1.8rem; border:1px solid var(--cream-dark); box-shadow:0 2px 12px rgba(15,31,56,.05); transition:transform .25s,box-shadow .25s; position:relative; overflow:hidden; }
        .step:hover { transform:translateY(-5px); box-shadow:0 16px 44px rgba(15,31,56,.1); }
        .step-icon { font-size:1.8rem; margin-bottom:.8rem; display:block; }
        .step-bar { position:absolute; bottom:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--accent),var(--accent-light)); transform:scaleX(0); transform-origin:left; transition:transform .35s; border-radius:0 0 16px 16px; }
        .step:hover .step-bar { transform:scaleX(1); }

        /* Gradient featured price card */
        .price-card.featured { background:linear-gradient(145deg,#0f1f38 0%,#1a3560 100%); border-color:#1a3560; box-shadow:0 16px 56px rgba(15,31,56,.38); }

        /* Owner photos row */
        .owners-row { display:flex; gap:1.8rem; justify-content:center; flex-wrap:wrap; max-width:900px; margin:0 auto; }
        .owner-card { display:flex; flex-direction:column; align-items:center; gap:.6rem; }
        .owner-img { width:90px; height:90px; border-radius:50%; object-fit:cover; border:3px solid rgba(200,169,110,.35); transition:all .25s; box-shadow:0 4px 18px rgba(15,31,56,.15); }
        .owner-img:hover { border-color:var(--gold); transform:translateY(-3px); box-shadow:0 10px 30px rgba(15,31,56,.2); }
        .owner-name { font-size:.78rem; font-weight:600; color:white; }
        .owner-biz { font-size:.7rem; color:rgba(255,255,255,.45); }
        .owners-section { background:linear-gradient(160deg,#0a1628 0%,#0f2442 100%); padding:4.5rem 2rem; position:relative; overflow:hidden; }
        .owners-heading { font-family:'Instrument Serif',serif; font-size:clamp(1.6rem,2.5vw,2.1rem); color:white; text-align:center; margin-bottom:.6rem; letter-spacing:-.02em; }
        .owners-sub { font-size:.88rem; color:rgba(255,255,255,.4); text-align:center; margin-bottom:2.8rem; }

        /* Section with subtle gradient bg */
        .section-mesh { background:radial-gradient(ellipse 60% 50% at 20% 80%, rgba(46,125,247,.04) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(200,169,110,.05) 0%, transparent 60%), var(--white); }

        /* Shimmer badge */
        .shimmer-badge { background:#ffffff; border:1px solid rgba(255,255,255,.25); color:#0f1f38; border-radius:100px; padding:.45rem 1.2rem; font-size:.78rem; font-weight:700; display:inline-flex; align-items:center; gap:.5rem; box-shadow:0 2px 12px rgba(0,0,0,.18); }

        /* Wave divider */
        .wave-divider { width:100%; overflow:hidden; line-height:0; }
        .wave-divider svg { display:block; width:100%; }

        /* Google Review Card styles */
        .g-review-section { padding:5rem 2rem; background:var(--white); }
        .g-review-grid { display:grid; grid-template-columns:1fr 1fr; gap:2rem; max-width:960px; margin:0 auto; }
        @media(max-width:768px){ .g-review-grid { grid-template-columns:1fr; } .g-profile-card { max-width:400px; margin:0 auto; } }
        .g-card { background:white; border-radius:12px; border:1px solid #e0e0e0; overflow:hidden; box-shadow:0 1px 6px rgba(0,0,0,.08); }
        .g-card-header { padding:1rem 1.2rem .6rem; display:flex; align-items:center; gap:.7rem; }
        .g-card-avatar { width:36px; height:36px; border-radius:50%; object-fit:cover; flex-shrink:0; }
        .g-card-avatar-placeholder { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.9rem; color:white; flex-shrink:0; }
        .g-card-name { font-size:.88rem; font-weight:600; color:#202124; }
        .g-card-meta { font-size:.75rem; color:#70757a; }
        .g-card-stars { padding:0 1.2rem; display:flex; gap:1px; }
        .g-card-star { color:#fbbc04; font-size:.9rem; }
        .g-card-star.empty { color:#dadce0; }
        .g-card-text { padding:.5rem 1.2rem 1rem; font-size:.87rem; color:#3c4043; line-height:1.6; }
        .g-card-response { margin:.6rem 1.2rem 1.2rem; background:#f8f9fa; border-left:3px solid #1a73e8; border-radius:0 8px 8px 0; padding:.9rem 1rem; }
        .g-card-response-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.4rem; }
        .g-card-response-name { font-size:.8rem; font-weight:600; color:#202124; }
        .g-card-response-time { font-size:.72rem; color:#70757a; }
        .g-card-response-text { font-size:.82rem; color:#3c4043; line-height:1.6; }
        .g-card-response-badge { display:inline-flex; align-items:center; gap:.3rem; background:rgba(26,115,232,.08); color:#1a73e8; font-size:.65rem; font-weight:600; padding:.15rem .5rem; border-radius:100px; margin-top:.5rem; }
        /* Google Business Profile mockup */
        .g-profile-card { background:white; border-radius:12px; border:1px solid #e0e0e0; overflow:hidden; box-shadow:0 1px 6px rgba(0,0,0,.08); }
        .g-profile-header { position:relative; height:140px; overflow:hidden; }
        .g-profile-header img { width:100%; height:100%; object-fit:cover; }
        .g-profile-overlay { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent,rgba(0,0,0,.5)); padding:1rem 1.2rem .6rem; }
        .g-profile-biz-name { font-size:1.1rem; font-weight:700; color:white; }
        .g-profile-biz-type { font-size:.75rem; color:rgba(255,255,255,.8); }
        .g-profile-body { padding:1rem 1.2rem; }
        .g-profile-rating-row { display:flex; align-items:center; gap:.6rem; margin-bottom:.7rem; }
        .g-profile-rating { font-size:1.4rem; font-weight:700; color:#202124; }
        .g-profile-stars { display:flex; gap:1px; color:#fbbc04; font-size:.9rem; }
        .g-profile-count { font-size:.82rem; color:#70757a; }
        .g-profile-info { font-size:.82rem; color:#3c4043; line-height:1.8; }
        .g-profile-info span { display:flex; align-items:center; gap:.5rem; }
        .g-profile-actions { display:flex; gap:.6rem; margin-top:.9rem; padding-top:.9rem; border-top:1px solid #e0e0e0; }
        .g-profile-action-btn { flex:1; padding:.5rem; border-radius:100px; font-size:.78rem; font-weight:600; cursor:default; text-align:center; border:1px solid #dadce0; background:white; color:#1a73e8; }
        .g-profile-action-btn.primary { background:#1a73e8; color:white; border-color:#1a73e8; }

        .animate { animation: fadeUp 0.7s ease both; }
        .animate-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .animate-3 { animation: fadeUp 0.7s 0.3s ease both; }

        /* Mobile menu */
        .mobile-menu-overlay { display:none; }
        .hamburger-btn { display:none; background:none; border:none; cursor:pointer; padding:.4rem; color:var(--navy); }
        @media(max-width:768px) {
          .hamburger-btn { display:flex; flex-direction:column; gap:5px; z-index:201; }
          .hamburger-btn span { display:block; width:24px; height:2px; background:currentColor; border-radius:2px; transition:all .25s; }
          .mobile-menu-overlay { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.8rem; position:fixed; inset:0; background:rgba(248,245,239,.97); backdrop-filter:blur(16px); z-index:200; animation:fadeUp .2s ease both; }
          .mobile-menu-overlay a, .mobile-menu-overlay button { font-size:1.2rem; font-weight:600; color:var(--navy); background:none; border:none; cursor:pointer; font-family:'Poppins',sans-serif; text-decoration:none; }
          .mobile-cta-pill { background:var(--navy)!important; color:white!important; padding:.7rem 2rem!important; border-radius:100px!important; font-size:1rem!important; }
          .mobile-close { position:absolute; top:1.2rem; right:1.5rem; background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-mid); }
        }
        nav {
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
          width: calc(100% - 40px); max-width: 1240px;
          z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.4rem 0.8rem 0.4rem 1.5rem;
          background: rgba(255,255,255,0.92);
          border-radius: 100px; border: 1px solid rgba(15,31,56,0.06);
          box-shadow: 0 4px 24px rgba(15,31,56,0.08);
          will-change: transform;
        }
        .logo { font-family: 'Instrument Serif', serif; font-size: 1.5rem; font-weight: 400; color: var(--navy); letter-spacing: -.02em; }
        .logo span { color: var(--accent); }
        .nav-links { display: flex; gap: 1.6rem; align-items: center; }
        .nav-btn { background: none; border: none; color: var(--text-mid); font-size: .85rem; font-weight: 500; cursor: pointer; font-family: 'Poppins', sans-serif; transition: color .15s; }
        .nav-btn:hover { color: var(--navy); }
        .nav-cta { background: var(--navy)!important; color: white!important; padding: .5rem 1.3rem; border-radius: 100px!important; font-weight: 600!important; transition: all .2s!important; }
        .nav-cta:hover { background: var(--blue)!important; transform: translateY(-1px); }
        @media(max-width:768px) { .nav-links { display:none; } }

        .hero {
          min-height: 92vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 5rem 2rem 4rem; text-align: center; padding-top: 110px !important;
          background:
            radial-gradient(ellipse 70% 50% at 50% -10%, rgba(30,77,140,.1) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(200,169,110,.07) 0%, transparent 60%),
            linear-gradient(rgba(15,31,56,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,31,56,.03) 1px, transparent 1px),
            var(--cream);
          background-size: auto, auto, 44px 44px, 44px 44px, auto;
        }
        .badge {
          display: inline-flex; align-items: center; gap: .6rem;
          background: var(--white); border: 1px solid rgba(200,169,110,.35);
          padding: .38rem .5rem .38rem 1rem; border-radius: 100px;
          font-size: .78rem; font-weight: 500; color: var(--text-mid);
          margin-bottom: 2rem; box-shadow: 0 2px 12px rgba(0,0,0,.07);
          cursor: default;
        }
        .badge-pill { background: var(--navy); color: white; font-size: .7rem; font-weight: 600; padding: .22rem .75rem; border-radius: 100px; white-space: nowrap; }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; }
        h1 { font-family: 'Poppins', sans-serif; font-size: clamp(2.4rem,5vw,4.2rem); line-height: 1.08; letter-spacing: -.04em; color: var(--navy); max-width: 800px; font-weight: 800; }
        h1 em { font-style: normal; color: var(--accent); }
        .hero-sub { font-size: 1rem; color: var(--text-mid); max-width: 520px; line-height: 1.75; margin-top: 1.3rem; font-weight: 400; }
        .hero-actions { display: flex; gap: 1rem; margin-top: 2.2rem; flex-wrap: wrap; justify-content: center; }
        .hero-stats { display: flex; gap: 3rem; margin-top: 3.5rem; flex-wrap: wrap; justify-content: center; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Instrument Serif', serif; font-size: 2rem; color: var(--navy); }
        .stat-label { font-size: .78rem; color: var(--text-light); margin-top: .2rem; font-weight: 500; }

        /* Improvement 3: Ticker */
        .ticker-wrap { margin-top: 2.2rem; display: flex; align-items: center; gap: .6rem; }
        .ticker-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; flex-shrink: 0; }
        .ticker-text { font-size: .88rem; color: #2d3748 !important; font-weight: 600; animation: tickerFade 3.2s ease infinite; }

        .btn-primary { background: var(--navy); color: white; border: none; padding: .82rem 2rem; border-radius: 100px; font-size: .92rem; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif; box-shadow: 0 4px 20px rgba(15,31,56,.28); transition: all .2s; }
        .btn-primary:hover { background: var(--blue); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(15,31,56,.3); }
        .btn-secondary { background: transparent; color: var(--navy); border: 1.5px solid rgba(15,31,56,.22); padding: .82rem 2rem; border-radius: 100px; font-size: .92rem; font-weight: 500; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all .2s; display: inline-flex; align-items: center; gap: .5rem; }
        .btn-secondary:hover { border-color: var(--navy); background: var(--white); transform: translateY(-1px); }

        .divider { height: 1px; background: linear-gradient(90deg,transparent,var(--cream-dark),transparent); }
        section { padding: 5rem 2rem; }
        .section-white { background: var(--white); }
        .section-cream { background: var(--cream); }
        .section-label { text-align: center; font-size: .88rem; font-weight: 700; letter-spacing: .14em; color: var(--accent); text-transform: uppercase; margin-bottom: .8rem; display: flex; align-items: center; justify-content: center; gap: .6rem; }
        .section-label::before, .section-label::after { content: ""; display: inline-block; width: 28px; height: 1px; background: var(--accent); opacity: .4; }
        .section-title { font-family: 'Poppins', sans-serif; font-size: clamp(2.1rem,4vw,3.4rem); text-align: center; color: var(--navy); letter-spacing: -.04em; line-height: 1.12; margin-bottom: .8rem; font-weight: 700; }
        .section-sub { text-align: center; color: var(--text-mid); font-size: .93rem; max-width: 480px; margin: 0 auto 3rem; line-height: 1.75; font-weight: 400; }

        /* DEMO */
        .demo-section-bg { background: linear-gradient(180deg, #fff 0%, #f0f4ff 50%, #fff 100%); position:relative; }
        .demo-cta-banner { display:flex; align-items:center; justify-content:center; gap:.8rem; max-width:760px; margin:0 auto 1.6rem; padding:.75rem 1.2rem; background:linear-gradient(135deg,rgba(46,125,247,.08),rgba(200,169,110,.08)); border:1.5px solid rgba(46,125,247,.18); border-radius:100px; }
        .demo-cta-icon { font-size:1.3rem; }
        .demo-cta-text { font-size:.88rem; color:var(--navy); font-weight:500; }
        .demo-cta-text strong { font-weight:700; color:var(--accent); }
        .demo-wrap { max-width: 760px; margin: 0 auto; background: #fff; border-radius: 20px; border: 2px solid rgba(46,125,247,.18); overflow: hidden; box-shadow: 0 16px 64px rgba(15,31,56,.12), 0 0 0 1px rgba(46,125,247,.06); position:relative; }
        .demo-wrap::before { content:""; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--accent),var(--gold),var(--accent)); border-radius:20px 20px 0 0; z-index:1; }
        .demo-bar { background: var(--navy); padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; position:relative; }
        .demo-dots { display: flex; gap: 6px; }
        .demo-dot { width: 10px; height: 10px; border-radius: 50%; }
        .demo-bar-title { color: rgba(255,255,255,.5); font-size: .8rem; }
        .demo-bar-live { display:inline-flex; align-items:center; gap:.4rem; margin-left:auto; background:rgba(34,197,94,.15); color:#22c55e; font-size:.7rem; font-weight:600; padding:.2rem .7rem; border-radius:100px; letter-spacing:.04em; }
        .demo-bar-live-dot { width:6px; height:6px; border-radius:50%; background:#22c55e; animation:pulse 2s infinite; }
        .demo-body { padding: 2rem; }
        .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.2rem; }
        .field-label { display: block; font-size: .72rem; font-weight: 600; color: var(--text-mid); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .4rem; }
        .field-input, .field-select, .field-textarea { width: 100%; padding: .7rem .9rem; border: 1.5px solid var(--cream-dark); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: .9rem; color: var(--text-dark); background: var(--white); transition: border-color .2s; outline: none; resize: none; }
        .field-input:focus, .field-select:focus, .field-textarea:focus { border-color: var(--accent); }
        .field-textarea { min-height: 95px; font-family: 'DM Sans', sans-serif; font-size: .9rem; }
        .stars-row { display: flex; gap: .3rem; margin-bottom: 1rem; }
        .star-btn { font-size: 1.6rem; cursor: pointer; transition: all .15s; background: none; border: none; padding: 0; line-height: 1; }

        /* Improvement 2: Tone selector */
        .tone-row { display: flex; gap: .5rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
        .tone-pill { padding: .38rem .9rem; border-radius: 100px; font-size: .78rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; border: 1.5px solid var(--cream-dark); background: var(--white); color: var(--text-mid); transition: all .15s; }
        .tone-pill:hover { border-color: var(--accent); color: var(--accent); }
        .tone-pill.active { background: var(--navy); border-color: var(--navy); color: white; }

        .gen-btn { width: 100%; background: linear-gradient(135deg, var(--accent) 0%, #1e6ae1 100%); color: white; border: none; padding: 1rem; border-radius: 100px; font-size: .95rem; font-weight: 700; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all .25s; margin-top: 1.4rem; box-shadow: 0 6px 24px rgba(46,125,247,.35); letter-spacing: .01em; }
        .gen-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(46,125,247,.4); filter:brightness(1.08); }
        .gen-btn:disabled { opacity: .6; cursor: not-allowed; }
        .dots { display: inline-flex; gap: 4px; }
        .dots span { width: 5px; height: 5px; border-radius: 50%; background: white; animation: dotBounce 1.2s infinite; }
        .dots span:nth-child(2) { animation-delay: .2s; }
        .dots span:nth-child(3) { animation-delay: .4s; }
        .result-box { margin-top: 1.3rem; padding: 1.4rem; background: var(--white); border-radius: 10px; border: 1.5px solid #86efac; animation: fadeUp .4s ease both; }
        .result-label { font-size: .7rem; font-weight: 700; color: var(--success); text-transform: uppercase; letter-spacing: .1em; margin-bottom: .7rem; }
        .result-text { font-size: .93rem; color: var(--text-dark); line-height: 1.7; white-space: pre-wrap; }
        .result-actions { display: flex; gap: .7rem; margin-top: 1rem; }
        .copy-btn { padding: .48rem 1rem; border-radius: 100px; font-size: .8rem; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif; background: var(--navy); color: white; border: none; transition: all .2s; }
        .copy-btn:hover { background: var(--blue); }
        .regen-btn { padding: .48rem 1rem; border-radius: 100px; font-size: .8rem; font-weight: 500; cursor: pointer; font-family: 'Poppins', sans-serif; background: transparent; color: var(--text-mid); border: 1.5px solid var(--cream-dark); transition: all .2s; }
        .regen-btn:hover { border-color: var(--navy); color: var(--navy); }
        .error-box { margin-top: 1rem; padding: 12px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; color: #dc2626; font-size: .85rem; }

        /* Improvement 4: History */
        .history-wrap { max-width: 760px; margin: 2.5rem auto 0; }
        .history-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--text-light); margin-bottom: 1rem; }
        .history-grid { display: flex; flex-direction: column; gap: .7rem; }
        .history-card { background: var(--white); border: 1px solid var(--cream-dark); border-radius: 10px; padding: 1rem 1.2rem; display: grid; grid-template-columns: 1fr auto; gap: .5rem; align-items: start; }
        .history-meta { font-size: .75rem; color: var(--text-light); margin-bottom: .25rem; }
        .history-review { font-size: .8rem; color: var(--text-mid); font-style: italic; margin-bottom: .3rem; }
        .history-response { font-size: .82rem; color: var(--text-dark); line-height: 1.55; }
        .history-stars { font-size: .85rem; color: var(--star); }
        .history-copy { padding: .3rem .65rem; border-radius: 5px; font-size: .72rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; background: transparent; color: var(--text-mid); border: 1px solid var(--cream-dark); white-space: nowrap; }
        .history-tone-badge { display: inline-block; background: var(--cream); border: 1px solid var(--cream-dark); border-radius: 100px; padding: .15rem .55rem; font-size: .65rem; font-weight: 600; color: var(--text-light); text-transform: uppercase; letter-spacing: .06em; margin-left: .4rem; }

        /* STEPS */
        .steps { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 1.5rem; max-width: 860px; margin: 0 auto; }
        .step { background: var(--white); border-radius: 14px; padding: 1.8rem; border: 1px solid var(--cream-dark); box-shadow: 0 2px 12px rgba(15,31,56,.05); transition: transform .2s; }
        .step:hover { transform: translateY(-3px); }
        .step-num { font-family: 'Instrument Serif', serif; font-size: 2.2rem; color: var(--accent-light); line-height: 1; margin-bottom: .8rem; }
        .step h3 { font-size: .95rem; font-weight: 600; color: var(--navy); margin-bottom: .4rem; }
        .step p { font-size: .84rem; color: var(--text-mid); line-height: 1.6; }

        /* Improvement 5: Pricing toggle */
        .pricing-toggle { display: flex; align-items: center; justify-content: center; gap: .8rem; margin-bottom: 2.5rem; }
        .toggle-label { font-size: .85rem; font-weight: 500; color: var(--text-mid); }
        .toggle-label.active { color: var(--navy); font-weight: 600; }
        .toggle-switch { position: relative; width: 44px; height: 24px; cursor: pointer; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-track { position: absolute; inset: 0; background: var(--cream-dark); border-radius: 100px; transition: background .2s; }
        .toggle-switch input:checked + .toggle-track { background: var(--navy); }
        .toggle-thumb { position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
        .toggle-switch input:checked ~ .toggle-thumb { transform: translateX(20px); }
        .save-badge { background: var(--success); color: white; font-size: .65rem; font-weight: 700; padding: .15rem .5rem; border-radius: 100px; letter-spacing: .04em; }

        /* PRICING */
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 1.4rem; max-width: 860px; margin: 0 auto; }
        .price-card { border-radius: 16px; padding: 2rem; border: 1.5px solid var(--cream-dark); background: var(--cream); position: relative; transition: transform .2s; }
        .price-card:hover { transform: translateY(-3px); }
        .price-card.featured { background: var(--navy); border-color: var(--navy); box-shadow: 0 12px 40px rgba(15,31,56,.3); }
        .price-badge { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--navy); font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: .28rem .85rem; border-radius: 100px; white-space: nowrap; }
        .price-name { font-weight: 600; font-size: .82rem; text-transform: uppercase; letter-spacing: .08em; color: var(--text-mid); }
        .price-card.featured .price-name { color: rgba(255,255,255,.55); }
        .price-amount { font-family: 'Instrument Serif', serif; font-size: 2.8rem; color: var(--navy); margin: .6rem 0 .1rem; line-height: 1; }
        .price-card.featured .price-amount { color: white; }
        .price-period { font-size: .78rem; color: var(--text-light); margin-bottom: 1.2rem; }
        .price-card.featured .price-period { color: rgba(255,255,255,.45); }
        .price-features { list-style: none; margin-bottom: 1.6rem; }
        .price-features li { font-size: .84rem; color: var(--text-mid); padding: .38rem 0; border-bottom: 1px solid var(--cream-dark); display: flex; align-items: center; gap: .5rem; }
        .price-card.featured .price-features li { color: rgba(255,255,255,.72); border-color: rgba(255,255,255,.1); }
        .price-features li::before { content: "✓"; color: var(--success); font-weight: 700; }
        .price-card.featured .price-features li::before { color: var(--gold-light); }
        .price-btn { width: 100%; padding: .8rem; border-radius: 100px; font-size: .88rem; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif; border: none; transition: all .2s; }
        .btn-outline { background: transparent; color: var(--navy); border: 1.5px solid rgba(15,31,56,.25)!important; }
        .btn-outline:hover { background: white; transform: translateY(-1px); }
        .btn-solid { background: var(--accent); color: white; box-shadow: 0 4px 16px rgba(46,125,247,.35); }
        .btn-solid:hover { background: var(--accent-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(46,125,247,.4); }
        .price-annual-note { font-size: .72rem; color: var(--text-light); text-align: center; margin-top: .5rem; }
        .price-card.featured .price-annual-note { color: rgba(255,255,255,.35); }
        .price-tagline { font-size: .78rem; color: var(--text-light); margin-bottom: 1.1rem; line-height: 1.4; }
        .price-card.featured .price-tagline { color: rgba(255,255,255,.45); }

        /* COMPARISON TABLE */
        .compare-wrap { max-width: 820px; margin: 3.5rem auto 0; }
        .compare-label { text-align: center; font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-light); margin-bottom: 1.2rem; }
        .compare-table-scroll { overflow-x: auto; border-radius: 16px; box-shadow: 0 2px 24px rgba(15,31,56,.07); border: 1.5px solid rgba(15,31,56,.07); }
        .compare-table { width: 100%; border-collapse: collapse; background: #fff; font-size: .84rem; }
        .compare-table thead tr { background: var(--navy); }
        .compare-table thead th { padding: .95rem 1rem; color: rgba(255,255,255,.6); font-weight: 600; font-size: .78rem; letter-spacing: .04em; text-align: center; }
        .compare-table thead th:first-child { text-align: left; color: rgba(255,255,255,.4); font-size: .72rem; }
        .compare-col-featured { background: rgba(46,125,247,.06); }
        thead .compare-col-featured { background: var(--accent) !important; color: white !important; }
        .compare-price-hint { font-size: .72rem; font-weight: 400; opacity: .7; display: block; margin-top: .1rem; }
        .compare-feature-col { width: 36%; }
        .compare-table tbody tr { border-bottom: 1px solid rgba(15,31,56,.05); transition: background .15s; }
        .compare-table tbody tr:last-child { border-bottom: none; }
        .compare-table tbody tr:hover { background: #f8f9ff; }
        .compare-feature-name { padding: .8rem 1rem; color: var(--text-dark); font-weight: 500; text-align: left; }
        .compare-table tbody td { padding: .8rem 1rem; text-align: center; color: var(--text-mid); }
        .compare-check { color: #16a34a; font-weight: 700; font-size: 1rem; }
        .compare-dash { color: #d1d5db; font-weight: 400; }
        .compare-col-featured.compare-check { color: var(--accent); }

        /* FEATURE EXPLAINERS */
        .feature-explainers { max-width: 820px; margin: 2.5rem auto 0; display: flex; flex-direction: column; gap: 1.2rem; }
        .explainer-card { display: flex; gap: 1.2rem; background: #fff; border: 1.5px solid rgba(15,31,56,.07); border-radius: 16px; padding: 1.6rem; box-shadow: 0 2px 16px rgba(15,31,56,.05); }
        .explainer-icon { font-size: 1.8rem; flex-shrink: 0; width: 2.4rem; text-align: center; margin-top: .1rem; }
        .explainer-body { flex: 1; }
        .explainer-title { font-weight: 700; font-size: .95rem; color: var(--navy); margin-bottom: .4rem; }
        .explainer-sub { font-size: .84rem; color: var(--text-mid); line-height: 1.55; margin-bottom: 1rem; }
        .explainer-tiers { display: flex; flex-direction: column; gap: .8rem; }
        .explainer-tier { display: flex; gap: .9rem; align-items: flex-start; }
        .explainer-tier-badge { font-size: .68rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; padding: .25rem .75rem; border-radius: 100px; white-space: nowrap; flex-shrink: 0; margin-top: .1rem; }
        .starter-badge { background: rgba(15,31,56,.08); color: var(--navy); }
        .pro-badge { background: rgba(46,125,247,.12); color: var(--accent); }
        .agency-badge { background: rgba(200,169,110,.18); color: #8a6a28; }
        .explainer-tier-desc { font-size: .83rem; color: var(--text-mid); line-height: 1.55; }
        .explainer-tier-desc em { font-style: italic; }
        .explainer-tier-desc strong { color: var(--navy); }

        /* TESTIMONIALS */
        .testi-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: 1.3rem; max-width: 860px; margin: 0 auto; }
        .testi { background: var(--white); border-radius: 14px; padding: 1.6rem; border: 1px solid var(--cream-dark); }
        .testi-stars { color: var(--star); letter-spacing: 2px; margin-bottom: .8rem; }
        .testi-text { font-size: .88rem; color: var(--text-dark); line-height: 1.7; margin-bottom: 1rem; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: .7rem; }
        .testi-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--navy); display: flex; align-items: center; justify-content: center; font-family: 'Instrument Serif', serif; font-size: 1rem; color: var(--gold-light); flex-shrink: 0; }
        .testi-name { font-size: .84rem; font-weight: 600; color: var(--navy); }
        .testi-role { font-size: .74rem; color: var(--text-light); }

        /* CTA */
        .cta { padding: 6rem 2rem; text-align: center; background: var(--navy); position: relative; overflow: hidden; }
        .cta-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 60% at 50% 50%,rgba(46,125,247,.15) 0%,transparent 70%); }
        .cta h2 { font-family: 'Instrument Serif', serif; font-size: clamp(1.9rem,3.5vw,3rem); color: white; letter-spacing: -.02em; margin-bottom: .9rem; position: relative; z-index: 1; }
        .cta p { color: rgba(255,255,255,.55); font-size: .95rem; margin-bottom: 2.2rem; position: relative; z-index: 1; }
        .cta-btn { background: var(--accent); color: white; border: none; padding: .95rem 2.3rem; border-radius: 100px; font-size: .95rem; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all .2s; position: relative; z-index: 1; box-shadow: 0 4px 20px rgba(46,125,247,.4); }
        .cta-btn:hover { background: var(--accent-light); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(46,125,247,.45); }
        .cta-note { color: rgba(255,255,255,.3); font-size: .76rem; margin-top: .9rem; position: relative; z-index: 1; }
        .guarantee-row { display: flex; align-items: center; justify-content: center; gap: .5rem; margin-top: 1.4rem; position: relative; z-index: 1; }
        .guarantee-badge { display: inline-flex; align-items: center; gap: .4rem; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 100px; padding: .35rem .9rem; font-size: .76rem; color: rgba(255,255,255,.5); }

        footer { background: #0a1628; padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-family: 'Instrument Serif', serif; font-size: 1.5rem; font-weight: 400; letter-spacing: -.02em; color: white; }
        .footer-logo span { color: var(--accent); }
        footer p { color: rgba(255,255,255,.3); font-size: .78rem; }

        /* Improvement 1: Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(10,20,40,.65); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: overlayIn .2s ease both; }
        .modal { background: var(--white); border-radius: 18px; padding: 2.5rem; max-width: 420px; width: 100%; position: relative; box-shadow: 0 24px 80px rgba(10,20,40,.35); animation: modalIn .25s ease both; }
        .modal-wide { max-width: 720px; }
        .signup-plans { display: grid; grid-template-columns: repeat(3,1fr); gap: .9rem; margin: 1.4rem 0; }
        .signup-plan { border: 2px solid var(--cream-dark); border-radius: 14px; padding: 1.3rem 1rem; cursor: pointer; transition: all .18s; background: var(--cream); text-align: center; position: relative; }
        .signup-plan:hover { border-color: var(--accent); background: rgba(46,125,247,.03); transform: translateY(-2px); }
        .signup-plan.selected { border-color: var(--accent); background: rgba(46,125,247,.06); box-shadow: 0 0 0 3px rgba(46,125,247,.15); }
        .signup-plan.popular-pick { border-color: var(--navy); background: var(--navy); }
        .signup-plan.popular-pick:hover { border-color: var(--blue); transform: translateY(-2px); }
        .signup-plan.popular-pick.selected { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(46,125,247,.25); }
        .signup-popular-tag { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--navy); font-size: .6rem; font-weight: 700; padding: .15rem .7rem; border-radius: 100px; white-space: nowrap; letter-spacing: .05em; text-transform: uppercase; }
        .signup-plan-name { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-light); margin-bottom: .3rem; }
        .signup-plan.popular-pick .signup-plan-name { color: rgba(255,255,255,.5); }
        .signup-plan-price { font-family: 'Instrument Serif', serif; font-size: 2rem; color: var(--navy); line-height: 1; }
        .signup-plan.popular-pick .signup-plan-price { color: white; }
        .signup-plan-period { font-size: .7rem; color: var(--text-light); margin-bottom: .8rem; }
        .signup-plan.popular-pick .signup-plan-period { color: rgba(255,255,255,.4); }
        .signup-plan-features { list-style: none; text-align: left; margin-bottom: 0; }
        .signup-plan-features li { font-size: .75rem; color: var(--text-mid); padding: .25rem 0; display: flex; align-items: flex-start; gap: .4rem; }
        .signup-plan.popular-pick .signup-plan-features li { color: rgba(255,255,255,.7); }
        .signup-plan-features li::before { content: "✓"; color: var(--success); font-weight: 700; flex-shrink: 0; }
        .signup-plan.popular-pick .signup-plan-features li::before { color: var(--gold-light); }
        .signup-step-back { background: none; border: none; color: var(--text-light); font-size: .82rem; cursor: pointer; display: flex; align-items: center; gap: .3rem; margin-bottom: 1rem; padding: 0; transition: color .15s; }
        .signup-step-back:hover { color: var(--navy); }
        .signup-selected-badge { display: inline-flex; align-items: center; gap: .5rem; background: rgba(46,125,247,.08); border: 1px solid rgba(46,125,247,.2); border-radius: 100px; padding: .3rem .9rem; font-size: .8rem; font-weight: 600; color: var(--accent); margin-bottom: 1.2rem; }
        @media(max-width:640px) { .signup-plans { grid-template-columns: 1fr; } .modal-wide { padding: 1.5rem; } }
        .modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-light); line-height: 1; padding: .25rem; }
        .modal-close:hover { color: var(--navy); }
        .modal-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.2rem; }
        .modal h3 { font-family: 'Instrument Serif', serif; font-size: 1.55rem; color: var(--navy); margin-bottom: .4rem; letter-spacing: -.02em; }
        .modal-sub { font-size: .88rem; color: var(--text-mid); line-height: 1.6; margin-bottom: 1.5rem; }
        .modal-field { margin-bottom: .9rem; }
        .modal-field label { display: block; font-size: .72rem; font-weight: 600; color: var(--text-mid); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .35rem; }
        .modal-field input { width: 100%; padding: .75rem 1rem; border: 1.5px solid var(--cream-dark); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: .92rem; color: var(--text-dark); outline: none; transition: border-color .2s; }
        .modal-field input:focus { border-color: var(--accent); }
        .modal-submit { width: 100%; background: var(--navy); color: white; border: none; padding: .9rem; border-radius: 100px; font-size: .92rem; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif; margin-top: .4rem; transition: all .2s; box-shadow: 0 4px 16px rgba(15,31,56,.25); }
        .modal-submit:hover { background: var(--blue); transform: translateY(-1px); }
        .modal-fine { font-size: .72rem; color: var(--text-light); text-align: center; margin-top: .8rem; }
        .modal-success { text-align: center; padding: 1rem 0; }
        .modal-success-icon { font-size: 2.8rem; margin-bottom: .8rem; }
        .modal-success h3 { font-family: 'Instrument Serif', serif; font-size: 1.5rem; color: var(--navy); margin-bottom: .5rem; }
        .modal-success p { font-size: .88rem; color: var(--text-mid); line-height: 1.6; }

        @media(max-width:640px) {
          nav { padding: 0.4rem 0.8rem 0.4rem 1.2rem; width: calc(100% - 24px); border-radius: 100px; }
          .nav-links { display: none; }
          .demo-grid { grid-template-columns: 1fr; }
          .history-card { grid-template-columns: 1fr; }
          footer { flex-direction: column; text-align: center; }
          .why-grid { grid-template-columns: 1fr !important; }
          .beforeafter-grid { grid-template-columns: 1fr !important; }
          /* Hide floating hero badges — they overlap text on mobile */
          .float-card { display: none !important; }
          /* Section padding tighter on mobile */
          .section { padding: 4rem 1.25rem !important; }
          /* Hero heading smaller on very small screens */
          h1 { font-size: clamp(2rem, 8vw, 2.8rem) !important; }
          .hero-sub { font-size: .93rem; }
          .hero-stats { gap: 1.5rem; margin-top: 2rem; }
          /* Demo cta banner: stack vertically */
          .demo-cta-banner { flex-direction: column; border-radius: 14px; text-align: center; gap: .4rem; padding: .9rem 1rem; }
          /* Compare table: compact on mobile */
          .compare-table { font-size: .72rem; }
          .compare-table thead th, .compare-table tbody td { padding: .6rem .45rem; }
          /* Steps full width */
          .steps { grid-template-columns: 1fr; }
          /* Testimonials full width */
          .testi-grid { grid-template-columns: 1fr; }
          /* Pricing grid full width */
          .pricing-grid { grid-template-columns: 1fr; }
          /* Section title smaller */
          .section-title { font-size: clamp(1.6rem, 7vw, 2.2rem) !important; }
          /* CTA section padding */
          .cta { padding: 4rem 1.5rem !important; }
          .cta h2 { font-size: clamp(1.6rem, 6vw, 2.2rem) !important; }
        }
        /* Site background — static gradient, NO fixed attachment (causes scroll lag) */
        body { background: linear-gradient(160deg, #f0f4ff 0%, #f8f5ef 45%, #f5f0ff 100%); }
        /* Step cards — solid white, no blur (blur on scrolling elements = lag) */
        .step { background:#fff !important; border:1px solid rgba(200,169,110,0.18) !important; box-shadow:0 4px 24px rgba(15,31,56,0.07) !important; }
        /* Testimonial cards */
        .testi { background:#fff !important; border:1px solid rgba(200,169,110,0.15) !important; }
        /* Price cards — only override non-featured; featured stays navy */
        .price-card:not(.featured) { background:#fff !important; border:1px solid rgba(15,31,56,0.08) !important; }
        /* G review section bg */
        .g-review-section { background:rgba(255,255,255,0.7) !important; }
        .g-card { background:#fff !important; }
      `}</style>

      {/* Signup Modal — 4 Steps */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className={`modal${planStep === 1 ? " modal-wide" : ""}`}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>

            {/* Step indicator */}
            {planStep > 1 && (
              <div style={{display:"flex",justifyContent:"center",gap:".5rem",marginBottom:"1.2rem"}}>
                {[1,2,3,4].map(s => (
                  <div key={s} style={{width:s===planStep?24:8,height:8,borderRadius:4,background:s<=planStep?"var(--navy)":"var(--cream-dark)",transition:"all .3s"}} />
                ))}
              </div>
            )}

            {/* ── STEP 1: PICK A PLAN ── */}
            {planStep === 1 && (
              <>
                <div style={{textAlign:"center",marginBottom:"1.2rem"}}>
                  <div className="modal-icon" style={{margin:"0 auto .9rem"}}>🚀</div>
                  <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.7rem",color:"var(--navy)",letterSpacing:"-.02em",marginBottom:".4rem"}}>Start your free 14-day trial</h3>
                  <p className="modal-sub" style={{margin:0}}>Pick the plan that fits your business. Card required — you won't be charged until after your 14-day trial.</p>
                </div>

                {/* Billing toggle */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".8rem",margin:"1rem 0"}}>
                  <span style={{fontSize:".85rem",fontWeight:annual?500:600,color:annual?"var(--text-mid)":"var(--navy)"}}>Monthly</span>
                  <label className="toggle-switch" style={{cursor:"pointer"}}>
                    <input type="checkbox" checked={annual} onChange={e => setAnnual(e.target.checked)} />
                    <span className="toggle-track" />
                    <span className="toggle-thumb" />
                  </label>
                  <span style={{fontSize:".85rem",fontWeight:annual?600:500,color:annual?"var(--navy)":"var(--text-mid)"}}>Annual</span>
                  {annual
                    ? <span className="save-badge">SAVE 15%</span>
                    : <span style={{fontSize:".75rem",color:"var(--text-light)",background:"var(--cream)",border:"1px solid var(--cream-dark)",borderRadius:"100px",padding:".18rem .65rem"}}>Save 15% yearly</span>
                  }
                </div>

                <div className="signup-plans">
                  {[
                    { name:"Starter", features:["Up to 50 reviews/mo","1 business location","AI responses · 4 preset tone styles","Monthly analytics report","Email support"] },
                    { name:"Pro",     features:["Unlimited reviews","Up to 3 locations","Expanded tone library & branding","Priority response (<1 min)","Monthly analytics report","Priority support"], popular:true },
                    { name:"Agency", features:["Unlimited reviews","Up to 10 locations","Expanded tone library per location","Priority response (<1 min)","Monthly analytics report","Dedicated support"] },
                  ].map((plan) => {
                    const mo = PRICES[plan.name].monthly;
                    const yr = PRICES[plan.name].annual;
                    const price = annual ? yr : mo;
                    return (
                      <div
                        key={plan.name}
                        className={`signup-plan${plan.popular ? " popular-pick" : ""}${selectedPlan === plan.name ? " selected" : ""}`}
                        onClick={() => { setSelectedPlan(plan.name); setPlanStep(2); }}
                      >
                        {plan.popular && <div className="signup-popular-tag">Most Popular</div>}
                        <div className="signup-plan-name">{plan.name}</div>
                        <div className="signup-plan-price">${price}</div>
                        <div className="signup-plan-period">
                          per month{annual && <span style={{display:"block",fontSize:".65rem",marginTop:".15rem",opacity:.7}}>(billed ${yr*12}/yr)</span>}
                        </div>
                        {annual && (
                          <div style={{fontSize:".68rem",marginBottom:".5rem",color:plan.popular?"rgba(255,255,255,.6)":"var(--success)",fontWeight:600}}>
                            Save ${(mo - yr) * 12}/yr
                          </div>
                        )}
                        <ul className="signup-plan-features">
                          {plan.features.map(f => <li key={f}>{f}</li>)}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <p className="modal-fine" style={{textAlign:"center"}}>14-day free trial · Card required, charged after trial · Cancel anytime</p>
              </>
            )}

            {/* ── STEP 2: CREATE ACCOUNT WITH GOOGLE ── */}
            {planStep === 2 && (
              <>
                <button className="signup-step-back" onClick={() => setPlanStep(1)}>← Back to plans</button>
                {selectedPlan && (
                  <div style={{textAlign:"center",marginBottom:".2rem"}}>
                    <span className="signup-selected-badge">✓ {selectedPlan} · ${annual ? PRICES[selectedPlan].annual : PRICES[selectedPlan].monthly}/mo · {annual ? "Annual" : "Monthly"}</span>
                  </div>
                )}
                <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
                  <div className="modal-icon" style={{margin:"0 auto .9rem"}}>
                    <svg width="28" height="28" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  </div>
                  <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.6rem",color:"var(--navy)",letterSpacing:"-.02em",marginBottom:".4rem"}}>Create your account</h3>
                  <p className="modal-sub" style={{margin:0}}>Sign in with Google to create your account and connect your Business Profile in one step.</p>
                </div>
                <div style={{background:"var(--cream)",borderRadius:12,padding:"1rem 1.2rem",marginBottom:"1.4rem"}}>
                  {[["1","Sign in with Google","Creates your ReplyRight account instantly"],["2","Grant profile access","Allow ReplyRight to read & reply to your reviews"],["3","Start your trial","Set up payment to begin your 14-day free trial"]].map(([n,title,desc]) => (
                    <div key={n} style={{display:"flex",gap:".9rem",alignItems:"flex-start",marginBottom:n==="3"?"0":".85rem"}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:"var(--navy)",color:"white",fontSize:".68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:".05rem"}}>{n}</div>
                      <div><div style={{fontSize:".85rem",fontWeight:600,color:"var(--navy)"}}>{title}</div><div style={{fontSize:".76rem",color:"var(--text-light)",marginTop:".1rem"}}>{desc}</div></div>
                    </div>
                  ))}
                </div>
                <button
                  className="modal-submit"
                  type="button"
                  onClick={() => {
                    document.cookie = `rr_signup=${encodeURIComponent(JSON.stringify({ plan: selectedPlan, billing: annual ? "annual" : "monthly" }))}; Path=/; SameSite=Lax; Max-Age=1800`;
                    window.location.href = process.env.NEXT_PUBLIC_MOCK_GOOGLE === "true" ? "/api/auth/mock-callback" : "/api/auth/google?flow=signup";
                  }}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".6rem",width:"100%"}}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <p className="modal-fine">Already have an account? <a href="/signin" style={{color:"var(--navy)",fontWeight:600,textDecoration:"none"}}>Sign in</a></p>
              </>
            )}

            {/* ── STEP 3: CONNECT GOOGLE ── */}
            {planStep === 3 && (
              <>
                <button className="signup-step-back" onClick={() => setPlanStep(2)}>← Back</button>
                {selectedPlan && (
                  <div style={{textAlign:"center",marginBottom:".2rem"}}>
                    <span className="signup-selected-badge">✓ {selectedPlan} · ${annual ? PRICES[selectedPlan].annual : PRICES[selectedPlan].monthly}/mo · {annual ? "Annual" : "Monthly"}</span>
                  </div>
                )}
                <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
                  <div className="modal-icon" style={{margin:"0 auto .9rem"}}>
                    <svg width="28" height="28" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  </div>
                  <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.6rem",color:"var(--navy)",letterSpacing:"-.02em",marginBottom:".4rem"}}>Connect your Google Business</h3>
                  <p className="modal-sub" style={{margin:0}}>Link your Google Business Profile so ReplyRight can read and respond to your reviews.</p>
                </div>
                <div style={{background:"var(--cream)",borderRadius:12,padding:"1rem 1.2rem",marginBottom:"1.4rem"}}>
                  {[["1","Sign in with Google","Uses your Google account linked to your Business Profile"],["2","Grant profile access","Allow ReplyRight to read & reply to your reviews"],["3","You're verified","We confirm access before you're charged"]].map(([n,title,desc]) => (
                    <div key={n} style={{display:"flex",gap:".9rem",alignItems:"flex-start",marginBottom:n==="3"?"0":".85rem"}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:"var(--navy)",color:"white",fontSize:".68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:".05rem"}}>{n}</div>
                      <div><div style={{fontSize:".85rem",fontWeight:600,color:"var(--navy)"}}>{title}</div><div style={{fontSize:".76rem",color:"var(--text-light)",marginTop:".1rem"}}>{desc}</div></div>
                    </div>
                  ))}
                </div>
                <a href={process.env.NEXT_PUBLIC_MOCK_GOOGLE === "true" ? "/api/auth/mock-callback" : "/api/auth/google?flow=signup"} style={{display:"block",textDecoration:"none"}}>
                  <button className="modal-submit" type="button" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".6rem",width:"100%"}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </a>
                <p className="modal-fine">We only access your Business Profile reviews — nothing else.</p>
              </>
            )}

            {/* ── STEP 4: PAYMENT ── */}
            {planStep === 4 && (
              <>
                <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
                  <div className="modal-icon" style={{margin:"0 auto .9rem"}}>💳</div>
                  <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.6rem",color:"var(--navy)",letterSpacing:"-.02em",marginBottom:".4rem"}}>Start your free trial</h3>
                  <p className="modal-sub" style={{margin:0}}>Review your plan and start your 14-day free trial. You won't be charged today.</p>
                </div>

                {/* Plan summary */}
                <div style={{background:"var(--cream)",borderRadius:12,padding:"1.2rem",marginBottom:"1rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".6rem"}}>
                    <span style={{fontSize:".9rem",fontWeight:600,color:"var(--navy)"}}>{selectedPlan} Plan</span>
                    <span style={{fontSize:"1.1rem",fontWeight:700,color:"var(--navy)"}}>${selectedPlan ? (annual ? PRICES[selectedPlan].annual : PRICES[selectedPlan].monthly) : 0}/mo</span>
                  </div>
                  <div style={{fontSize:".78rem",color:"var(--text-light)",marginBottom:".8rem"}}>
                    {annual ? `Billed $${selectedPlan ? PRICES[selectedPlan].annual * 12 : 0}/year` : "Billed monthly"} · 14-day free trial
                  </div>
                  {!annual && selectedPlan && (
                    <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:8,padding:".6rem .8rem",cursor:"pointer"}} onClick={() => setAnnual(true)}>
                      <p style={{fontSize:".78rem",color:"var(--success)",margin:0,fontWeight:600}}>
                        💡 Switch to annual and save ${(PRICES[selectedPlan].monthly - PRICES[selectedPlan].annual) * 12}/year
                      </p>
                    </div>
                  )}
                </div>

                {/* Connected Google account */}
                {connectedGoogleUser && (
                  <div style={{background:"var(--cream)",borderRadius:12,padding:".9rem 1.2rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".8rem"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:"var(--navy)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".8rem",fontWeight:700,flexShrink:0}}>
                      {connectedGoogleUser.name?.[0] || "G"}
                    </div>
                    <div>
                      <div style={{fontSize:".85rem",fontWeight:600,color:"var(--navy)"}}>{connectedGoogleUser.name || "Google Account"}</div>
                      <div style={{fontSize:".75rem",color:"var(--text-light)"}}>{connectedGoogleUser.email || "Connected"}</div>
                    </div>
                    <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--success)",fontWeight:600}}>✓ Connected</span>
                  </div>
                )}

                <button
                  className="modal-submit"
                  onClick={() => startCheckout(selectedPlan)}
                  disabled={checkoutLoading}
                  style={{width:"100%",opacity:checkoutLoading?0.7:1,cursor:checkoutLoading?"not-allowed":"pointer"}}
                >
                  {checkoutLoading ? "Redirecting to checkout…" : "Start 14-Day Free Trial →"}
                </button>
                <p className="modal-fine">Your card won't be charged until after your 14-day trial. Cancel anytime.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu-overlay">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
          <button onClick={() => { scrollTo("why"); setMenuOpen(false); }}>Why It Works</button>
          <button onClick={() => { scrollTo("demo"); setMenuOpen(false); }}>Live Demo</button>
          <button onClick={() => { scrollTo("how"); setMenuOpen(false); }}>How It Works</button>
          <button onClick={() => { scrollTo("pricing"); setMenuOpen(false); }}>Pricing</button>
          <button onClick={() => { scrollTo("faq"); setMenuOpen(false); }}>FAQ</button>
          <a href="/signin" className="mobile-cta-pill" style={{textDecoration:"none",fontFamily:"'Poppins',sans-serif",fontWeight:600}}>Sign In</a>
          <button className="mobile-cta-pill" onClick={() => { openModal(); setMenuOpen(false); }}>Start Free Trial</button>
        </div>
      )}

      {/* NAV — floating glassmorphic pill */}
      <nav>
        <a href="/" className="logo" style={{letterSpacing:"-0.02em",fontFamily:"'Instrument Serif',serif",fontWeight:400,textDecoration:"none"}}>Reply<span>Right</span></a>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => scrollTo("why")}>Why It Works</button>
          <button className="nav-btn" onClick={() => scrollTo("demo")}>Live Demo</button>
          <button className="nav-btn" onClick={() => scrollTo("how")}>How It Works</button>
          <button className="nav-btn" onClick={() => scrollTo("pricing")}>Pricing</button>
          <button className="nav-btn" onClick={() => scrollTo("faq")}>FAQ</button>
          <a href="/signin" style={{ textDecoration: "none" }}>
            <button className="nav-btn" style={{ color: "rgba(15,31,56,0.65)" }}>Sign In</button>
          </a>
          <button className="nav-btn nav-cta" onClick={() => openModal()}
            style={{borderRadius:"100px",padding:".45rem 1.3rem",background:"var(--navy)",color:"white",border:"none",fontWeight:600,fontSize:".84rem",cursor:"pointer",transition:"all .2s",boxShadow:"0 2px 10px rgba(15,31,56,.18)"}}>
            Start Free Trial
          </button>
        </div>
        <button className="hamburger-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" style={{position:"relative",overflow:"hidden",background:"linear-gradient(160deg,#eef3ff 0%,#f8f5ef 60%,#f2eeff 100%)"}}>
        {/* Animated gradient background — pure CSS, zero GPU overhead */}
        <div className="hero-glow" />
        {/* Gradient overlay for readability */}
        <div style={{position:"absolute",inset:0,zIndex:1,background:"linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(248,245,239,0.72) 100%)"}} />
        {/* Floating decorative orbs (keep behind content) */}
        <div className="orb" style={{width:500,height:500,background:"rgba(46,125,247,.05)",top:"-120px",left:"-100px",zIndex:1}} />
        <div className="orb" style={{width:380,height:380,background:"rgba(200,169,110,.04)",bottom:"-80px",right:"-60px",animationDelay:"4s",zIndex:1}} />
        {/* Floating stat cards */}
        <div className="float-card float-card-1" style={{display:"flex",alignItems:"center",gap:".7rem",zIndex:4}}>
          <span style={{fontSize:"1.4rem"}}>⭐</span>
          <div><div style={{fontSize:".78rem",fontWeight:700,color:"var(--navy)"}}>Rating jumped 4.1→4.6</div><div style={{fontSize:".7rem",color:"var(--text-light)"}}>in a few months</div></div>
        </div>
        <div className="float-card float-card-2" style={{display:"flex",alignItems:"center",gap:".7rem",zIndex:4}}>
          <span style={{fontSize:"1.4rem"}}>⚡</span>
          <div><div style={{fontSize:".78rem",fontWeight:700,color:"var(--navy)"}}>Response in seconds</div><div style={{fontSize:".7rem",color:"var(--text-light)"}}>24/7, fully automatic</div></div>
        </div>
        <a href="/#pricing" style={{textDecoration:"none"}}>
          <div className="badge animate" style={{position:"relative",zIndex:3,cursor:"pointer"}}>
            <span className="badge-dot" />
            <span>New: Auto-respond now live for all plans</span>
            <span className="badge-pill">Learn more →</span>
          </div>
        </a>
        <h1 className="animate-2" style={{position:"relative",zIndex:3}}>Every review answered.<br /><em>Automatically.</em></h1>
        <p className="hero-sub animate-2" style={{position:"relative",zIndex:3}}>ReplyRight responds to every Google review your business receives — within minutes, with professional, personalized replies. No staff. No effort. No missed reviews.</p>
        <div className="hero-actions animate-3" style={{position:"relative",zIndex:3}}>
          <button className="btn-primary" onClick={() => openModal()}>Start Your Free Trial</button>
          <button className="btn-secondary" onClick={() => scrollTo("demo")}>
            See Live Demo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9m0 0L8 3.5M11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="hero-stats animate-3" style={{position:"relative",zIndex:3}}>
          {[["4.8★","Avg rating lift reported"],["Instant","Avg response time (Pro/Agency)"],["14,200+","Responses generated"]].map(([n,l],i) => (
            <div className="stat" key={l} style={{padding:"0 1.5rem",borderLeft:i>0?"1px solid var(--cream-dark)":"none"}}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
        {/* Improvement 3: Activity ticker */}
        <div className="ticker-wrap animate-3">
          <span className="ticker-dot" />
          <span className="ticker-text" key={tickerIdx}>{TICKER_ITEMS[tickerIdx]}</span>
        </div>
      </section>

      {/* DEMO */}
      <section className="section demo-section-bg" id="demo">
        <div className="section-label">Live Demo</div>
        <h2 className="section-title">Try it yourself — right now</h2>
        <p className="section-sub">Paste any Google review below and watch our AI generate a perfect, professional response in seconds. No signup required.</p>

        <div className="demo-cta-banner">
          <span className="demo-cta-icon">👇</span>
          <span className="demo-cta-text"><strong>It's live</strong> — type a review below and hit Generate. See exactly what your customers will get.</span>
        </div>

        <div className="demo-wrap">
          <div className="demo-bar">
            <div className="demo-dots">
              <div className="demo-dot" style={{background:"#ff5f57"}} />
              <div className="demo-dot" style={{background:"#febc2e"}} />
              <div className="demo-dot" style={{background:"#28c840"}} />
            </div>
            <div className="demo-bar-title">ReplyRight — Response Generator</div>
            <div className="demo-bar-live"><span className="demo-bar-live-dot" />LIVE</div>
          </div>
          <div className="demo-body">
            <div className="demo-grid">
              <div>
                <label className="field-label">Business Name</label>
                <input className="field-input" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="e.g. Mario's Italian Kitchen" />
              </div>
              <div>
                <label className="field-label">Business Type</label>
                <select className="field-select" value={bizType} onChange={e => {
                  const t = e.target.value;
                  setBizType(t);
                  const demo = DEMO_BY_TYPE[t] || DEMO_BY_TYPE.default;
                  setBizName(demo.name);
                  setReviewText(demo.review);
                  setResult(null);
                }}>
                  {BUSINESS_TYPE_OPTIONS.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Improvement 2: Tone selector */}
            <label className="field-label">Response Tone</label>
            <div className="tone-row">
              {[
                ["professional","Professional"],
                ["friendly","Friendly"],
                ["apologetic","Apologetic"],
                ["enthusiastic","Enthusiastic"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  className={`tone-pill${tone === val ? " active" : ""}`}
                  onClick={() => setTone(val)}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="field-label">Star Rating</label>
            <div className="stars-row">
              {[1,2,3,4,5].map(s => (
                <button key={s} className="star-btn" onClick={() => setStars(s)} style={{opacity: s <= stars ? 1 : 0.2, color: "#f59e0b"}}>★</button>
              ))}
            </div>

            <label className="field-label">Customer Review</label>
            <textarea className="field-textarea" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Paste the customer's review here..." style={{fontFamily:"'DM Sans', sans-serif",fontSize:".9rem",fontWeight:400}} />

            <button className="gen-btn" disabled={loading || !reviewText.trim()} onClick={generate}>
              {loading ? <><span>Generating</span>&nbsp;<span className="dots"><span/><span/><span/></span></> : "⚡ Generate AI Response — Free"}
            </button>

            {error && <div className="error-box">⚠️ {error}</div>}

            {result && (
              <div className="result-box">
                <div className="result-label">✓ Response Generated</div>
                <div className="result-text">{result}</div>
                <div className="result-actions">
                  <button className="copy-btn" onClick={copy}>{copied ? "Copied!" : "Copy Response"}</button>
                  <button className="regen-btn" onClick={generate}>Regenerate</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Improvement 4: Response history */}
        {history.length > 0 && (
          <div className="history-wrap">
            <div className="history-title">Your recent responses</div>
            <div className="history-grid">
              {history.map(h => (
                <div className="history-card" key={h.id}>
                  <div>
                    <div className="history-meta">
                      <strong>{h.bizName}</strong>
                      <span className="history-tone-badge">{h.tone}</span>
                    </div>
                    <div className="history-stars">{starLabel(h.stars)}</div>
                    <div className="history-review">"{h.reviewSnippet}"</div>
                    <div className="history-response">{h.response}</div>
                  </div>
                  <button className="history-copy" onClick={() => navigator.clipboard.writeText(h.response)}>Copy</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* GOOGLE REVIEW EXAMPLES */}
      <section className="g-review-section">
        <div className="section-label">See It In Action</div>
        <h2 className="section-title">What your customers actually see</h2>
        <p className="section-sub">Real Google reviews. Real AI-powered responses. Posted automatically within minutes.</p>

        <div className="g-review-grid">
          {/* Left column: Review cards */}
          <div style={{display:"flex",flexDirection:"column",gap:"1.2rem"}}>
            {/* 5-star review with response */}
            <div className="g-card">
              <div className="g-card-header">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces&fm=webp&q=75" alt="Sarah M" className="g-card-avatar" />
                <div>
                  <div className="g-card-name">Sarah Mitchell</div>
                  <div className="g-card-meta">Local Guide · 12 reviews</div>
                </div>
                <svg style={{marginLeft:"auto",flexShrink:0}} width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </div>
              <div className="g-card-stars">
                {"★★★★★".split("").map((s,i) => <span key={i} className="g-card-star">{s}</span>)}
              </div>
              <div className="g-card-text">
                Absolutely loved the food! The pasta was incredible and our server was so attentive. We'll definitely be coming back soon — already recommended it to friends.
              </div>
              <div className="g-card-response">
                <div className="g-card-response-header">
                  <span className="g-card-response-name">Response from Bella Vista</span>
                  <span className="g-card-response-time">· 3 minutes ago</span>
                </div>
                <div className="g-card-response-text">
                  Thank you so much, Sarah! We're absolutely thrilled you and your friends enjoyed the pasta — it's our chef's signature dish! We can't wait to welcome you back. See you soon! 🍝
                  <div style={{marginTop:".6rem",paddingTop:".6rem",borderTop:"1px solid rgba(0,0,0,.07)",fontSize:".78rem",color:"#5f6368",fontStyle:"italic"}}>— Marco, Owner · Bella Vista Ristorante</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:".5rem",flexWrap:"wrap"}}>
                  <div className="g-card-response-badge">⚡ Responded instantly by ReplyRight</div>
                  <div style={{fontSize:".7rem",fontWeight:600,color:"#7c3aed",background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:100,padding:".15rem .55rem"}}>✦ Pro — Custom Sign-Off</div>
                </div>
              </div>
            </div>

            {/* 2-star review with response */}
            <div className="g-card">
              <div className="g-card-header">
                <div className="g-card-avatar-placeholder" style={{background:"#ea4335"}}>J</div>
                <div>
                  <div className="g-card-name">James Thompson</div>
                  <div className="g-card-meta">3 reviews</div>
                </div>
                <svg style={{marginLeft:"auto",flexShrink:0}} width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </div>
              <div className="g-card-stars">
                {"★★☆☆☆".split("").map((s,i) => <span key={i} className={`g-card-star${s==="☆"?" empty":""}`}>{s==="☆"?"★":s}</span>)}
              </div>
              <div className="g-card-text">
                Waited 45 minutes for our food and it came out cold. Really disappointed with the experience tonight.
              </div>
              <div className="g-card-response">
                <div className="g-card-response-header">
                  <span className="g-card-response-name">Response from Bella Vista</span>
                  <span className="g-card-response-time">· 5 minutes ago</span>
                </div>
                <div className="g-card-response-text">
                  James, we sincerely apologize for the long wait and the quality of your meal. That's not the standard we hold ourselves to, and we're truly sorry your experience fell short. We'd love the opportunity to hear more — please don't hesitate to reach out to us directly.
                </div>
                <div className="g-card-response-badge">⚡ Responded by ReplyRight in 4 min</div>
              </div>
            </div>

            {/* 4-star review with response */}
            <div className="g-card">
              <div className="g-card-header">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&fm=webp&q=75" alt="Michael R" className="g-card-avatar" />
                <div>
                  <div className="g-card-name">Michael Rivera</div>
                  <div className="g-card-meta">Local Guide · 28 reviews</div>
                </div>
                <svg style={{marginLeft:"auto",flexShrink:0}} width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </div>
              <div className="g-card-stars">
                {"★★★★☆".split("").map((s,i) => <span key={i} className={`g-card-star${s==="☆"?" empty":""}`}>{s==="☆"?"★":s}</span>)}
              </div>
              <div className="g-card-text">
                Great haircut, really happy with the style. Only reason for 4 stars is parking was tough. But the team inside was super friendly and professional.
              </div>
              <div className="g-card-response">
                <div className="g-card-response-header">
                  <span className="g-card-response-name">Response from Studio K Salon</span>
                  <span className="g-card-response-time">· 1 minute ago</span>
                </div>
                <div className="g-card-response-text">
                  Thanks so much, Michael! So glad you love the new style and that our team took good care of you. We totally understand the parking frustration — we appreciate the honest feedback and we'll keep looking at ways to make that easier. Hope to see you again soon! 💈
                  <div style={{marginTop:".6rem",paddingTop:".6rem",borderTop:"1px solid rgba(0,0,0,.07)",fontSize:".78rem",color:"#5f6368",fontStyle:"italic"}}>— Sandra, Studio K Hair Salon</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:".5rem",flexWrap:"wrap"}}>
                  <div className="g-card-response-badge">⚡ Responded by ReplyRight in 1 min</div>
                  <div style={{fontSize:".7rem",fontWeight:600,color:"#7c3aed",background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:100,padding:".15rem .55rem"}}>✦ Pro — Custom Sign-Off</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Google Business Profile mockup */}
          <div style={{display:"flex",flexDirection:"column",gap:"1.2rem"}}>
            {/* GBP Card */}
            <div className="g-profile-card">
              <div className="g-profile-header">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=280&fit=crop&fm=webp&q=75" alt="Restaurant interior" />
                <div className="g-profile-overlay">
                  <div className="g-profile-biz-name">Bella Vista Ristorante</div>
                  <div className="g-profile-biz-type">Italian Restaurant</div>
                </div>
              </div>
              <div className="g-profile-body">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div className="g-profile-rating-row">
                    <div className="g-profile-rating">4.6</div>
                    <div className="g-profile-stars">★★★★★</div>
                    <div className="g-profile-count">(312 reviews)</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:".2rem"}}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                <div className="g-profile-info">
                  <span>📍 8421 Melrose Ave, Los Angeles, CA</span>
                  <span>🕐 Open · Closes 10 PM</span>
                  <span>📞 (323) 555-0187</span>
                  <span>🌐 bellavista-la.com</span>
                </div>
                <div className="g-profile-actions">
                  <div className="g-profile-action-btn primary">Directions</div>
                  <div className="g-profile-action-btn">Call</div>
                  <div className="g-profile-action-btn">Website</div>
                </div>
              </div>
            </div>

            {/* Before / After GBP cards */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem"}}>
              {/* BEFORE */}
              <div>
                <div style={{display:"flex",alignItems:"center",gap:".4rem",marginBottom:".5rem"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#dc2626"}} />
                  <span style={{fontSize:".7rem",fontWeight:700,color:"#dc2626",textTransform:"uppercase",letterSpacing:".08em"}}>Before</span>
                </div>
                <div className="g-profile-card">
                  <div className="g-profile-header" style={{height:100}}>
                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=200&fit=crop&fm=webp&q=75" alt="Restaurant" />
                    <div className="g-profile-overlay">
                      <div style={{fontSize:".85rem",fontWeight:700,color:"white"}}>Bella Vista</div>
                      <div style={{fontSize:".68rem",color:"rgba(255,255,255,.8)"}}>Italian Restaurant</div>
                    </div>
                  </div>
                  <div className="g-profile-body" style={{padding:".8rem 1rem"}}>
                    <div className="g-profile-rating-row">
                      <div className="g-profile-rating" style={{fontSize:"1.1rem"}}>4.1</div>
                      <div style={{display:"flex",gap:1,color:"#fbbc04",fontSize:".75rem"}}>★★★★☆</div>
                      <div className="g-profile-count" style={{fontSize:".7rem"}}>(164 reviews)</div>
                    </div>
                    <div style={{fontSize:".72rem",color:"#dc2626",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:".4rem .6rem",marginTop:".4rem"}}>
                      ⚠ 0% response rate
                    </div>
                  </div>
                </div>
              </div>

              {/* AFTER */}
              <div>
                <div style={{display:"flex",alignItems:"center",gap:".4rem",marginBottom:".5rem"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#16a34a"}} />
                  <span style={{fontSize:".7rem",fontWeight:700,color:"#16a34a",textTransform:"uppercase",letterSpacing:".08em"}}>After Using ReplyRight</span>
                </div>
                <div className="g-profile-card">
                  <div className="g-profile-header" style={{height:100}}>
                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=200&fit=crop&fm=webp&q=75" alt="Restaurant" />
                    <div className="g-profile-overlay">
                      <div style={{fontSize:".85rem",fontWeight:700,color:"white"}}>Bella Vista</div>
                      <div style={{fontSize:".68rem",color:"rgba(255,255,255,.8)"}}>Italian Restaurant</div>
                    </div>
                  </div>
                  <div className="g-profile-body" style={{padding:".8rem 1rem"}}>
                    <div className="g-profile-rating-row">
                      <div className="g-profile-rating" style={{fontSize:"1.1rem",color:"#16a34a"}}>4.6</div>
                      <div style={{display:"flex",gap:1,color:"#fbbc04",fontSize:".75rem"}}>★★★★★</div>
                      <div className="g-profile-count" style={{fontSize:".7rem"}}>(312 reviews)</div>
                    </div>
                    <div style={{fontSize:".72rem",color:"#16a34a",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:6,padding:".4rem .6rem",marginTop:".4rem"}}>
                      ✓ 100% response rate · &lt;3 min avg
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats callout */}
            <div style={{background:"var(--navy)",borderRadius:12,padding:"1.5rem",color:"white"}}>
              <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--accent-light)",marginBottom:".8rem"}}>What ReplyRight did</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                {[
                  ["4.1 → 4.6","Star rating"],
                  ["100%","Response rate"],
                  ["< 3 min","Avg reply time"],
                  ["+47%","More reviews"]
                ].map(([n,l]) => (
                  <div key={l}>
                    <div style={{fontFamily:"'Poppins',sans-serif",fontSize:"1.2rem",fontWeight:700,color:"white"}}>{n}</div>
                    <div style={{fontSize:".72rem",color:"rgba(255,255,255,.5)",marginTop:".1rem"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{textAlign:"center",marginTop:"3rem"}}>
          <p style={{color:"var(--text-mid)",fontSize:".92rem",marginBottom:"1.2rem"}}>Every review gets a thoughtful, personalized reply — automatically, 24/7.</p>
          <button className="btn-primary" onClick={() => openModal()}>Start Your Free Trial</button>
        </div>
      </section>

      <div className="divider" />

      {/* OWNER PHOTOS */}
      <section className="owners-section">
        <div className="orb" style={{width:400,height:400,background:"rgba(46,125,247,.08)",top:"-100px",right:"-80px",position:"absolute"}} />
        <div className="orb" style={{width:300,height:300,background:"rgba(200,169,110,.06)",bottom:"-60px",left:"-60px",position:"absolute",animationDelay:"3s"}} />
        <div className="owners-heading" style={{position:"relative",zIndex:1}}>Business owners who never miss a review</div>
        <p className="owners-sub" style={{position:"relative",zIndex:1}}>Join thousands of local businesses growing their reputation on autopilot</p>
        <div className="owners-row" style={{position:"relative",zIndex:1}}>
          {[
            {img:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=180&h=180&fit=crop&crop=faces&fm=webp&q=75",name:"Maria L.",biz:"Restaurant Owner"},
            {img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=faces&fm=webp&q=75",name:"James K.",biz:"Auto Repair"},
            {img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&h=180&fit=crop&crop=faces&fm=webp&q=75",name:"Priya S.",biz:"Dental Clinic"},
            {img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop&crop=faces&fm=webp&q=75",name:"Carlos M.",biz:"Gym Owner"},
            {img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&h=180&fit=crop&crop=faces&fm=webp&q=75",name:"Ashley T.",biz:"Hair Salon"},
            {img:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=180&h=180&fit=crop&crop=faces&fm=webp&q=75",name:"Derek W.",biz:"Hotel Manager"},
          ].map(o => (
            <div className="owner-card" key={o.name}>
              <img src={o.img} alt={o.name} className="owner-img" />
              <div className="owner-name">{o.name}</div>
              <div className="owner-biz">{o.biz}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"2.5rem",position:"relative",zIndex:1}}>
          <span className="shimmer-badge">★★★★★ &nbsp;Rated 4.9/5 by 200+ business owners</span>
        </div>
      </section>

      <div className="divider" />

      {/* PRICING */}
      <section className="section section-white" id="pricing">
        <div className="section-label">Pricing</div>
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-sub">Start free for 14 days. Card required — you won't be charged until your trial ends.</p>

        {/* Annual toggle */}
        <div className="pricing-toggle">
          <span className={`toggle-label${!annual ? " active" : ""}`}>Monthly</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={annual} onChange={e => setAnnual(e.target.checked)} />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
          </label>
          <span className={`toggle-label${annual ? " active" : ""}`}>Annual</span>
          {annual && <span className="save-badge">SAVE 15%</span>}
        </div>

        {/* Pricing cards */}
        <div className="pricing-grid">
          {[
            {name:"Starter",tagline:"Perfect for single-location small businesses.",features:["Up to 50 reviews/month","1 business location","AI responses · 4 preset tone styles","Standard response (within 1 hr)","Monthly analytics report","Email notifications","14-day free trial (card required)"],btn:"btn-outline",featured:false},
            {name:"Pro",tagline:"Unlimited reviews across up to 3 locations with full brand control.",features:["Unlimited reviews","Up to 3 business locations","Expanded tone library & branding","Priority response (<1 min)","Monthly analytics report","Priority support","14-day free trial (card required)"],btn:"btn-solid",featured:true,badge:"Most Popular"},
            {name:"Agency",tagline:"Manage multiple locations all under one account.",features:["Unlimited reviews","Up to 10 locations","Expanded tone library per location","Priority response (<1 min)","Monthly analytics report","Dedicated support","14-day free trial (card required)"],btn:"btn-outline",featured:false}
          ].map(c => {
            const monthlyPrice = PRICES[c.name].monthly;
            const annualPrice = PRICES[c.name].annual;
            const displayPrice = annual ? annualPrice : monthlyPrice;
            return (
              <div className={`price-card${c.featured?" featured":""}`} key={c.name}>
                {c.badge && <div className="price-badge">{c.badge}</div>}
                <div className="price-name">{c.name}</div>
                <div className="price-amount">${displayPrice}</div>
                <div className="price-period">{annual ? "per month, billed annually" : "per month"}</div>
                <div className="price-tagline">{c.tagline}</div>
                <ul className="price-features">{c.features.map(f => <li key={f}>{f}</li>)}</ul>
                <button className={`price-btn ${c.btn}`} onClick={() => openModal(c.name)}>
                  Get Started Free
                </button>
                {annual && <div className="price-annual-note">Save ${(monthlyPrice - annualPrice) * 12}/year vs monthly</div>}
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="compare-wrap">
          <div className="compare-label">Full Feature Comparison</div>
          <div className="compare-table-scroll">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="compare-feature-col">Feature</th>
                  <th>Starter<br/><span className="compare-price-hint">$29/mo</span></th>
                  <th className="compare-col-featured">Pro<br/><span className="compare-price-hint">$59/mo</span></th>
                  <th>Agency<br/><span className="compare-price-hint">$149/mo</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  {feature:"Reviews per month",        starter:"Up to 50",   pro:"Unlimited",   agency:"Unlimited"},
                  {feature:"Business locations",        starter:"1",          pro:"Up to 3",      agency:"Up to 10"},
                  {feature:"AI-generated responses",    starter:"✓",          pro:"✓",            agency:"✓"},
                  {feature:"Response tone options",     starter:"4 presets",  pro:"Expanded library", agency:"Expanded library per location"},
                  {feature:"Response speed",            starter:"Within 1 hr",    pro:"Instant",      agency:"Instant"},
                  {feature:"Monthly analytics report",  starter:"✓",          pro:"✓",            agency:"✓"},
                  {feature:"Custom branding & sign-off",starter:"—",          pro:"✓",            agency:"✓"},
                  {feature:"Support",                   starter:"Email",      pro:"Priority",     agency:"Dedicated"},
                  {feature:"14-day free trial (card required)",         starter:"✓",          pro:"✓",            agency:"✓"},
                ].map(row => (
                  <tr key={row.feature}>
                    <td className="compare-feature-name">{row.feature}</td>
                    <td className={row.starter==="✓"?"compare-check":row.starter==="—"?"compare-dash":""}>{row.starter}</td>
                    <td className={`compare-col-featured ${row.pro==="✓"?"compare-check":row.pro==="—"?"compare-dash":""}`}>{row.pro}</td>
                    <td className={row.agency==="✓"?"compare-check":row.agency==="—"?"compare-dash":""}>{row.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature explainers */}
        <div className="feature-explainers">
          {/* Tone explainer */}
          <div className="explainer-card">
            <div className="explainer-icon">🎙️</div>
            <div className="explainer-body">
              <div className="explainer-title">Response Tone — What's the difference?</div>
              <p className="explainer-sub">Every AI response sounds professional, friendly, and human. The difference is <em>how much control you have over the voice.</em></p>
              <div className="explainer-tiers">
                <div className="explainer-tier">
                  <div className="explainer-tier-badge starter-badge">Starter</div>
                  <div className="explainer-tier-desc">Choose from <strong>4 preset styles</strong> — Professional, Warm &amp; Friendly, Concise, or Enthusiastic. Great responses right out of the box.</div>
                </div>
                <div className="explainer-tier">
                  <div className="explainer-tier-badge pro-badge">Pro &amp; Agency</div>
                  <div className="explainer-tier-desc"><strong>Expanded tone library.</strong> Access a wider range of polished tone styles — from formal &amp; luxury to casual &amp; upbeat — plus set your business name sign-off and brand personality. More control, without the complexity of fully custom configuration.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="divider" />

      {/* BEFORE / AFTER */}
      <section className="section section-white" id="beforeafter">
        <div className="section-label">See The Difference</div>
        <h2 className="section-title">What silence looks like vs. ReplyRight</h2>
        <p className="section-sub">Every unanswered review is a missed opportunity. Here's what customers actually see.</p>
        <div className="beforeafter-grid" style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem"}}>
          {/* BEFORE */}
          <div style={{borderRadius:16,overflow:"hidden",boxShadow:"0 4px 24px rgba(15,31,56,0.08)"}}>
            <div style={{background:"#dc2626",padding:"0.8rem 1.5rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"0.8rem",fontWeight:700,color:"white",letterSpacing:"0.1em",textTransform:"uppercase"}}>✗ Without ReplyRight</span>
            </div>
            <div style={{background:"white",padding:"1.5rem"}}>
              <div style={{marginBottom:"1.2rem",paddingBottom:"1.2rem",borderBottom:"1px solid #f1f1f1"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:700,color:"#6b7280"}}>S</div>
                  <div>
                    <div style={{fontSize:"0.85rem",fontWeight:600,color:"#111"}}>Sarah M.</div>
                    <div style={{color:"#f59e0b",fontSize:"0.8rem"}}>★★★★★</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>2 weeks ago</div>
                </div>
                <p style={{fontSize:"0.88rem",color:"#374151",lineHeight:1.6}}>"Absolutely loved the food! The pasta was incredible and our server was so attentive. Will definitely be back soon!"</p>
                <div style={{marginTop:"0.8rem",padding:"0.7rem",background:"#fef2f2",borderRadius:8,border:"1px solid #fecaca"}}>
                  <p style={{fontSize:"0.78rem",color:"#dc2626",fontStyle:"italic"}}>⚠ No response from owner — 2 weeks later</p>
                </div>
              </div>
              <div style={{marginBottom:"1.2rem",paddingBottom:"1.2rem",borderBottom:"1px solid #f1f1f1"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:700,color:"#6b7280"}}>J</div>
                  <div>
                    <div style={{fontSize:"0.85rem",fontWeight:600,color:"#111"}}>James T.</div>
                    <div style={{color:"#f59e0b",fontSize:"0.8rem"}}>★★☆☆☆</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>1 month ago</div>
                </div>
                <p style={{fontSize:"0.88rem",color:"#374151",lineHeight:1.6}}>"Waited 45 minutes for our food and it came out cold. Really disappointed."</p>
                <div style={{marginTop:"0.8rem",padding:"0.7rem",background:"#fef2f2",borderRadius:8,border:"1px solid #fecaca"}}>
                  <p style={{fontSize:"0.78rem",color:"#dc2626",fontStyle:"italic"}}>⚠ No response from owner — potential customers see this and leave</p>
                </div>
              </div>
              <div style={{padding:"1rem",background:"#fef2f2",borderRadius:10,textAlign:"center"}}>
                <div style={{fontSize:"0.82rem",fontWeight:700,color:"#dc2626"}}>Result: Customers choose your competitor</div>
                <div style={{fontSize:"0.75rem",color:"#6b7280",marginTop:"0.3rem"}}>63% of customers say businesses never responded to their review</div>
              </div>
            </div>
          </div>
          {/* AFTER */}
          <div style={{borderRadius:16,overflow:"hidden",boxShadow:"0 4px 24px rgba(15,31,56,0.08)"}}>
            <div style={{background:"#16a34a",padding:"0.8rem 1.5rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"0.8rem",fontWeight:700,color:"white",letterSpacing:"0.1em",textTransform:"uppercase"}}>✓ With ReplyRight</span>
            </div>
            <div style={{background:"white",padding:"1.5rem"}}>
              <div style={{marginBottom:"1.2rem",paddingBottom:"1.2rem",borderBottom:"1px solid #f1f1f1"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:700,color:"#6b7280"}}>S</div>
                  <div>
                    <div style={{fontSize:"0.85rem",fontWeight:600,color:"#111"}}>Sarah M.</div>
                    <div style={{color:"#f59e0b",fontSize:"0.8rem"}}>★★★★★</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>2 weeks ago</div>
                </div>
                <p style={{fontSize:"0.88rem",color:"#374151",lineHeight:1.6}}>"Absolutely loved the food! The pasta was incredible and our server was so attentive. Will definitely be back soon!"</p>
                <div style={{marginTop:"0.8rem",padding:"0.9rem",background:"#f0fdf4",borderRadius:8,border:"1px solid #86efac"}}>
                  <div style={{fontSize:"0.72rem",fontWeight:700,color:"#16a34a",marginBottom:"0.4rem"}}>Owner responded · 3 minutes later</div>
                  <p style={{fontSize:"0.82rem",color:"#374151",lineHeight:1.6,fontStyle:"italic"}}>"Thank you so much Sarah! We're thrilled you enjoyed the pasta — it's our chef's pride! We can't wait to welcome you back. See you soon! 🍝"</p>
                </div>
              </div>
              <div style={{marginBottom:"1.2rem",paddingBottom:"1.2rem",borderBottom:"1px solid #f1f1f1"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:700,color:"#6b7280"}}>J</div>
                  <div>
                    <div style={{fontSize:"0.85rem",fontWeight:600,color:"#111"}}>James T.</div>
                    <div style={{color:"#f59e0b",fontSize:"0.8rem"}}>★★☆☆☆</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9ca3af"}}>1 month ago</div>
                </div>
                <p style={{fontSize:"0.88rem",color:"#374151",lineHeight:1.6}}>"Waited 45 minutes for our food and it came out cold. Really disappointed."</p>
                <div style={{marginTop:"0.8rem",padding:"0.9rem",background:"#f0fdf4",borderRadius:8,border:"1px solid #86efac"}}>
                  <div style={{fontSize:"0.72rem",fontWeight:700,color:"#16a34a",marginBottom:"0.4rem"}}>Owner responded · 5 minutes later</div>
                  <p style={{fontSize:"0.82rem",color:"#374151",lineHeight:1.6,fontStyle:"italic"}}>"James, we're truly sorry about your experience. A 45-minute wait is unacceptable and we take full responsibility. Please don't hesitate to reach out to us directly so we can learn more about your experience."</p>
                </div>
              </div>
              <div style={{padding:"1rem",background:"#f0fdf4",borderRadius:10,textAlign:"center"}}>
                <div style={{fontSize:"0.82rem",fontWeight:700,color:"#16a34a"}}>Result: Customers choose YOU</div>
                <div style={{fontSize:"0.75rem",color:"#6b7280",marginTop:"0.3rem"}}>97% of customers read owner responses before visiting</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:"2.5rem"}}>
          <p style={{color:"var(--text-mid)",fontSize:"0.95rem",marginBottom:"1.5rem"}}>ReplyRight generates responses like these automatically — for every review, within minutes, 24/7.</p>
          <button className="btn-primary" onClick={() => scrollTo("demo")}>See It In Action — Free Demo</button>
        </div>
      </section>

      <div className="divider" />

      {/* WHY IT WORKS */}
      <section className="section section-mesh" id="why">
        <div className="section-label">Backed By Research</div>
        <h2 className="section-title">Silence is costing you customers</h2>
        <p className="section-sub">The data is clear — businesses that respond to reviews rank higher, get more clicks, and convert more customers.</p>
        <div style={{maxWidth:900,margin:"0 auto 3rem",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1.5rem"}}>
          {[
            {stat:"97%", desc:"of customers read business responses before deciding to visit", color:"#2e7df7"},
            {stat:"20%", desc:"of your Google local ranking is now determined by review signals", color:"#0f1f38"},
            {stat:"126%", desc:"more traffic for businesses in Google top 3 local results", color:"#2e7df7"},
            {stat:"82%", desc:"of consumers say reviews are the #1 factor in their trust decision", color:"#0f1f38"},
          ].map(s => (
            <div key={s.stat} style={{background:"var(--cream)",borderRadius:14,padding:"2rem 1.5rem",textAlign:"center",border:"1px solid var(--cream-dark)"}}>
              <div style={{fontFamily:"'Instrument Serif', serif",fontSize:"3rem",fontWeight:700,color:s.color,lineHeight:1,marginBottom:"0.8rem"}}>{s.stat}</div>
              <div style={{fontSize:"0.84rem",color:"var(--text-mid)",lineHeight:1.6}}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="why-grid" style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
          {/* Card 1 — Google Rankings */}
          <div style={{background:"var(--navy)",borderRadius:16,overflow:"hidden",color:"white"}}>
            <div style={{position:"relative",height:180,overflow:"hidden"}}>
              <img src="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=180&fit=crop&fm=webp&q=75" alt="Google local search rankings" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(15,31,56,0.3) 0%, rgba(15,31,56,0.85) 100%)"}} />
              <div style={{position:"absolute",bottom:"1rem",left:"1.2rem",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#5b9bff"}}>Google Rankings</div>
            </div>
            <div style={{padding:"1.5rem 1.8rem 1.8rem"}}>
              <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.4rem",marginBottom:"0.8rem",lineHeight:1.2}}>Responding moves you up Google Search</h3>
              <p style={{fontSize:"0.88rem",color:"rgba(255,255,255,0.7)",lineHeight:1.8,marginBottom:"1rem"}}>Review signals now make up 20% of your local Google ranking — the fastest-growing ranking factor since 2023. Businesses responding to 80%+ of reviews see a 10–20% ranking boost in local search.</p>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"1rem",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",fontStyle:"italic"}}>Source: BrightLocal Local Search Ranking Factors 2026</div>
            </div>
          </div>
          {/* Card 2 — Consumer Psychology */}
          <div style={{background:"var(--cream)",borderRadius:16,overflow:"hidden",border:"1px solid var(--cream-dark)"}}>
            <div style={{position:"relative",height:180,overflow:"hidden"}}>
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=180&fit=crop&fm=webp&q=75" alt="Customer reading reviews" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(248,245,239,0.1) 0%, rgba(248,245,239,0.8) 100%)"}} />
              <div style={{position:"absolute",bottom:"1rem",left:"1.2rem",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--accent)"}}>Consumer Psychology</div>
            </div>
            <div style={{padding:"1.5rem 1.8rem 1.8rem"}}>
              <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.4rem",color:"var(--navy)",marginBottom:"0.8rem",lineHeight:1.2}}>Your response is an ad to every future customer</h3>
              <p style={{fontSize:"0.88rem",color:"var(--text-mid)",lineHeight:1.8,marginBottom:"1rem"}}>97% of people who read reviews also read the owner response. Your reply isn't just for the reviewer — it's a public message to every future customer deciding whether to trust you.</p>
              <div style={{borderTop:"1px solid var(--cream-dark)",paddingTop:"1rem",fontSize:"0.78rem",color:"var(--text-light)",fontStyle:"italic"}}>Source: ReviewTrackers Consumer Survey, LocaliQ</div>
            </div>
          </div>
          {/* Card 3 — Cost of Silence */}
          <div style={{background:"var(--cream)",borderRadius:16,overflow:"hidden",border:"1px solid var(--cream-dark)"}}>
            <div style={{position:"relative",height:180,overflow:"hidden"}}>
              <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=180&fit=crop&fm=webp&q=75" alt="Missed opportunity" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(248,245,239,0.1) 0%, rgba(248,245,239,0.8) 100%)"}} />
              <div style={{position:"absolute",bottom:"1rem",left:"1.2rem",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--accent)"}}>The Cost of Silence</div>
            </div>
            <div style={{padding:"1.5rem 1.8rem 1.8rem"}}>
              <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.4rem",color:"var(--navy)",marginBottom:"0.8rem",lineHeight:1.2}}>63% of businesses never respond. Don't be one of them.</h3>
              <p style={{fontSize:"0.88rem",color:"var(--text-mid)",lineHeight:1.8,marginBottom:"1rem"}}>63% of customers say a business never responded to their review. Every unanswered review signals to future customers that nobody is home. One unanswered 1-star review can cost up to 30 potential customers.</p>
              <div style={{borderTop:"1px solid var(--cream-dark)",paddingTop:"1rem",fontSize:"0.78rem",color:"var(--text-light)",fontStyle:"italic"}}>Source: ReviewTrackers, Harvard Business Review</div>
            </div>
          </div>
          {/* Card 4 — Revenue Impact */}
          <div style={{background:"var(--accent)",borderRadius:16,overflow:"hidden",color:"white"}}>
            <div style={{position:"relative",height:180,overflow:"hidden"}}>
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=180&fit=crop&fm=webp&q=75" alt="Business revenue growth" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(34,197,94,0.2) 0%, rgba(22,163,74,0.85) 100%)"}} />
              <div style={{position:"absolute",bottom:"1rem",left:"1.2rem",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.85)"}}>Revenue Impact</div>
            </div>
            <div style={{padding:"1.5rem 1.8rem 1.8rem"}}>
              <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.4rem",marginBottom:"0.8rem",lineHeight:1.2}}>Better reviews = measurable revenue growth</h3>
              <p style={{fontSize:"0.88rem",color:"rgba(255,255,255,0.85)",lineHeight:1.8,marginBottom:"1rem"}}>Positive Google review profiles are linked to up to 18% revenue growth. Customers spend 31% more with businesses that have excellent reviews. Top 3 local results get 126% more traffic than everyone else.</p>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.25)",paddingTop:"1rem",fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",fontStyle:"italic"}}>Source: SocialPilot, Podium Consumer Research, LocaliQ</div>
            </div>
          </div>
        </div>
        <div style={{maxWidth:700,margin:"3rem auto 0",textAlign:"center",padding:"2.5rem",background:"var(--navy)",borderRadius:16}}>
          <div style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.8rem",color:"white",lineHeight:1.3,marginBottom:"1rem"}}>"Businesses that respond to reviews rank higher, convert more customers, and earn more revenue — automatically."</div>
          <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)"}}>The science is settled. The only question is whether you are doing it.</div>
          <button className="cta-btn" style={{marginTop:"1.5rem"}} onClick={() => scrollTo("demo")}>See It Work — Free Demo Below</button>
        </div>
      </section>

      <div className="divider" />

      <section className="section section-cream dot-bg" id="how">
        <div className="section-label">Process</div>
        <h2 className="section-title">Set up once. Run forever.</h2>
        <p className="section-sub">Connect your Google Business profile in minutes and ReplyRight handles everything.</p>
        <div className="steps">
          {[
            {n:"01",img:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=200&fit=crop&fm=webp&q=75",alt:"Connect Google Business Profile",h:"Connect Your Profile",p:"Link your Google Business account in under 2 minutes. No technical skills required."},
            {n:"02",img:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=200&fit=crop&fm=webp&q=75",alt:"Set your brand tone and voice",h:"Set Your Tone",p:"Choose your brand voice — formal, friendly, or anywhere in between."},
            {n:"03",img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=200&fit=crop&fm=webp&q=75",alt:"Automatic review responses",h:"Reviews Handled Automatically",p:"Every new review gets a thoughtful, personalized reply within minutes."},
            {n:"04",img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=200&fit=crop&fm=webp&q=75",alt:"Watch your ratings grow",h:"Watch Your Ratings Grow",p:"Businesses that respond get 45% more review volume. Your reputation builds itself."},
          ].map(({n,img,alt,h,p}) => (
            <div className="step" key={n} style={{padding:0,overflow:"hidden"}}>
              <div style={{position:"relative",height:160,overflow:"hidden"}}>
                <img src={img} alt={alt} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(15,31,56,0.15) 0%,rgba(15,31,56,0.6) 100%)"}} />
                <div style={{position:"absolute",top:"1rem",left:"1.2rem",fontFamily:"'Instrument Serif',serif",fontSize:"2rem",fontWeight:700,color:"rgba(255,255,255,0.9)",lineHeight:1}}>{n}</div>
              </div>
              <div style={{padding:"1.4rem 1.5rem 1.8rem"}}>
                <h3 style={{fontSize:"1rem",fontWeight:700,color:"var(--navy)",marginBottom:"0.5rem"}}>{h}</h3>
                <p style={{fontSize:"0.88rem",color:"var(--text-mid)",lineHeight:1.7,margin:0}}>{p}</p>
              </div>
              <div className="step-bar" />
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* TESTIMONIALS */}
      <section className="section section-cream">
        <div className="section-label">Testimonials</div>
        <h2 className="section-title">Trusted by local businesses</h2>
        <p className="section-sub">Real owners. Real results.</p>
        <div className="testi-grid">
          {[
            {img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&fm=webp&q=75",name:"Marco D.",role:"Owner, Bella Vista Ristorante",text:"We went from responding to 20% of reviews to 100% overnight. Our rating went from 4.1 to 4.6 in just a few months. This pays for itself a hundred times over."},
            {img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces&fm=webp&q=75",name:"Sandra K.",role:"Owner, Studio K Hair Salon",text:"I used to dread opening Google reviews. Now I don't even think about it. The responses sound exactly like me — but better."},
            {img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces&fm=webp&q=75",name:"Rafael T.",role:"Operations Manager, TacoGroup",text:"I manage 6 locations. ReplyRight saves us hours every week and keeps our online presence professional across every location."}
          ].map(t => (
            <div className="testi accent-top" key={t.name}>
              <span className="testi-quote-mark">"</span>
              <p className="testi-text" style={{fontStyle:"italic",marginBottom:"1.2rem"}}>{t.text}</p>
              <div className="testi-author">
                <img src={t.img} alt={t.name} className="testi-avatar-img" />
                <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* FAQ */}
      <section id="faq" className="section section-cream">
        <div className="section-label">FAQ</div>
        <h2 className="section-title">Common questions</h2>
        <p className="section-sub">Everything you need to know before getting started.</p>
        <div style={{maxWidth:680,margin:"0 auto",display:"flex",flexDirection:"column",gap:"1rem"}}>
          {[
            ["Will the responses sound like a robot wrote them?","No — that's the whole point. Our AI is trained to write responses that sound genuinely human, warm, and specific to each review. It references details the customer mentioned, matches your business type, and avoids generic phrases like 'We value your feedback.' Most customers can't tell the difference from a hand-written response."],
            ["Does ReplyRight post replies automatically?","Yes. Once you connect your Google Business Profile, ReplyRight detects new reviews and posts a personalized AI response automatically — no action needed on your part."],
            ["What happens if I get a really bad or complicated review?","ReplyRight handles 1-star reviews with extra care — apologizing sincerely, taking ownership, and inviting the customer to reach out directly. For unusual or sensitive reviews, you can use our approval mode (Pro plan) to review responses before they're posted."],
            ["Do I need any technical skills to set this up?","None at all. Here's the entire setup process: (1) Click 'Start Free Trial' and sign in with the Google account tied to your Google Business Profile. (2) Grant ReplyRight access to your Business Profile — this takes one click. (3) Select which business location to manage. That's it. No code, no configuration, no technical knowledge required. You'll be live in under 2 minutes."],
            ["Will this work for my type of business?","ReplyRight works for any business with a Google Business Profile — restaurants, hair salons, dental offices, auto repair shops, gyms, hotels, retail stores, medical clinics, and more. Our AI adapts its tone and language to match your specific industry."],
            ["What happens after my 14-day trial?","After your 14-day free trial, your card will be automatically charged for the plan you selected unless you cancel before the trial ends. You can cancel anytime from your account settings with no penalty — no charge, no questions asked."],
            ["Can I cancel anytime?","Yes, absolutely. No contracts, no cancellation fees. Cancel anytime from your account dashboard and your subscription ends at the close of your current billing period. If you cancel during your 14-day trial, you won't be charged anything."],
            ["How is this different from just using ChatGPT?","ChatGPT requires you to manually copy each review, write a prompt, generate a response, copy it back, and paste it into Google — every single time, for every review. ReplyRight connects directly to your Google Business Profile and does all of this automatically, the moment a new review comes in, 24/7. You never have to think about it."],
            ["Is my Google account data safe?","ReplyRight only requests access to your Business Profile reviews. We never access your personal Gmail, contacts, or other Google data."],
          ].map(([q,a],i) => (
            <FaqItem key={i} q={q} a={a} />
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section className="cta">
        <div className="cta-glow" />
        <h2>Your reputation deserves better<br />than silence.</h2>
        <p>Join hundreds of businesses responding to every review, automatically.</p>
        <button className="cta-btn" onClick={() => openModal()}>Start Your Free 14-Day Trial</button>
        <p className="cta-note">Cancel anytime · Setup in under 5 minutes</p>
        <div className="guarantee-row">
          <span className="guarantee-badge">🔒 Your data stays private</span>
          <span className="guarantee-badge">⭐ 4.9/5 customer rating</span>
        </div>
      </section>

      {/* Blog / Resources section */}
      <section className="section section-cream">
        <div className="section-label">Resources</div>
        <h2 className="section-title">Learn more about Google review management</h2>
        <p className="section-sub">Guides, tips, and strategies for getting the most out of your Google Business Profile.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1rem",maxWidth:1100,margin:"0 auto"}}>
          {[
            {href:"/blog/how-to-automatically-respond-to-google-reviews",badge:"Guide",title:"How to Automatically Respond to Google Reviews in 2026",time:"7 min read"},
            {href:"/blog/best-google-review-management-software-2026",badge:"Comparison",title:"Best Google Review Management Software in 2026",time:"9 min read"},
            {href:"/blog/why-responding-to-google-reviews-matters",badge:"Strategy",title:"Why Responding to Google Reviews Matters",time:"6 min read"},
            {href:"/blog/how-to-handle-negative-google-reviews",badge:"Guide",title:"How to Handle Negative Google Reviews",time:"8 min read"},
            {href:"/blog/google-reviews-seo-ranking",badge:"SEO",title:"Do Google Reviews Affect Your Search Ranking?",time:"6 min read"},
            {href:"/blog/review-response-templates",badge:"Templates",title:"50 Google Review Response Templates (Free)",time:"5 min read"},
          ].map((post,i) => (
            <a key={i} href={post.href} style={{background:"#fff",borderRadius:12,padding:"1.5rem",textDecoration:"none",display:"block",border:"1.5px solid #ece8e0",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"inline-block",background:"rgba(34,197,94,0.1)",color:"#16a34a",borderRadius:100,padding:"0.2rem 0.7rem",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.75rem"}}>{post.badge}</div>
              <div style={{fontSize:"0.92rem",fontWeight:700,color:"#0f1f38",lineHeight:1.4,marginBottom:"0.5rem"}}>{post.title}</div>
              <div style={{fontSize:"0.75rem",color:"#718096"}}>⏱ {post.time}</div>
            </a>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"2rem"}}>
          <a href="/blog" style={{display:"inline-block",border:"1.5px solid #0f1f38",color:"#0f1f38",textDecoration:"none",padding:"0.65rem 1.8rem",borderRadius:8,fontWeight:600,fontSize:"0.9rem"}}>View all articles →</a>
        </div>
      </section>

      <div className="divider" />

      <footer>
        <a href="/" className="footer-logo" style={{fontFamily:"'Instrument Serif',serif",fontWeight:400,fontSize:"1.5rem",letterSpacing:"-.02em",color:"white",textDecoration:"none"}}>Reply<span style={{color:"var(--accent)"}}>Right</span></a>
        <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
          <a href="/blog" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>Blog</a>
          <a href="/about" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>About</a>
          <a href="/for/restaurants" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>Restaurants</a>
          <a href="/for/agencies" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>Agencies</a>
          <a href="/compare/replyright-vs-chatgpt" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>vs ChatGPT</a>
          <a href="/privacy" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>Privacy Policy</a>
          <a href="/terms" style={{color:"rgba(255,255,255,.35)",fontSize:".78rem",textDecoration:"none"}}>Terms of Service</a>
          <button onClick={() => setShowContact(true)} style={{background:"none",border:"none",color:"rgba(255,255,255,.35)",fontSize:".78rem",cursor:"pointer",fontFamily:"'DM Sans', sans-serif",padding:0}}>Contact</button>
          <a href="/admin-login" style={{color:"rgba(255,255,255,.15)",fontSize:".72rem",textDecoration:"none"}}>Admin</a>
        </div>
        <p>© 2026 ReplyRight. All rights reserved.</p>
      </footer>

      {/* CONTACT MODAL */}
      {showContact && (
        <div onClick={e => { if(e.target===e.currentTarget) setShowContact(false); }} style={{position:"fixed",inset:0,background:"rgba(10,22,40,.7)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"1rem"}}>
          <div style={{background:"var(--white)",borderRadius:18,padding:"2.5rem",maxWidth:480,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,.3)",position:"relative",animation:"fadeUp .3s ease both"}}>
            <button onClick={() => setShowContact(false)} style={{position:"absolute",top:"1rem",right:"1.2rem",background:"none",border:"none",fontSize:"1.3rem",cursor:"pointer",color:"var(--text-light)",lineHeight:1}}>×</button>
            <div style={{marginBottom:"1.5rem"}}>
              <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:"1.8rem",color:"var(--navy)",marginBottom:".4rem"}}>Get in touch</h3>
              <p style={{fontSize:".88rem",color:"var(--text-mid)"}}>Questions, feedback, or need help? We're here.</p>
              <a href="mailto:Support@replyrightapp.com" style={{display:"inline-flex",alignItems:"center",gap:".4rem",marginTop:".6rem",fontSize:".82rem",color:"var(--accent)",textDecoration:"none",fontWeight:500}}>
                ✉ Support@replyrightapp.com
              </a>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div>
                <label style={{display:"block",fontSize:".72rem",fontWeight:600,color:"var(--text-mid)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".4rem"}}>Your Name</label>
                <input value={contactName} onChange={e=>setContactName(e.target.value)} placeholder="Jane Smith" style={{width:"100%",padding:".7rem .9rem",border:"1.5px solid var(--cream-dark)",borderRadius:8,fontFamily:"'DM Sans', sans-serif",fontSize:".9rem",color:"var(--text-dark)",background:"var(--cream)",outline:"none"}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--cream-dark)"} />
              </div>
              <div>
                <label style={{display:"block",fontSize:".72rem",fontWeight:600,color:"var(--text-mid)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".4rem"}}>Email Address <span style={{color:"#dc2626"}}>*</span></label>
                <input value={contactEmail} onChange={e=>setContactEmail(e.target.value)} placeholder="you@example.com" type="email" style={{width:"100%",padding:".7rem .9rem",border:"1.5px solid var(--cream-dark)",borderRadius:8,fontFamily:"'DM Sans', sans-serif",fontSize:".9rem",color:"var(--text-dark)",background:"var(--cream)",outline:"none"}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--cream-dark)"} />
              </div>
              <div>
                <label style={{display:"block",fontSize:".72rem",fontWeight:600,color:"var(--text-mid)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".4rem"}}>Message <span style={{color:"#dc2626"}}>*</span></label>
                <textarea value={contactMsg} onChange={e=>setContactMsg(e.target.value)} placeholder="How can we help?" rows={4} style={{width:"100%",padding:".7rem .9rem",border:"1.5px solid var(--cream-dark)",borderRadius:8,fontFamily:"'DM Sans', sans-serif",fontSize:".9rem",color:"var(--text-dark)",background:"var(--cream)",outline:"none",resize:"vertical"}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--cream-dark)"} />
              </div>
              <button onClick={sendContact} disabled={!contactEmail.trim()||!contactMsg.trim()} style={{background:"var(--navy)",color:"white",border:"none",padding:".88rem",borderRadius:8,fontFamily:"'DM Sans', sans-serif",fontSize:".92rem",fontWeight:600,cursor:"pointer",opacity:(!contactEmail.trim()||!contactMsg.trim()) ? 0.55 : 1,transition:"all .2s"}}>
                Open Email to Send →
              </button>
              <p style={{fontSize:".74rem",color:"var(--text-light)",textAlign:"center",marginTop:"-.3rem"}}>Clicking above opens your email app with your message pre-filled.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
