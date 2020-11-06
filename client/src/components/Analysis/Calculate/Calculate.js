import React, { useEffect, useState, useContext } from 'react'
import './Calculate.css'
import Steelgrade from '../AddAnalysis/Steelgrade/Steelgrade'
import { FlashMessageContext } from '../../../Store'
import AddedAlloy from './AddedAlloys/AddedAlloys'

export default function Calculate () {
  const [analysis, setAnalysis] = useState([])
  const [chosen, setChosen] = useState(null)
  const [addedAlloys, setAddedAlloys] = useState([])
  const [flash, setFlash] = useContext(FlashMessageContext)

  useEffect(() => {
    window.fetch('https://localhost:5001/api/analysis').then(response => {
      response.json().then(data => {
        setAnalysis([...data])
      })
    })
  }, [])

  const buttonClicked = event => {
    setChosen(event.target.value)
  }

  const calculateAnalysis = event => {
    if (chosen === null) {
      return
    }

    window
      .fetch(`https://localhost:5001/api/analysis/calculate?analysis=${chosen}`)
      .then(response => {
        response.json().then(data => {
          setAddedAlloys([...data])
        })
      })
  }

  return (
    <div id='calculate-main-container'>
      <div id='analysis-selection-container'>
        {analysis.map(a => {
          return <Steelgrade renderSteelgrade={buttonClicked} steelgrade={a} />
        })}
      </div>
      <button id='save-analysis' onClick={calculateAnalysis}>
        Calculate
      </button>
      <div id='added-alloys-container'>
        <table id='alloy-table'>
          <thead>
            <tr>
              <th>Alloy</th>
              <th>Weight</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {addedAlloys.map(al => {
              return (
                <tr>
                  <td>{al.name}</td>
                  <td>{al.Weight.toFixed(2)}kg </td>
                  <td>{al.TotalPrice.toFixed(2)}kr</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
