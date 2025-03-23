import axios from '../../utils/axios';


export const fetchAllCourses = async () => {
    try {
        const students = await axios.get('/admin/course/all');
        return students.data;

    } catch (error: any) {
        return error.message
    }
}

export const createCourse = async (data: any) => {
    try {
        const stats = await axios.post('/admin/course/create', data);
        return stats.data;

    } catch (error: any) {
        return error.message
    }
}

export const updateCourse = async (data: any, id: string) => {
    try {
        const stats = await axios.patch('/admin/course/update/' + id, data);
        return stats.data;

    } catch (error: any) {
        return error.message
    }
}

export const deleteCourse = async (id: any) => {
    try {
        const stats = await axios.delete('/admin/course/delete/' + id);
        return stats.data;

    } catch (error: any) {
        return error.message
    }
}


