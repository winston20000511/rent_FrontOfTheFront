<script setup>
import { ref } from "vue";

// 定義 Props
const props = defineProps({
  messageTitle: {
    type: String,
    required: true,
    default: "",
  },
  message: {
    type: String,
    required: true,
    default: "",
  },
  showMessage: {
    type: Boolean,
    required: true,
    default: false,
  },
  isCancelOrder: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// 定義 Emits
const emit = defineEmits(["close-message", "submit-reason"]);

// 定義選項
const reasons = ref({
  price: false,
  performance: false,
  service: false,
  other: false,
});
const otherReason = ref(""); // 用來儲存「其他原因」的文字

// 提交原因
const submitReason = () => {
  const selectedReasons = Object.keys(reasons.value).filter(
    (key) => reasons.value[key]
  );
  const reasonDetails = {
    reasons: selectedReasons,
    otherReason: reasons.value.other ? otherReason.value.trim() : "",
  };

  emit("submit-reason", reasonDetails);
  emit("close-message");
};

// 關閉訊息
const closeMessage = () => {
  emit("close-message");
};
</script>

<template>
  <div
    class="fixed inset-0 z-20 bg-gray-500/75 flex items-center justify-center"
    @click="closeMessage"
  >
    <div
      v-show="showMessage"
      class="fixed inset-0 z-10 bg-gray-500/75 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-lg w-3/4" @click.stop>
        <div class="m-4">
          <h3 class="text-2xl font-semibold m-4 text-gray-900 text-center">
            {{ messageTitle }}
          </h3>

          <p class="text-center text-gray-700 mb-6">
            {{ message }}
          </p>

          <div v-show="isCancelOrder"class="mb-4 text-center">
            <div class="font-bold text-lg py-2">
              您的意見能使我們提供更完善的服務
            </div>
            <div class="flex justify-center items-center space-x-2 text-center">
              <label for="reason-price" class="text-sm text-gray-700">
                <input type="checkbox" id="reason-price" class="rounded" /> 價格
              </label>
              <label for="reason-effectiveness" class="text-sm text-gray-700">
                <input
                  type="checkbox"
                  id="reason-effectiveness"
                  class="rounded"
                />
                成效不符
              </label>
              <label for="reason-service" class="text-sm text-gray-700">
                <input type="checkbox" id="reason-service" class="rounded" />
                服務品質
              </label>
              <label for="reason-other" class="text-sm text-gray-700">
                <input type="checkbox" id="reason-other" class="rounded" /> 其他
              </label>
            </div>
            <div>
              <textarea
                class="w-3/4 border border-gray-300 rounded p-2 mt-2"
                placeholder="請填寫原因"
              ></textarea>
            </div>
            <div>
              
            </div>

            <div class="text-right mt-6">
              <button
                @click="submitReason"
                type="button"
                v-show="isCancelOrder"
                class="px-3 py-1.5 m-2 bg-gray-500 text-white rounded hover:bg-gray-400"
              >
                提交
              </button>
              <button
                @click="closeMessage"
                type="button"
                class="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-400"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
