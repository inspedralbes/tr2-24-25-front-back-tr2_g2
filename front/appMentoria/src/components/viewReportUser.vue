<template>
    <div class="container mx-auto p-3 sm:p-4 bg-white shadow rounded-lg max-w-screen-sm">
      <h1 class="text-lg sm:text-xl font-bold mb-3">Usuaris Reportats</h1>
  
      <div v-for="report in reports" :key="report.id" class="border border-gray-300 rounded-lg p-3 mb-3 shadow-sm">
        <div class="flex flex-wrap justify-between">
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs font-semibold">Informe Nº:</p>
            <p class="text-gray-700 text-sm">{{ report.id }}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs font-semibold">Estat:</p>
            <select
              v-model="report.status"
              @change="updateReportStatus(report.id, report.status)"
              class="appearance-none bg-gray-100 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 w-32 shadow-sm"
            >
              <option value="pending">Pendent</option>
              <option value="revising">Revisant</option>
              <option value="revised">Revisat</option>
            </select>
            <p class="text-xs font-semibold mt-2">Data:</p>
            <p class="text-gray-700 text-sm">{{ report.created_at }}</p>
          </div>
        </div>
        <div class="mt-2">
          <p class="text-xs font-semibold">Usuari Reportat:</p>
          <p class="text-gray-700 text-sm">{{ report.reported_user_name }}</p>
          <p class="text-xs text-gray-500">{{ report.reported_user_email }}</p>
        </div>
        <div class="mt-2">
          <p class="text-xs font-semibold">Usuari que Reporta:</p>
          <p class="text-gray-700 text-sm">{{ report.reporting_user_name }}</p>
          <p class="text-xs text-gray-500">{{ report.reporting_user_email }}</p>
        </div>
        <div class="mt-2">
          <p class="text-xs font-semibold">Informe:</p>
          <p class="text-gray-700 text-sm">{{ report.report }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { fetchAllUserReports, updateReportUser } from "@/services/communicationManager";
  
  export default {
    data() {
      return {
        reports: [],
        loading: true,
      };
    },
    async mounted() {
      try {
        const data = await fetchAllUserReports();
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
          const response = await updateReportUser(id, status);
          if (response.error) {
            console.error(response.error);
          } else {
            console.log("Estat actualitzat correctament");
          }
        } catch (error) {
          console.error("Error al actualitzar l'estat:", error);
        }
      },
    },
  };
  </script>
  