// src/utils/pengRobinson.ts

/**
 * Calculates density using Peng-Robinson equation of state
 * @param temperature Temperature in Celsius
 * @param pressure Pressure in MPa
 * @param gasType Type of gas ('oxygen' or 'hydrogen')
 * @returns Density in g/L
 */
export function calculateDensityPR(
  temperature: number,
  pressure: number,
  gasType: 'oxygen' | 'hydrogen',
): number {
  // Constants
  const gasConstant = 8.31446261815324 // J/(mol·K)

  // Gas-specific properties
  let criticalTemperature: number // Critical temperature (K)
  let criticalPressure: number // Critical pressure (Pa)
  let acentricFactor: number // Acentric factor
  let molarMass: number // Molar mass (kg/mol)

  if (gasType === 'oxygen') {
    criticalTemperature = 154.6 // K
    criticalPressure = 5.04e6 // Pa
    acentricFactor = 0.022 // Acentric factor
    molarMass = 31.999e-3 // kg/mol
  } else {
    // hydrogen
    criticalTemperature = 33.2 // K
    criticalPressure = 1.31e6 // Pa
    acentricFactor = -0.216 // Acentric factor
    molarMass = 2.01588e-3 // kg/mol
  }

  // Convert temperature from Celsius to Kelvin
  const temperatureKelvin = temperature + 273.15

  // Convert pressure from MPa to Pa
  const pressurePascal = pressure * 1e6

  // Calculate reduced temperature
  const reducedTemperature = temperatureKelvin / criticalTemperature

  // Calculate kappa parameter
  const kappa = 0.37464 + 1.54226 * acentricFactor - 0.26992 * acentricFactor * acentricFactor

  // Calculate alpha parameter
  const alpha = Math.pow(1 + kappa * (1 - Math.sqrt(reducedTemperature)), 2)

  // Calculate a parameter
  const parameterA = ((0.45724 * gasConstant * gasConstant * criticalTemperature * criticalTemperature) / criticalPressure) * alpha

  // Calculate b parameter
  const parameterB = (0.0778 * gasConstant * criticalTemperature) / criticalPressure

  // Calculate dimensionless A and B parameters
  const dimensionlessA = (parameterA * pressurePascal) / (gasConstant * gasConstant * temperatureKelvin * temperatureKelvin)
  const dimensionlessB = (parameterB * pressurePascal) / (gasConstant * temperatureKelvin)

  // Solve cubic equation for compressibility factor Z
  const coefficients = [
    1.0,
    -(1.0 - dimensionlessB),
    dimensionlessA - 3.0 * dimensionlessB * dimensionlessB - 2.0 * dimensionlessB,
    -(dimensionlessA * dimensionlessB - dimensionlessB * dimensionlessB - dimensionlessB * dimensionlessB * dimensionlessB),
  ]
  const roots = solveCubic(coefficients)

  // Find the gas root (largest real root)
  const realRoots = roots
    .filter((r) => Math.abs(r.imag) < 1e-8)
    .map((r) => r.real)
  let compressibilityFactor: number

  if (realRoots.length > 0) {
    compressibilityFactor = Math.max(...realRoots)
  } else {
    // Fallback to ideal gas if no real roots
    compressibilityFactor = 1.0
  }

  // Calculate molar volume using ideal gas law as initial guess
  let molarVolume = ((gasConstant * temperatureKelvin) / pressurePascal) * compressibilityFactor

  // Use bisection method to find more accurate molar volume
  let volumeLow = parameterB + 1e-10
  let volumeHigh = ((gasConstant * temperatureKelvin) / pressurePascal) * compressibilityFactor

  if (volumeHigh < volumeLow) {
    volumeHigh = volumeLow * 1.1
  }

  const tolerance = 1e-10
  const maxIterations = 10000
  let converged = false

  const pressureFunction = (volume: number) =>
    pressurePascal - (gasConstant * temperatureKelvin) / (volume - parameterB) + parameterA / (volume * volume + 2 * parameterB * volume - parameterB * parameterB)

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const volumeMid = (volumeLow + volumeHigh) / 2
    const pressureMid = pressureFunction(volumeMid)

    if (Math.abs(pressureMid) < tolerance) {
      molarVolume = volumeMid
      converged = true
      break
    } else if (pressureMid > 0) {
      volumeHigh = volumeMid
    } else {
      volumeLow = volumeMid
    }
  }

  // If bisection didn't converge, use ideal gas approximation
  if (!converged) {
    molarVolume = Math.max((gasConstant * temperatureKelvin) / pressurePascal, volumeLow)
  }

  // Calculate density: rho = M / V (kg/m³)
  const densityKgM3 = molarMass / molarVolume

  // Convert to g/L: 1 kg/m³ = 1 g/L
  const densityGL = densityKgM3

  return densityGL
}

/**
 * Solves a cubic equation using Cardano's formula
 * @param coeffs Coefficients [a, b, c, d] for ax³ + bx² + cx + d = 0
 * @returns Array of complex roots
 */
function solveCubic(coefficients: number[]): { real: number; imag: number }[] {
  if (coefficients.length !== 4) {
    throw new Error('Cubic equation requires exactly 4 coefficients')
  }

  const [coeffA, coeffB, coeffC, coeffD] = coefficients

  if (
    coeffA === undefined ||
    coeffB === undefined ||
    coeffC === undefined ||
    coeffD === undefined
  ) {
    throw new Error('All coefficients must be defined')
  }

  // Normalize coefficients
  const normalizedA = coeffB / coeffA
  const normalizedB = coeffC / coeffA
  const normalizedC = coeffD / coeffA

  // Calculate discriminant
  const discriminantQ = (3 * normalizedB - normalizedA * normalizedA) / 9
  const discriminantR = (9 * normalizedA * normalizedB - 27 * normalizedC - 2 * normalizedA * normalizedA * normalizedA) / 54
  const discriminant = discriminantQ * discriminantQ * discriminantQ + discriminantR * discriminantR

  if (discriminant > 0) {
    // One real root, two complex roots
    const rootS = Math.cbrt(discriminantR + Math.sqrt(discriminant))
    const rootT = Math.cbrt(discriminantR - Math.sqrt(discriminant))
    const realRoot = rootS + rootT - normalizedA / 3
    const complexPart = (Math.sqrt(3) * (rootS - rootT)) / 2

    return [
      { real: realRoot, imag: 0 },
      { real: -(rootS + rootT) / 2 - normalizedA / 3, imag: complexPart },
      { real: -(rootS + rootT) / 2 - normalizedA / 3, imag: -complexPart },
    ]
  } else if (discriminant === 0) {
    // Three real roots, at least two are equal
    const rootS = Math.cbrt(discriminantR)
    const root1 = 2 * rootS - normalizedA / 3
    const root2 = -rootS - normalizedA / 3

    return [
      { real: root1, imag: 0 },
      { real: root2, imag: 0 },
      { real: root2, imag: 0 },
    ]
  } else {
    // Three distinct real roots
    const theta = Math.acos(discriminantR / Math.sqrt(-discriminantQ * discriminantQ * discriminantQ))
    const sqrtQ = Math.sqrt(-discriminantQ)

    const root1 = 2 * sqrtQ * Math.cos(theta / 3) - normalizedA / 3
    const root2 = 2 * sqrtQ * Math.cos((theta + 2 * Math.PI) / 3) - normalizedA / 3
    const root3 = 2 * sqrtQ * Math.cos((theta + 4 * Math.PI) / 3) - normalizedA / 3

    return [
      { real: root1, imag: 0 },
      { real: root2, imag: 0 },
      { real: root3, imag: 0 },
    ]
  }
}
