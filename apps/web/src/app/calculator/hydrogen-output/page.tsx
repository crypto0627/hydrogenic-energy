'use client'

import Output from '@/components/hydrogen-output/original-output'
import SiOutput from '@/components/hydrogen-output/si-output'
import { useState } from 'react'

export default function Page() {
  const [mode, setMode] = useState<'output' | 'si'>('output')

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center">
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setMode('output')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            mode === 'output'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          產氫量計算器
        </button>
        <button
          onClick={() => setMode('si')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            mode === 'si'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          矽產氫量計算器
        </button>
      </div>

      <div className="flex-1 w-full">
        {mode === 'output' ? <Output /> : <SiOutput />}
      </div>
    </div>
  )
}
