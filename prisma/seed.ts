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
    reviewText:
      'The mosque has a ramp at the main entrance but the secondary entrances are stepped only. No elevator access to the upper prayer hall. Accessible bathrooms are limited and not well-marked. Parking nearby is scarce with no designated accessible spots.',
    reviews: [
      {
        text: 'Beautiful mosque but wheelchair access is only through the main gate. The side entrances have steps that are difficult to navigate.',
        rating: 3,
      },
      {
        text: 'I visited with my elderly mother and we managed fine through the front entrance, but the bathroom situation needs improvement.',
        rating: 2,
      },
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
    reviewText:
      'The hospital provides decent accessibility with ramps at most entrances and functional elevators. Accessible bathrooms are available on most floors. Parking has a few designated spots but they are often occupied. The main entrance is well-designed for wheelchair users.',
    reviews: [
      {
        text: 'Good hospital with reasonable wheelchair access. Elevators can be slow during peak hours but they work. Staff is generally helpful.',
        rating: 4,
      },
      {
        text: 'The accessible parking spots are always taken. Had to park far and walk. Otherwise the facility is fairly accessible.',
        rating: 3,
      },
    ],
  },
  {
    name: 'Bibliotheca Alexandrina',
    nameAr: 'مكتبة الإسكندرية الجديدة',
    category: 'other',
    city: 'alexandria',
    latitude: 31.2089,
    longitude: 29.9092,
    rampScore: 5,
    elevatorScore: 5,
    bathroomScore: 5,
    parkingScore: 4,
    entranceScore: 5,
    reviewText:
      'The Bibliotheca Alexandrina is a model of accessible design in Alexandria. Ramps are smooth and well-placed throughout. Multiple elevators serve all floors with Braille buttons. Accessible bathrooms are spacious and well-maintained. The parking area includes several designated accessible spaces close to the entrance.',
    reviews: [
      {
        text: 'Outstanding accessibility! Every floor is reachable by elevator, ramps are everywhere, and the accessible restrooms are clean and spacious. A gold standard for public buildings in Egypt.',
        rating: 5,
      },
      {
        text: 'As a wheelchair user, this is one of the few places in Alexandria where I feel truly welcome and independent. The parking could have more accessible spots but otherwise it is excellent.',
        rating: 5,
      },
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
    reviewText:
      'This cafe near Stanley Bridge has very poor accessibility. There are steps at the entrance with no proper ramp. No elevator access. The bathroom is narrow and not adapted for wheelchair users. Street parking is limited and not designated for accessible use.',
    reviews: [
      {
        text: 'Could not enter with my wheelchair. Steps at the door and no ramp. Very disappointing for such a popular spot.',
        rating: 1,
      },
      {
        text: 'The view is amazing but completely inaccessible. My friend who uses a wheelchair had to wait outside. Needs serious renovation.',
        rating: 1,
      },
    ],
  },
  {
    name: 'Alexandria Sporting Club',
    nameAr: 'نادي السكاندرية سبورتنج',
    category: 'other',
    city: 'alexandria',
    latitude: 31.2167,
    longitude: 29.95,
    rampScore: 3,
    elevatorScore: 2,
    bathroomScore: 3,
    parkingScore: 3,
    entranceScore: 3,
    reviewText:
      'The club offers moderate accessibility. The main entrance has a ramp and the grounds are mostly flat. Some buildings have elevators but they are older models. Bathrooms have been partially adapted. Parking includes a few accessible spots near the gate.',
    reviews: [
      {
        text: 'The outdoor areas are mostly accessible which is great for events. Indoor facilities are hit or miss depending on the building.',
        rating: 3,
      },
      {
        text: 'Decent for a sports club. The swimming pool area is not accessible though, which is a shame. Parking could be better organized.',
        rating: 3,
      },
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
    reviewText:
      'The station has limited accessibility. There is a ramp at the main entrance but platforms require navigating stairs. The elevator is often out of service. Bathrooms are not properly adapted. Parking is available but without clear accessible designation.',
    reviews: [
      {
        text: 'Getting to the platforms is a nightmare if you use a wheelchair. The elevator was broken when I visited. Had to get assistance from staff to use the freight elevator.',
        rating: 2,
      },
      {
        text: 'The entrance is okay but once inside, moving between platforms is very difficult. Needs serious upgrades to be truly accessible.',
        rating: 2,
      },
    ],
  },
  {
    name: 'Smouha City Center Mall',
    nameAr: 'مول سموحة سيتي سنتر',
    category: 'other',
    city: 'alexandria',
    latitude: 31.21,
    longitude: 29.96,
    rampScore: 4,
    elevatorScore: 4,
    bathroomScore: 4,
    parkingScore: 4,
    entranceScore: 4,
    reviewText:
      'The mall offers good accessibility with ramps at all entrances, well-functioning elevators on every floor, and accessible bathrooms that are regularly maintained. The parking garage includes multiple designated accessible parking spaces near the elevators. Wide corridors make navigation easy for wheelchair users.',
    reviews: [
      {
        text: 'One of the most accessible places in Alexandria. Wide aisles, working elevators, and decent accessible parking. Shopping here with a wheelchair is actually enjoyable.',
        rating: 4,
      },
      {
        text: 'Good accessibility overall. Some stores inside have steps or narrow entrances which is frustrating, but the mall itself is well designed.',
        rating: 4,
      },
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
    reviewText:
      'The government building has very poor accessibility. Steps at the entrance with no ramp. No elevator in the building. Bathrooms are not adapted for wheelchair users. Parking is extremely limited with no accessible spots. This building urgently needs renovation to serve all citizens.',
    reviews: [
      {
        text: 'Completely inaccessible for wheelchair users. I had to be carried up the steps. This is unacceptable for a government building that all citizens need to access.',
        rating: 1,
      },
      {
        text: 'No ramp, no elevator, no accessible bathroom. How is a person with a disability supposed to file a report or access government services here?',
        rating: 1,
      },
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
    reviewText:
      'The historic school building has moderate accessibility challenges. The main building has a ramp but some classrooms are on upper floors with limited elevator access. Bathrooms have been partially adapted in newer sections. Parking is limited with no dedicated accessible spots. The entrance has been modified with a portable ramp.',
    reviews: [
      {
        text: 'As a parent of a child with mobility challenges, the school has made some effort but older buildings still pose barriers. The portable ramp at the entrance is not ideal.',
        rating: 3,
      },
      {
        text: 'The newer sections are okay but the historic parts of the campus are not accessible. Elevator only serves two of the four floors.',
        rating: 2,
      },
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
    reviewText:
      'The hospital provides good accessibility overall with well-designed ramps at the main entrance and most internal transitions. Elevators are available but can be crowded during visiting hours. Accessible bathrooms are present on each floor though some need maintenance. Parking includes a few designated accessible spots near the main entrance.',
    reviews: [
      {
        text: 'Good hospital with proper ramps and decent elevator service. The accessible bathroom on the third floor was out of order during my visit but otherwise acceptable.',
        rating: 4,
      },
      {
        text: 'Entrance is great and staff is helpful with accessibility. Parking situation could be improved as the accessible spots fill up quickly.',
        rating: 3,
      },
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

    console.log(`✅ Created: ${loc.name} (overall: ${overallScore})`)
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
