import React from 'react'
import './MainContainer.css'
import './MainContainer_Responsive.css'
import { Switch, Route } from 'react-router-dom'
import Alloy from '../Alloy/Alloy'
import AddAlloy from '../Alloy/AddAlloy/AddAlloy'
import Steelgrade from '../Steelgrade/Steelgrade'
import AddSteelgrade from '../Steelgrade/AddSteelgrade/AddSteelgrade'
import AddAnalysis from '../Analysis/AddAnalysis/AddAnalysis'
import EditAnalysis from '../Analysis/EditAnalysis/EditAnalysis'
import Analysis from '../Analysis/Analysis'
import Calculate from '../Calculate/Calculate'
import Homepage from '../Homepage/Homepage'
import EditAlloy from '../Alloy/EditAlloy/EditAlloy'
import EditSteelgrade from '../Steelgrade/EditSteelgrade/EditSteelgrade'

export default function MainContainer () {
  return (
    <div id='main-container'>
      <Switch>
        <Route path='/alloy/add'>
          <AddAlloy />
        </Route>
        <Route path='/alloy/edit/:name'>
          <EditAlloy />
        </Route>
        <Route path='/alloy'>
          <Alloy />
        </Route>
        <Route path='/steelgrade/add'>
          <AddSteelgrade />
        </Route>
        <Route path='/steelgrade/edit/:name'>
          <EditSteelgrade />
        </Route>
        <Route path='/steelgrade'>
          <Steelgrade />
        </Route>
        <Route path='/analysis/add'>
          <AddAnalysis />
        </Route>
        <Route path='/analysis/edit/:name'>
          <EditAnalysis />
        </Route>
        <Route path='/calculate'>
          <Calculate />
        </Route>
        <Route path='/analysis'>
          <Analysis />
        </Route>
        <Route path='/'>
          <Homepage />
        </Route>
      </Switch>
    </div>
  )
}
