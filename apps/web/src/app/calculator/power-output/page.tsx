'use client'

import { useState } from 'react'

// 共用 InputBox 組件，禁用滾輪更改
type InputBoxProps = {
  label: string
  value: string | number
  onChange: (val: string) => void
  unit?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
}
function InputBox({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 0.01,
  placeholder = '',
}: InputBoxProps) {
  // 禁止滾輪更改數值
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur()
  }
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-base font-semibold text-blue-300 mb-1">{label}</label>
      <div className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 border-2 border-zinc-700 focus-within:border-blue-500 transition">
        <input
          type="number"
          inputMode="decimal"
          className="w-full bg-transparent text-white outline-none placeholder-zinc-500"
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onWheel={handleWheel}
        />
        {unit && <span className="ml-2 text-blue-400 font-medium">{unit}</span>}
      </div>
    </div>
  )
}

// OutputBox 組件 (不可更改)
type OutputBoxProps = {
  label: string
  value: string | number
  unit?: string
}
function OutputBox({ label, value, unit }: OutputBoxProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-base font-semibold text-blue-300 mb-1">{label}</label>
      <div className="flex items-center bg-gradient-to-r from-blue-900 via-zinc-900 to-blue-900 rounded-lg px-3 py-2 border-2 border-blue-700">
        <input
          type="text"
          className="w-full bg-transparent text-2xl font-bold text-green-300 outline-none"
          value={value}
          readOnly
          tabIndex={-1}
        />
        {unit && <span className="ml-2 text-green-300 font-bold text-lg">{unit}</span>}
      </div>
    </div>
  )
}

// 產電量計算公式
// LHV (低位發熱值): 1 kg H2 = 33.33 kWh, 1 Nm3 H2 = 3.0 kWh
// HHV (高位發熱值): 1 kg H2 = 39.4 kWh, 1 Nm3 H2 = 3.54 kWh
// 產電量(kWh) = 氫氣量 × 發熱值 × 燃料電池效率(%)

function calculatePowerOutput(
  h2Kg: number,
  h2Nm3: number,
  efficiency: number
) {
  // LHV
  const LHV_KG = 33.33
  const LHV_NM3 = 3.0
  // HHV
  const HHV_KG = 39.4
  const HHV_NM3 = 3.54

  const eff = efficiency / 100

  // 以 kg 為主計算
  const lhv_kwh_kg = h2Kg * LHV_KG * eff
  const hhv_kwh_kg = h2Kg * HHV_KG * eff

  // 以 Nm3 為主計算
  const lhv_kwh_nm3 = h2Nm3 * LHV_NM3 * eff
  const hhv_kwh_nm3 = h2Nm3 * HHV_NM3 * eff

  return {
    lhv_kwh_kg,
    hhv_kwh_kg,
    lhv_kwh_nm3,
    hhv_kwh_nm3,
  }
}

