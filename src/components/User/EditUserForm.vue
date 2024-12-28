<template>
    <div class="edit-user-form">
      <h2>修改會員資料</h2>
      <form @submit.prevent="updateUser">
        <div class="mb-3">
          <label for="name" class="form-label">使用者名稱</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model="user.name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">電子信箱</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="user.email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">密碼</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="user.password"
            required
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">手機</label>
          <input
            type="tel"
            id="phone"
            class="form-control"
            v-model="user.phone"
          />
        </div>
        <div class="mb-3">
          <label for="picture" class="form-label">大頭貼</label>
          <input
            type="file"
            id="picture"
            class="form-control"
            @change="handleFileUpload"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">帳號創建日期</label>
          <input
            type="text"
            class="form-control"
            :value="user.createtime"
            disabled
          />
        </div>
        <div class="mb-3">
          <label class="form-label">性別</label>
          <select class="form-select" v-model="user.gender">
            <option value="0">男</option>
            <option value="1">女</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">優惠券</label>
          <input
            type="number"
            class="form-control"
            :value="user.coupon"
            disabled
          />
        </div>
        <div class="mb-3">
          <label class="form-label">帳號狀態</label>
          <input
            type="text"
            class="form-control"
            :value="user.status"
            disabled
          />
        </div>
        <button type="submit" class="btn btn-primary">保存更改</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "EditUserForm",
    props: {
      userData: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        user: { ...this.userData }, // 用 props 初始化表單數據
      };
    },
    methods: {
      updateUser() {
        // 將修改後的數據傳遞給父元件
        this.$emit("update-user", this.user);
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        this.user.picture = file; // 儲存上傳的檔案
      },
    },
  };
  </script>
  
  <style scoped>
  .edit-user-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style> 