import '../styles/globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
// import { Roboto } from "next/font/google"
import "tw-elements/dist/css/tw-elements.min.css"

// const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <Sidebar>
        <Component {...pageProps} />
      </Sidebar>
    </div>
  )
}
