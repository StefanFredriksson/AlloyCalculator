import './Steelgrade.css'
import React, { useEffect, useState, useContext } from 'react'
import { HostContext } from '../../Store'
import { Link } from 'react-router-dom'

export default function Steelgrade () {
  const [steelgrades, setSteelgrades] = useState([])
  const [host] = useContext(HostContext)

  useEffect(() => {
    window.fetch(host + '/api/steelgrade').then(response => {
      if (response.ok) {
        response.json().then(data => {
          setSteelgrades([...data])
        })
      }
    })
  }, [])

  const removeSteelgrade = e => {
    e.preventDefault()
    const steelgrade = e.currentTarget.value

    window
      .fetch(`${host}/api/steelgrade`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(steelgrade)
      })
      .then(response => {
        if (response.ok) {
          const ix = steelgrades.findIndex(sg => sg.name === steelgrade)

          if (ix !== -1) {
            steelgrades.splice(ix, 1)
            setSteelgrades([...steelgrades])
          }
        }
      })
  }

  return (
    <div id='main-steelgrade-container'>
      <div id='options-container'>
        <h3>Existing Steelgrades</h3>
        <Link to='/steelgrade/add'>Add Steelgrade</Link>
      </div>
      <div id='steelgrade-information-container'>
        {steelgrades.map(s => {
          return (
            <Link
              className='steelgrade-edit-link'
              to={`/steelgrade/edit/${s.name}`}
            >
              <div className='steelgrade-div'>
                <div className='delete-btn-container position-right'>
                  <button
                    className='delete-btn'
                    value={s.name}
                    onClick={removeSteelgrade}
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
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
