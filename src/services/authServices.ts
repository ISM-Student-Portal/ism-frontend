import axios from '../utils/axios';




export const resetPassword = async (data: any) => {
    try {
        const reset = await axios.post('/password-reset', data);
        return reset.data;

    } catch (error: any) {
        return error.message
    }
}

export const changepass = async (data: any) => {
    try {
        const reset = await axios.post('/password-update', data);
        return reset.data;

    } catch (error: any) {
        return error.message
    }
}

export const forgotPasswordAction = async (data: any) => {
    try {
        console.log(data)
        const reset = await axios.post('/forgot-password', data);
        return reset.data;

    } catch (error: any) {
        return error.message
    }
}

export const resendVerification = async (id: any) => {
    try {
        const reset = await axios.get(`/email/resend/${id}`);
        return reset.data;

    } catch (error: any) {
        return error.message
    }
}