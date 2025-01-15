import { ref } from "vue";
import socketChat from "./socketChat";
import { useRouter } from "vue-router";
import { useAppStore } from '@/stores/index';

const BACK_URL = import.meta.env.VITE_URL_BACK;
const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;
const COMMUNITY_URL = import.meta.env.VITE_URL_BACK_COMMUNITY;
const EMPLOYMENTEXCHANGE_URL = import.meta.env.VITE_URL_BACK_EMPLOYMENT_EXCHANGE;
const STADISTICS_URL = import.meta.env.VITE_URL_BACK_STADISTICS;
const MICROOSERVICES_URL = import.meta.env.VITE_URL_BACK_MICROSERVICES;
const NOTIFICATIONS_URL = import.meta.env.VITE_URL_BACK_NOTIFICATIONS;
const VITE_URL_BACK_CHAT = import.meta.env.VITE_CHATS_URL;
// Refresh acces token
export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        console.log('Renovando token...');
        console.log(refreshToken);

        const response = await fetch(`${BACK_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();

        console.log('Token renovado:', data);

        // Guardar el nuevo token
        useAppStore().setAccessToken(data.accessToken);
        localStorage.setItem('accessToken', data.accessToken);

        return data;
    } catch (error) {
        console.error('Error al renovar el Access Token:', error);
        window.location.href = '/login';
        return { error: 'Error al renovar el Access Token.' };
    }
};

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

// Login with my app
export const loginDB = async (user) => {
    console.log(user, `communicationManager.js`);
    try {
        const response = await fetch(`${BACK_URL}/login`, {
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

// Refresh Login
export const getUserForRefreshLogin = async (user) => {
    console.log(user.email, `communicationManager.js`);
    try {
        const response = await fetch(`${BACK_URL}/user?email=${encodeURIComponent(user.email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Enviar token en los headers
            },
        });

        if (response.status == 401) {
            console.log('Token expirado, intentando renovar...');
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }

            return getUserForRefreshLogin(user);
        }

        if (!response.ok) {
            console.log('Error en la petición:', response);
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Logout for my app
export const logout = async () => {
    console.log('Cerrando sesión...');
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');

        console.log('Tokens:', refreshToken, accessToken);

        const response = await fetch(`${BACK_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ accessToken, refreshToken }),
        });

        if (response.status === 401) {
            console.log('Token expirado, intentando renovar...');
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }

            // Reintenta el logout después de renovar el token
            return await logout();
        }

        if (!response.ok) {
            console.log('Error en la petición:', response);
            return { error: `HTTP error! status: ${response.status}` };
        }

        // Clear Pinia store
        const appStore = useAppStore();
        appStore.$reset();

        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        return { message: 'Logout successful' };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Create new data user
export const createNewDataUser = async (userData) => {

    console.log(userData, `communicationManager.js`);
    console.log(`userPinia`, useAppStore().user);

    let sendUserData = {
        userPinia: useAppStore().user,
        userData: userData,
    };

    try {
        const response = await fetch(`${BACK_URL}/newDataUsers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(sendUserData),
        });

        if (response.status === 401) {
            console.log('Token expirado, intentando renovar...');
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }

            // Reintenta la petición después de renovar el token
            return await createNewDataUser(userData);
        }

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

export const getEmploymentExchangePublication = async () => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/publications`, {
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
export const getUsersForOther = async () => {
    try {
        const response = await fetch(`${BACK_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response;
        console.log(data);
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get User Data in JSON
export const getUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}/usersAll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
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

export const getEmploymentExchangeComments = async () => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/comments`, {
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

export const postEmploymentExchangeComments = async (comment) => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/comments`, {
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

// Get all messages
export const fetchMessages = async (chatId) => {
    try {
        const response = await fetch(`${CHAT_URL}/getChat/${chatId}`);
        console.log(`${CHAT_URL}/getChat/${chatId}`);
        const data = await response.json();
        const chatData = ref({});
        chatData.value = data[0];
        chatData.value.userName = chatData.value.user_one_name;
        chatData.value.interactions = chatData.value.interactions.map(
            (interaction) => ({
                message: interaction.message,
                userId: interaction.userId,
                timestamp: interaction.timestamp,
            })
        );
        console.log("chatData:", chatData.value);
        return chatData;
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

// Send message
export const sendMessageInMongo = async (
    chatData,
    currentUser,
    messageInput
) => {
    console.log(
        "sendMessageInMongo:",
        chatData._rawValue,
        currentUser,
        messageInput
    );
    const newMessage = {
        message: messageInput,
        userId: currentUser,
        timestamp: new Date().toISOString(),
    };
    console.log(chatData._rawValue);

    try {
        await fetch(`${CHAT_URL}/addChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chatData._rawValue),
        });
        if (typeof messageInput === "object" && messageInput !== null) {
            messageInput.value = "";
        }
        socketChat.emit("sendMessage", {
            chatId: chatData._rawValue._id,
            userId: currentUser,
            message: newMessage.message,
        });
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

// Get all chats
export const fetchChats = async (userId) => {
    const chats = ref([]);
    const chatsInfo = ref(false);

    try {
        const response = await fetch(`${CHAT_URL}/getChats/${userId}`);
        const data = await response.json();
        chats.value = data;
        chatsInfo.value = true;
    } catch (err) {
        console.error("Error al obtener los chats", err);
        chatsInfo.value = false;
    }
    return { chats: chats.value, chatsInfo: chatsInfo.value };
};

// Create a new chat
export const chatButton = async (userid2, router) => {
    const appStore = useAppStore();
    const userid1 = appStore.getUser().id;
    const newMessage = {
        user_one_id: userid1,
        user_two_id: userid2,
        interactions: [],
        __v: 0,
    };
    console.log(newMessage);
    try {
        const response = await fetch(`${CHAT_URL}/newChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
        });
        if (!response.ok) {
            throw new Error("Failed to send message");
        }
        router.push("/chatList");
    } catch (error) {
        console.error("Error sending message:", error);
        router.push("/chatList");
    }
};

// Get all publications
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
export const updateReportPublication = async (id, status, publication_id, user_id, report) => {
    try {
        const response = await fetch(
            `${COMMUNITY_URL}/reports/publications/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status,
                    publication_id,
                    user_id,
                    report,
                }),
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

// Get all users in status pending
export const fetchUserValidation = async () => {
    try {
        const response = await fetch(`${BACK_URL}/pendingUsers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pendingUsers = await response.json();
        console.log("Pending users:", pendingUsers);
        return pendingUsers;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get User Data
export const getNewUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}/newDataUsers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get User Data
export const fetchAllClasses = async () => {
    try {
        const response = await fetch(`${BACK_URL}/classes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};


// delete a user in the admin validation
export const deleteUserInDb = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/users/${id}`, {
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

export const deleteUserValidation = async (id) => {
    console.log("ID enviado a backend:", id); // Depuración
    try {
        const response = await fetch(`${BACK_URL}/verified/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Usuari eliminat correctament" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};


export const updateUserValidation = async (id) => {
    console.log("ID enviado a backend:", id); // Depuración
    try {
        const response = await fetch(`${BACK_URL}/verified/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Usuari verificat correctament" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const getServices = async () => {
    console.log("hodaaaaaaaaaa");
    try {
        const response = await fetch(`${MICROOSERVICES_URL}/getProcess`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log("data", data);
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const changeServiceViewUsers = async (id, enabled) => {
    try {
        const response = await fetch(`${MICROOSERVICES_URL}/changeServiceViewUserFront/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ enabled }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        throw new Error("Failed to update the service state.");
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