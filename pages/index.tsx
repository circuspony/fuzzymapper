
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
  const load = async () => {
    const response = await backendAxios.post("/test", {})
    if (response.data.status === "ok") {
      setModalOpen(false)
    }

  }
  useEffect(() => {
    load()
  }, [])
  return (
    <>
      <div className="w-full h-full flex md:hidden flex-col  bg-violet py-9 px-4 items-center">
        <div className="text-xl font-bold">Извините!</div>
        <div className="text-lg text-center">На данный момент работа с мобильных устройств не поддерживается.</div>
      </div>
      <div
        className={`w-full h-screen hidden md:flex`}>
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
    </>
  )
}
