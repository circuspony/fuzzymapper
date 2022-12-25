import { useEffect, useState, useRef } from "react"
import ModalOverlay from "../layout/modalOverlay"

const DataMenu = ({ dataOpen, setDataOpen }) => {

    return (
        <ModalOverlay classes="flex" modalOpen={dataOpen} setModalOpen={setDataOpen}>

            <div className="my-auto flex flex-col mx-auto p-8 w-3/5 border-2 border-violet border-dotted bg-violet-light rounded-xl">
                <div className="text-violet-border text-2xl font-medium mb-2">
                    Анализ и данные
                </div>
                <div className="flex">
                    <div
                        className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mr-8 items-center flex px-8 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                        +Добавить объект
                    </div>
                    <div
                        className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mr-8 items-center flex px-8 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                        +Добавить атрибут
                    </div>
                    <div
                        className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 items-center flex px-8 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                        +Добавить оценку
                    </div>
                </div>
                <div className="grid grid-cols-3 text-violet-border mt-4 font-bold">
                    <div>Имя объекта</div>
                    <div>Эффективность мероприятий</div>
                    <div>Потери</div>
                </div>
                <div className="grid grid-cols-3 text-violet-border mt-2">
                    <div>Брянская область</div>
                    <div>95.73</div>
                    <div>0.12</div>
                </div>
                <div className="grid grid-cols-3 text-violet-border mt-2">
                    <div>Республика Карелия</div>
                    <div>36.66</div>
                    <div>0.06</div>
                </div>
                <div className="grid grid-cols-3 text-violet-border mt-2">
                    <div>Астраханская область</div>
                    <div>34.70</div>
                    <div>0.25</div>
                </div>
                <div className="grid grid-cols-3"></div>
                <div
                    onClick={() => {
                        setDataOpen(false)
                    }}
                    className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mx-auto items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                    Сохранить
                </div>
            </div>
        </ModalOverlay>
    )
}

export default DataMenu 