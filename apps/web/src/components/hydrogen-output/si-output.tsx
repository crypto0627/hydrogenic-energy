'use client'

import { useState } from 'react'

// 共用輸入框
type InputBoxProps = {
  label: string
  value: string | number
  onChange: (val: string) => void
  unit?: string
  min?: number
  step?: number
  placeholder?: string
}
function InputBox({
  label,
  value,
  onChange,
  unit,
  min,
  step = 0.01,
  placeholder = '',
}: InputBoxProps) {
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur()
  }
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-base font-semibold text-green-300 mb-1">{label}</label>
      <div className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 border-2 border-zinc-700 focus-within:border-green-500 transition">
        <input
          type="number"
          inputMode="decimal"
          className="w-full bg-transparent text-white outline-none placeholder-zinc-500"
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          step={step}
          placeholder={placeholder}
          onWheel={handleWheel}
        />
        {unit && <span className="ml-2 text-green-400 font-medium">{unit}</span>}
      </div>
    </div>
  )
}

// 共用輸出框（唯讀）
type OutputBoxProps = {
  label: string
  value: string | number
  unit?: string
}
function OutputBox({ label, value, unit }: OutputBoxProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-base font-semibold text-green-300 mb-1">{label}</label>
      <div className="flex items-center bg-gradient-to-r from-green-900 via-zinc-900 to-green-900 rounded-lg px-3 py-2 border-2 border-green-700">
        <input
          type="text"
          className="w-full bg-transparent text-2xl font-bold text-yellow-300 outline-none"
          value={value}
          readOnly
          tabIndex={-1}
        />
        {unit && <span className="ml-2 text-yellow-300 font-bold text-lg">{unit}</span>}
      </div>
    </div>
  )
}

export default function SiOutput() {
  const [siWeight, setSiWeight] = useState<string>('')

  // 固定參數
  const SI_MOLAR_MASS = 28.0869
  const NAOH_MOLAR_MASS = 39.997
  const H2O_MOLAR_MASS = 18.015
  const NA2SIO3_MOLAR_MASS = 122.06
  const H2_MOLAR_MASS = 2.016

  const siNum = parseFloat(siWeight)
  const mol = isNaN(siNum) ? 0 : siNum / SI_MOLAR_MASS

  // 公式計算
  const naoh = 2 * mol * NAOH_MOLAR_MASS
  const h2o = mol * H2O_MOLAR_MASS
  const na2sio3 = mol * NA2SIO3_MOLAR_MASS
  const h2 = 2 * mol * H2_MOLAR_MASS

  const format = (val: number) => (val > 0 ? val.toFixed(4) : '')

  return (
    <div className="w-full max-w-[1800px] mx-auto flex flex-col gap-10 py-8 px-2 md:px-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-300 to-green-400 mb-4 text-center drop-shadow-lg tracking-wide">
        Si + 2NaOH + H₂O → Na₂SiO₃ + 2H₂
      </h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <InputBox
          label="輸入矽 (Si)"
          value={siWeight}
          onChange={setSiWeight}
          unit="kg"
          min={0}
          placeholder="請輸入 Si 重量"
        />
        <OutputBox label="需要 NaOH" value={format(naoh)} unit="kg" />
        <OutputBox label="需要 H₂O" value={format(h2o)} unit="kg" />
        <OutputBox label="產出 Na₂SiO₃" value={format(na2sio3)} unit="kg" />
        <OutputBox label="產出 H₂" value={format(h2)} unit="kg" />
      </div>

      {/* 固定參數區塊 */}
      <div className="mt-4 text-zinc-300 text-sm text-center">
        <div className="inline-block bg-green-900/30 rounded px-4 py-2 mb-2">
          <div className="font-semibold mb-1 text-green-200">固定參數 (g/mol)：</div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <span>Si：<span className="font-mono">{SI_MOLAR_MASS}</span></span>
            <span>NaOH：<span className="font-mono">{NAOH_MOLAR_MASS}</span></span>
            <span>H₂O：<span className="font-mono">{H2O_MOLAR_MASS}</span></span>
            <span>Na₂SiO₃：<span className="font-mono">{NA2SIO3_MOLAR_MASS}</span></span>
            <span>H₂：<span className="font-mono">{H2_MOLAR_MASS}</span></span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-zinc-400 text-sm text-center">
        <span className="inline-block bg-green-900/40 rounded px-3 py-1">
          <b>公式：</b>Si + 2NaOH + H₂O → Na₂SiO₃ + 2H₂
        </span>
        <br />
        <span className="inline-block mt-2">
          <b>莫耳數計算：</b> mol = Si(kg) / {SI_MOLAR_MASS}
        </span>
      </div>
    </div>
  )
}
