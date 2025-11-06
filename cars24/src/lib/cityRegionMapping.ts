/**
 * City to Region mapping utility
 * Helps normalize city names to regions for pricing calculations
 */

export interface CityInfo {
  city: string;
  region: string;
  state: string;
}

// City to region mapping
const CITY_REGION_MAP: Record<string, string> = {
  // Metro cities
  'Mumbai': 'metro',
  'MUMBAI': 'metro',
  'Delhi': 'metro',
  'DELHI': 'metro',
  'Bangalore': 'metro',
  'BANGALORE': 'metro',
  'Bengaluru': 'metro',
  'BENGALURU': 'metro',
  'Hyderabad': 'metro',
  'HYDERABAD': 'metro',
  'NCR': 'metro',
  'New Delhi': 'metro',
  'NEW DELHI': 'metro',
  'Gurgaon': 'metro',
  'GURGAON': 'metro',
  'Gurugram': 'metro',
  'GURUGRAM': 'metro',
  'Noida': 'metro',
  'NOIDA': 'metro',

  // Tier 2 cities
  'Pune': 'tier2',
  'PUNE': 'tier2',
  'Ahmedabad': 'tier2',
  'AHMEDABAD': 'tier2',
  'Jaipur': 'tier2',
  'JAIPUR': 'tier2',
  'Lucknow': 'tier2',
  'LUCKNOW': 'tier2',
  'Chandigarh': 'tier2',
  'CHANDIGARH': 'tier2',
  'Indore': 'tier2',
  'INDORE': 'tier2',
  'Bhopal': 'tier2',
  'BHOPAL': 'tier2',
  'Visakhapatnam': 'tier2',
  'VISAKHAPATNAM': 'tier2',
  'Surat': 'tier2',
  'SURAT': 'tier2',

  // Tier 3 cities
  'Nagpur': 'tier3',
  'NAGPUR': 'tier3',
  'Guwahati': 'tier3',
  'GUWAHATI': 'tier3',
  'Kochi': 'tier3',
  'KOCHI': 'tier3',
  'Cochin': 'tier3',
  'COCHIN': 'tier3',
  'Coimbatore': 'tier3',
  'COIMBATORE': 'tier3',

  // Hilly regions
  'Himachal Pradesh': 'hilly',
  'HIMACHAL PRADESH': 'hilly',
  'Himachal': 'hilly',
  'HIMACHAL': 'hilly',
  'Uttarakhand': 'hilly',
  'UTTARAKHAND': 'hilly',
  'Kashmir': 'hilly',
  'KASHMIR': 'hilly',
  'Shimla': 'hilly',
  'SHIMLA': 'hilly',
  'Darjeeling': 'hilly',
  'DARJEELING': 'hilly',
  'Mussoorie': 'hilly',
  'MUSSOORIE': 'hilly',
  'Manali': 'hilly',
  'MANALI': 'hilly',

  // Coastal regions
  'Goa': 'coastal',
  'GOA': 'coastal',
  'Kerala': 'coastal',
  'KERALA': 'coastal',
  'West Bengal': 'coastal',
  'WEST BENGAL': 'coastal',
  'Odisha': 'coastal',
  'ODISHA': 'coastal',
  'Odia': 'coastal',
  'ODIA': 'coastal',
  'Tamil Nadu': 'coastal',
  'TAMIL NADU': 'coastal',
  'Kanyakumari': 'coastal',
  'KANYAKUMARI': 'coastal',
  'Pondicherry': 'coastal',
  'PONDICHERRY': 'coastal',

  // Default
  'Rural': 'rural',
  'RURAL': 'rural',
};

/**
 * Get region from city name
 * @param city - City name
 * @returns Region string
 */
export const getRegionFromCity = (city: string): string => {
  if (!city) return 'metro'; // default to metro

  // Try exact match first
  if (CITY_REGION_MAP[city]) {
    return CITY_REGION_MAP[city];
  }

  // Try lowercase match
  const lowerCity = city.toLowerCase();
  for (const [key, region] of Object.entries(CITY_REGION_MAP)) {
    if (key.toLowerCase() === lowerCity) {
      return region;
    }
  }

  // Try partial match (for variations)
  for (const [key, region] of Object.entries(CITY_REGION_MAP)) {
    if (lowerCity.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCity)) {
      return region;
    }
  }

  // Default to metro
  return 'metro';
};

/**
 * Normalize city name
 * @param city - City name
 * @returns Normalized city name
 */
export const normalizeCityName = (city: string): string => {
  if (!city) return '';

  // Handle NCR/Delhi variations
  if (city.toLowerCase() === 'ncr' || city.toLowerCase() === 'delhi ncr') {
    return 'Delhi';
  }

  // Capitalize first letter of each word
  return city
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Validate city for pricing API
 * @param city - City name
 * @returns true if valid, false otherwise
 */
export const isValidCityForPricing = (city: string): boolean => {
  const validCities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Kolkata',
    'Chennai',
    'Pune',
    'Hyderabad',
    'Ahmedabad',
    'Jaipur',
    'Surat',
  ];

  return validCities.some(
    validCity => validCity.toLowerCase() === city.toLowerCase()
  );
};

/**
 * Get all valid cities for pricing
 * @returns Array of valid city names
 */
export const getValidCitiesForPricing = (): string[] => {
  return [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Kolkata',
    'Chennai',
    'Pune',
    'Hyderabad',
    'Ahmedabad',
    'Jaipur',
    'Surat',
  ];
};

/**
 * Get region info from city
 * @param city - City name
 * @returns CityInfo object
 */
export const getCityInfo = (city: string): CityInfo => {
  const normalized = normalizeCityName(city);
  const region = getRegionFromCity(city);

  return {
    city: normalized,
    region,
    state: getStateFromCity(normalized),
  };
};

/**
 * Get state from city name
 * @param city - City name
 * @returns State name
 */
export const getStateFromCity = (city: string): string => {
  const cityStateMap: Record<string, string> = {
    'Mumbai': 'Maharashtra',
    'Delhi': 'Delhi',
    'New Delhi': 'Delhi',
    'Bangalore': 'Karnataka',
    'Bengaluru': 'Karnataka',
    'Kolkata': 'West Bengal',
    'Chennai': 'Tamil Nadu',
    'Pune': 'Maharashtra',
    'Hyderabad': 'Telangana',
    'Ahmedabad': 'Gujarat',
    'Jaipur': 'Rajasthan',
    'Surat': 'Gujarat',
    'Gurgaon': 'Haryana',
    'Gurugram': 'Haryana',
    'Noida': 'Uttar Pradesh',
    'Indore': 'Madhya Pradesh',
    'Bhopal': 'Madhya Pradesh',
  };

  return cityStateMap[city] || 'India';
};

