import React from 'react'
import './MainContainer.css'
import { Switch, Route } from 'react-router-dom'
import AddAlloy from '../Alloy/AddAlloy/AddAlloy'
import AddSteelgrade from '../Steelgrade/AddSteelgrade/AddSteelgrade'
import AddAnalysis from '../Analysis/AddAnalysis/AddAnalysis'
import Calculate from '../Analysis/Calculate/Calculate'

export default function MainContainer () {
  return (
    <div id='main-container'>
      <Switch>
        <Route path='/alloy/add'>
          <AddAlloy />
        </Route>
        <Route path='/steelgrade/add'>
          <AddSteelgrade />
        </Route>
        <Route path='/analysis/add'>
          <AddAnalysis />
        </Route>
        <Route path='/analysis/calculate'>
          <Calculate />
        </Route>
      </Switch>
    </div>
  )
}
