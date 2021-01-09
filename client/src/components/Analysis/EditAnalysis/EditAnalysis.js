import React, { Component } from 'react'
import './EditAnalysis.css'
import FlashMessage from '../../Common/FlashMessage'
import ConfirmEdit from '../../Alloy/EditAlloy/ConfirmEdit/ConfirmEdit'
import { HostContext } from '../../../Store'
import { withRouter } from 'react-router-dom'

class EditAnalysis extends Component {
  static contextType = HostContext

  constructor (props) {
    super(props)
    this.setNewSteelgrade = this.setNewSteelgrade.bind(this)
    this.saveAnalysis = this.saveAnalysis.bind(this)

    this.state = {
      originalName: '',
      analysis: {
        name: '',
        steelgrade: '',
        weight: '',
        maxWeight: '',
        elementList: []
      },
      steelgrades: [],
      steelgrade: { name: '', elementList: [] },
      flashMessage: { message: '', success: false, show: false },
      firstRender: true
    }
  }

  componentDidMount () {
    this.setState({ originalName: this.props.match.params.name })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.originalName === '' && this.state.originalName !== '') {
      this.getAnalysis()
      document
        .querySelector('select')
        .addEventListener('change', this.setNewSteelgrade)
    }

    if (
      prevState.analysis.name !== this.state.analysis.name &&
      this.state.firstRender
    ) {
      this.setState({ firstRender: false })
      this.getSteelgrade()
    }

    if (prevState.steelgrade.name !== this.state.steelgrade.name) {
      this.setInputValues()
    }
  }

  getAnalysis () {
    const [host] = this.context

    window
      .fetch(`${host}/api/analysis?name=${this.state.originalName}`)
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            this.setState({ analysis: { ...data } })
          })
        }
      })
  }

  getSteelgrade () {
    const [host] = this.context

    window.fetch(`${host}/api/steelgrade`).then(response => {
      if (response.ok) {
        response.json().then(data => {
          this.setState({ steelgrades: [...data] })
          const sg = data.find(s => s.name === this.state.analysis.steelgrade)
          this.setState({ steelgrade: { ...sg } })
        })
      }
    })
  }

  setInputValues () {
    const name = document.querySelector('#name-input')
    const weight = document.querySelector('#weight-input')
    const maxWeight = document.querySelector('#max-weight-input')
    const actuals = document.querySelectorAll('.actual-input')
    const analysis = { ...this.state.analysis }

    if (name.value === '') name.value = analysis.name
    if (weight.value === '') weight.value = analysis.weight
    if (maxWeight.value === '') maxWeight.value = analysis.maxWeight

    if (analysis.steelgrade === this.state.steelgrade.name) {
      for (let i = 0; i < actuals.length; i++) {
        actuals[i].value = +(analysis.elementList[i].actual * 100).toFixed(2)
      }
    } else {
      for (const actual of actuals) {
        actual.value = ''
      }
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
    const prevName = this.state.analysis.name
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ analysis: tempAnalysis, prevName })
      })
      .then(response => {
        if (response.ok) {
          this.setState({
            originalName: tempAnalysis.name,
            analysis: { ...tempAnalysis }
          })
          window.history.replaceState(
            null,
            null,
            '/analysis/edit' + tempAnalysis.name
          )
          this.handleFlashMessage(
            'Analysis was updated successfully!',
            true,
            true
          )
        } else if (response.status === 409) {
          this.handleFlashMessage(
            'An analysis with the same name already exist.',
            true,
            false
          )
        } else {
          this.handleFlashMessage(
            'Something went wrong when updating the analysis.',
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
        <h2>Editing analysis {this.state.originalName}</h2>
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
                if (s.name === this.state.analysis.steelgrade) {
                  return <option selected>{s.name}</option>
                } else {
                  return <option>{s.name}</option>
                }
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

export default withRouter(EditAnalysis)
