import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import backendAxios from '../../network/backend'
import RegressionCard from "./regressionCard"


const RegressionMode = ({ objectData, factorS, setEval, factorData }) => {
    const [step, setStep] = useState(1);
    const [regressions, setRegressions] = useState([]);
    const [mainReg, setMainReg] = useState(null);
    const [indIn, setIndIn] = useState([]);
    const [indOut, setIndOut] = useState([]);
    const [reverseX, setReverseX] = useState(false);
    const [reverseY, setReverseY] = useState(false);
    const [outlier, setOutlier] = useState(false);
    const [factorE, setFactorE] = useState(null);


    useEffect(() => {
        setStep(1)
        setRegressions([])
        setMainReg(null)
        setIndIn([])
        setIndOut([])
    }, [factorS])


    useEffect(() => {
        setReverseX(false)
        setReverseY(false)
    }, [indIn, indOut])

    const getRegressions = async () => {
        let fsi = factorS.indicators.filter(i => i !== null).map((io, ii) => ({ ...io, values: objectData.find(o => o.title === io.name).values }))
        let fei = factorE.indicators.filter(i => i !== null).map((io, ii) => ({ ...io, values: objectData.find(o => o.title === io.name).values }))
        const response = await backendAxios.post("/regression", {
            data: {
                fsi: fsi,
                fei: fei,
                outlier: outlier
            }
        })
        setRegressions(response.data.regressions)
        setIndIn(fsi)
        setIndOut(fei)
    }
    const getRegressionEval = async () => {
        let fsi = indIn.filter(i => i !== null).map((io, ii) => (objectData.find(o => o.title === io.name).values))
        let fei = indOut.filter(i => i !== null).map((io, ii) => (objectData.find(o => o.title === io.name).values))
        const response = await backendAxios.post("/pca", {
            data: {
                fsi: fsi,
                fei: fei,
                reverseX,
                reverseY,
                outlier: outlier
            }
        })
        setMainReg(response.data.regression)
        setStep(3)
    }

    const acceptReg = () => {
        setEval(Math.min(1, mainReg.b), factorE)
    }
    return (
        <>
            <div className="text-black flex-col">
                <div className="text-lg mt-4 font-bold mb-1">Анализ данных</div>
                {factorS?.indicators.length ? <>
                    <div className="mt-2">Выберите выходной фактор</div>
                    <div className="mt-2">
                        {factorData.filter(f => f !== null && f?.indicators.length && f.id !== factorS.id).map((f) => {
                            return <div className="flex ml-2 items-center">
                                <div
                                    onClick={() => {
                                        if (factorE?.id === f.id) {
                                            setFactorE(null)
                                        }
                                        else {
                                            setFactorE(f)
                                        }
                                    }}
                                    className={`h-8 w-8 my-1 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${factorE?.id === f.id ? "bg-blue-500" : ""}`}></div>
                                <span>{f.name}</span>
                            </div>
                        })}
                    </div>
                    {factorE ? <>
                        <div className="mt-2">Рассмотрите информацию об отношениях индикаторов и сделайте выводы о необходимости включения индикаторов в оценку</div>
                        <div className="text-lg mt-4 font-bold mb-1">Индикаторы входного фактора</div>
                        {factorS?.indicators.filter(i => i !== null).map((i) =>
                            <>
                                <div className="ml-2">{i.name + " (" + i.coef + ")"}</div>
                            </>
                        )}
                        <div className="text-lg mt-4 font-bold mb-1">Индикаторы выходного фактора</div>
                        {factorE?.indicators.filter(i => i !== null).map((i) =>
                            <>
                                <div className="ml-2">{i.name + " (" + i.coef + ")"}</div>
                            </>
                        )}
                        {factorS?.indicators.filter(i => i !== null).length && factorE?.indicators.filter(i => i !== null).length ?
                            <>
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
                                        setStep(2)
                                        getRegressions()
                                    }}
                                    className={`h-16 mt-2  w-20 justify-center relative noselect z-40 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                                    Рассчитать
                                </div>
                            </>
                            : null}
                    </> : <></>}

                </> :
                    <div className="mt-2">У входного фактора нет индикаторов, аккумуляция невозможна</div>

                }
                {step >= 2 ?
                    <>
                        <div className="text-lg mt-4 font-bold mb-1">Получены регрессии</div>
                        <div className="w-full pr-8 grid grid-cols-2">
                            {regressions.map(r =>
                                <RegressionCard
                                    regression={r}
                                />
                            )}
                        </div>
                        <div className="text-lg mt-4 font-bold mb-1">Выберите значимые индикаторы</div>
                        <div className="mt-4 font-bold mb-1">Индикаторы входного фактора</div>
                        {factorS?.indicators.filter(i => i !== null).map((i) =>
                            <>
                                <div className="flex mt-2">
                                    <div
                                        onClick={() => {
                                            if (indIn.find(ii => ii.name == i.name)) {
                                                setIndIn(indIn.filter(ii => ii.name != i.name))
                                            }
                                            else {
                                                setIndIn([...indIn, i])

                                            }
                                        }}
                                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${indIn.find(ii => ii.name == i.name) ? "bg-green-500" : ""}`}></div>

                                    <div className="ml-2">{i.name}</div>
                                </div>
                            </>
                        )}
                        <div className="mt-2 font-bold mb-1">Индикаторы выходного фактора</div>
                        {factorE?.indicators.filter(i => i !== null).map((i) =>
                            <>
                                <div className="flex mt-2">
                                    <div
                                        onClick={() => {
                                            if (indOut.find(ii => ii.name == i.name)) {
                                                setIndOut(indOut.filter(ii => ii.name != i.name))
                                            }
                                            else {
                                                setIndOut([...indOut, i])

                                            }
                                        }}
                                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${indOut.find(ii => ii.name == i.name) ? "bg-green-500" : ""}`}></div>

                                    <div className="ml-2">{i.name}</div>
                                </div>
                            </>
                        )}
                        {indIn.length && indOut.length ?
                            <div
                                onClick={() => {
                                    getRegressionEval()
                                }}
                                className={`h-16 mt-2  w-20 justify-center relative noselect z-40 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                                Получить оценку
                            </div>
                            : null}

                    </> : null
                }
                {
                    step >= 3 && mainReg ?
                        <>
                            <div className="text-lg text-violet-border mt-2 font-bold mb-1">Результат анализа</div>
                            <RegressionCard
                                regression={mainReg}
                                title={false}
                            />
                            <div className="flex items-center">
                                <div
                                    onClick={() => {
                                        setReverseX(!reverseX)
                                    }}
                                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${reverseX ? "bg-green-500" : ""}`}></div>

                                <div className="ml-2">{"Обратить по X"}</div>

                                <div
                                    onClick={() => {
                                        setReverseY(!reverseY)
                                    }}
                                    className={`ml-2 h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${reverseY ? "bg-green-500" : ""}`}></div>

                                <div className="ml-2">{"Обратить по Y"}</div>

                            </div>
                            <div className="flex">


                                <div
                                    onClick={() => {
                                        acceptReg()
                                    }}
                                    className={`h-16 mt-2 w-20 justify-center relative noselect z-40 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                                    Принять оценку
                                </div>

                            </div>
                        </> : null
                }
            </div>
        </>
    )
}

export default RegressionMode 