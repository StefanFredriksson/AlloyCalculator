import './Alloy.css'
import React, { useEffect, useState, useContext } from 'react'
import AlloyInformation from './AlloyInformation/AlloyInformation'
import EditAlloy from './EditAlloy/EditAlloy'
import { HostContext } from '../../Store'

export default function Alloy () {
  const [alloys, setAlloys] = useState([])
  const [showPopUp, setShowPopUp] = useState(false)
  const [chosenAlloy, setChosenAlloy] = useState(null)
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

  const openPopUp = event => {
    const name = event.currentTarget.querySelector('.delete-btn').value
    const alloy = alloys.find(a => a.name === name)
    setChosenAlloy(alloy)
    setShowPopUp(true)
  }

  const closePopUp = event => {
    setShowPopUp(false)
  }

  const removeAlloy = name => {
    const ix = alloys.findIndex(a => a.name === name)

    if (ix !== -1) {
      alloys.splice(ix, 1)
      setAlloys([...alloys])
    }
  }

  const saveAlloy = (alloy, prevName) => {
    const a = alloys.find(al => al.name === prevName)

    a.name = alloy.name
    a.price = alloy.price
    a.ElementList = [...alloy.ElementList]
    setAlloys([...alloys])
  }

  return (
    <div id='main-alloy-container'>
      {showPopUp ? (
        <EditAlloy
          alloy={chosenAlloy}
          closePopUp={closePopUp}
          saveAlloy={saveAlloy}
        />
      ) : (
        <AlloyInformation
          alloys={alloys}
          openPopUp={openPopUp}
          removeAlloy={removeAlloy}
        />
      )}
    </div>
  )
}
