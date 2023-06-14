import { useEffect, useState, useRef, use } from "react"
import ModalOverlay from "../layout/modalOverlay"

const HierarchyEditor = ({ hierarchy, setHierarchy, saveOldHierarchy, currentHierarchy, setCurrentHierarchy }) => {

    const [modalOpen, setModalOpen] = useState(false)
    const [currentName, setCurrentName] = useState("")
    const [oldName, setOldName] = useState("")

    const buildHierarchy = () => {
        let orderedHierarchy = []
        hierarchy.forEach((element, elementIndex) => {
            if (element.parent === null) {
                orderedHierarchy.push({ ...element, index: elementIndex })
            }
            let parentIndex = orderedHierarchy?.findIndex(hp => hp.name === element.parent)
            if (parentIndex >= 0) {
                orderedHierarchy.splice(parentIndex + 1, 0, { ...element, index: elementIndex });

            }
        });
        console.log("orderedHierarchy")
        console.log(orderedHierarchy)
        return <div className="flex flex-col text-xl w-full">{orderedHierarchy.map((h, hi) => {
            let spaces = 1
            let tempParent = h.parent
            while (tempParent !== null) {

                let currentParent = hierarchy?.find(hp => hp.name === tempParent)
                spaces = spaces + 1
                tempParent = currentParent?.parent
            }
            let spaceArray = new Array(spaces).fill(0)
            return (<div
                onClick={() => {
                    saveOldHierarchy()
                    setCurrentHierarchy(h.index)
                }}
                className={`cursor-pointer flex items-center ${h.index === currentHierarchy ? "font-bold" : ""}`}>
                {spaceArray.map(s =>
                    <div style={{ width: 20 + "px" }} className={`${h.index === currentHierarchy ? "bg-yellow-500" : "bg-violet"} mr-2 h-4 `}></div>

                )}
                {h.name}
                <div
                    onClick={() => {
                        setCurrentName(h.name)
                        setOldName(h.name)
                        setModalOpen(true)
                    }}
                    className={`ml-auto font-normal transition-all duration-300 text-3xl text-blue-300 hover:text-violet-dark`}>✎</div>
                {h.parent ? <>
                    <div
                        onClick={(event) => {
                            event.stopPropagation()
                            setHierarchy(hierarchy.filter((ch, chi) => chi !== hi))
                            setCurrentHierarchy(0)
                        }}
                        className={`ml-2 font-normal transition-all duration-300 text-3xl text-red-300 hover:text-violet-dark`}>🗑</div>
                </> : null}
            </div>)
        })}</div>
    }
    return (
        <>
            <div className="flex flex-col px-8 text-black w-1/3">
                <div className="text-2xl mt-4 mb-1">Текущая иерархия карт:</div>
                {buildHierarchy()}
            </div>
            <ModalOverlay classes="flex" modalOpen={modalOpen} setModalOpen={setModalOpen}>

                <div className="my-auto flex flex-col mx-auto p-8 w-3/5 border-2 border-violet border-dotted bg-violet-light rounded-xl">
                    <div className="text-violet-border text-2xl font-medium mb-2">
                        Название карты:
                    </div>
                    <input
                        value={currentName}
                        onChange={(e) => {
                            setCurrentName(e.target.value)
                        }}
                        style={{
                            outline: "none",
                        }}
                        className={`text-xl p-1 border-2 border-violet-border rounded-xl bg-violet`}
                    />
                    <div
                        onClick={() => {
                            setHierarchy(hierarchy.map(h => {
                                if (h.name === oldName) {
                                    return { ...h, name: currentName }
                                }
                                if (h.parent === oldName) {
                                    return { ...h, parent: currentName }
                                }
                                return h
                            }))
                            setModalOpen(false)
                        }}
                        className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mx-auto items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                        Сохранить
                    </div>
                </div>
            </ModalOverlay>
        </>
    )
}

export default HierarchyEditor 