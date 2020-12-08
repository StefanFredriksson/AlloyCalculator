import React, { useState, useEffect } from 'react'
import './Element.css'
import './AddAlloyElement.css'
import { elements } from '../../libs/data'
import { autocomplete } from '../../helpers/autocompleteHelper'

export default function AddAlloyElement (props) {
  const [showPopUp, setShowPopUp] = useState(false)

  useEffect(() => {
    autocomplete(document.querySelector('#new-alloy-element-name'), elements)
  }, [])

  return (
    <div id='wrapping-div'>
      <div id='element-options-container'>
        <div
          id='add-element-popup-container'
          style={{ display: showPopUp ? 'flex' : 'none' }}
        >
          <div className='name-value-container'>
            <div className='input-field'>
              <form autoComplete='off'>
                <input id='new-alloy-element-name' type='text' required />
                <label>Element name</label>
                <span />
              </form>
              <div id='autocomplete' />
            </div>
            <div className='input-field'>
              <input
                id='new-alloy-element-value'
                className='next-input'
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
