const BACK_URL = import.meta.env.VITE_URL_BACK;
const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;
const COMMUNITY_URL = import.meta.env.VITE_URL_BACK_COMMUNITY;
const EMPLOYMENTEXCHANGE_URL = import.meta.env.VITE_URL_BACK_EMPLOYMENTEXCHANGE;
const STADISTICS_URL = import.meta.env.VITE_URL_BACK_STADISTICS;

// Login API firebase
export const loginAPI = async (user) => {
    console.log(user, `communicationManager.js`);
    try {
        const response = await fetch(`${BACK_URL}loginAPI`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};


// Create publications
export const postCommunityPublication = async (formData) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}publications`, {
            method: 'POST',
           body: formData,
        });

        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
};

// Get all publications
export const fetchAllUserReports = async () => {
    try {
        const response = await fetch(`${BACK_URL}reports/users`, {
            method: 'GET',
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Fetch a single report user by ID
export const fetchReportUserById = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}reports/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Create a new report user
export const createReportUser = async (reported_user_id, user_id, report) => {
    try {
        const response = await fetch(`${BACK_URL}reports/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reported_user_id, user_id, report }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Update a report user by ID
export const updateReportUser = async (id, status) => {
    try {
        const response = await fetch(`${BACK_URL}reports/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Delete a report user by ID
export const deleteReportUser = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}reports/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: 'Report deleted successfully' };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Fetch all reports comments
export const fetchAllReportsComments = async () => {
    try {
        const response = await fetch(`${BACK_URL}reports/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Fetch a single report comment by ID
export const fetchReportCommentById = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}reports/comments/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Create a new report comment
export const createReportComment = async (comment_id, user_id, report) => {
    try {
        const response = await fetch(`${BACK_URL}reports/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment_id, user_id, report }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Update a report comment by ID
export const updateReportComment = async (id, status) => {
    try {
        const response = await fetch(`${BACK_URL}reports/comments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Delete a report comment by ID
export const deleteReportComment = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}reports/comments/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: 'Report deleted successfully' };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};
