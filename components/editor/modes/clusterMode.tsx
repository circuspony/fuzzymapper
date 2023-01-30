import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import EvalTable from "./evalTable"
import backendAxios from '../../network/backend'
const CMETH = {
    CM: "CM",
    GK: "GK"
}

const ClusterMode = ({
    objectData,
    clusters,
    setClusters,
    factor,
    factorEvals,
    setFactorEvals, }) => {
    const [outlier, setOutlier] = useState(false);
    const [cmethod, setCmethod] = useState(CMETH.CM);

    const formatEvalsWithIndicatorsClusters = (labels, indicators) => {
        let newLabels = labels.map(label => {
            let iv = indicators.filter(i => i !== null).map(i => Math.abs(i.coef))
            let lv = label.map(l => {
                let max = -100
                iv.forEach(i => {
                    const min = Math.min(parseFloat(i), l)
                    if (min >= max) {
                        max = min
                    }
                })
                return max

            })
            return lv
        })
        return newLabels
    }

    const getClusters = async () => {
        let fi = factor?.indicators.filter(i => i !== null)
        let data = []
        fi.filter(i => i !== null).forEach(indicator => {
            let feildObj = objectData.find(field => field.title === indicator.name)
            data.push(feildObj.values)
        });
        const response = await backendAxios.post("/clusters", {
            clusters: clusters,
            data: data,
            outlier: outlier,
            cmethod: cmethod
        })
        const updateData = {
            id: factor.id,
            outlier: outlier,
            labels: formatEvalsWithIndicatorsClusters(response.data.labels, factor.indicators),
            centers: response.data.centers,
            eLabels: outlier ? ["Меньшие выбросы", ...Array.from(Array(clusters).keys()), "Большие выбросы"] : Array.from(Array(clusters).keys())
        }
        let newFactorEvals = [...factorEvals]
        let findex = newFactorEvals.findIndex((f) => f.id === factor.id)
        if (findex >= 0) {
            newFactorEvals[findex] = { ...newFactorEvals[findex], ...updateData }
            setFactorEvals(newFactorEvals)
        }
        else {
            newFactorEvals.push({ ...updateData })
            setFactorEvals(newFactorEvals)
        }
    }


    return (
        <>
            <div className="text-lg mt-4 font-bold mb-1">Метод</div>
            <div className="flex text-lg">
                <div className="flex items-center">
                    <div
                        onClick={() => {
                            setCmethod(CMETH.CM)
                        }}
                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${cmethod === CMETH.CM ? "bg-green-400" : ""}`}></div>
                    <span>C-средние</span>
                </div>
                <div className="flex ml-2 items-center">
                    <div
                        onClick={() => {
                            setCmethod(CMETH.GK)
                        }}
                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${cmethod === CMETH.GK ? "bg-green-400" : ""}`}></div>
                    <span>ГК</span>
                </div>
            </div>
            <div className="text-lg mt-4 font-bold mb-1">Параметры</div>
            <span>Число кластеров</span>
            <input
                value={clusters}
                onChange={(e) => {
                    setClusters(e.target.value.length ? parseInt(e.target.value) > 1 ? parseInt(e.target.value) : 2 : 2)
                }}
                style={{
                    outline: "none",
                }}
                className={`text-xl p-1 w-20 border-2 border-violet-border rounded-xl bg-violet`}
            />
            {factor?.indicators.filter(i => i !== null).length ? <>
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
                        getClusters()
                    }}
                    className={`h-16 mt-2  w-20 justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                    Рассчитать
                </div>
            </> : <>Не хватает данных для расчета</>}
            {factorEvals.findIndex((f) => f.id === factor.id) >= 0 ?
                <>
                    <div className="text-lg mt-4 font-bold mb-1">Центры полученных кластеров</div>
                    {factorEvals.find((f) => f.id === factor.id).centers.map(f => <>
                        <div>{f.join(", ")}</div>
                    </>)}
                    <div className="text-lg mt-4 font-bold mb-1">Назначьте названия кластеров</div>
                    {factorEvals.find((f) => f.id === factor.id).eLabels.map((f, i) => <>
                        <input
                            key={"finput" + i}
                            value={f}
                            onChange={(e) => {
                                let findex = factorEvals.findIndex((f) => f.id === factor.id)
                                let newFactorEvals = [...factorEvals]
                                newFactorEvals[findex].eLabels[i] = e.target.value
                                setFactorEvals(newFactorEvals)

                            }}
                            style={{
                                outline: "none",
                            }}
                            className={`text-xl  w-20 mt-2 p-1 border-2 border-violet-border rounded-xl bg-violet`}
                        />
                    </>)}
                </> :
                <>
                </>}
        </>
    )
}

export default ClusterMode 