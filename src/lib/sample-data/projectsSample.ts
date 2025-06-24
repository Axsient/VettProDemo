import { MiningProject } from '@/types/vetting';

// Comprehensive sample mining projects across South Africa
export const sampleMiningProjects: MiningProject[] = [
  // Platinum Projects
  {
    id: 'proj_SB001',
    name: 'Marikana K4 Expansion',
    location: 'Marikana, North West Province',
    clientCompany: 'Sibanye Stillwater',
    status: 'Active',
    startDate: '2023-03-15',
    endDate: '2025-12-31'
  },
  {
    id: 'proj_AA005',
    name: 'Mogalakwena North Pit Extension',
    location: 'Mokopane, Limpopo Province',
    clientCompany: 'Anglo American Platinum',
    status: 'Active',
    startDate: '2023-08-01',
    endDate: '2026-06-30'
  },
  {
    id: 'proj_IMP003',
    name: 'Impala Rustenburg Shaft Modernization',
    location: 'Rustenburg, North West Province',
    clientCompany: 'Impala Platinum Holdings',
    status: 'Active',
    startDate: '2023-01-10',
    endDate: '2024-11-30'
  },
  {
    id: 'proj_NOR001',
    name: 'Booysendal North Development',
    location: 'Steelpoort, Limpopo Province',
    clientCompany: 'Northam Platinum',
    status: 'Planned',
    startDate: '2024-04-01',
    endDate: '2027-03-31'
  },

  // Coal Projects
  {
    id: 'proj_EXX002',
    name: 'Grootegeluk Coal Mine Operations',
    location: 'Lephalale, Limpopo Province',
    clientCompany: 'Exxaro Resources',
    status: 'Active',
    startDate: '2022-06-01',
    endDate: '2025-05-31'
  },
  {
    id: 'proj_SAS004',
    name: 'Khwezela Colliery Expansion',
    location: 'Kliprivier, KwaZulu-Natal Province',
    clientCompany: 'Sasol Mining',
    status: 'Active',
    startDate: '2023-09-15',
    endDate: '2026-08-31'
  },
  {
    id: 'proj_GLN001',
    name: 'Optimum Coal Mine Rehabilitation',
    location: 'Hendrina, Mpumalanga Province',
    clientCompany: 'Glencore Operations SA',
    status: 'Active',
    startDate: '2023-05-01',
    endDate: '2024-12-31'
  },
  {
    id: 'proj_THU002',
    name: 'Landau Colliery Operations',
    location: 'Kromdraai, Mpumalanga Province',
    clientCompany: 'Thungela Resources',
    status: 'Active',
    startDate: '2023-02-01',
    endDate: '2025-01-31'
  },

  // Iron Ore Projects
  {
    id: 'proj_KUM001',
    name: 'Sishen Iron Ore Mine Expansion',
    location: 'Sishen, Northern Cape Province',
    clientCompany: 'Kumba Iron Ore',
    status: 'Active',
    startDate: '2023-04-01',
    endDate: '2026-03-31'
  },
  {
    id: 'proj_KUM002',
    name: 'Kolomela Mine Infrastructure Upgrade',
    location: 'Postmasburg, Northern Cape Province',
    clientCompany: 'Kumba Iron Ore',
    status: 'Active',
    startDate: '2023-07-15',
    endDate: '2025-06-30'
  },

  // Gold Projects
  {
    id: 'proj_SB002',
    name: 'Driefontein Operations Modernization',
    location: 'Carletonville, Gauteng Province',
    clientCompany: 'Sibanye Stillwater',
    status: 'Active',
    startDate: '2023-06-01',
    endDate: '2025-05-31'
  },
  {
    id: 'proj_SB003',
    name: 'Kloof Gold Mine Shaft Extension',
    location: 'Westonaria, Gauteng Province',
    clientCompany: 'Sibanye Stillwater',
    status: 'Planned',
    startDate: '2024-08-01',
    endDate: '2027-07-31'
  },
  {
    id: 'proj_AGH001',
    name: 'Mponeng Mine Deep Level Access',
    location: 'Carletonville, Gauteng Province',
    clientCompany: 'AngloGold Ashanti',
    status: 'Active',
    startDate: '2023-01-15',
    endDate: '2024-12-31'
  },
  {
    id: 'proj_HAR001',
    name: 'Doornkop South Reef Project',
    location: 'Soweto, Gauteng Province',
    clientCompany: 'Harmony Gold Mining',
    status: 'Active',
    startDate: '2023-10-01',
    endDate: '2026-09-30'
  },

  // Manganese Projects
  {
    id: 'proj_SMN001',
    name: 'Hotazel Manganese Mine Expansion',
    location: 'Hotazel, Northern Cape Province',
    clientCompany: 'South32 Manganese',
    status: 'Active',
    startDate: '2023-03-01',
    endDate: '2025-02-28'
  },
  {
    id: 'proj_AMS001',
    name: 'Black Rock Mine Operations',
    location: 'Kuruman, Northern Cape Province',
    clientCompany: 'African Rainbow Minerals',
    status: 'Active',
    startDate: '2023-11-01',
    endDate: '2026-10-31'
  },

  // Chrome Projects
  {
    id: 'proj_SAM001',
    name: 'Dwarsrivier Chrome Mine',
    location: 'Steelpoort, Limpopo Province',
    clientCompany: 'Samancor Chrome',
    status: 'Active',
    startDate: '2023-05-15',
    endDate: '2025-04-30'
  },
  {
    id: 'proj_ASA001',
    name: 'Thorncliffe Chrome Operations',
    location: 'Brits, North West Province',
    clientCompany: 'ASA Metals',
    status: 'Planned',
    startDate: '2024-02-01',
    endDate: '2026-01-31'
  },

  // Zinc Projects
  {
    id: 'proj_VED001',
    name: 'Gamsberg Zinc Mine Development',
    location: 'Aggeneys, Northern Cape Province',
    clientCompany: 'Vedanta Zinc International',
    status: 'Active',
    startDate: '2023-09-01',
    endDate: '2026-08-31'
  },

  // Copper Projects
  {
    id: 'proj_PAL001',
    name: 'Palabora Copper Mine Modernization',
    location: 'Phalaborwa, Limpopo Province',
    clientCompany: 'Palabora Mining Company',
    status: 'Active',
    startDate: '2023-12-01',
    endDate: '2025-11-30'
  },

  // Diamond Projects
  {
    id: 'proj_DBM001',
    name: 'Venetia Diamond Mine Underground',
    location: 'Musina, Limpopo Province',
    clientCompany: 'De Beers Consolidated Mines',
    status: 'Active',
    startDate: '2022-01-01',
    endDate: '2024-12-31'
  },
  {
    id: 'proj_DBM002',
    name: 'Voorspoed Diamond Operations',
    location: 'Kroonstad, Free State Province',
    clientCompany: 'De Beers Consolidated Mines',
    status: 'Active',
    startDate: '2023-07-01',
    endDate: '2025-06-30'
  },

  // Multi-Commodity Projects
  {
    id: 'proj_ARM001',
    name: 'Two Rivers Platinum Mine Extension',
    location: 'Burgersfort, Limpopo Province',
    clientCompany: 'African Rainbow Minerals',
    status: 'Active',
    startDate: '2023-08-15',
    endDate: '2026-07-31'
  },
  {
    id: 'proj_LHD001',
    name: 'Thabazimbi Iron Ore Project',
    location: 'Thabazimbi, Limpopo Province',
    clientCompany: 'Ledjadja Holdings',
    status: 'Planned',
    startDate: '2024-06-01',
    endDate: '2027-05-31'
  }
];

