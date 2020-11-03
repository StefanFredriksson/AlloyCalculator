import React from 'react'
import './Element.css'

export default function Element (props) {
  return (
    <div className='element-analysis-container'>
      <label>{props.element.name}</label>
      <input type='number' placeholder='Enter current analysis' />
      <label>Min: {props.element.min}</label>
      <label>Aim: {props.element.aim}</label>
      <label>Max: {props.element.max}</label>
    </div>
  )
}
