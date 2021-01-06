import React, { Component } from 'react'
import './Calculate.css'
import { HostContext } from '../../Store'
import Analysis from './Analysis/Analysis'
import FlashMessage from '../Common/FlashMessage'
const regex = /\B(?=(\d{3})+(?!\d))/g

export default class Calculate extends Component {
  static contextType = HostContext

  constructor (props) {
    super(props)

    this.renderAnalysis = this.renderAnalysis.bind(this)
    this.beginCalculation = this.beginCalculation.bind(this)

    this.state = {
      analyses: [],
      analysis: {
        name: '',
        weight: 0,
        maxWeight: 0,
        steelgrade: '',
        elementList: []
      },
      finalAnalysis: {
        name: '',
        weight: 0,
        maxWeight: 0,
        steelgrade: '',
        addedAlloys: [],
        elementList: [],
        TotalPrice: 0
      },
      flashMessage: {
        message: '',
        show: false,
        success: false
      }
    }
  }

  componentDidMount () {
    this.getAnalyses()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.analyses.length !== this.state.analyses.length) {
      document
        .querySelector('select')
        .addEventListener('change', this.renderAnalysis)
    }
  }

  getAnalyses () {
    const [host] = this.context

    window.fetch(`${host}/api/analysis`).then(response => {
      if (response.ok) {
        response.json().then(data => {
          this.setState({ analyses: [...data], analysis: { ...data[0] } })
        })
      }
    })
  }

  renderAnalysis (event) {
    const analysis = this.state.analyses.find(
      a => a.name === event.target.value
    )

    this.setState({ analysis: { ...analysis } })
    this.handleFlashMessage('', false, false)
  }

  beginCalculation (event) {
    const [host] = this.context

    window
      .fetch(
        `${host}/api/analysis/calculate?analysis=${this.state.analysis.name}`
      )
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            this.setState({ finalAnalysis: { ...data } })

            if (data.weight > data.maxWeight) {
              this.handleFlashMessage(
                'Weight exceeds max allowed weight. There is no way to complete the analysis.',
                true,
                false
              )
            }
          })
        }
      })
  }

  handleFlashMessage (message, show, success) {
    this.setState({ flashMessage: { message, show, success } })
  }

  render () {
    return (
      <div id='main-calculate-container'>
        <h2>Calculate</h2>
        <div id='analysis-selection-div'>
          <div className='selection'>
            <select>
              {this.state.analyses.map(a => {
                return <option>{a.name}</option>
              })}
            </select>
          </div>
          <button className='regular-button' onClick={this.beginCalculation}>
            Begin
          </button>
        </div>
        <div id='message-container'>
          <FlashMessage data={this.state.flashMessage} />
        </div>
        <div id='result-container'>
          <Analysis analysis={this.state.analysis} title='Original Analysis' />
          <div className='analysis-container'>
            <h3>Alloys to add</h3>
            <label>
              Total weight added:{' '}
              {(this.state.finalAnalysis.weight - this.state.analysis.weight)
                .toFixed(1)
                .toString()
                .replace(regex, ' ')}
              kg
            </label>
            <label>
              Total price:{' '}
              {this.state.finalAnalysis.TotalPrice.toFixed(2)
                .toString()
                .replace(regex, ' ')}
              kr
            </label>
            <div className='element-table alloy-element-table'>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Weight</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.finalAnalysis.addedAlloys.map(a => {
                    return (
                      <tr>
                        <td>{a.name}</td>
                        <td>
                          {a.Weight.toFixed(1)
                            .toString()
                            .replace(regex, ' ')}
                          kg
                        </td>
                        <td>
                          {(a.price * a.Weight)
                            .toFixed(2)
                            .toString()
                            .replace(regex, ' ')}
                          kr
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Analysis
            analysis={this.state.finalAnalysis}
            title='Final Analysis'
          />
        </div>
      </div>
    )
  }
}