// Utility functions for project data
export function getProjectsByStatus(status: MiningProject['status']): MiningProject[] {
  return sampleMiningProjects.filter(project => project.status === status);
}

export function getProjectsByCompany(company: string): MiningProject[] {
  return sampleMiningProjects.filter(project => 
    project.clientCompany.toLowerCase().includes(company.toLowerCase())
  );
}

export function getProjectsByLocation(province: string): MiningProject[] {
  return sampleMiningProjects.filter(project => 
    project.location.toLowerCase().includes(province.toLowerCase())
  );
}

export function getActiveProjects(): MiningProject[] {
  return getProjectsByStatus('Active');
}

export function getPlannedProjects(): MiningProject[] {
  return getProjectsByStatus('Planned');
}

export function getCompletedProjects(): MiningProject[] {
  return getProjectsByStatus('Completed');
}

// Get unique client companies
export function getUniqueClientCompanies(): string[] {
  const companies = sampleMiningProjects.map(project => project.clientCompany);
  return [...new Set(companies)].sort();
}

// Get unique provinces from project locations
export function getProjectProvinces(): string[] {
  const provinces = sampleMiningProjects.map(project => {
    const parts = project.location.split(',');
    return parts[parts.length - 1].trim();
  });
  return [...new Set(provinces)].sort();
}

// Project statistics
export function getProjectStats() {
  const total = sampleMiningProjects.length;
  const active = getActiveProjects().length;
  const planned = getPlannedProjects().length;
  const completed = getCompletedProjects().length;
  
  return {
    total,
    active,
    planned,
    completed,
    companies: getUniqueClientCompanies().length,
    provinces: getProjectProvinces().length
  };
}

// Simulated API function
export async function getMiningProjectsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return {
    projects: sampleMiningProjects,
    stats: getProjectStats(),
    companies: getUniqueClientCompanies(),
    provinces: getProjectProvinces()
  };
}