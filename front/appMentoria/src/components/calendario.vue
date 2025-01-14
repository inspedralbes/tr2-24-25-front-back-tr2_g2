<template>
    <div class="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <div class="overflow-x-auto">
        <div class="flex flex-col">
          <div class="flex bg-blue-500 text-white text-sm">
            <div class="border border-blue-600 px-2 py-1 text-center flex-1">Hora</div>
            <div class="border border-blue-600 px-2 py-1 text-center flex-1">Dl</div>
            <div class="border border-blue-600 px-2 py-1 text-center flex-1">Dt</div>
            <div class="border border-blue-600 px-2 py-1 text-center flex-1">Dc</div>
            <div class="border border-blue-600 px-2 py-1 text-center flex-1">Dj</div>
            <div class="border border-blue-600 px-2 py-1 text-center flex-1">Dv</div>
          </div>
          <div v-for="(hour, index) in schedule" :key="index" class="flex odd:bg-gray-50 even:bg-gray-100 text-sm">
            <div class="border border-gray-300 px-2 py-1 text-center font-medium text-gray-700 flex-1 md:py-7">{{ hour.time }}</div>
            <div v-for="day in 5" :key="day" class="border border-gray-300 px-2 py-1 text-center flex-1 cursor-pointer md:py-4" :class="{ 'bg-red-500 text-white': isOccupied(index, day) }" @click="toggleOccupied(index, day)"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        schedule: [
          { time: "04:00 PM - 05:00 PM" },
          { time: "05:00 PM - 06:00 PM" },
          { time: "06:00 PM - 07:00 PM" },
          { time: "07:00 PM - 08:00 PM" },
        ],
        occupiedSlots: {},
      };
    },
    methods: {
      isOccupied(hourIndex, dayIndex) {
        return !!this.occupiedSlots[`${hourIndex}-${dayIndex}`];
      },
      toggleOccupied(hourIndex, dayIndex) {
        const key = `${hourIndex}-${dayIndex}`;
        if (this.occupiedSlots[key]) {
          delete this.occupiedSlots[key];
        } else {
          this.occupiedSlots[key] = true;
        }
      },
    },
  };
  </script>