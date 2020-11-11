import React from 'react'
import './Steelgrade.css'

export default function Steelgrade (props) {
  return (
    <div className='steelgrade-choice-div'>
      <label htmlFor={props.steelgrade.name} className='radio-btn-container'>
        <input
          type='radio'
          id={props.steelgrade.name}
          className='radio-btn'
          name='steelgrade'
          value={props.steelgrade.name}
          onChange={props.renderSteelgrade}
        />
        <span className='radio-btn-span'>{props.steelgrade.name}</span>
      </label>
    </div>
  )
}
