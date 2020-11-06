import React, { useState, useContext, useEffect } from 'react'
import './AddAnalysis.css'
import Steelgrade from './Steelgrade/Steelgrade'
import Element from './Element/Element'
import { FlashMessageContext } from '../../../Store'

export default function AddAnalysis () {
  const [steelgrades, setSteelgrades] = useState([])
  const [elements, setElements] = useState([])
  const [flash, setFlash] = useContext(FlashMessageContext)

  useEffect(() => {
    window.fetch('https://localhost:5001/api/steelgrade').then(response => {
      response.json().then(data => {
        setSteelgrades([...data])
      })
    })
  }, [])

  const renderSteelgrade = event => {
    const steelgrade = steelgrades.find(s => s.name === event.target.value)
    setElements([...steelgrade.elementList])
  }

  const saveAnalysis = event => {
    const weight = document.querySelector('#weight-input')
    const name = document.querySelector('#analysis-name-input')

    if (weight.value === '' || name.value === '') {
      return
    }

    const els = document.querySelectorAll('.analysis-element')
    const steels = document.querySelectorAll('.steelgrade-choice')

    let steelgrade = null

    for (const steel of steels) {
      if (steel.checked) {
        steelgrade = steel.value
      }
    }

    for (const el of els) {
      const element = elements.find(e => e.name === el.id)
      element.actual = parseFloat(el.value)
      element.weight = weight.value * element.actual
    }

    const analysis = {
      name: name.value,
      steelgrade,
      weight: parseFloat(weight.value),
      elements: JSON.stringify(elements)
    }

    window
      .fetch('https://localhost:5001/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analysis)
      })
      .then(response => {
        if (response.ok) {
          name.value = ''
          weight.value = ''
          for (const el of els) {
            el.value = ''
          }
          flash.visible = true
          flash.message = 'Analysis saved!'
          setFlash({ ...flash })
        }
      })
  }

  return (
    <div id='main-add-analysis-container'>
      <h1>Add Analysis</h1>
      <div id='steelgrade-selection-container'>
        {steelgrades.map(s => {
          return (
            <Steelgrade renderSteelgrade={renderSteelgrade} steelgrade={s} />
          )
        })}
      </div>
      <div id='element-analysis-container'>
        {elements.map(e => {
          return <Element element={e} />
        })}
      </div>
      <div id='weight-name-container'>
        <input
          type='number'
          id='weight-input'
          placeholder='Enter analysis weight'
        />
        <input
          type='text'
          id='analysis-name-input'
          placeholder='Enter name of analysis'
        />
      </div>
      <button id='save-analysis' onClick={saveAnalysis}>
        Save analysis
      </button>
    </div>
  )
}
