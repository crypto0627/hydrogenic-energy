'use client'

import { CalculationType, ChemicalUnit, ConditionType, FlowValues, GasType, MassUnit, TimeUnit, VolumeUnit } from '@/types/mass-type';
import { useEffect, useRef, useState } from 'react';

export default function MassFlowPage() {
  const [calculationType, setCalculationType] = useState<CalculationType>('ideal');
  const [gasType, setGasType] = useState<GasType>('oxygen');
  const [conditionType, setConditionType] = useState<ConditionType>('oldSTP');
  const [temperature, setTemperature] = useState('0');
  const [pressure, setPressure] = useState('1');
  
  // 下拉選單狀態
  const [temperatureDropdownOpen, setTemperatureDropdownOpen] = useState(false);
  const [pressureDropdownOpen, setPressureDropdownOpen] = useState(false);
  
  // 下拉選單參考
  const temperatureDropdownRef = useRef<HTMLDivElement>(null);
  const pressureDropdownRef = useRef<HTMLDivElement>(null);
  
  // 固定氣體密度和分子量
  const gasProperties = {
    oxygen: {
      density: {
        oldSTP: '1429',    // g/L at 0°C, 1 atm
        newSTP: '1420',    // g/L at 0°C, 1 bar
        NTP: '1292',       // g/L at 20°C, 1 atm
        normal: '1276'     // g/L at 25°C, 1 atm
      },
      molarMass: '31.999'  // g/mol
    },
    hydrogen: {
      density: {
        oldSTP: '89.88',  // g/L at 0°C, 1 atm
        newSTP: '0.0895',   // g/L at 0°C, 1 bar
        NTP: '0.08375',     // g/L at 20°C, 1 atm
        normal: '0.0827',   // g/L at 25°C, 1 atm
        real: {
          '1': {
            '0': '0.8858', '10': '0.8544', '20': '0.8252', '30': '0.7979', '40': '0.7724',
            '50': '0.7485', '60': '0.7260', '70': '0.7048', '80': '0.6849', '90': '0.6660', '100': '0.6481'
          },
          '1.5': {
            '0': '1.3271', '10': '1.2801', '20': '1.2363', '30': '1.1954', '40': '1.1571',
            '50': '1.1213', '60': '1.0876', '70': '1.0558', '80': '1.0259', '90': '0.9977', '100': '0.9709'
          },
          '2': {
            '0': '1.7673', '10': '1.7046', '20': '1.6462', '30': '1.5917', '40': '1.5408',
            '50': '1.4930', '60': '1.4481', '70': '1.4059', '80': '1.3661', '90': '1.3284', '100': '1.2928'
          },
          '2.5': {
            '0': '2.2062', '10': '2.1279', '20': '2.0550', '30': '1.9870', '40': '1.9234',
            '50': '1.8637', '60': '1.8077', '70': '1.7549', '80': '1.7052', '90': '1.6582', '100': '1.6138'
          },
          '3': {
            '0': '2.6439', '10': '2.5500', '20': '2.4626', '30': '2.3810', '40': '2.3048',
            '50': '2.2333', '60': '2.1662', '70': '2.1030', '80': '2.0434', '90': '1.9871', '100': '1.9339'
          },
          '3.5': {
            '0': '3.0802', '10': '2.9707', '20': '2.8689', '30': '2.7739', '40': '2.6850',
            '50': '2.6018', '60': '2.5235', '70': '2.4499', '80': '2.3805', '90': '2.3150', '100': '2.2530'
          },
          '20': {
            '0': '16.456', '10': '15.895', '20': '15.370', '30': '14.881', '40': '14.423',
            '50': '13.992', '60': '13.587', '70': '13.205', '80': '12.844', '90': '12.503', '100': '12.180'
          },
          '35': {
            '0': '26.628', '10': '25.789', '20': '25.002', '30': '24.262', '40': '23.565',
            '50': '22.907', '60': '22.286', '70': '21.697', '80': '21.140', '90': '20.611', '100': '20.108'
          },
          '45': {
            '0': '32.427', '10': '31.464', '20': '30.557', '30': '29.701', '40': '28.891',
            '50': '28.124', '60': '27.398', '70': '26.708', '80': '26.052', '90': '25.428', '100': '24.833'
          },
          '70': {
            '0': '44.209', '10': '43.075', '20': '41.996', '30': '40.968', '40': '39.989',
            '50': '39.054', '60': '38.162', '70': '37.309', '80': '36.493', '90': '35.712', '100': '34.963'
          },
          '90': {
            '0': '51.543', '10': '50.354', '20': '49.218', '30': '48.129', '40': '47.086',
            '50': '46.086', '60': '45.127', '70': '44.206', '80': '43.321', '90': '42.470', '100': '41.651'
          },
          '98': {
            '0': '54.085', '10': '52.886', '20': '51.738', '30': '50.637', '40': '49.579',
            '50': '48.564', '60': '47.588', '70': '46.650', '80': '45.747', '90': '44.877', '100': '44.040'
          }
        }
      },
      molarMass: '2.016'   // g/mol
    }
  };

  // 定義索引簽名類型
  type PressureKey = '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '20' | '35' | '45' | '70' | '90' | '98';
  type TemperatureKey = '0' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90' | '100';

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

  // 點擊外部關閉下拉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (temperatureDropdownRef.current && !temperatureDropdownRef.current.contains(event.target as Node)) {
        setTemperatureDropdownOpen(false);
      }
      if (pressureDropdownRef.current && !pressureDropdownRef.current.contains(event.target as Node)) {
        setPressureDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 更新密度
  useEffect(() => {
    if (calculationType === 'real' && gasType === 'hydrogen') {
      setDensity(gasProperties.hydrogen.density.real[pressure as PressureKey][temperature as TemperatureKey]);
    } else {
      setDensity(gasProperties[gasType].density[conditionType]);
    }
  }, [calculationType, gasType, conditionType, temperature, pressure]);

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

  // 切換計算類型
  const handleCalculationTypeChange = (type: CalculationType) => {
    setCalculationType(type);
    resetValues();
  };

  // 切換氣體類型
  const handleGasTypeChange = (type: GasType) => {
    setGasType(type);
    setMolarMass(gasProperties[type].molarMass);
    resetValues();
  };

  // 切換條件類型
  const handleConditionTypeChange = (type: ConditionType) => {
    setConditionType(type);
    resetValues();
  };

  // 處理溫度變更
  const handleTemperatureChange = (temp: string) => {
    setTemperature(temp);
    setTemperatureDropdownOpen(false);
    resetValues();
  };

  // 處理壓力變更
  const handlePressureChange = (pres: string) => {
    setPressure(pres);
    setPressureDropdownOpen(false);
    resetValues();
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
        newValues[kgKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey] * densityValue / 1000).toFixed(6);
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

  // 溫度選項
  const temperatureOptions = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
  
  // 壓力選項
  const pressureOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '20', '35', '45', '70', '90', '98'];

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
        <h2 className="text-xl font-semibold mb-2 text-white">
          {calculationType === 'ideal' ? '條件類型' : '條件類型 《依據 Peng-Robinson Calculations 換算》'}
        </h2>
        {calculationType === 'real' && gasType === 'hydrogen' ? (
          <div className="flex gap-4">
            <div className="flex-1 relative" ref={temperatureDropdownRef}>
              <label className="block text-white mb-2">溫度 (°C)</label>
              <div 
                className="w-full p-2 bg-zinc-800 text-white rounded flex justify-between items-center cursor-pointer"
                onClick={() => setTemperatureDropdownOpen(!temperatureDropdownOpen)}
              >
                <span>{temperature}</span>
                <span>▼</span>
              </div>
              {temperatureDropdownOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-zinc-800 text-white rounded max-h-60 overflow-y-auto">
                  {temperatureOptions.map(temp => (
                    <li 
                      key={temp} 
                      className={`p-2 hover:bg-zinc-700 cursor-pointer ${temperature === temp ? 'bg-blue-600' : ''}`}
                      onClick={() => handleTemperatureChange(temp)}
                    >
                      {temp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex-1 relative" ref={pressureDropdownRef}>
              <label className="block text-white mb-2">壓力 (MPa)</label>
              <div 
                className="w-full p-2 bg-zinc-800 text-white rounded flex justify-between items-center cursor-pointer"
                onClick={() => setPressureDropdownOpen(!pressureDropdownOpen)}
              >
                <span>{pressure}</span>
                <span>▼</span>
              </div>
              {pressureDropdownOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-zinc-800 text-white rounded max-h-60 overflow-y-auto">
                  {pressureOptions.map(pres => (
                    <li 
                      key={pres} 
                      className={`p-2 hover:bg-zinc-700 cursor-pointer ${pressure === pres ? 'bg-blue-600' : ''}`}
                      onClick={() => handlePressureChange(pres)}
                    >
                      {pres}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleConditionTypeChange('oldSTP')}
              className={`px-4 py-2 rounded ${conditionType === 'oldSTP' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
            >
              STP
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
            <button
              onClick={() => handleConditionTypeChange('newSTP')}
              className={`px-4 py-2 rounded ${conditionType === 'newSTP' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
            >
              《補充》IUPAC制定「冰點」
            </button>
          </div>
        )}
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
          <div className="text-white font-semibold">立方公尺 (m³)</div>
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
