import { LoginData, RegisterData } from "@/app/(auth)/schema"
import axios from "../api/axios"
import { API } from "../api/endpoints"


export const register = async (registerData: RegisterData) => {
    try {
        const response = await axios.post(API.AUTH.REGISTER, registerData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
}

export const login = async (loginData: LoginData) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData, {
            withCredentials: true,
        });
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
}