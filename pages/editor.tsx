
import SideBar from "../components/layout/sidebar";
import EditorArea from "../components/editor/editorArea";
import ModalOverlay from "../components/layout/modalOverlay";
import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import backendAxios from '../components/network/backend'
import Loader from '../components/layout/loader'


import ScrollContainer from 'react-indiana-drag-scroll'
import useDraggableScroll from 'use-draggable-scroll';

export default function Home() {
    const [isSubMap, seIsSubMap] = useState(false);
    const [modalOpen, setModalOpen] = useState(true);
    const laod = async () => {
        const response = await backendAxios.post("/test", {})
        if (response.data.status === "ok") {
            setModalOpen(false)
        }

    }
    useEffect(() => {
        laod()
    }, [])
    return (
        <div
            className={`w-full h-screen flex`}>
            <EditorArea isSubMap={isSubMap} seIsSubMap={seIsSubMap} />
            <ModalOverlay canClose={false} classes="flex" modalOpen={modalOpen} setModalOpen={setModalOpen}>
                <div className="my-auto flex flex-col mx-auto p-8 w-2/5 border-2 border-violet border-dotted bg-violet-light rounded-xl">
                    <div className="text-violet-border text-2xl font-medium mb-2 mx-auto">
                        Ждем ответ от сервера
                        <Loader />
                    </div>

                </div>

            </ModalOverlay>
        </div>
    )
}
