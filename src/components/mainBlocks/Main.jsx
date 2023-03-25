import React, { useState } from "react"
import TimeTable from "../blocks/TimeTable"

export default function Header() {
    const [allLesons, setAllLesons] = useState([])
    const [count, setCount] = useState([''])

    const tables = count.map(item => {
        return <TimeTable setAllLesons={setAllLesons} setCount={setCount} />
    })

    return (
        <main>
            <div className="numbering">
                <p>1 пара</p>
                <p>2 пара</p>
                <p>3 пара</p>
                <p>4 пара</p>
            </div>

            <div className="tables">
                {tables}
            </div>
        </main>
    )
}
