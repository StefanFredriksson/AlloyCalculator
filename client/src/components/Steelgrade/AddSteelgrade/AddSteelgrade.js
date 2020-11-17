import React, { useState, useContext } from 'react'
import './AddSteelgrade.css'
import Element from './Element/Element'
import { FlashMessageContext, HostContext } from '../../../Store'

export default function AddSteelgrade () {
  const [elements, setElements] = useState([])
  const [flash, setFlash] = useContext(FlashMessageContext)
  const [host] = useContext(HostContext)

  const addElement = () => {
    setElements(old => [...old, 0])
  }

  const removeElement = () => {
    elements.pop()
    setElements(old => [...old])
  }

  const saveSteelgrade = () => {
    const sgName = document.querySelector('#steelgrade-name')
    const elementContainers = document.querySelectorAll('.element-container')
    const elementsToSave = []

    for (const container of elementContainers) {
      const name = container.querySelector('.element-name').value
      const min = container.querySelector('.min-analysis').value
      const max = container.querySelector('.max-analysis').value
      const aim = container.querySelector('.aim-analysis').value

      if (name === '' || min === '' || max === '' || aim === '') {
        continue
      }

      elementsToSave.push({
        name,
        min: parseFloat(min) / 100,
        max: parseFloat(max) / 100,
        aim: parseFloat(aim) / 100
      })
    }

    const steelgrade = {
      name: sgName.value,
      elements: JSON.stringify(elementsToSave)
    }

    window
      .fetch(host + '/api/steelgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(steelgrade)
      })
      .then(response => {
        if (response.ok) {
          sgName.value = ''
          setElements([])
          flash.visible = true
          flash.message = 'Steelgrade saved!'
          setFlash({ ...flash })
        }
      })
  }

  return (
    <div id='main-add-steelgrade-container'>
      <div id='add-steelgrade-content-container'>
        <h1>Add steelgrade</h1>
        <div id='name-price-container'>
          <input
            type='text'
            id='steelgrade-name'
            placeholder='Enter name of steelgrade'
          />
        </div>
        <div id='insert-remove-elements-container'>
          <label id='add-element-btn' onClick={addElement}>
            <span>+</span>
          </label>
          <label id='remove-element-btn' onClick={removeElement}>
            <span>-</span>
          </label>
        </div>
        <div id='element-container'>
          <ul id='element-list'>
            {elements.map(e => {
              return (
                <li>
                  <Element />
                </li>
              )
            })}
          </ul>
        </div>
        <button id='save-steelgrade-btn' onClick={saveSteelgrade}>
          Save steelgrade
        </button>
      </div>
    </div>
  )
}
