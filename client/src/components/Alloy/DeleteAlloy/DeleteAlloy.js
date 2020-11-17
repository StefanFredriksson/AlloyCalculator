import './DeleteAlloy.css'
import React, { useEffect, useState, useContext } from 'react'
import AlloySelection from './AlloySelection/AlloySelection'
import { HostContext } from '../../../Store'

export default function DeleteAlloy () {
  const [alloys, setAlloys] = useState([])
  const [host] = useContext(HostContext)

  useEffect(() => {
    fetchAlloys()
  }, [])

  const fetchAlloys = () => {
    window.fetch(host + '/api/alloy').then(response => {
      response.json().then(data => {
        setAlloys([...data])
      })
    })
  }

  const deleteSelectedAlloys = event => {
    const btns = document.querySelectorAll('.radio-btn')
    const selectedAlloys = []

    for (const btn of btns) {
      if (btn.checked) {
        selectedAlloys.push(btn.value)
      }
    }

    window
      .fetch(host + '/api/alloy', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedAlloys)
      })
      .then(response => {
        if (response.ok) {
          fetchAlloys()
        }
      })
  }

  return (
    <div id='delete-alloy-main-container' className='light-container'>
      <div id='alloy-selection-container' className='dark-container'>
        {alloys.map(a => {
          return <AlloySelection alloy={a} />
        })}
      </div>
      <button
        id='delete-alloy-btn'
        className='btn btn-darker'
        onClick={deleteSelectedAlloys}
      >
        Delete Alloys
      </button>
    </div>
  )
}
