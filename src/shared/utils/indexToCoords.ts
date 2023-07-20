export const indexToCoords = (i: number, w: number) => {
  const x = i % w
  const y = Math.floor(i / w)
  return { x, y }
}
