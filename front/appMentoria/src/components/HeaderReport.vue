<template>
    <div class="flex justify-center mt-4">
                <button @click="$router.push('/reportUserPage')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    View Report User
                </button>
                <button @click="$router.push('/reportPublicacioPage')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    View Report Publicacio
                </button>

                <button @click="$router.push('/reportCommentsPage')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    View Report Comments
                </button>
            </div>
</template>