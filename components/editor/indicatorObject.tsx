import { useEffect, useState, useRef } from "react"
import Draggable from 'react-draggable';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';

const IndicatorObject = ({ id, indicatorIndex, indicatorData, inactivate, activate, edit, remove }) => {
    if (indicatorData === null) return null
    const [isHovered, setIsHovered] = useState(false);
    const updateXarrow = useXarrow()
    const positions = [
        { x: 250, y: 100 },
        { x: -200, y: 100 },
        { x: 150, y: -100 },
        { x: -100, y: -100 },
        { x: 200, y: 0 },
        { x: -150, y: 0 }
    ]
    return (
        <Draggable
            defaultPosition={positions[indicatorIndex % 6]}
            onDrag={updateXarrow}
            onStart={(event) => {
                event.stopPropagation()

                activate()
            }}
            onStop={(event) => {
                event.stopPropagation()
                updateXarrow()
                inactivate()
            }}
        >
            <div
                onMouseEnter={() => { setIsHovered(true) }}
                onMouseLeave={() => { setIsHovered(false) }}
                className="absolute flex z-50 flex-col">
                <div id={id} className="text-violet-border mx-auto text-5xl">
                    ⬤
                </div>
                <span
                    style={{
                        outline: "none",
                        resize: "none",
                    }}
                    className={`bg-transparent border-0 text-black`}
                >
                    {indicatorData.name}
                </span>
                <div className={`w-full justify-center flex items-center absolute transition-all duration-700 -bottom-10 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                    {/* <div
                        onClick={() => { }}
                        className={`transition-all duration-300 text-3xl text-blue-300 hover:text-violet-dark`}>✎</div> */}
                    <div
                        onClick={remove}
                        className={`transition-all duration-300 text-3xl text-red-300 hover:text-violet-dark`}>🗑</div>
                </div>
            </div>
        </Draggable>
    )
}

export default IndicatorObject 