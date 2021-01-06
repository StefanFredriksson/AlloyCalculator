import React, { Component } from 'react'
import './AddSteelgrade.css'
import { HostContext } from '../../../Store'
import ElementTable from '../EditSteelgrade/ElementTable/ElementTable'
import ConfirmEdit from '../../Alloy/EditAlloy/ConfirmEdit/ConfirmEdit'
import FlashMessage from '../../Common/FlashMessage'

export default class AddSteelgrade extends Component {
  static contextType = HostContext

  constructor (props) {
    super(props)
    this.addNewElement = this.addNewElement.bind(this)
    this.autoAddElement = this.autoAddElement.bind(this)
    this.saveSteelgrade = this.saveSteelgrade.bind(this)
    this.removeElement = this.removeElement.bind(this)
    this.state = {
      elements: [],
      flashMessage: { message: '', success: false, show: false }
    }
  }

  componentDidMount () {
    document
      .querySelector('#new-steelgrade-element-max')
      .addEventListener('keydown', this.autoAddElement)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.elements.length !== this.state.elements.length) {
      this.setInputValues(this.state.elements)
    }
  }

  setInputValues (elements) {
    const names = document.querySelectorAll('.element-name')
    const mins = document.querySelectorAll('.element-min')
    const aims = document.querySelectorAll('.element-aim')
    const maxs = document.querySelectorAll('.element-max')
    const btns = document.querySelectorAll('.delete-btn')

    for (let i = 0; i < elements.length; i++) {
      names[i].value = elements[i].name
      mins[i].value = (elements[i].min * 100).toFixed(2)
      aims[i].value = (elements[i].aim * 100).toFixed(2)
      maxs[i].value = (elements[i].max * 100).toFixed(2)
      btns[i].value = elements[i].name
    }
  }

  removeElement (event) {
    const steelgrade = this.copySteelgrade()
    const name = event.currentTarget.value
    steelgrade.elementList = steelgrade.elementList.filter(e => e.name !== name)
    this.setState({ steelgrade: { ...steelgrade } })
  }

  addNewElement () {
    const name = document.querySelector('#new-steelgrade-element-name')
    const min = document.querySelector('#new-steelgrade-element-min')
    const aim = document.querySelector('#new-steelgrade-element-aim')
    const max = document.querySelector('#new-steelgrade-element-max')
    const elements = [...this.state.elements]

    if (
      name.value === '' ||
      min.value === '' ||
      aim.value === '' ||
      max.value === ''
    ) {
      this.handleFlashMessage('Missing input fields.', true, false)
      return
    }

    const exists = elements.find(
      e => e.name.toUpperCase() === name.value.toUpperCase()
    )

    if (exists) {
      this.handleFlashMessage(
        'Element with the same name already exist.',
        true,
        false
      )
      return
    }

    elements.push({
      name: name.value,
      min: parseFloat(min.value) / 100,
      aim: parseFloat(aim.value) / 100,
      max: parseFloat(max.value) / 100
    })

    this.setState({ elements: [...elements] })

    name.value = ''
    min.value = ''
    aim.value = ''
    max.value = ''
    this.handleFlashMessage('', false, true)
  }

  saveSteelgrade () {
    const sgName = document.querySelector('#name-input')
    const table = document.querySelector('#element-table')
    const names = table.querySelectorAll('.element-name')
    const mins = table.querySelectorAll('.element-min')
    const aims = table.querySelectorAll('.element-aim')
    const maxs = table.querySelectorAll('.element-max')
    const tempSteelgrade = {}

    if (sgName.value === '') {
      this.handleFlashMessage(
        'Please enter a name for the steelgrade.',
        true,
        false
      )
      return
    }

    tempSteelgrade.name = sgName.value
    tempSteelgrade.elementList = []

    for (let i = 0; i < names.length; i++) {
      const name = names[i].value
      const min = parseFloat(mins[i].value) / 100
      const aim = parseFloat(aims[i].value) / 100
      const max = parseFloat(maxs[i].value) / 100

      if (name === '' || isNaN(min) || isNaN(aim) || isNaN(max)) {
        this.handleFlashMessage(
          'One or more element inputs are invalid.',
          true,
          false
        )
        return
      }

      tempSteelgrade.elementList.push({ name, min, aim, max })
    }

    tempSteelgrade.elements = JSON.stringify(tempSteelgrade.elementList)

    const [host] = this.context

    window
      .fetch(host + '/api/steelgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempSteelgrade)
      })
      .then(response => {
        if (response.ok) {
          this.setState({ elements: [] })
          sgName.value = ''
          this.handleFlashMessage(
            'Steelgrade was added successfully!',
            true,
            true
          )
        } else if (response.status === 409) {
          this.handleFlashMessage(
            'A steelgrade with the same name already exist.',
            true,
            false
          )
        } else {
          this.handleFlashMessage(
            'Something went wrong when saving the steelgrade.',
            true,
            false
          )
        }
      })
  }

  handleFlashMessage (message, show, success) {
    this.setState({ flashMessage: { message, success, show } })
  }

  autoAddElement (e) {
    if (e.keyCode === 9 || e.keyCode === 13) {
      const name = document.querySelector('#new-steelgrade-element-name')
      e.preventDefault()
      this.addNewElement()
      name.focus()
    }
  }

  render () {
    return (
      <div id='main-edit-steelgrade-container'>
        <h2>Add new steelgrade</h2>
        <div id='name-message-container'>
          <div id='edit-steelgrade-name-container'>
            <div className='input-field'>
              <input id='name-input' type='text' required />
              <label>Steelgrade name</label>
              <span />
            </div>
          </div>
          <FlashMessage data={this.state.flashMessage} />
        </div>
        <ElementTable
          elements={this.state.elements}
          removeElement={this.removeElement}
          addNewElement={this.addNewElement}
        />
        <ConfirmEdit save={this.saveSteelgrade} link='/steelgrade' />
      </div>
    )
  }
}
