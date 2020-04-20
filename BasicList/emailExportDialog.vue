<template>
<el-dialog title="邮件导出" width="550px" :visible="visible" @close="close">
  <el-form ref="form" :rules="rules" :model="form" label-width="80px">
    <el-form-item label="验证码" prop="verifyCode">
      <el-input v-model="form.verifyCode" :disabled="!isCodeFetched">
        <el-button slot="append" :disabled="codeEffectiveSeconds > 0" @click="getVerifyCode" style="width: 200px;">
          <span v-if="codeEffectiveSeconds === 0">获取验证码</span>
          <span v-if="codeEffectiveSeconds > 0">已获取({{codeEffectiveSeconds}})</span>
        </el-button>
      </el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="emailAccount">
      <el-input v-model="form.emailAccount">
        <el-select slot="append" v-model="rightPad" style="width: 200px;">
          <el-option label="@duangduangauto.com" value="@duangduangauto.com"></el-option>
          <el-option label="@autocloudpro.com" value="@autocloudpro.com"></el-option>
          <el-option label="@tecepc.com" value="@tecepc.com"></el-option>
          <el-option label="@ctypro.com" value="@ctypro.com"></el-option>
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="emailExportData">确定导出</el-button>
      <el-button @click="close">取消</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    emailExportUrl: {
      type: String,
      required: true,
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        emailAccount: '',
        verifyCode: '',
      },
      rules: {
        emailAccount: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      codeEffectiveSeconds: 0,
      isCodeFetched: false,
      rightPad: '@duangduangauto.com',
    };
  },
  methods: {
    getVerifyCode() {
      this.$axios({
        url: '/report/forms/mail/verifyCode',
        method: 'get',
        params: {},
      }).then((data) => {
        if (data.success) {
          this.isCodeFetched = true;
          this.$message.success('获取成功，请到当前账号绑定的手机上查收');
          this.setEffectiveSeconds();
        }
      });
    },
    setEffectiveSeconds() {
      this.codeEffectiveSeconds = 60;
      let timer = setInterval(() => {
        this.codeEffectiveSeconds = this.codeEffectiveSeconds - 1;
        if (this.codeEffectiveSeconds <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },
    emailExportData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios({
            url: this.emailExportUrl,
            method: 'get',
            params: {
              ...this.queryParams,
              verifyCode: this.form.verifyCode,
              email: this.form.emailAccount + this.rightPad,
            },
          }).then((data) => {
            if (data.success) {
              this.$message.success('正在导出，请注意查收邮件');
              this.close();
            }
          });
        }
      });
    },
    close() {
      this.$emit('update:visible', false);
    },
  },
};
</script>
