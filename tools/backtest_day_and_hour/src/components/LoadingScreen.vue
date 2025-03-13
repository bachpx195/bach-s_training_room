<template>
    <div id="loading">
        <h1>...</h1>
    </div>
</template>
<script>

export default {
    name: "LoadingScreen"
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
