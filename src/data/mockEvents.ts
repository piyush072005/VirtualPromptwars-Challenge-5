import { EventPlan } from '../types/event';

export const INITIAL_EVENTS: EventPlan[] = [
  {
    id: 'event-wedding-1',
    name: "Anya & Liam's Boho Coastal Elegance",
    eventType: 'Wedding',
    date: '2026-09-18',
    time: '15:30',
    location: 'Cliffside Cove Pavilion, Big Sur, CA',
    guestCount: 120,
    demographics: 'Mix of close family (30-65) and university/creative peers (25-35)',
    setting: 'Hybrid',
    vibeTone: 'Boho Rustic Elegance with coastal organic textures, warm candlelight, and live acoustic melodies.',
    currency: '$',
    totalBudget: 42000,
    budgetItems: [
      { id: 'b-1', category: 'Venue & Infrastructure', name: 'Cliffside Pavilion Rental & Sound Permits', estimatedCost: 14000, actualCost: 13800, paid: true },
      { id: 'b-2', category: 'Catering & Bar', name: 'Farm-to-Table Plated Dinner & Artisanal Bar', estimatedCost: 12500, actualCost: 12900, paid: true },
      { id: 'b-3', category: 'Photography & Cinema', name: '8-Hour Golden Hour Dual Photographer & Drone', estimatedCost: 4500, actualCost: 4500, paid: true },
      { id: 'b-4', category: 'Florals & Botanical Decor', name: 'Pampas grass, eucalyptus arbors & hanging flora', estimatedCost: 3200, actualCost: 3450, paid: false },
      { id: 'b-5', category: 'Music & Sound', name: 'Live Acoustic Trio + Sunset DJ set', estimatedCost: 2800, actualCost: 2800, paid: true },
      { id: 'b-6', category: 'Attire & Beauty', name: 'Bridal gown alterations & artisan hair/makeup', estimatedCost: 1800, actualCost: 1650, paid: true },
      { id: 'b-7', category: 'Stationery & Favors', name: 'Hand-pressed linen invitations & seed-paper favors', estimatedCost: 1200, actualCost: 1100, paid: true },
      { id: 'b-8', category: 'Emergency Reserve', name: 'Unforeseen weather contingencies & overtime buffer', estimatedCost: 2000, actualCost: 0, paid: false, isContingency: true },
    ],
    macroMilestones: [
      { id: 'm-1', timeframe: 'T-6 months', title: 'Lock Venue & Core Catering Contract', description: 'Ensure date reservation and food tasting date finalized.', completed: true, priority: 'High' },
      { id: 'm-2', timeframe: 'T-3 months', title: 'Send Bespoke Linen Invitations & Track RSVPs', description: 'Monitor dietary restrictions (vegan, celiac) in online registry.', completed: true, priority: 'High' },
      { id: 'm-3', timeframe: 'T-1 month', title: 'Final Floral Mockups & Song Cue Sheet', description: 'Walk through processional song fade-outs with sound engineer.', completed: true, priority: 'Medium' },
      { id: 'm-4', timeframe: 'T-1 week', title: 'Final Guest Seating Chart & Vendor Load-in Window', description: 'Dispatch load-in schedules and emergency contact numbers to all vendors.', completed: false, priority: 'High' },
      { id: 'm-5', timeframe: 'Day Before', title: 'Rehearsal Walkthrough & Sunset Welcome Cocktails', description: 'Run through ceremony pacing at the cliffside arbor.', completed: false, priority: 'Medium' }
    ],
    dayOfItinerary: [
      { id: 't-1', time: '11:00 AM', title: 'Vendor Load-In & Tent Staging', durationMinutes: 120, owner: 'Lead Coordinator', status: 'Completed', notes: 'Check ocean breeze wind anchors on gazebo drapery.', category: 'Setup' },
      { id: 't-2', time: '01:30 PM', title: 'Bridal Party & Groom Portrait Session', durationMinutes: 90, owner: 'Photographer', status: 'Completed', notes: 'Focus on natural cliffside lighting before glare.', category: 'Program' },
      { id: 't-3', time: '03:15 PM', title: 'Guest Arrival & Citrus Lavender Welcome Drinks', durationMinutes: 30, owner: 'Catering Lead', status: 'Pending', notes: 'Acoustic guitar playing instrumental indie covers.', category: 'Ceremony' },
      { id: 't-4', time: '03:45 PM', title: 'Ceremony: Processional to Sunset Exchange', durationMinutes: 45, owner: 'Officiant', status: 'Pending', notes: 'Vow exchange timed right before coastal golden-hour cast.', category: 'Ceremony' },
      { id: 't-5', time: '04:30 PM', title: 'Golden Hour Cocktail Hour & Charcuterie', durationMinutes: 75, owner: 'Bar Staff', status: 'Pending', notes: 'Signature Smokey Mezcal cocktails served.', category: 'Reception' },
      { id: 't-6', time: '05:45 PM', title: 'Grand Entrance & First Dance under String Lights', durationMinutes: 30, owner: 'DJ / MC', status: 'Pending', notes: 'Cue low fog and warm bistro chandeliers.', category: 'Reception' },
      { id: 't-7', time: '06:15 PM', title: 'Dinner Service & Heartfelt Toasts', durationMinutes: 75, owner: 'Lead Coordinator', status: 'Pending', notes: '3 toasts limited to 3.5 minutes each.', category: 'Program' },
      { id: 't-8', time: '09:45 PM', title: 'Sparkler Grand Exit & Shuttle Boarding', durationMinutes: 30, owner: 'Lead Coordinator', status: 'Pending', notes: 'Shuttles departing for downtown Carmel hotel block.', category: 'Teardown' }
    ],
    vendors: [
      {
        id: 'v-1',
        category: 'Catering & Bar',
        name: 'Pacific Hearth Artisanal Kitchen',
        status: 'Hired',
        contactPerson: 'Chef Mateo Vance',
        phone: '+1 (831) 555-0192',
        email: 'mateo@pacifichearth.com',
        estimatedCost: 12500,
        vettedQuestions: [
          { question: 'What is your staffing ratio per table for plated courses?', answer: '1 server per 10 guests plus dedicated bar captain.' },
          { question: 'Are bar mixers, custom ice blocks, and compostable straws included?', answer: 'Yes, full zero-plastic bar package included.' },
          { question: 'Do you manage day-of trash removal from the venue grounds?', answer: 'Complete pack-in, pack-out organic waste compost managed.' }
        ],
        redFlagsToCheck: [
          { flag: 'Unclear service charge (20% admin fee not going to staff gratuity)', checked: true },
          { flag: 'Overtime penalty rate exceeding $250/hour for bar extension', checked: true },
          { flag: 'Exclusion of vendor meals for photographer & DJ team', checked: true }
        ],
        quotes: [
          { id: 'q-1', vendorName: 'Pacific Hearth Kitchen', quoteAmount: 12500, inclusions: ['Plated 3-course', 'Open craft bar', 'Staffing', 'Glassware'], pros: 'Wood-fired oven on-site, hyper-local ingredients', cons: 'Slightly higher premium on wine pairings', isSelected: true },
          { id: 'q-2', vendorName: 'Coastal Palate Catering', quoteAmount: 11200, inclusions: ['Family style dinner', 'Standard bar'], pros: 'Lower base price', cons: 'Additional $1,400 for bar glassware rental', isSelected: false }
        ],
        contractSigned: true
      },
      {
        id: 'v-2',
        category: 'Photography / Video',
        name: 'Loom & Lumen Cinematic',
        status: 'Hired',
        contactPerson: 'Elena Rostova',
        phone: '+1 (415) 555-8831',
        email: 'elena@loomlumen.photo',
        estimatedCost: 4500,
        vettedQuestions: [
          { question: 'Will you provide raw footage / unedited archives upon request?', answer: 'Full high-res digital gallery + 3-minute cinematic 4K trailer.' },
          { question: 'What is your dual-camera redundant backup protocol on-site?', answer: 'Dual SD-card slot simultaneous write + off-site cloud sync.' }
        ],
        redFlagsToCheck: [
          { flag: 'Vague delivery timeline exceeding 16 weeks post-event', checked: true },
          { flag: 'Hidden copyright surcharges for printing personal albums', checked: true }
        ],
        quotes: [
          { id: 'q-3', vendorName: 'Loom & Lumen Cinematic', quoteAmount: 4500, inclusions: ['8 Hours', '2 shooters', 'Drone footage', 'Express preview album'], pros: 'Stunning moody coastal portfolio, drone certified', cons: 'Booked 9 months out', isSelected: true }
        ],
        contractSigned: true
      },
      {
        id: 'v-3',
        category: 'Florist & Decor',
        name: 'Wild Fern & Drift Floral Studio',
        status: 'Contacted',
        contactPerson: 'Sienna Clark',
        phone: '+1 (831) 555-7310',
        email: 'hello@wildfernfloral.com',
        estimatedCost: 3200,
        vettedQuestions: [
          { question: 'Do you repurpose ceremony arbor installations for the reception sweetheart table?', answer: 'Yes! Crew transitions the arbor arch behind head table during cocktail hour.' },
          { question: 'Are ceramic vessels and candle hurricanes rental-only or keepsake?', answer: 'Rentals included with complimentary breakdown next morning.' }
        ],
        redFlagsToCheck: [
          { flag: 'Flower substitution clause without prior client approval', checked: false },
          { flag: 'Tear-down fee of $600 not itemized in preliminary quote', checked: false }
        ],
        quotes: [
          { id: 'q-4', vendorName: 'Wild Fern & Drift', quoteAmount: 3200, inclusions: ['Arbor arch', '12 Centerpieces', 'Bridal bouquets', 'Boutonnieres'], pros: 'Zero floral foam, sustainably grown local flora', cons: 'Requires deposit 60 days out', isSelected: true },
          { id: 'q-5', vendorName: 'Bloom & Petal Luxe', quoteAmount: 4100, inclusions: ['Full floral ceiling hanging', 'Arbor', 'Bouquets'], pros: 'Dramatic volume', cons: 'Exceeds target budget', isSelected: false }
        ],
        contractSigned: false
      }
    ],
    ideation: {
      themeTitle: 'Earthy Bohemian Twilight',
      vibeStatement: 'Effortlessly relaxed yet refined coastal romance, wrapped in organic linen, sea-mist sage, terracotta warmth, and amber candle glow.',
      colorPalette: [
        { hex: '#D97706', name: 'Terracotta Clay', usage: 'Linens, velvet lounge pillows, and ceramic bud vases' },
        { hex: '#4D7C0F', name: 'Coastal Sage', usage: 'Eucalyptus foliage, olive branch runner garlands' },
        { hex: '#FDF4FF', name: 'Bleached Parchment', usage: 'Raw-edge handmade paper invitations and table numbers' },
        { hex: '#78350F', name: 'Smoked Teakwood', usage: 'Cross-back farm chairs and natural drift tables' },
        { hex: '#E0E7FF', name: 'Sea Mist Blue', usage: 'Cocktail napkins and chiffon ribbon ties' }
      ],
      decorAndLighting: [
        { category: 'Ambient Lighting', suggestion: 'Suspended warm Edison festoon lights crisscrossing the open-air pavilion paired with 60+ glass pillar candles at varying heights along tables.', promptForVisuals: 'Warm dusk ambient festoon bistro lights crisscrossing rustic coastal wooden pavilion, glowing amber candles on wooden farm tables, fog rolling over ocean in background.' },
        { category: 'Ceremony Installation', suggestion: 'Asymmetrical double-circle arch woven with dried sun-bleached palms, pampas grass, king protea, and trailing ivory garden roses.', promptForVisuals: 'Asymmetrical circular driftwood arch with dried pampas grass, white garden roses, coastal cliff backdrop overlooking Pacific Ocean.' },
        { category: 'Lounge Vignette', suggestion: 'Rattan peacock chairs with kilim rugs, linen floor poufs, and brushed brass side tables for guest chillout between dances.', promptForVisuals: 'Boho wedding chillout lounge nook with vintage Turkish kilim rug, rattan peacock armchairs, and macrame accents.' }
      ],
      menuAndBeverages: {
        cocktails: [
          { name: 'Big Sur Mezcalita', type: 'Cocktail', ingredients: 'Smoked artisanal mezcal, freshly squeezed ruby grapefruit, lime, agave nectar, smoked volcanic black salt rim.', flavorNotes: 'Smokey, bright citrus with a mineral finish.' },
          { name: 'Lavender Coast Spritz', type: 'Mocktail', ingredients: 'Muddled culinary lavender, wild blackberry syrup, fresh lemon juice, topped with sparkling elderflower tonic.', flavorNotes: 'Floral, crisp, effervescent, and uplifting.' }
        ],
        cateringCourses: [
          { course: 'Passed Hors d’oeuvres', dishName: 'Dungeness Crab Crostini & Fig-Goat Cheese Tartlets', dietaryTags: ['Pescatarian', 'Vegetarian Options'], description: 'Crisp brioche round with fresh Monterey crab, lemon-chive aioli; warm goat cheese with caramelized mission figs.' },
          { course: 'Main Plated Course', dishName: 'Pan-Roasted Wild King Salmon & Wild Mushroom Polenta', dietaryTags: ['Gluten-Free', 'Dairy-Free Option'], description: 'Crispy skin salmon with Meyer lemon reduction over creamy organic corn polenta with roasted chanterelles.' },
          { course: 'Late Night Comfort', dishName: 'Gourmet S’mores Firepit & Truffle Fries', dietaryTags: ['Vegetarian', 'Comfort'], description: 'Housemade cinnamon marshmallows and dark chocolate sea-salt graham sandwiches toasted over stone firepits.' }
        ],
        pairings: [
          'Santa Lucia Highlands Pinot Noir with roasted salmon',
          'Crisp Edna Valley Sauvignon Blanc with passed appetizers',
          'French Oak Chardonnay alongside creamy polenta'
        ]
      },
      contentAndScripts: {
        invitationCopyFormal: 'Together with their families, Anya Hayes and Liam Bennett invite you to celebrate love, friendship, and new beginnings as they unite in marriage on Saturday, the 18th of September, at half past three in the afternoon.',
        invitationCopyCasual: 'We are getting married! Join us on the cliffs of Big Sur for vows, barefoot dancing, wood-fired feasts, and sunset toasts under the stars. Bring your heart and your best dancing shoes.',
        toastSpeechOutline: [
          { section: 'Opening Hook & Warm Welcome', talkingPoints: 'Thank traveling guests, acknowledge breathtaking scenery, joke about how the couple first met at a rainy coffee shop.', durationEstimate: '1.0 min' },
          { section: 'Anecdote: Liam’s Dedication to Anya', talkingPoints: 'Share a sweet personal story illustrating Liam’s steadfast calm and Anya’s infectious creative spark.', durationEstimate: '1.5 min' },
          { section: 'Tribute to Both Families', talkingPoints: 'Acknowledge parents and the welcoming warmth of both combined households.', durationEstimate: '1.0 min' },
          { section: 'The Toast & Clinking Glasses', talkingPoints: 'Offer blessing for decades of ocean sunsets, laughter, and unbreakable partnership. Raise glasses.', durationEstimate: '0.5 min' }
        ],
        signageText: [
          { signType: 'Welcome Board', text: 'Welcome to our beginning. Find your seat, grab a cocktail, and get ready to celebrate Anya & Liam.' },
          { signType: 'Bar Signature Sign', text: 'Love on the Rocks: Ask the bartender for our Big Sur Mezcalita or Lavender Coast Spritz.' },
          { signType: 'Unplugged Ceremony Sign', text: 'We invite you to be fully present with us. Please silence your phones and cameras until the reception.' }
        ]
      }
    },
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-01T15:30:00Z'
  },
  {
    id: 'event-birthday-2',
    name: "Neon Pulse: Marcus's Cyberpunk 30th",
    eventType: 'Milestone Birthday',
    date: '2026-11-14',
    time: '20:00',
    location: 'District 9 Sub-Basement Studio, Brooklyn, NY',
    guestCount: 65,
    demographics: 'Tech founders, artists, music producers, 26-38 age bracket',
    setting: 'Indoor',
    vibeTone: 'Cyberpunk Retro 30th — Neo-Tokyo synthwave, ultraviolet lasers, interactive projection mapping, and retro-arcade arcade cabinets.',
    currency: '$',
    totalBudget: 11500,
    budgetItems: [
      { id: 'b-201', category: 'Venue Rental', name: 'Industrial Warehouse Loft Rental (8-Hour Block)', estimatedCost: 3800, actualCost: 3800, paid: true },
      { id: 'b-202', category: 'AV & Laser Light Show', name: 'RGB Lasers, Haze Machines & Visual Projection Rig', estimatedCost: 2400, actualCost: 2600, paid: true },
      { id: 'b-203', category: 'Bar & Mixology', name: 'Glow-in-the-dark liquid nitrogen molecular bar', estimatedCost: 2100, actualCost: 2050, paid: true },
      { id: 'b-204', category: 'Music & DJs', name: 'Synthwave & Deep House Live Producer Set', estimatedCost: 1400, actualCost: 1400, paid: true },
      { id: 'b-205', category: 'Street Food Sliders & Dumplings', name: 'Tokyo-style Bao and Spicy Gyoza Station', estimatedCost: 1100, actualCost: 1050, paid: false },
      { id: 'b-206', category: 'Emergency Reserve', name: 'Spill damage deposit & security extension', estimatedCost: 700, actualCost: 0, paid: false, isContingency: true },
    ],
    macroMilestones: [
      { id: 'm-201', timeframe: 'T-3 months', title: 'Lock Loft Venue & Sound Ordinance Clearance', description: 'Confirm sub-bass decibel limits with building landlord.', completed: true, priority: 'High' },
      { id: 'm-202', timeframe: 'T-1 month', title: 'Curate Visual Projection Loops & DJ Lineup', description: 'Compile anime cyberpunk glitch visuals and 90s game loops.', completed: true, priority: 'Medium' },
      { id: 'm-203', timeframe: 'T-1 week', title: 'Molecular Bar Recipe Testing & Glow Cup Sourcing', description: 'Test tonic water quinine UV reaction under blacklights.', completed: true, priority: 'Medium' },
      { id: 'm-204', timeframe: 'Day Before', title: 'Cable Run Testing & Projector Alignment', description: 'Map visuals across concrete brick walls.', completed: false, priority: 'High' }
    ],
    dayOfItinerary: [
      { id: 't-201', time: '04:00 PM', title: 'Sound & Laser Truss Rigging', durationMinutes: 120, owner: 'AV Lead', status: 'Completed', notes: 'Safety check all truss rigging and haze fluid reservoirs.', category: 'Setup' },
      { id: 't-202', time: '07:30 PM', title: 'Bar Stocking & Ice Delivery', durationMinutes: 30, owner: 'Mixologist', status: 'Completed', notes: 'Dry ice safely packed in insulated chest.', category: 'Setup' },
      { id: 't-203', time: '08:00 PM', title: 'Doors Open / Neon Glow Accents Handout', durationMinutes: 60, owner: 'Door Host', status: 'Pending', notes: 'Guests receive UV reactive wristbands and cyberpunk glasses.', category: 'Reception' },
      { id: 't-204', time: '09:00 PM', title: 'DJ Opening Set: Chill Synthwave & Lo-Fi Beats', durationMinutes: 90, owner: 'DJ Synthia', status: 'Pending', notes: 'Bao sliders and gyoza trays circulating.', category: 'Program' },
      { id: 't-205', time: '10:30 PM', title: 'Surprise Laser Roast & Marcus 30th Birthday Tribute', durationMinutes: 20, owner: 'Best Friend / Host', status: 'Pending', notes: 'Drop bass and launch holographic visual reel.', category: 'Program' },
      { id: 't-206', time: '11:00 PM', title: 'Peak Electro Wave Dance Party', durationMinutes: 120, owner: 'Headlining Producer', status: 'Pending', notes: 'Full laser array and low fog burst.', category: 'Reception' }
    ],
    vendors: [
      {
        id: 'v-201',
        category: 'Music & DJ',
        name: 'Hypergrid Audio Productions',
        status: 'Hired',
        contactPerson: 'KAIRO (Producer)',
        phone: '+1 (718) 555-4091',
        email: 'kairo@hypergridbeats.io',
        estimatedCost: 1400,
        vettedQuestions: [
          { question: 'Do you provide twin 18-inch subwoofers suitable for concrete room resonance?', answer: 'Yes, dual QSC active subs tuned for industrial spaces.' },
          { question: 'Can you synchronize your MIDI triggers to the visual projection rig?', answer: 'Yes, MIDI clock sync sent via ethernet to resolume computer.' }
        ],
        redFlagsToCheck: [
          { flag: 'Demanding additional unvetted riders 48 hours prior', checked: true },
          { flag: 'Absence of backup CDJ players if controller crashes', checked: true }
        ],
        quotes: [
          { id: 'q-201', vendorName: 'Hypergrid Audio', quoteAmount: 1400, inclusions: ['4-hour DJ set', 'Dual Subwoofers', 'Booth Monitors'], pros: 'Resident at Brooklyn Mirage satellite parties', cons: 'Strict cutoff at 2 AM', isSelected: true }
        ],
        contractSigned: true
      }
    ],
    ideation: {
      themeTitle: 'Neon Syndicate: Neo-Tokyo 2099',
      vibeStatement: 'High-octane dystopian chic where retro synthwave nostalgia meets modern sensory overload, wrapped in electric magenta, cyan wireframe, and dark obsidian.',
      colorPalette: [
        { hex: '#EC4899', name: 'Cyber Magenta', usage: 'Laser wash lights and glowing cocktail garnishes' },
        { hex: '#06B6D4', name: 'Electric Cyan', usage: 'Wall wireframe grid tape and invitation graphics' },
        { hex: '#A855F7', name: 'Ultraviolet Purple', usage: 'Ambient room wash and blacklight glow areas' },
        { hex: '#020617', name: 'Obsidian Black', usage: 'Dark backdrop curtains and industrial stage' },
        { hex: '#EAB308', name: 'Arcade Neon Yellow', usage: 'Warning signs and drink tokens' }
      ],
      decorAndLighting: [
        { category: 'Visual Projection', suggestion: 'Multi-wall projection mapping with 80s anime cityscapes, Akira cyber-skylines, and retro glitch typography.', promptForVisuals: 'Cyberpunk industrial warehouse party with neon magenta lasers, wall projection mapping of futuristic Tokyo, guests wearing neon accessories.' },
        { category: 'Retro Arcade Lounge', suggestion: 'Two playable custom arcade cabinets running Street Fighter II and Galaga with LED coin doors.', promptForVisuals: 'Glowing vintage arcade machines in dim industrial club room with neon sign overhead.' }
      ],
      menuAndBeverages: {
        cocktails: [
          { name: 'The Neuromancer', type: 'Cocktail', ingredients: 'Empress 1908 indigo gin, yuzu liqueur, tonic water, garnished with edible silver luster dust.', flavorNotes: 'Citrus punch, shifts from deep blue to vibrant pink upon pouring tonic.' },
          { name: 'Neon Glitch Elixir', type: 'Mocktail', ingredients: 'Clarified dragon fruit syrup, cold-pressed lime juice, ginger beer, topped with glow stick stirrer.', flavorNotes: 'Tart, fizzy, and intensely magenta.' }
        ],
        cateringCourses: [
          { course: 'Street Food Station', dishName: 'Crispy Pork Belly Bao & Shiitake Truffle Dumplings', dietaryTags: ['Dairy-Free', 'Vegetarian Option'], description: 'Steamed lotus buns with hoisin glazed pork belly, scallions, and pickled cucumber; steamed dumplings with chili crisp.' }
        ],
        pairings: ['Japanese Asahi draft beer', 'Cold Junmai Ginjo Sake']
      },
      contentAndScripts: {
        invitationCopyFormal: 'Access Granted: You are invited to celebrate the 30th level unlock of Marcus Sterling. Location: District 9 Loft. Strict cyber-streetwear dress code. Entry password required at freight elevator.',
        invitationCopyCasual: 'Marcus is turning 30! We are taking over an underground Brooklyn warehouse for lasers, bao buns, synthwave, and high-frequency celebration. Dress futuristic, bring good energy.',
        toastSpeechOutline: [
          { section: 'Opening Broadcast', talkingPoints: 'Acknowledge Marcus entering the 30s milestone, comparison to leveling up in an RPG.', durationEstimate: '1.0 min' },
          { section: 'Memory Reel', talkingPoints: 'Highlight his creative resilience, late-night code jams, and loyalty as a friend.', durationEstimate: '1.5 min' },
          { section: 'The Countdown Toast', talkingPoints: 'Cue the DJ build-up, toast to the next decade of visionary adventures, drop the beat.', durationEstimate: '0.5 min' }
        ],
        signageText: [
          { signType: 'Elevator Checkpoint', text: 'DECK 30 RESTRICTED ACCESS. PRESENT QR CODE TO ENTER THE GRID.' },
          { signType: 'Bar Protocol', text: 'FUELING STATION: PLEASE HYDRATE RESPONSIBLY. CYBERNETICS ARE SENSITIVE TO SPILLS.' }
        ]
      }
    },
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z'
  },
  {
    id: 'event-community-3',
    name: "Oakwood Green Zero-Waste Harvest Fair",
    eventType: 'Community Festival / Fundraiser',
    date: '2026-10-10',
    time: '10:00',
    location: 'Oakwood Memorial Community Park, Portland, OR',
    guestCount: 450,
    demographics: 'Local neighborhood families, sustainable makers, volunteers of all generations',
    setting: 'Outdoor',
    vibeTone: 'Zero-Waste Neighborhood Cookout with organic cider press, live bluegrass band, artisan market stalls, and solar-powered sound.',
    currency: '$',
    totalBudget: 18500,
    budgetItems: [
      { id: 'b-301', category: 'City Permits & Waste Management', name: 'Park Special Event Permit, Health Inspector & Industrial Compost Bins', estimatedCost: 3200, actualCost: 3100, paid: true },
      { id: 'b-302', category: 'Solar Sound Stage & Folk Band', name: 'Mobile Solar Battery Stage & 4-Piece Bluegrass Band', estimatedCost: 4000, actualCost: 3900, paid: true },
      { id: 'b-303', category: 'Local Farm Harvest Feast', name: 'Locally grown heirloom squash soup, organic corn roast & fresh apple cider', estimatedCost: 5500, actualCost: 5650, paid: true },
      { id: 'b-304', category: 'Canopy Tents & Hay Bale Seating', name: 'Eco-canvas shade sails, picnic tables, and organic hay bales', estimatedCost: 2600, actualCost: 2500, paid: false },
      { id: 'b-305', category: 'Kids Ecology Zone & Pumpkin Carving', name: 'Seed bomb workshop, heirloom pumpkins, natural dyes', estimatedCost: 1400, actualCost: 1300, paid: true },
      { id: 'b-306', category: 'Emergency Weather & First Aid Contingency', name: 'Rain tarps, certified paramedic station, emergency water refill', estimatedCost: 1800, actualCost: 0, paid: false, isContingency: true },
    ],
    macroMilestones: [
      { id: 'm-301', timeframe: 'T-6 months', title: 'Submit Municipal Park & Sound Permits', description: 'City council review and park district clearance for open flames.', completed: true, priority: 'High' },
      { id: 'm-302', timeframe: 'T-3 months', title: 'Onboard 25 Local Artisan Food & Craft Vendors', description: 'Ensure all vendors adhere strictly to 100% compostable packaging.', completed: true, priority: 'High' },
      { id: 'm-303', timeframe: 'T-1 month', title: 'Recruit Volunteer Squad & Stage Logistics', description: 'Assign waste educator captains to every 3-stream sorting station.', completed: true, priority: 'Medium' },
      { id: 'm-304', timeframe: 'T-1 week', title: 'Final Weather Contingency Inspection', description: 'Confirm canopy tie-downs and accessible wheelchair pathways on grass.', completed: false, priority: 'High' }
    ],
    dayOfItinerary: [
      { id: 't-301', time: '06:30 AM', title: 'Vendor Load-In & Park Gate Opening', durationMinutes: 90, owner: 'Logistics Captain', status: 'Completed', notes: 'Keep vehicles on gravel path; no trucks on wet turf.', category: 'Setup' },
      { id: 't-302', time: '08:30 AM', title: 'Compost Station Staging & Signage Installation', durationMinutes: 60, owner: 'Eco-Volunteer Lead', status: 'Completed', notes: 'Mount educational diagrams above each bin.', category: 'Setup' },
      { id: 't-303', time: '10:00 AM', title: 'Gates Open: Cider Press Demonstration', durationMinutes: 60, owner: 'Master Gardener', status: 'Pending', notes: 'Free tastings served in compostable tasting cups.', category: 'Program' },
      { id: 't-304', time: '11:30 AM', title: 'Community Welcome Address & Fundraiser Kickoff', durationMinutes: 30, owner: 'Neighborhood Council President', status: 'Pending', notes: 'Announce community garden expansion goal.', category: 'Ceremony' },
      { id: 't-305', time: '12:00 PM', title: 'Live Bluegrass Set & Harvest Potluck Lunch', durationMinutes: 120, owner: 'The Pine Needle Trio', status: 'Pending', notes: 'Solar battery charge at 100%.', category: 'Reception' },
      { id: 't-306', time: '02:30 PM', title: 'Giant Pumpkin Weigh-Off & Pie Auction', durationMinutes: 60, owner: 'Auctioneer', status: 'Pending', notes: 'Proceeds benefit the urban youth farming program.', category: 'Program' },
      { id: 't-307', time: '04:00 PM', title: 'Eco-Audit: Final Waste Weigh-In & Pack-Out', durationMinutes: 90, owner: 'Sustainability Lead', status: 'Pending', notes: 'Targeting over 95% organic waste diversion.', category: 'Teardown' }
    ],
    vendors: [
      {
        id: 'v-301',
        category: 'Permits & Security',
        name: 'Cascade Green Waste Solutions',
        status: 'Hired',
        contactPerson: 'David Miller',
        phone: '+1 (503) 555-9011',
        email: 'david@cascadegreen.org',
        estimatedCost: 1800,
        vettedQuestions: [
          { question: 'Do you provide on-site waste sorting monitors to prevent contamination?', answer: 'Yes, 4 trained volunteers accompany our sorting stations.' },
          { question: 'Can you haul commercial compost directly to municipal digester same day?', answer: 'Direct transfer to North Hills Digester scheduled at 5 PM.' }
        ],
        redFlagsToCheck: [
          { flag: 'Hidden contamination penalty fee over $500', checked: true },
          { flag: 'Inability to provide certified post-event diversion weight certificate', checked: true }
        ],
        quotes: [
          { id: 'q-301', vendorName: 'Cascade Green Waste', quoteAmount: 1800, inclusions: ['6 3-stream stations', 'Hauling', 'Diversion report'], pros: 'Certified B-Corp, local', cons: 'Requires volunteer assist', isSelected: true }
        ],
        contractSigned: true
      }
    ],
    ideation: {
      themeTitle: 'Abundant Soil: Autumn Gathering',
      vibeStatement: 'Warm, tactile, and community-rooted celebration that honors the seasons, minimizes environmental footprint, and brings neighbors together around wholesome food and acoustic rhythm.',
      colorPalette: [
        { hex: '#B45309', name: 'Harvest Amber', usage: 'Banners, volunteer aprons, and cider signage' },
        { hex: '#15803D', name: 'Forest Moss', usage: 'Tent fabrics, informational boards, compost signs' },
        { hex: '#FEF08A', name: 'Sweet Corn Cream', usage: 'Reusable cotton tote bags and printed schedules' },
        { hex: '#991B1B', name: 'Cranberry Rust', usage: 'Autumn floral bouquets and pumpkin displays' },
        { hex: '#78350F', name: 'Bark Brown', usage: 'Hay bales, timber signs, and burlap table runners' }
      ],
      decorAndLighting: [
        { category: 'Natural Seating', suggestion: 'Clustered hay bales draped with donated vintage wool blankets surrounding the acoustic stage.', promptForVisuals: 'Sunny community park festival with hay bale seating covered in colorful vintage blankets, surrounded by oak trees.' },
        { category: 'Artisan Market Stalls', suggestion: 'Reclaimed wooden crates displaying local honey, freshly baked sourdough, and heirloom squash.', promptForVisuals: 'Rustic wooden outdoor farmers market stall with pumpkins, honey jars, and autumn leaves.' }
      ],
      menuAndBeverages: {
        cocktails: [
          { name: 'Spiced Orchard Mulled Cider', type: 'Mocktail', ingredients: 'Fresh-pressed Honeycrisp cider, cinnamon quill, star anise, clove, orange zest.', flavorNotes: 'Warm, spiced, aromatic, and comforting on a crisp autumn day.' },
          { name: 'Oregon Pear & Rosemary Shrub', type: 'Mocktail', ingredients: 'Bartlett pear vinegar shrub, rosemary simple syrup, sparkling spring water.', flavorNotes: 'Tart, herbal, and invigorating.' }
        ],
        cateringCourses: [
          { course: 'Community Lunch', dishName: 'Roasted Butternut Squash & Wild Rice Bowl', dietaryTags: ['Vegan', 'Gluten-Free', 'Nut-Free'], description: 'Organic roasted squash with dried cranberries, pumpkin seeds, and maple-tahini dressing.' }
        ],
        pairings: ['Locally pressed hard apple cider', 'Fair-trade drip coffee from neighborhood roaster']
      },
      contentAndScripts: {
        invitationCopyFormal: 'The Oakwood Neighborhood Council invites all residents, friends, and families to the 8th Annual Zero-Waste Harvest Fair on Saturday, October 10th. Celebrate local harvests, music, and community resilience.',
        invitationCopyCasual: 'Bring your loved ones, your appetite, and your reusable mugs! Join us at Oakwood Park for live bluegrass, hot spiced cider, pie auctions, and good neighborhood vibes.',
        toastSpeechOutline: [
          { section: 'Welcome & Land Acknowledgment', talkingPoints: 'Honor indigenous stewardship of the land, welcome diverse community members.', durationEstimate: '1.0 min' },
          { section: 'Celebrating Community Milestones', talkingPoints: 'Acknowledge completion of the neighborhood pollinator corridor and 500 volunteer hours.', durationEstimate: '1.5 min' },
          { section: 'Call to Action & Gratitude', talkingPoints: 'Encourage bidding on the silent pie auction, thank farmers and local sponsors, commence the bluegrass band.', durationEstimate: '1.0 min' }
        ],
        signageText: [
          { signType: 'Waste Sorting Guide', text: 'LEAVE NO TRACE: Compost food scraps & certified cups here. Recyclables to the blue bin. Please avoid landfill trash.' },
          { signType: 'Kids Ecology Zone', text: 'MAKE A SEED BOMB! Take home wildflower seeds to plant in your backyard for bees and butterflies.' }
        ]
      }
    },
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-08T16:00:00Z'
  }
];
