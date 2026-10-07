import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Location presets (Radar sectors)
const LOCATIONS = {
  viewport: {
    icao: 'LFPG',
    name: 'VUE LIBRE',
    subtitle: 'ACQUISITION DYNAMIQUE SUR LES LIMITES D\'ÉCRAN',
    isDynamic: true,
    lat: 48.8566,
    lon: 2.3522,
    zoom: 6
  },
  europe: {
    icao: 'LFPG',
    name: 'ESPACE AÉRIEN EUROPÉEN',
    subtitle: 'SURVEILLANCE DU CONTINENT EUROPÉEN (~3 500 VOLS)',
    isMacro: true,
    lat: 48.5,
    lon: 4.5,
    zoom: 5,
    bbox: { lamin: 35.0, lamax: 58.0, lomin: -12.0, lomax: 25.0 }
  },
  france: {
    icao: 'LFPG',
    name: 'FRANCE MÉTROPOLITAINE',
    subtitle: 'ESPACE AÉRIEN NATIONAL (~1 200 VOLS)',
    isMacro: true,
    lat: 46.5,
    lon: 2.5,
    zoom: 6,
    bbox: { lamin: 41.5, lamax: 51.5, lomin: -5.5, lomax: 9.5 }
  },
  paris_center: {
    icao: 'LFPG',
    name: 'PARIS (CENTRE)',
    subtitle: 'SURVEILLANCE AÉRIENNE ÎLE-DE-FRANCE',
    lat: 48.8566,
    lon: 2.3522,
    zoom: 10,
    bbox: { lamin: 48.6, lamax: 49.1, lomin: 2.0, lomax: 2.7 }
  },
  cdg: {
    icao: 'LFPG',
    name: 'PARIS-CHARLES DE GAULLE (CDG)',
    subtitle: 'HUB INTERNATIONAL PRINCIPAL',
    lat: 49.0097,
    lon: 2.5479,
    zoom: 11,
    bbox: { lamin: 48.8, lamax: 49.2, lomin: 2.3, lomax: 2.8 }
  },
  ory: {
    icao: 'LFPO',
    name: 'PARIS-ORLY (ORY)',
    subtitle: 'AÉROPORT DU SUD PARISIEN',
    lat: 48.7262,
    lon: 2.3652,
    zoom: 11,
    bbox: { lamin: 48.55, lamax: 48.9, lomin: 2.15, lomax: 2.6 }
  },
  nce: {
    icao: 'LFMN',
    name: 'NICE CÔTE D\'AZUR (NCE)',
    subtitle: 'BAIE DES ANGES & APPROCHE MER',
    lat: 43.6584,
    lon: 7.2159,
    zoom: 11,
    bbox: { lamin: 43.45, lamax: 43.85, lomin: 6.95, lomax: 7.45 }
  },
  lys: {
    icao: 'LFLL',
    name: 'LYON SAINT-EXUPÉRY (LYS)',
    subtitle: 'HUB RHÔNE-ALPES',
    lat: 45.7256,
    lon: 5.0811,
    zoom: 11,
    bbox: { lamin: 45.55, lamax: 45.9, lomin: 4.85, lomax: 5.3 }
  },
  mrs: {
    icao: 'LFML',
    name: 'MARSEILLE PROVENCE (MRS)',
    subtitle: 'ÉTANG DE BERRE & MÉDITERRANÉE',
    lat: 43.4393,
    lon: 5.2214,
    zoom: 11,
    bbox: { lamin: 43.25, lamax: 43.65, lomin: 5.0, lomax: 5.45 }
  },
  tls: {
    icao: 'LFBO',
    name: 'TOULOUSE-BLAGNAC (TLS)',
    subtitle: 'CAPITALE DE L\'AÉRONAUTIQUE (AIRBUS)',
    lat: 43.6291,
    lon: 1.3638,
    zoom: 11,
    bbox: { lamin: 43.45, lamax: 43.8, lomin: 1.15, lomax: 1.55 }
  },
  lhr: {
    icao: 'EGLL',
    name: 'LONDRES HEATHROW (LHR)',
    subtitle: 'HUB MAJEUR DU ROYAUME-UNI',
    lat: 51.4700,
    lon: -0.4543,
    zoom: 11,
    bbox: { lamin: 51.3, lamax: 51.65, lomin: -0.7, lomax: -0.2 }
  },
  jfk: {
    icao: 'KJFK',
    name: 'NEW YORK JFK',
    subtitle: 'ESPACE AÉRIEN NEW-YORKAIS',
    lat: 40.6413,
    lon: -73.7781,
    zoom: 11,
    bbox: { lamin: 40.45, lamax: 40.85, lomin: -74.05, lomax: -73.5 }
  },
  dxb: {
    icao: 'OMDB',
    name: 'DUBAÏ INTERNATIONAL (DXB)',
    subtitle: 'CARREFOUR MONDIAL DU MOYEN-ORIENT',
    lat: 25.2532,
    lon: 55.3657,
    zoom: 11,
    bbox: { lamin: 25.05, lamax: 25.45, lomin: 55.15, lomax: 55.6 }
  },
  hnd: {
    icao: 'RJTT',
    name: 'TOKYO HANEDA (HND)',
    subtitle: 'BAIE DE TOKYO & MEGALOPOLE JAPONAISE',
    lat: 35.5494,
    lon: 139.7798,
    zoom: 11,
    bbox: { lamin: 35.35, lamax: 35.75, lomin: 139.55, lomax: 140.0 }
  },
  icn: {
    icao: 'RKSI',
    name: 'SÉOUL INCHEON (ICN)',
    subtitle: 'ESPACE AÉRIEN SUD-CORÉEN & CAPITALE SÉOUL',
    lat: 37.5665,
    lon: 126.9780,
    zoom: 11,
    bbox: { lamin: 37.25, lamax: 37.85, lomin: 126.35, lomax: 127.35 }
  }
};