export default function PowerOutput() {
  const [h2Kg, setH2Kg] = useState<string>('')
  const [h2Nm3, setH2Nm3] = useState<string>('')
  const [efficiency, setEfficiency] = useState<string>('50')

  // 只要有一個輸入就計算
  const h2KgNum = parseFloat(h2Kg) || 0
  const h2Nm3Num = parseFloat(h2Nm3) || 0
  const efficiencyNum = parseFloat(efficiency) || 0

  const {
    lhv_kwh_kg,
    hhv_kwh_kg,
    lhv_kwh_nm3,
    hhv_kwh_nm3,
  } = calculatePowerOutput(h2KgNum, h2Nm3Num, efficiencyNum)

  // 顯示優先: 若有 kg 輸入則顯示 kg 計算，否則顯示 Nm3 計算
  const showKg = !!h2Kg
  const showNm3 = !!h2Nm3

  return (
    <div className="w-full max-w-[1800px] mx-auto flex flex-col gap-10 py-8 px-2 md:px-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-300 to-blue-400 mb-4 text-center drop-shadow-lg tracking-wide">
        產電量計算器
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8">
        <InputBox
          label="氫氣重量"
          value={h2Kg}
          onChange={setH2Kg}
          unit="kg"
          min={0}
          placeholder="請輸入氫氣重量"
        />
        <InputBox
          label="氫氣體積"
          value={h2Nm3}
          onChange={setH2Nm3}
          unit="Nm³"
          min={0}
          placeholder="請輸入氫氣體積"
        />
        <InputBox
          label="燃料電池(電堆/系統)轉換效率"
          value={efficiency}
          onChange={setEfficiency}
          unit="%"
          min={0}
          max={100}
          step={0.01}
          placeholder="請輸入效率"
        />
        <div className="flex flex-col gap-4">
          <OutputBox
            label="產出電量 (LHV)"
            value={
              showKg
                ? (h2Kg ? lhv_kwh_kg.toFixed(4) : '')
                : (h2Nm3 ? lhv_kwh_nm3.toFixed(4) : '')
            }
            unit="kWh"
          />
          <OutputBox
            label="產出電量 (HHV)"
            value={
              showKg
                ? (h2Kg ? hhv_kwh_kg.toFixed(4) : '')
                : (h2Nm3 ? hhv_kwh_nm3.toFixed(4) : '')
            }
            unit="kWh"
          />
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-gradient-to-r from-zinc-800 via-blue-950 to-zinc-800 rounded-xl overflow-hidden text-white shadow-2xl border border-blue-900">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-lg font-bold text-blue-300 bg-zinc-900">氫氣量 (kg)</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-blue-300 bg-zinc-900">氫氣量 (Nm³)</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-blue-300 bg-zinc-900">效率 (%)</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-blue-300 bg-zinc-900">LHV 產電量 (kWh)</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-blue-300 bg-zinc-900">HHV 產電量 (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {/* 範例數據: 以 kg 為主 */}
            {[1, 5, 10, 50, 100].map((kg, idx) => {
              const lhv = calculatePowerOutput(kg, 0, efficiencyNum).lhv_kwh_kg
              const hhv = calculatePowerOutput(kg, 0, efficiencyNum).hhv_kwh_kg
              return (
                <tr
                  key={'kg-' + kg}
                  className={`border-t border-blue-900 ${idx % 2 === 0 ? 'bg-zinc-900/70' : 'bg-zinc-800/80'} hover:bg-blue-950/60 transition`}
                >
                  <td className="px-6 py-3 text-lg">{kg}</td>
                  <td className="px-6 py-3 text-lg">-</td>
                  <td className="px-6 py-3 text-lg">{efficiencyNum || 0}</td>
                  <td className="px-6 py-3 text-lg font-semibold text-green-300">{lhv.toFixed(4)}</td>
                  <td className="px-6 py-3 text-lg font-semibold text-green-300">{hhv.toFixed(4)}</td>
                </tr>
              )
            })}
            {/* 範例數據: 以 Nm3 為主 */}
            {[1, 10, 50, 100, 500].map((nm3, idx) => {
              const lhv = calculatePowerOutput(0, nm3, efficiencyNum).lhv_kwh_nm3
              const hhv = calculatePowerOutput(0, nm3, efficiencyNum).hhv_kwh_nm3
              return (
                <tr
                  key={'nm3-' + nm3}
                  className={`border-t border-blue-900 ${idx % 2 === 0 ? 'bg-zinc-900/70' : 'bg-zinc-800/80'} hover:bg-blue-950/60 transition`}
                >
                  <td className="px-6 py-3 text-lg">-</td>
                  <td className="px-6 py-3 text-lg">{nm3}</td>
                  <td className="px-6 py-3 text-lg">{efficiencyNum || 0}</td>
                  <td className="px-6 py-3 text-lg font-semibold text-green-300">{lhv.toFixed(4)}</td>
                  <td className="px-6 py-3 text-lg font-semibold text-green-300">{hhv.toFixed(4)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-zinc-400 text-sm text-center">
        <span className="inline-block bg-blue-900/40 rounded px-3 py-1">
          <b>公式：</b>產電量(kWh) = 氫氣量 × 發熱值 × 燃料電池效率(%)
        </span>
        <br />
        <span className="inline-block mt-2">
          <b>說明：</b>
          LHV: 1 kg H₂ = 33.33 kWh, 1 Nm³ H₂ = 3.0 kWh；HHV: 1 kg H₂ = 39.4 kWh, 1 Nm³ H₂ = 3.54 kWh
        </span>
      </div>
    </div>
  )
}