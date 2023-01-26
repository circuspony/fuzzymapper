import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryScatter } from 'victory';


const RegressionCard = ({ regression, title = true, pca = false, reverseX = false, reverseY = false }) => {
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
                <div style={{ maxWidth: "30rem" }}>
                    <VictoryChart
                        height={300}
                        width={450}
                        theme={VictoryTheme.material}
                    >
                        <VictoryAxis
                            style={{
                                axisLabel: { fontSize: 12 },
                                tickLabels: { fontSize: 12, padding: 5 }
                            }}
                            orientation="bottom"
                        />

                        <VictoryAxis dependentAxis
                            style={{
                                axisLabel: { fontSize: 12 },
                                tickLabels: { fontSize: 12, padding: 5 }
                            }}
                            orientation="left"

                        />
                        <VictoryLine
                            style={{
                                data: { stroke: "green" },
                                parent: { border: "3px solid #ccc" }
                            }}
                            data={[{ x: 0, y: regression.a }, { x: 1, y: regression.b + regression.a }]}
                        />
                        <VictoryScatter
                            style={{ data: { fill: "blue" } }}
                            size={3}
                            data={regression.x.map((_, xi) => { return { x: regression.x[xi], y: regression.y[xi] } })}
                        />

                    </VictoryChart>
                </div>
            </div>
        </>
    )
}

export default RegressionCard 