import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const DayTitle = styled.h2`
  margin: 2px 0;
  text-align: center;
  background: #CCCCCC;
  display: flex;
  padding: 4px;
`;
const InnerTitle = styled.div`
  flex: 1;
  text-align: center;
`;
const TitleArrow = styled(Link)`
  display: inline-block;
  text-decoration: none;
`;

const Event = styled.div`
  margin: 4px 0;
  background: #EEEEEE;
  padding: 8px;
`;
const Time = styled.div`
  font-weight: bold;
  color: #555555;
`;
const EventTitle = styled.h3`
  margin: 0;
`;

interface ScheduleDayProps {
  day: any;
  previousDay?: string;
  nextDay?: string;
}


const ScheduleDay: React.FC<ScheduleDayProps> = ({ day, previousDay, nextDay }) => {
  return (
    <div>
      <DayTitle>
        {previousDay && <TitleArrow to={`/schedule/${previousDay}`}>&#9664;</TitleArrow>}
        <InnerTitle>{day.day}</InnerTitle>
        {nextDay && <TitleArrow to={`/schedule/${nextDay}`}>&#9654;</TitleArrow>}
      </DayTitle>
      {day.events.map((event: any) => (
        <Event>
          <Time>{event.time}</Time>
          <EventTitle>{event.title}</EventTitle>
          <div>{event.details}</div>
        </Event>
      ))}
    </div>
  );
};

export default ScheduleDay;
