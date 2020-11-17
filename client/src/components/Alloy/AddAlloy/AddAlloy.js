import React, { useState, useContext } from 'react'
import './AddAlloy.css'
import Element from './Element/Element'
import { FlashMessageContext, HostContext } from '../../../Store'

let elements = []

export default function AddAlloy () {
  const [count, setCount] = useState(0)
  const [flash, setFlash] = useContext(FlashMessageContext)
  const [host] = useContext(HostContext)

  const addElement = event => {
    elements.push(0)
    setCount(count + 1)
  }

  const removeElement = event => {
    if (elements.length > 0) {
      elements.pop()

      setCount(count + 1)
    }
  }

  const saveAlloy = event => {
    const alloyName = document.querySelector('#alloy-name-input')
    const price = document.querySelector('#alloy-price-input')
    const elementDivs = document.querySelectorAll('.element-div')
    const elementsToSave = []

    for (const div of elementDivs) {
      const elementName = div.querySelector('.element-name').value
      const elementValue = div.querySelector('.element-value').value

      if (elementName === '' || elementValue === '') {
        continue
      }

      elementsToSave.push({
        name: elementName,
        value: parseFloat(elementValue) / 100
      })
    }
    const alloy = {
      name: alloyName.value,
      price: parseFloat(price.value),
      elements: JSON.stringify(elementsToSave)
    }

    window
      .fetch(host + '/api/alloy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alloy)
      })
      .then(response => {
        if (response.ok) {
          alloyName.value = ''
          price.value = ''
          elements = []
          setCount(count + 1)
          flash.visible = true
          flash.message = 'Alloy saved!'
          setFlash({ ...flash })
        }
      })
  }

  return (
    <div id='alloy-container'>
      <div id='add-alloy-container'>
        <h1>Add Alloy</h1>
        <div id='alloy-name-container'>
          <input
            type='text'
            id='alloy-name-input'
            placeholder='Name of alloy'
          />
          <input
            type='number'
            id='alloy-price-input'
            placeholder='Price of alloy'
          />
        </div>
        <div id='alloy-elements-container'>
          <ul id='element-list'>
            <li>
              <label id='add-element-btn' onClick={addElement}>
                <span>+</span>
              </label>
              <label id='remove-element-btn' onClick={removeElement}>
                <span>-</span>
              </label>
            </li>
            {elements.map(e => {
              return (
                <li>
                  <Element />
                </li>
              )
            })}
          </ul>
        </div>
        <button id='save-alloy' onClick={saveAlloy}>
          Save alloy
        </button>
      </div>
    </div>
  )
}
