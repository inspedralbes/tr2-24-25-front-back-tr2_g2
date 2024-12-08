<template>
    <div class="create-post">
        <h2>Afegeix un post</h2><br>
        <form>
            <div class="form-group">
                <textarea v-model="postContent" placeholder="Títol" rows="1"></textarea>
                <textarea v-model="postContent" placeholder="En què hi penses?" rows="4"></textarea>
                <label for="tags">Tags:</label>
                <div class="tags-input">
                    <!-- Add tags aqui -->
                </div>
            </div>
            <div class="form-group">
                <button type="submit">Post</button>
            </div>
        </form>
    </div>
</template>
 
<script scoped>

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

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #0fadea;
    color: #fff;
    cursor: pointer;
}
</style>