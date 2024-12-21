<template>
  <form @submit.prevent="submitForm">
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
    <!-- 其他欄位結構... -->

    <!-- 提交與取消按鈕 -->
    <div class="text-right">
      <button type="submit" class="btn btn-success">保存</button>
      <button
        type="button"
        class="btn btn-secondary ml-2"
        @click="$emit('close')"
      >
        取消
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: ["houseId"],
  data() {
    return {
      form: {}, // 編輯表單資料
    };
  },
  created() {
    this.loadHouseDetails();
  },
  methods: {
    async loadHouseDetails() {
      const response = await fetch(
        `http://localhost:8080/api/houses/details/${this.houseId}`
      );
      this.form = await response.json();
    },
    async submitForm() {
      await fetch(`http://localhost:8080/api/houses/${this.houseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.form),
      });
      this.$emit("close"); // 發送關閉事件
    },
  },
};
</script>
