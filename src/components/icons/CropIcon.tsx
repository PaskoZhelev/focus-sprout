import type { ReactNode } from 'react'
import type { CropId } from '../../game/catalog'

const LEAF = '#4f7d3f'
const LEAF_LIGHT = '#6f9d52'
const SHINE = { stroke: '#fff', strokeOpacity: 0.45, strokeWidth: 1.1, strokeLinecap: 'round', fill: 'none' } as const

const DRAWINGS: Record<CropId, ReactNode> = {
  radish: (
    <>
      <path d="M12 10C11 6 8.5 3.5 6 4c-.5 2.8 2.5 5.5 6 6z" fill={LEAF} />
      <path d="M12 10c.8-4.2 3.2-7 6-6.8.4 3-2.4 6-6 6.8z" fill={LEAF_LIGHT} />
      <path d="M12 22v1.5" stroke="#b8325a" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M12 22c-4-1-6.5-4-6.5-7.2 0-3.2 2.9-5.3 6.5-5.3s6.5 2.1 6.5 5.3C18.5 18 16 21 12 22z" fill="#b8325a" />
      <path d="M8.4 14c.5-1.3 1.6-2.2 3-2.5" {...SHINE} />
    </>
  ),
  carrot: (
    <>
      <path d="M16 9c-.3-2.7.6-5 2.2-6.2.9 1.7.4 4.2-1.2 6.2z" fill={LEAF} />
      <path d="M16.5 9.8c1.9-1.8 4.3-2.3 6-1.6-1.2 1.6-3.7 2.2-6 1.6z" fill={LEAF_LIGHT} />
      <path
        d="M3.5 20.5C5 17 10 10.5 13 8.5c1.6-1 3.6-.2 4.3 1.2.7 1.4.3 3.1-1 4-2.9 2.2-9.3 5.6-12.8 6.8z"
        fill="#e07b2a"
      />
      <path d="M9 14.5l1.6 1M11.6 12l1.4 1.1M6.9 17.3l1.1.8" stroke="#a9541a" strokeWidth=".9" strokeLinecap="round" />
    </>
  ),
  potato: (
    <>
      <path
        d="M4 13.5C3.3 9.8 6.3 6.5 10.5 6c3.2-.4 5.2 1 7.5 1.2 2.5.3 3.8 2.3 3.3 4.8-.6 3.4-3.6 6-8 6.3-4.8.3-8.6-1.1-9.3-4.8z"
        fill="#c49a5e"
      />
      <g fill="#7d5a2e">
        <circle cx="9" cy="10" r=".75" />
        <circle cx="14.5" cy="13.6" r=".75" />
        <circle cx="17.6" cy="9.6" r=".65" />
        <circle cx="7.8" cy="14.4" r=".6" />
      </g>
    </>
  ),
  tomato: (
    <>
      <path d="M12 7.5c5 0 8.5 3 8.5 7s-3.5 7-8.5 7-8.5-3-8.5-7 3.5-7 8.5-7z" fill="#cf3b2b" />
      <path d="M6.8 12.6c.6-1.3 1.8-2.2 3.2-2.6" {...SHINE} />
      <path
        d="M12 8.6 8.8 7.4M12 8.6l3.2-1.2M12 8.6l-1.7-2.5M12 8.6l1.7-2.5M12 8.6V4"
        stroke={LEAF}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  corn: (
    <>
      <path d="M12 2.5c2.4 0 3.8 3.2 3.8 8.2S14.4 20 12 20s-3.8-4.3-3.8-9.3S9.6 2.5 12 2.5z" fill="#e9b92f" />
      <path d="M9 7.5h6M8.4 10.5h7.2M8.6 13.5h6.8M9.4 16.5h5.2M12 3v16.5" stroke="#b8871b" strokeWidth=".7" fill="none" />
      <path d="M12 21.5C8.5 20 5.5 15.5 5.5 9.5c2 1.8 3.8 5.4 4.6 9.2z" fill={LEAF_LIGHT} />
      <path d="M12 21.5c3.5-1.5 6.5-6 6.5-12-2 1.8-3.8 5.4-4.6 9.2z" fill={LEAF} />
    </>
  ),
  pumpkin: (
    <>
      <path d="M12 7.5c0-2 .5-3.5 2-4.5" stroke="#5b6b2f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path
        d="M12 7c-1.4-.8-3.2-1-4.8-.5C4.1 7.4 2.5 10.3 2.5 13.5s1.8 6 4.8 6.9c1.6.5 3.3.3 4.7-.5 1.4.8 3.1 1 4.7.5 3-.9 4.8-3.7 4.8-6.9s-1.6-6.1-4.7-7c-1.6-.5-3.4-.3-4.8.5z"
        fill="#d9772b"
      />
      <path
        d="M12 7.2c-1.8 1.8-2.4 4-2.4 6.3s.6 4.6 2.4 6.4M12 7.2c1.8 1.8 2.4 4 2.4 6.3s-.6 4.6-2.4 6.4"
        stroke="#a5521b"
        strokeWidth=".9"
        fill="none"
      />
    </>
  ),
  strawberry: (
    <>
      <path
        d="M12 21.5c-3.8-1.4-7-5.5-7-9.3 0-2.8 2.2-4.7 4.6-4.4 1 .1 1.7.5 2.4.5s1.4-.4 2.4-.5c2.4-.3 4.6 1.6 4.6 4.4 0 3.8-3.2 7.9-7 9.3z"
        fill="#d23a3f"
      />
      <g fill="#f3d58a">
        <ellipse cx="9" cy="11.3" rx=".45" ry=".7" />
        <ellipse cx="12" cy="10.8" rx=".45" ry=".7" />
        <ellipse cx="15" cy="11.3" rx=".45" ry=".7" />
        <ellipse cx="10.5" cy="14.2" rx=".45" ry=".7" />
        <ellipse cx="13.5" cy="14.2" rx=".45" ry=".7" />
        <ellipse cx="12" cy="17.4" rx=".45" ry=".7" />
      </g>
      <path d="M12 8.6 7.8 6.4l2.3-.3-.7-2.3L12 5.6l2.6-1.8-.7 2.3 2.3.3z" fill={LEAF} />
    </>
  ),
  saffron: (
    <>
      <path d="M12 22c-1.5-3-3.5-5-6-6 1.8 2.2 3.4 4 6 6zM12 22c1.5-3 3.5-5 6-6-1.8 2.2-3.4 4-6 6z" fill={LEAF_LIGHT} />
      <path d="M12 22v-8" stroke={LEAF} strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M12 15c-3.2 0-5-3-5-7 1.8.2 3.2 1.1 4 2.3.2-2.8.8-5 1-6.8.2 1.8.8 4 1 6.8.8-1.2 2.2-2.1 4-2.3 0 4-1.8 7-5 7z"
        fill="#8b5cb8"
      />
      <path d="M12 11.5 10.3 5.8M12 11.5V5M12 11.5l1.7-5.7" stroke="#d6392b" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
}

export function CropIcon({ id, className }: { id: CropId; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {DRAWINGS[id]}
    </svg>
  )
}
