<template>
  <v-row class="principal" style="margin: 10px; padding: 10px;">
    <v-btn block color="green darkeen-4" @click="dialogNew">
      Agregar Usuario
    </v-btn>
    <v-col cols="12">
      <v-row class="principal">
        Plantilla de alumnos
      </v-row>
      <v-row class="principal">
        <v-data-table
          :headers="headers"
          :items="usuarios"
          style="width: 100%;"
        >
          <template #[`item.acciones`]="{ item }">
            <v-row>
              <v-col cols="6">
                <v-btn icon color="cyan" @click="$event => dialogU(item)">
                  <v-icon>mdi-human-edit</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn icon color="cyan" @click="$event => dialogDelete(item)">
                  <v-icon>mdi-eraser</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-row>
    </v-col>
    <v-dialog
      v-model="dialogBorrado"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5">
          Borrado de Usuario
        </v-card-title>
        <v-card-text>
          ¿Estas seguro que deseas borrar el Usuario?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="$event => dialogBorrado = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="red darken-2"
            text
            @click="$event => borrar()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> <!-- Borrado de usuarios -->
    <v-dialog
      v-model="dialogUpdate"
      max-width="400"
      persistent
    >
      <v-card>
        <v-card-title>Actualizacion de Datos</v-card-title>
        <v-card-text>
          <v-form ref="frmUpdate">
            Nombre:
            <v-text-field
              v-model="user.name"
              placeholder="Nombre"
              :rules="reglaNombre"
            />
            Apellido
            <v-text-field
              v-model="user.lastname"
              placeholder="Apellido"
            />
            Number:
            <v-text-field
              v-model="user.number"
              placeholder="Número"
              type="tel"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="warninng" @click="$event => dialogUpdate=false">
            Cancelar
          </v-btn>
          <v-btn color="green" @click="update">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> <!-- Actualización de usuarios -->
    <v-dialog
      v-model="dialogCrear"
      max-width="400"
      persistent
    >
      <v-card>
        <v-card-title>Agregar Usuario</v-card-title>
        <v-card-text>
          <v-form ref="frmAdd">
            Nombre:
            <v-text-field
              v-model="user.name"
              placeholder="Nombre"
              :rules="reglaNombre"
            />
            Apellido:
            <v-text-field
              v-model="user.lastname"
              placeholder="Apellido"
            />
            Email:
            <v-text-field
              v-model="user.email"
              placeholder="Email"
              type="email"
            />
            Password:
            <v-text-field
              v-model="user.password"
              placeholder="Password"
              type="password"
              :rules="reglaPassword"
            />
            Número:
            <v-text-field
              v-model="user.number"
              placeholder="Number"
              type="tel"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="warning" @click="$event => dialogCrear=false">
            Cancelar
          </v-btn>
          <v-btn color="green" @click="add">
            Agregar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> <!-- Creación de usuarios -->
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      usuarios: [],
      headers: [
        {
          text: 'Nombre',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Apellidos',
          sortable: true,
          value: 'lastname'
        },
        {
          text: 'Correo',
          sortable: true,
          value: 'email'
        },
        {
          text: 'Número',
          sortable: true,
          value: 'number'
        },
        {
          text: 'Acciones',
          sortable: true,
          value: 'acciones'
        }
      ],
      dialogBorrado: false,
      emailBorrar: '',
      idBorrar: '',
      dialogUpdate: false,
      user: {},
      password: '',
      reglaNombre: [
        v => !v || v.length >= 3 || 'Name must have min 3 chars'
      ],
      reglaPassword: [
        v => !v || v.length >= 6 || 'Password must have min 6 chars'
      ],
      dialogCrear: false
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    async loadUsers () {
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      }
      await this.$axios.get('/traertodo', config)
        .then((res) => {
          this.usuarios = res.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    dialogDelete (item) {
      this.emailBorrar = item.email
      this.dialogBorrado = true
    },
    async borrar () {
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      }
      const sendData = {
        email: this.emailBorrar
      }
      await this.$axios.post('/eliminar', sendData, config)
        .then((res) => {
          console.log(res)
          this.dialogBorrado = false
          this.loadUsers()
        })
        .catch((e) => {
          console.log(e)
        })
    }, // Borrado de usuarios
    dialogU (item) {
      this.user = item
      this.dialogUpdate = true
    },
    async update () {
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      }
      const userUpdate = {
        name: this.user.name,
        email: this.user.email,
        lastname: this.user.lastname,
        number: this.user.number
      }
      await this.$axios.post('/actualizar',
        userUpdate,
        config).then((res) => {
        console.log(res)
        this.dialogUpdate = false
        this.loadUsers()
      }).catch((e) => {
        console.log(e)
      })
    }, // Actualizar usuarios
    dialogNew () {
      this.dialogCrear = true
    },
    async add () {
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      }
      const userAdd = {
        name: this.user.name,
        lastname: this.user.lastname,
        email: this.user.email,
        password: this.user.password,
        number: this.user.number
      }
      await this.$axios.post('/insertar',
        userAdd,
        config).then((res) => {
        console.log(res)
        this.dialogCrear = false
        this.loadUsers()
      }).catch((e) => {
        console.log(e)
      })
    } // Añadir usuarios
  }
}
</script>

<style scoped>
.principal {
width: 100%;
}
</style>
