// Simple risk calculation for updating sample data
// Based on concentration risk and operational factors

const directors = [
  { id: 'DIR_01', name: 'Jabulani Zuma', boards: 2, hasAdverseMedia: true },
  { id: 'DIR_02', name: 'Pieter van der Merwe', boards: 2, hasAdverseMedia: false },
  { id: 'DIR_03', name: 'Naledi Molefe', boards: 2, hasAdverseMedia: false },
  { id: 'DIR_04', name: 'Sipho Ndlovu', boards: 4, hasAdverseMedia: true }, // MAJOR CONCENTRATION RISK
  { id: 'DIR_05', name: 'Liam O\'Connell', boards: 2, hasAdverseMedia: false },
  { id: 'DIR_06', name: 'Fatima Khan', boards: 3, hasAdverseMedia: false }, // SECONDARY CONCENTRATION RISK
  { id: 'DIR_07', name: 'Thabo Mthembu', boards: 2, hasAdverseMedia: false },
  { id: 'DIR_08', name: 'Sarah Mitchell', boards: 2, hasAdverseMedia: false },
  { id: 'DIR_09', name: 'Ahmed Hassan', boards: 1, hasAdverseMedia: false },
  { id: 'DIR_10', name: 'Nomsa Dlamini', boards: 1, hasAdverseMedia: false }
];

const suppliers = [
  { id: 'SUP_101', name: 'Rustenburg Explosives Inc.', baseRisk: 74, directors: ['DIR_01', 'DIR_04'], contractValue: 50000000, geographicRisk: 'high' },
  { id: 'SUP_102', name: 'Marikana Heavy Machinery Lease', baseRisk: 74, directors: ['DIR_02', 'DIR_04'], contractValue: 75000000, geographicRisk: 'high' },
  { id: 'SUP_103', name: 'Limpopo Logistix', baseRisk: 66, directors: ['DIR_04', 'DIR_06'], contractValue: 30000000, geographicRisk: 'high' },
  { id: 'SUP_104', name: 'North West Mining Supplies', baseRisk: 69, directors: ['DIR_01', 'DIR_04'], contractValue: 45000000, geographicRisk: 'high' },
  { id: 'SUP_105', name: 'Platinum Province Chemicals', baseRisk: 73, directors: ['DIR_02', 'DIR_05'], contractValue: 65000000, geographicRisk: 'high' },
  { id: 'SUP_201', name: 'Gauteng Gold Refiners', baseRisk: 60, directors: ['DIR_03', 'DIR_06'], contractValue: 120000000, geographicRisk: 'medium' },
  { id: 'SUP_202', name: 'West Rand Water Purification', baseRisk: 47, directors: ['DIR_05', 'DIR_06'], contractValue: 25000000, geographicRisk: 'medium' },
  { id: 'SUP_203', name: 'Johannesburg Engineering Services', baseRisk: 42, directors: ['DIR_03', 'DIR_06'], contractValue: 85000000, geographicRisk: 'medium' },
  { id: 'SUP_301', name: 'Welkom Safety Gear Pty Ltd', baseRisk: 22, directors: ['DIR_07'], contractValue: 15000000, geographicRisk: 'low' },
  { id: 'SUP_302', name: 'Free State Catering Co.', baseRisk: 25, directors: ['DIR_08'], contractValue: 8000000, geographicRisk: 'low' },
  { id: 'SUP_303', name: 'Free State Transportation Hub', baseRisk: 28, directors: ['DIR_07', 'DIR_08'], contractValue: 18000000, geographicRisk: 'low' },
  { id: 'SUP_401', name: 'Cape Town Tech Solutions', baseRisk: 33, directors: ['DIR_09'], contractValue: 22000000, geographicRisk: 'medium' },
  { id: 'SUP_402', name: 'Independent Security Services', baseRisk: 50, directors: ['DIR_10'], contractValue: 38000000, geographicRisk: 'medium' }
];

// Calculate concentration penalty
function getConcentrationPenalty(boardCount) {
  if (boardCount >= 4) return 20;
  if (boardCount === 3) return 12;
  if (boardCount === 2) return 5;
  return 0;
}

// Calculate geographic multiplier
function getGeographicMultiplier(risk) {
  if (risk === 'high') return 1.15;
  if (risk === 'medium') return 1.05;
  return 1.0;
}

// Calculate contract value multiplier
function getContractMultiplier(value) {
  if (value > 100000000) return 1.1;
  if (value > 50000000) return 1.05;
  return 1.0;
}

// Calculate supplier risks
console.log('=== UPDATED SUPPLIER RISK SCORES ===');
suppliers.forEach(supplier => {
  let riskScore = supplier.baseRisk;
  
  // Apply geographic multiplier
  riskScore *= getGeographicMultiplier(supplier.geographicRisk);
  
  // Apply contract value multiplier
  riskScore *= getContractMultiplier(supplier.contractValue);
  
  // Apply concentration penalties from directors
  supplier.directors.forEach(directorId => {
    const director = directors.find(d => d.id === directorId);
    if (director) {
      riskScore += getConcentrationPenalty(director.boards);
      if (director.hasAdverseMedia) riskScore += 5;
    }
  });
  
  // Network effect for suppliers with shared directors
  const sharedDirectorCount = suppliers.filter(s => 
    s.id !== supplier.id && 
    s.directors.some(dirId => supplier.directors.includes(dirId))
  ).length;
  
  if (sharedDirectorCount > 0) {
    riskScore *= 1.05; // 5% network effect
  }
  
  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));
  
  const riskLevel = riskScore >= 75 ? 'Critical' : riskScore >= 50 ? 'High' : riskScore >= 25 ? 'Medium' : 'Low';
  
  console.log(`${supplier.name}: ${riskScore}% (${riskLevel})`);
});

console.log('\n=== UPDATED DIRECTOR RISK SCORES ===');
directors.forEach(director => {
  const associatedSuppliers = suppliers.filter(s => s.directors.includes(director.id));
  
  if (associatedSuppliers.length === 0) {
    console.log(`${director.name}: 0% (No suppliers)`);
    return;
  }
  
  // Average risk of associated suppliers
  const avgSupplierRisk = associatedSuppliers.reduce((sum, s) => sum + s.baseRisk, 0) / associatedSuppliers.length;
  
  let riskScore = avgSupplierRisk;
  
  // Concentration penalty
  riskScore += getConcentrationPenalty(director.boards);
  
  // Network effect for multiple high-risk suppliers
  const highRiskSuppliers = associatedSuppliers.filter(s => s.baseRisk > 60);
  if (highRiskSuppliers.length > 1) {
    riskScore *= (1 + (highRiskSuppliers.length - 1) * 0.15);
  }
  
  // Contract value exposure
  const totalContractValue = associatedSuppliers.reduce((sum, s) => sum + s.contractValue, 0);
  riskScore *= getContractMultiplier(totalContractValue);
  
  // Adverse media penalty
  if (director.hasAdverseMedia) riskScore += 8;
  
  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));
  
  const riskLevel = riskScore >= 75 ? 'Critical' : riskScore >= 50 ? 'High' : riskScore >= 25 ? 'Medium' : 'Low';
  const isConcentrationRisk = director.boards >= 3;
  
  console.log(`${director.name}: ${riskScore}% (${riskLevel}) - ${director.boards} boards ${isConcentrationRisk ? '⚠️' : ''}`);
});