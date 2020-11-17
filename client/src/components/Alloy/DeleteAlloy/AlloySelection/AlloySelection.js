import React from 'react'

export default function AlloySelection (props) {
  return (
    <div>
      <label htmlFor={props.alloy.name} className='radio-btn-container'>
        <input
          type='checkbox'
          id={props.alloy.name}
          className='radio-btn'
          name='alloy'
          value={props.alloy.name}
        />
        <span className='radio-btn-span'>{props.alloy.name}</span>
      </label>
    </div>
  )
}
