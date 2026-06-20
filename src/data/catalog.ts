import { Therapy, AddOn } from '../types';

export const THERAPIES: Therapy[] = [
  {
    id: 'swedish-massage',
    name: 'Swedish Mind-Body Harmony',
    category: 'massages',
    shortDescription: 'Unwind with long, continuous strokes, rhythmic kneading, and custom warm botanical oils.',
    longDescription: 'Our signature Swedish therapy utilizes customized botanical formulations warmed to optimal temperature. Combining classic movements like effleurage and petrissage with joint manipulation, it stimulates lymphatic flow, releases serotonin, and clears metabolic waist. Perfect for dissolving daily psychological and physical stress.',
    benefits: [
      'Relieves light to moderate muscle fatigue',
      'Improves vascular and lymphatic circulation',
      'Decreases cortisol levels, promoting deeper sleep',
      'Enhances global joint mobility and systemic flexibility'
    ],
    signatureIngredients: ['Warm Grape Seed Oil', 'Bergamot Essential Scent', 'Sweet Almond Base'],
    basePrice60: 2500,
    basePrice90: 3400,
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'deep-tissue',
    name: 'Deep Tissue Muscle Restructuring',
    category: 'massages',
    shortDescription: 'Intense slow-stroke pressure focusing on chronically tense and fatigued deep muscle layers.',
    longDescription: 'This high-performance therapy targets rigid myofascial networks and structural imbalances. Utilizing deep, focused finger pressure and slow, firm strokes on the direction of muscle fibers, our trained therapists target chronic knots, sports fatigue, and posture-induced neck/shoulder stiffness.',
    benefits: [
      'Alleviates chronic back strain and shoulder tension',
      'Breaks down painful adhesions and muscle knots',
      'Accelerates muscular recovery after physical exercise',
      'Improves kinetic alignment and postural balance'
    ],
    signatureIngredients: ['Cold-pressed Mustard Oil', 'Eucalyptus & Camphor Extract', 'Organic Wintergreen Activators'],
    basePrice60: 2805,
    basePrice90: 3800,
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'abhyanga-ayurveda',
    name: 'Traditional Ayurvedic Abhyanga',
    category: 'ayurvedic',
    shortDescription: 'Time-tested holistic dry/oil therapy with warm, customized organic herb-infused rasayanas.',
    longDescription: 'Harmonize your biological energies (doshas) with traditional Indian Abhyanga. Our therapists apply specialized rhythmic, downward friction strokes (Anuloma) utilizing warm wellness oils infused with therapeutic roots and seeds. It deeply nourishes nervous tissues, aids detoxification, and restores physical vigor.',
    benefits: [
      'Detoxifies cellular tissues by purging impurities',
      'Deeply calms the nervous system and relieves anxiety',
      'Nourishes and revitalizes dry, aging skin structures',
      'Strengthens the immune barrier and enhances vitality'
    ],
    signatureIngredients: ['Warm Sesame Oil Base', 'Ashwagandha & Shatavari Herbs', 'Brahmi Mind Calmers'],
    basePrice60: 2600,
    basePrice90: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'royal-potli-therapy',
    name: 'Imperial Herbal Potli Remedy',
    category: 'ayurvedic',
    shortDescription: 'Rhythmic, warm-pouches therapy filled with medicinal herbs to melt stiffness.',
    longDescription: 'An ancient remedy for muscular soreness, arthritis, and heavy modern stress. Soft linen pouches (Potlis) packed with specific Himalayan therapeutic herbs, sea minerals, and camphor are steeped in hot medicated oils. Therapists apply these warm compresses dynamically along pain centers to induce deep cellular healing.',
    benefits: [
      'Quickly melts away severe backache and vertebral stiffness',
      'Reduces inflammatory congestion and joint swelling',
      'Induces profound physical sweating to release toxic acids',
      'Soothes underlying spinal and musculoskeletal fatigue'
    ],
    signatureIngredients: ['Saffron Extracts', 'Lemongrass & Ginger Root Powder', 'Warm Ashwagandha Medicated Oil'],
    basePrice60: 3100,
    basePrice90: 4100,
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prithvi-body-scrub',
    name: 'Prithvi Pure Botanical Exfoliator',
    category: 'scrubs-wraps',
    shortDescription: 'Vigorous mineral-rich ground botanical scrub for brilliant skin cell regeneration.',
    longDescription: 'Reclaim glowing texture with our signature Prithvi Exfoliation, utilizing a potent mixture of sundried herbs, coarse hand-ground grains, and cold-pressed minerals. Gentle sweeping polishes strip dead epidermal cells, stimulate dermal blood circulation, and open skin respiratory pores.',
    benefits: [
      'Sloughs off calloused dead cells and impurities completely',
      'Reveals a uniform, bright, silk-smooth skin tone',
      'Improves absorption capacity of subsequently applied botanicals',
      'Gently detoxifies the subcutaneous lymph beds'
    ],
    signatureIngredients: ['Pure Sandalwood Grains', 'Organic Turmeric Roots', 'Fine Himalayan Pink Sea Salt'],
    basePrice60: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'royal-floral-polish',
    name: 'Kashmiri Rose & Vanilla Polish',
    category: 'scrubs-wraps',
    shortDescription: 'Elegant hydration-rich polishing treatment utilizing organic rose petals and luxury honey.',
    longDescription: 'Luxurate in this indulgent botanical glaze designed to drench dry, delicate skin. Combining antioxidant-dense Kashmiri rose water, crushed organic petals, moisturizing wild honey, and rich vanilla seeds, our polisher leaves the entire body deeply hydrated, velvety, and delicately scented with natural floral air.',
    benefits: [
      'Provides profound multi-layer subcutaneous hydration',
      'Infuses skin with potent antioxidant bioflavonoids',
      'Soothes micro-irritations and sunburn patches',
      'Leaves an uplifting, natural rose-vanilla signature aroma'
    ],
    signatureIngredients: ['Antioxidant Kashmiri Rose-oil', 'Crushed Madagascar Vanilla Seeds', 'Organic Forest Honey'],
    basePrice60: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'foot-reflexology',
    name: 'Eastern Foot Reflexology Zone Therapy',
    category: 'express',
    shortDescription: 'Highly focused pressure map targeting vital neurological zones in the feet.',
    longDescription: 'This intense clinical therapy maps physical systems directly onto the soles of the feet. Based on traditional zone mapping, specific compression strokes stimulate matching vital organs and skeletal zones, promoting auto-regulation, easing leg congestion, and balancing systemic circulation.',
    benefits: [
      'Relieves intense stress-weight in tired calves and ankles',
      'Balances systemic wellness by unlocking bio-pathways',
      'Significantly reduces water retention and foot swelling',
      'Induces full-system relaxation in an express timeframe'
    ],
    signatureIngredients: ['Peppermint Refreshing Oil', 'Tea Tree Purifying Extract', 'Menthol Cooling Crystals'],
    basePrice60: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'champi-head-massage',
    name: 'Traditional Champi Calming Focus',
    category: 'express',
    shortDescription: 'Ancient scalp oil infusion and shoulder-neck trigger release for cerebral calm.',
    longDescription: 'Rooted in Indian family wisdom, our Champi head therapy uses traditional circular pressures on vital acupressure points (marmas) across the head, ears, neck, and upper shoulders. Paired with customized warm hair-infusion oils, it halts sensory noise, relieves desk stiffness, and brightens cognitive focus.',
    benefits: [
      'Instantly relieves severe mental strain and physical desks-fatigue',
      'Dissolving localized knots inside upper trapezius muscles',
      'Stimulates head blood vessels for hair fiber nourishment',
      'Restores clear sensory perception and serene mood'
    ],
    signatureIngredients: ['Warm Rosemary-Infused Coconut Oil', 'Camphor Essence', 'Holy Basil marmas restorer'],
    basePrice60: 1300,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'partners-somatic-release',
    name: 'Signature Partners Somatic Release',
    category: 'partners',
    shortDescription: 'Parallel deep-tension alignment journey for two in our exquisite Couples Suite with bespoke lavender oils.',
    longDescription: 'Designed for couples, friends, or companions. Experience shared cellular peace side-by-side in our gorgeous, private climate-controlled Couples Suite with soft synchronized music. Features a customized combination of medium-pressure Swedish strokes, thermal volcanic stones on the spine, and warm aromatherapy oil blends. Concludes with a nourishing scalp massage and premium organic wellness drinks.',
    benefits: [
      'Promotes profound parallel physical relaxation',
      'Synchronizes breathing rhythm and calms the nervous system',
      'Nourishes skin with premium heated organic lavender formulations',
      'Fosters shared memory of restoration and deep emotional calm'
    ],
    signatureIngredients: ['Warm Lavender Distillate', 'Heated Volcanic Basalt Stones', 'Organic Almond Oil Base'],
    basePrice60: 4800,
    basePrice90: 6400,
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'partners-vedic-abhyanga',
    name: 'Vedic Twin-Engine Abhyanga Ritual',
    category: 'partners',
    shortDescription: 'Traditional side-by-side Ayurvedic restoration with warm infused custom oils and symmetric compresses.',
    longDescription: 'Receive parallel ayurvedic bliss inside our luxury, fully sanitised couples suite. Guided by state-certified therapists using synchronized downward strokes (Anuloma) to balance biological energies (doshas) and flush out systemic fatigue. Hand-crafted hot herbal compress potlis are applied symmetrically across muscular pain centers and vertebral nodes.',
    benefits: [
      'Instantly resolves chronic joint stress and heavy muscular fatigue',
      'Symmetrically purges cell tissues of lactic acids and toxins',
      'Deeply calms hyper-active minds via scalp wellness formulations',
      'Re-aligns structural posture in perfect harmony'
    ],
    signatureIngredients: ['Medicated Warm Sesame Oil', 'Himalayan Organic Herb Potli', 'Saffron & Cardamom Extracts'],
    basePrice60: 5200,
    basePrice90: 6900,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80'
  }
];

