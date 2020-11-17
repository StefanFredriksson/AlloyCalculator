import './AlloyInformation.css'
import React, { useContext } from 'react'
import { HostContext } from '../../../Store'

export default function AlloyInformation (props) {
  const [host] = useContext(HostContext)
  const removeAlloy = event => {
    event.stopPropagation()
    const alloy = event.currentTarget.value

    window
      .fetch(`${host}/api/alloy`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alloy)
      })
      .then(response => {
        if (response.ok) {
          props.removeAlloy(alloy)
        }
      })
  }

  return (
    <div id='content-container'>
      <div id='alloy-header'>
        <h3>Exisiting Alloys</h3>
        <button>Add alloy</button>
      </div>
      <div id='alloys-container'>
        {props.alloys.map(alloy => {
          return (
            <div onClick={props.openPopUp} className='alloy-div'>
              <div className='delete-btn-container'>
                <button
                  className='delete-btn'
                  value={alloy.name}
                  onClick={removeAlloy}
                >
                  X
                </button>
              </div>
              <div className='name-price-div'>
                <label className='title'>{alloy.name}</label>
                <label className='subtitle'>{alloy.price}kr/kg</label>
              </div>
              <label className='subtitle'>
                {alloy.ElementList.length}{' '}
                {alloy.ElementList.length > 1 ? 'elements' : 'element'}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
