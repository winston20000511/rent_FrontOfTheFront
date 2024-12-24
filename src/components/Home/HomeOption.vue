<script setup>
import { useOption } from '@/stores/optionStore';
import { ref } from 'vue';

    const emits = defineEmits(['update-flipped','update-option'])
    const optionStore = useOption();

    const errRef = ref('');
    const minprice = ref(0);
    const maxprice = ref(0);
    const washingmachine = ref(true);
    const airconditioner = ref(true);
    const network = ref(true);
    const bedstead = ref(true);
    const mattress = ref(true);
    const refrigerator = ref(true);
    const ewaterheater = ref(true);
    const gwaterheater = ref(true);
    const television = ref(true);
    const channelfour = ref(true);
    const sofaRef = ref(true);
    const tablesRef = ref(true);
    const petRef = ref(true);
    const parkingspace = ref(true);
    const elevatorRef = ref(true);
    const balconyRef = ref(true);
    const shortterm = ref(true);
    const cookingRef = ref(true);
    const waterdispenser = ref(true);
    const feeRef = ref(true);
    const genderRef = ref(0);
    const genderboy = ref(true);
    const gendergirl = ref(true);
    const houseRef = ref(true);
    const independenthouse = ref(true);
    const renthouse = ref(true);
    const sharehouse = ref(true);
    const priority = ref('a');

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

        let houseType='';
        if (houseRef.value){
            houseType = houseType + '透天,'
        }
        if(independenthouse.value){
            houseType = houseType + '獨立套房,'
        }
        if(renthouse.value){
            houseType = houseType + '分租套房,'
        }
        if(sharehouse.value){
            houseType = houseType + '雅房,'
        }
        houseType = houseType.substring(0,houseType.length-1)

        const options = {
            minPrice: minprice.value,
            maxPrice: maxprice.value,
            washingMachine: washingmachine.value,
            airConditioner: airconditioner.value,
            netWork: network.value,
            bedStead: bedstead.value,
            matTress: mattress.value,
            refRigerator: refrigerator.value,
            ewaterHeater: ewaterheater.value,
            gwaterHeater: gwaterheater.value,
            teleVision: television.value,
            channelFour: channelfour.value,
            sofa: sofaRef.value,
            tables: tablesRef.value,
            pet: petRef.value,
            parkingSpace: parkingspace.value,
            elevator: elevatorRef.value,
            balcony: balconyRef.value,
            shortTerm: shortterm.value,
            cooking: cookingRef.value,
            waterDispenser: waterdispenser.value,
            fee: feeRef.value,
            gender: genderRef.value,
            houseType: houseType,
            // house: houseRef.value,
            // independentHouse: independenthouse.value,
            // rentHouse: renthouse.value,
            // shareHouse: sharehouse.value,
            priority: priority.value,
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
        <div class="col-12 col-md-8">
            <div class="card border-secondary mb-3" style="width: 100%;">
                <div class="card-header">房屋篩選</div>
                <div class="card-body text-secondary">
                    <div class="row gy-4">
                        <div class="col-12 col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="washingmachine" id="washingMachine" checked>
                                <label class="form-check-label" for="washingMachine">
                                    洗衣機
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="airconditioner" id="airConditioner" checked>
                                <label class="form-check-label" for="airConditioner">
                                    冷氣
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="network" id="netWork" checked>
                                <label class="form-check-label" for="netWork">
                                    網路
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="bedstead" id="bedStead" checked>
                                <label class="form-check-label" for="bedStead">
                                    床架
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="mattress" id="matTress" checked>
                                <label class="form-check-label" for="matTress">
                                    床墊
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="refrigerator" id="refRigerator" checked>
                                <label class="form-check-label" for="refRigerator">
                                    冰箱
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="ewaterheater" id="ewaterHeater" checked>
                                <label class="form-check-label" for="ewaterHeater">
                                    電熱水器
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="gwaterheater" id="gwaterHeater" checked>
                                <label class="form-check-label" for="gwaterHeater">
                                    瓦斯熱水器
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="television" id="teleVision" checked>
                                <label class="form-check-label" for="teleVision">
                                    電視
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="channelfour" id="channelFour" checked>
                                <label class="form-check-label" for="channelFour">
                                    第四台
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="sofaRef" id="sofa" checked>
                                <label class="form-check-label" for="sofa">
                                    沙發
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="tablesRef" id="tables" checked>
                                <label class="form-check-label" for="tables">
                                    桌椅
                                </label>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="petRef" id="pet" checked>
                                <label class="form-check-label" for="pet">
                                    養寵物
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="parkingspace" id="parkingSpace" checked>
                                <label class="form-check-label" for="parkingSpace">
                                    停車位
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="elevatorRef" id="elevator" checked>
                                <label class="form-check-label" for="elevator">
                                    電梯
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="balconyRef" id="balcony" checked>
                                <label class="form-check-label" for="balcony">
                                    陽台
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="shortterm" id="shortTerm" checked>
                                <label class="form-check-label" for="shortTerm">
                                    短期租屋
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="cookingRef" id="cooking" checked>
                                <label class="form-check-label" for="cooking">
                                    開伙
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="waterdispenser" id="waterDispenser" checked>
                                <label class="form-check-label" for="waterDispenser">
                                    飲水機
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="feeRef" id="fee" checked>
                                <label class="form-check-label" for="fee">
                                    管理費
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="genderboy" id="genderBoy" checked>
                                <label class="form-check-label" for="genderBoy">
                                    限男
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="gendergirl" id="genderGirl" checked>
                                <label class="form-check-label" for="genderGirl">
                                    限女
                                </label>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="houseRef" id="House" checked>
                                <label class="form-check-label" for="House">
                                    透天
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="independenthouse" id="independentHouse" checked>
                                <label class="form-check-label" for="independentHuose">
                                    獨立套房
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="renthouse" id="rentHouse" checked>
                                <label class="form-check-label" for="rentHouse">
                                    分租套房
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="sharehouse" id="shareHouse" checked>
                                <label class="form-check-label" for="shareHouse">
                                    雅房
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-4">
            <div class="card border-secondary mb-3" style="max-width: 100%;">
                <div class="card-header">搜尋方式</div>
                <div class="card-body text-secondary">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="adsPriority" id="adsPriority" value="a" v-model="priority" checked>
                        <label class="form-check-label" for="adsPriority">
                            廣告優先
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="pricePriority" id="pricePriority" value="p" v-model="priority">
                        <label class="form-check-label" for="pricePriority">
                            價錢優先
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="clickPriority" id="clickPriority" value="c" v-model="priority">
                        <label class="form-check-label" for="clickPriority">
                            點擊優先
                        </label>
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