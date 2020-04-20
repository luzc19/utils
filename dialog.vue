<template>
<el-dialog title="" width="60%" :visible="visible" @close="close" :close-on-click-modal="false">

  <span slot="footer">
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="submit" :disabled="loading" :loading="loading">提交</el-button>
  </span>
</el-dialog>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {

  },
  methods: {
    submit() {
      this.loading = true;
      this.$axios({
        url: '/',
        method: 'post',
        data: {

        },
      }).then((data) => {
        this.loading = false;
        if (data.success) {
          this.$message.success('操作成功');
          this.close();
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    close() {
      this.$emit('update:visible', false);
    },
  },
};
</script>
