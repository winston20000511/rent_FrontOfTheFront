<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <h2>修改會員資料</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="user_id">使用者ID</label>
            <input type="text" id="user_id" v-model="userData.user_id" disabled />
          </div>
          <div class="form-group">
            <label for="name">使用者名稱</label>
            <input type="text" id="name" v-model="userData.name" required />
          </div>
          <div class="form-group">
            <label for="email">電子信箱</label>
            <input type="email" id="email" v-model="userData.email" required />
          </div>
          <div class="form-group">
            <label for="password">密碼</label>
            <input type="password" id="password" v-model="userData.password" required />
          </div>
          <div class="form-group">
            <label for="phone">手機</label>
            <input type="text" id="phone" v-model="userData.phone" required />
          </div>
          <div class="form-group">
            <label for="picture">大頭貼</label>
            <input type="file" id="picture" @change="onFileChange" />
          </div>
          <div class="form-group">
            <label for="createtime">帳號創建日期</label>
            <input type="text" id="createtime" v-model="userData.createtime" disabled />
          </div>
          <div class="form-group">
            <label for="gender">性別</label>
            <select id="gender" v-model="userData.gender">
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="">不明</option>
            </select>
          </div>
          <div class="form-group">
            <label for="coupon">優惠券</label>
            <input type="text" id="coupon" v-model="userData.coupon" />
          </div>
          <div class="form-group">
            <label for="status">帳號狀態</label>
            <input type="text" id="status" v-model="userData.status" disabled />
          </div>
  
          <button type="submit">提交修改</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'ProfileForm',
    props: {
      userData: Object,
    },
    setup(props) {
      const onFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          // 處理文件上傳邏輯（例如，預覽圖像或上傳到伺服器）
        }
      };
      const submitForm = () => {
        // 提交表單邏輯，例如，發送請求到伺服器
        console.log('提交的資料:', props.userData);
      };
  
      return { onFileChange, submitForm };
    },
  };
  </script>
  
  <style scoped>
  .modal {
    display: block; /* 顯示模態框 */
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
  }
  
  .close {
    color: #aaa;
    float: right;
  }
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  .form-group {
    margin-bottom: 15px;
  }
  </style>
  