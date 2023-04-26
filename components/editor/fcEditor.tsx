import { useEffect, useState, useRef } from "react"
import ModalOverlay from "../layout/modalOverlay"
import ClusterMode from "./modes/clusterMode"
import FuzzyMode from "./modes/fuzzyMode"
import IndicatorAnalysis from "./modes/indicatorAnalysis"
import RegressionMode from "./modes/regressionMode"
import ClusterComparison from "./modes/clusterComparison"
import AccumulatorMode from "./modes/accumulatorMode"
import ExpertMode from "./modes/expertMode"
import { fchmod } from "fs"

const METHODS = {
    REGRESSION: 0,
    CLUSTERING: 1,
    ACCUMULATOR: 2,
    EXPERT: 3,
}

const FactorConnectionEditor = ({
    factorData,
    setFactorData,
    objectData,
    setObjectData,
    currentFEditor,
    setCurrentFEditor,
    currentFСEditor,
    factorConnectionData,
    factorEvals,
    setFactorEvals,
    factorConnectionEvals,
    setFactorConnectionEvals,
    changeFactorConnectionInfluence,
    setFactorConnectionData
}) => {
    const [method, setMethod] = useState(null);
    const [currentEval, setCurrentEval] = useState([]);

    const getFactorById = (id) => {
        return factorData.filter(f => f !== null).find(f => f.id === id)
    }
    const updateExpertEvals = () => {
        if (getFactorById(factorConnectionData[currentFСEditor].start)?.labels) {
            let expertEvals = new Array(factorEvals.find(fe => fe.id === getFactorById(factorConnectionData[currentFСEditor].start).id).eLabels.length).fill(0)
            setCurrentEval(expertEvals)
        }
        else {
            setCurrentEval([1])
        }
    }
    useEffect(() => {
        setMethod(null)
        setCurrentEval([])
    }, [currentFСEditor])

    const trace = (fe) => {
        let wayFound = false
        let ways = [[factorConnectionData[currentFСEditor].start, factorConnectionData[currentFСEditor].end]]
        while (!wayFound) {
            let newWays = []
            for (let way of ways) {
                let beginNodes = factorConnectionData.filter(fc => fc.start === way[way.length - 1])
                for (let ends of beginNodes) {
                    if (ends.end === fe.id) {
                        wayFound = true
                    }
                    let newWay = [...way, ends.end]
                    newWays.push(newWay)
                }
            }
            ways = newWays
        }
        return ways

    }


    const setEval = (ev) => {
        changeFactorConnectionInfluence(currentFСEditor, "?", ev)
    }
    const setChainEvals = (ev, fe) => {
        const currentTrace = trace(fe)
        let neededTrace = currentTrace.find(t => t[t.length - 1] === fe.id)
        let top = ev
        let factorConnectionDataNew = [...factorConnectionData]
        for (let t = neededTrace.length - 1; t > 0; t--) {
            let neededTraceIndex = factorConnectionData.findIndex(fc => fc.start === neededTrace[t - 1] && fc.end === neededTrace[t])
            let num = 1
            if (t !== neededTrace.length - 1) {
                num = ev / top
            }
            else {
                if (factorConnectionData[neededTraceIndex].fcEval.filter(f => !Number.isNaN(f)).length) {
                    if (Math.abs(factorConnectionData[neededTraceIndex].fcEval[0]) < Math.abs(ev)) {
                        top = ev
                        num = top
                    }
                    else {
                        top = factorConnectionData[neededTraceIndex].fcEval[0]
                        num = top
                    }
                }
                else {
                    top = ev
                    num = top
                }
                num = top
            }
            if (factorConnectionData[neededTraceIndex].fcEval.filter(f => !Number.isNaN(f)).length) {
                if (Math.abs(factorConnectionData[neededTraceIndex].fcEval[0]) < Math.abs(num) || t === 1) {
                    factorConnectionDataNew = factorConnectionDataNew.map((fc, fci) => {
                        if (fci === neededTraceIndex) {
                            return { ...fc, fcEval: [num] }
                        }
                        return fc
                    })
                }
            }
            else {
                factorConnectionDataNew = factorConnectionDataNew.map((fc, fci) => {
                    if (fci === neededTraceIndex) {
                        return { ...fc, fcEval: [num] }
                    }
                    return fc
                })
            }

        }
        setFactorConnectionData(factorConnectionDataNew)
    }
    return (
        <>
            {factorConnectionData.filter(f => f !== null).length && getFactorById(factorConnectionData[currentFСEditor]?.start) ?
                <>
                    <div className="flex-col px-8 text-black ">
                        <div className="text-black mt-4 text-2xl font-bold mb-2">{"Связь '" + getFactorById(factorConnectionData[currentFСEditor]?.start)?.name + " - " + getFactorById(factorConnectionData[currentFСEditor].end).name + "'"}</div>
                        <div className="mt-2">{getFactorById(factorConnectionData[currentFСEditor]?.start).isExternal ? "Данная связь показывает влияние внешнего фактора на управляемый. Вы можете оценить его методом кластеризации или назначить оценку вручную." : "Выберите метод оценки данной связи, вы можете настроить статистическую оценку или назначить оценку вручную."}</div>
                        <div className="text-lg mt-4 font-bold mb-1">Метод оценки связи</div>
                        <div className="flex text-lg">
                            <div className="flex items-center">
                                <div
                                    onClick={() => {
                                        setMethod(METHODS.REGRESSION)
                                    }}
                                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.REGRESSION ? "bg-violet" : ""}`}></div>
                                <span>Регрессия</span>
                            </div>
                            <div className="flex  ml-2 items-center">
                                <div
                                    onClick={() => {
                                        setMethod(METHODS.CLUSTERING)
                                    }}
                                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.CLUSTERING ? "bg-green-500" : ""}`}></div>
                                <span>Кластеризация</span>
                            </div>
                            {/* <div className="flex ml-2 items-center">
                                <div
                                    onClick={() => {
                                        updateExpertEvals()
                                        setMethod(METHODS.ACCUMULATOR)
                                    }}
                                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.ACCUMULATOR ? "bg-blue-500" : ""}`}></div>
                                <span>Аккумуляция</span>
                            </div> */}
                            <div className="flex ml-2 items-center">
                                <div
                                    onClick={() => {
                                        updateExpertEvals()
                                        setMethod(METHODS.EXPERT)
                                    }}
                                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.EXPERT ? "bg-blue-500" : ""}`}></div>
                                <span>Эксперт</span>
                            </div>

                        </div>
                        {method === METHODS.REGRESSION ? <>
                            <RegressionMode
                                setEval={setEval}
                                objectData={objectData}
                                factorEvals={factorEvals}
                                factorS={getFactorById(factorConnectionData[currentFСEditor].start)}
                                factorE={getFactorById(factorConnectionData[currentFСEditor].end)}
                            />
                        </> : null}
                        {method === METHODS.CLUSTERING ? <>
                            <ClusterComparison
                                setEval={setEval}
                                objectData={objectData}
                                factorEvals={factorEvals}
                                factorS={getFactorById(factorConnectionData[currentFСEditor].start)}
                                factorE={getFactorById(factorConnectionData[currentFСEditor].end)}
                            />
                        </> : null}

                        {method === METHODS.ACCUMULATOR ? <>
                            <AccumulatorMode
                                setEval={setChainEvals}
                                objectData={objectData}
                                factorData={factorData}
                                factorS={getFactorById(factorConnectionData[currentFСEditor].start)}
                            />
                        </> : null}
                        {method === METHODS.EXPERT ?
                            <ExpertMode
                                factorEvals={factorEvals}
                                factorS={getFactorById(factorConnectionData[currentFСEditor].start)}
                                currentEval={currentEval}
                                setCurrentEval={setCurrentEval}
                                setEval={setEval}
                            />
                            : null
                        }
                        {factorConnectionData[currentFСEditor].fcEval.length ?
                            <>
                                <div className="text-lg  font-bold items-center flex mt-4">Оценки влияния</div>
                                <div className="text-lg items-center flex pb-8">{factorConnectionData[currentFСEditor].fcEval.map(fe => fe.toFixed(4)).join(", ")}</div>


                            </>
                            : null

                        }
                        <div className="h-20"></div>
                    </div>

                </> :
                <div className="px-8 text-black mt-4 text-2xl font-medium mb-2">Нет связей</div>}

        </>
    )
}

export default FactorConnectionEditor 