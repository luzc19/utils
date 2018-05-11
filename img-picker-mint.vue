<style scoped>

.file-box {
    position: relative;
    width: 40px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    background: url(../assets/add-big.png);
    background-size: contain;
}
.btn-file {
    width: 100%;
    height: 100%;
    display: inline-block;
    font-size: 16px;
    overflow: hidden;
    cursor: pointer;
}
.btn-file img {
    max-width: 100%;
    max-height: 100%;
}
.icon-remove {
    background: #f00;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    line-height: 22px;
    color: #fff;
    position: absolute;
    right: -10px;
    top: -10px;
    text-align: center;
    cursor: pointer;
}
.icon-remove span {
    font-size: 12px;
}
.loading-img {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;

}
</style>
<template>
<div class="file-box" v-show="!disabled">
    <label class="btn-file">
        <div class="loading-img"><img src="../assets/loading.gif" v-if="loading"></div>
        <input type="file" name="" style="display: none;" @change="uploadImg" multiple="true" accept="image/*">
    </label>
</div>

</template>
<script type="text/javascript">
import { Toast } from 'mint-ui';
import press from '@/components/img-adapter.js';

export default {
    props:{
        img:{
            type:String,
            default:''
        },
        disabled:{
            type:Boolean,
            default:false
        }
    },
    components:{

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
        uploadImg($event){
            let axios = this.$axios;
            let _this = this;
            let files = $event.target.files;
            if(files.length){
                this.toFinish += files.length
                for(let i = 0; i < files.length; i++){
                    let reader = new FileReader();
                    reader.onload = function(oFREvent){
                        let quality = 0.7;
                        let limitWidth = 1200;
                        // 压缩后上传
                        press(oFREvent.target.result, quality, limitWidth)
                        .then((dataURL)=>{
                            return axios({
                                url:'/bs/file/upload/image',
                                method: 'post',
                                data:{
                                    base64: dataURL,
                                    size:dataURL.length
                                }
                            })
                        })
                        .then((res)=>{
                            _this.finished++;
                            if(res.data.state == 0){
                                _this.$emit('uploaded',res.data.data);
                                return res.data.data
                            }
                            return Promise.reject(res.data.msg);
                        })
                        .catch((err)=>{
                            console.log(err);
                            _this.finished++;
                            Toast(typeof err == 'string'?err:'上传图片失败，请稍后重试');
                        })

                    }
                    reader.readAsDataURL(files[i]);
                }

                // 清空input的value 以便再次选择同一个文件时依然触发change
                $event.target.value = '';
            }
        },

    },

}
</script>