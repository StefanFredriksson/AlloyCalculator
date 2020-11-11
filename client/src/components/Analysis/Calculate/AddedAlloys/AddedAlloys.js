import React from 'react'
import './AddedAlloys.css'

export default function AddedAlloys (props) {
  return (
    <div className='container' id='added-alloys-container'>
      <h3>Added Alloys</h3>
      <table id='alloy-table'>
        <thead>
          <tr>
            <th>Alloy</th>
            <th>Weight</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {props.addedAlloys.map(al => {
            return (
              <tr>
                <td>{al.name}</td>
                <td>{al.Weight.toFixed(2)}kg </td>
                <td>{al.TotalPrice.toFixed(2)}kr</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div id='total-price-container'>
        <label>
          <span>Total price:</span>{' '}
          {props.totalPrice ? props.totalPrice.toFixed(2) + 'kr' : ''}
        </label>
      </div>
    </div>
  )
}
