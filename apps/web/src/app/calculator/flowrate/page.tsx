'use client'

import { useState } from 'react';

// 定義流量單位類型
type FlowRateTimeUnit = 'second' | 'minute' | 'hour' | 'day';
type FlowRateVolumeUnit = 'liter' | 'cubicMeter';
type FlowRateUnit = `${FlowRateVolumeUnit}Per${Capitalize<FlowRateTimeUnit>}`;

// 定義流量值類型
type FlowRateValues = Record<FlowRateUnit, string>;

export default function FlowRatePage() {
  const [values, setValues] = useState<FlowRateValues>({
    literPerSecond: '',
    literPerMinute: '',
    literPerHour: '',
    literPerDay: '',
    cubicMeterPerSecond: '',
    cubicMeterPerMinute: '',
    cubicMeterPerHour: '',
    cubicMeterPerDay: ''
  });

  // 轉換因子 (相對於每秒公升)
  const timeConversionFactors: Record<FlowRateTimeUnit, number> = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400
  };

  // 體積轉換因子 (1立方米 = 1000公升)
  const volumeConversionFactor = 1000;

  // 計算所有單位的換算
  const calculateAll = (value: string, unit: FlowRateUnit) => {
    if (value === '') {
      resetValues();
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newValues = { ...values };
    newValues[unit] = value;

    // 解析單位
    const isLiter = unit.startsWith('liter');
    const timeUnit = unit.replace(/^(liter|cubicMeter)Per/, '').toLowerCase() as FlowRateTimeUnit;

    // 先轉換為每秒公升
    let valueInLiterPerSecond = numValue;
    
    // 時間單位轉換
    valueInLiterPerSecond = valueInLiterPerSecond / timeConversionFactors[timeUnit];
    
    // 體積單位轉換
    if (!isLiter) {
      valueInLiterPerSecond = valueInLiterPerSecond * volumeConversionFactor;
    }

    // 從每秒公升轉換為其他單位
    Object.keys(timeConversionFactors).forEach(time => {
      const timeKey = time as FlowRateTimeUnit;
      
      // 公升單位
      const literKey = `literPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as FlowRateUnit;
      if (literKey !== unit) {
        newValues[literKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey]).toFixed(6);
      }
      
      // 立方米單位
      const cubicMeterKey = `cubicMeterPer${timeKey.charAt(0).toUpperCase() + timeKey.slice(1)}` as FlowRateUnit;
      if (cubicMeterKey !== unit) {
        newValues[cubicMeterKey] = (valueInLiterPerSecond * timeConversionFactors[timeKey] / volumeConversionFactor).toFixed(6);
      }
    });

    setValues(newValues);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, unit: FlowRateUnit) => {
    calculateAll(e.target.value, unit);
  };

  const resetValues = () => {
    setValues({
      literPerSecond: '',
      literPerMinute: '',
      literPerHour: '',
      literPerDay: '',
      cubicMeterPerSecond: '',
      cubicMeterPerMinute: '',
      cubicMeterPerHour: '',
      cubicMeterPerDay: ''
    });
  };

  // 單位顯示名稱
  const unitLabels: Record<FlowRateUnit, string> = {
    literPerSecond: '公升/秒 (L/s)',
    literPerMinute: '公升/分鐘 (L/min)',
    literPerHour: '公升/小時 (L/h)',
    literPerDay: '公升/天 (L/d)',
    cubicMeterPerSecond: '立方公尺/秒 (m³/s)',
    cubicMeterPerMinute: '立方公尺/分鐘 (m³/min)',
    cubicMeterPerHour: '立方公尺/小時 (m³/h)',
    cubicMeterPerDay: '立方公尺/天 (m³/d)'
  };

  // 渲染輸入欄位
  const renderInputField = (unit: FlowRateUnit) => (
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
  );

  // 所有單位
  const allUnits: FlowRateUnit[] = [
    'literPerSecond',
    'literPerMinute',
    'literPerHour',
    'literPerDay',
    'cubicMeterPerSecond',
    'cubicMeterPerMinute',
    'cubicMeterPerHour',
    'cubicMeterPerDay'
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">流量單位換算</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {allUnits.map(unit => renderInputField(unit))}
      </div>
    </div>
  );
}
