import './EditAlloy.css'
import React, { useState, useEffect, useContext } from 'react'
import AlloyNamePrice from './AlloyNamePrice/AlloyNamePrice'
import ElementTable from './ElementTable/ElementTable'
import ConfirmEdit from './ConfirmEdit/ConfirmEdit'
import { HostContext } from '../../../Store'

export default function EditAlloy (props) {
  const [alloy, setAlloy] = useState(props.alloy)
  const [host] = useContext(HostContext)

  useEffect(() => {
    setInputValues(alloy.ElementList)
  }, [alloy.ElementList.join(',')])

  const setInputValues = e => {
    const table = document.querySelector('#element-table')
    const names = table.querySelectorAll('.name')
    const values = table.querySelectorAll('.value')
    const btns = table.querySelectorAll('.delete-btn')

    for (let i = 0; i < e.length; i++) {
      names[i].value = e[i].name
      values[i].value = e[i].value * 100
      btns[i].value = e[i].name
    }
  }

  const saveAlloy = () => {
    const alloyName = document.querySelector('#name-input').value
    const alloyPrice = parseFloat(document.querySelector('#price-input').value)
    const table = document.querySelector('#element-table')
    const names = table.querySelectorAll('.name')
    const values = table.querySelectorAll('.value')
    const prevName = alloy.name
    const tempAlloy = {}

    if (alloyName === '' || isNaN(alloyPrice)) {
      return
    }

    tempAlloy.name = alloyName
    tempAlloy.price = alloyPrice
    tempAlloy.ElementList = []
    for (let i = 0; i < alloy.ElementList.length; i++) {
      const v = parseFloat(values[i].value)
      const n = names[i].value

      if (n === '' || isNaN(v)) {
        return
      }

      tempAlloy.ElementList.push({ name: n, value: v })
    }

    tempAlloy.elements = JSON.stringify(tempAlloy.ElementList)

    window
      .fetch(host + '/api/alloy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alloy: tempAlloy, prevName })
      })
      .then(response => {
        if (response.ok) {
          props.saveAlloy(tempAlloy, prevName)
        }
      })
  }

  const addNewElement = event => {
    const name = document.querySelector('#new-element-name')
    const value = document.querySelector('#new-element-value')

    alloy.ElementList.push({
      name: name.value,
      value: parseFloat(value.value)
    })
    setAlloy({ ...alloy })

    name.value = ''
    value.value = ''
  }

  const removeElement = event => {
    const name = event.currentTarget.value
    alloy.ElementList = alloy.ElementList.filter(e => e.name !== name)
    setAlloy({ ...alloy })
  }

  return (
    <div id='add-alloy-div'>
      <h3>Editing {alloy.name}</h3>
      <AlloyNamePrice alloy={alloy} />
      <ElementTable
        elements={alloy.ElementList}
        removeElement={removeElement}
        addNewElement={addNewElement}
      />
      <ConfirmEdit saveAlloy={saveAlloy} goBack={props.closePopUp} />
    </div>
  )
}