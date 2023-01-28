<template>
    <div id="loading">
        <img class="img" :src="loading" alt="loading..." width="200" />
    </div>
</template>

<script>

import loading from '../assets/loading.gif';

export default {
    name: "LoadingScreen",
    data() {
        return {
            loading
        }
    },
};
</script>
<style>
#loading {
    position: absolute;
    z-index: 1000;
    background-color: white;
    height: 100vh;
    width: 100vw;
    text-align: center;
    line-height: 100vh;
}

.img {
    position: relative;
    margin: auto;
    margin-top: 20%;
}
</style>
