export const CELL_SIZE = 25
export const CELL_HALF_SIZE = CELL_SIZE / 2

export const DRAG_PAYLOAD_SYMBOL = Symbol('dragPayload')

/**
 * @description
 * Reconstructs passed template literal just like without such a tag
 * Useful for syntax highlighting (styled-components)
 */
const css = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((acc, s, i) => `${acc}${s}${values[i] ?? ''}`, '')

export const cssVariables = css`
  /**
   * sizings
  */
  --cell-size: ${CELL_SIZE}px;

  /**
   * colors (src: data/gui/colours/kenshi_colours.xml)
  */
  /* general */
  --color-main: #767676;
  --color-secondary: #767676;
  --color-title: #b7a074;
  --color-bad: #d95353;
  --color-badBright: #d95353;
  --color-good: #a8b774;
  --color-goodBright: #a8b774;
  --color-greyed: #555555;
  --color-greyedBright: #555555;
  --color-special: #14ffdc;
  --color-alert: #767676;
  /* name tags */
  --color-nameTagSelected: #ffffff;
  --color-nameTagUnselected: #b3b3b3;
  --color-nameTagStealthHidden: #4085be;
  --color-nameTagStealthAlmostSeen: #beb840;
  --color-nameTagStealthSeen: #be404a;
  /* dialogue bubble */
  --color-dialogueBubbleText: #767676;
  /* dialogue window */
  --color-dialogueTextOption: #767676;
  --color-dialogueTextOptionHover: #a8b774;
  /* ground item's labels */
  --color-dropItemLabelBackDefault: #767676;
  --color-dropItemLabelBackSelected: #a8b774;
  --color-dropItemLabelBackSelectedStealing: #d95353;
  --color-dropItemLabelTextDefault: #767676;
  --color-dropItemLabelTextSelected: #a8b774;
  --color-dropItemLabelTextSelectedStealing: #d95353;
  /* items rating */
  --color-itemStandard: #e0cccc;
  --color-itemArtifact: #0dfceb;
  --color-itemGrade0: #666666;
  --color-itemGrade1: #d9ccbf;
  --color-itemGrade2: #4099b3;
  --color-itemGrade3: #66fc80;
  --color-itemGrade4: #fceb0d;
  /* map */
  --color-markerAlly: #5cb473;
  --color-markerNeutral: #dfdfdf;
  --color-markerEnemy: #e65139;
  --color-markerPlayer: #8dcdff;
  --color-markerMovement: #79b44b;
`
