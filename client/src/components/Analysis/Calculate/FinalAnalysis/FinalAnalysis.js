import './FinalAnalysis.css'
import React from 'react'

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
                <td>{a.actual.toFixed(4)}</td>
                <td>{a.min.toFixed(4)}</td>
                <td>{a.aim.toFixed(4)}</td>
                <td>{a.max.toFixed(4)}</td>
                <td>{a.weight.toFixed(1)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
