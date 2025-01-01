<template>
    <div class="modal-overlay">
      <div class="modal-box">
        <span class="modal-close" @click="$emit('close')">&times;</span>
        <h2 class="modal-title">修改密碼</h2>
        <form @submit.prevent="submitPassword" class="modal-form">
          <div class="form-group">
            <label for="currentPassword">原密碼</label>
            <div class="input-group">
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                id="currentPassword"
                v-model="passwords.currentPassword"
                required
                class="form-control"
              />
              <span class="input-group-icon" @click="togglePasswordVisibility('current')">
                <i :class="showCurrentPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </span>
            </div>
          </div>
          <div class="form-group">
            <label for="newPassword">新密碼</label>
            <div class="input-group">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                id="newPassword"
                v-model="passwords.newPassword"
                required
                class="form-control"
              />
              <span class="input-group-icon" @click="togglePasswordVisibility('new')">
                <i :class="showNewPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </span>
            </div>
          </div>
          <div class="form-group">
            <label for="confirmPassword">再次輸入新密碼</label>
            <div class="input-group">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="passwords.confirmPassword"
                required
                class="form-control"
              />
              <span class="input-group-icon" @click="togglePasswordVisibility('confirm')">
                <i :class="showConfirmPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </span>
            </div>
          </div>
          <button type="submit" class="btn-primary" :disabled="isLoading">確認修改</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'PasswordModal',
    emits: ['close', 'passwordUpdated'],
    setup(_, { emit }) {
      const passwords = ref({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      const errorMessage = ref('');
      const successMessage = ref('');
      const isLoading = ref(false);
      const showCurrentPassword = ref(false);
      const showNewPassword = ref(false);
      const showConfirmPassword = ref(false);
  
      const isValidPassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
      };
  
      const togglePasswordVisibility = (type) => {
        if (type === 'current') showCurrentPassword.value = !showCurrentPassword.value;
        if (type === 'new') showNewPassword.value = !showNewPassword.value;
        if (type === 'confirm') showConfirmPassword.value = !showConfirmPassword.value;
      };
  
      const submitPassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwords.value;
  
        errorMessage.value = '';
        successMessage.value = '';
  
        // Validate new password
        if (!isValidPassword(newPassword)) {
          errorMessage.value = '新密碼格式不正確，需至少 8 位且包含英文與數字';
          return;
        }
  
        // Check if new password matches confirm password
        if (newPassword !== confirmPassword) {
          errorMessage.value = '新密碼與確認密碼不一致';
          return;
        }
  
        isLoading.value = true;
  
        try {
          // Make a fetch request
          const response = await fetch('http://localhost:8080/api/user/updatePassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
              oldPassword: currentPassword,
              newPassword,
            }),
          });
  
          if (response.ok) {
            successMessage.value = '密碼修改成功！';
            emit('passwordUpdated', newPassword);
            setTimeout(() => {
              emit('close');
            }, 2000);
          } else {
            const errorData = await response.json();
            errorMessage.value = errorData.message || '密碼修改失敗';
          }
        } catch (error) {
          errorMessage.value = '發生錯誤，請稍後再試';
        } finally {
          isLoading.value = false;
        }
      };
  
      return {
        passwords,
        errorMessage,
        successMessage,
        isLoading,
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword,
        togglePasswordVisibility,
        submitPassword,
      };
    },
  };
  </script>
  
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #888;
}

.modal-close:hover {
  color: #000;
}

.modal-title {
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.modal-form .form-group {
  margin-bottom: 15px;
}

.modal-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-group-icon {
  margin-left: 10px;
  cursor: pointer;
  color: #888;
  font-size: 1.2rem;
}

.input-group-icon:hover {
  color: #000;
}

.btn-primary {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>
