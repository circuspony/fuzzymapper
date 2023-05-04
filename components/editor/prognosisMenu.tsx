import { useEffect, useState, useRef, use } from "react"
import ModalOverlay from "../layout/modalOverlay"
import backendAxios from '../network/backend'

const PrognosisMenu = ({ factorEvals, modalOpen, setModalOpen, factorConnectionData, factorData, currentPrognosisObject, objectData }) => {
    const [currentFactor, setCurrentFactor] = useState(0);
    const [prognosis, setPrognosis] = useState([]);
    const getObjectName = (index) => {
        let filtered = objectData.filter(f => f.key || f.date === true)
        if (filtered.length) {
            return filtered.reduce(
                (a, c) => {
                    return a + " " + c.values[index]
                },
                ""
            );
        }
        return index
    }
    const [indIn, setIndIn] = useState([]);
    useEffect(() => {
        setIndIn([])
        setPrognosis([])
    }, [currentFactor, modalOpen])

    const getOnePrognosis = async () => {
        let allFound = false
        let thisFactor = factorData.filter(f => f !== null)[currentFactor]
        var connect = factorConnectionData.find(fc => fc?.start === thisFactor.id)
        let researchFactors = [thisFactor]
        let researchConnnections = []

        while (!allFound) {
            if (connect != undefined) {
                researchConnnections.push(connect)
            }
            else {
                allFound = true
                break
            }
            let thisFactor = factorData.filter(f => f !== null).find(f => f?.id == connect?.end)
            connect = factorConnectionData.find(fc => fc?.start === thisFactor.id)
            researchFactors.push(thisFactor)
        }
        let resultChange = indIn
        let resultPrognosis = []

        for (let fci = 0; fci < researchConnnections.length; fci++) {
            let fsi = researchFactors[fci].indicators.filter(i => i !== null).map((io, ii) => ({ ...io, values: objectData.find(o => o.title === io.name).values, change: resultChange.find(ind => ind?.name === io.name)?.change }))
            let fei = researchFactors[fci + 1].indicators.filter(i => i !== null).map((io, ii) => ({ ...io, values: objectData.find(o => o.title === io.name).values }))
            const response = await backendAxios.post("/pcaprognosis", {
                data: {
                    connection: researchConnnections[fci],
                    indIn: resultChange,
                    currentPrognosisObject: currentPrognosisObject,
                    fsi: fsi,
                    fei: fei,
                    iv: factorEvals.find(fe => fe.id === researchFactors[fci].id).labels,
                }
            })
            resultPrognosis.push({
                in: researchFactors[fci],
                out: researchFactors[fci + 1],
                newValues: response.data.newValues,
                oldCountY: response.data.oldCountY,
                newCountY: response.data.newCountY,

            })
            let percentageChange = 100 * (response.data.newCountY - response.data.oldCountY) / response.data.oldCountY
            resultChange = researchFactors[fci + 1].indicators.filter(i => i !== null).map((io, ii) => ({ ...io, change: percentageChange }))
        }
        console.log(resultPrognosis)
        setPrognosis(resultPrognosis)
    }

    return (
        <ModalOverlay classes="flex" modalOpen={modalOpen} setModalOpen={setModalOpen}>

            <div className="my-auto flex mx-auto p-8 w-4/6 border-2 border-violet border-dotted bg-violet-light rounded-xl">
                <div className="flex-col w-4/5 text-black">
                    <div className="text-violet-border text-2xl font-bold mb-2">
                        Прогнозирование
                    </div>
                    <div className="text-violet-border  font-bold mb-2">
                        {"Фактор: " + factorData.filter(f => f !== null)[currentFactor]?.name}
                    </div>
                    <div className="text-violet-border  font-bold mb-2">
                        {"Объект: " + getObjectName(currentPrognosisObject)}
                    </div>
                    <div className="mt-2 font-bold mb-1">Индикаторы выходного фактора</div>
                    {factorData.filter(f => f !== null)[currentFactor]?.indicators.filter(i => i !== null).map((i) =>
                        <>
                            <div className="flex mt-2">
                                <div
                                    onClick={() => {
                                        if (indIn.find(ii => ii.name == i.name)) {
                                            setIndIn(indIn.filter(ii => ii.name != i.name))
                                        }
                                        else {
                                            setIndIn([...indIn, { ...i, change: 0 }])

                                        }
                                    }}
                                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${indIn.find(ii => ii.name == i.name) ? "bg-green-500" : ""}`}></div>

                                <div className="ml-2 my-auto">{i.name}</div>
                            </div>
                        </>
                    )}
                    {indIn.length ?
                        <div className="mt-2 font-bold mb-1">Показатели объекта</div>
                        : null}
                    {factorData.filter(f => f !== null)[currentFactor]?.indicators.filter(i => i !== null).map((i) =>
                        <>
                            {indIn.find(ii => ii.name == i.name) ? <>
                                <div className="flex mt-2">
                                    <div className="">{i.name + "(текущее значание): "}</div>

                                    <div className="ml-1 ">
                                        {objectData.find(o => o.title === i.name)?.values[currentPrognosisObject]}
                                    </div>

                                </div>
                                <div className="flex">
                                    <div className="">{"Изменить значение на "}</div>

                                    <input
                                        value={indIn.find(ii => ii.name == i.name)?.change}
                                        onChange={(e) => {
                                            setIndIn(indIn.map(inc => {
                                                if (inc.name === i.name) {
                                                    return { ...inc, change: e.target.value }
                                                }
                                                return inc
                                            }))
                                        }}
                                        style={{
                                            outline: "none",
                                        }}
                                        className={`ml-2 w-5 border-violet border-b-2 bg-violet-light`}
                                    />
                                    <div className="ml-1">{"процентов"}</div>

                                </div>
                            </> : null}

                        </>
                    )}
                    {indIn.length && factorConnectionData.find(fc => fc?.start === factorData.filter(f => f !== null)[currentFactor].id)?.fcEval.length ?

                        <div
                            onClick={() => {
                                getOnePrognosis()
                            }}
                            className={` h-16 mt-2  w-20 justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                            Получить прогноз
                        </div>
                        :
                        <div className="mt-2">Не хватает индикаторов или связей</div>
                    }
                    {prognosis.length ?
                        <div className="flex flex-col">
                            <div className="text-violet-border text-2xl mt-4 font-bold mb-2">
                                Результаты прогноза для объекта
                            </div>
                            {prognosis.map((p, pi) =>
                                <div className="flex flex-col">
                                    <div className="mt-2 font-bold mb-1">{"Шаг " + (pi + 1) + ": влияние " + p.in.name + " на " + p.out.name}</div>
                                    {p.in.indicators.map((indi, indii) =>
                                        <div className="flex">
                                            <div>{"Изменение " + indi.name + " с " + parseFloat(objectData.find(o => o.title === indi.name)?.values[currentPrognosisObject]).toFixed(3) + " до " + parseFloat(p.newValues[indii]).toFixed(3)}</div>
                                            <div className="font-bold ml-2">{"(" + (100 * (p.newValues[indii] - objectData.find(o => o.title === indi.name)?.values[currentPrognosisObject]) / objectData.find(o => o.title === indi.name)?.values[currentPrognosisObject]).toFixed(3) + "%)"}</div>

                                        </div>)}

                                    <div className="flex">
                                        <div>{"Меняет общую оценку фактора " + p.out.name + " с " + parseFloat(p.oldCountY).toFixed(3) + " до " + parseFloat(p.newCountY).toFixed(3)}</div>
                                        <div className="font-bold ml-2">{"(" + (100 * (p.newCountY - p.oldCountY) / p.oldCountY).toFixed(3) + "%)"}</div>
                                    </div>

                                </div>
                            )}
                        </div> : null
                    }
                </div>
                <div className="py-4 flex flex-col w-2/6 bg-violet-dark rounded-md">
                    <div
                        className="mx-auto mt-1 font-medium"
                    >
                        Список факторов
                    </div>
                    <div style={{ overflowY: "scroll" }} className="sc flex-col">

                        {factorData.filter(f => f !== null).map((obj, oi) =>
                            <div
                                onClick={() => { setCurrentFactor(oi) }}
                                className="ml-2 text-sm items-center flex mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                            >
                                <div className={`h-4 w-4 mr-2 rounded-md ${oi === currentFactor ? "bg-yellow-500" : "bg-violet"}`}></div>

                                <span>{obj.name}</span>
                            </div>
                        )}
                    </div>
                </div>



            </div>
        </ModalOverlay>
    )
}

export default PrognosisMenu 