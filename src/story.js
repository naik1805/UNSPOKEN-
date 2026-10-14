/* ========================================================
   UNSPOKEN: The Cost of a Dream - Complete Story Data
   Emotional, poetic narrative connecting SVEC to the shattered midnight.
   ======================================================== */

export const CHAPTERS = [
  {
    id: "act-1",
    actNum: "ACT I",
    title: "The Introvert of SVEC",
    subtitle: "Age 12 • 7th Grade",
    quote: "Some feelings are born in silent glances and never find a voice.",
    objective: "Walk into the SVEC courtyard and look for her near the fountain",
    environment: "svec_school",
    lighting: "golden_morning",
    rain: false,
    playerAge: "young",
    targetLocation: { x: 0, z: -14 },
    interactPrompt: "Look at Her",
    dialogues: [
      {
        speaker: "INNER VOICE",
        text: "SVEC. That was where my entire world began.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "I was the shy, introverted kid who always sat in the corner of the classroom, clutching my schoolbag, never raising my hand.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "And then there was her. Laughing under the morning sun with a ribbon in her hair, holding her schoolbooks close. Every time she smiled, the whole courtyard seemed to glow.",
        type: "monologue"
      },
      {
        speaker: "CHOICE",
        prompt: "She turns around and notices you looking. What do you do?",
        options: [
          { text: "Heart pounding frantically, quickly pretend to read your notebook.", score: "shy" },
          { text: "Give a hesitant, faint smile before blushing and looking away.", score: "gentle" }
        ]
      },
      {
        speaker: "INNER VOICE",
        text: "I was too terrified to speak a single word. But from that 7th-grade morning at SVEC, my heart quietly belonged to her.",
        type: "monologue"
      }
    ]
  },
  {
    id: "act-2",
    actNum: "ACT II",
    title: "The Serendipitous Tuition",
    subtitle: "Age 13-14 • 7th & 8th Grade",
    quote: "Fate has a way of wrapping miracles in the simplest coincidences.",
    objective: "Step onto the tuition veranda and sit across the wooden study desk",
    environment: "tuition_house",
    lighting: "rainy_amber_dusk",
    rain: true,
    playerAge: "young_teen",
    targetLocation: { x: 0, z: -12 },
    interactPrompt: "Sit at Study Table",
    dialogues: [
      {
        speaker: "INNER VOICE",
        text: "8th grade arrived. My parents told me I needed extra help in mathematics, so they enrolled me in a neighborhood evening tuition.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "I walked up the veranda steps in the soft evening rain, nervous and drenched. The wooden door swung open...",
        type: "monologue"
      },
      {
        speaker: "TUITION TEACHER",
        text: "Come in, beta! Take a seat at the study table. My daughter is working on her geometry homework right there.",
        type: "dialogue"
      },
      {
        speaker: "INNER VOICE",
        text: "My breath caught in my chest. The tuition teacher was HER mother. And sitting across the table with an open textbook... was HER.",
        type: "monologue"
      },
      {
        speaker: "HER",
        text: "Hey! You're from SVEC! Mom, he sits in my classroom! Wow, looks like we're study partners now.",
        type: "dialogue"
      },
      {
        speaker: "CHOICE",
        prompt: "She nudges an extra pencil toward you with a warm grin. How do you respond?",
        options: [
          { text: "'I... I guess neither of us can escape math homework today.'", score: "warm" },
          { text: "'Thank you... I never expected you would be here.'", score: "tender" }
        ]
      },
      {
        speaker: "INNER VOICE",
        text: "For the next two years, that veranda was heaven. We studied in the same SVEC class by day, and solved algebra side-by-side by night.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "Passing secret notes between geometry pages, laughing silently whenever her mother stepped inside to brew ginger tea. Every single rainy dusk deepened our unspoken bond.",
        type: "monologue"
      }
    ]
  },
  {
    id: "act-3",
    actNum: "ACT III",
    title: "The Divided Corridors",
    subtitle: "Age 15 • 9th & 10th Grade",
    quote: "Sometimes silence begins with a single letter on a notice board.",
    objective: "Approach the SVEC academic notice board to check the class rosters",
    environment: "svec_divided_hallway",
    lighting: "overcast_autumn",
    rain: false,
    playerAge: "teen",
    targetLocation: { x: 0, z: -15 },
    interactPrompt: "Read Notice Board",
    dialogues: [
      {
        speaker: "INNER VOICE",
        text: "We finished 8th grade believing we would always sit across from each other. But SVEC had other plans.",
        type: "monologue"
      },
      {
        speaker: "SCHOOL NOTICE",
        text: "SVEC ACADEMIC REASSIGNMENT: Section 9-A: [Her Name]. Section 9-B: [Your Name].",
        type: "system"
      },
      {
        speaker: "INNER VOICE",
        text: "A single letter difference on a board. Her classroom was at the far east wing; mine was tucked away in the west hall.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "Her tuition classes changed too. Just like that, our daily world fractured.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "Throughout 9th and 10th grade, we would pass each other in the crowded SVEC corridor between bells. Her eyes would meet mine for just a fleeting second.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "I wanted to call out her name. I wanted to tell her I missed her every single day. But the introvert inside me remained silent, and the distance won.",
        type: "monologue"
      }
    ]
  },
  {
    id: "act-4",
    actNum: "ACT IV",
    title: "The Three Years of Static",
    subtitle: "Age 16-19 • The Silence",
    quote: "1,095 days of silence. Not a call, not a meeting, not a glimpse.",
    objective: "Walk to your midnight desk and inspect your smartphone",
    environment: "midnight_room",
    lighting: "midnight_blue_neon",
    rain: false,
    playerAge: "young_adult",
    targetLocation: { x: 0, z: -10 },
    interactPrompt: "Unlock Smartphone",
    isPhoneChapter: true,
    dialogues: [
      {
        speaker: "INNER VOICE",
        text: "Three years passed. School ended, college began. Three whole years without hearing her voice or catching a glimpse of her face.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "I told myself she was a chapter closed forever. But some memories are burned into your soul.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "It was 2:14 AM. While scrolling late at night, a recommended profile appeared on my screen. Her picture.",
        type: "monologue"
      }
    ]
  },
  {
    id: "act-5",
    actNum: "ACT V",
    title: "The Four Golden Years",
    subtitle: "Age 20-24 • Pure Joy & Euphoria",
    quote: "Four years of wild laughter, midnight roads, and promises carved into the stars.",
    objective: "Walk along the starry city overlook towards the bench where she awaits",
    environment: "city_overlook",
    lighting: "romantic_starlight",
    rain: false,
    playerAge: "adult",
    targetLocation: { x: 0, z: -16 },
    interactPrompt: "Hold Her Hand",
    dialogues: [
      {
        speaker: "INNER VOICE",
        text: "That single midnight text broke three years of silence. When we finally met, all the lost time melted away within seconds.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "For the next four years, our life was pure bliss. It was the happiest, most magical time of my entire existence.",
        type: "monologue"
      },
      {
        speaker: "HER",
        text: "Remember riding your beat-up scooter at 1:00 AM, freezing in the winter breeze just to get roadside tea? I held on to your jacket so tight my knuckles went white!",
        type: "dialogue"
      },
      {
        speaker: "HER",
        text: "And dancing in the unexpected summer rain outside the café until we were completely soaked? We laughed until our stomachs hurt.",
        type: "dialogue"
      },
      {
        speaker: "HER",
        text: "You're my home. When we get married, we're going to build the most beautiful life together. Promise me you'll never let go.",
        type: "dialogue"
      },
      {
        speaker: "CHOICE",
        prompt: "Under the canopy of stars, looking into her glowing eyes. What do you whisper?",
        options: [
          { text: "'I swear to you... I will work with everything in me to give you a life so magical you'll never shed a tear.'", score: "devoted" },
          { text: "'Ever since that 7th-grade morning at SVEC, you have been my only dream.'", score: "tender" }
        ]
      },
      {
        speaker: "INNER VOICE",
        text: "Four years of crazy adventures, whispered wedding vows, and unconditional devotion. We were beginning our careers. I truly thought our love could conquer any storm.",
        type: "monologue"
      }
    ]
  },
  {
    id: "act-6",
    actNum: "ACT VI",
    title: "The Middle-Class Reality",
    subtitle: "Age 24 • The Divergence",
    quote: "When dreams of status collide with love, truth is the hardest pill to swallow.",
    objective: "Walk past the luxury car showroom to meet her outside the café",
    environment: "luxury_avenue",
    lighting: "dusk_stormy_drizzle",
    rain: true,
    playerAge: "adult",
    targetLocation: { x: 0, z: -15 },
    interactPrompt: "Talk to Her",
    dialogues: [
      {
        speaker: "INNER VOICE",
        text: "As we stepped deeper into our twenties, the harsh weight of reality began to crush our paradise.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "I was from an ordinary middle-class family. I was grinding 15-hour days, riding an old commuter bike in the rain, struggling to help my aging parents pay off debts. We couldn't afford a car.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "Meanwhile, her social circle shifted. Her conversations started revolving around luxury penthouses, foreign vacations, and imported sports cars.",
        type: "monologue"
      },
      {
        speaker: "HER",
        text: "Look at those German sports cars inside the showroom. Everyone at my office is getting engaged to people who can provide a lavish, secure life right now.",
        type: "dialogue"
      },
      {
        speaker: "HER",
        text: "You don't even have a car for your family. We're still riding this damp scooter in the drizzle. Love is romantic, but love can't buy the lifestyle I dream of.",
        type: "dialogue"
      },
      {
        speaker: "CHOICE",
        prompt: "Her tone is cold and detached. How do you respond?",
        options: [
          { text: "'Please have faith in me! I have massive ambitions... give me time, I swear I will build everything you ever dreamed of!'", score: "plead" },
          { text: "'Is an expensive car really worth throwing away four years of pure love and all our promises?'", score: "hurt" }
        ]
      },
      {
        speaker: "INNER VOICE",
        text: "She didn't answer. She just stared at the gleaming chrome of the luxury cars, and for the first time, she felt like a complete stranger.",
        type: "monologue"
      }
    ]
  },
  {
    id: "act-7",
    actNum: "ACT VII",
    title: "The Severance",
    subtitle: "Age 25 • The Day Love Died",
    quote: "The final words didn't come with tears. They came with surgical precision.",
    objective: "Walk under the lone sodium streetlamp in the pouring rain",
    environment: "rainy_crossroads",
    lighting: "dark_heavy_rain",
    rain: true,
    playerAge: "heartbroken",
    targetLocation: { x: 0, z: -14 },
    interactPrompt: "Hear Her Verdict",
    isBreakupChapter: true,
    dialogues: [
      {
        speaker: "INNER VOICE",
        text: "A violent storm tore across the city that night. Heavy rain hammered the wet asphalt.",
        type: "monologue"
      },
      {
        speaker: "HER",
        text: "I'm going to be direct with you. I don't want to sugarcoat this anymore.",
        type: "dialogue"
      },
      {
        speaker: "HER",
        text: "I want a luxurious life. I want wealth, comfort, and zero financial risk. You're still struggling, and I refuse to compromise my dream life waiting for you. We are done.",
        type: "dialogue"
      },
      {
        speaker: "INNER VOICE",
        text: "There was no hesitation in her voice. No tears. No regret. Just a cold calculation.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "In that exact second... something profound inside my chest died. The love that had lived in my soul since 7th grade at SVEC washed away on the freezing street.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "She raised her black umbrella and walked into the storm. She never looked back once.",
        type: "monologue"
      }
    ]
  },
  {
    id: "act-8",
    actNum: "ACT VIII",
    title: "The Ashes of Ambition",
    subtitle: "Epilogue • The Untold Truth",
    quote: "She thought she was the one who dreamed of luxury. She never knew the truth.",
    objective: "Walk to the rooftop ledge and inspect the glowing memory crystals",
    environment: "midnight_rooftop",
    lighting: "midnight_rooftop_storm",
    rain: true,
    playerAge: "epilogue",
    targetLocation: { x: 0, z: -16 },
    interactPrompt: "Inspect Memory Crystals",
    isEpilogueChapter: true,
    dialogues: [
      {
        speaker: "INNER VOICE",
        text: "Standing alone on this rooftop in the freezing midnight rain, looking out over the glowing megacity...",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "She left me believing I was just an ordinary middle-class boy with small, mediocre dreams.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "She never knew the truth.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "My dreams of wealth, power, and boundless luxury were ten times larger than anything she could ever imagine.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "The difference was: I didn't want wealth for status or vanity. I wanted to conquer the entire world simply to lay it at her feet.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "She was my only weakness. My sole driving force. And when she walked away... the fire turned to ash. The dream died with the love.",
        type: "monologue"
      },
      {
        speaker: "INNER VOICE",
        text: "From the quiet corridors of SVEC to this rain-drenched rooftop... it was always you. And now, only the silence remains.",
        type: "monologue"
      }
    ]
  }
];

