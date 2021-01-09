import React, { Component } from 'react'
import './EditSteelgrade.css'
import ElementTable from './ElementTable/ElementTable'
import ConfirmEdit from '../../Alloy/EditAlloy/ConfirmEdit/ConfirmEdit'
import FlashMessage from '../../Common/FlashMessage'
import { HostContext } from '../../../Store'
import { withRouter } from 'react-router-dom'

class EditSteelgrade extends Component {
  static contextType = HostContext

  constructor (props) {
    super(props)
    this.addNewElement = this.addNewElement.bind(this)
    this.autoAddElement = this.autoAddElement.bind(this)
    this.saveSteelgrade = this.saveSteelgrade.bind(this)
    this.removeElement = this.removeElement.bind(this)
    this.state = {
      originalName: '',
      steelgrade: { name: '', elementList: [] },
      flashMessage: { message: '', success: false, show: false }
    }
  }

  componentDidMount () {
    this.setState({ originalName: this.props.match.params.name })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.originalName === '' && this.state.originalName !== '') {
      this.getSteelgrade()
      document
        .querySelector('#new-steelgrade-element-max')
        .addEventListener('keydown', this.autoAddElement)
    }

    if (
      prevState.steelgrade.elementList.length !==
      this.state.steelgrade.elementList.length
    ) {
      this.setInputValues(this.state.steelgrade)
    }
  }

  getSteelgrade () {
    const [host] = this.context

    window
      .fetch(host + '/api/steelgrade?name=' + this.state.originalName)
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            this.setState({ steelgrade: { ...data } })
          })
        }
      })
  }

  setInputValues (steelgrade) {
    const name = document.querySelector('#name-input')
    const names = document.querySelectorAll('.element-name')
    const mins = document.querySelectorAll('.element-min')
    const aims = document.querySelectorAll('.element-aim')
    const maxs = document.querySelectorAll('.element-max')
    const btns = document.querySelectorAll('.delete-btn')

    if (name.value === '') {
      name.value = steelgrade.name
    }

    for (let i = 0; i < steelgrade.elementList.length; i++) {
      names[i].value = steelgrade.elementList[i].name
      mins[i].value = +(steelgrade.elementList[i].min * 100).toFixed(2)
      aims[i].value = +(steelgrade.elementList[i].aim * 100).toFixed(2)
      maxs[i].value = +(steelgrade.elementList[i].max * 100).toFixed(2)
      btns[i].value = steelgrade.elementList[i].name
    }
  }

  addNewElement () {
    const name = document.querySelector('#new-steelgrade-element-name')
    const min = document.querySelector('#new-steelgrade-element-min')
    const aim = document.querySelector('#new-steelgrade-element-aim')
    const max = document.querySelector('#new-steelgrade-element-max')
    const steelgrade = this.copySteelgrade()

    if (
      name.value === '' ||
      min.value === '' ||
      aim.value === '' ||
      max.value === ''
    ) {
      this.handleFlashMessage('Missing input fields.', true, false)
      return
    }

    const exists = steelgrade.elementList.find(
      e => e.name.toUpperCase() === name.value.toUpperCase()
    )

    if (exists) {
      this.handleFlashMessage(
        'Element with the same name already exists.',
        true,
        false
      )
      return
    }

    steelgrade.elementList.push({
      name: name.value,
      min: parseFloat(min.value) / 100,
      aim: parseFloat(aim.value) / 100,
      max: parseFloat(max.value) / 100
    })

    this.setState({ steelgrade: { ...steelgrade } })

    name.value = ''
    min.value = ''
    aim.value = ''
    max.value = ''
    this.handleFlashMessage('', false, false)
  }

  saveSteelgrade () {
    const steelgrade = this.copySteelgrade()
    const sgName = document.querySelector('#name-input').value
    const table = document.querySelector('#element-table')
    const names = table.querySelectorAll('.element-name')
    const mins = table.querySelectorAll('.element-min')
    const aims = table.querySelectorAll('.element-aim')
    const maxs = table.querySelectorAll('.element-max')
    const prevName = steelgrade.name
    const tempSteelgrade = {}

    if (sgName === '') {
      this.handleFlashMessage(
        'Please enter a name for the steelgrade.',
        true,
        false
      )
      return
    }

    tempSteelgrade.name = sgName
    tempSteelgrade.elementList = []

    for (let i = 0; i < names.length; i++) {
      const name = names[i].value
      const min = parseFloat(mins[i].value) / 100
      const aim = parseFloat(aims[i].value) / 100
      const max = parseFloat(maxs[i].value) / 100

      if (name === '' || isNaN(min) || isNaN(aim) || isNaN(max)) {
        this.handleFlashMessage('Invalid element names or values.', true, false)
        return
      }

      tempSteelgrade.elementList.push({ name, min, aim, max })
    }

    tempSteelgrade.elements = JSON.stringify(tempSteelgrade.elementList)

    const [host] = this.context

    window
      .fetch(host + '/api/steelgrade', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ steelgrade: tempSteelgrade, prevName })
      })
      .then(response => {
        if (response.ok) {
          if (this.state.originalName !== tempSteelgrade.name) {
            this.handleFlashMessage(
              'Steelgrade was updated successfully!',
              true,
              true
            )
            this.setState({
              originalName: tempSteelgrade.name,
              steelgrade: { ...tempSteelgrade }
            })
            window.history.replaceState(
              null,
              null,
              '/steelgrade/edit/' + tempSteelgrade.name
            )
          }
        } else if (response.status === 409) {
          this.handleFlashMessage(
            'A steelgrade with the same name already exist.',
            true,
            false
          )
        } else {
          this.handleFlashMessage(
            'Something went wrong when updating the steelgrade.',
            true,
            false
          )
        }
      })
  }

  removeElement (event) {
    const steelgrade = this.copySteelgrade()
    const name = event.currentTarget.value
    steelgrade.elementList = steelgrade.elementList.filter(e => e.name !== name)
    this.setState({ steelgrade: { ...steelgrade } })
  }

  autoAddElement (e) {
    if (e.keyCode === 9 || e.keyCode === 13) {
      const name = document.querySelector('#new-steelgrade-element-name')
      e.preventDefault()
      this.addNewElement()
      name.focus()
    }
  }

  copySteelgrade () {
    const steelgrade = {}
    steelgrade.name = this.state.steelgrade.name
    steelgrade.elementList = [...this.state.steelgrade.elementList]

    return steelgrade
  }

  handleFlashMessage (message, show, success) {
    this.setState({ flashMessage: { message, success, show } })
  }

  render () {
    return (
      <div id='main-edit-steelgrade-container'>
        <h2>Editing steelgrade {this.state.originalName}</h2>
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
          elements={this.state.steelgrade.elementList}
          removeElement={this.removeElement}
          addNewElement={this.addNewElement}
          flash={this.handleFlashMessage}
        />
        <ConfirmEdit save={this.saveSteelgrade} link='/steelgrade' />
      </div>
    )
  }
}

export default withRouter(EditSteelgrade)
