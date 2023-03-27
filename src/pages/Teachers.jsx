import axios from "../axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

const Teachers = () => {
  const [data, setData] = useState();
  const [teacher, setTeacher] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:3000/teachers/all")
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
        axios
          .get("http://localhost:3000/teachers/all")
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => console.log(err));
      });
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
    <div style={{ display: "flex", flexDirection: "column", marginTop: 10 }}>
      <input
        type="text"
        value={teacher}
        onChange={(e) => setTeacher(e.target.value)}
      />
      <button onClick={addTeacher}>Добавить учителя</button>
      {data?.map((e) => (
        <Teacher obj={e} remove={deleteTeacher} />
      ))}
    </div>
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
    <div>
      <div style={{ display: "flex" }}>
        <span>{obj.fullName}</span>
        <DeleteIcon onClick={() => remove(obj._id)} />
        <Button
          onClick={() => {
            setIsHoliday(!isHolday);
            handleClickDeprive();
          }}
        >
          {isHolday ? <>Лешить отпуска</> : <>Отправить в отпуск</>}
        </Button>
      </div>
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
          />
          <Button onClick={handleClick}>Сохранить</Button>
        </>
      )}
    </div>
  );
};
export default Teachers;
