import React, { useEffect, useState } from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";

export const AddEventModal = (props) => {
  // フォーム表示用のハコ
  const initForm = {
    title: "",
    day: "月",
    h1: "06",
    m1: "00",
    h2: "07",
    m2: "00",
    category: "gray",
  };
  const [form, setForm] = useState(initForm);

  // App.jsxでeventが更新されたらformの値も更新する
  useEffect(() => {
    const { id, title, day, h1, m1, h2, m2, category } = props.event;
    if (id !== null) {
      setForm({
        title: title,
        day: day,
        h1: h1,
        m1: m1,
        h2: h2,
        m2: m2,
        category: category,
      });
    } else {
      setForm(initForm);
    }
  }, [props.event]);

  // handleInputChange：フォーム変更でデータ保持
  const handleInputChange = (e) => {
    // nameは属性、valueは入力値
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // handleClose：モーダル閉じる関数
  const handleClose = () => {
    props.modalClose();
    setForm(initForm);
    props.setEvent(props.initEvent);
  };

  // handleSubmit：formをeventに保存する関数
  const handleSubmit = () => {
    console.log(form);
    const { title, day, h1, m1, h2, m2, category } = form;

    if (title === "") {
      return alert("イベントタイトルが入力されていません");
    } else if (
      Number(h1) > Number(h2) ||
      (Number(h1) == Number(h2) && Number(m1) > Number(m2))
    ) {
      return alert("時間軸が歪んでいます");
    }
    if (props.event.id === null) {
      props.addEvent(title, day, h1, m1, h2, m2, category);
    } else {
      props.editEvent(props.event.id, title, day, h1, m1, h2, m2, category);
    }
    handleClose();
  };

  // handleDelete：指定したeventを削除する関数
  const handleDelete = () => {
    props.deleteEvent(props.event.id);
    handleClose();
  };

  // 曜日のoption
  const optionDay = () => {
    const days = ["月", "火", "水", "木", "金", "土", "日"];
    const option = days.map((day, index) => {
      return (
        <option key={index} value={day}>
          {day}
        </option>
      );
    });
    return option;
  };
  // 時間のoptionHour
  const optionHour = () => {
    const option = [];
    let index = 1;
    for (let h = 6; h < 24; h++) {
      const hour = `${String(h).padStart(2, "0")}`;
      option.push(
        <option key={index} value={hour}>
          {hour}
        </option>
      );
      index++;
    }
    return option;
  };
  // 時間のoptionMinutes
  const optionMinutes = () => {
    const option = [];
    let index = 1;
    for (let m = 0; m < 60; m++) {
      if (m % 5 == 0) {
        const minutes = `${String(m).padStart(2, "0")}`;
        option.push(
          <option key={index} value={minutes}>
            {minutes}
          </option>
        );
        index++;
      }
    }
    return option;
  };
  // カテゴリのoption
  const optionCate = () => {
    const cates = ["gray", "red", "pink", "yellow", "green", "blue", "purple"];
    const option = cates.map((cate, index) => {
      return (
        <option key={index} value={cate}>
          {cate}
        </option>
      );
    });
    return option;
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="eventModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>
              {props.event.id === null ? "予定の追加" : "予定の編集・削除"}
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <Form.Group>
              <Form.Control
                type="text"
                className="fs-5"
                name="title"
                placeholder="タイトル"
                defaultValue={form.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <InputGroup>
                <Form.Select
                  name="day"
                  defaultValue={form.day}
                  onChange={handleInputChange}
                >
                  {optionDay()}
                </Form.Select>
                <Form.Select
                  name="h1"
                  defaultValue={form.h1}
                  onChange={handleInputChange}
                >
                  {optionHour()}
                </Form.Select>
                <span className="p-1">:</span>
                <Form.Select
                  name="m1"
                  defaultValue={form.m1}
                  onChange={handleInputChange}
                >
                  {optionMinutes()}
                </Form.Select>
                <span className="p-1">-</span>
                <Form.Select
                  name="h2"
                  defaultValue={form.h2}
                  onChange={handleInputChange}
                >
                  {optionHour()}
                </Form.Select>
                <span className="p-1">:</span>
                <Form.Select
                  name="m2"
                  defaultValue={form.m2}
                  onChange={handleInputChange}
                >
                  {optionMinutes()}
                </Form.Select>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Select
                name="category"
                defaultValue={form.category}
                onChange={handleInputChange}
              >
                {optionCate()}
              </Form.Select>
            </Form.Group>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          {props.event.id === null ? (
            <>
              <Button variant="secondary" onClick={handleClose}>
                ✖
              </Button>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                追加
              </Button>
            </>
          ) : (
            <>
              <Button variant="danger" onClick={handleDelete}>
                削除
              </Button>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                編集
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
