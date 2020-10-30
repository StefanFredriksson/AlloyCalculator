import React, { useContext, useEffect } from 'react'
import './FlashMessage.css'
import { FlashMessageContext } from '../../Store'

export default function FlashMessage () {
  const [flash, setFlash] = useContext(FlashMessageContext)

  useEffect(() => {
    if (flash.visible) {
      setTimeout(() => {
        flash.visible = false
        flash.message = ''
        setFlash({ ...flash })
      }, 3000)
    }
  }, [...Object.values(flash)])

  return (
    <div
      id='flash-message-container'
      style={{ visibility: flash.visible ? 'visible' : 'hidden' }}
    >
      <h3>{flash.message}</h3>
    </div>
  )
}
