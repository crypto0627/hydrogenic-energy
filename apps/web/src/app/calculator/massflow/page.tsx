// src/app/mass-flow/page.tsx

'use client'

import { useMassFlowConverter } from '@/hooks/useMassFlowConverter'
import { FlowValues } from '@/types/mass-type'

export default function MassFlowPage() {
  const {
    calculationType,
    gasType,
    conditionType,
    temperature,
    pressure,
    density,
    molarMass,
    values,
    handleCalculationTypeChange,
    handleGasTypeChange,
    handleConditionTypeChange,
    handleTemperatureChange,
    handlePressureChange,
    handleChange,
    validateTemperature,
    validatePressure,
    timeUnitLabels
  } = useMassFlowConverter()

  // 輔助函式：渲染輸入欄位
  const renderInputField = (unit: keyof FlowValues, label: string) => (
    <div className="p-2" key={unit}>
      <label className="text-white text-sm">{label}</label>
      <input
        type="number"
        value={values[unit]}
        onChange={(e) => handleChange(e, unit)}
        className="w-full p-2 bg-zinc-700 text-white rounded"
        placeholder="請輸入數值"
        onWheel={(e) => e.currentTarget.blur()}
      />
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">質量流量換算器</h1>

      {/* 計算類型選擇 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-white">計算類型</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCalculationTypeChange('ideal')}
            className={`px-4 py-2 rounded ${calculationType === 'ideal' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          >
            理想氣體
          </button>
          <button
            onClick={() => handleCalculationTypeChange('real')}
            className={`px-4 py-2 rounded ${calculationType === 'real' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          >
            實際氣體
          </button>
        </div>
      </div>

      {/* 狀態條件選擇 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-white">
          {calculationType === 'ideal'
            ? '狀態條件'
            : '狀態條件（基於 Peng-Robinson 計算）'}
        </h2>
        {calculationType === 'real' ? (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white mb-2">溫度 (°C)</label>
              <input
                type="number"
                value={temperature === 0 ? '' : temperature}
                onChange={(e) => {
                  handleTemperatureChange(e.target.value)
                }}
                className="w-full p-2 bg-zinc-700 text-white rounded"
                placeholder="0-100"
                min="0"
                max="100"
                step="0.1"
                onWheel={(e) => e.currentTarget.blur()}
              />
              {!validateTemperature(temperature) && temperature !== 0 && (
                <p className="text-red-400 text-sm mt-1">
                  請輸入 0-100 之間的溫度
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-white mb-2">壓力 (MPa)</label>
              <input
                type="number"
                value={pressure === 0 ? '' : pressure}
                onChange={(e) => {
                  handlePressureChange(e.target.value)
                }}
                className="w-full p-2 bg-zinc-700 text-white rounded"
                placeholder="0.0-98.0"
                min="0.0"
                max="98.0"
                step="0.1"
                onWheel={(e) => e.currentTarget.blur()}
              />
              {!validatePressure(pressure) && pressure !== 1.0 && (
                <p className="text-red-400 text-sm mt-1">
                  請輸入 0.0-98.0 之間的壓力
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleConditionTypeChange('oldSTP')}
              className={`px-4 py-2 rounded ${conditionType === 'oldSTP' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
            >
              標準狀態（STP）
            </button>
            <button
              onClick={() => handleConditionTypeChange('ntp')}
              className={`px-4 py-2 rounded ${conditionType === 'ntp' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
            >
              標準溫壓（NTP）
            </button>
            <button
              onClick={() => handleConditionTypeChange('normal')}
              className={`px-4 py-2 rounded ${conditionType === 'normal' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
            >
              常溫常壓
            </button>
            <button
              onClick={() => handleConditionTypeChange('newSTP')}
              className={`px-4 py-2 rounded ${conditionType === 'newSTP' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
            >
              IUPAC「冰點」
            </button>
          </div>
        )}
      </div>

      {/* 氣體類型選擇 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-white">氣體類型</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGasTypeChange('oxygen')}
            className={`px-4 py-2 rounded ${gasType === 'oxygen' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          >
            氧氣 (O₂)
          </button>
          <button
            onClick={() => handleGasTypeChange('hydrogen')}
            className={`px-4 py-2 rounded ${gasType === 'hydrogen' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          >
            氫氣 (H₂)
          </button>
        </div>
      </div>

      {/* 密度與莫耳質量顯示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-white mb-2">密度 (g/L)</label>
          <input
            type="text"
            value={density}
            readOnly
            className="w-full p-2 bg-zinc-700 text-white rounded cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-white mb-2">莫耳質量 (g/mol)</label>
          <input
            type="text"
            value={molarMass}
            readOnly
            className="w-full p-2 bg-zinc-700 text-white rounded cursor-not-allowed"
          />
        </div>
      </div>

      {/* 流量換算表格 */}
      <div className="bg-zinc-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">體積流量</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-white font-semibold">公升 (L)</div>
          {Object.entries(timeUnitLabels).map(([key, label]) => (
            <div key={key} className="flex flex-col">
              <span className="text-white text-sm mb-1">{label}</span>
              {renderInputField(
                `literPer${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FlowValues,
                ''
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          <div className="text-white font-semibold">立方公尺 (m³)</div>
          {Object.entries(timeUnitLabels).map(([key, label]) => (
            <div key={key} className="flex flex-col">
              <span className="text-white text-sm mb-1">{label}</span>
              {renderInputField(
                `cubicMeterPer${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FlowValues,
                ''
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">質量流量</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-white font-semibold">公斤 (kg)</div>
          {Object.entries(timeUnitLabels).map(([key, label]) => (
            <div key={key} className="flex flex-col">
              <span className="text-white text-sm mb-1">{label}</span>
              {renderInputField(
                `kgPer${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FlowValues,
                ''
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">化學流量</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-white font-semibold">莫耳 (mol)</div>
          {Object.entries(timeUnitLabels).map(([key, label]) => (
            <div key={key} className="flex flex-col">
              <span className="text-white text-sm mb-1">{label}</span>
              {renderInputField(
                `molPer${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FlowValues,
                ''
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
