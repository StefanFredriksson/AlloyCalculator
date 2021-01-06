import React from 'react'
import './FlashMessage.css'

export default function FlashMessage (props) {
  return (
    <div
      className={`flash-message-container ${
        props.data.show ? 'show-flash' : 'hide-flash'
      }`}
    >
      <label
        className={`flash-message ${
          props.data.success ? 'flash-success' : 'flash-error'
        }`}
      >
        {props.data.message}
      </label>
    </div>
  )
}
