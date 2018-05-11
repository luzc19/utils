<style scoped>
.picker {
    display: inline-block;
    color:#ccc;
    border:3px dashed #ccc;
    width: 60px;
    height: 60px;
    line-height: 48px;
    text-align: center;
    font-size: 40px;
    font-weight: bolder;
    background: #fff;
    cursor: pointer;
}
.picker:hover {
    color: #fa7d3c;
    border-color: #fa7d3c;
}
.loading-img-box {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
}
.loading-img-box:before {
    content: ' ';
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
}
</style>
<template>
<el-upload
    class=""
    style="position: relative;line-height: 0;display: inline-block;vertical-align: bottom;"
    action="/bs/oldFile/upload/5/0"
    :disabled="disabled"
    :multiple="true"
    :show-file-list="false"
    :drag="true"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    accept="image/*"
    :before-upload="handleFile">
    <div class="loading-img-box" v-show="loading||value"><img v-if="value&&!loading" :src="value" style="max-width: 86%" ><img v-if="loading" src="../assets/loading.gif"  ></div>
    <slot>
        <label class="picker" ><span v-show="!loading&&!value">+</span></label>
    </slot>
</el-upload>
</template>
<script type="text/javascript">
export default {
    props:{
        value: {
            type:String,
            default:''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            toFinish:0,
            finished:0,
        };
    },
    computed:{
        loading() {
            return this.toFinish > this.finished;
        }
    },
    methods:{
        handleFile(file) {
            if(/image/.test(file.type)) {
                this.toFinish++;
            }else{
                alert('请选择图片进行上传')
                return false;
            }
        },
        uploadSuccess(data) {
            this.finished++;
            if(data.state==0){
                this.$emit('uploaded',data.result.data[0][0]);
                this.$emit('input',data.result.data[0][0]);
            }else{
                alert('上传图片失败，请稍后重试');
            }
        },
        uploadError(err) {
            this.finished++;
            alert('上传图片失败，请稍后重试');
        },
    }

}
</script>