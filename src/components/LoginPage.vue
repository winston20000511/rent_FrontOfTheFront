<template>
    <div>
    <!-- <div class="container-fluid mt-4"> -->
      <div class="row">
        <!-- Left side for future ads (you可以自訂) -->
        <div class="col-md-6 left-side"></div>
  
        <!-- Right side with login/register form -->
        <div class="col-md-6">
          <h3 class="text-center mb-4">Welcome to Rent189</h3>
  
          <!-- Mode selection buttons -->
          <ul class="nav nav-tabs mb-3" id="formTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab" aria-controls="login" aria-selected="true">登入</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button" role="tab" aria-controls="register" aria-selected="false">註冊</button>
            </li>
          </ul>
  
          <!-- Tab contents -->
          <div class="tab-content" id="formTabContent">
            <div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
              <LoginForm />
            </div>
            <div class="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import LoginForm from './LoginForm.vue';
  import RegisterForm from './RegisterForm.vue';
  
  export default {
    components: {
      LoginForm,
      RegisterForm
    }
  };
  </script>
  