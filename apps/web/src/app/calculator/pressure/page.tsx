'use client'

import { useState } from 'react'

// 定義壓力單位類型
type PressureUnit = 'bar' | 'MPa' | 'Pa' | 'atm' | 'psi' | 'kgfPerM2'

// 定義壓力值類型
type PressureValues = Record<PressureUnit, string>

export default function MassFlowPage() {
  const [values, setValues] = useState<PressureValues>({
    bar: '',
    MPa: '',
    Pa: '',
    atm: '',
    psi: '',
    kgfPerM2: ''
  })

  // 轉換因子
  const conversionFactors: Record<PressureUnit, number> = {
    bar: 1,
    MPa: 0.1,
    Pa: 100000,
    atm: 0.986923,
    psi: 14.5038,
    kgfPerM2: 10197.2
  }

  // 計算所有單位的換算
  const calculateAll = (value: string, unit: PressureUnit) => {
    if (value === '') {
      resetValues()
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    const newValues = { ...values }
    newValues[unit] = value

    // 先轉換為巴
    const valueInBar =
      unit === 'bar' ? numValue : numValue / conversionFactors[unit]

    // 從巴轉換為其他單位
    ;(Object.keys(conversionFactors) as PressureUnit[]).forEach(
      (targetUnit) => {
        if (targetUnit !== unit) {
          newValues[targetUnit] = (
            valueInBar * conversionFactors[targetUnit]
          ).toFixed(6)
        }
      }
    )

    setValues(newValues)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    unit: PressureUnit
  ) => {
    calculateAll(e.target.value, unit)
  }

  const resetValues = () => {
    setValues({
      bar: '',
      MPa: '',
      Pa: '',
      atm: '',
      psi: '',
      kgfPerM2: ''
    })
  }

  // 單位顯示名稱
  const unitLabels: Record<PressureUnit, string> = {
    bar: '巴 (bar)',
    MPa: '百萬帕 (MPa)',
    Pa: '帕斯卡 (Pa = N/m²)',
    atm: '標准大氣壓 (atm)',
    psi: '磅力/英寸² (lbf/in² = PSI)',
    kgfPerM2: '公斤力/米² (kgf/m²)'
  }

  // 渲染輸入欄位
  const renderInputField = (unit: PressureUnit) => (
    <div className="mb-4 p-2" key={unit}>
      <label className="block text-white mb-2">{unitLabels[unit]}</label>
      <input
        type="number"
        value={values[unit]}
        onChange={(e) => handleChange(e, unit)}
        className="w-full p-2 bg-zinc-700 text-white rounded"
        placeholder="輸入值"
      />
    </div>
  )

  // 所有單位
  const allUnits: PressureUnit[] = [
    'bar',
    'MPa',
    'Pa',
    'atm',
    'psi',
    'kgfPerM2'
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">壓力單位換算</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allUnits.map((unit) => renderInputField(unit))}
      </div>
    </div>
  )
}
