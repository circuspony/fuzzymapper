import { useEffect, useState, useRef } from "react"
import axios from 'axios'


const EvalTable = ({ objectData, indicators, needIndicators = true, fEval }) => {
    const getObjectName = (index) => {
        let filtered = objectData.filter(f => f.key === true)
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

    const getEval = (f, eLabels) => {
        let mi = f.indexOf(Math.max(...f))
        return eLabels[mi]
    }
    return (
        <>
            <div className="mt-4 text-black flex flex-col">
                <div className="flex">
                    <div className="font-bold items-center flex w-40 h-full">Объект</div>
                    {fEval.eLabels.map((e) =>
                        <div className=" ml-2 font-bold items-center flex w-40 h-full">{e}</div>
                    )}
                    <div className="font-bold ml-2 items-center flex w-40 h-full">Оценка</div>
                </div>
                {fEval.labels.map((e, i) =>
                    <div className="flex my-1">
                        <div className="items-center text-sm flex w-40 h-full">{getObjectName(i)}</div>
                        {fEval.eLabels.map((l, i) =>
                            <div className="ml-2 items-center text-sm flex w-40 h-full">{e[i].toFixed(3)}</div>
                        )}
                        <div className="items-center text-sm flex w-40 h-full">{getEval(e, fEval.eLabels)}</div>
                    </div>

                )}
            </div>
        </>
    )
}

export default EvalTable 