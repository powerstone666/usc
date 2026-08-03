import type { ServiceSlug } from "@/app/(common-lib)/types";

export type Faq = { q: string; a: string };

export type Problem = { title: string; description: string; icon: string };

export const homeFaqs: Faq[] = [
  {
    q: "Which appliances do you repair in Bengaluru?",
    a: "We repair microwave ovens, air conditioners (AC), washing machines and refrigerators across all of Bengaluru. Our specialty is microwave oven repair — we have dedicated microwave technicians for every brand including Samsung, LG, IFB, Whirlpool and Bajaj.",
  },
  {
    q: "How fast can a technician reach my home in Bengaluru?",
    a: "Same-day slots are available across Bengaluru. Once you share your appliance and the issue, our technician typically reaches your home within 45 to 60 minutes in most neighbourhoods including Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar and Electronic City.",
  },
  {
    q: "Are your appliance repair technicians verified?",
    a: "Yes. Every technician at Urban Service Company is background-verified, trained in both technical skills and customer interaction, and rated 4.5+ by Bengaluru customers. We never send unverified contractors to your home.",
  },
  {
    q: "Is the repair quality assured?",
    a: "Yes. All repairs carried out by us are quality assured. Our work is reliable and you can count on it.",
  },
  {
    q: "How much does appliance repair cost in Bengaluru?",
    a: "Diagnosis is free. After inspection, our technician shares a transparent, fixed-rate quote for the repair. You approve before any work begins — no hidden charges, no last-minute surprises. Spare parts are billed at fixed rates.",
  },
  {
    q: "Which areas of Bengaluru do you serve?",
    a: "We serve 84+ neighbourhoods across Bengaluru — from Indiranagar and Koramangala in the centre to Whitefield and Marathahalli in the east, Jayanagar and JP Nagar in the south, Hebbal and Yelahanka in the north, and Rajajinagar and Vijayanagar in the west.",
  },
  {
    q: "Do you repair all brands of appliances?",
    a: "Yes. We repair Samsung, LG, Whirlpool, IFB, Godrej, Bajaj, Panasonic, Haier, Bosch, Siemens, Daikin, Hitachi, Voltas, Sharp and more. Our technicians carry genuine spare parts for all major appliance brands.",
  },
  {
    q: "Is there a charge for diagnosis?",
    a: "Diagnosis is free when you proceed with the repair. If you choose not to repair, only a small visitation fee applies. We always share the quote before any work begins.",
  },
  {
    q: "Do you carry spare parts for repairs?",
    a: "Yes. Our technicians carry common spare parts for microwave ovens, ACs, washing machines and refrigerators — including magnetrons, capacitors, door switches, fan motors, drain pumps, compressors and thermostats. If a specific part needs to be procured, we source genuine parts at fixed rates.",
  },
  {
    q: "How do I book an appliance repair in Bengaluru?",
    a: "Call us directly or use the diagnostic form on our website. Pick your appliance, tell us the symptom, and share your number — our technician will call you back within 15 minutes to confirm a same-day slot at your preferred time.",
  },
];

