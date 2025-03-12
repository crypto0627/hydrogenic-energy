'use client'

import { useState } from 'react';

// 定義流量單位類型
type TimeUnit = 'second' | 'minute' | 'hour' | 'day';
type VolumeUnit = 'liter' | 'cubicMeter';
type MassUnit = 'kg';
type ChemicalUnit = 'mol';
type CalculationType = 'ideal' | 'real';
type GasType = 'oxygen' | 'hydrogen';
type ConditionType = 'oldSTP' | 'newSTP' | 'NTP' | 'normal';

interface FlowValues {
  // 體積流量
  [key: string]: string;
  literPerSecond: string;
  literPerMinute: string;
  literPerHour: string;
  literPerDay: string;
  cubicMeterPerSecond: string;
  cubicMeterPerMinute: string;
  cubicMeterPerHour: string;
  cubicMeterPerDay: string;
  // 質量流量
  kgPerSecond: string;
  kgPerMinute: string;
  kgPerHour: string;
  kgPerDay: string;
  // 化學流量
  molPerSecond: string;
  molPerMinute: string;
  molPerHour: string;
  molPerDay: string;
}

export default function MassFlowPage() {
  const [calculationType, setCalculationType] = useState<CalculationType>('ideal');
  const [gasType, setGasType] = useState<GasType>('oxygen');
  const [conditionType, setConditionType] = useState<ConditionType>('oldSTP');
  
  // 固定氣體密度和分子量
  const gasProperties = {
    oxygen: {
      density: {
        oldSTP: '1.429',    // g/L at 0°C, 1 atm
        newSTP: '1.420',    // g/L at 0°C, 1 bar
        NTP: '1.292',       // g/L at 20°C, 1 atm
        normal: '1.276'     // g/L at 25°C, 1 atm
      },
      molarMass: '31.999'  // g/mol
    },
    hydrogen: {
      density: {
        oldSTP: '0.08988',  // g/L at 0°C, 1 atm
        newSTP: '0.0895',   // g/L at 0°C, 1 bar
        NTP: '0.08375',     // g/L at 20°C, 1 atm
        normal: '0.0827'    // g/L at 25°C, 1 atm
      },
      molarMass: '2.016'   // g/mol
    }
  };

  const [density, setDensity] = useState<string>(gasProperties[gasType].density[conditionType]);
  const [molarMass, setMolarMass] = useState<string>(gasProperties[gasType].molarMass);
  const [values, setValues] = useState<FlowValues>({
    // 體積流量
    literPerSecond: '',
    literPerMinute: '',
    literPerHour: '',
    literPerDay: '',
    cubicMeterPerSecond: '',
    cubicMeterPerMinute: '',
    cubicMeterPerHour: '',
    cubicMeterPerDay: '',
    // 質量流量
    kgPerSecond: '',
    kgPerMinute: '',
    kgPerHour: '',
    kgPerDay: '',
    // 化學流量
    molPerSecond: '',
    molPerMinute: '',
    molPerHour: '',
    molPerDay: '',
  });

  // 轉換因子
  const timeConversionFactors: Record<TimeUnit, number> = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400
  };

  // 體積轉換因子 (相對於公升)
  const volumeConversionFactors: Record<VolumeUnit, number> = {
    liter: 1,
    cubicMeter: 1000,
  };

  // 質量轉換因子 (相對於公斤)
  const massConversionFactors: Record<MassUnit, number> = {
    kg: 1,
  };

  // 阿伏加德羅常數
  const avogadroNumber = 6.02214076e23;

  // 切換計算類型
  const handleCalculationTypeChange = (type: CalculationType) => {
    setCalculationType(type);
    resetValues();
  };

  // 切換氣體類型
  const handleGasTypeChange = (type: GasType) => {
    setGasType(type);
    setDensity(gasProperties[type].density[conditionType]);
    setMolarMass(gasProperties[type].molarMass);
    resetValues();
  };

  // 切換條件類型
  const handleConditionTypeChange = (type: ConditionType) => {
    setConditionType(type);
    setDensity(gasProperties[gasType].density[type]);
    resetValues();
  };

  // 處理密度變更
  const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDensity(gasProperties[gasType].density[conditionType]);
    recalculateAll();
  };

  // 處理摩爾質量變更
  const handleMolarMassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMolarMass(gasProperties[gasType].molarMass);
    recalculateAll();
  };

  // 重新計算所有值
  const recalculateAll = () => {
    // 找到第一個非空值並以此為基準重新計算
    for (const key in values) {
      if (values[key] !== '') {
        const unit = key as keyof FlowValues;
        calculateAll(values[unit] || '', unit);
        break;
      }
    }
  };

  // 計算所有單位的換算
  const calculateAll = (value: string, unit: keyof FlowValues) => {
    if (value === '') {
      resetValues();
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newValues = { ...values };
    newValues[unit] = value;

    const densityValue = parseFloat(density);
    const molarMassValue = parseFloat(molarMass);
    
    if (isNaN(densityValue) || isNaN(molarMassValue)) return;

    // 解析單位類型
    let unitType: 'volume' | 'mass' | 'chemical' = 'volume';
    let timeUnit: TimeUnit = 'second';
    let specificUnit: VolumeUnit | MassUnit | ChemicalUnit = 'liter';

    if (typeof unit === 'string' && unit.includes('liter')) {
      unitType = 'volume';
      specificUnit = 'liter';
    } else if (typeof unit === 'string' && unit.includes('cubicMeter')) {
      unitType = 'volume';
      specificUnit = 'cubicMeter';
    } else if (typeof unit === 'string' && unit.includes('kg')) {
      unitType = 'mass';
      specificUnit = 'kg';
    } else if (typeof unit === 'string' && unit.includes('mol')) {
      unitType = 'chemical';
      specificUnit = 'mol';
    }

    if (typeof unit === 'string' && unit.includes('Second')) {
      timeUnit = 'second';
    } else if (typeof unit === 'string' && unit.includes('Minute')) {
      timeUnit = 'minute';
    } else if (typeof unit === 'string' && unit.includes('Hour')) {
      timeUnit = 'hour';
    } else if (typeof unit === 'string' && unit.includes('Day')) {
      timeUnit = 'day';
    }

    // 先轉換為基準單位：每秒公升
    let valueInLiterPerSecond = numValue;

    // 時間單位轉換
    valueInLiterPerSecond = valueInLiterPerSecond / timeConversionFactors[timeUnit];

    // 根據單位類型進行轉換
    if (unitType === 'volume') {
      // 體積單位轉換為公升
      valueInLiterPerSecond = valueInLiterPerSecond * volumeConversionFactors[specificUnit as VolumeUnit];
    } else if (unitType === 'mass') {
      // 質量單位轉換為公升
      const massInKg = numValue;
      valueInLiterPerSecond = massInKg / densityValue / timeConversionFactors[timeUnit];
    } else if (unitType === 'chemical') {
      // 化學單位轉換為公升
      if (specificUnit === 'mol') {
        // 摩爾轉換為質量，再轉換為體積
        const massInKg = numValue * molarMassValue / 1000; // g轉kg
        valueInLiterPerSecond = massInKg / densityValue / timeConversionFactors[timeUnit];
      }
    }

    // 從每秒公升轉換為其他單位
    Object.keys(timeConversionFactors).forEach(time => {
      const timeKey = time as TimeUnit;
      
      // 公升單位
      const literKey = `literPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as keyof FlowValues;
      if (literKey !== unit) {
        newValues[literKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey]).toFixed(6);
      }

      // 立方米單位
      const cubicMeterKey = `cubicMeterPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as keyof FlowValues;
      if (cubicMeterKey !== unit) {
        newValues[cubicMeterKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey] / 1000).toFixed(6);
      }
      
      // 公斤單位
      const kgKey = `kgPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as keyof FlowValues;
      if (kgKey !== unit) {
        newValues[kgKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey] * densityValue).toFixed(6);
      }
      
      // 摩爾單位
      const molKey = `molPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as keyof FlowValues;
      if (molKey !== unit) {
        const kgValue = valueInLiterPerSecond * timeConversionFactors[timeKey] * densityValue;
        newValues[molKey] = (kgValue * 1000 / molarMassValue).toFixed(6); // kg轉g再除以摩爾質量
      }
    });

    setValues(newValues);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, unit: keyof FlowValues) => {
    calculateAll(e.target.value, unit);
  };

  const resetValues = () => {
    setValues({
      // 體積流量
      literPerSecond: '',
      literPerMinute: '',
      literPerHour: '',
      literPerDay: '',
      cubicMeterPerSecond: '',
      cubicMeterPerMinute: '',
      cubicMeterPerHour: '',
      cubicMeterPerDay: '',
      // 質量流量
      kgPerSecond: '',
      kgPerMinute: '',
      kgPerHour: '',
      kgPerDay: '',
      // 化學流量
      molPerSecond: '',
      molPerMinute: '',
      molPerHour: '',
      molPerDay: '',
    });
  };

  // 單位顯示名稱
  const timeUnitLabels: Record<TimeUnit, string> = {
    second: '/ 秒',
    minute: '/ 分鐘',
    hour: '/ 小時',
    day: '/ 天'
  };

  const volumeUnitLabels: Record<VolumeUnit, string> = {
    liter: 'L',
    cubicMeter: 'm³',
  };

  const massUnitLabels: Record<MassUnit, string> = {
    kg: 'kg',
  };

  const chemicalUnitLabels: Record<ChemicalUnit, string> = {
    mol: 'mol',
  };

  // 渲染輸入欄位
  const renderInputField = (unit: keyof FlowValues, label: string) => (
    <div className="p-2" key={unit}>
      <label className="text-white text-sm">{label}</label>
      <input
        type="number"
        value={values[unit]}
        onChange={(e) => handleChange(e, unit)}
        className="w-full p-2 bg-zinc-700 text-white rounded"
        placeholder="輸入值"
      />
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">質量流量換算</h1>
      
      {/* 計算類型切換 */}
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
            真實氣體
          </button>
        </div>
      </div>

      {/* 條件類型切換 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-white">條件類型</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleConditionTypeChange('oldSTP')}
            className={`px-4 py-2 rounded ${conditionType === 'oldSTP' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          >
            STP : ISO 10780
          </button>
          <button
            onClick={() => handleConditionTypeChange('newSTP')}
            className={`px-4 py-2 rounded ${conditionType === 'newSTP' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          >
            STP：IUPAC
          </button>
          <button
            onClick={() => handleConditionTypeChange('NTP')}
            className={`px-4 py-2 rounded ${conditionType === 'NTP' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          >
            NTP
          </button>
          <button
            onClick={() => handleConditionTypeChange('normal')}
            className={`px-4 py-2 rounded ${conditionType === 'normal' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          >
            常溫常壓
          </button>
        </div>
      </div>
      
      {/* 氣體類型切換 */}
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
      
      {/* 密度和摩爾質量顯示 */}
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
          <label className="block text-white mb-2">摩爾質量 (g/mol)</label>
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
              {renderInputField(`literPer${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FlowValues, '')}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          <div className="text-white font-semibold">立方米 (m³)</div>
          {Object.entries(timeUnitLabels).map(([key, label]) => (
            <div key={key} className="flex flex-col">
              <span className="text-white text-sm mb-1">{label}</span>
              {renderInputField(`cubicMeterPer${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FlowValues, '')}
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
              {renderInputField(`kgPer${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FlowValues, '')}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-zinc-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">化學流量</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-white font-semibold">摩爾 (mol)</div>
          {Object.entries(timeUnitLabels).map(([key, label]) => (
            <div key={key} className="flex flex-col">
              <span className="text-white text-sm mb-1">{label}</span>
              {renderInputField(`molPer${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FlowValues, '')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
