import { useEffect, useState, useRef } from "react"
import ModalOverlay from "../layout/modalOverlay"

const IndicatorChoiceList = ({ modalOpen, setModalOpen, indicatorChoiceId, addIndicator, objectData }) => {
    return (
        <ModalOverlay classes="flex" modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div className="my-auto flex flex-col mx-auto p-8 w-3/5 border-2 border-violet border-dotted bg-violet-light rounded-xl">
                <div className="text-violet-border text-2xl font-medium mb-2">
                    Выберите индикатор:
                </div>
                <div className="flex-col">
                    {objectData.map((indicator) =>
                        <div
                            onClick={() => {
                                addIndicator(indicatorChoiceId, indicator)
                                setModalOpen(false)
                            }}
                            className="text-black cursor-pointer">{indicator.title}</div>
                    )}
                </div>
                <div
                    onClick={() => {
                        setModalOpen(false)
                    }}
                    className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mx-auto items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                    Закрыть
                </div>
            </div>
        </ModalOverlay>
    )
}

export default IndicatorChoiceList 