// Global airport directory (Dual-keyed by IATA and ICAO codes)
const AIRPORTS = {
  // France
  CDG: { code: 'CDG', icao: 'LFPG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lon: 2.5479 },
  LFPG: { code: 'CDG', icao: 'LFPG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lon: 2.5479 },
  ORY: { code: 'ORY', icao: 'LFPO', name: 'Paris-Orly', city: 'Paris', country: 'France', lat: 48.7262, lon: 2.3652 },
  LFPO: { code: 'ORY', icao: 'LFPO', name: 'Paris-Orly', city: 'Paris', country: 'France', lat: 48.7262, lon: 2.3652 },
  NCE: { code: 'NCE', icao: 'LFMN', name: 'Côte d\'Azur', city: 'Nice', country: 'France', lat: 43.6584, lon: 7.2159 },
  LFMN: { code: 'NCE', icao: 'LFMN', name: 'Côte d\'Azur', city: 'Nice', country: 'France', lat: 43.6584, lon: 7.2159 },
  LYS: { code: 'LYS', icao: 'LFLL', name: 'Saint-Exupéry', city: 'Lyon', country: 'France', lat: 45.7256, lon: 5.0811 },
  LFLL: { code: 'LYS', icao: 'LFLL', name: 'Saint-Exupéry', city: 'Lyon', country: 'France', lat: 45.7256, lon: 5.0811 },
  MRS: { code: 'MRS', icao: 'LFML', name: 'Provence', city: 'Marseille', country: 'France', lat: 43.4393, lon: 5.2214 },
  LFML: { code: 'MRS', icao: 'LFML', name: 'Provence', city: 'Marseille', country: 'France', lat: 43.4393, lon: 5.2214 },
  TLS: { code: 'TLS', icao: 'LFBO', name: 'Blagnac', city: 'Toulouse', country: 'France', lat: 43.6291, lon: 1.3638 },
  LFBO: { code: 'TLS', icao: 'LFBO', name: 'Blagnac', city: 'Toulouse', country: 'France', lat: 43.6291, lon: 1.3638 },
  BOD: { code: 'BOD', icao: 'LFBD', name: 'Mérignac', city: 'Bordeaux', country: 'France', lat: 44.8283, lon: -0.7156 },
  LFBD: { code: 'BOD', icao: 'LFBD', name: 'Mérignac', city: 'Bordeaux', country: 'France', lat: 44.8283, lon: -0.7156 },
  NTE: { code: 'NTE', icao: 'LFRS', name: 'Atlantique', city: 'Nantes', country: 'France', lat: 47.1532, lon: -1.6107 },
  LFRS: { code: 'NTE', icao: 'LFRS', name: 'Atlantique', city: 'Nantes', country: 'France', lat: 47.1532, lon: -1.6107 },
  SXB: { code: 'SXB', icao: 'LFST', name: 'Entzheim', city: 'Strasbourg', country: 'France', lat: 48.5383, lon: 7.6282 },
  LFST: { code: 'SXB', icao: 'LFST', name: 'Entzheim', city: 'Strasbourg', country: 'France', lat: 48.5383, lon: 7.6282 },

  // UK & Ireland
  LHR: { code: 'LHR', icao: 'EGLL', name: 'Heathrow', city: 'Londres', country: 'Royaume-Uni', lat: 51.4700, lon: -0.4543 },
  EGLL: { code: 'LHR', icao: 'EGLL', name: 'Heathrow', city: 'Londres', country: 'Royaume-Uni', lat: 51.4700, lon: -0.4543 },
  LGW: { code: 'LGW', icao: 'EGKK', name: 'Gatwick', city: 'Londres', country: 'Royaume-Uni', lat: 51.1537, lon: -0.1821 },
  EGKK: { code: 'LGW', icao: 'EGKK', name: 'Gatwick', city: 'Londres', country: 'Royaume-Uni', lat: 51.1537, lon: -0.1821 },
  DUB: { code: 'DUB', icao: 'EIDW', name: 'Dublin', city: 'Dublin', country: 'Irlande', lat: 53.4264, lon: -6.2499 },
  EIDW: { code: 'DUB', icao: 'EIDW', name: 'Dublin', city: 'Dublin', country: 'Irlande', lat: 53.4264, lon: -6.2499 },
  MAN: { code: 'MAN', icao: 'EGCC', name: 'Manchester', city: 'Manchester', country: 'Royaume-Uni', lat: 53.3537, lon: -2.2750 },
  EGCC: { code: 'MAN', icao: 'EGCC', name: 'Manchester', city: 'Manchester', country: 'Royaume-Uni', lat: 53.3537, lon: -2.2750 },

  // Europe
  AMS: { code: 'AMS', icao: 'EHAM', name: 'Schiphol', city: 'Amsterdam', country: 'Pays-Bas', lat: 52.3105, lon: 4.7683 },
  EHAM: { code: 'AMS', icao: 'EHAM', name: 'Schiphol', city: 'Amsterdam', country: 'Pays-Bas', lat: 52.3105, lon: 4.7683 },
  FRA: { code: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', city: 'Francfort', country: 'Allemagne', lat: 50.0379, lon: 8.5622 },
  EDDF: { code: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', city: 'Francfort', country: 'Allemagne', lat: 50.0379, lon: 8.5622 },
  MUC: { code: 'MUC', icao: 'EDDM', name: 'Munich Airport', city: 'Munich', country: 'Allemagne', lat: 48.3537, lon: 11.7860 },
  EDDM: { code: 'MUC', icao: 'EDDM', name: 'Munich Airport', city: 'Munich', country: 'Allemagne', lat: 48.3537, lon: 11.7860 },
  BER: { code: 'BER', icao: 'EDDB', name: 'Brandenburg', city: 'Berlin', country: 'Allemagne', lat: 52.3667, lon: 13.5033 },
  EDDB: { code: 'BER', icao: 'EDDB', name: 'Brandenburg', city: 'Berlin', country: 'Allemagne', lat: 52.3667, lon: 13.5033 },
  MAD: { code: 'MAD', icao: 'LEMD', name: 'Barajas', city: 'Madrid', country: 'Espagne', lat: 40.4839, lon: -3.5680 },
  LEMD: { code: 'MAD', icao: 'LEMD', name: 'Barajas', city: 'Madrid', country: 'Espagne', lat: 40.4839, lon: -3.5680 },
  BCN: { code: 'BCN', icao: 'LEBL', name: 'El Prat', city: 'Barcelone', country: 'Espagne', lat: 41.2974, lon: 2.0833 },
  LEBL: { code: 'BCN', icao: 'LEBL', name: 'El Prat', city: 'Barcelone', country: 'Espagne', lat: 41.2974, lon: 2.0833 },
  FCO: { code: 'FCO', icao: 'LIRF', name: 'Fiumicino', city: 'Rome', country: 'Italie', lat: 41.8003, lon: 12.2389 },
  LIRF: { code: 'FCO', icao: 'LIRF', name: 'Fiumicino', city: 'Rome', country: 'Italie', lat: 41.8003, lon: 12.2389 },
  MXP: { code: 'MXP', icao: 'LIMC', name: 'Malpensa', city: 'Milan', country: 'Italie', lat: 45.6301, lon: 8.7255 },
  LIMC: { code: 'MXP', icao: 'LIMC', name: 'Malpensa', city: 'Milan', country: 'Italie', lat: 45.6301, lon: 8.7255 },
  ZRH: { code: 'ZRH', icao: 'LSZH', name: 'Zurich Airport', city: 'Zurich', country: 'Suisse', lat: 47.4582, lon: 8.5555 },
  LSZH: { code: 'ZRH', icao: 'LSZH', name: 'Zurich Airport', city: 'Zurich', country: 'Suisse', lat: 47.4582, lon: 8.5555 },
  GVA: { code: 'GVA', icao: 'LSGG', name: 'Cointrin', city: 'Genève', country: 'Suisse', lat: 46.2370, lon: 6.1092 },
  LSGG: { code: 'GVA', icao: 'LSGG', name: 'Cointrin', city: 'Genève', country: 'Suisse', lat: 46.2370, lon: 6.1092 },
  BRU: { code: 'BRU', icao: 'EBBR', name: 'Brussels Airport', city: 'Bruxelles', country: 'Belgique', lat: 50.9010, lon: 4.4844 },
  EBBR: { code: 'BRU', icao: 'EBBR', name: 'Brussels Airport', city: 'Bruxelles', country: 'Belgique', lat: 50.9010, lon: 4.4844 },
  VIE: { code: 'VIE', icao: 'LOWW', name: 'Vienna Intl', city: 'Vienne', country: 'Autriche', lat: 48.1103, lon: 16.5697 },
  LOWW: { code: 'VIE', icao: 'LOWW', name: 'Vienna Intl', city: 'Vienne', country: 'Autriche', lat: 48.1103, lon: 16.5697 },
  LIS: { code: 'LIS', icao: 'LPPT', name: 'Humberto Delgado', city: 'Lisbonne', country: 'Portugal', lat: 38.7756, lon: -9.1354 },
  LPPT: { code: 'LIS', icao: 'LPPT', name: 'Humberto Delgado', city: 'Lisbonne', country: 'Portugal', lat: 38.7756, lon: -9.1354 },
  IST: { code: 'IST', icao: 'LTFM', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turquie', lat: 41.2753, lon: 28.7519 },
  LTFM: { code: 'IST', icao: 'LTFM', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turquie', lat: 41.2753, lon: 28.7519 },

  // USA - New York & Nord-Est
  JFK: { code: 'JFK', icao: 'KJFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', lat: 40.6413, lon: -73.7781 },
  KJFK: { code: 'JFK', icao: 'KJFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', lat: 40.6413, lon: -73.7781 },
  EWR: { code: 'EWR', icao: 'KEWR', name: 'Newark Liberty', city: 'Newark', country: 'USA', lat: 40.6895, lon: -74.1745 },
  KEWR: { code: 'EWR', icao: 'KEWR', name: 'Newark Liberty', city: 'Newark', country: 'USA', lat: 40.6895, lon: -74.1745 },
  LGA: { code: 'LGA', icao: 'KLGA', name: 'LaGuardia', city: 'New York', country: 'USA', lat: 40.7769, lon: -73.8740 },
  KLGA: { code: 'LGA', icao: 'KLGA', name: 'LaGuardia', city: 'New York', country: 'USA', lat: 40.7769, lon: -73.8740 },
  BOS: { code: 'BOS', icao: 'KBOS', name: 'Logan Intl', city: 'Boston', country: 'USA', lat: 42.3656, lon: -71.0096 },
  KBOS: { code: 'BOS', icao: 'KBOS', name: 'Logan Intl', city: 'Boston', country: 'USA', lat: 42.3656, lon: -71.0096 },
  PHL: { code: 'PHL', icao: 'KPHL', name: 'Philadelphia Intl', city: 'Philadelphie', country: 'USA', lat: 39.8729, lon: -75.2437 },
  KPHL: { code: 'PHL', icao: 'KPHL', name: 'Philadelphia Intl', city: 'Philadelphie', country: 'USA', lat: 39.8729, lon: -75.2437 },
  IAD: { code: 'IAD', icao: 'KIAD', name: 'Dulles Intl', city: 'Washington', country: 'USA', lat: 38.9531, lon: -77.4565 },
  KIAD: { code: 'IAD', icao: 'KIAD', name: 'Dulles Intl', city: 'Washington', country: 'USA', lat: 38.9531, lon: -77.4565 },
  DCA: { code: 'DCA', icao: 'KDCA', name: 'Reagan National', city: 'Washington', country: 'USA', lat: 38.8512, lon: -77.0402 },
  KDCA: { code: 'DCA', icao: 'KDCA', name: 'Reagan National', city: 'Washington', country: 'USA', lat: 38.8512, lon: -77.0402 },

  // USA - Centre, Sud & Ouest
  ORD: { code: 'ORD', icao: 'KORD', name: 'O\'Hare Intl', city: 'Chicago', country: 'USA', lat: 41.9742, lon: -87.9073 },
  KORD: { code: 'ORD', icao: 'KORD', name: 'O\'Hare Intl', city: 'Chicago', country: 'USA', lat: 41.9742, lon: -87.9073 },
  MDW: { code: 'MDW', icao: 'KMDW', name: 'Midway', city: 'Chicago', country: 'USA', lat: 41.7868, lon: -87.7522 },
  KMDW: { code: 'MDW', icao: 'KMDW', name: 'Midway', city: 'Chicago', country: 'USA', lat: 41.7868, lon: -87.7522 },
  ATL: { code: 'ATL', icao: 'KATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA', lat: 33.6407, lon: -84.4277 },
  KATL: { code: 'ATL', icao: 'KATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA', lat: 33.6407, lon: -84.4277 },
  MIA: { code: 'MIA', icao: 'KMIA', name: 'Miami Intl', city: 'Miami', country: 'USA', lat: 25.7959, lon: -80.2870 },
  KMIA: { code: 'MIA', icao: 'KMIA', name: 'Miami Intl', city: 'Miami', country: 'USA', lat: 25.7959, lon: -80.2870 },
  MCO: { code: 'MCO', icao: 'KMCO', name: 'Orlando Intl', city: 'Orlando', country: 'USA', lat: 28.4312, lon: -81.3081 },
  KMCO: { code: 'MCO', icao: 'KMCO', name: 'Orlando Intl', city: 'Orlando', country: 'USA', lat: 28.4312, lon: -81.3081 },
  DFW: { code: 'DFW', icao: 'KDFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'USA', lat: 32.8998, lon: -97.0403 },
  KDFW: { code: 'DFW', icao: 'KDFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'USA', lat: 32.8998, lon: -97.0403 },
  IAH: { code: 'IAH', icao: 'KIAH', name: 'George Bush Intl', city: 'Houston', country: 'USA', lat: 29.9902, lon: -95.3368 },
  KIAH: { code: 'IAH', icao: 'KIAH', name: 'George Bush Intl', city: 'Houston', country: 'USA', lat: 29.9902, lon: -95.3368 },
  DEN: { code: 'DEN', icao: 'KDEN', name: 'Denver Intl', city: 'Denver', country: 'USA', lat: 39.8561, lon: -104.6737 },
  KDEN: { code: 'DEN', icao: 'KDEN', name: 'Denver Intl', city: 'Denver', country: 'USA', lat: 39.8561, lon: -104.6737 },
  LAX: { code: 'LAX', icao: 'KLAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA', lat: 33.9416, lon: -118.4085 },
  KLAX: { code: 'LAX', icao: 'KLAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA', lat: 33.9416, lon: -118.4085 },
  SFO: { code: 'SFO', icao: 'KSFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'USA', lat: 37.6213, lon: -122.3790 },
  KSFO: { code: 'SFO', icao: 'KSFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'USA', lat: 37.6213, lon: -122.3790 },
  SEA: { code: 'SEA', icao: 'KSEA', name: 'Seattle-Tacoma', city: 'Seattle', country: 'USA', lat: 47.4502, lon: -122.3088 },
  KSEA: { code: 'SEA', icao: 'KSEA', name: 'Seattle-Tacoma', city: 'Seattle', country: 'USA', lat: 47.4502, lon: -122.3088 },
  LAS: { code: 'LAS', icao: 'KLAS', name: 'Harry Reid Intl', city: 'Las Vegas', country: 'USA', lat: 36.0840, lon: -115.1537 },
  KLAS: { code: 'LAS', icao: 'KLAS', name: 'Harry Reid Intl', city: 'Las Vegas', country: 'USA', lat: 36.0840, lon: -115.1537 },

  // Canada
  YYZ: { code: 'YYZ', icao: 'CYYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada', lat: 43.6777, lon: -79.6248 },
  CYYZ: { code: 'YYZ', icao: 'CYYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada', lat: 43.6777, lon: -79.6248 },
  YUL: { code: 'YUL', icao: 'CYUL', name: 'Montréal-Trudeau', city: 'Montréal', country: 'Canada', lat: 45.4706, lon: -73.7408 },
  CYUL: { code: 'YUL', icao: 'CYUL', name: 'Montréal-Trudeau', city: 'Montréal', country: 'Canada', lat: 45.4706, lon: -73.7408 },

  // Moyen-Orient & Afrique
  DXB: { code: 'DXB', icao: 'OMDB', name: 'Dubai Intl', city: 'Dubaï', country: 'Émirats Arabes Unis', lat: 25.2532, lon: 55.3657 },
  OMDB: { code: 'DXB', icao: 'OMDB', name: 'Dubai Intl', city: 'Dubaï', country: 'Émirats Arabes Unis', lat: 25.2532, lon: 55.3657 },
  DOH: { code: 'DOH', icao: 'OTHH', name: 'Hamad Intl', city: 'Doha', country: 'Qatar', lat: 25.2731, lon: 51.6081 },
  OTHH: { code: 'DOH', icao: 'OTHH', name: 'Hamad Intl', city: 'Doha', country: 'Qatar', lat: 25.2731, lon: 51.6081 },
  ALG: { code: 'ALG', icao: 'DAAG', name: 'Houari Boumédiène', city: 'Alger', country: 'Algérie', lat: 36.6910, lon: 3.2154 },
  DAAG: { code: 'ALG', icao: 'DAAG', name: 'Houari Boumédiène', city: 'Alger', country: 'Algérie', lat: 36.6910, lon: 3.2154 },
  CMN: { code: 'CMN', icao: 'GMMN', name: 'Mohammed V', city: 'Casablanca', country: 'Maroc', lat: 33.3675, lon: -7.5899 },
  GMMN: { code: 'CMN', icao: 'GMMN', name: 'Mohammed V', city: 'Casablanca', country: 'Maroc', lat: 33.3675, lon: -7.5899 },

  // Asie
  HND: { code: 'HND', icao: 'RJTT', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japon', lat: 35.5494, lon: 139.7798 },
  RJTT: { code: 'HND', icao: 'RJTT', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japon', lat: 35.5494, lon: 139.7798 },
  NRT: { code: 'NRT', icao: 'RJAA', name: 'Tokyo Narita', city: 'Tokyo', country: 'Japon', lat: 35.7720, lon: 140.3929 },
  RJAA: { code: 'NRT', icao: 'RJAA', name: 'Tokyo Narita', city: 'Tokyo', country: 'Japon', lat: 35.7720, lon: 140.3929 },
  SIN: { code: 'SIN', icao: 'WSSS', name: 'Singapore Changi', city: 'Singapour', country: 'Singapour', lat: 1.3644, lon: 103.9915 },
  WSSS: { code: 'SIN', icao: 'WSSS', name: 'Singapore Changi', city: 'Singapour', country: 'Singapour', lat: 1.3644, lon: 103.9915 },
  ICN: { code: 'ICN', icao: 'RKSI', name: 'Incheon International', city: 'Séoul', country: 'Corée du Sud', lat: 37.4602, lon: 126.4407 },
  RKSI: { code: 'ICN', icao: 'RKSI', name: 'Incheon International', city: 'Séoul', country: 'Corée du Sud', lat: 37.4602, lon: 126.4407 },
  GMP: { code: 'GMP', icao: 'RKSS', name: 'Gimpo International', city: 'Séoul', country: 'Corée du Sud', lat: 37.5583, lon: 126.7906 },
  RKSS: { code: 'GMP', icao: 'RKSS', name: 'Gimpo International', city: 'Séoul', country: 'Corée du Sud', lat: 37.5583, lon: 126.7906 }
};

let currentLoc = LOCATIONS.paris_center;
let selectedCallsign = null;
let latestStates = [];

// Filters state
let activeAltFilter = 'all'; // 'all' | 'approach' | 'cruise'
let activeTypeFilter = 'all'; // 'all' | 'airline' | 'private'
let weatherActive = false;
let weatherTileLayer = null;

// Audio ATC state
let atcAudio = null;
let atcActive = false;
let atcVolume = 0.8;
let currentAtcChannelId = 'kjfk_twr';

// Flight trails history: icao24 -> array of [lat, lon]
const flightTrails = new Map();
const aircraftCache = new Map();

const REFRESH_INTERVAL = 10;
let countdownTimer = REFRESH_INTERVAL;

// Initialize Map
const map = L.map('map', {
  zoomControl: false,
  attributionControl: false
}).setView([currentLoc.lat, currentLoc.lon], currentLoc.zoom);

L.control.attribution({ position: 'bottomright' }).addTo(map);

// Basemap configurations
const basemapLayers = {
  midnight_gold: L.layerGroup([
    // 1. Base océans et terres avec contrastes côtiers nets
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &bull; Midnight Gold',
      className: 'midnight-gold-base',
      maxZoom: 19,
      maxNativeZoom: 16
    }),
    // 2. Côtes maritimes, rivages et frontières dessinés en filigrane d'or
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri Boundaries',
      className: 'midnight-gold-boundaries',
      maxZoom: 19,
      maxNativeZoom: 19
    }),
    // 3. Principaux axes routiers, autoroutes, rocades et ponts en or 24K éclatant
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri Transportation',
      className: 'midnight-gold-roads',
      maxZoom: 19,
      maxNativeZoom: 19
    })
  ]),
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri',
    maxZoom: 19
  }),
  nasa: L.layerGroup([
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri',
      maxZoom: 19
    }),
    L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg', {
      attribution: '&copy; NASA Earthdata / GIBS',
      className: 'nasa-lights-tiles',
      maxNativeZoom: 8,
      maxZoom: 19,
      opacity: 0.95
    })
  ]),
  crt_vintage: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap &bull; Vintage CRT Radar',
    className: 'vintage-crt-tiles',
    maxZoom: 19
  }),
  brutalist: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap &bull; Brutaliste N&B',
    className: 'brutalist-tiles',
    maxZoom: 19
  }),
  dark: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri',
    maxZoom: 19,
    maxNativeZoom: 16
  }),
  flir: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri',
    className: 'flir-tiles',
    maxZoom: 19,
    maxNativeZoom: 16
  }),
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }),
  topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap',
    maxZoom: 17
  })
};

