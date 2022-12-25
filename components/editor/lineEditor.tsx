import { useEffect, useState, useRef } from "react"
import Draggable from 'react-draggable';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';

const LineEditor = ({ influence, removeFunction, edit = false, remove = true, changeFunction, setModalOpen }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <>
            <div
                onMouseEnter={() => { setIsHovered(true) }}
                onMouseLeave={() => { setIsHovered(false) }}
                className="relative w-full noselect font-medium text-violet-dark cursor-pointer">
                <div className={`flex w-full transition-all duration-700 absolute -bottom-8 ${isHovered ? "opacity-100" : "opacity-0"} ${edit ? "-left-2" : ""}`}>
                    {edit ? <div
                        onClick={(event) => {
                            event.stopPropagation()
                            setModalOpen(true)
                        }}
                        className={`transition-all duration-300 text-3xl text-blue-300 hover:text-violet-dark`}>✎
                    </div> : null}
                    {remove ? <div
                        onClick={(event) => {
                            event.stopPropagation()
                            removeFunction()
                        }}
                        className="transition-all duration-300 text-2xl mx-auto text-red-300 hover:text-violet-dark">🗑</div>
                        : <></>}

                </div>
                <div className="text-2xl ">{influence}</div>
            </div>
        </>


    )
}

export default LineEditor 