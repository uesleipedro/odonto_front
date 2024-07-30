import '../styles/globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import "tw-elements/dist/css/tw-elements.min.css"
import { useRouter } from 'next/router';
// import { AuthProvider } from '../auth/_UseAuth'
import { useAuth, AuthProvider } from '../auth/useAuth'
import { PacienteProvider } from '../context/PacienteContext';
import { FichaClinicaProvider } from '../context/FichaClinicaContext'
// const roboto = Roboto({ weight: "400", subsets: ["latin"] });
import Cookies from 'js-cookie'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const user = true //Cookies.get("user")
  const noNav = ['/login', '/cadastroUsuario', '/view/orcamentoView/[id_orcamento]']

  return (
    <div>

      <AuthProvider>
        <PacienteProvider>
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
        </PacienteProvider>
      </AuthProvider>
    </div>
  )
}
