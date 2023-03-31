import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../axios";
import dataPairs from "../pairs";

const Profile = () => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [dataEvent, setDataEvent] = useState();
  const userData = useSelector((state) => state.auth.data);
  const [timeTable, setTimeTable] = useState();
  const [timeTableAllGroups, setTimeTableAllGroups] = useState();
  const [data, setData] = useState();
  useEffect(() => {
    axios
      .get("/")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("/groups/all")
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleChange = (e) => {
    const date = new Date(e.target.value).toLocaleString("ru", options);
    const objTimeTable = data.find((e) => e.date == date);
    setTimeTableAllGroups(objTimeTable);
    if (objTimeTable) {
      setDataEvent(objTimeTable.dataEvent);
      if (groupName) {
        setTimeTable(objTimeTable.groups.find((e) => e.group == groupName));
      } else {
        setTimeTable(
          objTimeTable.groups.find((e) => e.group == userData?.groupName)
        );
      }
    } else {
      alert("Расписания не существует");
    }
  };
  const updateGroup = async () => {
    const { data } = await axios.patch(`/user/${userData._id}`, {
      groupName: groupName,
    });

    window.location.reload();
  };
  console.log(timeTable)
  return (
    <main>
      <h1>{userData?.fullName} {userData?.groupName}</h1>
      {userData?.admin && <span style={{ color: "green" }}>Методист</span>}
      {!userData?.admin && (
        <>
          <select
            name="groupName"
            className="group-name"
            onChange={(event) => setGroupName(event.target.value)}
            value={groupName}
          >
            <option value="" disabled hidden>
              Группа
            </option>
            {groups?.map((e) => (
              <option value={e.name}>{e.name}</option>
            ))}
          </select>

          {groupName && <button onClick={updateGroup}>Сохранить</button>}
          <input type="date" onChange={handleChange} />
        </>
      )}

      {timeTable && (
        <div className="tables-container">
          <div className="numbering" style={{ position: "static" }}>
            {dataPairs.map((item) => (
              <p>{item} пара</p>
            ))}
          </div>
          <div className="table">
            <div className="lessons-of-group">
              {timeTable.lessons.map((lesson) => (
                <div className="lesson">
                      <>
                        {lesson.title} <br /> {lesson.teacher} <br />
                        {lesson.cabinet}
                      </>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
