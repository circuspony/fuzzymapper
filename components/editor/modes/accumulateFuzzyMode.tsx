import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import EvalTable from "./evalTable"
import MembershipMode from "./membershipMode"
import backendAxios from '../../network/backend'
import { combineArrays, combineArrays2 } from '../../utils'
import { rule } from "postcss"

const MEMBERSHIP = {
    TRIANGLE: 0,
    TRAPEZOID: 1
}

const OUTLIER = {
    NO_OUTLIER: 0,
    LOW_OUTLIER: 1,
    HIGH_OUTLIER: 2
}

const FuzzyMode = ({
    factorData,
    factorConnectionData,
    objectData,
    terms,
    setTerms,
    factor,
    factorEvals,
    setFactorEvals,
    termNames, setTermNames }) => {
    const getFactorById = (id) => {
        return factorData.filter(f => f !== null).find(f => f.id === id)
    }

    useEffect(() => {
        setStep(1)
        setFunctionSets([])
    }, [factor])

    const [step, setStep] = useState(1);
    const [readyFunctionSets, setFunctionSets] = useState([]);
    const [outlier, setOutlier] = useState(false);
    const [lowOutlier, setLowOutlier] = useState("Малый выброс");
    const [highOutlier, setHighOutlier] = useState("Большой выброс");

    const checkExternalEvals = () => {
        let exconnected = factorConnectionData.filter(fc => fc.end === factor.id).filter(fc => getFactorById(fc.start).isExternal)
        let exeval = factorConnectionData.filter(fc => fc.end === factor.id).filter(fc => factorData.filter(f => f !== null).find(fd => fd.id === fc.start).isExternal).filter(fc => {
            const i = factorEvals.findIndex(fe => fe.id === fc.start)
            return i >= 0
        })
        return exconnected.length === exeval.length
    }

    const generateTriFunc = (start, end, terms) => {
        let delta = (parseFloat(end.toFixed(6)) - parseFloat(start.toFixed(6))) / (terms - 1)
        let functionSets = []
        for (let i = 0; i < terms; i++) {
            if (i === 0) {
                let a = start
                let b = start
                let c = (start + delta) > end ? end : start + delta
                functionSets.push([parseFloat(a.toFixed(5)), parseFloat(b.toFixed(5)), parseFloat(c.toFixed(5))])
                continue
            }
            if (i === terms - 1) {
                let a = start + (i - 1) * delta
                let b = end
                let c = end
                functionSets.push([parseFloat(a.toFixed(5)), parseFloat(b.toFixed(5)), parseFloat(c.toFixed(5))])
                continue
            }
            let a = (start + (i - 1) * delta) < start ? start : start + (i - 1) * delta
            let b = start + i * delta
            let c = (start + (i + 1) * delta) > end ? end : start + (i + 1) * delta
            functionSets.push([parseFloat(a.toFixed(5)), parseFloat(b.toFixed(5)), parseFloat(c.toFixed(5))])

        }

        return functionSets
    }
    const generateTraFunc = (start, end, terms) => {
        let delta = (end - start) / (terms - 1)
        let functionSets = []
        for (let i = 0; i < terms; i++) {
            if (i === 0) {
                let a = start
                let b = start
                let c = start + delta / 4
                let d = (start + 3 * delta / 4) > end ? end : start + 3 * delta / 4
                functionSets.push([parseFloat(a.toFixed(5)), parseFloat(b.toFixed(5)), parseFloat(c.toFixed(5)), parseFloat(d.toFixed(5))])
                continue
            }
            if (i === terms - 1) {
                let a = start + (i - 3 / 4) * delta
                let b = start + (i - 1 / 4) * delta
                let c = end
                let d = end
                functionSets.push([parseFloat(a.toFixed(5)), parseFloat(b.toFixed(5)), parseFloat(c.toFixed(5)), parseFloat(d.toFixed(5))])

                continue
            }
            let a = (start + (i - 3 / 4) * delta) < start ? start : start + (i - 3 / 4) * delta
            let b = start + (i - 1 / 4) * delta
            let c = start + (i + 1 / 4) * delta
            let d = (start + (i + 3 / 4) * delta) > end ? end : start + (i + 3 / 4) * delta
            functionSets.push([parseFloat(a.toFixed(5)), parseFloat(b.toFixed(5)), parseFloat(c.toFixed(5)), parseFloat(d.toFixed(5))])
        }
        return functionSets
    }



    const createStandardFunctionSets = (objectDataNew) => {

        let object = objectDataNew[0]
        let indicatorsMaxMin = [{ name: "Предсказание", coef: 1, outlier: outlier, max: Math.max(...object.values.filter(v => v.outlier === OUTLIER.NO_OUTLIER || !outlier).map(v => v.value)), min: Math.min(...object.values.filter(v => v.outlier === OUTLIER.NO_OUTLIER || !outlier).map(v => v.value)) }]
        let stFunctionSets = indicatorsMaxMin.map(indicator => {
            let o = objectDataNew[0]
            return { ...indicator, functionSets: generateTriFunc(indicator.min, indicator.max, terms), values: o.values, ol15: o.ol15, oh15: o.oh15, ol30: o.ol30, oh30: o.oh30 }
        })
        return stFunctionSets
    }

    const getExternalEvalSets = async () => {

        const response = await backendAxios.post("/outlier", {
            data: [[{ title: "Предсказания", key: false, values: predictions.map((p, pi) => { return { key: pi, value: p, outlier: OUTLIER.NO_OUTLIER } }) }]]
        })
        let standardSets = createStandardFunctionSets(response.data.objectSet[0])
        standardSets = standardSets.map(s => ({ ...s, title: "Стандратная", type: MEMBERSHIP.TRIANGLE, external: false }))

        setFunctionSets(standardSets)

        setStep(3)
    }


    const getEval = async () => {
        const response = await backendAxios.post("/fuzzy", {
            data: readyFunctionSets
        })
        const newEval = {
            id: factor.id,
            outlier: outlier,
            eLabels: outlier ? [lowOutlier, ...termNames, highOutlier] : termNames,
            labels: response.data.evals.map(e => e.mv)
        }
        let feCopy = [...factorEvals]
        let index = feCopy.findIndex(fe => fe.id === factor.id)
        if (index >= 0) {
            feCopy[index] = newEval
        }
        else {
            feCopy.push(newEval)
        }
        setFactorEvals(feCopy)
    }


    const [rulebase, setRulebase] = useState([]);
    const generateRules = () => {
        let newrulebase = []
        let allCombos = []
        let neededEvals = []
        const currentInputs = factorConnectionData.filter(fc => fc.end === factor.id).map(fc => { return { ...fc, name: factorData.find(f => fc.start === f.id).name } })
        currentInputs.forEach(ci => {
            let feval = factorEvals.find(fe => fe.id === ci.start)
            neededEvals.push(feval.eLabels)
        })

        allCombos = combineArrays(neededEvals).map(combo => combo.split("++").slice(0, -1))

        newrulebase = allCombos.map(combo => {
            let rule = {
                combo: combo
            }
            let text = "ЕСЛИ "
            for (let ci = 0; ci < combo.length; ci++) {
                text = text + currentInputs[ci].name + "=" + combo[ci] + " "
                if (ci !== combo.length - 1) {
                    text = text + "И "
                }
            }
            let evals = combo.map((c, ci) => {
                if (currentInputs[ci].fcEval.length > 1) {
                    let feval = factorEvals.find(fe => fe.id === currentInputs[ci].start)
                    let neededIndex = feval.eLabels.findIndex(e => e === c)
                    return currentInputs[ci].fcEval[neededIndex]
                }
                else {
                    return currentInputs[ci].fcEval[0]
                }
            })
            text = text + "TO " + factor.name + "=" + evals.map((x, xi) => (x / evals.reduce((a, b) => a + b, 0)).toFixed(4) + "*X" + xi).join('+')
            rule["text"] = text
            rule["evals"] = evals
            return rule
        })
        setRulebase(newrulebase)
    }
    const [predictions, setPredictions] = useState([]);

    const generatePredictions = async () => {
        const newData = []
        const currentInputs = factorConnectionData.filter(fc => fc.end === factor.id).map(fc => { return { ...fc, name: factorData.find(f => fc.start === f.id).name } })
        currentInputs.forEach(ci => {
            let feval = factorEvals.find(fe => fe.id === ci.start)
            let fdata = factorData.find(f => f.id === ci.start)

            fdata = {
                ...fdata, fevals: feval.labels, labels: feval.eLabels, indicators: fdata.indicators.filter(i => i !== null).map(i => {
                    return { ...i, values: objectData.find(o => o.title === i.name).values }
                })
            }
            newData.push(fdata)
        })
        const response = await backendAxios.post("/accumulation", {
            data: newData,
            icombos: combineArrays2(newData.map(nd => nd.indicators)),
            rulebase
        })
        setPredictions(response.data.predictions)

    }

    return (
        <>
            <div
                onClick={() => {
                    generateRules()
                }}
                className={`h-16 mt-2  w-20 justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                Сгенерировать правила
            </div>


            {rulebase.length ?
                <>
                    <div className="text-lg mt-4 font-bold mb-1">Сгенерированния база правил</div>
                    <div>{rulebase.map(r => <div>{r.text}</div>)}</div>
                    <div
                        onClick={() => {
                            generatePredictions()
                        }}
                        className={`h-16 mt-2  w-20 justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                        Получить предсказания
                    </div>
                </>
                : null}
            {predictions.filter(i => i !== null).length && checkExternalEvals() ? <>
                <div className="text-lg mt-4 font-bold mb-1">Параметры</div>
                <span>Число термов</span>
                <input
                    value={terms}
                    onChange={(e) => {
                        setTerms(e.target.value.length ? parseInt(e.target.value) > 1 ? parseInt(e.target.value) : 2 : 2)

                    }}
                    style={{
                        outline: "none",
                    }}
                    className={`text-xl p-1 w-20 border-2 border-violet-border rounded-xl bg-violet`}
                />

                <div className="flex items-center mt-2 ">
                    <div
                        onClick={() => {
                            setOutlier(!outlier)
                        }}
                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${outlier ? "bg-blue-500" : ""}`}></div>
                    <span>Обработать выбросы</span>
                </div>
                <div
                    onClick={() => {
                        setTermNames(Array.from(Array(terms).keys()))
                        setLowOutlier("Меньше 0")
                        setHighOutlier("Больше " + (terms - 1))
                        setStep(2)
                    }}
                    className={`h-16 mt-2  w-20 justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                    Принять
                </div>
            </> : <>
                {/* Не хватает данных для расчета
                {checkExternalEvals() ? <></> : <div>Есть внешние факторы, которые не были оценены</div>} */}
            </>}
            {step >= 2 ?
                <>
                    <span className="mt-2">Имена термов</span>
                    {termNames.map((t, i) =>
                        <input
                            key={"tinput" + i}
                            value={t}
                            onChange={(e) => {
                                let newTermNames = [...termNames]
                                newTermNames[i] = e.target.value
                                setTermNames(newTermNames)

                            }}
                            style={{
                                outline: "none",
                            }}
                            className={`text-xl  w-20 mt-2 p-1 border-2 border-violet-border rounded-xl bg-violet`}
                        />
                    )}

                    {outlier ? <>
                        <span className="mt-2">Имена категорий выбросов</span>
                        <input
                            key={"lotinput"}
                            value={lowOutlier}
                            onChange={(e) => {
                                setLowOutlier(e.target.value)

                            }}
                            style={{
                                outline: "none",
                            }}
                            className={`text-xl  w-20 mt-2 p-1 border-2 border-violet-border rounded-xl bg-violet`}
                        />
                        <input
                            key={"hotinput"}
                            value={highOutlier}
                            onChange={(e) => {
                                setHighOutlier(e.target.value)
                            }}
                            style={{
                                outline: "none",
                            }}
                            className={`text-xl  w-20 mt-2 p-1 border-2 border-violet-border rounded-xl bg-violet`}
                        />
                    </> : <></>}
                    <div
                        onClick={async () => {
                            await getExternalEvalSets()
                        }}
                        className={`h-16 mt-2  w-20 justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                        Принять
                    </div>
                </>
                : <></>}
            {step >= 3 ?
                <>
                    <div className="text-lg mt-4 font-bold">Функции принадлежности</div>
                    {
                        readyFunctionSets.map((fs, fsi) =>
                            <>
                                <MembershipMode
                                    functionSets={fs}
                                    generateTriFunc={generateTriFunc}
                                    generateTraFunc={generateTraFunc}
                                    changeFs={(functionSet) => {
                                        let newFunctionSets = [...readyFunctionSets]
                                        newFunctionSets[fsi] = functionSet
                                        setFunctionSets(newFunctionSets)
                                    }}
                                />
                            </>)
                    }
                    <div
                        onClick={() => {
                            setStep(4)
                            getEval()
                        }}
                        className={`h-16 mt-2  w-20 justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                        Рассчитать оценку
                    </div>
                </>
                : <></>}
            <div className="mb-4"></div>

        </>
    )
}

export default FuzzyMode 