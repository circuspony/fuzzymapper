import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import backendAxios from '../../network/backend'


const IndicatorAnalysis = ({ objectData, indicators }) => {
    const [corr, setCorr] = useState("");

    useEffect(() => { setCorr('') }, [indicators])

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
                {corr.length ?
                    <>
                        <div className="relative">
                            <div className="border-violet-light border-4 absolute top-0 w-full h-full"></div>

                            <img src={`${process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_FLASK : "http://localhost:5000"}/${corr}`} />
                        </div>
                    </> :
                    <></>}
            </div>
        </>
    )
}

export default IndicatorAnalysis 