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
            '0': '885.8', '10': '854.4', '20': '825.2', '30': '797.9', '40': '772.4',
            '50': '748.5', '60': '726.0', '70': '704.8', '80': '684.9', '90': '666.0', '100': '648.1'
          },
          '1.5': {
            '0': '1327.1', '10': '1280.1', '20': '1236.3', '30': '1195.4', '40': '1157.1',
            '50': '1121.3', '60': '1087.6', '70': '1055.8', '80': '1025.9', '90': '997.7', '100': '970.9'
          },
          '2': {
            '0': '1767.3', '10': '1704.6', '20': '1646.2', '30': '1591.7', '40': '1540.8',
            '50': '1493.0', '60': '1448.1', '70': '1405.9', '80': '1366.1', '90': '1328.4', '100': '1292.8'
          },
          '2.5': {
            '0': '2206.2', '10': '2127.9', '20': '2055.0', '30': '1987.0', '40': '1923.4',
            '50': '1863.7', '60': '1807.7', '70': '1754.9', '80': '1705.2', '90': '1658.2', '100': '1613.8'
          },
          '3': {
            '0': '2643.9', '10': '2550.0', '20': '2462.6', '30': '2381.0', '40': '2304.8',
            '50': '2233.3', '60': '2166.2', '70': '2103.0', '80': '2043.4', '90': '1987.1', '100': '1933.9'
          },
          '3.5': {
            '0': '3080.2', '10': '2970.7', '20': '2868.9', '30': '2773.9', '40': '2685.0',
            '50': '2601.8', '60': '2523.5', '70': '2449.9', '80': '2380.5', '90': '2315.0', '100': '2253.0'
          },
          '20': {
            '0': '16456', '10': '15895', '20': '15370', '30': '14881', '40': '14423',
            '50': '13992', '60': '13587', '70': '13205', '80': '12844', '90': '12503', '100': '12180'
          },
          '35': {
            '0': '26628', '10': '25789', '20': '25002', '30': '24262', '40': '23565',
            '50': '22907', '60': '22286', '70': '21697', '80': '21140', '90': '20611', '100': '20108'
          },
          '45': {
            '0': '32427', '10': '31464', '20': '30557', '30': '29701', '40': '28891',
            '50': '28124', '60': '27398', '70': '26708', '80': '26052', '90': '25428', '100': '24833'
          },
          '70': {
            '0': '44209', '10': '43075', '20': '41996', '30': '40968', '40': '39989',
            '50': '39054', '60': '38162', '70': '37309', '80': '36493', '90': '35712', '100': '34963'
          },
          '90': {
            '0': '51543', '10': '50354', '20': '49218', '30': '48129', '40': '47086',
            '50': '46086', '60': '45127', '70': '44206', '80': '43321', '90': '42470', '100': '41651'
          },
          '98': {
            '0': '54085', '10': '52886', '20': '51738', '30': '50637', '40': '49579',
            '50': '48564', '60': '47588', '70': '46650', '80': '45747', '90': '44877', '100': '44040'
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
