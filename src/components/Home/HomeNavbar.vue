<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Offcanvas } from 'bootstrap';

import { useRouter } from 'vue-router'; // 引入 useRouter
import { useAuthStore } from '@/stores/auth';
import { useOption } from '@/stores/optionStore';



const authStore = useAuthStore(); // 引入 auth Store
const optionStore = useOption();
const searchInputRef = ref(null);
const searchListRef = ref(null);
const searchListPosRef = ref({ top: 0, left: 0, width: 0 })
const searchListReuslt = ref([])
// const myOffcanvasRef = ref(null);
// const offcanvasInstance= ref(null);
const iconBtnRef = ref(null);

let isComposing = false; //判斷是否正在打字
let keywordUrl = 'http://localhost:8080/api/keyword'
let mapUrl = 'http://localhost:8080/api/map'
let token = localStorage.getItem('jwt');


const emits = defineEmits(['add-marker', 'signInClicked'])

onMounted(() => {
  document.addEventListener('click', closeSearchList);
  optionStore.initializeData();
  // if (myOffcanvasRef.value) {
  //     offcanvasInstance.value = new Offcanvas(myOffcanvasRef.value);
  // }
});

onUnmounted(() => {
  // 移除事件監聽器
  document.removeEventListener('click', closeSearchList);
});

const compositionStart = () => {
  isComposing = true;
}
const compostitionEnd = () => {
  isComposing = false;
  showKeyWordFetch();
}

const showSearchList = () => {
  if (searchInputRef.value) {
    const listRect = searchInputRef.value.getBoundingClientRect();
    searchListPosRef.value = {
      top: listRect.height,
      left: 0,
      width: listRect.width
    };
    searchListRef.value.style.display = 'block';
  }
}
const closeSearchList = (event) => {
  // if(searchListRef.value && !searchListRef.value.contains(event.target) &&
  //     searchInputRef.value && !searchInputRef.value.contains(event.target) &&
  //     myOffcanvasRef.value && !myOffcanvasRef.value.contains(event.target)){

  //     searchListPosRef.value.innerHTML="";
  //     searchListRef.value.style.display ='none';
  //     offcanvasInstance.value.hide();
  // }
  if (searchListRef.value && !searchListRef.value.contains(event.target)) {
    searchListPosRef.value.innerHTML = "";
    searchListRef.value.style.display = 'none';
  }

}
const clickSearchBtn = () => {
  showMapFetch();
}
const enterSearchBtn = (event) => {
  if (event.key === 'Enter') {
    showMapFetch();
  }
}

const showKeyWordFetch = async () => {
  const input = {
    origin: searchInputRef.value.value,
    priority: optionStore.shareOptions.priority,
    sort: optionStore.shareOptions.sort
  }
  // const merge = Object.assign({},input,optionStore.shareOptions)

  const response = await fetch(keywordUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `${token}`
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json();
  console.log('Data received:', data);
  showLKeyWrodList(data);
}

const showLKeyWrodList = async (data) => {
  searchListReuslt.value = [];
  data.forEach(k => {
    searchListReuslt.value.push({
      id: Date.now() + Math.random(),
      address: k.address,
      paidDate: k.paidDate,
    });
  })

}

const showMapFetch = async (address) => {
  if (address) {
    searchInputRef.value.value = address;
  }

  const inputData = {
    address: searchInputRef.value.value
  }
  const merge = Object.assign({}, inputData, optionStore.shareOptions)

  const response = await fetch(mapUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `${token}`
    },
    body: JSON.stringify(merge)
  });

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json();
  console.log(data);
  emits('add-marker', data)
}

const handleListClick = (item) => {
  searchInputRef.value.value = item.address;
  searchInputRef.value.innerHTML = '';
  searchListRef.value.style.display = 'none';
  // offcanvasInstance.value.hide();
  showMapFetch();
}

const checkPaidDate = (item) => {
  const dateSpec = '1999-01-01T00:00:00';
  const sourceDate = new Date(item.paidDate);
  const targetDate = new Date(dateSpec);
  if (sourceDate > targetDate) {
    return "bi bi-hand-thumbs-up"
  } else {
    return ""
  }

}


const router = useRouter(); // 初始化 router

const handleSignInClick = () => {
  // 如果未登入，發送事件通知父組件顯示 LoginPage
  if (!authStore.isLoggedIn) {
    emits('signInClicked');
  } else {
    // 如果已登入，執行登出邏輯
    authStore.logout();
    router.push('/'); // 跳轉至首頁 HomeView.vue
  }
};


</script>

