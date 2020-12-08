import './ElementTable.css'
import React, { useEffect } from 'react'
import AddElement from '../../../Common/AddSteelgradeElement'

export default function ElementTable (props) {
  return (
    <div id='elements-container'>
      <table id='element-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Min</th>
            <th>Aim</th>
            <th>Max</th>
          </tr>
        </thead>
        <tbody>
          {props.elements.map(e => {
            return (
              <tr>
                <td>
                  <input type='text' className='element-name' />
                </td>
                <td>
                  <input
                    type='number'
                    className='element-min'
                    step='any'
                    min='0'
                  />
                </td>
                <td>
                  <input
                    type='number'
                    className='element-aim'
                    step='any'
                    min='0'
                  />
                </td>
                <td>
                  <input
                    type='number'
                    className='element-max'
                    step='any'
                    min='0'
                  />
                </td>
                <div className='delete-btn-container'>
                  <button className='delete-btn' onClick={props.removeElement}>
                    X
                  </button>
                </div>
              </tr>
            )
          })}
        </tbody>
      </table>
      <AddElement addNewElement={props.addNewElement} />
    </div>
  )
}