let currentBasemap = basemapLayers.satellite.addTo(map);
let currentVisionMode = 'satellite';

const mapElInit = document.getElementById('map');
if (mapElInit) mapElInit.classList.remove('theme-midnight-gold');

// Basemap switcher
const basemapSelect = document.getElementById('basemap-select');
if (basemapSelect) {
  basemapSelect.addEventListener('change', (e) => {
    const selected = e.target.value;
    currentVisionMode = selected;
    if (basemapLayers[selected]) {
      map.removeLayer(currentBasemap);
      currentBasemap = basemapLayers[selected].addTo(map);

      // Toggle container CSS classes for vision modes
      const mapEl = document.getElementById('map');
      if (mapEl) {
        mapEl.classList.toggle('theme-midnight-gold', selected === 'midnight_gold');
        mapEl.classList.toggle('theme-crt-vintage', selected === 'crt_vintage');
        mapEl.classList.toggle('theme-brutalist', selected === 'brutalist');
        mapEl.classList.toggle('theme-nasa', selected === 'nasa');
      }

      renderPlanes();
    }
  });
}

// Layers
const trailsLayer = L.layerGroup().addTo(map);
const routeLayer = L.layerGroup().addTo(map);
const planesLayer = L.layerGroup().addTo(map);

// Calculate dynamic aircraft icon size based on zoom level & traffic density
function calculateDynamicIconSize(isFocused, totalCount) {
  const zoom = map.getZoom();

  if (isFocused) {
    if (zoom <= 5) return 20;
    if (zoom <= 7) return 24;
    return 32;
  }

  // Adaptive micro-scaling when zoomed out or over Europe
  if (zoom <= 4) return 8;
  if (zoom === 5) return totalCount > 1500 ? 10 : 12;
  if (zoom === 6) return totalCount > 1500 ? 12 : 14;
  if (zoom === 7) return 16;
  if (zoom === 8) return 20;
  if (zoom === 9) return 24;
  return 28;
}

// Airplane SVG generator
function getPlaneSvg(color, strokeColor = '#0f172a', isFocused = false, size = 24) {
  const strokeW = size < 14 ? 0.9 : (size < 22 ? 1.3 : 1.8);
  return `
  <div style="position: relative; width: ${size}px; height: ${size}px;">
    ${isFocused ? '<div class="target-ring"></div>' : ''}
    <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 2C22.6 2 21.6 3.4 21.6 5.2V17.5L5 25.8V29.5L21.6 24.8V36.8L16.8 40.2V42.8L24 41.2L31.2 42.8V40.2L26.4 36.8V24.8L43 29.5V25.8L26.4 17.5V5.2C26.4 3.4 25.4 2 24 2Z" 
            fill="${color}" 
            stroke="${strokeColor}" 
            stroke-width="${strokeW}" 
            stroke-linejoin="round"/>
      ${size >= 18 ? `<circle cx="24" cy="6.5" r="1.2" fill="${strokeColor}"/>` : ''}
    </svg>
  </div>`;
}

// Distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const formatSpeed = (ms) => {
  if (ms == null) return 'N/A';
  const kmh = Math.round(ms * 3.6);
  const knots = Math.round(ms * 1.94384);
  return `${knots} kt / ${kmh} km/h`;
};

const formatAlt = (meters) => {
  if (meters == null) return 'N/A';
  const feet = Math.round(meters * 3.28084);
  return `${feet} ft / ${Math.round(meters)} m`;
};

// Route Cache & Spatial Navigation Helpers
const routeCache = new Map();

