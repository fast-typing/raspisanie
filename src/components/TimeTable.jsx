import React, { useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import axios from "../axios";
function TimeTable({ setAllLesons, setCount, allLesons, date }) {
  const [isFill, setIsFill] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isMax, setIsMax] = useState(false);
  const [anyError, setAnyError] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [lessons, setLessons] = useState([]);
  const [teachers, setTeachers] = useState();
  const [data, setData] = useState({
    title: "",
    teacher: "",
    cabinet: "",
  });
  const table = lessons.map((item) => {
    return (
      <div className="lesson">
        {item.title} <br /> {item.teacher} <br /> {item.cabinet}
      </div>
    );
  });

  function handleChange(event) {
    const { value, name } = event.target;
    if (
      name === "teacher" &&
      teachers
        .find((teacher) => teacher.fullName === value)
        .holidays.includes(date)
    ) {
      alert("Учитель в отпуске");
    } else {
      setData((prevData) => {
        return {
          ...prevData,
          [name]: value,
        };
      });
    }
  }

  function addLesson() {
    setLessons((prevLessons) => [...prevLessons, data]);
    setData({
      title: "",
      teacher: "",
      cabinet: "",
    });
  }

  function clearLessons() {
    setLessons([]);
  }

  function CreateComplete() {
    for (let i = lessons.length; i < 6; i++) {
      setLessons((prevLessons) => [...prevLessons, []]);
    }

    const inputBlock = document.querySelectorAll(".inputs");
    inputBlock.forEach((item) => (item.style.display = "none"));

    setAllLesons((prevAllLesons) => [
      ...prevAllLesons,
      { group: groupName, lessons: lessons },
    ]);
    setIsSend(true);
    setCount((prevCount) => [...prevCount, ""]);
  }

  function SkipLesson() {
    setLessons((prevLessons) => [...prevLessons, []]);
  }

  useEffect(() => {
    axios
      .get("/teachers/all")
      .then((res) => {
        setTeachers(res.data);
      })
      .catch((err) => console.log(err));
  }, [])

  useEffect(() => {
    if (
      data.cabinet.length > 0 &&
      data.teacher.length > 0 &&
      data.title.length > 0 &&
      lessons.length < 6
    ) {
      if (allLesons.length === 0) {
        setIsFill(true);
      }

      let j = lessons.length;

      for (let i = 0; i < allLesons.length; i++) {
        if (allLesons[i]?.lessons === undefined) {
          setIsFill(true);
        } else {
          if (
            allLesons[i].lessons[j]?.teacher === data.teacher ||
            allLesons[i].lessons[j]?.cabinet === data.cabinet
          ) {
            setIsFill(false);
            setAnyError(true);
            break;
          } else {
            setIsFill(true);
            setAnyError(false);
            // errorText.style.display = 'none'
          }
        }
      }
    } else {
      setIsFill(false);
    }

    if (groupName.length > 0) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    if (lessons.length > 5) {
      setIsMax(true);
    }
  }, [data, lessons, groupName]);

  return (
    <>
      {!isCreating ? (
        <button
          className="create-new-timetable-btn"
          onClick={() => setIsCreating(true)}
        >
          Создать новое расписание
          <AddRoundedIcon style={{ marginTop: 10 }} />
        </button>
      ) : (
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
            {table.length ? table : "Расписание пусто"}
          </div>

          <div className="inputs">
            {anyError && (
              <div className="error" style={{ marginBottom: 10 }}>
                Данный учитель или кабинет уже заняты!
              </div>
            )}

            <input
              type="text"
              placeholder="Предмет"
              onChange={handleChange}
              name="title"
              value={data.title}
            />
            {/* <input
              type="text"
              placeholder="Учитель"
              onChange={handleChange}
              name="teacher"
              value={data.teacher}
            /> */}
            <select
              name="teacher"
              id=""
              onChange={handleChange}
              value={data.teacher}
            >
              <option value="" disabled hidden>
                Учитель
              </option>
              {teachers?.map((e) => (
                <option value={e.fullName}>{e.fullName}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Кабинет"
              onChange={handleChange}
              name="cabinet"
              value={data.cabinet}
            />

            <div className="inputs__bottom">
              <button disabled={isMax} onClick={clearLessons}>
                Очистить все
              </button>
              <button
                disabled={!isFill}
                onClick={() => addLesson()}
                className="plus-btn hint-right"
                data-hint="Заполните все поля выше"
                id="add"
              >
                <AddRoundedIcon />
              </button>
            </div>

            <button onClick={SkipLesson} disabled={isMax} className="under-btn">
              Пропустить
            </button>
            <button
              onClick={CreateComplete}
              disabled={!isCorrect}
              data-hint='Заполните поле "Группа"'
              className="hint-right"
            >
              Закончить
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TimeTable;
