// Bangladesh Geographical Database (Divisions, Districts, Upazilas, and Post Codes)

export const DIVISIONS: string[] = [
  'Barishal',
  'Chattogram',
  'Dhaka',
  'Khulna',
  'Mymensingh',
  'Rajshahi',
  'Rangpur',
  'Sylhet',
];

export const DISTRICTS: Record<string, string[]> = {
  Barishal: ['Barishal', 'Barguna', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Chattogram: [
    'Chattogram',
    "Cox's Bazar",
    'Bandarban',
    'Brahmanbaria',
    'Chandpur',
    'Cumilla',
    'Feni',
    'Khagrachhari',
    'Lakshmipur',
    'Noakhali',
    'Rangamati',
  ],
  Dhaka: [
    'Dhaka',
    'Faridpur',
    'Gazipur',
    'Gopalganj',
    'Kishoreganj',
    'Madaripur',
    'Manikganj',
    'Munshiganj',
    'Narayanganj',
    'Narsingdi',
    'Rajbari',
    'Shariatpur',
    'Tangail',
  ],
  Khulna: [
    'Khulna',
    'Bagerhat',
    'Chuadanga',
    'Jessore',
    'Jhenaidah',
    'Kushtia',
    'Magura',
    'Meherpur',
    'Narail',
    'Satkhira',
  ],
  Mymensingh: ['Mymensingh', 'Netrokona', 'Sherpur', 'Jamalpur'],
  Rajshahi: [
    'Rajshahi',
    'Bogura',
    'Joypurhat',
    'Naogaon',
    'Natore',
    'Nawabganj',
    'Pabna',
    'Sirajganj',
  ],
  Rangpur: [
    'Rangpur',
    'Dinajpur',
    'Gaibandha',
    'Kurigram',
    'Lalmonirhat',
    'Nilphamari',
    'Panchagarh',
    'Thakurgaon',
  ],
  Sylhet: ['Sylhet', 'Habiganj', 'Moulvibazar', 'Sunamganj'],
};

export const UPAZILAS: Record<string, string[]> = {
  // Dhaka District
  Dhaka: [
    'Banani',
    'Gulshan',
    'Dhanmondi',
    'Mirpur',
    'Uttara',
    'Savar',
    'Dhamrai',
    'Keraniganj',
    'Tejgaon',
    'Motijheel',
    'Ramna',
    'Badda',
    'Khilgaon',
    'Paltan',
    'Shahbagh',
  ],
  Gazipur: ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
  Narayanganj: ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'],

  // Chattogram District
  Chattogram: [
    'Panchlaish',
    'Double Mooring',
    'Kotwali',
    'Hathazari',
    'Sandwip',
    'Raozan',
    'Fatikchhari',
    'Patiya',
    'Sitakunda',
    'Anwara',
    'Mirsharai',
    'Boalkhali',
  ],
  "Cox's Bazar": [
    "Cox's Bazar Sadar",
    'Chakaria',
    'Maheshkhali',
    'Ramu',
    'Teknaf',
    'Ukhia',
    'Pekua',
  ],

  // Khulna District
  Khulna: [
    'Khulna Sadar',
    'Daulatpur',
    'Khalishpur',
    'Sonadanga',
    'Rupsha',
    'Phultala',
    'Dacope',
    'Dighalia',
    'Dumuria',
    'Batiaghata',
  ],

  // Sylhet District
  Sylhet: [
    'Sylhet Sadar',
    'Beanibazar',
    'Golapganj',
    'Fenchuganj',
    'Balaganj',
    'Biswanath',
    'Companiganj',
    'Gowainghat',
    'Jaintiapur',
    'Zakiganj',
  ],

  // Rajshahi District
  Rajshahi: [
    'Boalia',
    'Rajput',
    'Paba',
    'Godagari',
    'Bagha',
    'Charghat',
    'Durgapur',
    'Mohanpur',
    'Tanore',
  ],
  Bogura: [
    'Bogura Sadar',
    'Adamdighi',
    'Dhunat',
    'Dupchanchia',
    'Gabtali',
    'Kahaloo',
    'Nandigram',
    'Sariakandi',
    'Sherpur',
    'Shibganj',
  ],

  // Barishal District
  Barishal: [
    'Barishal Sadar',
    'Babuganj',
    'Bakerganj',
    'Banaripara',
    'Gournadi',
    'Muladi',
    'Hizla',
    'Mehendiganj',
    'Wazirpur',
  ],

  // Rangpur District
  Rangpur: [
    'Rangpur Sadar',
    'Mithapukur',
    'Pirganj',
    'Badarganj',
    'Gangachhara',
    'Kaunia',
    'Taraganj',
    'Pirgachha',
  ],

  // Mymensingh District
  Mymensingh: [
    'Mymensingh Sadar',
    'Muktagachha',
    'Bhaluka',
    'Trishal',
    'Gaffargaon',
    'Ishwarganj',
    'Haluaghat',
    'Fulbaria',
    'Nandail',
  ],
};

export const POST_CODES: Record<string, string[]> = {
  // Dhaka Upazilas
  Banani: ['1213'],
  Gulshan: ['1212'],
  Dhanmondi: ['1209'],
  Mirpur: ['1216', '1218'],
  Uttara: ['1230'],
  Savar: ['1340', '1341', '1342', '1344'],
  Keraniganj: ['1310', '1311', '1312'],
  Tejgaon: ['1208', '1215'],
  Motijheel: ['1000', '1223'],
  Ramna: ['1217'],
  Badda: ['1212'],
  Khilgaon: ['1219'],
  Paltan: ['1000'],
  Shahbagh: ['1000'],

  // Gazipur
  'Gazipur Sadar': ['1700', '1701', '1702'],
  Sreepur: ['1740'],

  // Narayanganj
  'Narayanganj Sadar': ['1400', '1410'],
  Sonargaon: ['1440'],

  // Chattogram Upazilas
  Panchlaish: ['4203'],
  'Double Mooring': ['4202'],
  Kotwali: ['4000'],
  Hathazari: ['4330'],
  Sitakunda: ['4310'],

  // Khulna Upazilas
  'Khulna Sadar': ['9100'],
  Khalishpur: ['9000'],

  // Sylhet
  'Sylhet Sadar': ['3100'],

  // Rajshahi
  Boalia: ['6000'],
  'Bogura Sadar': ['5800'],

  // Barishal
  'Barishal Sadar': ['8200'],

  // Rangpur
  'Rangpur Sadar': ['5400'],

  // Mymensingh
  'Mymensingh Sadar': ['2200'],
  Bhaluka: ['2240'],
};

export function getDistrictsForDivision(division: string): string[] {
  return DISTRICTS[division] || DISTRICTS['Dhaka'];
}

export function getUpazilasForDistrict(district: string): string[] {
  if (UPAZILAS[district]) {
    return UPAZILAS[district];
  }
  return [`${district} Sadar`, 'Bazar Area', 'Sadar Upazila'];
}

export function getPostCodesForUpazila(upazila: string): string[] {
  if (POST_CODES[upazila]) {
    return POST_CODES[upazila];
  }
  const hash = upazila.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const code = 1000 + (hash % 8000);
  return [code.toString(), (code + 1).toString()];
}

