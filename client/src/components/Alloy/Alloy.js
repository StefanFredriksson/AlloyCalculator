import './Alloy.css'
import React, { useEffect, useState, useContext } from 'react'
import AlloyInformation from './AlloyInformation/AlloyInformation'
import EditAlloy from './EditAlloy/EditAlloy'
import { HostContext } from '../../Store'

export default function Alloy () {
  const [alloys, setAlloys] = useState([])
  const [host] = useContext(HostContext)

  useEffect(() => {
    window.fetch(host + '/api/alloy').then(response => {
      if (response.ok) {
        response.json().then(data => {
          setAlloys([...data])
        })
      }
    })
  }, [])

  const removeAlloy = name => {
    const ix = alloys.findIndex(a => a.name === name)

    if (ix !== -1) {
      alloys.splice(ix, 1)
      setAlloys([...alloys])
    }
  }

  return (
    <div id='main-alloy-container'>
      <AlloyInformation alloys={alloys} removeAlloy={removeAlloy} />
    </div>
  )
}
