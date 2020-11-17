import './Homepage.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Homepage () {
  return (
    <div id='homepage-container'>
      <div id='img-container'>
        <Link to='/alloy' className='box'>
          <div className='imgBx'>
            <img
              src='https://tampasteel.com/wp-content/uploads/2015/07/What-Is-a-Metal-Alloy.jpg'
              alt=''
            />
          </div>
          <div className='content'>
            <h2>Alloy</h2>
          </div>
        </Link>
        <Link to='/steelgrade/add' className='box'>
          <div className='imgBx'>
            <img
              src='https://www.azom.com/images/Article_Images/ImageForArticle_12569_16013833490504411.png'
              alt=''
            />
          </div>
          <div className='content'>
            <h2>Steelgrade</h2>
          </div>
        </Link>
        <Link to='/analysis/add' className='box'>
          <div className='imgBx'>
            <img
              src='https://cdn.proschoolonline.com/wp-content/uploads/2017/12/HOW-TO-DO-INDUSTRY-ANALYSIS_IMAGE-2-1.png'
              alt=''
            />
          </div>
          <div className='content'>
            <h2>Analysis</h2>
          </div>
        </Link>
        <Link to='/analysis/calculate' className='box'>
          <div className='imgBx'>
            <img
              src='https://www.callcentrehelper.com/images/stories/2016/04/calulator-hand-760.jpg'
              alt=''
            />
          </div>
          <div className='content'>
            <h2>Calculate</h2>
          </div>
        </Link>
      </div>
    </div>
  )
}
