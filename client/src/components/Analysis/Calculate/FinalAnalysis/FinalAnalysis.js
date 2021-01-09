import './FinalAnalysis.css'
import React from 'react'

const regex = /\B(?=(\d{3})+(?!\d))/g

export default function FinalAnalysis (props) {
  return (
    <div id='final-analysis-container' className='container'>
      <h3>Final Analysis</h3>
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
          {props.analysis.map(a => {
            return (
              <tr>
                <td>{a.name}</td>
                <td>{+(a.actual * 100).toFixed(2)}%</td>
                <td>{+(a.min * 100).toFixed(2)}%</td>
                <td>{+(a.aim * 100).toFixed(2)}%</td>
                <td>{+(a.max * 100).toFixed(2)}%</td>
                <td>
                  {a.weight
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
