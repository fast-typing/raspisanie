import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useParams } from "react-router-dom";
import dataPairs from "../pairs";

export default function FullTimeTable() {
  const params = useParams();
  const [allLesons, setAllLesons] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    axios
      .get(`/${params.id}`)
      .then((res) => {
        setAllLesons(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`/teachers/all`)
      .then((res) => {
        setTeachers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const tables = allLesons?.groups?.map((item) => {
    return (
      <div className="table">
        <div className="lessons-of-group">
          <input
            type="text"
            disabled
            value={item.group}
            className="group-name"
          />
          {item.lessons.map((lesson, id) => (
            <div className="lesson">
              {id + 1 === +allLesons?.dataEvent.time && !teacher ? (
                <>
                  {allLesons?.dataEvent.name} <br />
                  {allLesons?.dataEvent.cabinet}
                </>
              ) : (
                lesson.teacher === teacher && (
                  <>
                    {lesson.title} <br /> {lesson.teacher} <br />{" "}
                    {lesson.cabinet}
                  </>
                )
              )}
              {!teacher && (
                <>
                  {lesson.title} <br /> {lesson.teacher} <br /> {lesson.cabinet}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  });

  const pairs = dataPairs.map((item) => {
    return <p>{item} пара</p>;
  });

  return (
    <main>
      <h1 className="title">Расписние на {allLesons?.date}</h1>
      <select name="" id="" onChange={(e) => setTeacher(e.target.value)}>
        <option value="">Учитель</option>
        {teachers?.map((e) => (
          <option value={e.fullName}>{e.fullName}</option>
        ))}
      </select>
      <div className="general-info-container">
        <div className="numbering"> {pairs} </div>
        <div className="tables-container">{tables}</div>
      </div>
    </main>
  );
}
