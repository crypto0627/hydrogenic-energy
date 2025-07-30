// src/types/mass-flow-types.ts

export type CalculationType = 'ideal' | 'real';
export type GasType = 'oxygen' | 'hydrogen';
export type ConditionType = 'oldSTP' | 'NTP' | 'normal' | 'newSTP';

// Specific keys for pressure and temperature options
export type PressureKey = '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '20' | '35' | '45' | '70' | '90' | '98';
export type TemperatureKey = '0' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90' | '100';

export type TimeUnit = 'second' | 'minute' | 'hour' | 'day';
export type VolumeUnit = 'liter' | 'cubicMeter';
export type MassUnit = 'kg';
export type ChemicalUnit = 'mol';

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
    real: {
      [P in PressureKey]: {
        [T in TemperatureKey]: string;
      };
    }
    oldSTP?: string
    NTP?: string
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