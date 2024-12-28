<template>
    <div class="owner-info-container">
      <!-- 屋主大头照和名字电话 -->
      <div class="owner-info">
        <img :src="'data:image/jpeg;base64,' + ownerInfo.picture" alt="屋主照片" class="owner-avatar" />
        <div class="owner-details">
          <p class="owner-name">{{ ownerInfo.name }}</p>
          <p class="owner-phone">{{ ownerInfo.phone }}</p>
        </div>
      </div>
  
      
      <!-- 预约时间选择 -->
      <div class="appointment-section">
        <label for="appointment-time">选择预约时间：</label>
        <input type="datetime-local" v-model="appointmentTime" id="appointment-time" />
      </div>
  
      <!-- 发送信息按钮 -->
      <div class="message-section">
        <button @click="sendMessage" class="send-message-button">发送信息</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        ownerInfo: {
          name: '',     // 屋主姓名
          phone: '',    // 屋主电话
          picture: '',  // Base64 编码的图片
        },
        appointmentTime: '',  // 用户选择的预约时间
      };
    },
    methods: {
      // 模拟发送信息
      sendMessage() {
        alert(`发送信息给 ${this.ownerInfo.name}，预约时间：${this.appointmentTime}`);
        // 在这里可以调用接口来发送信息
      },
      // 使用 fetch 获取屋主信息
      async fetchOwnerInfo() {
        const houseId = this.$route.params.houseId;  // 假设房屋ID通过路由传递
        try {
          const response = await fetch(`/api/owner/${houseId}`);
          if (!response.ok) {
            throw new Error('网络请求失败');
          }
          const data = await response.json();
          this.ownerInfo = data;  // 将返回的数据赋值给 ownerInfo
        } catch (error) {
          console.error('获取屋主信息失败:', error);
        }
      },
    },
    created() {
      this.fetchOwnerInfo(); // 获取屋主信息
    },
  };
  </script>
  
  <style scoped>
  .owner-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  
  .owner-info {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .owner-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .owner-details {
    display: flex;
    flex-direction: column;
  }
  
  .owner-name {
    font-size: 18px;
    font-weight: bold;
  }
  
  .owner-phone {
    font-size: 14px;
    color: #555;
  }
  
  .appointment-section {
    margin-bottom: 20px;
  }
  
  .send-message-button {
    background-color: #3579C0;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .send-message-button:hover {
    background-color: #0056b3;
  }
  </style>
  