<script setup>
import { useOption } from '@/stores/optionStore';
import { onMounted, ref } from 'vue';

    const emits = defineEmits(['update-flipped','update-option'])
    const optionStore = useOption();

    const errRef = ref('');
    const minprice = ref(0);
    const maxprice = ref(0);
    const petRef = ref(true);
    const parkingspace = ref(true);
    const elevatorRef = ref(true);
    const balconyRef = ref(true);
    const shortterm = ref(true);
    const cookingRef = ref(true);
    const waterdispenser = ref(true);
    const feeRef = ref(true);
    const genderRef = ref(2);
    const genderboy = ref(true);
    const gendergirl = ref(true);
    const houseRef = ref(true);
    const independenthouse = ref(true);
    const renthouse = ref(true);
    const sharehouse = ref(true);
    const housetype = ref('');
    const priorityRef = ref('a');
    const sortRef = ref('desc');

    const showMap = ()=>{
        emits('update-flipped')
    }
    const saveConfig = ()=>{

        if (minprice.value > maxprice.value){
            errRef.value="租金範圍有誤 , 最小值不能大於最大值";
            return
        }

        if (genderboy.value && gendergirl.value){
            genderRef.value = 2
        }else if(gendergirl.value){
            genderRef.value = 1
        }else{
            genderRef.value = 0
        }

        housetype.value='';
        if (houseRef.value){
            housetype.value = housetype.value + '透天,'
        }
        if(independenthouse.value){
            housetype.value = housetype.value + '獨立套房,'
        }
        if(renthouse.value){
            housetype.value = housetype.value + '分租套房,'
        }
        if(sharehouse.value){
            housetype.value = housetype.value + '雅房,'
        }
        housetype.value = housetype.value.substring(0,housetype.value.length-1)

        const options = {
            minPrice: minprice.value,
            maxPrice: maxprice.value,
            pet: petRef.value,
            parkingSpace: parkingspace.value,
            elevator: elevatorRef.value,
            balcony: balconyRef.value,
            shortTerm: shortterm.value,
            cooking: cookingRef.value,
            waterDispenser: waterdispenser.value,
            fee: feeRef.value,
            gender: genderRef.value,
            houseType: housetype.value,
            priority: priorityRef.value,
            sort: sortRef.value
        }
        errRef.value='';
        optionStore.updateData(options);
        emits('update-flipped');
        console.log(JSON.stringify(options));
    }
    
</script>
<template>
    <main>
        
    <div class="container py-2 px-2 bg-body custom-shadow">
    <div class="row">
        <p class="err" v-text="errRef"></p>
        <div class="col-12 col-md-12">
            <div class="card border-secondary mb-3" style="max-width: 100%;">
                <div class="card-header">租金範圍</div>
                <div class="card-body text-secondary">
                    <div class="row gy-4">
                    <div class="col-12 col-md-6">
                        <label for="price-minimum">Minimum</label>
                        <input type="text" id="price-minimum" class="form-control" v-model="minprice">
                    </div>
                    <div class="col-12 col-md-6">
                        <label for="price-maximum">Maximum</label>
                        <input type="text" id="price-maximum" class="form-control" v-model="maxprice">
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="card border-secondary mb-3" style="width: 100%;">
                <div class="card-header">房屋篩選</div>
                <div class="card-body text-secondary">
                    <div class="row gy-4">
                        <div class="col-12 col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="petRef" id="pet">
                                <label class="form-check-label" for="pet">
                                    養寵物
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="parkingspace" id="parkingSpace">
                                <label class="form-check-label" for="parkingSpace">
                                    停車位
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="elevatorRef" id="elevator">
                                <label class="form-check-label" for="elevator">
                                    電梯
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="balconyRef" id="balcony">
                                <label class="form-check-label" for="balcony">
                                    陽台
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="shortterm" id="shortTerm">
                                <label class="form-check-label" for="shortTerm">
                                    短期租屋
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="cookingRef" id="cooking">
                                <label class="form-check-label" for="cooking">
                                    開伙
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="waterdispenser" id="waterDispenser">
                                <label class="form-check-label" for="waterDispenser">
                                    飲水機
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="feeRef" id="fee">
                                <label class="form-check-label" for="fee">
                                    管理費
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="genderboy" id="genderBoy">
                                <label class="form-check-label" for="genderBoy">
                                    限男
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="gendergirl" id="genderGirl">
                                <label class="form-check-label" for="genderGirl">
                                    限女
                                </label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="houseRef" id="House">
                                <label class="form-check-label" for="House">
                                    透天
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="independenthouse" id="independentHouse">
                                <label class="form-check-label" for="independentHuose">
                                    獨立套房
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="renthouse" id="rentHouse">
                                <label class="form-check-label" for="rentHouse">
                                    分租套房
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="sharehouse" id="shareHouse">
                                <label class="form-check-label" for="shareHouse">
                                    雅房
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="card border-secondary mb-3" style="max-width: 100%;">
                <div class="card-header">搜尋方式</div>
                <div class="card-body text-secondary">
                    <div class="row gy-4">
                        <div class="col-12 col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="adsPriority" id="adsPriority" value="a" v-model="priorityRef">
                                <label class="form-check-label" for="adsPriority">
                                    廣告優先
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="pricePriority" id="pricePriority" value="p" v-model="priorityRef">
                                <label class="form-check-label" for="pricePriority">
                                    價錢優先
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="clickPriority" id="clickPriority" value="c" v-model="priorityRef">
                                <label class="form-check-label" for="clickPriority">
                                    點擊優先
                                </label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="sortDesc" id="sortDesc" value="desc" v-model="sortRef">
                                <label class="form-check-label" for="sortDesc">
                                    高到低
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="sortAsc" id="sortAsc" value="asc" v-model="sortRef">
                                <label class="form-check-label" for="sortAsc">
                                    低到高
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="card border-secondary mb-3" style="max-width: 100%;">
                <button class="btn btn-primary" @click="saveConfig">SAVE</button>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="card border-secondary mb-3" style="max-width: 100%;">
                <button class="btn btn-primary" @click="showMap">Cancel</button>
            </div>
        </div>
    </div>
    </div>
    </main>

</template>
<style scoped>
    main{
        width: 100%;
        height: 200px;
    }
    .err{
        font-size: 16px;
        color: red;
    }
</style>