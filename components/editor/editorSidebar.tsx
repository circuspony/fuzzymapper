import { useEffect, useState, useRef } from "react"
import Link from 'next/link';
import Papa from "papaparse";


const allowedExtensions = ["csv"];

const EditorSidebar = ({
    factorData,
    factorConnectionData,
    projectId,
    setOpenRename,
    objectData,
    exportFile,
    handleChange,
    addFactor,
    currentWindow,
    setCurrentWindow,
    EDITOR_WINDOWS,
    isSubMap,
    closeASubMap,
    setObjectData,
    saveFile,
    addField,
    addObject,
    currentFEditor,
    setCurrentFEditor,
    currentFСEditor,
    setCurrentFСEditor,
    currentAnalysisObject,
    setCurrentAnalysisObject
}) => {

    const getFactorById = (id) => {
        return factorData.filter(f => f !== null).find(f => f.id === id)
    }
    const [data, setData] = useState([]);
    const [error, setError] = useState(null)
    const [file, setFile] = useState(null)

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

    const handleFileChange = (e) => {
        setError("");
        if (e.target.files.length) {
            const inputFile = e.target.files[0];
            const fileExtension = inputFile?.type.split("/")[1];
            if (!allowedExtensions.includes(fileExtension)) {
                setError("Please input a csv file");
                return;
            }
            setFile(inputFile);
        }
    }
    const handleParse = () => {
        if (!file) return setError("Enter a valid file");
        const reader = new FileReader();
        reader.onload = async ({ target }) => {
            const csv = Papa.parse(target.result, {
                header: false,
            });
            const parsedData = csv?.data;
            setData(parsedData);
        };
        reader.readAsText(file);
    }
    useEffect(() => {
        if (file) {
            handleParse()
        }
    }, [file])
    useEffect(() => {
        if (data.length) {
            let newArray = []
            data.forEach((el, i) => {
                if (i == 0) {
                    el.forEach((element) => {
                        newArray.push({
                            title: element,
                            key: false,
                            values: []
                        })
                    });
                }
                else {
                    let newEl = []
                    if (el.length == newArray.length) {
                        el.forEach((element, index) => {
                            let ne = element
                            // if (typeof element === "string") {
                            //     ne = element.replace(/\s/g, "");
                            // }
                            newArray[index].values.push(ne)
                        });
                    }
                }
            })
            setObjectData(newArray)
            setData([])
            setFile(null)
        }
    }, [data])

    return (
        <>

            <div
                className="flex bg-violet-dark min-w-16 w-1/10 h-full flex-col z-30 flex-shrink"></div>
            <div
                className="fixed flex bg-violet-dark min-w-16 w-1/10 h-full flex-col z-40 flex-shrink">

                <div
                    onClick={() => {
                        setCurrentWindow(EDITOR_WINDOWS.GRAPH)
                    }}
                    className={`h-16 justify-center relative noselect z-40 transition-all duration-300 mt-4 items-center flex w-full cursor-pointer text-white font-medium ${currentWindow === EDITOR_WINDOWS.GRAPH ? "bg-violet-border" : ""}   border-2 border-violet border-dotted rounded-xl `}>
                    Редактор
                </div>
                <div
                    onClick={() => {
                        setCurrentWindow(EDITOR_WINDOWS.OBJECTS)
                    }}
                    className={`h-16 justify-center relative noselect z-40 transition-all duration-300 mt-1 items-center flex w-full cursor-pointer text-white font-medium ${currentWindow === EDITOR_WINDOWS.OBJECTS ? "bg-violet-border" : ""} border-2 border-violet border-dotted rounded-xl `}>
                    Объекты
                </div>
                <div
                    onClick={() => {
                        setCurrentWindow(EDITOR_WINDOWS.FACTORS)
                    }}
                    className={`h-16 justify-center relative noselect z-40 transition-all duration-300 mt-1 items-center flex w-full cursor-pointer text-white font-medium ${currentWindow === EDITOR_WINDOWS.FACTORS ? "bg-violet-border" : ""} border-2 border-violet border-dotted rounded-xl `}>
                    Факторы
                </div>
                <div
                    onClick={() => {
                        setCurrentWindow(EDITOR_WINDOWS.CONNECTIONS)
                    }}
                    className={`h-16 justify-center relative noselect z-40 transition-all duration-300 mt-1 items-center flex w-full cursor-pointer text-white font-medium ${currentWindow === EDITOR_WINDOWS.CONNECTIONS ? "bg-violet-border" : ""} border-2 border-violet border-dotted rounded-xl `}>
                    Связи
                </div>
                <div
                    onClick={() => {
                        setCurrentWindow(EDITOR_WINDOWS.ANALYSIS)
                    }}
                    className={`h-16 justify-center relative noselect z-40 transition-all duration-300 mt-1 items-center flex w-full cursor-pointer text-white font-medium ${currentWindow === EDITOR_WINDOWS.ANALYSIS ? "bg-violet-border" : ""}  border-2 border-violet border-dotted rounded-xl `}>
                    Анализ
                </div>
                {currentWindow === EDITOR_WINDOWS.GRAPH ? <div
                    onClick={addFactor}
                    className="mx-auto mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                >
                    Добавить Фактор
                </div> : <></>}
                {currentWindow === EDITOR_WINDOWS.OBJECTS ? <div
                    onClick={() => {
                        addObject()
                    }}
                    className="mx-auto mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                >
                    Добавить Объект
                </div> : <></>}
                {currentWindow === EDITOR_WINDOWS.OBJECTS ? <div
                    onClick={() => {
                        addField()
                    }}
                    className="mx-auto mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                >
                    Добавить Индикатор
                </div> : <></>}
                {currentWindow === EDITOR_WINDOWS.OBJECTS ? <div
                    onClick={() => {
                        document.getElementById("csvInput").click()
                    }}
                    className="mx-auto mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                >
                    Импорт CSV
                </div> : <></>}
                {currentWindow === EDITOR_WINDOWS.FACTORS ?
                    <div className="flex flex-col">
                        <div
                            className="mx-auto mt-1 font-medium"
                        >
                            Список факторов
                        </div>
                        {factorData.filter(f => f !== null).map((factor, fi) =>
                            <div
                                onClick={() => { setCurrentFEditor(fi) }}
                                className="ml-2 items-center flex mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                            >
                                <div className={`h-5 w-5 mr-2 rounded-md ${factor.isExternal ? "bg-green-500" : "bg-violet"}`}></div>
                                <span>{factor.name}</span>
                            </div>
                        )}
                    </div> : <></>}
                {currentWindow === EDITOR_WINDOWS.CONNECTIONS ?
                    <div className="flex flex-col">
                        <div
                            className="mx-auto mt-1 font-medium"
                        >
                            Список связей
                        </div>
                        {factorConnectionData.filter(f => f !== null).map((fc, fсi) => {
                            let f1 = getFactorById(fc.start)
                            let f2 = getFactorById(fc.end)
                            return (
                                <div
                                    onClick={() => { setCurrentFСEditor(fсi) }}
                                    className="ml-2 items-center flex mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                                >
                                    <div className={`h-5 w-5 mr-2 rounded-md ${f1.isExternal ? "bg-green-500" : "bg-violet"}`}></div>
                                    <div className="flex-col">
                                        <div>{"От: " + f1.name}</div>
                                        <div>{"До: " + f2.name}</div>
                                    </div>

                                </div>
                            )
                        }
                        )}
                    </div> : <></>}

                {currentWindow === EDITOR_WINDOWS.ANALYSIS ?
                    <div className="flex flex-col">
                        <div
                            className="mx-auto mt-1 font-medium"
                        >
                            Список объектов
                        </div>
                        <div style={{ overflowY: "scroll" }} className="sc h-48 flex-col">

                            {objectData.length && objectData[0].values.map((obj, oi) =>
                                <div
                                    onClick={() => { setCurrentAnalysisObject(oi) }}
                                    className="ml-2 text-sm items-center flex mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                                >
                                    <div className={`h-4 w-4 mr-2 rounded-md ${oi === currentAnalysisObject ? "bg-yellow-500" : "bg-violet"}`}></div>

                                    <span>{getObjectName(oi)}</span>
                                </div>
                            )}
                        </div>

                    </div> : <></>}
                {isSubMap ?
                    <div
                        onClick={closeASubMap}
                        className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 ml-8 items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl `}>
                        Выйти
                    </div>
                    :
                    <>
                        {/* <div
                            className="mx-auto mt-auto font-medium hover:cursor-pointer hover:text-yellow-500"
                            onClick={async () => {
                                if (projectId === "") {
                                    setOpenRename(true)
                                }
                                else {
                                    await saveFile()
                                }
                            }}>
                            Сохранить
                        </div> */}
                        {projectId === "" ? <></> :
                            <div
                                onClick={() => { setOpenRename(true) }}
                                className="mx-auto mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                            >
                                Редактировать проект
                            </div>
                        }
                        <div
                            onClick={() => { exportFile() }}
                            className="mx-auto mt-auto font-medium hover:cursor-pointer hover:text-yellow-500"
                        >
                            Экспортировать
                        </div>
                        <div
                            onClick={() => { document.getElementById("fileLoader").click() }}
                            className="mx-auto mt-2 mb-4 font-medium hover:cursor-pointer hover:text-yellow-500"
                        >
                            Импортировать
                        </div>
                        {/* <div
                                onClick={uploadFile}
                                className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mx-auto items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl `}>
                                Загрузить
                            </div> */}
                    </>}
                {/* <Link href={'/'}>
                    <a className="mx-auto mt-1 font-medium hover:text-yellow-500 mb-2">
                        Меню редактора
                    </a>
                </Link> */}
                <input className="hidden" id="fileLoader" type="file" onChange={handleChange} />
                <input
                    className="hidden"
                    onChange={handleFileChange}
                    id="csvInput"
                    name="file"
                    type="File"
                />
            </div>

        </>
    )
}

export default EditorSidebar 