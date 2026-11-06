// Geographic coordinates and polygons for Telangana State, India (33 Districts)

export interface DistrictMeta {
  id: string;
  name: string;
  lat: number;
  lng: number;
  normX: number; // 0 to 1 in normalized map space
  normY: number; // 0 to 1 in normalized map space
  isMajor: boolean; // Shown as prominent 3D pin in center view
  elevation: number; // meters above sea level
}

// Normalized bounds of Telangana: Lat ~15.8 to 19.9, Lng ~77.2 to 81.3
export const TELANGANA_BOUNDS = {
  minLat: 15.8,
  maxLat: 19.95,
  minLng: 77.15,
  maxLng: 81.45,
};

export function projectToNormalized(lat: number, lng: number): [number, number] {
  const x = (lng - TELANGANA_BOUNDS.minLng) / (TELANGANA_BOUNDS.maxLng - TELANGANA_BOUNDS.minLng);
  // Invert Y so North is top
  const y = 1 - (lat - TELANGANA_BOUNDS.minLat) / (TELANGANA_BOUNDS.maxLat - TELANGANA_BOUNDS.minLat);
  return [x, y];
}

// 33 Districts of Telangana with accurate coordinates
export const DISTRICTS_LIST: DistrictMeta[] = [
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867, normX: 0.31, normY: 0.62, isMajor: true, elevation: 542 },
  { id: 'adilabad', name: 'Adilabad', lat: 19.6641, lng: 78.5320, normX: 0.32, normY: 0.08, isMajor: true, elevation: 264 },
  { id: 'nizamabad', name: 'Nizamabad', lat: 18.6725, lng: 78.0941, normX: 0.22, normY: 0.31, isMajor: true, elevation: 395 },
  { id: 'karimnagar', name: 'Karimnagar', lat: 18.4386, lng: 79.1288, normX: 0.46, normY: 0.36, isMajor: true, elevation: 265 },
  { id: 'sangareddy', name: 'Sangareddy', lat: 17.6190, lng: 78.0816, normX: 0.21, normY: 0.56, isMajor: true, elevation: 496 },
  { id: 'warangal', name: 'Warangal', lat: 17.9689, lng: 79.5941, normX: 0.57, normY: 0.48, isMajor: true, elevation: 266 },
  { id: 'khammam', name: 'Khammam', lat: 17.2473, lng: 80.1514, normX: 0.70, normY: 0.65, isMajor: true, elevation: 107 },
  { id: 'mahabubnagar', name: 'Mahabubnagar', lat: 16.7488, lng: 77.9845, normX: 0.19, normY: 0.77, isMajor: true, elevation: 498 },
  { id: 'nalgonda', name: 'Nalgonda', lat: 17.0575, lng: 79.2684, normX: 0.49, normY: 0.70, isMajor: true, elevation: 421 },
  
  // Remaining districts
  { id: 'bhadradri', name: 'Bhadradri Kothagudem', lat: 17.5500, lng: 80.6167, normX: 0.81, normY: 0.58, isMajor: false, elevation: 89 },
  { id: 'jagtial', name: 'Jagtial', lat: 18.7900, lng: 78.9100, normX: 0.41, normY: 0.28, isMajor: false, elevation: 264 },
  { id: 'jangaon', name: 'Jangaon', lat: 17.7200, lng: 79.1800, normX: 0.47, normY: 0.54, isMajor: false, elevation: 382 },
  { id: 'jayashankar', name: 'Jayashankar Bhupalpally', lat: 18.4300, lng: 79.8600, normX: 0.63, normY: 0.37, isMajor: false, elevation: 180 },
  { id: 'jogulamba', name: 'Jogulamba Gadwal', lat: 16.2300, lng: 77.8000, normX: 0.15, normY: 0.90, isMajor: false, elevation: 325 },
  { id: 'kamareddy', name: 'Kamareddy', lat: 18.3200, lng: 78.3400, normX: 0.28, normY: 0.39, isMajor: false, elevation: 495 },
  { id: 'komaram_bheem', name: 'Komaram Bheem Asifabad', lat: 19.3600, lng: 79.2900, normX: 0.50, normY: 0.14, isMajor: false, elevation: 218 },
  { id: 'mahabubabad', name: 'Mahabubabad', lat: 17.6000, lng: 80.0000, normX: 0.66, normY: 0.56, isMajor: false, elevation: 177 },
  { id: 'mancherial', name: 'Mancherial', lat: 18.8700, lng: 79.4600, normX: 0.54, normY: 0.26, isMajor: false, elevation: 154 },
  { id: 'medak', name: 'Medak', lat: 18.0400, lng: 78.2600, normX: 0.26, normY: 0.46, isMajor: false, elevation: 442 },
  { id: 'medchal', name: 'Medchal-Malkajgiri', lat: 17.6300, lng: 78.4800, normX: 0.31, normY: 0.56, isMajor: false, elevation: 560 },
  { id: 'mulugu', name: 'Mulugu', lat: 18.1900, lng: 79.9400, normX: 0.65, normY: 0.42, isMajor: false, elevation: 182 },
  { id: 'nagarkurnool', name: 'Nagarkurnool', lat: 16.4800, lng: 78.3300, normX: 0.27, normY: 0.84, isMajor: false, elevation: 458 },
  { id: 'narayanpet', name: 'Narayanpet', lat: 16.7300, lng: 77.5000, normX: 0.08, normY: 0.78, isMajor: false, elevation: 431 },
  { id: 'nirmal', name: 'Nirmal', lat: 19.0900, lng: 78.3400, normX: 0.28, normY: 0.21, isMajor: false, elevation: 340 },
  { id: 'peddapalli', name: 'Peddapalli', lat: 18.6100, lng: 79.3800, normX: 0.52, normY: 0.32, isMajor: false, elevation: 154 },
  { id: 'rajanna', name: 'Rajanna Sircilla', lat: 18.3800, lng: 78.8300, normX: 0.39, normY: 0.38, isMajor: false, elevation: 320 },
  { id: 'rangareddy', name: 'Rangareddy', lat: 17.2000, lng: 78.4000, normX: 0.29, normY: 0.66, isMajor: false, elevation: 535 },
  { id: 'siddipet', name: 'Siddipet', lat: 18.1000, lng: 78.8500, normX: 0.40, normY: 0.45, isMajor: false, elevation: 475 },
  { id: 'suryapet', name: 'Suryapet', lat: 17.1400, lng: 79.6200, normX: 0.57, normY: 0.68, isMajor: false, elevation: 185 },
  { id: 'vikarabad', name: 'Vikarabad', lat: 17.3300, lng: 77.9000, normX: 0.17, normY: 0.63, isMajor: false, elevation: 620 },
  { id: 'wanaparthy', name: 'Wanaparthy', lat: 16.3600, lng: 78.0600, normX: 0.21, normY: 0.86, isMajor: false, elevation: 360 },
  { id: 'yadadri', name: 'Yadadri Bhuvanagiri', lat: 17.5100, lng: 78.8800, normX: 0.40, normY: 0.59, isMajor: false, elevation: 358 },
  { id: 'hanamkonda', name: 'Hanamkonda', lat: 18.0100, lng: 79.5500, normX: 0.56, normY: 0.47, isMajor: false, elevation: 270 },
];

