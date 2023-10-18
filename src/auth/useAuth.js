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
                    Cookie.set("user", JSON.stringify({
                        token: response.data.token,
                    }))
                }

                return true
            })
            .catch((error) => {
                return error.message
            })

            console.log('response--->',response)
        return response
    }

    static async logout() {
        Cookie.remove("user")
    }

}
