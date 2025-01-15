<template>
    <Header></Header>
    <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 px-6">
        <!-- Encabezado -->
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Estadístiques
        </h1>

        <!-- Contenedor Principal -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <!-- Gráfico de Usuarios -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                    Gràfics d'Usuaris
                </h2>
                <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img v-if="images.users.length" :src="images.users[0]" alt="Gràfic d'usuaris"
                        class="h-full w-auto rounded-md object-contain" />
                    <p v-else class="text-gray-400 dark:text-gray-300">Carregant...</p>
                </div>
            </div>

            <!-- Gráfico de Comentarios -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                    Gràfics de Comentaris
                </h2>
                <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img v-if="images.comments.length" :src="images.comments[0]" alt="Gràfic de comentaris"
                        class="h-full w-auto rounded-md object-contain" />
                    <p v-else class="text-gray-400 dark:text-gray-300">Carregant...</p>
                </div>
            </div>

            <!-- Gráfico de Publicaciones -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                    Gràfics de Publicacions
                </h2>
                <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img v-if="images.publications.length" :src="images.publications[0]" alt="Gràfic de publicacions"
                        class="h-full w-auto rounded-md object-contain" />
                    <p v-else class="text-gray-400 dark:text-gray-300">Carregant...</p>
                </div>
            </div>
        </div>
    </div>
    <NavBar />
</template>

<script setup>
import Header from '@/components/Header.vue';
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted } from 'vue';

const URLSTADISTICS = import.meta.env.VITE_URL_BACK_STADISTICS;

const images = ref({
    comments: [],
    publications: [],
    users: [],
});

// Función para cargar las imágenes desde el backend
const fetchImages = async () => {
    try {
        const response = await fetch(`${URLSTADISTICS}/images`); // Ajusta el endpoint si es necesario
        const data = await response.json();

        // Actualiza las imágenes con las rutas obtenidas
        images.value.comments = data.comments.map(img => `${URLSTADISTICS}/upload/comments/${img}`);
        images.value.publications = data.publications.map(img => `${URLSTADISTICS}/upload/publications/${img}`);
        images.value.users = data.users.map(img => `${URLSTADISTICS}/upload/users/${img}`);
    } catch (error) {
        console.error('Error cargando las imágenes:', error);
    }
};

// Cargar las imágenes cuando el componente se monta
onMounted(() => {
    fetchImages();
});
</script>