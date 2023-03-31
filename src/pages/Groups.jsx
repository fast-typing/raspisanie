import axios from "../axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

const Groups = () => {
  const [data, setData] = useState();
  useEffect(() => {
    axios
      .get("/groups/all")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const removeGroup = (id) => {
    axios.delete(`/group/${id}`).then(() => {
      axios
        .get("/groups/all")
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err));
    });
  };

  return (
    <main>
      <Group setData={setData} data={data} />

      <div className="groups-container">
        {data?.map((group) => (
          <div className="group-container">
            <h1>{group.name}</h1>
            <button onClick={() => removeGroup(group._id)} className='under-btn'>
              Удалить группу
            </button>
            <Group
              name={group.name}
              academicLoad={group.academic}
              idGroup={group._id}
            />

          </div>
        ))}
      </div>
    </main>
  );
};

const Group = ({ setData, data, name, academicLoad, idGroup }) => {
  const [groupName, setGroupName] = useState(name);
  const [academic, setAcademic] = useState(() => {
    return academicLoad ? academicLoad : [];
  });
  const [isAcademic, setIsAcademic] = useState(false);
  const addGroup = () => {
    axios
      .post("/group/create", {
        name: groupName,
        academic: academic,
      })
      .then(() => {
        axios.get("groups/all").then((res) => {
          setData(res.data);
          setGroupName("");
          setAcademic([]);
          setIsAcademic(false);
        });
      })
      .catch((err) => alert(err.response.data.message));
  };
  const removeDescipline = (id) => {
    const updateAcademic = [...academic];
    updateAcademic.splice(id, 1);
    setAcademic(updateAcademic)
    axios
      .patch(`/group/${idGroup}`, {
        academic: updateAcademic,
      })
      .then(() => {
        axios
          .get("/groups/all")
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => console.log(err));
      });
  };
  const updateAcademic = () => {
    axios.patch(`/group/${idGroup}`, {
      academic: academic,
    });
  };
  const handleClick = () => {
    const isGroupInGroups = data.find((e) => e.name === groupName);
    if (isGroupInGroups) {
      alert("Группа уже существует");
    } else if (groupName) {
      setIsAcademic(!isAcademic);
    } else {
      alert("Введите название группы");
    }
  };

  return (
    <div className="group-container">
      {!academicLoad ? (
        <>
          {" "}
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Введите название группы"
          />
          <button onClick={handleClick}>
            {isAcademic ? (
              <>Отменить</>
            ) : (
              <>Добавить новую группу</>
            )}
          </button>
        </>
      ) : (
        <>
          <Descipline setAcademic={setAcademic} academic={academic} />
          {academic.length > academicLoad.length && (
            <button onClick={updateAcademic} className='under-btn'>
              Сохранить
            </button>
          )}
        </>
      )}
      {isAcademic && groupName && (
        <>
          <h1>{groupName}</h1>
          <Descipline setAcademic={setAcademic} academic={academic} />
        </>
      )}

      {academic?.map((e, id) => (
        <div style={{ border: "1px solid black", marginTop: "10px", borderRadius: 5, padding: 12 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e.descipline} <DeleteIcon sx={{ m: 0 }} onClick={() => removeDescipline(id)} /></h3>
          <h4>
            всего / осталось
            <br />
            {e.hoursAll} ч. / {e.hours} ч.
          </h4>
        </div>
      ))}

      {isAcademic && groupName && academic.length > 0 && (
        <button onClick={addGroup}>Сохранить</button>
      )}
    </div>
  );
};

const Descipline = ({ setAcademic, academic }) => {
  const [descipline, setDescipline] = useState();
  const [hours, setHours] = useState();
  const handleClick = () => {
    if (academic.find((e) => e.descipline === descipline)) {
      alert("Дисциплина уже создана");
    } else if (descipline && hours) {
      setAcademic((prev) => [
        ...prev,
        {
          descipline: descipline,
          hoursAll: +hours,
          hours: +hours,
        },
      ]);
      setDescipline("");
      setHours("");
    } else {
      alert("Укажите все данные");
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <input
        type="text"
        placeholder="Дисциплина"
        value={descipline}
        onChange={(e) => setDescipline(e.target.value)}
      />
      <input
        type="number"
        placeholder="Часы"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <button onClick={handleClick}>Добавить дисциплину</button>
    </div>
  );
};
export default Groups;
