<template>
    <div class="container mx-auto p-3 sm:p-4 bg-white shadow rounded-lg">
      <h1 class="text-lg sm:text-xl font-bold mb-3">Publicacions Reportades</h1>
      <div>
        <div v-for="report in reports" :key="report.id" class="border border-gray-300 rounded-lg p-3 mb-3 shadow-sm">
          <div class="flex flex-wrap justify-between">
            <div class="w-1/2 sm:w-1/3">
              <p class="text-xs font-semibold">Informe Nº:</p>
              <p class="text-gray-700 text-sm">{{ report.id }}</p>
            </div>
            <div class="w-1/2 sm:w-1/3">
              <p class="text-xs font-semibold">Estat:</p>
              <select v-model="report.status" @change="updateReportStatus(report.id, report.status)"
              class="appearance-none bg-gray-100 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 w-32 shadow-sm">
                <option value="pending">Pending</option>
                <option value="revising">Revising</option>
                <option value="revised">Reviset</option>
              </select>
            </div>
            <div class="w-full sm:w-1/3 mt-4">
              <p class="text-xs font-semibold">Data:</p>
              <p class="text-gray-700 text-sm">{{ report.created_at }}</p>
            </div>
          </div>
          <div class="mt-2">
            <p class="text-xs font-semibold">Usuari que Reporta:</p>
            <p class="text-gray-700 text-sm">{{ report.reporting_user_name }}</p>
            <p class="text-xs text-gray-500">{{ report.reporting_user_email }}</p>
          </div>
          <div class="mt-2">
            <p class="text-xs font-semibold">Usuari de la Publicació:</p>
            <p class="text-gray-700 text-sm">{{ report.publication_user_name }}</p>
            <p class="text-xs text-gray-500">{{ report.publication_user_email }}</p>
          </div>
          <div class="mt-2">
            <p class="text-xs font-semibold">Títol de la Publicació:</p>
            <p class="text-gray-700 text-sm">{{ report.title }}</p>
          </div>
          <div class="mt-2">
            <p class="text-xs font-semibold">Descripció de la Publicació:</p>
            <p class="text-gray-700 text-sm">{{ report.description }}</p>
          </div>
          <div class="mt-2">
            <p class="text-xs font-semibold">Informe:</p>
            <p class="text-gray-700 text-sm">{{ report.report }}</p>
          </div>
          <div class="mt-2">
            <p class="text-xs font-semibold">Imatge Reportada:</p>
            <select v-model="report.selectedImage" class="appearance-none bg-gray-100 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 w-full shadow-sm">
              <option :value="null">Selecciona una imatge</option>
              <option :value="`${communityUrl}${report.image}`">Veure Imatge</option>
            </select>
            <img v-if="report.selectedImage" :src="report.selectedImage" alt="Imatge Reportada" class="w-32 h-auto rounded-md shadow-sm mt-2">
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { fetchAllReportsPublications, updateReportPublication } from "@/services/communicationManager";
  
  export default {
    data() {
      return {
        reports: [],
        loading: true,
        communityUrl: import.meta.env.VITE_URL_BACK_COMMUNITY.replace(/\/$/, ''),
      };
    },
    async mounted() {
      try {
        const data = await fetchAllReportsPublications();
        if (data.error) {
          console.error(data.error);
        } else {
          this.reports = data;
        }
      } catch (error) {
        console.error("Error al obtenir els informes:", error);
      } finally {
        this.loading = false;
      }
    },
    methods: {
      async updateReportStatus(id, status) {
        try {
          const response = await updateReportPublication(id, status);
          if (response.error) {
            console.error(response.error);
          } else {
            console.log("Estat actualitzat correctament");
          }
        } catch (error) {
          console.error("Error al actualitzar l'estat:", error);
        }
      }
    }
  };
  </script>