import React, { ReactNode, useEffect, useState } from "react";


const EDITOR_WINDOWS = {
    GRAPH: "graph",
    OBJECTS: "objects",
    FACTORS: "factors",
    CONNECTIONS: "connections",
    ANALYSIS: "analysis",
}

const MenuContext = React.createContext({
    projectId: "",
    setProjectId: null,
    projectName: "",
    setProjectName: null,
    currentWindow: EDITOR_WINDOWS.GRAPH,
    setCurrentWindow: null,
    currentFEditor: 0,
    setCurrentFEditor: null,
    currentFСEditor: 0,
    setCurrentFСEditor: null,
    currentAnalysisObject: 0,
    setCurrentAnalysisObject: null,
});



interface Props {
    children: ReactNode;
}

const MenuContextProvider = ({ children }: Props) => {
    const [projectId, setProjectId] = useState("")
    const [projectName, setProjectName] = useState("")
    const [currentWindow, setCurrentWindow] = useState(EDITOR_WINDOWS.GRAPH)
    const [currentFEditor, setCurrentFEditor] = useState(0)
    const [currentFСEditor, setCurrentFСEditor] = useState(0)
    const [currentAnalysisObject, setCurrentAnalysisObject] = useState(0)
    return (
        <MenuContext.Provider
            value={{
                projectId,
                setProjectId,
                projectName,
                setProjectName,
                currentWindow,
                setCurrentWindow,
                currentFEditor,
                setCurrentFEditor,
                currentFСEditor,
                setCurrentFСEditor,
                currentAnalysisObject,
                setCurrentAnalysisObject
            }}
        >
            {children}
        </MenuContext.Provider>
    );
};

export default MenuContext;

export { MenuContextProvider };