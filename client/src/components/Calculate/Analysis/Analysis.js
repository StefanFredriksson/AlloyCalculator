import React from 'react'
import './Analysis.css'
const regex = /\B(?=(\d{3})+(?!\d))/g

export default function Analysis (props) {
  return (
    <div id='analysis-container'>
      <h3>{props.title}</h3>
      <label>Steelgrade: {props.analysis.steelgrade}</label>
      <label>
        Weight:{' '}
        {props.analysis.weight
          .toFixed(1)
          .toString()
          .replace(regex, ' ')}
        kg
      </label>
      <label>
        Max weight: {props.analysis.maxWeight.toString().replace(regex, ' ')}kg
      </label>

      <div className='element-table'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actual</th>
              <th>Min</th>
              <th>Aim</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            {props.analysis.elementList.map(e => {
              return (
                <tr>
                  <td>{e.name}</td>
                  <td className='actual-analysis'>
                    {(e.actual * 100).toFixed(2)}%
                  </td>
                  <td>{(e.min * 100).toFixed(2)}%</td>
                  <td>{(e.aim * 100).toFixed(2)}%</td>
                  <td>{(e.max * 100).toFixed(2)}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
