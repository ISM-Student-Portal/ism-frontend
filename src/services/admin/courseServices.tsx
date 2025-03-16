import axios from '../../utils/axios';


export const fetchAllCourses = async () => {
    try {
        const students = await axios.get('/admin/course/all');
        return students.data;

    } catch (error: any) {
        return error.message
    }
}


