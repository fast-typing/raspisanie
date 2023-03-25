import React, { useEffect, useState } from "react"
import AddRoundedIcon from '@mui/icons-material/AddRounded';

function TimeTable({ setAllLesons, setCount }) {
    const [isFill, setIfFill] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [isSend, setIsSend] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [lessons, setLessons] = useState([])
    const [data, setData] = useState({
        title: '',
        teacher: '',
        cabinet: '',
    })

    const table = lessons.map(item => {
        return <div className="lesson">{item.title} <br /> {item.teacher} <br /> {item.cabinet}</div>
    })


    function handleChange(event) {
        const { value, name } = event.target
        setData(prevData => {
            return {
                ...prevData,
                [name]: value,
            }
        })
    }

    function addLesson() {
        setLessons(prevLessons => [...prevLessons, data])
        setData({
            title: '',
            teacher: '',
            cabinet: ''
        })
    }

    function clearLessons() {
        setLessons([])
    }

    function CreateComplete() {
        for (let i = lessons.length; i < 4; i++) {
            setLessons(prevLessons => [...prevLessons, []])
        }

        const inputBlock = document.querySelectorAll('.inputs')
        inputBlock.forEach(item =>
            item.style.display = 'none'
        )

        setAllLesons(prevAllLesons => [...prevAllLesons, { [groupName]: lessons }])
        setIsSend(true)
        setCount(prevCount => [...prevCount, ''])
    }

    useEffect(() => {
        if (data.cabinet.length > 0 && data.teacher.length > 0 && data.title.length > 0 && lessons.length < 4) {
            setIfFill(true)
        } else {
            setIfFill(false)
        }

        if (groupName.length > 0) {
            setIsCorrect(true)
        } else {
            setIsCorrect(false)
        }
    }, [data, lessons, groupName])

    return (
        <>
            {
                !isCreating ?
                    <button className="create-new-timetable-btn" onClick={() => setIsCreating(true)}>
                        Создать новое расписание
                        <AddRoundedIcon style={{ marginTop: 10 }} />
                    </button>
                    :
                    <div className="table">
                        <div className="lessons-of-group">
                            <input
                                type="text"
                                placeholder="Группа"
                                onChange={(event) => setGroupName(event.target.value)}
                                name="groupName"
                                className="group-name"
                                disabled={isSend}
                            />
                            {table.length ? table : 'Расписание пусто'}
                        </div>

                        <div className="inputs">
                            <input
                                type="text"
                                placeholder="Предмет"
                                onChange={handleChange}
                                name="title"
                                value={data.title}
                            />
                            <input
                                type="text"
                                placeholder="Учитель"
                                onChange={handleChange}
                                name="teacher"
                                value={data.teacher}
                            />
                            <input
                                type="text"
                                placeholder="Кабинет"
                                onChange={handleChange}
                                name="cabinet"
                                value={data.cabinet}
                            />
                            <div className="inputs__bottom">
                                <button onClick={clearLessons}>Очистить список</button>
                                <button disabled={!isFill} onClick={() => addLesson()} className='plus-btn hint-right' data-hint='Заполните все поля выше'>
                                    <AddRoundedIcon />
                                </button>
                            </div>
                            <button onClick={CreateComplete} disabled={!isCorrect} data-hint='Введите название группы' className='hint-right'>Готово</button>
                        </div>
                    </div>
            }
        </>
    )
}

export default TimeTable