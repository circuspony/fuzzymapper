import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import backendAxios from '../../network/backend'


const ExpertMode = ({ factorEvals, factorS, currentEval, setCurrentEval, setEval }) => {
    const [grouping, setGrouping] = useState(false);

    useEffect(() => {
        if (grouping) {
            setCurrentEval(factorEvals.find(fe => fe.id === factorS.id).eLabels.map((fe) => 1))
        }
        else {
            setCurrentEval([1])
        }
    }, [grouping])
    return (
        <>
            <div className="text-lg mt-4 font-bold mb-1">Ручная оценка факторов</div>
            {factorEvals.find(fe => fe.id === factorS.id)?.labels ?
                <div className="flex items-center mt-2 ">
                    <div
                        onClick={() => {
                            setGrouping(!grouping)

                        }}
                        className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${grouping ? "bg-red-500" : ""}`}></div>
                    <span>Разделить по термам</span>
                </div>
                : null}
            <div className="flex-col mt-4">
                {grouping ?
                    <>
                        {
                            <>
                                <div className="text-lg mt-4 font-bold mb-1">Ввести оценку</div>
                                {
                                    factorEvals.find(fe => fe.id === factorS.id).eLabels.map((fe, fi) =>
                                        <>
                                            <div>{fe}</div>
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
                            </>
                        }
                    </> :
                    <>
                        <div className="text-lg mt-4 font-bold mb-1">Ввести оценку</div>
                        <input
                            value={currentEval[0]}
                            onChange={(e) => {
                                setCurrentEval(currentEval.map((ce, ci) => {
                                    if (ci === 0) {
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
                    </>}

                <div
                    onClick={() => {
                        setEval(currentEval.map(ce => Math.min(1, parseFloat(ce))))
                    }}
                    className={`h-16 mt-2  w-20 justify-center relative noselect z-40 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                    Принять
                </div>
            </div>

        </>
    )
}

export default ExpertMode 