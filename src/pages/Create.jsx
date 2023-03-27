import React, { useEffect, useState } from "react";
import TimeTable from "../components/TimeTable";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import data from "../data";

export default function Create() {
  const navigate = useNavigate();
  const [allLesons, setAllLesons] = useState([]);
  const [isCreatEvent, setIsCreatEvent] = useState(false);
  const [eventTime, setEventTime] = useState("");
  const [count, setCount] = useState([""]);
  const [date, setDate] = useState();
  const [dataEvent, setDataEvent] = useState();
  const tables = count.map((item) => {
    return <TimeTable setAllLesons={setAllLesons} setCount={setCount} allLesons={allLesons} date={date} />
  });

  const handleSubmit = () => {
    axios
      .post("/", {
        date: date,
        groups: allLesons,
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert("Ошибка при создании расписания", err);
      });
  };

  function handleChange(event) {
    const { value, name } = event.target;
    setDataEvent((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  }
  const handleClickSaveEvent = () => {
    const newLessons = allLesons;
    newLessons.map((e) => {
      e.lessons.splice(+dataEvent - 1, 1);
    });
    setAllLesons(newLessons);
  };

  const pairs = data.map((item) => {
    return <p>{item} пара</p>;
  });

  return (
    <main>
      <h1>Создание расписания</h1>
      <div className="date">
        <h3 style={{ marginBottom: 5 }}>Выбирете дату</h3>
        <input
          type="date"
          name=""
          id=""
          onChange={(e) => {
            const date = new Date(e.target.value);
            setDate(date.toISOString());
          }}
        />
      </div>

      
      <>
        <div className='general-info-container'>
        <div className={date ? 'disabled' : 'overlay'}>Выбирете дату для начала создания расписания</div>
          <div className="numbering"> {pairs} </div>
          <div className="tables-container">
            {tables}
          </div>
        </div>

        <div className="event-container">
          {isCreatEvent ? (
            <div className="event-block">
              <h3>Создание мероприятия</h3>
              <input
                type="text"
                placeholder="Название"
                onChange={handleChange}
                name="name"
                value={data.cabinet}
              />
              <input
                type="text"
                placeholder="Место / Кабинет"
                onChange={handleChange}
                name="cabinet"
                value={data.cabinet}
              />
              <select onChange={handleChange} value={data.time} name="time">
                <option value="1">1 пара</option>
                <option value="2">2 пара</option>
                <option selected value="3">
                  3 пара
                </option>
                <option value="4">4 пара</option>
                <option value="5">5 пара</option>
                <option selected value="6">
                  6 пара
                </option>
                <option value="7">7 пара</option>
              </select>
              <img
                src="img/close.png"
                alt=""
                className="close-img"
                onClick={() => setIsCreatEvent(false)}
              />
              <button onClick={handleClickSaveEvent}>
                Сохранить мерпориятие
              </button>
            </div>
          ) : (
            <button onClick={() => setIsCreatEvent(true)}>
              Создать мероприятие
            </button>
          )}
        </div>

        <div className="save-btns">
          <button onClick={handleSubmit}>Сохранить</button>
        </div>
      </>

    </main>
  );
}
