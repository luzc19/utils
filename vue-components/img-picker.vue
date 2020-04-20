<style scoped>
.picker-container {
  position: relative;
  border: 1px solid #ddd;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  cursor: pointer;
  background: #fff;
  vertical-align: middle;
}
.picker-container.disabled {
  background: #f4f4f5;
  cursor: not-allowed;
}
.high-light:hover {
  color: #409EFF;
  border-color: #409EFF;
}
.icon-loading {
  color: #409EFF;
}

.icon-remove {
  position: absolute;
  right: -8px;
  top: -8px;
  font-size: 16px;
  color: #e60012;
  background: #fff;
  border-radius: 50%;
}
.icon-remove:hover {
  opacity: 0.8;
}
</style>

<template>
<label class="picker-container" :class="{'high-light': !disabled, disabled: disabled}" :style="contentStyle">
  <img v-if="value&&!loading" :src="value" v-img />
  <span v-show="loading" class="el-icon-loading icon-loading" :style="iconStyle"></span>
  <span v-if="!value&&!loading" class="el-icon-plus" :style="iconStyle"></span>
  <a href="javascript:;" v-if="value && !loading && !disabled" class="el-icon-error icon-remove" @click.stop="remove"></a>
  <input type="file" name="" style="display: none;" :disabled="value!=='' || disabled" @change="uploadImg" multiple="true" accept="image/*">
</label>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';
import { MessageBox } from 'element-ui';
import upload from '@/components/upload';

export default {
  mixins: [emitter],
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    private: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: null,
    },
    limitSize: {
      type: Number, // 以m为单位 1m = 1024kb
      default: null,
    },
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    width: {
      type: String, // 只支持px值
    },
    height: {
      type: String, // 只支持px值
    },
  },
  data() {
    return {
      toFinish: 0,
      finished: 0,
    };
  },
  computed: {
    loading() {
      return this.toFinish > this.finished;
    },
    action() {
      return this.private ? '/file/uploadPrivateFile' : '/file/uploadFile';
    },
    contentStyle() {
      if (this.width) {
        return {
          width: this.width,
          height: this.height || this.width,
        };
      }
      return {};
    },
    iconStyle() {
      const scale = 0.768;
      if (this.width && Number.parseInt(this.width, 10)) {
        return {
          'font-size': (Number.parseInt(this.width, 10) * scale).toFixed(0) + 'px',
        };
      }
      return {
        'font-size': '24px',
      };
    },
  },
  methods: {
    uploadImg($event) {
      let files = Array.from($event.target.files);
      if (files.length < 1) return;
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.handleExceed();
        return;
      }
      if (files.length) {
        files.forEach((file) => {
          // 限制图片大小（对比kb）
          if (this.limitSize && this.limitSize !== null) {
            const imgSize = Number(file.size / 1024).toFixed(2);
            const compareSize = Number(this.limitSize * 1024).toFixed(2);
            if (Number(imgSize) > Number(compareSize)) {
              this.$message({ message: `上传图片大小不得超过${this.limitSize}M`, type: 'error' });
              return;
            }
          }
          this.toFinish++;
          upload(this.action, file).then((data) => {
            this.finished++;
            return data;
          }, (error) => {
            this.finished++;
            return Promise.reject(error);
          }).then(this.uploadSuccess, this.uploadError);
        });
      }
      // 清空input的value 以便再次选择同一个文件时依然触发change
      let inputElement = $event.target;
      inputElement.value = '';
    },
    handleExceed() {
      MessageBox.alert(`当前最大允许选择图片${this.limit}张，已超过限制`, '错误', { type: 'error' });
      return false;
    },
    uploadSuccess(data) {
      if (data.success) {
        this.$emit('uploaded', data.model);
        this.$emit('input', data.model);
        this.$emit('change', data.model);
        this.dispatch('ElFormItem', 'el.form.change', [data.model]);
      } else {
        MessageBox.alert('上传图片失败，请稍后重试', '错误', { type: 'error' });
      }
    },
    uploadError() {
      MessageBox.alert('上传图片失败，请稍后重试', '错误', { type: 'error' });
    },
    remove() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.dispatch('ElFormItem', 'el.form.change', ['']);
    },
  },
};
</script>
