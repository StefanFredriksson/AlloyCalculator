import React, { Component } from 'react'
import './AddAlloy.css'
import Element from './Element/Element'
import ElementTable from '../EditAlloy/ElementTable/ElementTable'
import ConfirmEdit from '../EditAlloy/ConfirmEdit/ConfirmEdit'
import { FlashMessageContext, HostContext } from '../../../Store'
import { alloyAddComplete } from '../../../view/successFlashMessages'
import {
  missingInputFields,
  elementAlreadyExists
} from '../../../view/errorFlashMessages'
import {
  showErrorFlash,
  showSuccessFlash
} from '../../../helpers/flashMessageHelper'

export default class AddAlloy extends Component {
  static contextType = HostContext

  constructor (props) {
    super(props)
    this.addNewElement = this.addNewElement.bind(this)
    this.removeElement = this.removeElement.bind(this)
    this.autoAddElement = this.autoAddElement.bind(this)
    this.saveAlloy = this.saveAlloy.bind(this)
    this.state = {
      elements: []
    }
  }

  componentDidMount () {
    document
      .querySelector('#new-alloy-element-value')
      .addEventListener('keydown', this.autoAddElement)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.elements.length !== this.state.elements.length) {
      this.setInputValues(this.state.elements)
    }
  }

  setInputValues (e) {
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

  addNewElement (event) {
    const name = document.querySelector('#new-alloy-element-name')
    const value = document.querySelector('#new-alloy-element-value')
    const elements = [...this.state.elements]

    if (name.value === '' || value.value === '') {
      //showErrorFlash(missingInputFields(), setFlash)
      return
    }

    const exists = elements.find(
      e => e.name.toUpperCase() === name.value.toUpperCase()
    )

    if (exists) {
      //showErrorFlash(elementAlreadyExists(exists.name), setFlash)
      return
    }

    elements.push({
      name: name.value,
      value: parseFloat(value.value) / 100
    })
    this.setState({ elements: [...elements] })

    name.value = ''
    value.value = ''
  }

  removeElement (event) {
    const elements = [...this.state.elements]
    const name = event.currentTarget.value
    const temp = elements.filter(e => e.name !== name)

    this.setState({ elements: [...temp] })
  }

  saveAlloy (event) {
    const alloyName = document.querySelector('#name-input')
    const alloyPrice = document.querySelector('#price-input')
    const table = document.querySelector('#element-table')
    const names = table.querySelectorAll('.name')
    const values = table.querySelectorAll('.value')
    const tempAlloy = {}
    const elements = [...this.state.elements]

    if (alloyName.value === '' || alloyPrice.value === '') {
      //showErrorFlash(missingInputFields(), setFlash)
      return
    }

    tempAlloy.name = alloyName.value
    tempAlloy.price = parseFloat(alloyPrice.value)
    tempAlloy.ElementList = []

    for (let i = 0; i < elements.length; i++) {
      const v = parseFloat(values[i].value) / 100
      const n = names[i].value

      if (n === '' || isNaN(v)) {
        //showErrorFlash(missingInputFields(), setFlash)
        return
      }

      tempAlloy.ElementList.push({ name: n, value: v })
    }

    tempAlloy.elements = JSON.stringify(tempAlloy.ElementList)

    const [host] = this.context

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
          //showSuccessFlash(alloyAddComplete(tempAlloy.name), setFlash)
          this.setState({ elements: [] })
          alloyName.value = ''
          alloyPrice.value = ''
        }
      })
  }

  autoAddElement (e) {
    if (e.keyCode === 9 || e.keyCode === 13) {
      const name = document.querySelector('#new-alloy-element-name')
      e.preventDefault()
      this.addNewElement()
      name.focus()
    }
  }

  render () {
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
              <input
                id='price-input'
                type='number'
                step='any'
                min='0'
                required
              />
              <label>Alloy price (kr/kg)</label>
              <span />
            </div>
          </div>
          <ElementTable
            elements={this.state.elements}
            addNewElement={this.addNewElement}
            removeElement={this.removeElement}
          />
          <ConfirmEdit save={this.saveAlloy} link='/alloy' />
        </div>
      </div>
    )
  }
}
