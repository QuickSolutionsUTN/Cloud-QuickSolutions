DROP TABLE IF EXISTS provincias CASCADE; 
DROP TABLE IF EXISTS localidades CASCADE;  
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS domicilios CASCADE;
DROP TABLE IF EXISTS marcas CASCADE; 
DROP TABLE IF EXISTS modelos CASCADE; 
DROP TABLE IF EXISTS tipos_vehiculos CASCADE; 
DROP TABLE IF EXISTS vehiculos CASCADE; 
DROP TABLE IF EXISTS estados_conductores CASCADE;
DROP TABLE IF EXISTS conductores CASCADE;
DROP TABLE IF EXISTS fichas_medicas CASCADE; 
DROP TABLE IF EXISTS licencias CASCADE; 
DROP TABLE IF EXISTS estados_envio CASCADE;
DROP TABLE IF EXISTS envios CASCADE;
DROP TABLE IF EXISTS coordenadas CASCADE;
DROP TABLE IF EXISTS viajes CASCADE;
DROP TABLE IF EXISTS checkpoints CASCADE;  

CREATE TABLE provincias (
	id_provincia SERIAL PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL 
);

CREATE TABLE localidades (
	id_localidad SERIAL PRIMARY KEY,
	codigo_postal INT NOT NULL,
	nombre VARCHAR(50) NOT NULL,
	id_provincia INT NOT NULL,
	FOREIGN KEY (id_provincia) REFERENCES provincias(id_provincia)
);

CREATE TABLE usuarios (
	id_usuario UUID PRIMARY KEY,
	dni INT UNIQUE NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL UNIQUE,
	fecha_nac DATE NOT NULL,
	nombre VARCHAR(50) NOT NULL,
	apellido VARCHAR(50) NOT NULL,
	es_conductor BOOLEAN NOT NULL,
	telefono VARCHAR(20),
	api_key VARCHAR(100) NOT NULL UNIQUE,
	is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE domicilios (
	id_domicilio SERIAL PRIMARY KEY,
	calle VARCHAR(50) NOT NULL,
	numero INT NOT NULL,
	piso INT,
	depto VARCHAR(5),
	descripcion TEXT,
	id_localidad INT NOT NULL,
	id_usuario UUID UNIQUE,
	FOREIGN KEY (id_localidad) REFERENCES localidades(id_localidad),
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE marcas (
	id_marca SERIAL PRIMARY KEY,
	nombre VARCHAR(30) NOT NULL
);

CREATE TABLE modelos (
	id_modelo SERIAL PRIMARY KEY,
	nombre VARCHAR(30) NOT NULL,
	id_marca INT NOT NULL,
	FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);

CREATE TABLE tipos_vehiculos (
	id_tipo_vehiculo SERIAL PRIMARY KEY,
	nombre VARCHAR(30) NOT NULL
);

CREATE TABLE estados_conductores (
	id_estado SERIAL PRIMARY KEY,
	nombre VARCHAR(20) UNIQUE NOT NULL
);
INSERT INTO estados_conductores (nombre) 
VALUES ('Libre'), ('Ocupado'), ('Deshabilitado');

CREATE TABLE conductores (
	id_conductor UUID PRIMARY KEY,
	id_estado INT NOT NULL,
	FOREIGN KEY (id_conductor) REFERENCES usuarios(id_usuario),
	FOREIGN KEY (id_estado) REFERENCES estados_conductores(id_estado)
);

CREATE TABLE vehiculos (
	id_vehiculo SERIAL PRIMARY KEY,
	patente VARCHAR(20) UNIQUE NOT NULL,
	anio INT NOT NULL,
	color VARCHAR(15) NOT NULL,
	descripcion text,
	id_modelo INT NOT NULL,
	id_tipo_vehiculo INT NOT NULL,
	id_conductor UUID UNIQUE NOT NULL,
	FOREIGN KEY (id_modelo) REFERENCES modelos(id_modelo),
	FOREIGN KEY (id_tipo_vehiculo) REFERENCES tipos_vehiculos(id_tipo_vehiculo),
	FOREIGN KEY (id_conductor) REFERENCES conductores(id_conductor)
);

CREATE TABLE fichas_medicas (
	id_ficha_medica SERIAL PRIMARY KEY,
	altura INT not null,
	peso numeric(10,2) not null,
	enfermedad_cardiaca VARCHAR(50),
	enfermedad_respiratoria VARCHAR(50),
	alergias VARCHAR(50),
	epilepsia BOOLEAN not null,
	diabetes BOOLEAN not null,
	compartir BOOLEAN NOT NULL,
	id_conductor UUID UNIQUE NOT NULL,
	FOREIGN KEY (id_conductor) REFERENCES conductores(id_conductor)
);

CREATE TABLE licencias (
	numero INT PRIMARY KEY,
	categoria VARCHAR(30) NOT NULL,
	fechaVencimiento DATE NOT NULL,
	id_conductor UUID UNIQUE NOT NULL,
	FOREIGN KEY (id_conductor) REFERENCES conductores(id_conductor)
);

CREATE TABLE estados_envio (
	id_estado SERIAL PRIMARY KEY,
	nombre VARCHAR(30) UNIQUE NOT NULL
);
INSERT INTO estados_envio (nombre) 
VALUES ('Confirmado'), ('Cancelado'), ('En proceso de retiro'), ('En traslado a destino'), ('Entregado');

CREATE TABLE envios (
	nro_seguimiento BIGINT PRIMARY KEY,
	descripcion TEXT NOT NULL,
	fecha DATE NOT NULL,
	hora TIME NOT NULL,
	peso_gramos NUMERIC(10, 2) NOT NULL,
	monto NUMERIC(10, 2) NOT NULL,
	reserva BOOLEAN NOT NULL DEFAULT false,	
	id_cliente UUID NOT NULL,
	id_estado INT NOT NULL DEFAULT 1,
	id_origen INT NOT NULL,
	id_destino INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario),
	FOREIGN KEY (id_estado) REFERENCES estados_envio(id_estado),
	FOREIGN KEY (id_origen) REFERENCES domicilios(id_domicilio),
	FOREIGN KEY (id_destino) REFERENCES domicilios(id_domicilio)
);

CREATE TABLE coordenadas (
	id_coordenadas SERIAL PRIMARY KEY,
	latitud DOUBLE PRECISION NOT NULL,
	longitud DOUBLE PRECISION NOT NULL
);

CREATE TABLE viajes (
	id_viaje SERIAL PRIMARY KEY,
	checkpoint_actual INT NOT NULL DEFAULT 1,
	fecha_inicio TIMESTAMP,
	fecha_fin TIMESTAMP,
	id_conductor UUID NOT NULL,
	nro_seguimiento BIGINT UNIQUE NOT NULL, 
	origen_cord INT NOT NULL,
	destino_cord INT NOT NULL,
	FOREIGN KEY (id_conductor) REFERENCES conductores(id_conductor),
	FOREIGN KEY (nro_seguimiento) REFERENCES envios(nro_seguimiento),
	FOREIGN KEY (origen_cord) REFERENCES coordenadas(id_coordenadas),
	FOREIGN KEY (destino_cord) REFERENCES coordenadas(id_coordenadas)
);

CREATE TABLE checkpoints (
	id_checkpoint INT PRIMARY KEY,
	numero INT NOT NULL,
	id_viaje INT NOT NULL,
	FOREIGN KEY (id_checkpoint) REFERENCES coordenadas(id_coordenadas),
	FOREIGN KEY (id_viaje) REFERENCES viajes(id_viaje)
); 