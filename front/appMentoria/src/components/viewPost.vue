<template>
  <div>
    <div v-if="selectedPost" class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 dark:bg-gray-900">
      <button @click="goMain" class="py-2 px-4 fixed top-0 left-0 mt-3 ml-4 z-20">
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z" fill="#ffffff"></path> </g></svg>
    </button>
      <div v-if="selectedPost.reports === 0">
        <header class="flex items-center p-4 border-b">
          <img :src="getAuthorProfile(selectedPost.user_id)" alt="Avatar" class="w-12 h-12 rounded-full mr-4" />
          <div>
            <h2 class="font-bold text-lg">{{ getAuthorName(selectedPost.user_id) }}</h2>
            <p class="text-gray-500 text-sm dark:text-white">{{ getAuthorHandle(selectedPost.user_id) }} · fa {{ timeSince(selectedPost.created_at) }}</p>
          </div>
        </header>

        <main class="p-4 space-y-4">
          <h1 class="text-xl font-bold">{{ selectedPost.title }}</h1>
          <p class="text-gray-800 text-lg whitespace-pre-line dark:text-gray-300">{{ selectedPost.description }}</p>

          <div v-if="selectedPost.image != null" class="rounded-lg overflow-hidden">
            <img :src="selectedPost.image" alt="Post Image" class="w-full" />
          </div>
        </main>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-bold">Comentaris</h3>
        <div class="border-t-2 border-gray-200 px-4 p-4 mb-2 sm:mb-0">
          <div class="relative flex">
             <input 
                ref="commentInput"
                type="text" 
                placeholder="Escriu un comentari!" 
                class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-20 bg-gray-200 rounded-md py-3 dark:bg-gray-800 dark:text-white"
              >
              <div class="absolute right-0 items-center inset-y-0 flex">
                  <button @click="sendCommentInMongo(null)" type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mr-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#999999"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </button>
              </div>
            </div>
        </div>
        <ul>
            <li v-for="comment in getCommentsWithPostId(selectedPost.id).filter(comment => !comment.commentReply_id)" :key="comment.id" class="border-b py-2 flex items-start space-x-4">
              <img :src="getAuthorProfile(comment.user_id)" alt="Avatar" class="w-8 h-8 rounded-full" />
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="font-bold">{{ getAuthorName(comment.user_id) }}</h4>
                  <span class="text-gray-500 text-sm">{{ timeSince(comment.created_at) }}</span>
                </div>
                <p style="word-break: break-word;">{{ comment.comment }}</p>     
                <div v-if="getCommentsInComments(comment.id).length" class="ml-8 mt-2 space-y-2">
                  <div v-for="reply in getCommentsInComments(comment.id)" :key="reply.id" class="flex items-start space-x-4">
                    <img :src="getAuthorProfile(reply.user_id)" alt="Avatar" class="w-8 h-8 rounded-full" />
                      <div>
                          <div class="flex items-center space-x-2">
                            <h4 class="font-bold">{{ getAuthorName(reply.user_id) }}</h4>
                            <span class="text-gray-500 text-sm">{{ timeSince(reply.created_at) }}</span>
                          </div>
                          <p style="word-break: break-word;">{{ reply.comment }}</p>
                      </div>
                    </div>
                </div>
                <div class="relative flex">
                  <input 
                    ref="replyInput"
                    type="text" 
                    placeholder="Write your message!" 
                    class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-20 bg-gray-200 rounded-md py-3 dark:bg-gray-800 dark:text-white"
                  >
                  <div class="absolute right-0 items-center inset-y-0 flex">
                      <button @click="sendCommentInMongo(comment.id)" type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mr-4">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#999999"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </button>
                  </div>
                </div>          
              </div>
            </li>
        </ul>
      </div>
    </div>

    <div v-else>
      <div v-for="post in posts" :key="post.id" class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 dark:bg-gray-900">
        <div v-if="post.reports === 0">
          <header class="flex items-center p-4 border-b">
            <img :src="getAuthorProfile(post.user_id)" alt="Avatar" class="w-12 h-12 rounded-full mr-4" />
            <div>
              <h2 class="font-bold text-lg">{{ getAuthorName(post.user_id) }}</h2>
              <p class="text-gray-500 text-sm dark:text-white">{{ getAuthorHandle(post.user_id) }} · fa {{ timeSince(post.created_at) }}</p>
            </div>
          </header>

          <main class="p-4 space-y-4">
            <h1 class="text-xl font-bold">{{ post.title }}</h1>
            <p class="text-gray-800 text-lg whitespace-pre-line dark:text-gray-300">
              {{ post.description }}
            </p>

            <div v-if="post.image != null" class="rounded-lg overflow-hidden">
              <img :src="post.image" alt="Post Image" class="w-full" />
            </div>
          </main>

          <footer class="p-4 border-t">
            <div class="flex justify-around text-gray-500 dark:text-gray-300">
              <button class="flex items-center space-x-1 hover:text-gray-500" @click="showPostWithComments(post)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                <span>{{ getCommentsWithPostId(post.id).length }}</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, onMounted, defineProps } from 'vue';
  import { getUsers, getCommunityComments, postCommunityComments } from '../services/communicationManager';


  const authorAvatar = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/RETRATO_DEL_GRAL._FRANCISCO_FRANCO_BAHAMONDE_%28adjusted_levels%29.jpg/220px-RETRATO_DEL_GRAL._FRANCISCO_FRANCO_BAHAMONDE_%28adjusted_levels%29.jpg';

  const users = ref([]);
  const comments = ref([]);
  const selectedPost = ref(null);

  const commentInput = ref(null);
  const replyInput = ref(null);

  const props = defineProps({
    posts: Array
  });

  const getAuthorName = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };  

  const getAuthorHandle = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user ? user.email.split('@')[0] : 'Unknown';
  };  

  const getAuthorProfile = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user && user.profile ? user.profile : authorAvatar;
  };

  const getCommentsWithPostId = (postId) => {
    const list = comments.value.filter(comment => comment.publication_id === postId);
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return list;
  };
  
  const getCommentsInComments = (commentid) => {
    return comments.value.filter(comment => comment.commentReply_id === commentid);
  };

  const sendCommentInMongo = async (ID) => {
    if (ID === null) {
      if (commentInput.value.value === '') return;
      const message = commentInput.value.value;
      console.log("message", message);
      const comment = {
        comment: message,
        user_id: 1,
        publication_id: selectedPost.value.id,
        commentReply_id: null,
        created_at: new Date().toISOString()
      };
      await postCommunityComments(comment);
      comments.value = await getCommunityComments();
      commentInput.value.value = '';
    }
    else {
      if (replyInput.value.value === '') return;
      const message = replyInput.value.value;
      console.log("message", message);
      const comment = {
        comment: message,
        user_id: 1,
        publication_id: selectedPost.value.id,
        commentReply_id: ID,
        created_at: new Date().toISOString()
      };
      await postCommunityComments(comment);
      comments.value = await getCommunityComments();
      replyInput.value.value = '';
    }
  };

  function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: 'anys', seconds: 31536000 },
      { label: 'mesos', seconds: 2592000 },
      { label: 'dies', seconds: 86400 },
      { label: 'hores', seconds: 3600 },
      { label: 'minuts', seconds: 60 },
      { label: 'segons', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}`;
      }
    }
    return 'ara mateix';
  }

  const showPostWithComments = (post) => {
    selectedPost.value = post;
  };

  function goMain() {
    selectedPost.value = null;
  }

  onMounted(async () => {
    users.value = await getUsers();
    comments.value = await getCommunityComments();
    console.log("comments", comments.value);
    
  });
</script>