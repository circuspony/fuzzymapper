import { useEffect, useState, useRef } from "react"
import ModalOverlay from "../layout/modalOverlay"

const ObjectEditor = ({ objectData,
    setObjectData,
    factorEvals,
    setFactorEvals,
    factorConnectionEvals,
    setFactorConnectionEvals }) => {
    const [valueEditorOpen, setValueEditorOpen] = useState(false)
    const [tempValue, setTempValue] = useState("")
    const [tempIndex, setTempIndex] = useState(0)
    const [tempFIndex, setTempFIndex] = useState(0)
    const [tempKIndex, setTempKIndex] = useState(false)
    const [isField, setIsField] = useState(false)

    const editField = (i, title, key) => {
        let copy = [...objectData]
        copy[i] = {
            title: title,
            key: key,
            values: copy[i].values
        }
        setObjectData(copy)
    }


    const removeField = (i) => {
        setObjectData(objectData.filter((_, index) => index !== i))
    }

    const editObject = (fi, i, value) => {
        setObjectData(objectData.map((field, findex) => {
            if (findex == fi) {
                let copy = [...field.values]
                copy[i] = value
                return {
                    title: field.title,
                    key: field.key,
                    values: copy
                }
            }
            return field
        }))
    }
    const removeObject = (i) => {
        setObjectData(objectData.map((field) => {
            return {
                title: field.title,
                key: field.key,
                values: field.values.filter((_, index) => index !== i)
            }
        }))
        setFactorEvals([])
    }

    return (
        <>
            <div className="flex flex-col ">
                <div className="px-8 text-black mt-4">
                    Здесь вы можете добавить объекты для анализа и отредактировать значения и названия индикаторов.
                </div>
                <div className="px-8 mt-4 text-black flex flex-col">
                    <div className="flex">
                        <div className="font-bold items-center flex w-28 h-full">Индекс</div>
                        {objectData.map((el, i) =>
                        (
                            <div className="flex items-center group font-bold w-48 mx-2">
                                <span>{el.title}</span>
                                {el.key ?
                                    <div className="ml-1 transition-all duration-300 text-3xl text-blue-300">✰</div>
                                    : <></>}
                                <div
                                    onClick={() => {
                                        setIsField(true)
                                        setTempValue(el.title)
                                        setTempFIndex(i)
                                        setTempKIndex(el.key)
                                        setValueEditorOpen(true)
                                    }}
                                    className={`ml-auto transition-all duration-300 text-3xl opacity-0 group-hover:opacity-100 text-blue-300 hover:text-violet-dark`}>✎</div>
                                {objectData.length > 1 ? <div
                                    onClick={() => { removeField(i) }}
                                    className={`ml-2 transition-all duration-300 text-3xl opacity-0 group-hover:opacity-100 text-red-300 hover:text-violet-dark`}>🗑</div>
                                    : <></>}
                            </div>
                        )
                        )}
                    </div>
                    {objectData[0].values.map((_, i) =>
                        <div className="flex">
                            <div className="w-28">{i}</div>
                            {objectData.map((el, fi) =>
                            (
                                <div className="w-48 flex group mx-2">
                                    <p>{el.values[i]}</p>
                                    <div
                                        onClick={() => {
                                            setIsField(false)
                                            setTempValue(el.values[i])
                                            setTempIndex(i)
                                            setTempFIndex(fi)
                                            setValueEditorOpen(true)
                                        }}
                                        className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 text-3xl text-blue-300 hover:text-violet-dark`}>✎</div>
                                </div>
                            )
                            )}
                            <div
                                onClick={() => { removeObject(i) }}
                                className={`ml-2 transition-all duration-300 text-3xl text-red-300 hover:text-violet-dark`}>🗑</div>
                        </div>
                    )}
                </div>
            </div>
            <ModalOverlay classes="flex" modalOpen={valueEditorOpen} setModalOpen={setValueEditorOpen}>
                <div className="my-auto flex flex-col mx-auto p-8 w-3/5 border-2 border-violet border-dotted bg-violet-light rounded-xl">
                    <div className="text-violet-border text-2xl font-medium mb-2">
                        Введите новое значение:
                    </div>
                    <input
                        value={tempValue}
                        onChange={(e) => {
                            setTempValue(e.target.value)
                        }}
                        style={{
                            outline: "none",
                        }}
                        className={`text-xl p-1 border-2 border-violet-border rounded-xl bg-violet`}
                    />
                    {isField ?
                        <>
                            <div className="flex mt-2 шеуьы-сутеук">
                                <div
                                    onClick={() => {
                                        setTempKIndex(!tempKIndex)
                                    }}
                                    className={`w-8 h-8 border-dotted border-2 border-violet-border border-dotted rounded-md cursor-pointer ${tempKIndex ? "bg-violet" : ""}`}></div>
                                <div className="ml-2 text-violet-border my-auto">Сделать ключевым</div>

                            </div>
                        </> : <></>}
                    <div
                        onClick={() => {
                            if (isField) {
                                editField(tempFIndex, tempValue, tempKIndex)
                            }
                            else {
                                editObject(tempFIndex, tempIndex, tempValue)
                            }
                            setValueEditorOpen(false)
                        }}
                        className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mx-auto items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                        Применить
                    </div>
                </div>
            </ModalOverlay>
        </>
    )
}

export default ObjectEditor 