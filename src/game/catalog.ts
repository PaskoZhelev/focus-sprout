export interface CropDefinition {
  readonly id: string
  readonly name: string
  readonly latin: string
  /** Lowercase nouns used in sentences, e.g. "3 potatoes". */
  readonly one: string
  readonly many: string
  /** Coins required to unlock. The first crop is free. */
  readonly price: number
  /** Coins earned per harvested crop. */
  readonly value: number
}

/** Crops unlock strictly in this order. */
export const CROPS = [
  { id: 'radish', name: 'Radish', latin: 'Raphanus sativus', one: 'radish', many: 'radishes', price: 0, value: 5 },
  { id: 'carrot', name: 'Carrot', latin: 'Daucus carota', one: 'carrot', many: 'carrots', price: 25, value: 8 },
  { id: 'potato', name: 'Potato', latin: 'Solanum tuberosum', one: 'potato', many: 'potatoes', price: 100, value: 13 },
  { id: 'tomato', name: 'Tomato', latin: 'Solanum lycopersicum', one: 'tomato', many: 'tomatoes', price: 300, value: 21 },
  { id: 'corn', name: 'Sweetcorn', latin: 'Zea mays', one: 'cob', many: 'cobs', price: 800, value: 34 },
  { id: 'pumpkin', name: 'Pumpkin', latin: 'Cucurbita maxima', one: 'pumpkin', many: 'pumpkins', price: 2000, value: 55 },
  {
    id: 'strawberry',
    name: 'Strawberry',
    latin: 'Fragaria × ananassa',
    one: 'punnet of strawberries',
    many: 'punnets of strawberries',
    price: 5000,
    value: 89,
  },
  {
    id: 'saffron',
    name: 'Saffron',
    latin: 'Crocus sativus',
    one: 'pinch of saffron',
    many: 'pinches of saffron',
    price: 12000,
    value: 144,
  },
] as const satisfies readonly CropDefinition[]

export type CropId = (typeof CROPS)[number]['id']

export interface YieldLevel {
  readonly name: string
  /** Crops harvested per completed focus session. */
  readonly yield: number
  readonly cost: number
}

export const YIELD_LEVELS = [
  { name: 'Bare soil', yield: 1, cost: 0 },
  { name: 'Watering can', yield: 2, cost: 40 },
  { name: 'Compost heap', yield: 3, cost: 150 },
  { name: 'Raised beds', yield: 4, cost: 450 },
  { name: 'Drip irrigation', yield: 5, cost: 1200 },
  { name: 'Cold frame', yield: 6, cost: 3000 },
  { name: 'Polytunnel', yield: 7, cost: 7000 },
  { name: 'Greenhouse', yield: 8, cost: 15000 },
] as const satisfies readonly YieldLevel[]

export const MAX_YIELD_LEVEL = YIELD_LEVELS.length - 1

export function getCrop(id: CropId): CropDefinition {
  // Safe: CropId is derived from CROPS.
  return CROPS.find((crop) => crop.id === id)!
}

export function isCropId(value: unknown): value is CropId {
  return CROPS.some((crop) => crop.id === value)
}

export function countCrop(crop: CropDefinition, amount: number): string {
  return `${amount} ${amount === 1 ? crop.one : crop.many}`
}
