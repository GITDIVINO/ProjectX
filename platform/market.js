(function(root){
'use strict';
// Editorial report archive; extended 2026-09-09. No inbox, accounts or private voyage data.
const reports=[
  {
    "id": "dry-bulk-2026-09-02",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-09-02",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Outlook report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST — SMX / UMX",
                "paragraphs": [
                  "Sentiment: STEADY ↔️",
                  "The FEAST market remains relatively firm, with Charterers appearing keen to secure tonnage early in the week. Despite a few prompt vessels being available, healthy cargo demand continues to absorb tonnage quickly.",
                  "Period business has also attracted increased interest, supported by the continued positive trend in the paper market.",
                  "Recent Fixtures",
                  "• UMX CJK → NOPAC RV: around USD 20,000",
                  "• UMX N China → SP: around USD 21,000",
                  "• UMX CJK → USG: around USD 13,000",
                  "BSS BS63 DOP CJK",
                  "Route | Guidance",
                  "NOPAC | USD 20,000",
                  "Australia | USD 19,000",
                  "SE Asia | USD 17,500",
                  "Cont / Med | USD 19,000",
                  "WCCA | USD 18,500",
                  "Market View: 🟢 Firm / Steady"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE ASIA — SMX / UMX",
                "paragraphs": [
                  "Sentiment: FLAT / FIRM ↔️",
                  "The SE Asia market continues to stay firm this week, although the balance between supply and demand appears more even as additional tonnage has entered the market.",
                  "Indo/India employment remains the main driver, while overall demand across the region remains active.",
                  "Some delays are expected in the Philippines as the rainy season develops. Backhaul activity from South China/North Vietnam remains limited, with bulk cement being one of the few exceptions.",
                  "Period interest remains present. Overall, the market continues to feel firm, although we have not seen the same upward push as last week. We therefore describe the market as largely flat week-on-week.",
                  "BSS BS63 DOP HK",
                  "Route | USD",
                  "Indo / Thailand | 17,500",
                  "Indo / China | 17,000",
                  "Indo / India | 23,500",
                  "Australia RV | 19,000",
                  "SP SMX | 19,000",
                  "SP UMX | 22,500",
                  "Market View: 🟢 Firm, but momentum has flattened"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI — SMX / UMX",
                "paragraphs": [
                  "Sentiment: SOFTENING / CAUTIOUS ↘️",
                  "AG market sentiment weakened over the weekend as regional tensions escalated further, creating additional uncertainty among both Owners and Charterers.",
                  "Fresh cargo enquiry from the AG/Oman region remains relatively limited. However, vessel supply is also on the tighter side, helping to balance the market and keeping rates broadly stable.",
                  "Owners continue to maintain firm ideas, while Charterers remain cautious given the current uncertainty.",
                  "Imabari 63 DWT — Indicative Bid / Offer",
                  "Route | Bid | Offer",
                  "AG / WCI | 22,000 | 24,000",
                  "AG / ECI | 23,000 | 25,000",
                  "AG / FEAST | 22,000 | 24,000",
                  "WCI / FEAST | 14,000 | 16,000",
                  "Indicative broker guidance only.",
                  "Market View: 🟠 Cautious / Slightly softer"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA — SMX / UMX",
                "paragraphs": [
                  "Sentiment: FIRM 🟢",
                  "South Africa has turned more active this week, with prompt manganese ore and coal enquiries continuing to support the cargo list.",
                  "Prompt tonnage has tightened further, with approximately 9 ships on the coast, while around 7 potential Indian ballasters remain in play.",
                  "Charterers continue attempting to push bids lower, with only a few prompt Charterers showing more aggressive interest. This leaves the bid/offer spread relatively wide.",
                  "Recent fixtures have been concluded above previous market levels, giving Owners greater confidence to maintain firm ideas and raise offers. With demand currently outweighing available prompt tonnage, spot sentiment remains firm.",
                  "Recent Fixtures",
                  "Rate | Cargo / Route | Vessel",
                  "25,000 + 250K | PE / Singapore–Japan | 63K DWT, open Mombasa 9/10 Sep",
                  "25,000 + 250K | PE / Singapore–Japan | 63K DWT, open Kandla 2 Sep",
                  "24,500 + 245K | RBAY / Pakistan | 61K DWT, open Hazira 31 Aug",
                  "15,500 DOP | RBAY / Pakistan | 60K DWT, open Port Qasim 7 Sep",
                  "BSI 63K DWT Benchmark",
                  "Route | Guidance",
                  "SAFR / FH | USD 25,000 + 250K",
                  "SAFR / ECI | USD 25,000 + 250K",
                  "SAFR / BH | USD 22,000",
                  "Market View: 🟢 Firm — prompt demand > available tonnage"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA — HANDY",
                "paragraphs": [
                  "Sentiment: STABLE / FIRMING ↗️",
                  "The market has remained stable so far this week, with activity relatively subdued but sentiment continuing to show a positive trend.",
                  "The cargo list continues to build, with approximately 30 cargoes currently showing for September dates. Forward activity is also encouraging, supporting the overall positive market sentiment.",
                  "On the tonnage side, approximately 25 vessels are open in the South Atlantic, keeping the prompt tonnage list relatively tight, excluding ballasters.",
                  "With West Med numbers currently looking attractive, some ballasters may position ex West Africa and WCSA.",
                  "Recent Fixtures",
                  "• 34K DWT: USD 18,500 APS N Brazil / Cont–ARAG",
                  "• 32K DWT: USD 20,000 APS S Brazil / W Med",
                  "• 38K DWT: USD 27,000 APS RECA / WCSA",
                  "• 37K DWT: USD 20,000 APS N Brazil / C Med",
                  "BSS 37K Saiki — Route Guidance",
                  "Route | USD",
                  "ECSA / TA | 22,750",
                  "ECSA / Spore–Japan | 21,000",
                  "UPR / South Africa | 22,500",
                  "ECSA Coastal / S Brazil | 17,000",
                  "ECSA Coastal / N Brazil | 18,750",
                  "Market View: 🟢 Stable with positive bias"
                ]
              },
              {
                "name": "ECSA — SMX / UMX",
                "paragraphs": [
                  "Sentiment: SLIGHTLY NEGATIVE SHORT TERM ↘️",
                  "The ECSA market has been relatively balanced so far this week, with decent activity and demand broadly in line with recent levels.",
                  "There is somewhat more TA demand relative to FH, although this continues to show a slight decline. Despite seasonal support for North Brazil origins, activity has been somewhat less pronounced than during the previous couple of weeks.",
                  "Destination demand remains spread across the Atlantic, while Chittagong demand on the FH route has increased compared with recent weeks.",
                  "Traders continue to show a preference for UMX tonnage for PMX cargoes as the spread increases. However, this has not yet translated into a meaningful improvement in the UMX market.",
                  "Supply",
                  "Committed tonnage in ECSA has increased somewhat, continuing the trend of available ships on the coast. At the same time, supply of WAFR and Cont/Med ballasters has increased week-on-week, potentially explaining the recent decline in those trades.",
                  "The physical market remains subdued, while FFA has shown considerable strength since the end of last week. Despite some intraday volatility, paper levels remain disconnected from the spot market on the positive side.",
                  "More forward cargo is also being discussed, continuing the recent trend.",
                  "Overall: The short-term picture is slightly negative across both Atlantic routes and FH. However, the supply/demand balance remains manageable and could turn quickly. Given the wider Atlantic basin dynamics and gearless situation, we expect the market could regain positive momentum as we approach late September / early October.",
                  "Broker Rates & Guidance",
                  "Route | I63 | T58",
                  "RECA / TA | 31,500 | 28,000",
                  "SBRAZ / TA | 31,000 | 27,500",
                  "NBRAZ / TA | 31,000 | 27,500",
                  "SBRAZ / FH | 19,250 + 925K | 17,000 + 700K",
                  "Market View: 🟠 Slightly negative short term, but balance remains fragile"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR — SMX / UMX",
                "paragraphs": [
                  "Sentiment: FIRM 🟢",
                  "Activity remains limited in terms of overall cargo volume, but the lack of available tonnage continues to support firm numbers.",
                  "Broker Guidance",
                  "Route | Guidance",
                  "WAFR / TA — Short Duration | USD 23,000–24,000",
                  "WAFR / FH India | USD 29,000–30,000",
                  "WAFR / FH China | USD 26,000–27,000",
                  "WAFR / FH via ECSA | USD 25,000–26,000",
                  "WAFR / TA via ECSA | USD 19,000–20,000",
                  "Market View: 🟢 Firm on limited tonnage"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "USG — HANDY",
                "paragraphs": [
                  "Sentiment: FLAT / NEAR BOTTOM ↔️",
                  "The market remains flat with a slight downward tilt, although rates appear to be approaching a bottom.",
                  "Cargo volume has picked up, with more enquiries entering the market. However, vessel supply remains high relative to overall demand.",
                  "A large number of prompt spot vessels continues to cap rates and prevent any meaningful upward move.",
                  "Encouragingly, period demand for 2H September has increased, which could be an early indication of a change in market sentiment.",
                  "38K DWT Spot Guidance",
                  "Route | USD",
                  "TA / Cont | 15,000",
                  "TA / Med | 15,000",
                  "Intra-Americas | 13,000",
                  "WC — Sub Duration | 17,000",
                  "FH | 17,000",
                  "ECSA | 9,500",
                  "Market View: 🟡 Flat, but potentially forming a bottom"
                ]
              },
              {
                "name": "USG — SMX / UMX",
                "paragraphs": [
                  "Sentiment: POSITIVE 2H SEPTEMBER ↗️",
                  "The USG market started the week slowly due to UK holidays, resulting in limited activity.",
                  "The bid/offer spread remains wide. Owners are expecting the market to firm, while Charterers continue to resist higher numbers.",
                  "Petcoke demand remains strong, particularly towards East destinations and Turkey rather than India at present. Supply remains limited, with petcoke producers appearing relatively short, particularly for low-sulphur grades.",
                  "On the grain side, competition with Panamax tonnage ex USG remains challenging. There is a constant supply of beans, and any further congestion or reduction in the tonnage count from current levels would likely keep SGP–Japan above USD 30,000.",
                  "If fuel prices continue to climb, the spread versus Panamax should narrow, potentially resulting in more cargo being sold on Supra/Ultramax tonnage.",
                  "Benchmarks",
                  "Route | UMAX | SMAX",
                  "TA RV | 32,500 | 29,000",
                  "FH | 31,500 | 28,000",
                  "India | 36,000 | 31,000",
                  "WCCA | 32,000 | 29,000",
                  "Intra-USG | 23,500 | 21,000",
                  "ECSA | 23,000 | 20,000",
                  "Petcoke generally commands a premium. Short-duration / positioning requirements can achieve higher numbers.",
                  "Market View: 🟢 Positive outlook for 2H September, although activity remains measured"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA — HANDY",
                "paragraphs": [
                  "Sentiment: NEGATIVE 🔴",
                  "Overall sentiment remains negative. Cargo volume is still low and, given the current situation in the Black Sea, Owners continue to prefer staying away from the area. As a result, no meaningful improvement is expected for September.",
                  "The number of available vessels has continued to decline as Owners position away from the region. Current estimates show approximately:",
                  "• 23 vessels in East Med / Black Sea",
                  "• 13 vessels in West Med",
                  "The Ukraine situation remains unchanged, with no ships showing willingness to trade there. Grain is mainly coming from CVB, with the usual West Med run of approximately 30,000 MT at around USD 27 TCE 6,000 Canakkale on a small Handy.",
                  "From West Med, mineral cargoes to WAFR are being quoted around USD 16,000 APS for 35K DWT.",
                  "BSS 38K DWT Benchmark",
                  "Route | USD",
                  "BSEA / W Med — Canakkale | 10,500",
                  "BSEA / Cont | 10,000",
                  "BSEA / FEAST — Suez | 15,000",
                  "BSEA / FEAST — Cape | 14,000",
                  "BSEA / USG–USEC | 9,500",
                  "BSEA / USG–USEC — OHBS | 10,000",
                  "BSEA / USG–USEC — Cement | 11,500",
                  "BSEA / ECSA | 8,000",
                  "Market View: 🔴 Negative — low cargo volume and geopolitical risk"
                ]
              },
              {
                "name": "MED / BLACK SEA — SMX / UMX",
                "paragraphs": [
                  "Sentiment: FLAT / WAITING ↔️",
                  "The market remains largely unchanged from last week.",
                  "Few Owners are ballasting towards West Med, even on speculation without cargo behind them, due to the lack of demand in East Med.",
                  "The tonnage list nevertheless remains relatively tight at approximately 17 units. The market may only need a fresh round of grain cargoes to trigger another upward move.",
                  "BSS Imabari 63",
                  "Route | USD",
                  "EMED / WAFR Clinker — Non-HRA | 16,500",
                  "EMED / WAFR Clinker — HRA | 17,500",
                  "WMED / WAFR Clinker — Non-HRA | 19,500",
                  "WMED / WAFR Clinker — HRA | 20,500",
                  "EMED / USG — Clean Cargo | 12,500",
                  "EMED / USG — Cement | 14,000",
                  "EMED via CVB / TA Grain, Dely Canakkale | 16,500",
                  "EMED / FEAST via Goa | 21,500",
                  "Market View: 🟡 Flat, with upside potential if grain demand returns"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONTINENT / BALTIC — HANDY",
                "paragraphs": [
                  "Sentiment: SOFT / ILLIQUID ↔️",
                  "The week started slowly, with the Baltic market continuing to be heavily driven by Russian stems.",
                  "Little is visible on the forward curve at present. There remains a considerable gap between Owners' expectations for period business and what can actually be achieved on the first leg of a voyage.",
                  "Liquidity remains limited for prompt vessels, while ballasting to USEC currently does not make economic sense.",
                  "Market Activity",
                  "• Baltic → E Med scrap: high teens",
                  "• Baltic → WAFR: USD 17,000 HRA / USD 16,000 non-HRA",
                  "• Cont → USG clean: around USD 11,000",
                  "• Cont → ECSA: around USD 9,500",
                  "• Cont → Med clean: around USD 16,500",
                  "• Cont → SGP–Japan: around USD 16,000",
                  "The tonnage list remains very short at approximately 29 vessels, slightly down week-on-week.",
                  "BSS 38K DWT",
                  "Route | USD",
                  "CONT / MED Clean | 16,500",
                  "BALTIC / WAFR — Non-HRA | 16,000",
                  "BALTIC / WAFR — HRA | 17,000",
                  "Scrap Baltic / E Med | 18,000",
                  "CONT / USG | 11,000",
                  "CONT / ECSA | 9,500",
                  "CONT / SGP–JPN | 16,000",
                  "Market View: 🟡 Soft / Illiquid despite tight tonnage"
                ]
              },
              {
                "name": "CONTINENT / BALTIC — SMX / UMX",
                "paragraphs": [
                  "Sentiment: FIRMING ↗️",
                  "The Continent has seen somewhat better activity over the past few days, with additional scrap cargoes entering the market.",
                  "Current indications are around USD 24,000 for Ultramax and USD 22,000s for Supramax, helping the market maintain good levels.",
                  "BSS Imabari 63",
                  "Route | USD",
                  "CONT / Baltic–WAFR — Non-HRA | 21,000",
                  "CONT / Baltic–WAFR — HRA | 22,000",
                  "CONT / E Med Scrap | 24,000",
                  "CONT / USG Clean | 15,000",
                  "CONT / ECSA Clean | 14,000",
                  "Market View: 🟢 Firm / Improving"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "Sentiment: FIRMING / UNCERTAIN ↗️",
                  "The situation in the Black Sea remains broadly unchanged, with no trade recently heard ex Ukraine or Russia.",
                  "There have been reports of attacks on Baltic Russian ports, although so far no significant stoppage or direct impact on shipments has been heard.",
                  "The situation could result in higher AWRP, particularly if further disruption develops.",
                  "Handy",
                  "Owners remain firm on Med destinations, with indications around:",
                  "• Cont / Med: Owners around USD 14,000",
                  "• USG: Charterers targeting around USD 15,000 on 35K DWT",
                  "• FH: Around USD 18,000 for smaller Handies",
                  "Supra",
                  "• FH → Cont: Owners achieving around USD 25,000 DOP",
                  "• USG: Charterers targeting around USD 16,000 DOP Cont",
                  "Market View: 🟠 Uncertain, with potential upside from geopolitical disruption"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "📊 WEEKLY MARKET SCORECARD",
      "Region | Segment | Sentiment | Key Driver",
      "FEAST | SMX/UMX | 🟢 STEADY | Healthy demand / prompt tonnage absorbed",
      "SE ASIA | SMX/UMX | 🟢 FIRM / FLAT | Indo/India demand",
      "AG/WCI | SMX/UMX | 🟠 CAUTIOUS | Regional tensions / limited cargo",
      "SAFR | SMX/UMX | 🟢 FIRM | Prompt tonnage tight",
      "ECSA | Handy | 🟢 FIRMING | Growing cargo list / tight prompt supply",
      "ECSA | SMX/UMX | 🟠 SLIGHTLY SOFT | More tonnage / subdued spot",
      "WAFR | SMX/UMX | 🟢 FIRM | Lack of tonnage",
      "USG | Handy | 🟡 FLAT | High prompt supply",
      "USG | SMX/UMX | 🟢 POSITIVE | Petcoke / 2H Sep interest",
      "MED/BS | Handy | 🔴 NEGATIVE | Low cargo / Black Sea risk",
      "MED/BS | SMX/UMX | 🟡 FLAT | Tight tonnage, awaiting grain",
      "CONT/BALTIC | Handy | 🟡 SOFT | Low liquidity / Russian stems",
      "CONT/BALTIC | SMX/UMX | 🟢 FIRMING | More scrap cargo",
      "RUSSIA | All | 🟠 UNCERTAIN | Geopolitical risk",
      "🧭 OVERALL MARKET VIEW",
      "Atlantic",
      "The Atlantic picture remains mixed. South Africa and WAFR are firm on tight prompt tonnage, while ECSA Handy continues to show a constructive trend. ECSA SMX/UMX is softer in the immediate term, although strong FFA and increasing forward cargo discussions provide an underlying positive signal.",
      "USG is particularly interesting: Handy appears close to a bottom, while Supra/Ultramax fundamentals for 2H September remain constructive, supported by petcoke demand and potentially tighter tonnage.",
      "Pacific",
      "FEAST remains healthy and steady, with Charterers keen to cover early and prompt tonnage being absorbed quickly. SE Asia remains firm but has lost some of last week's momentum.",
      "Europe / Med",
      "The Continent is showing some improvement in the SMX/UMX segment on the back of increased scrap activity. The Baltic Handy market remains more subdued and illiquid.",
      "Med/Black Sea remains the weakest part of the map, with low cargo volumes and geopolitical concerns keeping Owners away despite relatively tight tonnage.",
      "Overall Weekly Bias: 🟢 STEADY / SLIGHTLY FIRM",
      "Strongest: SAFR / WAFR / FEAST",
      "Improving: ECSA Handy / CONT SMX-UMX / USG SMX-UMX",
      "Stable: SEASIA / FEAST",
      "Cautious: AG/WCI / ECSA SMX-UMX",
      "Weakest: MED/BLACK SEA Handy",
      "Key theme for the week:",
      "Prompt tonnage remains the decisive factor in the stronger basins, while FFA strength and increasing forward activity provide a positive underlying signal despite relatively subdued physical activity in parts of the Atlantic."
    ]
  },
  {
    "id": "dry-bulk-2026-08-26",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-08-26",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Outlook report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "📊 MARKET AT A GLANCE",
        "Region | Segment | Sentiment | Market View",
        "FEAST | SMX/UMX | 🟡 Mixed | Typhoon disruption supporting prompt tonnage, but activity remains uneven",
        "SEASIA | SMX/UMX | 🟢 Firm | Healthy Indo demand, strong Bangladesh activity and tight prompt tonnage",
        "AG/WCI | SMX/UMX | 🟡 Stable | Awaiting improved WCI cargo flow; Hormuz restrictions remain supportive",
        "SAFR | SMX/UMX | 🟡 Flat | Tight prompt supply but limited current activity",
        "ECSA | Handy | 🟢 Positive | Cargo list building while tonnage tightens",
        "ECSA | SMX/UMX | 🟡 Flat / Slightly Negative | More tonnage and softer short-term demand, but balance remains fragile",
        "WAFR | SMX/UMX | 🟠 Softening Risk | Cargo list shrinking while tonnage builds",
        "USG | Handy | 🟡 Flat | Weak grain demand and Panama costs limiting upside",
        "USG | SMX/UMX | 🟢 Bottoming / Firming | Rates appear to have found a floor; tonnage/cargo ratio supportive",
        "MED/BS | Handy | 🔴 Negative | Low cargo volumes and limited Black Sea activity",
        "MED/BS | SMX/UMX | 🔴 Soft | Stable tonnage list but very limited cargo",
        "CONT/BALTIC | Handy | 🟢 Positive | Cargo volumes improving and tonnage list tightening",
        "CONT/BALTIC | SMX/UMX | 🟢 Firming | Scrap demand pushing UMX rates higher",
        "RUSSIA | — | 🟠 Restricted | Black Sea activity remains absent; logistical constraints persist"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST – SMX / UMX",
                "paragraphs": [
                  "🟡 Sentiment: MIXED",
                  "The FEAST market remains somewhat uncertain. An increasing number of tonnages are being circulated, although ongoing typhoon-related disruption to vessel schedules in parts of China could create a shortage of prompt tonnage over the coming days.",
                  "Charterers are finding it increasingly challenging to secure suitable prompt candidates, particularly where dates are tight. NOPAC and backhaul activity remains relatively subdued, although there has been a noticeable increase in NOPAC/Bangladesh enquiries.",
                  "Period business has attracted greater interest, supported by the continued positive trend in the paper market.",
                  "Outlook: The market is expected to remain supported around recent last-done levels, with potential for rates to edge higher if prompt tonnage becomes increasingly constrained as the week progresses.",
                  "Fixtures Heard",
                  "• UMX CJK → NOPAC/Bangladesh: mid USD 21,000s",
                  "• UMX N. China → South: close to USD 16,000",
                  "• SMX N. China → Med via Goa: low USD 18,000s",
                  "BSS BS63 DOP CJK",
                  "Route | Rate",
                  "NOPAC | $19,250",
                  "Australia | $18,500",
                  "SEASIA | $16,500",
                  "CONT/MED | $19,000",
                  "WCCA | $19,000"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SEASIA – SMX / UMX",
                "paragraphs": [
                  "🟢 Sentiment: FIRM",
                  "The firmer tone seen last week has continued into this week. Indonesian rounds and dirty cargoes into Bangladesh remain the key drivers, while prompt tonnage is limited.",
                  "Dirty cargoes towards Bangladesh and India are achieving strong levels, with UMX business heard at very high USD 20,000s for prompt vessels opening near load ports.",
                  "An increasing number of ballasters from ECI are entering the market, although most remain somewhat forward. Bad weather in North Vietnam and the Philippines is causing additional delays and further restricting prompt tonnage.",
                  "Activity remains healthy, with owners showing a clear preference for backhaul employment. Short-period interest is also present.",
                  "Outlook: Supported. Tight prompt supply and healthy Indo/Bangladesh demand should keep the market firm.",
                  "Fixtures Heard",
                  "• UMX Indo → Australia RV: USD 21,000s",
                  "• UMX Singapore → Backhaul Continent: USD 15,000s",
                  "• UMX Indo → Indo/China: USD 20,000s",
                  "BSS BS63 DOP HK",
                  "Route | Rate",
                  "Indo / Thai | $17,500",
                  "Indo / China | $17,000",
                  "Indo / India | $23,500",
                  "Australia RV | $19,000",
                  "Singapore SMX | $18,500",
                  "Singapore UMX | $21,500"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI – SMX / UMX",
                "paragraphs": [
                  "🟡 Sentiment: STABLE",
                  "AG/WCI remains broadly stable, carrying forward the tone from last week.",
                  "With the WCI monsoon approaching its end, fresh cargo enquiry is expected to improve. Fujairah/Oman congestion remains a concern and continues to limit fresh cargo movements, while Salalah exports remain active, particularly for gypsum and limestone.",
                  "Strait of Hormuz transit remains restricted, with vessels willing to transit requiring a significant premium.",
                  "Imabari 63 DWT – Broker Guidance",
                  "Indicative bid vs. offer levels",
                  "Route | Bid | Offer",
                  "AG/WCI | $22,000 | $24,000",
                  "AG/ECI | $23,000 | $25,000",
                  "AG/FEAST | $22,000 | $24,000",
                  "WCI/FEAST | $14,000 | $16,000"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA – SMX / UMX",
                "paragraphs": [
                  "🟡 Sentiment: FLAT",
                  "South Africa has started the week quietly, with limited activity so far. However, the cargo list remains healthy, with several manganese ore and coal tenders already circulating and expected to generate more activity during the second half of the week.",
                  "Prompt tonnage remains limited, with approximately 7 prompt vessels on the coast and another 3–4 India ballasters.",
                  "The gap between bids and offers remains wide. UMX bids are around 22+220–23+230, against offers around 25+250 for fronthaul. Owners remain optimistic due to the tight prompt list, although forward pricing is showing some pressure as more tonnage competes for later dates.",
                  "Fixtures",
                  "• SMX RBAY → Pakistan: 20,500 + 210",
                  "• UMX RBAY → Dakar: 21,000 APS",
                  "BSI 63K DWT Benchmark",
                  "Route | Rate",
                  "SAFR / FH | $23,500 + $235K",
                  "SAFR / ECI | $24,000 + $240K",
                  "SAFR / BH | $21,000"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA – HANDY",
                "paragraphs": [
                  "🟢 Sentiment: POSITIVE",
                  "ECSA Handy continues to show a positive trend. The cargo list is building as additional stems enter the market, with approximately 30 cargoes currently counted.",
                  "At the same time, the tonnage list is tightening, with around 45 vessels opening over the next month in the South Atlantic.",
                  "Transatlantic and RECA/WCSA demand is also increasing, providing additional support to the larger Handy segment. SBM stems and 32/10 corn cargoes are becoming increasingly attractive for larger Handies.",
                  "BSS 37K Saiki – Route Guidance",
                  "Route | Rate",
                  "ECSA / TA | $22,500",
                  "ECSA / Spore–Japan | $20,500",
                  "UPR / South Africa | $22,500",
                  "ECSA Coastal S. Brazil | $16,500",
                  "ECSA Coastal N. Brazil | $18,500"
                ]
              },
              {
                "name": "ECSA – SMX / UMX",
                "paragraphs": [
                  "🟡 Sentiment: FLAT → SLIGHTLY NEGATIVE",
                  "ECSA has started slowly, with demand across most routes slightly below recent levels. Transatlantic demand remains stronger than fronthaul, however.",
                  "Seasonality is pushing more origin cargo towards North Brazil, while TA destinations remain spread across Continent and Mediterranean. China continues to dominate the fronthaul destination mix.",
                  "Traders are increasingly looking for UMAX vessels for PMX cargoes as the spread widens, although this has not yet translated into stronger UMAX rates.",
                  "On the supply side, ECSA committed tonnage remains relatively low, but more vessels are now available on the coast. Increasing numbers of WAFR and Cont/Med ballasters are also expected to put some pressure on the North Brazil spot market.",
                  "FFA is slightly positive week-on-week. Intraday volatility remains, but overall levels are healthy and the 2026 curve remains positive.",
                  "Outlook: Flat to slightly negative in the short term, but the balance remains fragile and could turn quickly. Given the wider Atlantic dynamics, sentiment could improve towards the end of the period.",
                  "Broker Rates & Guidance",
                  "Route | Imabari 63 | T58",
                  "RECA TA | $32,500 | $29,000",
                  "SBRAZ TA | $31,500 | $28,000",
                  "NBRAZ TA | $32,000 | $28,800",
                  "SBRAZ FH | $19,250 + 925K | $17,000 + 700K"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR – SMX / UMX",
                "paragraphs": [
                  "🟠 Sentiment: SOFTENING RISK",
                  "WAFR has experienced a very slow start to the week. The tonnage list is getting longer while the cargo list is becoming noticeably shorter.",
                  "Current levels remain strong, but the present supply/demand balance suggests that the market may need to adjust if activity does not improve over the coming days.",
                  "BSS UMX Guidance",
                  "Route | Rate",
                  "WAFR TA – Short Duration | $23,000–24,000",
                  "WAFR FH → India | $29,000–30,000",
                  "WAFR FH → China | $26,000–27,000",
                  "WAFR FH via ECSA | $25,000–26,000",
                  "WAFR TA via ECSA | $19,000–20,000"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "USG – HANDY",
                "paragraphs": [
                  "🟡 Sentiment: FLAT",
                  "The USG Handy market remains flat, with demand still weak and expected grain demand yet to materialise.",
                  "High auction prices for the Panama Canal are also negatively affecting grain exports towards the US West Coast.",
                  "Spot Guidance – 38K DWT",
                  "Route | Rate",
                  "TA / Cont | $15,000",
                  "TA / Med | $16,000",
                  "Intra-Americas | $13,000",
                  "USG / WC | $17,000 sub-duration",
                  "FH | $17,000",
                  "ECSA | $11,000"
                ]
              },
              {
                "name": "USG – SMX / UMX",
                "paragraphs": [
                  "🟢 Sentiment: BOTTOMING / FIRMING",
                  "The USG market has shown signs of bottoming over the past seven days. Rates have stopped declining and appear to have found some ground.",
                  "Owners have increased offers, in some cases aggressively, although charterers are currently resisting these higher ideas.",
                  "The vessel/cargo ratio currently stands at approximately 35 vessels versus 23 cargoes, indicating a clear tightening trend in tonnage availability.",
                  "Tropical Atlantic demand is particularly supportive. India petcoke volumes are not as strong as they were in July, while increasing cargoes are moving towards East Mediterranean/Turkey, partly reflecting reduced Russian Black Sea availability and Turkey's need to source alternative solid fuels.",
                  "Grain demand remains around average, but high freight levels are preventing some deals from being concluded.",
                  "Benchmarks",
                  "Route | UMAX | SMX",
                  "TARV | $31,500 | $28,000",
                  "FH | $30,000 | $26,500",
                  "India | $35,000 | $30,000",
                  "WCCA | $31,000 | $27,500",
                  "Intra-USG | $23,500 | $21,000",
                  "ECSA | $23,000 | $20,000",
                  "Petcoke attracts a premium; short-duration/sub-positioning can command higher levels."
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA – HANDY",
                "paragraphs": [
                  "🔴 Sentiment: NEGATIVE",
                  "The Handy market has remained flat/depressed for at least one month.",
                  "Grain activity is largely limited to the CVB area. Vessels remain reluctant to load from Ukraine, while only a limited number of owners are willing to call Russia.",
                  "The usual CVB/Algeria 30,000 MT 10% business is being fixed around $27 TCE, equivalent to approximately $7,000 Canakkale on a small Handy.",
                  "East Mediterranean activity remains limited, with salt cargoes to USEC bidding around $11,500 APS against offers around $13,500. West Mediterranean mineral demand remains similarly subdued.",
                  "Fixtures",
                  "• 43K DWT Central Med → Algeria/ECSA fertilizer: $9,000 APS",
                  "• 40K DWT East Med → East Med/USG cement: around $12,000 APS",
                  "BSS 38K DWT",
                  "Route | Rate",
                  "BSEA / W Med – Canakkale | $10,500",
                  "BSEA / Cont | $10,000",
                  "BSEA / FEAST via Suez | $15,000",
                  "BSEA / FEAST via Cape | $14,000",
                  "BSEA / USG–USEC | $9,500",
                  "BSEA / USG–USEC OHBS | $10,000",
                  "BSEA / USG–USEC Cement | $11,500",
                  "BSEA / ECSA | $7,500",
                  "Tonnage remains broadly unchanged for the next three weeks, with approximately 25 vessels in East Med/Black Sea and 20 vessels in West Med.",
                  "Outlook: Still negative. September may bring increased activity, but a meaningful recovery will likely take time."
                ]
              },
              {
                "name": "MED / BLACK SEA – SMX / UMX",
                "paragraphs": [
                  "🔴 Sentiment: SOFT",
                  "The market is considerably quieter than during the previous two weeks. The tonnage list is stable at around 21 units, but cargo availability remains extremely limited.",
                  "This imbalance is prompting some owners to ballast west on speculation.",
                  "Only limited business has been heard, including a UMX fixing salt to USEC at approximately $14,000–15,000 TCE.",
                  "BSS Imabari 63",
                  "Route | Rate",
                  "EMED / WAFR Clinker – non-HRA | $15,500",
                  "EMED / WAFR Clinker – HRA | $16,500",
                  "WMED / WAFR Clinker – non-HRA | $18,000",
                  "WMED / WAFR Clinker – HRA | $19,000",
                  "EMED / USG Clean Cargo | $12,500",
                  "EMED / USG Cement | $14,000",
                  "EMED via CVB / TA Grain, Dely Canakkale | $17,000",
                  "EMED FH / FEAST via Goa | $21,500"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONTINENT / BALTIC – HANDY",
                "paragraphs": [
                  "🟢 Sentiment: POSITIVE",
                  "The market continues in a positive direction, broadly similar to last week.",
                  "The Baltic continues to see a healthy number of requirements, although activity remains heavily influenced by Russian-origin cargoes. Grain demand is also present, while several scrap stems are expected to enter the market during the first week of September.",
                  "Owners are currently looking for around $18,000–19,000 for Baltic scrap to East Mediterranean.",
                  "In the Continent, cargo activity is also improving. Short grain runs to Morocco are being rated in the low teens, while a mid-size Handy has reportedly concluded a West Africa non-HRA trip around $17,000.",
                  "Backhaul to USG has corrected to around $10,000–11,000, compared with $12,000–13,000 last week. CONT/ECSA remains around $9,500, although little activity has been seen in this direction so far.",
                  "The tonnage list has decreased by 8 vessels week-on-week to 32 vessels over the next 30 days.",
                  "Market Benchmarks – 38K DWT",
                  "Route | Rate",
                  "CONT / MED Clean | $16,500",
                  "BALTIC / WAFR non-HRA | $16,000",
                  "BALTIC / WAFR HRA | $17,000",
                  "Baltic Scrap / E Med | $18,000",
                  "CONT / USG | $11,000",
                  "CONT / ECSA | $9,500",
                  "CONT / SGP–JPN | $16,000"
                ]
              },
              {
                "name": "CONTINENT / BALTIC – SMX / UMX",
                "paragraphs": [
                  "🟢 Sentiment: FIRMING",
                  "The Continent market is showing a gradual improvement.",
                  "An increasing number of scrap cargoes are entering the market and UMX vessels are now fixing around $23,000–24,000, approximately $2,000 higher than levels seen in recent weeks.",
                  "BSS Imabari 63",
                  "Route | Rate",
                  "CONT / BALTIC → WAFR non-HRA | $21,000",
                  "CONT / BALTIC → WAFR HRA | $22,000",
                  "CONT / E Med Scrap | $23,500",
                  "CONT / USG Clean | $15,000",
                  "CONT / ECSA Clean | $14,000"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "🟠 Sentiment: RESTRICTED / LIMITED",
                  "There remains no meaningful activity in the Black Sea.",
                  "A significant part of the Ukrainian-origin trade has been redirected towards Constanta, while Russian-origin cargoes are increasingly being handled through Baltic Russian ports. However, Baltic Russian ports do not have the same capacity, creating additional logistical constraints.",
                  "Handy",
                  "• Baltic → FH via Goa: around $19,000",
                  "• Baltic → WAFR HRA: around $20,000 on 35K DWT",
                  "Supramax",
                  "• FH: around $24,000 DOP Gibraltar",
                  "• EAFR: Owners around $27,000 DOP Cont vs charterer ideas around $24,500"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "🔎 OVERALL MARKET VIEW",
      "ATLANTIC",
      "The Atlantic picture remains mixed, with clear strength in selected areas but increasing signs of supply building elsewhere.",
      "ECSA Handy and Cont/Baltic Handy remain the strongest areas, supported by healthy cargo lists and tightening tonnage. Cont/Baltic SMX/UMX is also improving, driven particularly by scrap demand.",
      "ECSA SMX/UMX has softened slightly as more tonnage becomes available, while WAFR is showing the clearest risk of correction as its cargo list shrinks.",
      "USG SMX/UMX appears to have found a floor, with the tonnage/cargo balance increasingly supportive. USG Handy, however, remains constrained by weak grain demand.",
      "PACIFIC / INDIAN OCEAN",
      "FEAST remains uncertain but supported by weather-related disruption and tighter prompt tonnage. SEASIA is currently one of the firmest markets, with Indo rounds, Bangladesh dirty cargoes and limited prompt supply driving strong levels.",
      "AG/WCI remains stable, with potential upside if WCI cargo enquiry improves following the monsoon.",
      "MED / BLACK SEA",
      "The region remains the weakest part of the market. Cargo volumes are limited, Ukrainian and Russian trades remain disrupted, and tonnage is increasingly willing to ballast west.",
      "🧭 MARKET BIAS",
      "STRONGEST:",
      "🟢 SEASIA SMX/UMX",
      "🟢 ECSA Handy",
      "🟢 CONT/BALTIC Handy",
      "🟢 CONT/BALTIC SMX/UMX",
      "STABLE / BALANCED:",
      "🟡 FEAST SMX/UMX",
      "🟡 AG/WCI",
      "🟡 SAFR SMX/UMX",
      "🟡 USG Handy",
      "WATCH FOR A TURN:",
      "🟢 USG SMX/UMX — possible bottoming",
      "🟠 WAFR SMX/UMX — increasing correction risk",
      "🟡 ECSA SMX/UMX — fragile balance, short-term pressure",
      "WEAKEST:",
      "🔴 MED/BLACK SEA Handy",
      "🔴 MED/BLACK SEA SMX/UMX",
      "📌 KEY TAKEAWAYS THIS WEEK",
      "1. | SEASIA remains the clear Pacific/Indian Ocean bright spot, supported by Indo rounds, Bangladesh demand and tight prompt tonnage.",
      "2. | Typhoon disruption in China is providing temporary support to FEAST, particularly for prompt tonnage.",
      "3. | ECSA Handy continues to outperform, with cargo growth and tightening tonnage.",
      "4. | Cont/Baltic is strengthening, with scrap demand pushing UMX rates higher.",
      "5. | WAFR is the main Atlantic market to watch for correction, as tonnage increases while cargo availability declines.",
      "6. | USG SMX/UMX appears to have bottomed, although charterers remain resistant to the higher owner ideas.",
      "7. | MED/Black Sea remains structurally weak, with geopolitical and logistical restrictions continuing to suppress activity.",
      "8. | Overall, the market remains well supported in selected basins, but increasingly two-speed, with tonnage availability and cargo flow determining direction on a regional basis."
    ]
  },
  {
    "id": "dry-bulk-2026-08-19",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-08-19",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Outlook report text",
      "importedDate": "2026-09-09"
    },
    "summary": "The market is showing a mixed but generally constructive bias heading into September. The strongest areas are SEASIA, SAFR, WAFR and the ECSA Atlantic, where tightening prompt tonnage is beginning to support rates.",
    "overview": {
      "paragraphs": [
        "MARKET AT A GLANCE",
        "Region | Segment | Sentiment | Key Driver",
        "FEAST | SMX / UMX | 🟡 FLAT | Active demand, but slightly longer tonnage list",
        "SEASIA | SMX / UMX | 🟢 POSITIVE | Strong regional demand and tightening prompt tonnage",
        "AG / WCI | SMX / UMX | 🟡 STABLE | Low cargo and tonnage keeping market balanced",
        "SAFR | SMX / UMX | 🟢 FIRMING | September cargo building and thinning prompt tonnage",
        "ECSA | Handy | 🟢 POSITIVE | Stronger TA activity and shrinking tonnage",
        "ECSA | SMX / UMX | 🟢 FLAT → POSITIVE | Atlantic demand improving and lower available supply",
        "WAFR | SMX / UMX | 🟢 FIRM | Tight tonnage, particularly linked to ECSA",
        "USG | Handy | 🔴 BEARISH | Cargo volume remains insufficient despite lower tonnage",
        "USG | SMX / UMX | 🔴 SOFTENING | August tonnage overhang and weaker petcoke activity",
        "MED / BSEA | Handy | 🔴 NEGATIVE | Softer grain market and increasing tonnage",
        "MED / BSEA | SMX / UMX | 🟠 SOFT | Lighter demand with stable tonnage",
        "CONT / BALTIC | Handy | 🟢 FIRM | Strong Baltic market and September optimism",
        "CONT / BALTIC | SMX / UMX | 🟡 QUIET / FIRM | Limited cargo but healthy voyage spreads",
        "RUSSIA | All | 🟠 UNCERTAIN | Black Sea operational disruption and shifting load options",
        "Overall Market View",
        "The market is showing a mixed but generally constructive bias heading into September. The strongest areas are SEASIA, SAFR, WAFR and the ECSA Atlantic, where tightening prompt tonnage is beginning to support rates.",
        "The FEAST and AG/WCI markets remain balanced, while the USG and MED/BSEA continue to face pressure from insufficient cargo volume. In the Continent/Baltic, owners are increasingly reluctant to commit to long voyages as expectations for a stronger September market build."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST – SMX / UMX",
                "paragraphs": [
                  "🟡 Sentiment: FLAT",
                  "The FEAST market has remained active, with limited prompt tonnage available against increasing cargo demand. Owners are showing a stronger preference for backhaul employment, creating some upward pressure on NOPAC rates, particularly for prompt cargo.",
                  "However, the overall market remains flat, as the tonnage list has lengthened slightly week-on-week.",
                  "Key Fixtures",
                  "• UMX open North China → Bangladesh, slag: around USD 20,500",
                  "• SMX open North China → WAFR, general cargo: USD 17,000",
                  "• SMX open South China → EAFR, general cargo: mid USD 17,000s",
                  "• SMX open Japan → South China: close to USD 17,000",
                  "BSS BS63 DOP CJK",
                  "Route | Rate",
                  "NOPAC | USD 18,250",
                  "AUS | USD 18,000",
                  "SEASIA | USD 16,500",
                  "CONT / MED | USD 17,500",
                  "WCCA | USD 17,500",
                  "Market bias: 🟡 Balanced, with slight upside for prompt backhaul positions."
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SEASIA – SMX / UMX",
                "paragraphs": [
                  "🟢 Sentiment: POSITIVE",
                  "SEASIA has gained momentum, driven primarily by stronger intra-regional demand and a tightening prompt vessel position.",
                  "Indo/India employment remains a major driver, with vessels opening in SEASIA fixing in the mid/high USD 20,000s for India/Bangladesh directions. Australian demand has also picked up, with UMX vessels now fixing in the low USD 20,000s for Australian round voyages.",
                  "The stronger cargo flow from Vietnam and South China seen last week has continued. Owners continue to demonstrate a clear preference for backhaul employment, while short-period interest remains present, with SMXs rating in the high teens and UMXs in the low USD 20,000s.",
                  "Key Fixtures",
                  "• SMX open Vietnam/South China → Oman: USD 23,000s",
                  "• UMX open Singapore → Australian round: USD 22,000",
                  "• UMX open Indonesia → Australian round: USD 21,000",
                  "• UMX open Indonesia → Indo/SEASIA: USD 22,000",
                  "BSS BS63 DOP HK",
                  "Route | Rate",
                  "Indo / Thai | USD 17,000",
                  "Indo / China | USD 16,500",
                  "Indo / India | USD 22,000",
                  "Aus Round | USD 18,500",
                  "Spore SMX | USD 18,000",
                  "Spore UMX | USD 21,000",
                  "Market bias: 🟢 Positive — tightening prompt tonnage and improving cargo demand."
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI – SMX / UMX",
                "paragraphs": [
                  "🟡 Sentiment: STABLE",
                  "AG/WCI remained stable as both supply and demand stayed relatively low. Fresh cargo remains limited, but the tonnage count is also low, keeping the market balanced.",
                  "Cargoes towards SEASIA and FEAST are being covered in the USD 10,000s on Supramaxes. The WCI monsoon is moving into its final phase and weather conditions are already improving.",
                  "Oman and East UAE ports continue to experience congestion, while market participants remain cautious following the end of the ceasefire and await further developments.",
                  "ECI continues to show resilience. Indonesian cargoes remain the main source of activity, while steady domestic coastal movements are keeping prompt tonnage employed and limiting available supply.",
                  "Imabari 63 DWT – Indicative Bid / Offer",
                  "Route | Bid | Offer",
                  "AG / WCI | $22,000 | $24,000",
                  "AG / ECI | $23,000 | $25,000",
                  "AG / FEAST | $22,000 | $24,000",
                  "WCI / FEAST | $14,000 | $16,000",
                  "Short Period AG | $19,000 | $21,000",
                  "Short Period WCI | $18,000 | $20,000",
                  "Tonnage Count",
                  "Area | 10 Days | WoW | 30 Days | WoW",
                  "AG | 3 | ↓ 4 | 4 | ↓ 7",
                  "WCI | 26 | ↓ 30 | 32 | ↓ 38",
                  "RSEA | 4 | ↓ 7 | 6 | ↓ 11",
                  "Market bias: 🟡 Stable to slightly firm due to tightening tonnage."
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA – SMX / UMX",
                "paragraphs": [
                  "🟢 Sentiment: FINDING ITS FOOTING / FIRMING",
                  "South Africa has firmed through the week, with activity picking up across both manganese ore and coal.",
                  "The September cargo list continues to build, including several prompt Pakistan coal runs and backhaul business. Fresh manganese ore and coal tenders have provided additional support.",
                  "At the same time, prompt tonnage has continued to thin, improving the supply/demand balance. The market appears to have found a floor, with early-September cargoes beginning to outweigh available tonnage.",
                  "Owners positioning for September are showing increasing optimism.",
                  "Fixtures",
                  "• UMX eco: 25,000 + 250K APS, Richards Bay/Pakistan",
                  "• UMX: 23,500 + 235K APS, Richards Bay/Sri Lanka",
                  "• UMX eco: 25,000 + 250K APS, S. Bay/China",
                  "• 2 × UMX: USD 21,000 APS, SAFR/CONT",
                  "BSI 63K DWT Benchmark",
                  "Route | Benchmark",
                  "SAFR / FEAST | $23,000 + $230K",
                  "SAFR / ECI | $24,000 + $240K",
                  "SAFR / Backhaul | $21,000",
                  "Market bias: 🟢 Firming — September demand is beginning to outweigh supply."
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA HANDY",
                "paragraphs": [
                  "🟢 Sentiment: POSITIVE",
                  "ECSA Handy continues to show a positive trend, with activity picking up noticeably, particularly in the Transatlantic market from both South and North Brazil.",
                  "Improved cargo flow is absorbing tonnage and the available vessel list is shrinking, with approximately 45 vessels opening over the next month.",
                  "BSS 37K Saiki",
                  "Route | Rate",
                  "ECSA / TA | $23,000",
                  "ECSA / Spore–Japan | $20,500",
                  "UPR / South Africa | $22,500",
                  "ECSA Coastal S. Brazil | $16,500",
                  "ECSA Coastal N. Brazil | $18,500",
                  "Market bias: 🟢 Positive — improving Atlantic demand and declining tonnage."
                ]
              },
              {
                "name": "ECSA – SMX / UMX",
                "paragraphs": [
                  "🟢 Sentiment: FLAT → POSITIVE",
                  "ECSA started the week slowly but on a firm footing. FH demand is slightly better, although still below the levels seen over the previous couple of months. TA demand is improving, particularly ex-North Brazil, making the Atlantic market more liquid.",
                  "The limited FH enquiry is concentrated around SEASIA, while Middle East employment remains difficult to establish.",
                  "On the supply side, committed ECSA tonnage remains low. Supply from WAFR and CONT/MED ballasters has also decreased, resulting in less overall availability.",
                  "FFA levels are relatively flat week-on-week, although intraday volatility remains. The forward curve remains positive.",
                  "Overall, the market is flat to positive, with the Atlantic currently stronger than FH. The balance remains tight enough that the market could turn quickly, particularly heading into early/mid-September.",
                  "Broker Rates & Guidance",
                  "Route | I63 | T58",
                  "RECA TA | $33,500 | $29,500",
                  "SBRAZ TA | $32,500 | $28,500",
                  "NBRAZ TA | $32,500 | $29,000",
                  "SBRAZ FH | $19,500 + 950K | $17,500 + 750K",
                  "Market bias: 🟢 Slightly positive, led by Atlantic employment."
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR – SMX / UMX",
                "paragraphs": [
                  "🟢 Sentiment: FIRM",
                  "As anticipated last week, tight tonnage is once again supporting very firm levels in the region.",
                  "The main driver remains the lack of tonnage available for ECSA-linked employment, which is keeping owners' ideas elevated.",
                  "Current Guidance",
                  "Route | Guidance",
                  "WAFR TA – Short Duration | $25,000–26,000",
                  "WAFR FH → India | $30,000–31,000",
                  "WAFR FH → China | $27,000–28,000",
                  "WAFR FH via ECSA | $25,000–26,000",
                  "WAFR TA via ECSA | $22,000–23,000",
                  "Market bias: 🟢 Firm — tight tonnage remains the dominant factor."
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "USG HANDY",
                "paragraphs": [
                  "🔴 Sentiment: BEARISH",
                  "Prompt tonnage is slowly being cleared, but fresh cargo remains limited. New orders are beginning to appear, although predominantly for 25 August onwards.",
                  "The tonnage list has declined by approximately 15 vessels week-on-week, to around 60 vessels opening over the next 35 days.",
                  "Despite the reduction in tonnage, cargo volume remains insufficient to materially tighten the market. As a result, the underlying sentiment remains bearish.",
                  "BSS 38K DWT Spot Levels",
                  "Route | Rate",
                  "TA / CONT | $15,000",
                  "TA / MED | $16,000",
                  "Intra-Americas | $13,000",
                  "USG / WC | $17,000 – sub duration",
                  "FH | $17,000",
                  "ECSA | $11,000",
                  "Market bias: 🔴 Bearish — supply is declining, but not quickly enough relative to demand."
                ]
              },
              {
                "name": "USG – SMX / UMX",
                "paragraphs": [
                  "🔴 Sentiment: SOFTENING",
                  "The USG market has shown limited excitement over the past seven days, with the overall trend clearly pointing lower, albeit without a major correction.",
                  "Activity appears below average, while operators are increasingly preferring to employ their own tonnage against their own cargo rather than pursue arbitrage opportunities.",
                  "The reported cargo-to-vessel ratio is approximately 40:19, but most cargoes being marketed are for September dates, whereas the tonnage list contains a significant amount of August-position tonnage. This creates a negative near-term setup for rates.",
                  "Petcoke is also no longer providing the same support seen earlier in August. At present there are no petcoke-to-India cargoes in the list, despite this route normally being one of the major USG market drivers.",
                  "Grain activity is also below average.",
                  "Benchmarks",
                  "Route | UMX | SMX",
                  "TARV | $30,000 | $27,000",
                  "FH | $28,000 | $26,000",
                  "India | $35,000 | $30,000",
                  "WCCA | $31,000 | $27,500",
                  "Intra-USG | $23,500 | $21,000",
                  "ECSA | $23,000 | $20,000",
                  "Petcoke typically commands a premium; India levels may improve with prompt/sub-position tonnage.",
                  "Market bias: 🔴 Soft — August tonnage overhang and weaker petcoke demand."
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA – HANDY",
                "paragraphs": [
                  "🔴 Sentiment: NEGATIVE",
                  "The Med/Black Sea Handy market has started to soften since the middle/end of last week.",
                  "Grain cargoes are mainly originating from CVB, where competition is becoming increasingly difficult. CVB/Algeria is currently indicated around $25,000–25,500, basis 1.25% TCE $5,500–6,000 on smaller Handies.",
                  "In the East Med, Turkish cement to NCSA is holding around $10,000 APS on 35K DWT, while minerals from Greece to Aragua are bidding around $9,000 APS versus $10,000 APS.",
                  "West Med continues to suffer from a lack of cargo, with some owners considering ballasting toward North Brazil, where conditions remain stronger.",
                  "Fixtures",
                  "• 40K DWT open South Spain → Algeria/ECSA clinker: $14,500 APS + $17K after 35 days",
                  "• 34K DWT open East Med → Greece/US: $8,500 APS",
                  "• 35K DWT open Morocco → Black Sea fertilizer: around $12,000 APS",
                  "• 36K DWT open West Med → WAFR: $13,500 APS",
                  "BSS 38K DWT",
                  "Route | Rate",
                  "BSEA / WMED – Canakkale | $10,500",
                  "BSEA / CONT | $10,000",
                  "BSEA / FEAST – Suez | $15,000",
                  "BSEA / FEAST – Cape | $14,000",
                  "BSEA / USG–USEC | $9,500",
                  "BSEA / USG–USEC – OHBS | $10,000",
                  "BSEA / USG–USEC – Cement | $11,000",
                  "BSEA / ECSA | $7,500",
                  "Tonnage has increased, with approximately 29 vessels in East Med/Black Sea and 19 vessels in West Med over the next three weeks.",
                  "Holiday seasonality remains a factor, while the continuing Ukraine/Russia conflict makes a meaningful recovery in grain volumes difficult to foresee.",
                  "Market bias: 🔴 Negative — softer demand and increasing tonnage point to further pressure through the remainder of August and into early September."
                ]
              },
              {
                "name": "MED / BLACK SEA – SMX / UMX",
                "paragraphs": [
                  "🟠 Sentiment: SOFTENING",
                  "The market softened slightly from last week.",
                  "UMX fixtures to USEC for salt are being heard in the USD 15,000s, while grain cargoes to the Continent are bidding around USD 18,000 DOP Marmara for UMX.",
                  "The tonnage list remains broadly stable at approximately 23–24 units, while demand is somewhat lighter, with only around 5–6 cargoes identified for the next two weeks.",
                  "BSS Imabari 63",
                  "Route | Rate",
                  "EMED / WAFR Clinker – Non-HRA | $16,500",
                  "EMED / WAFR Clinker – HRA | $17,500",
                  "WMED / WAFR Clinker – Non-HRA | $17,000",
                  "WMED / WAFR Clinker – HRA | $18,000",
                  "EMED / USG Clean Cargo | $13,500",
                  "EMED / USG Cement | $15,000",
                  "EMED via CVB TA Grain – Dely Canakkale | $17,000",
                  "EMED FH / FEAST via Goa | $22,500",
                  "Market bias: 🟠 Softening — stable supply but lighter demand."
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONTINENT / BALTIC – HANDY",
                "paragraphs": [
                  "🟢 Sentiment: FIRM",
                  "The market had a slightly slower start to the week, but levels remain firm, supported by a strong Baltic market.",
                  "Owners are increasingly expecting a strong September and are therefore reluctant to commit tonnage to longer voyages such as WAFR, preferring to remain positioned in the region.",
                  "Baltic scrap has been fixed around the high USD 10,000s to East Med, while WAFR trips are rated around the mid USD 10,000s. ECSA activity remains limited, although levels are expected around $9,500.",
                  "The tonnage list increased week-on-week to approximately 40 vessels opening over the next 30 days, while the cargo list is also increasing, largely due to Russia-related Baltic business.",
                  "BSS 38K DWT",
                  "Route | Rate",
                  "CONT / MED Clean | $15,500",
                  "BALTIC / WAFR Non-HRA | $16,000",
                  "BALTIC / WAFR HRA | $17,000",
                  "Baltic Scrap / E Med | $18,000",
                  "CONT / USG | $12,000",
                  "CONT / ECSA | $9,500",
                  "CONT / SGP–JPN | $15,000",
                  "Market bias: 🟢 Firm — strong Baltic fundamentals and September positioning support owners."
                ]
              },
              {
                "name": "CONTINENT / BALTIC – SMX / UMX",
                "paragraphs": [
                  "🟡 Sentiment: QUIET / FIRM",
                  "The Continent remains relatively quiet, with limited fresh cargo. Grain business to South Africa is being discussed around a USD 20,000 vs USD 24,000 Skaw spread for UMX, while some scrap voyages are being quoted at low USD 20,000 TCE levels on UMX.",
                  "BSS Imabari 63",
                  "Route | Rate",
                  "CONT / BALTIC–WAFR Non-HRA | $18,000 Skaw",
                  "CONT / BALTIC–WAFR HRA | $19,500 Skaw",
                  "CONT / E MED Scrap | $22,000",
                  "CONT / USG Clean | $13,500",
                  "CONT / ECSA Clean | $12,500",
                  "Market bias: 🟡 Quiet but supported by firm owner expectations."
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "🟠 Sentiment: UNCERTAIN / VOLATILE",
                  "Tensions in the Black Sea have increased further.",
                  "On the Russian side, operations at Novorossiysk and Taman have been suspended. On the Ukrainian side, vessels are reportedly able to proceed with loading under escort arrangements.",
                  "In the Baltic, some charterers continue attempting to convert loading ports from the Black Sea to Baltic alternatives, although this is not happening consistently and only a limited number of vessels have successfully managed the switch.",
                  "Current Indications",
                  "Supramax",
                  "• W. Med → E. Africa: around $20,000 DOP",
                  "• W. Med → Goa: mid-$20,000s",
                  "Handy",
                  "• CONT FH: around $15,000 DOP",
                  "• CONT → WAFR: around $18,000 DOP HRA",
                  "The Russia/Ukraine situation continues to create significant uncertainty around available cargo, vessel positioning and routing decisions."
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "MARKET CONCLUSION",
      "🟢 STRONGER MARKETS",
      "SEASIA | SAFR | WAFR | ECSA TA | CONT/BALTIC",
      "These regions are showing the clearest signs of tightening. The common theme is declining prompt availability combined with improving September demand.",
      "🟡 BALANCED MARKETS",
      "FEAST | AG/WCI | CONT/BALTIC SMX/UMX",
      "Supply and demand remain relatively balanced. FEAST has some upside from backhaul preference, while AG/WCI is being kept in check by low activity on both sides.",
      "🔴 WEAKER MARKETS",
      "USG | MED/BSEA",
      "Both regions continue to struggle with insufficient cargo against available tonnage. USG is particularly exposed to the August tonnage overhang, while MED/BSEA is being affected by weak grain demand and geopolitical uncertainty.",
      "SEPTEMBER OUTLOOK",
      "The key theme emerging across the market is positioning for September.",
      "Owners in several regions are becoming increasingly reluctant to fix longer voyages at current levels, particularly where they believe local fundamentals are tightening. This is most evident in CONT/BALTIC, SAFR and ECSA.",
      "The market therefore enters the second half of August with a divided picture:",
      "Atlantic: 🟢 Improving",
      "SEASIA: 🟢 Firming",
      "SAFR: 🟢 Firming",
      "FEAST: 🟡 Flat",
      "AG/WCI: 🟡 Balanced",
      "USG: 🔴 Under pressure",
      "MED/BSEA: 🔴 Softening",
      "Overall Bias: 🟢 SLIGHTLY POSITIVE INTO SEPTEMBER",
      "The balance remains fragile, however. A sustained increase in cargo volumes could quickly tighten tonnage in the stronger regions, while a failure of September demand to materialise would leave the softer markets vulnerable to further rate erosion."
    ]
  },
  {
    "id": "dry-bulk-2026-08-12",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-08-12",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Outlook report text",
      "importedDate": "2026-09-09",
      "dateNote": "Report dated 12 August 2026; email sent on 13 August 2026."
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "weekly market overview",
        "market snapshot",
        "region | segment | sentiment | key takeaway",
        "feast | smx / umx | 🟢 firming | cargo enquiries improving and prompt tonnage tightening",
        "seasia | smx / umx | 🟢 firming | better cargo flow and stronger period interest",
        "ag / wci | smx / umx | 🟢 slightly firm | prompt tonnage well employed despite subdued exports",
        "south africa | smx / umx | ⚪ balanced | more cargo, but sufficient tonnage limits upside",
        "ecsa | handy | ⚪ flat | both cargo and tonnage lists remain limited",
        "ecsa | smx / umx | 🟢 flat → slightly positive | atlantic demand healthier than fh activity",
        "wafr | smx / umx | ⚪ quiet / firm | slow activity but tight tonnage could quickly support rates",
        "usg | handy | 🔴 bearish | cargo volumes remain insufficient despite lower tonnage",
        "usg | smx / umx | ⚪ stable | balanced market with normal core cargo flow",
        "med / bsea | handy | 🔴 negative | black sea situation continues to weigh on sentiment",
        "med / bsea | smx / umx | 🟠 softening | longer tonnage list and weaker clinker demand",
        "cont / baltic | handy | 🟢 firm | strong baltic market and grain demand",
        "cont / baltic | smx / umx | ⚪ quiet | limited demand with vessels approaching open dates",
        "russia | — | ⚪ unchanged | very limited activity; geopolitical/logistical uncertainty remains"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "feast — smx / umx",
                "paragraphs": [
                  "🟢 sentiment: firming up",
                  "the feast market appears to be turning firmer. cargo enquiries have increased for 20 august onwards, while the available tonnage list continues to shorten week-on-week.",
                  "for nopac rv, an ultramax open in china/south korea was reportedly fixed around $18,000, approximately $1,000 above levels seen early last week. backhaul rates have also improved by around $500 week-on-week.",
                  "the combination of a tightening tonnage position and improving cargo flow is providing a noticeably more positive tone to the market.",
                  "fixtures heard",
                  "• umx open north china → usg: around $13,000",
                  "• umx open bohai bay → bangladesh: mid $19,000s",
                  "• umx open south korea → south: around $17,000",
                  "• smx open cjk, prompt → se asia steel: mid $13,000s",
                  "bss bs63 dop cjk",
                  "route | guidance",
                  "nopac | $18,000",
                  "aus | $17,500",
                  "seasia | $16,500",
                  "cont / med | $17,500",
                  "wcca | $17,500",
                  "market view: 🟢 improving — tightening tonnage + better cargo enquiry"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "seasia — smx / umx",
                "paragraphs": [
                  "🟢 sentiment: slightly more positive",
                  "the week started quietly with singapore closed on monday, but overall sentiment is more positive than last week.",
                  "tonnage remains healthy across the region, although fresh cargo enquiry has picked up. demand from vietnam and south china for backhaul business has increased, while short-period interest has also improved.",
                  "aussie demand is more active, with umx open in se asia reportedly rating in the high $teens. for india/bangladesh directions, bids for umx open in south china/vietnam are currently in the low $20,000s.",
                  "weather-related delays have affected parts of the region, although conditions are improving and vessel itineraries are becoming clearer.",
                  "fixtures heard",
                  "• umx open philippines → indonesia/thailand: $20,000s",
                  "• smx open thailand → se asia/taiwan: $14,000s",
                  "• umx open indonesia → indonesia/bangladesh: $24,000",
                  "bss bs63 dop hk",
                  "route | guidance",
                  "indo / thai | $16,500",
                  "indo / china | $16,000",
                  "indo / india | $21,500",
                  "australia rv | $17,500",
                  "sp smx | $18,000",
                  "sp umx | $21,000",
                  "market view: 🟢 stabilising with improving cargo flow"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "ag / wci — smx / umx",
                "paragraphs": [
                  "🟢 sentiment: steady / slightly firmer",
                  "ag/wci remained broadly steady, with sentiment edging firmer despite limited fresh enquiry.",
                  "congestion at oman and uae east coast ports continues to cause delays, while the active monsoon is keeping salt exports and overall wci cargo flow subdued.",
                  "ec india remains firm, supported by steady indonesian cargoes and healthy coastal activity. prompt tonnage remains well employed and limited, allowing owners to maintain firm ideas despite subdued fresh export enquiry.",
                  "imabari 63 dwt — indicative broker bid / offer",
                  "route | bid | offer",
                  "ag / wci | $22,000 | $24,000",
                  "ag / eci | $23,000 | $25,000",
                  "ag / feast | $22,000 | $24,000",
                  "wci / feast | $18,000 | $20,000",
                  "speriod ag | $19,000 | $21,000",
                  "speriod wci | $18,000 | $20,000",
                  "market view: 🟢 owners remain well positioned on prompt tonnage"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "south africa — smx / umx",
                "paragraphs": [
                  "⚪ sentiment: balanced",
                  "the market has seen a more active start to the week, with approximately five fresh manganese ore stems and several coal cargoes entering the market.",
                  "manganese ore demand is now focused on 1h september dates, although the improved cargo flow has not yet translated into firmer freight levels.",
                  "supply remains well covered, with approximately 11 ships on the coast — 6 umx / 5 smx — plus 6–7 workable india ballasters.",
                  "owners remain under pressure, with last done heard around $22,500 + $225,000 aps port elizabeth.",
                  "with both cargo and tonnage lists increasing, the market remains broadly balanced. for now, sufficient supply continues to absorb additional demand and limit meaningful upside.",
                  "fixtures heard",
                  "• 61k dwt → safr / south japan: $15,000 dop qasim",
                  "• eco umx wci → safr / south japan: $15,000 dop wci",
                  "• eco umx → pe / feast: $23,000 + $230,000 aps",
                  "bsi 63k dwt benchmark",
                  "route | benchmark",
                  "safr / far east | $22,500 + $225k",
                  "safr / eci | $23,500 + $235k",
                  "safr / bh | $21,000",
                  "market view: ⚪ more cargo, but supply remains sufficient"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ecsa — handy",
                "paragraphs": [
                  "⚪ sentiment: flat",
                  "the market remains on the softer side. tonnage supply has started to reduce slowly, but the cargo list remains short, offering little evidence of a meaningful positive rebound.",
                  "forward activity, however, has increased relatively.",
                  "bss 37k saiki guidance",
                  "route | rate",
                  "ecsa / ta | $20,500",
                  "ecsa / singapore–japan | $19,500",
                  "upr / south africa | $21,500",
                  "ecsa coastal s. brazil | $16,500",
                  "ecsa coastal n. brazil | $18,500",
                  "market view: ⚪ flat, with limited catalyst for a rebound"
                ]
              },
              {
                "name": "ecsa — smx / umx",
                "paragraphs": [
                  "🟢 sentiment: flat → slightly positive",
                  "ecsa started the week quietly, with very little fh demand while ta demand remains at a more decent level.",
                  "the few fh requirements available are mainly centred around se asia, while there are also questions around middle east demand that have yet to materialise.",
                  "on the supply side, committed ecsa tonnage remains low. wafr has some availability, while the recent influx of ballasters from usec and continent is lower than last month.",
                  "the mediterranean remains at relatively healthy levels, also reducing the number of ballasters heading toward ecsa.",
                  "ffa started relatively flat but showed some improvement during the day. forward cargo remains limited for now.",
                  "overall, the market is flat but more positive on atlantic routes than fh business, with the balance still capable of shifting quickly.",
                  "broker rates & guidance",
                  "route | i63 | t58",
                  "reca ta | $32,500 | $28,500",
                  "sbraz ta | $31,500 | $27,500",
                  "nbraz ta | $31,500 | $28,000",
                  "sbraz fh | $19,250 + $925k | $16,750 + $675k",
                  "market view: 🟢 flat with a slight positive bias into september"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "wafr — smx / umx",
                "paragraphs": [
                  "⚪ sentiment: quiet / underpinned",
                  "wafr experienced a very slow start to the week with limited volume.",
                  "however, the tonnage list remains tight and could change the market dynamic quickly if cargo activity improves next week.",
                  "a similar situation is seen in the south atlantic: activity is slow, but tight tonnage continues to provide some underlying support.",
                  "guidance",
                  "route | rate",
                  "wafr ta short duration | $22,000–23,000",
                  "wafr fh → india | $29,000–30,000",
                  "wafr fh → china | $26,000–27,000",
                  "wafr fh via ecsa | $24,000–25,000",
                  "wafr ta via ecsa | $20,000–21,000",
                  "market view: ⚪ quiet, but tight tonnage provides upside risk"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "usg — handy",
                "paragraphs": [
                  "🔴 sentiment: bearish",
                  "activity slowed significantly this week, with fewer requirements entering the market and consequently muted fixing activity.",
                  "the tonnage list continues to edge lower, falling by approximately 5 vessels week-on-week to around 75 vessels opening over the next 35 days.",
                  "however, the lack of cargo volume means vessel supply is unlikely to shrink materially in the short term. as a result, sentiment remains bearish.",
                  "spot levels — 38k dwt",
                  "route | rate",
                  "ta / cont | $15,000",
                  "ta / med | $16,000",
                  "intra-americas | $14,000",
                  "wc | $17,000 — sub duration",
                  "fh | $17,000",
                  "ecsa | $12,000",
                  "market view: 🔴 bearish — declining tonnage not enough to offset weak cargo"
                ]
              },
              {
                "name": "usg — smx / umx",
                "paragraphs": [
                  "⚪ sentiment: stable / balanced",
                  "the usg market has been relatively balanced compared with last week, although activity remains limited.",
                  "the usual cargo flow continues, led by intra-usg and transatlantic business. the earlier rush of petcoke demand toward india has slowed as expected.",
                  "usec and ncsa are showing a different tone, with limited cargo lists and a longer tonnage position.",
                  "umx guidance",
                  "route / cargo | rate",
                  "usg / wcca — petcoke | $38,000",
                  "usg / feast — grains | $30,000",
                  "usec / ta — grains | $29,000",
                  "usg / emed — grains | $32,000",
                  "usg / ecmex — grains | $23,000",
                  "usg / india — petcoke | $36,000",
                  "market view: ⚪ stable, but activity remains subdued"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "med / black sea — handy",
                "paragraphs": [
                  "🔴 sentiment: negative",
                  "the med/black sea handy market remains broadly unchanged from last week.",
                  "grain activity is limited, with cvb grain cargoes to west med currently around $11,500 basis canakkale for an average handy.",
                  "there were rumours of a possible agreement between russia and ukraine that could restart ukrainian grain movements, but these were subsequently verified as unconfirmed / false news.",
                  "in the east med, activity remains limited. marble chips from greece to algeria and minerals from greece to the us are among the cargoes being discussed.",
                  "morocco is seeing fertilizer enquiries into the black sea, with bids around $11,000–12,000 aps against ideas closer to $15,000 aps.",
                  "tonnage remains broadly unchanged, with approximately 25 vessels in east med/black sea and 18 vessels in west med over the next three weeks.",
                  "fixtures heard",
                  "• 36k dwt open marmara → turkey/algeria minerals: $10,000 dop",
                  "• 33k dwt open east med → varna/spanish med: $11,250 canakkale",
                  "bss 38k dwt benchmark",
                  "route | rate",
                  "bsea / w med | $11,500 bss canakkale",
                  "bsea / cont | $11,000",
                  "bsea / feast | $17,000 via suez / $16,000 via cape",
                  "bsea / usg-usec | $12,500 / $12,750 ohbs",
                  "bsea / usg-usec — cement | $14,000",
                  "bsea / ecsa | $8,500",
                  "market view: 🔴 negative — geopolitical situation remains the main constraint"
                ]
              },
              {
                "name": "med / black sea — smx / umx",
                "paragraphs": [
                  "🟠 sentiment: softening",
                  "the smx market has weakened this week, with the clinker route to wafr losing approximately $3,000.",
                  "the softer tone appears linked to a longer tonnage list combined with calm demand. around seven additional units are now showing over the next 25 days compared with last week.",
                  "umx spreads are being discussed around $17,000 aps versus $19,000 aps for clinker to wafr hra.",
                  "despite the recent correction, the market should still be able to maintain reasonably decent levels and does not currently appear likely to fall dramatically further.",
                  "bss imabari 63 benchmark",
                  "route | rate",
                  "emed / wafr clinker | $16,500 non-hra / $18,000 hra",
                  "wmed / wafr clinker | $17,000 non-hra / $19,000 hra",
                  "emed / usg clean cargo | $14,000",
                  "emed / usg cement | $17,000",
                  "emed via cvb / ta grain | $19,000",
                  "emed fh / feast via goa | $23,000",
                  "market view: 🟠 correction underway, but downside appears contained"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "cont / baltic — handy",
                "paragraphs": [
                  "🟢 sentiment: firm",
                  "the continent/baltic handy market has remained positive since last week and continues to trade on a firm note.",
                  "a strong baltic market, combined with several grain fixtures to wafr, continues to provide support. baltic/wafr runs are being fixed around $17,000 non-hra and $18,000 hra on a 38k dwt basis.",
                  "scrap activity has been somewhat reduced as grain business remains attractive. one scrap requirement is currently targeting around $17,000–18,000, with east med scrap runs expected to trade in the very high teens, potentially around $20,000.",
                  "bh ecsa remains relatively flat at around $9,500, while usg trips are around $12,000.",
                  "tonnage is flat week-on-week, with approximately 35 vessels opening over the next 30 days.",
                  "market benchmarks — 38k dwt",
                  "route | rate",
                  "cont / med clean | $15,500",
                  "baltic / wafr non-hra | $17,000",
                  "baltic / wafr hra | $18,000",
                  "scrap baltic / e med | $19,000",
                  "cont / usg | $12,000",
                  "cont / ecsa | $9,500",
                  "cont / sgp–jpn | $15,000",
                  "market view: 🟢 firm — baltic grain demand remains supportive"
                ]
              },
              {
                "name": "cont / baltic — smx / umx",
                "paragraphs": [
                  "⚪ sentiment: quiet / stable",
                  "the continent market remains quiet, with limited demand and vessels increasingly approaching their opening dates before fixing.",
                  "current indications suggest that umx scrap cargoes could command very low $20,000s, while inbound cargoes to usg or ecsa are likely around the low teens.",
                  "bss imabari 63 benchmark",
                  "route | rate",
                  "cont / baltic → wafr non-hra | $17,500 skaw",
                  "cont / baltic → wafr hra | $19,000 skaw",
                  "cont / e med scrap | $21,500",
                  "cont / usg clean | $13,500",
                  "cont / ecsa clean | $12,500",
                  "market view: ⚪ quiet, with limited demand keeping owners under pressure"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "russia market",
                "paragraphs": [
                  "⚪ sentiment: unchanged",
                  "the russia market has remained broadly unchanged over the last 3–4 weeks.",
                  "a small number of fixtures have reportedly been concluded, although details remain limited. a handy was heard agreed around $15,000 dop emed for a novo/emed trade, but the fixture appears not to have been finalised.",
                  "the main black sea/russia trade could potentially shift toward the baltic if logistics and financial considerations make the alternative routing viable.",
                  "a 56k dwt was heard asking approximately $20,000 dop west european discharge versus $18,000 gibraltar for a baltic/russia → east africa trip of around 70 days.",
                  "ukraine has been even quieter than russia. there have again been reports of a possible agreement between russia and ukraine, but no confirmed official agreement has been established. recent reports indicate that ukraine has submitted a proposal, although the impact on shipping remains uncertain at this stage.",
                  "market view: ⚪ no material change — activity remains limited and uncertainty high"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "overall market assessment",
      "🟢 stronger / improving",
      "feast, seasia, ag/wci, cont/baltic handy",
      "the strongest positive momentum is currently visible in the feast and seasia markets, where cargo enquiries are improving while prompt tonnage is becoming tighter. the continent/baltic handy market also remains well supported by strong baltic grain demand.",
      "⚪ balanced / stable",
      "south africa, ecsa handy, ecsa smx/umx, wafr, usg smx/umx, russia",
      "several markets remain finely balanced. in ecsa and wafr particularly, the supply side is not excessive, meaning even a modest improvement in cargo could quickly change the tone.",
      "🟠 / 🔴 softer",
      "med/bsea smx/umx, med/bsea handy, usg handy",
      "the weakest areas remain usg handy and med/black sea, where limited cargo enquiry is keeping owners under pressure. the black sea continues to carry an additional geopolitical discount, while the smx/umx market in the region is seeing increased tonnage availability.",
      "market direction — at a glance",
      "feast ━━━━━━━━▶ firming",
      "seasia ━━━━━━━▶ slightly firmer",
      "ag/wci ━━━━━━━▶ firm",
      "safr ━━━━━━━━▶ balanced",
      "ecsa ━━━━━━━━▶ flat → positive",
      "wafr ━━━━━━━━▶ quiet / underpinned",
      "usg ━━━━━━━━━▶ stable / bearish handy",
      "med/bsea ━━━━▶ soft / negative",
      "cont/baltic ━━▶ firm handy / quiet smx",
      "russia ━━━━━━▶ unchanged",
      "key theme of the week",
      "the atlantic remains mixed, while the pacific is showing the clearest signs of improvement. feast and seasia are benefiting from better cargo enquiry and tightening prompt tonnage, whereas usg and med/black sea remain constrained by insufficient demand. the key watchpoint for the coming week will be whether the improving pacific cargo flow develops into sustained rate momentum and whether tight tonnage in wafr/ecsa begins to translate into firmer atlantic rates."
    ]
  },
  {
    "id": "dry-bulk-2026-08-05",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-08-05",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Outlook report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Global dry bulk markets remained generally under pressure this week, with soft sentiment prevailing across most basins. Spot demand continues to lag behind available tonnage, particularly in the Pacific and Atlantic, although localized strength persists in regions supported by healthy cargo programs such as South Africa, West Africa and parts of the Indian Ocean.",
    "overview": {
      "paragraphs": [
        "Weekly Freight Market Update (Handy / Supramax / Ultramax)",
        "Executive Summary",
        "Global dry bulk markets remained generally under pressure this week, with soft sentiment prevailing across most basins. Spot demand continues to lag behind available tonnage, particularly in the Pacific and Atlantic, although localized strength persists in regions supported by healthy cargo programs such as South Africa, West Africa and parts of the Indian Ocean.",
        "Weather continues to influence vessel schedules, with typhoons in the Far East delaying prompt tonnage and monsoon conditions limiting activity across India. Meanwhile, market participants remain focused on the approaching grain season in both the US Gulf and Atlantic, which could provide support later in August and into September."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (Supramax / Ultramax)",
                "paragraphs": [
                  "Sentiment: 🔻 Soft",
                  "The FEAST market remains mixed this week. Spot conditions continue to soften as several prompt vessels struggle to secure fresh employment. However, weather disruptions caused by recent typhoons have delayed a number of vessels with 8–13 August positions, reducing immediate vessel availability.",
                  "Underlying fundamentals remain largely unchanged. Bulk cargo demand from both FEAST and NOPAC remains subdued, while the second-half August breakbulk cargo list is gradually improving but not sufficiently to tighten the overall tonnage supply.",
                  "Unless cargo volumes improve meaningfully or weather disruptions persist longer than expected, freight levels are likely to remain under pressure.",
                  "Recent Fixtures",
                  "• Ultramax N. China → Bangladesh (slag): high USD 18,000s",
                  "• Ultramax CJK → South Asia: mid USD 15,000s",
                  "• 63k Tianjin → Bangladesh (slag): around USD 20,000",
                  "BSS BS63 DOP CJK",
                  "Route | Rate (USD/day)",
                  "NOPAC | 17,000",
                  "Australia | 16,500",
                  "SE Asia | 15,500",
                  "Continent / Med | 17,000",
                  "WCSA / WCCA | 15,000"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "Southeast Asia (Supramax / Ultramax)",
                "paragraphs": [
                  "Market sentiment remains mixed with a long tonnage list across the region and subdued cargo demand, particularly from Australia. Most market participants are adopting a cautious wait-and-see approach.",
                  "Bunker prices appear to have stabilized while poor weather across Southeast Asia is expected to create operational delays. Interest for short period business has increased compared to last week although period levels have softened.",
                  "Fixtures",
                  "• SMX Indonesia/SE Asia: USD 18,000",
                  "• UMX South China/Bangladesh: USD 23,500",
                  "• UMX Singapore/India: USD 23,000",
                  "Market Guidance (BS63 DOP HK)",
                  "Trade | Rate",
                  "Indonesia / Thailand | 16,000",
                  "Indonesia / China | 15,500",
                  "Indonesia / India | 20,500",
                  "Australia RV | 17,500",
                  "Spot SMX | 17,500",
                  "Spot UMX | 20,500"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "Arabian Gulf / West Coast India (Supramax / Ultramax)",
                "paragraphs": [
                  "Market conditions remained broadly stable with sentiment improving slightly despite limited fresh cargo enquiry.",
                  "Some Red Sea vessels are considering Salalah employment amid regional geopolitical concerns, while congestion at Oman and East UAE ports continues to delay vessel schedules. Active monsoon conditions continue limiting salt exports from WCI.",
                  "East Coast India remains comparatively firm, supported by Indonesian cargoes and steady coastal demand.",
                  "Broker Guidance (Imabari 63)",
                  "Route | Bid | Offer",
                  "AG / WCI | 22k | 24k",
                  "AG / ECI | 23k | 25k",
                  "AG / FEAST | 22k | 24k",
                  "WCI / FEAST | 18k | 20k",
                  "Short Period AG | 19k | 21k",
                  "Short Period WCI | 18k | 20k"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "South Africa (Supramax / Ultramax)",
                "paragraphs": [
                  "Sentiment: 🟢 Prompt softer, forward constructive",
                  "The market started slowly but cargo fundamentals remain supportive. Coal demand continues steadily while manganese ore enquiries remain healthy despite several postponed stems.",
                  "Owners generally remain firm, although prompt vessels have shown greater flexibility to secure employment. Forward sentiment remains supported by tightening vessel availability.",
                  "Fixtures",
                  "• Eco UMX WCI → China (Mn Ore): USD 18,000 DOP",
                  "• Eco UMX WCI → China (Mn Ore): USD 17,500 DOP",
                  "Benchmark",
                  "Route | Rate",
                  "SAFR / Far East | 24k + 240k BB",
                  "SAFR / ECI | 25k + 250k BB",
                  "SAFR / Bangladesh | 20k"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "East Coast South America",
                "paragraphs": [
                  "Handy",
                  "Sentiment: 🔻 Softening",
                  "The South Atlantic tonnage list has grown beyond 55 vessels, while traders continue offering sub-sale cargoes seeking lower freight before committing commodity purchases.",
                  "Cargo volume remains around 13 stems and forward activity is still limited.",
                  "Route Guidance (37k)",
                  "Route | Rate",
                  "TA | 19,250",
                  "Far East | 18,500",
                  "South Africa | 20,500",
                  "Coastal S Brazil | 15,500",
                  "Coastal N Brazil | 17,500",
                  "Supramax / Ultramax",
                  "Another quiet week with Far East business continuing to soften.",
                  "Current indications:",
                  "• UMX FH: 18k + 800k BB",
                  "• Premium to Persian Gulf remains, although well below levels seen a month ago.",
                  "• TA demand also remains weak.",
                  "Broker Guidance",
                  "Route | Rate",
                  "RECA TA UMX | 30,500",
                  "SBRAZ FH UMX | 18,750 + 875k",
                  "SBRAZ FH SMX | 16,250 + 625k"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "West Africa (Supramax / Ultramax)",
                "paragraphs": [
                  "West Africa continues to outperform ECSA.",
                  "Far East demand remains healthy despite slightly lower freight. Cargo activity continues to absorb available tonnage and market participants expect stability over the coming weeks.",
                  "UMAX Guidance",
                  "Route | Rate",
                  "TA Short Duration | 22–23k",
                  "India | 28k",
                  "China | 25k",
                  "FE via ECSA | 23–24k",
                  "TA via ECSA | 20–21k"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US Gulf",
                "paragraphs": [
                  "Handy",
                  "Rates weakened further this week amid soft demand although vessel supply declined by approximately ten ships.",
                  "The approaching grain season continues to support expectations that the market is nearing its seasonal bottom.",
                  "Spot Levels (38k)",
                  "Route | Rate",
                  "Transatlantic | 17,500",
                  "Mediterranean | 18,000",
                  "Intra Americas | 15,000",
                  "West Coast | 18,000",
                  "Far East | 17,000",
                  "ECSA | 13,000",
                  "Supramax / Ultramax",
                  "The market has eased after several strong weeks as increased tonnage and ballasters reduced owners' negotiating power.",
                  "Most brokers view this as a market correction rather than a collapse, with expectations improving towards September grain exports.",
                  "Recent Fixtures",
                  "• USG → WCCA Petcoke: 38,000",
                  "• USG → FEAST Grains: 31,000",
                  "• USEC → TA: 29,000",
                  "• USG → East Med: 33,000",
                  "• USG → India Petcoke: 38,000"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Mediterranean / Black Sea",
                "paragraphs": [
                  "Handy",
                  "The market remains largely unchanged.",
                  "Cargoes remain concentrated from Constanta/Varna/Burgas while Ukraine and Russia continue to attract very limited vessel interest.",
                  "Overall sentiment remains negative due to growing tonnage and limited cargo volumes.",
                  "Benchmark (38k)",
                  "Route | Rate",
                  "Black Sea / West Med | 11,500",
                  "Black Sea / Continent | 11,000",
                  "Black Sea / FEAST | 17,000",
                  "Black Sea / USG | 12,500",
                  "Black Sea / ECSA | 8,500",
                  "Supramax / Ultramax",
                  "Despite a longer tonnage list, demand improved towards the end of the week.",
                  "Fresh clinker and cement business supported rates while brokers expect additional grain cargoes during the second half of August.",
                  "Benchmark (63k)",
                  "Route | Rate",
                  "East Med / WAFR | 19,500",
                  "West Med / WAFR | 20,000",
                  "East Med / USG (Clean) | 15,500",
                  "East Med / FEAST | 29,000"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Continent / Baltic",
                "paragraphs": [
                  "Handy",
                  "The market remains generally stable with improved cargo flow for mid-August, mainly driven by scrap, coal and grains.",
                  "Tonnage increased by around ten vessels week-on-week but freight remains supported by healthy cargo volumes.",
                  "Benchmark (38k)",
                  "Route | Rate",
                  "Cont / Med | 13,500",
                  "Baltic / WAFR | 15,000",
                  "Baltic / East Med Scrap | 16,500",
                  "Cont / USG | 11,500",
                  "Cont / ECSA | 8,500",
                  "Cont / Singapore/Japan | 13,750",
                  "Supramax / Ultramax",
                  "The market continues to soften gradually.",
                  "Scrap fixtures into East Med are now concluding in the high USD 23,000s while grain cargoes to West Africa are paying around USD 18–19,000 for Ultramax vessels.",
                  "Benchmark (63k)",
                  "Route | Rate",
                  "Cont / WAFR | 19,000",
                  "Cont / East Med Scrap | 23,500",
                  "Cont / USG | 14,000",
                  "Cont / ECSA | 13,000"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "Russia Market",
                "paragraphs": [
                  "Activity remains extremely limited.",
                  "Owners continue weighing the risks of calling Russian and Ukrainian ports, resulting in few concluded fixtures despite occasional aggressive offers. Charterers continue exploring alternative loading options via the Baltic and CVB, although operational feasibility remains the key challenge."
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "Market Outlook",
      "📉 Softer Markets",
      "• FEAST",
      "• Southeast Asia",
      "• ECSA",
      "• US Gulf (short-term)",
      "• Continent/Baltic SMX",
      "• Black Sea Handy",
      "➡️ Stable",
      "• AG/WCI",
      "• West Africa",
      "• Mediterranean SMX",
      "• US Gulf (forward outlook)",
      "📈 Relatively Firm",
      "• South Africa",
      "• East Coast India",
      "• West Africa Far East trades",
      "Key Watch Points Next Week",
      "• Typhoon impact on FEAST vessel availability.",
      "• Monsoon disruption across India.",
      "• Growth in BH cargo programme during second-half August.",
      "• US grain season approaching September.",
      "• Continued manganese and coal demand from South Africa.",
      "• Atlantic grain export activity heading into late August."
    ]
  },
  {
    "id": "dry-bulk-2026-07-29",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-07-29",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Outlook report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Overall Sentiment: Flat / Softening",
        "Weekly Freight Market Update (Handy / Supramax / Ultramax)",
        "Executive Summary",
        "Region | Sentiment | Trend",
        "FEAST | 🔴 Soft | Dropping",
        "SE Asia | 🟡 Stable | Softening",
        "AG / WCI | 🟢 Stable | Positive",
        "South Africa | 🟢 Firm | Stable",
        "ECSA Handy | 🔴 Flat | Softening",
        "ECSA SMX/UMX | 🟡 Flat | Softening",
        "West Africa | 🟡 Flat | Softening",
        "US Gulf Handy | 🟡 Stable | Softening",
        "US Gulf SMX/UMX | 🟡 Stable  | Softening",
        "Med / Black Sea Handy | 🟡 Flat | Softening",
        "Med / Black Sea SMX/UMX | 🟢 Stable | Positive",
        "Continent / Baltic Handy | 🟡 Flat | Softening",
        "Continent / Baltic SMX/UMX | 🟡 Flat | Softening",
        "Russia | 🟢 Strong | Tight"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🔴 Soft / Dropping",
                  "The FEAST market has continued to soften this week across both the backhaul and Pacific round sectors. The weakening sentiment is primarily driven by reduced cargo demand on the backhaul trade, coupled with an increase in available tonnage as more vessels enter the spot market.",
                  "Rate levels have come under increasing pressure, with charterers taking advantage of the improved vessel supply to negotiate more competitive rates. We can see some spot vessel owners are willing to accept a few days of waiting time in order to secure employment, reflecting the current imbalance between vessel availability and cargo demand.",
                  "Market Guidance (BSS BS63 DOP CJK)",
                  "Route | Rate",
                  "NOPAC | 17,000",
                  "Australia | 16,500",
                  "SE Asia | 16,000",
                  "Continent / Med | 19,000",
                  "WCCA | 15,500",
                  "Reported Fixtures",
                  "ultra open cjk fixed ard 16s nopac rvd",
                  "ultra open cjk fixed ard 22k trip to Fujairah",
                  "ultra open n.china fixed 19k short trip to jpn"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "Southeast Asia (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟡 Stable / Softening",
                  "Compared to the Feast, Seasia has been relatively more stable, although overall mkt is softening. With the North seeing a correction in rates, we have seen an increase of vessels being fixed from feast for south cargoes as indo and aussie rounds. Tonnage list remain long in the region, while fresh cargo enquiry is limited, keeping pressure on rates. Short-period interest has also taken a pause as the BH market continues to weaken, with the spread between SP and BH now is wider than last week.",
                  "Market Guidance (BSS BS63 DOP HK)",
                  "Route | Rate",
                  "Indo / Thailand | 16,000",
                  "Indo / China | 16,000",
                  "Indo / India | 21,000",
                  "Australia RV | 18,000",
                  "Spot SMX | 18,000",
                  "Spot UMX | 21,500",
                  "Fixtures",
                  "umx open seasia fixed 19k aussie rv",
                  "smx open sgp fixed 16ks indo/china",
                  "umx open nchina fixed 18k indo/bdesh",
                  "umx open indo fixed 23ks aussie rv"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "Arabian Gulf / West Coast India (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Stable / Positive",
                  "The AG/WCI market remained broadly stable this week, although momentum eased from last week's strengthening trend. Fixture activity was concentrated within the Indian Ocean, with several cargoes loading from Oman and the East Coast UAE  towards India and Bangladesh. The situation in the Strait of Hormuz remains restrictive. Meanwhile, ECI coastal employment continues to provide steady support, with the market remaining well balanced by a healthy flow of Indonesian loading cargoes.",
                  "Broker Guidance (Imabari 63)",
                  "Route | Bid | Offer",
                  "AG / WCI | 22k | 24k",
                  "AG / ECI | 23k | 25k",
                  "AG / FEAST | 22k | 24k",
                  "WCI / FEAST | 18k | 20k",
                  "Short Period AG | 19k | 21k",
                  "Short Period WCI | 18k | 20k"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "South Africa (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm / Stable",
                  "South Africa started the week on a quieter note, with few coal tenders and two manganese ore tenders for 14 August onwards window. Despite the slower start, the forward market remains supported by a tightening tonnage list on the coast mainly smxs and only a limited number of ballasters fm india.",
                  "Recent Fixtures",
                  "Voyage 54150-55150 pe/feast fixed eqv 20+200 bsi58 passing pe to feast",
                  "Benchmarks",
                  "Route | Rate",
                  "SAFR / Far East | 25k + 250k",
                  "SAFR / ECI | 26k + 260k",
                  "SAFR / Backhaul | 23k"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "East Coast South America (Handy)",
                "paragraphs": [
                  "Sentiment: 🔴 Flat / Softening",
                  "The market remains relatively flat, with sentiment still on the soft side. The tonnage list continues to grow while the cargo list is not building up at the same pace, leaving owners with limited leverage. We are starting to see more voyage cargoes entering the market, but not in sufficient volume to tighten the balance.",
                  "Route Guidance (37k)",
                  "Route | Rate",
                  "ECSA / TA | 21,250",
                  "ECSA / SGP-JPN | 20,750",
                  "UPR / South Africa | 22,000",
                  "Coastal South Brazil | 16,000",
                  "Coastal North Brazil | 18,000"
                ]
              },
              {
                "name": "East Coast South America (SMX / UMX)",
                "paragraphs": [
                  "Sentiment:🟡Flat / Softening",
                  "ecsa is for sure dropping this week if last week the trends was still not sure. Fh got the biggest affect as pmax keeps dropping, and only some geared fh to Chittagong or pg in the market. Consequently there are very few talking for fh, umax offers 19s+900s and got few chrts rate.",
                  "Ta is at least more active at lower level though. n.brazil is lower due to some committed vsl and ballaster from conti/Morocco, umax fixed at very low 30k for n.brazil ta this week, 3k lower than 2 weeks ago. ta from south is abt 1k higher in rate, but also less in activity.",
                  "we dont see much forward cargo due to soft sentiment and uncertainty in bunker price. We are not very positive on next week market, maybe it could still drop a bit further",
                  "Broker Guidance",
                  "Route | Rate",
                  "RECA TA I63 | 32,000",
                  "RECA TA T58 | 30,000",
                  "SBRAZ TA I63 | 31,500",
                  "NBRAZ TA I63 | 31,000",
                  "SBRAZ FH I63 | 19,000 + 900k",
                  "SBRAZ FH T58 | 16,750 + 675k"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "West Africa (SMX / UMX)",
                "paragraphs": [
                  "Sentiment:🟡Flat / Softening",
                  "Lower activity and lower rate like rest of the market. Fh is not as hot as previously, umax fixed high 20k for w.afr/eci while last week they got same rate redel sgp/jpn. more tonn enter the market from the long discharge in w.afr and chrts prefer to wait due to the high bunker price.",
                  "w.afr ta is still relatively health due to short duration, smax can get low 20k aps . We expected market will be same/ slightly soft in next week",
                  "Guidance",
                  "Route | Rate",
                  "TA Short Duration | 22–23k",
                  "Far East → India | 28k",
                  "Far East → China | 25k",
                  "FH via ECSA | 23-24k",
                  "TA via ECSA | 20–21k"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US Gulf (Handy)",
                "paragraphs": [
                  "Sentiment:🟡Stable / Softening",
                  "The market stays on a downward trajectory due to persistent weak demand and an abundance of tonnage across the region.",
                  "The tonnage list ticked down slightly to around 90 vessels opening over the next 35 days—down about 5 WoW. However, with very few fresh requirements coming through, there is little indication that supply will shrink in any meaningful way. Furthermore, most new inquiries are targeting 10th Aug onwards, allowing prompt spot tonnage to accumulate.",
                  "Spot Levels (38k)",
                  "Route | Rate",
                  "TA / Cont | 18.5k",
                  "TA / Med | 19k",
                  "Intra Americas | 17k",
                  "West Coast | 19k",
                  "Far East | 17k",
                  "ECSA | 13k"
                ]
              },
              {
                "name": "US Gulf (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟡 Stable / Correcting",
                  "Usg last 7 days keep following last week trend, let s call it down stable direction, btw monday anoon after a very active and odd monday",
                  "we felt market bottoming, so far this week with 25-6k done for clean umx t/a and 27 on the USEC which may suggest charts feel like rates",
                  "are close to bottom.",
                  "It is likely the 10-20 Aug slot will remain soft as there is still tonnage to clear out butall the major fuel players are out asking for freight end Aug all directions and as we approach September’s beans it shouldn’t take too much demand to get going again.",
                  "If the Gulf continues to lose ships to North Brazil as well then tonnage won’t stay in surplus for too much longer",
                  "vsl cargo ratio 38 vs 21 ... For me is a stability sign .. Can t drive me to put into negative direction",
                  "-",
                  "Benchmark umx/smx",
                  "tarv     30000/26000  pcoke / grains  smax 3/4k discount",
                  "fh        30000/27000 pcoke/grains smax 3/4 discount",
                  "india   35000 umax/ 29000 smax - sub position if ppt can get higher rate",
                  "wcca   30000 umax/27500 smax - if grains - if petcoke or coal short duration",
                  "intusg 21000 umax/18500 smax - ofc with short pcoke higher",
                  "ecsa    21000 umax/18500 smax"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Mediterranean / Black Sea (Handy)",
                "paragraphs": [
                  "Sentiment: 🟡 Flat / Softening",
                  "After 2 or 3 weeks of strong levels mediterranean and black sea market freight levels started to decrease due to conflict between Russia and Ukraine, in the last couple of weeks ships which were going to load grain from Ukraine has been hitted by Russia therefore now nobody is willing to call Ukraine.",
                  "Since all ships which wanna load grain are now focus on CVB and cargo volume is still low all freight levels collapsed, CVB/Algeria fixed 24.50 usd bss 5% ttl comm on overage vsl TCE arnd 5000 Canakkale bss 29000 dwt, CVB/Tunisia fixed 27 usd TCE 5400 Canakkale bss 33000 dwt.",
                  "From east med we see only 3 cargoes steels to Caribs and salt to USEC and in west med situation is like last week, owners are focus on cargoes from N.Brazil or USEC were market is still stronger",
                  "Fixtures",
                  "-32k dwt fixed steels Greece/Usg at 10k aps",
                  "-28k dwt fixed grain CVB/Portugal at 11500 Canakkale",
                  "Benchmarks (38k)",
                  "Route | Rate",
                  "Black Sea → West Med | 11,500",
                  "Black Sea → Continent | 11,000",
                  "Black Sea → FEAST | 17,000 (Suez)",
                  "Black Sea → FEAST (COGH) | 16,000",
                  "Black Sea → USG | 12,500",
                  "Black Sea → ECSA | 8,500"
                ]
              },
              {
                "name": "Mediterranean / Black Sea (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Stable",
                  "We still see a good demand of grains cargoes to the Continent and to Red Sea. The tonnage list this week counts 5 units more compared to last one, which might maybe soften a little the levels, even if we forecast to see more grains for August out of B Sea which will help to keep and healthy market",
                  "We heard a smx fixed 15,500usd dop east med for salt to USEC, and we see spread 16k vs 17k + 200k ilohc still on smx for cement into USG.",
                  "Benchmarks (Imabari 63)",
                  "Route | Rate",
                  "EMED → WAFR Clinker | 17,500 / 18,500 (HRA)",
                  "WMED → WAFR Clinker | 19,500 / 20,500 (HRA)",
                  "EMED → USG Clean | 15,500",
                  "EMED → USG Cement | 18,000",
                  "EMED via CVB TA Grain | 20,000",
                  "EMED → FEAST (via Goa) | 29,000"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Continent / Baltic (Handy)",
                "paragraphs": [
                  "Sentiment: 🟡 Flat / Softening",
                  "Market this week seeing prompt tonnage struggling to find employment as many cargoes being covered in house and other stems are from 1st week/1H of august. Hence, ows have been open to look at stems out of usec - seeing in the very high teens aps.",
                  "Levels are softening but not as much due to the short tonnage list with around 26 vessels opening compared to the normal 40-50. Bunge has fixed two trips ex poland to usec and usg with grains on voy tce 9.5k skaw. Scrap is being rated at mid-high teens going to emed. Grain runs from baltic/morocco aiming low teens. Backhaul trips from conti with steels been rated arnd 11k aps.",
                  "Benchmarks (38k)",
                  "Route | Rate",
                  "Cont / Med Clean | 13,500",
                  "Baltic → WAFR | 15,000",
                  "Baltic → WAFR (HRA) | 15,750",
                  "Baltic → East Med Scrap | 16,000",
                  "Cont → USG | 11,500",
                  "Cont → ECSA | 8,500",
                  "Cont → Singapore/Japan | 13,750"
                ]
              },
              {
                "name": "Continent / Baltic (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟡 Flat",
                  "In Continent the situation is still quite calm, with not many cargoes and scrap that today we believe is around 25k on umx. We are seeing more Russian cargoes with some charterers that are shifting their grain cargoes from the Russian black sea to the baltic",
                  "Benchmarks (Imabari 63)",
                  "Route | Rate",
                  "Cont/Baltic → WAFR | 19,500",
                  "Cont/Baltic → WAFR (HRA) | 21,000",
                  "Cont → East Med Scrap | 25,000",
                  "Cont → USG Clean | 15,000",
                  "Cont → ECSA Clean | 14,000"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "Russia Market",
                "paragraphs": [
                  "Sentiment: 🟢 Strong",
                  "The shipping situation in Russian and Ukrainian Black sea ports remains extremely tense and complex.",
                  "It is currently characterized by a severe contraction in tonnage supply and a subsequent surge in freight rates.",
                  "A significant number of shipowners are strictly refusing to carry cargoes originating from Ukraine and Russia.",
                  "Only a limited number of shipowners are still willing to trade within these waters, effectively operating with strong",
                  "contractual leverage due to the lack of competition.",
                  "Given the scarcity of available vessels paired with high operational risks, the remaining owners on the market are",
                  "demanding exceptionally high premium rates.",
                  "Today a 57,000 DWT got low 30000 fm Canakkale to load in Novorossiysk for a trip to Indonesia, for the same",
                  "vessel from Novorossiysk to Chittagong (Bangladesh), ideas are even higher, with owners asking up to USD 37,000 per day.",
                  "A substantial volume of cargo remains available on the market for both Handysize and Supramax vessels, bound from Russia",
                  "to various global destinations.",
                  "Despite highly flexible laycan options spanning the entirety of August, negotiations are stalling. Virtually no fixtures are being",
                  "concluded due to the wide gap between owners' rate expectations and charterers' ideas.",
                  "Charterers, in close cooperation with shippers and traders, are actively working to postpone laycan windows. The shared strategy",
                  "is to defer commitments in anticipation of a market stabilization or a cooling of geopolitical tensions, which might alleviate current",
                  "freight cost pressures.",
                  "increased AWRP and Goa cost",
                  "• Supra Black Sea → Far East: 30k+",
                  "• Ultramax → Far East: 32k+"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-07-22",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-07-22",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Outlook report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Overall Sentiment: Steady",
        "Weekly Freight Market Update (Handy / Supramax / Ultramax)",
        "Executive Summary",
        "Region | Sentiment | Trend",
        "FEAST | 🔴  Flat | Softening",
        "SE Asia | 🔴  Flat | Softening",
        "AG / WCI | 🟢 Firm | Improving",
        "South Africa | 🟢 Firm | Improving",
        "ECSA Handy | 🔴  Flat | Softening",
        "ECSA SMX/UMX | 🟡 Firm | Correcting",
        "West Africa | 🟡 Firm | Correcting",
        "US Gulf Handy | 🟡 Stable | Softening",
        "US Gulf SMX/UMX | 🟡Correcting | Softening",
        "Med / Black Sea Handy | 🟢 Firm | Positive",
        "Med / Black Sea SMX/UMX | 🟢 Firm | Positive",
        "Continent / Baltic Handy | 🟡 Flat | Improving",
        "Continent / Baltic SMX/UMX | 🟡Correcting | Softening",
        "Russia | 🟢 Strong | Tight"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🔴 Softening",
                  "The freight market has softened this week as more vessels have emerged following the typhoon, while demand for backhaul (BH) cargoes has moderated. Compared with last week, hire rates for both Pacific round voyage (PAC RVD) and BH trades have declined by approximately USD 1,000 or more. We are also observing several prompt-opening vessels that have yet to secure employment. At the same time, the availability of spot cargoes has become increasingly limited, contributing to a quieter overall market.",
                  "Market Guidance (BSS BS63 DOP CJK)",
                  "Route | Rate",
                  "NOPAC | 19,000",
                  "Australia | 18,500",
                  "SE Asia | 18,000",
                  "Continent / Med | 20,000",
                  "WCCA | 18,500",
                  "Reported Fixtures",
                  "ultra open n.china fixed ard mid high 21k sp",
                  "small smx open n.china fixed ard 19s general cargo to w.afr",
                  "ultra open n.china fixed ard 22s general cargo to w.afr",
                  "ultra open n.china fixed ard sub 21k legs"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "Southeast Asia (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🔴 Softening",
                  "Seasia is seeing more vsls in the area this week compared to last, although south feels steady. While many vessels were delaying last week, most itineraries are now more clear. On the cargo side, we have seen less activity on the usual Indonesia rounds, while Aussie cargoes continue to support demand in the region. Overall, mkt remains supported by ongoing period interest from operators for their BH cargoes but we see more vessels willing to discount on 1 tct to reposition into atlantic. Most umx offers are arnd 22ks bss seasia for SP.",
                  "Market Guidance (BSS BS63 DOP HK)",
                  "Route | Rate",
                  "Indo / Thailand | 17,000",
                  "Indo / China | 16,500",
                  "Indo / India | 21,000",
                  "Australia RV | 18,500",
                  "Spot SMX | 18,000",
                  "Spot UMX | 21,500",
                  "Fixtures",
                  "Umxs open spore fixed 18k indo/china",
                  "Umx open seasia fixed 21k aussie rv",
                  "Umx open indo fixed 24ks indo/india",
                  "Umx open schina fixed 22ks for sp"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "Arabian Gulf / West Coast India (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Improving",
                  "The AG/WCI market continued to strengthen this week, with increased rate levels. Although cargo volumes remain at normal levels, the tightening spot tonnage list has encouraged owners to push rates above previously concluded fixtures. Transit through the Strait of Hormuz remains restricted due to ongoing escalated tensions in the region. Ultramax in WCI are actively seeking South Africa loading cargoes for prompt positions. The ECI market has softened considerably over recent weeks; however, coastal cargoes continue to provide attractive rates.",
                  "Broker Guidance (Imabari 63)",
                  "Route | Bid | Offer",
                  "AG / WCI | 22k | 24k",
                  "AG / ECI | 23k | 24k",
                  "AG / FEAST | 22k | 24k",
                  "WCI / FEAST | 18k | 20k",
                  "Short Period AG | 19k | 21k",
                  "Short Period WCI | 18k | 20k"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "South Africa (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "South Africa has gradually firmed so far this week, with a steady flow of fresh manganese ore and coal tenders supporting the cargo list. The tonnage list for 2–9 August laycans has started to thin, while prompt enquiry has improved on the back of increased ore activity.",
                  "Owners have continued to hold firm ideas, supported by volatile bunker prices and the healthier forward cargo programme, keeping pressure on charterers. At the same time, fresh Indian ballasters are entering the region, preventing the market from tightening too quickly despite the improving demand outlook.",
                  "Recent Fixtures",
                  "scorpios island yess 64k kandla 21–24 jul fxd safr/china 20,250 dop",
                  "* sorsi 64/17 cape town 1–3 aug on subs voy safr/india eqv abt 27+270",
                  "* Sheng an hai 57/12 mtwara 29 july on subs 25k dop for safr/paki",
                  "* Alberta 63/16 Hambantota 23-25 Jul trip fxd 21k dop for safr/Eci",
                  "Benchmarks",
                  "Route | Rate",
                  "SAFR / Far East | 25k + 250k",
                  "SAFR / ECI | 26k + 260k",
                  "SAFR / Backhaul | 21k"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "East Coast South America (Handy)",
                "paragraphs": [
                  "Sentiment: 🔴 Softening",
                  "The market remains about balanced but slightly worst lvls in general. Cgo list remain short with no strong activity above all on PPT dates, and still has to come out cgoes for mid august time being",
                  "Route Guidance (37k)",
                  "Route | Rate",
                  "ECSA / TA | 23,000",
                  "ECSA / SGP-JPN | 21,000",
                  "UPR / South Africa | 23,000",
                  "Coastal South Brazil | 16,500",
                  "Coastal North Brazil | 18,500"
                ]
              },
              {
                "name": "East Coast South America (SMX / UMX)",
                "paragraphs": [
                  "Sentiment:🟡Firm / Correcting",
                  "ok-ish activity to start the week with a somewhat balanced yet supported supply-demand picture resulting in a flatish market, which more or less in line with current pmx sentiment.",
                  "destinations for ta is scattered across the cont and med, fh equally so despite consistently weak spillover pmx demand for china. for north brazil loading ballasters are still coming fm cont med, but the stronger origin markets means this market is now more reliant on wafr and local sourcing - however the current cooling sentiment in ncsa/usec means these vsls cud potentially ballast to nbraz. the driving factor remains the supply side, altogether",
                  "ffa remains flat and less volatile relative to the past month. forward bookings remain possible albeit more on the short end of the curve.",
                  "sentiment is flat for mid and end aug yet finely balanced underlined by the continuous low availability of supply - not only in ecsa but accross the atlantic - supported by a stable demand. Shud demand change, or ballast metrics on supply side - it cud create an interesting scenario on the up-side, however the opposite remains a possibility, if surrounding markets weaken on macro.",
                  "Broker Guidance",
                  "Route | Rate",
                  "RECA TA I63 | 33,000",
                  "RECA TA T58 | 31,000",
                  "SBRAZ TA I63 | 32,000",
                  "NBRAZ TA I63 | 32,000",
                  "SBRAZ FH I63 | 19,500 + 950k",
                  "SBRAZ FH T58 | 17,000 + 700k"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "West Africa (SMX / UMX)",
                "paragraphs": [
                  "Sentiment:🟡Firm / Correcting",
                  "Area is mentioning slowly some softering movement, ecsa is slowly going down as well, fh still remaining very firm",
                  "Guidance",
                  "Route | Rate",
                  "TA Short Duration | 24–25k",
                  "Far East → India | Low 30s",
                  "Far East → China | 28–29k",
                  "FH via ECSA | 25–26k",
                  "TA via ECSA | 20–21k"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US Gulf (Handy)",
                "paragraphs": [
                  "Sentiment:🟡Stable",
                  "The market started active early in the week despite the soft trend, as more owners are rushing to lock in cargoes before rates slip further.",
                  "After the tng list leveled off in week 28, the tonnage list now hits a new high of around 95 vessels opening over the next 35 days—up about 10 WoW.",
                  "Despite the long tonnage list and weak sentiment, rates haven't dropped as sharply as they have in past cycles with this much supply. Still, we expect rates to keep sliding through August laycans.",
                  "Spot Levels (38k)",
                  "Route | Rate",
                  "TA / Cont | 19k",
                  "TA / Med | 20k",
                  "Intra Americas | 18k",
                  "West Coast | 20k",
                  "Far East | 18k",
                  "ECSA | 14k"
                ]
              },
              {
                "name": "US Gulf (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟡 Correcting",
                  "Usg last 7 days keep following last week trend, correction in action .. After we camer very close to 40k levels same was expected, market",
                  "keep correcting on downside obviously on tc rate vbecause bunker prices tt are in the way up keep maintaining voy rate closer to previous levels.",
                  "As personal feeling i think market cant drop much further, maybe i m wrong but expecially for tarv we keep seeing bit of pressure while on intercarribs and fh we see offers tt demand is not ready to absorb",
                  "Activity in general is sligly below average like wise the week befor .. Last 7 days we saw 28 cargoes covered versus 33 on the previous week",
                  "Vsl cargo ratio is 46 vs 20 vut at moment can t see any cargo with july dates therefore ppt vessel probably need to keep discounting to get employment",
                  "Radio market keep sayig petocke to india still out on off market bss but what we expect is not on july dates",
                  "-",
                  "Benchmark umx/smx",
                  "tarv     30000 umax/27000 smax -  pcoke ofc is at premium",
                  "fh        30000 umax/ 2650 smax - sub duration / routing more than commodity type",
                  "india   37000 umax/ 32000 smax - sub position if ppt can get higher rate",
                  "wcca   31000 umax/27500 smax - if grains - if petcoke or coal short duration",
                  "intusg 24500 umax/22500 smax - ofc with short pcoke higher",
                  "ecsa    23000 umax/20000 smax"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Mediterranean / Black Sea (Handy)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "For this week market is keep same positive trend, due to recent bombings in Ukraine majority of owners prefer to load grain from CVB were we count 7 cargoes from CVB otherwise 4 from Ukraine and 3 from Russia.",
                  "In east med we see only 5 cargoes, steels from east med/usg with steels bidding 32000 dwt 10000 aps vs 10500 aps, minerals from Greece to Arag bidding 37000 dwt 12000 aps vs 15000 aps.",
                  "West med is still the worst area and owner are still focus on cargoes from N.Brazil or USEC were the market is definitely stronger.",
                  "For the next 3 weeks tonnage list is almost the same in East med-black sea 25 ships and in west med 24 ships.",
                  "Overall sentiment is positive and we still have good flow of grain cargoes ex black sea therefore I think market will remain firm for at least end of the month.",
                  "Fixtures",
                  "-39k dwt open Jorf fixed 10,000aps Safi / USG",
                  "-38k dwt open Marmara fixed dely Canakkale redel USG – USEC at $16,000 + $165,000 ILOHC",
                  "-35K Dwt open Lisbon Garrucha/Denmark fixed at 13k aps",
                  "-40k dwt ohbs open Marmara fixed CVB/Spain at 16800 dop",
                  "Benchmarks (38k)",
                  "Route | Rate",
                  "Black Sea → West Med | 14,500",
                  "Black Sea → Continent | 14,000",
                  "Black Sea → FEAST | 17,000 (Suez)",
                  "Black Sea → FEAST (COGH) | 16,000",
                  "Black Sea → USG | 12,000",
                  "Black Sea → ECSA | 10,000"
                ]
              },
              {
                "name": "Mediterranean / Black Sea (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "Market remains strong with a very long cargo list, counting now around 20 business only in East Med / B Sea; also the tonnage list remains relatively short, with about 20 units only.",
                  "Grains cargoes via cvb to red sea are fixing in the low 20’s dop east med and redel port said while cement cargoes to US still on umx are fixing in the high teens.",
                  "Benchmarks (Imabari 63)",
                  "Route | Rate",
                  "EMED → WAFR Clinker | 18,000 / 19,000 (HRA)",
                  "WMED → WAFR Clinker | 20,000 / 21,000 (HRA)",
                  "EMED → USG Clean | 15,500",
                  "EMED → USG Cement | 18,500",
                  "EMED via CVB TA Grain | 20,000",
                  "EMED → FEAST (via Goa) | 29,000"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Continent / Baltic (Handy)",
                "paragraphs": [
                  "Sentiment: 🟡 Flat to slight improvment",
                  "Yet to see what levels being fixed this week to see what direction we are going. There is a wider spread between ows offer and chrtrs bid this week, with ows carrying momentum from last week fixtures. For moment sentiment is flat on the continent.",
                  "Out of baltic we are seeing very few cargoes for end july ,,, bunge has one to usec which is rating very low 30s tce of 7k skaw. Quite the spread from tc orders at 11k skaw for similar direction. otherwise few stems for 1h aug.",
                  "For continent, backhaul trips to usg/usec seeing levels at 12k aps bss 38k dwt. For short grains run rouen/cadiz chrtrs rating 12500 aps on 39k dwt which is quite close. There are also some requirements for short period with last done at 14,300 on 35k dwt and in the 15s on 37k dwt. This week seeing chrtrs bidding arnd same levels.",
                  "Tonnage list is healthy at 40 vessels next 30d",
                  "Benchmarks (38k)",
                  "Route | Rate",
                  "Cont / Med Clean | 14,000",
                  "Baltic → WAFR | 16,500",
                  "Baltic → WAFR (HRA) | 17,500",
                  "Baltic → East Med Scrap | 16,000",
                  "Cont → USG | 12,000",
                  "Cont → ECSA | 8,500",
                  "Cont → Singapore/Japan | 13,750"
                ]
              },
              {
                "name": "Continent / Baltic (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟡 Softening",
                  "Tonnage list counts now 15 / 20 units total for Cont and Baltic, while cargo list very short with around 4 cargoes. Market is decreasing up there with last scrap fixture heard at 26k on UMX and I feel might be even bit lower, so benchmark as follow",
                  "Benchmarks (Imabari 63)",
                  "Route | Rate",
                  "Cont/Baltic → WAFR | 18,000",
                  "Cont/Baltic → WAFR (HRA) | 19,500",
                  "Cont → East Med Scrap | 25,500",
                  "Cont → USG Clean | 16,000",
                  "Cont → ECSA Clean | 14,500"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "Russia Market",
                "paragraphs": [
                  "Sentiment: 🟢 Strong",
                  "The ongoing escalation in the Black Sea region has profoundly disrupted the maritime shipping sector. The market has effectively bifurcated into shipowners who strictly avoid the region and a limited group of owners demanding unprecedented premiums to execute fixtures. Handy's Russian cargo is flat",
                  "increased AWRP and Goa cost",
                  "• Supra Black Sea → Far East: 30k+",
                  "• Ultramax → Far East: 32k+"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-07-15",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-07-15",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Outlook report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Overall Sentiment: Steady",
        "Weekly Freight Market Update (Handy / Supramax / Ultramax)",
        "Executive Summary",
        "Region | Sentiment | Trend",
        "FEAST | 🟢 Firm | Strengthening",
        "SE Asia | 🟢 Firm | Improving",
        "AG / WCI | 🟡 Flat | Stable",
        "South Africa | 🟢 Firm | Improving",
        "ECSA Handy | 🟡 Stable | Balanced",
        "ECSA SMX/UMX | 🟢 Firm | Stable",
        "West Africa | 🟢 Strong | Tight",
        "US Gulf Handy | 🔴 Softening | Bearish",
        "US Gulf SMX/UMX | 🟡 Correcting | Slightly Weaker",
        "Med / Black Sea Handy | 🟢 Firm | Positive",
        "Med / Black Sea SMX/UMX | 🟢 Firm | Positive",
        "Continent / Baltic Handy | 🟡 Flat-Firm | Stable",
        "Continent / Baltic SMX/UMX | 🟢 Firm | Stable",
        "Russia | 🟢 Strong | Tight"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "The FEAST market opened the week on a very active note with strong enquiry across the region. Typhoon-related delays have tightened prompt tonnage, providing additional support to freight levels.",
                  "NOPAC continues to be the main demand driver, while backhaul activity remains relatively flat. Prompt vessels are being absorbed quickly, allowing owners to maintain firm ideas. Period activity has also accelerated, supported by a stronger paper market.",
                  "Market Guidance (BSS BS63 DOP CJK)",
                  "Route | Rate",
                  "NOPAC | 19,500",
                  "Australia | 18,500",
                  "SE Asia | 18,000",
                  "Continent / Med | 20,000",
                  "WCCA | 19,500",
                  "Reported Fixtures",
                  "• SMX CJK → SE Asia: mid 17s",
                  "• UMX CJK → China (iron ore): 19k",
                  "• UMX North China → WCCA: 20k",
                  "• UMX South Korea → NOPAC RV: low 20s"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "Southeast Asia (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Improving",
                  "Typhoon disruptions in China continue to delay vessels in South and Mid-China, tightening prompt tonnage availability. Fresh cargoes have increased, particularly on Indonesia–SE Asia coal routes, while rising bunker prices are giving owners greater confidence.",
                  "Period demand remains steady, particularly for Ultramax tonnage.",
                  "Market Guidance (BSS BS63 DOP HK)",
                  "Route | Rate",
                  "Indo / Thailand | 18,000",
                  "Indo / China | 17,500",
                  "Indo / India | 21,500",
                  "Australia RV | 19,000",
                  "Spot SMX | 19,000",
                  "Spot UMX | 22,000",
                  "Fixtures",
                  "• Indonesia → USG: 15k",
                  "• South China → Bangladesh: 22k",
                  "• SE Asia → Indonesia: 21k",
                  "• Indonesia → Australia RV: 22k"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "Arabian Gulf / West Coast India (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟡 Flat",
                  "Activity remains subdued as the Indian monsoon reaches peak season.",
                  "Key developments:",
                  "• Strait of Hormuz closure continues to discourage owners.",
                  "• Salt cargoes remain limited.",
                  "• Omani port congestion is causing operational delays.",
                  "• Rising bunker prices continue to support freight expectations.",
                  "East Coast India remains comparatively resilient due to healthy domestic coastal demand.",
                  "Broker Guidance (Imabari 63)",
                  "Route | Bid | Offer",
                  "AG / WCI | 20k | 22k",
                  "AG / ECI | 20k | 22k",
                  "AG / FEAST | 20k | 22k",
                  "WCI / FEAST | 16k | 18k",
                  "Short Period AG | 18k | 20k",
                  "Short Period WCI | 17k | 19k"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "South Africa (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "The market continues to strengthen as manganese ore tenders increase following the reopening of the Port Elizabeth BOT terminal.",
                  "Although end-July tonnage remains available, forward demand for early August has improved noticeably, supporting stronger forward pricing.",
                  "Recent Fixtures",
                  "Vessel | Voyage | Rate",
                  "Wooyang Aries (63k) | SAFR → SGP/JPN | 24k + 240k",
                  "Crimson Glory (58k) | PE → ECI | 25k + 250k",
                  "Benchmarks",
                  "Route | Rate",
                  "SAFR / Far East | 24k + 240k",
                  "SAFR / ECI | 26k + 260k",
                  "SAFR / Backhaul | 22k"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "East Coast South America (Handy)",
                "paragraphs": [
                  "Sentiment: 🟡 Stable",
                  "The market remains balanced with slightly stronger activity driven by North Brazil cargoes. Argentina's Transatlantic market remains relatively quiet while commodity traders continue to struggle placing volumes.",
                  "Route Guidance (37k)",
                  "Route | Rate",
                  "ECSA / TA | 23,250",
                  "ECSA / SGP-JPN | 21,500",
                  "UPR / South Africa | 23,000",
                  "Coastal South Brazil | 17,500",
                  "Coastal North Brazil | 19,500"
                ]
              },
              {
                "name": "East Coast South America (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "Although activity has slowed somewhat, freight levels remain firm and Panamax strength continues to support the market.",
                  "Broker Guidance",
                  "Route | Rate",
                  "RECA TA I63 | 34,000",
                  "RECA TA T58 | 31,000",
                  "SBRAZ TA I63 | 33,000",
                  "NBRAZ TA I63 | 33,500",
                  "SBRAZ FH I63 | 19,500 + 950k",
                  "SBRAZ FH T58 | 17,500 + 750k"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "West Africa (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Strong",
                  "West Africa continues to maintain strong freight levels.",
                  "• Tonnage remains tight.",
                  "• South Atlantic market remains healthy.",
                  "• Owners continue to command premium levels.",
                  "Guidance",
                  "Route | Rate",
                  "TA Short Duration | 26–27k",
                  "Far East → India | Low 30s",
                  "Far East → China | 28–29k",
                  "FH via ECSA | 25–26k",
                  "TA via ECSA | 21–22.5k"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US Gulf (Handy)",
                "paragraphs": [
                  "Sentiment: 🔴 Softening",
                  "Cargo enquiry has slowed while inbound tonnage continues to grow.",
                  "Although rates have remained stable for several weeks, the market now appears to be entering a corrective phase.",
                  "Spot Levels (38k)",
                  "Route | Rate",
                  "TA / Cont | 20k",
                  "TA / Med | 21k",
                  "Intra Americas | 19k",
                  "West Coast | 22k",
                  "Far East | 18k",
                  "ECSA | 14k"
                ]
              },
              {
                "name": "US Gulf (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟡 Correcting",
                  "For the first time in several weeks the market has begun to soften.",
                  "Growing tonnage availability and increased interest from ballasters have reduced owners' negotiating power. Current weakness appears to be a seasonal correction rather than a significant downturn."
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Mediterranean / Black Sea (Handy)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "Freight levels remain strong with healthy grain activity from the Black Sea supporting the market.",
                  "West Mediterranean vessels continue to ballast toward North Brazil and the USEC where earnings remain more attractive.",
                  "Benchmarks (38k)",
                  "Route | Rate",
                  "Black Sea → West Med | 14,500",
                  "Black Sea → Continent | 14,000",
                  "Black Sea → FEAST | 17,000 (Suez)",
                  "Black Sea → FEAST (COGH) | 16,000",
                  "Black Sea → USG | 12,000",
                  "Black Sea → ECSA | 10,000"
                ]
              },
              {
                "name": "Mediterranean / Black Sea (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "The market remains tight with only around 15 prompt vessels available. Continued grain exports from the Black Sea are supporting rates and expectations remain positive for late July and early August.",
                  "Benchmarks (Imabari 63)",
                  "Route | Rate",
                  "EMED → WAFR Clinker | 17,500 / 18,500 (HRA)",
                  "WMED → WAFR Clinker | 20,000 / 21,000 (HRA)",
                  "EMED → USG Clean | 15,000",
                  "EMED → USG Cement | 17,000",
                  "EMED via CVB TA Grain | 18,500",
                  "EMED → FEAST (via Goa) | 26,000"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Continent / Baltic (Handy)",
                "paragraphs": [
                  "Sentiment: 🟡 Flat to Firm",
                  "The market remains steady despite expectations of a slight softening.",
                  "Backhaul trades from the Baltic continue to command healthy levels, while WAFR and scrap cargoes remain supportive.",
                  "Benchmarks (38k)",
                  "Route | Rate",
                  "Cont / Med Clean | 14,000",
                  "Baltic → WAFR | 15,500",
                  "Baltic → WAFR (HRA) | 16,500",
                  "Baltic → East Med Scrap | 15,000",
                  "Cont → USG | 11,500",
                  "Cont → ECSA | 8,500",
                  "Cont → Singapore/Japan | 13,750"
                ]
              },
              {
                "name": "Continent / Baltic (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: 🟢 Firm",
                  "The market remains firm with continued support from scrap cargoes.",
                  "Benchmarks (Imabari 63)",
                  "Route | Rate",
                  "Cont/Baltic → WAFR | 19,500",
                  "Cont/Baltic → WAFR (HRA) | 21,000",
                  "Cont → East Med Scrap | 27,500",
                  "Cont → USG Clean | 17,000",
                  "Cont → ECSA Clean | 15,500"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "Russia Market",
                "paragraphs": [
                  "Sentiment: 🟢 Strong",
                  "The Russian Supra market remains very firm, with vessel availability continuing to tighten.",
                  "Recent fixtures indicate:",
                  "• Supra Black Sea → Mombasa: 25k",
                  "• Supra Black Sea → Far East: 25k+",
                  "• Ultramax → Far East: 28.5k",
                  "Handysize cargoes remain supported by continued grain exports from CVB."
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "Overall Market Outlook",
      "Region | Outlook",
      "FEAST | 🟢 Strong",
      "SE Asia | 🟢 Improving",
      "AG/WCI | 🟡 Stable",
      "South Africa | 🟢 Firm",
      "ECSA | 🟢 Stable-Firm",
      "West Africa | 🟢 Strong",
      "US Gulf | 🔴 Correcting",
      "Mediterranean / Black Sea | 🟢 Strong",
      "Continent / Baltic | 🟢 Firm",
      "Russia | 🟢 Strong",
      "Key themes this week:",
      "• Typhoon disruptions continue to tighten Asian tonnage.",
      "• South Atlantic markets remain robust with limited vessel supply.",
      "• Black Sea grain exports continue to underpin Mediterranean strength.",
      "• US Gulf has entered its first meaningful correction after several weeks of elevated levels.",
      "• Rising bunker prices are providing additional support to owners across most regions."
    ]
  },
  {
    "id": "dry-bulk-2026-05-13",
    "title": "GRD Dry Report",
    "publishedDate": "2026-05-13",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Transcribed report image",
      "importedDate": "2026-09-09",
      "dateNote": "Image labelled 13th May, with no year printed. The year 2026 is taken from the accompanying email, sent on 14 May 2026."
    },
    "summary": "Regional market commentary and broker rate guidance transcribed from the report image.",
    "overview": {
      "paragraphs": [
        "Handy, Supramax and Ultramax regional commentary, fixtures and indicative broker guidance. Original rate abbreviations and bases are retained."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm",
                  "BSS BS63 DOP CJK",
                  "NOPAC: | 19,000",
                  "AUS: | 18,500",
                  "TO SEASIA: | 18,500",
                  "CONT/MED: | 19,500",
                  "WCCA: | 17,500",
                  "Fixtures:",
                  "• Smx in nchina fxd ard 18k nchina/seasia",
                  "• Umx in china fxd ard 21k to india",
                  "• Umx in Cjk fxd ard 19k for 1yr",
                  "The FEAST market remains steady, supported by a healthy flow of cargo activity and Australian demand. Backhaul demand, firm FFA levels and some Panamax stems fixing on Ultramaxes add upward pressure on rates. Period activity has been noted, reflecting an overall steady sentiment."
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SEASIA SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm",
                  "Seasia saw an uptick this week with improved cargo flow and relatively flat tonnage supply. Stronger demand for UMX with some PMX stems covered on UMX. Aussie cargoes remain a main driver and levels hold firm. Period activity ongoing in south with UMX targeting low 20ks for SP and SMX in the v high teens. For Indo/India runs - chrts bidding 20ks vs owners asking mid 20ks on UMX open Seasia. We expect a positive trend to continue.",
                  "Key Fixtures:",
                  "• Umx open seasia fixed low 20ks Aussie rv",
                  "• Smx open seasia fixed 16ks for BH via goa in",
                  "• Smx open seasia fixed mid teens Thai/Seasia",
                  "SEASIA - BSS BS63 DOP HK",
                  "Indo / Thai | 17,250",
                  "Indo / China | 17,000",
                  "Indo / India | 23,000",
                  "Aus Rv | 19,000",
                  "Sp SMX | 18,500",
                  "Sp UMX | 21,000"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG/WCI SMX/UMX",
                "paragraphs": [
                  "Sentiment: Neutral",
                  "AG/WCI was quiet with limited fresh enquiry and few fixtures. Salt cargoes to FE and iron ore tenders surfaced. Limited activity from Oman/Fujairah. Tighter tonnage in South Africa attracted more vessels south.",
                  "ECI remained subdued with softer iron ore bids. Tonnage supported by firmer Pacific market despite quiet sentiment.",
                  "Guidance as brokers on Imabari 63 dwt",
                  "(bid v offer) - indicative only",
                  "Ag/WCI | 22,000 vs 24,000",
                  "Ag/ECI | 22,000 vs 24,000",
                  "Ag/FEAST | 22,000 vs 24,000",
                  "WCI/FEAST | 13,000 vs 15,000",
                  "Speriod AG | 18,000 vs 20,000",
                  "Speriod WCI | 17,000 vs 19,000",
                  "Smx/Umx tonnage count:",
                  "Area | 10 Days | 30 Days | (1 Week Ago)",
                  "AG | 6 | 10 | (5 / 6)",
                  "WCI | 23 | 31 | (30 / 35)",
                  "RSEA | 4 | 7 | (9 / 12)"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SAFR SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm",
                "Week started quietly but fundamentals remain firm. Supply tight with ~8 open ships vs cargo list of 10+ stems, mainly manganese and coal. More ballasters from PG/WCI, though prompt tonnage remains tight. End May laycans postponed due to bad weather disruptions.",
                "Reported fixtures include an eco Ultra at 24+240 SAFR fronthaul and a Supra at 18.5k DOP Mombasa for 2 laden legs, redelivery Sing/Japan.",
                "Near-term sentiment remains firm given the tight supply, though incoming ballasters should be monitored.",
                "BSI 63 Benchmarks",
                  "SAFR/FH | 23+230",
                  "SAFR/India | 24+240",
                  "Backhaul | 21,000"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA HANDY",
                "paragraphs": [
                  "Sentiment: Softening",
                  "Market is definitely softening with a very limited cargo list and owners increasingly spot exposed. Tonnage list building up while fresh cargo remains scarce.",
                  "Recent Fixtures:",
                  "• 28DWT Imbituba: $16,750 APS Turkey",
                  "• 40DWT: $22,000 APS RECA/NN Fortaleza",
                  "• 37DWT San Lorenzo (21-25 May): $18,000 WWR UPR/N.Brazil",
                  "• 40DWT: $28,000 WWR UPR/E.Med",
                  "• 32DWT: $18,000 APS UPR/Egypt Med",
                  "• 28DWT: $18,000 APS UPR/China",
                  "• 38DWT clean: $23,000 APS UPR/China (petcoke)",
                  "Route Guidance (BSS 37K Saiki)",
                  "ECSA/TA | $21,500",
                  "ECSA/Spore-Japan | $20,500",
                  "UPR/South Africa | $21,000",
                  "ECSA Coastal S. Brazil | $17,000",
                  "ECSA Coastal N. Brazil | $18,000"
                ]
              },
              {
                "name": "ECSA SMAX/UMAX",
                "paragraphs": [
                  "Sentiment: Positive",
                  "Continuation of last week with plenty of activity early in the week. TA and FH very positive on the back of PMX rally spillovers. Ballasters showing appetite supported by flat to negative sentiment in Cont/Med/ Americas. FH demand dominated by China destination as PMXes took off. Room for UMAX rates to increase, more so on FH route. FFA supporting sentiment. Mid-term connectivity on forward bookings; longer term less populated.",
                  "Broker Rates + Guidance",
                  "RECA TA I63 | 31,000 USD",
                  "RECA TA T58 | 28,000 USD",
                  "SBRAZ TA I63 | 30,000 USD",
                  "SBRAZ TA T58 | 27,000 USD",
                  "NBRAZ TA I63 | 30,000 USD",
                  "NBRAZ TA T58 | 26,000 USD",
                  "SBRAZ FH I63 (able 63/10) | 19,500+950K USD",
                  "SBRAZ FH T58 | 16,250+625K USD"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm",
                  "WAFR quiet this week vs strong FH activity last week. South Atl strong driven by PMX paper and market. Big UMX cubic cap fixed 19+900 on PMX cargo. Cargoes from ECSA rating SMX passing Gib 14/15k, bringing WAFR TA prob in high teens for SMX and close to 20k for UMX, similar on FH.",
                  "UMX Benchmarks (Sub Secs and Dely in WAFR)",
                  "WAFR TA Short Dur | 19/20,000 USD",
                  "WAFR FH to India | 24/25,000 USD",
                  "WAFR FH to China | 22/23,000 USD",
                  "WAFR FH via ECSA | 21/22,000 USD",
                  "WAFR TA via ECSA | 18/19,000 USD"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "USG HANDY",
                "paragraphs": [
                  "Sentiment: Positive",
                  "Quiet start but market trending bullish after rate uptick late last week. Supply/demand balance shifting towards owners' favour. Tonnage opening in ECMEX-Keywest down to ~65 vessels next 30 days (WoW -10). Spot availability stabilizing. Sentiment positive as market resists lower bids and moves up. Fixtures already hitting $20k.",
                  "Today's Spot Levels (38k dwt)",
                  "TA/Cont | 17,000",
                  "TA/Med | 18,000",
                  "Intra-Americas | 15,000",
                  "WC (sub duration) | 18-19,000",
                  "FH | 19,000",
                  "ECSA | 12,000"
                ]
              },
              {
                "name": "USG SMX/UMX",
                "paragraphs": [
                  "Sentiment: Neutral",
                  "Activity average 34 vessels covered. Intercaribs down, TARV up, FH stable. 27 vessels US + 15 NCSA + 14 USEC = 56 vessels vs 11 US + 6 USEC + 1 NCSA = 18 cargoes. Ratio 56 vs 18 won't lead to a move up, even if vessels more transparent than cargoes. Petcoke expecting move up for B/L June but not massive. Grains flood remain stable. Panama Canal issues remain - last auction 300k with 7 days waiting.",
                  "Rate Guidance (USD)",
                  "TARV | 28,500/24,000",
                  "FH | 25,000/22,000",
                  "India | 27,500/23,000",
                  "WCCA | 30,000 / 27,000 (petcoke)",
                  "Int USG | 19,000 / 17,000",
                  "ECSA | 18,000 / 16,000"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA HANDY",
                "paragraphs": [
                  "Sentiment: Soft",
                  "Market keeping the same negative trend. Cargo list short: 7 in Black Sea, 2 in East Med and 4 in West Med. Black Sea mainly grains Ukraine to West Med, cement Canakkale to USEC, soda ash Derince to Continent. West Med dramatic - ships ballasting to USEC or N.Brazil. Only gypsum Morocco to USG bidding 8k vs 9.25k and gypsum Safi to Dordrecht.",
                  "Fixtures:",
                  "• 38k dwt open Span Med fixed W.Med/Cont at 9k aps",
                  "• 32k dwt open C.Med fixed Morocco/ Bangladesh at 13.5k aps",
                  "BSS 38K DWT Benchmarks",
                  "BSEA/W Med (Canakkale) | 8,750 USD",
                  "BSEA/Cont | 8,500 USD",
                  "BSEA/FEAST (Suez) | 14,500 USD",
                  "BSEA/FEAST (via Cape) | 13,500 USD",
                  "BSEA/USG-USEC | 8,250 USD",
                  "(OHBS 8,750 Cement 10,500)",
                  "BSEA/ECSA | 6,500 USD",
                "Next 3 weeks: 28 ships in B.Sea-E.Med, 27 ships in W.Med. Holiday week ahead; expect softening in coming weeks."
                ]
              },
              {
                "name": "MED / BLACK SEA - SMX/UMX",
                "paragraphs": [
                  "Sentiment: Soft",
                  "Situation unchanged. East Med ships ballasting to West Med; those in West fixing ECSA cargoes. Some Owners sending ships open in East Med directly to ECSA. Shorter tonnage list this week. Last done clinker to Wafr at 11k on UMX (+1k).",
                  "BSS Imabari 63 Benchmarks",
                  "EMed/Wafr Clinker (non HRA) | 11,000",
                  "EMed/Wafr Clinker (HRA) | 12,000",
                  "WMed/Wafr Clinker (non HRA) | 12,000",
                  "WMed/Wafr Clinker (HRA) | 13,000",
                  "EMed/USG Clean Cargo | 9,000",
                  "EMed/USG Cement | 10,000",
                  "EMed via CVB TA Grain dely Canakkale | 9,500",
                  "EMed FH (FEAST) via Goa | 17,000",
                "Recovery in Med likely from June when more grain cargoes may appear."
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONTI/BALTIC HDY",
                "paragraphs": [
                  "Sentiment: Softening",
                  "Softening. Few new May cargoes; limited requirement for same runs. 13 cargoes (incl sub sale) vs 53 vessels opening next 30 days",
                "Baltic: 40k open in UK fixed subs 16k skaw for scrap Baltic/Emed. Levels under mid teens. 38k fixed grains to Ponta Delgada at 15,250. Trips down to SW Africa bid 14–14.5k vs 16k skaw.",
                "Cont: spanmed cargoes rating 9-11k vs 12-13k. Scrap 34k fixed 13k Glasgow/Morocco. Little TA/FH activity.",
                  "Market Benchmarks (38k dwt)",
                  "CONT/MED | 12,000 USD",
                  "CONT/WAFR (non HRA) | 13,000 USD",
                  "CONT/WAFR (HRA) | 14,000 USD",
                  "SCRAP BALTIC/E MED | 15,000 USD",
                  "CONT/USG | 9,500 USD",
                  "CONT/ECSA | 7,500 USD",
                  "CONT/SGP-JPN | 12,750 USD"
                ]
              },
              {
                "name": "CONTI/BALTIC SMX–UMX",
                "paragraphs": [
                  "Sentiment: Neutral",
                  "Demand limited; scrap leading the market with UMX levels in very low 20k’s. Grains to WAFR non-HRA bidding UMXs at 16/17k. Rare inbound to States fixing high 10k’s levels for UMX.",
                  "BSS Imabari 63 Benchmarks",
                  "CONT–BALTIC/WAFR (non HRA) | 16,500 USD SKAW",
                  "CONT–BALTIC/WAFR (HRA) | 18,000 USD SKAW",
                  "CONT/E MED SCRAP | 22,000 USD",
                  "CONT/USG CLEAN | 11,000 USD",
                  "CONT/ECSA CLEAN | 10,000 USD"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "Sentiment: Soft",
                  "After a slight activity we are back to a quiet market for both Handy and Supras.",
                  "Still no cargoes to Med. On Handies, cargoes to ECSA around 9k Canakk.",
                  "On Supras, usual EAFR destinations around 17k Canakk."
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2026-05-06",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-05-06",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Week Overview | Geneva Dry Week Impact"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (Far East) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm",
                  "The FEAST market continues to show resilience and underlying strength, supported by:",
                  "Tightening tonnage supply, especially for prompt positions",
                  "Strong demand for backhaul (BH) business",
                  "Increasing NoPac enquiry volume",
                  "Despite charterers maintaining low bids for NoPac, the growing shortage of available tonnage suggests that:",
                  "➡️ Rates are likely to move upward as charterers adjust to secure coverage.",
                  "📊 Rate Guidance (BSS BS63 DOP CJK)",
                  "NoPac: 18,500",
                  "Australia: 17,500",
                  "SE Asia: 17,500",
                  "Continent/Mediterranean: 19,500",
                  "WCCA: 17,000",
                  "🔑 Market Highlights",
                  "Short-period activity remains active",
                  "FEAST tonnage list becoming tight",
                  "Upward pressure building, especially for Pacific trades",
                  "📌 Fixtures",
                  "Ultramax (N China → SP): ~20k",
                  "Ultramax (N China → South): mid 17k",
                  "58k (Japan → Med): ~19k",
                  "➡️ Conclusion: Market expected to firm further, led by tightening supply and stronger Pacific demand."
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE Asia – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Soft → Stabilizing",
                  "The week began with clear bid-offer gaps:",
                  "Offers: High 20ks (UMX)",
                  "Bids: Low 20ks (Indonesia/India runs)",
                  "⚖️ Market Dynamics",
                  "Cargo flow thin, especially Indonesia",
                  "Australian demand remains key support",
                  "Higher prompt tonnage vs last week",
                  "However:",
                  "➡️ Market is showing early signs of recovery, supported by:",
                  "Return of market participants post-holidays",
                  "Rising paper market (FFA)",
                  "Stable to slightly firmer Asian index",
                  "📊 Rate Guidance (BSS BS63 DOP HK)",
                  "Indo/Thailand: 15,000",
                  "Indo/China: 14,500",
                  "Indo/India: 20,500",
                  "Australia RV: 18,000",
                  "Short Period:",
                  "SMX: 19,000",
                  "UMX: 20,500",
                  "📌 Fixtures",
                  "UMX (Singapore → Indo/SE Asia): 17–18k",
                  "UMX (SE Asia → Australia RV): Low 20ks",
                  "➡️ Conclusion: Market likely to gradually firm, though still fragile due to uneven cargo flow."
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG/WCI (Arabian Gulf / West Coast India) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Cautious / Subdued",
                  "Market activity remains muted, influenced by:",
                  "Geopolitical tensions in the Strait of Hormuz",
                  "Rising bunker prices (Fujairah)",
                  "Limited fresh cargo demand",
                  "⚖️ Supply & Demand",
                  "Salt exports: Thin",
                  "Oman/Fujairah local cargoes: providing some balance",
                  "Some demand to South Africa",
                  "Monsoon season approaching → potential short-term cargo push",
                  "📊 Rate Ideas (Imabari 63)",
                  "AG/WCI trades: 22k vs 24k (bid/offer)",
                  "WCI → FEAST: 13k vs 15k",
                  "Short period:",
                  "AG: 18k–20k",
                  "WCI: 17k–19k",
                  "🚢 Tonnage Trends",
                  "AG supply slightly increasing",
                  "WCI tonnage decreasing",
                  "Red Sea supply tightening significantly",
                  "➡️ Conclusion: Market remains quiet but balanced, with upside dependent on cargo recovery and geopolitical stability."
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "South Africa – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm / Positive",
                  "A notable improvement this week driven by:",
                  "Increased cargo count (~14 cargoes)",
                  "Strong demand for:",
                  "Coal",
                  "Manganese ore",
                  "⚖️ Supply Side",
                  "~10 vessels open → tightening list",
                  "Limited ballasters",
                  "📈 Rates",
                  "Ultramax: 23k + 230k (FEAST direction)",
                  "➡️ Conclusion:",
                  "Firm tone expected to continue, supported by tightening tonnage and steady demand."
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA – Handy",
                "paragraphs": [
                  "Sentiment: Firm / Positive",
                  "Market remains very strong, driven by:",
                  "High cargo volume (May)",
                  "Strong owner resistance on rates",
                  "Active forward fixing",
                  "📊 Route Guidance (37k DWT)",
                  "TA: 24,250",
                  "Spore/Japan: 24,000",
                  "South Africa: 23,000",
                  "Coastal Brazil:",
                  "South: 17,750",
                  "North: 19,750",
                  "📌 Fixtures",
                  "36k: 23k (APS Rio Grande → Venezuela)",
                  "42k: 29.5k (WCSA)",
                  "➡️ Conclusion:",
                  "Market expected to stay strong, with continued cargo support."
                ]
              },
              {
                "name": "ECSA – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Positive / Active",
                  "Strong demand across TA and Far East routes",
                  "Previous bottleneck now clearing",
                  "Ballasters returning, but uneven distribution",
                  "Key Trends",
                  "China demand picking up",
                  "FFA rising → owners less eager to fix forward",
                  "Supply pressure from adjacent markets persists",
                  "📊 Rate Guidance",
                  "TA:",
                  "I63: 27–30k",
                  "T58: 24–27k",
                  "FH (to China):",
                  "I63: 18,250 + 825k",
                  "T58: 15,750 + 575k",
                  "➡️ Conclusion:",
                  "Momentum is positive, supported by global demand recovery."
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Active / Firm",
                  "Strong Far East demand",
                  "TA remains quiet but supported by ECSA strength",
                  "📊 Benchmarks",
                  "TA: 18–19k",
                  "FH India: 24–25k",
                  "FH China: 22–23k",
                  "➡️ Conclusion:",
                  "Market remains stable with FH strength leading."
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US Gulf (USG)",
                "paragraphs": [
                  "Handy",
                  "Sentiment: Flat but Stable",
                  "Rates holding despite lack of increase",
                  "Owners favor Inter-Caribbean over ballasting",
                  "📊 Levels (38k DWT)",
                  "TA Cont: 16k",
                  "TA Med: 17k",
                  "FH: 19k",
                  "➡️ Expectation: Late-May strengthening",
                  "SMX/UMX",
                  "Sentiment: Uncertain but Supported",
                  "Activity reduced due to holidays",
                  "Supply-demand imbalance (61 vessels vs ~14 cargoes), BUT:",
                  "Tonnage dispersed",
                  "Delays tightening real availability",
                  "📊 Rate Ideas",
                  "TA: 26.5k (UMX) / 22.5k (SMX)",
                  "India: 27.5k / 22k",
                  "WCCA: 32k / 28k",
                  "➡️ Conclusion:",
                  "Market not weakening despite fundamentals, uncertainty remains short-term."
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Mediterranean / Black Sea",
                "paragraphs": [
                  "Handy",
                  "Sentiment: Negative",
                  "Severe lack of cargo",
                  "Owners ballasting to Brazil",
                  "📊 Benchmarks",
                  "BSEA/Cont: 8.5k",
                  "BSEA/FEAST: 12–13.5k",
                  "BSEA/ECSA: 6.5k",
                  "➡️ Conclusion:",
                  "No recovery expected before end-May",
                  "SMX/UMX",
                  "Sentiment: Weak",
                  "Long tonnage list (~35 vessels)",
                  "Limited cargo flow",
                  "Ballasting to WMed/Atlantic increasing",
                  "➡️ Conclusion:",
                  "Market remains under pressure"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Continent / Baltic",
                "paragraphs": [
                  "Handy",
                  "Sentiment: Softening",
                  "Limited cargo flow",
                  "Healthy vessel supply (~40 ships)",
                  "📊 Benchmarks",
                  "Cont/Med: 13k",
                  "Cont/WAFR: 13–13.75k",
                  "Cont/ECSA: 7.5k",
                  "➡️ Conclusion:",
                  "Downward pressure persists",
                  "SMX/UMX",
                  "Sentiment: Soft",
                  "Low activity",
                  "Owners holding unrealistic expectations vs bids",
                  "📊 Benchmarks",
                  "Cont/WAFR: 17–18k",
                  "Baltic/EMed scrap: 21.5–23k",
                  "➡️ Conclusion:",
                  "Market remains inactive and soft"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "Russia (Black Sea exports)",
                "paragraphs": [
                  "Slight improvement in activity",
                  "Rates:",
                  "USG: 10–11k",
                  "ECSA: 8–9k",
                  "East Africa: 17–18k",
                  "➡️ Conclusion:",
                  "Still subdued but marginally improving"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "📌 Global Key Takeaways",
      "✅ Strong Regions",
      "FEAST → tightening supply, upward pressure",
      "ECSA (Handy & SMX/UMX) → strong cargo demand",
      "South Africa & WAFR → firm with active flows",
      "⚖️ Balanced / Transitional",
      "SE Asia → recovering from soft start",
      "USG → stable but uncertain",
      "AG/WCI → quiet, geopolitically sensitive",
      "❌ Weak Regions",
      "Med / Black Sea → oversupply, low cargo",
      "Continent / Baltic → softening trend",
      "🔮 Outlook (Short-Term)",
      "Upside drivers:",
      "Tight tonnage in FEAST",
      "Strong Atlantic demand (ECSA, SAFR)",
      "Rising FFAs",
      "Downside risks:",
      "Geopolitical tensions (Middle East)",
      "Seasonal slowdown (monsoon impact)",
      "Weak Mediterranean demand"
    ]
  },
  {
    "id": "dry-bulk-2026-04-29",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-04-29",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Week Overview | Geneva Dry Week Impact",
        "🧭 Executive Summary",
        "The global dry bulk market is entering a softer, more cautious phase, with:",
        "Pacific (FEAST / SE Asia): Clearly softening, with rising tonnage and weaker demand",
        "Atlantic (ECSA / USG): Mixed—Handy weakening, Supra/Ultra stabilizing but fragile",
        "Indian Ocean / MEG / WAFR: Dislocated and event-driven (Hormuz closure, Geneva Dry)",
        "South Africa: Tightening → one of the few firm markets",
        "Med / Continent / Baltic: Oversupplied and underperforming",
        "📉 Macro drivers:",
        "Geneva Dry reducing activity globally",
        "Increased ballasting (India → SE Asia, WAFR → ECSA)",
        "Weakening cargo flow in multiple basins",
        "Geopolitical friction (Hormuz closure) distorting normal trade routes",
        "🌏 PACIFIC BASIN"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (Far East) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Soft (but not collapsing)",
                  "Key Points:",
                  "Tonnage increasing → more competition",
                  "NOPAC demand weak → limited absorption",
                  "Backhaul = main support pillar",
                  "Charterers testing lower levels",
                  "Period market slowing",
                  "Rates (BS63 DOP CJK indicative):",
                  "NOPAC: 18k",
                  "SE Asia: 17.5k",
                  "Cont/Med: 16.5k",
                  "WCCA: 15.5k",
                  "Fixtures:",
                  "UMX N China → Bangladesh: low 22k",
                  "UMX 1-year TC: ~20k",
                  "Outlook:",
                  "Short-term soft, but:",
                  "➡️ Conditional optimism post–Labor Day if demand recovers"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE ASIA – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Softening (accelerating vs last week)",
                  "Key Points:",
                  "Failed subs → early sign of downturn",
                  "Ballasters from India increasing supply",
                  "Indo runs quieter",
                  "Aussie cargo = main support",
                  "Golden Week slowing cargo flow",
                  "Rates (BS63 DOP HK):",
                  "Indo/China: 14.5k",
                  "Indo/India: 22k",
                  "Indo/Thai: 15k",
                  "Aussie RV: 17.5k",
                  "Fixtures:",
                  "ECI → Indo coal: ~19k",
                  "SE Asia → Cont: ~17k",
                  "Aussie RV: mid 18k",
                  "Outlook:",
                  "➡️ Further softening expected short-term",
                  "➡️ Potential rebound post-holidays if cargo returns"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "om AG / WCI (Middle East / India)",
                "paragraphs": [
                  "Sentiment: Distorted / regionally pressured",
                  "Key Points:",
                  "Not following Pacific strength",
                  "Hormuz Strait closure → major disruption",
                  "Vessel congestion (Sohar / Fujairah / Salalah)",
                  "UMX units drifting toward Indonesia",
                  "SA market pulling Indian tonnage",
                  "Indicative Levels (Imabari 63):",
                  "AG/WCI: 24–26k",
                  "AG/ECI: 23–25k",
                  "WCI/FEAST: 13–15k",
                  "Outlook:",
                  "➡️ Artificial tightness + inefficiencies",
                  "➡️ Direction depends heavily on geopolitical developments"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA (SAFR) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm (standout strong region)",
                  "Key Points:",
                  "Demand stable (~8 cargoes: coal + manganese)",
                  "Supply tightening (limited ballasters)",
                  "Low prompt vessel count",
                  "Fixtures:",
                  "23k + 230k BB → China",
                  "22k + 220k BB → SE Asia",
                  "Benchmarks:",
                  "FH: 23 + 230",
                  "WCI: 25 + 250",
                  "Outlook:",
                  "➡️ Upward pressure likely",
                  "➡️ One of the few bullish pockets globally",
                  "🌎 ATLANTIC BASIN"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA – HANDY",
                "paragraphs": [
                  "Sentiment: Flat → Bearish",
                  "Key Points:",
                  "Demand slowing",
                  "Rates easing on TA and FH",
                  "Activity still decent but losing momentum",
                  "Fixtures:",
                  "38k → Med: 25k aps",
                  "40k → China: 21.5k aps",
                  "S. Brazil → TA: 22k aps",
                  "Outlook:",
                  "➡️ Gradual softening unless demand rebounds"
                ]
              },
              {
                "name": "ECSA – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Flat / fragile",
                  "Key Points:",
                  "Demand softer N & S Brazil",
                  "Supply building (incl. WAFR ballasters)",
                  "Charterers less urgent",
                  "China/PMX spillover reduced",
                  "Rates:",
                  "Recalada TA: ~29k",
                  "S Brazil TA: ~28k",
                  "N Brazil TA: ~26k",
                  "Risks:",
                  "Oversupply from West Med / USG",
                  "Weak forward demand",
                  "Outlook:",
                  "➡️ Needs demand recovery to sustain levels",
                  "➡️ Otherwise risk of gradual decline"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US GULF – HANDY",
                "paragraphs": [
                  "Sentiment: Flat → improving later",
                  "Key Points:",
                  "Tonnage tightening (−15 vessels WoW)",
                  "Demand weak short-term",
                  "Owners still ballasting to Brazil",
                  "Rates:",
                  "TA: 15–16k",
                  "FH: 19k",
                  "ECSA: 11k",
                  "Outlook:",
                  "➡️ Bullish bias for 2H May"
                ]
              },
              {
                "name": "US GULF – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Stable → slightly soft",
                  "Key Points:",
                  "Strong resistance despite vessel-heavy ratio",
                  "FH weaker (Panama delays impacting)",
                  "Petcoke demand supportive",
                  "Grain steady but not strong",
                  "Rates:",
                  "TA RV: 26.5k (UMX)",
                  "FH: 24k",
                  "WCCA: 32k",
                  "Outlook:",
                  "➡️ No strong upside catalyst",
                  "➡️ Likely stable to slightly down"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Quiet but firm offers",
                  "Key Points:",
                  "Very slow activity (Geneva effect)",
                  "Owners holding firm despite low volume",
                  "Rates:",
                  "TA: 18–19k",
                  "FH India: 22–23k",
                  "FH China: 20–21k",
                  "Outlook:",
                  "➡️ Illiquid market → hard to read",
                  "➡️ Could move quickly with new cargo",
                  "🇪🇺 EUROPE / MEDITERRANEAN"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Med / Black Sea – HANDY",
                "paragraphs": [
                  "Sentiment: Bearish",
                  "Key Points:",
                  "Very limited cargo (mostly grains, cement)",
                  "Oversupply growing",
                  "West Med extremely weak",
                  "Rates:",
                  "BSEA/Cont: 9k",
                  "BSEA/USG: ~8.7k",
                  "Morocco → USG: ~7.5k",
                  "Outlook:",
                  "➡️Continued pressure  downward",
                  "➡️ Owners considering ballasting out"
                ]
              },
              {
                "name": "Med / Black Sea – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Depressed",
                  "Key Points:",
                  "Almost no cargo in East Med",
                  "Tonnage list heavy",
                  "Ships ballasting to ARAG for scrap",
                  "Rates:",
                  "EMED/WAFR: 10–11k",
                  "EMED/FH: ~17k",
                  "Outlook:",
                  "➡️ Continued weakness with no short-term catalyst"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Continent / Baltic – HANDY",
                "paragraphs": [
                  "Sentiment: Softening",
                  "Key Points:",
                  "Cargo scarce (7 total)",
                  "Vessel count high (51)",
                  "Wide bid/offer spreads",
                  "Rates:",
                  "Cont/Med: 15.2k",
                  "Cont/USG: 10.2k",
                  "Cont/ECSA: 8.7k",
                  "Outlook:",
                  "➡️ Downward pressure continues"
                ]
              },
              {
                "name": "Cont / Baltic – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Stable (low activity)",
                  "Key Points:",
                  "Reduced tonnage vs last week",
                  "Geneva Dry slowing market",
                  "Scrap & grain still main drivers",
                  "Rates:",
                  "Baltic scrap → Med: 24–25k",
                  "Cont/SAFR: 18k",
                  "Outlook:",
                  "➡️ Stable but thin liquidity"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA / BLACK SEA EXPORTS",
                "paragraphs": [
                  "Sentiment: Weak but active in pockets",
                  "Key Points:",
                  "Limited grain flows",
                  "Freight disagreement persists",
                  "Pressure from Panamax segment",
                  "Rates:",
                  "BSEA → WAFR: ~13.5k (Handy)",
                  "BSEA → Red Sea: ~18–19k (Supra)",
                  "Additional Factor:",
                  "Cheap Russian bunkers remain competitive advantage"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "🔮 FORWARD VIEW (NEXT 1–3 WEEKS)",
      "📉 Bearish / Soft Regions",
      "FEAST / SE Asia (oversupply + weak demand)",
      "Med / Black Sea (structural oversupply)",
      "ECSA Handy (cooling demand)",
      "⚖️ Balanced / Fragile",
      "ECSA Supra/Ultra",
      "USG (both segments)",
      "WAFR (illiquid but firm tone)",
      "📈 Bullish / Firm",
      "South Africa (tight supply)",
      "Potential USG upside mid-May",
      "⚠️ Key Risks to Watch",
      "Geopolitics: Hormuz Strait disruption",
      "Seasonality: Post–Golden Week demand rebound",
      "Ballaster flows: India → SE Asia, WAFR → Atlantic",
      "Cargo recovery: Especially NOPAC + Brazil",
      "🧩 Bottom Line",
      "The market is transitioning from:",
      "“firm but uneven” → “soft with isolated strength”",
      "Supply is increasing in most basins",
      "Demand is inconsistent and often delayed",
      "Owners are starting to lose pricing power (except SAFR)",
      "👉 Bias: Slightly negative short-term",
      "👉 Hope: Demand rebound mid-May could stabilize key routes"
    ]
  },
  {
    "id": "dry-bulk-2026-04-22",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-04-22",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Overall Tone: Firm to Mixed (regionally divergent)"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (Far East) – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Firm",
                  "The FEAST market continues to build upward momentum, supported by solid cargo demand and sustained backhaul activity. Enquiry remains consistent across steel, slag, and clinker, while tightening vessel supply keeps upward pressure on rates.",
                  "Tonnage: Stable week-on-week, but effectively tight",
                  "Trend: Spot rates rising; period activity increasing",
                  "Key dynamic: Demand outpacing available supply",
                  "Rate Indications (BSS BS63 DOP CJK):",
                  "NOPAC: 18,750",
                  "Australia: 18,000",
                  "SE Asia: 18,000",
                  "Continent / Med: 17,000",
                  "WCCA: 16,500",
                  "Notable Fixtures:",
                  "Ultra, CJK → USG ~14k",
                  "Ultra, N. China → USEC ~16k",
                  "Ultra, N. China → WCI ~22k"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE ASIA – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Firm / Squeezed",
                  "The SE Asia market is tightening further, driven largely by strong India-bound demand. Owners are pushing rates higher, while charterers face increasing difficulty securing prompt tonnage.",
                  "Owners: Increasing offers (≥30k for WCI/ECI Indo)",
                  "Charterers: Paying premiums for prompt vessels",
                  "Cargo flow: Thin on Indo/China, improving Indo/Thai",
                  "Period: Short period deals in low 20s",
                  "Key Fixtures:",
                  "Aussie RV: 23.5k",
                  "India: 31k",
                  "Bangladesh clinker: 27k",
                  "Rate Guidance (BSS BS63 DOP HK):",
                  "Indo/Thai: 17,500",
                  "Indo/China: 17,000",
                  "Indo/WCI: 25,500",
                  "Indo/ECI: 24,500",
                  "Aussie RV: 20,000",
                  "SMX: 19,000",
                  "UMX: 20,500"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI",
                "paragraphs": [
                  "Sentiment: Stable",
                  "The market remains largely unchanged, though geopolitical tensions continue to weigh on sentiment.",
                  "WCI: Weak (limited China salt exports)",
                  "ECI: Stronger returns for owners",
                  "Preference: Coastal / South Africa trades",
                  "Indicative Levels (Imabari 63):",
                  "AG/WCI: 24k bid / 26k offer",
                  "AG/ECI: 23k / 25k",
                  "AG/FEAST: 22k / 24k",
                  "WCI/FEAST: 11k / 13k"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA (SAFR) – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Slightly Positive",
                  "A relatively flat week, but fundamentals remain supportive.",
                  "Supply: Adequate (12 vessels next 30 days)",
                  "Demand: Slower, but steady via ore, coal, grains",
                  "Ballasters: Limited inbound activity",
                  "Key Insights:",
                  "FH offers: ~23–24k + BB",
                  "Bids: ~22–23k",
                  "Backhaul: Quiet"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA – HANDY",
                "paragraphs": [
                  "Sentiment: Firm / Positive",
                  "Strong cargo flow and tight prompt supply continue to support rates.",
                  "Demand: Healthy across grains and regional trades",
                  "Supply: Tight (early May especially)",
                  "Recent Fixtures Highlights:",
                  "Recalada → Med: ~19.5k–22k APS equivalent",
                  "Brazil → China (grains): 23.5k DOP",
                  "Brazil → Morocco: ~24k APS equivalent",
                  "Guidance (37k dwt):",
                  "TA: 22,250",
                  "Spore/Japan: 22,000",
                  "S. Africa: 21,000",
                  "Coastal Brazil: 17k–19k"
                ]
              },
              {
                "name": "ECSA – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Positive",
                  "A strong start to the week driven by Transatlantic demand from South Brazil.",
                  "Supply: Tight for May",
                  "North Brazil: Softer",
                  "Forward market: Active, supported by FFA improvements",
                  "Broker Guidance:",
                  "SBRAZ TA (I63): ~29k",
                  "RECA TA: ~29.75k",
                  "NBRAZ TA: ~26.5k",
                  "SBRAZ FH: ~17.25k + BB"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Quiet but Supported",
                  "Low cargo volume, but Atlantic strength maintains overall stability.",
                  "FH spread: Significant (Spore vs non-Spore capable vessels)",
                  "Activity: Limited, some via ECSA",
                  "Benchmarks:",
                  "TA: 18–19k",
                  "FH India: 19–20k",
                  "FH China: 21–22k",
                  "Via ECSA: 19–20k"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US GULF – HANDY",
                "paragraphs": [
                  "Sentiment: Cautiously Positive",
                  "Market showing early signs of strengthening despite flat spot rates.",
                  "Demand: Increasing (May–July cargoes)",
                  "Supply: Rising slightly (9 vessels added)",
                  "Outlook: Forward cargoes likely at higher levels",
                  "Spot Levels (38k dwt):",
                  "TA/Cont: 14k",
                  "TA/Med: 16k",
                  "FH: 16k",
                  "WC: 16–17k"
                ]
              },
              {
                "name": "US GULF – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Slightly Up",
                  "Tight tonnage list supporting firmer rates, though positional factors remain key.",
                  "Vessel/Cargo ratio: Misleading due to off-market ships",
                  "Panama Canal: Ongoing uncertainty",
                  "Strong trades: TA RV (up to 31k)",
                  "Rate Ideas:",
                  "TA RV: 28k (UMX) / 24k (SMX)",
                  "FH: 25k / 21k",
                  "India: 27k / 22k",
                  "WCCA: 32k / 28k"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA – HANDY",
                "paragraphs": [
                  "Sentiment: Negative",
                  "Market continues downward trend with increasing tonnage and limited cargo.",
                  "Supply: High (65 vessels across regions)",
                  "Demand: Weak, mainly grains",
                  "Benchmarks (38k dwt):",
                  "BSEA/Cont: 9k",
                  "BSEA/FEAST: 13–14k",
                  "BSEA/USG: ~9–11k"
                ]
              },
              {
                "name": "MED / BLACK SEA – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Depressed",
                  "Very limited cargo activity with oversupply of vessels.",
                  "Owners ballasting out to find employment",
                  "Rates nearing bottom",
                  "Benchmarks (Imabari 63):",
                  "EMED/WAFR: 10–11k",
                  "WMED/WAFR: 12–13k",
                  "EMED/USG: 8.5–9.5k",
                  "FEAST FH: ~17k"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONTI / BALTIC – HANDY",
                "paragraphs": [
                  "Sentiment: Flat",
                  "Cargo count declining while vessel supply increases.",
                  "Supply: Rising (46 vessels next 30 days)",
                  "Demand: Limited late April activity",
                  "Benchmarks:",
                  "Cont/Med: 15,250",
                  "Cont/WAFR: 14,500–15,000",
                  "Baltic/Med Scrap: 16k"
                ]
              },
              {
                "name": "CONTI / BALTIC – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Firm",
                  "Strong grain and scrap demand driving rate improvements.",
                  "Charterers: Increasing bids",
                  "Supply: Tight (~19 vessels)",
                  "Benchmarks (Imabari 63):",
                  "Cont/WAFR: 17–18k",
                  "Cont/SAFR: 18k",
                  "Baltic/Med Scrap: 21.5–22k"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "Sentiment: Weak",
                  "Handy: Limited grain activity",
                  "Supra: Continued downward pressure",
                  "Strategy: Owners fixing forward to avoid spot exposure"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "🔎 Overall Market View",
      "Strong Regions: FEAST, SE Asia, ECSA, Continent",
      "Stable: AG/WCI, USG",
      "Weak: Med / Black Sea, Russia",
      "Key Theme:",
      "👉 Tight tonnage in the Atlantic and Far East supporting rates",
      "👉 Oversupply in the Mediterranean dragging regional performance",
      "Outlook:",
      "The global dry bulk market remains structurally firm, with localized weakness. Strength in Atlantic and Pacific basins is expected to offset pressure in the Med, supporting a cautiously bullish near-term outlook."
    ]
  },
  {
    "id": "dry-bulk-2026-04-15",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-04-15",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Overall Tone: Firm with regional divergences"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (Far East) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm",
                  "📊 Rate Indications (BSS BS63 DOP CJK)",
                  "NOPAC: $18,000",
                  "Australia: $17,000",
                  "SE Asia: $16,500",
                  "Continent/Med: $16,500",
                  "WCCA: $15,500",
                  "🧭 Market Overview",
                  "The FEAST market remains active and firm, supported primarily by backhaul (BH) demand. While NOPAC volumes have softened slightly, the tonnage list is gradually increasing week-on-week.",
                  "Despite this, strong demand for BH cargoes and spot business continues to support rates, with charterers often needing to pay a premium to secure prompt vessels.",
                  "⚓ Notable Fixtures",
                  "Ultramax (CJK) → NOPAC: ~$18K",
                  "Ultramax (CJK) → Australia: mid-$17K",
                  "Ultramax (CJK) spot: $18.5K",
                  "55K DWT (Japan) → Bangladesh: $16.5K"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE Asia – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm / Bullish Momentum",
                  "🧭 Market Overview",
                  "Momentum from last week continues, with owners pushing rates upward and holding back tonnage.",
                  "Strong period interest (UMX fixing ~$19–20K)",
                  "BH cargoes at high teens (APS)",
                  "Australia demand driving Indo/Philippines markets",
                  "Limited Indo/China cargo volumes",
                  "A key dynamic: tight vessel supply toward India, forcing charterers to explore alternatives. ECI commands a significant premium, with China-origin ships fixing mid-$20Ks to Bangladesh.",
                  "📊 Rate Guidance (BSS BS63 DOP HK)",
                  "Indo/Thailand: $16,000",
                  "Indo/China: $15,500",
                  "Indo/India:",
                  "WCI: $21,500",
                  "ECI: $20,500",
                  "Australia RV: $18,000",
                  "Spot SMX: $17,500",
                  "Spot UMX: $19,000",
                  "⚓ Key Fixtures",
                  "UMX Indo/WCI: $23,500",
                  "UMX Indo/India: $20K",
                  "UMX Indo/Thai: $16K",
                  "UMX Indo → Australia RV: ~$19K"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Stable with Risk Premiums",
                  "🧭 Market Overview",
                  "Market remains largely unchanged, but geopolitical tensions are heavily influencing sentiment:",
                  "High war risk premiums for Gulf calls",
                  "Many vessels opting for safer loading zones (east of Hormuz)",
                  "Regional trends:",
                  "WCI: Weak export volumes (salt, iron ore)",
                  "ECI: Supported by coastal trades + Indo demand",
                  "Continued rice exports to West Africa",
                  "📊 Indicative Levels (Imabari 63)",
                  "AG/WCI: $24K vs $26K",
                  "AG/ECI: $23K vs $25K",
                  "AG/FEAST: $22K vs $24K",
                  "WCI/FEAST: $11K–13K",
                  "🚢 Tonnage Snapshot",
                  "AG supply steady",
                  "WCI tonnage decreasing (supportive)",
                  "RSEA slightly tightening"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "South Africa (SAFR) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Slightly Soft",
                  "🧭 Market Overview",
                  "Market opened softer with fixtures below prior levels.",
                  "~16 vessels on coast + limited ballasters",
                  "Demand supported by coal exports, but manganese volumes easing",
                  "Charterers showing limited urgency",
                  "📊 Benchmarks (BSI 63)",
                  "SAFR → WCI: 24.5 + 245",
                  "SAFR → ECI: 24 + 240",
                  "SAFR → FH: 21 + 210",
                  "SAFR → BH: 18"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA – Handy",
                "paragraphs": [
                  "Sentiment: 📈 Firm / Positive",
                  "🧭 Market Overview",
                  "Strong demand for:",
                  "Front haul (FH)",
                  "Transatlantic cargoes",
                  "Owners reluctant to commit to North Brazil, pushing coastal rates higher.",
                  "📊 Route Guidance (37K DWT)",
                  "TA: $21K",
                  "Far East: $20.5K",
                  "South Africa: $20K",
                  "Coastal S. Brazil: $16.5K",
                  "Coastal N. Brazil: $18.5K"
                ]
              },
              {
                "name": "ECSA – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Firm / Positive",
                  "🧭 Market Overview",
                  "Strong TA demand from South Brazil & Recalada",
                  "Limited supply overall, though slight April oversupply risk",
                  "Ballasters pressuring North Brazil, supporting South",
                  "Outlook remains constructive into May, supported by:",
                  "Positive FFA sentiment",
                  "Spillover from Panamax market",
                  "📊 Broker Guidance",
                  "RECA TA (I63): $28,250",
                  "S. Brazil TA (I63): $27,500",
                  "N. Brazil TA (I63): $24,500",
                  "S. Brazil FH: $17,750 + 775K BB"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Quietly Firm",
                  "🧭 Market Overview",
                  "Stable and supported by tight tonnage list",
                  "Local cargo volume still slow",
                  "Rates sensitive to bunker conditions (BOD impact)",
                  "📊 UMX Levels",
                  "TA: $18–19K",
                  "FH India: $18–19K",
                  "FH China: $16–18K",
                  "Via ECSA: $17–18K"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US Gulf – Handy",
                "paragraphs": [
                  "Sentiment: Mixed (Improving Demand / Oversupply)",
                  "🧭 Market Overview",
                  "Tonnage still high but declining WoW",
                  "Demand improving unevenly",
                  "Stronger activity from USEC / EC Canada (wood pellets)",
                  "📊 Spot Levels (38K DWT)",
                  "TA Cont: $12K",
                  "TA Med: $12.5–13K",
                  "FH: $13K",
                  "WC: $12–14K",
                  "ECSA: $7K"
                ]
              },
              {
                "name": "US Gulf – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Slightly Up",
                  "🧭 Market Overview",
                  "Rates holding steady despite slower activity",
                  "Tightening tonnage list supporting market",
                  "Panama Canal congestion worsening",
                  "📊 Rate Ideas",
                  "TA RV: $23K (UMX) / $18.5K (SMX)",
                  "FH: $23K / $18K",
                  "India: $25K / $20K",
                  "ECSA: $17.75K / $15K"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Med / Black Sea – Handy",
                "paragraphs": [
                  "Sentiment: Negative",
                  "🧭 Market Overview",
                  "Severe lack of cargoes",
                  "Increasing tonnage list",
                  "Minimal recovery signals",
                  "📊 Benchmarks (38K DWT)",
                  "BSEA/MED: $8.75K",
                  "BSEA/FEAST: $13–14K",
                  "BSEA/USG: $9–11.5K",
                  "BSEA/ECSA: $7.5K"
                ]
              },
              {
                "name": "Med / Black Sea – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Softening",
                  "🧭 Market Overview",
                  "Weak demand + large tonnage oversupply (~35 ships)",
                  "Vessels ballasting west in search of employment",
                  "📊 Benchmarks (Imabari 63)",
                  "EMed/WAFR: $10–11K",
                  "WMed/WAFR: $12–13K",
                  "FH (FEAST): $17K"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Continent / Baltic – Handy",
                "paragraphs": [
                  "Sentiment: Firm",
                  "🧭 Market Overview",
                  "Healthy cargo flow for end-April",
                  "Limited prompt tonnage supporting rates",
                  "📊 Benchmarks (38K DWT)",
                  "Cont/MED: $15,250",
                  "Cont/WAFR: $14.5–15K",
                  "Baltic Scrap/EMed: $16.5K"
                ]
              },
              {
                "name": "Continent / Baltic – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Stable → Potential Upside",
                  "🧭 Market Overview",
                  "Fewer scrap stems but tight tonnage list",
                  "Rates may firm if demand picks up",
                  "📊 Benchmarks",
                  "Scrap Baltic/EMed: $18.5–19K",
                  "Cont/WAFR: $15.5–16.5K",
                  "Baltic/USG: $12K"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "Russia Market",
                "paragraphs": [
                  "Sentiment: Weak / Restricted",
                  "🧭 Market Overview",
                  "Limited activity due to trade restrictions & vessel eligibility",
                  "Only a small subset of vessels able to trade Russia routes",
                  "📊 Indications",
                  "Handy FH: ~$16K Canakkale",
                  "Supra (BSEA → EC Africa): Low $20Ks"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "🔎 Final Takeaways",
      "Strongest Regions: FEAST, SE Asia, ECSA",
      "Stable but Risky: AG/WCI (geopolitics-driven)",
      "Soft Zones: Med / Black Sea, SAFR",
      "Key Themes:",
      "Tight tonnage in key regions supporting rates",
      "Geopolitical risks impacting routing & premiums",
      "Panama Canal congestion adding inefficiencies",
      "Owners showing increased pricing discipline"
    ]
  },
  {
    "id": "dry-bulk-2026-04-08",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-04-08",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "week overview – post-easter reopening"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "feast smx/umx",
                "paragraphs": [
                  "sentiment: firm",
                  "the feast market has resumed with stronger participation following the easter holidays. while nopac demand remains relatively flat, backhaul activity continues to underpin the market. a tightening tonnage list is driving firmer levels, with increasing period activity—short-period deals concluded in the high $18,000s.",
                  "rate indications (bss bs63 dop cjk)",
                  "nopac: $17,500",
                  "australia: $17,000",
                  "se asia: $16,500",
                  "continent/mediterranean: $16,000",
                  "wcca: $15,500",
                  "notable fixtures",
                  "umx cjk → nopac rv: low $17,000s",
                  "umx feast → 1-year period: $17,000s",
                  "umx n china → wafr: high $17,000s"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "se asia smx/umx",
                "paragraphs": [
                  "sentiment: firming",
                  "a slow start to the week due to holidays gave way to improving activity. aussie rounds remain supportive, particularly for eci tonnage. increased indo/se asia runs are tightening prompt supply.",
                  "owners show preference for longer voyages and china-bound cargoes, while indonesia/india runs see limited vessel interest.",
                  "rate indications (bss bs63 dop hk)",
                  "indo/thailand: $14,500",
                  "indo/china: $14,000",
                  "indo/india:",
                  "wci: $19,000",
                  "eci: $18,500",
                  "australia rv: $17,500",
                  "short period smx: $16,500",
                  "short period umx: $18,000"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "ag / wci smx/umx",
                "paragraphs": [
                  "sentiment: stable with geopolitical uncertainty",
                  "market activity has adapted to ongoing routing constraints, with vessels operating outside the strait of hormuz. coastal and regional trades remain active, while wci continues offering discounted rates for non-hra vessels.",
                  "a potential ceasefire agreement introduces upside uncertainty, though impact remains unclear.",
                  "broker guidance (imabari 63 dwt)",
                  "ag/wci: $24,000 – $26,000",
                  "ag/eci: $23,000 – $25,000",
                  "ag/feast: $22,000 – $24,000",
                  "wci/feast: $11,000 – $13,000"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "south africa (safr) smx/umx",
                "paragraphs": [
                  "sentiment: flat",
                  "post-holiday slowdown with increasing tonnage availability. demand remains limited with only a handful of cargoes in the market.",
                  "market snapshot",
                  "~17 vessels open + 4–5 ballasters",
                  "limited cargo volume (manganese/coal)",
                  "benchmarks (bsi 63)",
                  "safr → wci/pk: 25k + 250",
                  "safr → eci: 24k + 240",
                  "fronthaul: 22k + 220",
                  "backhaul: ~19k"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ecsa handy",
                "paragraphs": [
                  "sentiment: 📈 stable to positive",
                  "firm market driven by tightening tonnage and increasing cargo availability. delays in wafr further support sentiment.",
                  "route guidance (37k dwt)",
                  "ecsa/ta: $19,000",
                  "ecsa/spore-japan: $17,500",
                  "upr/south africa: $18,000",
                  "coastal brazil: $16,000–$17,000"
                ]
              },
              {
                "name": "ecsa smx/umx",
                "paragraphs": [
                  "sentiment: slightly positive",
                  "strong ta demand from south brazil and recalada. limited supply supports rates, while nbrazil remains under pressure due to ballast inflow.",
                  "forward demand exists but is tempered by bunker volatility and geopolitical uncertainty.",
                  "broker indications",
                  "recalada ta (i63): $28,000",
                  "s. brazil ta (i63): $27,000",
                  "n. brazil ta (i63): $24,000",
                  "s. brazil fh (i63): $17,250 + 725k bb"
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "wafr smx/umx",
                "paragraphs": [
                  "sentiment: positive",
                  "strong momentum continues post pre-easter rush. shrinking tonnage list supports rates across the south atlantic basin.",
                  "umx benchmarks",
                  "ta short duration: $18,000–19,000",
                  "fh india: $20,000–21,000",
                  "fh china: $18,500–20,000"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "us gulf handy",
                "paragraphs": [
                  "sentiment: soft but stabilizing",
                  "post-holiday activity remains subdued, though a slight uptick in fixing is observed. prompt tonnage continues to build.",
                  "spot levels (38k dwt)",
                  "ta/cont: $12,000",
                  "ta/med: $12,500",
                  "intra-americas: $9,000",
                  "fh: $10,000",
                  "ecsa: $7,000–8,000"
                ]
              },
              {
                "name": "us gulf smx/umx",
                "paragraphs": [
                  "sentiment: slightly up",
                  "improved balance between supply and demand, with tonnage absorbed into ecsa/nbrazil trades. owners appear less pressured due to alternative employment options.",
                  "rate ideas",
                  "ta rv: $20,000 (umx) / $16,000 (smx)",
                  "fh: $21,000 / $18,000",
                  "india: $22,500 / $18,500",
                  "ecsa: $16,500 / $14,500"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "med / black sea handy",
                "paragraphs": [
                  "sentiment: softening",
                  "very slow start with limited cargo activity. tonnage remains steady, suggesting potential downward pressure in coming weeks.",
                  "benchmarks (38k dwt)",
                  "bsea/med: $9,750",
                  "bsea/feast: $13,000–14,000",
                  "bsea/usg: ~$9,500",
                  "bsea/ecsa: $7,000"
                ]
              },
              {
                "name": "med / black sea smx/umx",
                "paragraphs": [
                  "sentiment: soft",
                  "long tonnage list (~35 vessels) and limited fresh demand. market expected to soften further in the near term.",
                  "benchmarks",
                  "emed/wafr: $11,500–12,500",
                  "emed/usg: $10,000–11,500",
                  "emed/feast: ~$17,000"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "cont / baltic handy",
                "paragraphs": [
                  "sentiment: improving",
                  "post-easter cargo flow picking up, with prompt ships being quickly absorbed.",
                  "benchmarks",
                  "cont/med: $15,500",
                  "cont/wafr: $14,250–15,000",
                  "baltic/emed scrap: $16,500"
                ]
              },
              {
                "name": "cont / baltic smx/umx",
                "paragraphs": [
                  "sentiment: positive (umx-led)",
                  "increased cargo flow, especially scrap. tonnage remains relatively tight (~20 vessels).",
                  "benchmarks (imabari 63)",
                  "cont/safr: $17,000",
                  "baltic/wafr: $14,500–15,500",
                  "baltic/emed scrap: $17,500–18,000"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "russia (black sea & baltic)",
                "paragraphs": [
                  "handy",
                  "sentiment: quiet",
                  "weak grain flow, limited fixtures",
                  "rate gap persists between bids and offers",
                  "supra",
                  "sentiment: under pressure",
                  "high bunkers and limited vessel suitability",
                  "rates: ~$18.5k–19.5k vs offers $23k–24k"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "overall market view",
      "atlantic basin: gradually tightening with stronger ecsa/wafr support",
      "pacific basin: firming driven by supply constraints and aussie demand",
      "indian ocean: stable with geopolitical upside risk",
      "mediterranean/black sea: lagging, with softening bias",
      "conclusion:",
      "the market is showing early signs of firm recovery post-easter, led by tightening supply and improved cargo flow in key regions. however, regional divergence remains, with the atlantic outperforming the mediterranean."
    ]
  },
  {
    "id": "dry-bulk-2026-04-01",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-04-01",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09"
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Week Overview | Pre-Easter Market Dynamics"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (Far East) – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Steady",
                  "The FEAST market remains stable with a noticeable uptick in activity ahead of the Easter holidays. Tonnage availability is tightening week-on-week, while backhaul demand continues to provide underlying support. NOPAC rounds remain largely flat, and period interest is steady, supported by consistent demand from the paper sector.",
                  "📊 Rate Indications (BSS BS63 DOP CJK)",
                  "NOPAC: 16,500",
                  "Australia: 16,000",
                  "SE Asia: 15,500",
                  "Continent / Med: 15,000",
                  "WCCA: 15,000",
                  "⚓ Notable Fixtures",
                  "UMX fixed low 14s (split to WCSA)",
                  "UMX fixed low 16s (trip south)",
                  "UMX on subs ~18s (spot/prompt)"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE ASIA – SMX / UMX",
                "paragraphs": [
                  "Tonnage Count: Increasing",
                  "Market activity is gradually building, driven by short-period interest and early-week fixtures. Continuous inflow of ballasters from ECI into West Australia and Singapore is maintaining healthy supply.",
                  "Backhaul cargoes from South China and Vietnam are discussed in the mid-teens. Indo/China remains thin but improving slightly, while Indo/India continues to command premium rates.",
                  "Owners are showing increased willingness to fix ahead of holidays.",
                  "⚓ Fixtures",
                  "UMX China → SE Asia: mid 12k",
                  "SMX China → Backhaul: ~13k",
                  "SMX SE Asia → N. Ore/China: 17k",
                  "UMX ECI → Australia RV: 12.5k",
                  "📊 Rate Indications (BSS BS63 DOP HK)",
                  "Indo/Thai: 12,500",
                  "Indo/China: 12,000",
                  "Indo/India: 18,000",
                  "Australia RV: 16,500",
                  "Spot SMX: 15,500",
                  "Spot UMX: 17,500"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Volatile",
                  "Geopolitical tensions in the Middle East continue to drive volatility. WCI demand remains subdued, while ECI offers comparatively stronger returns.",
                  "📊 Broker Guidance (Imabari 63 DWT)",
                  "| Route | Bid | Offer",
                  "| AG → WCI | 24,000 | 26,000",
                  "| AG → ECI | 23,000 | 25,000",
                  "| AG → FEAST | 22,000 | 24,000",
                  "| WCI → FEAST | 11,000 | 13,000",
                  "| SP AG | 17,000 | 19,000",
                  "| SP WCI | 16,000 | 18,000"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Flat to Slightly Negative",
                  "A softer tone emerges as tonnage supply increases. Demand remains supported by manganese ore and coal exports, but forward freight is trading at a discount.",
                  "📊 Benchmarks (BSI 63)",
                  "SAFR → PK/WCI: 24.5 + 245",
                  "SAFR → ECI: 23.5 + 235",
                  "SAFR → FH: 22 + 220",
                  "SAFR → BH: 19"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA – HANDY",
                "paragraphs": [
                  "Sentiment: Positive Trend 📈",
                  "The market is strengthening, supported by tightening tonnage and increased forward activity. Larger Handies are expected to follow SMX upward momentum.",
                  "⚓ Recent Fixtures",
                  "35k DWT: 16,250 APS UPR/China",
                  "34k DWT Itaqui: 15,500 APS Bourgas",
                  "35k DWT Santos: 18,000 APS W. Med",
                  "37k DWT RECA: 21,500 APS WCSA",
                  "📊 Route Guidance (37K DWT)",
                  "ECSA → TA: 18,500",
                  "ECSA → Spore/Japan: 16,750",
                  "UPR → South Africa: 17,500"
                ]
              },
              {
                "name": "ECSA – SMAX / UMAX",
                "paragraphs": [
                  "Sentiment: Strong / Heating Up",
                  "A surge in activity, particularly on transatlantic routes, has tightened tonnage supply. Reduced ballasting and rising cargo volumes are driving rate increases.",
                  "📊 Key Levels",
                  "RECA TA: 28,500",
                  "S. Brazil TA: 27,500",
                  "N. Brazil TA: 25,000",
                  "FH (UMAX): ~16,750 + 675k",
                  "Bunker prices remain a critical factor influencing voyage economics."
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR – SMX / UMX",
                "paragraphs": [
                  "Trend: Sharp Upward Spike",
                  "Despite stable cargo volumes, strong ECSA momentum is pushing rates higher.",
                  "📊 Benchmarks (UMX)",
                  "TA Short Duration: 16,500–17,500",
                  "FH India: 20,000–21,000",
                  "FH China: 18,500–20,000"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US GULF – HANDY",
                "paragraphs": [
                  "Sentiment: Negative",
                  "Market continues downward due to weak demand and oversupply of vessels. Laycan mismatches persist, and owners are increasingly flexible to secure employment.",
                  "📊 Spot Levels (38K DWT)",
                  "TA/Cont: 12k",
                  "TA/Med: 13k",
                  "Intra-Americas: 10k",
                  "FH: 14k",
                  "ECSA: 8k"
                ]
              },
              {
                "name": "US GULF – SMX / UMX",
                "paragraphs": [
                  "Trend: Softening",
                  "Rates have declined across all routes. Despite a high number of fixtures last week, forward demand remains weak and cargo timing mismatched.",
                  "Market uncertainty persists, including concerns over Panama Canal congestion and post-Easter direction.",
                  "📊 Forward Ideas",
                  "TA: 17k (UMX) / 13k (SMX)",
                  "FH: 19.5k / 14.5k",
                  "India: 21.5k / 17k"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA – HANDY",
                "paragraphs": [
                  "Sentiment: Softening",
                  "Rates remain stable but with downward pressure expected. Activity is limited, and tonnage lists are increasing ahead of holidays.",
                  "📊 Benchmarks (38K DWT)",
                  "BSEA → Med/Cont: 10,000",
                  "BSEA → FEAST: 13,000–14,000",
                  "BSEA → USG: 10,000–13,000",
                  "BSEA → ECSA: 9,000"
                ]
              },
              {
                "name": "MED / BLACK SEA – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Quiet",
                  "Limited cargo availability and stable tonnage list are keeping the market subdued. Easter is expected to further slow activity.",
                  "📊 Benchmarks (Imabari 63)",
                  "EMed → USG: ~10,250",
                  "EMed → FEAST: ~17,500",
                  "WMed → WAFR: 15,000–16,000"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONTINENT / BALTIC – HANDY",
                "paragraphs": [
                  "Sentiment: Soft",
                  "Cargo flow has improved slightly, but overall supply still outweighs demand.",
                  "📊 Benchmarks",
                  "Cont → Med: 14,500",
                  "Cont → WAFR: 13,750–14,250",
                  "Cont → USG: 10,250",
                  "Cont → ECSA: 9,000"
                ]
              },
              {
                "name": "CONTINENT / BALTIC – SMX / UMX",
                "paragraphs": [
                  "Trend: Weak",
                  "Charterers are covering positions early ahead of Easter, leading to reduced activity.",
                  "📊 Benchmarks (Imabari 63)",
                  "Cont → SAFR: 19,000",
                  "Baltic → WAFR: 14,500–15,500",
                  "Scrap Baltic → Med: ~17,000"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA / BLACK SEA",
                "paragraphs": [
                  "Activity: Limited",
                  "Grain flows remain subdued, with charterers targeting lower rates while owners hold firm.",
                  "Supra to East Africa: 19k–21.5k",
                  "Colombo: ~12k (36k dwt)",
                  "Forward cargoes: bids 18–19k vs offers 23–24k"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "📌 OVERALL MARKET OUTLOOK",
      "Pre-Easter effect: Increasing activity early week, followed by expected slowdown",
      "Strong regions: ECSA (especially SMX/UMX), WAFR spillover",
      "Weak regions: USG, Continent/Baltic, Med",
      "Key drivers:",
      "Tightening tonnage in Atlantic",
      "Ballaster flows in Asia",
      "Bunker prices",
      "Geopolitical uncertainty (AG/WCI)",
      "Short-term expectation:",
      "Markets likely to stabilize at current levels through Easter, with potential upside in the Atlantic basin depending on post-holiday cargo momentum."
    ]
  },
  {
    "id": "dry-bulk-2026-03-25",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-03-25",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09",
      "dateNote": "Dated 25 March 2026 inside the report, consistent with the email date. The outer heading and subject say 2025."
    },
    "summary": "The geared bulk market this week presents a mixed but generally softer tone, with regional divergences. While certain areas show resilience due to tighter tonnage or steady cargo flows, global sentiment is largely flat to bearish, driven by geopolitical uncertainty, rising bunker prices, and increasing vessel supply in key regions.",
    "overview": {
      "paragraphs": [
        "GEARED MARKET REPORT – WORLDWIDE",
        "Overall Market Summary",
        "The geared bulk market this week presents a mixed but generally softer tone, with regional divergences. While certain areas show resilience due to tighter tonnage or steady cargo flows, global sentiment is largely flat to bearish, driven by geopolitical uncertainty, rising bunker prices, and increasing vessel supply in key regions."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FAR EAST (FEAST) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Flat",
                  "The FEAST market remains stable, supported by consistent demand for breakbulk (BH steel) and general cargoes, especially those requiring deck and hatch loading.",
                  "NOPAC activity: Subdued, with softer round voyage bids",
                  "Tonnage: Essentially unchanged week-on-week",
                  "Overall: Balanced market with no strong directional push",
                  "Indicative Rates (BSS BS63 DOP CJK):",
                  "NOPAC: $16,000",
                  "Australia: $15,000",
                  "SE Asia: $14,500",
                  "Continent/Mediterranean: $14,500",
                  "WCCA: $14,000",
                  "Conclusion: Stability persists, but lack of momentum in NOPAC limits upside."
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SOUTHEAST ASIA (SEASIA) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Bearish",
                  "Tonnage: Increasing",
                  "The SE Asia market is under pressure, primarily due to:",
                  "Increased ballasters (especially ex-ECI)",
                  "Continued Middle East geopolitical tensions",
                  "Elevated bunker prices",
                  "Key Trends:",
                  "Owners becoming more flexible to secure employment",
                  "Charterers preferring vessels with bunkers onboard",
                  "Stronger demand on:",
                  "Indo/India",
                  "Indo/Thailand",
                  "Limited Indo/China activity",
                  "Rate Direction: Slight decline week-on-week",
                  "Indicative Levels (BS63 DOP HK):",
                  "Indo/Thailand: $12,000",
                  "Indo/China: $11,500",
                  "Indo/India: $16,500",
                  "Australia RV: $15,000",
                  "Conclusion: Oversupply is weighing on rates; further softening expected."
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "ARABIAN GULF / WEST COAST INDIA (AG/WCI)",
                "paragraphs": [
                  "Sentiment: Volatile",
                  "The market remains highly sensitive to geopolitical developments, particularly in the Middle East.",
                  "Key Drivers:",
                  "Rising war risk premiums for Gulf calls",
                  "Weak salt exports (WCI → China) leading to tonnage buildup",
                  "Stable ECI iron ore flows (~$9,000 levels)",
                  "Tonnage Trends:",
                  "WCI supply increasing",
                  "Red Sea activity helping absorb some capacity",
                  "Indicative Levels (Imabari 63):",
                  "AG/WCI: $24k–26k",
                  "AG/ECI: $23k–25k",
                  "WCI/FEAST: $11k–13k",
                  "Conclusion: Volatility persists; external factors dominate market direction."
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA (SAFR) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Stable to slightly firmer",
                  "Tonnage: Tight (~10 vessels open)",
                  "Limited ballasters helping balance supply",
                  "Demand supported by manganese ore and coal",
                  "Rates:",
                  "Ultramax: ~$22k–24k + ballast bonus",
                  "Strong eco vessels achieving premium levels",
                  "Conclusion: Market strength driven by limited supply rather than demand growth."
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "EAST COAST SOUTH AMERICA (ECSA)",
                "paragraphs": [
                  "Handy Segment",
                  "Sentiment: Slightly firmer",
                  "Gradual improvement in cargo flow",
                  "However, long tonnage list caps upside",
                  "Rates:",
                  "TA: ~$18,000",
                  "Spore/Japan: ~$16,500",
                  "SMX/UMX Segment",
                  "Sentiment: Softening",
                  "Demand present but supply (especially WAFR) building",
                  "Large bid/offer spreads reflect uncertainty",
                  "Key Observations:",
                  "TA demand focused on East Med (Egypt)",
                  "Limited Far East activity",
                  "Forward market lacks visibility",
                  "Conclusion: Likely weaker mid–late April levels."
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WEST AFRICA (WAFR) – SMX/UMX",
                "paragraphs": [
                  "Sentiment: Weak / Stable",
                  "Owners reluctant to ballast to ECSA",
                  "Limited activity across routes",
                  "Indicative Levels:",
                  "TA: $14k–15k",
                  "Far East: $16.5k–17.5k",
                  "India: $17k–18k",
                  "Conclusion: Market remains inactive with downward pressure."
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "UNITED STATES GULF (USG)",
                "paragraphs": [
                  "Handy Segment",
                  "Sentiment: Mixed",
                  "Increased cargo demand",
                  "But tonnage oversupply (~85 vessels)",
                  "Rates:",
                  "TA/Cont: $16.5k",
                  "TA/Med: $17k",
                  "FH: $16k",
                  "Conclusion: Mismatch in cargo timing vs vessel availability limits upside.",
                  "SMX/UMX Segment",
                  "Sentiment: Bearish",
                  "Activity down 25–30% WoW",
                  "Severe vessel-to-cargo imbalance (67 vs 18)",
                  "Rates:",
                  "TA: ~$13k–18k",
                  "FH: below $20k",
                  "India: premium market",
                  "Conclusion: Strong downward pressure across most routes."
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MEDITERRANEAN / BLACK SEA",
                "paragraphs": [
                  "Handy",
                  "Sentiment: Negative",
                  "Limited cargoes (especially grain)",
                  "Weak activity across basins",
                  "Rates:",
                  "BSEA/Cont: ~$10.5k",
                  "BSEA/FEAST: $14k–15k",
                  "SMX/UMX",
                  "Sentiment: Softening",
                  "Cement dominates cargo flow",
                  "Weak demand overall",
                  "Rates:",
                  "EMed/WAFR: ~$13.5k–14.5k",
                  "EMed/USG: $11.5k–13k",
                  "Conclusion: Continued downward trend expected."
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONTINENT / BALTIC",
                "paragraphs": [
                  "Handy",
                  "Sentiment: Softening",
                  "Limited cargo supply vs ~40 vessels open",
                  "Rates:",
                  "Cont/USG: $11k",
                  "Cont/ECSA: $9.5k",
                  "SMX/UMX",
                  "Sentiment: Negative",
                  "Weak cargo flow",
                  "Scrap and grain dominate",
                  "Rates:",
                  "Cont/WAFR: $16k–17k",
                  "Baltic/EMed: ~$17.5k",
                  "Conclusion: Lack of cargo continues to pressure rates."
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIAN MARKET",
                "paragraphs": [
                  "Sentiment: Under Pressure",
                  "Bunker price advantage reduced",
                  "Activity limited",
                  "Handy:",
                  "Sri Lanka: ~$13.5k–15k (depending on bunkers)",
                  "Supramax:",
                  "East Africa trips down to ~$17k–18k",
                  "Baltic exports in low-to-mid $10k range",
                  "Conclusion: Market stabilizing slightly but remains weak."
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "FINAL OUTLOOK",
      "Global sentiment: Flat to bearish",
      "Key risks:",
      "Middle East tensions",
      "High bunker prices",
      "Growing vessel supply",
      "Short-term expectation:",
      "Continued softening in most regions",
      "Isolated strength where tonnage tightness persists (e.g., South Africa)"
    ]
  },
  {
    "id": "dry-bulk-2026-03-18",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-03-18",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09",
      "dateNote": "Dated 18 March 2026 inside the report, consistent with the email date. The outer heading and subject say 2025."
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Pacific: Mixed → FEAST stable, SE Asia weak",
        "Atlantic: Broadly soft with oversupply pressure",
        "Key Theme: Bunker costs continue to distort flows, reduce ballasting, and limit liquidity",
        "Near-Term Outlook:",
        "Slight further softening expected globally",
        "Potential rebound in SE Asia if BH demand returns",
        "Market remains highly sensitive to bunker volatility and cargo realization"
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: ➡️ Flat",
                  "The FEAST market remained stable this week, supported by a steady flow of NOPAC cargoes. A continued reduction in prompt tonnage indicates gradual tightening of vessel availability. Backhaul levels remain broadly unchanged.",
                  "Benchmark Levels (BSS BS63 DOP CJK)",
                  "NOPAC: $17,000",
                  "Australia: $16,000",
                  "SE Asia: $14,500",
                  "Continent/Med: $14,000",
                  "WCCA: $14,000",
                  "Market Highlights",
                  "Tonnage list declining week-on-week",
                  "Stable backhaul demand",
                  "Overall balanced conditions",
                  "Fixtures",
                  "64K dwt: ~$17K NOPAC RV",
                  "WCCA coastal: sub $16K equivalent",
                  "Ultramax (S. China): low $12Ks to USG"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "Southeast Asia (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: 📉 Soft / Bearish",
                  "The week opened weak with operators hesitant due to bunker volatility. Tonnage increased, and owners struggled to secure cargo cover.",
                  "Key Drivers",
                  "Slower Indonesian coal exports (Eid impact)",
                  "Reduced Aussie enquiry (WoW)",
                  "Increased sugar flows ex-Thailand (supportive)",
                  "Ballasters from ECI/Bangladesh adding pressure",
                  "Outlook",
                  "Short-term bearish, with potential improvement next week if backhaul demand returns.",
                  "Fixtures",
                  "56K: $12K (Spore → Indo/China)",
                  "61K: $17K (S. China, 2LL)",
                  "64K: $12K BH to USG",
                  "64K: $17K Aussie/China (salt)",
                  "57K: low $13Ks Viet/China",
                  "Indicative Levels (BS63 DOP HK)",
                  "Indo/Thailand: $12,500",
                  "Indo/China: $12,500",
                  "Indo/India: $17,000–17,500",
                  "Aussie RV: $15,500",
                  "Spot SMX: $15,500",
                  "Spot UMX: $17,500"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "South Africa (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: ➡️ Flat",
                  "Market stable week-on-week with tightening tonnage due to fewer inbound ballasters, largely driven by high bunker costs.",
                  "Key Drivers",
                  "Expensive bunkers (~$1,600–1,700 pmt)",
                  "Steady manganese & coal exports",
                  "Owners cautious → slower fixing pace",
                  "Rate Indications",
                  "Fronthaul:",
                  "China: ~21+210",
                  "ECI: ~22.5+225",
                  "Miners targeting: ~24+240 (pe/fh)",
                  "Benchmarks (BSI 63)",
                  "SAFR/WCI: 23K + 230K",
                  "SAFR/ECI: 22.5K + 225K",
                  "SAFR/FEAST: 21.5K + 215K",
                  "Backhaul (Cont/Med): $18.5K APS"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US Gulf (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: 📉 Bearish",
                  "Market continues downward trend with significant oversupply (62 vessels vs 16 cargoes).",
                  "Key Observations",
                  "Strong resistance at low-$20Ks",
                  "Petcoke demand diverging from freight trends",
                  "High bunker costs limiting upside",
                  "Rate Ideas",
                  "Transatlantic:",
                  "UMX: $21K",
                  "SMX: $17.5–18K",
                  "India:",
                  "UMX: $25K",
                  "SMX: $21K",
                  "WCCA:",
                  "UMX: $23K",
                  "Intra-USG:",
                  "UMX: $15.5K"
                ]
              },
              {
                "name": "US Gulf Handy",
                "paragraphs": [
                  "Sentiment: ➡️ Stabilising",
                  "Market still weak but showing signs of forming a floor.",
                  "Spot Levels (38K dwt)",
                  "TA/Cont: $17K",
                  "TA/Med: $18.5K",
                  "Intra Americas: $16,750",
                  "West Coast: $17–19.5K",
                  "Fronthaul: $20K",
                  "ECSA: $15K",
                  "Trend",
                  "Owners shifting toward longer-duration, higher-paying voyages."
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "West Africa (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: 📉 Declining",
                  "Market weakening due to reduced ballast interest and high bunker exposure.",
                  "Rate Indications",
                  "TA via ECSA: low teens",
                  "Short TA: $14–16K",
                  "India: $20–21K",
                  "China: $18.5–19.5K"
                ]
              }
            ]
          },
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "East Coast South America (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: 📉 Soft",
                  "Market under pressure, particularly in the south with increased prompt tonnage.",
                  "Key Points",
                  "TA: low-mid $20Ks (UMX)",
                  "North Brazil expected to soften toward $24K",
                  "Fronthaul: ~16+600",
                  "Weak demand + high bunkers impacting activity",
                  "Outlook",
                  "Further downside expected, but limited by reduced ballasting."
                ]
              },
              {
                "name": "ECSA Handy",
                "paragraphs": [
                  "Sentiment: 📉 Under Pressure",
                  "Tonnage list expanding despite decent cargo demand.",
                  "Key Factors",
                  "Cargoes failing to materialize",
                  "Bunker-driven inefficiencies",
                  "Eco vessels outperforming",
                  "Benchmarks (37–38K dwt)",
                  "TA: $18,750",
                  "Spore/Japan: $17K",
                  "S. Africa: $18K",
                  "Coastal Brazil: $16K"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Mediterranean / Black Sea (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: 📉 Weakening",
                  "Rates declining amid limited cargo availability and large tonnage list.",
                  "Key Levels",
                  "USG cement: $11–13K APS",
                  "Red Sea grains: ~$17K (down from $20K)",
                  "Benchmarks (Imabari 63)",
                  "EMED/WAFR: $14.5–15.5K",
                  "WMED/WAFR: $16.5–17.5K",
                  "EMED/USG: $11.5–13K",
                  "FEAST FH: $18K"
                ]
              },
              {
                "name": "Med / Black Sea Handy",
                "paragraphs": [
                  "Sentiment: ➡️ Short-term stable → softening",
                  "Highlights",
                  "Cargo list shrinking",
                  "Tonnage increasing",
                  "Rates holding but pressure building",
                  "Benchmarks (38K dwt)",
                  "BSEA/Cont: $10.5K",
                  "BSEA/FEAST: $14–15K",
                  "BSEA/USG: $10.5–12K",
                  "BSEA/ECSA: $10K"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Continent / Baltic (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: ➡️ Flat",
                  "Market Overview",
                  "~20 ships in prompt position",
                  "Reduced scrap activity",
                  "Limited grain stems",
                  "Benchmarks",
                  "Cont/SAFR: $21.5K",
                  "Baltic/WAFR: $17–18K",
                  "Baltic/USG: $13K"
                ]
              },
              {
                "name": "Continent / Baltic Handy",
                "paragraphs": [
                  "Sentiment: 📉 Softening",
                  "Key Factors",
                  "Increasing tonnage (~44 vessels)",
                  "Limited cargoes (~10 remaining March)",
                  "Bid/offer gap widening",
                  "Benchmarks (38K dwt)",
                  "Cont/Med: $17K",
                  "Cont/WAFR: $17.5–18K",
                  "Cont/USG: $12K",
                  "Cont/ECSA: $10.75K"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "Russia (Handy/Supra)",
                "paragraphs": [
                  "Sentiment: ➡️ Stable",
                  "Highlights",
                  "Strong activity supported by cheaper Russian bunkers",
                  "Charterers favouring TCT structures",
                  "Rate Ideas",
                  "Handy to Turkey: ~$11K",
                  "Handy to Brazil: ~$10K + 80K AWRP",
                  "Supra (BSEA): ~$24K dop + 120K AWRP"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "Overall Market View"
    ]
  },
  {
    "id": "dry-bulk-2026-03-11",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2026-03-11",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09",
      "dateNote": "Dated 11 March 2026 inside the report, consistent with the email date. The outer heading and subject say 2025."
    },
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST – Supramax / Ultramax",
                "paragraphs": [
                  "Sentiment: 📉 Softening",
                  "Basis: BSS BS63 DOP CJK",
                  "| Route | Rate",
                  "| NOPAC | $16,500",
                  "| Australia RV | $16,000",
                  "| SE Asia | $14,500",
                  "| Cont / Med | $14,000",
                  "| WCCA | $14,000",
                  "Market Overview",
                  "The FEAST market softened toward the end of last week, affecting both Pacific round voyages and backhaul routes.",
                  "Key drivers:",
                  "Tonnage list gradually expanding for vessels opening over the next two weeks",
                  "Increased competition among owners",
                  "FFA market dropping quickly, reducing period activity",
                  "Operational challenges with bunker availability in several locations",
                  "As a result, some owners are lowering offers to secure employment, especially where trading flexibility is limited.",
                  "Reported Fixtures",
                  "NB 63k open CJK → $13k for ~70d to USG",
                  "JMU 60k open CJK → mid $16k NOPAC RV",
                  "63k open North China → $15,500 / 70d to West Africa",
                  "61k open CJK → low $15k NOPAC / SE Asia (vessel cannot trade USA)"
                ]
              }
            ]
          },
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "Southeast Asia – SMX / UMX",
                "paragraphs": [
                  "Tonnage: ⬆ Increasing",
                  "Sentiment: ⚠ Cautious / Bearish short-term",
                  "Market Overview",
                  "The week started slowly, with most participants adopting a cautious approach due to the extremely volatile bunker market.",
                  "Key developments:",
                  "Operators postponing or holding cargo stems",
                  "Reduced enquiries WoW",
                  "Period appetite softening",
                  "More ballasters arriving from ECI / Bangladesh, increasing supply",
                  "Short-term outlook remains bearish until:",
                  "bunker availability stabilizes",
                  "geopolitical risks improve",
                  "Fixtures",
                  "SMX: $13k BSS Spore → Indo/China (bunkers sold ~$800)",
                  "UMX: $17–18k DOP S. China → Indo/WCI (subs)",
                  "UMX: ~$20k DOP S. China → Bdesh (clinker) (subs)",
                  "58k: $16k DOP Spore → Indo/SEAsia",
                  "SMX: low $16k DOP Indo → S/P",
                  "57k: low $15k DOP S. China → Viet/India",
                  "Route Guidance",
                  "(BSS BS63 DOP Hong Kong)",
                  "| Route | Rate",
                  "| Indo / Thailand | $14,000",
                  "| Indo / China | $14,000",
                  "| Indo / India | $18,000",
                  "| Australia RV | $16,000",
                  "| Spore SMX | $16,000",
                  "| Spore UMX | $18,000"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "Arabian Gulf / West Coast India – SMX / UMX",
                "paragraphs": [
                  "Market Overview",
                  "The AG/WCI market remains extremely volatile due to escalating geopolitical tensions in the Middle East.",
                  "Key factors:",
                  "Owners demanding significant war risk premiums for Gulf calls",
                  "Chinese tonnage showing greater willingness to transit Hormuz",
                  "WCI vessels shifting toward South Africa or coastal trades",
                  "Salt exports to China subdued",
                  "Iron ore flows limited",
                  "In East Coast India, owners prefer coastal trades.",
                  "Indicative Levels (Supramax / Ultramax)",
                  "| Route | Bid | Offer",
                  "| AG → WCI | $24k | $26k",
                  "| AG → ECI | $24k | $26k",
                  "| AG → FEAST | $24k | $26k",
                  "| WCI → FEAST | $14k | $16k",
                  "| Short Period AG | $17k | $19k",
                  "| Short Period WCI | $16k | $18k",
                  "Tonnage Count",
                  "| Region | 10 Days | 30 Days",
                  "| AG | 7 | 7",
                  "| WCI | 19 | 29",
                  "| Red Sea | 3 | 5"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA – Handysize",
                "paragraphs": [
                  "Sentiment: 📉 Softening",
                  "Market Overview",
                  "The Handysize market in East Coast South America is softening in line with the larger segments.",
                  "Key developments:",
                  "Owners lowering offers",
                  "Long tonnage list",
                  "More April forward cargoes emerging",
                  "Bunker volatility complicating tenders",
                  "Physical bunkers difficult in Zona Comun",
                  "Recent Fixtures",
                  "30k: $16k APS Recalada → N Brazil",
                  "40k: $23,500 APS UPR → W Med",
                  "37k: $21,500 APS Recalada → Dakar",
                  "40k: $28k WWR Recalada → WCSA",
                  "Route Guidance (37k BSS)",
                  "| Route | Rate",
                  "| ECSA → Transatlantic | $20,250",
                  "| ECSA → Spore/Japan | $19,250",
                  "| UPR → South Africa | $19,500",
                  "| Brazil Coastal South | $17,000",
                  "| Brazil Coastal North | $18,000"
                ]
              },
              {
                "name": "ECSA – Supramax / Ultramax",
                "paragraphs": [
                  "Market Overview",
                  "The week has shown mixed signals with decent activity but rates trending slightly lower.",
                  "Key trends:",
                  "Strong Transatlantic demand",
                  "Lower Far East demand",
                  "Supply remains healthy",
                  "Middle East tensions increasing bunker volatility",
                  "Demand destinations:",
                  "TA diversified (not dominated by Egypt)",
                  "FE destinations across Singapore / Japan / Chittagong",
                  "Broker Guidance",
                  "| Route | Rate",
                  "| RECA TA I63 | $25,000",
                  "| RECA TA T58 | $23,000",
                  "| SBRAZ TA I63 | $24,500",
                  "| SBRAZ TA T58 | $22,500",
                  "| NBRAZ TA I63 | $24,000",
                  "| NBRAZ TA T58 | $22,000",
                  "| SBRAZ FH I63 | $16k + $600k BB",
                  "| SBRAZ FH T58 | $14,250 + $425k BB",
                  "Outlook:",
                  "⚠ Early April sentiment turning negative unless geopolitical tensions ease."
                ]
              }
            ]
          },
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "West Africa – SMX / UMX",
                "paragraphs": [
                  "Market Overview",
                  "The region is heavily impacted by bunker shortages, especially in South Africa, limiting long-haul FH voyages.",
                  "Spot Atlantic softening, but early April remains firm.",
                  "Benchmark Levels (UMX BSS WAFR)",
                  "| Route | Rate",
                  "| TA via ECSA | $15–16k",
                  "| Short TA | $19–21k",
                  "| FH India | $27–29k",
                  "| FH China | $23–25k",
                  "| FH via ECSA | High teens (illiquid)"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US Gulf – SMX / UMX",
                "paragraphs": [
                  "Market Overview",
                  "The market is under significant downward pressure due to:",
                  "1️⃣ Geopolitical tensions (Iran / US / Israel)",
                  "2️⃣ Oversupply of vessels",
                  "Current vessel/cargo ratio:",
                  "67 vessels vs 20 cargoes",
                  "Demand remains weak despite expected increases in petcoke cargoes.",
                  "Owners increasingly avoiding India, where charterers resist higher freight.",
                  "Current Rates",
                  "| Route | UMX | SMX",
                  "| TA RV | $24k | $20k",
                  "| FH | $23k | $19k",
                  "| India | $27k | $23k",
                  "| WCCA | $23k | $20k",
                  "| Intra-USG | $18.5k | $15.5k",
                  "| ECSA | $18.5k | $15.5k"
                ]
              },
              {
                "name": "US Gulf – Handysize",
                "paragraphs": [
                  "Market Overview",
                  "Activity increased slightly after oil prices eased, but the overall trend remains downward.",
                  "Key points:",
                  "Inter-Caribbean rates back into the teens",
                  "Demand remains weak",
                  "Owners prefer regional trading due to stable bunkers",
                  "Spot Levels (38k BSS)",
                  "| Route | Rate",
                  "| TA / Cont | $22k",
                  "| TA / Med | $23k",
                  "| Intra Americas | $18k",
                  "| WC short | $24k",
                  "| WC long | $21k",
                  "| Far East | $20.5k",
                  "| ECSA | $17.5k"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "Mediterranean / Black Sea – SMX / UMX",
                "paragraphs": [
                  "Market Overview",
                  "The market remains calm but firm.",
                  "Drivers:",
                  "Bunker volatility",
                  "Owners requesting short subs",
                  "Short cargo list (approx 5 non-Russian cargoes)",
                  "Benchmark (Imabari 63)",
                  "| Route | Rate",
                  "| EMED → WAFR | $18k / $19k HRA",
                  "| WMED → WAFR | $18k / $19k HRA",
                  "| EMED → USG | $13.5k",
                  "| EMED → TA grain | $17k",
                  "| EMED → FEAST | $21k"
                ]
              },
              {
                "name": "Mediterranean / Black Sea – Handysize",
                "paragraphs": [
                  "Market Overview",
                  "Voyage rates increased $2–3k WoW due to bunker prices.",
                  "Cargo flow:",
                  "Some additional grain stems from CVB",
                  "Majority still Russia / Ukraine cargoes",
                  "Benchmark (38k)",
                  "| Route | Rate",
                  "| BSEA → W Med | $11.5k",
                  "| BSEA → Cont | $11k",
                  "| BSEA → FEAST | $16k (Suez) / $15k (COGH)",
                  "| BSEA → USG | $10.5k",
                  "| BSEA → ECSA | $11k",
                  "Outlook: Firm short term"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "Baltic / Continent – Handysize",
                "paragraphs": [
                  "Market Overview",
                  "Market remains firm with steady activity.",
                  "Supporting factors:",
                  "Ice conditions in Baltic",
                  "Balanced cargo flow",
                  "~30 vessels vs ~18 cargoes",
                  "Market Benchmarks (38k)",
                  "| Route | Rate",
                  "| Cont / Med | $18k",
                  "| Cont / WAFR | $18.5k",
                  "| Baltic scrap → EMED | $19k",
                  "| Cont → USG | $14k",
                  "| Cont → ECSA | $10k",
                  "| Cont → Far East | $15k"
                ]
              },
              {
                "name": "Baltic / Continent – SMX / UMX",
                "paragraphs": [
                  "Market Overview",
                  "Slow start to the week.",
                  "Tonnage:",
                  "Baltic: ~5 vessels",
                  "Continent: ~17 vessels",
                  "Scrap cargoes remain limited.",
                  "Benchmarks (Imabari 63)",
                  "| Route | Rate",
                  "| Cont/Baltic → WAFR | $19.5k",
                  "| Cont/Baltic → WAFR HRA | $21k",
                  "| Baltic scrap → EMED | $20k",
                  "| Baltic → USG | $14.75k",
                  "| Cont → ECSA | $13.75k"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "Russian Market",
                "paragraphs": [
                  "Handysize",
                  "Activity extremely limited.",
                  "Key factor: Russian bunker significantly cheaper",
                  "| Location | Price",
                  "| Novorossiysk | $550–850",
                  "| Istanbul MGO | ~$1300",
                  "| Piraeus MGO | ~$1200",
                  "Rates to EMED revised to $12–13k for vessels using Russian bunkers.",
                  "Supramax",
                  "Market under pressure due to:",
                  "Middle East tensions",
                  "Bunker volatility",
                  "Reported:",
                  "Coal BSEA → India: $30k",
                  "Grain → Mombasa: mid/high $20s",
                  "Current negotiation levels:",
                  "$25k vs $20k BSS Canakkale → East Africa"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "✔ Overall Market Summary",
      "Softening trend across most Atlantic and Pacific routes",
      "Bunker volatility driving uncertainty",
      "Geopolitical tensions heavily impacting freight sentiment",
      "Increasing tonnage supply in several key regions",
      "Short-term outlook: cautious to bearish"
    ]
  },
  {
    "id": "dry-bulk-2025-03-04",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2025-03-04",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09",
      "dateNote": "Date unconfirmed: the report says 4 March 2025, but the email was sent on 4 March 2026. The displayed date preserves the report label; the year has not been silently corrected."
    },
    "dateStatus": "unconfirmed",
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE ASIA (SMX / UMX)",
                "paragraphs": [
                  "Tonnage Count: Flat",
                  "Market Sentiment",
                  "A cautious start to the week as market participants recalibrated positions amid escalating Middle East tensions, pushing bunker prices and uncertainty higher.",
                  "However, prompt cargoes requiring immediate nomination — particularly on the spot front — injected fresh momentum. Continued period appetite from operators and grain houses quickly shifted sentiment into positive territory.",
                  "Coal ex-Indonesia to China remains muted, though strong Australian grain flows are supporting regional demand. India/Bangladesh direction is expected to command premiums above last done levels.",
                  "Paper markets provided robust support, narrowing the spread between spot and period levels. Owners are expected to remain keen on locking short period or even 1-year coverage at current rates.",
                  "Recent Fixtures",
                  "56K on subs 16–17K DOP S China → Indo/India",
                  "58K fixed mid-18K DOP Singapore → Sumatra/SE Asia",
                  "63K fixed 19K DOP Indo → Australia/China (grains)",
                  "UMX fixed mid-14K DOP S China → Indo/SE Asia",
                  "UMX fixed high-14K DOP Thailand → BH to Continent",
                  "64K on subs 18’s DOP Vietnam → BH to Med",
                  "BSS BS63 DOP Hong Kong – Guidance",
                  "Indo/Thai – $15,000",
                  "Indo/China – $15,000",
                  "Indo/India – $19,500",
                  "Australia RV – $17,000",
                  "Spot SMX – $16,500",
                  "Spot UMX – $18,500"
                ]
              }
            ]
          },
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FAR EAST",
                "paragraphs": [
                  "Sentiment: Firm",
                  "BSS BS63 DOP CJK",
                  "NOPAC – $17,500",
                  "Australia – $17,000",
                  "To SE Asia – $15,000",
                  "Cont/Med – $16,000",
                  "WCCA – $15,500",
                  "The Far East market continues factoring in Middle East geopolitical risks, particularly potential withdrawal of Persian Gulf-bound cargoes.",
                  "NOPAC rounds and backhaul volumes remain steady, underpinning rates. Period appetite remains firm, with paper activity adding upward momentum.",
                  "Fixtures",
                  "UMX N China → NOPAC RV mid-17s",
                  "SMX Japan → Bangladesh mid-18s",
                  "Ultra open CJK F/F ARD mid-18K for NOPAC RV"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI",
                "paragraphs": [
                  "The market opened under significant uncertainty. Ongoing Middle East tensions are disrupting regional shipping operations:",
                  "Port instability across the region",
                  "Tight bunker availability with rising prices",
                  "Strait of Hormuz transit effectively unavailable for vessels inside the Gulf",
                  "Escalating war risk premiums",
                  "WCI open vessels are seeking local employment or considering ballast to South Africa."
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA (SMX / UMX)",
                "paragraphs": [
                  "Too early to determine direction. Last week closed flat with limited fixtures around 22s+220 APS on UMX to India/FH.",
                  "~18 vessels open next 30 days on coast",
                  "Indian Ocean supply relatively subdued",
                  "New manganese ore cargoes entered for 2H March",
                  "Bunker spike expected to pressure offers upward",
                  "Coal volumes steady, but bids remain around 19s+190s (Ultras) with no deals concluded.",
                  "S15 remains largely flat with marginal uptick. Market direction remains fluid."
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: Up",
                  "Tonnage: Flat/Down",
                  "Strong start to the week with limited tonnage list. Market expected to remain firm through March.",
                  "Rate Guidance – BSS UMX 63",
                  "WAFR → Med/Cont: 20/21,000",
                  "WAFR → India/Japan: 24/25,000",
                  "TESS 58",
                  "WAFR → Med/Cont: 18/19,000",
                  "WAFR → India/Japan: 21/22,000"
                ]
              }
            ]
          },
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA (SMX / UMX)",
                "paragraphs": [
                  "Activity continues to build toward week’s end rather than start.",
                  "Strong TA demand this week, while FH route remains softer amid limited PG demand.",
                  "Bids slightly below last done",
                  "Offers slightly above last done (TA)",
                  "Adjacent market strength (SAFR, WAFR, USG) limiting ballast inflow",
                  "Positive FFA sentiment and seasonal strength suggest firm April entry — though Middle East developments remain key risk factor.",
                  "Broker Guidance",
                  "RECA TA I63 – $28,000",
                  "RECA TA T58 – $25,000",
                  "SBRAZ TA I63 – $27,500",
                  "NBRAZ TA I63 – $27,000",
                  "SBRAZ FH I63 – 16,750 + 675K",
                  "SBRAZ FH T58 – 15,000 + 500K"
                ]
              },
              {
                "name": "ECSA HANDY",
                "paragraphs": [
                  "Sentiment: Firm with softer undertone",
                  "Tonnage list gradually lengthening. 2H March demand slowing, narrowing bid/offer gap. Fixture volume remains limited.",
                  "Recent Highlights",
                  "37DWT UPR/Egypt Med – ~$23K APS",
                  "38DWT UPR/WAFR – ~$25.5K APS",
                  "40DWT RECA/WCSA – $27.5K APS",
                  "40DWT RECA/WCSA – $34.5K APS",
                  "Route Guidance (BSS 37K)",
                  "ECSA/TA – $25,250",
                  "ECSA/Singapore–Japan – $21,250",
                  "UPR/South Africa – $23,000",
                  "Coastal S. Brazil – $21,000",
                  "Coastal N. Brazil – $22,500"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "USG (SMX / UMX)",
                "paragraphs": [
                  "Last week saw high activity (40 vessels covered). This week opened slower following geopolitical developments.",
                  "Vessel/Cargo ratio: 57 vs 22 (theoretically corrective), though significant off-market cargoes provide support.",
                  "Guidance",
                  "TARV – 31K UMAX / 27K SMAX",
                  "FH – 27.5K UMAX / 25K SMAX",
                  "India – 28.5K UMAX / 26K SMAX",
                  "WCCA – 33K UMAX / 29K SMAX",
                  "INT USG – 25K UMAX / 23K SMAX",
                  "ECSA – 24K UMAX / 22K SMAX"
                ]
              },
              {
                "name": "USG HANDY",
                "paragraphs": [
                  "Limited fresh activity. Minor influx of fresh requirements (primarily WC).",
                  "Prompt tonnage tight; ~80 vessels open next 30 days.",
                  "Spot Levels (38K DWT)",
                  "TA – 28K",
                  "Intra-Americas – 24K",
                  "WC – 23–24K (short) / 21–22K (long)",
                  "FH – 22K",
                  "ECSA – 17–18K",
                  "Bunker price impact from AG conflict now being felt."
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONT / BALTIC (SMX / UMX)",
                "paragraphs": [
                  "Market flat WoW. Scrap driving Continent activity.",
                  "Recent:",
                  "UMX Conti → EMED scrap: 22K",
                  "SMX Baltic → EMED scrap: 21K",
                  "Owners remain in collecting mode amid rising bunkers.",
                  "Benchmark BSS IMBA 63",
                  "Cont/SAFR – 21,500",
                  "Cont-Baltic/WAFR – 19,000",
                  "Scrap Baltic/EMED – 22,750",
                  "Baltic/USG steels – 14,750",
                  "Cont/ECSA – 13,750"
                ]
              },
              {
                "name": "CONT / BALTIC HANDY",
                "paragraphs": [
                  "Firm but slower week start. Rising bunkers reflected in voyage rates. Ice conditions unchanged, supporting sentiment.",
                  "Benchmark BSS 38K",
                  "Cont/Med – 17,000",
                  "Cont/WAFR – 17,500 (Non-HRA) / 18,000 (HRA)",
                  "Scrap Baltic/EMED – 18,000",
                  "Cont/USG – 13,500",
                  "Cont/ECSA – 11,500",
                  "Cont/SGP-JPN – 15,000"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA (SMX / UMX)",
                "paragraphs": [
                  "Slow opening. Owners waiting for bunker stabilization.",
                  "UMX fixed 15,500 EMED → WAFR clinker (Non-HRA)",
                  "Clean cargo EMED → USG: bids 11–12K vs offers 13–14K",
                  "No major improvements expected this week."
                ]
              },
              {
                "name": "MED / BLACK SEA HANDY",
                "paragraphs": [
                  "West Med remains firm. Morocco and ECSA flows supporting.",
                  "Fixtures",
                  "38K Morocco/ECSA – 9K passing Gib",
                  "37K S. Spain/BSEA – ~13K APS",
                  "Tonnage decreasing slightly (20 ships BSEA/EMED, 25 West Med). Market may remain positive short-term."
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "Handy",
                  "Moderate BSEA grain activity.",
                  "WAFR HRA close to 12K Canakkale",
                  "Med around 10K",
                  "EAFR previously ~13K but now uncertain",
                  "Supra",
                  "50K Marmara → Nigeria fixed 17K",
                  "Limited further activity",
                  "Bunker increases not fully reflected in rates"
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "Overall Outlook:",
      "Markets remain highly sensitive to Middle East developments, bunker volatility, and war risk escalation. While several regions show firm undertones supported by seasonal demand and paper strength, caution prevails across basins."
    ]
  },
  {
    "id": "dry-bulk-2025-02-25",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2025-02-25",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09",
      "dateNote": "Date unconfirmed: the report says 25 February 2025; the email was sent on 25 February 2026 and its subject says 18 February 2025. The displayed date preserves the report body, not the subject."
    },
    "dateStatus": "unconfirmed",
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE ASIA (SEASIA)",
                "paragraphs": [
                  "Tonnage Count: Up",
                  "Sentiment: Bullish",
                  "The Southeast Asia market opened the week strongly, carrying momentum from the previous short trading week. The return of key market participants post-holidays, combined with tightening spot availability, pushed rates to fresh highs.",
                  "Owners are resisting fixing at previous levels, holding back prompt tonnage in anticipation of stronger numbers. Period interest remains active. Coal flows to China are subdued but intra-SE Asia and India–Bangladesh demand remains steady.",
                  "Outlook: Bullish in the short term.",
                  "Notable Fixtures",
                  "Ultramax fixed low-to-mid/high teens DOP Indo/Philippines for Indonesia/China & Vietnam runs",
                  "64K fixed ~18K DOP Philippines for scrubber-fitted charter",
                  "63K fixed high 13s DOP South China for clinker to WAF",
                  "Rate Indications (BS63 DOP HK)",
                  "Indo/Thai – $12,500",
                  "Indo/China – $12,500",
                  "Indo/India – $15,500 (WCI) / $16,500 (ECI)",
                  "Australia RV – $15,500",
                  "Short period SMX – $16,000",
                  "Short period UMX – $18,000"
                ]
              }
            ]
          },
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST (Far East)",
                "paragraphs": [
                  "Sentiment: Firm",
                  "Post-Chinese New Year reopening has injected renewed activity. NOPAC leads strength, and tight prompt tonnage supports owners’ ideas.",
                  "Rate Guidance (BS63 DOP CJK)",
                  "NOPAC – $16,500",
                  "Australia – $14,500",
                  "SE Asia – $13,000",
                  "Cont/Med – $14,000",
                  "WCCA – $13,500",
                  "Outlook: Positive undertones likely to persist."
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI",
                "paragraphs": [
                  "Sentiment: Improving",
                  "The market is firmer versus last week. With Ramadan ongoing, Gulf port operations may see intermittent slowdowns.",
                  "Tonnage availability has declined. Some vessels are evaluating ballasting toward South Africa amid stronger returns there.",
                  "Broker Guidance – 63K DWT (Indicative)",
                  "AG/WCI – 14,000 vs 16,000",
                  "AG/ECI – 15,000 vs 17,000",
                  "AG/FEAST – 14,000 vs 16,000",
                  "WCI/FEAST – 13,000 vs 15,000",
                  "S/Period AG – 16,000 vs 18,000",
                  "37K DWT (Indicative)",
                  "AG/WCI – 9,000 vs 11,000",
                  "AG/ECI – 10,000 vs 12,000",
                  "AG/FEAST – 9,000 vs 11,000",
                  "Outlook: Gradual firming bias, though operational delays may distort supply visibility."
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: Stabilizing after surge",
                  "Following last week’s sharp jump, the market has flattened. Ballasters from the Indian subcontinent and Singapore are increasing supply, though some are diverting toward ECSA transatlantic cargoes.",
                  "Coal demand to WCI–Pakistan remains robust.",
                  "Key Levels (APS South Africa)",
                  "SAFR–FEAST: 21+210",
                  "SAFR–ECI: 22+220",
                  "SAFR–WCI/Pak: 20+200",
                  "Recent WCI fixtures reported around 22+220 APS on Ultramax.",
                  "Outlook: Stabilized at higher plateau; mild correction possible."
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WEST AFRICA (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: Up",
                  "Tonnage: Flat to slightly down",
                  "Quiet start, but owners holding firm levels. Slower ECSA demand may influence March momentum.",
                  "Rate Guidance (UMX 63)",
                  "WAFR/Med-Cont – 20/21K",
                  "WAFR/India-Japan – 24/25K",
                  "(T58)",
                  "WAFR/Med-Cont – 18/19K",
                  "WAFR/India-Japan – 21/22K"
                ]
              }
            ]
          },
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA (SMX/UMX)",
                "paragraphs": [
                  "Market momentum slowed after last week’s activity spike. Fronthaul firmed previously; Transatlantic appears slightly softer this week.",
                  "Supply stable as many ballasters were absorbed by South Africa. Demand currently thin, though FFA strength and seasonality support a constructive Q2 view.",
                  "Broker Guidance",
                  "RECA TA I63 – $28,000",
                  "SBRAZ TA I63 – $27,500",
                  "NBRAZ TA I63 – $27,000",
                  "SBRAZ FH I63 – 16,750 + 675K",
                  "Outlook: Stable near-term; upside risk into late March/early April."
                ]
              },
              {
                "name": "ECSA HANDY",
                "paragraphs": [
                  "Sentiment: Firm",
                  "Despite lighter activity, owners maintain strong ideas. Bid/ask spreads remain wide.",
                  "Recent Fixtures",
                  "39DWT Santos – $32,000 APS RECA/WCSA",
                  "39DWT Rio Grande – $23,000 DOP Portugal",
                  "35DWT Santos – $20,000 Continent redeployment",
                  "Route Guidance (37K)",
                  "ECSA/TA – $25,250",
                  "ECSA/Spore–Japan – $21,250",
                  "Coastal Brazil – $21–22.5K",
                  "Risk: Increasing 2H March supply could pressure sentiment if cargo flow does not accelerate."
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "US GULF (SMX/UMX)",
                "paragraphs": [
                  "Sentiment: Stabilized",
                  "After correction, the market found equilibrium. Weather disruptions on USEC are limiting effective supply.",
                  "Spot tonnage is scarce, reducing downward rate pressure. Forward offers remain above spot due to volatility concerns.",
                  "Rate Indications (UMX/SMX)",
                  "TA – 28,000 / 24,500",
                  "FH – 26,500 / 24,000",
                  "India – 27,500 / 25,000",
                  "WCCA – 32,000 / 27,000",
                  "ECSA – 22,000 / 20,000",
                  "Outlook: Balanced with upside support from tight prompt supply."
                ]
              },
              {
                "name": "USG HANDY",
                "paragraphs": [
                  "Sentiment: Strong despite correction",
                  "Tonnage count dropped from 80 to 65 vessels WoW. Ballasters shifting to ECSA may further tighten USG availability.",
                  "Spot Levels (38K DWT)",
                  "TA – $26K",
                  "Intra-Americas – $24K",
                  "WC – 23–24K short / 21–22K long",
                  "FH – 21–22K",
                  "ECSA – 17–18K",
                  "Early March USEC laycans tight; 40K fixed on subs at $28K TA woodpellets."
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONT/BALTIC (SMX/UMX)",
                "paragraphs": [
                  "Trend: Flat but firm",
                  "Scrap demand active. Ice-class premiums remain in parts of Baltic.",
                  "Benchmark (Imabari 63)",
                  "Cont/SAFR – 21,000",
                  "Cont–Baltic/WAFR – 19,000–20,000",
                  "Baltic/EMed scrap – 22,500",
                  "Cont/ECSA – 13,500",
                  "Period interest: UMX asking ~20K for 1-year."
                ]
              },
              {
                "name": "CONT/BALTIC HANDY",
                "paragraphs": [
                  "Firm levels, though enquiry slowed.",
                  "Benchmark (38K DWT)",
                  "Cont/Med – 17,500",
                  "Cont/WAFR – 17,500–18,000",
                  "Baltic/EMed Scrap – 18,000",
                  "Cont/USG – 12,000",
                  "Cont/ECSA – 9,000",
                  "Tonnage: 33 vessels next 30 days. Market steady."
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED/BLACK SEA (SMX/UMX)",
                "paragraphs": [
                  "Firm undertones; limited tonnage list (~20 units).",
                  "Cement to Gulf: 13K bid vs 15K offer (APS UMX)",
                  "1-year period UMX reported ~18K",
                  "Benchmark (Imabari 63)",
                  "EMed/WAFR Clinker – 15.5–16.5K",
                  "EMed/USG – 12K clean / 13.5K cement",
                  "EMed FH via Goa – 18.5K",
                  "Outlook: Continued gradual improvement."
                ]
              },
              {
                "name": "MED/BLACK SEA HANDY",
                "paragraphs": [
                  "West Med supported by strong ECSA pull. Black Sea grain steady; limited alternative cargoes.",
                  "Benchmark (38K DWT)",
                  "BSEA/WMed – 9K",
                  "BSEA/Cont – 8.5K",
                  "BSEA/FEAST – 12.5–13.5K",
                  "BSEA/USG – 10–12.5K",
                  "BSEA/ECSA – 9.25K",
                  "Supply tighter versus last week; positive bias dependent on ECSA strength."
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "Handy",
                  "Colombo – ~15K (no AWRP)",
                  "PG – ~12K",
                  "Turkish EMed – ~10K",
                  "WAFR HRA – targeting 12K for March dates",
                  "Supra",
                  "Limited activity; 58K to WAFR ~16K Canakkale."
                ]
              }
            ]
          }
        ]
      }
    ],
    "notes": [
      "Overall Market Summary",
      "Asia: Leading strength, driven by tight spot supply and post-holiday momentum.",
      "Atlantic: Stabilized after recent volatility; ECSA remains key driver.",
      "USG: Supply-side tightening supports rate floor.",
      "Med/BSEA: Gradual improvement but cargo-driven.",
      "Risk Factors: Ramadan operational delays, seasonal supply increases in March, potential ECSA softening.",
      "General Tone: Constructively firm across most basins, with selective correction risks but broader upside bias into late March."
    ]
  },
  {
    "id": "dry-bulk-2025-02-11",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2025-02-11",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09",
      "dateNote": "Date unconfirmed: the report says 11 February 2025, but the email was sent on 11 February 2026. The displayed date preserves the report label."
    },
    "dateStatus": "unconfirmed",
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SE ASIA",
                "paragraphs": [
                  "Tonnage Count: Flat",
                  "Sentiment: Improving / Mixed",
                  "Market activity is gradually picking up, largely driven by owners (OWS). With vessels opening this and next week, many are willing to cover forward ahead of the Lunar New Year holidays. Spot front sentiment remains mixed, with reports of both high and low fixtures concluded on the same day.",
                  "We observe increased operator interest in period employment across spot and forward dates compared to WoW, likely supported by firm paper markets and beneficial head (BH) optionality encouraging position-taking.",
                  "Recent Fixtures",
                  "53K DWT fixed LO ~USD 10K DOP, Spore → Sumatra / SE Asia",
                  "SMX F/F fixed ~USD 9K DOP, Cambodia → China",
                  "61K DWT fixed LO ~USD 9K DOP, Mid-China → short trip Spore",
                  "66K DWT fixed ~USD 17K DOP, South China → Bangladesh → Sri Lanka → Bangladesh",
                  "57K DWT fixed ~USD 14K DOP, Indonesia → Salt via Australia → SE Asia",
                  "Rate Guidance – BSS BS63 (DOP HK)",
                  "Indo / Thailand: USD 9,000",
                  "Indo / China: USD 9,000",
                  "Indo / India:",
                  "WCI: USD 11,500",
                  "ECI: USD 12,500",
                  "Australia RV: USD 11,000",
                  "Spot SMX: USD 14,000",
                  "Spot UMX: USD 16,000"
                ]
              }
            ]
          },
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST",
                "paragraphs": [
                  "Sentiment: Flat (BH) / Firm (PAC RVD)",
                  "Rate Guidance – BSS BS63 (DOP CJK)",
                  "NOPAC: USD 12,250",
                  "Australia: USD 11,000",
                  "To SE Asia: USD 9,000",
                  "Continent / Med: USD 11,000",
                  "WCCA: USD 9,000",
                  "The FEAST market opened slowly; however, NOPAC has shown stronger momentum since yesterday, with RVD bids improving by USD 1,000–1,500. Buying interest is firmer on the PAC RVD side, providing support.",
                  "BH activity remains muted with limited follow-through. Offers persist and overall tone remains flat. Sentiment is therefore mixed: flat on BH, firm on PAC RVD led by NOPAC strength.",
                  "Recent Fixtures",
                  "Ultra open CJK PPT fixed USD 10,500, Aussie RVD",
                  "Ultra open N. China fixed ~USD 10K, trip to PNG (bulk)",
                  "Ultra open CJK fixed ~mid USD 7K, Indo / SE Asia coal"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI",
                "paragraphs": [
                  "The AG/WCI market remains steady, with tonnage largely unchanged WoW.",
                  "Arabian Gulf: Limestone and fertilizer exports to EC India / Bangladesh fixing low-teens for Supramaxes. Upcoming Bangladesh elections may dampen import demand.",
                  "WC India: Salt exports remain limited; many owners prefer ballast to South Africa.",
                  "Seasonal impact: Chinese New Year and Ramadan expected to further slow activity.",
                  "EC India: Steady, though iron ore exports remain limited. Owners prefer Indo and South Africa cargoes.",
                  "Broker Guidance – Imabari 63 (Indicative)",
                  "| Route | Bid | Offer",
                  "| AG / WCI | 13,500 | 15,500",
                  "| AG / ECI | 14,000 | 16,000",
                  "| AG / FEAST | 13,000 | 15,000",
                  "| WCI / FEAST | 11,500 | 13,500",
                  "| S-Pd AG | 15,000 | 17,000",
                  "| S-Pd WCI | 14,000 | 16,000",
                  "SMX/UMX Tonnage Count",
                  "| Area | 10 Days | WoW | 30 Days | WoW",
                  "| AG | 9 | (10) | 16 | (16)",
                  "| WCI | 15 | (20) | 22 | (29)",
                  "| RSEA | 5 | (8) | 6 | (11)"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Slightly Bullish",
                  "The SAFR market remains broadly flat, though demand is healthy with ~7–8 cargoes quoted for end-Feb laycans (coal and manganese). Supply is tightening, with ~13 vessels open locally and 4–5 ballast arrivals from India, most expected to continue to ECSA.",
                  "Recent levels:",
                  "PE / China: ~USD 16K + 160K",
                  "India: ~USD 17K + 170K",
                  "As long as ECSA strengthens, SAFR is expected to follow.",
                  "Indications",
                  "SAFR → FEAST: 16,000 + 160",
                  "SAFR → EC India: 17,500 + 175",
                  "SAFR → WCI / Pakistan: 16,000 + 160",
                  "SAFR → BH: 14,000"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR – SMX / UMX",
                "paragraphs": [
                  "Sentiment: Up",
                  "Tonnage WoW: Flat / Down",
                  "Very quiet start to the week, but levels remain supported by strong ECSA sentiment.",
                  "Rate Guidance (Sub-delivery, BSS UMX 63)",
                  "WAFR → Med/Cont: USD 19,000–20,000",
                  "WAFR → India/Japan: USD 23,000–24,000",
                  "(Tess 58)",
                  "Med/Cont: USD 16,500–17,500",
                  "India/Japan: USD 19,000–20,000"
                ]
              }
            ]
          },
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA – SMX / UMX",
                "paragraphs": [
                  "This week remains firmly positive. Despite additional supply, fresh TA and FH demand has absorbed tonnage, supported by strong WAFR and USG markets.",
                  "TA demand is spread across Continent, WMed, and EMed, with EMed commanding a premium. FH demand centers on SE Asia and Chittagong, with some China interest emerging.",
                  "Positive FFA momentum is supporting forward demand, particularly for March.",
                  "Broker Guidance",
                  "RECA TA I63: USD 27,500",
                  "RECA TA T58: USD 24,500",
                  "SBRAZ TA I63: USD 27,000",
                  "NBRAZ TA I63: USD 27,500",
                  "SBRAZ FH I63: USD 16,500 + 650K"
                ]
              },
              {
                "name": "ECSA – HANDY",
                "paragraphs": [
                  "Sentiment: Firm",
                  "Tight tonnage and healthy demand continue to support rates, with most fixtures now showing a “2” handle.",
                  "Recent Fixtures (Selection)",
                  "40K DWT RECA/WCSA: USD 23,750 APS",
                  "38K DWT BB/NBraz: ~USD 20,000 APS",
                  "36K DWT RECA/WCSA (clean): USD 24,000 APS",
                  "Benchmark – 35K DWT (05 Mar Can)",
                  "S. Braz/Arg → Cont: USD 20,000",
                  "→ WMed: USD 20,500",
                  "→ WAFR: USD 21,250",
                  "→ FH: USD 17,250",
                  "→ WCSA: USD 23,000"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "USG – SMX / UMX",
                "paragraphs": [
                  "Market remains firm with higher levels, despite limited fixing. Approximately 25 cargoes versus 20 vessels opening mid-Feb to early March.",
                  "Benchmarks",
                  "TARV: 31,000 UMX / 28,000 SMX",
                  "FH: 29,000 UMX / 26,000 SMX",
                  "India: 33,000 UMX / 30,000 SMX",
                  "WCCA: 39,000 UMX / 36,000 SMX"
                ]
              },
              {
                "name": "USG – HANDY",
                "paragraphs": [
                  "Market strengthened sharply with inter-Caribbean rates now in the 20s.",
                  "Spot Levels (38K DWT)",
                  "TA / Cont: USD 23.5K",
                  "TA / Med: USD 24.5K",
                  "Intra-Americas: USD 22K",
                  "FH: USD 18K",
                  "Tonnage remains tight with most openings end-Feb, pointing to further upside for mid-Feb laycans."
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONT / BALTIC – SMX / UMX",
                "paragraphs": [
                  "Firm conditions persist. Baltic tonnage remains extremely tight, with owners preferring to wait until spot to fix.",
                  "Benchmark – Imabari 63",
                  "Cont → SAFR: USD 19,000",
                  "Baltic → WAFR: USD 18,000–19,000",
                  "Scrap Baltic → EMed: USD 22,000"
                ]
              },
              {
                "name": "CONT / BALTIC – HANDY",
                "paragraphs": [
                  "Market remains firm, supported by ice premiums and tight supply.",
                  "Benchmarks (38K DWT)",
                  "Cont / Med: USD 15,250",
                  "Cont / WAFR: USD 14,750 (non-HRA) / 15,500 (HRA)",
                  "Scrap Baltic / EMed: USD 15,000"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA – SMX / UMX",
                "paragraphs": [
                  "Rates improved on tighter supply and rising bids. Cement to USG and salt to USEC both saw gains.",
                  "Benchmark – Imabari 63",
                  "EMed / WAFR clinker: USD 13,500–14,500",
                  "EMed / USG cement: USD 12,500",
                  "EMed FH (FEAST): USD 17,000"
                ]
              },
              {
                "name": "MED / BLACK SEA – HANDY",
                "paragraphs": [
                  "Sentiment remains pessimistic. West Med is the only area showing relative strength, driven by firm N. Brazil levels.",
                  "Benchmark – 38K DWT",
                  "BSEA / WMed: USD 7,750",
                  "BSEA / Cont: USD 7,500",
                  "BSEA / USG: USD 9,000 (cement ~USD 10,000)"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "Handy: Slow grain activity; Med routes ~USD 9K for 28–30K DWT.",
                  "Supra: Low activity;",
                  "BSEA → China: USD 15.5K (owners 16–16.5K)",
                  "BSEA → EC Africa: USD 15.5K (owners ~18.5K)"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dry-bulk-2025-02-05",
    "title": "Weekly Dry Bulk Market Report",
    "publishedDate": "2025-02-05",
    "source": {
      "name": "IFCHOR GALBRAITHS",
      "format": "Email report text",
      "importedDate": "2026-09-09",
      "dateNote": "Date unconfirmed: the report says 5 February 2025, but the email was sent on 4 February 2026. The displayed date preserves the report label."
    },
    "dateStatus": "unconfirmed",
    "summary": "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax.",
    "overview": {
      "paragraphs": [
        "Original regional commentary and indicative rate guidance for Handy, Supramax and Ultramax."
      ]
    },
    "basins": [
      {
        "name": "Pacific / Indian Ocean",
        "regions": [
          {
            "name": "Southeast Asia",
            "sections": [
              {
                "name": "SEASIA",
                "paragraphs": [
                  "Tonnage Count: Up",
                  "Sentiment: Mixed / Volatile",
                  "The market opened the week on a subdued note amid shipping events in Dubai and New Delhi. Indo coal activity slowed, particularly into India. Liquidity is improving as participants return mid‑week. With Lunar New Year approaching, a brief pre‑holiday spike is possible before markets pause again. Disappearing NOPAC cargoes are pushing northern pressure into SEASIA/Australia. Period interest remains healthy in the south, including speculative plays without first legs. Expect continued volatility with no clear spot direction.",
                  "Recent Fixtures",
                  "56K fixed USD 9,500 dop Spore for Aussie/Indo",
                  "63K fixed USD 10,000 dop HK for Aussie RV",
                  "64K fixed mid USD 12,000 dop Philippines for Indo/WCI",
                  "T58 on subs USD 11,000 dop Indo for China trip",
                  "UMX on subs USD 11,000 dop Philippines for Indo/Philippines",
                  "Indicative Levels (BSS BS63 dop HK)",
                  "Indo/Thai: USD 9,000",
                  "Indo/China: USD 9,000",
                  "Indo/India: WCI USD 10,500 / ECI USD 11,500",
                  "Australia RV: USD 10,500",
                  "Spot SMX: USD 13,000",
                  "Spot UMX: USD 15,500"
                ]
              }
            ]
          },
          {
            "name": "FEAST",
            "sections": [
              {
                "name": "FEAST",
                "paragraphs": [
                  "Sentiment: Soft",
                  "The FEAST market slowed across both Pacific RVD and backhaul. NOPAC activity is notably quiet despite several ultramaxes open CJK. Owners are offering around USD 13,000 (or slightly below) for NOPAC RVD, but bids are scarce. Backhaul activity ex‑China is expected to fade from 10 Feb onward ahead of CNY. A lengthening tonnage list suggests continued correction through and beyond CNY.",
                  "Rate Guidance (BSS BS63 dop CJK)",
                  "NOPAC: USD 12,000",
                  "Australia: USD 10,500",
                  "To SEASIA: USD 9,500",
                  "Cont/Med: USD 11,000",
                  "WCCA: USD 10,000",
                  "Fixtures",
                  "D57 open Bohai Bay fixed arnd USD 8,000 to SE Asia",
                  "D64 open N. China fixed arnd mid USD 12,000 to E. Africa",
                  "61K open Bohai Bay fixed arnd USD 10,500 to W. Africa"
                ]
              }
            ]
          },
          {
            "name": "Arabian Gulf / West Coast India",
            "sections": [
              {
                "name": "AG / WCI",
                "paragraphs": [
                  "The AG/WCI market remains steady in line with last week. Tonnage levels are largely unchanged. Ultramaxes in WCI continue to target South African loadings. ECI stability is supported by Indonesian and coastal demand.",
                  "Broker Guidance (Indicative Only – Imabari 63)",
                  "AG/WCI: USD 13,000 vs 15,000",
                  "AG/ECI: USD 14,000 vs 16,000",
                  "AG/FEAST: USD 13,000 vs 15,000",
                  "WCI/FEAST: USD 12,000 vs 14,000",
                  "Period AG: USD 15,000 vs 17,000",
                  "Period WCI: USD 14,000 vs 16,000"
                ]
              }
            ]
          },
          {
            "name": "South Africa",
            "sections": [
              {
                "name": "SOUTH AFRICA (SMX / UMX)",
                "paragraphs": [
                  "The South African market remains flat to bearish. Supply is heavy with over 20 vessels open, mainly for SH Feb laycans. Limited exchanges and sparse fixtures persist. Coal to PG/WCI is rated around USD 12,000 + 120 aps on supras, while manganese ore FH bids sit at USD 14–15K + BB aps to Sing/Japan. Some owners are considering ballast to the Atlantic where sentiment is healthier.",
                  "Indicative Levels",
                  "SAFR/FEAST: USD 15,000 + 150",
                  "SAFR/EC India: USD 15,000 + 150",
                  "SAFR WCI/Pak: USD 14,000 + 140",
                  "SAFR BH: USD 14,000"
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Atlantic / Europe",
        "regions": [
          {
            "name": "West Africa",
            "sections": [
              {
                "name": "WAFR (SMX / UMX)",
                "paragraphs": [
                  "Sentiment: Up",
                  "Despite limited activity, rates moved up quickly on a tight tonnage list, keeping owners bullish.",
                  "Rate Guidance (Sub‑dely)",
                  "UMX 63",
                  "WAFR/Med–Cont: USD 16,500–18,000",
                  "WAFR/India–Japan: USD 21,000–22,000",
                  "TESS 58",
                  "WAFR/Med–Cont: USD 14,000–15,000",
                  "WAFR/India–Japan: USD 18,000–19,000"
                ]
              }
            ]
          },
          {
            "name": "ECSA",
            "sections": [
              {
                "name": "ECSA (SMX / UMX)",
                "paragraphs": [
                  "Volatility defines the ECSA market. Additional supply from ballast arrivals cooled last week’s rally. While geared demand ex‑north remains healthy, non‑geared demand is weaker. Ballasters from the Indian Ocean continue to spill into the South Atlantic. Despite a softer FFA market, surrounding strength from WAFR and USG provides some support. Early March outlook remains cautiously positive.",
                  "Broker Guidance",
                  "Reca TA: I63 USD 24,000 | T58 USD 21,500",
                  "S. Brazil TA: I63 USD 23,500 | T58 USD 21,000",
                  "N. Brazil TA: I63 USD 23,500 | T58 USD 21,000",
                  "S. Brazil FH: I63 USD 15,500 + USD 550K"
                ]
              },
              {
                "name": "ECSA – HANDY",
                "paragraphs": [
                  "Sentiment: Firm",
                  "Tight tonnage and healthy demand support the market, though fixtures remain limited and bid/ask spreads wide.",
                  "Recent Fixtures",
                  "30K: USD 14,500 aps FAZE/E. Med",
                  "33K: USD 15,000 aps Reca/China",
                  "36K: USD 19,000 aps Reca/Caribs",
                  "38K: USD 20,000 aps Reca/W. Med",
                  "Route Guidance (BSS 37K)",
                  "ECSA/TA: USD 18,750",
                  "ECSA/Spore–Japan: USD 16,500",
                  "Upriver/South Africa: USD 18,000"
                ]
              }
            ]
          },
          {
            "name": "US Gulf",
            "sections": [
              {
                "name": "USG (SMX / UMX)",
                "paragraphs": [
                  "USG remains firm with strong vessel‑cargo ratios (30 vs 29). Inter‑Caribs and Inter‑Americas are best sellers. FH demand is moderate, while petcoke activity has lifted spot levels to highs of USD 25,000 on T58 to Cont and UMX to India.",
                  "Benchmarks",
                  "TARV: UMX USD 23,500 | SMX USD 20,000",
                  "FH: UMX USD 23,500 | SMX USD 21,000",
                  "India: UMX USD 25,000 | SMX USD 22,000",
                  "WCCA: UMX USD 26,000 | SMX USD 22,500"
                ]
              },
              {
                "name": "USG – HANDY",
                "paragraphs": [
                  "Owners remain in control, particularly on TA trades. Tonnage count is stable at ~65 vessels opening in 30 days, with increasing ballast arrivals from WMed and Morocco.",
                  "Spot Levels (BSS 38K)",
                  "TA/Cont: USD 19,500",
                  "TA/Med: USD 20,500",
                  "Intra‑Americas: USD 16,500",
                  "WC: USD 18,000"
                ]
              }
            ]
          },
          {
            "name": "Continent / Baltic",
            "sections": [
              {
                "name": "CONT / BALTIC (SMX / UMX)",
                "paragraphs": [
                  "The positive trend continues with tight Baltic supply and healthier Continent availability. FH dirty cargoes bid high teens. Scrap and clean cargoes support firm sentiment.",
                  "Benchmarks (Imba 63)",
                  "Cont/SAFR: USD 18,000",
                  "Cont–Baltic/WAFR: USD 17,000–18,000",
                  "Scrap Baltic/E. Med: USD 20,500"
                ]
              },
              {
                "name": "CONT / BALTIC – HANDY",
                "paragraphs": [
                  "Market remains firm despite slower pace. Ice conditions and weather delays have tightened prompt tonnage.",
                  "Benchmarks (BSS 38K)",
                  "Cont/Med: USD 14,500",
                  "Cont–Baltic/WAFR: USD 14,250–15,000",
                  "Scrap Baltic/E. Med: USD 13,500"
                ]
              }
            ]
          },
          {
            "name": "Mediterranean / Black Sea",
            "sections": [
              {
                "name": "MED / BLACK SEA (SMX / UMX)",
                "paragraphs": [
                  "The market is broadly unchanged. Weather delays and tighter WMED supply make owners cautious. Rates hold steady with FH interest supporting levels.",
                  "Benchmarks (Imabari 63)",
                  "EMED/WAFR Clinker: USD 11,000–12,000",
                  "WMED/WAFR Clinker: USD 14,500–15,500",
                  "EMED/USG Clean: USD 10,500"
                ]
              },
              {
                "name": "MED / BLACK SEA – HANDY",
                "paragraphs": [
                  "Sentiment remains negative despite minor improvements on cement runs. Tonnage remains long across East and West Med.",
                  "Benchmarks (BSS 38K)",
                  "BSEA/W. Med: USD 7,750",
                  "BSEA/Cont: USD 7,500",
                  "BSEA/FEAST: USD 12,000–13,000"
                ]
              }
            ]
          },
          {
            "name": "Russia",
            "sections": [
              {
                "name": "RUSSIA MARKET",
                "paragraphs": [
                  "Handy: Flow stabilized; late‑Feb indications higher but unproven. Recent fixtures around USD 10,000 Canakkale/EMed.",
                  "Supra: Limited cargo flow; short tonnage supporting rates.",
                  "BSEA/China: USD 15,500 (owners at 16–16.5K)",
                  "BSEA/Red Sea: USD 15,000 (owners at ~18K)"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
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
reports.sort((a,b)=>b.publishedDate.localeCompare(a.publishedDate));
const {esc}=typeof module!=='undefined'&&module.exports?require('./ui-format'):root.ProjectXFormat;
const dateLabel=date=>new Date(date+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const paragraphs=items=>(items||[]).map(p=>'<p>'+esc(p)+'</p>').join('');
const sourceSections=items=>(items||[]).map(s=>'<section class="market-source-section"><h5>'+esc(s.name)+'</h5>'+paragraphs(s.paragraphs)+'</section>').join('');
function render(reportId,regionName=''){
 const report=reports.find(r=>r.id===reportId)||reports[0];
 if(!report)return '<section class="market"><h2>MARKET</h2><p>No archived reports available.</p></section>';
 const regions=[...new Set(report.basins.flatMap(b=>b.regions.map(r=>r.name)))];
 const selectedRegion=regions.includes(regionName)?regionName:'';
 const option=(value,label,selected)=>'<option value="'+esc(value)+'"'+(selected?' selected':'')+'>'+esc(label)+'</option>';
 const regionCard=r=>'<article class="market-region"><h4>'+esc(r.name)+'</h4>'+(r.tone?'<p class="market-tone">'+esc(r.tone)+'</p>':'')+paragraphs(r.paragraphs)+(r.bullets?.length?'<ul>'+r.bullets.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'')+(r.reason?'<p><strong>Drivers</strong><br>'+esc(r.reason)+'</p>':'')+(r.forecast?'<p><strong>Outlook at publication</strong><br>'+esc(r.forecast)+'</p>':'')+(r.cargoes?.length?'<p class="market-cargoes"><strong>Main export cargoes</strong><br>'+r.cargoes.map(esc).join(' · ')+'</p>':'')+(r.benchmark?'<pre>'+esc(r.benchmark)+'</pre>':'')+sourceSections(r.sections)+'</article>';
 return '<section class="market"><div class="heading"><div><h2>MARKET</h2><p class="section-intro">Dry bulk market sentiment archive.</p></div><span class="market-badge">Archive · '+reports.length+' reports</span></div>'+
 '<p class="market-disclaimer">Archived commentary, not a live market feed or independently verified market data. Latest available report: '+dateLabel(reports[0].publishedDate)+'. Forecasts refer to their publication date. Updates are not automatic.</p>'+
 '<div class="market-filters"><label class="field">Report date<select id="market-report" aria-label="Market report date">'+reports.map(r=>option(r.id,dateLabel(r.publishedDate)+(r.dateStatus==='unconfirmed'?' — date unconfirmed':''),r.id===report.id)).join('')+'</select></label>'+
 '<label class="field">Region<select id="market-region" aria-label="Market region">'+option('','All regions',!selectedRegion)+regions.map(r=>option(r,r,r===selectedRegion)).join('')+'</select></label></div>'+
 '<article class="market-report">'+(report.source?'<p class="market-source">Source: '+esc(report.source.name)+' · '+esc(report.source.format)+'.</p>'+(report.source.dateNote?'<p class="market-disclaimer">'+esc(report.source.dateNote)+'</p>':''):'')+'<div class="market-report-title"><p class="market-date"><time datetime="'+esc(report.publishedDate)+'">'+dateLabel(report.publishedDate)+'</time></p><h3>'+esc(report.title)+'</h3><p>'+esc(report.summary)+'</p></div>'+
 (!selectedRegion?'<div class="market-overview"><h3>Market overview</h3>'+paragraphs(report.overview.paragraphs)+'</div>':'')+
 '<div class="market-basins">'+report.basins.map(b=>{const visible=b.regions.filter(r=>!selectedRegion||r.name===selectedRegion);return visible.length?'<div class="market-basin"><h3>'+esc(b.name)+'</h3>'+(!selectedRegion&&b.intro?'<p class="market-basin-intro">'+esc(b.intro)+'</p>':'')+visible.map(regionCard).join('')+'</div>':'';}).join('')+'</div>'+
 (!selectedRegion?(report.segments||[]).map(s=>'<div class="market-overview"><h3>'+esc(s.name)+'</h3>'+paragraphs(s.paragraphs)+(s.benchmark?'<pre>'+esc(s.benchmark)+'</pre>':'')+'</div>').join('')+(report.notes?.length?'<div class="market-overview"><h3>Desk notes</h3>'+paragraphs(report.notes)+'</div>':''):'')+
 '</article></section>';
}
const api={reports,render,dateLabel};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXMarket=api;
})(typeof window==='undefined'?globalThis:window);
