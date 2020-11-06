import React from 'react'
import './AddedAlloys.css'

export default function AddedAlloys (props) {
  return (
    <div className='added-alloy'>
      <label>{props.alloy.name}</label>
      <label>{props.alloy.Weight.toFixed(3)}kg</label>
      <label>{props.alloy.TotalPrice.toFixed(2)}kr</label>
    </div>
  )
}