// Detailed 2D polygon shape representing the boundary of Telangana state for 3D extrusion & SVG rendering
export const TELANGANA_OUTLINE_NORMALIZED: [number, number][] = [
  [0.34, 0.05], // North Adilabad apex
  [0.40, 0.07],
  [0.48, 0.11],
  [0.55, 0.13],
  [0.59, 0.18], // Komaram Bheem border with Maharashtra
  [0.64, 0.24],
  [0.72, 0.31], // Godavari river border
  [0.78, 0.37],
  [0.85, 0.44], // Bhadradri northeast corner
  [0.89, 0.51],
  [0.84, 0.57],
  [0.78, 0.65], // Khammam east
  [0.73, 0.72],
  [0.65, 0.75], // Krishna river confluence
  [0.58, 0.78], // Suryapet / Nalgonda border
  [0.51, 0.81],
  [0.42, 0.85], // Nagarjuna Sagar region
  [0.35, 0.90],
  [0.26, 0.94], // Jogulamba Gadwal south tip
  [0.17, 0.92],
  [0.13, 0.85], // Mahabubnagar / Narayanpet border with Karnataka
  [0.08, 0.78],
  [0.11, 0.70],
  [0.14, 0.63], // Vikarabad west
  [0.16, 0.54], // Sangareddy west
  [0.19, 0.45],
  [0.20, 0.36], // Nizamabad west
  [0.22, 0.28],
  [0.24, 0.19], // Nirmal border
  [0.28, 0.12],
  [0.34, 0.05], // Back to start
];

// Major Rivers flowing through Telangana (Godavari, Krishna, Musi, Manjira)
export const TELANGANA_RIVERS = [
  {
    name: 'Godavari River',
    points: [
      [0.22, 0.25],
      [0.32, 0.22],
      [0.43, 0.26],
      [0.55, 0.29],
      [0.67, 0.35],
      [0.78, 0.45],
      [0.86, 0.52]
    ]
  },
  {
    name: 'Krishna River',
    points: [
      [0.12, 0.88],
      [0.20, 0.90],
      [0.32, 0.88],
      [0.44, 0.82],
      [0.55, 0.77],
      [0.68, 0.73]
    ]
  },
  {
    name: 'Musi River',
    points: [
      [0.19, 0.62],
      [0.31, 0.63],
      [0.42, 0.65],
      [0.52, 0.69]
    ]
  }
];
