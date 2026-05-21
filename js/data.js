/* ── RELATIONSHIP TYPES ─────────────────────────────────────── */
const REL_TYPES = {
  'product-design':  { label: 'Product Design',  stroke: 'rgba(28,28,26,0.65)', dash: '6 5',       w: 1.6 },
  'fabrication':     { label: 'Fabrication',      stroke: 'rgba(28,28,26,0.45)', dash: '9 4',       w: 1.4 },
  'cultural-memory': { label: 'Cultural Memory',  stroke: 'rgba(28,28,26,0.4)',  dash: '3 3',       w: 1.4 },
  'modular-design':  { label: 'Modular Systems',  stroke: 'rgba(28,28,26,0.8)',  dash: 'none',      w: 2.0 },
  'spatial-data':    { label: 'Spatial Data',     stroke: 'rgba(28,28,26,0.35)', dash: '11 3 2 3',  w: 1.1 },
  'community':       { label: 'Community',        stroke: 'rgba(28,28,26,0.6)',  dash: '1.5 4',     w: 2.2 },
};
 
/* ── PROJECT DATA ───────────────────────────────────────────── */
// mx / my = pin position as % of map width / height
//
// Colors are drawn from the bio highlight palette so pins visually
// echo the keywords they relate to:
//   Orange (#E07A30)  → "indigenous design"   → Anjẹmi Breeze Block
//   Amber  (#C8852A)  → "civic imagination"   → Sankofa
//   Pink   (#C4388A)  → "community engagement"→ Curl Connect
//   Rose   (#A8426E)  → "urban & arch research"→ LiDAR Analysis
//   Blue   (#3A7AAC)  → "Oyinkan Ifidon-Ola"  → Limited Dexterity Knife
const PROJECTS = {
  "Anjẹmi Breeze Block": {
    cat: "Architecture",
    sub: "Senior Independent Project",
    date: "September 2025 – Ongoing",
    color: "#D4A800",   /* yellow — indigenous design */
    mx: 24, my: 22,
    tags: ["Architecture","Digital Fabrication","3D Printing","Clay Printing","Cultural Preservation","Yoruba","West Africa"],
    quote: {
      text: "alanjẹmi l'anjẹmii ye",
      attr: "Only an Anjẹmi author can understand his own Anjẹmi."
    },
    overview: [
      "Anjẹmi refers to writing Yoruba in Arabic script, a long-standing literary tradition among West African Muslim communities that declined in the mid-19th century with missionary and colonial standardization efforts.",
      "It translates the script's visual logic into modular architectural blocks that merge cultural memory with spatial performance — each block functioning as both artifact and tool responsive to the climatic.",
      "For rapid iteration, I prototyped using recycled PLA through 3D printing. Looking ahead, clay 3D printing is the next stage of material testing because it offers environmental responsiveness suited to West African climates."
    ],
    process: [
      { title: "Script Analysis",         text: "Analyzed the visual geometry of Anjẹmi letterforms, identifying modular patterns that could translate into architectural units." },
      { title: "Modular Type Exploration", text: "Developed a modular grid system to adapt Anjẹmi letters, testing finalized grids against structural stability and airflow." },
      { title: "Laser Cut Exploration",   text: "Cut early iterations in wood to visualize design and functionality at scale." },
      { title: "3D Printed Prototypes",   text: "Produced prototypes in recycled PLA. The Anjẹmi letter Ṣṣ was the primary test case for airflow and stability." },
      { title: "Traditional Mold & Concrete", text: "Cast concrete block results using traditional mold methods." },
      { title: "Future: Clay 3D Printing", text: "Clay printing offers environmental responsiveness suited to West African climates." }
    ],
    images: [
    { src: "images/projects/anjemi/modular-type.jpg", label: "Modular type exploration" },
    { src: "images/projects/anjemi/typography.jpg", label: "Type Development" },
    { src: "images/projects/anjemi/laser-cut.jpg",   label: "Laser Cut Testing" },
    { src: "images/projects/anjemi/poi1.jpg",   label: "Prototype" },
    { src: "images/projects/anjemi/poi5.jpg",   label: "Prototype Light Test" },
    { src: "images/projects/anjemi/mockup.jpg",       label: "Applied facade rendering" },
  ]
},
 
  "LiDAR Analysis": {
    cat: "Urban Planning",
    sub: "Internship · MIT Summer Research Program",
    date: "June 2025 – July 2025",
    color: "#2A8A40",   /* green — urban & architectural research */
    mx: 72, my: 18,
    tags: ["LiDAR","Point Cloud","Machine Learning","3DMASC","Random Forest","Informal Settlements"],
    overview: [
      "LiDAR technology generates detailed three-dimensional point clouds providing comprehensive spatial data on neighborhoods and settlements, including areas difficult to access physically.",
      "Recent advances in automated point cloud classification, such as 3DMASC, offer machine learning approaches that dramatically reduce processing time while maintaining accuracy.",
      "My primary focus was on improving automation accuracy by refining parameter text and expanding training datasets — creating pathways for future settlement monitoring."
    ],
    process: [
      { title: "Data Import & Subsampling",      text: "Raw LiDAR point cloud data from the Vidigal favela in Rio de Janeiro imported and preprocessed." },
      { title: "Manual Segmentation",            text: "Point cloud manually classified into buildings, vegetation, wires, ground, rock, poles — ground truth training data." },
      { title: "Parameter Setup",                text: "Core points, scales, and features defined in the machine learning model parameter file." },
      { title: "3DMASC Random Forest Training",  text: "Segmented data trained a Random Forest classifier in 3DMASC — 84% overall accuracy." },
      { title: "Results & Validation",           text: "Automated pipeline classified LiDAR into a seven-class taxonomy." }
    ],
    images: [
    { src: "images/projects/lidar/process1.jpg",   label: "Process" },
    { src: "images/projects/lidar/process2.jpg",   label: "Process" },
    { src: "images/projects/lidar/A2.jpg", label: "Manual Processing" },
    { src: "images/projects/lidar/B2.jpg", label: "Automated Processing" },
    { src: "images/projects/lidar/color-code.jpg",       label: "Visualization Drawing" },
  ],
    results: [
      { cls: "Ground",     precision: "0.94", recall: "0.58", f1: "0.72" },
      { cls: "Vegetation", precision: "0.92", recall: "0.91", f1: "0.92" },
      { cls: "Rock",       precision: "0.98", recall: "0.82", f1: "0.89" },
      { cls: "Building",   precision: "0.79", recall: "0.98", f1: "0.87" },
      { cls: "Wire",       precision: "0.96", recall: "0.25", f1: "0.39" }
    ]
  },
 
  "Curl Connect": {
    cat: "Urban Planning",
    sub: "Class Project · University of Michigan",
    date: "September 2023 – December 2023",
    color: "#D0407A",   /* pink — community engagement */
    mx: 50, my: 72,
    tags: ["Urban Planning","Spatial Analysis","Google Places API","Folium Maps","User Research","Community Design"],
    overview: [
      "On campus, many Black students rely on an informal GroupMe of nearly 2,000 members asking 'Where can I get my hair done?' — highlighting gaps in built and informational systems.",
      "Using the Google Places API, I built a cleaned dataset of salons specializing in textured and protective styles, and visualized the results with interactive Folium maps.",
      "The analysis showed that availability was not the core issue — many salons existed within reachable distance but were miscategorized online, effectively invisible."
    ],
    process: [
      { title: "Spatial Data Collection", text: "Used the Google Places API to build a cleaned dataset across Ann Arbor, Ypsilanti, and Detroit." },
      { title: "Mapping & Analysis",      text: "Created interactive Folium maps analyzing provider density, service categories, and ratings." },
      { title: "User Interviews",         text: "Conducted interviews with five Black students. Data coded and synthesized into themes." },
      { title: "Journey Map & Persona",   text: "Synthesized insights into user persona 'Amaka' and a journey map tracing the hair-care search." },
      { title: "Solution Design",         text: "Proposed Curl Connect — a University of Michigan student email-accessible interface." }
    ],
    images: [
    { src: "images/projects/curl-connect/qr1.jpg", label: "Quantitative Analysis" },
    { src: "images/projects/curl-connect/qr2.jpg", label: "Quantitative Analysis" },
    { src: "images/projects/curl-connect/journeymap.jpg", label: "Journey Map" },
    { src: "images/projects/curl-connect/amaka.jpg", label: "User Persona" },
    { src: "images/projects/curl-connect/curlconnresearch.jpg",label: "Qualitative Research (Interviews, Affinity Diagramming and Coding" },
    { src: "images/projects/curl-connect/cc34.jpg",label: "Figma App Development" },
  ],
  },
 
  "Sankofa": {
    cat: "Creative Spatial Technologies",
    sub: "Creative Residency",
    date: "October 2024 – October 2025",
    color: "#E07820",   /* orange — civic imagination */
    mx: 16, my: 76,
    quote: {
      text: "It is not taboo to go back for what you forgot (or left behind).",
      attr: "Sankofa proverb"
    },
    tags: ["Sound Design","Max/MSP","Data Sonification","Spatial Installation","Cultural Memory","Diaspora"],
    overview: [
      "Sankofa is a research-driven, sensory project exploring the relationship between sound, culture, and spatial memory — examining how sound operates as a tool of resistance.",
      "Organized around Resistance, Erasure, and Dialectic Collision, audiences move through layered sonic and visual archives rooted in Zimbabwe, Nigeria, Palestine, West Berlin, South African jazz, and Detroit techno.",
      "I designed a reactive exhibition environment using Max/MSP, where sound from data sonification and field recordings directly controlled visual behavior."
    ],
    process: [
      { title: "Research Framework",      text: "Analyzed sonic geographies across Zimbabwe, Nigeria, Palestine, West Berlin, South Africa, and Detroit." },
      { title: "Data Sonification",       text: "Time-series population data parsed from CSV and mapped to sonic control ranges." },
      { title: "Max/MSP Composition",     text: "Mapped parameters drive synthesis, filtering, and reverb." },
      { title: "Audio-Visual Integration", text: "Sound amplitude and timing influence video segmentation and playback speed in real-time." },
      { title: "Exhibition Design",       text: "Spatial exhibition on the University of Michigan campus for two weeks." },
      { title: "Community Workshop",      text: "Workshop where students and artists experimented with the Max/MSP system." }
    ],
    images: [
    { src: "images/projects/sankofa/sankofabanner.jpg", label: "Research Overview/Framework" },
    { src: "images/projects/sankofa/LiteratureReview.jpg",label: "Literature Review" },
    { src: "images/projects/sankofa/sonification1.jpg", label: "Data Sonification Workflow Breakdown" },
    { src: "images/projects/sankofa/sonification2.jpg", label: "Data Sonification Workflow Breakdown" },
    { src: "images/projects/sankofa/exhibit1.jpg", label: "Exhibition Design" },
    { src: "images/projects/sankofa/exhibit2.jpg",label: "Further Exhibition Design" },
    { src: "images/projects/sankofa/Untitled_Artwork-5.jpg",label: "Final Exhibition Design" },
  ],
  },
 
  "Limited Dexterity Knife": {
    cat: "Product Design",
    sub: "Class Project · University of Michigan",
    date: "January 2023 – April 2023",
    color: "#2A6CB0",   /* blue — Oyinkan Ifidon-Ola / human-centered */
    mx: 80, my: 76,
    tags: ["Product Design","Inclusive Design","Ergonomics","Prototyping","User Testing","Accessibility"],
    overview: [
      "This knife is designed to improve accessibility for users with limited dexterity by reducing the force required to cut food and increasing overall stability — three points of contact maintain balance.",
      "The handle has two parts: a slim ergonomic grip with an indentation for the thumb or fingers, and a secondary support that enables the user to rest their hand while acting as a guard.",
      "The final knife supports multiple loose-grip positions, reducing strain, increasing control, and making the tool more inclusive."
    ],
    process: [
      { title: "User Research",            text: "Focused on needs of individuals with limited dexterity through observation and interviews." },
      { title: "Environmental Inquiry",    text: "Examined how kitchen layouts and routines influence tool usability." },
      { title: "Sketch Exploration",       text: "Over 60 early concepts testing proportions, ergonomics, and functional gestures." },
      { title: "Clay Prototyping",         text: "Clay models quickly assessed handle ergonomics and allowed rapid iteration." },
      { title: "Foam Model Refinement",    text: "Foam models refined form, balance, and scale with real users." },
      { title: "Usability Testing",        text: "Hands-on testing identified the most intuitive configurations." }
    ],
    images: [
    { src: "images/projects/knife/6073.jpg", label: "Initial Sketching" },
    { src: "images/projects/knife/knivesfse.jpg",label: "Further Skecthes" },
    { src: "images/projects/knife/furtherprototyping.jpg", label: "Clay and Foam Prototyping" },
    { src: "images/projects/knife/dxf3.jpg", label: "Mold Making" },
    { src: "images/projects/knife/dxf2.jpg", label: "Final Design with Use Cases" },
    { src: "images/projects/knife/dxk.jpg",label: "Product in Use" },
    ]
  }
};
 
/* ── SEMANTIC CONNECTIONS ───────────────────────────────────── */
// [projectA, projectB, relationship-type, short label]
const CONNECTIONS = [
  ["Anjẹmi Breeze Block",     "Curl Connect",            "product-design",  "Product Design"],
  ["Anjẹmi Breeze Block",     "Limited Dexterity Knife", "fabrication",     "Fabrication"],
  ["Anjẹmi Breeze Block",     "Sankofa",                 "cultural-memory", "Cultural Memory"],
  ["Anjẹmi Breeze Block",     "LiDAR Analysis",          "modular-design",  "Modular Systems"],
  ["Curl Connect",             "LiDAR Analysis",          "spatial-data",    "Spatial Data"],
  ["Curl Connect",             "Sankofa",                 "community",       "Community"],
  ["Curl Connect",             "Limited Dexterity Knife", "community",       "Inclusive Design"],
  ["LiDAR Analysis",           "Sankofa",                 "spatial-data",    "Data & Place"],
  ["Limited Dexterity Knife",  "Sankofa",                 "cultural-memory", "Cultural Context"],
];
 