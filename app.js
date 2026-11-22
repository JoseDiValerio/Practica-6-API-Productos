const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.status(200).json({
        mensaje: 'Lista de todos los productos:',
        productos: productos
    })
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.status(200).json({
        mensaje: 'Producto encontrado correctamente:',
        producto: producto
    })
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// TODO: POST /productos - Crear nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body || {}

    // Verificar campos obligatorios
    if (
        typeof nombre !== 'string' || nombre.trim() === '' ||
        typeof descripcion !== 'string' || descripcion.trim() === '' ||
        precio === undefined || precio === null || precio === ''
    ) {
        return res.status(400).json({
            mensaje: 'Campos obligatorios: nombre, descripcion y precio.'
        })
    }

    // Conversion del precio
    const precioNumerico = parseFloat(precio)

    // Validacion del precio
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser mayor que cero.'
        })
    }

    // Calculo de id nuevo tomando en cuenta el mayor y sumando 1
    const idNuevo = productos.length > 0
        ? Math.max(...productos.map(p => p.id)) + 1
        : 1

    const nuevoProducto = {
        id: idNuevo,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNumerico
    }

    productos.push(nuevoProducto)

    // Codigo 201 indica producto creado
    res.status(201).json({
        mensaje: 'Producto creado correctamente.',
        producto: nuevoProducto
    })
})

// TODO: PUT /productos/:id - Actualizar producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    //Buscar posicion del producto dentro del arreglo
    const posicion = productos.findIndex(p => p.id === id)

    if (posicion === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado.' })
    }

    const { nombre, descripcion, precio } = req.body || {}

    // Campos obligatorios para actualizar
    if (
        typeof nombre !== 'string' || nombre.trim() === '' ||
        typeof descripcion !== 'string' || descripcion.trim() === '' ||
        precio === undefined || precio === null || precio === ''
    ) {
        return res.status(400).json({
            mensaje: 'Campos obligatorios: nombre, descripcion y precio.'
        })
    }

    const precioNumerico = parseFloat(precio)

    if (isNaN(precioNumerico) || precioNumerico <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser mayor que cero.'
        })
    }

    // Reemplazar datos y conservar id
    const productoActualizado = {
        id: productos[posicion].id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNumerico
    }

    productos[posicion] = productoActualizado

    // Codigo 200 de producto actualizado
    res.status(200).json({
        mensaje: 'Producto actualizado correctamente.',
        producto: productoActualizado
    })
})

// TODO: DELETE /productos/:id - Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // Buscar posicion del producto a eliminar
    const posicion = productos.findIndex(p => p.id === id)

    if (posicion === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado,' })
    }

    // Guardar datos del producto eliminado
    const productoEliminado = productos[posicion]

    // splice para eliminar producto en posicion indicada
    productos.splice(posicion, 1)

    res.status(200).json({
        mensaje: 'Producto eliminado correctamente.',
        producto: productoEliminado
    })
})

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
