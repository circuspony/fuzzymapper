import { useEffect, useState, useRef } from "react"
import Draggable from 'react-draggable';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import IndicatorObject from './indicatorObject'
import LineEditor from "./lineEditor";

const FactorObject = ({
    factorData,
    factorEvals,
    currentWindow,
    currentAnalysisObject,
    factorIndex,
    isSubMap,
    changeFactorData,
    removeFactorData,
    currentConnectId,
    setCurrentConnectId,
    addFactorConnection,
    addIndicator,
    editIndicator,
    removeIndicator,
    openASubMap,
    setIndicatorChoiceOpen,
    setIndicatorChoiceId,
    setIndicatorInfMenuOpen,
    setCurrentFInddicatorIndex,
    setCurrentInddicatorIndex,

}) => {
    if (factorData === null) return null
    const { id } = factorData
    const textAreaRef = useRef(null)
    const factorRef = useRef(null)
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(55)

    const [inputInfo, setInputInfo] = useState("");
    const [inputActive, setInputActive] = useState(false)
    const [indicatorActive, setIndicatorActive] = useState(false)

    useEffect(() => {
        setHeight(textAreaRef.current.scrollHeight)
    }, [inputInfo])
    useEffect(() => {
        setInputInfo(factorData.name)
    }, [factorData])

    const updateXarrow = useXarrow()

    const [isHovered, setIsHovered] = useState(false);

    const getEvalString = () => {
        let fe = factorEvals?.find(fe => fe.id === factorData.id)
        let fev = Math.max(...fe.labels[currentAnalysisObject])
        let fei = fe.labels[currentAnalysisObject].indexOf(fev)
        let str = fe.eLabels[fei] + " (" + fev.toFixed(4) + ")"
        return str
    }

    return (
        <>
            <Draggable
                defaultPosition={factorData.position}
                handle=".handle"
                onDrag={updateXarrow} onStop={updateXarrow}
            >
                <div
                    id={id}
                    ref={factorRef}
                    onClick={(event) => {
                        event.stopPropagation()
                        if (currentConnectId !== null) {
                            addFactorConnection(currentConnectId, id)
                        }
                    }}
                    onMouseEnter={() => { setIsHovered(true) }}
                    onMouseLeave={() => { setIsHovered(false) }}
                    style={{ width: width, minHeight: height + 12 }}
                    className={`absolute flex-col  z-30 text-sm items-center flex cursor-pointer text-white  font-medium ${id === currentConnectId ? "bg-yellow-500" : currentConnectId !== null ? factorData.isExternal ? "bg-green-500 hover:bg-yellow-400" : "bg-violet hover:bg-yellow-400" : factorData.isExternal ? "bg-green-500" : "bg-violet"} border-2 border-dotted border-violet-border rounded-3xl top-28 left-0 mx-auto right-0 ${!inputActive && !indicatorActive ? "handle" : ""}`}>
                    {/* {factorData?.submap?.factors?.length ?
                        <div
                            onClick={() => {
                                openASubMap(id)
                            }}
                            className={`absolute bottom-0 right-2 text-3xl text-violet-border`}>
                            ⭖
                        </div>
                        :
                        <></>} */}
                    <div className={`w-full flex items-center absolute transition-all duration-700 -bottom-10 ${isHovered ? "opacity-100" : "opacity-0"}`}>

                        <div
                            onClick={() => {
                                setInputActive(true)
                                textAreaRef.current.focus()
                            }}
                            className={`transition-all duration-300 text-3xl text-blue-300 hover:text-violet-dark`}>✎</div>
                        <div
                            onClick={() => {
                                setCurrentConnectId(id)
                            }}
                            className={`transition-all duration-300 text-3xl text-blue-300 hover:text-violet-dark`}>➜</div>
                        <div
                            onClick={() => {
                                setIndicatorChoiceId(id)
                                setIndicatorChoiceOpen(true)
                            }}
                            className={`ml-1 transition-all duration-300 text-3xl text-blue-300 hover:text-violet-dark`}>
                            Ⓘ
                        </div>
                        {/* {!isSubMap ?
                            <div
                                onClick={() => {
                                    openASubMap(id)
                                }}
                                className={`ml-1 transition-all duration-300 text-3xl text-blue-300 hover:text-violet-dark`}>
                                ⭖
                            </div>
                            : <></>
                        } */}
                        <div
                            onClick={removeFactorData}
                            className={`ml-auto transition-all duration-300 text-3xl text-red-300 hover:text-violet-dark`}>🗑</div>
                    </div>
                    <textarea
                        ref={textAreaRef}
                        value={inputInfo}
                        spellCheck={false}
                        onChange={(e) => {
                            setInputInfo(e.target.value)
                            setHeight(0)
                        }}
                        style={{
                            outline: "none",
                            resize: "none",
                            height: (height) ? height + 'px' : 'auto',
                            minHeight: '40px'
                        }}
                        onBlur={() => {
                            setInputActive(false)
                            changeFactorData({ name: inputInfo })
                        }}
                        className={`bg-transparent overflow-hidden border-0 p-4 pb-0 ${currentWindow === "analysis" ? "pb-8" : ""} rounded-3xl ${inputActive ? "" : "pointer-events-none"}`}
                    />
                    <div style={{ minHeight: "1rem" }} className=" text-xs font-bold w-full pt-1.5 pb-3 bottom-0 px-3">

                        {currentWindow === "analysis" && factorEvals.findIndex(fe => fe.id === factorData.id) >= 0 ?
                            <span className="">{getEvalString()}</span>

                            : <div style={{ minHeight: "12px" }} className=""></div>
                        }
                    </div>
                    {factorData.indicators.map((indicatorData, indicatorIndex) =>
                        <>
                            <IndicatorObject
                                indicatorIndex={indicatorIndex}
                                id={"indicator" + id + indicatorIndex}
                                indicatorData={indicatorData}
                                inactivate={() => setIndicatorActive(false)}
                                activate={() => setIndicatorActive(true)}
                                edit={(value) => editIndicator(id, indicatorIndex, value)}
                                remove={() => removeIndicator(id, indicatorIndex)}
                            />
                            {indicatorData ?
                                <Xarrow
                                    start={"indicator" + id + indicatorIndex}
                                    end={id}
                                    strokeWidth={2}
                                    labels={<LineEditor
                                        setModalOpen={(value) => {
                                            if (value) {
                                                setCurrentInddicatorIndex(indicatorIndex)
                                                setCurrentFInddicatorIndex(factorIndex)
                                            }
                                            setIndicatorInfMenuOpen(value)
                                        }}
                                        remove={false}
                                        edit={true}
                                        removeFunction={null}
                                        changeFunction={null}
                                        influence={indicatorData.coef} />}
                                    dashness
                                    showHead={false}
                                    color="rgb(147 197 253)" />
                                : <></>}
                        </>
                    )}
                </div>
            </Draggable>

        </>
    )
}

export default FactorObject 