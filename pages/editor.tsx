
import SideBar from "../components/layout/sidebar";
import EditorArea from "../components/editor/editorArea";
import { useEffect, useState, useRef } from "react"

import ScrollContainer from 'react-indiana-drag-scroll'
import useDraggableScroll from 'use-draggable-scroll';

export default function Home() {
    const [isSubMap, seIsSubMap] = useState(false);
    return (
        <div
            className={`w-full h-screen flex`}>
            <EditorArea isSubMap={isSubMap} seIsSubMap={seIsSubMap} />
        </div>
    )
}