function getAirportByCode(code) {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  if (AIRPORTS[clean]) return AIRPORTS[clean];

  for (const key of Object.keys(AIRPORTS)) {
    const ap = AIRPORTS[key];
    if (ap.icao === clean || ap.code === clean) return ap;
  }

  return {
    code: clean,
    icao: clean,
    name: `Aéroport ${clean}`,
    city: clean,
    country: '',
    lat: null,
    lon: null
  };
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function angleDiff(a, b) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function getUniqueAirports() {
  const seen = new Set();
  const list = [];
  for (const ap of Object.values(AIRPORTS)) {
    if (!seen.has(ap.code) && ap.lat != null) {
      seen.add(ap.code);
      list.push(ap);
    }
  }
  return list;
}

const UNIQUE_AIRPORTS = getUniqueAirports();

function findClosestAirport(lat, lon, maxDist = Infinity) {
  let closest = null;
  let minDist = maxDist;
  for (const ap of UNIQUE_AIRPORTS) {
    const d = calculateDistance(lat, lon, ap.lat, ap.lon);
    if (d < minDist) {
      minDist = d;
      closest = ap;
    }
  }
  return closest;
}

function findAirportsInDirection(lat, lon, track, minDistance = 60, maxDistance = 6500) {
  const candidates = [];
  for (const ap of UNIQUE_AIRPORTS) {
    const dist = calculateDistance(lat, lon, ap.lat, ap.lon);
    if (dist < minDistance || dist > maxDistance) continue;
    const bearing = calculateBearing(lat, lon, ap.lat, ap.lon);
    const diff = angleDiff(track, bearing);
    if (diff <= 55) {
      candidates.push({ airport: ap, dist, angleDiff: diff });
    }
  }
  candidates.sort((a, b) => (a.angleDiff * 15 + a.dist) - (b.angleDiff * 15 + b.dist));
  return candidates.map(c => c.airport);
}

// Fetch confirmed commercial flight route from OpenSky API
async function fetchAircraftRoute(callsign) {
  if (!callsign || callsign === 'UNKNOWN' || callsign.length < 3) return null;
  const clean = callsign.trim().toUpperCase();
  if (routeCache.has(clean)) {
    return routeCache.get(clean);
  }

  try {
    const res = await fetch(`/api/routes?callsign=${clean}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.route && data.route.length >= 2) {
        const originCode = data.route[0];
        const destCode = data.route[data.route.length - 1];
        const origin = getAirportByCode(originCode);
        const destination = getAirportByCode(destCode);
        const routeData = {
          origin,
          destination,
          operatorIata: data.operatorIata,
          flightNumber: data.flightNumber,
          isReal: true
        };
        routeCache.set(clean, routeData);
        return routeData;
      }
    }
  } catch (e) {
    // Silently proceed
  }
  routeCache.set(clean, null);
  return null;
}

// Route estimation engine (uses real flight route if known, or realistic spatial deduction)
function getEstimatedRoute(plane) {
  const track = plane.true_track || 0;
  const alt = plane.alt || 0;
  const vRate = plane.vertical_rate || 0;
  const onGround = plane.on_ground;
  const cleanCallsign = (plane.callsign || '').trim().toUpperCase();

  let phase = { label: 'Croisière', cssClass: 'phase-cruise' };
  if (onGround || (alt < 300 && plane.velocity < 50)) {
    phase = { label: 'Au Sol', cssClass: 'phase-ground' };
  } else if (alt < 3800 && vRate < -1.5) {
    phase = { label: 'Approche', cssClass: 'phase-descent' };
  } else if (alt < 4200 && vRate > 1.5) {
    phase = { label: 'Montée', cssClass: 'phase-climb' };
  }

  // 1. Check if real verified flight route exists in cache
  if (cleanCallsign && routeCache.has(cleanCallsign)) {
    const realRoute = routeCache.get(cleanCallsign);
    if (realRoute) {
      const dest = realRoute.destination;
      const remainingDist = (dest && dest.lat != null) 
        ? calculateDistance(plane.lat, plane.lon, dest.lat, dest.lon)
        : 250;
      const etaMinutes = plane.velocity > 0 ? Math.round((remainingDist / (plane.velocity * 3.6)) * 60) : 45;
      const etaFormatted = etaMinutes > 60 
        ? `~${Math.floor(etaMinutes / 60)}h ${etaMinutes % 60}m` 
        : `~${etaMinutes} min`;

      return {
        origin: realRoute.origin,
        destination: realRoute.destination,
        phase,
        remainingDist,
        etaFormatted,
        isReal: true
      };
    }
  }

  // 2. Realistic Spatial Heuristic according to coordinates, heading and flight phase
  const localAirport = findClosestAirport(plane.lat, plane.lon, 120) || findClosestAirport(plane.lat, plane.lon) || AIRPORTS.CDG;
  const reverseTrack = (track + 180) % 360;

  let origin = null;
  let destination = null;

  if (phase.label === 'Approche' || phase.label === 'Au Sol') {
    destination = localAirport;
    const originsBehind = findAirportsInDirection(plane.lat, plane.lon, reverseTrack, 80);
    origin = originsBehind[0] || (plane.lon < -50 ? AIRPORTS.ORD : (plane.lon > 40 ? AIRPORTS.DXB : AIRPORTS.LHR));
  } else if (phase.label === 'Montée') {
    origin = localAirport;
    const destsAhead = findAirportsInDirection(plane.lat, plane.lon, track, 80);
    destination = destsAhead[0] || (plane.lon < -50 ? AIRPORTS.LAX : (plane.lon > 40 ? AIRPORTS.HND : AIRPORTS.NCE));
  } else {
    // Cruise
    const destsAhead = findAirportsInDirection(plane.lat, plane.lon, track, 80);
    const originsBehind = findAirportsInDirection(plane.lat, plane.lon, reverseTrack, 80);

    destination = destsAhead[0] || (plane.lon < -50 ? (track > 180 ? AIRPORTS.LAX : AIRPORTS.BOS) : (track > 180 ? AIRPORTS.MAD : AIRPORTS.AMS));
    origin = originsBehind[0] || (plane.lon < -50 ? AIRPORTS.JFK : AIRPORTS.CDG);
  }

  // Ensure origin and destination are distinct
  if (origin && destination && origin.code === destination.code) {
    if (phase.label === 'Montée') {
      const altDests = findAirportsInDirection(plane.lat, plane.lon, track, 250);
      destination = altDests[0] || (plane.lon < -50 ? AIRPORTS.ORD : AIRPORTS.FRA);
    } else {
      const altOrigins = findAirportsInDirection(plane.lat, plane.lon, reverseTrack, 250);
      origin = altOrigins[0] || (plane.lon < -50 ? AIRPORTS.ATL : AIRPORTS.LHR);
    }
  }

  const remainingDist = (destination && destination.lat != null) 
    ? calculateDistance(plane.lat, plane.lon, destination.lat, destination.lon) 
    : 300;
  const etaMinutes = plane.velocity > 0 ? Math.round((remainingDist / (plane.velocity * 3.6)) * 60) : 45;
  const etaFormatted = etaMinutes > 60 
    ? `~${Math.floor(etaMinutes / 60)}h ${etaMinutes % 60}m` 
    : `~${etaMinutes} min`;

  return { origin, destination, phase, remainingDist, etaFormatted, isReal: false };
}

// Draw Route on map
function drawFlightRoute(plane, route) {
  routeLayer.clearLayers();
  if (!route || !route.destination || route.destination.lat == null) return;

  const polyline = L.polyline([[plane.lat, plane.lon], [route.destination.lat, route.destination.lon]], {
    color: '#0a84ff',
    weight: 2.5,
    dashArray: '5, 8',
    opacity: 0.85
  });
  routeLayer.addLayer(polyline);

  const destIcon = L.divIcon({
    html: `<div class="destination-pin">🛬 ${route.destination.code} • ${route.destination.city}</div>`,
    className: 'dest-marker',
    iconSize: [120, 24],
    iconAnchor: [60, 12]
  });

  const destMarker = L.marker([route.destination.lat, route.destination.lon], { icon: destIcon });
  routeLayer.addLayer(destMarker);
}

// Aircraft Metadata lookup
async function fetchAircraftDetails(icao24) {
  if (!icao24) return null;
  const key = icao24.toLowerCase().trim();
  if (aircraftCache.has(key)) return aircraftCache.get(key);

  try {
    let res = await fetch(`/api/hexdb?hex=${key}`);
    if (!res.ok) res = await fetch(`/hexdb/api/v1/aircraft/${key}`);
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error) {
        const details = {
          model: [data.Manufacturer, data.Type || data.ICAOTypeCode].filter(Boolean).join(' ') || 'Type inconnu',
          operator: data.RegisteredOwners || data.OperatorFlagCode || 'Non spécifié',
          registration: data.Registration || 'N/A'
        };
        aircraftCache.set(key, details);
        return details;
      }
    }
  } catch (e) {}

  const fallback = { model: 'Non répertorié', operator: 'N/A', registration: 'N/A' };
  aircraftCache.set(key, fallback);
  return fallback;
}

// Generic fallback photos for most common commercial aircraft models
const GENERIC_AIRCRAFT_PHOTOS = {
  A320: {
    src: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=700&q=80',
    model: 'Airbus A320 / A321',
    credit: 'Photo d\'illustration'
  },
  A350: {
    src: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80',
    model: 'Airbus A350 XWB',
    credit: 'Photo d\'illustration'
  },
  A380: {
    src: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=700&q=80',
    model: 'Airbus A380',
    credit: 'Photo d\'illustration'
  },
  A330: {
    src: 'https://images.unsplash.com/photo-1579294800821-694d95e86143?auto=format&fit=crop&w=700&q=80',
    model: 'Airbus A330',
    credit: 'Photo d\'illustration'
  },
  B737: {
    src: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=700&q=80',
    model: 'Boeing 737 / MAX',
    credit: 'Photo d\'illustration'
  },
  B777: {
    src: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=700&q=80',
    model: 'Boeing 777',
    credit: 'Photo d\'illustration'
  },
  B787: {
    src: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&w=700&q=80',
    model: 'Boeing 787 Dreamliner',
    credit: 'Photo d\'illustration'
  },
  B747: {
    src: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=700&q=80',
    model: 'Boeing 747',
    credit: 'Photo d\'illustration'
  },
  EMBRAER: {
    src: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=700&q=80',
    model: 'Embraer E-Jet',
    credit: 'Photo d\'illustration'
  },
  PRIVATE_JET: {
    src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=700&q=80',
    model: 'Jet d\'Affaires',
    credit: 'Photo d\'illustration'
  },
  GENERIC: {
    src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=80',
    model: 'Aéronef Commercial',
    credit: 'Photo d\'illustration'
  }
};

function getFallbackPhoto(rawModel = '') {
  const m = (rawModel || '').toLowerCase();
  if (m.includes('320') || m.includes('321') || m.includes('319') || m.includes('318') || m.includes('a20n') || m.includes('a21n')) return GENERIC_AIRCRAFT_PHOTOS.A320;
  if (m.includes('350') || m.includes('359') || m.includes('351') || m.includes('a350')) return GENERIC_AIRCRAFT_PHOTOS.A350;
  if (m.includes('380') || m.includes('388') || m.includes('a380')) return GENERIC_AIRCRAFT_PHOTOS.A380;
  if (m.includes('330') || m.includes('332') || m.includes('333') || m.includes('339') || m.includes('a330')) return GENERIC_AIRCRAFT_PHOTOS.A330;
  if (m.includes('737') || m.includes('b73') || m.includes('738') || m.includes('739') || m.includes('max')) return GENERIC_AIRCRAFT_PHOTOS.B737;
  if (m.includes('777') || m.includes('b77') || m.includes('77w') || m.includes('772') || m.includes('773')) return GENERIC_AIRCRAFT_PHOTOS.B777;
  if (m.includes('787') || m.includes('b78') || m.includes('788') || m.includes('789') || m.includes('78x')) return GENERIC_AIRCRAFT_PHOTOS.B787;
  if (m.includes('747') || m.includes('b74') || m.includes('744') || m.includes('748')) return GENERIC_AIRCRAFT_PHOTOS.B747;
  if (m.includes('erj') || m.includes('e190') || m.includes('e195') || m.includes('e175') || m.includes('embraer')) return GENERIC_AIRCRAFT_PHOTOS.EMBRAER;
  if (m.includes('falcon') || m.includes('citation') || m.includes('gulfstream') || m.includes('challenger') || m.includes('learjet') || m.includes('global')) return GENERIC_AIRCRAFT_PHOTOS.PRIVATE_JET;
  return GENERIC_AIRCRAFT_PHOTOS.GENERIC;
}

const photoCache = new Map();

async function fetchAircraftPhoto(icao24, model = '') {
  if (!icao24) return getFallbackPhoto(model);
  const key = icao24.toLowerCase().trim();
  if (photoCache.has(key)) return photoCache.get(key);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    let res = null;
    try {
      // 1. Direct browser fetch to Planespotters API (CORS enabled for browsers)
      res = await fetch(`https://api.planespotters.net/pub/photos/hex/${key}`, {
        signal: controller.signal
      });
    } catch (eDirect) {
      // 2. Direct fetch blocked by adblocker / network, try our serverless API proxy
      try {
        res = await fetch(`/api/planespotters?hex=${key}`, { signal: controller.signal });
      } catch (eProxy) {}
    }
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json();
      if (data && data.photos && data.photos.length > 0) {
        const p = data.photos[0];
        const photoData = {
          src: p.thumbnail_large?.src || p.thumbnail?.src,
          photographer: p.photographer || 'Planespotters',
          link: p.link || `https://www.planespotters.net/hex/${key}`,
          isReal: true
        };
        photoCache.set(key, photoData);
        return photoData;
      }
    }
  } catch (err) {
    console.warn('Planespotters fetch failed, using fallback:', err);
  }

  const fallback = { ...getFallbackPhoto(model), isReal: false, link: `https://www.planespotters.net/hex/${key}` };
  photoCache.set(key, fallback);
  return fallback;
}

function applyPhotoToUI(photoData, plane) {
  if (!photoData || !plane) return;
  const photoImg = document.getElementById('photo-img');
  const photoLink = document.getElementById('photo-link');
  const photoLoading = document.getElementById('photo-loading');
  const photoBadge = document.getElementById('photo-badge');
  const photoCredit = document.getElementById('photo-credit');

  if (!photoImg || !photoLoading || !photoLink) return;

  const showLoaded = () => {
    photoLoading.classList.add('hidden');
    photoLoading.style.display = 'none';
    photoLink.classList.remove('hidden');
    photoLink.style.display = 'block';
  };

  photoImg.onload = showLoaded;
  photoImg.onerror = () => {
    const fallback = getFallbackPhoto('');
    photoImg.src = fallback.src;
    if (photoBadge) {
      photoBadge.textContent = '📷 ILLUSTRATION';
      photoBadge.classList.add('illustration');
    }
    if (photoCredit) photoCredit.textContent = fallback.credit;
    showLoaded();
  };

  if (photoLink) photoLink.href = photoData.link || `https://www.planespotters.net/hex/${plane.icao24}`;
  if (photoBadge) {
    photoBadge.textContent = photoData.isReal ? '📷 PHOTO RÉELLE' : '📷 ILLUSTRATION';
    photoBadge.classList.toggle('illustration', !photoData.isReal);
  }
  if (photoCredit) {
    photoCredit.textContent = photoData.photographer ? `© ${photoData.photographer}` : (photoData.credit || 'Photo d\'illustration');
  }

  photoImg.src = photoData.src;

  if (photoImg.complete && photoImg.naturalWidth > 0) {
    showLoaded();
  }
}

