const BACK_URL = import.meta.env.VITE_URL_BACK;
const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;
const COMMUNITY_URL = import.meta.env.VITE_URL_BACK_COMMUNITY;
const EMPLOYMENTEXCHANGE_URL = import.meta.env.VITE_URL_BACK_EMPLOYMENTEXCHANGE;
const STADISTICS_URL = import.meta.env.VITE_URL_BACK_STADISTICS;

// Login API firebase
export const loginAPI = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

// Create publications
export const postCommunityPublication = async (publication) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/publications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(publication),
        });

        console.log(response);
        return response.json();
    } catch (error) {
        console.error(error);
    }
};