import './OriginalAnalysis.css'
import React from 'react'

const regex = /\B(?=(\d{3})+(?!\d))/g

export default function OriginalAnalysis (props) {
  return (
    <div className='container' id='original-analysis-container'>
      <h3>Original Analysis</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actual</th>
            <th>Min</th>
            <th>Aim</th>
            <th>Max</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {props.analysis.map(e => {
            return (
              <tr>
                <td>{e.name}</td>
                <td>{+(e.actual * 100).toFixed(2)}%</td>
                <td>{+(e.min * 100).toFixed(2)}%</td>
                <td>{+(e.aim * 100).toFixed(2)}%</td>
                <td>{+(e.max * 100).toFixed(2)}%</td>
                <td>
                  {e.weight
                    .toFixed(1)
                    .toString()
                    .replace(regex, ' ')}
                  kg
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
