import { db } from '../src/lib/db'

interface LocationData {
  name: string
  nameAr: string
  category: string
  city: string
  latitude: number
  longitude: number
  rampScore: number
  elevatorScore: number
  bathroomScore: number
  parkingScore: number
  entranceScore: number
  reviewText: string
  reviews: { text: string; rating: number }[]
}

const locations: LocationData[] = [
  // ===== ALEXANDRIA (10 original + 3 new) =====
  {
    name: 'Mosque of Abu al-Abbas al-Mursi',
    nameAr: 'مسجد أبو العباس المرسي',
    category: 'mosque',
    city: 'alexandria',
    latitude: 31.1989,
    longitude: 29.8856,
    rampScore: 3,
    elevatorScore: 1,
    bathroomScore: 2,
    parkingScore: 2,
    entranceScore: 3,
    reviewText: 'The mosque has a ramp at the main entrance but the secondary entrances are stepped only. No elevator access to the upper prayer hall. Accessible bathrooms are limited and not well-marked. Parking nearby is scarce with no designated accessible spots.',
    reviews: [
      { text: 'Beautiful mosque but wheelchair access is only through the main gate. The side entrances have steps that are difficult to navigate.', rating: 3 },
      { text: 'I visited with my elderly mother and we managed fine through the front entrance, but the bathroom situation needs improvement.', rating: 2 },
    ],
  },
  {
    name: 'Alexandria Main University Hospital',
    nameAr: 'مستشفى الإسكندرية الجامعي',
    category: 'hospital',
    city: 'alexandria',
    latitude: 31.2089,
    longitude: 29.9197,
    rampScore: 4,
    elevatorScore: 3,
    bathroomScore: 4,
    parkingScore: 3,
    entranceScore: 4,
    reviewText: 'The hospital provides decent accessibility with ramps at most entrances and functional elevators. Accessible bathrooms are available on most floors. Parking has a few designated spots but they are often occupied.',
    reviews: [
      { text: 'Good hospital with reasonable wheelchair access. Elevators can be slow during peak hours but they work.', rating: 4 },
      { text: 'The accessible parking spots are always taken. Had to park far and walk.', rating: 3 },
    ],
  },
  {
    name: 'Bibliotheca Alexandrina',
    nameAr: 'مكتبة الإسكندرية الجديدة',
    category: 'museum',
    city: 'alexandria',
    latitude: 31.2089,
    longitude: 29.9092,
    rampScore: 5,
    elevatorScore: 5,
    bathroomScore: 5,
    parkingScore: 4,
    entranceScore: 5,
    reviewText: 'The Bibliotheca Alexandrina is a model of accessible design. 6 elevators connecting all floors, ramps on each floor between bookshelves, accessible reading tables conforming to international standards, a dedicated Taha Hussein Library for the Blind with Braille books and assistive technology, and tactile paving for visually impaired navigation.',
    reviews: [
      { text: 'Outstanding accessibility! Every floor is reachable by elevator, ramps are everywhere, and the accessible restrooms are clean and spacious. A gold standard for public buildings in Egypt.', rating: 5 },
      { text: 'As a wheelchair user, this is one of the few places in Alexandria where I feel truly welcome and independent.', rating: 5 },
    ],
  },
  {
    name: 'Stanley Bridge Cafe',
    nameAr: 'كافيه كوبري ستانلي',
    category: 'cafe',
    city: 'alexandria',
    latitude: 31.2328,
    longitude: 29.9523,
    rampScore: 1,
    elevatorScore: 0,
    bathroomScore: 1,
    parkingScore: 2,
    entranceScore: 2,
    reviewText: 'This cafe near Stanley Bridge has very poor accessibility. There are steps at the entrance with no proper ramp. No elevator access. The bathroom is narrow and not adapted for wheelchair users.',
    reviews: [
      { text: 'Could not enter with my wheelchair. Steps at the door and no ramp. Very disappointing.', rating: 1 },
      { text: 'The view is amazing but completely inaccessible. My friend who uses a wheelchair had to wait outside.', rating: 1 },
    ],
  },
  {
    name: 'Sidi Gaber Train Station',
    nameAr: 'محطة سيدي جابر',
    category: 'transport',
    city: 'alexandria',
    latitude: 31.2153,
    longitude: 29.9453,
    rampScore: 2,
    elevatorScore: 1,
    bathroomScore: 2,
    parkingScore: 2,
    entranceScore: 3,
    reviewText: 'The station has limited accessibility. There is a ramp at the main entrance but platforms require navigating stairs. The elevator is often out of service. Bathrooms are not properly adapted.',
    reviews: [
      { text: 'Getting to the platforms is a nightmare if you use a wheelchair. The elevator was broken when I visited.', rating: 2 },
      { text: 'The entrance is okay but once inside, moving between platforms is very difficult.', rating: 2 },
    ],
  },
  {
    name: 'Smouha City Center Mall',
    nameAr: 'مول سموحة سيتي سنتر',
    category: 'mall',
    city: 'alexandria',
    latitude: 31.21,
    longitude: 29.96,
    rampScore: 4,
    elevatorScore: 4,
    bathroomScore: 4,
    parkingScore: 4,
    entranceScore: 4,
    reviewText: 'The mall offers good accessibility with ramps at all entrances, well-functioning elevators on every floor, and accessible bathrooms. The parking garage includes multiple designated accessible parking spaces near the elevators.',
    reviews: [
      { text: 'One of the most accessible places in Alexandria. Wide aisles, working elevators, and decent accessible parking.', rating: 4 },
      { text: 'Good accessibility overall. Some stores inside have steps or narrow entrances which is frustrating.', rating: 4 },
    ],
  },
  {
    name: 'El Raml Police Station',
    nameAr: 'قسم شرطة الرمل',
    category: 'government',
    city: 'alexandria',
    latitude: 31.201,
    longitude: 29.899,
    rampScore: 1,
    elevatorScore: 0,
    bathroomScore: 1,
    parkingScore: 1,
    entranceScore: 2,
    reviewText: 'The government building has very poor accessibility. Steps at the entrance with no ramp. No elevator in the building. Bathrooms are not adapted for wheelchair users.',
    reviews: [
      { text: 'Completely inaccessible for wheelchair users. I had to be carried up the steps.', rating: 1 },
      { text: 'No ramp, no elevator, no accessible bathroom. How is a person with a disability supposed to access government services here?', rating: 1 },
    ],
  },
  {
    name: 'Victoria College',
    nameAr: 'كلية فيكتوريا',
    category: 'school',
    city: 'alexandria',
    latitude: 31.22,
    longitude: 29.93,
    rampScore: 3,
    elevatorScore: 2,
    bathroomScore: 2,
    parkingScore: 2,
    entranceScore: 3,
    reviewText: 'The historic school building has moderate accessibility challenges. The main building has a ramp but some classrooms are on upper floors with limited elevator access. Bathrooms have been partially adapted in newer sections.',
    reviews: [
      { text: 'The school has made some effort but older buildings still pose barriers. The portable ramp at the entrance is not ideal.', rating: 3 },
      { text: 'The newer sections are okay but the historic parts of the campus are not accessible.', rating: 2 },
    ],
  },
  {
    name: 'Cleopatra Hospital',
    nameAr: 'مستشفى كليوباترا',
    category: 'hospital',
    city: 'alexandria',
    latitude: 31.225,
    longitude: 29.955,
    rampScore: 4,
    elevatorScore: 3,
    bathroomScore: 3,
    parkingScore: 3,
    entranceScore: 4,
    reviewText: 'The hospital provides good accessibility overall with well-designed ramps at the main entrance and most internal transitions. Elevators are available but can be crowded during visiting hours.',
    reviews: [
      { text: 'Good hospital with proper ramps and decent elevator service. The accessible bathroom on the third floor was out of order during my visit.', rating: 4 },
      { text: 'Entrance is great and staff is helpful with accessibility. Parking situation could be improved.', rating: 3 },
    ],
  },
  {
    name: 'Alexandria Sporting Club',
    nameAr: 'نادي الإسكندرية سبورتنج',
    category: 'park',
    city: 'alexandria',
    latitude: 31.2167,
    longitude: 29.95,
    rampScore: 3,
    elevatorScore: 2,
    bathroomScore: 3,
    parkingScore: 3,
    entranceScore: 3,
    reviewText: 'The club offers moderate accessibility. The main entrance has a ramp and the grounds are mostly flat. Some buildings have elevators but they are older models. Bathrooms have been partially adapted.',
    reviews: [
      { text: 'The outdoor areas are mostly accessible which is great for events. Indoor facilities are hit or miss.', rating: 3 },
      { text: 'Decent for a sports club. The swimming pool area is not accessible though.', rating: 3 },
    ],
  },
  // New Alexandria places from PDF
  {
    name: 'Qaitbay Citadel',
    nameAr: 'قلعة قايتباي',
    category: 'monument',
    city: 'alexandria',
    latitude: 31.2140,
    longitude: 29.8856,
    rampScore: 2,
    elevatorScore: 1,
    bathroomScore: 1,
    parkingScore: 1,
    entranceScore: 3,
    reviewText: 'The exterior and courtyard are accessible with assistance, but upper levels have stairs. As a historic fortress, full accessibility is challenging. The seafront location offers beautiful views from the ground level.',
    reviews: [
      { text: 'The courtyard is manageable in a wheelchair with some help, but you cannot access the upper levels at all.', rating: 2 },
      { text: 'Beautiful views from outside. Wish there was a ramp to at least the main level inside.', rating: 2 },
    ],
  },
  {
    name: 'Montazah Palace Gardens',
    nameAr: 'حدائق قصر المنتزة',
    category: 'park',
    city: 'alexandria',
    latitude: 31.2886,
    longitude: 30.0159,
    rampScore: 3,
    elevatorScore: 1,
    bathroomScore: 2,
    parkingScore: 2,
    entranceScore: 4,
    reviewText: 'Extensive gardens with paved pathways make the outdoor areas quite accessible. The palace interior has limited access. Great for a day out in a wheelchair enjoying the Mediterranean views.',
    reviews: [
      { text: 'The gardens are lovely and mostly accessible on paved paths. The beach area is not accessible though.', rating: 4 },
      { text: 'Nice place to visit. The pathways are good but the palace itself you cannot enter with a wheelchair.', rating: 3 },
    ],
  },
  {
    name: 'Graeco-Roman Museum',
    nameAr: 'المتحف اليوناني الروماني',
    category: 'museum',
    city: 'alexandria',
    latitude: 31.1994,
    longitude: 29.9069,
    rampScore: 4,
    elevatorScore: 4,
    bathroomScore: 4,
    parkingScore: 2,
    entranceScore: 4,
    reviewText: 'The recently renovated museum offers good accessibility including accessible restrooms. Ramps and elevators serve all exhibition floors. Display cases are visible from seated position.',
    reviews: [
      { text: 'After the renovation, the museum is much more accessible. Elevators work and the restrooms are adapted.', rating: 4 },
      { text: 'Good museum experience for wheelchair users. Staff was helpful when I needed assistance.', rating: 4 },
    ],
  },

  // ===== CAIRO (7 new places) =====
  {
    name: 'Egyptian Museum (Tahrir)',
    nameAr: 'المتحف المصري بالتحرير',
    category: 'museum',
    city: 'cairo',
    latitude: 30.0478,
    longitude: 31.2336,
    rampScore: 4,
    elevatorScore: 3,
    bathroomScore: 1,
    parkingScore: 2,
    entranceScore: 4,
    reviewText: 'Ramps available at entrance. Elevator requires staff key — staff can be uncooperative about retrieving it. Stay persistent and ask other staff members. The Tutankhamun exhibit on the second floor is worth the elevator hassle. No accessible restrooms — a frequently cited gap.',
    reviews: [
      { text: 'The elevator situation is frustrating — you need a staff member with a key and they are not always willing to help. Be persistent!', rating: 3 },
      { text: 'Amazing collection but the building is old with uneven floors and no accessible restrooms. The King Tut exhibit is worth the effort though.', rating: 3 },
    ],
  },
  {
    name: 'National Museum of Egyptian Civilization (NMEC)',
    nameAr: 'المتحف القومي للحضارة المصرية',
    category: 'museum',
    city: 'cairo',
    latitude: 30.0103,
    longitude: 31.2485,
    rampScore: 5,
    elevatorScore: 5,
    bathroomScore: 5,
    parkingScore: 4,
    entranceScore: 5,
    reviewText: 'One of Egypt\'s most wheelchair-friendly museums. Free wheelchairs available. Designated accessible parking. All exhibits accessible by elevator. The Royal Mummies Hall is fully accessible via elevator. Spacious Main Hall easy to navigate in powered wheelchair.',
    reviews: [
      { text: 'The Main Hall is spacious and easy to navigate in my powered wheelchair. The Royal Mummies Hall is one of my favorite places I visited in Egypt!', rating: 5 },
      { text: 'Excellent accessibility throughout. Free wheelchair loan and accessible parking. A model for other Egyptian museums.', rating: 5 },
    ],
  },
  {
    name: 'Al-Azhar Park',
    nameAr: 'حديقة الأزهر',
    category: 'park',
    city: 'cairo',
    latitude: 30.0407,
    longitude: 31.2654,
    rampScore: 4,
    elevatorScore: 1,
    bathroomScore: 3,
    parkingScore: 2,
    entranceScore: 4,
    reviewText: 'Paved walkways and gently sloping ramps make this hilltop park one of Cairo\'s most accessible outdoor spaces. Accessible restrooms and shaded areas available. Stunning views of Islamic Cairo from the panoramic terraces.',
    reviews: [
      { text: 'Beautiful park with mostly accessible pathways. Some steep sections need assistance but overall a great experience.', rating: 4 },
      { text: 'One of the few outdoor spaces in Cairo where a wheelchair user can really enjoy themselves. The views are incredible.', rating: 4 },
    ],
  },
  {
    name: 'Khan El Khalili Bazaar',
    nameAr: 'خان الخليلي',
    category: 'market',
    city: 'cairo',
    latitude: 30.0477,
    longitude: 31.2623,
    rampScore: 2,
    elevatorScore: 1,
    bathroomScore: 1,
    parkingScore: 1,
    entranceScore: 3,
    reviewText: 'Bumpy cobblestone alleys are mostly manageable in a powered wheelchair, but can be challenging. Best visited during quiet hours when crowds are thinner. No accessible restrooms in the bazaar area. A unique but demanding experience.',
    reviews: [
      { text: 'Managed to shop for about an hour in my powered wheelchair. The cobblestones are bumpy but doable. Go early before the crowds!', rating: 3 },
      { text: 'Atmospheric but difficult. Narrow alleys and no accessible facilities. Only for the adventurous wheelchair traveler.', rating: 2 },
    ],
  },
  {
    name: 'Cairo Tower',
    nameAr: 'برج القاهرة',
    category: 'monument',
    city: 'cairo',
    latitude: 30.0459,
    longitude: 31.2242,
    rampScore: 1,
    elevatorScore: 4,
    bathroomScore: 2,
    parkingScore: 2,
    entranceScore: 3,
    reviewText: 'The observation lounge on the 14th floor is accessible by elevator, offering panoramic views of Cairo. However, the highest open-air deck is stairs-only. Restaurant on the rotating floor is accessible.',
    reviews: [
      { text: 'The elevator takes you to the observation lounge which has great views. Too bad the very top deck is only accessible by stairs.', rating: 3 },
      { text: 'Decent experience. The rotating restaurant is accessible and the views are spectacular.', rating: 3 },
    ],
  },
  {
    name: 'Citadel of Saladin',
    nameAr: 'قلعة صلاح الدين',
    category: 'mosque',
    city: 'cairo',
    latitude: 30.0296,
    longitude: 31.2611,
    rampScore: 2,
    elevatorScore: 1,
    bathroomScore: 1,
    parkingScore: 1,
    entranceScore: 2,
    reviewText: 'The main courtyard is accessible via ramp, but the Mosque of Muhammad Ali has steps at the entrance. Uneven terrain throughout the complex makes navigation challenging. Historic site with limited accessibility modifications.',
    reviews: [
      { text: 'The courtyard is manageable but getting into the mosques is nearly impossible with a wheelchair. Very uneven ground.', rating: 2 },
      { text: 'Historically stunning but accessibility is poor. You can see the courtyard and some exterior areas only.', rating: 2 },
    ],
  },
  {
    name: 'Al-Azhar Mosque',
    nameAr: 'جامع الأزهر',
    category: 'mosque',
    city: 'cairo',
    latitude: 30.0457,
    longitude: 31.2625,
    rampScore: 3,
    elevatorScore: 1,
    bathroomScore: 1,
    parkingScore: 3,
    entranceScore: 4,
    reviewText: 'Ground level access from the street. The courtyard is flat and partially wheelchair-accessible. Accessible bathrooms available inside. One of the more accessible historic mosques in Cairo.',
    reviews: [
      { text: 'The ground level entrance makes a big difference. The courtyard is flat and you can access the accessible bathrooms.', rating: 3 },
      { text: 'One of the better mosques for wheelchair access in Cairo. Still has limitations but more manageable than most.', rating: 3 },
    ],
  },
  {
    name: 'City Stars Mall',
    nameAr: 'مول سيتي ستارز',
    category: 'mall',
    city: 'cairo',
    latitude: 30.0733,
    longitude: 31.3433,
    rampScore: 4,
    elevatorScore: 5,
    bathroomScore: 3,
    parkingScore: 4,
    entranceScore: 4,
    reviewText: 'Free wheelchairs available at Information Desks. Ramps and elevators throughout the mall. Accessible restrooms available. Connected to InterContinental Hotel. Closest metro station: El-Ahram (Line 3).',
    reviews: [
      { text: 'Modern mall with good accessibility features. Free wheelchair loan and elevators everywhere.', rating: 4 },
      { text: 'Comfortable shopping experience. The connected hotel makes it convenient for tourists with mobility needs.', rating: 4 },
    ],
  },
  {
    name: 'Cairo International Airport Terminal 3',
    nameAr: 'مطار القاهرة الدولي - صالة 3',
    category: 'transport',
    city: 'cairo',
    latitude: 30.1219,
    longitude: 31.4056,
    rampScore: 4,
    elevatorScore: 5,
    bathroomScore: 4,
    parkingScore: 3,
    entranceScore: 4,
    reviewText: 'Terminal 3 has elevators, accessible restrooms, and assistance desks. However, wheelchair users report that staff may refuse to bring powered wheelchairs to the gate — you may need to use an airport wheelchair through security and retrieve your chair at baggage claim.',
    reviews: [
      { text: 'Terminal 3 is decent but the wheelchair handling process needs improvement. They wouldn\'t bring my power chair to the gate.', rating: 4 },
      { text: 'Accessible restrooms and elevators are available. Allow extra time for the wheelchair transfer process at security.', rating: 3 },
    ],
  },
  {
    name: 'Pharaonic Village',
    nameAr: 'القرية الفرعونية',
    category: 'museum',
    city: 'cairo',
    latitude: 29.9600,
    longitude: 31.2100,
    rampScore: 4,
    elevatorScore: 3,
    bathroomScore: 3,
    parkingScore: 3,
    entranceScore: 4,
    reviewText: 'Described as "relatively accessible" by wheelchair travelers. Free disability tickets available. The boat tour through recreated ancient Egyptian scenes is the main attraction and is accessible. Some walking paths may need assistance.',
    reviews: [
      { text: 'The boat tour was accessible and really enjoyable. Free tickets for disabled visitors is a nice touch.', rating: 4 },
      { text: 'An interesting experience. Not fully accessible everywhere but the main attractions can be enjoyed from a wheelchair.', rating: 4 },
    ],
  },

  // ===== GIZA (6 new places) =====
  {
    name: 'Grand Egyptian Museum (GEM)',
    nameAr: 'المتحف المصري الكبير',
    category: 'museum',
    city: 'giza',
    latitude: 29.9936,
    longitude: 31.1208,
    rampScore: 5,
    elevatorScore: 5,
    bathroomScore: 5,
    parkingScore: 5,
    entranceScore: 5,
    reviewText: 'The gold standard of accessibility in Egypt. Designed with universal access as a core principle. Free wheelchair loan, electric golf carts from parking to entrance, elevators parallel to the Grand Staircase at every level, all galleries accessible with wide obstacle-free halls, accessible restrooms throughout with grab bars, tactile exhibits with Braille, and free admission for PWDs.',
    reviews: [
      { text: 'World-class accessibility! Every gallery is reachable, elevators are cleverly integrated alongside the Grand Staircase, and artifacts are visible from a seated position.', rating: 5 },
      { text: 'The most accessible museum in Egypt by far. Golf carts from parking, free wheelchair loan, and tactile exhibits. A model for universal design.', rating: 5 },
    ],
  },
  {
    name: 'Pyramids of Giza',
    nameAr: 'أهرامات الجيزة',
    category: 'monument',
    city: 'giza',
    latitude: 29.9792,
    longitude: 31.1342,
    rampScore: 4,
    elevatorScore: 1,
    bathroomScore: 3,
    parkingScore: 2,
    entranceScore: 3,
    reviewText: 'Paved paths and boardwalks connect main viewing areas for all three pyramids and the Sphinx. Panoramic viewing platforms at wheelchair height. Accessible restrooms at visitor center. VIP Sound & Light Show with completely paved seating. Shuttle buses with wheelchair accessibility. Pyramid interiors are NOT accessible — stairs and narrow passages.',
    reviews: [
      { text: 'The exterior viewing areas are surprisingly accessible with paved paths. You can\'t enter the pyramids but the views are incredible from the boardwalks.', rating: 3 },
      { text: 'Shuttle buses are wheelchair-friendly and the Sound & Light Show seating is fully paved. A memorable experience despite the limitations.', rating: 3 },
    ],
  },
  {
    name: 'Marriott Mena House',
    nameAr: 'فندق ماريوت مينا هاوس',
    category: 'hotel',
    city: 'giza',
    latitude: 29.9864,
    longitude: 31.1314,
    rampScore: 5,
    elevatorScore: 5,
    bathroomScore: 5,
    parkingScore: 5,
    entranceScore: 5,
    reviewText: 'The most recommended hotel for wheelchair travelers in Cairo. Roll-in shower with grab bars and fold-down bench, wheelchair-height toilet, pull-under sink, Hoyer lift-compatible bed height, accessible spa via alternative entrance. 139 Restaurant fully accessible with pyramid views. EarthCheck Certified.',
    reviews: [
      { text: 'I wouldn\'t want to stay anywhere else during my time in Cairo. Roll-in shower, grab bars, and you can see the pyramids from your room!', rating: 5 },
      { text: 'One of the only hotels where you can see the pyramids from accessible rooms. Staff went above and beyond to accommodate my needs.', rating: 5 },
    ],
  },
  {
    name: 'Mall of Egypt',
    nameAr: 'مول مصر',
    category: 'mall',
    city: 'giza',
    latitude: 29.9653,
    longitude: 30.9388,
    rampScore: 5,
    elevatorScore: 5,
    bathroomScore: 5,
    parkingScore: 4,
    entranceScore: 5,
    reviewText: 'Features a globally unique wheelchair-compatible ramped escalator that went viral on TikTok. Free manual wheelchairs at 6 entrances, free electric wheelchairs at Customer Service, accessible restrooms throughout. Ski Egypt has limited accessibility.',
    reviews: [
      { text: 'The ramped escalator is incredible — something I\'ve never seen anywhere else in the world. The whole mall is very accessible.', rating: 5 },
      { text: 'Egypt\'s accessibility could definitely improve in many ways, but I was so impressed with this ramped escalator. So awesome!', rating: 5 },
    ],
  },
  {
    name: 'Sound & Light Show (Giza)',
    nameAr: 'عرض الصوت والضوء بالأهرامات',
    category: 'entertainment',
    city: 'giza',
    latitude: 29.9900,
    longitude: 31.1300,
    rampScore: 4,
    elevatorScore: 1,
    bathroomScore: 3,
    parkingScore: 3,
    entranceScore: 4,
    reviewText: 'The VIP seating area is completely paved and accessible for wheelchair users. The show tells the story of the pyramids with dramatic lighting and narration. An accessible way to experience the pyramids at night.',
    reviews: [
      { text: 'The VIP seating is fully paved and I had a great view of the show. A wonderful accessible evening experience.', rating: 4 },
      { text: 'Really enjoyed the Sound & Light Show. The accessible seating area is well-designed and the show is spectacular.', rating: 4 },
    ],
  },
]

