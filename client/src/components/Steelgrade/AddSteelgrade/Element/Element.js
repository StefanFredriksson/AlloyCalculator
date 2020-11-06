import React from 'react'
import './Element.css'

export default function Element () {
  return (
    <div className='element-container'>
      <input
        type='text'
        className='element-name'
        placeholder='Enter element name'
      />
      <input
        type='number'
        className='min-analysis'
        placeholder='Enter min analysis'
      />
      <input
        type='number'
        className='aim-analysis'
        placeholder='Enter aim analysis'
      />
      <input
        type='number'
        className='max-analysis'
        placeholder='Enter max analysis'
      />
    </div>
  )
}
