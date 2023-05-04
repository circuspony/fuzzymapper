import { useEffect, useState, useRef } from "react"
import Link from 'next/link';
import Papa from "papaparse";
import html2canvas from "html2canvas"
import { utf8ToAnsi } from 'utf8-to-ansi'
import { encode, decode, labels } from 'windows-1252';

var DMap = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 1027: 129, 8225: 135, 1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 1028: 170, 160: 160, 1040: 192, 1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182, 183: 183, 8221: 148, 187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 1060: 212, 1030: 178, 1061: 213, 1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223, 1072: 224, 8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 1076: 228, 1077: 229, 8211: 150, 1078: 230, 1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237, 1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246, 1054: 206, 1095: 247, 1096: 248, 8249: 139, 1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147, 1101: 253, 8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190 }
function UnicodeToWin1251(s) {
    var L = []
    for (var i = 0; i < s.length; i++) {
        var ord = s.charCodeAt(i)
        if (!(ord in DMap))
            throw "Character " + s.charAt(i) + " isn't supported by win1251!"
        L.push('%' + DMap[ord].toString(16));
    }
    return L.join('')
}
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
    factorEvals,
    setCurrentFСEditor,
    currentAnalysisObject,
    setCurrentAnalysisObject,
    setPrognosisOpen,
    setCurrentPrognosisObject
}) => {

    const getFactorById = (id) => {
        return factorData.filter(f => f !== null).find(f => f.id === id)
    }
    const [data, setData] = useState([]);
    const [error, setError] = useState(null)
    const [file, setFile] = useState(null)

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
                            date: false,
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

    const getScreen = async () => {
        await html2canvas(document.getElementById("editor")).then(canvas => {
            // document.body.appendChild(canvas)
            console.log(canvas.toDataURL())
        });
    }
    // const unparseFactors = () => {
    //     let newObjects = []
    //     let filtered = objectData.filter(f => f.key || f.date === true)
    //     for (let oi = 0; oi < filtered[0]?.values?.length; oi++) {
    //         let obj = {
    //             "Key": filtered.reduce(
    //                 (a, c) => {
    //                     return a + " " + c.values[oi]
    //                 },
    //                 ""
    //             ).trim(),
    //         }
    //         factorEvals.forEach(feval => {
    //             let factor = factorData.find(fd => fd?.id === feval.id)
    //             if (factor) {
    //                 obj[factor?.name] = feval.eLabels[feval.labels[oi].indexOf(Math.max(...feval.labels[oi]))]

    //             }
    //         });
    //         newObjects.push(obj)
    //     }

    //     let csv = Papa.unparse(newObjects, { delimiter: ";" })
    //     var encodedUri = "data:text/csv," + encodeURI(csv);
    //     var link = document.createElement("a");
    //     link.setAttribute("href", encodedUri);
    //     link.setAttribute("download", "my_data.csv");
    //     document.body.appendChild(link); // Required for FF

    //     link.click(); // This will download the data file named "my_data.csv".
    // }
    const unparseFactors = () => {
        let newObjects = []
        let filtered = objectData.filter(f => f.key || f.date === true)
        for (let oi = 0; oi < filtered[0]?.values?.length; oi++) {
            if (filtered[1].values[oi] != 2010 && filtered[1].values[oi] != 2019 && filtered[1].values[oi] != 2020) { continue }
            let obj = {
                "Штат": filtered[0].values[oi],
                "Год": filtered[1].values[oi]
            }
            factorEvals.forEach(feval => {
                let factor = factorData.find(fd => fd?.id === feval.id)
                if (factor) {
                    obj[factor?.name] = feval.eLabels[feval.labels[oi].indexOf(Math.max(...feval.labels[oi]))]

                }
            });
            newObjects.push(obj)
        }

        let csv = Papa.unparse(newObjects, { delimiter: ";" })
        var encodedUri = "data:text/csv," + encodeURI(csv);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the data file named "my_data.csv".
    }
    return (
        <>

            <div
                style={{ maxWidth: "10%" }}
                className="flex bg-violet-dark min-w-16 w-1/10 h-full flex-col z-30 flex-shrink"></div>
            <div
                style={{ maxWidth: "10%" }}
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
                    <div style={{ maxWidth: "95%" }} className="flex flex-col">
                        <div
                            className="mx-auto mt-1 font-medium"
                        >
                            Список факторов
                        </div>
                        <div style={{ overflowY: "scroll", height: "90%" }} className="sc flex-col">

                            {factorData.filter(f => f !== null).map((factor, fi) =>
                                <div
                                    onClick={() => { setCurrentFEditor(fi) }}
                                    className="ml-2 text-sm  items-center flex mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                                >
                                    <div className={`h-5 w-5 mr-2 rounded-md ${factor.isExternal ? "bg-green-500" : "bg-violet"}`}></div>
                                    <span>{factor.name}</span>
                                </div>
                            )}
                        </div>

                    </div> : <></>}
                {currentWindow === EDITOR_WINDOWS.CONNECTIONS ?
                    <div className="flex flex-col">
                        <div
                            className="mx-auto mt-1 font-medium"
                        >
                            Список связей
                        </div>
                        <div style={{
                            overflowY: "scroll",
                            // height: "90%"
                        }} className="sc h-64 flex-col">

                            {factorConnectionData.filter(f => f !== null).map((fc, fсi) => {
                                let f1 = getFactorById(fc.start)
                                let f2 = getFactorById(fc.end)
                                return (
                                    <div
                                        onClick={() => { setCurrentFСEditor(fсi) }}
                                        className="ml-2 items-center flex mt-1 font-medium hover:cursor-pointer hover:text-yellow-500"
                                    >
                                        <div className={`h-5 w-5 mr-2 rounded-md ${f1.isExternal ? "bg-green-500" : "bg-violet"}`}></div>
                                        <div className="flex-col text-xs">
                                            <div>{"От: " + f1.name}</div>
                                            <div>{"До: " + f2.name}</div>
                                        </div>

                                    </div>
                                )
                            }
                            )}
                        </div>

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

                        <div
                            onClick={() => {
                                setPrognosisOpen(true)
                            }}
                            className={`h-16 justify-center relative noselect z-40 transition-all duration-300 mt-4 items-center flex w-full cursor-pointer text-white font-medium border-2 bg-violet border-violet-border border-dotted rounded-xl `}>
                            Прогнозирование
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
                        {/* <div
                            onClick={() => { getScreen() }}
                            className="mx-auto mt-auto font-medium hover:cursor-pointer hover:text-yellow-500"
                        >
                            Изображение
                        </div>
                        <img></img> */}
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
                            onClick={() => { unparseFactors() }}
                            className="mx-auto mt-2 font-medium hover:cursor-pointer hover:text-yellow-500"
                        >
                            Вывод данных
                        </div> */}
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
                <input className="hidden" value={null} id="fileLoader" type="file" onChange={handleChange} />
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