export const serviceFaqs: Record<ServiceSlug, Faq[]> = {
  "microwave-repair": [
    {
      q: "How much does microwave oven repair cost in Bengaluru?",
      a: "Microwave oven repair in Bengaluru starts with a free diagnosis. The final cost depends on the fault — common fixes like magnetron replacement, door switch repair, fuse replacement or control panel repair are priced transparently at fixed rates. You approve the quote before any work begins.",
    },
    {
      q: "Why is my microwave not heating?",
      a: "A microwave not heating is the most common issue we fix in Bengaluru. It is usually caused by a faulty magnetron, a blown fuse, a defective high-voltage diode or a failed capacitor. Our microwave technician diagnoses the exact cause and replaces the faulty part using genuine components.",
    },
    {
      q: "How do I book a microwave repair in Bengaluru?",
      a: "Call us or use the diagnostic quiz on our microwave repair page. Select your microwave brand (Samsung, LG, IFB, Whirlpool, Bajaj, Godrej or Panasonic), tell us the symptom, and share your number — our microwave specialist calls you back within 15 minutes to confirm a same-day slot.",
    },
    {
      q: "Do you repair Samsung microwaves in Bengaluru?",
      a: "Yes. We repair all Samsung microwave models including solo, grill and convection microwaves. Our technicians carry genuine Samsung spare parts including magnetrons, fuses, door switches, turntable motors and control panels.",
    },
    {
      q: "Do you repair LG microwave ovens in Bengaluru?",
      a: "Yes. We service all LG microwave models — solo, grill, convection and lightwave microwaves. We carry genuine LG spare parts and every LG microwave repair in Bengaluru is quality assured.",
    },
    {
      q: "Can you fix a sparking microwave?",
      a: "Yes. A microwave sparking is usually caused by a damaged waveguide cover, a faulty magnetron, or metal inside the cavity. Our technician inspects the waveguide, magnetron and cavity and replaces the damaged part safely to stop the sparking.",
    },
    {
      q: "My microwave turntable is not rotating — can you fix it?",
      a: "Yes. A microwave turntable not rotating is typically caused by a worn turntable motor, a broken drive coupling, or a misaligned roller guide. We replace the turntable motor with a genuine spare and get it rotating again.",
    },
    {
      q: "Do you repair convection microwaves in Bengaluru?",
      a: "Yes. We repair convection microwaves from all brands — Samsung, LG, IFB, Whirlpool, Bajaj, Godrej and Panasonic. Convection microwaves have additional heating elements and fans that our technicians are trained to service and repair.",
    },
    {
      q: "How long does microwave oven repair take?",
      a: "Most microwave repairs are completed in 30 to 60 minutes at your home in Bengaluru. If a specific part needs to be procured, we source it and return to complete the repair — typically within 24 hours.",
    },
    {
      q: "Is the microwave repair quality assured?",
      a: "Yes. All microwave repairs done by Urban Service Company are quality assured. If the same issue recurs, we fix it free.",
    },
    {
      q: "My microwave buttons are not working — what should I do?",
      a: "Microwave buttons not working is usually a faulty control panel or membrane switch. Our technician tests the panel, replaces the membrane or control board with a genuine spare, and restores full button functionality.",
    },
    {
      q: "Do you repair IFB microwave ovens in Bengaluru?",
      a: "Yes. We repair all IFB microwave models in Bengaluru. Our technicians carry genuine IFB spare parts and are experienced with IFB convection and grill microwave ovens.",
    },
    {
      q: "Can you fix a microwave that is not turning on?",
      a: "Yes. A microwave not turning on can be caused by a blown fuse, a faulty door switch, a tripped thermal fuse, or a defective control board. Our technician diagnoses the cause and fixes it at your doorstep in Bengaluru.",
    },
    {
      q: "What causes uneven heating in a microwave?",
      a: "Uneven heating in a microwave is often caused by a faulty turntable motor, a worn stirrer motor, or a weakened magnetron. Our technician inspects all components and replaces the faulty part to restore even, consistent heating.",
    },
    {
      q: "Do you provide microwave door repair in Bengaluru?",
      a: "Yes. We repair microwave door issues including broken door latches, damaged door switches, misaligned doors, and damaged door seals. A properly closing door is essential for microwave safety and efficient heating.",
    },
  ],
  "ac-repair": [
    {
      q: "How much does AC repair cost in Bengaluru?",
      a: "AC repair in Bengaluru starts with a free diagnosis. The cost depends on the fault — gas refill, capacitor replacement, PCB repair, fan motor replacement and installation each have fixed, transparent rates. You approve the quote before any work begins.",
    },
    {
      q: "Why is my AC not cooling?",
      a: "An AC not cooling is the most common issue in Bengaluru. It is usually caused by low gas, a faulty capacitor, a dirty coil, a blocked filter, or a defective compressor. Our AC technician diagnoses the exact cause and fixes it at your home.",
    },
    {
      q: "Do you provide AC gas refill in Bengaluru?",
      a: "Yes. We provide AC gas refill and gas leak fixing across Bengaluru. Our technician tests for leaks using nitrogen and soap solution, fixes any leaks by brazing, and refills the gas by weight or back pressure. We also provide a post-refill check.",
    },
    {
      q: "Do you repair split ACs in Bengaluru?",
      a: "Yes. We repair all types of split ACs in Bengaluru — including inverter and non-inverter split ACs from Daikin, LG, Samsung, Voltas, Hitachi, Panasonic, Blue Star, Carrier, O-General and more.",
    },
    {
      q: "Do you repair window ACs in Bengaluru?",
      a: "Yes. We repair window ACs from all major brands. Our technicians carry common window AC spare parts including capacitors, fan motors, compressors, PCBs and remote controls.",
    },
    {
      q: "How often should I service my AC in Bengaluru?",
      a: "We recommend servicing your AC at least twice a year in Bengaluru — once before summer and once during the monsoon. Regular AC servicing improves cooling, reduces electricity bills, and extends the life of your AC unit.",
    },
    {
      q: "Do you provide AC installation in Bengaluru?",
      a: "Yes. We provide split AC and window AC installation and uninstallation across Bengaluru. Our technician installs both indoor and outdoor units with a free gas check, proper insulation, and secure mounting.",
    },
    {
      q: "Why is my AC leaking water?",
      a: "An AC leaking water is usually caused by a clogged drain pipe, a damaged drain tray, or a frozen evaporator coil. Our technician clears the blockage, checks the drain tray and pipe, and ensures proper water flow.",
    },
    {
      q: "Which AC brands do you repair in Bengaluru?",
      a: "We repair Daikin, LG, Samsung, Voltas, Hitachi, Panasonic, Blue Star, Carrier, O-General, Godrej, Whirlpool and all other major AC brands. We carry genuine spare parts for each brand.",
    },
    {
      q: "Is the AC repair quality assured?",
      a: "Yes. All AC repairs and gas refills done by Urban Service Company are quality assured.",
    },
    {
      q: "My AC is making noise — what could be wrong?",
      a: "An AC making noise can be caused by a faulty fan motor, a loose blower, a worn bearing, or a damaged fan blade. Our technician inspects the indoor and outdoor units, identifies the source of the noise, and replaces the faulty part.",
    },
    {
      q: "Do you provide AC cleaning and deep service in Bengaluru?",
      a: "Yes. We provide foam jet and power jet AC cleaning service in Bengaluru. This includes deep cleaning of filters, coils, fins and drain trays to improve cooling performance and reduce power consumption.",
    },
  ],
  "washing-machine-repair": [
    {
      q: "How much does washing machine repair cost in Bengaluru?",
      a: "Washing machine repair in Bengaluru starts with a free diagnosis. The cost depends on the fault — drain pump replacement, motor repair, drum bearing replacement and door lock repair each have fixed, transparent rates. You approve the quote before any work begins.",
    },
    {
      q: "Why is my washing machine not draining?",
      a: "A washing machine not draining is usually caused by a clogged drain pump, a blocked drain hose, or a faulty drain motor. Our technician inspects the drain system, clears any blockage, and replaces the faulty part if needed.",
    },
    {
      q: "Do you repair front-load washing machines in Bengaluru?",
      a: "Yes. We repair all front-load washing machines in Bengaluru — from Samsung, LG, IFB, Bosch, Siemens, Whirlpool, Godrej and Haier. Our technicians carry genuine spare parts for front-load washer repair.",
    },
    {
      q: "Do you repair top-load washing machines in Bengaluru?",
      a: "Yes. We repair all top-load washing machines — both semi-automatic and fully automatic. Our technicians are experienced with all top-load washer brands and carry common spare parts.",
    },
    {
      q: "My washing machine is not spinning — can you fix it?",
      a: "Yes. A washing machine not spinning is typically caused by a worn drive belt, a faulty motor, a broken lid switch, or a defective control board. Our technician diagnoses the cause and replaces the faulty part at your home.",
    },
    {
      q: "Why is my washing machine making noise?",
      a: "A washing machine making noise can be caused by a worn drum bearing, a loose drum, a foreign object in the drum, or a faulty motor. Our technician inspects the drum, bearing and motor to identify and fix the source of the noise.",
    },
    {
      q: "Do you repair Samsung washing machines in Bengaluru?",
      a: "Yes. We repair all Samsung washing machine models — front load, top load and semi-automatic. We carry genuine Samsung spare parts including drain pumps, motors, belts, bearings and door locks.",
    },
    {
      q: "Do you repair IFB washing machines in Bengaluru?",
      a: "Yes. We repair all IFB washing machine models in Bengaluru — front load, top load and semi-automatic. Our technicians are experienced with IFB washer repair and carry genuine IFB spare parts.",
    },
    {
      q: "How long does washing machine repair take?",
      a: "Most washing machine repairs are completed in 45 to 90 minutes at your home in Bengaluru. If a specific part needs to be procured, we source it and return to complete the repair — typically within 24 hours.",
    },
    {
      q: "Is the washing machine repair quality assured?",
      a: "Yes. All washing machine repairs done by Urban Service Company are quality assured.",
    },
    {
      q: "My washing machine door is jammed — what should I do?",
      a: "A washing machine door jammed is common in front-load machines. It is usually caused by a faulty door lock, a trapped garment, or a drained pump that won't release the lock. Our technician safely opens the door and replaces the lock if needed.",
    },
    {
      q: "Why does my washing machine smell bad?",
      a: "A washing machine smelling bad is caused by detergent residue, mould and bacteria buildup in the drum, door seal and drain filter. Our technician cleans the drum, seal and filter, and recommends a monthly maintenance wash to prevent odour.",
    },
  ],
  "refrigerator-repair": [
    {
      q: "How much does refrigerator repair cost in Bengaluru?",
      a: "Refrigerator repair in Bengaluru starts with a free diagnosis. The cost depends on the fault — compressor replacement, thermostat repair, gas refill, fan motor replacement and door seal replacement each have fixed, transparent rates. You approve the quote before any work begins.",
    },
    {
      q: "Why is my refrigerator not cooling?",
      a: "A refrigerator not cooling is the most common issue we fix in Bengaluru. It can be caused by a faulty compressor, a defective thermostat, a gas leak, a blocked condenser coil, or a failed fan motor. Our technician diagnoses the exact cause and fixes it at your home.",
    },
    {
      q: "Do you repair double-door refrigerators in Bengaluru?",
      a: "Yes. We repair all double-door refrigerators in Bengaluru — including frost-free and direct-cool models from Samsung, LG, Whirlpool, Godrej, Haier, Panasonic, Hitachi and Bosch.",
    },
    {
      q: "Do you repair side-by-side refrigerators in Bengaluru?",
      a: "Yes. We repair side-by-side and French-door refrigerators from all major brands. Our technicians are trained to service the dual-evaporator systems, electronic controls and door-in-door features found in modern side-by-side fridges.",
    },
    {
      q: "My fridge is leaking water — can you fix it?",
      a: "Yes. A refrigerator leaking water is usually caused by a clogged defrost drain, a cracked water tank, or a faulty water inlet valve. Our technician clears the drain, checks the water system and replaces any damaged parts.",
    },
    {
      q: "Why is my refrigerator making noise?",
      a: "A refrigerator making noise can be caused by a faulty condenser fan motor, a worn evaporator fan motor, a vibrating compressor, or a damaged condenser coil. Our technician inspects all components and replaces the faulty part to silence the fridge.",
    },
    {
      q: "Do you repair Samsung refrigerators in Bengaluru?",
      a: "Yes. We repair all Samsung refrigerator models in Bengaluru — single door, double door, side-by-side and door-in-door. We carry genuine Samsung spare parts including compressors, thermostats, fan motors, sensors and door seals.",
    },
    {
      q: "How long does refrigerator repair take?",
      a: "Most refrigerator repairs are completed in 45 to 90 minutes at your home in Bengaluru. If a compressor or gas refill is needed, it may take longer. If a specific part needs to be procured, we source it and return within 24 hours.",
    },
    {
      q: "Is the refrigerator repair quality assured?",
      a: "Yes. All refrigerator repairs done by Urban Service Company are quality assured.",
    },
    {
      q: "Why is my fridge over-freezing?",
      a: "A refrigerator over-freezing is usually caused by a defective thermostat, a faulty temperature sensor, or a stuck defrost timer. Our technician tests the thermostat and sensor, replaces the faulty part, and restores proper temperature control.",
    },
    {
      q: "Do you repair LG refrigerators in Bengaluru?",
      a: "Yes. We repair all LG refrigerator models in Bengaluru — single door, double door, side-by-side and door-in-door. We carry genuine LG spare parts and every LG fridge repair is quality assured.",
    },
    {
      q: "My fridge door seal is damaged — can you replace it?",
      a: "Yes. We replace damaged refrigerator door seals (gaskets) for all brands. A loose or torn door seal causes cooling loss, higher electricity bills and frost buildup. Our technician fits a genuine replacement seal for a tight, efficient close.",
    },
  ],
  "water-filter-repair": [
    {
      q: "How much does water filter repair cost in Bengaluru?",
      a: "Water filter and RO purifier repair in Bengaluru starts with a free diagnosis. The cost depends on the fault — RO membrane replacement, UV lamp replacement, pump repair and valve replacement each have fixed, transparent rates. You approve the quote before any work begins.",
    },
    {
      q: "Why is my RO not purifying water?",
      a: "An RO not purifying water is usually caused by a clogged RO membrane, a faulty pre-filter, a defective UV lamp, or a malfunctioning solenoid valve. Our technician diagnoses the exact cause and replaces the faulty part using genuine components.",
    },
    {
      q: "Do you repair Kent water purifiers in Bengaluru?",
      a: "Yes. We repair all Kent RO, UV and UF water purifier models in Bengaluru. Our technicians carry genuine Kent spare parts including RO membranes, UV lamps, filters, pumps and valves.",
    },
    {
      q: "How often should I replace my RO membrane?",
      a: "We recommend replacing the RO membrane every 1 to 2 years depending on water quality and usage. Pre-filters should be replaced every 6 months. Our technician checks the membrane during service and advises replacement when needed.",
    },
    {
      q: "My water filter is leaking — can you fix it?",
      a: "Yes. A water purifier leaking water is usually caused by a loose fitting, a cracked housing, or a faulty O-ring. Our technician inspects the entire system, identifies the source of the leak, and replaces the damaged component.",
    },
    {
      q: "Do you repair Aquaguard water purifiers?",
      a: "Yes. We repair all Aquaguard water purifier models in Bengaluru — RO, UV, and combined RO+UV+UF systems. We carry genuine Aquaguard spare parts and every repair is quality assured.",
    },
    {
      q: "How long does water filter repair take?",
      a: "Most water filter and RO repairs are completed in 30 to 60 minutes at your home. RO membrane replacement and pump repairs may take longer. If a specific part needs to be procured, we return within 24 hours.",
    },
    {
      q: "Is water filter repair quality assured?",
      a: "Yes. All water filter and RO repairs done by Urban Service Company are quality assured. If the same issue recurs, we fix it free.",
    },
  ],
  "chimney-repair": [
    {
      q: "How much does kitchen chimney repair cost in Bengaluru?",
      a: "Kitchen chimney repair in Bengaluru starts with a free diagnosis. The cost depends on the fault — motor replacement, filter cleaning, touch panel repair and suction motor repair each have fixed, transparent rates. You approve the quote before any work begins.",
    },
    {
      q: "Why is my chimney not sucking smoke?",
      a: "A kitchen chimney not sucking smoke is usually caused by a clogged filter, a faulty suction motor, a blocked duct, or a defective blower. Our technician diagnoses the exact cause and fixes it at your doorstep.",
    },
    {
      q: "Do you repair Faber chimneys in Bengaluru?",
      a: "Yes. We repair all Faber kitchen chimney models in Bengaluru — wall-mounted, island and decorative chimneys. We carry genuine Faber spare parts including motors, filters, blowers and control panels.",
    },
    {
      q: "My chimney is making noise — what could be wrong?",
      a: "A noisy kitchen chimney is usually caused by a worn motor bearing, a loose blower, a damaged fan blade, or oil buildup on the motor. Our technician inspects the chimney, identifies the source of the noise, and replaces or cleans the faulty part.",
    },
    {
      q: "How often should I clean my chimney filter?",
      a: "We recommend cleaning the baffle filter every 2 weeks and deep cleaning the chimney every 3 months. Carbon filters should be replaced annually. Regular cleaning maintains suction power and extends the chimney's life.",
    },
    {
      q: "My chimney touch panel is not working — can you fix it?",
      a: "Yes. A chimney touch panel not working is usually a faulty touch control board or a damaged ribbon cable. Our technician tests the panel and replaces the defective component with a genuine spare.",
    },
    {
      q: "Do you repair Elica chimneys in Bengaluru?",
      a: "Yes. We repair all Elica kitchen chimney models in Bengaluru. We carry genuine Elica spare parts and every chimney repair is quality assured.",
    },
    {
      q: "Is chimney repair quality assured?",
      a: "Yes. All kitchen chimney repairs done by Urban Service Company are quality assured. If the same issue recurs, we fix it free.",
    },
  ],
};

