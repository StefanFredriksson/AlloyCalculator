import React, { useEffect, useState, useContext } from 'react'
import './AddAlloy.css'
import Element from './Element/Element'
import ElementTable from '../EditAlloy/ElementTable/ElementTable'
import ConfirmEdit from '../EditAlloy/ConfirmEdit/ConfirmEdit'
import { FlashMessageContext, HostContext } from '../../../Store'

let elements = []

export default function AddAlloy () {
  const [count, setCount] = useState(0)
  const [elements, setElements] = useState([])
  const [flash, setFlash] = useContext(FlashMessageContext)
  const [host] = useContext(HostContext)

  useEffect(() => {
    setInputValues(elements)
  }, [elements.join(',')])

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

  const addNewElement = event => {
    const name = document.querySelector('#new-element-name')
    const value = document.querySelector('#new-element-value')

    elements.push({
      name: name.value,
      value: parseFloat(value.value) / 100
    })
    setElements([...elements])

    name.value = ''
    value.value = ''
  }

  const removeElement = event => {
    const name = event.currentTarget.value
    const temp = elements.filter(e => e.name !== name)
    setElements([...temp])
  }

  const saveAlloy = event => {
    const alloyName = document.querySelector('#name-input')
    const alloyPrice = document.querySelector('#price-input')
    const table = document.querySelector('#element-table')
    const names = table.querySelectorAll('.name')
    const values = table.querySelectorAll('.value')
    const tempAlloy = {}

    tempAlloy.name = alloyName.value
    tempAlloy.price = parseFloat(alloyPrice.value)
    tempAlloy.ElementList = []

    for (let i = 0; i < elements.length; i++) {
      const v = parseFloat(values[i].value) / 100
      const n = names[i].value

      if (n === '' || isNaN(v)) {
        return
      }

      tempAlloy.ElementList.push({ name: n, value: v })
    }

    tempAlloy.elements = JSON.stringify(tempAlloy.ElementList)

    window
      .fetch(host + '/api/alloy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempAlloy)
      })
      .then(response => {
        if (response.ok) {
          setElements([])
          alloyName.value = ''
          alloyPrice.value = ''
        }
      })
  }

  return (
    <div id='main-add-alloy-container'>
      <div id='main-add-alloy-window'>
        <h3>Add alloy</h3>
        <div className='name-value-container'>
          <div className='input-field'>
            <input id='name-input' type='text' required />
            <label>Alloy name</label>
            <span />
          </div>
          <div className='input-field'>
            <input id='price-input' type='number' step='any' min='0' required />
            <label>Alloy price (kr/kg)</label>
            <span />
          </div>
        </div>
        <ElementTable
          elements={elements}
          addNewElement={addNewElement}
          removeElement={removeElement}
        />
        <ConfirmEdit saveAlloy={saveAlloy} />
      </div>
    </div>
  )
}
