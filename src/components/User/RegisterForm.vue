<template>
    <form @submit.prevent="submitRegister">
      <div class="mb-3">
        <label for="registerName" class="form-label">姓名</label>
        <input type="text" class="form-control" id="registerName" v-model="name" placeholder="請輸入姓名" required>
      </div>
      <div class="mb-3">
        <label for="registerEmail" class="form-label">電子信箱</label>
        <input type="email" class="form-control" id="registerEmail" v-model="email" placeholder="請輸入電子信箱" required>
      </div>
      <div class="mb-3">
        <label for="registerPassword" class="form-label">密碼</label>
        <input type="password" class="form-control" id="registerPassword" v-model="password" placeholder="請輸入密碼" required>
        <small class="form-text text-muted">密碼至少8個字母</small>
      </div>
      <div class="mb-3">
        <label for="registerPhone" class="form-label">手機號碼</label>
        <input type="tel" class="form-control" id="registerPhone" v-model="phone" placeholder="請輸入手機號碼" required>
      </div>
      <div class="mb-3">
        <label class="form-label">性別</label><br>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="gender" value="0" v-model="gender" required>
          <label class="form-check-label" for="genderMale">男性</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="gender" value="1" v-model="gender" required>
          <label class="form-check-label" for="genderFemale">女性</label>
        </div>
      </div>
      <button type="submit" class="btn btn-primary w-100">註冊</button>
    </form>
    <div class="terms mt-3 text-center">
      <p>提交註冊即表示您同意Rent189的
        <br>
        <a href="/terms" class="terms-link" target="_blank">使用條款</a>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        phone: '',
        gender: null
      };
    },
    methods: {
      submitRegister() {
        // 在這裡處理註冊邏輯
        console.log('註冊:', this.name, this.email, this.password, this.phone, this.gender);
        // 這裡可以用axios向後端發送POST請求
      }
    }
  };
  </script>
  