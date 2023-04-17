const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { getFirestore, collection, setDoc, getDoc, doc, getDocs, updateDoc, deleteDoc  } = require('firebase/firestore')
const { initializeApp } = require ('firebase/app')

require('dotenv/config')


// Configuración de firebase
const firebaseConfig = {
    apiKey: "AIzaSyCBBvTcPPhf8Pg7FvbXMWRfVZbKAbYSJ48",
    authDomain: "fir-back-bd43b.firebaseapp.com",
    projectId: "fir-back-bd43b",
    storageBucket: "fir-back-bd43b.appspot.com",
    messagingSenderId: "319163605385",
    appId: "1:319163605385:web:488ad2c83a4436ff594158"
  }

// Inicializacion de la DB en Firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

// Inicializamos servidor

const app = express()

// Opciones de CORS
const corsOptions = {
    "origin": "*",
    "optionSuccessStatus": 200
}

// Configuracion del servidor
app.use(express.json())
app.use(cors(corsOptions))

// Ruta para insertar registro
app.post('/insertar', (req, res) => {
    const { name, lastname, email, password, number } = req.body

    if (!name || !lastname || !email || !password || !number) {
        res.json({
            'alert': 'faltan datos'
        })
        return
    }

    // Validaciones
    if(name.length < 3) {
        res.json({
            'alert': 'El nombre requiere minimo 3 caracteres'
        })
    } else if (lastname.length < 3) {
        res.json({
            'alert': 'El apellido requiere minimo 3 caracteres'
        })
    } else if (!email.length) {
        res.json({
            'alert': 'Debes ingresar un correo electronico'
        })
    } else if (password.length < 8) {
        res.json({
            'alert': 'La contraseña debe tener mínimo 8 caracteres'
        })
    } else if (!Number(number) || !number.length === 10) {
        res.json({
            'alert': 'Introduce un numero valido'
        })
    } else {
        const alumnos = collection(db, "alumnos")

        getDoc(doc(alumnos, email)).then(alumno => {
            if(alumno.exists()) {
                res.json({
                    'alert': 'El correo ya existe en la BD'
                })
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        sendData = {
                            name,
                            lastname,
                            email,
                            password: hash,
                            number
                        }

                        // Guardar en DB
                        setDoc(doc(alumnos, email), sendData).then(() => {
                            res.json({
                                'alert': 'success'
                            })
                        }).catch((error) => {
                            res.json({
                                'alert': error
                            })
                        })
                    })
                })
            }
        })
    }
})

// ruta para logear
app.post('/login', (req, res) => {
    const { email, password } = req.body
    
    if ( !email || !password) {
        res.json({
            'alert': 'Faltan Datos'
        })
    }
    const alumnos = collection(db, 'alumnos')
    getDoc(doc(alumnos, email))
    .then((alumno) => {
        if(!alumno.exists()){
            res.json({ 'alert': 'Correo no registrado'})
        } else {
            bcrypt.compare(password, alumno.data().password, (error, result) => {
                if ( result ){
                    // Para regresar datos
                    let data = alumno.data()
                    res.json({ 
                        'alert': 'success', 
                        name: data.name,
                        lastname: data.lastname    
                    })
                } else {
                    res.json({
                        'alert': 'Incorrect password'
                    })
                }
            })
        }
    })
})

// Ruta para obtener documentos de db
app.get('/traertodo', async (req, res) => {
    const alumnos = collection(db, "alumnos")
    const arreglo = await getDocs(alumnos)
    let returnData = []
    arreglo.forEach(alumno => {
        returnData.push(alumno.data())
    })
    res.json({
        'alert': 'success',
        'data': returnData
    })
})

// Ruta de eliminar
app.post('/eliminar', async (req, res) => {
    const { email } = req.body

    let alumnoBorrado = doc(db, "alumnos", email)
    try {
        await deleteDoc(alumnoBorrado)
        res.json({
            'alert': 'success'
        })
    } catch (error) {
        console.log(error)
    }
})

// Ruta para actualizar
app.post('/actualizar', (req, res) => {
    const { name, email, lastname, number } = req.body
    if(name.length < 3) {
        res.json({
            'alert': 'El nombre requiere minimo 3 caracteres' })
    } else if (lastname.length < 3) {
        res.json({
            'alert': 'El apellido requiere minimo 3 caracteres' })
    } else if (!email.length) {
        res.json({
            'alert': 'Debes ingresar un correo electronico' })
    } else if (!Number(number) || !number.length === 10) {
        res.json({
            'alert': 'Introduce un numero valido' })
    } else {
       const dataUpdate = {
        name,
        lastname,
        number
       }           
       updateDoc(doc(db, "alumnos", email), dataUpdate)    
       .then((response) => {
        res.json({
            'alert': 'success'
        })
       })
       .catch((err) => {
        res.json({
            'alert': err
        })
       })
    }
})

const PORT = process.env.PORT || 12000

app.listen(PORT, () => {
    console.log(`Escuchando Puerto: ${PORT}`)
})