'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const numberPositionMap = {
  1: [0, 1],
  2: [2, 0],
  3: [0, 0],
  4: [2, 2],
  5: [1, 2],
  6: [1, 0],
  7: [1, 1],
  8: [2, 1],
  9: [0, 2],
};

// Full prediction library — already pasted above
const predictionLibrary = {
    1: {
      1: {
        label: "Solar Spark — confident but growing",
        positives: [' Leadership', 'Independence', 'Ambition'],
        negatives: ['Impatience', 'Ego clashes'],
        advice: 'Stay humble. Lead with vision, not control.',
      },
      2: {
        label: 'Double Sun — assertive, radiant force',
        positives: ['Natural leadership', 'Bold expression'],
        negatives: ['Authoritarian tendency', 'Resistant to guidance'],
        advice: 'Channel your authority into service, not power.',
      },
      3: {
        label: 'Triple Sun — dominant presence',
        positives: ['Magnetism', 'Public recognition'],
        negatives: ['Overbearing', 'Inflexible'],
        advice: 'Balance your shine with collaboration.',
      },
      4: {
        label: 'Blazing Star — intense drive to lead',
        positives: ['Visionary power', 'Trailblazer'],
        negatives: ['Isolation', 'Leadership burnout'],
        advice: 'Rest, delegate, and share responsibility.',
      },
    },
    2: {
      1: {
        label: 'Lunar Calm — sensitive and kind',
        positives: ['Empathy', 'Creativity', 'Harmony'],
        negatives: ['Emotional overload', 'Dependency'],
        advice: 'Use art or journaling to stay emotionally grounded.',
      },
      2: {
        label: 'Double Moon — deep emotional soul',
        positives: ['Deep understanding', 'Spiritual bonds'],
        negatives: ['Mood swings', 'Unspoken resentment'],
        advice: 'Practice emotional boundaries. Speak your truth.',
      },
      3: {
        label: 'Triple Moon — intuitive mystic',
        positives: ['Spiritual depth', 'Emotional wisdom'],
        negatives: ['Hypersensitivity', 'Confusion in decisions'],
        advice: 'Seek clarity before emotional reaction.',
      },
      4: {
        label: 'Mystic Waters — flow of empathy',
        positives: ['Healer energy', 'Inner vision'],
        negatives: ['Psychic overload', 'Escape tendency'],
        advice: 'Protect your energy. Channel into healing work.',
      },
    },
    3: {
      1: {
        label: 'Joyful Spark — creative thinker',
        positives: ['Optimism', 'Communication', 'Humor'],
        negatives: ['Scattered focus', 'Overtalking'],
        advice: 'Ground your ideas. Let action follow expression.',
      },
      2: {
        label: 'Dual 3 — verbal mastery needing depth',
        positives: ['Emotional IQ', 'Persuasive tone'],
        negatives: ['Overexplaining', 'Emotional detachment'],
        advice: 'Pause before response. Create room for others.',
      },
      3: {
        label: 'Triple 3 — creative whirlwind',
        positives: ['Entrepreneur mind', 'Sharp wit'],
        negatives: ['Burnout risk', 'Overcommitment'],
        advice: 'Create space to rest and reflect regularly.',
      },
      4: {
        label: 'Storm of Ideas — powerful voice',
        positives: ['Marketing genius', 'Movement starter'],
        negatives: ['Inconsistency', 'Career instability'],
        advice: 'Ground yourself in value, not applause.',
      },
    },
    4: {
      1: {
        label: 'Rahu’s Order — builder and planner',
        positives: ['Hardworking', 'Loyal', 'Logical'],
        negatives: ['Rigidity', 'Overwork'],
        advice: 'Allow for flow. Adaptation is your key to success.',
      },
      2: {
        label: 'Double 4 — karmic foundation',
        positives: ['Structured life', 'Security'],
        negatives: ['Resistance to change', 'Stubborn behavior'],
        advice: 'Let go of control in uncertain paths.',
      },
      3: {
        label: 'Triple 4 — path of tests',
        positives: ['Master builder energy', 'Persistence'],
        negatives: ['Delays', 'Overthinking'],
        advice: 'Focus on progress, not perfection.',
      },
      4: {
        label: 'Sacred Architect — intense discipline',
        positives: ['Legacy maker', 'Mentor archetype'],
        negatives: ['Loneliness', 'Emotional distance'],
        advice: 'Invite joy and spontaneity.',
      },
    },
    5: {
      1: {
        label: 'Mercury Breeze — quick but scattered',
        positives: ['Witty', 'Charming', 'Versatile'],
        negatives: ['Distractible', 'Impulsive'],
        advice: 'Anchor your energy with routine.',
      },
      2: {
        label: 'Dual Mercury — verbal mastery',
        positives: ['Orator', 'Emotionally sharp'],
        negatives: ['Gossip', 'Restlessness'],
        advice: 'Listen deeply before you speak.',
      },
      3: {
        label: 'Mercury Cyclone — persuasive power',
        positives: ['Entrepreneur mind', 'Quick execution'],
        negatives: ['Nervous tension', 'Burnout'],
        advice: 'Slow down. Breathe. Choose your direction.',
      },
      4: {
        label: 'Mercurial Genius — communication force',
        positives: ['Marketing genius', 'Trend leader'],
        negatives: ['Superficiality', 'Emotional void'],
        advice: 'Ground your words in truth and purpose.',
      },
    },
    6: {
      1: {
        label: 'Venus Touch — peaceful heart',
        positives: ['Romantic', 'Artistic', 'Home-loving'],
        negatives: ['Over-sacrificing'],
        advice: 'Prioritize your own needs gently.',
      },
      2: {
        label: 'Double Venus — deep love pattern',
        positives: ['Devoted', 'Spiritually inclined'],
        negatives: ['Co-dependency', 'Jealousy'],
        advice: 'Nurture without losing yourself.',
      },
      3: {
        label: 'Triple Venus — divine mother energy',
        positives: ['Creative', 'Emotional warmth'],
        negatives: ['Emotional entanglement'],
        advice: 'Establish healthy love boundaries.',
      },
      4: {
        label: 'Venus Overdrive — beauty and burden',
        positives: ['Spiritual magnet', 'Universal love'],
        negatives: ['Overdramatizing', 'Idealistic pain'],
        advice: 'Balance giving with receiving.',
      },
    },
    7: {
      1: {
        label: 'Ketu Light — detached thinker',
        positives: ['Spiritual', 'Wise', 'Introspective'],
        negatives: ['Loner tendencies', 'Isolation'],
        advice: 'Express and connect through grounded action.',
      },
      2: {
        label: 'Double Ketu — mystic and mirror',
        positives: ['Inner peace', 'Spiritual insights'],
        negatives: ['Mental fog', 'Avoidance'],
        advice: 'Speak your truth even in silence.',
      },
      3: {
        label: 'Triple Ketu — channel of mysticism',
        positives: ['Healing abilities', 'Sacred detachment'],
        negatives: ['Unseen suffering'],
        advice: 'Ground yourself through purpose.',
      },
      4: {
        label: 'Silent Sage — the ancient soul',
        positives: ['Unmatched intuition', 'Psychic strength'],
        negatives: ['Social disconnection'],
        advice: 'Build soul community.',
      },
    },
    8: {
      1: {
        label: 'Saturn’s Call — karmic builder',
        positives: ['Disciplined', 'Responsible'],
        negatives: ['Delayed success'],
        advice: 'Your timing is divine — trust it.',
      },
      2: {
        label: 'Double Saturn — tested strength',
        positives: ['Endurance', 'Emotional maturity'],
        negatives: ['Suppressed emotions'],
        advice: 'Let your emotions flow, not block.',
      },
      3: {
        label: 'Triple Saturn — karmic intensity',
        positives: ['Mentor energy', 'Financial planner'],
        negatives: ['Heavy energy', 'Loneliness'],
        advice: 'Create balance with joy and lightness.',
      },
      4: {
        label: 'Saturn Forge — deep karma worker',
        positives: ['Legacy builder'],
        negatives: ['Isolation', 'Burden bearer'],
        advice: 'Heal your own inner wounds first.',
      },
    },
    9: {
      1: {
        label: 'Mars Pulse — energetic leader',
        positives: ['Determined', 'Bold', 'Resilient'],
        negatives: ['Reactive'],
        advice: 'Pause before action. Power lies in patience.',
      },
      2: {
        label: 'Double Mars — intense drive',
        positives: ['Fighter spirit', 'Unstoppable force'],
        negatives: ['Confrontational'],
        advice: 'Choose your battles wisely.',
      },
      3: {
        label: 'Triple Mars — spiritual warrior',
        positives: ['Conflict resolution', 'Purpose-led'],
        negatives: ['Volatility', 'Emotional bursts'],
        advice: 'Breathe deeply. Let service guide you.',
      },
      4: {
        label: 'Karmic Flame — soul path of fire',
        positives: ['Transformational leader'],
        negatives: ['Burnout pattern', 'Martyr complex'],
        advice: 'Protect your flame. Serve with care.',
      },
    },
  };

  const combinationInsights = [
    {
      condition: (freqMap) =>
        freqMap[3] >= 1 &&
        freqMap[1] >= 1 &&
        !freqMap[9], // 9 is missing
      label: 'Combination 3 & 1 (without 9)',
      title: 'Sun-Jupiter Alignment — Knowledge Through Discipline',
      behavioral: [
        'Highly educated and intellectually curious',
        'Diligent workers with long-term focus',
        'Respected for wisdom and communication skills',
      ],
      professional: [
        'Teaching',
        'Public Speaking',
        'Consulting',
        'Law',
        'Counseling',
      ],
      negatives: [
        'High standards may make them rigid or judgmental',
        'Lack of number 9 leads to imbalance in emotional depth',
      ],
      notes: [
        'Pursue advanced education, but stay open to emotional growth',
        'Combine wisdom with empathy for better life balance',
      ]
    },
    {
      condition: (freqMap) =>
        freqMap[3] >= 1 &&
        freqMap[1] >= 1 &&
        freqMap[9] >= 1, // 9 is now present
      label: 'Presence of Number 9 with 3 & 1',
      title: 'Mars Adds Emotional Maturity to Sun-Jupiter Alignment',
      color: 'text-green-300',
      behavioral: [
        'Emotional grounding balances intellectual dominance',
        'Compassion, empathy, and patience emerge in leadership',
        'Reduces rigid or judgmental tendencies of 1 & 3 combo'
      ],
      notes: [
        'This is a powerful combination for healing leaders, teachers, and guides',
        'Adds emotional intelligence to decision-making and public communication'
      ]
    },
    
    {
      condition: (freq) => freq[2] >= 1 && freq[6] >= 1 && !freq[3],
      label: 'Combination: 2 & 6 — 3 Missing (Moon-Venus)',
      title: 'Moon-Venus Connection Without Jupiter — Creativity Without Logic',
      color: 'text-pink-300',
      behavioral: [
        "Attractive and naturally charismatic — draws people with emotional depth",
        "Emotionally sensitive, easily influenced by surroundings and energy",
        "Strong artistic and creative instincts — emotionally expressive personalities",
        "Intensified sensitivity when multiple 2s are present"
      ],
      professional: [
        "Excellent in artistic fields like acting, painting, writing, and music",
        "Media-savvy individuals may shine in TikTok, YouTube, journalism, or film",
        "Venus-Moon influence brings fame in creative industries"
      ],
      negatives: [
        "Emotional turbulence and over-sensitivity — may overreact or feel misunderstood",
        "Romantic instability — multiple relationships or attachment issues possible",
        "Conflicts with in-laws or extended family due to emotional friction"
      ],
      notes: [
        "Combination favors art, music, writing — channel emotional sensitivity constructively",
        "Absence of 3 reduces logic or intellectual filtering — decisions led by heart, not mind",
        "Multiple 6s can create bluntness, sarcasm, or emotional imbalance — must stay grounded"
      ]
    },
      {
        condition: (freqMap) =>
          freqMap[3] >= 1 &&
          freqMap[7] >= 1 &&
          freqMap[9] >= 1,
        label: 'Combination 3, 7 & 9 (Jupiter-Ketu-Mars)',
        title: 'Spiritual Trinity — Guru, Liberation, and Energy',
        behavioral: [
          'Deeply spiritual and wisdom-seeking individuals',
          'Possess a natural detachment from materialism',
          'Emotionally calm with strong moral and inner compass',
          'Drawn to truth, enlightenment, and higher purpose',
        ],
        professional: [
          'Likely to become spiritual teachers, counselors, or guides',
          'Success in meditation-based healing, astrology, or inner development fields',
          'Excel in research, writing, and philosophy-driven professions'
        ],
        negatives: [
          'Struggles with worldly attachment or ambition',
          'May appear aloof or too withdrawn from social expectations',
          'Tendency to overlook practical matters in pursuit of spiritual growth'
        ],
        notes: [
          'This trio marks a transformative phase — powerful inner evolution awaits',
          'Jupiter adds wisdom, Ketu brings detachment, and Mars drives action — perfect synergy for spiritual mastery',
          'May face solitude early in life, but it prepares them to become guides for others',
        ]
      },
      {
        condition: (freqMap) =>
          freqMap[6] >= 1 &&
          freqMap[5] >= 1 &&
          !freqMap[7], // 7 is missing
        label: 'Combination 6 & 5 (without 7)',
        title: 'Venus-Mercury Clash — Communication vs Desire',
        behavioral: [
          'Internal opposition may lead to confusion in decision-making',
          'Often experience a clash between love and logic',
          'Strong business mindset, but difficulty asserting value',
          'Find it hard to express emotions or negotiate clearly',
        ],
        professional: [
          'Can thrive in business or creative fields with structured discipline',
          'Possess good financial sense but may under-communicate ideas',
          'Potential success in media, art, or fashion if communication is improved'
        ],
        negatives: [
          'Obstacles in higher education due to internal confusion or poor planning',
          'Communication challenges lead to misunderstandings',
          'Family conflicts may arise due to opposing values or unclear expression',
          'Romantic relationships may be unstable or fail due to misaligned energies',
        ],
        notes: [
          'Repetition of 6 or 5 does not change the core energy — opposition remains',
          'Clarity in communication is key to unlocking professional and emotional success',
          'Embrace structure to balance creative desires and intellectual pursuits',
        ]
      },
      {
        condition: (freqMap) =>
          freqMap[6] >= 1 &&
          freqMap[7] >= 1 &&
          !freqMap[5], // 5 is missing
        label: 'Combination 6 & 7 (without 5)',
        title: 'Venus-Ketu Blend — Charisma and Dual Life Path',
        behavioral: [
          'Naturally attractive and emotionally magnetic',
          'May display flirtatious or playboy/playgirl tendencies',
          'Business-minded with artistic leanings',
          'Often experience admiration due to charm and elegance'
        ],
        professional: [
          'Success in artistic careers, fashion, or entertainment',
          'Potential for commercial success in entrepreneurship',
          'Can blend creativity with business instincts effectively'
        ],
        negatives: [
          'Multiple 6s — foul language or blunt speech may ruin bonds',
          'Multiple 7s — instability in relationships and decision-making',
        ],
        notes: [
          'Often blessed with stable relationships if grounded by emotional depth',
          'Highly intuitive and perceptive in love and social dynamics',
          'Avoid use of sharp words in romantic or professional disputes',
          'Presence of 5 is crucial to anchor scattered energies — its absence may increase unpredictability'
        ]
      },
      {
        condition: (freqMap) =>
          freqMap[1] >= 1 &&
          freqMap[7] >= 1 &&
          !freqMap[8], // 8 is missing
        label: 'Combination 1 & 7 (without 8)',
        title: 'Sun-Ketu Raj Yoga — Lucky Streak with Early Success',
        behavioral: [
          'Form a Raj Yoga — highly fortunate alignment in Vedic numerology',
          'Tend to attract positive outcomes in life effortlessly',
          'Strong romantic magnetism; often attract meaningful relationships',
          'Inclined towards early stability and emotional maturity'
        ],
        professional: [
          'Early success in career, especially in government or public roles',
          'Favorable for achieving financial prosperity at a young age',
          'Leadership potential in service-based or administrative roles'
        ],
        negatives: [
          'Multiple sevens may introduce life instability and challenges',
          'Romantic life may involve multiple love affairs or emotional intensity',
        ],
        notes: [
          'This is one of the most auspicious combinations in numerology',
          'Even with repeated 1s or 7s, the inherent good fortune remains strong',
          'Avoid number 8 for maintaining smooth energy — its presence reduces this luck',
          'Ideal to capitalize on early opportunities to build long-term gains',
          'Known to bring Raj Yoga benefits — wealth, power, and marital harmony'
        ]
      },
      {
        condition: (freqMap) =>
          freqMap[1] >= 1 &&
          freqMap[8] >= 1 &&
          !freqMap[7], // 7 is missing
        label: 'Combination 1 & 8 (without 7)',
        title: 'Sun-Saturn Strain — Success Through Emotional Resilience',
        behavioral: [
          'Often subjected to insults, humiliations, and misunderstandings',
          'Strained father-son or authority figure relationships',
          'Emotionally sensitive to setbacks and rejection',
          'May face frequent personal and professional resistance',
        ],
        professional: [
          'Can work well in legal, policy, or bureaucratic fields with patience',
          'Slow but steady career growth possible through perseverance',
        ],
        negatives: [
          'Losses due to government authorities or litigation',
          'Obstacles in career growth and public recognition',
          'Legal issues and conflicts with regulations',
          'Delayed promotions and blocked recognition',
        ],
        notes: [
          'Double 8s can neutralize harsh effects and lead to success over time',
          'Triple 8s (888) worsen issues — more delays, blocks, humiliation',
          'Without number 7, patience and emotional balance is often lacking',
          'Emotional resilience is critical to overcome setbacks and societal hurdles',
          'Success is possible but requires persistent inner strength and control over reactions',
        ]
      },
      {
        condition: (freqMap) =>
          freqMap[7] >= 1 &&
          freqMap[8] >= 1 &&
          !freqMap[1], // 1 is missing
        label: 'Combination 7 & 8 (without 1)',
        title: 'Ketu-Saturn Karma Clash — Spiritual Growth through Trials',
        behavioral: [
          'Highly spiritual — may pursue meditation, healing, or occult practices',
          'Emotionally detached from material goals',
          'Can be natural emotional and physical healers',
          'Deep introspective and intuitive nature',
        ],
        professional: [
          'May excel in alternative medicine, yoga, or spiritual counseling',
          'Can thrive in solitary or research-based professions',
        ],
        negatives: [
          'Reduced luck — may attract misfortunes or bad timing',
          'Chronic pessimism and hopelessness in life',
          'Lack of intimacy or satisfaction in marriage',
          'Tendency toward isolation, indifference, and emotional coldness',
        ],
        notes: [
          'Double 8s improve luck and neutralize misfortunes in this combination',
          'Triple 8s (888) intensify negative effects — delays, anxiety, and instability',
          'Double or multiple 7s increase emotional instability, anxiety, and detachment',
          'Spiritual growth is accelerated through facing life’s emotional trials',
          'Material success is difficult unless karmic energies are addressed through grounding or remedies',
        ]
      },
      {
        condition: (freqMap) =>
          freqMap[3] >= 1 &&
          freqMap[6] >= 1 &&
          !freqMap[2], // number 2 is missing
        label: 'Combination 3 & 6 (without 2)',
        title: 'Jupiter-Venus Duo — Idealism and High Standards in Relationships',
        behavioral: [
          'Idealistic nature with strong moral values',
          'Lack of self-presentation skills — may struggle to express or present themselves well',
          'High ethical standards may lead to inflexibility',
          'Meticulous expectations in marriage and relationships',
          'Strong sense of right and wrong, may exhibit ego-driven idealism',
        ],
        professional: [
          'May pursue higher education or lifelong learning',
          'Strong alignment towards careers involving ethical leadership, teaching, or counseling',
        ],
        negatives: [
          'Harsh communication style (especially with multiple 6s) may damage relationships',
          'Struggles in marriage due to high expectations or lack of compromise',
          'Ego and rigidity may affect adaptability and professional growth',
        ],
        notes: [
          'Growth often follows marriage — many natives experience transformative life events post-marriage',
          'Spiritual or religious inclination enhances their moral compass',
          'If number 3 is in excess, it balances rigidity and improves flexibility',
          'If number 6 is in excess, it enhances harshness in communication and interpersonal friction',
        ]
      },
      {
        condition: (freq) => freq[3] >= 1 && freq[2] >= 1 && !freq[6],
        label: 'Combination: 3 & 2 — 6 Missing (Jupiter-Moon)',
        color: 'text-purple-300',
        data: {
          behavioral: [
            "Strong creative intellect and knowledge in arts or communication",
            "Emotional but expressive, with good storytelling or writing ability",
            "Tendency to gain weight — sluggishness or imbalance in physical energy",
            "Arrogance or overconfidence may affect relationships and learning"
          ],
          professional: [
            "Creative fields like writing, public speaking, or education",
            "Arts, literature, and media-based careers are favorable",
            "May face delays or setbacks in completing higher education"
          ],
          negatives: [
            "Child-related difficulties — issues with conception, parenting, or bonding with children",
            "Obstacles in education — delayed graduation, interruptions in academic paths",
            "Weight-related concerns (Kapha dosha dominance), health management becomes essential",
            "Large number of enemies — but rarely harmful; more like misunderstandings or rivalry"
          ],
          notes: [
            "Presence of 3 & 2 without 6 may lead to emotional blockage in love or parenting",
            "Arrogance and ego could affect both personal and professional connections",
            "Creative energy is high — but must be managed with humility and consistency"
          ]
        }
      },
      {
        condition: (freq) => freq[2] >= 1 && freq[4] >= 1 && !freq[8],
        label: 'Combination: 2 & 4 — 8 Missing (Moon-Rahu)',
        color: 'text-pink-400',
        data: {
          behavioral: [
            "Dominant presence of negative thinking patterns — prone to seeing the worst in situations",
            "Clever but may be misguided — intelligence used in the wrong direction",
            "Prone to meticulous but manipulative planning — capable of concealing intent",
            "May be susceptible to criminal or morally grey behavior if not guided well"
          ],
          professional: [
            "May excel in strategic roles but must avoid unethical shortcuts",
            "Requires strong moral grounding for career stability",
            "Good at execution but can face downfall due to unethical behavior"
          ],
          negatives: [
            "Emotional instability due to constant inner conflict and pessimism",
            "Legal issues may arise due to misleading or manipulative tendencies",
            "Expenditure on vices — financial instability, lack of restraint",
            "May struggle with forming stable relationships due to internal mistrust"
          ],
          notes: [
            "Multiple 2s (22, 222) or odd 4s (4, 444) amplify the negative effects — self-improvement is essential",
            "Even-numbered 4s (44, 4444) can soften and balance the severity of this combination",
            "This is a karmic test of direction and intention — inner discipline and spiritual remedies are vital"
          ]
        }
      },
      {
        condition: (freq) => freq[2] >= 1 && freq[8] >= 1 && !freq[4],
        label: 'Combination: 2 & 8 — 4 Missing (Moon-Saturn)',
        color: 'text-sky-400',
        data: {
          behavioral: [
            "May exhibit superiority complex when numbers 1 or 9 are present — morally or intellectually dominant",
            "May develop inferiority complex when 1 and 9 are absent — low self-worth or validation-seeking behavior",
            "Negative thought patterns: prone to overanalyzing, pessimism, or emotional heaviness",
            "Work in haste or act impulsively under pressure due to Moon-Saturn imbalance"
          ],
          professional: [
            "Can thrive in self-improvement, healing, or support-related fields",
            "Slow but steady career development — requires discipline and emotional stability",
            "Struggles in high-stress leadership roles unless emotional regulation is developed"
          ],
          negatives: [
            "Prone to depressive moods, sadness, and emotional volatility",
            "Family life may involve heavy responsibilities or emotional guilt",
            "Unresolved emotional cycles may create persistent mental instability"
          ],
          notes: [
            "If number 2 appears in multiples (22, 222), it worsens emotional turmoil and internal conflict",
            "Odd-numbered 8s (e.g., 8, 88, 888) enhance Moon-Saturn imbalance and increase internal struggle",
            "Even-numbered 8s (e.g., 88) reduce the negative impact and provide more grounded energy",
            "Emotional support, therapy, and grounding practices are essential for healing this combo"
          ]
        }
      },
      {
        condition: (freq) => freq[8] >= 1 && freq[4] >= 1 && !freq[2],
        label: 'Combination: 8 & 4 — 2 Missing (Saturn-Rahu)',
        color: 'text-violet-400',
        data: {
          behavioral: [
            "Prone to accidents or physical mishaps — requires caution in daily life and travel",
            "Irrational behavior and impulsive decisions due to lack of Moon's emotional balance",
            "Unrealistic goal-setting — strong desire for success but difficulty with follow-through",
            "Strong aptitude for research and problem-solving fields"
          ],
          professional: [
            "Excellent in investigative or research-based careers",
            "Best suited for technical fields requiring analytical thinking",
            "May struggle in client-facing or emotionally sensitive roles"
          ],
          negatives: [
            "Marital life may suffer due to emotional distance and miscommunication",
            "Can be affected by chronic health issues like diabetes or thyroid disorders",
            "Impulsive expenses, especially on vices, can lead to financial drain"
          ],
          notes: [
            "Triple 4 or 8 in chart can magnify the effects — increasing rigidity, health issues, and emotional instability",
            "To offset this, discipline and stable routines are key",
            "Success is possible with long-term persistence and emotional maturity efforts"
          ]
        }
      },
      {
        condition: (freq) =>
          freq[5] >= 1 && freq[4] >= 1 && !freq[9],
        label: 'Combination: 5 & 4 — 9 Missing (Financial Bandhan Yoga)',
        color: 'text-red-400',
        data: {
          behavioral: [
            "Impulsive with money — unplanned purchases and financial decisions",
            "Spendthrift tendencies — expenses may exceed income",
            "Lack of financial discipline leads to scattered financial focus",
            "High risk-taking behavior without proper assessment"
          ],
          professional: [
            "May struggle in roles requiring strong financial responsibility",
            "Should avoid high-risk investments or fast-return schemes",
            "Need structured budgeting and planning in career and business"
          ],
          negatives: [
            "Accumulation of debt due to poor money habits",
            "Recurring instability in financial matters",
            "Possible long-term financial struggles if not addressed early"
          ],
          notes: [
            "Presence of multiple 4s (like 44 or 444) intensifies or reduces the effect based on even/odd count",
            "Absence of 9 weakens emotional maturity, affecting money-related decisions",
            "Seek financial guidance and develop habits of saving and planning"
          ]
        }
      },
      {
        condition: (freq) => freq[5] >= 1 && freq[9] >= 1 && !freq[4],
        label: 'Combination: 5 & 9 — 4 Missing',
        color: 'text-orange-400',
        data: {
          behavioral: [
            "Sharp-minded with quick decision-making abilities",
            "Clever, resourceful, and quick-witted — both book smart and street smart",
            "Expressive, outspoken, and articulate in communication",
            "Naturally intelligent and intellectually curious learners"
          ],
          professional: [
            "Excel in roles involving communication, negotiation, and sales",
            "Strong business acumen and entrepreneurial edge",
            "Good at managing finances, investments, and business strategy"
          ],
          negatives: [
            "Lack of 4 may lead to instability or impulsiveness",
            "Overexpression may result in blunt or confrontational tone",
            "Multiple 5s or 9s can amplify nervous energy or cause confusion in values"
          ],
          notes: [
            "Very quick learners — may lack patience for slower environments",
            "Absence of 4 reduces grounding, leading to scattered focus despite brilliance",
            "Success shines through communication-heavy careers like business, media, or marketing"
          ]
        }
      },
      {
        condition: (freq) => freq[1] >= 1 && freq[9] >= 1 && !freq[3],
        label: 'Combination: 1 & 9 — 3 Missing',
        color: 'text-red-400',
        data: {
          behavioral: [
            "Fiery temperament due to Sun and Mars influence",
            "Natural inclination towards leadership and self-reliance",
            "Independent thinkers and problem solvers",
            "Inclined towards intellectual pursuits and higher learning"
          ],
          professional: [
            "Excel in fields requiring analytical thinking (e.g., engineering, surgery)",
            "Success comes through persistence and effort",
            "Prefer independent roles where they make autonomous decisions"
          ],
          negatives: [
            "High anger potential — struggle with impulsive reactions",
            "May find it difficult to maintain calm in challenging situations",
            "Missing number 3 leads to imbalance in expression and clarity of communication"
          ],
          notes: [
            "Requires effective anger management strategies to avoid professional or personal disruption",
            "The absence of number 3 reduces expressive balance and may suppress creativity",
            "Ideal career roles include leadership, research, and analytical domains"
          ]
        }
      },
      {
        condition: (freq) => freq[1] >= 1 && freq[3] >= 1 && !freq[9],
        label: 'Combination: 1 & 3 — 9 Missing',
        color: 'text-orange-300',
        data: {
          behavioral: [
            "Highly educated, pursue higher learning",
            "Respected for wisdom",
            "Diligent and committed to long-term success",
            "Effective communicators and counselors",
          ],
          professional: [
            "Excel in speech-driven roles (e.g., consultants, teachers)",
            "Strong potential for public speaking or leadership",
          ],
          negatives: [
            "Without 9 — struggles with emotional detachment, overthinking, and lack of closure",
          ],
          notes: [
            "Success comes through dedication, not shortcuts",
            "Father figures often play a pivotal shaping role",
            "Absence of 9 reduces spiritual protection and emotional resolution",
          ]
        }
      },
    ];

    const dashaCases = [
        {
          when: ({ maha, freqMap }) => maha === 1 && !freqMap[1],
          title: 'Mahadasha of 1 — Sun without 1 in Grid',
          color: 'text-yellow-300',
          traits: [
            'Increased anger and assertiveness',
            'Commanding presence, heightened ego',
            'Strong craving for respect and validation'
          ],
          advice: 'Practice patience and introspection. Avoid letting pride affect relationships.'
        },
        {
          when: ({ maha, freqMap }) =>
            maha === 1 && freqMap[1] === 1 && !freqMap[3] && !freqMap[9],
          title: 'Mahadasha of 1 — One Sun Present without Jupiter or Mars',
          color: 'text-yellow-300',
          traits: [
            'Confidence dips, hesitation in leadership',
            'Reduced ego, more humility',
            'Less assertive and authoritative'
          ],
          advice: 'Accept help. Build confidence slowly through conscious action.'
        },
        {
          when: ({ maha, destinyNumber }) => maha === 1 && destinyNumber === 1,
          title: 'Mahadasha of 1 — Sun as both Maha & Destiny',
          color: 'text-yellow-300',
          traits: [
            'High confidence and powerful self-image',
            'Tendency to dominate conversations and leadership spaces',
            'Increased sense of self-importance'
          ],
          advice: 'Stay grounded. True leadership is humble and empowering.'
        },
        {
          when: ({ maha, freqMap }) => maha === 1 && (freqMap[3] || freqMap[9]),
          title: 'Mahadasha of 1 — With Jupiter or Mars Present',
          color: 'text-yellow-300',
          traits: [
            'Leadership qualities rise strongly',
            'Anger becomes assertiveness',
            'Craving for respect sharpens'
          ],
          advice: 'Balance confidence with emotional intelligence.'
        },
        {
          number: 2,
          label: 'Dasha of Number 2 – MOON',
          color: 'text-green-300',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 2 && !freqMap[2],
              title: 'Moon Dasha — 2 Missing from Grid',
              traits: [
                "Increased emotional vulnerability and tears",
                "Tendency toward hypersensitivity and mood swings",
                "Emotional bonding and expression become core focus"
              ],
              advice: "Practice emotional grounding. Art, music, or journaling helps channel your emotions constructively."
            },
            {
              when: ({ maha, freqMap }) => maha === 2 && freqMap[2] >= 2,
              title: 'Moon Dasha — Multiple 2s in Grid',
              traits: [
                "Deep emotional intuition and psychic sensitivity",
                "Drawn to healing arts, music, poetry, or caregiving roles",
                "Can experience emotional overwhelm or confusion"
              ],
              advice: "Channel intuition wisely. Avoid overthinking or over-attachment in relationships."
            },
            {
              when: ({ maha }) => maha === 2,
              title: 'Moon Dasha — Normal Expression',
              traits: [
                "Emotionally expressive and artistically inclined",
                "Stronger need for nurturing and affection",
                "Increased creativity in writing, acting, or art"
              ],
              advice: "Use this time to pursue creative and healing outlets. Stay emotionally aware but not reactive."
            }
          ]
        },
        {
          number: 3,
          label: 'Dasha of Number 3 – JUPITER',
          color: 'text-blue-300',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 3 && !freqMap[3],
              title: 'Jupiter Dasha — 3 Missing from Grid',
              traits: [
                "Deep spiritual transformation and moral development",
                "Stronger sense of justice, ethics, and desire to guide others",
                "Marked increase in interest toward wisdom and teaching"
              ],
              advice: "Use this phase to build spiritual and ethical integrity. Excellent time to pursue higher studies or healing paths."
            },
            {
              when: ({ maha, freqMap }) => maha === 3 && freqMap[3] >= 2,
              title: 'Jupiter Dasha — 33 Present in Grid',
              traits: [
                "Public spiritual persona — may lean toward showmanship",
                "Moral flexibility possible — tendency to dilute strict ethics",
                "Family bonding and emotional ties may weaken slightly"
              ],
              advice: "Practice humility and stay aligned with true spiritual values. Don’t let public perception define your inner journey."
            },
            {
              when: ({ maha }) => maha === 3,
              title: 'Jupiter Dasha — Normal Expression',
              traits: [
                "Strong moral compass and high ethical standards",
                "Improved communication and teaching ability",
                "Increased inclination toward spirituality, charity, and wisdom"
              ],
              advice: "Be a guide to others through your own example. This is your time to lead with values and clarity."
            }
          ]
        },
        {
          number: 4,
          label: 'Dasha of Number 4 – RAHU',
          color: 'text-red-400',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 4 && !freqMap[4],
              title: 'Rahu Dasha — 4 Missing from Grid',
              traits: [
                "Severe lack of logical thinking; highly chaotic decision-making",
                "Strong illusion, fantasy-driven thinking, and detachment from reality",
                "Very high risk of financial loss and poor judgment in career or personal matters"
              ],
              advice: "Avoid loans, scams, and hasty decisions. Stick to routines and seek grounding through spiritual practices or mentors."
            },
            {
              when: ({ maha, freqMap }) => maha === 4 && freqMap[4] === 1,
              title: 'Rahu Dasha — Single 4 Present in Grid',
              traits: [
                "Tension between structure and chaos — may feel trapped or rebellious",
                "Restlessness and mood swings more frequent",
                "Creative but unstable energy — drawn toward rebellion or unconventional choices"
              ],
              advice: "Use creativity with caution. Keep routines tight and avoid letting unpredictability sabotage your goals."
            },
            {
              when: ({ maha, freqMap }) => maha === 4 && freqMap[4] >= 2,
              title: 'Rahu Dasha — 44 or More Present',
              traits: [
                "Grounded mindset with improved logic and financial control",
                "Still prone to illusion, but better equipped to manage it",
                "More balanced — can channel Rahu’s energy into creative breakthroughs"
              ],
              advice: "Stay alert and don’t get overconfident. You have a rare chance to turn Rahu’s chaos into creative genius — but only with self-discipline."
            }
          ]
        },
        {
          number: 4,
          label: 'Dasha of Number 4 – RAHU',
          color: 'text-red-400',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 4 && !freqMap[4],
              title: 'Rahu Dasha — 4 Missing from Grid',
              traits: [
                "Mentally unstable; frequent emotional detachment or confusion",
                "Strong illusion and disconnection from reality",
                "Impulse-driven actions with high potential for regret"
              ],
              advice: "Avoid overthinking. Stay rooted in routines, and seek clarity before any major decision — especially financial."
            },
            {
              when: ({ maha, freqMap }) => maha === 4 && freqMap[4] === 1,
              title: 'Rahu Dasha — Single 4 Present in Grid',
              traits: [
                "Dasha brings subtle shift from fantasy to focus",
                "Heightened creativity with a glimpse of grounded logic",
                "Visionary thinking starts to form structure"
              ],
              advice: "Take ideas seriously — write them down and turn them into structured action. Be wary of manipulation or deceit from others."
            },
            {
              when: ({ maha, freqMap }) => maha === 4 && freqMap[4] >= 2 && freqMap[4] < 4,
              title: 'Rahu Dasha — Double or Triple 4 Present (44 or 444)',
              traits: [
                "Better mental balance and financial clarity",
                "Can handle money and career matters more wisely",
                "Still vulnerable to compulsiveness and external illusions"
              ],
              advice: "Use your stability wisely — don't fall into overconfidence. Avoid debt and overpromising. Structure is your superpower."
            },
            {
              when: ({ maha, freqMap }) => maha === 4 && freqMap[4] >= 4,
              title: 'Rahu Dasha — 4444 or More Present in Grid',
              traits: [
                "Strong control over money and logic",
                "Practical thinking sharpens with visionary outlook",
                "Potential for promotions, raises, or project leadership"
              ],
              advice: "This is your growth phase — but don’t ignore your intuition. Avoid burnout or over-planning. Stay flexible but firm."
            }
          ]
        },
        {
          number: 5,
          label: 'Dasha of Number 5 – MERCURY',
          color: 'text-orange-400',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 5 && !freqMap[5],
              title: 'Mercury Dasha — 5 Missing from Grid',
              traits: [
                "Sudden boost in clarity, logic, and mental agility",
                "Productivity increases — follows routines strictly",
                "Feels mentally active, but prone to overworking mind"
              ],
              advice: "Use this phase to execute important plans. Don’t ignore rest or it may lead to anxiety and burnout."
            },
            {
              when: ({ maha, freqMap }) => maha === 5 && freqMap[5] === 1,
              title: 'Mercury Dasha — Single 5 Present in Grid',
              traits: [
                "Steady progress in finances and communication",
                "Learning capacity increases with practical focus",
                "Interest in system-based work or money planning"
              ],
              advice: "Stay consistent. Focus on time management and long-term investing or writing goals."
            },
            {
              when: ({ maha, freqMap }) => maha === 5 && freqMap[5] === 2,
              title: 'Mercury Dasha — Double 5 (55) in Grid',
              traits: [
                "Strong financial intelligence and strategy mindset",
                "Risk of overthinking or hyperactivity increases",
                "May stay too focused on analysis or money-based decisions"
              ],
              advice: "Balance logic with rest. Avoid becoming too analytical — trust your instincts too."
            },
            {
              when: ({ maha, freqMap }) => maha === 5 && freqMap[5] >= 3,
              title: 'Mercury Dasha — Triple 5 or More in Grid',
              traits: [
                "High speed thinking — powerful communication skills",
                "Excellent for career boosts, fame, and money",
                "Can lead to sleepless nights, excessive multitasking"
              ],
              advice: "Channel your energy into writing, media, finance, or digital growth. Meditation or journaling can balance the rush."
            }
          ]
        },
        {
          number: 6,
          label: 'Dasha of Number 6 – VENUS',
          color: 'text-pink-400',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 6 && !freqMap[6],
              title: 'Venus Dasha — 6 Missing from Grid',
              traits: [
                "Venus influence becomes dominant — romance and desire for luxury intensifies",
                "Strong emotional craving for love, attention, and beauty",
                "Can feel emotionally vulnerable or overly focused on relationships"
              ],
              advice: "Channel this energy into self-care, art, and relationship healing. Don’t chase luxury to fill emotional gaps."
            },
            {
              when: ({ maha, freqMap }) => maha === 6 && freqMap[6] === 1,
              title: 'Venus Dasha — Single 6 Present in Grid',
              traits: [
                "Romantic progress becomes smooth — love life feels naturally aligned",
                "Interest in grooming, fashion, and personal care increases",
                "More emotionally expressive and receptive in partnerships"
              ],
              advice: "Use this graceful energy to deepen emotional bonds and upgrade your lifestyle consciously."
            },
            {
              when: ({ maha, freqMap }) => maha === 6 && freqMap[6] === 2,
              title: 'Venus Dasha — Double 6 (66) in Grid',
              traits: [
                "Comfort and luxury seeking increases noticeably",
                "More expressive but may border on emotional indulgence",
                "Tendency toward vanity or comparing lifestyle with others"
              ],
              advice: "Focus on inner beauty and avoid overindulgence. Keep expectations in check, especially in love."
            },
            {
              when: ({ maha, freqMap }) => maha === 6 && freqMap[6] >= 3,
              title: 'Venus Dasha — Triple 6 or More in Grid',
              traits: [
                "Magnetism and charm at an all-time high — highly attractive energy",
                "Excellent time for success in beauty, fashion, luxury business",
                "But risks include over-expenditure, ego clashes in love"
              ],
              advice: "Be mindful of boundaries. Stay grounded while enjoying the spotlight and material gains."
            }
          ]
        },
        {
          number: 7,
          label: 'Dasha of Number 7 – KETU',
          color: 'text-cyan-300',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 7 && !freqMap[7],
              title: 'Ketu Dasha — 7 Missing from Grid',
              traits: [
                "Lack of spiritual grounding may cause instability and restlessness",
                "Frequent changes in job, location, or mindset",
                "Difficult to find inner peace or life direction during this phase"
              ],
              advice: "Stay rooted. Build a consistent spiritual routine to balance scattered energy."
            },
            {
              when: ({ maha, freqMap }) => maha === 7 && freqMap[7] === 1,
              title: 'Ketu Dasha — Single 7 Present in Grid',
              traits: [
                "Increased introspection and desire for solitude",
                "Mild anxiety and emotional sensitivity",
                "Inclination toward self-study, healing, or traveling inward"
              ],
              advice: "Embrace time alone. Journal, meditate, and trust the inner transformation process."
            },
            {
              when: ({ maha, freqMap }) => maha === 7 && freqMap[7] === 2,
              title: 'Ketu Dasha — Double 7 in Grid',
              traits: [
                "Deep emotional processing and detachment from worldly matters",
                "May experience unexpected changes in relationships or career",
                "Very intuitive but vulnerable to overthinking"
              ],
              advice: "Ground your insights in daily routines. Avoid impulsive decisions during emotional highs."
            },
            {
              when: ({ maha, freqMap }) => maha === 7 && freqMap[7] >= 3,
              title: 'Ketu Dasha — Triple 7 or More in Grid',
              traits: [
                "Extreme self-inquiry, may feel detached from society or isolated",
                "Powerful karmic events — past life patterns may surface",
                "Ideal time for transformation through spirituality or esoteric studies"
              ],
              advice: "Accept solitude as a teacher. Explore spiritual paths, astrology, or healing. Avoid escapism."
            }
          ]
        },
        {
          number: 8,
          label: 'Dasha of Number 8 – SATURN',
          color: 'text-purple-400',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 8 && !freqMap[8],
              title: 'Saturn Dasha — 8 Missing from Grid',
              behavioral: [
                'Hard work and perseverance become necessary for progress',
                'Delays, disappointments, and resistance are common',
                'Emotional intensity and negative attitude may arise',
                'Financial uncertainty and poor decision-making due to stress',
                'Decision-making becomes irrational or impulsive without grounding'
              ],
              predictive: [
                'Career challenges and delayed promotions',
                'Health issues caused by chronic stress or fatigue',
                'Tendency to overreact emotionally in personal life',
                'Inclination toward charitable or helping behavior under pressure',
                'Requires emotional regulation and clear goals to navigate well'
              ]
            },
            {
              when: ({ maha, freqMap }) => maha === 8 && freqMap[8] === 1,
              title: 'Saturn Dasha — Single 8 Present in Grid',
              behavioral: [
                'Balance begins to emerge — emotional grounding improves',
                'More disciplined and rational mindset',
                'Better control over money and delayed gratification',
                'Less impulsive behavior and fewer unpredictable shifts'
              ],
              predictive: [
                'Improved financial stability and thoughtful budgeting',
                'Greater focus on life goals and responsibility',
                'Professional advancement possible if consistent effort applied',
                'Prudent planning leads to clearer, calmer path forward'
              ]
            },
            {
              when: ({ maha, freqMap }) => maha === 8 && freqMap[8] === 2,
              title: 'Saturn Dasha — Double 8 (88) in Grid',
              behavioral: [
                'Blessings emerge after hardship — results from past efforts materialize',
                'Stable emotions, clearer purpose, and strong financial discipline',
                'Structured thinking and maturity dominate decisions'
              ],
              predictive: [
                'Career recognition and promotions likely',
                'Financial prosperity — investments and savings perform well',
                'Better health outcomes and improved family stability'
              ]
            },
            {
              when: ({ maha, freqMap }) => maha === 8 && freqMap[8] >= 3,
              title: 'Saturn Dasha — Triple 8 or More (888)',
              behavioral: [
                'High intensity — Saturn’s energy is amplified',
                'Challenges, tests, and delays become overwhelming',
                'Obstacles may feel relentless — potential financial downturns'
              ],
              predictive: [
                'Unexpected losses, job issues, or business instability',
                'Success only comes after spiritual patience and deep maturity',
                'Need for extreme discipline — emotions must be balanced'
              ]
            }
          ]
        },
        {
          number: 9,
          label: 'Dasha of Number 9 – MARS',
          color: 'text-red-500',
          scenarios: [
            {
              when: ({ maha, freqMap }) => maha === 9 && !freqMap[9],
              title: 'Mars Dasha — 9 Missing from Grid',
              behavioral: [
                'Increase in boldness and self-confidence',
                'Assertive communication and strong decision-making',
                'Willingness to take risks and face fears head-on',
                'More courageous and fearless actions in personal/professional life',
                'Higher energy and determination to pursue goals'
              ],
              predictive: [
                'Personal growth due to enhanced confidence and courage',
                'Career advancements through assertiveness and drive',
                'Effective leadership skills emerge due to proactive behavior',
                'Improved communication in negotiations or group settings',
                'Increased activity and success in sports, hobbies, and passion areas'
              ]
            },
            {
              when: ({ maha, freqMap }) => maha === 9 && freqMap[9] >= 1,
              title: 'Mars Dasha — Single or Multiple 9s Present (99/999)',
              behavioral: [
                'Rising frustration with unmet expectations or delays',
                'Tendency toward argumentative or confrontational behavior',
                'Risk of violent outbursts if self-control is lacking',
                'May become excessively driven or reactive under pressure'
              ],
              predictive: [
                'Obstacles in emotional balance and patience',
                'Difficulty maintaining harmonious relationships',
                'Possible career setbacks due to over-aggression',
                'Need for anger management and grounding practices',
                'Energy must be channeled wisely to avoid impulsive mistakes'
              ]
            }
          ]
        },
      ];
      const antarCases = [
        {
          when: ({ antar, maha }) => antar === 1 && maha === 1,
          title: 'Antardasha 1 in Mahadasha 1 — Double Sun Energy',
          color: 'text-yellow-300',
          traits: [
            'Highly assertive, goal-oriented, and ambitious',
            'Strong leadership but prone to ego clashes',
            'Confidence shines, but may dominate others unintentionally'
          ],
          advice: 'Be mindful of arrogance. Use your drive to uplift, not overpower.'
        },
        {
          when: ({ antar, maha }) => antar === 1 && maha === 7,
          title: 'Antardasha 1 in Mahadasha 7 — Vision Meets Intuition',
          color: 'text-cyan-300',
          traits: [
            'Spiritual leadership emerges',
            'Balanced blend of confidence and intuition',
            'Desire to act on inner visions or philosophical values'
          ],
          advice: 'Trust your insights, but verify with action. Lead from the soul, not ego.'
        },
        {
          when: ({ antar, maha }) => antar === 1 && maha === 8,
          title: 'Antardasha 1 in Mahadasha 8 — Controlled Confidence',
          color: 'text-purple-400',
          traits: [
            'Desire to break free from karmic delays',
            'Strong willpower to overcome emotional or career blocks',
            'Need to control anger and impatience for long-term gain'
          ],
          advice: 'Patience is your weapon. You’re breaking karmic chains — lead gently.'
        },
        {
          when: ({ antar, maha }) => antar === 1 && maha === 2,
          title: 'Antardasha 1 in Mahadasha 2 — Assertiveness vs Emotions',
          color: 'text-green-400',
          traits: [
            'Wants to act while Moon wants to feel',
            'Tension between leadership and emotional sensitivity',
            'Mood swings if validation isn’t received'
          ],
          advice: 'Balance action with empathy. Don’t confuse stillness with weakness.'
        },
        {
          when: ({ antar, maha }) => antar === 1 && maha === 9,
          title: 'Antardasha 1 in Mahadasha 9 — Firestorm of Passion',
          color: 'text-red-500',
          traits: [
            'Mars gives the fuel, Sun wants to shine — explosive mix',
            'Strong drive for personal recognition and action',
            'May take bold risks without thinking through'
          ],
          advice: 'Control impulses. Reflect before making big decisions or arguments.'
        },
        {
          when: ({ antar, maha, freqMap }) =>
            antar === 1 && freqMap[1] >= 2,
          title: 'Antardasha 1 with Multiple 1s in Grid — Overcharged Ego',
          color: 'text-yellow-400',
          traits: [
            'Very strong personality — confident and driven',
            'May intimidate others without realizing',
            'Tends to resist feedback or delegation'
          ],
          advice: 'Humble leadership is divine. Share the stage, not just the spotlight.'
        },
        {
          when: ({ antar, maha }) => antar === 1 && (antar + maha) % 2 === 0,
          title: 'Antardasha 1 (Even Sum with Maha) — Controlled Radiance',
          color: 'text-amber-400',
          traits: [
            'Even-numbered blend balances ego with structure',
            'Confidence is expressed more tactfully',
            'Results come steadily when actions are measured'
          ],
          advice: 'Don’t rush. You’re shining bright, but slow and steady wins.'
        },
        {
          when: ({ antar, maha }) => antar === 1 && (antar + maha) % 2 === 1,
          title: 'Antardasha 1 (Odd Sum with Maha) — Raw Leadership Spark',
          color: 'text-orange-300',
          traits: [
            'Odd-numbered mix makes energy fiery and fast',
            'Risk of impulsive actions or ego clashes',
            'Quick growth, but emotional friction possible'
          ],
          advice: 'Pause before reacting. Practice self-checks — not every fight is worth it.'
        },
        {
          when: ({ antar }) => antar === 1,
          title: 'Antardasha 1 — Solar Spark, Confident But Growing',
          color: 'text-yellow-400',
          traits: [
            'Natural inclination to lead, start, initiate things',
            'High independence and willpower',
            'Craving for control may emerge subtly'
          ],
          advice: 'Be a torchbearer, not a tyrant. You’re meant to lead with light.'
        },
        {
          number: 2,
          title: 'Antardasha + 1 time — Number 2',
          label: 'Lunar Light — soft, creative emotional spark',
          positives: ['Empathy', 'Sensitivity', 'Artistic expression'],
          negatives: ['Mood swings', 'Dependency on validation'],
          advice: 'Balance emotional depth with boundaries. Avoid over-giving.',
        },
        {
          number: 2,
          condition: ({ maha }) => maha === 1,
          title: 'Antardasha 2 + Mahadasha 1 (Sun-Moon)',
          label: 'Royal Mind — heart and ego at play',
          positives: ['Public influence', 'Emotional intelligence'],
          negatives: ['Ego-vulnerability', 'Over-dependence on appreciation'],
          advice: 'Let the heart guide without becoming overly reactive.',
        },
        {
          number: 2,
          condition: ({ maha }) => maha === 7,
          title: 'Antardasha 2 + Mahadasha 7 (Ketu-Moon)',
          label: 'Mystic Bond — inward love, spiritual emotion',
          positives: ['Soul connection', 'Spiritual intimacy'],
          negatives: ['Detachment anxiety', 'Dreamy dissociation'],
          advice: 'Channel emotions into meditation or healing arts.',
        },
        {
          number: 2,
          condition: ({ maha }) => maha === 6,
          title: 'Antardasha 2 + Mahadasha 6 (Venus-Moon)',
          label: 'Romantic Flow — high charisma and desire',
          positives: ['Romance', 'Creative chemistry'],
          negatives: ['Emotional indulgence', 'Drama in love'],
          advice: 'Create, don’t chase. Balance self-love and expression.',
        },
        {
          number: 2,
          condition: ({ maha, antar }) => (antar + maha) % 2 === 0,
          title: 'Antardasha 2 — Even Sum with Mahadasha',
          label: 'Harmonious Vibe — smooth energy',
          positives: ['Peaceful interactions', 'Inner balance'],
          negatives: ['Over-idealism', 'Low assertiveness'],
          advice: 'Use this time to nurture inner peace and avoid escapism.',
        },
        {
          number: 2,
          condition: ({ maha, antar }) => (antar + maha) % 2 !== 0,
          title: 'Antardasha 2 — Odd Sum with Mahadasha',
          label: 'Emotional Waves — contrast and change',
          positives: ['Emotional learning', 'Adaptability'],
          negatives: ['Reactive behavior', 'Inconsistency'],
          advice: 'Ride the waves. Respond, don’t react.',
        },
        {
          number: 3,
          label: 'Antardasha of Number 3 — JUPITER',
          color: 'text-blue-400',
          scenarios: [
            {
              when: ({ antar, freqMap }) => antar === 3 && !freqMap[3],
              title: 'Antardasha of 3 — Jupiter Absent in Grid',
              traits: [
                'Inward spiritual exploration without external guidance',
                'Feels the urge to teach or preach without mastery',
                'May struggle with focus or clear philosophical direction'
              ],
              advice: 'Read, meditate, and allow wisdom to mature before sharing. Seek mentors to avoid confusion.'
            },
            {
              when: ({ antar, freqMap }) => antar === 3 && freqMap[3] === 1,
              title: 'Antardasha of 3 — Single Jupiter Present',
              traits: [
                'Balanced communication and curiosity in learning',
                'Feels drawn toward reading, teaching, and self-growth',
                'Able to blend knowledge with humility'
              ],
              advice: 'Pursue lifelong learning. This is a great time to teach, write, or share your thoughts with others.'
            },
            {
              when: ({ antar, freqMap }) => antar === 3 && freqMap[3] === 2,
              title: 'Antardasha of 3 — Double 3 (33) in Grid',
              traits: [
                'Wisdom turns public — may take on spiritual leadership roles',
                'Possibility of overconfidence in own beliefs',
                'Can experience inner conflict between humility and spiritual ego'
              ],
              advice: 'Stay grounded. Let actions speak louder than teachings. Serve without seeking recognition.'
            },
            {
              when: ({ antar, freqMap }) => antar === 3 && freqMap[3] >= 3,
              title: 'Antardasha of 3 — Triple Jupiter (333) or More in Grid',
              traits: [
                'Highly charismatic and persuasive communicator',
                'Spiritual showmanship may develop',
                'May struggle with detachment from public image or validation'
              ],
              advice: 'Teach with sincerity. Detach from applause. Focus on substance, not spectacle.'
            }
          ]
        },
        {
          number: 4,
          label: 'Antardasha of Number 4 — RAHU',
          color: 'text-red-400',
          scenarios: [
            {
              when: ({ antar, freqMap }) => antar === 4 && !freqMap[4],
              title: 'Antardasha of 4 — Rahu Absent in Grid',
              traits: [
                'Tendency to live in illusions — disconnect from reality',
                'Frequent overthinking and indecisiveness',
                'Difficulty following structure or logical plans'
              ],
              advice: 'Avoid unrealistic expectations. Build clear routines. Use grounding techniques like journaling or planning.'
            },
            {
              when: ({ antar, freqMap }) => antar === 4 && freqMap[4] === 1,
              title: 'Antardasha of 4 — Single Rahu Present',
              traits: [
                'Strong creative potential with unconventional ideas',
                'Feeling torn between logic and fantasy',
                'Can create impactful change if disciplined'
              ],
              advice: 'Turn your creative ideas into structured actions. Avoid manipulation or shortcuts.'
            },
            {
              when: ({ antar, freqMap }) => antar === 4 && freqMap[4] === 2,
              title: 'Antardasha of 4 — Double 4 (44) in Grid',
              traits: [
                'Stronger grip over finances and logic',
                'Can handle complex systems and build foundations',
                'Still vulnerable to emotional confusion'
              ],
              advice: 'Stay emotionally aware while planning. Use structure to overcome mental chaos.'
            },
            {
              when: ({ antar, freqMap }) => antar === 4 && freqMap[4] === 3,
              title: 'Antardasha of 4 — Triple Rahu (444) in Grid',
              traits: [
                'Intense mental energy and analytical ability',
                'Can become overly rigid or stubborn in beliefs',
                'Prone to burnout due to perfectionism or overwork'
              ],
              advice: 'Allow space for flexibility. Logic without emotional intelligence can create imbalance.'
            },
            {
              when: ({ antar, freqMap }) => antar === 4 && freqMap[4] >= 4,
              title: 'Antardasha of 4 — 4444 or More in Grid',
              traits: [
                'Master of structure, logic, and execution',
                'High potential for financial and career breakthroughs',
                'Risk of becoming emotionally cold or overly serious'
              ],
              advice: 'Celebrate progress and share your knowledge. Don’t isolate yourself emotionally.'
            }
          ]
        },
        {
          number: 5,
          label: 'Antardasha of Number 5 — MERCURY',
          color: 'text-orange-400',
          scenarios: [
            {
              when: ({ antar, freqMap }) => antar === 5 && !freqMap[5],
              title: 'Antardasha of 5 — Mercury Absent in Grid',
              traits: [
                'Sudden rise in logical thinking and curiosity',
                'Increased clarity in communication and mental tasks',
                'Feels mentally alert but lacks emotional warmth'
              ],
              advice: 'Use this mental clarity to solve complex tasks. Avoid being emotionally cold or overly calculative.'
            },
            {
              when: ({ antar, freqMap }) => antar === 5 && freqMap[5] === 1,
              title: 'Antardasha of 5 — Single Mercury Present',
              traits: [
                'Balanced communication and decision-making',
                'Improved financial planning and business instincts',
                'Focus shifts to short-term goals and travel opportunities'
              ],
              advice: 'Make use of your momentum. Stay consistent with ideas and financial planning.'
            },
            {
              when: ({ antar, freqMap }) => antar === 5 && freqMap[5] === 2,
              title: 'Antardasha of 5 — Double 5 (55) in Grid',
              traits: [
                'Strong persuasive power in speech and writing',
                'Risk of over-analysis and restlessness',
                'Excellent for digital success or marketing-based work'
              ],
              advice: 'Take mental breaks. Don’t let mental speed lead to anxiety or impatience.'
            },
            {
              when: ({ antar, freqMap }) => antar === 5 && freqMap[5] === 3,
              title: 'Antardasha of 5 — Triple Mercury (555)',
              traits: [
                'High charisma and verbal magnetism — people listen to you',
                'Excellent for networking, influencing, and negotiation',
                'Mental fatigue possible if balance is not maintained'
              ],
              advice: 'Use this time for outreach and media. Stay grounded in truth and avoid burnout.'
            },
            {
              when: ({ antar, freqMap }) => antar === 5 && freqMap[5] >= 4,
              title: 'Antardasha of 5 — 5555 or More in Grid',
              traits: [
                'Overload of ideas — constantly thinking and planning',
                'Extreme multitasking can drain energy fast',
                'Superb with communication but may struggle emotionally'
              ],
              advice: 'Filter your priorities. Less is more. Practice silence or mindfulness to balance your energy.'
            }
          ]
        },
        {
          number: 6,
          label: 'Antardasha of Number 6 — VENUS',
          color: 'text-pink-400',
          scenarios: [
            {
              when: ({ antar, freqMap }) => antar === 6 && !freqMap[6],
              title: 'Antardasha of 6 — Venus Absent in Grid',
              traits: [
                'Strong emotional cravings for love, attention, and validation',
                'Unfulfilled desires in relationships may cause emotional instability',
                'Attraction toward material comfort, beauty, and luxury becomes prominent'
              ],
              advice: 'Avoid attaching your worth to external beauty or approval. Focus on nurturing yourself through self-love and grounded relationships.'
            },
            {
              when: ({ antar, freqMap }) => antar === 6 && freqMap[6] === 1,
              title: 'Antardasha of 6 — Single Venus Present',
              traits: [
                'Balanced emotional and romantic expression',
                'Increased interest in personal appearance and self-care',
                'Opportunities in romance and harmony in relationships'
              ],
              advice: 'This is a great time to heal or grow existing relationships. Upgrade your self-image and aesthetic expression mindfully.'
            },
            {
              when: ({ antar, freqMap }) => antar === 6 && freqMap[6] === 2,
              title: 'Antardasha of 6 — Double 6 (66) in Grid',
              traits: [
                'Emotional intensity in love life — highly romantic and expressive',
                'Increased attachment to beauty, luxury, and social media appearance',
                'May become more sensitive to rejection or disapproval'
              ],
              advice: 'Be mindful of emotional over-dependence. Keep your standards but don’t lose your peace trying to meet them.'
            },
            {
              when: ({ antar, freqMap }) => antar === 6 && freqMap[6] === 3,
              title: 'Antardasha of 6 — Triple 6 (666) in Grid',
              traits: [
                'Over-expressiveness in love — emotionally dramatic tendencies',
                'Strong aesthetic and creative magnetism — you attract attention easily',
                'Romantic mood swings and intense desire for emotional validation'
              ],
              advice: 'Channel excess Venus energy into creative outlets like music, design, or love poetry. Watch for over-romanticizing situations.'
            },
            {
              when: ({ antar, freqMap }) => antar === 6 && freqMap[6] >= 4,
              title: 'Antardasha of 6 — 6666 or More in Grid',
              traits: [
                'Very high Venusian influence — charm, attraction, and creativity overflow',
                'Risk of overindulgence in luxury, beauty, or emotionally charged relationships',
                'Potential to experience both fame and emotional turmoil simultaneously'
              ],
              advice: 'Ground yourself with discipline and simplicity. Your charm is a gift, but don’t let it cloud your emotional wisdom.'
            }
          ]
        },
        {
          number: 7,
          label: 'Antardasha of Number 7 — KETU',
          color: 'text-cyan-300',
          scenarios: [
            {
              when: ({ antar, freqMap }) => antar === 7 && !freqMap[7],
              title: 'Antardasha of 7 — Ketu Absent from Grid',
              traits: [
                'Restlessness and spiritual confusion arise due to lack of grounding',
                'Detached mindset — difficulty forming emotional bonds',
                'Feels like wandering without purpose, mentally or physically'
              ],
              advice: 'Engage in spiritual practices like meditation or grounding rituals. Avoid impulsive decisions or escapism.'
            },
            {
              when: ({ antar, freqMap }) => antar === 7 && freqMap[7] === 1,
              title: 'Antardasha of 7 — Single 7 in Grid',
              traits: [
                'Increased self-reflection and interest in occult or spiritual learning',
                'Mild detachment from emotions and relationships',
                'Attraction to mysticism, astrology, or hidden knowledge'
              ],
              advice: 'Explore your spiritual curiosity, but stay grounded in the present. Journaling and solitude will be healing.'
            },
            {
              when: ({ antar, freqMap }) => antar === 7 && freqMap[7] === 2,
              title: 'Antardasha of 7 — Double 7 (77) in Grid',
              traits: [
                'Emotional distance increases — difficult to express inner feelings',
                'Deep karmic patterns surface, especially from past relationships',
                'Vivid dreams or intuitive flashes become frequent'
              ],
              advice: 'Pay attention to intuition but verify facts. Build emotional resilience through quiet reflection and guided mentorship.'
            },
            {
              when: ({ antar, freqMap }) => antar === 7 && freqMap[7] === 3,
              title: 'Antardasha of 7 — Triple 7 (777) in Grid',
              traits: [
                'Highly sensitive to unseen energies and karmic shifts',
                'Isolation tendencies grow — might feel disconnected from the world',
                'Unpredictable behavior or sudden shifts in beliefs or routines'
              ],
              advice: 'Channel energy into healing, not detachment. Balance solitude with conscious connection to trusted people.'
            },
            {
              when: ({ antar, freqMap }) => antar === 7 && freqMap[7] >= 4,
              title: 'Antardasha of 7 — 7777 or More in Grid',
              traits: [
                'Extreme karmic activation — past life themes or unresolved traumas emerge',
                'May feel called to a spiritual mission or higher soul path',
                'Highly evolved inner vision but complete disinterest in material life'
              ],
              advice: 'Stay present. This is a spiritually transformative time — use it for evolution, but avoid neglecting your responsibilities.'
            }
          ]
        },
        {
          number: 8,
          label: 'Antardasha of Number 8 — SATURN',
          color: 'text-purple-400',
          scenarios: [
            {
              when: ({ antar, freqMap }) => antar === 8 && !freqMap[8],
              title: 'Antardasha of 8 — Saturn Missing from Grid',
              traits: [
                'Feels stuck, delayed, or burdened with responsibilities',
                'Difficulty organizing thoughts and setting long-term goals',
                'Frustration due to lack of results despite efforts'
              ],
              advice: 'Accept that this is a karmic phase of slow progress. Stay disciplined, avoid shortcuts, and trust divine timing.'
            },
            {
              when: ({ antar, freqMap }) => antar === 8 && freqMap[8] === 1,
              title: 'Antardasha of 8 — Single 8 in Grid',
              traits: [
                'Slow but steady movement in career and decisions',
                'Improved focus on responsibility and commitments',
                'Strong need to feel in control of financial and personal matters'
              ],
              advice: 'Continue working patiently — success comes gradually. Maintain health routines and emotional boundaries.'
            },
            {
              when: ({ antar, freqMap }) => antar === 8 && freqMap[8] === 2,
              title: 'Antardasha of 8 — Double 8 (88) in Grid',
              traits: [
                'Greater emotional control and grounded mindset',
                'Financial wisdom sharpens — practical choices dominate',
                'Capable of handling tough situations calmly'
              ],
              advice: 'You’re entering a stabilizing phase — make long-term decisions and manage your resources wisely.'
            },
            {
              when: ({ antar, freqMap }) => antar === 8 && freqMap[8] === 3,
              title: 'Antardasha of 8 — Triple 8 (888) in Grid',
              traits: [
                'Intense karmic workload — may feel emotionally or physically heavy',
                'Possibility of spiritual breakthroughs through hardship',
                'Feels tested constantly, especially in career and relationships'
              ],
              advice: 'Be disciplined. Avoid self-pity and rise above challenges with grace. Saturn’s rewards follow perseverance.'
            },
            {
              when: ({ antar, freqMap }) => antar === 8 && freqMap[8] >= 4,
              title: 'Antardasha of 8 — 8888 or More in Grid',
              traits: [
                'Great control over money and responsibility',
                'May be seen as a natural authority or karmic leader',
                'Struggles become opportunities — can guide others from wisdom'
              ],
              advice: 'Be a mentor. Use your discipline to help others and build solid foundations. Saturn favors service and order.'
            }
          ]
        },
        {
          number: 9,
          label: 'Antardasha of Number 9 — MARS',
          color: 'text-red-500',
          scenarios: [
            {
              when: ({ antar, freqMap }) => antar === 9 && !freqMap[9],
              title: 'Antardasha of 9 — Mars Missing from Grid',
              traits: [
                'Sudden surge in motivation, courage, and desire for action',
                'May feel impulsive or hyperactive without direction',
                'Improved energy and assertiveness, but short-lived focus'
              ],
              advice: 'Use this time to initiate important goals, but stay grounded. Avoid aggression and unplanned actions.'
            },
            {
              when: ({ antar, freqMap }) => antar === 9 && freqMap[9] === 1,
              title: 'Antardasha of 9 — Single 9 in Grid',
              traits: [
                'Boldness with a balance of awareness',
                'You start pursuing passions with greater confidence',
                'Strong leadership energy begins to awaken'
              ],
              advice: 'Follow your instincts, but don’t dominate. Channel your fire into focused work and positive action.'
            },
            {
              when: ({ antar, freqMap }) => antar === 9 && freqMap[9] === 2,
              title: 'Antardasha of 9 — Double 9 (99) in Grid',
              traits: [
                'High energy and aggressive determination',
                'Likely to succeed in sports, competitions, or debates',
                'May become reactive, easily triggered by opposition'
              ],
              advice: 'Master your reactions. Learn to pause before you act or speak. Meditate or exercise to balance fire.'
            },
            {
              when: ({ antar, freqMap }) => antar === 9 && freqMap[9] === 3,
              title: 'Antardasha of 9 — Triple 9 (999) in Grid',
              traits: [
                'Explosive energy, passion, and willpower — may face internal chaos',
                'Strong karmic forces push for closure, transformation, or action',
                'Can become extremely dominant or emotionally unstable'
              ],
              advice: 'This is a time for endings and breakthroughs. Don’t resist the change. Stay humble and take bold steps.'
            },
            {
              when: ({ antar, freqMap }) => antar === 9 && freqMap[9] >= 4,
              title: 'Antardasha of 9 — 9999 or More in Grid',
              traits: [
                'Warrior energy at maximum — powerful yet dangerous if ungrounded',
                'Capable of great change, leadership, or destruction depending on emotional state',
                'Unshakable force — leads others by example or conflict'
              ],
              advice: 'Act like a spiritual warrior — with discipline, service, and control. This is your time to conquer your higher self.'
            }
          ]
        }
      ];

