import React, { Component } from 'react'
import './AddAlloy.css'
import Element from './Element/Element'
import ElementTable from '../EditAlloy/ElementTable/ElementTable'
import ConfirmEdit from '../EditAlloy/ConfirmEdit/ConfirmEdit'
import AlloyNamePrice from '../EditAlloy/AlloyNamePrice/AlloyNamePrice'
import FlashMessage from '../../Common/FlashMessage'
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
      elements: [],
      flashMessage: { message: '', show: false, success: false }
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
      this.handleFlashMessage('Missing input field.', true, false)
      return
    }

    const exists = elements.find(
      e => e.name.toUpperCase() === name.value.toUpperCase()
    )

    if (exists) {
      this.handleFlashMessage(
        'An element with the same name already exist.',
        true,
        false
      )
      return
    }

    elements.push({
      name: name.value,
      value: parseFloat(value.value) / 100
    })
    this.setState({ elements: [...elements] })

    name.value = ''
    value.value = ''
    this.handleFlashMessage('', false, false)
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
      this.handleFlashMessage(
        'Please make sure the alloy has a name and a price.',
        true,
        false
      )
      return
    }

    tempAlloy.name = alloyName.value
    tempAlloy.price = parseFloat(alloyPrice.value)
    tempAlloy.ElementList = []

    for (let i = 0; i < elements.length; i++) {
      const v = parseFloat(values[i].value) / 100
      const n = names[i].value

      if (n === '' || isNaN(v)) {
        this.handleFlashMessage('Invalid element input values.', true, false)
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
          this.handleFlashMessage('Alloy was updated successfully!', true, true)
          this.setState({ elements: [] })
          alloyName.value = ''
          alloyPrice.value = ''
        } else if (response.status === 409) {
          this.handleFlashMessage(
            'An alloy with the same name already exist.',
            true,
            false
          )
        } else {
          this.handleFlashMessage(
            'Something went wrong when updating the alloy.',
            true,
            false
          )
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

  handleFlashMessage (message, show, success) {
    this.setState({ flashMessage: { message, show, success } })
  }

  render () {
    return (
      <div id='main-add-alloy-container'>
        <div id='main-add-alloy-window'>
          <h3>Add alloy</h3>
          <AlloyNamePrice alloy={{ name: '', price: '' }} />
          <div id='message-div'>
            <FlashMessage data={this.state.flashMessage} />
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
