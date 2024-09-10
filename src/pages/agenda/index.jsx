import { useEffect, useState } from 'react'
import RenderCalendar from './RederCalendar';
import api from '../../utils/Api';
import { useAuth } from '../../auth/useAuth';
import LoadingOverlay from '../../components/LoadingOverlay';

const agenda = () => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const id_empresa = user?.user?.foundUser.id_empresa

  useEffect(() => {
    getEvents()
  }, [user])

  const getEvents = async () => {
    setIsLoading(true)
    await api
      .get(`agenda/${id_empresa}`)
      .then((response) => {
        setEvents([events, ...response.data])
      })
      .catch(function (error) {
        console.error(error)
      })
    setIsLoading(false)
  };

  return (
    <div>
      <LoadingOverlay isLoading={isLoading} />
      <RenderCalendar events={events} updateEvents={getEvents} />
    </div>
  )
}

export default agenda
