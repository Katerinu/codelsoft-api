# Codelsoft Express API
Este repositorio contiene el monolito modular que fue solicitado por codelsoft para generar las operaciones CRUD necesarias sobre el manejo de Videos, Usuarios y Facturas.

## Pre-requisitos
- [Node.js](https://nodejs.org/es/) (version 22.14.0)
- Mas adelante se explicara como instalar por medio de Docker, en caso de necesitar otra forma estas son las versiones utilizadas.
- [MongoDB](https://www.mongodb.com/try/download/community) (version 7.0.5)
- [MariaDB](https://mariadb.org) (version 11.3.2)
- [PostgreSQL](https://www.postgresql.org/download/)(version 17.4)

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

5. **Instalación de Imagenes de docker**
```bash
docker compose up
```
Se recomienda esperar hasta que se inicien completamente las bases de datos para evitar errores en el siguiente paso

6. **Creacion de clientes de Prisma**
```bash
npm run generate
```
Se debe asegurar de haber instalado las imagenes de Docker y ademas de haber creado correctamente su .env

7. **Inicializacion de migraciones**
```bash
npm run migrate
```

## Ejecutar la aplicación
```bash
npm start
```
El servidor se iniciará en el puerto **3000** (o en el puerto definido en la variable de entorno `PORT`). Accede a la API mediante `http://localhost:3000`.

## Ejecutar la aplicación en entorno de desarrollo
```bash
npm run dev
```
Si se deseara se puede levantar el servidor en entorno de desarrollo, el servidor estara en el mismo puerto definido en la variable de entorno `PORT` en forma de desarrollo usando Nodemon.

## Seeder
Para poblar la base de datos con datos de prueba, ejecuta el siguiente comando:
```bash
npm run seed
```
Si es la primera vez que se corre el comando `seed` este generará 200 usuarios, 300 facturas y 400 videos. Posteriormente cada vez que se ejecuten se generaran 198 usuarios, 300 facturas y 400 videos.

## Autores
- [@Katerinu](https://www.github.com/Katerinu)
- [@AleUCN](https://github.com/AleUCN)