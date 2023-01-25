import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import EvalTable from "./evalTable"
import MembershipMode from "./membershipMode"
import backendAxios from '../../network/backend'

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

        let indicators = factor?.indicators.filter(i => i !== null)
        let indicatorsMaxMin = indicators.map((indicator, index) => {
            let object = objectDataNew.find(o => o.title === indicator.name)
            return { ...indicator, outlier: outlier, max: Math.max(...object.values.filter(v => v.outlier === OUTLIER.NO_OUTLIER || !outlier).map(v => v.value)), min: Math.min(...object.values.filter(v => v.outlier === OUTLIER.NO_OUTLIER || !outlier).map(v => v.value)) }
        })

        let stFunctionSets = indicatorsMaxMin.map(indicator => {
            let o = objectDataNew.find(o => o.title === indicator.name)
            return { ...indicator, functionSets: generateTriFunc(indicator.min, indicator.max, terms), values: o.values, ol15: o.ol15, oh15: o.oh15, ol30: o.ol30, oh30: o.oh30 }
        })
        return stFunctionSets
    }

    const getExternalEvalSets = async () => {
        let objectsIndexed = objectData.map(o => ({ ...o, values: o.values.map((v, i) => ({ key: i, value: v, outlier: OUTLIER.NO_OUTLIER })) }))
        let exconnected = factorConnectionData.filter(fc => fc.end === factor.id).filter(fc => getFactorById(fc.start).isExternal)
        let exevals = factorEvals.filter(fd => exconnected.findIndex(ex => ex.start === fd.id) >= 0)
        if (exevals.length) {
            let evalSet = []
            let objectsWithExt = []

            for (let ei = 0; ei < exevals.length; ei++) {
                let ev = exevals[ei]
                for (let li = 0; li < ev.eLabels.length; li++) {
                    let l = ev.eLabels[li]
                    let newArray = objectsIndexed.map(o => ({
                        ...o, values: o.values.filter((v, i) => {
                            return ev.labels[i][li] > 0
                        })
                    })).map(o => ({ ...o, values: o.values.map((v, i) => ({ ...v, eval: ev.labels[v.key][li] })) }))
                    if (newArray[0].values.length) {
                        objectsWithExt.push({
                            l: l,
                            ev: ev,
                            array: newArray
                        })
                    }
                }
            }
            const response = await backendAxios.post("/outlier", {
                data: objectsWithExt.map(owe => owe.array)
            })
            objectsWithExt = objectsWithExt.map((owe, i) => { return { ...owe, array: response.data.objectSet[i] } })
            for (let owe of objectsWithExt) {
                console.log(owe)

                let newSet = createStandardFunctionSets(owe.array)

                newSet = newSet.map(s => ({ ...s, title: getFactorById(owe.ev.id).name + " " + owe.l, type: MEMBERSHIP.TRIANGLE, external: true }))
                evalSet = [...evalSet, ...newSet]
            }
            // for (let ei = 0; ei < exevals.length; ei++) {
            //     let ev = exevals[ei]
            //     let evalLabels = ev.labels.map(l => {
            //         let max = Math.max(...l)
            //         return l.indexOf(max)
            //     })
            //     for (let li = 0; li < ev.eLabels.length; li++) {
            //         let l = ev.eLabels[li]
            //         // let newArray = objectsIndexed.map(o => ({ ...o, values: o.values.filter((v, i) => evalLabels[i] == li) })).map(o => ({ ...o, values: o.values.map((v, i) => ({ ...v, eval: ev.labels[i][li] })) }))
            //         let newArray = objectsIndexed.map(o => ({
            //             ...o, values: o.values.filter((v, i) => {
            //                 return ev.labels[i][li] > 0
            //             })
            //         })).map(o => ({ ...o, values: o.values.map((v, i) => ({ ...v, eval: ev.labels[v.key][li] })) }))

            //     }

            //     // ev.eLabels.forEach(async (l, li) => {
            //     //     // let newArray = objectsIndexed.map(o => ({ ...o, values: o.values.filter((v, i) => evalLabels[i] == li) })).map(o => ({ ...o, values: o.values.map((v, i) => ({ ...v, eval: ev.labels[i][li] })) }))
            //     //     let newArray = objectsIndexed.map(o => ({
            //     //         ...o, values: o.values.filter((v, i) => {
            //     //             return ev.labels[i][li] > 0
            //     //         })
            //     //     })).map(o => ({ ...o, values: o.values.map((v, i) => ({ ...v, eval: ev.labels[v.key][li] })) }))

            //     //     let newSet = await createStandardFunctionSets(newArray)

            //     //     newSet = newSet.map(s => ({ ...s, title: getFactorById(ev.id).name + " " + l, type: MEMBERSHIP.TRIANGLE, external: true }))
            //     //     evalSet = [...evalSet, ...newSet]
            //     // })
            // }

            setFunctionSets(evalSet)
        }
        else {

            const response = await backendAxios.post("/outlier", {
                data: [objectsIndexed]
            })
            let standardSets = createStandardFunctionSets(response.data.objectSet[0])
            standardSets = standardSets.map(s => ({ ...s, title: "Стандратная", type: MEMBERSHIP.TRIANGLE, external: false }))
            setFunctionSets(standardSets)
        }
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
    return (
        <>
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
            {factor?.indicators.filter(i => i !== null).length && checkExternalEvals() ? <>

                <div className="flex items-center mt-2 ">
                    <div
                        onClick={() => {
                            setOutlier(!outlier)
                        }}
                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${outlier ? "bg-blue-500" : ""}`}></div>
                    <span>Учесть выбросы</span>
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
            </> : <>Не хватает данных для расчета
                {checkExternalEvals() ? <></> : <div>Есть внешние факторы, которые не были оценены</div>}
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