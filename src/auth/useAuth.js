import api from "../utils/Api"
import Cookie from 'js-cookie'

export default class UseAuth {
    static async login({ user, passwd }) {
        if (typeof user !== "string" || typeof passwd !== "string") {
            alert(`preencha os campos corretamente`)
            return
        }

        const response = await api.post('user/login', { email: user, senha: passwd })
            .then((response) => {
                if (response.status === 201) {
                    Cookie.set("jwt", response.data.token)

                    return true
                } else if (response.status === 500) {
                    return false
                }

            })
            .catch((error) => {
                console.error(error.message)
                return false
            })
        return response
    }

    static async logout() {
        Cookie.remove("jwt")
    }

}
