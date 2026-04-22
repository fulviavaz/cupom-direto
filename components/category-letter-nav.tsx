'use client'

import { useEffect, useState } from 'react'

type Props = {
  letters: string[]
}

export default function CategoryLetterNav({ letters }: Props) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  useEffect(() => {
    function updateActiveFromHash() {
      const hash = window.location.hash.replace('#letter-', '').toUpperCase()
      setActiveLetter(hash || null)
    }

    updateActiveFromHash()
    window.addEventListener('hashchange', updateActiveFromHash)

    return () => {
      window.removeEventListener('hashchange', updateActiveFromHash)
    }
  }, [])

  return (
    <div className="flex flex-wrap gap-2 rounded-[16px] bg-[#ececec] p-4">
      {letters.map((letter) => {
        const isActive = activeLetter === letter

        return (
          <a
            key={letter}
            href={`#letter-${letter}`}
            onClick={() => setActiveLetter(letter)}
            className={`font-title flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-[20px] uppercase leading-none transition ${
              isActive
                ? 'bg-[#ef233c] text-white'
                : 'bg-transparent text-[#111] hover:bg-white/50'
            }`}
          >
            {letter}
          </a>
        )
      })}
    </div>
  )
}