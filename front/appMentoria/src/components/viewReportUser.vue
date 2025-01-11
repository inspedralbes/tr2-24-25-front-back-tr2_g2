<template>
  <div class="container mx-auto p-4 bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg max-w-screen-md">
    <h1 class="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">Usuaris Reportats</h1>

    <div 
      v-for="report in reports" 
      :key="report.id" 
      class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-300 rounded-lg p-5 mb-6 shadow-md"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-lg font-semibold text-gray-800 dark:text-gray-300">Informe Nº: {{ report.id }}</p>
        </div>
        <div>
          <p class="text-base font-semibold text-gray-900 dark:text-gray-300">Estat:</p>
            <select v-model="report.status" @change="updateReportStatus(report.id, report.status)" :class="{
              'bg-yellow-200 dark:bg-yellow-600': report.status === 'pending',
              'bg-blue-200 dark:bg-blue-600': report.status === 'revising',
              'bg-green-200 dark:bg-green-600': report.status === 'revised',
              'appearance-none bg-gray-100 dark:bg-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 w-32 shadow-sm': true
            }">
            <option value="pending">Pendent</option>
            <option value="revising">Revisant</option>
            <option value="revised">Revisat</option>
          </select>
        </div>
      </div>

      <div class="mb-5">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">Data:</p>
        <p class="text-base text-gray-800 dark:text-gray-200">{{ report.created_at }}</p>
      </div>

      <div class="mb-5">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">Usuari Reportat:</p>
        <p class="text-base text-gray-800 dark:text-gray-200">{{ report.reported_user_name }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ report.reported_user_email }}</p>
      </div>

      <div class="mb-5">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">Usuari que Reporta:</p>
        <p class="text-base text-gray-800 dark:text-gray-200">{{ report.reporting_user_name }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ report.reporting_user_email }}</p>
      </div>

      <div class="mb-3">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">Informe:</p>
        <p class="text-base text-gray-800 dark:text-gray-200">{{ report.report }}</p>
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