// Primary Flight Display (PFD) removed for sober avionics layout
function drawPFD(plane) {
  // Horizon artificiel désactivé
}

// Vertical Approach Profile Canvas Renderer
function drawProfile(plane) {
  const canvas = document.getElementById('profile-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0c0e12';
  ctx.fillRect(0, 0, w, h);

  // Grid levels (FL100, FL200, FL300)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.33); ctx.lineTo(w, h * 0.33);
  ctx.moveTo(0, h * 0.66); ctx.lineTo(w, h * 0.66);
  ctx.stroke();

  // Runway ground target at right
  ctx.fillStyle = '#30d158';
  ctx.fillRect(w - 24, h - 3, 24, 3);

  const alt = plane && plane.alt ? plane.alt : 5000;
  const maxAlt = 12000;
  const currentY = Math.max(8, Math.min(h - 8, h - (alt / maxAlt) * (h - 12)));

  // Slope line
  ctx.strokeStyle = '#0a84ff';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(30, currentY);
  ctx.lineTo(w - 12, h - 3);
  ctx.stroke();
  ctx.setLineDash([]);

  // Plane dot
  ctx.fillStyle = '#0a84ff';
  ctx.beginPath();
  ctx.arc(30, currentY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
  ctx.fillText(`ALT ${Math.round(alt)} m`, 38, Math.max(12, currentY - 4));
  ctx.fillStyle = '#9496a1';
  ctx.fillText('PISTE (SOL)', w - 70, h - 7);
}

// Fetch METAR & Wind data
async function fetchMETAR() {
  try {
    const res = await fetch(`/metar?ids=LFPG,LFPO,LFMN,LFLL,LFML,LFBO,EGLL,KJFK,OMDB&format=json`);
    if (res.ok) {
      const data = await res.json();
      const currentStation = data.find(m => m.icaoId === currentLoc.icao) || data[0];
      const elText = document.getElementById('metar-text');
      if (currentStation && elText) {
        const wdir = currentStation.wdir === 'VRB' ? 'VARIABLE' : `${currentStation.wdir}°`;
        const wspd = currentStation.wspd != null ? `${currentStation.wspd} kt` : 'Calme';
        const qnh = currentStation.altim ? `QNH ${currentStation.altim}` : '';
        elText.textContent = `${currentStation.icaoId} | VENT: ${wdir} @ ${wspd} ${qnh} (VFR)`;
      }
    }
  } catch (e) {
    const elText = document.getElementById('metar-text');
    if (elText) elText.textContent = `${currentLoc.icao} | VENT MODÉRÉ | VFR`;
  }
}

// Weather Radar RainViewer Toggle
async function toggleWeather() {
  const btn = document.getElementById('btn-weather');
  weatherActive = !weatherActive;
  btn.classList.toggle('active', weatherActive);
  btn.querySelector('.btn-state').textContent = weatherActive ? 'ON' : 'OFF';

  if (weatherActive) {
    try {
      const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      const data = await res.json();
      const latestPath = data.radar.past[data.radar.past.length - 1].path;
      const tileUrl = `https://tilecache.rainviewer.com${latestPath}/256/{z}/{x}/{y}/2/1_1.png`;
      weatherTileLayer = L.tileLayer(tileUrl, { opacity: 0.65, zIndex: 20 }).addTo(map);
    } catch (e) {
      console.error('Weather load error:', e);
    }
  } else if (weatherTileLayer) {
    map.removeLayer(weatherTileLayer);
    weatherTileLayer = null;
  }
}

// Live ATC Audio Stations Registry (21 Verified Working Frequencies)
const ATC_CHANNELS = {
  // New York Metro Area
  kjfk_twr: {
    id: 'kjfk_twr',
    name: 'JFK Tour (119.1 MHz)',
    short: 'JFK TWR',
    freq: '119.100',
    airport: 'KJFK • New York JFK',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'New York',
    desc: 'Contrôle d\'aérodrome & pistes 04L/R, 13L/R, 22L/R, 31L/R',
    url: 'https://d.liveatc.net/kjfk_twr'
  },
  kjfk_app: {
    id: 'kjfk_app',
    name: 'JFK Approche Radar',
    short: 'JFK APP',
    freq: '125.700',
    airport: 'KJFK • New York JFK',
    type: 'Approche TRACON',
    flag: '🇺🇸',
    region: 'New York',
    desc: 'Guidage radar des appareils en descente vers New York',
    url: 'https://d.liveatc.net/kjfk_app'
  },
  kjfk_gnd: {
    id: 'kjfk_gnd',
    name: 'JFK Sol & Roulage',
    short: 'JFK GND',
    freq: '121.900',
    airport: 'KJFK • New York JFK',
    type: 'Contrôle Sol / Ground',
    flag: '🇺🇸',
    region: 'New York',
    desc: 'Circulation des avions sur les taxiways et parkings de JFK',
    url: 'https://d.liveatc.net/kjfk_gnd'
  },
  klga_twr: {
    id: 'klga_twr',
    name: 'LaGuardia Tour',
    short: 'LGA TWR',
    freq: '118.700',
    airport: 'KLGA • New York LaGuardia',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'New York',
    desc: 'Tour de contrôle d\'aérodrome de LaGuardia (Manhattan)',
    url: 'https://d.liveatc.net/klga_twr'
  },
  kewr_twr: {
    id: 'kewr_twr',
    name: 'Newark Liberty Tour',
    short: 'EWR TWR',
    freq: '118.300',
    airport: 'KEWR • Newark Liberty',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'New York',
    desc: 'Tour de contrôle principale de Newark Liberty',
    url: 'https://d.liveatc.net/kewr_twr'
  },

  // USA Major Hubs
  kbos_twr: {
    id: 'kbos_twr',
    name: 'Boston Logan Tour',
    short: 'BOS TWR',
    freq: '128.800',
    airport: 'KBOS • Boston Logan Intl',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'USA',
    desc: 'Contrôle d\'aérodrome de Boston Logan International',
    url: 'https://d.liveatc.net/kbos_twr'
  },
  kord_twr: {
    id: 'kord_twr',
    name: 'Chicago O\'Hare Tour',
    short: 'ORD TWR',
    freq: '120.750',
    airport: 'KORD • Chicago O\'Hare',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'USA',
    desc: 'Hub majeur du Midwest américain (United / American)',
    url: 'https://d.liveatc.net/kord_twr'
  },
  klax_twr: {
    id: 'klax_twr',
    name: 'Los Angeles Intl Tour',
    short: 'LAX TWR',
    freq: '120.950',
    airport: 'KLAX • Los Angeles Intl',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'USA',
    desc: 'Hub transpacifique majeur de Californie',
    url: 'https://d.liveatc.net/klax_twr'
  },
  ksfo_twr: {
    id: 'ksfo_twr',
    name: 'San Francisco Tour',
    short: 'SFO TWR',
    freq: '120.500',
    airport: 'KSFO • San Francisco Intl',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'USA',
    desc: 'Baie de San Francisco & pistes parallèles 28L/R',
    url: 'https://d.liveatc.net/ksfo_twr'
  },
  katl_twr: {
    id: 'katl_twr',
    name: 'Atlanta Hartsfield Tour',
    short: 'ATL TWR',
    freq: '119.500',
    airport: 'KATL • Atlanta Hartsfield-Jackson',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'USA',
    desc: 'L\'aéroport le plus fréquenté au monde (Delta Hub)',
    url: 'https://d.liveatc.net/katl_twr'
  },
  kmia_twr: {
    id: 'kmia_twr',
    name: 'Miami Intl Tour',
    short: 'MIA TWR',
    freq: '118.300',
    airport: 'KMIA • Miami International',
    type: 'Tour de Contrôle',
    flag: '🇺🇸',
    region: 'USA',
    desc: 'Porte d\'entrée des Amériques et Caraïbes',
    url: 'https://d.liveatc.net/kmia_twr'
  },

  // Europe (Actif & Légal)
  eham_twr: {
    id: 'eham_twr',
    name: 'Amsterdam Schiphol Tour',
    short: 'AMS TWR',
    freq: '119.225',
    airport: 'EHAM • Amsterdam Schiphol',
    type: 'Tour de Contrôle',
    flag: '🇳🇱',
    region: 'Europe',
    desc: 'Hub européen majeur des Pays-Bas (KLM)',
    url: 'https://d.liveatc.net/eham_twr'
  },
  eham_app: {
    id: 'eham_app',
    name: 'Amsterdam Schiphol Approche',
    short: 'AMS APP',
    freq: '121.200',
    airport: 'EHAM • Amsterdam Schiphol',
    type: 'Approche Radar',
    flag: '🇳🇱',
    region: 'Europe',
    desc: 'Régulation des arrivées sur Schiphol',
    url: 'https://d.liveatc.net/eham_app'
  },
  lszh_twr: {
    id: 'lszh_twr',
    name: 'Zurich Tour',
    short: 'ZRH TWR',
    freq: '118.100',
    airport: 'LSZH • Zurich Kloten',
    type: 'Tour de Contrôle',
    flag: '🇨🇭',
    region: 'Europe',
    desc: 'Tour de contrôle de l\'aéroport international de Zurich',
    url: 'https://d.liveatc.net/lszh_twr'
  },
  eidw_twr: {
    id: 'eidw_twr',
    name: 'Dublin Tour',
    short: 'DUB TWR',
    freq: '118.600',
    airport: 'EIDW • Dublin Airport',
    type: 'Tour de Contrôle',
    flag: '🇮🇪',
    region: 'Europe',
    desc: 'Tour de contrôle de l\'aéroport de Dublin',
    url: 'https://d.liveatc.net/eidw_twr'
  },
  eddf_twr: {
    id: 'eddf_twr',
    name: 'Francfort Tour',
    short: 'FRA TWR',
    freq: '119.900',
    airport: 'EDDF • Frankfurt am Main',
    type: 'Tour de Contrôle',
    flag: '🇩🇪',
    region: 'Europe',
    desc: 'Hub principal allemand (Lufthansa)',
    url: 'https://d.liveatc.net/eddf_twr'
  },
  eddm_twr: {
    id: 'eddm_twr',
    name: 'Munich Tour',
    short: 'MUC TWR',
    freq: '120.500',
    airport: 'EDDM • Franz Josef Strauss',
    type: 'Tour de Contrôle',
    flag: '🇩🇪',
    region: 'Europe',
    desc: 'Tour de contrôle de l\'aéroport de Munich',
    url: 'https://d.liveatc.net/eddm_twr'
  },
  lemd_twr: {
    id: 'lemd_twr',
    name: 'Madrid Barajas Tour',
    short: 'MAD TWR',
    freq: '118.150',
    airport: 'LEMD • Madrid-Barajas',
    type: 'Tour de Contrôle',
    flag: '🇪🇸',
    region: 'Europe',
    desc: 'Tour de contrôle de Madrid Barajas',
    url: 'https://d.liveatc.net/lemd_twr'
  },
  lebl_twr: {
    id: 'lebl_twr',
    name: 'Barcelone El Prat Tour',
    short: 'BCN TWR',
    freq: '118.100',
    airport: 'LEBL • Barcelone-El Prat',
    type: 'Tour de Contrôle',
    flag: '🇪🇸',
    region: 'Europe',
    desc: 'Tour de contrôle de Barcelone El Prat',
    url: 'https://d.liveatc.net/lebl_twr'
  },

  // Asie
  rjtt_twr: {
    id: 'rjtt_twr',
    name: 'Tokyo Haneda Tour',
    short: 'HND TWR',
    freq: '118.100',
    airport: 'RJTT • Tokyo Haneda',
    type: 'Tour de Contrôle',
    flag: '🇯🇵',
    region: 'Asie',
    desc: 'Tour de contrôle de Tokyo Haneda (Japon)',
    url: 'https://d.liveatc.net/rjtt_twr'
  },
  rjaa_twr: {
    id: 'rjaa_twr',
    name: 'Tokyo Narita Tour',
    short: 'NRT TWR',
    freq: '118.200',
    airport: 'RJAA • Tokyo Narita',
    type: 'Tour de Contrôle',
    flag: '🇯🇵',
    region: 'Asie',
    desc: 'Hub international de Tokyo Narita',
    url: 'https://d.liveatc.net/rjaa_twr'
  }
};

function updateAtcUI(statusText, isLive = false, isError = false) {
  const btn = document.getElementById('btn-atc');
  const btnText = document.getElementById('atc-button-text');
  const stateSpan = btn?.querySelector('.btn-state');
  const iconSpan = btn?.querySelector('.atc-icon');
  
  // Panel elements
  const panelStatus = document.getElementById('panel-comm-status');
  const panelFreq = document.getElementById('panel-freq-mhz');
  const panelName = document.getElementById('panel-station-name');
  const panelDesc = document.getElementById('panel-station-desc');
  const panelLed = document.getElementById('panel-radio-led');
  const panelPlayBtn = document.getElementById('panel-btn-toggle');
  const panelPlayIcon = document.getElementById('panel-play-icon');
  const panelPlayLabel = document.getElementById('panel-play-label');
  const panelWave = document.getElementById('panel-wave-bars');

  const channel = ATC_CHANNELS[currentAtcChannelId] || ATC_CHANNELS.kjfk_twr;

  if (btn) {
    btn.classList.toggle('active', atcActive);
  }

  if (btnText) {
    btnText.textContent = `${channel.flag} ${channel.short}`;
  }

  if (stateSpan) {
    stateSpan.textContent = statusText;
    stateSpan.style.color = isError ? '#ff4d4d' : isLive ? '#00ff88' : (atcActive ? '#ffb000' : '');
  }

  if (iconSpan) {
    if (isLive) {
      iconSpan.classList.add('atc-wave-anim');
      iconSpan.textContent = '🔊';
    } else {
      iconSpan.classList.remove('atc-wave-anim');
      iconSpan.textContent = '📻';
    }
  }

  // Update Avionics Panel Screen
  if (panelFreq) panelFreq.textContent = channel.freq;
  if (panelName) panelName.textContent = `${channel.flag} ${channel.short} • ${channel.name.toUpperCase()}`;
  if (panelDesc) panelDesc.textContent = `${channel.desc} (${channel.type})`;

  if (panelStatus) {
    panelStatus.textContent = isLive ? 'LIVE 🟢' : (atcActive ? 'CONNECTING...' : 'OFFLINE');
    panelStatus.classList.toggle('live', isLive);
  }

  if (panelLed) {
    panelLed.classList.toggle('active', isLive);
  }

  if (panelWave) {
    panelWave.classList.toggle('active', isLive);
  }

  if (panelPlayBtn && panelPlayIcon && panelPlayLabel) {
    if (atcActive) {
      panelPlayBtn.classList.add('playing');
      panelPlayIcon.textContent = '⏹';
      panelPlayLabel.textContent = 'COUPER';
    } else {
      panelPlayBtn.classList.remove('playing');
      panelPlayIcon.textContent = '▶';
      panelPlayLabel.textContent = 'ÉCOUTER';
    }
  }

  // Update active item in station directory
  document.querySelectorAll('.station-item').forEach(item => {
    item.classList.toggle('active', item.dataset.id === currentAtcChannelId);
  });
}

function populateAtcStationsDirectory() {
  const container = document.getElementById('stations-list');
  if (!container) return;

  container.innerHTML = Object.values(ATC_CHANNELS).map(ch => `
    <div class="station-item ${ch.id === currentAtcChannelId ? 'active' : ''}" data-id="${ch.id}">
      <div class="station-info-left">
        <span class="station-flag">${ch.flag}</span>
        <div class="station-title-box">
          <span class="station-item-name">${ch.name}</span>
          <span class="station-item-type">${ch.airport} • ${ch.type}</span>
        </div>
      </div>
      <span class="station-freq-pill">${ch.freq} MHz</span>
    </div>
  `).join('');

  container.querySelectorAll('.station-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      setAtcChannel(id);
      if (!atcActive) {
        toggleATC();
      }
    });
  });
}

