import '../styles/globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Sidebar>
        <Component {...pageProps} />
      </Sidebar>
    </>
  )
}
