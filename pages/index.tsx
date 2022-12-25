
import { useEffect, useContext, useState, useRef } from "react"
import Link from 'next/link';
import { useRouter } from 'next/router'
import axios from 'axios'
import MenuContext from "../components/context/menuContext";

export default function Home() {
  const [loadMenu, setLoadMenu] = useState(false);
  const [projects, setProjects] = useState([]);
  const router = useRouter()
  const getMyProjects = async () => {
    const response = await axios.get("/api/showAll")
    setProjects(response.data.data.docs)
    setLoadMenu(true)
  }
  const closeLoaded = () => {
    setLoadMenu(false)
  }
  const { projectId, setProjectId } = useContext(MenuContext)
  return (
    <div
      className={`w-full h-screen flex bg-black bg-opacity-60`}>
      <div className="my-auto flex flex-col mx-auto p-8 w-3/5 border-2 border-violet border-dotted bg-violet-light rounded-xl">
        <div className="text-violet-border text-4xl font-medium">
          {loadMenu ? "Загрузить проект" : "Добро пожаловать!"}
        </div>
        {loadMenu ?
          <div style={{ maxHeight: "400px" }} className="flex flex-col">
            {projects.length ?
              <>
                {projects.map((project) => {
                  return <div
                    onClick={() => {
                      setProjectId(project._id)
                      router.replace("/editor")
                    }}
                    className="flex flex-col mt-8 cursor-pointer w-full text-xl p-1 border-2 border-violet-border rounded-xl bg-violet">
                    <div><span className="font-semibold mr-1">Название:</span><span>{project.name}</span></div>
                    <div><span className="font-semibold mr-1">Дата:</span><span>{`${new Date(project.date).toISOString().split("T")[0]}`}</span></div>
                  </div>
                })}
                <div
                  onClick={() => {
                    closeLoaded()
                  }}
                  className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mx-auto items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                  Вернуться
                </div>
              </>
              :
              <>
                <div className="w-full text-center h-20 mt-16 text-2xl mx-auto text-violet-border">Нет проектов</div>
                <div
                  onClick={() => {
                    closeLoaded()
                  }}
                  className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mx-auto items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                  Вернуться
                </div>
              </>
            }
          </div>
          :
          <div className="flex items-center justify-center my-16 w-full">
            <div onClick={() => {
              setProjectId("")
              router.replace("/editor")
            }}
              className="flex mx-4 flex-col  px-8 border-2 border-violet border-dotted bg-violet-light rounded-xl hover:bg-violet-dark cursor-pointer">
              <div style={{ fontSize: "150px" }} className="">🎨</div>
              <div className="text-2xl mx-auto text-violet-border">Создать</div>
            </div>
            <div
              onClick={() => { getMyProjects() }}
              className="flex mx-4 flex-col px-8 border-2 border-violet border-dotted bg-violet-light rounded-xl hover:bg-violet-dark cursor-pointer">
              <div style={{ fontSize: "150px" }} className="">📁</div>
              <div className="text-2xl mx-auto text-violet-border">Загрузить</div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
