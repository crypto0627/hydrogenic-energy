// src/types/mass-flow-types.ts

export type CalculationType = 'ideal' | 'real'
export type GasType = 'oxygen' | 'hydrogen'
export type ConditionType = 'oldSTP' | 'ntp' | 'normal' | 'newSTP'

// Numeric types for temperature and pressure inputs
export type TemperatureValue = number // 0-100
export type PressureValue = number // 0.0-98.0

export type TimeUnit = 'second' | 'minute' | 'hour' | 'day'
export type VolumeUnit = 'liter' | 'cubicMeter'
export type MassUnit = 'kg'
export type ChemicalUnit = 'mol'

export interface FlowValues {
  literPerSecond: string
  literPerMinute: string
  literPerHour: string
  literPerDay: string
  cubicMeterPerSecond: string
  cubicMeterPerMinute: string
  cubicMeterPerHour: string
  cubicMeterPerDay: string
  kgPerSecond: string
  kgPerMinute: string
  kgPerHour: string
  kgPerDay: string
  molPerSecond: string
  molPerMinute: string
  molPerHour: string
  molPerDay: string
}

// Interface for gas properties structure
export interface GasProperty {
  molarMass: string
  density: {
    oldSTP?: string
    ntp?: string
    normal?: string
    newSTP?: string
    // Allow indexing by ConditionType string for dynamic access
    [key: string]: any
  }
}

// Interface for the overall gasProperties object
export interface GasProperties {
  oxygen: GasProperty
  hydrogen: GasProperty
  // Allows adding other gas types dynamically if needed
  [key: string]: GasProperty
}
