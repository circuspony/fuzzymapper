import { useEffect, useState, useRef, useContext } from "react"
import FactorObject from "./factorObject";
import EditorMenu from "./editorMenu";
import ObjectEditor from "./objectEditor";
import FactorEditor from "./factorEditor";
import FactorConnectionEditor from "./fcEditor";
import EditorSidebar from "./editorSidebar";
import DataMenu from "./dataMenu";
import LineEditor from "./lineEditor";
import MenuContext from "../context/menuContext";
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import axios from 'axios'
import IndicatorMenu from "./indicatorMenu";
import IndicatorInfMenu from "./indicatorInfMenu";
import IndicatorChoiceList from "./indicatorChoiceList";



const EDITOR_WINDOWS = {
    GRAPH: "graph",
    OBJECTS: "objects",
    FACTORS: "factors",
    CONNECTIONS: "connections",
    ANALYSIS: "analysis",
}


const EditorArea = ({ isSubMap, seIsSubMap }) => {
    const editorAreRef = useRef() as any
    const [isAddAreaHovered, setIsAddAreaHovered] = useState(false);
    const [indicatorChoiceOpen, setIndicatorChoiceOpen] = useState(false);
    const [uniqueCreationNumber, setUniqueCreationNumber] = useState(0);

    const [factorData, setFactorData] = useState([]);
    const [factorConnectionData, setFactorConnectionData] = useState([]);

    const [currentSubMap, setCurrentSubMap] = useState(false);
    const [reserveFactorData, setReserveFactorData] = useState([]);
    const [reserveFactorConnectionData, setReserveFactorConnectionData] = useState([]);

    const { projectId, setProjectId, projectName, setProjectName, currentWindow, setCurrentWindow, currentFEditor, setCurrentFEditor, currentFСEditor, setCurrentFСEditor, currentAnalysisObject, setCurrentAnalysisObject } = useContext(MenuContext)


    const [dataOpen, setDataOpen] = useState(false);

    const positions = [
        { x: 150, y: 0 },
        { x: -100, y: 0 },
        { x: 450, y: 50 },
        { x: -400, y: 50 },
        { x: 200, y: 100 },
        { x: -150, y: 100 }
    ]

    const addFactor = (event) => {
        const newData = {
            id: "factor" + uniqueCreationNumber,
            name: "Новый Фактор",
            isNew: true,
            isExternal: false,
            indicators: [],
            position: {
                x: positions[factorData.length % 6].x + window?.pageXOffset,
                y: positions[factorData.length % 6].y + window?.pageYOffset,
            },
            submap: {
                factors: [],
                connections: []
            }
        }
        setFactorData([...factorData, newData])
        setUniqueCreationNumber(uniqueCreationNumber + 1)
    }
    const addIndicator = (factorId, indicator) => {
        const factorIndex = factorData.findIndex((factor) => {
            if (factor) {
                if (factor?.id === factorId) {
                    return true
                }
                return false
            }
            return false
        })
        if (factorIndex >= 0) {
            const newIndicatorData = {
                name: indicator.title,
                coef: 1
            }
            setFactorData(factorData.map((factor, index) => {
                if (index === factorIndex) {
                    return { ...factor, indicators: [...factor.indicators, newIndicatorData] }
                }
                return factor
            }))
        }
    }
    const removeIndicator = (factorId, indicatorIndex) => {
        setFactorData(factorData.map((factorData) => {
            if (factorData && factorData.id === factorId) {
                return {
                    ...factorData,
                    indicators: factorData.indicators.map(
                        (indicator, indicatorInnerIndex) => {
                            if (indicatorInnerIndex === indicatorIndex) {
                                return null
                            }
                            return indicator
                        }
                    )
                }
            }
            return factorData
        }))
    }
    const editIndicator = (factorId, indicatorIndex, value) => {
        setFactorData(factorData.map((factorData) => {
            if (factorData && factorData.id === factorId) {
                return {
                    ...factorData,
                    indicators: factorData.indicators.map(
                        (indicator, indicatorInnerIndex) => {
                            if (indicatorInnerIndex === indicatorIndex) {
                                return { ...indicator, ...value }
                            }
                            return indicator
                        }
                    )
                }
            }
            return factorData
        }))
    }

    const removeFactor = (removeIndex) => {
        setFactorConnectionData(factorConnectionData.filter((data) => {
            if (data.start === factorData[removeIndex].id || data.end === factorData[removeIndex].id) {
                return false
            }
            return true
        }
        ))
        setFactorData(factorData.map((data, index) => {
            if (removeIndex !== index) return data
            else return null
        }))
    }
    useEffect(() => {
        if (factorData[currentFEditor] === undefined || null) {
            if (factorData.filter(f => f !== null).length) {
                setCurrentFEditor(factorData.filter(f => f !== null).findIndex((f) => f !== null))
            }
            else {

                setCurrentFEditor(0)
            }

        }
    }, [factorData])

    const changeFactorData = (factorIndex, newFactorData) => {
        setFactorData(factorData.map((factorData, index) => {
            if (index === factorIndex) {
                return { ...factorData, ...newFactorData }
            }
            return factorData
        }))
    }


    const [currentConnectId, setCurrentConnectId] = useState(null);

    const addFactorConnection = (startId, endId) => {
        const newConnectionData = {
            start: startId,
            end: endId,
            influence: "?",
            fcEval: []
        }
        let pairExists = false
        const updatedFactorConnectionData = factorConnectionData.map(data => {
            if (data.start === startId && data.end === endId || data.start === endId && data.end === startId) {
                pairExists = true
                return newConnectionData
            }
            return data
        })
        if (pairExists) {
            setFactorConnectionData(updatedFactorConnectionData)
        }
        else {
            setFactorConnectionData([...factorConnectionData, newConnectionData])
        }
        setCurrentConnectId(null)
    }
    const removeFactorConnection = (removeIndex) => {
        setFactorConnectionData(factorConnectionData.filter((data, index) => removeIndex !== index))
    }
    const changeFactorConnectionInfluence = (changeIndex, newInfluence = "?", fcEval = []) => {
        setFactorConnectionData(factorConnectionData.map((data, index) => {
            if (index === changeIndex) {
                return { ...data, influence: newInfluence, fcEval: fcEval }
            }
            return data
        }))
    }

    const [files, setFiles] = useState(null);
    const getSavingData = () => {
        return factorData.map((factor) => {
            if (factor) {
                const factorObject = document.getElementById(factor.id)
                const transformVallues = factorObject.style.transform.split("(")[1].split(",")
                const xShift = parseInt(transformVallues[0].slice(0, -2))
                const yShift = parseInt(transformVallues[1].slice(1, -3))
                return {
                    ...factor, position: {
                        x: xShift,
                        y: yShift
                    }
                }
            }
            return null
        })
    }


    const uploadFile = async () => {
        document.getElementById("fileLoader").click()
    }

    const openASubMap = (factorId) => {
        setCurrentSubMap(factorId)
        seIsSubMap(true)
        const savingData = getSavingData()
        setReserveFactorData(savingData)
        setReserveFactorConnectionData(factorConnectionData)
        const factorIndex = factorData.filter(f => f !== null).findIndex((factor) => factor?.id === factorId)
        if (factorIndex >= 0) {
            setFactorData([])
            setFactorConnectionData([])
            setTimeout(() => {
                setFactorData(factorData[factorIndex].submap.factors)
                setFactorConnectionData(factorData[factorIndex].submap.connections)
            }, 100)
        }
    }

    const closeASubMap = () => {
        const savingData = getSavingData()
        setFactorData([])
        setFactorConnectionData([])
        setTimeout(() => {
            setFactorData(reserveFactorData.map((factor, index) => {
                if (factor.id === currentSubMap) {
                    return {
                        ...factor,
                        submap: {
                            factors: savingData.filter(factor => factor !== null),
                            connections: factorConnectionData
                        }
                    }
                }
                return factor

            }))
            setFactorConnectionData(reserveFactorConnectionData)
            seIsSubMap(false)
        }, 100)
        setCurrentSubMap(null)
    }



    const [openRename, setOpenRename] = useState(false);
    const saveFile = async () => {
        const savingData = getSavingData()
        if (projectId === "") {
            const response = await axios.post("/api/save", {
                factors: savingData,
                name: projectName,
                description: "",
                date: Date.now(),
                idGen: uniqueCreationNumber,
                connections: factorConnectionData
            })
            setProjectId(response.data.data.neededDoc._id)
        }
        else {
            const response = await axios.put("/api/save", {
                _id: projectId,
                doc: {
                    factors: savingData,
                    name: projectName,
                    description: "",
                    date: Date.now(),
                    idGen: uniqueCreationNumber,
                    connections: factorConnectionData
                }
            })
            setProjectId(response.data.data.neededDoc._id)
        }
    }

    const refreshData = async () => {
        const response = await axios.get(`/api/getProject?id=${projectId}`)
        setProjectName(response.data.data.neededDoc.name)
        setFactorData(response.data.data.neededDoc.factors)
        setFactorConnectionData(response.data.data.neededDoc.connections)
        setUniqueCreationNumber(response.data.data.neededDoc.idGen)
    }



    useEffect(() => {
        if (projectId !== "") {
            refreshData()
        }
        else {
            setProjectName("")
            setFactorData([])
            setFactorConnectionData([])
            setUniqueCreationNumber(0)
        }
    }, [projectId])
    const [indicatorInfMenuOpen, setIndicatorInfMenuOpen] = useState(false);
    const [indicatorMenuOpen, setIndicatorMenuOpen] = useState(false);
    const [currentFactorConIndex, setCurrentFactorConIndex] = useState(0);

    const [currentFIndicatorIndex, setCurrentFInddicatorIndex] = useState(0);
    const [currentIndicatorIndex, setCurrentInddicatorIndex] = useState(0);

    const [objectData, setObjectData] = useState([
        {
            title: "Название",
            key: false,
            date: false,
            values: []
        }
    ]);
    const [indicatorChoiceId, setIndicatorChoiceId] = useState(0);

    const addField = () => {
        setObjectData([...objectData, {
            title: "Индикатор" + (objectData.length + 1),
            key: false,
            date: false,
            values: new Array(objectData[0].values.length).fill(0)
        }])
    }
    const addObject = () => {
        let newVersion = objectData.map(el => {
            let newEl = {
                title: el.title,
                key: el.key,
                date: el.date,
                values: [...el.values, 0]
            }
            return newEl
        })
        setObjectData(newVersion)
    }

    const [factorEvals, setFactorEvals] = useState([])
    const [factorConnectionEvals, setFactorConnectionEvals] = useState([])

    const setEvalInfluence = (factorConnection) => {
        if (currentWindow === EDITOR_WINDOWS.ANALYSIS) {
            if (factorConnection.fcEval.length === 0) {
                return factorConnection.influence
            }
            if (factorConnection.fcEval.length === 1) {
                return factorConnection.fcEval[0].toFixed(4)
            }
            if (factorConnection.fcEval.length > 1) {
                let fe = factorEvals.find(fe => fe.id === factorConnection.start)
                let fev = Math.max(...fe.labels[currentAnalysisObject])
                let fei = fe.labels[currentAnalysisObject].indexOf(fev)
                return factorConnection.fcEval[fei].toFixed(4)
            }
        }
        return factorConnection.influence
    }

    const handleChange = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            setFiles(e.target.result);
        };
        let input = document.getElementById("fileLoader") as HTMLInputElement
        input.value = null
    };
    const exportFile = async () => {
        const savingData = getSavingData()
        let myData = {
            factors: savingData,
            idGen: uniqueCreationNumber,
            connections: factorConnectionData,
            factorEvals: factorEvals,
            factorConnectionEvals: factorConnectionEvals,
            objectData: objectData
        }
        const fileName = "mapFile";
        const json = JSON.stringify(myData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }
    useEffect(() => {
        if (files?.length) {
            const loadedFile = JSON.parse(files)
            if (loadedFile) {
                setFactorData(loadedFile.factors)
                setFactorConnectionData(loadedFile.connections)
                setUniqueCreationNumber(loadedFile.idGen)
                setFactorEvals(loadedFile.factorEvals)
                setFactorConnectionEvals(loadedFile.factorConnectionEvals)
                setObjectData(loadedFile.objectData)
            }
            setFiles(null)
        }
    }, [files])
    return (
        <>
            <EditorSidebar

                factorData={factorData}
                factorConnectionData={factorConnectionData}
                projectId={projectId}
                setOpenRename={setOpenRename}
                handleChange={handleChange}
                addFactor={addFactor}
                currentWindow={currentWindow}
                setCurrentWindow={setCurrentWindow}
                EDITOR_WINDOWS={EDITOR_WINDOWS}
                isSubMap={isSubMap}
                closeASubMap={closeASubMap}
                exportFile={exportFile}
                saveFile={saveFile}
                setObjectData={setObjectData}
                addField={addField}
                addObject={addObject}

                currentFEditor={currentFEditor}
                setCurrentFEditor={setCurrentFEditor}
                currentFСEditor={currentFСEditor}
                setCurrentFСEditor={setCurrentFСEditor}

                factorEvals={factorEvals}

                objectData={objectData}
                currentAnalysisObject={currentAnalysisObject}
                setCurrentAnalysisObject={setCurrentAnalysisObject}
            />
            <div
                id="editor"
                onClick={() => {
                    setCurrentConnectId(null)
                }}
                ref={editorAreRef}
                className={`editorArea sc overflow-scroll w-full h-screen relative z-0 flex ${currentWindow === EDITOR_WINDOWS.GRAPH || currentWindow === EDITOR_WINDOWS.ANALYSIS ? "flex" : "hidden"}`}>

                <div className={`w-full h-full transparent ${currentWindow === EDITOR_WINDOWS.GRAPH || currentWindow === EDITOR_WINDOWS.ANALYSIS ? "flex" : "hidden"} ${currentWindow === EDITOR_WINDOWS.ANALYSIS ? " pointer-events-none" : ""}`}>
                    <Xwrapper>
                        {factorData.map((factor, index) =>
                            <FactorObject
                                factorEvals={factorEvals}
                                currentWindow={currentWindow}
                                currentAnalysisObject={currentAnalysisObject}
                                factorData={factor}
                                factorIndex={index}
                                openASubMap={openASubMap}
                                isSubMap={isSubMap}
                                currentConnectId={currentConnectId}
                                setCurrentConnectId={setCurrentConnectId}
                                changeFactorData={(newFactorData) => changeFactorData(index, newFactorData)}
                                removeFactorData={() => removeFactor(index)}
                                addFactorConnection={addFactorConnection}
                                addIndicator={addIndicator}
                                editIndicator={editIndicator}
                                removeIndicator={removeIndicator}
                                setIndicatorChoiceOpen={setIndicatorChoiceOpen}
                                setIndicatorChoiceId={setIndicatorChoiceId}
                                setIndicatorInfMenuOpen={setIndicatorInfMenuOpen}
                                setCurrentFInddicatorIndex={setCurrentFInddicatorIndex}
                                setCurrentInddicatorIndex={setCurrentInddicatorIndex}
                            />)}
                        {factorConnectionData.map((factorConnection, index) =>
                            <>
                                <Xarrow
                                    start={factorConnection.start}
                                    end={factorConnection.end}
                                    headSize={4}
                                    strokeWidth={3}
                                    labels={<LineEditor
                                        setModalOpen={(value) => {
                                            if (value) {
                                                setCurrentFactorConIndex(index)
                                            }
                                            setIndicatorMenuOpen(value)
                                        }}
                                        removeFunction={() => removeFactorConnection(index)}
                                        changeFunction={(newInfluence) => changeFactorConnectionInfluence(index, newInfluence)}
                                        influence={setEvalInfluence(factorConnection)} />}
                                    color="rgb(147 197 253)" />
                            </>
                        )}
                    </Xwrapper>
                </div>

            </div >
            <div
                className={`${currentWindow === EDITOR_WINDOWS.OBJECTS ? "flex w-full sc overflow-scroll" : "hidden"}`}>
                <ObjectEditor
                    objectData={objectData}
                    setObjectData={setObjectData}
                    factorEvals={factorEvals}
                    setFactorEvals={setFactorEvals}
                    factorConnectionEvals={factorConnectionEvals}
                    setFactorConnectionEvals={setFactorConnectionEvals}
                />
            </div>
            <div
                className={`${currentWindow === EDITOR_WINDOWS.FACTORS ? "flex sc overflow-scroll " : "hidden"}`}>
                <FactorEditor
                    factorData={factorData}
                    setFactorData={setFactorData}
                    objectData={objectData}
                    setObjectData={setObjectData}
                    currentFEditor={currentFEditor}
                    setCurrentFEditor={setCurrentFEditor}
                    factorConnectionData={factorConnectionData}
                    factorEvals={factorEvals}
                    setFactorEvals={setFactorEvals}
                    factorConnectionEvals={factorConnectionEvals}
                    setFactorConnectionEvals={setFactorConnectionEvals}
                />
            </div>
            <div
                className={`${currentWindow === EDITOR_WINDOWS.CONNECTIONS ? "flex" : "hidden"}`}>
                <FactorConnectionEditor
                    factorData={factorData}
                    setFactorData={setFactorData}
                    objectData={objectData}
                    setObjectData={setObjectData}
                    currentFEditor={currentFEditor}
                    setCurrentFEditor={setCurrentFEditor}
                    currentFСEditor={currentFСEditor}
                    factorConnectionData={factorConnectionData}
                    factorEvals={factorEvals}
                    setFactorEvals={setFactorEvals}
                    factorConnectionEvals={factorConnectionEvals}
                    setFactorConnectionEvals={setFactorConnectionEvals}
                    changeFactorConnectionInfluence={changeFactorConnectionInfluence}
                    setFactorConnectionData={setFactorConnectionData}
                />
            </div>
            <EditorMenu
                saveFile={saveFile}
                openRename={openRename}
                setOpenRename={setOpenRename}
                projectName={projectName}
                setProjectName={setProjectName}
            />
            <IndicatorChoiceList
                modalOpen={indicatorChoiceOpen}
                setModalOpen={setIndicatorChoiceOpen}
                indicatorChoiceId={indicatorChoiceId}
                objectData={objectData}
                addIndicator={addIndicator}
            />
            <IndicatorInfMenu
                modalOpen={indicatorInfMenuOpen}
                setModalOpen={setIndicatorInfMenuOpen}
                influence={factorData[currentFIndicatorIndex]?.indicators[currentIndicatorIndex]?.coef}
                setInfluence={(newCoef) => {
                    editIndicator(factorData[currentFIndicatorIndex].id, currentIndicatorIndex, { coef: newCoef })
                }} />
            <IndicatorMenu
                modalOpen={indicatorMenuOpen}
                setModalOpen={setIndicatorMenuOpen}
                influence={factorConnectionData[currentFactorConIndex]?.influence}
                setInfluence={(newInfluence) => changeFactorConnectionInfluence(currentFactorConIndex, newInfluence)} />
            <DataMenu dataOpen={dataOpen} setDataOpen={setDataOpen} />
        </>
    )
}

export default EditorArea 