function openAtcPanel() {
  const panel = document.getElementById('atc-radio-panel');
  if (panel) {
    panel.classList.remove('hidden');
    updateAtcUI(atcActive ? (atcAudio && !atcAudio.paused ? 'LIVE 🟢' : 'CONNEXION...') : 'OFF', atcActive);
  }
}

function closeAtcPanel() {
  const panel = document.getElementById('atc-radio-panel');
  if (panel) panel.classList.add('hidden');
}

function toggleAtcPanel() {
  const panel = document.getElementById('atc-radio-panel');
  if (panel) {
    if (panel.classList.contains('hidden')) {
      openAtcPanel();
    } else {
      closeAtcPanel();
    }
  }
}

function startAtcPlayback() {
  const channel = ATC_CHANNELS[currentAtcChannelId] || ATC_CHANNELS.kjfk_twr;
  
  if (!atcAudio) {
    atcAudio = document.getElementById('atc-audio-player') || new Audio();
    atcAudio.preload = 'none';
    atcAudio.referrerPolicy = 'no-referrer';

    atcAudio.addEventListener('playing', () => {
      updateAtcUI('LIVE 🟢', true);
    });

    atcAudio.addEventListener('waiting', () => {
      if (atcActive) updateAtcUI('TAMPON...', false);
    });

    atcAudio.addEventListener('error', (e) => {
      console.warn('ATC Audio Stream Error:', e, atcAudio.error);
      if (atcActive) {
        updateAtcUI('ERREUR FLUX', false, true);
      }
    });
  }

  atcAudio.volume = atcVolume;
  atcAudio.referrerPolicy = 'no-referrer';
  atcAudio.src = `${channel.url}?nocache=${Date.now()}`;
  atcAudio.load();
  
  updateAtcUI('CONNEXION...', false);
  
  atcAudio.play().then(() => {
    updateAtcUI('LIVE 🟢', true);
  }).catch((err) => {
    console.error('Audio playback failed or blocked by browser policy:', err);
    updateAtcUI('CLIQUEZ PLAY', false, true);
  });
}

function stopAtcPlayback() {
  if (atcAudio) {
    atcAudio.pause();
    atcAudio.src = '';
    atcAudio.load();
  }
  updateAtcUI('OFF', false);
}

function toggleATC() {
  atcActive = !atcActive;
  if (atcActive) {
    startAtcPlayback();
  } else {
    stopAtcPlayback();
  }
}

function setAtcChannel(channelId) {
  if (!ATC_CHANNELS[channelId]) return;
  currentAtcChannelId = channelId;
  updateAtcUI(atcActive ? 'CONNEXION...' : 'OFF', false);
  if (atcActive) {
    startAtcPlayback();
  }
}

// Active marker pool: icao24 -> marker (High-performance rendering)
const activeMarkers = new Map();
let moveDebounceTimer = null;

// Map movement in dynamic viewport mode
map.on('moveend', () => {
  if (currentLoc.isDynamic) {
    clearTimeout(moveDebounceTimer);
    moveDebounceTimer = setTimeout(() => {
      fetchFlightData();
    }, 800);
  }
});

// Real-time dynamic aircraft icon resizing on zoom in / out
map.on('zoomend', () => {
  renderPlanes();
});

// Location switcher handler
const locationSelect = document.getElementById('location-select');
if (locationSelect) {
  locationSelect.addEventListener('change', (e) => {
    const locKey = e.target.value;
    if (LOCATIONS[locKey]) {
      currentLoc = LOCATIONS[locKey];
      selectedCallsign = null;
      
      const uiHeaderTitle = document.querySelector('h1');
      const uiHeaderSubtitle = document.querySelector('.hud-subtitle');
      if (uiHeaderTitle) uiHeaderTitle.textContent = `RADAR AÉRIEN • ${currentLoc.name}`;
      if (uiHeaderSubtitle) uiHeaderSubtitle.textContent = currentLoc.subtitle;

      if (!currentLoc.isDynamic) {
        map.flyTo([currentLoc.lat, currentLoc.lon], currentLoc.zoom, { duration: 1.5 });
      }

      // Automatically adapt ATC station when switching sectors
      if (locKey === 'jfk') {
        setAtcChannel('kjfk_twr');
      } else if (locKey === 'europe') {
        setAtcChannel('eham_twr');
      }

      fetchMETAR();
      countdownTimer = REFRESH_INTERVAL;
      fetchFlightData();
    }
  });
}

// Reset Selection button
const btnReset = document.getElementById('btn-reset-selection');
if (btnReset) {
  btnReset.addEventListener('click', () => {
    selectedCallsign = null;
    fetchFlightData();
  });
}

// Segmented Control Filters listeners
document.querySelectorAll('[data-alt]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('[data-alt]').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    activeAltFilter = e.target.getAttribute('data-alt');
    renderPlanes();
  });
});

document.querySelectorAll('[data-type]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('[data-type]').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    activeTypeFilter = e.target.getAttribute('data-type');
    renderPlanes();
  });
});

// Weather & ATC buttons & controls
document.getElementById('btn-weather')?.addEventListener('click', toggleWeather);

document.getElementById('btn-atc')?.addEventListener('click', () => {
  toggleATC();
  if (atcActive) {
    openAtcPanel();
  }
});

document.getElementById('btn-atc-panel-toggle')?.addEventListener('click', toggleAtcPanel);
document.getElementById('btn-close-atc-panel')?.addEventListener('click', closeAtcPanel);
document.getElementById('panel-btn-toggle')?.addEventListener('click', toggleATC);

document.getElementById('panel-volume')?.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  atcVolume = val / 100;
  if (atcAudio) {
    atcAudio.volume = atcVolume;
  }
  const label = document.getElementById('panel-vol-label');
  if (label) label.textContent = `${Math.round(val)}%`;
});

// Search Bar Handler
const searchInput = document.getElementById('flight-search');
const searchDropdown = document.getElementById('search-results');

searchInput?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toUpperCase();
  if (!q) {
    searchDropdown.classList.add('hidden');
    return;
  }

  const matches = latestStates.filter(p => 
    p.callsign.includes(q) || 
    p.country.toUpperCase().includes(q) || 
    p.icao24.toUpperCase().includes(q)
  );

  if (matches.length === 0) {
    searchDropdown.innerHTML = `<div class="search-item" style="color: #64748b;">Aucun vol trouvé</div>`;
  } else {
    searchDropdown.innerHTML = matches.slice(0, 8).map(p => `
      <div class="search-item" data-callsign="${p.callsign}">
        <span><strong>${p.callsign}</strong> (${p.country})</span>
        <span style="color: var(--hud-amber);">${formatAlt(p.alt)}</span>
      </div>
    `).join('');
  }
  searchDropdown.classList.remove('hidden');
});

searchDropdown?.addEventListener('click', (e) => {
  const item = e.target.closest('.search-item');
  if (item && item.dataset.callsign) {
    selectedCallsign = item.dataset.callsign;
    const plane = latestStates.find(p => p.callsign === selectedCallsign);
    if (plane) {
      map.flyTo([plane.lat, plane.lon], 11);
    }
    searchDropdown.classList.add('hidden');
    searchInput.value = '';
    renderPlanes();
  }
});