function calculateOverallScore(loc: LocationData): number {
  const total = loc.rampScore + loc.elevatorScore + loc.bathroomScore + loc.parkingScore + loc.entranceScore
  return Math.round((total / 5) * 10) / 10
}

async function seed() {
  console.log('🌱 Seeding database...')

  // Delete all existing data
  console.log('🗑️  Deleting existing data...')
  await db.editSuggestion.deleteMany()
  await db.review.deleteMany()
  await db.place.deleteMany()
  console.log('✅ Existing data deleted.')

  // Create places with reviews
  for (const loc of locations) {
    const overallScore = calculateOverallScore(loc)

    const place = await db.place.create({
      data: {
        name: loc.name,
        nameAr: loc.nameAr,
        category: loc.category,
        city: loc.city,
        latitude: loc.latitude,
        longitude: loc.longitude,
        overallScore,
        rampScore: loc.rampScore,
        elevatorScore: loc.elevatorScore,
        bathroomScore: loc.bathroomScore,
        parkingScore: loc.parkingScore,
        entranceScore: loc.entranceScore,
        reviewText: loc.reviewText,
        approved: true,
        reviews: {
          create: loc.reviews.map((review) => ({
            text: review.text,
            rating: review.rating,
          })),
        },
      },
    })

    console.log(`✅ Created: ${loc.name} (${loc.city}) [${loc.category}] overall: ${overallScore}`)
  }

  console.log(`\n🎉 Seeded ${locations.length} locations successfully!`)
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
