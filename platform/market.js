(function(root){
'use strict';
// Published report archive only; imported 2026-09-06. No inbox, accounts or private voyage data.
const reports=[
  {
    "id": "dry-bulk-2026-07-09",
    "title": "Dry Bulk Market Update",
    "publishedDate": "2026-07-09",
    "summary": "Steady overall, Atlantic-led: US Gulf strongest on owner-driven Supra/Ultra, Med/Black Sea and the Russian grain season firming, while FEAST and South Africa soften on rising prompt tonnage.",
    "overview": {
      "paragraphs": [
        "The geared dry bulk market remains steady, though regional performance continues to diverge. Overall sentiment: steady, Atlantic-led.",
        "The Atlantic Basin stays the primary source of strength. The US Gulf remains the strongest geared market globally, with Supramax and Ultramax firmly owner-driven; West Africa is firm with early signs of a correction; ECSA is split, its Handies softening while the larger sizes hold on tight Atlantic supply.",
        "Europe continues to improve: the Mediterranean and Black Sea firm on grain and clinker, the Continent and Baltic hold broadly stable, and the Russian grain season is now gaining momentum, keeping Black Sea owners selective and freight firm.",
        "The Pacific is gradually softening under rising vessel availability. FEAST has eased on a growing prompt tonnage list, Southeast Asia stays mixed, the Arabian Gulf and West Coast India remain constrained by Strait of Hormuz security concerns and the monsoon, and South Africa has come off after several strong weeks.",
        "Market bias for the week ahead: moderately positive, led by tight Atlantic supply for the larger sizes, with growing prompt tonnage in FEAST and South Africa and lingering Hormuz uncertainty as the main counterweights."
      ]
    },
    "basins": [
      {
        "name": "ATLANTIC BASIN",
        "intro": "The Atlantic continues to outperform every other region. Tight vessel supply — rather than excess cargo demand — keeps most load areas owner-favoured, while the Mediterranean and Black Sea join the recovery on grain and clinker.",
        "regions": [
          {
            "name": "US Gulf",
            "tone": "Strongest geared market",
            "bullets": [
              "Handy rates broadly flat as vessel supply rises.",
              "Supramax and Ultramax markets remain firmly owner-driven.",
              "Strong petcoke, grain and India-bound demand supports premium freight.",
              "A favourable cargo-to-vessel balance underpins the larger sizes."
            ],
            "forecast": "Supramax and Ultramax should stay owner-favoured, while Handies track incoming vessel supply.",
            "cargoes": [
              "Grains",
              "Petcoke",
              "Coal",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "ECSA",
            "tone": "Split market",
            "bullets": [
              "Handies softening as cargo demand slows and charterers gain leverage.",
              "Supramax and Ultramax resilient on relatively tight Atlantic supply.",
              "Freight levels on the larger sizes remain well supported."
            ],
            "forecast": "The larger sizes should stay supported while Handies remain under pressure.",
            "cargoes": [
              "Corn",
              "Soybeans",
              "Soybean meal",
              "Sugar",
              "Fertilizers"
            ]
          },
          {
            "name": "West Africa",
            "tone": "Firm, correction emerging",
            "bullets": [
              "Remains firm on steady demand.",
              "Additional vessels entering the region are the first sign of a correction."
            ],
            "forecast": "Firm near-term, with a mild correction likely as tonnage builds.",
            "cargoes": [
              "Bauxite",
              "Manganese",
              "Clinker",
              "Cement",
              "Fertilizers"
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "tone": "Improving",
            "bullets": [
              "Grain exports supporting Handy rates.",
              "Supramax and Ultramax strong on tight vessel supply and continued clinker demand."
            ],
            "forecast": "Continued improvement, led by grain and clinker.",
            "cargoes": [
              "Wheat",
              "Corn",
              "Barley",
              "Clinker",
              "Cement",
              "Fertilizers"
            ]
          },
          {
            "name": "Russia / Black Sea",
            "tone": "Firm, owners selective",
            "bullets": [
              "Russian grain season now gaining momentum.",
              "Export volumes have risen materially, particularly for Supramax cargoes.",
              "Owners remain highly selective and hold firm freight levels."
            ],
            "forecast": "Firm as the grain season builds and volumes grow.",
            "cargoes": [
              "Wheat",
              "Barley",
              "Coal",
              "Fertilizers"
            ]
          },
          {
            "name": "Continent / Baltic",
            "tone": "Stable",
            "bullets": [
              "Overall stable.",
              "Handy sentiment softened slightly on limited liquidity.",
              "Larger sizes remain well supported despite modest cargo volumes."
            ],
            "forecast": "Stable, with the larger sizes better supported than Handies.",
            "cargoes": [
              "Scrap",
              "Grains",
              "Fertilizers",
              "Forest products",
              "Steel products"
            ]
          }
        ]
      },
      {
        "name": "PACIFIC BASIN",
        "intro": "The Pacific is gradually softening as prompt tonnage builds. The Indian Ocean stays constrained by geopolitics and the monsoon, and South Africa is easing after a strong run.",
        "regions": [
          {
            "name": "FEAST",
            "tone": "Softening",
            "bullets": [
              "NoPac and backhaul demand remains healthy.",
              "A growing prompt tonnage list is pressuring rates and limiting owners' bargaining power."
            ],
            "forecast": "Likely to stay under moderate pressure as tonnage continues to build.",
            "cargoes": [
              "Grains",
              "Coal",
              "Steel products",
              "Fertilizers"
            ]
          },
          {
            "name": "Southeast Asia",
            "tone": "Mixed",
            "bullets": [
              "Indonesia–China activity still subdued.",
              "Stronger backhaul demand from North Vietnam and South China provides support.",
              "Australian cargoes have slowed as Panamax competition increased."
            ],
            "forecast": "Mixed, with backhaul demand cushioning the softer legs.",
            "cargoes": [
              "Indonesian coal",
              "Nickel ore",
              "Bauxite",
              "Clinker",
              "Fertilizers"
            ]
          },
          {
            "name": "AG / WCI",
            "tone": "Constrained, unchanged",
            "bullets": [
              "Broadly unchanged on limited cargo volumes.",
              "Strait of Hormuz security concerns, elevated war-risk premiums, congestion east of the Strait and the monsoon all restrict activity.",
              "Oman gypsum and limestone exports provide a stable cargo base."
            ],
            "forecast": "Subdued while geopolitical and seasonal headwinds persist.",
            "cargoes": [
              "Clinker",
              "Cement",
              "Salt",
              "Gypsum",
              "Limestone",
              "Fertilizers"
            ]
          },
          {
            "name": "South Africa",
            "tone": "Easing",
            "bullets": [
              "Eased after several strong weeks.",
              "Coal cargoes to Pakistan remain the main source of demand.",
              "Iron ore and manganese exports quieter; end-of-month vessel availability rising."
            ],
            "forecast": "Softer near-term as vessel availability increases.",
            "cargoes": [
              "Coal",
              "Manganese ore",
              "Iron ore",
              "Chrome ore"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-07-02",
    "title": "Dry Bulk Market Update",
    "publishedDate": "2026-07-02",
    "summary": "Steady overall; Atlantic-led with ECSA, USG Supras/Ultras and WAFR strongest; Black Sea recovering on Russian grain season.",
    "overview": {
      "paragraphs": [
        "The geared bulk market remains broadly resilient despite mixed regional dynamics. Overall sentiment: steady.",
        "ECSA remains one of the strongest regions on low vessel supply and positive paper sentiment; the US Gulf is split — Handies under pressure while Supras/Ultras keep strengthening. Mediterranean and Black Sea markets are finally showing signs of recovery on grain and clinker demand, with the Russian grain season providing fresh upward momentum to Black Sea freight levels.",
        "In the Pacific, FEAST stays active with stable rates and improving period sentiment, while Southeast Asia has softened on prompt vessel availability and limited fresh cargoes. AG/WCI remains constrained by Strait of Hormuz restrictions.",
        "Strongest regions: ECSA, US Gulf Supra/Ultra, West Africa, Med/Black Sea Supra/Ultra. Stable: FEAST, South Africa, WCCA/WCSA, Continent/Baltic. Under pressure: Southeast Asia, US Gulf Handy.",
        "Market bias for the coming weeks: moderately positive, led by Atlantic Basin strength and tightening vessel supply across several key loading regions."
      ]
    },
    "basins": [
      {
        "name": "ATLANTIC BASIN",
        "intro": "The Atlantic continues to lead: limited vessel supply across the basin — rather than excess cargo demand — is the key driver, keeping most load areas owner-favoured while the Mediterranean and Black Sea finally join the recovery.",
        "regions": [
          {
            "name": "East Coast South America",
            "tone": "Strongest region",
            "paragraphs": [
              "Handy: firm, with cargo supply and vessel availability largely balanced; large Handies command premiums on strong Supramax support.",
              "Supramax/Ultramax: a very active start to the week with fixtures across virtually all routes. Atlantic destinations outperform Far East; the key driver is limited vessel supply across the Atlantic Basin rather than excess cargo demand."
            ],
            "forecast": "Positive; supported by low vessel supply and paper sentiment.",
            "cargoes": [
              "Corn",
              "Soybeans",
              "Soybean meal",
              "Sugar",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "West Africa",
            "tone": "Firm",
            "bullets": [
              "Strong numbers on healthy South Atlantic fundamentals and a short vessel list."
            ],
            "forecast": "Firm.",
            "cargoes": [
              "Bauxite",
              "Manganese",
              "Clinker",
              "Cement",
              "Fertilizers",
              "Agricultural products"
            ]
          },
          {
            "name": "US Gulf",
            "tone": "Split market",
            "paragraphs": [
              "Handy: soft — limited demand and drifting freight levels, with Transatlantic particularly weak and vessel availability increasing week on week.",
              "Supramax/Ultramax: stable to up — cargo count comfortably exceeds prompt tonnage; India and Transatlantic remain the strongest performers on petcoke and grain demand."
            ],
            "forecast": "Handies: further downward pressure near term. Supras/Ultras: upward pressure on rates.",
            "cargoes": [
              "Grains (corn, soybeans, wheat)",
              "Petcoke",
              "Coal",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "tone": "Recovering",
            "paragraphs": [
              "Handy: after several quiet months the market shows signs of recovery — Black Sea grain exports are increasing and vessel supply is tightening.",
              "Supramax/Ultramax: strong — clinker activity into West Africa and grain expectations from the Black Sea continue supporting the market."
            ],
            "forecast": "Positive, led by grain and clinker demand.",
            "cargoes": [
              "Wheat",
              "Corn",
              "Barley",
              "Cement",
              "Clinker",
              "Salt",
              "Soda ash",
              "Fertilizers"
            ]
          },
          {
            "name": "Continent / Baltic",
            "tone": "Firm",
            "bullets": [
              "Cargo volumes are lighter, but freight levels remain well supported.",
              "Limited vessel availability keeps Supra/Ultra levels strong despite modest cargo activity."
            ],
            "forecast": "Firm despite slower cargo flow.",
            "cargoes": [
              "Scrap",
              "Grains",
              "Fertilizers",
              "Forest products",
              "Steel products"
            ]
          },
          {
            "name": "Russia / Black Sea",
            "tone": "Bullish",
            "bullets": [
              "Start of the grain season is generating significant upward momentum in the Black Sea market.",
              "Loading activity has accelerated across all major export terminals.",
              "Owners are increasingly selective on destinations."
            ],
            "forecast": "Additional strength expected through late July and early August as grain exports increase and tonnage tightens.",
            "cargoes": [
              "Wheat",
              "Barley",
              "Coal",
              "Fertilizers"
            ]
          },
          {
            "name": "South Africa",
            "tone": "Flat, fundamentals improving",
            "bullets": [
              "Consistent manganese ore and coal demand supports second-half July positions.",
              "Prompt tonnage has tightened, particularly Ultramaxes; Indian Ocean ballaster competition remains limited."
            ],
            "forecast": "Freight broadly unchanged, owner sentiment supported.",
            "cargoes": [
              "Manganese ore",
              "Coal",
              "Chrome ore",
              "Iron ore"
            ]
          }
        ]
      },
      {
        "name": "PACIFIC BASIN",
        "intro": "The Pacific is mixed: the Far East is balanced with improving period interest, Southeast Asia is under pressure from prompt tonnage, and the Indian Ocean remains constrained by the operating environment around Hormuz.",
        "regions": [
          {
            "name": "FEAST",
            "tone": "Active, steady",
            "bullets": [
              "Prompt tonnage largely covered last week — a more balanced market and stabilising freight levels.",
              "Backhaul demand is the main support against a steady vessel count; South China tonnage was fixed on NOPAC business, highlighting healthy Pacific demand.",
              "Period sentiment improved with paper strengthening near last done."
            ],
            "forecast": "Stable with improving period interest.",
            "cargoes": [
              "Grains (NoPac)",
              "Coal",
              "Steel products",
              "Fertilizers"
            ]
          },
          {
            "name": "Southeast Asia",
            "tone": "Softening",
            "bullets": [
              "Several prompt vessels still open for early-month employment.",
              "Cargo activity broadly unchanged; lack of fresh demand lets charterers push rates lower.",
              "Australian round voyages remain the primary source of demand."
            ],
            "forecast": "Soft near term.",
            "cargoes": [
              "Indonesian coal",
              "Nickel ore",
              "Bauxite",
              "Clinker",
              "Fertilizers",
              "Steel"
            ]
          },
          {
            "name": "AG / WCI",
            "tone": "Constrained",
            "bullets": [
              "Market adjusting to the evolving operating environment around the Strait of Hormuz.",
              "Charterers struggle to secure tonnage willing to load inside Arabian Gulf ports; East Coast UAE ports avoid Hormuz but suffer heavy congestion.",
              "Cargo demand subdued while vessel supply builds in WCI."
            ],
            "forecast": "Range-bound while Hormuz restrictions persist.",
            "cargoes": [
              "Clinker",
              "Cement",
              "Salt",
              "Iron ore",
              "Rice",
              "Fertilizers"
            ]
          },
          {
            "name": "WCCA / WCSA",
            "tone": "Robust",
            "bullets": [
              "Record concentrate export volumes and lower bunker costs keep freight elevated.",
              "A more balanced vessel count is expected for mid-month positions; Ultramax earnings remain stable.",
              "Panama Canal transit availability remains constrained, although auction premiums have eased from previous highs."
            ],
            "forecast": "Stable at elevated levels.",
            "cargoes": [
              "Mineral concentrates",
              "Fertilizers",
              "Salt",
              "Grains"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-06-25",
    "title": "Dry Bulk Market Update",
    "publishedDate": "2026-06-25",
    "summary": "Stable-to-firm on strong Atlantic activity; Pacific softens gradually on rising tonnage and monsoon disruption.",
    "overview": {
      "paragraphs": [
        "Overall market sentiment over the past two weeks remains stable-to-firm across almost all regions, supported by very strong activity in the Atlantic basin, while Pacific markets continue to soften gradually due to increasing vessel supply, weaker Panamax sentiment and additional seasonal disruption from the monsoon.",
        "Prolonged periods of monsoon could decrease demand in Asia."
      ]
    },
    "basins": [
      {
        "name": "ATLANTIC BASIN",
        "intro": "Strong conditions in the US Gulf and ECSA are feeding directly into West Africa and South Africa. Owners continue to have attractive alternative employment options, limiting vessel availability and maintaining upward pressure on freight rates throughout the South Atlantic basin.",
        "regions": [
          {
            "name": "US Gulf",
            "tone": "Strongest geared market globally",
            "bullets": [
              "Limited prompt tonnage and ongoing petcoke and grain demand.",
              "Port congestion and a shortage of ballasters from South America.",
              "Ultramax rates on premium routes are at multi-month highs."
            ],
            "forecast": "Clear market leader; firm.",
            "cargoes": [
              "Grains (corn, soybeans, wheat)",
              "Petcoke",
              "Coal",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "East Coast South America",
            "tone": "Healthy",
            "bullets": [
              "Cargo activity has moderated slightly, but freight levels remain firm as vessel supply stays controlled.",
              "Grain exports continue to provide the core demand base.",
              "Strong Transatlantic business supports both Handy and Supramax segments."
            ],
            "forecast": "Firm despite slower fixing activity.",
            "cargoes": [
              "Corn",
              "Soybeans",
              "Soybean meal",
              "Sugar",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "South Africa",
            "tone": "One of the best-performing markets",
            "bullets": [
              "Fresh manganese ore and coal demand continue to support forward programmes.",
              "Vessel supply has increased modestly compared with last week.",
              "Freight levels remain firm and owners keep strong negotiating positions."
            ],
            "forecast": "Firm.",
            "cargoes": [
              "Manganese ore",
              "Coal",
              "Chrome ore",
              "Iron ore"
            ]
          },
          {
            "name": "Mediterranean / Continent",
            "tone": "Improving",
            "bullets": [
              "No longer acting as a drag on the market, unlike earlier in the year.",
              "Freight levels supported by clinker, scrap, grain and West Africa demand.",
              "Vessel supply remains manageable; owners maintain firmer ideas."
            ],
            "forecast": "Continued gradual improvement.",
            "cargoes": [
              "Clinker",
              "Scrap",
              "Grains",
              "Cement",
              "Fertilizers"
            ]
          },
          {
            "name": "Russia / Black Sea",
            "tone": "Forward-looking story",
            "bullets": [
              "Prompt activity remains limited, but forward enquiry is increasing.",
              "Participants are positioning for the new grain season.",
              "Meaningful cargo volumes are still several weeks away."
            ],
            "forecast": "Expectations for third-quarter freight demand continue to improve.",
            "cargoes": [
              "Wheat",
              "Barley",
              "Coal",
              "Fertilizers"
            ]
          }
        ]
      },
      {
        "name": "PACIFIC BASIN",
        "intro": "Pacific markets are gradually softening: vessel availability is increasing while sentiment weakens, and momentum has faded despite continued Australian support.",
        "regions": [
          {
            "name": "FEAST / Southeast Asia",
            "tone": "Gradually softening",
            "bullets": [
              "Increasing vessel availability and weaker sentiment in both regions.",
              "Pacific round voyages and backhaul trades lost ground over the past week.",
              "Australia remains the primary support, but momentum has weakened."
            ],
            "forecast": "Soft to stable.",
            "cargoes": [
              "Grains (NoPac)",
              "Coal",
              "Nickel ore",
              "Bauxite",
              "Clinker",
              "Steel"
            ]
          },
          {
            "name": "India / Arabian Gulf",
            "tone": "Stable with seasonal headwinds",
            "bullets": [
              "Monsoon season is beginning to affect sentiment and may disrupt cargo flows and port operations.",
              "Cargo volumes remain limited; salt exports are expected to decline.",
              "Balanced market lacking strong upside catalysts."
            ],
            "forecast": "Stable.",
            "cargoes": [
              "Clinker",
              "Cement",
              "Salt",
              "Iron ore",
              "Rice",
              "Fertilizers"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-06-18",
    "title": "Dry Bulk Market Update",
    "publishedDate": "2026-06-18",
    "summary": "Bullish across almost all regions on tight tonnage; Atlantic-led with US Gulf, ECSA and South Africa outperforming.",
    "overview": {
      "paragraphs": [
        "Compared to last week, this week is bullish across almost all regions, supported by very strong activity in the Atlantic basin.",
        "The very short list of vessels — especially Ultra/Supramaxes — is the key feature, and the primary market drivers are grain exports from ECSA, strong petcoke demand from the US Gulf, and continued coal and manganese programmes from South Africa.",
        "Pacific markets are more mixed. FEAST remains relatively balanced, supported by NoPac and backhaul demand, while Southeast Asia has softened due to increasing spot vessel availability and weaker Indo-China activity.",
        "Despite renewed escalation between the USA and Iran last week, an agreement was finally signed remotely overnight, but market participants remain highly cautious and prefer to monitor further developments. Fuel prices have been affected on paper; we are monitoring prices at places which depend on the physical availability of the products.",
        "In other negative news, the Suez Canal Authority issued a new circular materially increasing tariffs for passing the Suez Canal, which seriously affects Red Sea levels for both Panamax and Supramax sizes.",
        "The market remains Atlantic-led and generally owner-favoured. US Gulf, ECSA and South Africa are expected to outperform, while Pacific markets are likely to remain range-bound. Overall sentiment remains moderately bullish as tightening vessel supply continues to outweigh only moderate growth in cargo demand."
      ]
    },
    "basins": [
      {
        "name": "ATLANTIC BASIN",
        "intro": "Very strong activity across the basin: short vessel lists, active grain and petcoke programmes, and owner-favoured dynamics on virtually every route.",
        "regions": [
          {
            "name": "US Gulf",
            "tone": "Strongest market",
            "bullets": [
              "Freight levels continue to rise across all major routes.",
              "Prompt tonnage remains extremely tight.",
              "Additional petcoke demand for July loadings is emerging."
            ],
            "forecast": "Firm to higher.",
            "cargoes": [
              "Grains (corn, soybeans, wheat)",
              "Petcoke",
              "Coal",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "East Coast South America",
            "tone": "Very strong",
            "bullets": [
              "Grain programmes remain highly active.",
              "Prompt and end-month vessel supply continues to tighten.",
              "Forward July enquiries remain healthy."
            ],
            "forecast": "Strong with further upside potential.",
            "cargoes": [
              "Corn",
              "Soybeans",
              "Soybean meal",
              "Sugar",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "South Africa",
            "tone": "Firm",
            "bullets": [
              "Coal, manganese and iron ore demand remains robust.",
              "End-June and July cargo programmes continue to develop.",
              "Limited prompt tonnage is supporting owners' ideas."
            ],
            "forecast": "Firm.",
            "cargoes": [
              "Manganese ore",
              "Coal",
              "Chrome ore",
              "Iron ore"
            ]
          }
        ]
      },
      {
        "name": "PACIFIC BASIN",
        "intro": "More mixed than the Atlantic: balanced in the Far East, softer in Southeast Asia, firmer in the Indian Ocean.",
        "regions": [
          {
            "name": "Far East",
            "tone": "Balanced",
            "paragraphs": [
              "Covers China, Japan, South Korea and Taiwan."
            ],
            "bullets": [
              "Supported by NoPac and backhaul demand.",
              "Increasing vessel arrivals are capping upside.",
              "Market participants remain cautious."
            ],
            "forecast": "Stable.",
            "cargoes": [
              "Grains (NoPac)",
              "Coal",
              "Steel products",
              "Fertilizers"
            ]
          },
          {
            "name": "Southeast Asia",
            "tone": "Softening",
            "paragraphs": [
              "Covers Vietnam, Thailand, Indonesia and Singapore."
            ],
            "bullets": [
              "More spot vessels entering the market.",
              "Indo-China cargo volumes remain limited.",
              "Bid/offer spreads have widened."
            ],
            "forecast": "Soft to stable.",
            "cargoes": [
              "Indonesian coal",
              "Nickel ore",
              "Bauxite",
              "Clinker",
              "Fertilizers",
              "Steel"
            ]
          },
          {
            "name": "AG / WCI",
            "tone": "Firm",
            "bullets": [
              "Tonnage lists continue to tighten.",
              "South African demand is absorbing vessels.",
              "Congestion in Fujairah and Dibba persists."
            ],
            "forecast": "Stable to firm.",
            "cargoes": [
              "Clinker",
              "Cement",
              "Salt",
              "Iron ore",
              "Rice",
              "Fertilizers"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-06-11",
    "title": "Dry Bulk Market Update",
    "publishedDate": "2026-06-11",
    "summary": "Gradual improvement across regions; Middle East escalation and Suez tariff hike weigh on costs; Atlantic leads.",
    "overview": {
      "paragraphs": [
        "The week brought renewed waves of escalation in the Middle East, the first since the spring ceasefire. Announcements around the Bab el-Mandeb Strait and a suspension of traffic through the Strait of Hormuz are expected to affect fuel prices and physical fuel availability across all regions.",
        "In other negative news, the Suez Canal Authority issued a new circular materially increasing transit tariffs for dry bulk vessels, which adds meaningful cost to Red Sea routings for both Panamax and Supramax sizes.",
        "Overall market sentiment nevertheless continues to improve gradually across almost all regions. The main theme is tightening vessel supply rather than a significant increase in cargo demand: strong Atlantic fundamentals increasingly support adjacent regions, while Pacific markets are beginning to recover after a prolonged sideways period.",
        "The strongest markets remain East Coast South America, South Africa, West Africa and the US Gulf. The weakest areas remain the Black Sea and West Mediterranean, where cargo activity is still insufficient to absorb available tonnage."
      ]
    },
    "basins": [
      {
        "name": "ATLANTIC BASIN",
        "intro": "Atlantic fundamentals keep firming on shrinking tonnage lists, with strength radiating from South America and the US Gulf into the neighbouring load areas; only the Mediterranean and Black Sea lag the move.",
        "regions": [
          {
            "name": "ECSA",
            "tone": "Strongest Atlantic market",
            "paragraphs": [
              "Both Handy and Supra/Ultramax segments continue to strengthen as grain exports remain active and available tonnage keeps shrinking."
            ],
            "cargoes": [
              "Corn",
              "Soybeans",
              "Soybean meal",
              "Sugar",
              "Fertilizers",
              "Steel products"
            ],
            "reason": "Strong grain demand and tightening vessel availability.",
            "forecast": "Additional rate increases remain likely unless vessel supply increases materially."
          },
          {
            "name": "West Africa",
            "tone": "Firm",
            "paragraphs": [
              "West Africa continues to benefit from strength in the South Atlantic. Cargo volumes are not exceptional, but short vessel lists are supporting freight levels."
            ],
            "cargoes": [
              "Bauxite",
              "Manganese",
              "Clinker",
              "Fertilizers",
              "Agricultural products"
            ],
            "reason": "Limited prompt tonnage and strong Atlantic positioning economics.",
            "forecast": "Rates likely remain elevated while ECSA stays strong."
          },
          {
            "name": "US Gulf",
            "tone": "One of the healthiest markets",
            "paragraphs": [
              "Handy markets are stable, while Supra and Ultramax segments continue to strengthen due to grain and petcoke demand."
            ],
            "cargoes": [
              "Grains",
              "Petcoke",
              "Coal",
              "Fertilizer",
              "Steel products"
            ],
            "reason": "Strong cargo-to-tonnage balance and growing forward demand.",
            "forecast": "Further upside remains possible into midsummer, particularly if petcoke demand remains active."
          },
          {
            "name": "Mediterranean / Black Sea",
            "tone": "Divided",
            "paragraphs": [
              "Handysize markets remain weak, particularly in the West Med and Black Sea, while Supra and Ultramax markets have started to improve modestly."
            ],
            "cargoes": [
              "Grains",
              "Cement",
              "Clinker",
              "Salt",
              "Fertilizers",
              "Soda ash"
            ],
            "reason": "Cargo volumes remain limited despite some improvement in enquiry.",
            "forecast": "Recovery is likely to be gradual and largely dependent on grain exports during the summer season."
          },
          {
            "name": "Continent / Baltic",
            "tone": "Stabilized but fragile",
            "paragraphs": [
              "Northern Europe has stabilized but remains fragile. Handy markets have improved slightly, although activity is still limited. Supra and Ultramax segments remain stable with scrap cargoes continuing to dominate."
            ],
            "cargoes": [
              "Scrap",
              "Grains",
              "Fertilizers",
              "Forest products",
              "Steel"
            ],
            "reason": "The supply-demand balance is improving but not yet tight.",
            "forecast": "Further gains require stronger cargo injection and confirmation through concluded fixtures."
          },
          {
            "name": "Russia / Black Sea",
            "tone": "Subdued",
            "paragraphs": [
              "Russian activity remains subdued despite a strong wheat harvest outlook. Most visible cargoes continue to originate from Ukraine, while vessel supply remains abundant."
            ],
            "cargoes": [
              "Wheat",
              "Barley",
              "Coal",
              "Fertilizers"
            ],
            "reason": "Weak cargo flow relative to available tonnage.",
            "forecast": "No significant recovery expected in the near term."
          }
        ]
      },
      {
        "name": "PACIFIC BASIN",
        "intro": "The Pacific market is firming: tonnage availability is tightening while cargo enquiry remains steady, with seasonal coal demand and Australian exports providing underlying support.",
        "regions": [
          {
            "name": "FEAST / Southeast Asia",
            "tone": "Firming",
            "paragraphs": [
              "Both areas improved during the week, supported by stronger backhaul demand, fresh NoPac cargoes, and healthy cargo activity from Australia and Indonesia. Nickel ore exports from the Philippines and seasonal coal demand across Northeast Asia continue to provide underlying support."
            ],
            "reason": "Tonnage availability is tightening while cargo enquiry remains steady.",
            "forecast": "Rates are expected to remain supported through the end of the month, particularly if seasonal coal restocking in North Asia continues.",
            "cargoes": [
              "Grains (NoPac)",
              "Coal",
              "Nickel ore",
              "Bauxite",
              "Clinker",
              "Steel"
            ]
          },
          {
            "name": "Indian Ocean / AG-WCI",
            "tone": "Stable to firm",
            "paragraphs": [
              "Cargo activity is steady and prompt vessel availability remains limited. East Coast India continues to outperform West Coast India, supported by iron ore, coal and regional trades. South African employment remains an attractive alternative for owners."
            ],
            "reason": "Balanced supply-demand fundamentals and limited prompt tonnage.",
            "forecast": "Modest upside possible if monsoon-related cargo coverage accelerates in the coming weeks.",
            "cargoes": [
              "Clinker",
              "Cement",
              "Salt",
              "Iron ore",
              "Rice",
              "Fertilizers"
            ]
          },
          {
            "name": "South Africa",
            "tone": "One of the strongest regions globally",
            "paragraphs": [
              "Coal and manganese exports continue to drive demand, while vessel supply remains tight due to limited ballast inflow from India and strong Pacific employment."
            ],
            "cargoes": [
              "Coal",
              "Manganese ore",
              "Chrome ore",
              "Minerals"
            ],
            "reason": "A growing cargo programme combined with tightening vessel supply.",
            "forecast": "Further upside remains possible into midsummer."
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-06-04",
    "title": "Dry Bulk Market Update",
    "publishedDate": "2026-06-04",
    "summary": "Sentiment stable despite holidays and Posidonia; Atlantic leads, Med and Europe weakest.",
    "overview": {
      "paragraphs": [
        "Overall market sentiment remains generally stable despite a slow start to the week caused by regional holidays and limited activity around a major industry conference week.",
        "The Atlantic basin continues to outperform the Pacific, while the Mediterranean and Europe remain the weakest regions due to limited cargo activity and persistent vessel oversupply."
      ]
    },
    "basins": [
      {
        "name": "ATLANTIC BASIN",
        "intro": "Atlantic markets continue to lead the geared sector, driven by strong US Gulf demand, healthy ECSA grain flows and improving South African exports. Short-term direction remains constructive, with recovery in Europe still dependent on a meaningful increase in cargo activity.",
        "regions": [
          {
            "name": "ECSA",
            "tone": "Healthy",
            "paragraphs": [
              "ECSA remains healthy. The Handy market is one of the strongest globally, supported by active grain demand and a shrinking tonnage list. In the Supra and Ultramax sector, transatlantic business remains firm while Far East demand is stable. Ballasters continue arriving from weaker Mediterranean markets, but overall fundamentals remain supportive."
            ],
            "forecast": "Fundamentals remain supportive; steady-to-firm conditions expected into mid-June as grain demand absorbs incoming ballasters.",
            "cargoes": [
              "Corn",
              "Soybeans",
              "Soymeal",
              "Sugar",
              "Wood pellets"
            ]
          },
          {
            "name": "US Gulf",
            "tone": "Strongest region overall",
            "paragraphs": [
              "The strongest region overall is still the US Gulf. On Supra and Ultramax sizes, strong petcoke demand from India, healthy grain exports and improving transatlantic enquiry continue to tighten the market. Owners remain confident and most participants expect further upside in the near term. Handy sentiment is more stable but still supported by tight vessel supply."
            ],
            "forecast": "Further upside expected in the near term as petcoke and grain demand keep the tonnage list tight.",
            "cargoes": [
              "Grain (corn, soybeans, wheat) → FEAST, China, Med",
              "Petcoke → India, Med, FEAST",
              "Coal → Med, Egypt, India",
              "Fertilizers",
              "Minor bulks"
            ]
          },
          {
            "name": "West Africa",
            "tone": "Firm",
            "paragraphs": [
              "West Africa also remains firm. Cargo volumes are not exceptional, but limited prompt tonnage and stronger South Atlantic markets continue to support rates."
            ],
            "forecast": "Firm tone expected to hold while prompt tonnage stays short and South Atlantic strength supports the region.",
            "cargoes": [
              "Bauxite",
              "Clinker",
              "Cement",
              "Fertilizers",
              "Minerals"
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "tone": "Under pressure",
            "paragraphs": [
              "In contrast, the Mediterranean and Black Sea remain under pressure. Cargo volumes are extremely limited, grain exports remain disappointing, and vessel supply continues to build. Owners are increasingly ballasting toward ECSA and the US rather than accepting weak regional business. The larger Supra and Ultramax segment is more resilient than Handy, but overall sentiment remains subdued."
            ],
            "forecast": "Subdued conditions likely to persist until grain exports pick up; no near-term catalyst for recovery visible.",
            "cargoes": [
              "Wheat",
              "Corn",
              "Barley",
              "Cement",
              "Clinker",
              "Soda ash",
              "Salt"
            ]
          },
          {
            "name": "Continent / Baltic",
            "tone": "Thin",
            "paragraphs": [
              "The Continent and Baltic show a similar picture. Activity remains thin, cargo injection is limited, and vessel availability remains elevated. Scrap cargoes continue to dominate the market, but there are still not enough cargoes to create meaningful upward pressure."
            ],
            "forecast": "Sideways trading expected while cargo injection stays limited and vessel availability remains elevated.",
            "cargoes": [
              "Scrap",
              "Grains",
              "Fertilizers",
              "Forest products",
              "Steel products"
            ]
          }
        ]
      },
      {
        "name": "PACIFIC BASIN",
        "intro": "Pacific markets remain stable and well supported overall, though still lacking the momentum for a meaningful upward move.",
        "regions": [
          {
            "name": "FEAST",
            "tone": "Broadly flat",
            "paragraphs": [
              "FEAST remains broadly flat. Australian cargoes and healthy backhaul demand continue to support rates, while NoPac activity remains relatively subdued. Vessel supply is balanced and owners are managing to defend levels, but there is still a lack of momentum for a meaningful upward move."
            ],
            "forecast": "Flat conditions expected to continue; owners should hold levels but a meaningful upward move still looks distant.",
            "cargoes": [
              "Grains (NoPac)",
              "Coal",
              "Steel products",
              "Fertilizers"
            ]
          },
          {
            "name": "SE Asia",
            "tone": "Largely unchanged",
            "paragraphs": [
              "SE Asia is also largely unchanged. Indonesian and Australian cargoes continue to provide support, while India and backhaul business remain the strongest employment options. Overall sentiment is flat to slightly firm as available tonnage remains reasonably absorbed."
            ],
            "forecast": "Flat-to-slightly-firm tone expected while Indonesian volumes keep the tonnage list reasonably absorbed.",
            "cargoes": [
              "Indonesian coal",
              "Nickel ore",
              "Bauxite",
              "Clinker",
              "Fertilizers",
              "Steel"
            ]
          },
          {
            "name": "Indian Ocean / AG-WCI",
            "tone": "Balanced",
            "paragraphs": [
              "In the Indian Ocean, AG and WCI remain balanced. Cargo activity slowed slightly compared to previous weeks, but vessel supply is also limited, preventing any major correction. East Coast India continues to outperform, supported by iron ore, coal and agricultural exports, while owners remain selective about fixing weaker WCI business."
            ],
            "forecast": "Balanced conditions expected to hold; East Coast India should keep outperforming on ore and agricultural flows.",
            "cargoes": [
              "Clinker",
              "Cement",
              "Salt",
              "Iron ore",
              "Rice",
              "Fertilizers"
            ]
          },
          {
            "name": "South Africa",
            "tone": "Strongest story this week",
            "paragraphs": [
              "South Africa remains one of the strongest stories this week. Demand for manganese and coal exports continues to improve while vessel supply has tightened. Fresh cargoes are steadily entering the market and sentiment is gradually shifting in owners' favour."
            ],
            "forecast": "Gradual further improvement expected as fresh ore and coal cargoes keep entering a tightening market.",
            "cargoes": [
              "Manganese ore",
              "Coal",
              "Chrome ore"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-05-28",
    "title": "Dry Bulk Market Update",
    "publishedDate": "2026-05-28",
    "summary": "Mixed to slightly soft globally; Atlantic resilient, Med and Indian Ocean under pressure.",
    "overview": {
      "paragraphs": [
        "Global dry bulk sentiment remains mixed to slightly soft, with the Atlantic showing relative resilience while Mediterranean and Indian Ocean markets remain under pressure.",
        "Short-term outlook remains cautious. Vessel supply continues to build across several regions, while cargo activity remains inconsistent. However, Pacific and Atlantic fundamentals are still relatively healthier compared to Europe, helping prevent a sharper market correction for now."
      ]
    },
    "basins": [
      {
        "name": "ATLANTIC BASIN",
        "intro": "The Atlantic remains comparatively resilient, but ballast flows out of the weaker Mediterranean keep feeding tonnage into the stronger load areas and capping the upside.",
        "regions": [
          {
            "name": "US Gulf",
            "tone": "Firm",
            "paragraphs": [
              "The market stayed broadly stable this week with some positional upside, particularly on fronthaul business. Owners continue to hold firm ideas for forward dates.",
              "In the Handy segment sentiment remains firm: the baseline continues to be supported by a tight supply of tonnage, the East Coast has returned to commanding premiums on clean transatlantic runs, and demand remains robust with a steady flow of fresh cargoes."
            ],
            "forecast": "Given the persistent lack of prompt tonnage and consistent cargo volume, the strong sentiment is expected to carry forward through the coming laycans.",
            "cargoes": [
              "Grains (corn, soybeans, wheat)",
              "Petcoke",
              "Coal",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "ECSA",
            "tone": "Softer",
            "paragraphs": [
              "Sentiment softened slightly as ballast tonnage continued building, especially from the Mediterranean, while transatlantic business remains relatively healthy.",
              "The Handy market remains very quiet — a short cargo list against strong over-tonnage keeps pressure on owners' expectations, with only slightly more activity out of the northern range."
            ],
            "forecast": "Flat to slightly negative near term amid holidays and a slow restart in fixing activity.",
            "cargoes": [
              "Corn",
              "Soybeans",
              "Soybean meal",
              "Sugar",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "tone": "Weakest region",
            "paragraphs": [
              "Cargo flow remains very limited across both Handy and Supra segments, while vessel supply keeps increasing. Black Sea grain remains the main support, but the visible programme is thin and owners are increasingly ballasting toward the Americas or accepting repositioning voyages rather than fixing weak local business."
            ],
            "reason": "Not enough cargo volume to absorb the standing tonnage list in either the East or West Mediterranean.",
            "forecast": "Sentiment stays negative with no meaningful recovery expected in the immediate weeks.",
            "cargoes": [
              "Wheat",
              "Corn",
              "Barley",
              "Cement",
              "Clinker",
              "Salt",
              "Soda ash",
              "Fertilizers"
            ]
          },
          {
            "name": "Continent / Baltic",
            "tone": "Soft",
            "paragraphs": [
              "Scrap cargoes and grains to West Africa continue to dominate. The tonnage list remains stable and demand is marginally better this week, but overall activity out of the range stays limited."
            ],
            "forecast": "Same soft trend as previous weeks.",
            "cargoes": [
              "Scrap",
              "Grains",
              "Fertilizers",
              "Forest products",
              "Steel products"
            ]
          },
          {
            "name": "Russia / Black Sea",
            "tone": "Quiet",
            "paragraphs": [
              "Another quiet week on grains, with little Handy activity toward the Mediterranean and only selective Supra enquiry eastward."
            ],
            "reason": "High commodity prices and a strong local currency make it difficult to compete with other origins.",
            "forecast": "Subdued until export economics improve.",
            "cargoes": [
              "Wheat",
              "Barley",
              "Coal",
              "Fertilizers"
            ]
          }
        ]
      },
      {
        "name": "PACIFIC BASIN",
        "intro": "A holiday-shortened week weighed on early activity, but momentum gradually improved as the week progressed, leaving the basin balanced overall.",
        "regions": [
          {
            "name": "FEAST",
            "tone": "Constructive near term",
            "paragraphs": [
              "The week commenced on a subdued note, largely influenced by regional holidays, before a healthier volume of NoPac and backhaul enquiries entered the market and provided firmer support against the forward tonnage list.",
              "Prompt vessel availability remains relatively restricted in some loading areas, allowing owners with nearby open positions to maintain firmer ideas."
            ],
            "forecast": "The front period remains well underpinned against paper values.",
            "cargoes": [
              "Grains (NoPac)",
              "Coal",
              "Steel products",
              "Fertilizers"
            ]
          },
          {
            "name": "Southeast Asia",
            "tone": "Stable",
            "paragraphs": [
              "The market remained stable, supported by Australian cargoes and healthy backhaul demand toward West Africa and the Americas. Period interest continues to be present."
            ],
            "forecast": "Largely flat week on week.",
            "cargoes": [
              "Indonesian coal",
              "Nickel ore",
              "Bauxite",
              "Clinker",
              "Fertilizers",
              "Steel"
            ]
          },
          {
            "name": "AG / WCI",
            "tone": "Quiet",
            "paragraphs": [
              "Activity remained very limited overall as most of the region observed holidays. Port congestion continues to impact cargo flow, while geopolitical concerns around the Strait of Hormuz still weigh on sentiment."
            ],
            "forecast": "Rangebound while regional headwinds persist.",
            "cargoes": [
              "Clinker",
              "Cement",
              "Salt",
              "Iron ore",
              "Rice",
              "Fertilizers"
            ]
          },
          {
            "name": "South Africa",
            "tone": "Slightly correcting",
            "paragraphs": [
              "A quieter start amid regional holidays, with activity picking up as more cargoes surfaced for forward dates. Supply continued to build as ballasters repositioned from the Indian Ocean, and fresh manganese fixtures were concluded below previously done levels."
            ],
            "forecast": "Slightly softer as vessel availability grows.",
            "cargoes": [
              "Manganese ore",
              "Coal",
              "Chrome ore",
              "Iron ore"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-05-21",
    "title": "Dry Bulk Market Update",
    "publishedDate": "2026-05-21",
    "summary": "Broadly soft to slightly corrective; rising tonnage and FFA correction weigh on owners.",
    "overview": {
      "paragraphs": [
        "Global dry bulk sentiment remains broadly soft to slightly corrective.",
        "Pressure is coming from increasing vessel supply across several regions, while cargo enquiry remains relatively stable. Owners are facing growing resistance in maintaining previous highs.",
        "Key themes this week: increasing prompt tonnage in Asia and the Atlantic; a paper-market correction impacting confidence and forward fixing appetite after a strong previous week; stronger support still visible in South Africa and selected US Gulf trades; the Mediterranean, Black Sea and Continent remain under sustained pressure."
      ]
    },
    "basins": [
      {
        "name": "ATLANTIC BASIN",
        "intro": "Softer paper remains the main drag on sentiment, whilst weakness across other basins and continued undercutting from smaller stems adds further pressure.",
        "regions": [
          {
            "name": "US Gulf",
            "tone": "Firm",
            "paragraphs": [
              "Fresh cargo activity improved significantly this week, helping push rates upward, particularly for nearby laycans. The Supra/Ultramax segment is stable to slightly stronger."
            ],
            "reason": "The prompt tonnage situation has tightened materially, while the East Coast is beginning to show oversupply.",
            "forecast": "Owners are gaining leverage again, with clean transatlantic runs expected to test firmer levels.",
            "cargoes": [
              "Grains (corn, soybeans, wheat)",
              "Petcoke",
              "Coal",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "ECSA",
            "tone": "Softening",
            "paragraphs": [
              "The Handy segment remains under pressure, while the Supra/Ultramax segment is flat to slightly negative."
            ],
            "reason": "Very limited fresh activity and a short cargo list.",
            "forecast": "Early-summer tonnage is increasingly oversupplied, forcing owners to continue reducing offers.",
            "cargoes": [
              "Corn",
              "Soybeans",
              "Soybean meal",
              "Sugar",
              "Fertilizers",
              "Steel products"
            ]
          },
          {
            "name": "Continent",
            "tone": "Stable",
            "paragraphs": [
              "The market feels stable so far this week with little movement compared to the previous one."
            ],
            "forecast": "Sideways.",
            "cargoes": [
              "Scrap",
              "Grains",
              "Fertilizers",
              "Forest products",
              "Steel products"
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "tone": "Weak",
            "paragraphs": [
              "Another subdued and challenging week in the Black Sea / East Med market.",
              "The Med market remains heavily pressured with minimal grain activity outside Ukraine and generally weak cargo volumes. The Supra/Ultramax segment shows only a slight improvement."
            ],
            "reason": "The West Mediterranean remains the weakest area, pushing many owners to focus on South American and US East Coast opportunities instead.",
            "forecast": "The outlook remains negative near term, though early-summer grain demand could provide some recovery support.",
            "cargoes": [
              "Wheat",
              "Corn",
              "Barley",
              "Cement",
              "Clinker",
              "Salt",
              "Soda ash",
              "Fertilizers"
            ]
          }
        ]
      },
      {
        "name": "PACIFIC BASIN",
        "intro": "The Pacific market continued to soften midweek, with tonnage increasing across the basin while replenishment of fresh cargo remained minimal. Rumours of fixtures below last done, and consequently softer bids across the basin, have pressured owners' positions.",
        "regions": [
          {
            "name": "FEAST",
            "tone": "Softening / corrective",
            "paragraphs": [
              "The market continued to soften, particularly in the prompt window where increasing vessel availability pressured rates."
            ],
            "reason": "Cargo enquiry remains relatively healthy, especially for northbound and backhaul business, but the growing tonnage list continues to outweigh demand.",
            "forecast": "Despite healthy cargo visibility, owners are increasingly struggling to maintain premiums due to rising prompt tonnage.",
            "cargoes": [
              "Grains (NoPac)",
              "Coal",
              "Steel products",
              "Fertilizers"
            ]
          },
          {
            "name": "Southeast Asia",
            "tone": "Flat to slightly soft",
            "paragraphs": [
              "The market opened quietly before activity improved later in the week."
            ],
            "reason": "Cargo flow and open vessel count remain balanced overall, though sentiment softened slightly due to weaker paper support and limited short-period appetite.",
            "forecast": "Broadly flat, but charterers are showing more resistance in period discussions amid stagnant index movement.",
            "cargoes": [
              "Indonesian coal",
              "Nickel ore",
              "Bauxite",
              "Clinker",
              "Fertilizers",
              "Steel"
            ]
          },
          {
            "name": "AG / WCI",
            "tone": "Soft",
            "paragraphs": [
              "The market started slowly with limited fresh cargo activity."
            ],
            "reason": "Prompt clinker stems have largely been covered while forward cargo pricing is only beginning to emerge.",
            "forecast": "The market lacks fresh momentum, and owners increasingly view South Africa as a stronger alternative positioning option.",
            "cargoes": [
              "Clinker",
              "Cement",
              "Salt",
              "Iron ore",
              "Rice",
              "Fertilizers"
            ]
          },
          {
            "name": "South Africa",
            "tone": "Firm / stable",
            "paragraphs": [
              "Activity slowed slightly this week, but nearby tonnage remains tight with several cargoes still uncovered."
            ],
            "reason": "Weather disruption around the Western Cape continues to create uncertainty.",
            "forecast": "Near-term sentiment appears stable while stronger forward demand is expected to keep rates firm.",
            "cargoes": [
              "Manganese ore",
              "Coal",
              "Chrome ore",
              "Iron ore"
            ]
          }
        ]
      }
    ]
  }
];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel=date=>new Date(date+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const paragraphs=items=>(items||[]).map(p=>'<p>'+esc(p)+'</p>').join('');
function render(reportId,regionName=''){
 const report=reports.find(r=>r.id===reportId)||reports[0];
 if(!report)return '<section class="market"><h2>MARKET</h2><p>No archived reports available.</p></section>';
 const regions=[...new Set(report.basins.flatMap(b=>b.regions.map(r=>r.name)))];
 const selectedRegion=regions.includes(regionName)?regionName:'';
 const option=(value,label,selected)=>'<option value="'+esc(value)+'"'+(selected?' selected':'')+'>'+esc(label)+'</option>';
 const regionCard=r=>'<article class="market-region"><h4>'+esc(r.name)+'</h4>'+(r.tone?'<p class="market-tone">'+esc(r.tone)+'</p>':'')+paragraphs(r.paragraphs)+(r.bullets?.length?'<ul>'+r.bullets.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'')+(r.reason?'<p><strong>Drivers</strong><br>'+esc(r.reason)+'</p>':'')+(r.forecast?'<p><strong>Outlook at publication</strong><br>'+esc(r.forecast)+'</p>':'')+(r.cargoes?.length?'<p class="market-cargoes"><strong>Main export cargoes</strong><br>'+r.cargoes.map(esc).join(' · ')+'</p>':'')+(r.benchmark?'<pre>'+esc(r.benchmark)+'</pre>':'')+'</article>';
 return '<section class="market"><div class="heading"><div><h2>MARKET</h2><p class="section-intro">Dry bulk market sentiment archive.</p></div><span class="market-badge">Archive · '+reports.length+' reports</span></div>'+
 '<p class="market-disclaimer">Archived commentary, not a live market feed or independently verified market data. Latest available report: '+dateLabel(reports[0].publishedDate)+'. Forecasts refer to their publication date. Updates are not automatic.</p>'+
 '<div class="market-filters"><label class="field">Report date<select id="market-report" aria-label="Market report date">'+reports.map(r=>option(r.id,dateLabel(r.publishedDate),r.id===report.id)).join('')+'</select></label>'+
 '<label class="field">Region<select id="market-region" aria-label="Market region">'+option('','All regions',!selectedRegion)+regions.map(r=>option(r,r,r===selectedRegion)).join('')+'</select></label></div>'+
 '<article class="market-report"><div class="market-report-title"><p class="market-date"><time datetime="'+esc(report.publishedDate)+'">'+dateLabel(report.publishedDate)+'</time></p><h3>'+esc(report.title)+'</h3><p>'+esc(report.summary)+'</p></div>'+
 (!selectedRegion?'<div class="market-overview"><h3>Market overview</h3>'+paragraphs(report.overview.paragraphs)+'</div>':'')+
 '<div class="market-basins">'+report.basins.map(b=>{const visible=b.regions.filter(r=>!selectedRegion||r.name===selectedRegion);return visible.length?'<div class="market-basin"><h3>'+esc(b.name)+'</h3>'+(!selectedRegion&&b.intro?'<p class="market-basin-intro">'+esc(b.intro)+'</p>':'')+visible.map(regionCard).join('')+'</div>':'';}).join('')+'</div>'+
 (!selectedRegion?(report.segments||[]).map(s=>'<div class="market-overview"><h3>'+esc(s.name)+'</h3>'+paragraphs(s.paragraphs)+(s.benchmark?'<pre>'+esc(s.benchmark)+'</pre>':'')+'</div>').join('')+(report.notes?.length?'<div class="market-overview"><h3>Desk notes</h3>'+paragraphs(report.notes)+'</div>':''):'')+
 '</article></section>';
}
const api={reports,render,dateLabel};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXMarket=api;
})(typeof window==='undefined'?globalThis:window);

