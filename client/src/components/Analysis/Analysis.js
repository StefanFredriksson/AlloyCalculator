import React, { useEffect, useState, useContext } from 'react'
import './Analysis.css'
import { HostContext } from '../../Store'
import { Link } from 'react-router-dom'

export default function Analysis () {
  const [analyses, setAnalyses] = useState([])
  const [host] = useContext(HostContext)
  useEffect(() => {
    window.fetch(host + '/api/analysis').then(response => {
      if (response.ok) {
        response.json().then(data => {
          setAnalyses([...data])
        })
      }
    })
  }, [])

  const removeAnalysis = e => {
    e.preventDefault()
    const analysis = e.currentTarget.value

    window
      .fetch(`${host}/api/analysis`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analysis)
      })
      .then(response => {
        if (response.ok) {
          const ix = analyses.findIndex(a => a.name === analysis)

          if (ix !== -1) {
            analyses.splice(ix, 1)
            setAnalyses([...analyses])
          }
        }
      })
  }

  return (
    <div id='main-analysis-container'>
      <div id='options-container'>
        <h3>Existing analyses</h3>
        <Link to='/analysis/add'>Add analysis</Link>
      </div>
      <div id='steelgrade-information-container'>
        {analyses.map(s => {
          return (
            <Link
              className='steelgrade-edit-link'
              to={`/analysis/edit/${s.name}`}
            >
              <div className='steelgrade-div'>
                <div className='delete-btn-container position-right'>
                  <button
                    className='delete-btn'
                    value={s.name}
                    onClick={removeAnalysis}
                  >
                    X
                  </button>
                </div>
                <div className='steelgrade-name-container'>
                  <label className='steelgrade-name'>{s.name}</label>
                </div>
                <div className='steelgrade-elements-container'>
                  <label>{`${s.elementList.length} ${
                    s.elementList.length > 1 ? 'elements' : 'element'
                  }`}</label>
                </div>
                <div className='steelgrade-elements-container'>
                  <label>{`${s.weight}kg`}</label>
                </div>
                <div className='steelgrade-elements-container'>
                  <label>{`Max: ${s.maxWeight}kg`}</label>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
