import React, { useEffect, useState, useContext } from 'react'
import './Calculate.css'
import { FlashMessageContext } from '../../../Store'
import AddedAlloy from './AddedAlloys/AddedAlloys'
import AnalysisSelection from './AnalysisSelection/AnalysisSelection'
import OriginalAnalysis from './OriginalAnalysis/OriginalAnalysis'
import FinalAnalysis from './FinalAnalysis/FinalAnalysis'

export default function Calculate () {
  const [analysis, setAnalysis] = useState([])
  const [chosen, setChosen] = useState(null)
  const [addedAlloys, setAddedAlloys] = useState([])
  const [chosenAnalysis, setChosenAnalysis] = useState([])
  const [finalAnalysis, setFinalAnalysis] = useState([])
  const [totalPrice, setTotalPrice] = useState(null)
  const [flash, setFlash] = useContext(FlashMessageContext)

  useEffect(() => {
    window.fetch('https://localhost:5001/api/analysis').then(response => {
      response.json().then(data => {
        setAnalysis([...data])
      })
    })
  }, [])

  const renderAnalysis = event => {
    const a = analysis.find(anls => anls.name === event.target.value)

    if (a) {
      setChosenAnalysis([...a.elementList])
      setChosen(event.target.value)
    }
  }

  const calculateAnalysis = event => {
    if (chosen === null) {
      return
    }

    window
      .fetch(`https://localhost:5001/api/analysis/calculate?analysis=${chosen}`)
      .then(response => {
        response.json().then(data => {
          setAddedAlloys([...data.addedAlloys])
          setFinalAnalysis([...data.elementList])
          setTotalPrice(data.TotalPrice)
        })
      })
  }

  return (
    <div id='calculate-main-container'>
      <div id='data-display-container'>
        <AnalysisSelection buttonClicked={renderAnalysis} analysis={analysis} />
        <AddedAlloy addedAlloys={addedAlloys} totalPrice={totalPrice} />
        <OriginalAnalysis analysis={chosenAnalysis} />
        <FinalAnalysis analysis={finalAnalysis} />
      </div>
      <button
        id='calculate-btn'
        className='btn btn-darker'
        onClick={calculateAnalysis}
      >
        Calculate
      </button>
    </div>
  )
}
