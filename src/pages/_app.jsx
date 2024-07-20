import '../styles/globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
// import { Roboto } from "next/font/google"
import "tw-elements/dist/css/tw-elements.min.css"
import { useRouter } from 'next/router';
// import Context from "../utils/global-context"
// import { AuthProvider } from '../auth/_UseAuth'
import { useAuth, AuthProvider } from '../auth/useAuth'
import { FichaClinicaProvider } from '../context/FichaClinicaContext'
// const roboto = Roboto({ weight: "400", subsets: ["latin"] });
import Cookies from 'js-cookie'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const user = true //Cookies.get("user")
  const noNav = ['/login', '/cadastroUsuario']

  return (
    <div>

      <AuthProvider>
        <FichaClinicaProvider>
          {noNav.includes(router.pathname) ? <Component {...pageProps} />
            :
            <>
              <Header />

              <Sidebar>
                <Component {...pageProps} />
              </Sidebar>
            </>
          }
        </FichaClinicaProvider>
      </AuthProvider>
    </div>
  )
}