<template>
  <div class="navbar">
    <!-- 左側：Logo 和標題 -->
    <div class="nav-left">
      <img src="../../assets/Logo3.jpg" alt="Logo" class="nav-logo" />
      <div class="nav-title">
        <h1>house</h1>
      </div>
    </div>

    <div class="filter" id="filter">
      <input type="text" placeholder="Address, neighborhood, city, ZIP" id="search" class="form-control me-4"
        ref="searchInputRef" v-on:input="showSearchList" v-on:compositionstart="compositionStart"
        v-on:compositionend="compostitionEnd" v-on:click="showSearchList" v-on:keyup="enterSearchBtn">
      <i class="fa-solid fa-magnifying-glass" ref="iconBtnRef" v-on:click="clickSearchBtn"></i>
      <ul class="searchList position-absolute mt-1 bg-white border rounded shadow" ref="searchListRef" v-bind:style="{
        top: `${searchListPosRef.top}px`,
        left: `${searchListPosRef.left}px`,
        width: `${searchListPosRef.width}px`
      }">
        <li v-for="item in searchListReuslt" v-bind:key="item.id" class="custom-list"
          v-on:click="handleListClick(item)">
          {{ item.address }}<i :class="checkPaidDate(item)"></i></li>
      </ul>
    </div>

    <!-- 右側：MemberCenter 和 Sign In/Logout -->
    <ul class="nav-right">
      <!-- 只有登入後才顯示 MemberCenter -->
      <li v-if="authStore.isLoggedIn">
        <RouterLink to="/member-center">MemberCenter</RouterLink>
      </li>
      <!-- 顯示會員頭像 -->
      <li v-if="authStore.isLoggedIn && authStore.profilePicture">
        <img :src="authStore.profilePicture" alt="Profile Picture" class="user-avatar" />
      </li>
      <li>
        <button @click="handleSignInClick">
          {{ authStore.isLoggedIn ? 'Logout' : 'Sign In' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Navbar 容器 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  /* padding: 20px 40px; 添加內距 */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  /* 填滿整個頁面寬度 */
  box-sizing: border-box;
}

/* 左側：Logo 和標題 */
.nav-left {
  display: flex;
  align-items: center;
  /* 垂直居中 Logo 和標題 */
  gap: 20px;
  /* 增加 Logo 與標題的距離 */
  width: 20%;
}

.nav-logo {
  max-width: 200px;
  /* 限制 Logo 寬度 */
  max-height: 120px;
  /* 限制 Logo 高度 */
  object-fit: contain;
  /* 確保圖片比例縮放 */
  margin: 0;
  /* 移除外距，避免影響容器布局 */
}

.nav-title h1 {
  font-size: 60px;
  /* 標題字體大小 */
  color: black;
  font-family: 'Pacifico', cursive;
  font-weight: 500;
  font-style: normal;
  line-height: 1;
  margin: 0;
  /* 移除多餘外距 */
}

.filter {
  width: 40%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 垂直對齊 */
  position: relative;
  /* 必須是相對定位 */
}

.fa-magnifying-glass {
  position: fixed;
  top: 11%;
  /* 固定於視窗頂部 60px */
  left: 62%;
  /* 基本定位 */
  transform: translate(-50%, -50%)
    /* 調整位置 */
}

.fa-magnifying-glass:hover {
  font-size: 20px;
}

.filter input[type="text"] {
  width: 100%;
  font-size: 20px;
  border: 1px solid lightgray;
}

.option-title {
  margin-top: 20px;
  text-align: left;
  line-height: 50px;
  height: 50px;
  font-weight: bold;
  background-color: rgb(250, 250, 250)
}

.searchList {
  background-color: red;
  /* display: block; */
  z-index: 100;
  list-style-type: none;
  padding: 0;
  height: 25px;
}

.custom-list {
  padding: 0.5rem 1rem;
  /* 等同於 Bootstrap 的 px-4 py-2 */
  background-color: #f8f9fa;
  /* 等同於 bg-light */
  color: #212529;
  /* 等同於 text-dark */
  cursor: pointer;
  border: none;
  /* 如果是按鈕，移除邊框 */
  /* transition: all 0.3s ease; 添加平滑過渡效果 */
}

.custom-list:hover {
  background-color: #0d6efd;
  /* 等同於 bg-primary */
  color: #fff;
  /* 等同於 text-white */
}



/* 右側：MemberCenter 和按鈕 */
.nav-right {
  display: flex;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 30%;
}

.nav-right li {
  margin-left: 20px;
}

.nav-right li a,
.nav-right li button {
  font-size: 20px;
  /* 按鈕字體大小 */
  padding: 10px 20px;
  /* 增加按鈕內距 */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  /* 圓角按鈕 */
  text-decoration: none;
  cursor: pointer;
}

.nav-right li a:hover,
.nav-right li button:hover {
  background-color: #0056b3;
}

/* 會員頭像樣式 */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  /* 圓形顯示 */
  object-fit: cover;
  /* 確保圖片不變形 */
  border: 2px solid #007bff;
  /* 外框 */
  cursor: pointer;
}

.user-avatar:hover {
  border-color: #0056b3;
  /* 滑鼠懸停時變色 */
}

/* 響應式樣式 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    /* 導航欄內容垂直排列 */
    align-items: flex-start;
    padding: 20px;
  }

  .nav-left {
    flex-direction: column;
    /* Logo 和標題換行 */
    align-items: flex-start;
    margin-bottom: 20px;
    /* 與右側按鈕區域分隔 */
  }

  .nav-title h1 {
    font-size: 48px;
    /* 小螢幕縮小標題字體 */
  }

  .nav-logo {
    max-width: 150px;
    /* 小螢幕縮小 Logo */
    max-height: 100px;
  }

  .nav-right {
    flex-wrap: wrap;
    /* 將導航按鈕換行 */
    margin-top: 10px;
  }

  .nav-right li {
    margin-left: 0;
    margin-right: 10px;
    /* 減小按鈕之間的距離 */
  }

  .nav-right li a,
  .nav-right li button {
    font-size: 18px;
    /* 小螢幕縮小按鈕字體 */
    padding: 8px 16px;
  }
}
</style>
