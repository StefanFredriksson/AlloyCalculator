import React, { useState, useEffect } from 'react'
import './Element.css'
import './AddSteelgradeElement.css'
import { elements } from '../../libs/data'
import { autocomplete } from '../../helpers/autocompleteHelper'

export default function AddSteelgradeElement (props) {
  const [showPopUp, setShowPopUp] = useState(false)

  useEffect(() => {
    autocomplete(
      document.querySelector('#new-steelgrade-element-name'),
      elements
    )
  }, [])

  return (
    <div id='wrapping-div'>
      <div
        id='element-options-container'
        className='larger-element-options-container'
      >
        <div
          id='add-element-popup-container'
          style={{ display: showPopUp ? 'flex' : 'none' }}
        >
          <div className='name-value-container'>
            <div className='smaller-input-field'>
              <form autoComplete='off'>
                <input id='new-steelgrade-element-name' type='text' required />
                <label>Element name</label>
                <span />
              </form>
              <div id='autocomplete' />
            </div>
            <div className='smaller-input-field'>
              <input
                id='new-steelgrade-element-min'
                className='next-input'
                type='number'
                step='any'
                min='0'
                required
              />

              <label>Element min</label>
              <span />
            </div>
            <div className='smaller-input-field'>
              <input
                id='new-steelgrade-element-aim'
                type='number'
                step='any'
                min='0'
                required
              />

              <label>Element aim</label>
              <span />
            </div>
            <div className='smaller-input-field'>
              <input
                id='new-steelgrade-element-max'
                type='number'
                step='any'
                min='0'
                required
              />

              <label>Element max</label>
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
