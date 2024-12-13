<script setup>
import { ref } from 'vue';

const navLeft = ref(null);
const linkOne = ref(null);
const linkListOne = ref(null);
const linkListOnePos =ref({top: 0 , left: 0});

const linkMouseEnter=()=>{
    if (linkOne.value && linkListOne.value){
        const linkRect = navLeft.value.getBoundingClientRect();
        linkListOnePos.value={
            top: linkRect.bottom + window.scrollY+5
        };
        linkListOne.value.style.display='block';
    }
}
const linkMouseLeave=()=>{
    
    if(linkListOne.value){
        setTimeout(()=>{
            linkListOne.value.style.display='none';
        },400)
    }
}

</script>

<template>
<!-- 左邊連結位置 -->
<ul class="nav-left" ref="navLeft">
    <li>
        <RouterLink to="#">
            <span>
                Buy
            </span>
        </RouterLink>       
    </li>
    <li>
        <RouterLink to="#" class="link" v-on:mouseenter="linkMouseEnter">
            <span ref="linkOne">
                Rent
            </span>
        </RouterLink>
    </li>
</ul>

<ul ref="linkListOne" 
    v-on:mouseleave="linkMouseLeave" 
    v-bind:style="{top: `${linkListOnePos.top}px`,left: `${linkListOnePos.left}px`}"
    class="link-list">
    <li><RouterLink to="#">item 1</RouterLink></li>
    <li><RouterLink to="#">item 2</RouterLink></li>
    <li><RouterLink to="#">item 3</RouterLink></li>
    <li><RouterLink to="#">item 4</RouterLink></li>
</ul>

<div class="nav-middle">
    <img src="../../assets/Logo3.jpg" alt="LOGO">
    
    <div class="nav-title">
        <h1>house</h1>
    </div>
    
</div>

<!-- 右邊連結位置 -->
<div class="nav-right">
    <li><RouterLink to="#">Manage Rentals</RouterLink></li>
    <li><RouterLink to="#">Advertise</RouterLink></li>
    <li><RouterLink to="#">Help</RouterLink></li>
    <RouterLink to="/login" class="nav-link">登入</RouterLink>
    <RouterLink to="/member-center" class="nav-link">會員中心</RouterLink>
</div>

</template>

<style scoped>
    .nav-left{
        height: 100%;
        display: flex;
        justify-content: left;
        align-items: center;
        list-style-type: none;
        padding: 0px;
        margin-left: 20px;
    }
    .nav-left li{
        padding-left: 15px;
        
    }
    .nav-left li a{
        font-size: 20px;
        font-weight: bold;
        color: black;
        text-decoration: none;
    }
    .nav-left li a:hover{
        color: blue;
        border-bottom: 3px solid blue;
    }

    .link-list{
        display: none;
        position: absolute;
        z-index: 3;
        background-color: white;
        width: 98%;
        height: 200px;
        list-style-type: none;
        padding-left: 20px;
    }
    .link-list li{
        padding: 10px 5px;
    }
    .link-list li a{
        font-size: 20px;
        color: black;
        text-decoration: none;
    }
    .link-list>li>a:hover {
        padding: 0px 10px;
        color: blue;
    }


    .nav-middle{
        display: flex;
        flex-direction: row;
        padding: 10px 0px 0px;
        margin-left: 100px;
    }
    .nav-middle img{
        object-fit: cover;
    }
    .nav-title{
        display: grid;
        align-items: center;
    }
    .nav-title h1{
        font-size: 60px;
        color: black;
        font-family: "Pacifico", cursive;
        font-weight: 500;
        font-style: normal;
        line-height: 30px;
    }



    .nav-right{
        height: 100%;
        display: flex;
        justify-content: left;
        align-items: center;
        list-style-type: none;
        padding: 0px;
        margin-right: 20px;
    }
    .nav-right li{
        padding-right: 15px;
    }
    .nav-right li a{
        font-size: 20px;
        font-weight: bold;
        color: black;
        text-decoration: none;
    }
    .nav-right li a:hover{
        color: blue;
        border-bottom: 3px solid blue;
    }
</style>