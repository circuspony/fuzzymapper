import { useEffect, useState, useRef } from "react"
import axios from 'axios'


const RegressionCard = ({ regression, title = true }) => {

    return (
        <>
            <div className="relative z-10 flex flex-col">
                {title ? <>
                    <div className="text-lg text-violet-border mt-4 font-bold mb-1">{"Вход: " + regression.from}</div>
                    <div className="text-lg text-violet-border font-bold mb-1">{"Выход: " + regression.to}</div>
                </> : null}
                <div className="text-lg mt-1 font-bold mb-1">Параметры</div>
                <div className=" mb-1">{"Коэффициент регрессии: " + regression.b}</div>
                <div className=" mb-1">{"Коэффициент Фишера: " + regression.F}</div>
                <div className="relative z-10 mb-1">{"P-значение: " + regression.p}</div>
                <div className="relative z-10 mb-1">{"Коэффициент детерминации: " + regression.r2}</div>
                {/* <img className="w-30 z-0 relative -mt-8 -ml-8" src={"http://localhost:5000/" + regression.fname} /> */}

            </div>
        </>
    )
}

export default RegressionCard 