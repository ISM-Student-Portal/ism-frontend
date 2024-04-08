import axios from '../../utils/axios';


export const getDashboardStats = async() => {
    try{
    const stats = await axios.get('/dashboard-stats');
    return stats.data;

    }catch (error: any){
        return error.message
    }
}

