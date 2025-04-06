import React from "react";

const WeeklyCalendar = (props) => {
  const { setEvent, events } = props;
  // weekList：曜日
  const weekList = ["月", "火", "水", "木", "金", "土", "日"];
  // hourList：時間軸
  const hourList = [];
  for (let hour = 6; hour < 24; hour++) {
    hourList.push(
      <div className="hourListItem text-light" key={hour}>
        {hour}
      </div>
    );
  }
  // dayList：日付軸
  const dayList = [];
  for (let day = 0; day < 18; day++) {
    dayList.push(<div className="dayListItem" key={day}></div>);
  }
  const dayLists = [];
  for (let days = 0; days < 7; days++) {
    dayLists.push(
      <div className="dayList" key={days}>
        {dayList}
      </div>
    );
  }

  return (
    <>
      {/* weekTitle：曜日 */}
      <div className="weekTitle">
        {weekList.map((week, index) => {
          return (
            <div className="weekItem text-light" key={index}>
              {week}
            </div>
          );
        })}
      </div>
      {/* weekWrap：内容 */}
      <div className="weekWrap">
        {/* hourList：時間軸 */}
        <div className="hourList">{hourList}</div>
        {/* dayList：日付軸 */}
        {dayLists.map((days) => {
          return days;
        })}
        {/* eventItem：イベント（下に追加していく） */}
        <div className="eventItem">
          <EventBadges events={events} setEvent={setEvent} />
        </div>
      </div>
    </>
  );
};

export default WeeklyCalendar;

// イベントを表示する関数
const EventBadges = (props) => {
  const { events, setEvent } = props;

  // 表示時間定義
  const eventTime = (h1, m1) => `${h1}:${m1}~`;
  // 曜日 場合分け
  const whichDay = (day) => {
    switch (day) {
      case "月":
        return "81%";
      case "火":
        return "67.5%";
      case "水":
        return "54%";
      case "木":
        return "40.5%";
      case "金":
        return "27%";
      case "土":
        return "13.5%";
      case "日":
        return "0";
      default:
        break;
    }
  };
  // 時間 (Top)
  const whichTime = (h1, m1) => `${(Number(h1) - 6) * 60 + Number(m1)}px`;
  // カテゴリ 場合分け
  const whichCate = (category) => {
    switch (category) {
      case "gray":
        return "#d3d3d3";
      case "red":
        return "#ee836f";
      case "pink":
        return "#eebbcb";
      case "yellow":
        return "#f0e68c";
      case "green":
        return "#68be8d";
      case "blue":
        return "#89c3eb";
      case "purple":
        return "#a59aca";
      default:
        break;
    }
  };
  // バッジの高さ
  const whichHeight = (h1, h2, m1, m2) => {
    let x = 0;
    if (m1 <= m2) {
      x = (Number(h2) - Number(h1)) * 60 + (Number(m2) - Number(m1));
      return `${x}px`;
    } else if (m1 > m2) {
      x = (Number(h2) - Number(h1) - 1) * 60 + (60 - Number(m1) + Number(m2));
      return `${x}px`;
    }
  };

  return (
    <>
      {events.map((event) => {
        const { id, title, day, h1, m1, h2, m2, category } = event;
        // posStyle：positionのCSSを当てる
        const posStyle = {
          top: whichTime(h1, m1),
          right: whichDay(day),
          background: whichCate(category),
          height: whichHeight(h1, h2, m1, m2),
        };

        return (
          <div
            style={posStyle}
            key={id}
            className="badge schedule_event"
            onClick={() => setEvent(event)}
          >
            <p>{eventTime(h1, m1)}</p>
            <p>{title}</p>
          </div>
        );
      })}
    </>
  );
};
