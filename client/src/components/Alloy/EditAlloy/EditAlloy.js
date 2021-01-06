import React, { Component } from 'react'
import './EditAlloy.css'
import './EditAlloy_Responsive.css'
import AlloyNamePrice from './AlloyNamePrice/AlloyNamePrice'
import ElementTable from './ElementTable/ElementTable'
import ConfirmEdit from './ConfirmEdit/ConfirmEdit'
import FlashMessage from '../../Common/FlashMessage'
import { HostContext, FlashMessageContext } from '../../../Store'
import { useParams } from 'react-router-dom'
import {
  elementAlreadyExists,
  missingInputFields
} from '../../../view/errorFlashMessages'
import { alloyEditComplete } from '../../../view/successFlashMessages'
import {
  showErrorFlash,
  showSuccessFlash
} from '../../../helpers/flashMessageHelper'
import { withRouter } from 'react-router-dom'

class EditAlloy extends Component {
  static contextType = HostContext
  constructor (props) {
    super(props)
    this.addNewElement = this.addNewElement.bind(this)
    this.removeElement = this.removeElement.bind(this)
    this.autoAddElement = this.autoAddElement.bind(this)
    this.saveAlloy = this.saveAlloy.bind(this)
    this.state = {
      originalName: '',
      alloy: { name: '', ElementList: [] },
      flashMessage: { message: '', show: false, success: false }
    }
  }

  componentDidMount () {
    this.setState({ originalName: this.props.match.params.name })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.originalName === '' && this.state.originalName !== '') {
      this.getAlloy()
      document
        .querySelector('#new-alloy-element-value')
        .addEventListener('keydown', this.autoAddElement)
    }

    if (
      prevState.alloy.ElementList.length !== this.state.alloy.ElementList.length
    ) {
      this.setInputValues(this.state.alloy.ElementList, this.state.alloy)
    }
  }

  getAlloy () {
    const [host] = this.context

    const link = host + '/api/alloy?name=' + this.state.originalName
    window.fetch(link).then(response => {
      if (response.ok) {
        response.json().then(data => {
          this.setState({ alloy: { ...data } })
          this.setInputValues(this.state.alloy.ElementList, this.state.alloy)
        })
      }
    })
  }

  setInputValues (e, a) {
    const table = document.querySelector('#element-table')
    const names = table.querySelectorAll('.name')
    const values = table.querySelectorAll('.value')
    const btns = table.querySelectorAll('.delete-btn')
    const name = document.querySelector('#name-input')
    const price = document.querySelector('#price-input')

    if (name.value === '') {
      name.value = a.name
    }
    if (price.value === '') {
      price.value = a.price
    }

    for (let i = 0; i < e.length; i++) {
      names[i].value = e[i].name
      values[i].value = e[i].value * 100
      btns[i].value = e[i].name
    }
  }

  saveAlloy () {
    const alloy = { ...this.state.alloy }
    const alloyName = document.querySelector('#name-input').value
    const alloyPrice = parseFloat(document.querySelector('#price-input').value)
    const table = document.querySelector('#element-table')
    const names = table.querySelectorAll('.name')
    const values = table.querySelectorAll('.value')
    const prevName = alloy.name
    const tempAlloy = {}

    if (alloyName === '' || isNaN(alloyPrice)) {
      this.handleFlashMessage(
        'Please make sure the alloy has a name and a price.',
        true,
        false
      )
      return
    }

    tempAlloy.name = alloyName
    tempAlloy.price = alloyPrice
    tempAlloy.ElementList = []
    for (let i = 0; i < alloy.ElementList.length; i++) {
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alloy: tempAlloy, prevName })
      })
      .then(response => {
        if (response.ok) {
          this.handleFlashMessage('Alloy was updated successfully!', true, true)
          if (this.state.originalName !== tempAlloy.name) {
            this.setState({
              originalName: tempAlloy.name,
              alloy: { ...tempAlloy }
            })
            window.history.replaceState(
              null,
              null,
              '/alloy/edit/' + tempAlloy.name
            )
          }
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

  addNewElement () {
    const name = document.querySelector('#new-alloy-element-name')
    const value = document.querySelector('#new-alloy-element-value')
    const alloy = this.copyAlloy()

    if (name.value === '' || value.value === '') {
      this.handleFlashMessage('Missing input field.', true, false)
      return
    }

    const exists = alloy.ElementList.find(
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

    alloy.ElementList.push({
      name: name.value,
      value: parseFloat(value.value) / 100
    })

    this.setState({ alloy: { ...alloy } })

    name.value = ''
    value.value = ''
    this.handleFlashMessage('', false, false)
  }

  removeElement (event) {
    const alloy = this.copyAlloy()
    const name = event.currentTarget.value
    alloy.ElementList = alloy.ElementList.filter(e => e.name !== name)
    this.setState({ alloy: { ...alloy } })
  }

  copyAlloy () {
    const alloy = {}
    alloy.name = this.state.alloy.name
    alloy.price = this.state.alloy.price
    alloy.ElementList = [...this.state.alloy.ElementList]
    return alloy
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
      <div id='edit-alloy-div'>
        <h3>Editing {this.state.originalName}</h3>
        <AlloyNamePrice alloy={this.state.alloy} />
        <div id='message-div'>
          <FlashMessage data={this.state.flashMessage} />
        </div>
        <ElementTable
          elements={this.state.alloy.ElementList}
          removeElement={this.removeElement}
          addNewElement={this.addNewElement}
          isEdit
          name={this.state.alloy.name}
        />
        <ConfirmEdit save={this.saveAlloy} link='/alloy' />
      </div>
    )
  }
}

export default withRouter(EditAlloy)