export default function PredictionPage() {
  const searchParams = useSearchParams();
  const [grid, setGrid] = useState(Array(3).fill(null).map(() => Array(3).fill(null).map(() => [])));
  const [predictionBlocks, setPredictionBlocks] = useState([]);
  const [dashaInsightsBlocks, setDashaInsightsBlocks] = useState([]);
  const [numberFrequency, setNumberFrequency] = useState({});

  const name = searchParams.get('name') || '';
  const dob = searchParams.get('dob') || '';
  const basicNumber = Number(searchParams.get('basicNumber')) || 0;
  const destinyNumber = Number(searchParams.get('destinyNumber')) || 0;
  const maha = Number(searchParams.get('maha')) || 0;
  const antar = Number(searchParams.get('antar')) || 0;
  const mahaStart = searchParams.get('mahaStart') || '';
  const mahaEnd = searchParams.get('mahaEnd') || '';
  const antarStart = searchParams.get('antarStart') || '';
  const antarEnd = searchParams.get('antarEnd') || '';
  const chartNumbers = searchParams.getAll('gridNumbers').map(Number);

  useEffect(() => {
    const freqMap = {};
    chartNumbers.forEach(num => {
      freqMap[num] = (freqMap[num] || 0) + 1;
    });

    if (!chartNumbers.includes(maha)) {
      freqMap[maha] = (freqMap[maha] || 0) + 1;
    }
    if (!chartNumbers.includes(antar)) {
      freqMap[antar] = (freqMap[antar] || 0) + 1;
    }

    setNumberFrequency(freqMap);

    const tempGrid = Array(3).fill(null).map(() => Array(3).fill(null).map(() => []));
    Object.entries(freqMap).forEach(([numStr, count]) => {
      const num = parseInt(numStr);
      const [r, c] = numberPositionMap[num] || [];
      if (r === undefined) return;

      for (let i = 0; i < count; i++) {
        let highlight = '';
        if (num === maha && antar === maha) {
          if (i === count - 2) highlight = 'maha';
          else if (i === count - 1) highlight = 'antar';
        } else {
          if (num === maha && i === count - 1) highlight = 'maha';
          if (num === antar && i === count - 1) highlight = 'antar';
        }
        tempGrid[r][c].push({ value: num, highlight });
      }
    });

    setGrid(tempGrid);
  }, [chartNumbers.join(','), maha, antar]);

  useEffect(() => {
    const blocks = [];
  
    // 1. Standard prediction blocks based on number frequencies
    Object.entries(numberFrequency).forEach(([numStr, count]) => {
      const number = Number(numStr);
      const isBasic = number === basicNumber;
      const isDestiny = number === destinyNumber;
      const isMaha = number === maha;
      const isAntar = number === antar;
  
      let trueCount = count;
      const inGrid = chartNumbers.includes(number);
  
      // Avoid double-counting if already present
      if (inGrid && isBasic) trueCount -= 1;
      if (inGrid && isDestiny && trueCount > 0) trueCount -= 1;
      if (inGrid && isMaha && trueCount > 0) trueCount -= 1;
      if (inGrid && isAntar && trueCount > 0) trueCount -= 1;
  
      const categoryTags = [];
      if (isBasic) categoryTags.push('Basic');
      if (isDestiny) categoryTags.push('Destiny');
      if (isMaha) categoryTags.push('Mahadasha');
      if (isAntar) categoryTags.push('Antardasha');
  
      const labelTag = categoryTags.join(', ');
      const color =
        number === 1 ? 'text-yellow-400' :
        number === 2 ? 'text-green-400' :
        number === 3 ? 'text-blue-400' :
        number === 4 ? 'text-red-400' :
        number === 5 ? 'text-orange-400' :
        number === 6 ? 'text-pink-400' :
        number === 7 ? 'text-cyan-300' :
        number === 8 ? 'text-purple-400' :
        'text-gray-400';
  
      const libraryBlock = predictionLibrary[number]?.[trueCount];
      if (!libraryBlock) return;
  
      blocks.push({
        label: `${labelTag ? labelTag + ' + ' : ''}${trueCount} time${trueCount > 1 ? 's' : ''} — Number ${number}`,
        color,
        content: `
  ${libraryBlock.label}
  
  Positives: ${libraryBlock.positives.join(', ')}
  
  Negatives: ${libraryBlock.negatives.join(', ')}
  
  Advice: ${libraryBlock.advice}
        `.trim()
      });
    });
  
    // 2. Combination Insight Predictions (like 3+1 without 9 etc.)
    combinationInsights.forEach((combo) => {
      if (combo.condition(numberFrequency)) {
        const color = combo.color || 'text-yellow-300';
        blocks.push({
          label: combo.label,
          color,
          content: `
  ${combo.title || ''}
  
  Behavioural Traits:\n${(combo.behavioral || combo.data?.behavioral || []).join('\n')}
  
  Professional Strengths:\n${(combo.professional || combo.data?.professional || []).join('\n')}
  
  Negatives:\n${(combo.negatives || combo.data?.negatives || []).join('\n')}
  
  Notes:\n${(combo.notes || combo.data?.notes || []).join('\n')}
          `.trim()
        });
      }
    });
  
    setPredictionBlocks(blocks);
  }, [numberFrequency]);
  useEffect(() => {
    const dashaMatches = [];
  
    dashaCases.forEach((caseObj) => {
      if (caseObj.when && typeof caseObj.when === 'function') {
        const result = caseObj.when({ maha, freqMap: numberFrequency, destinyNumber });
        if (result) {
          dashaMatches.push({
            title: caseObj.title,
            color: caseObj.color || 'text-yellow-300',
            traits: caseObj.traits || caseObj.behavioral || [],
            advice: caseObj.advice || '',
            predictive: caseObj.predictive || [],
          });
        }
      } else if (caseObj.number === maha && caseObj.scenarios) {
        caseObj.scenarios.forEach((sc) => {
          if (sc.when({ maha, freqMap: numberFrequency })) {
            dashaMatches.push({
              title: sc.title,
              color: caseObj.color,
              traits: sc.traits || sc.behavioral || [],
              predictive: sc.predictive || [],
              advice: sc.advice || '',
            });
          }
        });
      }
    });
  
    setDashaInsightsBlocks(dashaMatches);
  }, [maha, numberFrequency]);

  useEffect(() => {
    const antarMatches = [];
  
    antarCases.forEach((caseObj) => {
      if (caseObj.when && typeof caseObj.when === 'function') {
        const result = caseObj.when({ antar, maha, freqMap: numberFrequency });
        if (result) {
          antarMatches.push({
            title: caseObj.title,
            color: caseObj.color || 'text-green-300',
            traits: caseObj.traits || [],
            advice: caseObj.advice || '',
            predictive: caseObj.predictive || [],
          });
        }
      } else if (caseObj.number === antar && caseObj.scenarios) {
        caseObj.scenarios.forEach((scenario) => {
          if (scenario.when({ antar, freqMap: numberFrequency })) {
            antarMatches.push({
              title: scenario.title,
              color: caseObj.color,
              traits: scenario.traits || [],
              advice: scenario.advice || '',
              predictive: scenario.predictive || [],
            });
          }
        });
      }
    });
  
    setDashaInsightsBlocks((prev) => [...prev, ...antarMatches]);
  }, [antar, maha, numberFrequency]);
  
  

  return (
    <div className="h-screen w-screen overflow-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400 drop-shadow">🌌 Your Numerology Prediction</h1>
  
      <div className="w-full max-w-2xl bg-[#0f172a] p-6 rounded-xl border border-purple-600 shadow-lg mb-6 text-base md:text-lg">
        <div className="grid grid-cols-2 gap-3">
          <p><b>👤 Name:</b> {name}</p>
          <p><b>📅 Date of Birth:</b> {dob}</p>
          <p><b>🔢 Basic Number:</b> {basicNumber}</p>
          <p><b>🎯 Destiny Number:</b> {destinyNumber}</p>
        </div>
      </div>
  
      <div className="grid grid-cols-3 gap-3 border-4 border-yellow-500 p-4 rounded-xl bg-[#111827] shadow-lg mb-4">
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className="min-w-[6rem] min-h-[6rem] border-2 border-gray-700 bg-black rounded-md flex justify-center items-center">
              <div className="flex flex-wrap justify-center items-center gap-1 max-w-full">
                {cell.map((item, i) => (
                  <span
                    key={i}
                    className={`rounded-md text-sm md:text-base px-2 py-[0.15rem] leading-tight
                      ${item.highlight === 'maha' ? 'bg-yellow-400 text-black' : ''}
                      ${item.highlight === 'antar' ? 'bg-green-400 text-black' : ''}
                      ${!item.highlight ? 'bg-purple-600 text-white' : ''}`}
                  >
                    {item.value}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
  
      <div className="flex flex-col gap-2 items-start w-full max-w-2xl px-2 mb-10">
        {(mahaStart && mahaEnd) && (
          <div className="bg-yellow-900/10 text-yellow-300 border-l-4 border-yellow-500 px-4 py-2 rounded text-sm md:text-base">
            <b>Mahadasha ({maha}):</b> {mahaStart} to {mahaEnd} ({getDuration(mahaStart, mahaEnd)})
          </div>
        )}
        {(antarStart && antarEnd) && (
          <div className="bg-green-900/10 text-green-300 border-l-4 border-green-500 px-4 py-2 rounded text-sm md:text-base">
            <b>Antardasha ({antar}):</b> {antarStart} to {antarEnd} ({getDuration(antarStart, antarEnd)})
          </div>
        )}
      </div>
  
      {/* ✅ MAHADASHA PREDICTIONS */}
      {dashaInsightsBlocks.length > 0 && (
        <div className="w-full max-w-5xl space-y-6 px-4 mb-10">
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">☀️ Dasha Insights </h2>
          {dashaInsightsBlocks
            .filter((block) => block.color !== 'text-green-300') // all non-Antar blocks
            .map((block, i) => (
              <div
                key={i}
                className={`border-l-8 rounded-xl shadow-lg p-6 bg-gray-900 ${block.color} border-purple-500`}
              >
                <h3 className="text-lg font-bold mb-2">{block.title}</h3>
  
                {block.traits?.length > 0 && (
                  <div className="mb-2">
                    <b>Traits / Behavioral Insights:</b>
                    <ul className="list-disc pl-5 mt-1">
                      {block.traits.map((t, j) => <li key={j}>{t}</li>)}
                    </ul>
                  </div>
                )}
  
                {block.predictive?.length > 0 && (
                  <div className="mb-2">
                    <b>Predictive Insights:</b>
                    <ul className="list-disc pl-5 mt-1">
                      {block.predictive.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                )}
  
                {block.advice && (
                  <div className="mt-2">
                    <b>Advice:</b> <span className="italic">{block.advice}</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
  
      {/* ✅ ANTARDASHA PREDICTIONS */}
      {dashaInsightsBlocks.filter((block) => block.color === 'text-green-300').length > 0 && (
        <div className="w-full max-w-5xl space-y-6 px-4 mb-10">
          <h2 className="text-2xl font-bold text-green-300 mb-2">🌙 Antardasha Insights</h2>
          {dashaInsightsBlocks
            .filter((block) => block.color === 'text-green-300')
            .map((block, i) => (
              <div
                key={i}
                className={`border-l-8 rounded-xl shadow-lg p-6 bg-gray-900 ${block.color} border-green-500`}
              >
                <h3 className="text-lg font-bold mb-2">{block.title}</h3>
  
                {block.traits?.length > 0 && (
                  <div className="mb-2">
                    <b>Traits / Behavioral Insights:</b>
                    <ul className="list-disc pl-5 mt-1">
                      {block.traits.map((t, j) => <li key={j}>{t}</li>)}
                    </ul>
                  </div>
                )}
  
                {block.predictive?.length > 0 && (
                  <div className="mb-2">
                    <b>Predictive Insights:</b>
                    <ul className="list-disc pl-5 mt-1">
                      {block.predictive.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                )}
  
                {block.advice && (
                  <div className="mt-2">
                    <b>Advice:</b> <span className="italic">{block.advice}</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
  
      {/* ✅ STANDARD PREDICTION BLOCKS */}
      {predictionBlocks.length > 0 && (
        <div className="w-full max-w-5xl space-y-6 px-4">
          {predictionBlocks.map((block, i) => (
            <div
              key={i}
              className={`border-l-8 rounded-xl shadow-lg p-6 bg-gray-900 ${block.color} border-purple-500`}
            >
              <h3 className="text-lg font-bold mb-2">{block.label}</h3>
              <pre className="text-white text-sm md:text-base whitespace-pre-wrap">{block.content}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}  

