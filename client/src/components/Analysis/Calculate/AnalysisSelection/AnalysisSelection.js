import './AnalysisSelection.css'
import React from 'react'
import Analysis from './Analysis/Analysis'

export default function AnalysisSelection (props) {
  return (
    <div className='container' id='analysis-selection-container'>
      {props.analysis.map(a => {
        return <Analysis buttonClicked={props.buttonClicked} analysis={a} />
      })}
    </div>
  )
}
