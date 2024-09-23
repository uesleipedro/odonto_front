export const protectedRoutes = [
    "/",
    "/paciente",
    "/agenda",
    "/api",
    "/financeiro",
    "/fichaClinica",
    "/opcoes",
    "/usuario"
]
export const authRoutes = ["/login",]
export const publicRoutes = [
    "/about",
    "/usuario/cadastroUsuario",
    "/fichaClinica/view/orcamentoView/[id_orcamento]",
    "/public/redefinirSenha/[email]"
]
export const noNavegable = [
    '/login',
    '/public/redefinirSenha/[email]',
    '/public',
    '/public/cadastroUsuario',
    '/fichaClinica/view/orcamentoView/[id_orcamento]',
    '/public/redefinirSenha/[email]',
    '/fichaClinica/pagamento/view/ReciboPagamento'
]
