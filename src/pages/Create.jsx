import React, { useEffect, useState } from "react";
import TimeTable from "../components/TimeTable";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import dataPairs from "../pairs";

export default function Create() {
  const navigate = useNavigate();
  const [allLesons, setAllLesons] = useState([]);
  const [isCreatEvent, setIsCreatEvent] = useState(false);
  const [count, setCount] = useState([""]);
  const [date, setDate] = useState();
  const [dataEvent, setDataEvent] = useState({
    name: "",
    cabinet: "",
    time: "1",
  });
  const [groups, setGroups] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };

  const tables = count.map((item, id) => {
    return (
      <>
        <TimeTable
          setAllLesons={setAllLesons}
          setCount={setCount}
          allLesons={allLesons}
          date={new Date(date)}
          dataEvent={groupNames?.includes(allLesons[id]?.group) && dataEvent}
        />
      </>
    );
  });

  const handleSubmit = () => {
    allLesons.map((e) => {
      const group = groups.find((group) => group.name == e.group);
      let newAcademic = [];
      let obj;
      e.lessons.map((lesson) => {
        obj = group.academic.find((item) => item.descipline === lesson.title);
        if (obj !== undefined) {
          if (newAcademic.find((e) => e.descipline == obj.descipline)) {
            console.log(1);
            newAcademic.find((e) => e.descipline == obj.descipline).hours =
              newAcademic.find((e) => e.descipline == obj.descipline).hours - 2;
          } else {
            newAcademic.push({
              descipline: obj.descipline,
              hours: obj.hours - 2,
              hoursAll: obj.hoursAll,
            });
          }
        }
      });

      group.academic.map((academ) => {
        if (!newAcademic.find((e) => e.descipline === academ.descipline)) {
          newAcademic.push(academ);
        }
      });
      axios.patch(`/group/${group._id}`, {
        academic: newAcademic,
      });
    });

    const newDate = new Date(date);
    if (dataEvent) {
      axios
        .post("/", {
          date: newDate.toLocaleString("ru", options),
          groups: allLesons,
          dataEvent: {
            name: dataEvent.name,
            cabinet: dataEvent.cabinet,
            time: dataEvent.time,
            groupNames: groupNames,
          },
        })
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          alert("•Заполните все поля \n•Расписание на эту дату уже создано");
          console.log(err);
        });
    } else {
      axios
        .post("/", {
          date: newDate.toLocaleString("ru", options),
          groups: allLesons,
        })
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          alert("•Заполните все поля \n•Расписание на эту дату уже создано");
          console.log(err);
        });
    }
  };

  const handleChangeGroup = (event) => {
    const {
      target: { value },
    } = event;
    setGroupNames(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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

  const pairs = dataPairs.map((item) => {
    return <p>{item} пара</p>;
  });

  useEffect(() => {
    axios
      .get("/groups/all")
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <main>
      <h1 className="title">Создание расписания</h1>
      <input
        type="date"
        name=""
        id=""
        onChange={(e) => {
          const date = new Date(e.target.value);
          setDate(date.toISOString());
        }}
      />

      <div className="general-info-container">
        <div className={date ? "disabled" : "overlay"}>
          Выбирете дату для начала создания расписания
        </div>
        <div className="numbering"> {pairs} </div>
        <div className="tables-container">{tables}</div>
      </div>

      <div className="event-container">
        {isCreatEvent ? (
          <>
            <h3>Создание мероприятия</h3>

            <div className="event-block">
              <input
                type="text"
                placeholder="Название"
                onChange={handleChange}
                name="name"
                value={dataEvent.name}
              />
              <input
                type="text"
                placeholder="Место / Кабинет"
                onChange={handleChange}
                name="cabinet"
                value={dataEvent.cabinet}
              />
              <select
                onChange={handleChange}
                value={dataEvent.time}
                name="time"
              >
                <option value="1">1 пара</option>
                <option value="2">2 пара</option>
                <option value="3">3 пара</option>
                <option value="4">4 пара</option>
                <option value="5">5 пара</option>
                <option value="6">6 пара</option>
                <option value="7">7 пара</option>
              </select>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Группы
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={groupNames}
                  onChange={handleChangeGroup}
                  input={<OutlinedInput label="Группы" />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {groups.map((group) => (
                    <MenuItem key={group.name} value={group.name}>
                      <Checkbox checked={groupNames.indexOf(group.name) > -1} />
                      <ListItemText primary={group.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <button
                className="under-btn"
                onClick={() => {
                  setIsCreatEvent(false);
                  setDataEvent({
                    name: "",
                    cabinet: "",
                    time: "1",
                  });
                }}
              >
                Отмена
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => setIsCreatEvent(true)}>
            Создать мероприятие
          </button>
        )}
      </div>

      <div className="save-btns">
        <button onClick={handleSubmit}>Сохранить</button>
      </div>
    </main>
  );
}