export const brands: string[] = [
  "Samsung",
  "LG",
  "Whirlpool",
  "IFB",
  "Godrej",
  "Bajaj",
  "Panasonic",
  "Haier",
  "Voltas",
  "Bosch",
  "Siemens",
  "Daikin",
  "Hitachi",
  "Blue Star",
  "Carrier",
  "O-General",
  "Midea",
  "Gree",
  "Lloyd",
  "Videocon",
  "Onida",
  "AmazonBasics",
  "Mi",
  "Morphy Richards",
  "Prestige",
  "Elica",
  "Faber",
  "Sansui",
  "Cello",
  "Agaro",
];

export const brandDomains: Record<string, string> = {
  Samsung: "samsung.com",
  LG: "lg.com",
  Whirlpool: "whirlpool.com",
  IFB: "ifbappliances.com",
  Godrej: "godrej.com",
  Bajaj: "bajajelectricals.com",
  Panasonic: "panasonic.com",
  Haier: "haier.com",
  Voltas: "voltas.com",
  Bosch: "bosch.com",
  Siemens: "siemens.com",
  Daikin: "daikin.com",
  Hitachi: "hitachi.com",
  "Blue Star": "bluestarindia.com",
  Carrier: "carrier.com",
  "O-General": "o-general.com",
  Midea: "midea.com",
  Gree: "gree.com",
  Lloyd: "lloyd.in",
  Videocon: "videocon.com",
  Onida: "onida.com",
  AmazonBasics: "amazon.com",
  Mi: "mi.com",
  "Morphy Richards": "morphyrichards.co.uk",
  Prestige: "ttkprestige.com",
  Elica: "elica.com",
  Faber: "faber-spa.com",
  Sansui: "sansui.com",
  Cello: "cello.co.in",
  Agaro: "agaro.in",
};