export const MEMORY_VAULT = [
  {
    id: "mem-1",
    year: "2013 • SVEC",
    title: "The Blue Ribbon by the Fountain",
    desc: "She dropped her pencil case near the courtyard fountain. I picked up her blue highlighter, my hands shaking so badly I couldn't look up. That night, I wrote her name on the last page of my SVEC rough notebook.",
    reflection: "An introvert's love is silent, but it cuts deeper than any spoken vow."
  },
  {
    id: "mem-2",
    year: "2014 • EVENING TUITION",
    title: "Geometry on the Veranda",
    desc: "Her mother was inside brewing ginger tea while rain softly tapped on the roof. She whispered, 'Help me solve number 7, quick!' Our fingers brushed as she slid her notebook across the wooden desk. Neither of us pulled away.",
    reflection: "Those two years of evening tuition felt like an eternity carved out of heaven."
  },
  {
    id: "mem-3",
    year: "2016 • SVEC CORRIDOR",
    title: "Section 9-B Passing 9-A",
    desc: "We were only ten feet apart in the crowded hallway between bells. She made eye contact for half a second before her friends pulled her along. That single half-second kept hope alive in me for years.",
    reflection: "Distance isn't measured in kilometers. It is measured in the hesitation to speak."
  },
  {
    id: "mem-4",
    year: "2021 • THE MIDNIGHT OVERLOOK",
    title: "The Tea Stall & The Scooter",
    desc: "My 100cc scooter sputtered on the steep hilltop road. She hugged me tight from behind against the cold wind and laughed: 'We'll make it to the top anyway!' We drank roadside tea and promised to conquer the world together.",
    reflection: "We were rich in everything that money could never buy."
  },
  {
    id: "mem-5",
    year: "2025 • THE SHOWROOM WINDOW",
    title: "The Luxury Coupe We Never Bought",
    desc: "A silver German sports coupe under the showroom floodlights. She stared at it with longing. I wanted to tell her: 'I am grinding to build an empire that will make this entire showroom look small. Just give me time.' But she had already stopped believing.",
    reflection: "Patience is luxury's enemy. When she walked away, the dream didn't matter anymore."
  }
];
