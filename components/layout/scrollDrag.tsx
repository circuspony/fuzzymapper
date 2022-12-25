import React from 'react';
import { useEffect, useState, useRef } from "react"
const ScrollDrag = (scrollDragRef) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [clientX, setClientX] = useState(0);
    const [scrollX, setScrollX] = useState(0);


    const onMouseDown = e => {
        setIsScrolling(true)
        setClientX(e.clientX)
    };

    const onMouseUp = () => {
        setIsScrolling(false)
    };

    const onMouseMove = e => {
        if (isScrolling && scrollDragRef.current) {
            scrollDragRef.current.style = { transform: `translate(${scrollX + e.clientX - clientX},0)` };
            // scrollDragRef.current.scrollLeft = scrollX + e.clientX - clientX;
            setScrollX(scrollX + e.clientX - clientX)
            setClientX(e.clientX)
        }
    };
    const [keyScrollX, setKeyScrollX] = useState(0);
    const [keyScrollY, setKeyScrollY] = useState(0);
    useEffect(() => {
        const keyDown = (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    setKeyScrollX(keyScrollX - 50)
                    break;
                case "ArrowUp":
                    setKeyScrollY(keyScrollY - 50)
                    break;

                case "ArrowRight":
                    setKeyScrollX(keyScrollX + 50)
                    break;

                case "ArrowDown":
                    setKeyScrollY(keyScrollY + 50)
                    break;
            }
        }
        window.addEventListener("keydown", keyDown)
        return () => {
            window.removeEventListener("keydown", keyDown)
        }
    }, [])

    return { onMouseDown, onMouseUp, onMouseMove, keyScrollX, keyScrollY }
}


export default ScrollDrag