export const serviceProblems: Record<ServiceSlug, Problem[]> = {
  "microwave-repair": [
    { title: "Not heating", icon: "thermostat", description: "Faulty magnetron, blown fuse or defective high-voltage diode — the most common microwave fault we fix in Bengaluru." },
    { title: "Sparking inside", icon: "bolt", description: "Damaged waveguide cover or metal in the cavity — our technician replaces the waveguide and inspects the magnetron." },
    { title: "Turntable not rotating", icon: "rotate", description: "Worn turntable motor or broken drive coupling — we replace the motor with a genuine spare." },
    { title: "Buttons not working", icon: "display", description: "Faulty membrane switch or control panel — we test and replace the defective component." },
    { title: "Not turning on", icon: "power", description: "Blown fuse, faulty door switch or tripped thermal fuse — we diagnose and fix at your doorstep." },
    { title: "Uneven heating", icon: "thermostat", description: "Weak magnetron or faulty stirrer motor — we inspect and replace the faulty part for even cooking." },
    { title: "Door or latch issue", icon: "door", description: "Broken door latch, misaligned door or damaged seal — we repair the door for safe, efficient heating." },
    { title: "Display not working", icon: "display", description: "Defective control board or display panel — we replace the faulty board with a genuine spare." },
  ],
  "ac-repair": [
    { title: "Less or no cooling", icon: "thermostat", description: "Low gas, faulty capacitor, dirty coil or defective compressor — the most common AC issue in Bengaluru." },
    { title: "Water leakage", icon: "water-drop", description: "Clogged drain pipe or damaged drain tray — our technician clears the blockage and checks water flow." },
    { title: "Not turning on", icon: "power", description: "Faulty capacitor, tripped PCB, or power supply issue — we diagnose and fix the electrical fault." },
    { title: "Noise or vibration", icon: "volume", description: "Faulty fan motor, loose blower or worn bearing — we identify the source and replace the part." },
    { title: "Gas refill needed", icon: "air", description: "Low refrigerant causing poor cooling — we test for leaks, fix them, and refill gas by weight." },
    { title: "Remote not working", icon: "display", description: "Faulty remote or receiver board — we test both and replace the defective unit." },
    { title: "Bad smell", icon: "air", description: "Mould and bacteria in the coil and filter — we clean and sanitise the indoor unit." },
    { title: "Cooling uneven", icon: "thermostat", description: "Dirty filter, blocked airflow or faulty thermostat — we clean and calibrate for even cooling." },
  ],
  "washing-machine-repair": [
    { title: "Not draining", icon: "water-drop", description: "Clogged drain pump, blocked hose or faulty drain motor — we clear the blockage and replace parts if needed." },
    { title: "Not spinning", icon: "rotate", description: "Worn drive belt, faulty motor or broken lid switch — we diagnose and replace the defective part." },
    { title: "Noisy drum", icon: "volume", description: "Worn drum bearing, loose drum or foreign object — we inspect and fix the source of the noise." },
    { title: "Door jammed", icon: "door", description: "Faulty door lock, trapped garment or drained pump lock — we safely open the door and replace the lock." },
    { title: "Not starting", icon: "power", description: "Faulty power supply, defective control board or broken door lock — we diagnose and fix at your home." },
    { title: "Water inlet issue", icon: "water-drop", description: "Clogged inlet filter or faulty inlet valve — we clean or replace the valve for proper water flow." },
    { title: "Foul smell", icon: "air", description: "Mould and detergent buildup in drum and seal — we deep clean and recommend maintenance washes." },
    { title: "Excess vibration", icon: "volume", description: "Unlevelled machine, worn shock absorber or loose drum — we level the machine and replace worn parts." },
  ],
  "refrigerator-repair": [
    { title: "Not cooling", icon: "thermostat", description: "Faulty compressor, defective thermostat or gas leak — the most common fridge issue in Bengaluru." },
    { title: "Frost build-up", icon: "thermostat", description: "Defective defrost timer, faulty heater or blocked defrost drain — we fix the defrost system." },
    { title: "Water leakage", icon: "water-drop", description: "Clogged defrost drain, cracked water tank or faulty inlet valve — we clear and replace damaged parts." },
    { title: "Compressor noise", icon: "volume", description: "Faulty condenser fan, worn evaporator fan or vibrating compressor — we identify and fix the source." },
    { title: "Door seal issue", icon: "door", description: "Loose or torn door gasket causing cooling loss — we fit a genuine replacement seal." },
    { title: "Over-freezing", icon: "thermostat", description: "Defective thermostat or faulty temperature sensor — we test and replace the faulty component." },
    { title: "Not starting", icon: "power", description: "Faulty relay, tripped overload or defective control board — we diagnose and fix the electrical fault." },
    { title: "Cooling uneven", icon: "thermostat", description: "Blocked vents, faulty fan motor or gas issue — we inspect and restore even cooling." },
  ],
  "water-filter-repair": [
    { title: "Not purifying", icon: "water-drop", description: "Clogged RO membrane, faulty pre-filter or defective UV lamp — the most common water purifier issue in Bengaluru." },
    { title: "Low water flow", icon: "water-drop", description: "Blocked filter cartridges, clogged membrane or faulty pump — we restore proper water flow." },
    { title: "Leakage", icon: "water-drop", description: "Loose fittings, cracked housing or damaged O-ring — we find and fix the leak." },
    { title: "Bad taste or smell", icon: "air", description: "Worn-out carbon filter or bacterial buildup — we replace the filter and sanitise the system." },
    { title: "Not turning on", icon: "power", description: "Faulty power supply, defective PCB or broken switch — we diagnose and fix the electrical fault." },
    { title: "RO membrane needs replacement", icon: "rotate", description: "Reduced purification, bad taste or low TDS — we replace the membrane with a genuine spare." },
    { title: "UV lamp not working", icon: "bolt", description: "Burnt UV lamp or faulty ballast — we replace the lamp and ensure proper UV disinfection." },
    { title: "Auto shut-off issue", icon: "power", description: "Faulty float valve or sensor malfunction — we fix the automatic shut-off system." },
  ],
  "chimney-repair": [
    { title: "Not sucking smoke", icon: "air", description: "Clogged filter, faulty suction motor or blocked duct — the most common chimney issue in Bengaluru." },
    { title: "Excessive noise", icon: "volume", description: "Worn motor bearing, loose blower or damaged fan blade — we identify and fix the noise source." },
    { title: "Low suction power", icon: "air", description: "Dirty filters, oil buildup or weak motor — we clean and restore full suction power." },
    { title: "Light not working", icon: "bolt", description: "Faulty LED light, broken switch or wiring issue — we replace the light and fix the wiring." },
    { title: "Motor issue", icon: "rotate", description: "Burnt motor, capacitor failure or bearing wear — we replace the motor with a genuine spare." },
    { title: "Touch panel not working", icon: "display", description: "Faulty touch board or damaged ribbon cable — we test and replace the control panel." },
    { title: "Filter cleaning needed", icon: "water-drop", description: "Oil-soaked baffle filters or clogged carbon filters — we deep clean and replace if needed." },
    { title: "Oil collection issue", icon: "water-drop", description: "Full oil collector or damaged drain valve — we clean and replace damaged parts." },
  ],
};

