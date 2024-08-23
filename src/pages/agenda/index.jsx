import { useEffect, useState } from 'react'
import RenderCalendar from './RederCalendar';
import api from '../../utils/Api';
import { useAuth } from '../../auth/useAuth';

const agenda = () => {
  const [events, setEvents] = useState([])
  const { user } = useAuth()
  const id_empresa = user?.user?.foundUser.id_empresa

  useEffect(() => {
    getEvents()
  },[user])
  
  const getEvents = async () => {
      await api
        .get(`agenda/${id_empresa}`)
        .then((response) => {
          setEvents([events, ...response.data]);
        })
        .catch(function (error) {
          console.error(error);
        });
  };
  
  return (
    <div>
      <RenderCalendar events={events} updateEvents={getEvents}/>
    </div>
  );
};

export default agenda;
