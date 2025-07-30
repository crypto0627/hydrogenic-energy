// src/hooks/useMassFlowConverter.ts

import { gasProperties } from '@/consts/gasProperties'
import {
  chemicalUnitLabels,
  massConversionFactors,
  massUnitLabels,
  pressureOptions,
  temperatureOptions,
  timeConversionFactors,
  timeUnitLabels,
  volumeConversionFactors,
  volumeUnitLabels,
} from '@/consts/mass-flow-constants'
import {
  CalculationType,
  ChemicalUnit,
  ConditionType,
  FlowValues,
  GasType,
  MassUnit,
  PressureKey,
  TemperatureKey,
  TimeUnit,
  VolumeUnit,
} from '@/types/mass-type'
import { useEffect, useRef, useState } from 'react'

export function useMassFlowConverter() {
  const [calculationType, setCalculationType] = useState<CalculationType>('ideal')
  const [gasType, setGasType] = useState<GasType>('oxygen')
  const [conditionType, setConditionType] = useState<ConditionType>('oldSTP')
  const [temperature, setTemperature] = useState<TemperatureKey>('0')
  const [pressure, setPressure] = useState<PressureKey>('1')

  const [temperatureDropdownOpen, setTemperatureDropdownOpen] = useState(false)
  const [pressureDropdownOpen, setPressureDropdownOpen] = useState(false)

  const temperatureDropdownRef = useRef<HTMLDivElement>(null)
  const pressureDropdownRef = useRef<HTMLDivElement>(null)

  const [density, setDensity] = useState<string>(
    gasProperties[gasType].density[conditionType] ?? '',
  )
  const [molarMass, setMolarMass] = useState<string>(
    gasProperties[gasType].molarMass ?? '',
  )
  const [values, setValues] = useState<FlowValues>({
    literPerSecond: '',
    literPerMinute: '',
    literPerHour: '',
    literPerDay: '',
    cubicMeterPerSecond: '',
    cubicMeterPerMinute: '',
    cubicMeterPerHour: '',
    cubicMeterPerDay: '',
    kgPerSecond: '',
    kgPerMinute: '',
    kgPerHour: '',
    kgPerDay: '',
    molPerSecond: '',
    molPerMinute: '',
    molPerHour: '',
    molPerDay: '',
  })

  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (temperatureDropdownRef.current && !temperatureDropdownRef.current.contains(event.target as Node)) {
        setTemperatureDropdownOpen(false)
      }
      if (pressureDropdownRef.current && !pressureDropdownRef.current.contains(event.target as Node)) {
        setPressureDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Effect to update density based on gas type, calculation type, and conditions
  useEffect(() => {
    if (calculationType === 'real' && gasType === 'hydrogen') {
      const realDensity =
        gasProperties.hydrogen?.density?.real?.[pressure]?.[temperature]
      setDensity(realDensity ?? '')
    } else {
      const densityValue = gasProperties[gasType]?.density?.[conditionType]
      setDensity(densityValue ?? '')
    }
  }, [calculationType, gasType, conditionType, temperature, pressure])

  // Resets all flow values to empty strings
  const resetValues = () => {
    setValues({
      literPerSecond: '',
      literPerMinute: '',
      literPerHour: '',
      literPerDay: '',
      cubicMeterPerSecond: '',
      cubicMeterPerMinute: '',
      cubicMeterPerHour: '',
      cubicMeterPerDay: '',
      kgPerSecond: '',
      kgPerMinute: '',
      kgPerHour: '',
      kgPerDay: '',
      molPerSecond: '',
      molPerMinute: '',
      molPerHour: '',
      molPerDay: '',
    })
  }

  // Handles changing the calculation type
  const handleCalculationTypeChange = (type: CalculationType) => {
    setCalculationType(type)
    resetValues()
  }

  // Handles changing the gas type
  const handleGasTypeChange = (type: GasType) => {
    setGasType(type)
    setMolarMass(gasProperties[type].molarMass)
    resetValues()
  }

  // Handles changing the condition type
  const handleConditionTypeChange = (type: ConditionType) => {
    setConditionType(type)
    resetValues()
  }

  // Handles changing the temperature for real gas calculations
  const handleTemperatureChange = (temp: TemperatureKey) => {
    setTemperature(temp)
    setTemperatureDropdownOpen(false)
    resetValues()
  }

  // Handles changing the pressure for real gas calculations
  const handlePressureChange = (pres: PressureKey) => {
    setPressure(pres)
    setPressureDropdownOpen(false)
    resetValues()
  }

  // Central function to calculate all unit conversions based on a single input
  const calculateAll = (value: string, unit: keyof FlowValues) => {
    if (value === '') {
      resetValues()
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    const newValues: FlowValues = { ...values }
    newValues[unit] = value // Set the input unit's value first

    const densityValue = parseFloat(density)
    const molarMassValue = parseFloat(molarMass)

    if (isNaN(densityValue) || isNaN(molarMassValue)) {
      console.error('Density or Molar Mass is not a valid number.')
      return
    }

    let unitType: 'volume' | 'mass' | 'chemical' = 'volume'
    let timeUnit: TimeUnit = 'second'
    let specificUnit: VolumeUnit | MassUnit | ChemicalUnit = 'liter'

    // Determine the base unit and time unit from the input `unit` string
    if (unit.includes('liter')) {
      unitType = 'volume'
      specificUnit = 'liter'
    } else if (unit.includes('cubicMeter')) {
      unitType = 'volume'
      specificUnit = 'cubicMeter'
    } else if (unit.includes('kg')) {
      unitType = 'mass'
      specificUnit = 'kg'
    } else if (unit.includes('mol')) {
      unitType = 'chemical'
      specificUnit = 'mol'
    }

    if (unit.includes('Second')) {
      timeUnit = 'second'
    } else if (unit.includes('Minute')) {
      timeUnit = 'minute'
    } else if (unit.includes('Hour')) {
      timeUnit = 'hour'
    } else if (unit.includes('Day')) {
      timeUnit = 'day'
    }

    let valueInLiterPerSecond = numValue

    // Convert the input value to the common base: liters per second
    valueInLiterPerSecond = valueInLiterPerSecond / timeConversionFactors[timeUnit]

    if (unitType === 'volume') {
      valueInLiterPerSecond = valueInLiterPerSecond * volumeConversionFactors[specificUnit as VolumeUnit]
    } else if (unitType === 'mass') {
      // Convert mass (kg) to volume (liters) using density
      const massInKg = numValue * massConversionFactors[specificUnit as MassUnit] // Ensure kg
      valueInLiterPerSecond = massInKg / densityValue / timeConversionFactors[timeUnit] * 1000 // density is g/L, need kg/L. 1000g = 1kg. So density g/L -> (density/1000) kg/L. Mass in kg / (density/1000) = Mass in kg * 1000 / density
      valueInLiterPerSecond = (numValue * 1000 / densityValue) / timeConversionFactors[timeUnit] // L/s
    } else if (unitType === 'chemical') {
      // Convert moles to mass (kg), then to volume (liters)
      if (specificUnit === 'mol') {
        const massInGrams = numValue * molarMassValue // g
        const massInKg = massInGrams / 1000 // kg
        valueInLiterPerSecond = (massInKg * 1000 / densityValue) / timeConversionFactors[timeUnit] // (kg * 1000 g/kg / density g/L) / timeUnitFactor = L/s
      }
    }

    // Convert from the common base (liters per second) to all other units
    Object.keys(timeConversionFactors).forEach((time) => {
      const timeKey = time as TimeUnit

      // Liters
      const literKey = `literPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as keyof FlowValues
      if (literKey !== unit) {
        newValues[literKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey]).toFixed(6)
      }

      // Cubic Meters
      const cubicMeterKey = `cubicMeterPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as keyof FlowValues
      if (cubicMeterKey !== unit) {
        newValues[cubicMeterKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey] / 1000).toFixed(6)
      }

      // Kilograms
      const kgKey = `kgPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as keyof FlowValues
      if (kgKey !== unit) {
        // L/s * timeFactor * density (g/L) -> g per time unit. Convert to kg.
        newValues[kgKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey] * densityValue / 1000).toFixed(6)
      }

      // Moles
      const molKey = `molPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as keyof FlowValues
      if (molKey !== unit) {
        // L/s * timeFactor * density (g/L) -> g per time unit. Convert to mol.
        const massInGramsPerTimeUnit = valueInLiterPerSecond * timeConversionFactors[timeKey] * densityValue
        newValues[molKey] = (massInGramsPerTimeUnit / molarMassValue).toFixed(6)
      }
    })

    setValues(newValues)
  }

  // Handles input change events and triggers recalculation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, unit: keyof FlowValues) => {
    calculateAll(e.target.value, unit)
  }

  return {
    // State values
    calculationType,
    gasType,
    conditionType,
    temperature,
    pressure,
    temperatureDropdownOpen,
    pressureDropdownOpen,
    density,
    molarMass,
    values,
    // Refs
    temperatureDropdownRef,
    pressureDropdownRef,
    // Handlers
    handleCalculationTypeChange,
    handleGasTypeChange,
    handleConditionTypeChange,
    handleTemperatureChange,
    handlePressureChange,
    setTemperatureDropdownOpen,
    setPressureDropdownOpen,
    handleChange,
    // Constants for rendering (can also be imported directly in component if preferred)
    timeUnitLabels,
    volumeUnitLabels,
    massUnitLabels,
    chemicalUnitLabels,
    temperatureOptions,
    pressureOptions,
  }
}