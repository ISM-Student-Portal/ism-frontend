import axios from '../utils/axios';


export const fetchStudent = async (id: any) => {
    try {
        const reset = await axios.get(`/student/${id}`);
        return reset.data;

    } catch (error: any) {
        return error.message
    }
}

export const studentPay = async (data: any) => {
    try {
        const reset = await axios.post(`/student/${data.id}/pay`, { reference: data.reference, amount: data.amount, plan: data.plan });
        return reset.data;

    } catch (error: any) {
        return error.message
    }
}