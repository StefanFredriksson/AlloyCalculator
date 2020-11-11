import './OriginalAnalysis.css'
import React from 'react'

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
                <td>{e.actual}</td>
                <td>{e.min}</td>
                <td>{e.aim}</td>
                <td>{e.max}</td>
                <td>{e.weight}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
