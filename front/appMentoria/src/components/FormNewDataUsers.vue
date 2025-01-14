<template>
    <div class="bg-gray-100 dark:bg-gray-900 py-12 px-6">
        <div class="max-w-7xl mx-auto px-6 md:px-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Formulari d'usuari</h2>

            <button @click="toggleForm" class="bg-indigo-600 text-white py-2 px-4 rounded-full mb-6 hover:bg-indigo-700">
                Mostrar formulari
            </button>

            <!-- Formulario Desplegable -->
            <div v-show="formVisible">
                <form @submit.prevent="submitForm" class="w-full max-w-full lg:max-w-lg mx-auto">
                    <!-- Nom -->
                    <div class="mb-4">
                        <label for="name" class="block text-gray-700 dark:text-gray-300">Nom</label>
                        <input type="text" id="name" v-model="form.name"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                            required />
                    </div>

                    <!-- Correu Electrònic -->
                    <div class="mb-4">
                        <label for="email" class="block text-gray-700 dark:text-gray-300">Correu electrònic</label>
                        <input type="email" id="email" v-model="form.email"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                            required />
                    </div>

                    <!-- Contrasenya -->
                    <div class="mb-4">
                        <label for="password" class="block text-gray-700 dark:text-gray-300">Contrasenya</label>
                        <input type="password" id="password" v-model="form.password"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                            required />
                    </div>

                    <!-- Ciutat -->
                    <div class="mb-4">
                        <label for="city" class="block text-gray-700 dark:text-gray-300">Ciutat</label>
                        <input type="text" id="city" v-model="form.city"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
                    </div>

                    <!-- Enllaços (Discord i GitHub) -->
                    <div class="mb-4">
                        <label for="discord_link" class="block text-gray-700 dark:text-gray-300">Enllaç Discord</label>
                        <input type="url" id="discord_link" v-model="form.discord_link"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div class="mb-4">
                        <label for="github_link" class="block text-gray-700 dark:text-gray-300">Enllaç GitHub</label>
                        <input type="url" id="github_link" v-model="form.github_link"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
                    </div>

                    <!-- Estat -->
                    <div class="mb-4">
                        <label for="status" class="block text-gray-700 dark:text-gray-300">Estat</label>
                        <select id="status" v-model="form.status"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                            <option value="pending">Pendent</option>
                            <option value="approved">Aprovat</option>
                            <option value="rejected">Rebutjat</option>
                        </select>
                    </div>

                    <!-- Etiquetes -->
                    <div class="mb-4">
                        <label for="tags" class="block text-gray-700 dark:text-gray-300">Etiquetes (JSON)</label>
                        <textarea id="tags" v-model="form.tags"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"></textarea>
                        <small class="text-gray-500 dark:text-gray-400">Exemple de format: ["etiqueta1", "etiqueta2"]</small>
                    </div>

                    <!-- Disponibilitat -->
                    <div class="mb-4">
                        <label for="availibility" class="block text-gray-700 dark:text-gray-300">Disponibilitat (JSON)</label>
                        <textarea id="availibility" v-model="form.availibility"
                            class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"></textarea>
                        <small class="text-gray-500 dark:text-gray-400">Exemple de format: {"dilluns": "9:00-12:00"}</small>
                    </div>

                    <!-- Botó de Submit -->
                    <div class="flex justify-center mt-6">
                        <button type="submit"
                            class="bg-indigo-600 text-white py-3 px-6 rounded-full transition-all duration-500 hover:bg-indigo-700 focus:outline-none">
                            Desar Usuari
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Estado para el formulario
const form = ref({
    name: '',
    email: '',
    password: '',
    city: '',
    discord_link: '',
    github_link: '',
    status: 'pending',
    tags: '',
    availibility: ''
});

const formVisible = ref(false); // Para mostrar/ocultar el formulario

// Función para mostrar/ocultar el formulario
const toggleForm = () => {
    formVisible.value = !formVisible.value;
};

// Función para manejar el envío del formulario
const submitForm = async () => {
    const userData = { ...form.value };

    // Validación de JSON para tags y availability
    if (userData.tags) {
        try {
            userData.tags = JSON.parse(userData.tags);
        } catch (e) {
            alert("El format de 'tags' no és vàlid. Assegura't que sigui JSON.");
            return;
        }
    }

    if (userData.availibility) {
        try {
            userData.availibility = JSON.parse(userData.availibility);
        } catch (e) {
            alert("El format de 'availibility' no és vàlid. Assegura't que sigui JSON.");
            return;
        }
    }

    // Aquí va el código para enviar el formulario (por ejemplo, usando fetch)
    // ...
};
</script>
