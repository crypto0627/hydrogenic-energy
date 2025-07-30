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

// 產氫計算公式
// H2(kg) = 電量(kWh) × 3600 × 電解效率(%) / (下列能量)
// 理論上 1 kg H2 = 33.33 kWh (高位發熱值, HHV)
// 產氫量(kg) = 電量(kWh) × 電解效率(%) / 33.33

function calculateHydrogenOutput(
  powerKWh: number,
  efficiency: number
): number {
  if (isNaN(powerKWh) || isNaN(efficiency) || efficiency <= 0) return 0
  // efficiency 為百分比, 需轉為小數
  return (powerKWh * (efficiency / 100)) / 33.33
}

export default function HydrogenicOutput() {
  const [power, setPower] = useState<string>('')
  const [efficiency, setEfficiency] = useState<string>('70')

  const powerNum = parseFloat(power)
  const efficiencyNum = parseFloat(efficiency)
  const h2Kg = calculateHydrogenOutput(powerNum, efficiencyNum)
  const h2KgDisplay = power && efficiency ? h2Kg.toFixed(4) : ''

  return (
    <div className="w-full max-w-[1800px] mx-auto flex flex-col gap-10 py-8 px-2 md:px-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-300 to-blue-400 mb-4 text-center drop-shadow-lg tracking-wide">
        產氫量計算器
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <InputBox
          label="電量輸入"
          value={power}
          onChange={setPower}
          unit="kWh"
          min={0}
          placeholder="請輸入電量"
        />
        <InputBox
          label="電解電池(電堆/系統)轉換效率"
          value={efficiency}
          onChange={setEfficiency}
          unit="%"
          min={0}
          max={100}
          step={0.01}
          placeholder="請輸入效率"
        />
        <OutputBox
          label="生產出的H₂量"
          value={h2KgDisplay}
          unit="kg"
        />
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-gradient-to-r from-zinc-800 via-blue-950 to-zinc-800 rounded-xl overflow-hidden text-white shadow-2xl border border-blue-900">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-lg font-bold text-blue-300 bg-zinc-900">電量 (kWh)</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-blue-300 bg-zinc-900">效率 (%)</th>
              <th className="px-6 py-4 text-left text-lg font-bold text-blue-300 bg-zinc-900">產氫量 (kg)</th>
            </tr>
          </thead>
          <tbody>
            {[10, 50, 100, 500, 1000].map((p, idx) => (
              <tr
                key={p}
                className={`border-t border-blue-900 ${idx % 2 === 0 ? 'bg-zinc-900/70' : 'bg-zinc-800/80'} hover:bg-blue-950/60 transition`}
              >
                <td className="px-6 py-3 text-lg">{p}</td>
                <td className="px-6 py-3 text-lg">{efficiencyNum || 0}</td>
                <td className="px-6 py-3 text-lg font-semibold text-green-300">
                  {calculateHydrogenOutput(p, efficiencyNum || 0).toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-zinc-400 text-sm text-center">
        <span className="inline-block bg-blue-900/40 rounded px-3 py-1">
          <b>公式：</b>產氫量(kg) = 電量(kWh) × 電解效率(%) / 33.33
        </span>
        <br />
        <span className="inline-block mt-2">
          <b>說明：</b>1 kg H₂ ≈ 33.33 kWh (高位發熱值, HHV)
        </span>
      </div>
    </div>
  )
}