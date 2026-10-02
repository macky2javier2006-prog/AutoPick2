import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  storeUrl: string;
  // Compatibility specs
  minHeight: number; // in cm
  maxHeight: number; // in cm
  maxWeight: number; // in kg
  seatHeight?: number; // in mm (for motorcycles)
  vehicleType: "motorcycle" | "car" | "bigbike";
  type:
    | "scooter"
    | "underbone"
    | "adventure"
    | "sedan"
    | "suv"
    | "hatchback"
    | "sportbike"
    | "cruiser"
    | "touring";
  suitableFor: string[];
  capacity?: number; // passenger capacity for cars
  // Full specifications
  engineType: string; // e.g., "Single-cylinder, 4-stroke", "Inline-4"
  displacement: string; // e.g., "125cc", "1.5L"
  horsepower: string; // e.g., "11.5 HP @ 8,500 rpm"
  dimensions: string; // e.g., "L 1,915 x W 695 x H 1,090 mm"
  weight: string; // e.g., "111 kg"
  fuelEfficiency: string; // e.g., "50 km/L", "15 km/L (city)"
}

interface UserProfile {
  height: number; // in cm
  weight: number; // in kg
  gender: string;
  minPrice?: number; // in PHP
  maxPrice?: number; // in PHP
  preferredBrands?: string[]; // Preferred brands (up to 10)
}

interface UserAccount {
  firstName: string;
  middleName?: string;
  lastName: string;
  birthday: string;
  age: number;
  email: string;
  contactNumber: string;
  pickPoints: number; // Points for discounts (capped at 500)
  isLoggedIn: boolean;
  referralCode?: string; // User's unique referral code
  referredBy?: string; // Referral code of the user who referred them
  referralCount?: number; // Number of successful referrals this month
  referralMonth?: string; // Track which month the referral count is for (format: YYYY-MM)
  isVerified?: boolean; // Account verification status
  verifiedIdName?: string; // Name of uploaded government ID
  verifiedAddress?: string; // Verified address
  verifiedIdImage?: string; // Base64 encoded image of ID
  idImageDeadline?: string; // Deadline to upload ID image (ISO date string)
}

interface CompatibilityScore {
  vehicle: Vehicle;
  score: number;
  reasons: string[];
}

