<template>
  <!-- component -->
  <div
    class="bg-gray-100 h-screen flex items-center justify-center p-8 dark:bg-neutral-800"
  >
    <div
      class="max-w-md w-full bg-white p-8 rounded-lg shadow-md dark:bg-neutral-600"
    >
      <form>
        <!-- Post Content Section -->
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
            >Afegeix una Petició:</label
          >
          <div class="pb-4">
            <textarea
              id="title"
              name="postContent"
              rows="1"
              v-model="title"
              class="w-full border-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-white"
              placeholder="Títol"
            ></textarea>
          </div>
          <div>
            <textarea
              id="des"
              name="postContent"
              rows="4"
              v-model="description"
              class="w-full border-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-white"
              placeholder="Que Busques?"
            ></textarea>
          </div>
        </div>
        <div class="mb-4">
          <label
            for="image-upload"
            class="block text-sm font-medium text-gray-700 mb-2 dark:text-white"
          >
            Pujar imatge:
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-white"
          />
        </div>
        <!-- Tags Section -->
        <div class="mb-6">
          <!-- TAGS -->
        </div>
        <!-- Availability Section -->
        <div class="mb-6">
          <div class="form-group p-4 rounded-md">
            <label
              for="hours"
              class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
            >
              Disponible:
            </label>
            <button
              class="p-2 bg-blue-100 rounded-md mb-2 w-full md:w-auto dark:bg-blue-600 dark:text-white"
              type="button"
              @click="addAvailability"
            >
              + Afegir Disponibilitat
            </button>
            <div
              v-for="(availability, index) in availabilities"
              :key="index"
              class="availability-group flex flex-wrap items-center gap-2 mb-4"
            >
              <select
                v-model="availability.day"
                class="border-2 rounded-md p-1 text-sm h-auto w-full md:w-auto flex-grow dark:bg-indigo-400"
              >
                <option disabled value="">Selecciona un dia</option>
                <option v-for="day in week" :key="day" :value="day">
                  {{ day }}
                </option>
              </select>
              <select
                v-model="availability.startTime"
                @change="validateTimes(index)"
                class="border-2 rounded-md p-1 text-sm h-auto w-full md:w-auto flex-grow dark:bg-indigo-400"
              >
                <option disabled value="">Hora d'inici</option>
                <option
                  v-for="hour in filteredHours(index, 'start')"
                  :key="hour"
                  :value="hour"
                >
                  {{ hour }}
                </option>
              </select>
              <select
                v-model="availability.endTime"
                @change="validateTimes(index)"
                class="border-2 rounded-md p-1 text-sm h-auto w-full md:w-auto flex-grow dark:bg-indigo-400"
              >
                <option disabled value="">Hora de final</option>
                <option
                  v-for="hour in filteredHours(index, 'end')"
                  :key="hour"
                  :value="hour"
                >
                  {{ hour }}
                </option>
              </select>
              <button
                type="button"
                @click="removeAvailability(index)"
                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md dark:bg-red-800"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4"
                    stroke="#1C274C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M20.5001 6H3.5"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                    stroke="#1C274C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M9.5 11L10 16"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M14.5 11L14 16"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button and Character Limit Section -->
        <div class="flex items-center justify-between">
          <button
            type="button"
            @click="submitPostPeticio"
            class="flex justify-center items-center bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue text-white py-2 px-4 rounded-md transition duration-300 gap-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
          >
            Post
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <span class="text-gray-500 text-sm dark:text-white"
            >Max 280 characters</span
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postEmploymentExchangePublication } from "@/services/communicationManager";

const router = useRouter();
const title = ref("");
const description = ref("");
const imageFile = ref(null);
const availabilities = ref([]);

const hours = ref([
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
]);
const week = ref([
  "Dilluns",
  "Dimarts",
  "Dimecres",
  "Dijous",
  "Divendres",
  "Dissabte",
  "Diumenge",
]);

const addAvailability = () => {
  availabilities.value.push({ day: "", startTime: "", endTime: "" });
};

const removeAvailability = (index) => {
  availabilities.value.splice(index, 1);
};

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
  }
}

const validateTimes = (index) => {
  const availability = availabilities.value[index];
  if (
    availability.startTime &&
    availability.endTime &&
    availability.startTime >= availability.endTime
  ) {
    alert("La hora de finalización debe ser posterior a la hora de inicio.");
    availability.endTime = "";
  }
};

const filteredHours = (index, type) => {
  const availability = availabilities.value[index];
  const selectedHours = availabilities.value
    .flatMap((a) => [a.startTime, a.endTime])
    .filter(Boolean);
  if (type === "start") {
    return hours.value.filter(
      (hour) => !selectedHours.includes(hour) || hour === availability.startTime
    );
  } else {
    return hours.value.filter(
      (hour) =>
        hour > availability.startTime &&
        (!selectedHours.includes(hour) || hour === availability.endTime)
    );
  }
};

async function submitPostPeticio() {
  if (!title.value || !description.value) {
    alert("Por favor, completa todos los campos");
    return;
  }

  const formData = new FormData();
  formData.append("typesPublications_id", 1);
  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append("availability", JSON.stringify(availabilities.value));
  formData.append("user_id", 1);
  formData.append("image", imageFile.value);

  try {
    const response = await postEmploymentExchangePublication(formData);

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

function goBack() {
  router.back();
}

// const submitForm = async () => {
//   const formData = {
//     typesPublications_id: 2,
//     title: document.getElementById("title").value,
//     description: document.getElementById("des").value,
//     availabilities: availabilities.value,
//     user_id: "",
//   };
//   console.log(JSON.stringify(formData));
// };
</script>

<style scoped>
.create-post {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 15px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #737272;
  border-radius: 5px;
  resize: none;
}
</style>