import './Analysis.css'
import React from 'react'

export default function Analysis (props) {
  return (
    <div className='analysis-choice-div'>
      <label htmlFor={props.analysis.name} className='radio-btn-container'>
        <input
          type='radio'
          id={props.analysis.name}
          className='radio-btn'
          name='steelgrade'
          value={props.analysis.name}
          onChange={props.buttonClicked}
        />
        <span className='radio-btn-span'>{props.analysis.name}</span>
      </label>
    </div>
  )
}
