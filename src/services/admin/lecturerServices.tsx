import axios from '../../utils/axios';


export const fetchAllLecturers = async () => {
    try {
        const students = await axios.get('/admin/lecturers');
        return students.data;

    } catch (error: any) {
        return error.message
    }
}


export const getDashboardStats = async () => {
    try {
        const stats = await axios.get('/lecturer/dashboard-stats');
        return stats.data;

    } catch (error: any) {
        return error.message
    }
}

export const fetchAllCourses = async () => {
    try {
        const courses = await axios.get('/lecturer/courses');
        return courses.data;

    } catch (error: any) {
        return error.message
    }
}

export const fetchAllClasses = async () => {
    try {
        const courses = await axios.get('/lecturer/all-classrooms');
        return courses.data;

    } catch (error: any) {
        return error.message
    }
}

export const fetchAllAssignments = async () => {
    try {
        const courses = await axios.get('/lecturer/all-assignments');
        return courses.data;

    } catch (error: any) {
        return error.message
    }
}

export const fetchCourseById = async (id: any) => {
    try {
        const course = await axios.get('/lecturer/courses/' + id);
        return course.data;

    } catch (error: any) {
        return error.message
    }
}
