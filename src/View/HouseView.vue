<script setup>
import { ref, onMounted } from "vue";
import HouseTitle from "@/components/houses/page/HouseTitle.vue";
import HouseInfo from "@/components/houses/page/HouseInfo.vue";
import OwnerInfo from "@/components/houses/page/OwnerInfo.vue";
import HouseDescription from "@/components/houses/page/HouseDescription.vue";
import HousePhotos from "@/components/houses/housePhotos.vue";

// 接收 props
const props = defineProps({
  houseId: {
    type: Number,
    required: true, // 後端若要 Number
  },
});

// 定義 emits
const emit = defineEmits(["close"]);

// 收藏狀態
const isFavorited = ref(false);

// 生命週期 (onMounted) 時，向後端查詢是否已收藏
onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/houses/collect/exists/${props.houseId}`,
      {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("jwt"), 
        },
      }
    );
    const result = await response.json(); // 預期為 true/false
    isFavorited.value = result;
  } catch (error) {
    console.error("檢查收藏狀態失敗:", error);
  }
});

// 切換收藏
async function toggleFavorite() {
  if (isFavorited.value) {
    // 目前是已收藏 → 移除收藏
    await removeFavorite();
  } else {
    // 目前是未收藏 → 新增收藏
    await addFavorite();
  }
  // 狀態翻轉
  isFavorited.value = !isFavorited.value;
}

async function addFavorite() {
  try {
    await fetch(
      `http://localhost:8080/api/houses/collect/add/${props.houseId}`,
      {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      }
    );
    console.log("已加入收藏");
  } catch (error) {
    console.error("加入收藏失敗:", error);
  }
}

async function removeFavorite() {
  try {
    // 假設你的後端路徑是 /collect/remove/{houseId}?houseId=xxx
    // 也可能是 /collect/remove?houseId=xxx 要依後端實際路徑調整
    await fetch(
      `http://localhost:8080/api/houses/collect/remove/${props.houseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      }
    );
    console.log("已移除收藏");
  } catch (error) {
    console.error("移除收藏失敗:", error);
  }
}


</script>

<template>
  <div class="house-view-container">
    <div class="header">
      <!-- 收藏按鈕 -->
      <button class="favorite-btn" @click="toggleFavorite">
        <i :class="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
      </button>
    </div>

    <hr />

    <!-- 房屋圖片 -->
    <HousePhotos :houseId="houseId" />
    <hr />

    <!-- 房屋標題 -->
    <HouseTitle :houseId="houseId" />
    <hr />

    <div class="info-container">
      <!-- 房屋信息 -->
      <HouseInfo :houseId="houseId" />
      <!-- 房東信息 -->
      <OwnerInfo :houseId="houseId" />
    </div>

    <hr />

    <!-- 房屋描述 -->
    <HouseDescription :houseId="houseId" />
  </div>
</template>

<style scoped>
.house-view-container {
  /* 如果不用 dialog，可以用 position: fixed + 遮罩(overlay) */
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
}

/* 收藏按鈕 */
.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.favorite-btn .bi-heart-fill {
  color: red; /* 已收藏 → 實心愛心 */
}

.favorite-btn .bi-heart {
  color: gray; /* 未收藏 → 空心愛心 */
}


.close-btn .bi-x-lg {
  font-size: 18px;
  color: #333;
}

.header {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
