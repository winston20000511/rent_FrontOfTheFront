<template>
  <div class="container mt-5">
    <h2 class="text-center section-title">更新房屋</h2>
    <hr />
    <form @submit.prevent="submitForm">
      <!-- 房屋基本資料 -->
      <div class="form-group">
        <label for="title">標題</label>
        <input
          type="text"
          id="title"
          class="form-control"
          v-model="form.title"
          required
        />
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="price">價格</label>
          <input
            type="number"
            id="price"
            class="form-control"
            v-model.number="form.price"
            required
            min="0"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="size">坪數</label>
          <input
            type="number"
            id="size"
            class="form-control"
            v-model.number="form.size"
            required
            min="1"
          />
        </div>
      </div>
      <div class="form-group">
        <label for="address">詳細地址</label>
        <input
          type="text"
          id="address"
          class="form-control"
          v-model="form.address"
          required
        />
      </div>
      <div class="form-row">
        <div class="form-group col-md-3">
          <label for="room">房間數</label>
          <input
            type="number"
            id="room"
            class="form-control"
            v-model.number="form.room"
            required
            min="0"
          />
        </div>
        <div class="form-group col-md-3">
          <label for="bathroom">浴廁數量</label>
          <input
            type="number"
            id="bathroom"
            class="form-control"
            v-model.number="form.bathroom"
            required
            min="0"
          />
        </div>
        <div class="form-group col-md-3">
          <label for="livingroom">客廳數量</label>
          <input
            type="number"
            id="livingroom"
            class="form-control"
            v-model.number="form.livingroom"
            required
            min="0"
          />
        </div>
        <div class="form-group col-md-3">
          <label for="floor">樓層</label>
          <input
            type="number"
            id="floor"
            class="form-control"
            v-model.number="form.floor"
            required
            min="-3"
          />
        </div>
      </div>
      <div class="form-group">
        <label for="houseType">房屋類型</label>
        <select
          id="houseType"
          class="form-control"
          v-model="form.houseType"
          required
        >
          <option value="雅房">雅房</option>
          <option value="分租套房">分租套房</option>
          <option value="獨立套房">獨立套房</option>
          <option value="透天">透天</option>
          <option value="公寓">公寓</option>
          <option value="別墅">別墅</option>
        </select>
      </div>
      <div class="form-group">
        <label>
          <input
            type="checkbox"
            v-model="form.atticAddition"
          />
          是否為頂樓加蓋
        </label>
      </div>

      <!-- 提供家具與服務 -->
      <hr />
      <h3 class="section-title">提供家具與服務</h3>
      <div class="furniture-services">
        <label
          v-for="(value, key) in furnitureServices"
          :key="key"
          class="icon-label"
        >
          <input
            type="checkbox"
            v-model="furnitureServices[key]"
          />
          <img
            :src="getIconPath(key)"
            :alt="key"
            class="icon-image"
          />
          {{ key }}
        </label>
      </div>

      <!-- 房屋限制 -->
      <hr />
      <h3 class="section-title">房屋限制</h3>
      <div class="house-restrictions">
        <label
          v-for="(value, key) in houseRestrictions"
          :key="key"
          class="icon-label"
        >
          <input
            type="checkbox"
            v-model="houseRestrictions[key]"
          />
          <img
            :src="getIconPath(key)"
            :alt="key"
            class="icon-image"
          />
          {{ key }}
        </label>
      </div>

      <!-- 簡介 -->
      <hr />
      <h3 class="section-title">簡介</h3>
      <div class="form-group">
        <textarea
          class="form-control"
          id="description"
          v-model="form.description"
        ></textarea>
      </div>

      <!-- 提交按鈕 -->
      <button type="submit" class="btn btn-primary mt-3">
        提交更新
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'HouseUpdate',
  props: {
    houseId: {
      type: Number,
      required: true,
    },
  },
  emits: ['close'],
  data() {
    return {
      form: {
        title: '',
        price: null,
        size: null,
        address: '',
        room: null,
        bathroom: null,
        livingroom: null,
        floor: null,
        description: '',
        houseType: '',
        atticAddition: false,
      },
      furnitureServices: {},
      houseRestrictions: {},
      iconPaths: {
        washingMachine: '../../assets/icon/house-on/washingMachine.ico',
        airConditioner: '../../assets/icon/house-on/airConditioner.ico',
        network: '../../assets/icon/house-on/network.ico',
        bedstead: '../../assets/icon/house-on/Bedsteck.ico',
        mattress: '../../assets/icon/house-on/mattress.ico',
        refrigerator: '../../assets/icon/house-on/refrigerator.ico',
        ewaterHeater: '../../assets/icon/house-on/ewaterHeater.ico',
        gwaterHeater: '../../assets/icon/house-on/gas.ico',
        television: '../../assets/icon/house-on/TV.ico',
        channel4: '../../assets/icon/house-on/channel4.ico',
        sofa: '../../assets/icon/house-on/sofa.ico',
        tables: '../../assets/icon/house-on/desk.ico',
        pet: '../../assets/icon/house-on/PET.ico',
        parkingSpace: '../../assets/icon/house-on/Parking.ico',
        elevator: '../../assets/icon/house-on/elevator.ico',
        balcony: '../../assets/icon/house-on/balcony.ico',
        shortTerm: '../../assets/icon/house-on/shortTerm.ico',
        cooking: '../../assets/icon/house-on/cooking.ico',
        waterDispenser: '../../assets/icon/house-on/waterDispenser.ico',
        fee: '../../assets/icon/house-on/FEE.ico',
        genderRestrictions: '../../assets/icon/house-on/gender.ico',
      },
    };
  },
  mounted() {
    this.fetchHouseDetails();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    getIconPath(key) {
      return this.iconPaths[key] || '';
    },
    // 1) 抓取資料 -> 0/1 轉布林
    async fetchHouseDetails() {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(
          `http://localhost:8080/api/houses/details/${this.houseId}`,
          {
            method: 'GET',
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        // 將回傳資料填入表單
        Object.assign(this.form, {
          title: data.title,
          price: data.price,
          size: data.size,
          address: data.address,
          room: data.room,
          bathroom: data.bathroom,
          livingroom: data.livingroom,
          floor: data.floor,
          description: data.description,
          houseType: data.houseType,
          atticAddition: data.atticAddition,
        });

        // furnitureServices 可能是 {"washingMachine":0,"airConditioner":1,...}
        // 將 0/1 轉成布林 false/true
        this.furnitureServices = {};
        for (const key in data.furnitureServices) {
          this.furnitureServices[key] = data.furnitureServices[key] === 1;
        }

        // houseRestrictions 也同樣處理
        this.houseRestrictions = {};
        for (const key in data.houseRestrictions) {
          this.houseRestrictions[key] = data.houseRestrictions[key] === 1;
        }
      } catch (error) {
        console.error('無法獲取房屋資料:', error);
      }
    },

    // 2) 提交資料 -> 將布林轉成 0/1 再送給後端
    async submitForm() {
      try {
        const token = localStorage.getItem('jwt');
        // 先把 form 直接複製
        const houseData = { ...this.form };

        // 再把布林的 furnitureServices / houseRestrictions 轉回 0/1
        const furnitureData = {};
        for (const key in this.furnitureServices) {
          furnitureData[key] = this.furnitureServices[key] ? 1 : 0;
        }

        const restrictionsData = {};
        for (const key in this.houseRestrictions) {
          restrictionsData[key] = this.houseRestrictions[key] ? 1 : 0;
        }

        const response = await fetch(
          `http://localhost:8080/api/houses/update/${this.houseId}`,
          {
            method: 'POST',
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              houseData,
              furnitureServices: furnitureData,   // 送 0/1 回後端
              houseRestrictions: restrictionsData // 送 0/1 回後端
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        alert('更新成功！');
        this.closeModal();
      } catch (error) {
        console.error('更新失敗:', error);
        alert('更新失敗');
      }
    },
  },
};
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}

.container {
  width: 60%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.75em;
  margin-bottom: 10px;
  text-align: center;
}

hr {
  margin: 20px 0;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-group {
  flex: 1;
}

.form-group.col-md-3 {
  flex: 1 0 23%;
}

.form-group.col-md-6 {
  flex: 1 0 48%;
}

.form-group.col-md-12 {
  flex: 1 0 100%;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.icon-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.icon-label img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.icon-label input[type='checkbox'] {
  margin-right: 10px;
}

.furniture-services {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.house-restrictions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
