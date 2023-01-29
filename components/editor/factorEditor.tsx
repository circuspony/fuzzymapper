import { useEffect, useState, useRef } from "react"
import ModalOverlay from "../layout/modalOverlay"
import ClusterMode from "./modes/clusterMode"
import FuzzyMode from "./modes/fuzzyMode"
import AccumulateFuzzyMode from "./modes/accumulateFuzzyMode"
import IndicatorAnalysis from "./modes/indicatorAnalysis"
import EvalTable from "./modes/evalTable"

const METHODS = {
    CLUSTERING: 0,
    FUZZY: 1,
    ACCUMULATOR: 2
}

const FactorEditor = ({
    factorData,
    setFactorData,
    objectData,
    setObjectData,
    currentFEditor,
    setCurrentFEditor,
    factorConnectionData,
    factorEvals,
    setFactorEvals,
    factorConnectionEvals,
    setFactorConnectionEvals }) => {
    const changeFactorData = (factorIndex, newFactorData) => {
        const searched = getFilteredfactorData()[factorIndex]
        setFactorData(factorData.map((factorData, index) => {
            if (factorData === null) {
                return factorData
            }
            if (searched.id === factorData.id) {
                return { ...factorData, ...newFactorData }
            }
            return factorData
        }))
    }
    const getFactorById = (id) => {
        return factorData.filter(f => f !== null).find(f => f.id === id)
    }
    const [method, setMethod] = useState(null);
    // CLUSTERS
    const [clusters, setClusters] = useState(2);
    // FUZZY
    const [terms, setTerms] = useState(2);
    const [termNames, setTermNames] = useState([]);

    const getFilteredfactorData = () => {
        return factorData.filter(f => f !== null)
    }
    useEffect(() => { setMethod(null) }, [currentFEditor])
    return (
        <>
            {getFilteredfactorData().length ?
                <>
                    <div className="flex-col w-2/4 px-8 text-black ">
                        <div className="text-black mt-4 text-2xl font-bold mb-2">{getFilteredfactorData()[currentFEditor]?.name}</div>
                        <div className="flex-col">
                            {factorConnectionData.filter(fc => fc.start === getFilteredfactorData()[currentFEditor].id).length ?
                                <>
                                    <div className="text-lg mt-4 font-bold mb-1">Влияет на другие факторы</div>
                                    {factorConnectionData.filter(fc => fc.start === getFilteredfactorData()[currentFEditor].id).map((f, i) =>
                                        <>
                                            <span className="ml-2">{getFactorById(f.end).name}</span>
                                        </>
                                    )}
                                </> :
                                <></>}
                            {factorConnectionData.filter(fc => fc.end === getFilteredfactorData()[currentFEditor]?.id).length ?
                                <>
                                    <div className="text-lg mt-4 font-bold mb-1">Под влиянием других факторов</div>
                                    {factorConnectionData.filter(fc => fc.end === getFilteredfactorData()[currentFEditor]?.id).map((f, i) =>
                                        <>
                                            <span className="ml-2">{getFactorById(f.start).name}</span>
                                        </>
                                    )}
                                </> :
                                <></>}
                            {getFilteredfactorData()[currentFEditor]?.indicators.filter(i => i !== null).length ?
                                <>
                                    <div className="text-lg mt-4 font-bold mb-1">Связан с индикторами</div>
                                    {getFilteredfactorData()[currentFEditor]?.indicators.filter(i => i !== null).map((i) =>
                                        <>
                                            <div className="ml-2">{i.name + " (" + i.coef + ")"}</div>
                                        </>
                                    )}
                                </> :
                                <></>}
                            <div className="text-lg mt-4 font-bold mb-1">Вид фактора</div>
                            <div className="flex text-lg">
                                <div className="flex items-center">
                                    <div
                                        onClick={() => {
                                            changeFactorData(currentFEditor, { isExternal: true })
                                            setFactorEvals(factorEvals.filter(fe => fe.id != getFilteredfactorData()[currentFEditor]?.id))
                                        }}
                                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${getFilteredfactorData()[currentFEditor]?.isExternal ? "bg-green-500" : ""}`}></div>
                                    <span>Внешний</span>
                                </div>
                                <div className="flex ml-2 items-center">
                                    <div
                                        onClick={() => {
                                            changeFactorData(currentFEditor, { isExternal: false })
                                            setFactorEvals(factorEvals.filter(fe => fe.id != getFilteredfactorData()[currentFEditor]?.id))

                                        }}
                                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${!getFilteredfactorData()[currentFEditor]?.isExternal ? "bg-violet" : ""}`}></div>
                                    <span>Управляемый</span>
                                </div>
                            </div>
                            {getFilteredfactorData()[currentFEditor]?.isExternal ?
                                <div className="flex flex-col sc">
                                    <div className="text-lg mt-4 font-bold mb-1">Метод оценки</div>
                                    <div className="flex text-lg">
                                        <div className="flex items-center">
                                            <div
                                                onClick={() => {
                                                    setMethod(method === METHODS.CLUSTERING ? null : METHODS.CLUSTERING)
                                                }}
                                                className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.CLUSTERING ? "bg-blue-500" : ""}`}></div>
                                            <span>Кластеризация</span>
                                        </div>
                                    </div>
                                    {method === METHODS.CLUSTERING ?
                                        <>
                                            <ClusterMode
                                                objectData={objectData}
                                                clusters={clusters}
                                                setClusters={setClusters}
                                                factor={getFilteredfactorData()[currentFEditor]}
                                                factorEvals={factorEvals}
                                                setFactorEvals={setFactorEvals} />
                                        </>
                                        : <></>}
                                </div>
                                : <></>

                            }
                            {!getFilteredfactorData()[currentFEditor]?.isExternal ?
                                <div className="flex flex-col">
                                    <div className="text-lg mt-4 font-bold mb-1">Метод оценки</div>
                                    <div className="flex">
                                        <div className="flex text-lg">
                                            <div className="flex items-center">
                                                <div
                                                    onClick={() => {
                                                        setMethod(method === METHODS.FUZZY ? null : METHODS.FUZZY)
                                                    }}
                                                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.FUZZY ? "bg-red-500" : ""}`}></div>
                                                <span>Фаззификация</span>
                                            </div>
                                        </div>
                                        {/* <div className="ml-2 flex text-lg">
                                            <div className="flex items-center">
                                                <div
                                                    onClick={() => {
                                                        setMethod(method === METHODS.ACCUMULATOR ? null : METHODS.ACCUMULATOR)
                                                    }}
                                                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.ACCUMULATOR ? "bg-blue-500" : ""}`}></div>
                                                <span>Аккумуляция</span>
                                            </div>
                                        </div> */}
                                    </div>
                                    {method === METHODS.FUZZY ?
                                        <>
                                            <FuzzyMode
                                                objectData={objectData}
                                                factorData={factorData}
                                                factorConnectionData={factorConnectionData}
                                                terms={terms}
                                                setTerms={setTerms}
                                                termNames={termNames}
                                                setTermNames={setTermNames}
                                                factor={getFilteredfactorData()[currentFEditor]}
                                                factorEvals={factorEvals}
                                                setFactorEvals={setFactorEvals} />
                                        </>
                                        : <></>}

                                    {method === METHODS.ACCUMULATOR ?
                                        <>
                                            <AccumulateFuzzyMode
                                                objectData={objectData}
                                                factorData={factorData}
                                                factorConnectionData={factorConnectionData}
                                                terms={terms}
                                                setTerms={setTerms}
                                                termNames={termNames}
                                                setTermNames={setTermNames}
                                                factor={getFilteredfactorData()[currentFEditor]}
                                                factorEvals={factorEvals}
                                                setFactorEvals={setFactorEvals} />
                                        </>
                                        : <></>}
                                </div>
                                : <></>

                            }
                            {factorEvals.findIndex((f) => f.id === getFilteredfactorData()[currentFEditor]?.id) >= 0 ?
                                <>
                                    <div className="text-lg mt-4 font-bold mb-1">Получена оценка</div>
                                    <EvalTable
                                        objectData={objectData}
                                        indicators={getFilteredfactorData()[currentFEditor].indicators}
                                        needIndicators={false}
                                        fEval={factorEvals.find((f) => f.id === getFilteredfactorData()[currentFEditor].id)}
                                    />
                                </> : null
                            }
                        </div>
                    </div>
                    <IndicatorAnalysis objectData={objectData} indicators={getFilteredfactorData()[currentFEditor]?.indicators} />
                </> :
                <div className="px-8 text-black mt-4 text-2xl font-medium mb-2">Нет факторов</div>}
        </>
    )
}

export default FactorEditor 