import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import backendAxios from '../../network/backend'

const MEMBERSHIP = {
    TRIANGLE: 0,
    TRAPEZOID: 1
}
const MembershipMode = ({ functionSets, changeFs, generateTriFunc, generateTraFunc }) => {
    const [showMore, setShowMore] = useState(false);
    const [graph, setGraph] = useState("");
    const [fsType, setFsType] = useState(functionSets?.type ? functionSets.type : null);
    const [inputs, setinputs] = useState(functionSets?.functionSets ? functionSets.functionSets.map(fs => fs.join(",")) : null);
    const updateFsWithInputs = () => {
        let copy = { ...functionSets }
        copy["type"] = fsType
        copy["functionSets"] = inputs.map(i => (i.split(",")).map(num => parseFloat(num)))
        changeFs(copy)
    }
    const updateFsWithAuto = () => {
        let copy = { ...functionSets }
        copy["type"] = fsType
        if (fsType === MEMBERSHIP.TRAPEZOID) {

            copy["functionSets"] = generateTraFunc(functionSets.min, functionSets.max, functionSets.functionSets.length)
        }
        if (fsType === MEMBERSHIP.TRIANGLE) {
            copy["functionSets"] = generateTriFunc(functionSets.min, functionSets.max, functionSets.functionSets.length)
        }
        changeFs(copy)
    }

    const update = async () => {
        if (functionSets?.functionSets.length) {
            setFsType(functionSets.type)
            setinputs(functionSets?.functionSets ? functionSets.functionSets.map(fs => fs.join(",")) : null)
            if (functionSets.type === MEMBERSHIP.TRIANGLE) {
                const response = await backendAxios.post("/triangle", {
                    data: functionSets.functionSets
                })
                setGraph(response.data.fname)
            }
            if (functionSets.type === MEMBERSHIP.TRAPEZOID) {
                const response = await backendAxios.post("/trapezoid", {
                    data: functionSets.functionSets
                })
                setGraph(response.data.fname)
            }
        }
    }
    useEffect(() => {
        update()
    }, [functionSets])
    return (
        <>
            <div className="text-lg text-violet-border mt-4 font-bold mb-1">{functionSets.title}</div>
            <div className="text-lg text-violet-border mb-1">{"Индикатор:" + functionSets.name}</div>
            {graph.length ? <img className="w-30" src={`${process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_FLASK : "http://localhost:5000"}/${graph}`} /> : null}
            <div onClick={() => { setShowMore(!showMore) }} className="cursor-pointer">{showMore ? "▲ Подробнее" : "▼ Подробнее"}</div>
            {showMore ? <>
                <span className="mt-2">{"Соответствие: " + functionSets.coef}</span>
                <span className="mt-2">{"Минимум: " + functionSets.min}</span>
                <span className="mt-2">{"Максимум: " + functionSets.max}</span>
                {/* <div className="text-lg text-violet-border mt-2 mb-1">{"Интервалы принадлежности"}</div>
                {functionSets.functionSets.map(f => <div className="mt-2">
                    {f.reduce((a, v) => a + " " + v, "")}
                </div>)} */}
            </> : <></>}
            <div className="text-lg mt-4 font-bold mb-1">Редактировать интервалы</div>
            {inputs.map((inp, id) => {
                return <input
                    value={inp}
                    onChange={(e) => {
                        setinputs(inputs.map((v, index) => {
                            if (index === id) return e.target.value
                            return v
                        }))
                    }}
                    style={{
                        outline: "none",
                    }}
                    className={`text-xl p-1 mt-2 w-20 border-2 border-violet-border rounded-xl bg-violet`}
                />
            })}
            <div className="flex items-center mt-2 ">
                <div
                    onClick={() => {
                        setFsType(MEMBERSHIP.TRIANGLE)
                    }}
                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${fsType === MEMBERSHIP.TRIANGLE ? "bg-green-500" : ""}`}></div>
                <span>Триугольная</span>
            </div>
            <div className="flex items-center mt-2 ">
                <div
                    onClick={() => {
                        setFsType(MEMBERSHIP.TRAPEZOID)
                    }}
                    className={`h-8 w-8 mr-1 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${fsType === MEMBERSHIP.TRAPEZOID ? "bg-blue-500" : ""}`}></div>
                <span>Трапецевидная</span>
            </div>
            <div className="flex w-2/3">
                <div
                    onClick={() => {
                        updateFsWithInputs()
                    }}
                    className={`h-16 mt-2  justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                    Обновить
                </div>
                <div
                    onClick={() => {
                        updateFsWithAuto()
                    }}
                    className={`h-16 mt-2 ml-4 justify-center relative noselect z-30 transition-all duration-300 items-center flex w-full cursor-pointer text-white font-medium bg-violet-border border-2 border-violet border-dotted rounded-xl `}>
                    Сгенерировать
                </div>

            </div>
        </>
    )
}

export default MembershipMode