import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import backendAxios from '../../network/backend'


const IndicatorAnalysis = ({ objectData, indicators }) => {
    const [corr, setCorr] = useState([]);

    useEffect(() => { setCorr([]) }, [indicators])

    const getAnalysis = async () => {
        let fi = indicators.filter(i => i !== null)
        let data = []
        fi.forEach(indicator => {
            let feildObj = objectData.find(field => field.title === indicator.name)
            data.push(feildObj.values)
        });
        const response = await backendAxios.post("/correlations", {
            fields: fi.map(f => f.name),
            data: data
        })
        setCorr(response.data.corr)
    }

    return (
        <>
            <div className="text-black w-2/4 pr-8 ml-10 flex-col">
                <div className="text-lg text-violet-border mt-4 font-bold mb-1 mt-16">Анализ индикаторов</div>
                <div>Данный модуль предназначен для анализа взаимозвязей индикаторов для более точного определения коэффициента соответствия индикатора фактору.</div>

                {indicators?.filter(i => i !== null).length > 1 ? <>
                    <div
                        onClick={() => {
                            getAnalysis()
                        }}
                        className={`h-16 mt-2  w-20 justify-center relative noselect z-40 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                        Рассчитать
                    </div>
                </> : <>Не хватает индикаторов для расчета</>}
                {corr.length && corr.length === indicators.filter(i => i !== null).length ?
                    <>
                        <div className="flex text-sm mt-8">
                            <div className="flex w-48"></div>
                            {indicators.filter(i => i !== null).map(ind => {
                                return <div className="font-bold flex w-48 mr-3">{ind.name}</div>
                            })
                            }
                        </div>
                        {indicators.filter(i => i !== null).map((ind, i) => {
                            return <div className="flex my-2 items-center">
                                <div className="font-bold text-sm flex w-48 mr-3">{ind.name}</div>
                                {corr[i].map(c => <div className="flex w-48">{c.toFixed(4)}</div>)
                                }
                            </div>
                        })
                        }
                    </> :
                    <></>}
            </div>
        </>
    )
}

export default IndicatorAnalysis 