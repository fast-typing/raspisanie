import React, { useEffect, useState } from "react";
import TimeTable from "../components/TimeTable";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import data from "../data";

export default function Create() {
  const navigate = useNavigate();
  const [allLesons, setAllLesons] = useState([]);
  const [isCreatEvent, setIsCreatEvent] = useState(false)
  const [eventTime, setEventTime] = useState('')
  const [count, setCount] = useState([""]);
  const [date, setDate] = useState();

  const tables = count.map((item) => {
    return <TimeTable setAllLesons={setAllLesons} setCount={setCount} allLesons={allLesons} />;
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

  function chengeSelect(event) {
    setEventTime(event.target.value);
  }

  function createEvent() {
    console.log(allLesons)
    allLesons.map(item => {
      console.log(item.lessons[eventTime - 1])
    })
  }

  console.log(allLesons)

  const pairs = data.map(item => {
    return <p>{item} пара</p>
  })

  return (
    <main>
      <h1>Создание расписания</h1>

      <div className="tables-container">
        <div className="numbering">
          {pairs}
        </div>
        {tables}
      </div>

      <div className="event-container">
        {
          isCreatEvent ?
            <div className="event-block">
              <h3>Создание мероприятия</h3>
              <input
                type="text"
                placeholder="Название"
                // onChange={handleChange}
                name="cabinet"
              // value={data.cabinet}
              />
              <input
                type="text"
                placeholder="Место / Кабинет"
                // onChange={handleChange}
                name="cabinet"
              // value={data.cabinet}
              />
              <select onChange={chengeSelect}>
                <option value="1">1 пара</option>
                <option value="2">2 пара</option>
                <option selected value="3">3 пара</option>
                <option value="4">4 пара</option>
                <option value="5">5 пара</option>
                <option selected value="6">6 пара</option>
                <option value="7">7 пара</option>
              </select>
              <button onClick={createEvent}>Готово</button>
              <img src="img/close.png" alt="" className="close-img" onClick={() => setIsCreatEvent(false)} />
            </div> :
            <button onClick={() => setIsCreatEvent(true)}>Создать мероприятие</button>
        }
      </div>

      <div className="save-btns">
        <div className="date">
          <h3 style={{ marginBottom: 0 }}>Выбирете дату</h3>
          <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <button onClick={handleSubmit}>Сохранить</button>
      </div>
    </main>
  );
}
