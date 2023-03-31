import React, { useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import axios from "../axios";

function TimeTable({ setAllLesons, setCount, allLesons, date, dataEvent }) {
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
  const [academic, setAcademic] = useState([]);
  const [groups, setGroups] = useState([]);
  console.log(groups)
  const table = lessons.map((item, id) => {
    return (
      <div className="lesson">
        {+dataEvent.time - 1 === id ? (
          <>
            {dataEvent.name} <br />
            {dataEvent.cabinet}
          </>
        ) : (
          <>
            {item.title} <br /> {item.teacher} <br /> {item.cabinet}
          </>
        )}
      </div>
    );
  });

  function handleChange(event) {

    const { value, name } = event.target;
    if (
      name === "teacher" &&
      teachers
        .find((teacher) => teacher.fullName === value)
        .holidays.includes(date.toISOString())
    ) {
      alert("Учитель в отпуске");
    } else if (name == 'title') {
      const obj = groups.find((e) => e.name == groupName)
      const hours = obj.academic.find((e) => e.descipline === value).hours
      if (hours == 0 || hours < 0) {
        alert('У группы закончалсь нагрузка на ' + value)
      } else {
        setData((prevData) => {
          return {
            ...prevData,
            [name]: value,
          };
        });
      }
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
    let fullLessons = lessons;
    for (let i = fullLessons.length; i < 6; i++) {
      fullLessons.push({});
    }
    const inputBlock = document.querySelectorAll(".inputs");
    inputBlock.forEach((item) => (item.style.display = "none"));
    setAllLesons((prevAllLesons) => [
      ...prevAllLesons,
      { group: groupName, lessons: fullLessons },
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
    axios
      .get("/groups/all")
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => console.log(err));

    if (
      data.cabinet.length > 0 &&
      data.teacher.length > 0 &&
      data.title.length > 0 &&
      lessons.length < 7
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

    if (groupName) {
      const newAcademic = groups.find(
        (group) => group.name === groupName
      ).academic;
      setAcademic(newAcademic);
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
            <select
              name="groupName"
              className="group-name"
              onChange={(event) => {
                if (allLesons.find((e) => e.group === event.target.value)) {
                  alert("Группа уже создана");
                } else {
                  setGroupName(event.target.value);
                }
              }}
              value={groupName}
              disabled={isSend}
            >
              <option value="" disabled hidden>
                Группа
              </option>
              {groups?.map((e) => (
                <option value={e.name}>{e.name}</option>
              ))}
            </select>
            {!groupName && (
              <span className="error-groupName">Выберите группу</span>
            )}
            {table}
          </div>

          {groupName && (
            <div className="inputs">
              {anyError && (
                <div className="error" style={{ marginBottom: 10 }}>
                  Данный учитель или кабинет уже заняты!
                </div>
              )}
              <select
                name="title"
                id=""
                onChange={handleChange}
                value={data.title}
              >
                <option value="" disabled hidden>
                  Предмет
                </option>
                {academic?.map((e) => (
                  <option value={e.descipline}>{e.descipline}</option>
                ))}
              </select>
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
                  // let text = `${e?.fullName?.split(" ")[0]} ${
                  //   e?.fullName?.split(" ")[1][0]
                  // }. ${e?.fullName?.split(" ")[2][0]}.`;
                  <option value={e?.fullName}>{e.fullName}</option>
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

              <button
                onClick={SkipLesson}
                disabled={isMax}
                className="under-btn"
              >
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
          )}
        </div>
      )}
    </>
  );
}

export default TimeTable;
