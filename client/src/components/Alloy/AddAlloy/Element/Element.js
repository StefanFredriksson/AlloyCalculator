import React from 'react'
import './Element.css'

export default function Element () {
  return (
    <div className='element-div'>
      <input
        className='element-name'
        type='text'
        placeholder='Enter element name'
      />
      <input
        className='element-value'
        type='number'
        placeholder='Enter element value'
      />
    </div>
  )
}
