export interface IIconParameters {
  w: number
  h: number
  x: number
  y: number
  hover?: { x: number; y: number }
  active?: { x: number; y: number }
  selected?: { x: number; y: number }
}

export type IIconVariant =
  | 'close'
  | 'o'
  | 'expand-less'
  | 'expand-more'
  | 'pause'
  | 'normal'
  | 'faster'
  | 'fastest'
  | 'construction'
  | 'checkbox-off'
  | 'checkbox-on'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-top'
  | 'arrow-bottom'
  | 'rhombus'
  | 'walk'
  | 'jog'
  | 'run'
  | 'run-together'
