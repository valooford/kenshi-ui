export enum SoundMilestone {
  Common = 0,
  Items = 8,
}

export enum CommonSound {
  Tick,
  TimeStart,
  TimeStop = 3,
  InventoryOpen = 5,
  InventoryClose,
  InventoryCloseEsc,
}

// Ambient sound layers
// A Full Explanation of Kenshi's Music System: https://www.youtube.com/watch?v=wPEJRJWHz4k
export const BEDS = [
  'Dunes_Music_Bank.007',
  'Dunes_Music_Bank.014',
  'Dunes_Music_Bank.020',
  'Dunes_Music_Bank.025',
  'Dunes_Music_Bank.032',
  'Dunes_Music_Bank.054',
].map((f) => `src/assets/audio/beds/${f}.mp3`)

export const FRAMES = [
  'Dunes_Music_Bank.003',
  'Dunes_Music_Bank.004',
  'Dunes_Music_Bank.006',
  'Dunes_Music_Bank.008',
  'Dunes_Music_Bank.009',
  'Dunes_Music_Bank.013',
  'Dunes_Music_Bank.016',
  'Dunes_Music_Bank.018',
  'Dunes_Music_Bank.021',
  'Dunes_Music_Bank.022',
  'Dunes_Music_Bank.023',
  'Dunes_Music_Bank.026',
  'Dunes_Music_Bank.028',
  'Dunes_Music_Bank.029',
  'Dunes_Music_Bank.030',
  'Dunes_Music_Bank.034',
  'Dunes_Music_Bank.036',
  'Dunes_Music_Bank.037',
  'Dunes_Music_Bank.038',
  'Dunes_Music_Bank.040',
  'Dunes_Music_Bank.041',
  'Dunes_Music_Bank.042',
  'Dunes_Music_Bank.043',
  'Dunes_Music_Bank.044',
  'Dunes_Music_Bank.046',
  'Dunes_Music_Bank.046',
  'Dunes_Music_Bank.047',
  'Dunes_Music_Bank.048',
  'Dunes_Music_Bank.049',
  'Dunes_Music_Bank.050',
  'Dunes_Music_Bank.051',
  'Dunes_Music_Bank.052',
  'Dunes_Music_Bank.053',
].map((f) => `src/assets/audio/frames/${f}.mp3`)

export const CANOPY = [
  'Dunes_Music_Bank.001',
  'Dunes_Music_Bank.002',
  'Dunes_Music_Bank.005',
  'Dunes_Music_Bank.010',
  'Dunes_Music_Bank.011',
  'Dunes_Music_Bank.012',
  'Dunes_Music_Bank.015',
  'Dunes_Music_Bank.017',
  'Dunes_Music_Bank.019',
  'Dunes_Music_Bank.024',
  'Dunes_Music_Bank.027',
  'Dunes_Music_Bank.031',
  'Dunes_Music_Bank.033',
  'Dunes_Music_Bank.035',
  'Dunes_Music_Bank.039',
  'Dunes_Music_Bank.045',
].map((f) => `src/assets/audio/canopy/${f}.mp3`)
