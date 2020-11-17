import './ConfirmEdit.css'
import React from 'react'

export default function ConfirmEdit (props) {
  return (
    <div id='confirm-edit-container'>
      <button onClick={props.goBack}>Go Back</button>
      <button onClick={props.saveAlloy}>Save</button>
    </div>
  )
}
