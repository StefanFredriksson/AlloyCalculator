import React from 'react'
import './MainContainer.css'
import { Switch, Route } from 'react-router-dom'
import AddAlloy from '../Alloy/AddAlloy/AddAlloy'
import AddSteelgrade from '../Steelgrade/AddSteelgrade/AddSteelgrade'

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
      </Switch>
    </div>
  )
}
