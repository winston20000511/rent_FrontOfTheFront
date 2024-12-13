<script setup>
import HomeCardList from '@/components/search/HomeCardList.vue';
import HomeFilter from '@/components/search/HomeFilter.vue';
import HomeMap from '@/components/search/HomeMap.vue';
import HomeNavbar from '@/components/search/HomeNavbar.vue';


</script>
<template>
    <header>
      <HomeNavbar></HomeNavbar>
    </header>
    <div class="filter">
      <HomeFilter></HomeFilter>
    </div>
    <main>
      <div class="main-left">
        <HomeMap></HomeMap>
      </div>
      <div class="main-right">
        <HomeCardList></HomeCardList>
      </div>
    </main>
    
</template>

<style scoped>
  header{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 14vh;
    border-bottom: 1px solid lightgray;
  }
  .filter{
    display: flex;
    width: 100%;
    height: 10vh;
    border-bottom: 1px solid lightgray;
  }
  main{
    width: 100%;
    height: 76vh;
    display: flex;
    background-color: rgb(235, 235, 235);
  }
  .main-left{
    width: 45%;
    position: relative;
  }
  .main-right{
    width: 55%;
    overflow-y: auto;
    overflow-x: hidden; 
    z-index: 2;
  } 
</style>