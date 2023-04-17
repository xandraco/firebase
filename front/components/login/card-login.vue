<template>
  <v-card shaped elevation="5" width="500" color="#112031">
    <v-card-title class="text-center">
      Ingresar al sistema de alumnos
    </v-card-title>
    <v-card-text>
      <v-form ref="frmLogin">
        <v-text-field
          v-model="email"
          label="Email"
          placeholder="Escribe tu correo"
          :rules="ValidateEmail"
        />
        <v-text-field
          v-model="password"
          label="Password"
          placeholder="Escribe tu contraseña"
          type="password"
          :rules="validatePassword"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn block class="colorBtn" @click="ingresarSistema">
        <v-icon dense style="padding-right: 2%;">
          mdi-account-key
        </v-icon>
        Ingresar
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-model="dialog"
      width="200"
    >
      <div
        style="width: 100%;
      height: 100%;
      background-color: red;"
      >
        <span style="font-size: 20px; font-weight: 800; color: white;">
          {{ mensaje }}
        </span>
      </div>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      ValidateEmail: [
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      validatePassword: [
        v => !v || v.length >= 6 || 'Password must have min 6 chars'
      ],
      dialog: false,
      mensaje: ''
    }
  },
  methods: {
    async ingresarSistema () {
      if (this.email.length === 0 && this.password.length === 0) {
        alert('Escribe un correo y contraseña')
        return
      }
      if (this.$refs.frmLogin.validate()) {
        const sendData = {
          email: this.email,
          password: this.password
        }
        await this.$auth.loginWith('local', {
          data: sendData
        }).then((res) => {
          if (res.data.alert === 'success') {
            this.$router.push('/dashboard')
          } else {
            this.mensaje = 'Ingrese un usuario y contraseña válidos'
            this.dialog = true
            setTimeout(() => {
              this.dialog = false
            }, 2000)
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        alert('Algo ha salido mal')
      }
    }
  }
}
</script>

<style scoped>
.colorBtn {
    background-color: white;
}
.v-dialog__container {
  display: flex;
}
.text-center {
  margin-left: 20%;
}
</style>
