import './AlloyNamePrice.css'
import React from 'react'

export default function AlloyNamePrice (props) {
  return (
    <div className='name-value-container'>
      <div className='input-field'>
        <input
          id='name-input'
          type='text'
          defaultValue={props.alloy.name}
          required
        />
        <label>Alloy name</label>
        <span />
      </div>
      <div className='input-field'>
        <input
          id='price-input'
          type='number'
          defaultValue={props.alloy.price}
          step='any'
          min='0'
          required
        />
        <label>Alloy price (kr/kg)</label>
        <span />
      </div>
    </div>
  )
}