// Fetch Flight Data (Dynamic Bounding Box or Presets)
async function fetchFlightData() {
  try {
    let bbox = currentLoc.bbox;
    if (currentLoc.isDynamic || !bbox) {
      const bounds = map.getBounds();
      bbox = {
        lamin: Math.max(-85, bounds.getSouth()),
        lamax: Math.min(85, bounds.getNorth()),
        lomin: Math.max(-180, bounds.getWest()),
        lomax: Math.min(180, bounds.getEast())
      };
    }

    const { lamin, lomin, lamax, lomax } = bbox;
    const refLat = currentLoc.isDynamic ? map.getCenter().lat : currentLoc.lat;
    const refLon = currentLoc.isDynamic ? map.getCenter().lng : currentLoc.lon;

    let rawStates = [];

    // 1. Try our high-speed serverless proxy endpoint
    try {
      const url = `/api/states/all?lamin=${lamin.toFixed(3)}&lomin=${lomin.toFixed(3)}&lamax=${lamax.toFixed(3)}&lomax=${lomax.toFixed(3)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.states) && data.states.length > 0) {
          rawStates = data.states;
        }
      }
    } catch (e1) {
      console.warn('Proxy fetch failed, attempting direct ADS-B fallback:', e1);
    }

    // 2. Client-side direct fallback if proxy returned 0 planes or was blocked
    if (rawStates.length === 0) {
      try {
        const radiusNm = Math.min(250, Math.max(30, Math.round(calculateDistance(lamin, lomin, lamax, lomax) / 3.7)));
        const directUrl = `https://api.adsb.lol/v2/point/${refLat.toFixed(4)}/${refLon.toFixed(4)}/${radiusNm}`;
        const directRes = await fetch(directUrl);
        if (directRes.ok) {
          const directData = await directRes.json();
          const nowSec = Math.floor(Date.now() / 1000);
          rawStates = (directData.ac || [])
            .filter(a => a.lat != null && a.lon != null)
            .map(a => [
              (a.hex || '').toLowerCase(),
              (a.flight || a.r || 'UNKNOWN').trim(),
              'International',
              nowSec,
              nowSec,
              a.lon,
              a.lat,
              a.alt_baro === 'ground' ? 0 : (typeof a.alt_baro === 'number' ? Math.round(a.alt_baro * 0.3048) : null),
              a.alt_baro === 'ground',
              typeof a.gs === 'number' ? a.gs * 0.514444 : 0,
              a.track || 0,
              typeof a.baro_rate === 'number' ? a.baro_rate * 0.00508 : 0,
              null,
              a.alt_geom ? Math.round(a.alt_geom * 0.3048) : null,
              a.squawk || null,
              false,
              0
            ]);
        }
      } catch (e2) {
        console.warn('Direct ADS-B fallback also failed:', e2);
      }
    }

    // Parse plane states
    latestStates = rawStates.map(state => {
      const icao24 = state[0];
      const callsign = (state[1] || 'UNKNOWN').trim();
      const country = state[2] || 'N/A';
      const lon = state[5];
      const lat = state[6];
      const alt = state[13] != null ? state[13] : state[7];
      const on_ground = state[8];
      const velocity = state[9];
      const true_track = state[10];
      const vertical_rate = state[11];
      const squawk = state[14];

      if (lat == null || lon == null) return null;

      const dist = calculateDistance(refLat, refLon, lat, lon);

      // Append to flight trail history
      if (!flightTrails.has(icao24)) {
        flightTrails.set(icao24, []);
      }
      const trail = flightTrails.get(icao24);
      trail.push([lat, lon]);
      if (trail.length > 8) trail.shift();

      return {
        icao24, callsign, country, alt, velocity, dist, lat, lon,
        true_track, vertical_rate, on_ground, squawk
      };
    }).filter(Boolean);

    renderPlanes();
  } catch (err) {
    console.error('Error fetching flight data:', err);
  }
}

