interface IEmulateDragAndDropApiParameters {
  element: Element | null
  elementPointX: number
  elementPointY: number
  screenX: number
  screenY: number
  pointerShift?: IPoint
  shiftKey?: boolean
  iWillRelease: boolean
}

/** @description Initiates drag events on overlapped elements while listening for respective mouse events */
export const emulateDragAndDropApi = ({
  element,
  elementPointX,
  elementPointY,
  screenX,
  screenY,
  pointerShift = { x: 0, y: 0 },
  shiftKey = false,
  iWillRelease,
}: IEmulateDragAndDropApiParameters) => {
  const dataTransfer = new DataTransfer()
  dataTransfer.setData(`dnd/button-will-release`, `${iWillRelease ? 0 : 1}`)

  let elementToOver: Element | null
  const onMouseMove = ({ clientX: pClientX, clientY: pClientY }: MouseEvent) => {
    const clientX = pClientX + pointerShift.x
    const clientY = pClientY + pointerShift.y
    element?.dispatchEvent(new DragEvent('drag', { clientX, clientY, bubbles: true }))
    const newElementToOver = document.elementFromPoint(clientX, clientY)
    if (elementToOver !== newElementToOver) {
      elementToOver?.dispatchEvent(new DragEvent('dragleave', { bubbles: true }))
      newElementToOver?.dispatchEvent(new DragEvent('dragenter', { dataTransfer, bubbles: true }))
      elementToOver = newElementToOver
    }
    elementToOver?.dispatchEvent(new DragEvent('dragover', { clientX, clientY, bubbles: true }))
  }

  const mouseDropEvent = iWillRelease ? 'mouseup' : 'mousedown'

  element?.dispatchEvent(
    new DragEvent('dragstart', {
      dataTransfer,
      bubbles: true,
      shiftKey,
      clientX: elementPointX,
      clientY: elementPointY,
    })
  )

  const overlappedElement = document.elementFromPoint(screenX, screenY) //! maybe inaccurate, because it's not the item's center
  overlappedElement?.dispatchEvent(new DragEvent('dragenter', { dataTransfer, bubbles: true }))

  return new Promise<void>((resolve) => {
    const onMouseDropEvent = (e: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener(mouseDropEvent, onMouseDropEvent)
      setTimeout(() => {
        const elementToDrop = document.elementFromPoint(
          e.clientX + pointerShift.x,
          e.clientY + pointerShift.y
        )
        elementToDrop?.dispatchEvent(
          new DragEvent('drop', {
            clientX: e.clientX + pointerShift.x,
            clientY: e.clientY + pointerShift.y,
            dataTransfer,
            bubbles: true,
            // setting cancelable=true is crucial because it allows to check
            // defaultPrevented property to see if the drop was successful
            cancelable: true,
          })
        )
        // elementToDrop?.dispatchEvent(new DragEvent('dragleave', { bubbles: true }))
        element?.dispatchEvent(new DragEvent('dragend', { dataTransfer, bubbles: true }))
        resolve()
      }, 0)
    }

    // prevent handling the freshly programmatically triggered 'mousedown' event
    setTimeout(() => {
      // to continue dragging immediately (do not wait for mouse movements)
      onMouseMove(new MouseEvent('mousemove', { clientX: screenX, clientY: screenY }))
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener(mouseDropEvent, onMouseDropEvent)
    }, 0)
  })
}