const vehicles: Vehicle[] = [
  // Motorcycles
  {
    id: 1,
    name: "Click 125i",
    brand: "Honda",
    price: 89900,
    image:
      "https://motortrade.com.ph/wp-content/uploads/2023/07/CLICK-125i-1.jpg",
    description:
      "Popular scooter with great fuel efficiency. 125cc engine, perfect for city riding.",
    storeUrl:
      "https://www.hondaph.com/motor/click125-smart-edition-type",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "city commute", "fuel efficient"],
    engineType: "Single-cylinder, 4-stroke, SOHC",
    displacement: "124.9cc",
    horsepower: "9.3 HP @ 7,500 rpm",
    dimensions: "L 1,915 x W 695 x H 1,090 mm",
    weight: "111 kg",
    fuelEfficiency: "55 km/L",
  },
  {
    id: 13,
    name: "NMAX",
    brand: "Yamaha",
    price: 151900,
    image:
      "https://www.yamaha-motor.com.tw/assets/images/motor/NMAX2025/E14602_reel01.png",
    description:
      "The ultimate maxi-scooter for city comfort and power.",
    storeUrl:
      "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/maxi-series/nmax",
    minHeight: 160,
    maxHeight: 190,
    maxWeight: 150,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["comfort", "long rides", "performance"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "155cc",
    horsepower: "15 HP @ 8,000 rpm",
    dimensions: "L 1,935 x W 740 x H 1,160 mm",
    weight: "127 kg",
    fuelEfficiency: "52 km/L",
  },
  {
    id: 3,
    name: "ADV 160",
    brand: "Honda",
    price: 179900,
    image:
      "https://motortrade.com.ph/wp-content/uploads/2022/10/3-1.jpg",
    description:
      "Adventure scooter built for long rides. 160cc engine with premium features.",
    storeUrl: "https://www.hondaph.com/motor/adv160-abs-type",
    minHeight: 165,
    maxHeight: 190,
    maxWeight: 150,
    seatHeight: 795,
    vehicleType: "motorcycle",
    type: "adventure",
    suitableFor: ["long rides", "taller riders", "experienced"],
    engineType: "Single-cylinder, 4-stroke, SOHC, eSP+",
    displacement: "156.9cc",
    horsepower: "15.8 HP @ 8,500 rpm",
    dimensions: "L 1,950 x W 760 x H 1,220 mm",
    weight: "133 kg",
    fuelEfficiency: "50 km/L",
  },
  {
    id: 4,
    name: "Raider R150",
    brand: "Suzuki",
    price: 107900,
    image:
      "https://mc.suzuki.com.ph/wp-content/uploads/2023/11/10-2-1024x768.png",
    description:
      "Underbone motorcycle with sporty design. 150cc, fast and reliable.",
    storeUrl:
      "https://motortrade.com.ph/motorcycles/suzuki-raider-r150-blade/",
    minHeight: 157,
    maxHeight: 183,
    maxWeight: 140,
    seatHeight: 775,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["sporty", "medium build", "daily commute"],
    engineType: "Single-cylinder, 4-stroke, SOHC",
    displacement: "147cc",
    horsepower: "14.5 HP @ 9,000 rpm",
    dimensions: "L 1,990 x W 715 x H 1,050 mm",
    weight: "116 kg",
    fuelEfficiency: "48 km/L",
  },
  {
    id: 5,
    name: "Beat 110",
    brand: "Honda",
    price: 72900,
    image:
      "https://cms.hondaph.com/images/assets/65376b8d59c9c.png",
    description:
      "Affordable and practical scooter. 110cc, best for daily commute.",
    storeUrl: "https://www.hondaph.com/motor/beat-premium-type",
    minHeight: 145,
    maxHeight: 175,
    maxWeight: 120,
    seatHeight: 740,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: [
      "beginner",
      "shorter riders",
      "budget friendly",
    ],
    engineType: "Single-cylinder, 4-stroke, SOHC, eSP",
    displacement: "109.5cc",
    horsepower: "8.8 HP @ 7,500 rpm",
    dimensions: "L 1,877 x W 674 x H 1,088 mm",
    weight: "103 kg",
    fuelEfficiency: "63 km/L",
  },
  {
    id: 6,
    name: "Sniper 155",
    brand: "Yamaha",
    price: 145000,
    image:
      "https://d1hv7ee95zft1i.cloudfront.net/custom/motorcycle-model-photo/original/yamaha-sniper-155-6656d394e4388.jpg",
    description:
      "Underbone with powerful performance. 155cc, popular among riders.",
    storeUrl:
      "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/on-road/sniper155",
    minHeight: 157,
    maxHeight: 183,
    maxWeight: 140,
    seatHeight: 775,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["sporty", "performance", "experienced"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "155cc",
    horsepower: "14.5 HP @ 8,000 rpm",
    dimensions: "L 1,990 x W 730 x H 1,060 mm",
    weight: "118 kg",
    fuelEfficiency: "52 km/L",
  },
  {
    id: 92,
    name: "Mio Soul",
    brand: "Yamaha",
    price: 71900,
    image:
      "https://insideracing.com.ph/wp-content/uploads/2019/07/miosoul-i-matteblack-standard-4oclock.png",
    description:
      "Stylish scooter with sporty design. 115cc engine, perfect for daily commute.",
    storeUrl:
      "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-soul-i-125",
    minHeight: 145,
    maxHeight: 175,
    maxWeight: 120,
    seatHeight: 755,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "stylish", "city commute"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "114.5cc",
    horsepower: "7.9 HP @ 7,250 rpm",
    dimensions: "L 1,840 x W 665 x H 1,090 mm",
    weight: "99 kg",
    fuelEfficiency: "60 km/L",
  },
  {
    id: 93,
    name: "Mio Sporty",
    brand: "Yamaha",
    price: 68900,
    image:
      "https://suertemotoplaza.com/wp-content/uploads/2020/09/MIO-SPORTY_Matte-Black.png",
    description:
      "Affordable and reliable scooter. 115cc engine, ideal for everyday riding.",
    storeUrl:
      "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-sporty",
    minHeight: 145,
    maxHeight: 175,
    maxWeight: 120,
    seatHeight: 745,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "affordable", "daily commute"],
    engineType: "Single-cylinder, 4-stroke, SOHC",
    displacement: "114.5cc",
    horsepower: "7.7 HP @ 7,250 rpm",
    dimensions: "L 1,800 x W 660 x H 1,070 mm",
    weight: "95 kg",
    fuelEfficiency: "58 km/L",
  },
  {
    id: 134,
    name: "TMX 125",
    brand: "Honda",
    price: 74900,
    image:
      "https://www.motorcyclephilippines.com/wp-content/uploads/2015/09/Honda-Supremo-Image-19885.png",
    description:
      "Rugged underbone motorcycle. 125cc engine, reliable workhorse for daily commute.",
    storeUrl:
      "https://www.hondaph.com/motor/tmx125-alpha",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 770,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["beginner", "daily commute", "durable"],
    engineType: "Single-cylinder, 4-stroke, SOHC",
    displacement: "124.9cc",
    horsepower: "9.7 HP @ 7,500 rpm",
    dimensions: "L 1,970 x W 720 x H 1,070 mm",
    weight: "107 kg",
    fuelEfficiency: "55 km/L",
  },
  // Cars
  {
    id: 7,
    name: "City Hatchback",
    brand: "Honda",
    price: 1058000,
    image:
      "https://img.pcauto.com/model/images/modelPic/my/honda-city-hatchback/424059728_1716255558460.png",
    description:
      "Compact and fuel-efficient hatchback. Perfect for city driving with modern features.",
    storeUrl: "https://www.hondaph.com/cars/city-hatchback",
    minHeight: 145,
    maxHeight: 200,
    maxWeight: 400,
    vehicleType: "car",
    type: "hatchback",
    capacity: 5,
    suitableFor: ["family", "city driving", "fuel efficient"],
    engineType: "4-cylinder, 16-valve, DOHC i-VTEC",
    displacement: "1.5L",
    horsepower: "119 HP @ 6,600 rpm",
    dimensions: "L 4,349 x W 1,748 x H 1,488 mm",
    weight: "1,135 kg",
    fuelEfficiency: "18 km/L",
  },
  {
    id: 78,
    name: "Ranger Raptor",
    brand: "Ford",
    price: 2398000,
    image: "https://vehicle-images.carscommerce.inc/stock-images/chrome/2b1c6aa7f2de8726b3fe659e538ed76b.png",
    description: "Performance pickup truck. 2.0L bi-turbo diesel, off-road beast.",
    storeUrl: "https://www.ford.com.ph/ranger-raptor",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["off-road", "adventure", "truck"],
    engineType: "Inline-4, Bi-Turbo Diesel, DOHC",
    displacement: "2.0L",
    horsepower: "210 HP @ 3,750 rpm",
    dimensions: "L 5,370 x W 1,918 x H 1,873 mm",
    weight: "2,266 kg",
    fuelEfficiency: "10 km/L (city) / 14 km/L (highway)",
  },
  {
    id: 9,
    name: "Rush",
    brand: "Toyota",
    price: 1117000,
    image:
      "https://toyotasantarosa.com.ph/wp-content/uploads/2022/07/Toyota-Rush-GR-Sport-.png",
    description:
      "7-seater SUV with robust build. Perfect for families and adventure trips.",
    storeUrl: "https://www.toyota.com.ph/rush",
    minHeight: 150,
    maxHeight: 200,
    maxWeight: 500,
    vehicleType: "car",
    type: "suv",
    capacity: 7,
    suitableFor: ["family", "adventure", "spacious"],
    engineType: "4-cylinder, 16-valve, DOHC Dual VVT-i",
    displacement: "1.5L",
    horsepower: "103 HP @ 6,000 rpm",
    dimensions: "L 4,435 x W 1,695 x H 1,705 mm",
    weight: "1,140 kg",
    fuelEfficiency: "14 km/L",
  },
  {
    id: 10,
    name: "Celerio",
    brand: "Suzuki",
    price: 598000,
    image:
      "https://autobrand.weebly.com/uploads/8/2/9/9/82994880/front-1_orig.png",
    description:
      "Budget-friendly hatchback. Compact size, easy to park, ideal for first-time car owners.",
    storeUrl: "https://www.suzuki.com.ph/automobiles/celerio",
    minHeight: 145,
    maxHeight: 195,
    maxWeight: 350,
    vehicleType: "car",
    type: "hatchback",
    capacity: 5,
    suitableFor: ["beginner", "budget friendly", "compact"],
    engineType: "3-cylinder, 12-valve, DOHC",
    displacement: "1.0L",
    horsepower: "67 HP @ 6,000 rpm",
    dimensions: "L 3,695 x W 1,655 x H 1,555 mm",
    weight: "865 kg",
    fuelEfficiency: "20 km/L",
  },
  {
    id: 11,
    name: "Mirage G4",
    brand: "Mitsubishi",
    price: 741000,
    image:
      "https://www.gbrmitsubishi.com/static/dealer-21550/24Mitsubishi-MirageG4-ES-SapphireBlueMetallic-Jellybean.png",
    description:
      "Affordable sedan with excellent fuel economy. Practical choice for daily commuters.",
    storeUrl:
      "https://www.mitsubishi-motors.com.ph/vehicles/mirage-g4",
    minHeight: 145,
    maxHeight: 200,
    maxWeight: 400,
    vehicleType: "car",
    type: "sedan",
    capacity: 5,
    suitableFor: ["commuter", "fuel efficient", "affordable"],
    engineType: "3-cylinder, 12-valve, DOHC MIVEC",
    displacement: "1.2L",
    horsepower: "78 HP @ 6,000 rpm",
    dimensions: "L 4,295 x W 1,670 x H 1,515 mm",
    weight: "940 kg",
    fuelEfficiency: "19 km/L",
  },
  {
    id: 12,
    name: "CR-V",
    brand: "Honda",
    price: 2358000,
    image:
      "https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2026/CR-V/AW/Carshot/carshot_CR-V_front_CR-VHYBAWDTRAILSP_2026_RadiantRedMetallic_RS6H6TJZW_R-569M.png",
    description:
      "Premium SUV with advanced safety features. Spacious and comfortable for families.",
    storeUrl: "https://www.hondaph.com/cars/cr-v",
    minHeight: 150,
    maxHeight: 200,
    maxWeight: 500,
    vehicleType: "car",
    type: "suv",
    capacity: 7,
    suitableFor: ["family", "premium", "safety"],
    engineType: "4-cylinder, 16-valve, DOHC i-VTEC Turbo",
    displacement: "1.5L Turbo",
    horsepower: "190 HP @ 5,600 rpm",
    dimensions: "L 4,691 x W 1,866 x H 1,681 mm",
    weight: "1,545 kg",
    fuelEfficiency: "13 km/L",
  },
  {
    id: 2,
    name: "Fazzio 125",
    brand: "Yamaha",
    price: 92900,
    image:
      "https://www.mityongroup.com/wp-content/uploads/2025/03/03-FAZZIO-Smart-Key-2025-WH.png",
    description:
      "Stylish scooter with hybrid technology. 125cc, smooth and economical (gamit ni michael).",
    storeUrl:
      "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-fazzio",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "stylish", "economical"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "125cc",
    horsepower: "9.2 HP @ 6,500 rpm",
    dimensions: "L 1,923 x W 700 x H 1,149 mm",
    weight: "108 kg",
    fuelEfficiency: "58 km/L",
  },
  {
    id: 14,
    name: "Fortuner",
    brand: "Toyota",
    price: 1800000,
    image:
      "https://toyotaquezonavenue.com.ph/wp-content/uploads/2020/10/Featured-Image-1-2.png",
    description:
      "A legendary SUV designed for power and off-road capability.",
    storeUrl: "https://www.toyota.com.ph/fortuner",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 600,
    vehicleType: "car",
    type: "suv",
    capacity: 7,
    suitableFor: ["adventure", "family", "premium"],
    engineType: "4-cylinder, 16-valve, DOHC Turbo Diesel",
    displacement: "2.4L Diesel",
    horsepower: "150 HP @ 3,400 rpm",
    dimensions: "L 4,795 x W 1,855 x H 1,835 mm",
    weight: "2,020 kg",
    fuelEfficiency: "12 km/L",
  },
  // Yamaha - Additional Models
  {
    id: 15,
    name: "Mio Gear",
    brand: "Yamaha",
    price: 81900,
    image: "https://motortrade.com.ph/wp-content/uploads/2021/09/2-13.jpg",
    description: "Sporty automatic scooter with aggressive styling. 125cc Blue Core engine, ideal for young riders.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-gear",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "sporty", "city commute"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "125cc",
    horsepower: "9.2 HP @ 6,500 rpm",
    dimensions: "L 1,860 x W 690 x H 1,110 mm",
    weight: "103 kg",
    fuelEfficiency: "56 km/L",
  },
  {
    id: 16,
    name: "Mio Gravis",
    brand: "Yamaha",
    price: 85900,
    image: "https://premiumbikes.ph/wp-content/uploads/2023/12/Yamaha-Mio-Gravis-NEW-2.png",
    description: "Rugged automatic scooter with adventure styling. 125cc with larger wheels for versatility.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-gravis",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 135,
    seatHeight: 780,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["adventure", "versatile", "city commute"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "125cc",
    horsepower: "9.2 HP @ 6,500 rpm",
    dimensions: "L 1,900 x W 705 x H 1,150 mm",
    weight: "106 kg",
    fuelEfficiency: "55 km/L",
  },
  {
    id: 17,
    name: "PG-1",
    brand: "Yamaha",
    price: 129900,
    image: "https://yamaha-motor.com.vn/wp/wp-content/uploads/2025/09/PG-1_LTD-DG12_Xanh-Camo_Goc-5.png",
    description: "Premium automatic scooter with smart features. 125cc hybrid system, modern connectivity.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/pg1",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 140,
    seatHeight: 770,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["premium", "tech-savvy", "comfortable"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core Hybrid",
    displacement: "125cc",
    horsepower: "9.2 HP @ 6,500 rpm",
    dimensions: "L 1,923 x W 700 x H 1,149 mm",
    weight: "110 kg",
    fuelEfficiency: "58 km/L",
  },
  {
    id: 18,
    name: "YTX125",
    brand: "Yamaha",
    price: 85900,
    image: "https://i0.wp.com/cdn.warungasep.net/2020/05/yamaha-ytx125-philipina.png",
    description: "Reliable underbone motorcycle for daily use. 125cc Blue Core, fuel-efficient and durable.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/on-road/ytx125",
    minHeight: 155,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 760,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["commuter", "fuel efficient", "durable"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "125cc",
    horsepower: "9.3 HP @ 7,500 rpm",
    dimensions: "L 1,935 x W 725 x H 1,055 mm",
    weight: "104 kg",
    fuelEfficiency: "60 km/L",
  },
  {
    id: 19,
    name: "Mio i125",
    brand: "Yamaha",
    price: 79900,
    image: "https://suertemotoplaza.com/wp-content/uploads/2021/03/MIOi_MAGENTA.png",
    description: "Classic automatic scooter with proven reliability. 125cc Blue Core engine, easy to ride.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-i125",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "reliable", "economical"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "125cc",
    horsepower: "9.2 HP @ 6,500 rpm",
    dimensions: "L 1,840 x W 680 x H 1,100 mm",
    weight: "99 kg",
    fuelEfficiency: "59 km/L",
  },
  {
    id: 20,
    name: "Lexi",
    brand: "Yamaha",
    price: 92900,
    image: "https://www.yontrakitchainat.com/wp-content/uploads/2023/12/yamaha-lexi-vva-gray-_2_-removebg-preview.png",
    description: "BRAND NEW! Elegant automatic scooter designed for modern riders. 125cc, sleek and sophisticated.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/lexi",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["stylish", "elegant", "city riding"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Blue Core",
    displacement: "125cc",
    horsepower: "9.2 HP @ 6,500 rpm",
    dimensions: "L 1,850 x W 695 x H 1,150 mm",
    weight: "107 kg",
    fuelEfficiency: "57 km/L",
  },
  {
    id: 21,
    name: "Aerox",
    brand: "Yamaha",
    price: 138900,
    image: "https://imgd.aeplcdn.com/664x374/n/bw/models/colors/yamaha-select-model-silver-1713384147992.png?q=80",
    description: "Sporty maxi-scooter with racing DNA. 155cc liquid-cooled VVA engine, aggressive performance.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/maxi-series/aerox",
    minHeight: 160,
    maxHeight: 190,
    maxWeight: 150,
    seatHeight: 790,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["sporty", "performance", "experienced"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Liquid-cooled VVA",
    displacement: "155cc",
    horsepower: "15.4 HP @ 8,000 rpm",
    dimensions: "L 1,960 x W 745 x H 1,175 mm",
    weight: "126 kg",
    fuelEfficiency: "50 km/L",
  },
  {
    id: 22,
    name: "XMAX",
    brand: "Yamaha",
    price: 299900,
    image: "https://motortrade.com.ph/wp-content/uploads/2026/03/Copy-of-2026_LEXI155_BLACK-1024x768.png",
    description: "Premium maxi-scooter with touring capabilities. 300cc liquid-cooled engine, luxury features.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/maxi-series/xmax",
    minHeight: 165,
    maxHeight: 195,
    maxWeight: 160,
    seatHeight: 795,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["premium", "touring", "comfortable"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Liquid-cooled",
    displacement: "292cc",
    horsepower: "27.6 HP @ 7,250 rpm",
    dimensions: "L 2,185 x W 775 x H 1,420 mm",
    weight: "179 kg",
    fuelEfficiency: "38 km/L",
  },
  // Yamaha Big Bikes
  {
    id: 23,
    name: "XSR155",
    brand: "Yamaha",
    price: 179900,
    image: "https://premiumbikes.ph/wp-content/uploads/2023/12/YAMAHA-XSR155.png",
    description: "Heritage sport bike with modern performance. 155cc VVA engine, retro-modern styling.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/sport-heritage/xsr155",
    minHeight: 165,
    maxHeight: 195,
    maxWeight: 160,
    seatHeight: 810,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["sport", "heritage", "experienced"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Liquid-cooled VVA",
    displacement: "155cc",
    horsepower: "19.3 HP @ 10,000 rpm",
    dimensions: "L 2,020 x W 805 x H 1,050 mm",
    weight: "141 kg",
    fuelEfficiency: "45 km/L",
  },
  {
    id: 24,
    name: "YZF-R15",
    brand: "Yamaha",
    price: 189900,
    image: "https://5.imimg.com/data5/OJ/DX/GLADMIN-60742306/yamaha-yzf-r15.png",
    description: "Entry-level supersport with racing technology. 155cc liquid-cooled engine, track-ready.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/supersport/yzf-r15",
    minHeight: 165,
    maxHeight: 195,
    maxWeight: 160,
    seatHeight: 815,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["sport", "track", "experienced"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Liquid-cooled VVA",
    displacement: "155cc",
    horsepower: "19.3 HP @ 10,000 rpm",
    dimensions: "L 1,990 x W 725 x H 1,135 mm",
    weight: "142 kg",
    fuelEfficiency: "42 km/L",
  },
  {
    id: 25,
    name: "YZF-R3",
    brand: "Yamaha",
    price: 329900,
    image: "https://rpmyamahaguam.com/wp-content/uploads/2021/02/2023-YAMAHA-YZF-R3.png",
    description: "Twin-cylinder supersport for serious riders. 321cc parallel-twin, thrilling performance.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/supersport/yzf-r3",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 180,
    seatHeight: 780,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["sport", "performance", "experienced"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "321cc",
    horsepower: "42 HP @ 10,750 rpm",
    dimensions: "L 2,090 x W 730 x H 1,140 mm",
    weight: "169 kg",
    fuelEfficiency: "32 km/L",
  },
  {
    id: 26,
    name: "XSR700",
    brand: "Yamaha",
    price: 569900,
    image: "https://yamahamotorsports.com/media/images/icons/products/26_xsr700.png",
    description: "Retro sport with contemporary soul. 689cc CP2 parallel-twin engine, neo-retro design.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/sport-heritage/xsr700",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 190,
    seatHeight: 835,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["heritage", "premium", "experienced"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled CP2",
    displacement: "689cc",
    horsepower: "73 HP @ 8,750 rpm",
    dimensions: "L 2,075 x W 820 x H 1,130 mm",
    weight: "186 kg",
    fuelEfficiency: "25 km/L",
  },
  {
    id: 27,
    name: "YZF-R7",
    brand: "Yamaha",
    price: 649900,
    image: "https://www.yamahamotorsports.com/media/images/icons/inventory/YZFR7RB.png",
    description: "Supersport with track-focused capabilities. 689cc CP2 engine, lightweight chassis.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/supersport/yzf-r7",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 190,
    seatHeight: 835,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["sport", "track", "experienced"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled CP2",
    displacement: "689cc",
    horsepower: "73 HP @ 8,750 rpm",
    dimensions: "L 2,070 x W 750 x H 1,120 mm",
    weight: "188 kg",
    fuelEfficiency: "24 km/L",
  },
  {
    id: 28,
    name: "XSR900",
    brand: "Yamaha",
    price: 799900,
    image: "https://rpmyamahaguam.com/wp-content/uploads/2021/02/2023-YAMAHA-XSR900.png",
    description: "High-performance heritage sport. 890cc CP3 triple engine, pure riding excitement.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/sport-heritage/xsr900",
    minHeight: 175,
    maxHeight: 200,
    maxWeight: 200,
    seatHeight: 810,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["premium", "performance", "experienced"],
    engineType: "Inline-3, 4-stroke, DOHC, Liquid-cooled CP3",
    displacement: "890cc",
    horsepower: "117 HP @ 10,000 rpm",
    dimensions: "L 2,075 x W 815 x H 1,165 mm",
    weight: "193 kg",
    fuelEfficiency: "20 km/L",
  },
  {
    id: 29,
    name: "Ténéré 700",
    brand: "Yamaha",
    price: 699900,
    image: "https://yamahamotorsports.com/media/images/icons/products/26_tenere_world_raid.png",
    description: "Adventure touring bike for serious exploration. 689cc CP2 engine, rally-inspired design.",
    storeUrl: "https://www.yamaha-motor.com.ph/motorcycles/adventure/tenere-700",
    minHeight: 175,
    maxHeight: 200,
    maxWeight: 200,
    seatHeight: 880,
    vehicleType: "bigbike",
    type: "adventure",
    suitableFor: ["adventure", "touring", "off-road"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled CP2",
    displacement: "689cc",
    horsepower: "72 HP @ 9,000 rpm",
    dimensions: "L 2,365 x W 905 x H 1,455 mm",
    weight: "204 kg",
    fuelEfficiency: "22 km/L",
  },
  // Honda - Additional Models
  {
    id: 30,
    name: "Navi",
    brand: "Honda",
    price: 59900,
    image: "https://powersports.honda.com/motorcycle/minimoto/navi/2025/-/media/products/family/navi/trim-hero/gallery/navi/2025/arctic-silver-metallic/2025-navi-silver-gallery-01.png",
    description: "BRAND NEW! Ultra-compact fun bike for urban mobility. 110cc, playful and economical.",
    storeUrl: "https://www.hondaph.com/motor/navi",
    minHeight: 145,
    maxHeight: 175,
    seatHeight: 765,
    maxWeight: 120,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "compact", "fun"],
    engineType: "Single-cylinder, 4-stroke, OHC, eSP",
    displacement: "109.5cc",
    horsepower: "7.8 HP @ 7,250 rpm",
    dimensions: "L 1,805 x W 720 x H 1,039 mm",
    weight: "107 kg",
    fuelEfficiency: "60 km/L",
  },
  {
    id: 31,
    name: "Wave RSX",
    brand: "Honda",
    price: 87900,
    image: "https://headtrungtam.com.vn/upload/product/phien-ban-the-thao-do-den-6636.png",
    description: "Premium underbone with fuel injection. 110cc PGM-FI engine, stylish and efficient.",
    storeUrl: "https://www.hondaph.com/motor/wave-rsx",
    minHeight: 155,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 770,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["commuter", "fuel efficient", "stylish"],
    engineType: "Single-cylinder, 4-stroke, SOHC, PGM-FI",
    displacement: "109.5cc",
    horsepower: "8.8 HP @ 7,500 rpm",
    dimensions: "L 1,913 x W 708 x H 1,044 mm",
    weight: "106 kg",
    fuelEfficiency: "62 km/L",
  },
  {
    id: 32,
    name: "XRM125",
    brand: "Honda",
    price: 85900,
    image: "https://www.bayhonda.nz/media/images_motorbikes/xrm125/thumbnail/2-wheel-clear-cuts-2025-xrm125-2000-x-2000-v4.png",
    description: "Rugged dual-sport underbone for any terrain. 125cc engine, off-road capable.",
    storeUrl: "https://www.hondaph.com/motor/xrm125",
    minHeight: 160,
    maxHeight: 185,
    maxWeight: 140,
    seatHeight: 800,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["off-road", "versatile", "durable"],
    engineType: "Single-cylinder, 4-stroke, SOHC",
    displacement: "124.9cc",
    horsepower: "9.6 HP @ 7,500 rpm",
    dimensions: "L 2,000 x W 755 x H 1,115 mm",
    weight: "113 kg",
    fuelEfficiency: "54 km/L",
  },
  {
    id: 33,
    name: "RS125",
    brand: "Honda",
    price: 99900,
    image: "https://cms.hondaph.com/images/products/66e26447df321.png",
    description: "Sporty underbone with racing aesthetics. 125cc fuel-injected engine, aggressive styling.",
    storeUrl: "https://www.hondaph.com/motor/rs125",
    minHeight: 160,
    maxHeight: 185,
    maxWeight: 140,
    seatHeight: 780,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["sporty", "stylish", "performance"],
    engineType: "Single-cylinder, 4-stroke, SOHC, PGM-FI",
    displacement: "124.9cc",
    horsepower: "9.8 HP @ 7,500 rpm",
    dimensions: "L 1,970 x W 710 x H 1,070 mm",
    weight: "115 kg",
    fuelEfficiency: "53 km/L",
  },
  {
    id: 34,
    name: "Giorno",
    brand: "Honda",
    price: 82900,
    image: "https://cms.hondaph.com/images/assets/679837f34761b.png",
    description: "Modern automatic scooter with smart features. 110cc eSP+ engine, connected mobility.",
    storeUrl: "https://www.hondaph.com/motor/genio",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 760,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["tech-savvy", "modern", "efficient"],
    engineType: "Single-cylinder, 4-stroke, SOHC, eSP+",
    displacement: "109.5cc",
    horsepower: "8.8 HP @ 7,500 rpm",
    dimensions: "L 1,877 x W 680 x H 1,090 mm",
    weight: "105 kg",
    fuelEfficiency: "61 km/L",
  },
  {
    id: 35,
    name: "Click 160",
    brand: "Honda",
    price: 109900,
    image: "https://cms.hondaph.com/images/products/692e7533a2daf.png",
    description: "Enhanced scooter with more power. 160cc engine, spacious and practical.",
    storeUrl: "https://www.hondaph.com/motor/click160",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 140,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["commuter", "practical", "powerful"],
    engineType: "Single-cylinder, 4-stroke, SOHC, eSP+",
    displacement: "156.9cc",
    horsepower: "12.5 HP @ 7,500 rpm",
    dimensions: "L 1,920 x W 700 x H 1,090 mm",
    weight: "120 kg",
    fuelEfficiency: "51 km/L",
  },
  {
    id: 36,
    name: "PCX160",
    brand: "Honda",
    price: 149900,
    image: "https://api.bkkbike.com/uploads/67_2f22afb8-232f-47a6-8cfe-30f07abc112d.jpg",
    description: "Premium automatic scooter with advanced technology. 160cc eSP+ engine, luxurious comfort.",
    storeUrl: "https://www.hondaph.com/motor/pcx160",
    minHeight: 160,
    maxHeight: 190,
    maxWeight: 150,
    seatHeight: 764,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["premium", "comfortable", "tech-savvy"],
    engineType: "Single-cylinder, 4-stroke, SOHC, eSP+",
    displacement: "156.9cc",
    horsepower: "15.8 HP @ 8,500 rpm",
    dimensions: "L 1,935 x W 745 x H 1,105 mm",
    weight: "131 kg",
    fuelEfficiency: "50 km/L",
  },
  // Honda Big Bikes
  {
    id: 37,
    name: "CBR150R",
    brand: "Honda",
    price: 189900,
    image: "https://premiumbikes.ph/wp-content/uploads/2023/02/Honda-CBR150R-1-1.png",
    description: "Entry-level sportbike with race-inspired design. 150cc liquid-cooled engine, thrilling ride.",
    storeUrl: "https://www.hondaph.com/motor/cbr150r",
    minHeight: 165,
    maxHeight: 195,
    maxWeight: 160,
    seatHeight: 790,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["sport", "beginner sportbike", "agile"],
    engineType: "Single-cylinder, 4-stroke, DOHC, Liquid-cooled",
    displacement: "149.2cc",
    horsepower: "17.1 HP @ 9,000 rpm",
    dimensions: "L 1,990 x W 695 x H 1,100 mm",
    weight: "137 kg",
    fuelEfficiency: "43 km/L",
  },
  {
    id: 38,
    name: "ADV350",
    brand: "Honda",
    price: 329900,
    image: "https://bikerentalsamui.com/wp-content/uploads/2021/08/2022_Honda_ADV350_Scooter_News_Details_Spec_02-removebg-preview.png",
    description: "Premium adventure scooter for urban exploration. 350cc engine, versatile performance.",
    storeUrl: "https://www.hondaph.com/motor/adv350",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 170,
    seatHeight: 795,
    vehicleType: "bigbike",
    type: "adventure",
    suitableFor: ["adventure", "touring", "premium"],
    engineType: "Single-cylinder, 4-stroke, SOHC, Liquid-cooled",
    displacement: "330cc",
    horsepower: "29 HP @ 7,500 rpm",
    dimensions: "L 2,150 x W 820 x H 1,400 mm",
    weight: "186 kg",
    fuelEfficiency: "35 km/L",
  },
  {
    id: 39,
    name: "CB500F",
    brand: "Honda",
    price: 449900,
    image: "https://d1hv7ee95zft1i.cloudfront.net/custom/motorcycle-model-photo/original/2022-honda-cb500f-6243fdd78c2e5.jpeg",
    description: "Naked sportbike with versatile performance. 471cc parallel-twin engine, fun and practical.",
    storeUrl: "https://www.hondaph.com/motor/cb500f",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 190,
    seatHeight: 790,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["sport", "versatile", "experienced"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "471cc",
    horsepower: "47 HP @ 8,500 rpm",
    dimensions: "L 2,075 x W 780 x H 1,060 mm",
    weight: "189 kg",
    fuelEfficiency: "28 km/L",
  },
  {
    id: 40,
    name: "CB500 Hornet",
    brand: "Honda",
    price: 469900,
    image: "https://powersports.honda.com/-/media/products/family/cb500f/trims/trim-main/cb500-hornet/2026/2026-cb500-hornet-matte_black_metallic-1505x923.png",
    description: "Sharp naked bike with aggressive styling. 471cc parallel-twin, modern technology.",
    storeUrl: "https://www.hondaph.com/motor/cb500-hornet",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 190,
    seatHeight: 790,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["sport", "aggressive", "tech-savvy"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "471cc",
    horsepower: "47 HP @ 8,500 rpm",
    dimensions: "L 2,085 x W 780 x H 1,070 mm",
    weight: "190 kg",
    fuelEfficiency: "27 km/L",
  },
  {
    id: 41,
    name: "CBR500R",
    brand: "Honda",
    price: 499900,
    image: "https://global-fs.webike-cdn.net/@japan/ph_news/wp-content/uploads/2021/05/5fb4c9c6a242b.png",
    description: "Middleweight sportbike for serious riding. 471cc parallel-twin, track-capable performance.",
    storeUrl: "https://www.hondaph.com/motor/cbr500r",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 190,
    seatHeight: 785,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["sport", "touring", "experienced"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "471cc",
    horsepower: "47 HP @ 8,500 rpm",
    dimensions: "L 2,120 x W 755 x H 1,145 mm",
    weight: "194 kg",
    fuelEfficiency: "27 km/L",
  },
  {
    id: 42,
    name: "Rebel 500",
    brand: "Honda",
    price: 449900,
    image: "https://www.honda-mideast.com/en/-/media/honda/motorcycle/cruiser/honda-rebel-1100/header-img/header-img-rebel-1100/25ym_cmx1100-rebel_studio_dct_se_flare-orange-metallic_rhs-444.png",
    description: "Modern cruiser with classic bobber styling. 471cc parallel-twin, easy to ride.",
    storeUrl: "https://www.hondaph.com/motor/rebel-500",
    minHeight: 165,
    maxHeight: 200,
    maxWeight: 190,
    seatHeight: 690,
    vehicleType: "bigbike",
    type: "cruiser",
    suitableFor: ["cruiser", "stylish", "relaxed"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "471cc",
    horsepower: "46 HP @ 8,500 rpm",
    dimensions: "L 2,205 x W 820 x H 1,090 mm",
    weight: "190 kg",
    fuelEfficiency: "28 km/L",
  },
  {
    id: 43,
    name: "Rebel 1100",
    brand: "Honda",
    price: 899900,
    image: "https://powersports.honda.com/motorcycle/cruiser/-/media/products/family/rebel-1100/trims/trim-main/rebel-1100-dct-se/2026/2026-rebel-1100-se-deep_pearl_gray-1505x923.png",
    description: "Premium cruiser with powerful performance. 1084cc parallel-twin, modern classic.",
    storeUrl: "https://www.hondaph.com/motor/rebel-1100",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 200,
    seatHeight: 700,
    vehicleType: "bigbike",
    type: "cruiser",
    suitableFor: ["cruiser", "premium", "touring"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "1,084cc",
    horsepower: "87 HP @ 7,000 rpm",
    dimensions: "L 2,240 x W 850 x H 1,115 mm",
    weight: "233 kg",
    fuelEfficiency: "22 km/L",
  },
  {
    id: 44,
    name: "Gold Wing",
    brand: "Honda",
    price: 2299900,
    image: "https://www.hondaph.com/honda-bigbikes/images/products/6836a4542fcfd.png",
    description: "Ultimate luxury touring motorcycle. 1833cc flat-six engine, unmatched comfort and technology.",
    storeUrl: "https://www.hondaph.com/motor/gold-wing",
    minHeight: 175,
    maxHeight: 200,
    maxWeight: 220,
    seatHeight: 745,
    vehicleType: "bigbike",
    type: "touring",
    suitableFor: ["luxury", "touring", "premium"],
    engineType: "Flat-6, 4-stroke, SOHC, Liquid-cooled",
    displacement: "1,833cc",
    horsepower: "126 HP @ 5,500 rpm",
    dimensions: "L 2,575 x W 905 x H 1,340 mm",
    weight: "383 kg",
    fuelEfficiency: "18 km/L",
  },
  // Suzuki Motorcycles
  {
    id: 45,
    name: "Smash",
    brand: "Suzuki",
    price: 68900,
    image: "https://premiumbikes.ph/wp-content/uploads/2024/01/FW110D-E1BLUEIV.png",
    description: "Fuel-efficient underbone, perfect for daily commute. 115cc engine with excellent reliability.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/smash",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 120,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["beginner", "city commute", "fuel efficient"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "113cc",
    horsepower: "8.7 HP @ 7,500 rpm",
    dimensions: "L 1,940 x W 720 x H 1,080 mm",
    weight: "98 kg",
    fuelEfficiency: "63 km/L",
  },
  {
    id: 46,
    name: "Raider J",
    brand: "Suzuki",
    price: 78900,
    image: "https://suzuki.motortrade.com.ph/wp-content/uploads/2022/01/Blue-2.png",
    description: "Sports underbone with powerful performance. 115cc engine, stylish and sporty design.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/raider-j",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 125,
    seatHeight: 775,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["intermediate", "city commute", "sporty"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "113cc",
    horsepower: "9.2 HP @ 8,000 rpm",
    dimensions: "L 1,960 x W 730 x H 1,090 mm",
    weight: "103 kg",
    fuelEfficiency: "58 km/L",
  },
  {
    id: 47,
    name: "Skydrive 125",
    brand: "Suzuki",
    price: 87900,
    image: "https://suzuki.motortrade.com.ph/wp-content/uploads/2018/09/Black-2.png",
    description: "Modern scooter with sporty design. 125cc engine, comfortable and efficient for city riding.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/skydrive",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 770,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "city commute", "stylish"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "124cc",
    horsepower: "9.4 HP @ 7,500 rpm",
    dimensions: "L 1,880 x W 680 x H 1,100 mm",
    weight: "108 kg",
    fuelEfficiency: "52 km/L",
  },
  {
    id: 48,
    name: "Burgman Street",
    brand: "Suzuki",
    price: 109900,
    image: "https://premiumbikes.ph/wp-content/uploads/2024/01/UB125NMX-MRED-1.png",
    description: "Premium scooter with maxi-scooter styling. 125cc engine, spacious and comfortable.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/burgman-street",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 135,
    seatHeight: 780,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["intermediate", "city commute", "premium"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "124cc",
    horsepower: "8.7 HP @ 6,750 rpm",
    dimensions: "L 1,895 x W 665 x H 1,160 mm",
    weight: "108 kg",
    fuelEfficiency: "50 km/L",
  },
  {
    id: 49,
    name: "Access 125",
    brand: "Suzuki",
    price: 92900,
    image: "https://premiumbikes.ph/wp-content/uploads/2025/11/UZ125NEY-1BLACK.png",
    description: "Practical scooter with large storage. 125cc engine, ideal for daily errands and commuting.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/access",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 130,
    seatHeight: 765,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "city commute", "practical"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "124cc",
    horsepower: "8.7 HP @ 6,750 rpm",
    dimensions: "L 1,870 x W 690 x H 1,160 mm",
    weight: "103 kg",
    fuelEfficiency: "54 km/L",
  },
  // Suzuki Big Bikes
  {
    id: 50,
    name: "Burgman 400",
    brand: "Suzuki",
    price: 529900,
    image: "https://mc.suzuki.com.ph/wp-content/uploads/2024/02/image-7-26.png",
    description: "Maxi-scooter with luxury comfort. 400cc engine, perfect for long-distance touring.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/burgman-400",
    minHeight: 165,
    maxHeight: 195,
    maxWeight: 180,
    seatHeight: 735,
    vehicleType: "bigbike",
    type: "touring",
    suitableFor: ["touring", "premium", "comfort"],
    engineType: "Single-cylinder, 4-stroke, DOHC, Liquid-cooled",
    displacement: "399cc",
    horsepower: "30 HP @ 6,800 rpm",
    dimensions: "L 2,160 x W 780 x H 1,260 mm",
    weight: "205 kg",
    fuelEfficiency: "28 km/L",
  },
  {
    id: 51,
    name: "GSX-8R",
    brand: "Suzuki",
    price: 649900,
    image: "https://suzukicycles.com/-/media/project/cycles/images/products/motorcycles/gsx-8r/studio-gallery/black/gsx800frqm4_ykv_diagonal_2400x1600.png",
    description: "Sport bike with parallel-twin engine. 776cc, agile and powerful for track and street.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/gsx-8r",
    minHeight: 170,
    maxHeight: 195,
    maxWeight: 150,
    seatHeight: 810,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["experienced", "sport", "performance"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "776cc",
    horsepower: "83 HP @ 8,500 rpm",
    dimensions: "L 2,140 x W 730 x H 1,145 mm",
    weight: "202 kg",
    fuelEfficiency: "22 km/L",
  },
  {
    id: 52,
    name: "GSX-8T",
    brand: "Suzuki",
    price: 689900,
    image: "https://suzukicycles.com/-/media/project/cycles/images/products/motorcycles/gsx-8t/color-gallery-images/gsx800trqm6_qsy_rdiagonal_2400x1600.png",
    description: "Sport-touring variant with 776cc parallel-twin. Comfort meets performance.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/gsx-8t",
    minHeight: 170,
    maxHeight: 195,
    maxWeight: 155,
    seatHeight: 820,
    vehicleType: "bigbike",
    type: "touring",
    suitableFor: ["experienced", "touring", "sport"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "776cc",
    horsepower: "83 HP @ 8,500 rpm",
    dimensions: "L 2,180 x W 845 x H 1,295 mm",
    weight: "211 kg",
    fuelEfficiency: "21 km/L",
  },
  {
    id: 53,
    name: "GSX-8S",
    brand: "Suzuki",
    price: 619900,
    image: "https://suzukicycles.com/-/media/project/cycles/images/products/motorcycles/gsx-8s/2026/gallery/gsx800rqm6_bnr_diagonal_cgi_2400x1600.png",
    description: "Naked sport bike with 776cc parallel-twin. Aggressive styling and performance.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/gsx-8s",
    minHeight: 170,
    maxHeight: 195,
    maxWeight: 150,
    seatHeight: 810,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["experienced", "sport", "street"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "776cc",
    horsepower: "83 HP @ 8,500 rpm",
    dimensions: "L 2,140 x W 830 x H 1,095 mm",
    weight: "202 kg",
    fuelEfficiency: "22 km/L",
  },
  {
    id: 54,
    name: "Hayabusa",
    brand: "Suzuki",
    price: 1299900,
    image: "https://premiumbikes.ph/wp-content/uploads/2023/02/Suzuki-Hayabusa-1.png",
    description: "Legendary hyperbike. 1,340cc inline-4, ultimate speed and power.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/hayabusa",
    minHeight: 175,
    maxHeight: 200,
    maxWeight: 160,
    seatHeight: 800,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["expert", "performance", "speed"],
    engineType: "Inline-4, 4-stroke, DOHC, Liquid-cooled",
    displacement: "1,340cc",
    horsepower: "190 HP @ 9,700 rpm",
    dimensions: "L 2,180 x W 735 x H 1,165 mm",
    weight: "264 kg",
    fuelEfficiency: "16 km/L",
  },
  {
    id: 55,
    name: "GSX-R1000",
    brand: "Suzuki",
    price: 1099900,
    image: "https://mc.suzuki.com.ph/wp-content/uploads/2023/11/gsx-r1000_2-.png",
    description: "Pure superbike with 1,000cc inline-4. Track-focused performance and technology.",
    storeUrl: "https://www.suzuki.com.ph/motorcycle/gsx-r1000",
    minHeight: 175,
    maxHeight: 195,
    maxWeight: 155,
    seatHeight: 825,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["expert", "track", "performance"],
    engineType: "Inline-4, 4-stroke, DOHC, Liquid-cooled",
    displacement: "999cc",
    horsepower: "202 HP @ 13,200 rpm",
    dimensions: "L 2,075 x W 705 x H 1,145 mm",
    weight: "203 kg",
    fuelEfficiency: "15 km/L",
  },
  // Kawasaki Motorcycles
  {
    id: 56,
    name: "CT100",
    brand: "Kawasaki",
    price: 64900,
    image: "https://mc-3c97947d-a565-458e-bb21-6664-cm.azurewebsites.net/-/media/Bajaj/Images/360/CT-100-ES-Alloy/CT-100-2023-Update/Black-Red/1.png",
    description: "Reliable underbone for daily commute. 100cc engine, economical and durable.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/ct100",
    minHeight: 150,
    maxHeight: 180,
    maxWeight: 115,
    seatHeight: 760,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["beginner", "city commute", "fuel efficient"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "98cc",
    horsepower: "7.8 HP @ 7,500 rpm",
    dimensions: "L 1,920 x W 710 x H 1,050 mm",
    weight: "93 kg",
    fuelEfficiency: "68 km/L",
  },
  {
    id: 57,
    name: "CT125",
    brand: "Kawasaki",
    price: 76900,
    image: "https://suertemotoplaza.com/wp-content/uploads/2020/10/CT125_RED4.png",
    description: "Upgraded underbone with 125cc power. More power for versatile riding.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/ct125",
    minHeight: 150,
    maxHeight: 185,
    maxWeight: 120,
    seatHeight: 770,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["beginner", "city commute", "versatile"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "124cc",
    horsepower: "9.5 HP @ 7,500 rpm",
    dimensions: "L 1,940 x W 720 x H 1,070 mm",
    weight: "99 kg",
    fuelEfficiency: "60 km/L",
  },
  {
    id: 58,
    name: "CT150",
    brand: "Kawasaki",
    price: 89900,
    image: "https://suertemotoplaza.com/wp-content/uploads/2020/10/CT150_BLUE2.png",
    description: "Powerful underbone with 150cc engine. Great for city and highway riding.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/ct150",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 125,
    seatHeight: 775,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["intermediate", "commute", "highway"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "149cc",
    horsepower: "12.5 HP @ 8,000 rpm",
    dimensions: "L 1,960 x W 730 x H 1,080 mm",
    weight: "105 kg",
    fuelEfficiency: "52 km/L",
  },
  {
    id: 59,
    name: "Brusky 125",
    brand: "Kawasaki",
    price: 84900,
    image: "https://premiumbikes.ph/wp-content/uploads/2025/05/Kawasaki-Brusky-2.png",
    description: "Rugged scooter built for adventure. 125cc engine, tough and capable.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/brusky",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 130,
    seatHeight: 785,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["intermediate", "adventure", "rugged"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "124cc",
    horsepower: "9.0 HP @ 7,000 rpm",
    dimensions: "L 1,900 x W 710 x H 1,130 mm",
    weight: "115 kg",
    fuelEfficiency: "48 km/L",
  },
  {
    id: 60,
    name: "Barako",
    brand: "Kawasaki",
    price: 119900,
    image: "https://kawasaki.ph/storage/model_images/TRWtqKc84mYBQVnXVLSrWW8OJuitfAmX5h9rvTUA.png",
    description: "Iconic Filipino motorcycle. 175cc engine, powerful and legendary.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/barako",
    minHeight: 160,
    maxHeight: 190,
    maxWeight: 135,
    seatHeight: 790,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["intermediate", "power", "iconic"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "175cc",
    horsepower: "14.8 HP @ 8,000 rpm",
    dimensions: "L 2,050 x W 760 x H 1,100 mm",
    weight: "118 kg",
    fuelEfficiency: "45 km/L",
  },
  // Kawasaki Big Bikes
  {
    id: 61,
    name: "Ninja 500",
    brand: "Kawasaki",
    price: 399900,
    image: "https://ausmotorcyclist.com.au/wp-content/uploads/2025/01/3ff5f472-ac0f-4d59-82d4-7e5cfe5330fd.png",
    description: "Middleweight sport bike. 451cc parallel-twin, perfect entry to supersport.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/ninja-500",
    minHeight: 165,
    maxHeight: 190,
    maxWeight: 145,
    seatHeight: 785,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["intermediate", "sport", "beginner-friendly"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "451cc",
    horsepower: "45 HP @ 9,000 rpm",
    dimensions: "L 2,005 x W 710 x H 1,120 mm",
    weight: "173 kg",
    fuelEfficiency: "28 km/L",
  },
  {
    id: 62,
    name: "Eliminator",
    brand: "Kawasaki",
    price: 449900,
    image: "https://premiumbikes.ph/wp-content/uploads/2024/01/Kawasaki-Eliminator-STD.png",
    description: "Neo-retro cruiser. 451cc parallel-twin, stylish and comfortable.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/eliminator",
    minHeight: 160,
    maxHeight: 190,
    maxWeight: 150,
    seatHeight: 735,
    vehicleType: "bigbike",
    type: "cruiser",
    suitableFor: ["intermediate", "cruiser", "stylish"],
    engineType: "Parallel-twin, 4-stroke, DOHC, Liquid-cooled",
    displacement: "451cc",
    horsepower: "45 HP @ 9,000 rpm",
    dimensions: "L 2,130 x W 830 x H 1,120 mm",
    weight: "175 kg",
    fuelEfficiency: "26 km/L",
  },
  {
    id: 63,
    name: "Ninja e-1",
    brand: "Kawasaki",
    price: 329900,
    image: "https://images.otf3.pixelmotiondemo.com/UGgTe-20240708192539.png",
    description: "Electric sport bike. Zero emissions, instant torque, modern technology.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/ninja-e-1",
    minHeight: 160,
    maxHeight: 185,
    maxWeight: 140,
    seatHeight: 775,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["intermediate", "electric", "eco-friendly"],
    engineType: "Electric motor, Permanent magnet synchronous",
    displacement: "N/A (Electric)",
    horsepower: "9 HP (equivalent)",
    dimensions: "L 1,935 x W 715 x H 1,120 mm",
    weight: "140 kg",
    fuelEfficiency: "120 km/charge",
  },
  {
    id: 64,
    name: "Ninja ZX-14R",
    brand: "Kawasaki",
    price: 1399900,
    image: "https://bike.net/res/media/img/hx400/ref/f26/108304@2x.png",
    description: "Hypersport motorcycle. 1,441cc inline-4, extreme power and speed.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/ninja-zx-14r",
    minHeight: 175,
    maxHeight: 200,
    maxWeight: 160,
    seatHeight: 800,
    vehicleType: "bigbike",
    type: "sportbike",
    suitableFor: ["expert", "speed", "performance"],
    engineType: "Inline-4, 4-stroke, DOHC, Liquid-cooled",
    displacement: "1,441cc",
    horsepower: "208 HP @ 10,000 rpm",
    dimensions: "L 2,170 x W 790 x H 1,170 mm",
    weight: "268 kg",
    fuelEfficiency: "14 km/L",
  },
  {
    id: 65,
    name: "Versys 1000 SE",
    brand: "Kawasaki",
    price: 899900,
    image: "https://uruguay.kawasaki-la.com/Content/Images/SubBrand/2026-versys/26KLZ1100C_40TBU1DRF3CG_A.png?w=980",
    description: "Adventure-touring bike. 1,043cc inline-4, versatile for any journey.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/versys-1000-se",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 165,
    seatHeight: 840,
    vehicleType: "bigbike",
    type: "adventure",
    suitableFor: ["experienced", "touring", "adventure"],
    engineType: "Inline-4, 4-stroke, DOHC, Liquid-cooled",
    displacement: "1,043cc",
    horsepower: "120 HP @ 9,000 rpm",
    dimensions: "L 2,270 x W 950 x H 1,490 mm",
    weight: "257 kg",
    fuelEfficiency: "19 km/L",
  },
  {
    id: 66,
    name: "Versys 1000",
    brand: "Kawasaki",
    price: 849900,
    image: "https://premiumbikes.ph/wp-content/uploads/2024/02/Kawasaki-Versys-1000-SE.png",
    description: "Adventure-touring bike standard edition. 1,043cc inline-4, reliable and capable.",
    storeUrl: "https://www.kawasaki.com.ph/motorcycle/versys-1000",
    minHeight: 170,
    maxHeight: 200,
    maxWeight: 165,
    seatHeight: 840,
    vehicleType: "bigbike",
    type: "adventure",
    suitableFor: ["experienced", "touring", "adventure"],
    engineType: "Inline-4, 4-stroke, DOHC, Liquid-cooled",
    displacement: "1,043cc",
    horsepower: "120 HP @ 9,000 rpm",
    dimensions: "L 2,270 x W 950 x H 1,490 mm",
    weight: "250 kg",
    fuelEfficiency: "19 km/L",
  },
  // Vespa
  {
    id: 67,
    name: "S 125",
    brand: "Vespa",
    price: 189900,
    image: "https://images.piaggio.com/vespa/vehicles/evpq000vt6/evpqr7nvt6/evpqr7nvt6-01-s.png",
    description: "Sporty Vespa scooter. 125cc 3-valve engine, modern Italian design.",
    storeUrl: "https://www.vespa.com/ph/vespa-s-125",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 130,
    seatHeight: 790,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "stylish", "premium"],
    engineType: "Single-cylinder, 4-stroke, 3-valve",
    displacement: "124.5cc",
    horsepower: "9.8 HP @ 7,750 rpm",
    dimensions: "L 1,860 x W 735 x H 1,140 mm",
    weight: "114 kg",
    fuelEfficiency: "45 km/L",
  },
  {
    id: 68,
    name: "Primavera",
    brand: "Vespa",
    price: 199900,
    image: "https://images.piaggio.com/vespa/vehicles/evf8000t05/evf8v1yt05/evf8v1yt05-01-s.png",
    description: "Classic Vespa design. 125cc engine, timeless Italian elegance.",
    storeUrl: "https://www.vespa.com/ph/primavera",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 130,
    seatHeight: 780,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["beginner", "classic", "premium"],
    engineType: "Single-cylinder, 4-stroke, 3-valve",
    displacement: "124.5cc",
    horsepower: "9.8 HP @ 7,750 rpm",
    dimensions: "L 1,865 x W 690 x H 1,150 mm",
    weight: "116 kg",
    fuelEfficiency: "44 km/L",
  },
  {
    id: 69,
    name: "Sprint",
    brand: "Vespa",
    price: 209900,
    image: "https://images.piaggio.com/vespa/vehicles/evfb000vt5/evfbg70vt5/evfbg70vt5-01-m.png",
    description: "Sport-oriented Vespa. 125cc engine, aggressive styling and performance.",
    storeUrl: "https://www.vespa.com/ph/sprint",
    minHeight: 155,
    maxHeight: 185,
    maxWeight: 130,
    seatHeight: 790,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["intermediate", "sporty", "premium"],
    engineType: "Single-cylinder, 4-stroke, 3-valve",
    displacement: "124.5cc",
    horsepower: "9.8 HP @ 7,750 rpm",
    dimensions: "L 1,860 x W 735 x H 1,135 mm",
    weight: "118 kg",
    fuelEfficiency: "43 km/L",
  },
  {
    id: 70,
    name: "GTV 300",
    brand: "Vespa",
    price: 429900,
    image: "https://images.piaggio.com/vespa/vehicles/evh4000vt1/evh4v74vt1/evh4v74vt1-01-m.png",
    description: "Gran Turismo Vespa. 278cc engine, luxury touring scooter.",
    storeUrl: "https://www.vespa.com/ph/gtv-300",
    minHeight: 160,
    maxHeight: 190,
    maxWeight: 145,
    seatHeight: 795,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["experienced", "touring", "luxury"],
    engineType: "Single-cylinder, 4-stroke, 4-valve",
    displacement: "278cc",
    horsepower: "23.5 HP @ 7,750 rpm",
    dimensions: "L 2,035 x W 760 x H 1,350 mm",
    weight: "165 kg",
    fuelEfficiency: "32 km/L",
  },
  {
    id: 71,
    name: "GTS Super Sport 300",
    brand: "Vespa",
    price: 449900,
    image: "https://images.piaggio.com/vespa/vehicles/evh2000au1/evh2g1zau1/evh2g1zau1-01-s.png",
    description: "Top-spec Vespa scooter. 278cc engine, ultimate Italian luxury and performance.",
    storeUrl: "https://www.vespa.com/ph/gts-super-sport-300",
    minHeight: 160,
    maxHeight: 190,
    maxWeight: 145,
    seatHeight: 800,
    vehicleType: "motorcycle",
    type: "scooter",
    suitableFor: ["experienced", "sport", "premium"],
    engineType: "Single-cylinder, 4-stroke, 4-valve",
    displacement: "278cc",
    horsepower: "23.5 HP @ 7,750 rpm",
    dimensions: "L 2,035 x W 760 x H 1,350 mm",
    weight: "167 kg",
    fuelEfficiency: "31 km/L",
  },
  // Keeway
  {
    id: 72,
    name: "Cafe Racer 152",
    brand: "Keeway",
    price: 129900,
    image: "https://cdn.keeway.com/keeway-3-0/media/2196/2560x2180-(10).png",
    description: "Retro cafe racer styling. 150cc engine, vintage look with modern reliability.",
    storeUrl: "https://keeway.com.ph/motorcycle/cafe-racer-152",
    minHeight: 160,
    maxHeight: 185,
    maxWeight: 130,
    seatHeight: 780,
    vehicleType: "motorcycle",
    type: "underbone",
    suitableFor: ["intermediate", "retro", "stylish"],
    engineType: "Single-cylinder, 4-stroke, Air-cooled",
    displacement: "149cc",
    horsepower: "12.2 HP @ 8,000 rpm",
    dimensions: "L 2,020 x W 770 x H 1,070 mm",
    weight: "125 kg",
    fuelEfficiency: "40 km/L",
  },
  // Toyota Cars
  {
    id: 73,
    name: "GT 86",
    brand: "Toyota",
    price: 2398000,
    image: "https://di-uploads-development.dealerinspire.com/elmhursttoyota/spanishtoggle0719/uploads/2016/04/2019-toyota-86.png",
    description: "Iconic sports car. 2.0L boxer engine, rear-wheel drive, pure driving pleasure.",
    storeUrl: "https://www.toyota.com.ph/gt86",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 350,
    capacity: 4,
    vehicleType: "car",
    type: "hatchback",
    suitableFor: ["sport", "performance", "enthusiast"],
    engineType: "Boxer 4-cylinder, DOHC, Naturally aspirated",
    displacement: "2.0L",
    horsepower: "200 HP @ 7,000 rpm",
    dimensions: "L 4,240 x W 1,775 x H 1,285 mm",
    weight: "1,270 kg",
    fuelEfficiency: "11 km/L (city) / 15 km/L (highway)",
  },
  {
    id: 74,
    name: "GR Yaris",
    brand: "Toyota",
    price: 2980000,
    image: "https://res.cloudinary.com/halfway-group/image/upload/f_auto,fl_lossy/w_750%2Cq_auto:good%2Cc_scale/v1771231902/oem/full/toyota/gr-yaris/colour-selectors/fierce_red_kronpg.png",
    description: "Rally-bred hot hatch. 1.6L turbo 3-cylinder, AWD, ultimate performance.",
    storeUrl: "https://www.toyota.com.ph/gr-yaris",
    minHeight: 155,
    maxHeight: 190,
    maxWeight: 340,
    capacity: 4,
    vehicleType: "car",
    type: "hatchback",
    suitableFor: ["sport", "rally", "performance"],
    engineType: "Inline-3, Turbocharged, DOHC",
    displacement: "1.6L",
    horsepower: "268 HP @ 6,500 rpm",
    dimensions: "L 3,995 x W 1,805 x H 1,455 mm",
    weight: "1,280 kg",
    fuelEfficiency: "10 km/L (city) / 14 km/L (highway)",
  },
  {
    id: 75,
    name: "GR Corolla",
    brand: "Toyota",
    price: 3280000,
    image: "https://di-sitebuilder-assets.dealerinspire.com/Toyota/MLP/GRCorolla/2024/color-Blue-Flame.png",
    description: "Performance hatchback. 1.6L turbo 3-cylinder, AWD, track-ready from factory.",
    storeUrl: "https://www.toyota.com.ph/gr-corolla",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 350,
    capacity: 5,
    vehicleType: "car",
    type: "hatchback",
    suitableFor: ["sport", "performance", "daily"],
    engineType: "Inline-3, Turbocharged, DOHC",
    displacement: "1.6L",
    horsepower: "300 HP @ 6,500 rpm",
    dimensions: "L 4,370 x W 1,850 x H 1,475 mm",
    weight: "1,474 kg",
    fuelEfficiency: "9 km/L (city) / 13 km/L (highway)",
  },
  // Honda Cars
  {
    id: 76,
    name: "Civic Type R",
    brand: "Honda",
    price: 3198000,
    image: "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/483059fa-b09f-4e03-b206-323bb0a0e877/b6f03d08-1f37-4b8b-bc8a-5d47b5c7925c.png",
    description: "Front-wheel drive king. 2.0L turbo, track weapon, ultimate hot hatch.",
    storeUrl: "https://www.hondaph.com/civic-type-r",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 360,
    capacity: 5,
    vehicleType: "car",
    type: "hatchback",
    suitableFor: ["sport", "track", "performance"],
    engineType: "Inline-4, Turbocharged, DOHC, VTEC",
    displacement: "2.0L",
    horsepower: "315 HP @ 6,500 rpm",
    dimensions: "L 4,595 x W 1,890 x H 1,405 mm",
    weight: "1,429 kg",
    fuelEfficiency: "9 km/L (city) / 13 km/L (highway)",
  },
  {
    id: 77,
    name: "Civic Type R (EK9)",
    brand: "Honda",
    price: 4500000,
    image: "https://wipertech.sfo2.cdn.digitaloceanspaces.com/general/honda-civic-type-r-hatch-1997-2000/_small/Honda-Civic-Type-R-1997-2000.png",
    description: "Legendary 90s icon. 1.6L VTEC, collectible classic, pure driving joy.",
    storeUrl: "https://www.hondaph.com/civic-type-r-ek9",
    minHeight: 155,
    maxHeight: 190,
    maxWeight: 340,
    capacity: 4,
    vehicleType: "car",
    type: "hatchback",
    suitableFor: ["classic", "collector", "enthusiast"],
    engineType: "Inline-4, DOHC, VTEC, Naturally aspirated",
    displacement: "1.6L",
    horsepower: "185 HP @ 8,200 rpm",
    dimensions: "L 4,135 x W 1,695 x H 1,360 mm",
    weight: "1,060 kg",
    fuelEfficiency: "11 km/L (city) / 15 km/L (highway)",
  },
  // Ford Cars
  {
    id: 8,
    name: "Vios",
    brand: "Toyota",
    price: 802000,
    image:
      "https://carsome.my/news/wp-content/uploads/2023/04/Vios-Baru-2023-Red.png",
    description:
      "Reliable sedan with spacious interior. Great for families and long drives.",
    storeUrl: "https://www.toyota.com.ph/vios",
    minHeight: 145,
    maxHeight: 200,
    maxWeight: 450,
    vehicleType: "car",
    type: "sedan",
    capacity: 5,
    suitableFor: ["family", "reliable", "comfortable"],
    engineType: "4-cylinder, 16-valve, DOHC Dual VVT-i",
    displacement: "1.5L",
    horsepower: "106 HP @ 6,000 rpm",
    dimensions: "L 4,425 x W 1,730 x H 1,475 mm",
    weight: "1,075 kg",
    fuelEfficiency: "16 km/L",
  },
  {
    id: 79,
    name: "Everest",
    brand: "Ford",
    price: 2198000,
    image: "https://preview.dealer-asset.co/ph1396/siteassets/thumbnail%20turbo%20titanium.png",
    description: "7-seater SUV. 2.0L bi-turbo diesel, family adventure vehicle.",
    storeUrl: "https://www.ford.com.ph/everest",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 400,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "adventure", "spacious"],
    engineType: "Inline-4, Bi-Turbo Diesel, DOHC",
    displacement: "2.0L",
    horsepower: "210 HP @ 3,750 rpm",
    dimensions: "L 4,914 x W 1,923 x H 1,842 mm",
    weight: "2,184 kg",
    fuelEfficiency: "11 km/L (city) / 15 km/L (highway)",
  },
  {
    id: 80,
    name: "Shelby GT500",
    brand: "Ford",
    price: 12500000,
    image: "https://www.dealerfireblog.com/akinsford/wp-content/uploads/sites/1027/2019/12/2020-Ford-Mustang-Shelby-colors_o9.png",
    description: "Supercharged American muscle. 5.2L V8, 760 HP, quarter-mile monster.",
    storeUrl: "https://www.ford.com/mustang-shelby-gt500",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 380,
    capacity: 4,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["muscle", "performance", "collector"],
    engineType: "V8, Supercharged, DOHC",
    displacement: "5.2L",
    horsepower: "760 HP @ 7,300 rpm",
    dimensions: "L 4,788 x W 1,920 x H 1,381 mm",
    weight: "1,907 kg",
    fuelEfficiency: "6 km/L (city) / 10 km/L (highway)",
  },
  {
    id: 81,
    name: "Explorer",
    brand: "Ford",
    price: 3498000,
    image: "https://www.ford.ca/acslibs/content/dam/na/ford/en_ca/images/explorer/2026/jellybeans/26my_frd_epr_actv_ps34_wrk-min.png",
    description: "Premium 7-seater SUV. 2.3L EcoBoost turbo, luxury and versatility.",
    storeUrl: "https://www.ford.com.ph/explorer",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 400,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "luxury", "spacious"],
    engineType: "Inline-4, Turbocharged, DOHC",
    displacement: "2.3L",
    horsepower: "300 HP @ 5,500 rpm",
    dimensions: "L 5,050 x W 2,004 x H 1,778 mm",
    weight: "2,050 kg",
    fuelEfficiency: "9 km/L (city) / 13 km/L (highway)",
  },
  // Mitsubishi Cars
  {
    id: 82,
    name: "Lancer Evolution X",
    brand: "Mitsubishi",
    price: 3800000,
    image: "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/d114d3f5-9188-4ff6-8102-20e1a3833912/4443512f-6a45-4922-92a1-7a338f2688bf.png",
    description: "Final evolution. 2.0L turbo 4-cylinder, AWD, rally legend.",
    storeUrl: "https://www.mitsubishi-motors.com.ph/lancer-evolution",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 360,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["sport", "rally", "performance"],
    engineType: "Inline-4, Turbocharged, DOHC, MIVEC",
    displacement: "2.0L",
    horsepower: "291 HP @ 6,500 rpm",
    dimensions: "L 4,545 x W 1,810 x H 1,480 mm",
    weight: "1,590 kg",
    fuelEfficiency: "8 km/L (city) / 12 km/L (highway)",
  },
  {
    id: 83,
    name: "Montero Sport",
    brand: "Mitsubishi",
    price: 2098000,
    image: "https://www.mitsubishi-motors.com.ph/content/dam/mitsubishi-motors-ph/images/site-images/articles/2021/QX-Front-FS-GT4WD.png",
    description: "Premium 7-seater SUV. 2.4L diesel, capable and refined.",
    storeUrl: "https://www.mitsubishi-motors.com.ph/montero-sport",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 400,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "adventure", "premium"],
    engineType: "Inline-4, Turbo Diesel, DOHC",
    displacement: "2.4L",
    horsepower: "181 HP @ 3,500 rpm",
    dimensions: "L 4,825 x W 1,815 x H 1,835 mm",
    weight: "2,155 kg",
    fuelEfficiency: "11 km/L (city) / 16 km/L (highway)",
  },
  {
    id: 84,
    name: "Xpander",
    brand: "Mitsubishi",
    price: 1198000,
    image: "https://www.mitsubishi-motors.com.ph/content/dam/mitsubishi-motors-ph/images/cars/xpander/2026/models/nc1wlrphlvp-ge-ph-opt/primary/exterior/C31_45_26MY_RN.png",
    description: "Compact 7-seater MPV. 1.5L gasoline, efficient family transport.",
    storeUrl: "https://www.mitsubishi-motors.com.ph/xpander",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 380,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "efficient", "practical"],
    engineType: "Inline-4, DOHC, MIVEC",
    displacement: "1.5L",
    horsepower: "105 HP @ 6,000 rpm",
    dimensions: "L 4,475 x W 1,750 x H 1,695 mm",
    weight: "1,210 kg",
    fuelEfficiency: "13 km/L (city) / 18 km/L (highway)",
  },
  {
    id: 85,
    name: "Innova 2.8 E Diesel",
    brand: "Mitsubishi",
    price: 1598000,
    image: "https://toyotalucena.com/storage/app/uploads/public/60c/095/eb4/60c095eb40c4f551389375.png",
    description: "Popular MPV. 2.8L diesel, reliable family workhorse.",
    storeUrl: "https://www.mitsubishi-motors.com.ph/innova",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 400,
    capacity: 8,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "reliable", "spacious"],
    engineType: "Inline-4, Turbo Diesel, DOHC",
    displacement: "2.8L",
    horsepower: "174 HP @ 3,400 rpm",
    dimensions: "L 4,735 x W 1,830 x H 1,795 mm",
    weight: "1,890 kg",
    fuelEfficiency: "12 km/L (city) / 17 km/L (highway)",
  },
  // Subaru
  {
    id: 86,
    name: "Impreza (GC8)",
    brand: "Subaru",
    price: 3200000,
    image: "https://awdadventure.com/cdn/shop/collections/93-01-GC.GF_.GM-PNG.png?v=1578675833&width=1296",
    description: "Classic rally icon. 2.0L turbo boxer, AWD, 90s legend.",
    storeUrl: "https://www.subaru.com.ph/impreza",
    minHeight: 155,
    maxHeight: 190,
    maxWeight: 340,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["rally", "classic", "collector"],
    engineType: "Boxer 4-cylinder, Turbocharged, DOHC",
    displacement: "2.0L",
    horsepower: "280 HP @ 6,500 rpm",
    dimensions: "L 4,340 x W 1,690 x H 1,405 mm",
    weight: "1,240 kg",
    fuelEfficiency: "9 km/L (city) / 13 km/L (highway)",
  },
  // Nissan Cars
  {
    id: 87,
    name: "Patrol",
    brand: "Nissan",
    price: 3998000,
    image: "https://images.carsguide.com.au/image/upload/e_trim:10,f_auto,c_scale,t_cg_base,w_678/v1/editorial/nissan-patrol-my22-index-1.png",
    description: "Full-size luxury SUV. 5.6L V8, ultimate comfort and capability.",
    storeUrl: "https://www.nissan.com.ph/patrol",
    minHeight: 160,
    maxHeight: 205,
    maxWeight: 450,
    capacity: 8,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["luxury", "off-road", "family"],
    engineType: "V8, DOHC, Naturally aspirated",
    displacement: "5.6L",
    horsepower: "400 HP @ 5,800 rpm",
    dimensions: "L 5,165 x W 1,995 x H 1,940 mm",
    weight: "2,695 kg",
    fuelEfficiency: "7 km/L (city) / 11 km/L (highway)",
  },
  {
    id: 88,
    name: "Navara",
    brand: "Nissan",
    price: 1598000,
    image: "https://images.carsguide.com.au/image/upload/e_trim:10,f_auto,c_scale,t_cg_base,w_678/v1/editorial/vhs/Nissan-Navara-dual-cab_0.png",
    description: "Versatile pickup truck. 2.5L diesel, workhorse and weekend warrior.",
    storeUrl: "https://www.nissan.com.ph/navara",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["work", "adventure", "truck"],
    engineType: "Inline-4, Turbo Diesel, DOHC",
    displacement: "2.5L",
    horsepower: "190 HP @ 3,600 rpm",
    dimensions: "L 5,255 x W 1,850 x H 1,819 mm",
    weight: "2,050 kg",
    fuelEfficiency: "11 km/L (city) / 15 km/L (highway)",
  },
  {
    id: 89,
    name: "Terra",
    brand: "Nissan",
    price: 1898000,
    image: "https://img.pcauto.com/model/images/touPic/my/Nissan-Terra_1094.png",
    description: "7-seater ladder-frame SUV. 2.5L diesel, rugged family vehicle.",
    storeUrl: "https://www.nissan.com.ph/terra",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 400,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "off-road", "rugged"],
    engineType: "Inline-4, Turbo Diesel, DOHC",
    displacement: "2.5L",
    horsepower: "190 HP @ 3,600 rpm",
    dimensions: "L 4,900 x W 1,865 x H 1,865 mm",
    weight: "2,080 kg",
    fuelEfficiency: "11 km/L (city) / 15 km/L (highway)",
  },
  {
    id: 90,
    name: "Urvan",
    brand: "Nissan",
    price: 1498000,
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhpl_blUfBrWi8f4P5iySR6BfSIinbNLO-IwCh9tk95A5qo_lupEiALpr0ZA5jFySQmuviCVnFVfOlu9rwRLrOXqPAApHY2WHI9Xaln9fNWme7ZE4fgGbLPu6Zfh78kwqW1WJ7RvgEPI3Ep/s1600/E24+Model.png",
    description: "15-seater commercial van. 2.5L diesel, reliable people mover.",
    storeUrl: "https://www.nissan.com.ph/urvan",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 450,
    capacity: 15,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["commercial", "family", "transport"],
    engineType: "Inline-4, Turbo Diesel, DOHC",
    displacement: "2.5L",
    horsepower: "129 HP @ 3,200 rpm",
    dimensions: "L 5,230 x W 1,695 x H 1,990 mm",
    weight: "1,945 kg",
    fuelEfficiency: "10 km/L (city) / 14 km/L (highway)",
  },
  {
    id: 91,
    name: "GT-R R35",
    brand: "Nissan",
    price: 8500000,
    image: "https://d2ivfcfbdvj3sm.cloudfront.net/WdQI_sdIDjwHoZrw/15167/stills_0640_png/MY2021/15167/15167_st0640_116.webp?c=172&p=164&m=1&o=png&s=vsAn_jY_m1qcqE_HL7O4w1",
    description: "Godzilla supercar. 3.8L twin-turbo V6, AWD, legendary performance.",
    storeUrl: "https://www.nissan.com.ph/gt-r",
    minHeight: 160,
    maxHeight: 195,
    maxWeight: 360,
    capacity: 4,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["supercar", "performance", "track"],
    engineType: "V6, Twin-Turbocharged, DOHC",
    displacement: "3.8L",
    horsepower: "565 HP @ 6,800 rpm",
    dimensions: "L 4,710 x W 1,895 x H 1,370 mm",
    weight: "1,752 kg",
    fuelEfficiency: "7 km/L (city) / 11 km/L (highway)",
  },
  {
    id: 94,
    name: "Almera",
    brand: "Nissan",
    price: 978000,
    image: "https://www.carz.com.my/_next/image?url=https%3A%2F%2Fstatic-content-live.caricarz.com%2Fmedia_library%2Fnewcar%2F157%2F2666551%2Fconversions%2F157_1625459429-full-image.png&w=3840&q=75",
    description: "Stylish sedan with advanced features. 1.0L turbo engine, modern design.",
    storeUrl: "https://www.nissan.com.ph/vehicles/new-vehicles/almera.html",
    minHeight: 145,
    maxHeight: 195,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["family", "city driving", "fuel efficient"],
    engineType: "3-cylinder, Turbocharged, DOHC",
    displacement: "1.0L Turbo",
    horsepower: "100 HP @ 5,000 rpm",
    dimensions: "L 4,495 x W 1,695 x H 1,487 mm",
    weight: "1,080 kg",
    fuelEfficiency: "18 km/L",
  },
  {
    id: 95,
    name: "NV350 Urvan",
    brand: "Nissan",
    price: 1599000,
    image: "https://www.eliterv.co.nz/wp-content/uploads/2023/12/NISSAN-NV350.png",
    description: "Commercial van for business and family. 2.5L diesel, 15-seater capacity.",
    storeUrl: "https://www.nissan.com.ph/vehicles/new-vehicles/urvan.html",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 900,
    capacity: 15,
    vehicleType: "car",
    type: "van",
    suitableFor: ["commercial", "family", "spacious"],
    engineType: "4-cylinder, Diesel, DOHC",
    displacement: "2.5L Diesel",
    horsepower: "129 HP @ 3,200 rpm",
    dimensions: "L 5,230 x W 1,695 x H 1,990 mm",
    weight: "1,970 kg",
    fuelEfficiency: "12 km/L",
  },
  {
    id: 96,
    name: "Kicks e-POWER",
    brand: "Nissan",
    price: 1598000,
    image: "https://nissan.com.my/v2/wp-content/uploads/2024/12/kicks-link-spec.png",
    description: "Electric-powered crossover. e-POWER hybrid technology, efficient and eco-friendly.",
    storeUrl: "https://www.nissan.com.ph/vehicles/new-vehicles/kicks-e-power.html",
    minHeight: 150,
    maxHeight: 195,
    maxWeight: 450,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["eco-friendly", "hybrid", "city driving"],
    engineType: "e-POWER Hybrid, Electric Motor + 1.2L Engine",
    displacement: "1.2L + Electric",
    horsepower: "129 HP (Electric Motor)",
    dimensions: "L 4,295 x W 1,760 x H 1,590 mm",
    weight: "1,210 kg",
    fuelEfficiency: "23 km/L",
  },
  {
    id: 97,
    name: "Livina",
    brand: "Nissan",
    price: 998000,
    image: "https://img.pcauto.com/model/images/touPic/my/Nissan-Grand-Livina_51.png",
    description: "Compact MPV with versatile seating. 1.5L engine, family-friendly features.",
    storeUrl: "https://www.nissan.com.ph/vehicles/new-vehicles/livina.html",
    minHeight: 150,
    maxHeight: 195,
    maxWeight: 500,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "versatile", "spacious"],
    engineType: "4-cylinder, DOHC",
    displacement: "1.5L",
    horsepower: "104 HP @ 6,000 rpm",
    dimensions: "L 4,510 x W 1,750 x H 1,695 mm",
    weight: "1,190 kg",
    fuelEfficiency: "16 km/L",
  },
  {
    id: 98,
    name: "350Z",
    brand: "Nissan",
    price: 2500000,
    image: "https://images.carsguide.com.au/image/upload/e_trim:10,f_auto,c_scale,t_cg_base,w_678/v1/editorial/vhs/Nissan-350Z.png",
    description: "Legendary sports car. 3.5L V6 engine, rear-wheel drive, pure driving pleasure.",
    storeUrl: "https://www.nissan.com.ph/",
    minHeight: 160,
    maxHeight: 190,
    maxWeight: 350,
    capacity: 2,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["sports", "performance", "enthusiast"],
    engineType: "V6, DOHC",
    displacement: "3.5L",
    horsepower: "306 HP @ 6,800 rpm",
    dimensions: "L 4,315 x W 1,815 x H 1,315 mm",
    weight: "1,450 kg",
    fuelEfficiency: "9 km/L",
  },
  {
    id: 99,
    name: "L300",
    brand: "Mitsubishi",
    price: 1045000,
    image: "https://www.mitsubishi-motors.com.ph/content/dam/mitsubishi-motors-ph/images/site-images/articles/2020/NewL300.png",
    description: "Workhorse van for business. 2.2L diesel, reliable and durable.",
    storeUrl: "https://www.mitsubishi-motors.com.ph/vehicles/l300",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 1000,
    capacity: 9,
    vehicleType: "car",
    type: "van",
    suitableFor: ["commercial", "cargo", "durable"],
    engineType: "4-cylinder, Diesel, SOHC",
    displacement: "2.2L Diesel",
    horsepower: "97 HP @ 4,000 rpm",
    dimensions: "L 4,695 x W 1,690 x H 1,960 mm",
    weight: "1,575 kg",
    fuelEfficiency: "11 km/L",
  },
  {
    id: 100,
    name: "Triton",
    brand: "Mitsubishi",
    price: 1345000,
    image: "https://mitsubishi-skj.com/images/triton-4x2/car-model/triton-4x2-preview.png",
    description: "Rugged pickup truck. 2.4L turbo diesel, 4WD capability, adventure-ready.",
    storeUrl: "https://www.mitsubishi-motors.com.ph/vehicles/triton",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 900,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["off-road", "pickup", "adventure"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.4L Turbo Diesel",
    horsepower: "181 HP @ 3,500 rpm",
    dimensions: "L 5,305 x W 1,815 x H 1,795 mm",
    weight: "1,985 kg",
    fuelEfficiency: "13 km/L",
  },
  {
    id: 101,
    name: "Xforce",
    brand: "Mitsubishi",
    price: 1358000,
    image: "https://img.pcauto.com/model/images/touPic/my/Mitsubishi-Xforce_4894.png",
    description: "Compact crossover SUV. 1.5L turbo engine, modern design, advanced features.",
    storeUrl: "https://www.mitsubishi-motors.com.ph/vehicles/xforce",
    minHeight: 150,
    maxHeight: 195,
    maxWeight: 450,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "modern", "crossover"],
    engineType: "4-cylinder, Turbocharged, DOHC",
    displacement: "1.5L Turbo",
    horsepower: "148 HP @ 5,500 rpm",
    dimensions: "L 4,390 x W 1,810 x H 1,660 mm",
    weight: "1,245 kg",
    fuelEfficiency: "15 km/L",
  },
  {
    id: 102,
    name: "Hilux",
    brand: "Toyota",
    price: 1625000,
    image: "https://storage.googleapis.com/tsrbucket/WEBSITE_ASSETS/2024%20Hilux%20Fleet/HILUX_FLEET.png",
    description: "Legendary pickup truck. 2.8L turbo diesel, indestructible, adventure-ready.",
    storeUrl: "https://www.toyota.com.ph/hilux",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 900,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["off-road", "pickup", "durable"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.8L Turbo Diesel",
    horsepower: "204 HP @ 3,400 rpm",
    dimensions: "L 5,330 x W 1,855 x H 1,815 mm",
    weight: "2,080 kg",
    fuelEfficiency: "12 km/L",
  },
  {
    id: 103,
    name: "Raize",
    brand: "Toyota",
    price: 1023000,
    image: "https://toyotalucena.com/storage/app/uploads/public/625/507/480/6255074800aa3572186847.png",
    description: "Compact SUV with turbo power. 1.0L turbo engine, stylish and efficient.",
    storeUrl: "https://www.toyota.com.ph/raize",
    minHeight: 150,
    maxHeight: 190,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["city driving", "compact", "fuel efficient"],
    engineType: "3-cylinder, Turbocharged, DOHC",
    displacement: "1.0L Turbo",
    horsepower: "98 HP @ 6,000 rpm",
    dimensions: "L 3,995 x W 1,695 x H 1,620 mm",
    weight: "980 kg",
    fuelEfficiency: "19 km/L",
  },
  {
    id: 104,
    name: "Hiace",
    brand: "Toyota",
    price: 1799000,
    image: "https://toyota.cami-cfao.com/media/gamme/modeles/images/c3fd407fef6fe625cd2294cc06e6664e.png",
    description: "Commercial van for business and transport. 2.8L diesel, 14-seater capacity.",
    storeUrl: "https://www.toyota.com.ph/hiace",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 900,
    capacity: 14,
    vehicleType: "car",
    type: "van",
    suitableFor: ["commercial", "transport", "spacious"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.8L Turbo Diesel",
    horsepower: "150 HP @ 3,600 rpm",
    dimensions: "L 5,380 x W 1,880 x H 2,280 mm",
    weight: "2,140 kg",
    fuelEfficiency: "11 km/L",
  },
  {
    id: 105,
    name: "Hiace Super Grandia",
    brand: "Toyota",
    price: 2638000,
    image: "https://toyotadavao.com.ph/wp-content/uploads/2023/04/Gray-Metallic.png",
    description: "Luxury van with premium features. 2.8L diesel, captain seats, ultimate comfort.",
    storeUrl: "https://www.toyota.com.ph/hiace",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 700,
    capacity: 10,
    vehicleType: "car",
    type: "van",
    suitableFor: ["luxury", "family", "premium"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.8L Turbo Diesel",
    horsepower: "150 HP @ 3,600 rpm",
    dimensions: "L 5,380 x W 1,880 x H 2,280 mm",
    weight: "2,200 kg",
    fuelEfficiency: "11 km/L",
  },
  {
    id: 106,
    name: "Avanza",
    brand: "Toyota",
    price: 1007000,
    image: "https://toyotabatangas.com.ph/wp-content/uploads/2019/09/avanza-silver-1.png",
    description: "Compact MPV for families. 1.5L engine, versatile and affordable.",
    storeUrl: "https://www.toyota.com.ph/avanza",
    minHeight: 150,
    maxHeight: 195,
    maxWeight: 500,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "affordable", "versatile"],
    engineType: "4-cylinder, DOHC Dual VVT-i",
    displacement: "1.5L",
    horsepower: "105 HP @ 6,000 rpm",
    dimensions: "L 4,395 x W 1,730 x H 1,700 mm",
    weight: "1,125 kg",
    fuelEfficiency: "15 km/L",
  },
  {
    id: 107,
    name: "Corolla Altis",
    brand: "Toyota",
    price: 1285000,
    image: "https://toyotaroxas.com.ph/wp-content/uploads/2019/11/altis-white-pearl-1.png",
    description: "Bestselling sedan worldwide. 1.6L engine, reliable and comfortable.",
    storeUrl: "https://www.toyota.com.ph/corolla-altis",
    minHeight: 150,
    maxHeight: 195,
    maxWeight: 450,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["family", "reliable", "bestseller"],
    engineType: "4-cylinder, DOHC Dual VVT-i",
    displacement: "1.6L",
    horsepower: "122 HP @ 6,000 rpm",
    dimensions: "L 4,630 x W 1,780 x H 1,435 mm",
    weight: "1,310 kg",
    fuelEfficiency: "16 km/L",
  },
  {
    id: 108,
    name: "Land Cruiser 300",
    brand: "Toyota",
    price: 5850000,
    image: "https://www.toyota.gm/media/gamme/modeles/images/4547ed01a21054c1c8b07ff66ea7d408.png",
    description: "Flagship luxury SUV. 3.5L twin-turbo V6, off-road legend, premium comfort.",
    storeUrl: "https://www.toyota.com.ph/land-cruiser-300",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 600,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["luxury", "off-road", "flagship"],
    engineType: "V6, Twin-Turbocharged, DOHC",
    displacement: "3.5L Twin-Turbo",
    horsepower: "415 HP @ 5,200 rpm",
    dimensions: "L 4,950 x W 1,980 x H 1,945 mm",
    weight: "2,480 kg",
    fuelEfficiency: "9 km/L",
  },
  {
    id: 109,
    name: "Land Cruiser 200",
    brand: "Toyota",
    price: 4800000,
    image: "https://files.hodoor.world/main/92345b06-7b24-40b0-8e21-cbb3ca2b6dbe.png",
    description: "Previous generation luxury SUV. 4.6L V8 engine, proven off-road capability.",
    storeUrl: "https://www.toyota.com.ph/",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 600,
    capacity: 8,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["luxury", "off-road", "classic"],
    engineType: "V8, DOHC",
    displacement: "4.6L",
    horsepower: "309 HP @ 5,500 rpm",
    dimensions: "L 4,950 x W 1,970 x H 1,880 mm",
    weight: "2,585 kg",
    fuelEfficiency: "7 km/L",
  },
  {
    id: 110,
    name: "Land Cruiser Prado",
    brand: "Toyota",
    price: 3598000,
    image: "https://toyotasantarosa.com.ph/wp-content/uploads/2020/08/vx_gdvxa_frosted-white_089.png",
    description: "Mid-size luxury SUV. 2.8L turbo diesel, adventure-ready, refined comfort.",
    storeUrl: "https://www.toyota.com.ph/land-cruiser-prado",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 550,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["luxury", "off-road", "adventure"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.8L Turbo Diesel",
    horsepower: "204 HP @ 3,400 rpm",
    dimensions: "L 4,840 x W 1,885 x H 1,845 mm",
    weight: "2,240 kg",
    fuelEfficiency: "11 km/L",
  },
  {
    id: 111,
    name: "Soluto",
    brand: "KIA",
    price: 638000,
    image: "https://kiavietnam.com.vn/storage/soluto-pngicon.png",
    description: "Affordable sedan for daily commute. 1.4L engine, practical and efficient.",
    storeUrl: "https://www.kia.com/ph/vehicles/soluto/",
    minHeight: 145,
    maxHeight: 195,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["affordable", "commuter", "practical"],
    engineType: "4-cylinder, DOHC",
    displacement: "1.4L",
    horsepower: "94 HP @ 6,000 rpm",
    dimensions: "L 4,400 x W 1,700 x H 1,460 mm",
    weight: "1,065 kg",
    fuelEfficiency: "18 km/L",
  },
  {
    id: 112,
    name: "Picanto",
    brand: "KIA",
    price: 745000,
    image: "https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicles/ja/picanto-my25/discover/kia-picanto-my25-gtl-AdventurousGreen.png",
    description: "Compact city car with style. 1.0L engine, easy to park, fun to drive.",
    storeUrl: "https://www.kia.com/ph/vehicles/picanto/",
    minHeight: 145,
    maxHeight: 185,
    maxWeight: 350,
    capacity: 5,
    vehicleType: "car",
    type: "hatchback",
    suitableFor: ["city driving", "compact", "affordable"],
    engineType: "3-cylinder, DOHC",
    displacement: "1.0L",
    horsepower: "67 HP @ 5,500 rpm",
    dimensions: "L 3,595 x W 1,595 x H 1,485 mm",
    weight: "870 kg",
    fuelEfficiency: "21 km/L",
  },
  {
    id: 113,
    name: "Carnival",
    brand: "KIA",
    price: 2598000,
    image: "https://www.kia.com/content/dam/kia/us/en/vehicles/ka4/2025/trims/sxp/exterior/445870/360/36.png",
    description: "Premium MPV for families. 2.2L turbo diesel, luxurious and spacious.",
    storeUrl: "https://www.kia.com/ph/vehicles/carnival/",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 700,
    capacity: 8,
    vehicleType: "car",
    type: "van",
    suitableFor: ["luxury", "family", "spacious"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.2L Turbo Diesel",
    horsepower: "200 HP @ 3,800 rpm",
    dimensions: "L 5,155 x W 1,995 x H 1,740 mm",
    weight: "2,185 kg",
    fuelEfficiency: "13 km/L",
  },
  {
    id: 114,
    name: "Mini Cooper",
    brand: "BMW",
    price: 2800000,
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/180421/cooper-exterior-right-front-three-quarter-16.png?isig=0&q=80",
    description: "Iconic British compact car. Sporty handling, premium features, fun to drive.",
    storeUrl: "https://www.mini.ph/",
    minHeight: 150,
    maxHeight: 190,
    maxWeight: 350,
    capacity: 4,
    vehicleType: "car",
    type: "hatchback",
    suitableFor: ["sporty", "premium", "iconic"],
    engineType: "3-cylinder, Turbocharged, DOHC",
    displacement: "1.5L Turbo",
    horsepower: "136 HP @ 4,500 rpm",
    dimensions: "L 3,850 x W 1,725 x H 1,415 mm",
    weight: "1,205 kg",
    fuelEfficiency: "17 km/L",
  },
  {
    id: 115,
    name: "3 Series",
    brand: "BMW",
    price: 3590000,
    image: "https://gld-creative.s3.us-west-2.amazonaws.com/2026-bmw-3-series-m3-competition-sedan-06b4431b69c3-600x300.png",
    description: "Executive sports sedan. 2.0L turbo engine, ultimate driving machine.",
    storeUrl: "https://www.bmw.com.ph/en/all-models/3-series/sedan/2022/bmw-3-series-sedan-overview.html",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 450,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["luxury", "sporty", "executive"],
    engineType: "4-cylinder, Turbocharged, DOHC",
    displacement: "2.0L Turbo",
    horsepower: "184 HP @ 5,000 rpm",
    dimensions: "L 4,709 x W 1,827 x H 1,442 mm",
    weight: "1,565 kg",
    fuelEfficiency: "14 km/L",
  },
  {
    id: 116,
    name: "5 Series",
    brand: "BMW",
    price: 5190000,
    image: "https://di-uploads-pod16.dealerinspire.com/bmwofbloomington/uploads/2018/10/2019-BMW-5-Series-Hero.png",
    description: "Flagship executive sedan. 2.0L turbo engine, luxury and performance combined.",
    storeUrl: "https://www.bmw.com.ph/en/all-models/5-series/sedan/2023/bmw-5-series-sedan-overview.html",
    minHeight: 160,
    maxHeight: 200,
    maxWeight: 500,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["luxury", "flagship", "executive"],
    engineType: "4-cylinder, Turbocharged, DOHC",
    displacement: "2.0L Turbo",
    horsepower: "190 HP @ 5,000 rpm",
    dimensions: "L 5,060 x W 1,900 x H 1,515 mm",
    weight: "1,800 kg",
    fuelEfficiency: "13 km/L",
  },
  {
    id: 117,
    name: "X1",
    brand: "BMW",
    price: 3290000,
    image: "https://www.greenncap.com/wp-content/uploads/bmw-x1-2023-0125.png",
    description: "Compact luxury SUV. 1.5L turbo engine, premium features, agile handling.",
    storeUrl: "https://www.bmw.com.ph/en/all-models/x-series/X1/2022/bmw-x1-overview.html",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 450,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["luxury", "compact", "suv"],
    engineType: "3-cylinder, Turbocharged, DOHC",
    displacement: "1.5L Turbo",
    horsepower: "140 HP @ 4,600 rpm",
    dimensions: "L 4,500 x W 1,821 x H 1,598 mm",
    weight: "1,560 kg",
    fuelEfficiency: "15 km/L",
  },
  {
    id: 118,
    name: "2 Series",
    brand: "BMW",
    price: 3190000,
    image: "https://www.halliwelljones.co.uk/uploads/page-images/cosySec_2025-02-26-165703_otpc.png",
    description: "Compact sports coupe. 2.0L turbo engine, dynamic performance, stylish design.",
    storeUrl: "https://www.bmw.com.ph/en/all-models/2-series/gran-coupe/2022/bmw-2-series-gran-coupe-overview.html",
    minHeight: 155,
    maxHeight: 190,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["sporty", "compact", "luxury"],
    engineType: "4-cylinder, Turbocharged, DOHC",
    displacement: "2.0L Turbo",
    horsepower: "178 HP @ 5,000 rpm",
    dimensions: "L 4,526 x W 1,800 x H 1,420 mm",
    weight: "1,475 kg",
    fuelEfficiency: "14 km/L",
  },
  {
    id: 119,
    name: "i4",
    brand: "BMW",
    price: 5490000,
    image: "https://www.greenncap.com/wp-content/uploads/bmw-i4-2024-0160.png",
    description: "Electric sports sedan. Full electric, 335 HP, zero emissions, cutting-edge technology.",
    storeUrl: "https://www.bmw.com.ph/en/all-models/bmw-i/i4/2022/bmw-i4-overview.html",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 450,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["electric", "luxury", "eco-friendly"],
    engineType: "Electric Motor",
    displacement: "Electric",
    horsepower: "335 HP",
    dimensions: "L 4,783 x W 1,852 x H 1,448 mm",
    weight: "2,125 kg",
    fuelEfficiency: "N/A (Electric)",
  },
  {
    id: 120,
    name: "Jimny",
    brand: "Suzuki",
    price: 1295000,
    image: "https://www.suzukimalaysia.com/images/jimny-5-door/color/bluish-black-pearl.png",
    description: "Legendary compact 4x4. 1.5L engine, go-anywhere capability, iconic design.",
    storeUrl: "https://www.suzuki.com.ph/automobiles/jimny",
    minHeight: 150,
    maxHeight: 190,
    maxWeight: 350,
    capacity: 4,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["off-road", "compact", "4x4"],
    engineType: "4-cylinder, DOHC",
    displacement: "1.5L",
    horsepower: "102 HP @ 6,000 rpm",
    dimensions: "L 3,645 x W 1,645 x H 1,720 mm",
    weight: "1,135 kg",
    fuelEfficiency: "15 km/L",
  },
  {
    id: 121,
    name: "S-Presso",
    brand: "Suzuki",
    price: 518000,
    image: "https://sakura-auto.ph/wp-content/uploads/2020/05/allnewspresso.png",
    description: "Ultra-affordable mini SUV. 1.0L engine, budget-friendly, fun design.",
    storeUrl: "https://www.suzuki.com.ph/automobiles/s-presso",
    minHeight: 145,
    maxHeight: 185,
    maxWeight: 350,
    capacity: 5,
    vehicleType: "car",
    type: "hatchback",
    suitableFor: ["affordable", "compact", "budget"],
    engineType: "3-cylinder, DOHC",
    displacement: "1.0L",
    horsepower: "67 HP @ 5,500 rpm",
    dimensions: "L 3,565 x W 1,520 x H 1,564 mm",
    weight: "726 kg",
    fuelEfficiency: "22 km/L",
  },
  {
    id: 122,
    name: "Dzire",
    brand: "Suzuki",
    price: 798000,
    image: "https://www.suzukiauto.co.za/hubfs/New%20Dzire%20Thumbnail.png",
    description: "Compact sedan with great fuel economy. 1.2L engine, practical and efficient.",
    storeUrl: "https://www.suzuki.com.ph/automobiles/dzire",
    minHeight: 145,
    maxHeight: 195,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["fuel efficient", "affordable", "sedan"],
    engineType: "4-cylinder, DOHC",
    displacement: "1.2L",
    horsepower: "82 HP @ 6,000 rpm",
    dimensions: "L 3,995 x W 1,735 x H 1,515 mm",
    weight: "890 kg",
    fuelEfficiency: "22 km/L",
  },
  {
    id: 123,
    name: "Ertiga",
    brand: "Suzuki",
    price: 998000,
    image: "https://www.suzukiauto.co.za/hubfs/Ertiga%20Thumbs3.png",
    description: "Fuel-efficient 7-seater MPV. 1.5L hybrid engine, family-friendly, economical.",
    storeUrl: "https://www.suzuki.com.ph/automobiles/ertiga",
    minHeight: 150,
    maxHeight: 195,
    maxWeight: 500,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "fuel efficient", "hybrid"],
    engineType: "4-cylinder, DOHC, Hybrid",
    displacement: "1.5L Hybrid",
    horsepower: "103 HP @ 6,000 rpm",
    dimensions: "L 4,395 x W 1,735 x H 1,690 mm",
    weight: "1,130 kg",
    fuelEfficiency: "20 km/L",
  },
  {
    id: 124,
    name: "Carry",
    brand: "Suzuki",
    price: 698000,
    image: "https://www.suzuki.co.th/upload/content/20201103_s_LLGrYHIztg.png",
    description: "Reliable mini truck for business. 1.5L engine, practical cargo solution.",
    storeUrl: "https://www.suzuki.com.ph/automobiles/carry",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 750,
    capacity: 3,
    vehicleType: "car",
    type: "van",
    suitableFor: ["commercial", "cargo", "practical"],
    engineType: "4-cylinder, SOHC",
    displacement: "1.5L",
    horsepower: "95 HP @ 6,000 rpm",
    dimensions: "L 4,150 x W 1,625 x H 1,910 mm",
    weight: "935 kg",
    fuelEfficiency: "16 km/L",
  },
  {
    id: 125,
    name: "Staria",
    brand: "Hyundai",
    price: 2398000,
    image: "https://www.hyundai.com/content/dam/hyundai/ph/en/images/find-a-car/thumbnail/STARIA.png",
    description: "Futuristic luxury van. 2.2L turbo diesel, spaceship design, premium features.",
    storeUrl: "https://www.hyundai.com/ph/en/models/staria",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 700,
    capacity: 9,
    vehicleType: "car",
    type: "van",
    suitableFor: ["luxury", "family", "futuristic"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.2L Turbo Diesel",
    horsepower: "177 HP @ 3,800 rpm",
    dimensions: "L 5,253 x W 1,997 x H 1,990 mm",
    weight: "2,205 kg",
    fuelEfficiency: "12 km/L",
  },
  {
    id: 126,
    name: "Stargazer",
    brand: "Hyundai",
    price: 1098000,
    image: "https://hyundaitt.com/wp-content/uploads/2024/06/Hyundai-Stargazer.png",
    description: "Compact MPV for families. 1.5L engine, modern design, versatile seating.",
    storeUrl: "https://www.hyundai.com/ph/en/models/stargazer",
    minHeight: 150,
    maxHeight: 195,
    maxWeight: 500,
    capacity: 7,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "compact", "versatile"],
    engineType: "4-cylinder, DOHC",
    displacement: "1.5L",
    horsepower: "115 HP @ 6,300 rpm",
    dimensions: "L 4,460 x W 1,780 x H 1,695 mm",
    weight: "1,245 kg",
    fuelEfficiency: "16 km/L",
  },
  {
    id: 127,
    name: "Grand Starex",
    brand: "Hyundai",
    price: 1898000,
    image: "https://img.pcauto.com/model/images/touPic/my/Hyundai-Grand-Starex_30_small.png",
    description: "Large commercial van. 2.5L turbo diesel, 12-seater, durable workhorse.",
    storeUrl: "https://www.hyundai.com/ph/en/models/grand-starex",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 900,
    capacity: 12,
    vehicleType: "car",
    type: "van",
    suitableFor: ["commercial", "transport", "durable"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.5L Turbo Diesel",
    horsepower: "170 HP @ 3,800 rpm",
    dimensions: "L 5,125 x W 1,920 x H 1,925 mm",
    weight: "2,135 kg",
    fuelEfficiency: "11 km/L",
  },
  {
    id: 128,
    name: "Accent",
    brand: "Hyundai",
    price: 948000,
    image: "https://hyundaitt.com/wp-content/uploads/2024/02/Hyundai-Accent-Atlas-White.png",
    description: "Reliable compact sedan. 1.4L engine, proven track record, affordable.",
    storeUrl: "https://www.hyundai.com/ph/en/models/accent",
    minHeight: 145,
    maxHeight: 195,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["affordable", "reliable", "compact"],
    engineType: "4-cylinder, DOHC",
    displacement: "1.4L",
    horsepower: "100 HP @ 6,000 rpm",
    dimensions: "L 4,405 x W 1,729 x H 1,470 mm",
    weight: "1,140 kg",
    fuelEfficiency: "17 km/L",
  },
  {
    id: 129,
    name: "H-100",
    brand: "Hyundai",
    price: 848000,
    image: "https://www.hyundai.com/content/dam/hyundai/ph/en/images/find-a-car/pip/h100/H100%20QUARTER%20ANGLE.png",
    description: "Workhorse pickup and van. 2.5L diesel, reliable for business use.",
    storeUrl: "https://www.hyundai.com/ph/en/models/h-100",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 900,
    capacity: 3,
    vehicleType: "car",
    type: "van",
    suitableFor: ["commercial", "cargo", "workhorse"],
    engineType: "4-cylinder, Diesel, SOHC",
    displacement: "2.5L Diesel",
    horsepower: "80 HP @ 4,000 rpm",
    dimensions: "L 4,740 x W 1,740 x H 1,985 mm",
    weight: "1,565 kg",
    fuelEfficiency: "13 km/L",
  },
  {
    id: 130,
    name: "Tucson",
    brand: "Hyundai",
    price: 1798000,
    image: "https://www.hyundai.com/content/dam/hyundai/ph/en/images/find-a-car/thumbnail/TUCSON.png",
    description: "Modern compact SUV. 2.0L engine, stylish design, advanced safety features.",
    storeUrl: "https://www.hyundai.com/ph/en/models/tucson",
    minHeight: 155,
    maxHeight: 195,
    maxWeight: 500,
    capacity: 5,
    vehicleType: "car",
    type: "suv",
    suitableFor: ["family", "modern", "safe"],
    engineType: "4-cylinder, DOHC",
    displacement: "2.0L",
    horsepower: "156 HP @ 6,200 rpm",
    dimensions: "L 4,500 x W 1,865 x H 1,650 mm",
    weight: "1,595 kg",
    fuelEfficiency: "13 km/L",
  },
  {
    id: 131,
    name: "Delica",
    brand: "Mitsubishi",
    price: 1598000,
    image: "https://rentalauto.ge/wp-content/uploads/2018/05/delica.png",
    description: "Versatile van for family and business. 2.4L diesel, spacious and practical.",
    storeUrl: "https://www.mitsubishi-motors.com.ph/",
    minHeight: 155,
    maxHeight: 200,
    maxWeight: 800,
    capacity: 11,
    vehicleType: "car",
    type: "van",
    suitableFor: ["family", "commercial", "spacious"],
    engineType: "4-cylinder, Turbo Diesel, DOHC",
    displacement: "2.4L Turbo Diesel",
    horsepower: "136 HP @ 3,500 rpm",
    dimensions: "L 4,800 x W 1,795 x H 1,960 mm",
    weight: "1,890 kg",
    fuelEfficiency: "12 km/L",
  },
  {
    id: 132,
    name: "Pixis Truck",
    brand: "Toyota",
    price: 598000,
    image: "https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60017488/images/m1.png",
    description: "Mini truck for business. Compact size, practical cargo solution.",
    storeUrl: "https://www.toyota.com.ph/",
    minHeight: 155,
    maxHeight: 190,
    maxWeight: 500,
    capacity: 2,
    vehicleType: "car",
    type: "van",
    suitableFor: ["commercial", "cargo", "compact"],
    engineType: "3-cylinder, DOHC",
    displacement: "660cc",
    horsepower: "46 HP @ 5,700 rpm",
    dimensions: "L 3,395 x W 1,475 x H 1,780 mm",
    weight: "720 kg",
    fuelEfficiency: "18 km/L",
  },
  {
    id: 133,
    name: "CD5",
    brand: "KIA",
    price: 450000,
    image: "https://cdn.wheel-size.com/thumbs/60/4b/604bcf5be10966f69c68023130df08e7.png",
    description: "Classic sedan from 1987. Vintage collector's item, reliable workhorse.",
    storeUrl: "https://www.kia.com/ph/",
    minHeight: 150,
    maxHeight: 190,
    maxWeight: 400,
    capacity: 5,
    vehicleType: "car",
    type: "sedan",
    suitableFor: ["classic", "vintage", "collector"],
    engineType: "4-cylinder, Carburetor",
    displacement: "1.5L",
    horsepower: "80 HP @ 5,500 rpm",
    dimensions: "L 4,350 x W 1,660 x H 1,395 mm",
    weight: "980 kg",
    fuelEfficiency: "12 km/L",
  },
];

export default function App() {
  const [motorIndex, setMotorIndex] = useState(0);
  const [carIndex, setCarIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const arrowButtonStyle = {
    background: "#2d3436",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: isMobile ? "50px" : isTablet ? "45px" : "40px",
    height: isMobile ? "50px" : isTablet ? "45px" : "40px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isMobile ? "24px" : isTablet ? "22px" : "20px",
    fontWeight: "bold",
    flexShrink: 0,
    zIndex: 10,
  };
  // Helper function for responsive sizing
  const getResponsiveSize = (mobile: number, tablet: number, desktop: number) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  const getResponsivePadding = (mobile: string, desktop: string) => {
    return isMobile ? mobile : desktop;
  };

  const getResponsiveGap = (mobile: string, desktop: string) => {
    return isMobile ? mobile : desktop;
  };

    const [previewVehicle, setPreviewVehicle] =
    useState<Vehicle | null>(null);
  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [compareVehicles, setCompareVehicles] = useState<Vehicle[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "signup">("login");
  const [showQuestionnaire, setShowQuestionnaire] =
    useState(true);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<"all" | "motorcycle" | "car" | "bigbike">("all");
  const [showWelcome, setShowWelcome] = useState(true); // Opens automatically on load
  const [currentPage, setCurrentPage] = useState<
    "home" | "vehicles"
  >("home");
  const [showCheckoutVerification, setShowCheckoutVerification] = useState(false);
  const [showCheckoutCode, setShowCheckoutCode] = useState(false);
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [checkoutCode, setCheckoutCode] = useState("");
  const [checkoutVehicle, setCheckoutVehicle] = useState<Vehicle | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationIdName, setVerificationIdName] = useState("");
  const [verificationAddress, setVerificationAddress] = useState("");
  const [verificationIdImage, setVerificationIdImage] = useState<string | null>(null);
  const [idImageFileName, setIdImageFileName] = useState("");
  const [showStoreLocations, setShowStoreLocations] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editMiddleName, setEditMiddleName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [editContactNumber, setEditContactNumber] = useState("");

  // Store locations data - Brand Dealerships
  const storeLocations = [
    // Yamaha Dealerships
    {
      id: 1,
      brand: "Yamaha",
      name: "Yamaha Big Bike Center Makati",
      address: "2320 Chino Roces Avenue, Makati City, Metro Manila",
      phone: "+63 2 8403 0777",
      hours: "Mon-Sat: 8:00 AM - 5:00 PM, Sun: Closed",
      coordinates: { lat: 14.5536, lng: 121.0233 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.35!2d121.0233!3d14.5536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c902!2sChino%20Roces%20Ave%2C%20Makati!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🏍️"
    },
    {
      id: 2,
      brand: "Yamaha",
      name: "Yamaha Motoworld - EDSA",
      address: "1357 EDSA, Quezon City, Metro Manila",
      phone: "+63 2 8374 2728",
      hours: "Mon-Sat: 8:00 AM - 5:00 PM, Sun: Closed",
      coordinates: { lat: 14.6250, lng: 121.0379 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.2!2d121.0379!3d14.6250!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b75e!2sEDSA%2C%20Quezon%20City!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🏍️"
    },
    // Honda Dealerships
    {
      id: 3,
      brand: "Honda",
      name: "Honda Cars Makati",
      address: "2241 Chino Roces Avenue, Makati City, Metro Manila",
      phone: "+63 2 8403 6464",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5540, lng: 121.0238 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.34!2d121.0238!3d14.5540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c902!2sChino%20Roces%20Ave%2C%20Makati!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 4,
      brand: "Honda",
      name: "Honda Motorcycles - Tandang Sora",
      address: "Commonwealth Avenue corner Tandang Sora, Quezon City, Metro Manila",
      phone: "+63 2 8951 2000",
      hours: "Mon-Sat: 8:00 AM - 5:00 PM, Sun: Closed",
      coordinates: { lat: 14.6890, lng: 121.0540 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.2!2d121.0540!3d14.6890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b730!2sCommonwealth%20Ave%2C%20QC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🏍️"
    },
    // Kawasaki Dealerships
    {
      id: 5,
      brand: "Kawasaki",
      name: "Kawasaki Motors Philippines - BGC",
      address: "26th Street corner 3rd Avenue, Bonifacio Global City, Taguig",
      phone: "+63 2 8856 4000",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 5:00 PM",
      coordinates: { lat: 14.5520, lng: 121.0492 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.5!2d121.0492!3d14.5520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8e7!2sBGC%2C%20Taguig!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🏍️"
    },
    // Suzuki Dealerships
    {
      id: 6,
      brand: "Suzuki",
      name: "Suzuki Auto Greenhills",
      address: "20 Ortigas Avenue, Greenhills, San Juan, Metro Manila",
      phone: "+63 2 8727 7777",
      hours: "Mon-Sat: 8:30 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5832, lng: 121.0579 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.9!2d121.0579!3d14.5832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c856!2sOrtigas%20Ave%2C%20San%20Juan!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 7,
      brand: "Suzuki",
      name: "Suzuki Auto - Pasig",
      address: "Frontera Verde, C5 Pasig, Pasig City, Metro Manila",
      phone: "+63 2 8671 7777",
      hours: "Mon-Sat: 8:00 AM - 5:30 PM, Sun: Closed",
      coordinates: { lat: 14.5667, lng: 121.0711 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.1!2d121.0711!3d14.5667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c874!2sC5%2C%20Pasig!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    // Toyota Dealerships
    {
      id: 8,
      brand: "Toyota",
      name: "Toyota Manila Bay",
      address: "1991 Roxas Boulevard, Pasay City, Metro Manila",
      phone: "+63 2 8551 8888",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5412, lng: 121.0015 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.67!2d121.0015!3d14.5412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca01!2sRoxas%20Blvd%2C%20Pasay!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 9,
      brand: "Toyota",
      name: "Toyota Quezon Avenue",
      address: "824 Quezon Avenue, Quezon City, Metro Manila",
      phone: "+63 2 8372 4444",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.6302, lng: 121.0203 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.08!2d121.0203!3d14.6302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b75d!2sQuezon%20Ave%2C%20QC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    // KTM Dealerships
    {
      id: 10,
      brand: "KTM",
      name: "KTM Manila - BGC",
      address: "8th Avenue corner 30th Street, BGC, Taguig",
      phone: "+63 2 8856 3030",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM",
      coordinates: { lat: 14.5513, lng: 121.0470 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.51!2d121.0470!3d14.5513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8e9!2sBGC%2C%20Taguig!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🏍️"
    },
    // Ford Dealerships
    {
      id: 11,
      brand: "Ford",
      name: "Ford EDSA Greenhills",
      address: "743 EDSA, Greenhills, San Juan, Metro Manila",
      phone: "+63 2 8570 7777",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.6025, lng: 121.0520 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.54!2d121.0520!3d14.6025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c857!2sEDSA%2C%20San%20Juan!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 12,
      brand: "Ford",
      name: "Ford BGC",
      address: "7th Avenue, Bonifacio Global City, Taguig",
      phone: "+63 2 8403 8888",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5503, lng: 121.0485 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.52!2d121.0485!3d14.5503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8e8!2s7th%20Ave%2C%20BGC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    // Mitsubishi Dealerships
    {
      id: 13,
      brand: "Mitsubishi",
      name: "Mitsubishi Ortigas",
      address: "15 Meralco Avenue, Ortigas Center, Pasig City",
      phone: "+63 2 8631 7777",
      hours: "Mon-Sat: 8:30 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5864, lng: 121.0628 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.87!2d121.0628!3d14.5864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c859!2sMeralco%20Ave%2C%20Pasig!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 14,
      brand: "Mitsubishi",
      name: "Mitsubishi Commonwealth",
      address: "Commonwealth Avenue, Quezon City, Metro Manila",
      phone: "+63 2 8376 8888",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.6850, lng: 121.0500 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.3!2d121.0500!3d14.6850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b733!2sCommonwealth%20Ave%2C%20QC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    // Nissan Dealerships
    {
      id: 15,
      brand: "Nissan",
      name: "Nissan EDSA North",
      address: "1620 EDSA, Quezon City, Metro Manila",
      phone: "+63 2 8911 5555",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.6310, lng: 121.0382 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.07!2d121.0382!3d14.6310!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b75b!2sEDSA%2C%20Quezon%20City!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 16,
      brand: "Nissan",
      name: "Nissan Alabang",
      address: "South Luzon Expressway, Alabang, Muntinlupa",
      phone: "+63 2 8850 7777",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.4256, lng: 121.0414 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.12!2d121.0414!3d14.4256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d0a1!2sAlabang%2C%20Muntinlupa!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    // Hyundai Dealerships
    {
      id: 17,
      brand: "Hyundai",
      name: "Hyundai BGC",
      address: "26th Street corner 5th Avenue, BGC, Taguig",
      phone: "+63 2 8403 4444",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5520, lng: 121.0492 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.50!2d121.0492!3d14.5520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8e7!2sBGC%2C%20Taguig!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 18,
      brand: "Hyundai",
      name: "Hyundai Commonwealth",
      address: "200 Commonwealth Avenue, Quezon City, Metro Manila",
      phone: "+63 2 8951 7777",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: Closed",
      coordinates: { lat: 14.6715, lng: 121.0425 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.65!2d121.0425!3d14.6715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b74e!2sCommonwealth%20Ave%2C%20QC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    // BMW Dealerships
    {
      id: 19,
      brand: "BMW",
      name: "BMW Greenhills",
      address: "3 Ortigas Avenue, Greenhills, San Juan, Metro Manila",
      phone: "+63 2 8727 3333",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 5:00 PM",
      coordinates: { lat: 14.5845, lng: 121.0565 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.91!2d121.0565!3d14.5845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c854!2sOrtigas%20Ave%2C%20San%20Juan!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 20,
      brand: "BMW",
      name: "BMW Motorrad Manila",
      address: "Bonifacio Stopover, 31st Street, BGC, Taguig",
      phone: "+63 2 8856 2222",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM",
      coordinates: { lat: 14.5498, lng: 121.0478 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.53!2d121.0478!3d14.5498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8e6!2s31st%20St%2C%20BGC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🏍️"
    },
    // KIA Dealerships
    {
      id: 21,
      brand: "KIA",
      name: "KIA EDSA Shaw",
      address: "608 EDSA, Mandaluyong City, Metro Manila",
      phone: "+63 2 8531 8888",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5825, lng: 121.0459 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.92!2d121.0459!3d14.5825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c853!2sEDSA%2C%20Mandaluyong!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 22,
      brand: "KIA",
      name: "KIA Quezon Avenue",
      address: "1050 Quezon Avenue, Quezon City, Metro Manila",
      phone: "+63 2 8712 9999",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.6280, lng: 121.0218 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.12!2d121.0218!3d14.6280!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b75a!2sQuezon%20Ave%2C%20QC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    // Subaru Dealerships
    {
      id: 23,
      brand: "Subaru",
      name: "Subaru BGC",
      address: "25th Street corner 3rd Avenue, BGC, Taguig",
      phone: "+63 2 8403 2222",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5525, lng: 121.0500 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.49!2d121.0500!3d14.5525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8e5!2s25th%20St%2C%20BGC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    {
      id: 24,
      brand: "Subaru",
      name: "Subaru Greenhills",
      address: "8 Annapolis Street, Greenhills, San Juan, Metro Manila",
      phone: "+63 2 8727 5555",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
      coordinates: { lat: 14.5858, lng: 121.0548 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.88!2d121.0548!3d14.5858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c852!2sAnnapolis%20St%2C%20San%20Juan!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🚗"
    },
    // Vespa Dealerships
    {
      id: 25,
      brand: "Vespa",
      name: "Vespa Manila - Makati",
      address: "2316 Chino Roces Avenue, Makati City, Metro Manila",
      phone: "+63 2 8889 6666",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM",
      coordinates: { lat: 14.5538, lng: 121.0235 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.35!2d121.0235!3d14.5538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c901!2sChino%20Roces%20Ave%2C%20Makati!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🛵"
    },
    {
      id: 26,
      brand: "Vespa",
      name: "Vespa BGC Showroom",
      address: "Net Park, 5th Avenue, BGC, Taguig, Metro Manila",
      phone: "+63 2 8856 1111",
      hours: "Mon-Sat: 10:00 AM - 7:00 PM, Sun: 11:00 AM - 5:00 PM",
      coordinates: { lat: 14.5515, lng: 121.0480 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.51!2d121.0480!3d14.5515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8e4!2s5th%20Ave%2C%20BGC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🛵"
    },
    // Keeway Dealerships
    {
      id: 27,
      brand: "Keeway",
      name: "Keeway Manila - Aurora Boulevard",
      address: "650 Aurora Boulevard, Quezon City, Metro Manila",
      phone: "+63 2 8912 3456",
      hours: "Mon-Sat: 8:00 AM - 5:30 PM, Sun: Closed",
      coordinates: { lat: 14.6145, lng: 121.0298 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.32!2d121.0298!3d14.6145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b789!2sAurora%20Blvd%2C%20QC!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🏍️"
    },
    {
      id: 28,
      brand: "Keeway",
      name: "Keeway Caloocan Branch",
      address: "1255 A. Mabini Street, Caloocan City, Metro Manila",
      phone: "+63 2 8362 7890",
      hours: "Mon-Sat: 8:00 AM - 5:30 PM, Sun: Closed",
      coordinates: { lat: 14.6512, lng: 120.9834 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.23!2d120.9834!3d14.6512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b8a1!2sA.%20Mabini%20St%2C%20Caloocan!5e0!3m2!1sen!2sph!4v1234567890",
      logo: "🏍️"
    }
  ];

  // Form state
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("prefer-not-to-say");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [preferredBrands, setPreferredBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"none" | "price-asc" | "price-desc">("none");

  // Login/Signup form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupMiddleName, setSignupMiddleName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupBirthday, setSignupBirthday] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupContactNumber, setSignupContactNumber] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Pre-populate verification form if user is already verified
  useEffect(() => {
    if (showVerificationModal && userAccount?.isVerified) {
      setVerificationIdName(userAccount.verifiedIdName || "");
      setVerificationAddress(userAccount.verifiedAddress || "");
      // Don't pre-populate image, they need to upload fresh
    }
  }, [showVerificationModal, userAccount]);

  // Get unique brands
  const brands = [
    "all",
    ...Array.from(new Set(vehicles.map((v) => v.brand))).sort(),
  ];

  // LocalStorage helper functions for user database
  const STORAGE_KEYS = {
    USERS: 'autopicke_users',
    CURRENT_USER: 'autopick_current_user'
  };

  // Get all users from localStorage
  const getAllUsers = (): UserAccount[] => {
    try {
      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error reading users from localStorage:', error);
      return [];
    }
  };

  // Save user to localStorage
  const saveUser = (user: UserAccount) => {
    try {
      const users = getAllUsers();
      const existingIndex = users.findIndex(u => u.email === user.email);

      if (existingIndex >= 0) {
        // Update existing user
        users[existingIndex] = user;
      } else {
        // Add new user
        users.push(user);
      }

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Find user by email
  const findUserByEmail = (email: string): UserAccount | null => {
    const users = getAllUsers();
    return users.find(u => u.email === email) || null;
  };

  // Save current session
  const saveCurrentSession = (user: UserAccount) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Load current session
  const loadCurrentSession = (): UserAccount | null => {
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  };

  // Clear current session
  const clearCurrentSession = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  // Load saved session on mount
  useEffect(() => {
    const savedUser = loadCurrentSession();
    if (savedUser) {
      setUserAccount(savedUser);
      setShowWelcome(false);
    }
  }, []);

  // Sync userAccount changes to localStorage
  useEffect(() => {
    if (userAccount && userAccount.isLoggedIn) {
      saveUser(userAccount);
      saveCurrentSession(userAccount);
    }
  }, [userAccount]);

  const calculateCompatibility = (
    vehicle: Vehicle,
    profile: UserProfile,
  ): CompatibilityScore => {
    let score = 65; // Start with a lower base score for more variance
    const reasons: string[] = [];

    // Height compatibility with more granular scoring
    if (profile.height < vehicle.minHeight) {
      const diff = vehicle.minHeight - profile.height;
      score -= diff * 2.5; // Increased penalty
      reasons.push(
        `May be challenging for your height (${diff}cm below minimum)`,
      );
    } else if (profile.height > vehicle.maxHeight) {
      const diff = profile.height - vehicle.maxHeight;
      score -= diff * 2; // Increased penalty
      reasons.push(
        `May be compact for your height (${diff}cm above maximum)`,
      );
    } else {
      // More nuanced height scoring
      const heightRange = vehicle.maxHeight - vehicle.minHeight;
      const positionInRange =
        (profile.height - vehicle.minHeight) / heightRange;

      // Optimal zone: 30-70% of range
      if (positionInRange >= 0.3 && positionInRange <= 0.7) {
        score += 18; // Increased bonus for perfect match
        reasons.push("Excellent height match for this vehicle");
      } else if (positionInRange >= 0.2 && positionInRange <= 0.8) {
        score += 12; // Good match
        reasons.push("Very good height compatibility");
      } else if (positionInRange >= 0.1 && positionInRange <= 0.9) {
        score += 8; // Acceptable match
        reasons.push("Good height compatibility");
      } else {
        score += 4; // Minimal bonus
        reasons.push("Acceptable height fit");
      }
    }

    // Weight compatibility with more variance
    if (profile.weight > vehicle.maxWeight) {
      const diff = profile.weight - vehicle.maxWeight;
      score -= diff * 2; // Increased penalty
      reasons.push(`Exceeds recommended weight by ${diff}kg`);
    } else {
      // Calculate weight margin with more granularity
      const weightMargin =
        ((vehicle.maxWeight - profile.weight) /
          vehicle.maxWeight) *
        100;
      if (weightMargin > 40) {
        score += 10;
        reasons.push("Excellent weight capacity margin");
      } else if (weightMargin > 25) {
        score += 7;
        reasons.push("Well within weight capacity");
      } else if (weightMargin > 15) {
        score += 4;
        reasons.push("Good weight capacity");
      } else {
        score += 2;
        reasons.push("Weight within acceptable limits");
      }
    }

    // Vehicle-type specific recommendations with more variance
    if (vehicle.vehicleType === "motorcycle") {
      // Gender-based recommendations for motorcycles
      if (
        profile.gender === "female" &&
        vehicle.seatHeight &&
        vehicle.seatHeight <= 765
      ) {
        score += 6;
        reasons.push("Lower seat height for easier handling");
      }
      if (
        profile.gender === "male" &&
        vehicle.type === "underbone"
      ) {
        score += 3;
      }
      // Motorcycle-specific bonus for good fit
      if (vehicle.type === "scooter") {
        score += 4;
        reasons.push("Easy-to-ride scooter design");
      } else if (vehicle.type === "underbone") {
        score += 3;
        reasons.push("Reliable underbone motorcycle");
      } else if (vehicle.type === "adventure") {
        score += 5;
        reasons.push("Adventure-ready motorcycle");
      }
    } else if (vehicle.vehicleType === "car") {
      // Car-specific recommendations
      if (vehicle.capacity && vehicle.capacity >= 7) {
        reasons.push(
          `Spacious ${vehicle.capacity}-seater for families`,
        );
        score += 6;
      }
      if (vehicle.type === "hatchback") {
        reasons.push("Easy to maneuver and park");
        score += 4;
      }
      if (vehicle.type === "sedan") {
        score += 5;
        reasons.push("Comfortable sedan design");
      }
      if (vehicle.type === "suv") {
        score += 7;
        reasons.push("Spacious SUV design");
      }
    } else if (vehicle.vehicleType === "bigbike") {
      // Big bike specific recommendations with larger variance
      if (profile.height >= 175) {
        score += 8;
        reasons.push("Excellent height for big bike handling");
      } else if (profile.height >= 170) {
        score += 5;
        reasons.push("Good height for big bike handling");
      } else {
        score -= 6;
        reasons.push("Consider gaining more experience before big bikes");
      }

      if (vehicle.type === "sportbike") {
        score += 6;
        reasons.push("High-performance sportbike");
      } else if (vehicle.type === "cruiser") {
        score += 7;
        reasons.push("Comfortable cruiser design");
      } else if (vehicle.type === "touring") {
        score += 9;
        reasons.push("Premium touring capabilities");
      } else if (vehicle.type === "adventure") {
        score += 8;
        reasons.push("Versatile adventure capabilities");
      }

      // Seat height consideration for big bikes
      if (vehicle.seatHeight && vehicle.seatHeight > 800) {
        if (profile.height < 170) {
          score -= 8;
        } else if (profile.height < 175) {
          score -= 3;
        }
      }
    }

    // Add significant variance based on vehicle characteristics to avoid duplicate scores
    // Price-based adjustment (huge variance)
    const priceVariance = (vehicle.price % 15000) / 15000 * 8 - 4; // Range: -4 to +4
    score += priceVariance;

    // Seat height variance for motorcycles/bigbikes (massive increase)
    if (vehicle.seatHeight) {
      const seatVariance = ((vehicle.seatHeight % 150) / 150) * 6 - 3; // Range: -3 to +3
      score += seatVariance;
    }

    // Vehicle ID-based modifier for uniqueness (huge range)
    const idModifier = ((vehicle.id * 13) % 19) / 3 - 3.2; // Range: ~-3.2 to +3.2
    score += idModifier;

    // Brand-based variance (increased)
    const brandHash = vehicle.brand.length * vehicle.name.length;
    const brandModifier = (brandHash % 31) / 10 - 1.5; // Range: ~-1.5 to +1.5
    score += brandModifier;

    // Name length variance
    const nameVariance = (vehicle.name.length % 13) / 6 - 1.0; // Range: ~-1.0 to +1.0
    score += nameVariance;

    // Preferred brand bonus
    if (profile.preferredBrands && profile.preferredBrands.includes(vehicle.brand)) {
      score += 8; // Significant bonus for preferred brand
      reasons.push(`✓ Matches your preferred brand: ${vehicle.brand}`);
    }

    // Cap maximum score at 95 to keep it realistic
    return {
      vehicle: vehicle,
      score: Math.max(0, Math.min(95, score)), // Don't round yet, keep full precision
      reasons,
    };
  };

  const handleSubmitQuestionnaire = () => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (
      !heightNum ||
      !weightNum ||
      heightNum <= 0 ||
      weightNum <= 0
    ) {
      toast.error("Please enter valid height and weight");
      return;
    }

    const minPriceNum = minPrice ? parseFloat(minPrice) : undefined;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined;

    setUserProfile({
      height: heightNum,
      weight: weightNum,
      gender,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      preferredBrands: preferredBrands.length > 0 ? preferredBrands : undefined,
    });
    setShowQuestionnaire(false);
    toast.success("Recommendations generated!");
  };

  // Apply brand filter
  const brandFilteredVehicles =
    selectedBrand === "all"
      ? vehicles
      : vehicles.filter((v) => v.brand === selectedBrand);

  // Apply preferred brand filter (from user profile)
  const preferredBrandFilteredVehicles = userProfile?.preferredBrands && userProfile.preferredBrands.length > 0 && selectedBrand === "all"
    ? brandFilteredVehicles.filter((v) => userProfile.preferredBrands!.includes(v.brand))
    : brandFilteredVehicles;

  // Apply vehicle type filter
  const typeFilteredVehicles =
    selectedVehicleType === "all"
      ? preferredBrandFilteredVehicles
      : preferredBrandFilteredVehicles.filter(
          (v) => v.vehicleType === selectedVehicleType,
        );

  // Apply price range filter
  const priceFilteredVehicles = userProfile && (userProfile.minPrice || userProfile.maxPrice)
    ? typeFilteredVehicles.filter((v) => {
        const minOk = userProfile.minPrice ? v.price >= userProfile.minPrice : true;
        const maxOk = userProfile.maxPrice ? v.price <= userProfile.maxPrice : true;
        return minOk && maxOk;
      })
    : typeFilteredVehicles;

  // Apply search filter
  const searchFilteredVehicles = searchQuery
    ? priceFilteredVehicles.filter((v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : priceFilteredVehicles;

  // Apply compatibility scoring with deduplication
  const rawFilteredVehicles = userProfile
    ? searchFilteredVehicles
        .map((vehicle) =>
          calculateCompatibility(vehicle, userProfile),
        )
        .sort((a, b) => b.score - a.score)
    : searchFilteredVehicles.map((vehicle) => ({
        vehicle: vehicle,
        score: 85,
        reasons: [
          "No profile data - showing default recommendation",
        ],
      }));

  // Post-process to ensure no more than 2 vehicles share the same score
  const scoredVehicles = userProfile ? (() => {
    const scoreMap = new Map<number, number>(); // Track how many times each score appears
    const result: CompatibilityScore[] = [];

    rawFilteredVehicles.forEach((item, index) => {
      let adjustedScore = Math.round(item.score * 10) / 10; // Round to 1 decimal
      const roundedScore = Math.round(adjustedScore);

      // Count occurrences of this rounded score
      const count = scoreMap.get(roundedScore) || 0;

      if (count >= 2) {
        // If we already have 2+ with this score, reduce it progressively
        adjustedScore = roundedScore - Math.floor((count - 1) / 2) - (count % 2) * 0.5;
        // Make sure it doesn't go below a reasonable minimum
        adjustedScore = Math.max(adjustedScore, 60);
      }

      scoreMap.set(roundedScore, count + 1);

      result.push({
        ...item,
        score: Math.round(adjustedScore * 10) / 10 // Ensure 1 decimal place
      });
    });

    // Sort again after adjustments
    return result.sort((a, b) => b.score - a.score);
  })() : rawFilteredVehicles;

  // Apply sorting
  const filteredVehicles = (() => {
    if (sortBy === "none") {
      return scoredVehicles;
    } else if (sortBy === "price-asc") {
      return [...scoredVehicles].sort((a, b) => a.vehicle.price - b.vehicle.price);
    } else if (sortBy === "price-desc") {
      return [...scoredVehicles].sort((a, b) => b.vehicle.price - a.vehicle.price);
    }
    return scoredVehicles;
  })();

  // Calculate discounted price based on Pick Points
  const calculateDiscountedPrice = (originalPrice: number): { finalPrice: number; discount: number; discountPercent: number } => {
    if (!userAccount || !userAccount.isLoggedIn) {
      return { finalPrice: originalPrice, discount: 0, discountPercent: 0 };
    }

    // 100 Pick Points = 1% discount (points capped at 500 = max 5% discount)
    const discountPercent = Math.min((userAccount.pickPoints / 100), 5);
    const discount = originalPrice * (discountPercent / 100);
    const finalPrice = originalPrice - discount;

    return { finalPrice, discount, discountPercent };
  };

  // Calculate age from birthday
  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Login function with localStorage database
  const handleLoginSubmit = () => {
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    // Find user in localStorage database
    const user = findUserByEmail(loginEmail);

    if (!user) {
      toast.error("Account not found. Please sign up first.");
      return;
    }

    // In a real app, you would verify the password hash
    // For demo purposes, we'll just check if password field is filled
    toast.success("Logged in successfully!");

    // Update user session
    const loggedInUser = { ...user, isLoggedIn: true };
    setUserAccount(loggedInUser);
    saveCurrentSession(loggedInUser);

    setShowLoginModal(false);
    setShowWelcome(false);
    setLoginEmail("");
    setLoginPassword("");
  };

  // Signup function
  const handleSignupSubmit = () => {
    // Validation
    if (!signupFirstName || !signupLastName || !signupBirthday || !signupEmail || !signupContactNumber || !signupPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation (Philippine format)
    const phoneRegex = /^(09|\+639)\d{9}$/;
    if (!phoneRegex.test(signupContactNumber)) {
      toast.error("Please enter a valid Philippine contact number (e.g., 09123456789)");
      return;
    }

    // Check if email already exists
    const existingUser = findUserByEmail(signupEmail);
    if (existingUser) {
      toast.error("An account with this email already exists. Please log in.");
      return;
    }

    // Generate unique referral code for the user
    const referralCode = "PMR" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Check if user was referred by someone (check URL params)
    const urlParams = new URLSearchParams(window.location.search);
    const referredByCode = urlParams.get('ref');

    // Base points (capped at 500 max)
    const basePoints = 500;
    const bonusPoints = 0; // New users don't get bonus points anymore (bonus goes to referrer)

    const age = calculateAge(signupBirthday);

    // Create account
    const newUser: UserAccount = {
      firstName: signupFirstName,
      middleName: signupMiddleName || undefined,
      lastName: signupLastName,
      birthday: signupBirthday,
      age: age,
      email: signupEmail,
      contactNumber: signupContactNumber,
      pickPoints: basePoints,
      isLoggedIn: true,
      referralCode: referralCode,
      referredBy: referredByCode || undefined,
      referralCount: 0,
      referralMonth: new Date().toISOString().substring(0, 7), // YYYY-MM format
      isVerified: false,
    };

    // Save to localStorage database
    saveUser(newUser);

    // If user was referred, award points to the referrer
    if (referredByCode) {
      const allUsers = getAllUsers();
      const referrer = allUsers.find(u => u.referralCode === referredByCode);

      if (referrer) {
        const currentMonth = new Date().toISOString().substring(0, 7);

        // Reset referral count if it's a new month
        if (referrer.referralMonth !== currentMonth) {
          referrer.referralCount = 0;
          referrer.referralMonth = currentMonth;
        }

        // Check if referrer has reached the monthly limit
        if ((referrer.referralCount || 0) < 3) {
          // Award 20 points to referrer (capped at 500 total)
          const newPoints = Math.min(500, referrer.pickPoints + 20);
          const actualBonus = newPoints - referrer.pickPoints;
          referrer.pickPoints = newPoints;
          referrer.referralCount = (referrer.referralCount || 0) + 1;

          // Save updated referrer
          saveUser(referrer);

          if (actualBonus > 0) {
            console.log(`Referrer ${referrer.email} earned ${actualBonus} points (${referrer.referralCount}/3 referrals this month)`);
          } else {
            console.log(`Referrer ${referrer.email} is already at max points (500)`);
          }
        } else {
          console.log(`Referrer ${referrer.email} has reached the monthly referral limit (3/3)`);
        }
      }
    }

    saveCurrentSession(newUser);

    // Set current user
    setUserAccount(newUser);

    setShowLoginModal(false);
    setShowWelcome(false);

    // Clear form
    setSignupFirstName("");
    setSignupMiddleName("");
    setSignupLastName("");
    setSignupBirthday("");
    setSignupEmail("");
    setSignupContactNumber("");
    setSignupPassword("");
    setSignupConfirmPassword("");

    if (referredByCode) {
      toast.success(`Account created! Welcome to AutoPick!`);
    } else {
      toast.success(`Account created! You have ${basePoints} Pick Points (5% discount)`);
    }
  };

  const handleLogout = () => {
    clearCurrentSession();
    setUserAccount(null);
    toast.success("Logged out successfully");
  };

  // Comparison functions
  const addToCompare = (vehicle: Vehicle) => {
    if (compareVehicles.length >= 2) {
      toast.error("You can only compare 2 vehicles at a time");
      return;
    }
    if (compareVehicles.find(v => v.id === vehicle.id)) {
      toast.error("Vehicle already added to comparison");
      return;
    }
    setCompareVehicles([...compareVehicles, vehicle]);
    toast.success(`${vehicle.name} added to comparison`);
  };

  const removeFromCompare = (vehicleId: number) => {
    setCompareVehicles(compareVehicles.filter(v => v.id !== vehicleId));
    toast.success("Removed from comparison");
  };

  const clearComparison = () => {
    setCompareVehicles([]);
    setShowComparison(false);
    toast.success("Comparison cleared");
  };

  const handleShare = async (vehicle: Vehicle) => {
    const url = vehicle.storeUrl;

    try {
      // Try modern clipboard API
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch (error) {
      // Fallback: Create a temporary input element
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Link copied!");
      } catch (err) {
        toast.error("Failed to copy link");
      }

      document.body.removeChild(textArea);
    }
  };

  // Function to move the "window" forward or backward
  const handleNext = (index, setIndex, total) => {
    // Loop through all vehicles infinitely
    setIndex((index + 1) % total);
  };

  const handlePrev = (index, setIndex, total) => {
    // Loop backwards through all vehicles infinitely
    setIndex((index - 1 + total) % total);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        /* Smooth transitions for responsive changes */
        * {
          transition: font-size 0.2s ease, padding 0.2s ease, margin 0.2s ease, gap 0.2s ease;
        }
        @media (max-width: 768px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }
        /* Ensure proper scaling on all devices */
        @viewport {
          width: device-width;
          zoom: 1;
        }
      `}</style>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          minHeight: "100vh",
          overflowX: "hidden",
          width: "100%",
      }}
    >
      <Toaster position="top-center" />

      {/* Navigation Bar */}
      <nav
        style={{
          background: "#2d3436",
          padding: "clamp(12px, 1.5vw, 18px) clamp(15px, 3vw, 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
          position: "sticky" as const,
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          onClick={() => setCurrentPage("home")}
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "1px",
            cursor: "pointer",
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          AUTOPICK
        </div>

        {/* Navigation Links & Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(15px, 3vw, 35px)",
            flexWrap: "wrap",
          }}
        >
          <a
            onClick={() => setCurrentPage("home")}
            style={{
              ...navLinkStyle,
              fontWeight: currentPage === "home" ? 700 : 500,
              fontSize: "clamp(13px, 1.5vw, 15px)",
            }}
          >
            Home
          </a>
          <a
            onClick={() => {
              setShowQuestionnaire(false);
              setCurrentPage("vehicles");
              setSelectedVehicleType("all");
            }}
            style={{
              ...navLinkStyle,
              fontWeight: currentPage === "vehicles" ? 700 : 500,
              fontSize: "clamp(13px, 1.5vw, 15px)",
            }}
          >
            Browse
          </a>
          <a
            onClick={() => setShowAboutModal(true)}
            style={{...navLinkStyle, fontSize: "clamp(13px, 1.5vw, 15px)"}}
          >
            About
          </a>
          <a
            onClick={() => {
              setSelectedBrand("all");
              setCheckoutVehicle(null);
              setShowStoreLocations(true);
            }}
            style={{...navLinkStyle, fontSize: "clamp(13px, 1.5vw, 15px)"}}
          >
            Dealerships
          </a>

          {userAccount?.isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "4px" : "8px",
                background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                padding: isMobile ? "6px 10px" : "8px 16px",
                borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(250, 200, 152, 0.3)"
              }}>
                <span style={{
                  fontSize: "clamp(14px, 2vw, 18px)",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                }}>⭐</span>
                <span style={{
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                  fontWeight: 700,
                  color: "#2d3436",
                  letterSpacing: "0.5px"
                }}>
                  {userAccount.pickPoints}
                </span>
                {!isMobile && <span style={{
                  fontSize: "clamp(12px, 1.5vw, 13px)",
                  fontWeight: 600,
                  color: "#636e72",
                  textTransform: "uppercase"
                }}>
                  Points
                </span>}
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                style={{
                  ...navButtonStyle,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                👤 Profile
              </button>
              <button
                onClick={() => setShowReferralModal(true)}
                style={{
                  ...navButtonStyle,
                  background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                  color: "#2d3436",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                🎁 Share & Earn
              </button>
              <button
                onClick={handleLogout}
                style={{...navButtonStyle, background: "#e74c3c"}}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setLoginMode("login");
                setShowLoginModal(true);
              }}
              style={navButtonStyle}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Home Page */}
      {currentPage === "home" && (
        <>
          {/* Hero Banner */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #2d3436 0%, #1a1d1f 100%)",
              color: "#ffffff",
              padding: "100px 20px",
              textAlign: "center",
              position: "relative" as const,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute" as const,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "url(https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600) center/cover",
                opacity: 0.2,
              }}
            />
            <div
              style={{
                position: "relative" as const,
                zIndex: 1,
                maxWidth: "min(900px, 95vw)",
                margin: "0 auto",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 8vw, 56px)",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  marginBottom: "clamp(15px, 1.5vw, 20px)",
                }}
              >
                FIND YOUR PERFECT RIDE
              </h1>
              <p
                style={{
                  fontSize: "clamp(16px, 3vw, 22px)",
                  fontWeight: 400,
                  opacity: 0.95,
                  marginBottom: "40px",
                  lineHeight: "1.6",
                }}
              >
                Personalized vehicle recommendations based on
                your body type. Discover motorcycles and cars
                that truly fit you.
              </p>
              <button
                onClick={() => {
                  setShowQuestionnaire(true);
                  setCurrentPage("vehicles");
                }}
                style={{
                  padding: "18px 48px",
                  background:
                    "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                  color: "#2d3436",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: 700,
                  borderRadius: "8px",
                  boxShadow:
                    "0 8px 24px rgba(250, 200, 152, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                START YOUR JOURNEY
              </button>
            </div>
          </div>

          {/* Featured Brands Section */}
          <div
            style={{ padding: "clamp(20px, 3vw, 40px) clamp(15px, 2vw, 20px)", background: "#fff" }}
          >
            <div
              style={{ maxWidth: "min(900px, 95vw)", margin: "0 auto" }}
            >
              <h3
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#636e72",
                  marginBottom: "clamp(20px, 2.5vw, 30px)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "2px",
                }}
              >
                Trusted Brands
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "clamp(25px, 5vw, 50px)",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { name: "Honda", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/1280px-Honda.svg.png", url: "https://www.hondaph.com/" },
                  { name: "Yamaha", logo: "https://companieslogo.com/img/orig/7272.T-56a4e78b.png?t=1721283661", url: "https://www.yamaha-motor.com.ph/" },
                  { name: "Suzuki", logo: "https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/suzuki-logo-icon-hd.png", url: "https://www.suzuki.com.ph/" },
                  { name: "Kawasaki", logo: "https://animationvisarts.com/wp-content/uploads/2023/11/image-16-1030x521.png", url: "https://www.kawasaki.com.ph/" },
                  { name: "Vespa", logo: "https://1000logos.net/wp-content/uploads/2020/02/Vespa-Logo.png", url: "https://www.vespa.com/" },
                  { name: "Keeway", logo: "https://www.keeway.com/about-us/keeway_icon_logo.png", url: "https://keeway.com.ph/" },
                  { name: "Toyota", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Toyota_logo_%28Red%29.svg/3840px-Toyota_logo_%28Red%29.svg.png", url: "https://www.toyota.com.ph/" },
                  { name: "Mitsubishi", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mitsubishi_logo.svg/960px-Mitsubishi_logo.svg.png", url: "https://www.mitsubishi-motors.com.ph/" },
                  { name: "Ford", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg", url: "https://www.ford.com.ph/" },
                  { name: "Nissan", logo: "https://1000logos.net/wp-content/uploads/2020/03/Nissan-Logo-2012.png", url: "https://www.nissan.com.ph/" },
                  { name: "Subaru", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Subaru_logo_%28transparent%29.svg", url: "https://www.subaru.com.ph/" },
                  { name: "KIA", logo: "https://www.pngall.com/wp-content/uploads/11/Kia-Logo-PNG-Images.png", url: "https://www.kia.com/ph/" },
                  { name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1280px-BMW.svg.png", url: "https://www.bmw.com.ph/" },
                  { name: "Hyundai", logo: "https://listcarbrands.com/wp-content/uploads/2016/03/Hyundai-Logo-1.png", url: "https://www.hyundai.com/ph/" },
                ].map((brand) => (
                  <a
                    key={brand.name}
                    href={brand.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      cursor: "pointer",
                      opacity: 0.7,
                      transition: "all 0.3s ease",
                      filter: "grayscale(100%)",
                      display: "block",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.filter = "grayscale(0%)";
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0.7";
                      e.currentTarget.style.filter = "grayscale(100%)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      style={{
                        height: "45px",
                        objectFit: "contain",
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* --- Featured Sections --- */}
          {/* --- Combined Featured Section --- */}
          <div
            style={{
              padding: "clamp(20px, 3vw, 40px) clamp(15px, 2vw, 20px) clamp(40px, 5vw, 60px) clamp(15px, 2vw, 20px)",
              background: "#fffAlt",
            }}
          >
            <div
              style={{ maxWidth: "min(1200px, 95vw)", margin: "0 auto" }}
            >
              {/* --- Featured Motorcycles Carousel --- */}
              <div style={{ padding: "20px 20px 60px 20px" }}>
                <div
                  style={{
                    maxWidth: "min(1000px, 95vw)",
                    margin: "0 auto",
                  }}
                >
                  <h2
                    style={{
                      textAlign: "center",
                      marginBottom: "40px",
                      fontSize: "clamp(24px, 5vw, 32px)",
                      fontWeight: 900,
                      letterSpacing: "1px",
                      color: "#2d3436",
                    }}
                  >
                    FEATURED MOTORCYCLES
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "clamp(15px, 1.5vw, 20px)",
                    }}
                  >
                    {/* Prev Arrow */}
                    <button
  style={arrowButtonStyle}
  onClick={() => handlePrev(motorIndex, setMotorIndex, 6)}
>
  &lt;
</button>

                    {/* Cards Container */}
                    {/* The Container (The Camera Window) */}
<div style={{ overflow: "hidden", width: "100%", maxWidth: isMobile ? "100%" : "960px", margin: "0 auto", padding: isMobile ? "0 10px" : "0" }}>

  {/* The Row (The Film Strip) - This is what glides */}
  <div style={{
    display: "flex",
    gap: "clamp(10px, 1.5vw, 20px)",
    transition: "transform 0.5s ease-in-out",
    transform: isMobile ? `translateX(-${motorIndex * 100}%)` : `translateX(-${motorIndex * 320}px)` // This moves the row!
  }}>

    {/* Duplicate motorcycles 3 times to prevent empty spaces */}
    {[...vehicles.filter(v => v.vehicleType === "motorcycle").slice(0, 6),
      ...vehicles.filter(v => v.vehicleType === "motorcycle").slice(0, 6),
      ...vehicles.filter(v => v.vehicleType === "motorcycle").slice(0, 6)].map((v, idx) => (
      <div key={`moto-${idx}`} style={{
        minWidth: isMobile ? "calc(100% - 20px)" : "300px",
        padding: isMobile ? "15px" : "20px",
        background: "#fff",
        borderRadius: "16px",
        transform: isMobile ? "scale(1)" : (idx === motorIndex + 1 ? "scale(1.1)" : "scale(0.9)"),
        transition: "transform 0.5s ease",
        flexShrink: 0,
      }}>
        <img src={v.image} style={{ width: "100%", height: "clamp(120px, 15vw, 150px)", objectFit: "cover", borderRadius: "8px" }} />
        <h3 style={{ color: "#2d3436", fontSize: "clamp(16px, 2vw, 18px)", margin: "10px 0" }}>{v.name}</h3>
        <button onClick={() => setCurrentPage("vehicles")} style={{...buttonStyleSecondary, padding: isMobile ? "8px 16px" : "10px 20px", fontSize: "clamp(13px, 1.5vw, 14px)"}}>View Details</button>
      </div>
    ))}
  </div>
</div>

                    {/* Next Arrow */}
                    <button
                      style={arrowButtonStyle}
                      onClick={() =>
                        handleNext(
                          motorIndex,
                          setMotorIndex,
                          6
                        )
                      }
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Dots Pagination */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "20px",
                    }}
                  >
                    {vehicles
                      .filter(
                        (v) => v.vehicleType === "motorcycle",
                      )
                      .slice(0, 6)
                      .map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background:
                              i === motorIndex
                                ? "#2d3436"
                                : "#dfe6e9",
                          }}
                        />
                      ))}
                  </div>
                </div>
              </div>
              {/* --- Featured Cars Carousel --- */}
              <div style={{ padding: "20px 20px" }}>
                <div
                  style={{
                    maxWidth: "min(1000px, 95vw)",
                    margin: "0 auto",
                  }}
                >
                  <h2
                    style={{
                      textAlign: "center",
                      marginBottom: "40px",
                      fontSize: "clamp(24px, 5vw, 32px)",
                      fontWeight: 900,
                      letterSpacing: "1px",
                      color: "#2d3436",
                    }}
                  >
                    FEATURED CARS
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "clamp(15px, 1.5vw, 20px)",
                    }}
                  >
                    {/* Prev Arrow */}
                    <button
                      style={arrowButtonStyle}
                      onClick={() => handlePrev(carIndex, setCarIndex, 6)}
                    >
                      &lt;
                    </button>

                    {/* Cards Container */}
                    <div style={{ overflow: "hidden", width: "100%", maxWidth: isMobile ? "100%" : "960px", margin: "0 auto", padding: isMobile ? "0 10px" : "0" }}>
                      {/* The Row (The Film Strip) */}
                      <div style={{
                        display: "flex",
                        gap: "clamp(10px, 1.5vw, 20px)",
                        transition: "transform 0.5s ease-in-out",
                        transform: isMobile ? `translateX(-${carIndex * 100}%)` : `translateX(-${carIndex * 320}px)`
                      }}>
                        {/* Duplicate cars 3 times to prevent empty spaces */}
                        {[...vehicles.filter(v => v.vehicleType === "car").slice(0, 6),
                          ...vehicles.filter(v => v.vehicleType === "car").slice(0, 6),
                          ...vehicles.filter(v => v.vehicleType === "car").slice(0, 6)].map((v, idx) => (
                          <div key={`car-${idx}`} style={{
                            minWidth: isMobile ? "calc(100% - 20px)" : "300px",
                            padding: isMobile ? "15px" : "20px",
                            background: "#fff",
                            borderRadius: "16px",
                            transform: isMobile ? "scale(1)" : (idx === carIndex + 1 ? "scale(1.1)" : "scale(0.9)"),
                            transition: "transform 0.5s ease",
                            flexShrink: 0,
                          }}>
                            <img src={v.image} style={{ width: "100%", height: "clamp(120px, 15vw, 150px)", objectFit: "cover", borderRadius: "8px" }} />
                            <h3 style={{ color: "#2d3436", fontSize: "clamp(16px, 2vw, 18px)", margin: "10px 0" }}>{v.name}</h3>
                            <button onClick={() => setCurrentPage("vehicles")} style={{...buttonStyleSecondary, padding: isMobile ? "8px 16px" : "10px 20px", fontSize: "clamp(13px, 1.5vw, 14px)"}}>View Details</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Arrow */}
                    <button
                      style={arrowButtonStyle}
                      onClick={() =>
                        handleNext(
                          carIndex,
                          setCarIndex,
                          6
                        )
                      }
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Dots Pagination */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "20px",
                    }}
                  >
                    {vehicles
                      .filter((v) => v.vehicleType === "car")
                      .slice(0, 6)
                      .map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background:
                              i === carIndex
                                ? "#2d3436"
                                : "#dfe6e9",
                          }}
                        />
                      ))}
                  </div>
                </div>
              </div>

          {/* Why Choose AutoPick */}
          <div
            style={{
              padding: "80px 20px",
              background: "#fff",
            }}
          >
            <div
              style={{
                maxWidth: "min(1200px, 95vw)",
                margin: "0 auto",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#2d3436",
                  marginBottom: "60px",
                }}
              >
                WHY CHOOSE AUTOPICK?
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "40px",
                }}
              >
                {[
                  {
                    icon: "📏",
                    title: "Personalized Matching",
                    desc: "Get recommendations based on your exact height and weight for optimal comfort",
                  },
                  {
                    icon: "🏆",
                    title: "Expert Ratings",
                    desc: "Smart compatibility scoring to find vehicles that truly fit your profile",
                  },
                  {
                    icon: "💰",
                    title: "Best Prices",
                    desc: "Compare prices across all major brands in the Philippines",
                  },
                  {
                    icon: "🇵🇭",
                    title: "Local Inventory",
                    desc: "Access to the latest models available in Philippine showrooms",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#fff",
                      padding: "clamp(20px, 3vw, 40px)",
                      borderRadius: "16px",
                      textAlign: "center",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "48px",
                        marginBottom: "clamp(15px, 1.5vw, 20px)",
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#2d3436",
                        marginBottom: "12px",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#636e72",
                        lineHeight: "1.6",
                        margin: 0,
                      }}
                    >
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </div>
          </div>
        </>
      )}
      {/* Vehicles/Motorcycles/Cars Pages */}
      {currentPage !== "home" && (
        <>
          {/* Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
              color: "#ffffff",
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(71, 147, 255, 0.2)",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "42px",
                fontWeight: 700,
                letterSpacing: "2px",
              }}
            >
              BROWSE VEHICLES
            </h1>
            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "18px",
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              Find your perfect vehicle match
              {userAccount?.isLoggedIn && (
                <span style={{ display: "block", marginTop: "5px", fontSize: "14px", color: "#FAC898" }}>
                  🎉 You have {userAccount.pickPoints} Pick Points ({(userAccount.pickPoints / 100).toFixed(1)}% discount)
                </span>
              )}
            </p>
          </div>
        </>
      )}

      {showWelcome && (
        <div style={modalOverlayStyle}>
          <div
            style={{
              ...modalContentStyle,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              maxWidth: "min(800px, 95vw)",
              overflow: "hidden",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Left Side: Marketing Info */}
            <div
              style={{
                flex: 1,
                padding: "clamp(25px, 3vw, 40px) clamp(20px, 2.5vw, 40px)",
                background: "#fffAlt",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h2
                style={{
                  color: "#357ABD",
                  fontSize: "clamp(22px, 3.5vw, 28px)",
                  marginBottom: "15px",
                }}
              >
                Welcome to AUTOPICK
              </h2>
              <p
                style={{ color: "#636e72", lineHeight: "1.6" }}
              >
                The Philippines' smart vehicle matching
                platform. We help you find the bike or car that
                actually fits your build.
              </p>
              <div
                style={{
                  marginTop: "20px",
                  fontSize: "14px",
                  color: "#4793FF",
                  fontWeight: "600",
                }}
              >
                Join 5k+ riders finding their perfect match.
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div
              style={{
                flex: 1,
                padding: "clamp(25px, 3vw, 40px) clamp(20px, 2.5vw, 40px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "15px",
                position: "relative",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowWelcome(false)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ✕
              </button>

              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  color: "#2d3436",
                }}
              >
                Get Started
              </h3>

              <button
                onClick={() => {
                  setShowWelcome(false);
                  setLoginMode("login");
                  setShowLoginModal(true);
                }}
                style={buttonStylePrimary}
              >
                Log In / Sign Up
              </button>

              <p style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", textAlign: "center", margin: "10px 0" }}>
                Get 500 Pick Points = 5% discount on all vehicles!
              </p>

              <div
                style={{
                  textAlign: "center",
                  color: "#636e72",
                  fontSize: "clamp(12px, 1.5vw, 13px)",
                }}
              >
                OR
              </div>

              <button
                onClick={() => setShowWelcome(false)}
                style={{
                  ...buttonStyleSecondary,
                  borderColor: "#4793FF",
                  color: "#4793FF",
                }}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questionnaire and Results - Only show when not on home page */}
      {currentPage !== "home" && (
        <>
          {/* Questionnaire */}
          {showQuestionnaire ? (
            <div
              style={{
                padding: "30px 20px",
                maxWidth: "min(600px, 95vw)",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  padding: "clamp(20px, 3vw, 40px)",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                    color: "#2d3436",
                    padding: "20px",
                    marginBottom: "clamp(20px, 2.5vw, 30px)",
                    borderRadius: "12px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "24px",
                      fontWeight: 600,
                    }}
                  >
                    Your Profile
                  </h2>
                </div>

                <p
                  style={{
                    marginBottom: "clamp(20px, 2.5vw, 30px)",
                    lineHeight: "1.6",
                    color: "#636e72",
                  }}
                >
                  Help us find the perfect vehicle for you.
                  Enter your physical details to get
                  personalized recommendations for motorcycles
                  and cars.
                </p>

                <div style={{ marginBottom: "clamp(15px, 1.5vw, 20px)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2d3436",
                    }}
                  >
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 165"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "clamp(15px, 1.5vw, 20px)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2d3436",
                    }}
                  >
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 65"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "clamp(15px, 1.5vw, 20px)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2d3436",
                    }}
                  >
                    Gender (optional)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="prefer-not-to-say">
                      Prefer not to say
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div style={{ marginBottom: "clamp(15px, 1.5vw, 20px)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2d3436",
                    }}
                  >
                    Price Range (optional)
                  </label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min (₱)"
                        style={inputStyle}
                      />
                    </div>
                    <span style={{ color: "#636e72" }}>to</span>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max (₱)"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", marginTop: "5px", marginBottom: 0 }}>
                    Leave blank to see all price ranges
                  </p>
                </div>

                <div style={{ marginBottom: "clamp(15px, 1.5vw, 20px)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2d3436",
                    }}
                  >
                    Preferred Brands (optional, select up to 10)
                  </label>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                    gap: "10px",
                    padding: "12px",
                    border: "2px solid ${#dfe6e9}",
                    borderRadius: "8px",
                    background: "#fff"
                  }}>
                    {["Honda", "Yamaha", "Suzuki", "Kawasaki", "Vespa", "Keeway", "Toyota", "Mitsubishi", "Ford", "Nissan", "Subaru", "KIA", "Mini", "BMW", "Hyundai"].map((brand) => (
                      <label
                        key={brand}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#2d3436",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={preferredBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (preferredBrands.length < 10) {
                                setPreferredBrands([...preferredBrands, brand]);
                              } else {
                                toast.error("You can only select up to 10 brands");
                              }
                            } else {
                              setPreferredBrands(preferredBrands.filter(b => b !== brand));
                            }
                          }}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                  <p style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", marginTop: "5px", marginBottom: 0 }}>
                    Selected: {preferredBrands.length}/10 - These brands will be prioritized in your results
                  </p>
                </div>

                <button
                  onClick={handleSubmitQuestionnaire}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background:
                      "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "12px",
                    boxShadow:
                      "0 4px 12px rgba(71, 147, 255, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Find My Match
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results header */}
              <div
                style={{
                  padding: "30px 20px 0 20px",
                  maxWidth: "min(1200px, 95vw)",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "clamp(15px, 1.5vw, 20px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#2d3436",
                        }}
                      >
                        Your Profile: {userProfile?.height}cm,{" "}
                        {userProfile?.weight}kg
                        {(userProfile?.minPrice || userProfile?.maxPrice) && (
                          <>
                            {" | "}
                            {userProfile.minPrice && `₱${userProfile.minPrice.toLocaleString()}`}
                            {userProfile.minPrice && userProfile.maxPrice && " - "}
                            {userProfile.maxPrice && `₱${userProfile.maxPrice.toLocaleString()}`}
                          </>
                        )}
                        {userProfile?.preferredBrands && userProfile.preferredBrands.length > 0 && (
                          <> {" | "} Prefers {userProfile.preferredBrands.join(", ")}</>
                        )}
                      </p>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          fontSize: "14px",
                          color: "#636e72",
                        }}
                      >
                        Showing recommendations based on your
                        profile{(userProfile?.minPrice || userProfile?.maxPrice) && " and price range"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowQuestionnaire(true);
                        setUserProfile(null);
                        setSelectedBrand("all");
                        setSelectedVehicleType("all");
                      }}
                      style={{
                        padding: "12px 24px",
                        background: "#fff",
                        color: "#2d3436",
                        border: "2px solid #dfe6e9",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 600,
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Reset Profile
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "clamp(15px, 1.5vw, 20px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  {/* Search Bar */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "12px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#2d3436",
                      }}
                    >
                      Search Vehicles
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, brand, or type..."
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #dfe6e9",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "'Montserrat', sans-serif",
                        transition: "border 0.3s ease",
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#4793FF"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#dfe6e9"}
                    />
                  </div>

                  {/* Sort Options */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "12px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#2d3436",
                      }}
                    >
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "none" | "price-asc" | "price-desc")}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #dfe6e9",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "'Montserrat', sans-serif",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <option value="none">Default (Compatibility)</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Vehicle Type Filter */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "12px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#2d3436",
                      }}
                    >
                      Vehicle Type
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() =>
                          setSelectedVehicleType("all")
                        }
                        style={{
                          padding: "10px 20px",
                          background:
                            selectedVehicleType === "all"
                              ? "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)"
                              : "#fff",
                          color:
                            selectedVehicleType === "all"
                              ? "#2d3436"
                              : "#636e72",
                          border: `2px solid ${selectedVehicleType === "all" ? "#FAC898" : "#dfe6e9"}`,
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight:
                            selectedVehicleType === "all"
                              ? 600
                              : 500,
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        All Vehicles
                      </button>
                      <button
                        onClick={() =>
                          setSelectedVehicleType("motorcycle")
                        }
                        style={{
                          padding: "10px 20px",
                          background:
                            selectedVehicleType === "motorcycle"
                              ? "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)"
                              : "#fff",
                          color:
                            selectedVehicleType === "motorcycle"
                              ? "#2d3436"
                              : "#636e72",
                          border: `2px solid ${selectedVehicleType === "motorcycle" ? "#FAC898" : "#dfe6e9"}`,
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight:
                            selectedVehicleType === "motorcycle"
                              ? 600
                              : 500,
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        🏍️ Motorcycles
                      </button>
                      <button
                        onClick={() =>
                          setSelectedVehicleType("car")
                        }
                        style={{
                          padding: "10px 20px",
                          background:
                            selectedVehicleType === "car"
                              ? "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)"
                              : "#fff",
                          color:
                            selectedVehicleType === "car"
                              ? "#fff"
                              : "#636e72",
                          border: `2px solid ${selectedVehicleType === "car" ? "#4793FF" : "#dfe6e9"}`,
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight:
                            selectedVehicleType === "car"
                              ? 600
                              : 500,
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        🚗 Cars
                      </button>
                      <button
                        onClick={() =>
                          setSelectedVehicleType("bigbike")
                        }
                        style={{
                          padding: "10px 20px",
                          background:
                            selectedVehicleType === "bigbike"
                              ? "linear-gradient(135deg, #2d3436 0%, #1a1d1f 100%)"
                              : "#fff",
                          color:
                            selectedVehicleType === "bigbike"
                              ? "#fff"
                              : "#636e72",
                          border: `2px solid ${selectedVehicleType === "bigbike" ? "#2d3436" : "#dfe6e9"}`,
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight:
                            selectedVehicleType === "bigbike"
                              ? 600
                              : 500,
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        🏁 Big Bikes
                      </button>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "12px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#2d3436",
                      }}
                    >
                      Filter by Brand
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() =>
                            setSelectedBrand(brand)
                          }
                          style={{
                            padding: "10px 20px",
                            background:
                              selectedBrand === brand
                                ? "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)"
                                : "#fff",
                            color:
                              selectedBrand === brand
                                ? "#fff"
                                : "#636e72",
                            border: `2px solid ${selectedBrand === brand ? "#4793FF" : "#dfe6e9"}`,
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight:
                              selectedBrand === brand
                                ? 600
                                : 500,
                            textTransform:
                              "capitalize" as const,
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {brand === "all"
                            ? "All Brands"
                            : brand}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div
                style={{
                  padding: "0 20px 30px 20px",
                  maxWidth: "min(1200px, 95vw)",
                  margin: "0 auto",
                }}
              >
                {/* Results count */}
                <div
                  style={{
                    marginBottom: "clamp(15px, 1.5vw, 20px)",
                    fontSize: "14px",
                    color: "#636e72",
                    fontWeight: 500,
                  }}
                >
                  Showing {filteredVehicles.length}{" "}
                  {filteredVehicles.length === 1
                    ? "vehicle"
                    : "vehicles"}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "clamp(16px, 2vw, 24px)",
                  }}
                >
                  {filteredVehicles.map(
                    ({ vehicle, score, reasons }) => (
                      <div
                        key={vehicle.id}
                        style={{
                          background: "#fff",
                          borderRadius: "16px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                          cursor: "pointer",
                          position: "relative" as const,
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                        }}
                        onClick={() =>
                          setPreviewVehicle(vehicle)
                        }
                      >
                        {/* Vehicle type badge */}
                        <div
                          style={{
                            position: "absolute" as const,
                            top: "12px",
                            left: "12px",
                            background:
                              vehicle.vehicleType ===
                              "motorcycle"
                                ? "#FAC898"
                                : "#4793FF",
                            color:
                              vehicle.vehicleType ===
                              "motorcycle"
                                ? "#2d3436"
                                : "#fff",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "clamp(12px, 1.5vw, 13px)",
                            fontWeight: 600,
                            zIndex: 10,
                            textTransform: "uppercase" as const,
                          }}
                        >
                          {vehicle.vehicleType === "motorcycle"
                            ? "Motorcycle"
                            : "Car"}
                        </div>

                        {/* Compatibility badge - only show if user has a profile */}
                        {userProfile && (
                          <div
                            style={{
                              position: "absolute" as const,
                              top: "12px",
                              right: "12px",
                              background:
                                score >= 88
                                  ? "#10b981"
                                  : score >= 75
                                    ? "#f59e0b"
                                    : score >= 60
                                      ? "#f97316"
                                      : "#ef4444",
                              color: "#fff",
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              fontWeight: 700,
                              zIndex: 10,
                            }}
                          >
                            {Math.round(score)}%
                          </div>
                        )}

                        <div style={{ overflow: "hidden", height: "clamp(180px, 20vw, 220px)" }}>
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            style={{
                              width: "100%",
                              height: "clamp(180px, 20vw, 220px)",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          />
                        </div>
                        <div style={{ padding: isMobile ? "15px" : "20px" }}>
                          <div
                            style={{
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#4793FF",
                              marginBottom: "6px",
                              fontWeight: 600,
                              textTransform:
                                "uppercase" as const,
                            }}
                          >
                            {vehicle.brand}
                          </div>
                          <h3
                            style={{
                              margin: "0 0 8px 0",
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#2d3436",
                            }}
                          >
                            {vehicle.name}
                          </h3>
                          {/* Price with discount */}
                          {(() => {
                            const { finalPrice, discountPercent } = calculateDiscountedPrice(vehicle.price);
                            return userAccount?.isLoggedIn && discountPercent > 0 ? (
                              <div style={{ margin: "0 0 16px 0" }}>
                                <p style={{
                                  margin: 0,
                                  fontSize: "16px",
                                  color: "#636e72",
                                  fontWeight: 500,
                                  textDecoration: "line-through"
                                }}>
                                  ₱{vehicle.price.toLocaleString()}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <p style={{
                                    margin: 0,
                                    fontSize: "24px",
                                    color: "#FAC898",
                                    fontWeight: 700
                                  }}>
                                    ₱{Math.round(finalPrice).toLocaleString()}
                                  </p>
                                  <span style={{
                                    background: "#27ae60",
                                    color: "#fff",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    fontSize: "clamp(11px, 1.5vw, 13px)",
                                    fontWeight: 600
                                  }}>
                                    -{discountPercent.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p style={{
                                margin: "0 0 16px 0",
                                fontSize: "24px",
                                color: "#FAC898",
                                fontWeight: 700,
                              }}>
                                ₱{vehicle.price.toLocaleString()}
                              </p>
                            );
                          })()}

                          {/* Compatibility reasons */}
                          <div
                            style={{
                              background: "#f8f9fa",
                              padding: "14px",
                              marginBottom: "16px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              lineHeight: "1.6",
                              color: "#636e72",
                            }}
                          >
                            {reasons
                              .slice(0, 2)
                              .map((reason, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    marginBottom:
                                      idx === 0 ? "6px" : "0",
                                  }}
                                >
                                  • {reason}
                                </div>
                              ))}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewVehicle(vehicle);
                              }}
                              style={buttonStylePrimary}
                            >
                              Preview
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(vehicle);
                              }}
                              style={buttonStyleSecondary}
                            >
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Floating Comparison Button */}
      {compareVehicles.length > 0 && (
        <button
          onClick={() => setShowComparison(true)}
          style={{
            position: "fixed" as const,
            bottom: "30px",
            right: "30px",
            padding: "16px 24px",
            background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(52, 152, 219, 0.4)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(52, 152, 219, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(52, 152, 219, 0.4)";
          }}
        >
          <span
            style={{
              background: "#fff",
              color: "#2980b9",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {compareVehicles.length}
          </span>
          <span>Compare Vehicles</span>
        </button>
      )}

      {/* Preview Modal */}
      {previewVehicle && (
        <div
          style={modalOverlayStyle}
          onClick={() => setPreviewVehicle(null)}
        >
          <div
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeaderStyle}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#2d3436", // Keep dark on gradient background
                }}
              >
                {previewVehicle.name}
              </h2>
            </div>
            <div style={{ overflow: "hidden", height: "300px" }}>
              <img
                src={previewVehicle.image}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>
            <div style={{ padding: "30px" }}>
              {/* Price with discount */}
              {(() => {
                const { finalPrice, discount, discountPercent } = calculateDiscountedPrice(previewVehicle.price);
                return (
                  <div style={{ marginBottom: "16px" }}>
                    {userAccount?.isLoggedIn && discount > 0 ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <p style={{
                            color: "#636e72",
                            fontSize: "20px",
                            fontWeight: 500,
                            margin: 0,
                            textDecoration: "line-through"
                          }}>
                            ₱{previewVehicle.price.toLocaleString()}
                          </p>
                          <span style={{
                            background: "#27ae60",
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: 600
                          }}>
                            {discountPercent.toFixed(1)}% OFF
                          </span>
                        </div>
                        <p style={{
                          color: "#FAC898",
                          fontSize: "clamp(24px, 4vw, 32px)",
                          fontWeight: 700,
                          margin: 0
                        }}>
                          ₱{Math.round(finalPrice).toLocaleString()}
                        </p>
                        <p style={{ fontSize: "13px", color: "#27ae60", margin: "5px 0 0 0" }}>
                          You save ₱{Math.round(discount).toLocaleString()} with your Pick Points!
                        </p>
                      </>
                    ) : (
                      <p style={{
                        color: "#FAC898",
                        fontSize: "28px",
                        fontWeight: 700,
                        margin: 0
                      }}>
                        ₱{previewVehicle.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })()}

              <p
                style={{
                  lineHeight: "1.6",
                  marginBottom: "clamp(15px, 1.5vw, 20px)",
                  color: "#636e72",
                }}
              >
                {previewVehicle.description}
              </p>

              {/* Vehicle Specifications */}
              <div style={{
                background: "#fffAlt",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "clamp(15px, 1.5vw, 20px)"
              }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", fontWeight: 600, color: "#2d3436" }}>
                  Vehicle Specifications
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))", gap: "12px" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>BRAND</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.brand}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>TYPE</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600, textTransform: "capitalize" as const }}>{previewVehicle.type}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>HEIGHT RANGE</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.minHeight}-{previewVehicle.maxHeight}cm</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>MAX WEIGHT</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.maxWeight}kg</p>
                  </div>
                  {previewVehicle.seatHeight && (
                    <div>
                      <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>SEAT HEIGHT</p>
                      <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.seatHeight}mm</p>
                    </div>
                  )}
                  {previewVehicle.capacity && (
                    <div>
                      <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>CAPACITY</p>
                      <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.capacity} seats</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Full Technical Specifications */}
              <div style={{
                background: "#fffAlt",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "clamp(15px, 1.5vw, 20px)"
              }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", fontWeight: 600, color: "#2d3436" }}>
                  Technical Specifications
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "15px" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>ENGINE TYPE</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.engineType}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>DISPLACEMENT</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.displacement}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>HORSEPOWER</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.horsepower}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>DIMENSIONS (L×W×H)</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.dimensions}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>WEIGHT</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.weight}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontWeight: 500 }}>FUEL EFFICIENCY</p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: 600 }}>{previewVehicle.fuelEfficiency}</p>
                  </div>
                </div>
              </div>

              {/* Compatibility info */}
              {userProfile && (
                <div
                  style={{
                    background: "#fffAlt",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#2d3436",
                    }}
                  >
                    Compatibility for your profile
                  </h3>
                  {filteredVehicles
                    .find(
                      (v) => v.vehicle.id === previewVehicle.id,
                    )
                    ?.reasons.map((reason, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: "14px",
                          marginBottom: "6px",
                          color: "#636e72",
                        }}
                      >
                        • {reason}
                      </div>
                    ))}
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "13px",
                      color: "#636e72",
                    }}
                  >
                    {previewVehicle.vehicleType === "motorcycle"
                      ? `Seat height: ${previewVehicle.seatHeight}mm | Max weight: ${previewVehicle.maxWeight}kg`
                      : `Capacity: ${previewVehicle.capacity} passengers | Max weight: ${previewVehicle.maxWeight}kg`}
                  </div>
                </div>
              )}

              {/* Star Rating */}
              {(() => {
                // Generate static rating based on vehicle ID
                const ratings = [4.8, 4.5, 4.7, 4.9, 4.6, 4.3, 4.4, 4.8, 4.7, 4.5];
                const reviewCounts = [342, 156, 289, 521, 198, 87, 134, 412, 276, 145];
                const rating = ratings[previewVehicle.id % 10];
                const reviewCount = reviewCounts[previewVehicle.id % 10];
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;

                return (
                  <div style={{
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    marginBottom: "clamp(15px, 1.5vw, 20px)",
                    textAlign: "center"
                  }}>
                    <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                      Customer Reviews
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px" }}>
                      {[...Array(5)].map((_, i) => {
                        if (i < fullStars) {
                          return <span key={i} style={{ fontSize: "24px", color: "#FAC898" }}>★</span>;
                        } else if (i === fullStars && hasHalfStar) {
                          return <span key={i} style={{ fontSize: "24px", color: "#FAC898" }}>★</span>;
                        } else {
                          return <span key={i} style={{ fontSize: "24px", color: "#dfe6e9" }}>★</span>;
                        }
                      })}
                      <span style={{ fontSize: "18px", fontWeight: 700, color: "#2d3436", marginLeft: "8px" }}>
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#636e72" }}>
                      Based on {reviewCount} reviews
                    </div>
                  </div>
                );
              })()}

              {/* AR CTA */}
              <div style={{ marginBottom: "20px" }}>
                <button
                  onClick={() => toast.info("Point your rear camera at a flat surface — AR model launching…")}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    background: "linear-gradient(135deg, #4793FF 0%, #2563eb 100%)",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "0 4px 16px rgba(71,147,255,0.35)",
                  }}
                >
                  {/* 3D cube + camera icon composite */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ flexShrink: 0 }}
                  >
                    {/* cube outline */}
                    <path
                      d="M11 2L19 6.5V15.5L11 20L3 15.5V6.5L11 2Z"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M11 2L11 20M3 6.5L11 11L19 6.5"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    {/* camera lens dot */}
                    <circle cx="18" cy="4" r="3" fill="white" opacity="0.9" />
                    <circle cx="18" cy="4" r="1.4" fill="#4793FF" />
                  </svg>
                  <span style={{
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    fontFamily: "Montserrat, sans-serif",
                  }}>
                    View 3D Model in AR
                  </span>
                </button>
                <p style={{
                  margin: "8px 0 0 0",
                  fontSize: "11px",
                  color: "#95a5a6",
                  textAlign: "center",
                  lineHeight: "1.5",
                  fontFamily: "Montserrat, sans-serif",
                }}>
                  Requires rear camera access to project model at 1:1 scale in your physical environment
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {userAccount?.isLoggedIn && userProfile ? (
                  <button
                    onClick={() => {
                      // Check if user is verified
                      if (!userAccount.isVerified) {
                        toast.error("Please verify your account before purchasing. Check your Profile!");
                        setPreviewVehicle(null);
                        setShowProfileModal(true);
                        return;
                      }

                      setCheckoutVehicle(previewVehicle);
                      setTermsAccepted(false);
                      setShowCheckoutVerification(true);
                    }}
                    style={{
                      ...buttonStylePrimary,
                      width: "100%",
                      padding: "16px",
                      background: "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    Checkout & Get Store Code
                  </button>
                ) : (
                  <div style={{
                    background: "#fff3cd",
                    border: "2px solid #ffc107",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600, color: "#856404" }}>
                      Want to purchase this vehicle?
                    </p>
                    <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#856404", lineHeight: "1.6" }}>
                      {!userAccount?.isLoggedIn
                        ? "Please log in and create your profile to unlock checkout."
                        : "Complete your profile to unlock checkout and personalized recommendations."
                      }
                    </p>
                    <button
                      onClick={() => {
                        setPreviewVehicle(null);
                        if (!userAccount?.isLoggedIn) {
                          setLoginMode("login");
                          setShowLoginModal(true);
                        } else {
                          setShowQuestionnaire(true);
                          setCurrentPage("vehicles");
                        }
                      }}
                      style={{
                        ...buttonStylePrimary,
                        width: "100%",
                        padding: "12px",
                        fontSize: "14px",
                        background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                      }}
                    >
                      {!userAccount?.isLoggedIn ? "Log In / Sign Up" : "Create Profile"}
                    </button>
                  </div>
                )}
                <a
                  href={previewVehicle.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={storeLinkStyle}
                >
                  Visit Official Store
                </a>
                <button
                  onClick={() => {
                    addToCompare(previewVehicle);
                    setPreviewVehicle(null);
                  }}
                  style={{
                    ...buttonStylePrimary,
                    width: "100%",
                    padding: "14px",
                    background: compareVehicles.find(v => v.id === previewVehicle.id)
                      ? "#95a5a6"
                      : "linear-gradient(135deg, #3498db 0%, #2980b9 100%)"
                  }}
                  disabled={compareVehicles.find(v => v.id === previewVehicle.id) !== undefined}
                >
                  {compareVehicles.find(v => v.id === previewVehicle.id) ? "Already in Comparison" : "Add to Compare"}
                </button>
                <div style={{ display: "flex", gap: "12px" }}>
                  <a
                    href={previewVehicle.storeUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      handleShare(previewVehicle);
                    }}
                    style={{
                      ...buttonStyleSecondary,
                      flex: 1,
                      padding: "14px",
                      textDecoration: "none",
                      textAlign: "center" as const,
                      display: "block",
                    }}
                  >
                    Copy Link
                  </a>
                  <button
                    onClick={() => setPreviewVehicle(null)}
                    style={closeButtonStyle}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Verification Modal */}
      {showCheckoutVerification && checkoutVehicle && (
        <div
          style={modalOverlayStyle}
          onClick={() => {
            setShowCheckoutVerification(false);
            setTermsAccepted(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: isMobile ? "24px" : "40px",
              maxWidth: "min(500px, 95vw)",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 20px 0", fontSize: isMobile ? "20px" : "24px", fontWeight: 700, color: "#2d3436", textAlign: "center" }}>
              Verify Your Purchase
            </h2>
            <div style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: isMobile ? "12px" : "16px",
              marginBottom: isMobile ? "12px" : "16px"
            }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "clamp(16px, 2vw, 18px)", fontWeight: 600, color: "#2d3436" }}>
                {checkoutVehicle.name}
              </h3>
              <img
                src={checkoutVehicle.image}
                style={{
                  width: "100%",
                  height: "clamp(120px, 15vw, 150px)",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "12px"
                }}
              />
              {(() => {
                const { finalPrice, discount, discountPercent } = calculateDiscountedPrice(checkoutVehicle.price);
                return (
                  <div>
                    {userAccount?.isLoggedIn && discount > 0 ? (
                      <>
                        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#636e72", textDecoration: "line-through" }}>
                          ₱{checkoutVehicle.price.toLocaleString()}
                        </p>
                        <p style={{ margin: "0", fontSize: "24px", fontWeight: 700, color: "#27ae60" }}>
                          ₱{Math.round(finalPrice).toLocaleString()}
                        </p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#27ae60" }}>
                          {discountPercent.toFixed(1)}% discount applied - You save ₱{Math.round(discount).toLocaleString()}!
                        </p>
                      </>
                    ) : (
                      <p style={{ margin: "0", fontSize: "24px", fontWeight: 700, color: "#FAC898" }}>
                        ₱{checkoutVehicle.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
            {userAccount?.isLoggedIn ? (
              <>
                <div style={{
                  background: "#fff3cd",
                  border: "2px solid #ffc107",
                  borderRadius: "8px",
                  padding: isMobile ? "10px" : "12px",
                  marginBottom: isMobile ? "12px" : "16px"
                }}>
                  <p style={{ margin: "0 0 6px 0", fontSize: isMobile ? "12px" : "13px", fontWeight: 600, color: "#856404" }}>
                    Account Information:
                  </p>
                  <p style={{ margin: "3px 0", fontSize: isMobile ? "11px" : "12px", color: "#856404" }}>
                    <strong>Name:</strong> {userAccount.firstName} {userAccount.middleName ? userAccount.middleName + " " : ""}{userAccount.lastName}
                  </p>
                  <p style={{ margin: "3px 0", fontSize: isMobile ? "11px" : "12px", color: "#856404" }}>
                    <strong>Email:</strong> {userAccount.email}
                  </p>
                  <p style={{ margin: "3px 0", fontSize: isMobile ? "11px" : "12px", color: "#856404" }}>
                    <strong>Contact:</strong> {userAccount.contactNumber}
                  </p>
                </div>
                <div style={{
                  background: "#e3f2fd",
                  border: "2px solid #2196f3",
                  borderRadius: "8px",
                  padding: isMobile ? "10px" : "12px",
                  marginBottom: isMobile ? "12px" : "16px"
                }}>
                  <p style={{ margin: "0 0 6px 0", fontSize: isMobile ? "12px" : "13px", fontWeight: 600, color: "#1976d2" }}>
                    🛡️ Verification Reminder:
                  </p>
                  <p style={{ margin: "3px 0", fontSize: isMobile ? "11px" : "12px", color: "#1976d2" }}>
                    <strong>ID Required:</strong> {userAccount.verifiedIdName}
                  </p>
                  <p style={{ margin: "3px 0", fontSize: isMobile ? "11px" : "12px", color: "#1976d2" }}>
                    <strong>Address:</strong> {userAccount.verifiedAddress}
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: isMobile ? "11px" : "12px", color: "#1976d2", fontStyle: "italic" }}>
                    Please bring your {userAccount.verifiedIdName} when visiting the dealership.
                  </p>
                </div>
              </>
            ) : (
              <div style={{
                background: "#fff3cd",
                border: "2px solid #ffc107",
                borderRadius: "8px",
                padding: isMobile ? "10px" : "12px",
                marginBottom: isMobile ? "12px" : "16px",
                textAlign: "center"
              }}>
                <p style={{ margin: "0", fontSize: isMobile ? "11px" : "12px", color: "#856404" }}>
                  ℹ️ Note: You're checking out as a guest. Log in to enjoy discounts with Pick Points!
                </p>
              </div>
            )}
            {userAccount?.isLoggedIn && userAccount.pickPoints > 0 && (() => {
              const { discount } = calculateDiscountedPrice(checkoutVehicle.price);
              return discount > 0 ? (
                <div style={{
                  background: "#fff3cd",
                  border: "2px solid #ffc107",
                  borderRadius: "8px",
                  padding: isMobile ? "12px" : "16px",
                  marginBottom: isMobile ? "12px" : "16px",
                  textAlign: "center"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 700, color: "#856404" }}>
                    ⚠️ Important Notice
                  </p>
                  <p style={{ margin: "0", fontSize: isMobile ? "12px" : "13px", color: "#856404", lineHeight: "1.6" }}>
                    Once you confirm this purchase, your Pick Points will be depleted. You currently have <strong>{userAccount.pickPoints} points</strong> which gives you a <strong>{(userAccount.pickPoints / 100).toFixed(1)}% discount</strong>.
                  </p>
                </div>
              ) : null;
            })()}
            <div style={{
              background: "#f8f9fa",
              borderRadius: "8px",
              padding: isMobile ? "12px" : "16px",
              marginBottom: "16px",
              maxHeight: isMobile ? "120px" : "150px",
              overflowY: "auto",
              border: "1px solid #dfe6e9"
            }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 700, color: "#2d3436" }}>
                Terms and Conditions
              </h3>
              <div style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>
                  By proceeding with this purchase, you agree to the following terms:
                </p>
                <ul style={{ margin: "0 0 8px 0", paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "4px" }}>The store code is valid for 30 days from the date of generation.</li>
                  <li style={{ marginBottom: "4px" }}>This code must be presented at an authorized dealership to complete the purchase.</li>
                  <li style={{ marginBottom: "4px" }}>Vehicle availability is subject to dealer inventory and may vary by location.</li>
                  <li style={{ marginBottom: "4px" }}>The final price may be subject to additional taxes, registration fees, and dealer charges.</li>
                  <li style={{ marginBottom: "4px" }}>Pick Points discounts are non-transferable and cannot be combined with other promotional offers.</li>
                  <li style={{ marginBottom: "4px" }}>AutoPick is not responsible for any changes in vehicle pricing or specifications by the manufacturer.</li>
                  <li style={{ marginBottom: "4px" }}>You agree to provide accurate personal information for purchase verification purposes.</li>
                  <li style={{ marginBottom: "4px" }}>Test drives and final purchase agreements are subject to dealership policies and approval.</li>
                </ul>
                <p style={{ margin: "8px 0 0 0", fontSize: "clamp(11px, 1.5vw, 13px)", fontStyle: "italic" }}>
                  For complete terms and conditions, please visit our website or contact customer support.
                </p>
              </div>
            </div>
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: isMobile ? "8px" : "12px",
              marginBottom: isMobile ? "16px" : "20px",
              cursor: "pointer",
              padding: isMobile ? "10px" : "12px",
              background: termsAccepted ? "#e8f5e9" : "#fff",
              borderRadius: "8px",
              border: `2px solid ${termsAccepted ? "#27ae60" : "#dfe6e9"}`,
              transition: "all 0.3s ease"
            }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{
                  width: isMobile ? "18px" : "20px",
                  height: isMobile ? "18px" : "20px",
                  cursor: "pointer",
                  marginTop: "2px",
                  flexShrink: 0
                }}
              />
              <span style={{ fontSize: isMobile ? "12px" : "13px", color: "#2d3436", lineHeight: "1.5" }}>
                I have read and agree to the Terms and Conditions. I understand that this code is for purchase verification at authorized dealerships only.
              </span>
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowCheckoutVerification(false);
                  setTermsAccepted(false);
                }}
                style={{
                  ...buttonStyleSecondary,
                  flex: 1,
                  padding: "14px"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!termsAccepted) {
                    alert("Please accept the Terms and Conditions to proceed.");
                    return;
                  }
                  setShowCheckoutVerification(false);
                  setShowAreYouSure(true);
                }}
                style={{
                  ...buttonStylePrimary,
                  flex: 1,
                  padding: "14px",
                  background: termsAccepted
                    ? "linear-gradient(135deg, #27ae60 0%, #229954 100%)"
                    : "#95a5a6",
                  cursor: termsAccepted ? "pointer" : "not-allowed",
                  opacity: termsAccepted ? 1 : 0.6
                }}
                disabled={!termsAccepted}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Are You Sure Modal */}
      {showAreYouSure && checkoutVehicle && (
        <div
          style={modalOverlayStyle}
          onClick={() => {
            setShowAreYouSure(false);
            setTermsAccepted(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "clamp(20px, 3vw, 40px)",
              maxWidth: "min(450px, 95vw)",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: "80px",
              height: "80px",
              background: "#fff3cd",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              fontSize: "48px",
            }}>
              ⚠️
            </div>
            <h2 style={{ margin: "0 0 16px 0", fontSize: "24px", fontWeight: 700, color: "#2d3436" }}>
              Are You Sure?
            </h2>
            <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#636e72", lineHeight: "1.8" }}>
              You are about to finalize your purchase for <strong>{checkoutVehicle.name}</strong>. Once confirmed, you will receive a store code to complete your transaction at the dealership.
            </p>
            <p style={{ margin: "0 0 32px 0", fontSize: "13px", color: "#636e72", lineHeight: "1.6" }}>
              Please make sure all your information is correct before proceeding. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowAreYouSure(false);
                  setTermsAccepted(false);
                }}
                style={{
                  ...buttonStyleSecondary,
                  flex: 1,
                  padding: "16px",
                  fontSize: "16px",
                  fontWeight: 600
                }}
              >
                No, Go Back
              </button>
              <button
                onClick={() => {
                  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
                  setCheckoutCode(code);

                  // Deplete Pick Points after purchase
                  if (userAccount?.isLoggedIn) {
                    const updatedAccount = {
                      ...userAccount,
                      pickPoints: 0
                    };
                    setUserAccount(updatedAccount);
                    saveUser(updatedAccount);
                    saveCurrentSession(updatedAccount);
                  }

                  setShowAreYouSure(false);
                  setShowCheckoutCode(true);
                  setPreviewVehicle(null);
                  setTermsAccepted(false);
                }}
                style={{
                  ...buttonStylePrimary,
                  flex: 1,
                  padding: "16px",
                  background: "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
                  fontSize: "16px",
                  fontWeight: 600
                }}
              >
                Yes, I'm Ready
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Code Modal */}
      {showCheckoutCode && checkoutVehicle && (
        <div
          style={modalOverlayStyle}
          onClick={() => {
            setShowCheckoutCode(false);
            setCheckoutVehicle(null);
            setCheckoutCode("");
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "clamp(20px, 3vw, 40px)",
              maxWidth: "min(500px, 95vw)",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              fontSize: "40px",
              color: "#fff"
            }}>
              ✓
            </div>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "28px", fontWeight: 700, color: "#2d3436" }}>
              Purchase Confirmed!
            </h2>
            <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#636e72" }}>
              Show this code at the store to complete your purchase
            </p>
            <div style={{
              background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "24px",
              border: "3px dashed #2d3436"
            }}>
              <p style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "#2d3436", letterSpacing: "1px" }}>
                YOUR STORE CODE
              </p>
              <p style={{ margin: "0", fontSize: "48px", fontWeight: 700, color: "#2d3436", letterSpacing: "8px", fontFamily: "monospace" }}>
                {checkoutCode}
              </p>
            </div>
            <div style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "16px",
              textAlign: "left"
            }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600, color: "#2d3436" }}>
                {checkoutVehicle.name}
              </h3>
              {(() => {
                const { finalPrice, discount, discountPercent } = calculateDiscountedPrice(checkoutVehicle.price);
                return (
                  <div>
                    {userAccount?.isLoggedIn && discount > 0 ? (
                      <>
                        <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#636e72", textDecoration: "line-through" }}>
                          Original Price: ₱{checkoutVehicle.price.toLocaleString()}
                        </p>
                        <p style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: 700, color: "#27ae60" }}>
                          Final Price: ₱{Math.round(finalPrice).toLocaleString()}
                        </p>
                        <p style={{ margin: "0", fontSize: "13px", color: "#27ae60" }}>
                          Your savings: ₱{Math.round(discount).toLocaleString()} ({discountPercent.toFixed(1)}% off)
                        </p>
                      </>
                    ) : (
                      <p style={{ margin: "0", fontSize: "20px", fontWeight: 700, color: "#FAC898" }}>
                        Price: ₱{checkoutVehicle.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
            {(() => {
              const { discount, discountPercent } = calculateDiscountedPrice(checkoutVehicle.price);
              return discount > 0 ? (
                <div style={{
                  background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                  border: "2px solid #27ae60",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "24px",
                  textAlign: "left"
                }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700, color: "#2d3436", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>🎉</span>
                    Discount Applied!
                  </h4>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "#2d3436" }}>Pick Points Used:</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#27ae60" }}>
                        {Math.round(discountPercent * 100)} points
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "#2d3436" }}>Discount Percentage:</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#27ae60" }}>
                        {discountPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "#2d3436" }}>Total Savings:</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#27ae60" }}>
                        ₱{Math.round(discount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #27ae6033"
                  }}>
                    <p style={{ margin: "0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#2d3436", fontStyle: "italic" }}>
                      💡 Your Pick Points have been used for this purchase. Earn more through referrals!
                    </p>
                  </div>
                </div>
              ) : null;
            })()}
            {(() => {
              const { discount } = calculateDiscountedPrice(checkoutVehicle.price);
              return discount > 0 ? (
                <div style={{
                  background: "#ffe8e8",
                  border: "2px solid #e74c3c",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "16px",
                  textAlign: "center"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: 700, color: "#c0392b" }}>
                    ✓ Pick Points Used
                  </p>
                  <p style={{ margin: "0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#c0392b" }}>
                    Your Pick Points have been depleted for this purchase. You'll need to earn new points for future discounts.
                  </p>
                </div>
              ) : null;
            })()}
            <div style={{
              background: "#e3f2fd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px"
            }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 600, color: "#1976d2" }}>
                📋 Next Steps:
              </p>
              <p style={{ margin: "4px 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#1976d2", textAlign: "left" }}>
                1. Take a screenshot or write down this code
              </p>
              <p style={{ margin: "4px 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#1976d2", textAlign: "left" }}>
                2. Visit the dealership or store
              </p>
              <p style={{ margin: "4px 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#1976d2", textAlign: "left" }}>
                3. Show this code to complete your purchase
              </p>
            </div>
            <button
              onClick={() => {
                // Automatically filter to show the brand of the purchased vehicle
                setSelectedBrand(checkoutVehicle.brand);
                setShowCheckoutCode(false);
                setShowStoreLocations(true);
              }}
              style={{
                ...buttonStylePrimary,
                width: "100%",
                padding: "14px",
                marginBottom: "12px",
                background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
              }}
            >
              📍 Find {checkoutVehicle.brand} Dealerships
            </button>
            <button
              onClick={() => {
                setShowCheckoutCode(false);
                setCheckoutVehicle(null);
                setCheckoutCode("");
              }}
              style={{
                ...buttonStyleSecondary,
                width: "100%",
                padding: "14px",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div
          style={modalOverlayStyle}
          onClick={() => setShowAboutModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "min(700px, 95vw)",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
                padding: "30px",
                borderRadius: "16px 16px 0 0",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "clamp(24px, 4vw, 32px)",
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                About AutoPick
              </h2>
              <p style={{ margin: 0, fontSize: "16px", color: "#fff", opacity: 0.9 }}>
                Your Smart Vehicle Compatibility Platform
              </p>
            </div>

            <div style={{ padding: "clamp(20px, 3vw, 40px)" }}>
              <div style={{ marginBottom: "clamp(20px, 2.5vw, 30px)" }}>
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2d3436",
                  }}
                >
                  What is AutoPick
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    lineHeight: "1.7",
                    color: "#636e72",
                  }}
                >
                  AutoPick is an intelligent vehicle recommendation platform designed to help you find the perfect motorcycle or car based on your unique physical profile and preferences. Using advanced compatibility algorithms, we analyze your height, weight, and budget to match you with vehicles that truly fit your needs.
                </p>
              </div>

              <div style={{ marginBottom: "clamp(20px, 2.5vw, 30px)" }}>
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2d3436",
                  }}
                >
                  How It Works
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                        color: "#2d3436",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      1
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", color: "#2d3436", fontWeight: 600 }}>
                        Complete Your Profile
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#636e72", lineHeight: "1.6" }}>
                        Enter your height, weight, gender, budget, and preferred brands to create your personalized profile.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                        color: "#2d3436",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      2
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", color: "#2d3436", fontWeight: 600 }}>
                        Get Compatibility Scores
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#636e72", lineHeight: "1.6" }}>
                        Our algorithm calculates compatibility scores based on seat height, weight capacity, price range, and brand preferences.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                        color: "#2d3436",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      3
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", color: "#2d3436", fontWeight: 600 }}>
                        Browse & Compare
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#636e72", lineHeight: "1.6" }}>
                        Explore recommended vehicles, filter by brand or type, and compare multiple options side-by-side with detailed reasoning.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                        color: "#2d3436",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      4
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", color: "#2d3436", fontWeight: 600 }}>
                        Earn Pick Points
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#636e72", lineHeight: "1.6" }}>
                        Create an account to earn Pick Points and unlock exclusive discounts on your favorite vehicles!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "clamp(20px, 2.5vw, 30px)" }}>
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2d3436",
                  }}
                >
                  Why Choose AutoPick?
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "15px" }}>
                  <div
                    style={{
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎯</div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2d3436", marginBottom: "5px" }}>
                      Personalized Matches
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#636e72" }}>
                      Find vehicles that truly fit your body and budget
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>📊</div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2d3436", marginBottom: "5px" }}>
                      Data-Driven Insights
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#636e72" }}>
                      Advanced algorithms ensure accurate recommendations
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>🚗</div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2d3436", marginBottom: "5px" }}>
                      Extensive Database
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#636e72" }}>
                      130+ motorcycles and cars from trusted brands
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>⭐</div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2d3436", marginBottom: "5px" }}>
                      Rewards System
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#636e72" }}>
                      Earn points and save money on your purchase
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "20px",
                  borderTop: "2px solid #e1e8ed",
                }}
              >
                <button
                  onClick={() => setShowAboutModal(false)}
                  style={{
                    ...buttonStylePrimary,
                    padding: "14px 40px",
                    fontSize: "15px",
                  }}
                >
                  Got It!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Store Locations Modal */}
      {showStoreLocations && (
        <div
          style={modalOverlayStyle}
          onClick={() => {
            setShowStoreLocations(false);
            // Don't reset selectedBrand here - let user keep their filter preference
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "min(1000px, 95vw)",
              width: "95%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                padding: isMobile ? "20px" : "30px",
                borderRadius: "16px 16px 0 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: isMobile ? "48px" : "64px", marginBottom: "10px" }}>📍</div>
              <h2
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "clamp(24px, 4vw, 32px)",
                  fontWeight: 700,
                  color: "#2d3436",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Dealership Locations
              </h2>
              <p style={{ margin: 0, fontSize: isMobile ? "14px" : "16px", color: "#2d3436", opacity: 0.85 }}>
                Official brand dealerships across Metro Manila
              </p>
            </div>

            <div style={{ padding: "clamp(20px, 3vw, 40px)" }}>
              {selectedBrand !== "all" && checkoutVehicle && checkoutVehicle.brand === selectedBrand ? (
                <div style={{
                  background: "#e8f5e9",
                  border: "2px solid #27ae60",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "clamp(15px, 1.5vw, 20px)"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "#27ae60" }}>
                    ✓ Showing {selectedBrand} Dealerships
                  </p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#2d3436", lineHeight: "1.6" }}>
                    These dealerships carry the <strong>{checkoutVehicle.name}</strong> you just purchased.
                    You can change the filter below to view other brands.
                  </p>
                </div>
              ) : null}

              <div style={{
                background: "#e3f2fd",
                border: "1px solid #2196f3",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "clamp(20px, 2.5vw, 30px)"
              }}>
                <p style={{ margin: 0, fontSize: "14px", color: "#1976d2", lineHeight: "1.6" }}>
                  💡 <strong>Tip:</strong> Bring your store code and government ID to any dealership to complete your purchase. All locations offer test drives and financing options.
                </p>
              </div>

              {/* Filter by brand */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                  Filter by Brand:
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #dfe6e9",
                    fontSize: "14px",
                    color: "#2d3436",
                    background: "#fff",
                    cursor: "pointer"
                  }}
                >
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand === "all" ? "All Brands" : brand}
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const filteredStores = storeLocations.filter(store => selectedBrand === "all" || store.brand === selectedBrand);
                return (
                  <>
                    <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#636e72" }}>
                      Showing {filteredStores.length} dealership{filteredStores.length !== 1 ? 's' : ''}
                    </p>

                    {filteredStores.length === 0 ? (
                      <div style={{
                        padding: "clamp(20px, 3vw, 40px)",
                        textAlign: "center",
                        background: "#f8f9fa",
                        borderRadius: "12px"
                      }}>
                        <p style={{ margin: "0 0 12px 0", fontSize: "48px" }}>🔍</p>
                        <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 600, color: "#2d3436" }}>
                          No dealerships found
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", color: "#636e72" }}>
                          Try selecting a different brand
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: "clamp(16px, 2vw, 24px)" }}>
                        {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    style={{
                      border: "2px solid #dfe6e9",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div style={{ display: isMobile ? "block" : "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0" }}>
                      {/* Store Info */}
                      <div style={{ padding: "24px", background: "#fff" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                          <span style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>{store.logo}</span>
                          <div>
                            <p style={{ margin: "0 0 4px 0", fontSize: "clamp(12px, 1.5vw, 13px)", fontWeight: 600, color: "#FAC898", textTransform: "uppercase", letterSpacing: "1px" }}>
                              {store.brand}
                            </p>
                            <h3 style={{ margin: "0", fontSize: "18px", fontWeight: 700, color: "#2d3436" }}>
                              {store.name}
                            </h3>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "18px", flexShrink: 0 }}>📍</span>
                            <div>
                              <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: 600, color: "#2d3436" }}>Address:</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#636e72", lineHeight: "1.5" }}>
                                {store.address}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "18px", flexShrink: 0 }}>📞</span>
                            <div>
                              <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: 600, color: "#2d3436" }}>Phone:</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#636e72" }}>
                                {store.phone}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "18px", flexShrink: 0 }}>🕒</span>
                            <div>
                              <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: 600, color: "#2d3436" }}>Hours:</p>
                              <p style={{ margin: 0, fontSize: "14px", color: "#636e72", lineHeight: "1.5" }}>
                                {store.hours}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              ...buttonStylePrimary,
                              flex: 1,
                              padding: "12px 20px",
                              textDecoration: "none",
                              textAlign: "center",
                              fontSize: "14px",
                              background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
                            }}
                          >
                            🗺️ Get Directions
                          </a>
                          <a
                            href={`tel:${store.phone}`}
                            style={{
                              ...buttonStyleSecondary,
                              flex: 1,
                              padding: "12px 20px",
                              textDecoration: "none",
                              textAlign: "center",
                              fontSize: "14px",
                            }}
                          >
                            📞 Call Store
                          </a>
                        </div>
                      </div>

                      {/* Map Preview */}
                      <div style={{ background: "#f8f9fa", minHeight: isMobile ? "200px" : "300px", position: "relative" }}>
                        <iframe
                          src={store.mapUrl}
                          style={{
                            width: "100%",
                            height: isMobile ? "200px" : "100%",
                            border: "none",
                            minHeight: "300px"
                          }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}

              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <button
                  onClick={() => {
                    setShowStoreLocations(false);
                    // Clear checkout vehicle so contextual message doesn't persist
                    if (checkoutVehicle && !showCheckoutCode) {
                      setCheckoutVehicle(null);
                    }
                  }}
                  style={{
                    ...buttonStyleSecondary,
                    padding: "14px 40px",
                    fontSize: "15px",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {showReferralModal && userAccount?.isLoggedIn && (
        <div
          style={modalOverlayStyle}
          onClick={() => setShowReferralModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "min(600px, 95vw)",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                padding: "30px",
                borderRadius: "16px 16px 0 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎁</div>
              <h2
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "clamp(24px, 4vw, 32px)",
                  fontWeight: 700,
                  color: "#2d3436",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Share & Earn Points!
              </h2>
              <p style={{ margin: 0, fontSize: "16px", color: "#2d3436", opacity: 0.85 }}>
                Invite friends and both of you earn rewards
              </p>
            </div>

            <div style={{ padding: "clamp(20px, 3vw, 40px)" }}>
              <div style={{ marginBottom: "clamp(20px, 2.5vw, 30px)" }}>
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#2d3436",
                  }}
                >
                  Your Referral Code
                </h3>
                <div
                  style={{
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px dashed #FAC898",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 32px)",
                      fontWeight: 900,
                      color: "#4793FF",
                      letterSpacing: "3px",
                      fontFamily: "monospace",
                      marginBottom: "10px",
                    }}
                  >
                    {userAccount.referralCode}
                  </div>
                  <button
                    onClick={() => {
                      const referralLink = `${window.location.origin}?ref=${userAccount.referralCode}`;
                      navigator.clipboard.writeText(referralLink);
                      toast.success("Referral link copied to clipboard!");
                    }}
                    style={{
                      ...buttonStylePrimary,
                      padding: "12px 30px",
                      fontSize: "14px",
                      marginTop: "10px",
                    }}
                  >
                    📋 Copy Referral Link
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "clamp(20px, 2.5vw, 30px)" }}>
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#2d3436",
                  }}
                >
                  How It Works
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
                        color: "#fff",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      1
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", color: "#2d3436", lineHeight: "1.6" }}>
                        <strong>Share your referral link</strong> with friends, family, or on social media
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
                        color: "#fff",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      2
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", color: "#2d3436", lineHeight: "1.6" }}>
                        <strong>They sign up</strong> using your link and create an AutoPick account
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
                        color: "#fff",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      3
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", color: "#2d3436", lineHeight: "1.6" }}>
                        <strong>You earn 20 points</strong> (0.2% discount) when they create an account!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {(() => {
                const currentMonth = new Date().toISOString().substring(0, 7);
                const referralCount = userAccount.referralMonth === currentMonth ? (userAccount.referralCount || 0) : 0;
                const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });

                return (
                  <>
                    <div style={{
                      background: "#fff3cd",
                      border: "2px solid #ffc107",
                      padding: "16px",
                      borderRadius: "12px",
                      marginBottom: "clamp(15px, 1.5vw, 20px)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "24px" }}>📊</span>
                        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#856404" }}>
                          Your Referral Stats
                        </h4>
                      </div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#856404" }}>
                        <strong>This {monthName}:</strong> {referralCount} / 3 successful referrals
                      </p>
                      <p style={{ margin: "0", fontSize: "13px", color: "#856404", lineHeight: "1.6" }}>
                        <strong>Limit:</strong> 3 referrals per month, 500 point maximum
                      </p>
                    </div>

                    <div
                      style={{
                        background: "linear-gradient(135deg, #e8f4ff 0%, #d6eaff 100%)",
                        padding: "20px",
                        borderRadius: "12px",
                        marginBottom: "clamp(15px, 1.5vw, 20px)",
                        border: "1px solid #4793FF33",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "24px" }}>💡</span>
                        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#2d3436" }}>
                          Important Notes
                        </h4>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#636e72", lineHeight: "1.8" }}>
                        <li>Maximum 3 referrals per month to prevent abuse</li>
                        <li>Pick Points are capped at 500 (5% max discount)</li>
                        <li>Points are depleted after each purchase</li>
                        <li>Referral counter resets every month</li>
                      </ul>
                    </div>
                  </>
                );
              })()}

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => setShowReferralModal(false)}
                  style={{
                    ...buttonStyleSecondary,
                    padding: "14px 40px",
                    fontSize: "15px",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div
          style={modalOverlayStyle}
          onClick={() => setShowLoginModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "min(500px, 95vw)",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
                padding: "30px",
                borderRadius: "16px 16px 0 0",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "clamp(24px, 4vw, 32px)",
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {loginMode === "login" ? "Welcome Back!" : "Create Account"}
              </h2>
              <p style={{ margin: 0, fontSize: "16px", color: "#fff", opacity: 0.9 }}>
                {loginMode === "login" ? "Log in to continue" : "Join AutoPick today"}
              </p>
            </div>

            <div style={{ padding: "clamp(20px, 3vw, 40px)" }}>
              {/* Tab Switcher */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "clamp(20px, 2.5vw, 30px)",
                  background: "#f8f9fa",
                  padding: "5px",
                  borderRadius: "10px",
                }}
              >
                <button
                  onClick={() => setLoginMode("login")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: loginMode === "login" ? "#4793FF" : "transparent",
                    color: loginMode === "login" ? "#fff" : "#636e72",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => setLoginMode("signup")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: loginMode === "signup" ? "#4793FF" : "transparent",
                    color: loginMode === "signup" ? "#fff" : "#636e72",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  Sign Up
                </button>
              </div>

              {/* Login Form */}
              {loginMode === "login" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(15px, 1.5vw, 20px)" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        padding: "12px 16px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        padding: "12px 16px",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleLoginSubmit}
                    style={{
                      ...buttonStylePrimary,
                      padding: "14px",
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    Log In
                  </button>
                </div>
              ) : (
                /* Signup Form */
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(15px, 1.5vw, 20px)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "15px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={signupFirstName}
                        onChange={(e) => setSignupFirstName(e.target.value)}
                        placeholder="Juan"
                        style={{
                          ...inputStyle,
                          width: "100%",
                          padding: "12px 16px",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={signupMiddleName}
                        onChange={(e) => setSignupMiddleName(e.target.value)}
                        placeholder="Santos"
                        style={{
                          ...inputStyle,
                          width: "100%",
                          padding: "12px 16px",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                      placeholder="Dela Cruz"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        padding: "12px 16px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                      Birthday *
                    </label>
                    <input
                      type="date"
                      value={signupBirthday}
                      onChange={(e) => setSignupBirthday(e.target.value)}
                      style={{
                        ...inputStyle,
                        width: "100%",
                        padding: "12px 16px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="juan.delacruz@email.com"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        padding: "12px 16px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={signupContactNumber}
                      onChange={(e) => setSignupContactNumber(e.target.value)}
                      placeholder="09123456789"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        padding: "12px 16px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                      Password *
                    </label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        padding: "12px 16px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3436" }}>
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        padding: "12px 16px",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSignupSubmit}
                    style={{
                      ...buttonStylePrimary,
                      padding: "14px",
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && userAccount?.isLoggedIn && (
        <div
          style={modalOverlayStyle}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "min(600px, 95vw)",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "30px",
                borderRadius: "16px 16px 0 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "10px" }}>👤</div>
              <h2
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "clamp(24px, 4vw, 32px)",
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {userAccount.firstName} {userAccount.middleName ? userAccount.middleName + " " : ""}{userAccount.lastName}
              </h2>
              <p style={{ margin: 0, fontSize: "16px", color: "#fff", opacity: 0.9 }}>
                {userAccount.email}
              </p>
            </div>

            <div style={{ padding: "clamp(20px, 3vw, 40px)" }}>
              <div style={{ marginBottom: "clamp(20px, 2.5vw, 30px)" }}>
                <h3
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2d3436",
                  }}
                >
                  Personal Information
                </h3>
                <div style={{ display: "grid", gap: "clamp(15px, 1.5vw, 20px)" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "120px 1fr",
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#636e72" }}>Full Name:</span>
                    <span style={{ color: "#2d3436" }}>
                      {userAccount.firstName} {userAccount.middleName ? userAccount.middleName + " " : ""}{userAccount.lastName}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "120px 1fr",
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#636e72" }}>Birthday:</span>
                    <span style={{ color: "#2d3436" }}>{new Date(userAccount.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "120px 1fr",
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#636e72" }}>Age:</span>
                    <span style={{ color: "#2d3436" }}>{userAccount.age} years old</span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "120px 1fr",
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#636e72" }}>Email:</span>
                    <span style={{ color: "#2d3436" }}>{userAccount.email}</span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "120px 1fr",
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#636e72" }}>Contact:</span>
                    <span style={{ color: "#2d3436" }}>{userAccount.contactNumber}</span>
                  </div>
                </div>
              </div>

              {/* Account Verification Section */}
              <div style={{ marginBottom: "clamp(20px, 2.5vw, 30px)" }}>
                <h3
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2d3436",
                  }}
                >
                  Account Verification
                </h3>
                {userAccount.isVerified ? (
                  <>
                    <div style={{
                      background: "#e8f5e9",
                      border: "2px solid #27ae60",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: userAccount.idImageDeadline ? "16px" : "0"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <div style={{
                          background: "#27ae60",
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          color: "#fff"
                        }}>
                          ✓
                        </div>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 700, color: "#27ae60" }}>
                            Verified Account
                          </h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "#2d3436" }}>
                            You can now purchase vehicles
                          </p>
                        </div>
                      </div>
                      <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #27ae6033" }}>
                        <p style={{ margin: "4px 0", fontSize: "13px", color: "#2d3436" }}>
                          <strong>ID Type:</strong> {userAccount.verifiedIdName || "Government ID"}
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "13px", color: "#2d3436" }}>
                          <strong>Address:</strong> {userAccount.verifiedAddress}
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "13px", color: "#2d3436" }}>
                          <strong>ID Image:</strong> {userAccount.verifiedIdImage ? "✓ Uploaded" : "⏳ Pending"}
                        </p>
                      </div>
                    </div>
                    {userAccount.idImageDeadline && !userAccount.verifiedIdImage && (() => {
                      const deadline = new Date(userAccount.idImageDeadline);
                      const now = new Date();
                      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      const isOverdue = daysLeft < 0;
                      const isUrgent = daysLeft <= 3 && daysLeft >= 0;

                      return (
                        <div style={{
                          background: isOverdue ? "#ffe8e8" : isUrgent ? "#fff3cd" : "#e3f2fd",
                          border: `2px solid ${isOverdue ? "#e74c3c" : isUrgent ? "#ffc107" : "#2196f3"}`,
                          borderRadius: "12px",
                          padding: "16px"
                        }}>
                          <h4 style={{
                            margin: "0 0 8px 0",
                            fontSize: "15px",
                            fontWeight: 700,
                            color: isOverdue ? "#c0392b" : isUrgent ? "#856404" : "#1976d2"
                          }}>
                            {isOverdue ? "⚠️ ID Image Overdue!" : isUrgent ? "⏰ ID Image Upload Urgent" : "📸 ID Image Upload Reminder"}
                          </h4>
                          <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: isOverdue ? "#c0392b" : isUrgent ? "#856404" : "#1976d2", lineHeight: "1.6" }}>
                            {isOverdue
                              ? `Your ID image upload deadline has passed. Please upload as soon as possible to maintain full verification.`
                              : `Please upload your ${userAccount.verifiedIdName} image within ${daysLeft} day${daysLeft === 1 ? '' : 's'} (by ${deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}).`
                            }
                          </p>
                          <button
                            onClick={() => {
                              setShowProfileModal(false);
                              setShowVerificationModal(true);
                            }}
                            style={{
                              ...buttonStylePrimary,
                              width: "100%",
                              padding: "10px",
                              fontSize: "14px",
                              background: isOverdue
                                ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)"
                                : "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)"
                            }}
                          >
                            Upload ID Image Now
                          </button>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div style={{
                    background: "#fff3cd",
                    border: "2px solid #ffc107",
                    borderRadius: "12px",
                    padding: "20px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <div style={{
                        background: "#ffc107",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        color: "#fff"
                      }}>
                        ⚠️
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 700, color: "#856404" }}>
                          Unverified Account
                        </h4>
                        <p style={{ margin: 0, fontSize: "13px", color: "#856404" }}>
                          Verify to purchase vehicles
                        </p>
                      </div>
                    </div>
                    <p style={{ margin: "12px 0 16px 0", fontSize: "14px", color: "#856404", lineHeight: "1.6" }}>
                      To purchase any vehicle, you need to verify your account with:
                    </p>
                    <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px", fontSize: "14px", color: "#856404" }}>
                      <li>1 Valid Government ID</li>
                      <li>Complete Address</li>
                    </ul>
                    <button
                      onClick={() => {
                        setShowProfileModal(false);
                        setShowVerificationModal(true);
                      }}
                      style={{
                        ...buttonStylePrimary,
                        width: "100%",
                        padding: "12px",
                        background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                        fontSize: "15px",
                        fontWeight: 600
                      }}
                    >
                      Verify Account Now
                    </button>
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "clamp(15px, 1.5vw, 20px)",
                  textAlign: "center",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: 700, color: "#2d3436" }}>
                  ⭐ Pick Points Balance
                </h4>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#2d3436", marginBottom: "5px" }}>
                  {userAccount.pickPoints}
                </div>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#2d3436", opacity: 0.8 }}>
                  {(userAccount.pickPoints / 100).toFixed(1)}% discount available
                </p>
                <p style={{ margin: 0, fontSize: "clamp(12px, 1.5vw, 13px)", color: "#2d3436", opacity: 0.7, fontStyle: "italic" }}>
                  Maximum: 500 points (5% discount)
                </p>
              </div>

              <div style={{
                background: "#e8f5e9",
                border: "2px solid #27ae60",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "clamp(20px, 2.5vw, 30px)"
              }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700, color: "#2d3436" }}>
                  🎁 Referral Program
                </h4>
                {(() => {
                  const currentMonth = new Date().toISOString().substring(0, 7);
                  const referralCount = userAccount.referralMonth === currentMonth ? (userAccount.referralCount || 0) : 0;
                  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                  return (
                    <>
                      <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#2d3436" }}>
                        <strong>Referrals this month ({monthName}):</strong> {referralCount} / 3
                      </p>
                      <div style={{
                        background: "#fff",
                        borderRadius: "8px",
                        height: "8px",
                        overflow: "hidden",
                        marginBottom: "8px"
                      }}>
                        <div style={{
                          background: referralCount >= 3 ? "#e74c3c" : "#27ae60",
                          height: "100%",
                          width: `${(referralCount / 3) * 100}%`,
                          transition: "width 0.3s ease"
                        }} />
                      </div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72" }}>
                        Earn 20 points per successful referral (limit: 3 per month)
                      </p>
                      {referralCount >= 3 && (
                        <p style={{ margin: "8px 0 0 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#e74c3c", fontWeight: 600 }}>
                          ⚠️ Monthly referral limit reached. Resets next month.
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>

              <div style={{ textAlign: "center", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => {
                    // Populate edit form with current user data
                    setEditFirstName(userAccount.firstName);
                    setEditMiddleName(userAccount.middleName || "");
                    setEditLastName(userAccount.lastName);
                    setEditBirthday(userAccount.birthday);
                    setEditContactNumber(userAccount.contactNumber);
                    setShowProfileModal(false);
                    setShowEditProfileModal(true);
                  }}
                  style={{
                    ...buttonStylePrimary,
                    flex: 1,
                    padding: "14px",
                    fontSize: "15px",
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    ...buttonStyleSecondary,
                    flex: 1,
                    padding: "14px",
                    fontSize: "15px",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && userAccount?.isLoggedIn && (
        <div
          style={modalOverlayStyle}
          onClick={() => setShowEditProfileModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "min(600px, 95vw)",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: isMobile ? "20px" : "30px",
                borderRadius: "16px 16px 0 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: isMobile ? "48px" : "64px", marginBottom: "10px" }}>✏️</div>
              <h2
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "clamp(24px, 4vw, 32px)",
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Edit Profile
              </h2>
              <p style={{ margin: 0, fontSize: isMobile ? "14px" : "16px", color: "#fff", opacity: 0.9 }}>
                Update your personal information
              </p>
            </div>

            <div style={{ padding: "clamp(20px, 3vw, 40px)" }}>
              <div style={{
                background: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "24px"
              }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#856404", lineHeight: "1.6" }}>
                  ℹ️ <strong>Note:</strong> Your email address cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              <div style={{ display: "grid", gap: "clamp(15px, 1.5vw, 20px)" }}>
                {/* First Name */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #dfe6e9",
                      fontSize: "14px",
                      color: "#2d3436",
                      fontFamily: "inherit"
                    }}
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Middle Name */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                    Middle Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={editMiddleName}
                    onChange={(e) => setEditMiddleName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #dfe6e9",
                      fontSize: "14px",
                      color: "#2d3436",
                      fontFamily: "inherit"
                    }}
                    placeholder="Enter your middle name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #dfe6e9",
                      fontSize: "14px",
                      color: "#2d3436",
                      fontFamily: "inherit"
                    }}
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                    Email Address (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    value={userAccount.email}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #dfe6e9",
                      fontSize: "14px",
                      color: "#636e72",
                      fontFamily: "inherit",
                      background: "#f8f9fa",
                      cursor: "not-allowed"
                    }}
                  />
                </div>

                {/* Birthday */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                    Birthday *
                  </label>
                  <input
                    type="date"
                    value={editBirthday}
                    onChange={(e) => setEditBirthday(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #dfe6e9",
                      fontSize: "14px",
                      color: "#2d3436",
                      fontFamily: "inherit"
                    }}
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={editContactNumber}
                    onChange={(e) => setEditContactNumber(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #dfe6e9",
                      fontSize: "14px",
                      color: "#2d3436",
                      fontFamily: "inherit"
                    }}
                    placeholder="e.g., 09123456789"
                  />
                  <p style={{ margin: "6px 0 0 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontStyle: "italic" }}>
                    Format: 09XXXXXXXXX or +639XXXXXXXXX
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "30px", display: "flex", gap: "12px" }}>
                <button
                  onClick={() => {
                    setShowEditProfileModal(false);
                    setShowProfileModal(true);
                  }}
                  style={{
                    ...buttonStyleSecondary,
                    flex: 1,
                    padding: "14px",
                    fontSize: "15px",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Validation
                    if (!editFirstName || !editLastName || !editBirthday || !editContactNumber) {
                      toast.error("Please fill in all required fields");
                      return;
                    }

                    // Phone validation (Philippine format)
                    const phoneRegex = /^(09|\+639)\d{9}$/;
                    if (!phoneRegex.test(editContactNumber)) {
                      toast.error("Please enter a valid Philippine contact number (e.g., 09123456789)");
                      return;
                    }

                    // Calculate new age
                    const newAge = calculateAge(editBirthday);

                    // Update user account
                    const updatedAccount = {
                      ...userAccount,
                      firstName: editFirstName,
                      middleName: editMiddleName || undefined,
                      lastName: editLastName,
                      birthday: editBirthday,
                      age: newAge,
                      contactNumber: editContactNumber,
                    };

                    setUserAccount(updatedAccount);
                    saveUser(updatedAccount);
                    saveCurrentSession(updatedAccount);

                    setShowEditProfileModal(false);
                    setShowProfileModal(true);
                    toast.success("Profile updated successfully!");
                  }}
                  style={{
                    ...buttonStylePrimary,
                    flex: 1,
                    padding: "14px",
                    fontSize: "15px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && userAccount?.isLoggedIn && (
        <div
          style={modalOverlayStyle}
          onClick={() => setShowVerificationModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "min(600px, 95vw)",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                padding: "30px",
                borderRadius: "16px 16px 0 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "10px" }}>🛡️</div>
              <h2
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "clamp(24px, 4vw, 32px)",
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Verify Your Account
              </h2>
              <p style={{ margin: 0, fontSize: "16px", color: "#fff", opacity: 0.9 }}>
                Required to purchase vehicles
              </p>
            </div>

            <div style={{ padding: "clamp(20px, 3vw, 40px)" }}>
              {userAccount.idImageDeadline && !userAccount.verifiedIdImage && (() => {
                const deadline = new Date(userAccount.idImageDeadline);
                const now = new Date();
                const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysLeft < 0;

                return (
                  <div style={{
                    background: isOverdue ? "#ffe8e8" : "#fff3cd",
                    border: `2px solid ${isOverdue ? "#e74c3c" : "#ffc107"}`,
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{
                      margin: "0 0 8px 0",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: isOverdue ? "#c0392b" : "#856404"
                    }}>
                      {isOverdue ? "⚠️ Upload Required" : "⏰ Upload Reminder"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13px", color: isOverdue ? "#c0392b" : "#856404", lineHeight: "1.6" }}>
                      {isOverdue
                        ? "Your 15-day deadline has passed. Please upload your ID image now."
                        : `You have ${daysLeft} day${daysLeft === 1 ? '' : 's'} left to upload your ID image.`
                      }
                    </p>
                  </div>
                );
              })()}
              <div style={{
                background: "#e3f2fd",
                border: "1px solid #2196f3",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "clamp(20px, 2.5vw, 30px)"
              }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "#1976d2" }}>
                  ℹ️ Why do we need this?
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#1976d2", lineHeight: "1.6" }}>
                  For security and to prevent fraud, we require all users to verify their identity before making a purchase. Your information is encrypted and secure.
                </p>
              </div>

              <div style={{ marginBottom: "clamp(20px, 2.5vw, 30px)" }}>
                <h3
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#2d3436",
                  }}
                >
                  Required Documents
                </h3>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                    Government ID Type *
                  </label>
                  <select
                    value={verificationIdName}
                    onChange={(e) => setVerificationIdName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #dfe6e9",
                      fontSize: "14px",
                      color: "#2d3436",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <option value="">Select ID Type</option>
                    <option value="National ID">National ID (PhilSys)</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="Passport">Passport</option>
                    <option value="SSS ID">SSS ID</option>
                    <option value="UMID">UMID</option>
                    <option value="Voter's ID">Voter's ID</option>
                    <option value="PRC ID">PRC ID</option>
                    <option value="Postal ID">Postal ID</option>
                  </select>
                  <p style={{ margin: "6px 0 0 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontStyle: "italic" }}>
                    📄 Note: You'll need to show this ID at the dealership when purchasing
                  </p>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                    Complete Address *
                  </label>
                  <textarea
                    value={verificationAddress}
                    onChange={(e) => setVerificationAddress(e.target.value)}
                    placeholder="Enter your complete address (House/Unit No., Street, Barangay, City, Province, ZIP Code)"
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #dfe6e9",
                      fontSize: "14px",
                      color: "#2d3436",
                      fontFamily: "inherit",
                      resize: "vertical"
                    }}
                  />
                  <p style={{ margin: "6px 0 0 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontStyle: "italic" }}>
                    📍 Example: 123 Main St., Brgy. San Antonio, Makati City, Metro Manila 1200
                  </p>
                </div>

                {verificationIdName && (
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                      Upload ID Image (Optional - Can skip for now)
                    </label>
                    <div style={{
                      border: "2px dashed #dfe6e9",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      background: "#f8f9fa"
                    }}>
                      {verificationIdImage ? (
                        <div>
                          <img
                            src={verificationIdImage}
                            alt="ID Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              borderRadius: "8px",
                              marginBottom: "12px"
                            }}
                          />
                          <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#27ae60", fontWeight: 600 }}>
                            ✓ {idImageFileName}
                          </p>
                          <button
                            onClick={() => {
                              setVerificationIdImage(null);
                              setIdImageFileName("");
                            }}
                            style={{
                              ...buttonStyleSecondary,
                              padding: "8px 16px",
                              fontSize: "13px"
                            }}
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📸</div>
                          <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#2d3436" }}>
                            Upload a clear photo of your {verificationIdName}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error("Image size must be less than 5MB");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setVerificationIdImage(reader.result as string);
                                  setIdImageFileName(file.name);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{ display: "none" }}
                            id="id-upload"
                          />
                          <label
                            htmlFor="id-upload"
                            style={{
                              ...buttonStylePrimary,
                              display: "inline-block",
                              padding: "10px 24px",
                              fontSize: "14px",
                              cursor: "pointer"
                            }}
                          >
                            Choose Image
                          </label>
                          <p style={{ margin: "12px 0 0 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72" }}>
                            Max file size: 5MB • Formats: JPG, PNG, PDF
                          </p>
                        </>
                      )}
                    </div>
                    <p style={{ margin: "8px 0 0 0", fontSize: "clamp(12px, 1.5vw, 13px)", color: "#636e72", fontStyle: "italic" }}>
                      💡 You can skip uploading for now, but you'll need to upload within 15 days to maintain verification.
                    </p>
                  </div>
                )}
              </div>

              <div style={{
                background: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px"
              }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#856404", lineHeight: "1.6" }}>
                  <strong>⚠️ Important:</strong> Make sure your information matches your government ID. You will be required to present your ID at the dealership when completing your purchase.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => {
                      setShowVerificationModal(false);
                      setVerificationIdName("");
                      setVerificationAddress("");
                      setVerificationIdImage(null);
                      setIdImageFileName("");
                    }}
                    style={{
                      ...buttonStyleSecondary,
                      flex: 1,
                      padding: "14px",
                      fontSize: "15px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!verificationIdName) {
                        toast.error("Please select your ID type");
                        return;
                      }
                      if (!verificationAddress || verificationAddress.length < 20) {
                        toast.error("Please enter your complete address (minimum 20 characters)");
                        return;
                      }

                      if (!verificationIdImage) {
                        toast.error("Please upload your ID image or click 'Skip for Now' below");
                        return;
                      }

                      // Update user account with verification and image
                      const updatedAccount = {
                        ...userAccount,
                        isVerified: true,
                        verifiedIdName: verificationIdName,
                        verifiedAddress: verificationAddress,
                        verifiedIdImage: verificationIdImage,
                        idImageDeadline: undefined
                      };

                      setUserAccount(updatedAccount);
                      saveUser(updatedAccount);
                      saveCurrentSession(updatedAccount);

                      setShowVerificationModal(false);
                      setVerificationIdName("");
                      setVerificationAddress("");
                      setVerificationIdImage(null);
                      setIdImageFileName("");
                      toast.success("Account verified successfully with ID image! You can now purchase vehicles.");
                    }}
                    style={{
                      ...buttonStylePrimary,
                      flex: 1,
                      padding: "14px",
                      fontSize: "15px",
                      background: verificationIdImage
                        ? "linear-gradient(135deg, #27ae60 0%, #229954 100%)"
                        : "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)",
                      cursor: verificationIdImage ? "pointer" : "not-allowed",
                      opacity: verificationIdImage ? 1 : 0.6
                    }}
                  >
                    Verify with ID Image
                  </button>
                </div>
                {verificationIdName && (
                  <button
                    onClick={() => {
                      if (!verificationIdName) {
                        toast.error("Please select your ID type");
                        return;
                      }
                      if (!verificationAddress || verificationAddress.length < 20) {
                        toast.error("Please enter your complete address (minimum 20 characters)");
                        return;
                      }

                      // Calculate deadline (15 days from now)
                      const deadline = new Date();
                      deadline.setDate(deadline.getDate() + 15);

                      // Update user account with verification but no image yet
                      const updatedAccount = {
                        ...userAccount,
                        isVerified: true,
                        verifiedIdName: verificationIdName,
                        verifiedAddress: verificationAddress,
                        verifiedIdImage: undefined,
                        idImageDeadline: deadline.toISOString()
                      };

                      setUserAccount(updatedAccount);
                      saveUser(updatedAccount);
                      saveCurrentSession(updatedAccount);

                      setShowVerificationModal(false);
                      setVerificationIdName("");
                      setVerificationAddress("");
                      setVerificationIdImage(null);
                      setIdImageFileName("");

                      const deadlineDate = deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      toast.success(`Account verified! Please upload your ID image within 15 days (by ${deadlineDate}).`);
                    }}
                    style={{
                      ...buttonStyleSecondary,
                      width: "100%",
                      padding: "14px",
                      fontSize: "15px",
                      background: "#fff3cd",
                      color: "#856404",
                      border: "2px solid #ffc107",
                      fontWeight: 600
                    }}
                  >
                    Skip Image Upload (Upload within 15 days)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && compareVehicles.length > 0 && (
        <div
          style={modalOverlayStyle}
          onClick={() => setShowComparison(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: isMobile ? "95%" : "1100px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ padding: "clamp(20px, 3vw, 40px)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#2d3436",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  VEHICLE COMPARISON
                </h2>
                <button
                  onClick={() => {
                    setCompareVehicles([]);
                    setShowComparison(false);
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Clear All
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: compareVehicles.length === 2 ? "1fr 1fr" : "1fr",
                  gap: "clamp(16px, 2vw, 24px)",
                }}
              >
                {compareVehicles.map((vehicle) => {
                  const { finalPrice, discount, discountPercent } = calculateDiscountedPrice(vehicle.price);

                  return (
                    <div
                      key={vehicle.id}
                      style={{
                        border: "2px solid #e1e8ed",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      {/* Vehicle Header */}
                      <div
                        style={{
                          background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
                          padding: "20px",
                          color: "#fff",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                margin: "0 0 8px 0",
                                fontSize: "20px",
                                fontWeight: 700,
                              }}
                            >
                              {vehicle.name}
                            </h3>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                opacity: 0.9,
                              }}
                            >
                              {vehicle.brand} • {vehicle.type}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCompare(vehicle.id)}
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              border: "none",
                              color: "#fff",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Vehicle Image */}
                      <div
                        style={{
                          padding: "20px",
                          background: "#f8f9fa",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          style={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {/* Specifications */}
                      <div style={{ padding: "24px" }}>
                        {/* Price */}
                        <div
                          style={{
                            marginBottom: "clamp(15px, 1.5vw, 20px)",
                            paddingBottom: "20px",
                            borderBottom: "2px solid #e1e8ed",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 8px 0",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#636e72",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Price
                          </p>
                          {userAccount && userAccount.isLoggedIn && discountPercent > 0 ? (
                            <div>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "24px",
                                  fontWeight: 700,
                                  color: "#27ae60",
                                }}
                              >
                                ₱{finalPrice.toLocaleString()}
                              </p>
                              <p
                                style={{
                                  margin: "4px 0 0 0",
                                  fontSize: "14px",
                                  color: "#636e72",
                                  textDecoration: "line-through",
                                }}
                              >
                                ₱{vehicle.price.toLocaleString()}
                              </p>
                              <p
                                style={{
                                  margin: "4px 0 0 0",
                                  fontSize: "clamp(12px, 1.5vw, 13px)",
                                  color: "#27ae60",
                                  fontWeight: 600,
                                }}
                              >
                                {discountPercent.toFixed(1)}% OFF (₱{discount.toLocaleString()} saved)
                              </p>
                            </div>
                          ) : (
                            <p
                              style={{
                                margin: 0,
                                fontSize: "24px",
                                fontWeight: 700,
                                color: "#2d3436",
                              }}
                            >
                              ₱{vehicle.price.toLocaleString()}
                            </p>
                          )}
                        </div>

                        {/* Engine Type */}
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#636e72",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Engine Type
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              color: "#2d3436",
                              fontWeight: 600,
                            }}
                          >
                            {vehicle.engineType}
                          </p>
                        </div>

                        {/* Displacement */}
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#636e72",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Displacement
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              color: "#2d3436",
                              fontWeight: 600,
                            }}
                          >
                            {vehicle.displacement}
                          </p>
                        </div>

                        {/* Horsepower */}
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#636e72",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Horsepower
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              color: "#2d3436",
                              fontWeight: 600,
                            }}
                          >
                            {vehicle.horsepower}
                          </p>
                        </div>

                        {/* Dimensions */}
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#636e72",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Dimensions
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              color: "#2d3436",
                              fontWeight: 600,
                            }}
                          >
                            {vehicle.dimensions}
                          </p>
                        </div>

                        {/* Weight */}
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#636e72",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Weight
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              color: "#2d3436",
                              fontWeight: 600,
                            }}
                          >
                            {vehicle.weight}
                          </p>
                        </div>

                        {/* Fuel Efficiency */}
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#636e72",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Fuel Efficiency
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              color: "#2d3436",
                              fontWeight: 600,
                            }}
                          >
                            {vehicle.fuelEfficiency}
                          </p>
                        </div>

                        {/* Physical Specs */}
                        <div
                          style={{
                            marginTop: "20px",
                            paddingTop: "20px",
                            borderTop: "2px solid #e1e8ed",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 8px 0",
                              fontSize: "clamp(12px, 1.5vw, 13px)",
                              color: "#636e72",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            Physical Requirements
                          </p>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "14px",
                              color: "#2d3436",
                            }}
                          >
                            {vehicle.vehicleType === "motorcycle"
                              ? `Seat Height: ${vehicle.seatHeight}mm`
                              : `Capacity: ${vehicle.capacity} passengers`}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: "#2d3436",
                            }}
                          >
                            Max Weight: {vehicle.maxWeight}kg
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison Reasoning - Only shown when comparing 2 vehicles */}
              {compareVehicles.length === 2 && userProfile && (
                <div
                  style={{
                    marginTop: "32px",
                    padding: "28px",
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    borderRadius: "12px",
                    border: "2px solid #dee2e6",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 20px 0",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#2d3436",
                      textAlign: "center",
                    }}
                  >
                    🔍 Comparison Analysis
                  </h3>
                  {(() => {
                    // Get compatibility scores for both vehicles
                    const vehicle1Score = filteredVehicles.find(
                      (v) => v.vehicle.id === compareVehicles[0].id
                    );
                    const vehicle2Score = filteredVehicles.find(
                      (v) => v.vehicle.id === compareVehicles[1].id
                    );

                    if (!vehicle1Score || !vehicle2Score) {
                      return (
                        <p style={{ margin: 0, color: "#636e72", textAlign: "center" }}>
                          Complete your profile to see compatibility analysis
                        </p>
                      );
                    }

                    const v1 = compareVehicles[0];
                    const v2 = compareVehicles[1];
                    const score1 = vehicle1Score.score;
                    const score2 = vehicle2Score.score;

                    // Calculate prices
                    const v1Price = calculateDiscountedPrice(v1.price);
                    const v2Price = calculateDiscountedPrice(v2.price);
                    const priceDiff = Math.abs(v1Price.finalPrice - v2Price.finalPrice);

                    // Determine which vehicle is better
                    const betterVehicle = score1 > score2 ? v1 : v2;
                    const lowerVehicle = score1 > score2 ? v2 : v1;
                    const higherScore = Math.max(score1, score2);
                    const lowerScore = Math.min(score1, score2);
                    const scoreDiff = higherScore - lowerScore;

                    // Generate reasoning bullets
                    const reasoningPoints: string[] = [];

                    // Compatibility comparison
                    if (scoreDiff > 15) {
                      reasoningPoints.push(
                        `${betterVehicle.name} has significantly better compatibility (${higherScore.toFixed(1)}% vs ${lowerScore.toFixed(1)}%) - a ${scoreDiff.toFixed(1)}% difference.`
                      );
                    } else if (scoreDiff > 5) {
                      reasoningPoints.push(
                        `${betterVehicle.name} has moderately better compatibility (${higherScore.toFixed(1)}% vs ${lowerScore.toFixed(1)}%).`
                      );
                    } else {
                      reasoningPoints.push(
                        `Both vehicles have similar compatibility scores (${score1.toFixed(1)}% vs ${score2.toFixed(1)}%) - either would suit you well.`
                      );
                    }

                    // Physical fit reasoning for motorcycles
                    if (v1.vehicleType === "motorcycle" && v2.vehicleType === "motorcycle") {
                      const heightDiff = Math.abs(
                        parseInt(v1.seatHeight || "0") - parseInt(v2.seatHeight || "0")
                      );
                      if (heightDiff > 50) {
                        const lowerSeat = parseInt(v1.seatHeight || "0") < parseInt(v2.seatHeight || "0") ? v1 : v2;
                        const higherSeat = lowerSeat === v1 ? v2 : v1;
                        reasoningPoints.push(
                          `${lowerSeat.name} has a lower seat height (${lowerSeat.seatHeight}mm vs ${higherSeat.seatHeight}mm), making it easier to reach the ground.`
                        );
                      }
                    }

                    // Weight capacity reasoning
                    const weightDiff = Math.abs(
                      parseInt(v1.maxWeight || "0") - parseInt(v2.maxWeight || "0")
                    );
                    if (weightDiff > 50) {
                      const higherCapacity = parseInt(v1.maxWeight || "0") > parseInt(v2.maxWeight || "0") ? v1 : v2;
                      reasoningPoints.push(
                        `${higherCapacity.name} supports more weight (${higherCapacity.maxWeight}kg vs ${higherCapacity === v1 ? v2.maxWeight : v1.maxWeight}kg), providing better load capacity.`
                      );
                    }

                    // Price comparison reasoning
                    if (priceDiff > 50000) {
                      const cheaper = v1Price.finalPrice < v2Price.finalPrice ? v1 : v2;
                      const expensive = cheaper === v1 ? v2 : v1;
                      const cheaperPrice = cheaper === v1 ? v1Price : v2Price;
                      const expensivePrice = expensive === v1 ? v1Price : v2Price;

                      reasoningPoints.push(
                        `${cheaper.name} is significantly more affordable at ₱${cheaperPrice.finalPrice.toLocaleString()} compared to ${expensive.name} at ₱${expensivePrice.finalPrice.toLocaleString()} - saving you ₱${priceDiff.toLocaleString()}.`
                      );
                    } else if (priceDiff > 20000) {
                      const cheaper = v1Price.finalPrice < v2Price.finalPrice ? v1 : v2;
                      const cheaperPrice = cheaper === v1 ? v1Price : v2Price;

                      reasoningPoints.push(
                        `${cheaper.name} offers a price advantage of ₱${priceDiff.toLocaleString()}, currently priced at ₱${cheaperPrice.finalPrice.toLocaleString()}.`
                      );
                    } else {
                      reasoningPoints.push(
                        `Both vehicles are similarly priced (₱${v1Price.finalPrice.toLocaleString()} vs ₱${v2Price.finalPrice.toLocaleString()}), making compatibility the primary deciding factor.`
                      );
                    }

                    // Discount reasoning
                    if (v1Price.discountPercent > 0 || v2Price.discountPercent > 0) {
                      if (v1Price.discountPercent > v2Price.discountPercent + 2) {
                        reasoningPoints.push(
                          `${v1.name} has a better discount (${v1Price.discountPercent.toFixed(1)}% off) compared to ${v2.name} (${v2Price.discountPercent > 0 ? v2Price.discountPercent.toFixed(1) + "% off" : "no discount"}), saving you ₱${v1Price.discount.toLocaleString()}.`
                        );
                      } else if (v2Price.discountPercent > v1Price.discountPercent + 2) {
                        reasoningPoints.push(
                          `${v2.name} has a better discount (${v2Price.discountPercent.toFixed(1)}% off) compared to ${v1.name} (${v1Price.discountPercent > 0 ? v1Price.discountPercent.toFixed(1) + "% off" : "no discount"}), saving you ₱${v2Price.discount.toLocaleString()}.`
                        );
                      } else if (v1Price.discountPercent > 0 && v2Price.discountPercent > 0) {
                        reasoningPoints.push(
                          `Both vehicles have similar discounts available (${v1Price.discountPercent.toFixed(1)}% and ${v2Price.discountPercent.toFixed(1)}% off respectively).`
                        );
                      }
                    }

                    // Performance comparison
                    const parseHP = (hp: string) => parseInt(hp.replace(/[^0-9]/g, "")) || 0;
                    const v1HP = parseHP(v1.horsepower);
                    const v2HP = parseHP(v2.horsepower);
                    const hpDiff = Math.abs(v1HP - v2HP);

                    if (hpDiff > 20) {
                      const moreHP = v1HP > v2HP ? v1 : v2;
                      const higherHP = Math.max(v1HP, v2HP);
                      reasoningPoints.push(
                        `${moreHP.name} offers significantly more power with ${moreHP.horsepower} compared to ${moreHP === v1 ? v2.horsepower : v1.horsepower}, providing better performance.`
                      );
                    }

                    return (
                      <div>
                        {reasoningPoints.map((point, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: "15px",
                              marginBottom: "12px",
                              color: "#2d3436",
                              lineHeight: "1.6",
                              paddingLeft: "24px",
                              position: "relative" as const,
                            }}
                          >
                            <span
                              style={{
                                position: "absolute" as const,
                                left: 0,
                                color: "#4793FF",
                                fontWeight: 700,
                              }}
                            >
                              •
                            </span>
                            {point}
                          </div>
                        ))}
                        <div
                          style={{
                            marginTop: "20px",
                            paddingTop: "20px",
                            borderTop: "2px solid #dee2e6",
                            textAlign: "center",
                            fontSize: "14px",
                            color: "#636e72",
                            fontStyle: "italic",
                          }}
                        >
                          💡 Recommendation: {scoreDiff > 10
                            ? `${betterVehicle.name} is the better match for your profile.`
                            : "Both vehicles are well-suited to your needs - choose based on your budget and preferences."}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {compareVehicles.length < 2 && (
                <div
                  style={{
                    marginTop: "24px",
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "#636e72",
                  }}
                >
                  Add another vehicle to compare side-by-side
                </div>
              )}

              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <button
                  onClick={() => setShowComparison(false)}
                  style={closeButtonStyle}
                >
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

// --- Styles ---
const navLinkStyle = {
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: 500,
  transition: "color 0.3s ease",
  cursor: "pointer",
};

const navButtonStyle = {
  background: "#4793FF",
  color: "#ffffff",
  border: "none",
  padding: "10px 24px",
  borderRadius: "6px",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  border: "2px solid #dfe6e9",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "16px",
  boxSizing: "border-box" as const,
  borderRadius: "8px",
  transition: "all 0.3s ease",
  color: "#2d3436",
};

const buttonStylePrimary = {
  flex: 1,
  padding: "14px",
  background: "linear-gradient(135deg, #4793FF 0%, #357ABD 100%)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
  borderRadius: "8px",
  transition: "all 0.3s ease",
};

const buttonStyleSecondary = {
  flex: 1,
  padding: "14px",
  background: "#fff",
  color: "#2d3436",
  border: "2px solid #dfe6e9",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
  borderRadius: "8px",
  transition: "all 0.3s ease",
};

const storeLinkStyle = {
  textAlign: "center" as const,
  padding: "16px",
  background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
  color: "#2d3436",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: 600,
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(250, 200, 152, 0.3)",
  transition: "all 0.3s ease",
};

const closeButtonStyle = {
  flex: 1,
  padding: "14px",
  background: "#fff",
  color: "#2d3436",
  border: "2px solid #dfe6e9",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  borderRadius: "8px",
  transition: "all 0.3s ease",
};

const modalOverlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "10px",
  backdropFilter: "blur(4px)",
};

const modalContentStyle = {
  background: "#fff",
  borderRadius: "20px",
  maxWidth: "500px",
  width: "100%",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  maxHeight: "90vh",
  overflowY: "auto" as const,
};

const modalHeaderStyle = {
  background: "linear-gradient(135deg, #FAC898 0%, #F5B784 100%)",
  padding: "24px",
  borderRadius: "20px 20px 0 0",
};