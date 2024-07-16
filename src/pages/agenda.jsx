import { useEffect, useState } from 'react'
import RenderCalendar from './RederCalendar';
import api from '../utils/Api'

const agenda = () => {
  const [events, setEvents] = useState([])
 
  useEffect(() => {
    getEvents()
  },[])
  
  const getEvents = async () => {
      await api
        .get("agenda")
        .then((response) => {
          setEvents([events, ...response.data]);
        })
        .catch(function (error) {
          console.error(error);
        });
  };
  
  return (
    <div>
      <RenderCalendar events={events}/>
    </div>
  );
};

export default agenda;
