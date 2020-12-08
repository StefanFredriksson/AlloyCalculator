import './ElementTable.css'
import React, { useState, useEffect } from 'react'
import AddElement from '../../../Common/AddAlloyElement'

export default function ElementTable (props) {
  const [showPopUp, setShowPopUp] = useState(false)
  const [firstRender, setFirstRender] = useState(true)

  useEffect(() => {
    if (showPopUp) {
      document.querySelector('#new-alloy-element-name').focus()
    }
  }, [showPopUp])

  useEffect(() => {}, [props.name])

  return (
    <div id='alloy-element-container'>
      <div id='element-information-container'>
        <table id='element-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value (%)</th>
            </tr>
          </thead>
          <tbody>
            {props.elements.map(element => {
              return (
                <tr>
                  <td>
                    <input
                      className='name'
                      type='text'
                      placeholder='Element name'
                    />
                  </td>
                  <td>
                    <input
                      className='value'
                      type='number'
                      step='any'
                      min='0'
                      placeholder='Element value'
                    />
                  </td>
                  <div className='delete-btn-container'>
                    <button
                      className='delete-btn'
                      onClick={props.removeElement}
                    >
                      X
                    </button>
                  </div>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <AddElement addNewElement={props.addNewElement} />
    </div>
  )
}
