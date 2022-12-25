import { useEffect, useState, useRef } from "react"
import ModalOverlay from "../layout/modalOverlay"

const IndicatorMenu = ({ modalOpen, setModalOpen, influence, setInfluence }) => {
    return (
        <ModalOverlay classes="flex" modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div className="my-auto flex flex-col mx-auto p-8 w-3/5 border-2 border-violet border-dotted bg-violet-light rounded-xl">
                <div className="text-violet-border text-2xl font-medium mb-2">
                    Влияние фактора:
                </div>
                <input
                    value={influence}
                    onChange={(e) => {
                        setInfluence(e.target.value)
                    }}
                    style={{
                        outline: "none",
                    }}
                    className={`text-xl p-1 border-2 border-violet-border rounded-xl bg-violet`}
                />
                <div
                    onClick={() => {
                        setModalOpen(false)
                    }}
                    className={`h-16 relative noselect z-40 transition-all duration-300 mt-4 mx-auto items-center flex px-16 cursor-pointer text-white font-medium bg-violet-border hover:bg-violet-dark  border-2 border-violet border-dotted rounded-xl`}>
                    Сохранить
                </div>
            </div>
        </ModalOverlay>
    )
}

export default IndicatorMenu 