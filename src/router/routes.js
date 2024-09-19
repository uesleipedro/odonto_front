export const protectedRoutes = [
    "/",
    "/paciente",
    "/agenda",
    "/api",
    "/financeiro",
    "/fichaClinica",
    "/opcoes",
    "/opcoes/usuario/listaUsuarios",
    "/opcoes/usuario/cadastroUsuarioInterno",
    "/opcoes/nivelAcesso/listaNivelAcesso",
    "/opcoes/nivelAcesso/cadastroNivelAcesso",
    "/opcoes/boleto/credenciais",
    "/usuario"
]
export const authRoutes = ["/login",]
export const publicRoutes = ["/about",
    "/usuario/cadastroUsuario",
    "/fichaClinica/view/orcamentoView/[id_orcamento]",
    "/usuario/redefinirSenha/[email]"
]
export const noNavegable = [
    '/login',
    '/public',
    '/public/cadastroUsuario',
    '/fichaClinica/view/orcamentoView/[id_orcamento]',
    '/public/redefinirSenha/[email]',
    '/fichaClinica/pagamento/view/ReciboPagamento'
]
