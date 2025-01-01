```javascript
<template>
  <div class="edit-profile">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h4>修改會員資料</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label for="user_id" class="form-label">使用者ID</label>
                  <input
                    type="text" 
                    class="form-control"
                    id="user_id"
                    v-model="formData.userId"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label for="name" class="form-label">使用者名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="formData.name"
                  />
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">電子信箱</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="formData.email"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">密碼</label>
                  <small class="form-text">密碼需至少8個字母，並包含英數字</small>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="formData.password"
                  />
                  <span v-if="errors.password" class="error">{{ errors.password }}</span>
                </div>

                <div class="mb-3">
                  <label for="phone" class="form-label">手機</label>
                  <small class="form-text">手機格式須為0912345678</small>
                  <input
                    type="text"
                    class="form-control"
                    id="phone"
                    v-model="formData.phone"
                  />
                  <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
                </div>

                <div class="mb-3">
                  <label for="picture" class="form-label">大頭貼</label>
                  <input 
                    type="file" 
                    class="form-control"
                    id="picture"
                    @change="handleFileChange"
                  />
                  <img 
                    v-if="formData.picturePreview" 
                    :src="formData.picturePreview" 
                    alt="圖片預覽"
                    class="mt-2 img-thumbnail"
                  />
                  <span v-if="errors.picture" class="error">{{ errors.picture }}</span>
                </div>

                <div class="mb-3">
                  <label for="createtime" class="form-label">帳號創建日期</label>
                  <input
                    type="text"
                    class="form-control"
                    id="createtime"
                    v-model="formData.createTime"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label for="gender" class="form-label">性別</label>
                  <select class="form-select" id="gender" v-model="formData.gender">
                    <option value="0">男</option>
                    <option value="1">女</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="coupon" class="form-label">優惠券</label>
                  <input
                    type="number"
                    class="form-control"
                    id="coupon"
                    v-model="formData.coupon"
                    disabled
                  />
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  {{ loading ? '提交中...' : '儲存修改' }}
                </button>
                
                <button
                  type="button"
                  class="btn btn-danger ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmModal"
                >
                  刪除帳號
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="confirmModal"
      tabindex="-1"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmModalLabel">確認操作</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            確定要停用您的帳號嗎？此操作無法撤銷，未來將無法再登入。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmDeactivate"
              data-bs-dismiss="modal"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api/api";

export default {
  data() {
    return {
      formData: {
        userId: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        picture: null,
        picturePreview: null,
        createTime: '',
        gender: '0',
        coupon: 0
      },
      errors: {
        phone: '',
        password: '',
        picture: ''
      },
      loading: false
    };
  },
  
  created() {
    this.loadUserData();
  },

  methods: {
    async loadUserData() {
      try {
        const response = await api.post("http://localhost:8080/api/user/userCenter");
        const userData = response.data;
        this.formData = {
          ...userData,
          password: '',
          picture: null,
          picturePreview: null
        };
      } catch (error) {
        console.error("載入會員資料失敗", error);
        alert("無法載入會員資料，請稍後再試！");
      }
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.errors.picture = '僅支援 JPEG 或 PNG 格式的圖片';
        return;
      }

      if (file.size > 1024 * 1024) {
        this.errors.picture = '圖片大小不可超過 1MB';
        return;
      }

      this.errors.picture = '';
      this.formData.picture = file;

      const reader = new FileReader();
      reader.onload = e => this.formData.picturePreview = e.target.result;
      reader.readAsDataURL(file);
    },

    validateForm() {
      let isValid = true;
      this.errors = { phone: '', password: '', picture: '' };

      const phoneRegex = /^09\d{8}$/;
      if (!phoneRegex.test(this.formData.phone)) {
        this.errors.phone = '電話格式錯誤，應為 0912345678';
        isValid = false;
      }

      if (this.formData.password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(this.formData.password)) {
          this.errors.password = '密碼需至少 8 位且包含英文字母與數字';
          isValid = false;
        }
      }

      return isValid;
    },

    async handleSubmit() {
      if (!this.validateForm()) return;

      this.loading = true;
      const formData = new FormData();
      
      Object.keys(this.formData).forEach(key => {
        if (key !== 'picturePreview' && this.formData[key] !== null) {
          formData.append(key, this.formData[key]);
        }
      });

      try {
        await api.put("http://localhost:8080/api/user/update", formData);
        alert("會員資料更新成功！");
      } catch (error) {
        console.error("更新會員資料失敗", error);
        alert("更新失敗，請檢查輸入內容！");
      } finally {
        this.loading = false;
      }
    },

    async confirmDeactivate() {
      try {
        await api.post("http://localhost:8080/api/user/deactivate");
        alert("帳號已停用");
        this.$router.push('/login');
      } catch (error) {
        console.error("停用帳號失敗", error);
        alert("停用帳號失敗，請稍後再試！");
      }
    }
  }
};
</script>

<style scoped>
.form-text {
  color: red;
  margin-top: 2px;
}

.form-label {
  margin-bottom: 2px;
  font-weight: bold;
}

.error {
  color: red;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
}

.edit-profile {
  font-family: 'Arial', sans-serif;
}

.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #007bff;
  color: white;
  font-size: 1.25rem;
  border-radius: 10px 10px 0 0;
}

.card-body {
  padding: 2rem;
}

.img-thumbnail {
  max-width: 200px;
  border-radius: 5px;
}
</style>
