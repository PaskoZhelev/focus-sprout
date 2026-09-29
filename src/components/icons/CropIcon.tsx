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
  lettuce: (
    <>
      <path d="M12 21c-5 0-8.5-2.6-8.5-6.3 0-2 1.2-3.3 2.6-3.6C6.3 8 8.8 6 12 6s5.7 2 5.9 5.1c1.4.3 2.6 1.6 2.6 3.6 0 3.7-3.5 6.3-8.5 6.3z" fill={LEAF_LIGHT} />
      <path d="M12 19.5c-3.3 0-5.6-1.8-5.6-4.3 0-2.7 2.5-4.9 5.6-4.9s5.6 2.2 5.6 4.9c0 2.5-2.3 4.3-5.6 4.3z" fill="#9cc56a" />
      <path d="M12 19.5v-6.8M12 15.5l-2.6-2M12 15.5l2.6-2M12 18l-3.6-1.8M12 18l3.6-1.8" stroke="#e4f0c8" strokeWidth=".8" strokeLinecap="round" fill="none" />
    </>
  ),
  springOnion: (
    <>
      <path d="M11 13 8.2 2.5M12 13V2M13 13l2.8-10.5" stroke={LEAF} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.2 12.2 6 4.5M13.8 12.2 18 4.5" stroke={LEAF_LIGHT} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.8 12h4.4v4.8c0 2-1 3.6-2.2 3.6s-2.2-1.6-2.2-3.6z" fill="#f3f0e2" stroke="#c8c3a8" strokeWidth=".6" />
      <path d="M10.8 20.4 10 22.5M12 20.6v2.2M13.2 20.4l.8 2.1" stroke="#b9a97d" strokeWidth=".8" strokeLinecap="round" />
    </>
  ),
  pea: (
    <>
      <path d="M3 15.5c3-4.8 8.6-8.6 14.5-8.6 1.5 0 2.8.3 3.5.8-.6 5.6-6.6 10.6-13.2 10.6-2 0-3.8-1.1-4.8-2.8z" fill={LEAF_LIGHT} />
      <g fill="#a9d06a" stroke={LEAF} strokeWidth=".5">
        <circle cx="7.5" cy="14.8" r="1.8" />
        <circle cx="11.3" cy="12.9" r="1.9" />
        <circle cx="15.2" cy="11" r="1.8" />
      </g>
      <path d="M17.5 6.9C18 5 19.3 3.8 21 3.5" stroke={LEAF} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </>
  ),
  broadBean: (
    <>
      <path d="M4.5 19.5C3 16.6 5.3 12 9.6 8.5 13.8 5 18.5 3.6 20.4 5.2c1.7 1.5.2 6.3-3.8 10-4.2 3.9-10.4 7-12.1 4.3z" fill="#8fb863" />
      <path d="M7.2 17c-.8-.8.3-2.2 1.7-2.4M10.7 13.8c-.8-.8.3-2.2 1.7-2.4M14.2 10.6c-.8-.8.3-2.2 1.7-2.4" stroke="#5d8a3a" strokeWidth=".9" strokeLinecap="round" fill="none" />
      <path d="M6.4 18.2c4-2 9.3-6.4 12.3-11.3" {...SHINE} />
    </>
  ),
  rhubarb: (
    <>
      <path d="M12 9C8.8 9.5 5 8 3.5 4.8 6.5 3 10.5 3.6 12 6c1.5-2.4 5.5-3 8.5-1.2C19 8 15.2 9.5 12 9z" fill={LEAF} />
      <path d="M9.5 21.5 11 8.5M12 21.5V8.2M14.5 21.5 13 8.5" stroke="#c73a4a" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M11.9 20 12 11" stroke="#e97a86" strokeWidth=".7" strokeLinecap="round" />
    </>
  ),
  artichoke: (
    <>
      <path d="M12 22v-3" stroke={LEAF} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 19.5c-4.2 0-6.8-3-6.8-6.8C5.2 8.5 8 4.8 12 2.5c4 2.3 6.8 6 6.8 10.2 0 3.8-2.6 6.8-6.8 6.8z" fill="#7c9a55" />
      <path d="M12 19.5c-2.6-1-4.1-3.5-4.1-6.3M12 19.5c2.6-1 4.1-3.5 4.1-6.3M12 15.5c-1.8-1-2.8-2.9-2.8-5M12 15.5c1.8-1 2.8-2.9 2.8-5M12 11c-.9-.8-1.4-2.2-1.4-3.6M12 11c.9-.8 1.4-2.2 1.4-3.6" stroke="#8a5a9c" strokeWidth=".9" fill="none" strokeLinecap="round" />
    </>
  ),
  asparagus: (
    <>
      <path d="M9 22 10 5M12 22V3.5M15 22 14 5" stroke="#6d9a45" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M10 5.5c-.8-.8-.7-2.3 0-3 .7.7.8 2.2 0 3zM12 4c-.8-.8-.7-2.3 0-3 .7.7.8 2.2 0 3zM14 5.5c-.8-.8-.7-2.3 0-3 .7.7.8 2.2 0 3z" fill="#7a5a8c" />
      <path d="M8 16.5h8" stroke="#c9483a" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  courgette: (
    <>
      <path d="M4.5 20.5c-1.2-1.2-.5-3.2 1.5-5.2l8.5-8.5c2-2 4.2-2.5 5.3-1.4 1.1 1.1.6 3.3-1.4 5.3l-8.5 8.5c-2 2-4.2 2.5-5.4 1.3z" fill="#3f6b31" />
      <path d="M7 16.5l8.8-8.8M9 18.2l7.8-7.8" stroke="#6f9d52" strokeWidth=".8" strokeLinecap="round" />
      <path d="M19.8 5.4 21.5 3" stroke="#8a9a5b" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  greenBean: (
    <>
      <path d="M5 3.5c1 5.5 2.5 11 6.5 17" stroke="#5f9a3e" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M11 3c.2 5.8 1.2 11.5 4 17.5" stroke={LEAF_LIGHT} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M17 3.5c-.5 5.8-.2 11.3 1.5 17" stroke="#5f9a3e" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  cucumber: (
    <>
      <path d="M5.5 19.5C3.8 17.8 4.8 14.5 8 11.3l3.3-3.3c3.2-3.2 6.5-4.2 8.2-2.5s.7 5-2.5 8.2L13.7 17c-3.2 3.2-6.5 4.2-8.2 2.5z" fill="#4a7a36" />
      <g fill="#a8c77f">
        <circle cx="8.4" cy="14.6" r=".55" />
        <circle cx="11.2" cy="12.9" r=".55" />
        <circle cx="13.5" cy="10" r=".55" />
        <circle cx="16" cy="8.8" r=".55" />
        <circle cx="10.4" cy="16.4" r=".55" />
        <circle cx="14.6" cy="12.8" r=".55" />
      </g>
    </>
  ),
  pepper: (
    <>
      <path d="M12 7c0-2 .8-3.5 2.5-4" stroke="#5b6b2f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M12 7.2c-1.2-.8-3-1-4.5-.3C5.4 7.8 4.8 10.4 5.2 13c.5 3.6 2.2 7.5 4.6 8 1 .2 1.6-.4 2.2-.4s1.2.6 2.2.4c2.4-.5 4.1-4.4 4.6-8 .4-2.6-.2-5.2-2.3-6.1-1.5-.7-3.3-.5-4.5.3z" fill="#d83a2a" />
      <path d="M12 7.5v12.8" stroke="#a82a1d" strokeWidth=".8" />
      <path d="M7.4 10.5c.2-1.1.8-1.9 1.7-2.3" {...SHINE} />
    </>
  ),
  melon: (
    <>
      <path d="M12 4c4.7 0 8.5 3.8 8.5 8.5S16.7 21 12 21s-8.5-3.8-8.5-8.5S7.3 4 12 4z" fill="#c9b36a" />
      <path d="M5 9.5c3.5 2 10.5 2 14 0M4.2 14c4 2 11.6 2 15.6 0M12 4c-3 3-3 14 0 17M12 4c3 3 3 14 0 17M7 5.8c-1.5 4-1 10.5 1 13.8M17 5.8c1.5 4 1 10.5-1 13.8" stroke="#ece0b0" strokeWidth=".7" fill="none" />
      <path d="M12 4V2.5" stroke="#5b6b2f" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  beetroot: (
    <>
      <path d="M12 9.5C10.5 6 7.5 3.5 4.8 4.2c-.2 2.8 3.2 5.2 7.2 5.3z" fill={LEAF} />
      <path d="M12 9.5c1.5-3.5 4.5-6 7.2-5.3.2 2.8-3.2 5.2-7.2 5.3z" fill={LEAF_LIGHT} />
      <path d="M10.2 9.2 12 5.5l1.8 3.7" stroke="#8e2a4e" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M12 23c-.3-1-.5-1.7-.8-2.3C8 19.8 5.8 17.4 5.8 14.8c0-3 2.8-5.3 6.2-5.3s6.2 2.3 6.2 5.3c0 2.6-2.2 5-5.4 5.9-.3.6-.5 1.3-.8 2.3z" fill="#7c2146" />
      <path d="M8.5 14c.4-1.2 1.4-2.1 2.7-2.4" {...SHINE} />
    </>
  ),
  apple: (
    <>
      <path d="M12 8.2C10.5 7 8.4 6.8 6.8 7.6 4.4 8.9 3.8 12 4.6 15c.9 3.4 3.4 6.3 5.6 6.3.9 0 1.2-.5 1.8-.5s.9.5 1.8.5c2.2 0 4.7-2.9 5.6-6.3.8-3-.2-6.1-2.2-7.4-1.6-.9-3.7-.6-5.2.6z" fill="#c8352c" />
      <path d="M12 8.5c0-2.2.4-3.8 1.4-5" stroke="#6b4a2a" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M13 5.5c1.2-1.8 3.4-2.5 5.4-2-.9 1.9-3.2 2.8-5.4 2z" fill={LEAF_LIGHT} />
      <path d="M6.6 12c.3-1.3 1.1-2.3 2.2-2.8" {...SHINE} />
    </>
  ),
  pear: (
    <>
      <path d="M12 5.5c-1.7 0-2.7 1.4-2.8 3.4-.1 2-1.2 2.9-2.4 4.4-1.5 1.8-2 4-.9 5.9 1.1 2 3.4 2.8 6.1 2.8s5-.8 6.1-2.8c1.1-1.9.6-4.1-.9-5.9-1.2-1.5-2.3-2.4-2.4-4.4-.1-2-1.1-3.4-2.8-3.4z" fill="#b9c24a" />
      <path d="M12 5.8c0-1.6.3-2.6 1-3.4" stroke="#6b4a2a" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M12.6 4c1-1.3 2.8-1.8 4.3-1.3-.8 1.4-2.6 2-4.3 1.3z" fill={LEAF} />
      <path d="M8 15c.3-1.1 1-2 1.8-2.6" {...SHINE} />
    </>
  ),
  grape: (
    <>
      <path d="M12 6c0-1.6.6-2.8 1.8-3.5" stroke="#6b4a2a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M13 4.8c1.6-1.8 4.4-2 6.5-.8-1.3 2-4.2 2.4-6.5.8z" fill={LEAF_LIGHT} />
      <g fill="#6b3f8a" stroke="#4d2a66" strokeWidth=".5">
        <circle cx="8" cy="8.5" r="2" />
        <circle cx="12" cy="8.2" r="2" />
        <circle cx="16" cy="8.5" r="2" />
        <circle cx="10" cy="11.8" r="2" />
        <circle cx="14" cy="11.8" r="2" />
        <circle cx="12" cy="15.1" r="2" />
        <circle cx="8.6" cy="15" r="1.7" />
        <circle cx="15.4" cy="15" r="1.7" />
        <circle cx="12" cy="18.8" r="2" />
      </g>
    </>
  ),
  kale: (
    <>
      <path d="M12 22.5v-5" stroke="#4a6a3a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 18c-4 0-7-3-7-7 1-.5 1-1.5 1.5-2.5.7-.3 1.3-1.4 1.6-2.3.8 0 1.6-1 2.2-1.9.6.3 1.2-.3 1.7-1 .5.7 1.1 1.3 1.7 1 .6.9 1.4 1.9 2.2 1.9.3.9.9 2 1.6 2.3.5 1 .5 2 1.5 2.5 0 4-3 7-7 7z" fill="#3d6a45" />
      <path d="M12 18V6.5M12 11l-3-2.4M12 11l3-2.4M12 14.5l-4-2.5M12 14.5l4-2.5" stroke="#8fb58f" strokeWidth=".8" strokeLinecap="round" fill="none" />
    </>
  ),
  leek: (
    <>
      <path d="M13.5 10.5 16 2.5M13.8 10.8 20.5 4.5M13 10.5 11.5 2" stroke="#3f6b3f" strokeWidth="2" strokeLinecap="round" />
      <path d="M13.8 10.2 9 17" stroke="#b7cf8a" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M9.6 16.2 5.2 21.2" stroke="#f1eedc" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M4.2 21.6 3 22.8M4.8 22.4 4.5 23.5M3.5 20.8 2.4 21.3" stroke="#b9a97d" strokeWidth=".8" strokeLinecap="round" />
    </>
  ),
  parsnip: (
    <>
      <path d="M12 7.5C11.5 5 9.8 3 8 2.8c-.4 2 1.4 4 4 4.7zM12 7.5c.5-2.5 2.2-4.5 4-4.7.4 2-1.4 4-4 4.7z" fill={LEAF_LIGHT} />
      <path d="M12 23c-1.3-3.5-3.8-10.5-3.8-12.8C8.2 8.5 10 7.3 12 7.3s3.8 1.2 3.8 2.9c0 2.3-2.5 9.3-3.8 12.8z" fill="#ecdcb0" />
      <path d="M10 11.5h1.6M12.6 14h1.2M10.8 16.8h1.2" stroke="#b9a070" strokeWidth=".8" strokeLinecap="round" />
    </>
  ),
  sprouts: (
    <>
      <g stroke="#3f6b31" strokeWidth=".7">
        <circle cx="8" cy="15.5" r="4.3" fill="#6f9d52" />
        <circle cx="16" cy="15.5" r="4.3" fill="#86b35d" />
        <circle cx="12" cy="8.5" r="4.3" fill="#7aa857" />
      </g>
      <path d="M8 11.5c-1.3 1.2-1.8 2.8-1.6 4.5M8 11.5c1.3 1.2 1.8 2.8 1.6 4.5M16 11.5c-1.3 1.2-1.8 2.8-1.6 4.5M16 11.5c1.3 1.2 1.8 2.8 1.6 4.5M12 4.5c-1.3 1.2-1.8 2.8-1.6 4.5M12 4.5c1.3 1.2 1.8 2.8 1.6 4.5" stroke="#c7df9e" strokeWidth=".7" fill="none" strokeLinecap="round" />
    </>
  ),
  redCabbage: (
    <>
      <path d="M12 3.5c5 0 8.5 3.8 8.5 8.8S17 21 12 21s-8.5-3.7-8.5-8.7S7 3.5 12 3.5z" fill="#6c3a7c" />
      <path d="M12 21c-3.5-2-5.2-5.3-5.2-8.8 0-3 1.3-6 3.4-8.4M12 21c3.5-2 5.2-5.3 5.2-8.8 0-3-1.3-6-3.4-8.4" stroke="#9a6aa8" strokeWidth=".9" fill="none" />
      <path d="M12 21V9.5M12 13.5l-2.5-2.2M12 13.5l2.5-2.2M12 17l-3-2.2M12 17l3-2.2" stroke="#d6bfe0" strokeWidth=".8" strokeLinecap="round" fill="none" />
    </>
  ),
  celeriac: (
    <>
      <path d="M10.5 9.5 8.5 2.5M12 9.2V2M13.5 9.5l2-7" stroke={LEAF} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8.8c3.8 0 6.8 2.2 6.8 5.4 0 3.3-2.8 5.8-6.8 5.8s-6.8-2.5-6.8-5.8c0-3.2 3-5.4 6.8-5.4z" fill="#d8cda4" />
      <path d="M8 19 6 22M10.5 20l-.8 2.8M13.5 20l.8 2.8M16 19l2 3" stroke="#a89468" strokeWidth=".9" strokeLinecap="round" />
      <g fill="#a89468">
        <circle cx="9" cy="13.5" r=".6" />
        <circle cx="14.5" cy="15.8" r=".6" />
        <circle cx="12.5" cy="12" r=".5" />
      </g>
    </>
  ),
  chicory: (
    <>
      <path d="M12 2.5c3 2.5 4.5 7 4.5 11.5 0 4.3-2 7.5-4.5 7.5s-4.5-3.2-4.5-7.5c0-4.5 1.5-9 4.5-11.5z" fill="#f2ecd2" stroke="#cfc59c" strokeWidth=".6" />
      <path d="M12 2.5c1.6 1.5 2.4 3.6 2.6 5.6-1-.8-1.8-.9-2.6-.9s-1.6.1-2.6.9c.2-2 1-4.1 2.6-5.6z" fill="#d9d36a" />
      <path d="M12 21.5c-1.6-2.8-2.3-7-1.8-12.5M12 21.5c1.6-2.8 2.3-7 1.8-12.5" stroke="#cfc59c" strokeWidth=".7" fill="none" />
    </>
  ),
  truffle: (
    <>
      <path d="M11 5c2.5-1 5 .2 6.5 1.8 2 .3 3.4 2.4 3 4.6.9 1.7.6 4-1 5.3-.3 2.3-2.4 3.8-4.7 3.4-1.5 1.3-3.8 1.3-5.3.1-2.3.3-4.3-1.3-4.5-3.6C3.4 15.4 3 13 4.2 11.3c-.2-2.3 1.6-4.3 3.9-4.4.7-1 1.7-1.7 2.9-1.9z" fill="#3b2c26" />
      <g fill="#5a463c">
        <circle cx="8" cy="10" r=".7" />
        <circle cx="11.5" cy="8" r=".7" />
        <circle cx="15.5" cy="9.5" r=".7" />
        <circle cx="17.5" cy="13.5" r=".7" />
        <circle cx="6.5" cy="14" r=".7" />
        <circle cx="10" cy="17.5" r=".7" />
        <circle cx="14.5" cy="17.5" r=".7" />
      </g>
      <path d="M9 13.5c1.5-1.5 3.5-2 6-1.2M9.5 15c1.8.8 3.8.6 5.5-.5" stroke="#c9b8a0" strokeWidth=".7" strokeLinecap="round" fill="none" />
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
