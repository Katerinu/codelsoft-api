# Ayudantia Arquitectura de Sistemas
Este es el repositorio que sera utilizado durante la  ayudantía de arquitectura de sistemas, en este se encontrara todo lo desarrollado durante las capsulas.

## Pre-requisitos
- [Node.js](https://nodejs.org/es/) (version 22.14.0)

## Instalación y configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/Katerinu/codelsoft-api
```

2. **Ingresar al directorio del proyecto**
```bash
cd codelsoft-api
```

3. **Instalar las dependencias**
```bash
npm install
```

4. **Crear un archivo `.env` en la raíz del proyecto y ingresar las variables de entorno**
```bash
cp .env.example .env
```

5. **Generar cliente de prisma**
```bash
npx prisma generate
```

6. **Crear la base de datos**
```bash
npx prisma db push
```


## Ejecutar la aplicación
```bash
npm start
```
El servidor se iniciará en el puerto **3000** (o en el puerto definido en la variable de entorno `PORT`). Accede a la API mediante `http://localhost:3000`.

## Seeder
Para poblar la base de datos con datos de prueba, ejecuta el siguiente comando:
```bash
npm run seed
```

# Extras
Lo que se encuentra a continuación es un listado de recursos que podrían ser de utilidad para el desarrollo del curso, a medida que se avance ire agregando mas cosas.

# Herramientas
- [DBDiagram](https://dbdiagram.io/home): Herramienta para diseñar diagramas de bases de datos.
- [Postman](https://www.postman.com/): Herramienta para probar APIs.
- [MongoDB Compass](https://www.mongodb.com/try/download/compass): Cliente de MongoDB con interfaz gráfica.

# Librerías de Node
- [Express](https://expressjs.com/): Framework para crear aplicaciones web en Node.js.
- [Morgan](https://www.npmjs.com/package/morgan): Middleware para loggear las peticiones HTTP.
- [Nodemon](https://www.npmjs.com/package/nodemon): Herramienta que reinicia el servidor automáticamente al detectar cambios en los archivos.
- [Mongoose](https://mongoosejs.com/): Librería para interactuar con bases de datos MongoDB.
- [Prisma](https://www.prisma.io/): ORM para bases de datos SQL y NoSQL.
- [Dotenv](https://www.npmjs.com/package/dotenv): Librería para cargar variables de entorno desde un archivo `.env`.
- [Zod](https://www.npmjs.com/package/zod): Librería para validar datos en JavaScript.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Librería para encriptar contraseñas.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Librería para generar y verificar tokens JWT.
- [cors](https://www.npmjs.com/package/cors): Middleware para habilitar CORS en Express.
- [helmet](https://www.npmjs.com/package/helmet): Middleware para mejorar la seguridad de una aplicación Express.
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize): Middleware para prevenir ataques de inyección de código en MongoDB.
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit): Middleware para limitar la cantidad de peticiones a una API.

# Recursos
- [Repositorio de curso de express con MongoDB](https://github.com/jonasschmedtmann/complete-node-bootcamp)
- [Conventional Commits](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)