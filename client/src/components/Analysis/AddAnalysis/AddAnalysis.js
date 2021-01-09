import React, { Component } from 'react'
import './AddAnalysis.css'
import FlashMessage from '../../Common/FlashMessage'
import ConfirmEdit from '../../Alloy/EditAlloy/ConfirmEdit/ConfirmEdit'
import { HostContext } from '../../../Store'
import { withRouter } from 'react-router-dom'

export default class AddAnalysis extends Component {
  static contextType = HostContext

  constructor (props) {
    super(props)
    this.setNewSteelgrade = this.setNewSteelgrade.bind(this)
    this.saveAnalysis = this.saveAnalysis.bind(this)

    this.state = {
      steelgrades: [],
      steelgrade: { name: '', elementList: [] },
      flashMessage: { message: '', success: false, show: false }
    }
  }

  componentDidMount () {
    this.getSteelgrade()
    document
      .querySelector('select')
      .addEventListener('change', this.setNewSteelgrade)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.steelgrade.name !== this.state.steelgrade.name) {
      this.setInputValues()
    }
  }

  getSteelgrade () {
    const [host] = this.context

    window.fetch(`${host}/api/steelgrade`).then(response => {
      if (response.ok) {
        response.json().then(data => {
          this.setState({ steelgrades: [...data] })
          const sg = data[0]
          this.setState({ steelgrade: { ...sg } })
        })
      }
    })
  }

  setInputValues () {
    const actuals = document.querySelectorAll('.actual-input')

    for (const actual of actuals) {
      actual.value = ''
    }
  }

  saveAnalysis (event) {
    const name = document.querySelector('#name-input').value
    const weight = parseFloat(document.querySelector('#weight-input').value)
    const steelgrade = document.querySelector('select').value
    const maxWeight = parseFloat(
      document.querySelector('#max-weight-input').value
    )
    const actuals = document.querySelectorAll('.actual-input')
    const names = document.querySelectorAll('.name')
    const mins = document.querySelectorAll('.min')
    const aims = document.querySelectorAll('.aim')
    const maxs = document.querySelectorAll('.max')
    const tempAnalysis = {}

    if (name === '' || isNaN(weight) || isNaN(maxWeight)) {
      this.handleFlashMessage(
        'Make sure no input fields are empty.',
        true,
        false
      )
      return
    }

    tempAnalysis.name = name
    tempAnalysis.weight = weight
    tempAnalysis.maxWeight = maxWeight
    tempAnalysis.steelgrade = steelgrade

    const elementList = []

    for (let i = 0; i < actuals.length; i++) {
      if (actuals[i].value === '') {
        this.handleFlashMessage('One or more inputs are empty.', true, false)
        return
      }
      const actual = parseFloat(actuals[i].value) / 100
      const name = names[i].textContent
      const min = parseFloat(mins[i].textContent) / 100
      const aim = parseFloat(aims[i].textContent) / 100
      const max = parseFloat(maxs[i].textContent) / 100
      const elementWeight = weight * actual
      elementList.push({ name, actual, min, aim, max, weight: elementWeight })
    }

    tempAnalysis.elementList = elementList
    tempAnalysis.elements = JSON.stringify(elementList)

    const [host] = this.context

    window
      .fetch(`${host}/api/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempAnalysis)
      })
      .then(response => {
        if (response.ok) {
          this.handleFlashMessage(
            'Analysis was added successfully!',
            true,
            true
          )

          document.querySelector('#name-input').value = ''
          document.querySelector('#weight-input').value = ''
          document.querySelector('#max-weight-input').value = ''
          this.setInputValues()
        } else if (response.status === 409) {
          this.handleFlashMessage(
            'An analysis with the same name already exist.',
            true,
            false
          )
        } else {
          this.handleFlashMessage(
            'Something went wrong when adding the analysis.',
            true,
            false
          )
        }
      })
  }

  setNewSteelgrade (event) {
    const sg = this.state.steelgrades.find(s => s.name === event.target.value)
    this.setState({ steelgrade: { ...sg } })
    this.handleFlashMessage('', false, false)
  }

  handleFlashMessage (message, show, success) {
    this.setState({ flashMessage: { message, show, success } })
  }

  render () {
    return (
      <div id='main-edit-analysis-container'>
        <h2>Add analysis</h2>
        <div id='name-weight-container'>
          <div className='input-field'>
            <input id='name-input' type='text' required />
            <label>Analysis name</label>
            <span />
          </div>
          <div className='input-field'>
            <input
              id='weight-input'
              type='number'
              step='any'
              min='0'
              required
            />
            <label>Analysis weight</label>
            <span />
          </div>
          <div className='input-field'>
            <input
              id='max-weight-input'
              type='number'
              step='any'
              min='0'
              required
            />
            <label>Analysis max weight</label>
            <span />
          </div>
        </div>
        <div id='message-selection-div'>
          <div className='selection'>
            <select>
              {this.state.steelgrades.map(s => {
                return <option>{s.name}</option>
              })}
            </select>
          </div>
          <FlashMessage data={this.state.flashMessage} />
        </div>
        <div id='analysis-element-container'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actual (%)</th>
                <th>Min</th>
                <th>Aim</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              {this.state.steelgrade.elementList.map(e => {
                return (
                  <tr>
                    <td className='name'>{e.name}</td>
                    <td>
                      <input
                        className='actual-input'
                        type='number'
                        step='any'
                        min='0'
                      />
                    </td>
                    <td>
                      <span className='min'>{+(e.min * 100).toFixed(2)}</span>%
                    </td>
                    <td>
                      <span className='aim'>{+(e.aim * 100).toFixed(2)}</span>%
                    </td>
                    <td>
                      <span className='max'>{+(e.max * 100).toFixed(2)}</span>%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <ConfirmEdit save={this.saveAnalysis} link='/analysis' />
      </div>
    )
  }
}
