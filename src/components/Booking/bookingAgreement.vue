<template>
    <div class="agreement">
        <div class="agreement-f mb-2">
            <div class="form-check">
                <input type="checkbox" id="agreement" class="form-check-input" v-model="isAgreed"
                    @change="emitAgreement">
                <label for="agreement" class="form-check-label">我已閱讀並同意預約同意條款</label>
            </div>

            <button class="btn btn-link" @click="showTerms = !showTerms">
                {{ showTerms ? '隱藏條款' : '查看條款' }}
            </button>
        </div>
        <div v-if="showTerms" class="container mt-3">
            <h5>預約同意條款</h5>
            <p>感謝您使用我們的預約服務。請在提交預約之前仔細閱讀以下條款：</p>
            <ol>
                <li><strong>信息收集：</strong> 我們將收集您的姓名、電話號碼和電子郵件地址，以便於我們能夠與您聯繫並確認您的預約。</li>
                <li><strong>信息使用：</strong> 您提供的信息將僅用於確認您的預約及相關聯繫。</li>
                <li><strong>信息保護：</strong> 我們承諾保護您的個人信息，並採取合理的安全措施來防止未經授權的訪問、使用或披露。</li>
                <li><strong>第三方分享：</strong> 我們不會將您的個人信息出售或租賃給第三方。只有在法律要求或為了保護我們的權益時，我們才會披露您的信息。</li>
                <li><strong>同意：</strong> 通過提交您的預約，您表示您已閱讀並理解本同意條款，並同意我們收集和使用您的個人信息。</li>
                <li><strong>聯繫我們：</strong> 如果您對本條款有任何疑問或擔憂，請隨時與我們聯繫：<br />
                    電子郵件： rent189.customer.service@gmail.com
                </li>
            </ol>
            <button class="btn btn-link" @click="showTerms = false">
                返回查看條款
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    isAgreed: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:isAgreed']);

const isAgreed = ref(props.isAgreed); // 用於存儲複選框的狀態
const showTerms = ref(false);

const emitAgreement = () => {
    emit('update:isAgreed', isAgreed.value);
};

watch(isAgreed, (newValue) => {
    emit('update:isAgreed', newValue);
});
</script>

<style scoped>
.agreement {
    margin: 10px 0;
}

.agreement-f {
    display: flex;
    align-items: center;
}

.container {
    background-color: var(--bs-gray-200);
    text-align: start;
}
</style>
