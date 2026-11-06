export interface AiKnowledgeResponse {
  query: string;
  response: string;
  keyInsights: string[];
  actionItems: string[];
}

export const DEFAULT_AI_QA = {
  question: 'Why is rainfall decreasing in Telengana?',
  answer: 'Rainfall is decreasing mainly due to rising temperatures, erratic monsoon patterns, land use changes and reduced vegetation cover. Models predict a further 12% decrease by 2030 if current trends continue.',
};

export const PRESET_AI_QUERIES = [
  'Why is rainfall decreasing in Telengana?',
  'Why is Hyderabad hotter than surrounding districts?',
  'What are the 2030 heatwave projections for Mahabubnagar?',
  'How will 3°C warming impact Telangana agriculture?',
  'Which districts have the highest flood risk during monsoon?',
  'What adaptation strategies can restore groundwater in Nalgonda?',
];

export function getAiResponseForDistrict(districtName: string, query?: string): string {
  const q = (query || '').toLowerCase();
  
  if (q.includes('why is hyderabad hotter') || districtName === 'Hyderabad') {
    return 'Hyderabad experiences higher temperatures primarily due to the Urban Heat Island (UHI) effect—dense concrete infrastructure, high vehicular and HVAC emissions, and reduced tree canopy cover elevate surface temperatures by +2.5°C to +4.0°C compared to rural surroundings.';
  }
  
  if (q.includes('rainfall decreasing') || q.includes('rainfall in telengana')) {
    return 'Rainfall is decreasing mainly due to rising temperatures, erratic monsoon patterns, land use changes and reduced vegetation cover. Models predict a further 12% decrease by 2030 if current trends continue.';
  }

  if (districtName === 'Adilabad') {
    return 'Adilabad benefits from denser forest cover and proximity to the Godavari basin, maintaining cooler average temperatures (29.1°C), though convective thunderstorm alerts and flash flood risks remain elevated in northern valleys.';
  }

  if (districtName === 'Mahabubnagar' || districtName === 'Nalgonda') {
    return `${districtName} lies in the semi-arid rain-shadow plateau with high land surface temperatures (>39.5°C) and critical water stress. Projected 2030 drought severity indicates a +29% risk increase unless micro-irrigation and lake rejuvenation are accelerated.`;
  }

  if (districtName === 'Warangal') {
    return 'Warangal has moderate thermal stress (31.8°C) but elevated flood vulnerability around urban lake cascades. Enhanced stormwater drainage and wetland buffer restoration are recommended.';
  }

  return `In ${districtName}, current climate indicators show ${query ? 'significant sensitivity to ' + query : 'stable seasonal transitions'}. AI predictive models forecast temperature rises of +1.6°C to +2.0°C by 2030, with high confidence based on ISRO and ERA5 satellite reanalysis.`;
}
