// src/consts/mass-flow-constants.ts

import { ChemicalUnit, MassUnit, TimeUnit, VolumeUnit } from '@/types/mass-type'

export const timeConversionFactors: Record<TimeUnit, number> = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
}

export const volumeConversionFactors: Record<VolumeUnit, number> = {
  liter: 1,
  cubicMeter: 1000,
}

export const massConversionFactors: Record<MassUnit, number> = {
  kg: 1,
}

export const timeUnitLabels: Record<TimeUnit, string> = {
  second: '/ 秒',
  minute: '/ 分鐘',
  hour: '/ 小時',
  day: '/ 天',
}

export const volumeUnitLabels: Record<VolumeUnit, string> = {
  liter: 'L',
  cubicMeter: 'm³',
}

export const massUnitLabels: Record<MassUnit, string> = {
  kg: 'kg',
}

export const chemicalUnitLabels: Record<ChemicalUnit, string> = {
  mol: 'mol',
}
