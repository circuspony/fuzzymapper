import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import backendAxios from '../../network/backend'

const CMETH = {
    CM: "CM",
    GK: "GK"
}
const ClusterComparison = ({ setEval, objectData, factorEvals, factorS, factorE }) => {
    const [clusters, setClusters] = useState(2);
    const [matrix, setMatrix] = useState([]);
    const [outlier, setOutlier] = useState(false);
    const [negative, setNegative] = useState(false);
    const [result, setResult] = useState([]);
    const [centers, setCenters] = useState([]);
    const [standard, setStandard] = useState(false);

    useEffect(() => {
        setClusters(2)
        setMatrix([])
        setResult([])
        setCenters([])
    }, [factorE, factorS])

    const getClusters = async () => {
        let fi = factorE?.indicators.filter(i => i !== null)
        let fsi = factorS?.indicators.filter(i => i !== null)
        let data = []
        let datafs = []
        fi.forEach(indicator => {
            let feildObj = objectData.find(field => field.title === indicator.name)
            data.push(feildObj.values)
        });
        fsi.forEach(indicator => {
            let feildObj = objectData.find(field => field.title === indicator.name)
            datafs.push(feildObj.values)
        });
        const response1 = await backendAxios.post("/clusters", {
            clusters: clusters,
            data: data,
            outlier: outlier,
            standard: standard,
            cmethod: cmethod
        })
        setCenters(response1.data.centers)
        // const responsePCA = await backendAxios.post("/pca", {
        //     data: {
        //         fsi: datafs,
        //         fei: data,
        //         reverseX: false,
        //         reverseY: false,
        //     }
        // })
        const response2 = await backendAxios.post("/clustercomp", {
            clusters: clusters,
            data: {
                iv: factorEvals.find(fe => fe.id === factorS.id).labels,
                ov: response1.data.labels
            }
        })
        setMatrix(response2.data.matrix)
        setResult(response2.data.result)
        setEval(response2.data.result.map(r => negative ? -r : r))
    }
    const [cmethod, setCmethod] = useState(CMETH.CM);
    console.log(centers)
    return (
        <>
            <div className="text-lg mt-4 font-bold mb-1">Метод кластеризации</div>
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
            <div className="text-lg mt-4 font-bold mb-1">Количество кластеров для выходного фактора</div>
            <input
                value={clusters}
                onChange={(e) => {
                    setClusters(parseInt(e.target.value))
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

            <div className="flex items-center mt-2 ">
                <div
                    onClick={() => {
                        setStandard(!standard)
                    }}
                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${standard ? "bg-cyan-500" : ""}`}></div>
                <span>Масштабировать</span>
            </div>
            {/* <div className="flex items-center mt-2 ">
                <div
                    onClick={() => {
                        setNegative(!negative)
                    }}
                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${negative ? "bg-black" : ""}`}></div>
                <span>Негативное влияние</span>
            </div> */}

            {factorS?.indicators.filter(i => i !== null).length && factorE?.indicators.filter(i => i !== null).length && factorEvals.find(fe => fe.id === factorS.id)?.labels ?
                <div
                    onClick={() => {
                        getClusters()
                    }}
                    className={`h-16 mt-2  w-20 justify-center relative noselect z-40 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                    Получить оценку
                </div>
                : <></>}

            {matrix.length ?
                <div className="flex-col">
                    <div className="text-lg mt-4 font-bold mb-1">Центры полученных кластеров</div>
                    {centers?.map((f, i) => <>
                        <div>
                            <span className="font-medium mr-2">{"Кластер " + (1 + i) + ": "}</span>
                            {f.map(el => el.toFixed(5)).join(", ")}</div>
                    </>)}
                    <div className="text-lg mt-4 font-bold mb-1">Таблица сравнений кластеров</div>

                    <div className="flex">
                        <div className="font-bold items-center flex w-40 h-full">Кластер</div>
                        {
                            matrix[0].map((_, i) =>
                                <div className="font-bold items-center flex w-40 h-full">{"Кластер " + (1 + i)}</div>

                            )
                        }
                        <div className="font-bold items-center flex w-40 h-full">Оценка</div>
                    </div>
                    {matrix?.map((m, mi) =>
                        <div className="flex">
                            <div className="items-center font-medium flex w-40 h-full">{factorEvals?.find(fe => fe.id === factorS.id)?.eLabels[mi]}</div>
                            {
                                m.map((mm) =>
                                    <div className="items-center flex w-40 h-full">{mm.toFixed(4)}</div>

                                )
                            }
                            <div className="items-center flex w-40 h-full">{result[mi]?.toFixed(4)}</div>
                        </div>
                    )}
                </div> : null
            }
        </>
    )
}

export default ClusterComparison 