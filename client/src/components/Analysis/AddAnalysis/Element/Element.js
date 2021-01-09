import React from 'react'
import './Element.css'

export default function Element (props) {
  return (
    <div className='element-analysis-container'>
      <label>{props.element.name}</label>
      <input
        type='number'
        id={props.element.name}
        className='analysis-element'
        placeholder='Enter current analysis'
      />
      <label>Min: {+(props.element.min * 100).toFixed(2)}%</label>
      <label>Aim: {+(props.element.aim * 100).toFixed(2)}%</label>
      <label>Max: {+(props.element.max * 100).toFixed(2)}%</label>
    </div>
  )
}