export const serviceTips: Record<ServiceSlug, string[]> = {
  "microwave-repair": [
    "Clean the microwave interior after every use — food splatter can cause sparking and damage the waveguide cover.",
    "Never run the microwave empty — it can overheat and damage the magnetron, the most expensive part to replace.",
    "Use only microwave-safe containers — metal and aluminium can cause arcing and permanent damage to the cavity.",
    "Keep the door seal clean and intact — a damaged seal causes heat loss, uneven cooking and higher electricity bills.",
    "Replace the waveguide cover if it shows signs of burning or peeling — a damaged cover causes sparking and magnetron failure.",
  ],
  "ac-repair": [
    "Clean or replace the AC filter every 2 weeks during summer — a dirty filter reduces cooling and increases power consumption by up to 15%.",
    "Service your AC twice a year — once before summer and once during the monsoon — to maintain peak cooling and efficiency.",
    "Keep the outdoor unit clear of debris and plants — blocked airflow forces the compressor to work harder and fail sooner.",
    "Check for gas leaks annually — low refrigerant causes poor cooling, higher bills and eventual compressor damage.",
    "Set the AC to 24°C for optimal comfort and efficiency — every degree lower increases power consumption by about 6%.",
  ],
  "washing-machine-repair": [
    "Leave the door open after every wash to let the drum dry — this prevents mould, bacteria and the foul smell they cause.",
    "Clean the lint filter weekly — a clogged filter reduces wash quality and can cause drainage problems.",
    "Use the right amount of detergent — excess detergent leaves residue, causes odour and damages the drum seal over time.",
    "Check pockets for coins and keys before loading — foreign objects damage the drum, bearing and drain pump.",
    "Run a monthly maintenance wash at 60°C with a descaler — this removes limescale, detergent buildup and bacteria.",
  ],
  "refrigerator-repair": [
    "Clean the condenser coils at the back twice a year — dusty coils make the compressor work harder and increase electricity bills.",
    "Check the door seal regularly — a loose gasket lets cold air escape, causing the fridge to run longer and freeze unevenly.",
    "Don't overload the fridge — blocked vents cause uneven cooling and frost buildup in certain sections.",
    "Defrost the freezer regularly if your fridge is not frost-free — excess frost reduces cooling efficiency and damages the defrost system.",
    "Keep the fridge at least 2 inches from the wall — proper airflow around the condenser prevents overheating and compressor failure.",
  ],
  "water-filter-repair": [
    "Replace pre-filter cartridges every 6 months — clogged pre-filters reduce RO membrane life and water flow.",
    "Sanitise the storage tank monthly — bacteria buildup in the tank causes bad taste and health risks.",
    "Check for leaks weekly — even a small leak wastes water and damages the purifier's internal components.",
    "Replace the RO membrane every 1-2 years — a worn membrane lets impurities through and affects water quality.",
    "Don't use hot water in the RO system — hot water damages the RO membrane and reduces its lifespan significantly.",
  ],
  "chimney-repair": [
    "Clean baffle filters every 2 weeks — oil-soaked filters reduce suction power and increase motor load.",
    "Deep clean the chimney every 3 months — professional cleaning removes oil buildup from the motor, blower and duct.",
    "Replace carbon filters annually — saturated carbon filters stop absorbing odours and reduce chimney effectiveness.",
    "Don't overload the chimney with heavy cooking — excessive smoke overwhelms the suction capacity and strains the motor.",
    "Check the auto-clean function monthly — regular auto-cleaning extends the chimney's life and maintains suction power.",
  ],
};

export const whyChooseUs = [
  { icon: "microwave", title: "Microwave-first specialists", text: "We lead with microwave oven repair — dedicated specialists, faster diagnosis, genuine magnetrons and parts." },
  { icon: "pin", title: "84+ Bengaluru neighbourhoods", text: "Same-day slots from Indiranagar to Whitefield, Jayanagar to Hebbal — 45-minute arrival in most areas." },
  { icon: "verified", title: "Free diagnosis, fixed rates", text: "Our technician inspects for free and shares a transparent quote. You approve before any work begins." },
  { icon: "shield", title: "Quality assured", text: "Every repair is quality assured and reliable." },
  { icon: "wrench", title: "Genuine spare parts", text: "We carry and procure genuine parts for Samsung, LG, IFB, Whirlpool, Bosch, Daikin and more." },
  { icon: "star", title: "4.5+ rated technicians", text: "Background-verified, trained pros — not random contractors. Rated by thousands of Bengaluru customers." },
];
