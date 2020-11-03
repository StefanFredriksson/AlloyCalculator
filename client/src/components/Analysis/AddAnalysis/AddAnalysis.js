import React, { useState, useContext, useEffect } from 'react'
import './AddAnalysis.css'
import Steelgrade from './Steelgrade/Steelgrade'
import Element from './Element/Element'

export default function AddAnalysis () {
  const [steelgrades, setSteelgrades] = useState([])
  const [elements, setElements] = useState([])

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
      <input
        type='number'
        id='weight-input'
        placeholder='Enter analysis weight'
      />
      <button id='save-analysis'>Save analysis</button>
    </div>
  )
}
