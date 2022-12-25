import { useEffect, useState, useRef } from "react"
import ModalOverlay from "../layout/modalOverlay"
import ClusterMode from "./modes/clusterMode"
import FuzzyMode from "./modes/fuzzyMode"
import IndicatorAnalysis from "./modes/indicatorAnalysis"
import RegressionMode from "./modes/regressionMode"
import ClusterComparison from "./modes/clusterComparison"

const METHODS = {
    REGRESSION: 0,
    CLUSTERING: 1,
    EXPERT: 2,
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
    changeFactorConnectionInfluence
}) => {

    const getFactorById = (id) => {
        return factorData.filter(f => f !== null).find(f => f.id === id)
    }
    const updateExpertEvals = () => {
        if (getFactorById(factorConnectionData[currentFСEditor].start).isExternal) {
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
    const [method, setMethod] = useState(null);
    const [currentEval, setCurrentEval] = useState([]);

    const setEval = (ev) => {
        changeFactorConnectionInfluence(currentFСEditor, "?", ev)
    }
    const setRegEval = (ev) => {
        changeFactorConnectionInfluence(currentFСEditor, "?", [ev])
    }

    return (
        <>
            {factorConnectionData.filter(f => f !== null).length ?
                <>
                    <div className="flex-col px-8 text-black ">
                        <div className="text-black mt-4 text-2xl font-bold mb-2">{"Связь '" + getFactorById(factorConnectionData[currentFСEditor].start).name + " - " + getFactorById(factorConnectionData[currentFСEditor].end).name + "'"}</div>
                        <div className="mt-2">{getFactorById(factorConnectionData[currentFСEditor].start).isExternal ? "Данная связь показывает влияние внешнего фактора на управляемый. Вы можете оценить его методом кластеризации или назначить оценку вручную." : "Выберите метод оценки данной связи, вы можете настроить статистическую оценку или назначить оценку вручную."}</div>
                        <div className="text-lg mt-4 font-bold mb-1">Метод оценки связи</div>
                        <div className="flex text-lg">
                            {
                                !getFactorById(factorConnectionData[currentFСEditor].start).isExternal ?
                                    <div className="flex items-center">
                                        <div
                                            onClick={() => {
                                                setMethod(METHODS.REGRESSION)
                                            }}
                                            className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.REGRESSION ? "bg-violet" : ""}`}></div>
                                        <span>Регрессия</span>
                                    </div>
                                    :
                                    <div className="flex items-center">
                                        <div
                                            onClick={() => {
                                                setMethod(METHODS.CLUSTERING)
                                            }}
                                            className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${method === METHODS.CLUSTERING ? "bg-green-500" : ""}`}></div>
                                        <span>Кластеризация</span>
                                    </div>}
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
                                setRegEval={setRegEval}
                                objectData={objectData}
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
                        {method === METHODS.EXPERT ?
                            <div className="flex-col mt-4">
                                {getFactorById(factorConnectionData[currentFСEditor].start).isExternal ?
                                    <>
                                        {
                                            factorEvals.findIndex(fe => fe.id === getFactorById(factorConnectionData[currentFСEditor].start).id) >= 0 ?
                                                <>
                                                    <div className="text-lg mt-4 font-bold mb-1">Ввести оценку</div>
                                                    {
                                                        factorEvals.find(fe => fe.id === getFactorById(factorConnectionData[currentFСEditor].start).id).eLabels.map((fe, fi) =>
                                                            <>
                                                                <div>{"Кластер " + fe}</div>
                                                                <input
                                                                    value={currentEval[fi]}
                                                                    onChange={(e) => {
                                                                        setCurrentEval(currentEval.map((ce, ci) => {
                                                                            if (ci === fi) {
                                                                                return e.target.value
                                                                            }
                                                                            return ce
                                                                        }))

                                                                    }}
                                                                    style={{
                                                                        outline: "none",
                                                                    }}
                                                                    className={`text-xl p-1 w-20 border-2 border-violet-border rounded-xl bg-violet`}
                                                                />
                                                            </>)

                                                    }
                                                </> :
                                                <div>Не хватает данных для расчета</div>
                                        }
                                    </> :
                                    <>
                                        <div className="text-lg mt-4 font-bold mb-1">Ввести оценку</div>
                                        <input
                                            value={currentEval[0]}
                                            onChange={(e) => {
                                                setCurrentEval(currentEval.map((ce, ci) => {
                                                    if (ci === 0) {
                                                        return parseFloat(e.target.value)
                                                    }
                                                    return ce
                                                }))

                                            }}
                                            style={{
                                                outline: "none",
                                            }}
                                            className={`text-xl p-1 w-20 border-2 border-violet-border rounded-xl bg-violet`}
                                        />
                                    </>}

                                <div
                                    onClick={() => {
                                        setEval(currentEval)
                                    }}
                                    className={`h-16 mt-2  w-20 justify-center relative noselect z-40 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                                    Принять
                                </div>
                            </div> : null
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