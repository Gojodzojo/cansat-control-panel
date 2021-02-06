import React, { FC, useEffect, useMemo, useState } from 'react'
import { TopBar } from "../TopBar/TopBar"
import { DataTable } from "../DataTable/DataTable"
import { UnityVisualiser } from "../UnityVisualizer/UnityVisualiser"
import { Graph } from "../Graph/Graph"
import { Utility } from "../index"
import { v4 } from 'uuid'
import { SerialDialog } from '../SerialDialog/SerialDialog'
import { MessageSender } from '../MessageSender/MessageSender'

interface UtilityWithID {
  utilityName: Utility,
  id: string
}

interface props {
  defautlUtilities: Utility[]
}

export const App: FC<props> = ({defautlUtilities}) => {
  const [openedUtilities, setOpenedUtilities] = useState<UtilityWithID[]>(
    defautlUtilities.map( utilityName => ({utilityName, id: v4()}) )
  )  

  const utilities = useMemo(() => openedUtilities.map(({utilityName, id}) => {    
    const removeUtility = () => setOpenedUtilities(utils => utils.filter((u) => u.id !== id) )

    const props = {
      removeUtility,
      openInNewWindow: () => {
        const newWindow = window.open("./", "_blank", "menubar=no,location=no,status=no,dependent=yes")
        if(newWindow) {
          newWindow.defaultUtilities = [utilityName]
        }
        removeUtility()
      },
      bigWindow: openedUtilities.length === 1,
      key: id
    }

    if(utilityName === "Data table")          return <DataTable {...props} />
    else if(utilityName === "Visualizer")     return <UnityVisualiser {...props}/>
    else if(utilityName === "Graph")          return <Graph {...props} />
    else if(utilityName === "Message sender") return <MessageSender {...props} />
                                              return <div> utilitiesError </div> 
  }), [openedUtilities])

  useEffect(() => {
    if(openedUtilities.length === 0 && window.opener !== null) {
      window.close()
    }
  }, [openedUtilities])

  return (
    <div className="App">
      <style>{`
        body {
          --topBar-height: ${window.opener === null? "64" : "1"}px;
        }
      `}</style>

      {window.opener === null && (
        <TopBar
          addUtility={(utilityName: Utility) => setOpenedUtilities(u => [...u, {utilityName, id: v4()}])}
        />
      )}

      <SerialDialog open={"serial" in navigator === false} />
            
      { utilities }            
    </div>    
  )
}