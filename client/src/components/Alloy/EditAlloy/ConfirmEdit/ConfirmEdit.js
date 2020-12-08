import './ConfirmEdit.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default function ConfirmEdit (props) {
  return (
    <div id='confirm-edit-container'>
      <Link to={props.link}>Go Back</Link>
      <button onClick={props.save}>Save</button>
    </div>
  )
}
