import './ElementTable.css'
import React, { useState, useEffect } from 'react'
import { elements } from '../../../../libs/data'
import { autocomplete } from '../../../../helpers/autocompleteHelper'

export default function ElementTable (props) {
  const [showPopUp, setShowPopUp] = useState(false)

  useEffect(() => {
    const input = document.querySelector('#new-element-name')
    autocomplete(input, elements)
  }, [])

  useEffect(() => {
    if (showPopUp) {
      document.querySelector('#new-element-name').focus()
    }
  }, [showPopUp])

  useEffect(() => {
    if (props.elements.length > 0 && props.isEdit) {
      setup()
    } else if (!props.isEdit) {
      setup()
    }
  }, [props.elements.join(',')])

  const setup = () => {
    const value = document.querySelector('#new-element-value')
    value.removeEventListener('keydown', autoAddElement, true)
    value.addEventListener('keydown', autoAddElement, true)
  }

  const autoAddElement = e => {
    if (e.keyCode === 9 || e.keyCode === 13) {
      const name = document.querySelector('#new-element-name')

      if (name.value !== '' && e.target.value !== '') {
        e.preventDefault()
        props.addNewElement()
        name.focus()
      }
    }
  }

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
      <div id='element-options-container'>
        <div
          id='add-element-popup-container'
          style={{ display: showPopUp ? 'flex' : 'none' }}
        >
          <div className='name-value-container'>
            <div className='input-field'>
              <form autoComplete='off'>
                <input id='new-element-name' type='text' required />
                <label>Element name</label>
                <span />
              </form>
              <div id='autocomplete' />
            </div>
            <div className='input-field'>
              <input
                id='new-element-value'
                type='number'
                step='any'
                min='0'
                required
              />

              <label>Element value</label>
              <span />
            </div>
          </div>
          <div id='confirmation-container'>
            <button onClick={props.addNewElement}>Save</button>
          </div>
        </div>
        <div id='button-container'>
          <div id='add-element-container'>
            <button
              onClick={() => setShowPopUp(!showPopUp)}
              className={showPopUp ? 'rotate-btn' : ''}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
