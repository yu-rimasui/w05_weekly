"use client";
import "bootstrap/dist/css/bootstrap.min.css";

import WeeklyCalendar from "@/component/WeeklyCalendar";
import { AddEventModal } from "@/component/EventModal";

const API_ENDPOINT =  "/api/event";

import React, { useState, useEffect } from "react";

const App = () => {
  // モーダルの開閉
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // イベントのデータ
  const [events, setEvents] = useState([]);
  const initEvent = {
    id: null,
    title: "",
    day: "",
    h1: "",
    m1: "",
    h2: "",
    m2: "",
    category: "",
  };
  const [event, setEvent] = useState(initEvent);

  // フェッチ
  let isFirst = false;

  useEffect(() => {
    if (!isFirst && event.id !== null) {
      setShow(true);
    }
  }, [event]);

  useEffect(() => {
    fetchEvent();
  }, []);

  // イベント取得（GET）
  const fetchEvent = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}`, {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        console.log("取得：", data);
      } else {
        console.error("取得に失敗しました");
      }
    } catch (error) {
      console.error("取得エラー：", error);
    }
  };
  
  // イベント追加（POST）
  const addEvent = async (title: string, day: string, h1: string, m1: string, h2: string, m2: string, category: string) => {
    const id = new Date().toISOString();
    const body = {
      method: "POST",
      id, title, day, h1, m1, h2, m2, category,
    };
  
    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      fetchEvent();
    } catch (error) {
      console.error("追加エラー：", error);
    }
  };
  
  // イベント削除（DELETE）
  const deleteEvent = async (id: string) => {
    try {
      await fetch(`${API_ENDPOINT}/${id}`, {
        method: "DELETE",
      });
      fetchEvent();
    } catch (error) {
      console.error("削除エラー：", error);
    }
  };
  
  // イベント更新（PUT）
  const editEvent = async (id: string, title: string, day: string, h1: string, m1: string, h2: string, m2: string, category: string) => {
    const body = {
      method: "PUT",
      id,
      title,
      day,
      h1,
      m1,
      h2,
      m2,
      category,
    };
  
    try {
      const res = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      fetchEvent();
    } catch (error) {
      console.error("更新エラー：", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#333" }}>
      <div className="d-flex justify-content-between">
        <div>
          <h1 className="mt-3 ms-3 text-light fst-italic">Weekly Schedule</h1>
        </div>
        <div className="eventBtnWrap">
          <button className="btn btn-secondary eventBtn" onClick={handleShow}>
            予定追加
          </button>
        </div>
      </div>
      <AddEventModal
        show={show}
        modalClose={modalClose}
        addEvent={addEvent}
        deleteEvent={deleteEvent}
        editEvent={editEvent}
        event={event}
        setEvent={setEvent}
        initEvent={initEvent}
      />
      <div className="weeklyCalendar">
        <WeeklyCalendar events={events} setEvent={setEvent} />
      </div>
    </div>
  );
};

export default App;
