import { ref } from "vue";
import socketChat from "./socketChat";
import { useRouter } from "vue-router";

const BACK_URL = import.meta.env.VITE_URL_BACK;
const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;
const COMMUNITY_URL = import.meta.env.VITE_URL_BACK_COMMUNITY;
const EMPLOYMENTEXCHANGE_URL = import.meta.env.VITE_URL_BACK_EMPLOYMENT_EXCHANGE;
const STADISTICS_URL = import.meta.env.VITE_URL_BACK_STADISTICS;
const NOTIFICATIONS_URL = import.meta.env.VITE_URL_BACK_NOTIFICATIONS;
const VITE_URL_BACK_CHAT = import.meta.env.VITE_CHATS_URL;

// Login API firebase
export const loginAPI = async (user) => {
    console.log(user, `communicationManager.js`);
    try {
        const response = await fetch(`${BACK_URL}/loginAPI`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create publications
export const postCommunityPublication = async (formdata) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/publications`, {
            method: 'POST',
            body: formdata,
        });

        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const postEmploymentExchangePublication = async (formData) => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/publications`, {
            method: 'POST',
            body: formData,
        });
        console.log(response);
        console.log('response', response);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const fetchMessages = async (chatId) => {
    try {
        const response = await fetch(`${CHAT_URL}/getChat/${chatId}`);
        console.log(`${CHAT_URL}/getChat/${chatId}`);
        const data = await response.json();
        const chatData = ref({});
        chatData.value = data[0];
        chatData.value.userName = chatData.value.user_one_name || 'User';
        chatData.value.interactions = chatData.value.interactions.map((interaction) => ({
            message: interaction.message,
            userId: interaction.userId,
            timestamp: interaction.timestamp
        }));
        console.log('chatData:', chatData.value);
        return chatData;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

export const sendMessageInMongo = async (chatData, currentUser, messageInput) => {
    console.log('sendMessageInMongo:', chatData, currentUser, messageInput);
    const newMessage = {
        message: messageInput,
        userId: currentUser,
        timestamp: new Date().toISOString()
    };

    try {
        await fetch(`${CHAT_URL}/addChat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatData)
        });
        if (typeof messageInput === 'object' && messageInput !== null) {
            messageInput.value = ''; // Clear the input if it's an object
        }
        socket.emit('sendMessage', {
            chatId: chatData._id,
            userId: currentUser,
            message: newMessage.message
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export const fetchChats = async (userId) => {

    const chats = ref([]);
    const chatsInfo = ref(false);

    try {
        const response = await fetch(`${CHAT_URL}/getChats/${userId}`);
        const data = await response.json();
        chats.value = data;
        chatsInfo.value = true;
    } catch (err) {
        console.error('Error al obtener los chats', err);
        chatsInfo.value = false;
    }
    return { chats: chats.value, chatsInfo: chatsInfo.value };
};

export const chatButton = async (userid1, userid2, router) => {
    const newMessage = {
        "user_one_id": userid1,
        "user_two_id": userid2,
        "interactions": [],
        "__v": 0
    };
    console.log(newMessage);
    try {
        const response = await fetch(`${CHAT_URL}/newChat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        router.push('/chatList');
    } catch (error) {
        console.error('Error sending message:', error);
        router.push('/chatList');
    }
};

// Get Community Publications
export const getCommunityPublication = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/publications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Get User Data
export const getUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

//Get Comments in Community Posts
export const getCommunityComments = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

//Post Comments in Community Posts
export const postCommunityComments = async (comment) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(comment),
        });
        console.log(response);
        return response.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchAllUserReports = async () => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users`, {
            method: "GET",
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
        console.log(response.json());
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch a single report user by ID
export const fetchReportUserById = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create a new report user
export const createReportUser = async (reported_user_id, user_id, report) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reported_user_id, user_id, report }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Update a report user by ID
export const updateReportUser = async (id, status) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Delete a report user by ID
export const deleteReportUser = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Report deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch all reports comments
export const fetchAllReportsComments = async () => {
    try {
        const response = await fetch(`${BACK_URL}/reports/comments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch a single report comment by ID
export const fetchReportCommentById = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}7reports/comments/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create a new report comment
export const createReportComment = async (comment_id, user_id, report) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment_id, user_id, report }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Update a report comment by ID
export const updateReportComment = async (id, status) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/comments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Delete a report comment by ID
export const deleteReportComment = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/comments/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Report deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch all reports publications
export const fetchAllReportsPublications = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/reports/publications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch a single report publication by ID
export const fetchReportPublicationById = async (id) => {
    try {
        const response = await fetch(
            `${COMMUNITY_URL}/reports/publications/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create a new report publication
export const createReportPublication = async (
    publication_id,
    user_id,
    report,
    status
) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/reports/publications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ publication_id, user_id, report, status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Update a report publication by ID
export const updateReportPublication = async (id, status) => {
    try {
        const response = await fetch(
            `${COMMUNITY_URL}/reports/publications/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            }
        );

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Delete a report publication by ID
export const deleteReportPublication = async (id) => {
    try {
        const response = await fetch(
            `${COMMUNITY_URL}/reports/publications/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "ReportPublication deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const getNotifications = async (userID) => {
    try {
        const response = await fetch(`${NOTIFICATIONS_URL}/getNotifications?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

export const updateNotificationRevision = async (id) => {
    console.log(NOTIFICATIONS_URL); // Asegúrate de que este valor sea correcto
    console.log(id); // Debe imprimir el ID de la notificación esperada

    try {
        const response = await fetch(`${NOTIFICATIONS_URL}/notifications/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to update notification');
        }
        return response;

    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};

export const getMyPublications = async (userID) => {
    console.log("userID", userID);
    try {
        const response = await fetch(`${COMMUNITY_URL}/getMyPublications?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching my publications:', error);
    }
}

export const getMyPeticions = async (userID) => {
    console.log("userID", userID);
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/getMyPublications?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching my publications:', error);
    }
}