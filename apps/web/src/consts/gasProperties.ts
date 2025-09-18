// src/consts/gasProperties.ts

import { GasProperties } from '@/types/mass-type'

export const gasProperties: GasProperties = {
  oxygen: {
    molarMass: '31.9988',
    density: {
      oldSTP: '1.429', // density at 0°C, 1 atm
      ntp: '1.331', // density at 20°C, 1 atm
      normal: '1.429', // density at 0°C, 1 atm (replicated, adjust if different standard)
      newSTP: '1.429', // density at 0°C, 100 kPa (replicated, adjust if different standard)
    },
  },
  hydrogen: {
    molarMass: '2.01588',
    density: {
      oldSTP: '0.08988',
      ntp: '0.08375',
      normal: '0.08988',
      newSTP: '0.08988',
    },
  },
}
