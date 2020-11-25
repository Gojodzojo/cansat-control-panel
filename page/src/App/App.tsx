import "./App.scss"
import React, { useState } from 'react'
import { TopBar } from "../TopBar/TopBar"
import { SideDrawer } from "../SideDrawer/SideDrawer"
import { DataTable } from "../DataTable/DataTable"
import { UnityVisualiser } from "../UnityVisualizer/UnityVisualiser"
import { Graph } from "../Graph/Graph"
import { useGlobalStateProvider } from ".."

export type Utilities = "visualizer" | "graph" | "dataTable"

export const App = () => {
  const [openedUtilities, setOpenedUtilities] = useState<Utilities[]>(["visualizer", "dataTable", "graph"])
  const [isDrawerOpened, setIsDrawerOpened] = useState(true)

  const utilities = openedUtilities.map((utilityName, index) => {
    let utility: JSX.Element
    switch (utilityName) {
      case "dataTable":
        utility = <DataTable />    
        break
        case "visualizer":
          utility = <UnityVisualiser />
          break
        case "graph":
          utility = <Graph />
          break
      default:
        utility = <div> utilitiesError </div>
        break
    }
    return(
      <div className="utility" key={index}>
        { utility }
      </div>
    )
  })

  return (
    <div className="App">
      
      {window.opener === null && <>
        <SideDrawer
          closeDrawer={() => setIsDrawerOpened(false)}
          isDrawerOpened={isDrawerOpened}          
        />
        <TopBar openDrawer={() => setIsDrawerOpened(true)} />
      </>}
      
      { utilities }      

    </div>
  )
}