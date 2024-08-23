import '../styles/globals.css'
import "tw-elements/dist/css/tw-elements.min.css"
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useRouter } from 'next/router';
import { useAuth, AuthProvider } from '../auth/useAuth'
import { PacienteProvider } from '../context/PacienteContext';
import { FichaClinicaProvider } from '../context/FichaClinicaContext'
import MenuHamburger from '../components/MenuHamburger'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const noNav = ['/login', '/usuario/cadastroUsuario', '/fichaClinica/view/orcamentoView/[id_orcamento]', '/usuario/redefinirSenha/[email]']

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
                  <MenuHamburger />
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
