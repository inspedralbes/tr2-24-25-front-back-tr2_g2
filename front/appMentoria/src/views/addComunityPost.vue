<template>
  <div class="flex flex-col min-h-screen dark:bg-neutral-900 dark:text-white">
    <button
      @click="goBack"
      class="py-2 px-4 fixed top-0 left-0 mt-3 ml-4 z-20 text-gray-800 dark:text-white"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z"
          fill="currentColor"
        ></path>
      </svg>
    </button>

    <Header class="fixed top-0 left-0 right-0 z-10"></Header>

    <main class="flex-grow flex items-center justify-center min-h-screen mx-24">
      <div
        class="max-w-xl w-full bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md"
      >
        <h1 class="text-2xl font-bold mb-4 text-center">Crear Publicació</h1>

        <div class="mb-4">
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Títol:
          </label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Escriu el títol de la publicació"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
          />
        </div>

        <div class="mb-4">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Descripció:
          </label>
          <textarea
            id="description"
            v-model="description"
            placeholder="Escriu la descripció de la publicació"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
            rows="4"
          ></textarea>
        </div>

        <div class="mb-4">
          <label
            for="image-upload"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Pujar imatge:
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-neutral-700 dark:file:text-blue-300 dark:hover:file:bg-neutral-600"
          />
        </div>

        <div v-if="imagePreview" class="mb-4">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vista prèvia:
          </p>
          <img
            :src="imagePreview"
            alt="Vista prèvia de la imatge"
            class="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <button
          @click="submitPost"
          class="w-full py-2 px-4 bg-blue-500 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Publicar
        </button>
      </div>
    </main>
  </div>
  <!-- <NavBar></NavBar> -->
</template>


<script setup>
import Header from "@/components/Header.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postCommunityPublication } from "@/services/communicationManager";
import { useAppStore } from "@/stores/index";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();
const title = ref("");
const description = ref("");
const imageFile = ref(null);
const imagePreview = ref(null);
const user_id = useAppStore().getUser()?.id;

function goBack() {
  router.back();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

async function submitPost() {
  if (!title.value || !description.value || !imageFile.value) {
    alert("Por favor, completa todos los campos y sube una imagen.");
    return;
  }

  console.log("userid", user_id);

  const formData = new FormData();
  formData.append("typesPublications_id", 1);
  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append("user_id", user_id);
  formData.append("image", imageFile.value);

  try {
    const response = await postCommunityPublication(formData);
    console.log("response", response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al crear la publicación:", errorData);
      alert("Error al crear la publicación.");
      return;
    }

    const responseData = await response.json();
    console.log("Publicación creada con éxito:", responseData);
    router.push("/");
  } catch (error) {
    console.error("Error al enviar la publicación:", error);
    alert("Error al enviar la publicación.");
  }
}
</script>

<style scoped>
</style>