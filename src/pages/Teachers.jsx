import axios from "../axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

const Teachers = () => {
  const [data, setData] = useState();
  const [teacher, setTeacher] = useState("");

  useEffect(() => {
    axios
      .get("/teachers/all")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const addTeacher = () => {
    axios
      .post("/teacher/create", {
        fullName: teacher,
      })
      .then(() => {
        axios.get("teachers/all").then((res) => {
          setData(res.data);
        });
      })
      .catch((err) => alert(err.response.data.message));
  };
  const deleteTeacher = (id) => {
    axios.delete(`/teacher/${id}`).then(() => {
      axios
        .get("/teachers/all")
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err));
    });
  };

  return (
    <main>
      <div className="teachers-add-block">
        <input value={teacher} onChange={(e) => setTeacher(e.target.value)} />

        <button onClick={addTeacher}>Добавить учителя</button>
      </div>

      <div className="teachers-container">
        {data?.map((e) => (
          <Teacher obj={e} remove={deleteTeacher} />
        ))}
      </div>
    </main>
  );
};

const Teacher = ({ obj, remove }) => {
  const [isHolday, setIsHoliday] = useState(() => {
    return obj.holidays.length ? true : false;
  });
  const [startHoliday, setStartHoliday] = useState(() => {
    return (
      obj.holidays.length &&
      obj.holidays[0].slice(0, obj.holidays[0].indexOf("T"))
    );
  });
  const [endHoliday, setEndHoliday] = useState(() => {
    return (
      obj.holidays.length &&
      obj.holidays[obj.holidays.length - 1].slice(
        0,
        obj.holidays[obj.holidays.length - 1].indexOf("T")
      )
    );
  });
  function dateRange(start, end) {
    let range = [];
    start = new Date(start);
    end = new Date(end);
    for (let unix = start.getTime(); unix <= end.getTime(); unix += 86400000) {
      let thisDay = new Date(unix);
      range.push(thisDay);
    }
    return range;
  }
  const handleClick = () => {
    const holidays = dateRange(startHoliday, endHoliday);
    axios.patch(`/teacher/${obj._id}`, {
      holidays: holidays,
    });
  };
  const handleClickDeprive = () => {
    const holidays = dateRange(startHoliday, endHoliday);
    axios.patch(`/teacher/${obj._id}`, {
      holidays: [],
    });
  };
  return (
    <div className="teacher-block w-bl">
      <span>{obj.fullName}</span>
      <DeleteIcon onClick={() => remove(obj._id)} />
      <button
        className="under-btn"
        onClick={() => {
          setIsHoliday(!isHolday);
          handleClickDeprive();
        }}
      >
        {isHolday ? <>Лишить отпуска</> : <>Отправить в отпуск</>}
      </button>
      {isHolday && (
        <>
          <input
            type="date"
            name=""
            id=""
            value={startHoliday}
            onChange={(e) => setStartHoliday(e.target.value)}
          />
          <input
            type="date"
            name=""
            id=""
            value={endHoliday}
            onChange={(e) => setEndHoliday(e.target.value)}
            style={{ marginLeft: 10, marginRight: 10 }}
          />
          <button onClick={handleClick}>Сохранить</button>
        </>
      )}
    </div>
  );
};
export default Teachers;
