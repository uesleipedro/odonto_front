import '../styles/globals.css'
import "tw-elements/dist/css/tw-elements.min.css"
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useRouter } from 'next/router';
import { AuthProvider } from '../auth/useAuth'
import { PacienteProvider } from '../context/PacienteContext';
import { FichaClinicaProvider } from '../context/FichaClinicaContext'
import MenuHamburger from '../components/MenuHamburger'
import { noNavegable } from '../router/routes';
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  weight: '300',
  subsets: ['latin'],
})

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const noNav = noNavegable

  return (
    <div className={roboto.className}>
      <AuthProvider>
        <PacienteProvider>
          <FichaClinicaProvider>
            {noNav.includes(router.pathname) ? <Component {...pageProps} />
              :
              <>
                <Header />
                <MenuHamburger />
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