// Render plane markers with pooling & trails
function renderPlanes() {
  trailsLayer.clearLayers();

  const uiTotalPlanes = document.getElementById('total-planes');
  if (uiTotalPlanes) uiTotalPlanes.textContent = latestStates.length;

  let emergencyDetected = false;
  let closestPlane = null;
  let focusedPlane = null;
  let minDistance = Infinity;

  // Commercial Airlines prefix directory for global filtering
  const AIRLINE_PREFIXES = [
    'AFR', 'EZY', 'RYR', 'TVF', 'IBE', 'DLH', 'THY', 'BAW', 'KLM', 'SAS', 'FIN', 'TAP', 'WZZ',
    'DAL', 'AAL', 'UAL', 'SWA', 'JBU', 'ASA', 'FFT', 'SKW', 'ENY', 'RPA', 'EDV', 'UAE', 'QTR', 'ETD'
  ];

  // Filter planes
  const filtered = latestStates.filter(p => {
    if (p.squawk === '7700' || p.squawk === '7600') {
      emergencyDetected = true;
    }

    if (activeAltFilter === 'approach' && (p.alt == null || p.alt > 3000)) return false;
    if (activeAltFilter === 'cruise' && (p.alt == null || p.alt < 8000)) return false;

    const isCommercial = AIRLINE_PREFIXES.some(pre => p.callsign.startsWith(pre));
    if (activeTypeFilter === 'private' && isCommercial) return false;
    if (activeTypeFilter === 'airline' && !isCommercial) return false;

    return true;
  });

  const btnEmergency = document.getElementById('btn-emergency');
  if (btnEmergency) {
    btnEmergency.classList.toggle('alert', emergencyDetected);
    btnEmergency.querySelector('.btn-state').textContent = emergencyDetected ? 'ALERTE 7700' : 'NORMAL';
  }

  filtered.forEach(p => {
    if (p.dist < minDistance) {
      minDistance = p.dist;
      closestPlane = p;
    }
    if (selectedCallsign && p.callsign === selectedCallsign) {
      focusedPlane = p;
    }
  });

  if (!focusedPlane) {
    focusedPlane = closestPlane;
  }

  const currentIds = new Set();

  // High-performance Marker Pooling
  filtered.forEach(plane => {
    currentIds.add(plane.icao24);
    const isFocused = focusedPlane && plane.callsign === focusedPlane.callsign;

    // Draw Flight Trails
    const trail = flightTrails.get(plane.icao24);
    if (trail && trail.length > 1) {
      let trailColor = isFocused ? '#f59e0b' : 'rgba(56, 189, 248, 0.4)';
      if (currentVisionMode === 'midnight_gold') trailColor = isFocused ? '#ffb703' : 'rgba(229, 184, 78, 0.45)';
      else if (currentVisionMode === 'crt_vintage') trailColor = isFocused ? '#facc15' : 'rgba(74, 222, 128, 0.5)';
      else if (currentVisionMode === 'brutalist') trailColor = isFocused ? '#f59e0b' : 'rgba(255, 255, 255, 0.45)';

      const trailLine = L.polyline(trail, {
        color: trailColor,
        weight: isFocused ? 2 : 1.2,
        dashArray: '2, 4',
        opacity: isFocused ? 0.8 : 0.4
      });
      trailsLayer.addLayer(trailLine);
    }

    // Colors
    let planeColor = isFocused ? '#f59e0b' : '#e2e8f0';
    let strokeColor = isFocused ? '#78350f' : '#0f172a';

    if (currentVisionMode === 'midnight_gold') {
      planeColor = isFocused ? '#ffb703' : '#fef08a';
      strokeColor = isFocused ? '#78350f' : '#1e1b18';
    } else if (currentVisionMode === 'crt_vintage') {
      planeColor = isFocused ? '#facc15' : '#4ade80';
      strokeColor = isFocused ? '#713f12' : '#052e16';
    } else if (currentVisionMode === 'brutalist') {
      planeColor = isFocused ? '#f59e0b' : '#ffffff';
      strokeColor = '#000000';
    }

    const planeSize = calculateDynamicIconSize(isFocused, filtered.length);

    const iconHtml = `
      <div class="plane-rotator" style="transform: rotate(${plane.true_track || 0}deg);">
        ${getPlaneSvg(planeColor, strokeColor, isFocused, planeSize)}
      </div>
    `;

    if (activeMarkers.has(plane.icao24)) {
      // Re-use existing marker: update coordinates & rotation smoothly
      const marker = activeMarkers.get(plane.icao24);
      marker.setLatLng([plane.lat, plane.lon]);
      marker.setZIndexOffset(isFocused ? 1000 : 10);
      
      // If zoom level or focus state changed, update marker icon dimensions
      if (marker.currentSize !== planeSize || marker.isFocused !== isFocused || marker.visionMode !== currentVisionMode) {
        marker.setIcon(L.divIcon({
          html: iconHtml,
          className: `plane-icon ${isFocused ? 'selected closest' : ''}`,
          iconSize: [planeSize, planeSize],
          iconAnchor: [planeSize / 2, planeSize / 2]
        }));
        marker.currentSize = planeSize;
        marker.isFocused = isFocused;
        marker.visionMode = currentVisionMode;
      } else {
        const el = marker.getElement();
        if (el) {
          const rot = el.querySelector('.plane-rotator');
          if (rot) rot.style.transform = `rotate(${plane.true_track || 0}deg)`;
        }
      }
      marker.planeData = plane;
    } else {
      // Create new marker
      const icon = L.divIcon({
        html: iconHtml,
        className: `plane-icon ${isFocused ? 'selected closest' : ''}`,
        iconSize: [planeSize, planeSize],
        iconAnchor: [planeSize / 2, planeSize / 2]
      });

      const marker = L.marker([plane.lat, plane.lon], { icon, zIndexOffset: isFocused ? 1000 : 10 });
      marker.currentSize = planeSize;
      marker.isFocused = isFocused;
      marker.visionMode = currentVisionMode;
      marker.planeData = plane;

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        selectedCallsign = plane.callsign;
        renderPlanes();
      });

      // Popup
      const route = getEstimatedRoute(plane);
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="margin-bottom: 6px; font-size: 1.2rem; border-bottom: 1px solid var(--hud-amber);"><strong>${plane.callsign}</strong></div>
        <div style="margin-bottom: 4px;"><strong>Ligne:</strong> <span class="popup-route" style="color: #f59e0b;">${route.origin.code} ➔ ${route.destination.code}</span></div>
        <div style="margin-bottom: 4px;"><strong>Modèle:</strong> <span class="model-placeholder" style="color: #38ef7d;">Chargement...</span></div>
        <div><strong>Alt:</strong> ${formatAlt(plane.alt)}</div>
        <div><strong>Spd:</strong> ${formatSpeed(plane.velocity)}</div>
        <div><strong>Dist:</strong> ${plane.dist.toFixed(1)} km</div>
      `;
      marker.bindPopup(popupContent);

      marker.on('popupopen', async () => {
        fetchAircraftDetails(plane.icao24).then(details => {
          if (details) {
            const placeholder = popupContent.querySelector('.model-placeholder');
            if (placeholder) placeholder.textContent = details.model;
          }
        });
        fetchAircraftRoute(plane.callsign).then(realRoute => {
          if (realRoute) {
            const routeSpan = popupContent.querySelector('.popup-route');
            if (routeSpan) routeSpan.textContent = `${realRoute.origin.code} ➔ ${realRoute.destination.code} (Confirmé)`;
          }
        });
      });

      planesLayer.addLayer(marker);
      activeMarkers.set(plane.icao24, marker);
    }
  });

  // Remove markers of planes no longer in active zone
  for (const [icao, marker] of activeMarkers.entries()) {
    if (!currentIds.has(icao)) {
      planesLayer.removeLayer(marker);
      activeMarkers.delete(icao);
    }
  }

  // Focus UI & PFD updates
  if (focusedPlane) {
    updateFocusedPlaneUI(focusedPlane);
    const route = getEstimatedRoute(focusedPlane);
    drawFlightRoute(focusedPlane, route);
    drawPFD(focusedPlane);
    drawProfile(focusedPlane);
  } else {
    currentFocusedIcao = null;
    routeLayer.clearLayers();
    drawPFD(null);
    drawProfile(null);
    const uiClosestPlane = document.getElementById('closest-plane-info');
    if (uiClosestPlane) uiClosestPlane.innerHTML = `<div class="empty">Aucun appareil ne correspond aux filtres actifs</div>`;
    const headerCallsignPreview = document.getElementById('header-callsign-preview');
    if (headerCallsignPreview) headerCallsignPreview.textContent = '';
  }
}

let currentFocusedIcao = null;

async function updateFocusedPlaneUI(plane) {
  const uiClosestPlane = document.getElementById('closest-plane-info');
  if (!uiClosestPlane) return;

  const headerCallsignPreview = document.getElementById('header-callsign-preview');
  if (headerCallsignPreview) {
    headerCallsignPreview.textContent = plane.callsign || (plane.icao24 ? plane.icao24.toUpperCase() : '');
  }

  // If same plane already rendered, smoothly update live telemetry without rebuilding DOM or flickering
  if (currentFocusedIcao === plane.icao24) {
    const elAlt = document.getElementById('closest-alt');
    const elSpeed = document.getElementById('closest-speed');
    const elTrack = document.getElementById('closest-track');
    const elDist = document.getElementById('closest-dist');
    if (elAlt) elAlt.textContent = formatAlt(plane.alt);
    if (elSpeed) elSpeed.textContent = formatSpeed(plane.velocity);
    if (elTrack) elTrack.textContent = `${Math.round(plane.true_track || 0)}°`;
    if (elDist) elDist.textContent = `${plane.dist.toFixed(1)} km`;
    return;
  }

  currentFocusedIcao = plane.icao24;
  const key = (plane.icao24 || '').toLowerCase().trim();
  const cachedPhoto = photoCache.get(key);

  function renderCard(currentRoute) {
    const hasPhoto = Boolean(cachedPhoto);
    const photoBadgeText = cachedPhoto ? (cachedPhoto.isReal ? '📷 PHOTO RÉELLE' : '📷 ILLUSTRATION') : '📷 PHOTO RÉELLE';
    const photoBadgeClass = cachedPhoto && !cachedPhoto.isReal ? 'photo-tag-badge illustration' : 'photo-tag-badge';
    const photoCreditText = cachedPhoto ? (cachedPhoto.photographer ? `© ${cachedPhoto.photographer}` : (cachedPhoto.credit || 'Planespotters.net')) : '© Planespotters.net';

    uiClosestPlane.innerHTML = `
      <div class="closest-plane-details">
        <!-- Hero Header: Callsign & Flight Phase -->
        <div class="flight-hero-header">
          <div class="flight-callsign-badge">${plane.callsign}</div>
          <span class="flight-phase-badge ${currentRoute.phase.cssClass}">${currentRoute.phase.label}</span>
        </div>

        <!-- Aircraft Photo Card (Planespotters.net / Apple Style) -->
        <div class="plane-photo-card" id="plane-photo-card">
          <div class="photo-loading-placeholder ${hasPhoto ? 'hidden' : ''}" id="photo-loading" style="${hasPhoto ? 'display:none;' : ''}">
            <span class="photo-pulse-icon">📷</span>
            <span>Chargement de la photo...</span>
          </div>
          <a id="photo-link" href="${cachedPhoto?.link || '#'}" target="_blank" rel="noopener noreferrer" class="photo-link ${hasPhoto ? '' : 'hidden'}" style="${hasPhoto ? 'display:block;' : ''}" title="Voir la photo HD sur Planespotters.net">
            <img id="photo-img" class="photo-img" src="${cachedPhoto?.src || ''}" alt="Photo de l'appareil ${plane.callsign}" />
            <div class="photo-overlay">
              <span class="${photoBadgeClass}" id="photo-badge">${photoBadgeText}</span>
              <span class="photo-credit-text" id="photo-credit">${photoCreditText}</span>
            </div>
          </a>
        </div>

        <!-- Hero Route Card: Google Flights / Apple Maps Style -->
        <div class="route-hero-card" id="route-hero-card">
          <div class="route-airports-row">
            <div class="route-col origin-col">
              <span class="route-label">DÉPART</span>
              <span class="route-iata">${currentRoute.origin.code}</span>
              <span class="route-city-name">${currentRoute.origin.city}</span>
              <span class="route-airport-full" title="${currentRoute.origin.name}">${currentRoute.origin.name}</span>
            </div>

            <div class="route-flight-path">
              <div class="route-line-decor">
                <span class="decor-dot"></span>
                <span class="decor-line"></span>
                <span class="decor-plane">✈️</span>
                <span class="decor-line"></span>
                <span class="decor-dot"></span>
              </div>
              <span class="route-dist-eta">${Math.round(currentRoute.remainingDist)} km • ETA ${currentRoute.etaFormatted}</span>
            </div>

            <div class="route-col dest-col">
              <span class="route-label">ARRIVÉE</span>
              <span class="route-iata">${currentRoute.destination.code}</span>
              <span class="route-city-name">${currentRoute.destination.city}</span>
              <span class="route-airport-full" title="${currentRoute.destination.name}">${currentRoute.destination.name}</span>
            </div>
          </div>
        </div>

        <!-- 2x2 Apple Health / Weather Telemetry Grid -->
        <div class="telemetry-grid">
          <div class="metric-tile">
            <span class="metric-label">Altitude</span>
            <span id="closest-alt" class="metric-value">${formatAlt(plane.alt)}</span>
            <span class="metric-sub">${plane.vertical_rate ? (plane.vertical_rate > 0 ? '▲ Montée' : '▼ Descente') : 'En palier'}</span>
          </div>

          <div class="metric-tile">
            <span class="metric-label">Vitesse Sol</span>
            <span id="closest-speed" class="metric-value">${formatSpeed(plane.velocity)}</span>
            <span class="metric-sub">${Math.round((plane.velocity || 0) * 1.94384)} kts</span>
          </div>

          <div class="metric-tile">
            <span class="metric-label">Cap</span>
            <span id="closest-track" class="metric-value">${Math.round(plane.true_track || 0)}°</span>
            <span class="metric-sub">Orientation</span>
          </div>

          <div class="metric-tile">
            <span class="metric-label">Distance Hub</span>
            <span id="closest-dist" class="metric-value">${plane.dist.toFixed(1)} km</span>
            <span class="metric-sub">Position radiale</span>
          </div>

          <div class="metric-tile full-width">
            <span class="metric-label">Appareil & Opérateur</span>
            <span id="closest-model" class="metric-value" style="font-size: 0.95rem;">Recherche...</span>
            <span id="closest-operator" class="metric-sub">${plane.country}</span>
          </div>
        </div>
      </div>
    `;

    // If not already in cache, load photo asynchronously
    if (!hasPhoto) {
      fetchAircraftPhoto(plane.icao24, '').then(photoData => {
        if (currentFocusedIcao === plane.icao24) {
          applyPhotoToUI(photoData, plane);
        }
      });
    }
  }

  const initialRoute = getEstimatedRoute(plane);
  renderCard(initialRoute);

  // If route is estimated, query OpenSky API for real flight route asynchronously
  if (!initialRoute.isReal) {
    fetchAircraftRoute(plane.callsign).then(realRoute => {
      if (realRoute && currentFocusedIcao === plane.icao24) {
        const updatedRoute = getEstimatedRoute(plane);
        const elHero = document.getElementById('route-hero-card');
        if (elHero) {
          elHero.outerHTML = `
            <div class="route-hero-card" id="route-hero-card">
              <div class="route-airports-row">
                <div class="route-col origin-col">
                  <span class="route-label">DÉPART</span>
                  <span class="route-iata">${updatedRoute.origin.code}</span>
                  <span class="route-city-name">${updatedRoute.origin.city}</span>
                  <span class="route-airport-full" title="${updatedRoute.origin.name}">${updatedRoute.origin.name}</span>
                </div>

                <div class="route-flight-path">
                  <div class="route-line-decor">
                    <span class="decor-dot"></span>
                    <span class="decor-line"></span>
                    <span class="decor-plane">✈️</span>
                    <span class="decor-line"></span>
                    <span class="decor-dot"></span>
                  </div>
                  <span class="route-dist-eta">${Math.round(updatedRoute.remainingDist)} km • ETA ${updatedRoute.etaFormatted}</span>
                </div>

                <div class="route-col dest-col">
                  <span class="route-label">ARRIVÉE</span>
                  <span class="route-iata">${updatedRoute.destination.code}</span>
                  <span class="route-city-name">${updatedRoute.destination.city}</span>
                  <span class="route-airport-full" title="${updatedRoute.destination.name}">${updatedRoute.destination.name}</span>
                </div>
              </div>
            </div>
          `;
        }
        drawFlightRoute(plane, updatedRoute);
      }
    });
  }

  // Asynchronously query HexDB for aircraft model and operator
  fetchAircraftDetails(plane.icao24).then(details => {
    if (details && currentFocusedIcao === plane.icao24) {
      const elModel = document.getElementById('closest-model');
      const elOperator = document.getElementById('closest-operator');
      if (elModel) elModel.textContent = details.model;
      if (elOperator && details.operator) elOperator.textContent = details.operator;
      
      // If photo is not real, update fallback with precise aircraft model
      const currentPhoto = photoCache.get(key);
      if (!currentPhoto || !currentPhoto.isReal) {
        fetchAircraftPhoto(plane.icao24, details.model).then(photoData => {
          if (currentFocusedIcao === plane.icao24) {
            applyPhotoToUI(photoData, plane);
          }
        });
      }
    }
  });
}

// Collapsible Targeted Plane Panel logic (pliable vers le haut)
let isPanelCollapsed = false;
const targetedPanel = document.getElementById('targeted-plane-panel');
const btnToggleCollapse = document.getElementById('btn-toggle-collapse');
const collapseChevron = document.getElementById('collapse-chevron');
const collapseText = document.getElementById('collapse-text');
const targetedPanelHeader = document.getElementById('targeted-panel-header');

function togglePanelCollapse(e) {
  if (e && e.target && (e.target.id === 'btn-reset-selection' || e.target.closest('#btn-reset-selection'))) {
    return;
  }
  isPanelCollapsed = !isPanelCollapsed;
  if (targetedPanel) {
    targetedPanel.classList.toggle('collapsed', isPanelCollapsed);
  }
  if (collapseText) {
    collapseText.textContent = isPanelCollapsed ? 'DÉROULER' : 'PLIER';
  }
}

if (btnToggleCollapse) {
  btnToggleCollapse.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanelCollapse(e);
  });
}

if (targetedPanelHeader) {
  targetedPanelHeader.addEventListener('click', (e) => {
    togglePanelCollapse(e);
  });
}

// Refresh Timer
setInterval(() => {
  countdownTimer--;
  if (countdownTimer <= 0) {
    countdownTimer = REFRESH_INTERVAL;
    fetchFlightData();
  }
  const uiCountdown = document.getElementById('countdown');
  if (uiCountdown) uiCountdown.textContent = `${countdownTimer}s`;
}, 1000);

// Initial Load
populateAtcStationsDirectory();
updateAtcUI('OFF');
fetchFlightData();
fetchMETAR();
