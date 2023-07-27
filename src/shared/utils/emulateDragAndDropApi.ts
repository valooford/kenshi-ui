interface IEmulateDragAndDropApiParameters {
  element: Element | null
  elementPointX: number
  elementPointY: number
  clientX: number
  clientY: number
  iWillRelease: boolean
}

/** @description Initiates drag events on overlapped elements while listening for respective mouse events */
export const emulateDragAndDropApi = ({
  element,
  elementPointX,
  elementPointY,
  clientX,
  clientY,
  iWillRelease,
}: IEmulateDragAndDropApiParameters) => {
  const dataTransfer = new DataTransfer()
  dataTransfer.setData(`dnd/button-will-release`, `${iWillRelease ? 0 : 1}`)

  let elementToOver: Element | null
  const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
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
      shiftKey: true,
      clientX: elementPointX,
      clientY: elementPointY,
    })
  )

  return new Promise<void>((resolve) => {
    const onMouseDropEvent = (e: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener(mouseDropEvent, onMouseDropEvent)
      setTimeout(() => {
        const elementToDrop = document.elementFromPoint(e.clientX, e.clientY)
        elementToDrop?.dispatchEvent(
          new DragEvent('drop', {
            clientX: e.clientX,
            clientY: e.clientY,
            dataTransfer,
            bubbles: true,
            // setting cancelable=true is crucial because it allows to check
            // defaultPrevented property to see if the drop was successful
            cancelable: true,
          })
        )
        // elementToDrop?.dispatchEvent(new DragEvent('dragleave', { bubbles: true }))
        element?.dispatchEvent(new DragEvent('dragend', { bubbles: true }))
        resolve()
      }, 0)
    }

    // to continue dragging immediately (do not wait for mouse movements)
    onMouseMove(new MouseEvent('mousemove', { clientX, clientY }))
    setTimeout(() => {
      // prevent handling the freshly programmatically triggered 'mousedown' event
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener(mouseDropEvent, onMouseDropEvent)
    }, 0)
  })
}