export const ADDONS: AddOn[] = [
  {
    id: 'hot-stones',
    name: 'Volcanic Basalt Hot Stones',
    price: 550,
    description: 'Direct heat application on structural chakras using water-heated rich volcanic basalt stones to yield muscle fibers.',
    duration: 15
  },
  {
    id: 'aroma-frankincense',
    name: 'Rare Frankincense Aromatherapy Oil Scent',
    price: 300,
    description: 'Imbue your warming carrier oils with pure, organic Frankincense essential drops to soothe breath and settle neural pathways.',
    duration: 0
  },
  {
    id: 'herbal-compress-pad',
    name: 'Warm Herbal Compress Pillow',
    price: 450,
    description: 'A miniature warm, aromatic compress pad pressed behind your neck and spine during facial/body relaxations.',
    duration: 10
  },
  {
    id: 'anti-fatigue-clay',
    name: 'Volcanic Mud Back Scrub Masque',
    price: 600,
    description: 'A nutrient-intense botanical and mineral mud masque applied on the back to pull toxins and soften skin while resting.',
    duration: 15
  }
];

export const SPA_CONFIG = {
  branchName: 'Maheeee Wellness Spa',
  contactNumber: '8328139956',
  whatsappLink: 'https://wa.me/918328139956?text=Hello%20Maheeee%20Wellness%20Spa,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20booking.',
  address: '3rd Floor, Golden Heights, Opp. Google Office Main Gate, Silpa Layout Rd, Kondapur, Hyderabad, Telangana 500084',
  tagline: 'Step into an Sanctuary of Opulent Calm & Deep Ayurvedic Restoration',
  aboutBrief: 'Maheeee Wellness Spa stands as Kondapur’s newest crown jewel of luxury restorative arts. Bringing together age-old Ayurvedic Shastras, refined botanical formulations, and elite, certified therapeutic artisans, we craft a sanctuary where modern high-pressure life dissolves into cellular tranquility.',
  openingHours: '10:00 AM – 10:00 PM (Daily)',
  facilities: [
    { title: 'Five Esthetic Suites', desc: 'Sound-proofed healing chambers with individual dynamic climate panels, ambient lighting, and warm showers.' },
    { title: 'Couples Steam Retreat', desc: 'Secluded traditional steam chamber containing customized botanical essential fog for private detoxification.' },
    { title: 'Ayurvedic Shirodhara Rig', desc: 'Hand-carved premium medicinal wooden tables crafted in Kerala for accurate warm oil streams.' },
    { title: 'Organic Elixir Bar', desc: 'Complimentary traditional warm herbal teas, botanical saffron water, and dry fruit infusions before and after therapies.' }
  ]
};
