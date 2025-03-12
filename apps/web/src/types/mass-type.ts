export type TimeUnit = 'second' | 'minute' | 'hour' | 'day';
export type VolumeUnit = 'liter' | 'cubicMeter';
export type MassUnit = 'kg';
export type ChemicalUnit = 'mol';
export type CalculationType = 'ideal' | 'real';
export type GasType = 'oxygen' | 'hydrogen';
export type ConditionType = 'oldSTP' | 'newSTP' | 'NTP' | 'normal';

export interface FlowValues {
  // 體積流量
  [key: string]: string
  literPerSecond: string
  literPerMinute: string
  literPerHour: string
  literPerDay: string
  cubicMeterPerSecond: string
  cubicMeterPerMinute: string
  cubicMeterPerHour: string
  cubicMeterPerDay: string
  // 質量流量
  kgPerSecond: string
  kgPerMinute: string
  kgPerHour: string
  kgPerDay: string
  // 化學流量
  molPerSecond: string
  molPerMinute: string
  molPerHour: string
  molPerDay: string
}
