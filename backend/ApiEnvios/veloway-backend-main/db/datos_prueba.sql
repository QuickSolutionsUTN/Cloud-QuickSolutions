INSERT INTO provincias (nombre) VALUES
('Buenos Aires'),
('Córdoba'),
('Santa Fe'),
('Mendoza'),
('Tucumán'),
('Salta'),
('Misiones'),
('Chaco'),
('Entre Ríos'),
('Corrientes'),
('Santiago del Estero'),
('San Juan'),
('Jujuy'),
('Río Negro'),
('Neuquén'),
('Formosa'),
('Chubut'),
('San Luis'),
('Catamarca'),
('La Rioja'),
('La Pampa'),
('Santa Cruz'),
('Tierra del Fuego');


INSERT INTO localidades (codigo_postal, nombre, id_provincia) VALUES
-- Buenos Aires (id_provincia: 1)
(1001, 'Ciudad Autónoma de Buenos Aires', 1),
(1702, 'Morón', 1),
(1824, 'Lanús', 1),
(1870, 'Avellaneda', 1),
(1900, 'La Plata', 1),

-- Córdoba (id_provincia: 2)
(5000, 'Córdoba Capital', 2),
(5152, 'Villa Carlos Paz', 2),
(5929, 'Río Cuarto', 2),
(5200, 'Jesús María', 2),

-- Santa Fe (id_provincia: 3)
(2000, 'Rosario', 3),
(3000, 'Santa Fe', 3),
(2300, 'Rafaela', 3),
(2500, 'San Lorenzo', 3),

-- Mendoza (id_provincia: 4)
(5500, 'Mendoza', 4),
(5560, 'San Rafael', 4),
(5570, 'Godoy Cruz', 4),
(5507, 'Luján de Cuyo', 4),

-- Tucumán (id_provincia: 5)
(4000, 'San Miguel de Tucumán', 5),
(4152, 'Tafí Viejo', 5),
(4107, 'Yerba Buena', 5),

-- Salta (id_provincia: 6)
(4400, 'Salta', 6),
(4530, 'Orán', 6),
(4560, 'Tartagal', 6),

-- Misiones (id_provincia: 7)
(3300, 'Posadas', 7),
(3370, 'Oberá', 7),
(3384, 'Eldorado', 7),

-- Chaco (id_provincia: 8)
(3500, 'Resistencia', 8),
(3700, 'Presidencia Roque Sáenz Peña', 8),
(3600, 'Villa Ángela', 8),

-- Entre Ríos (id_provincia: 9)
(3100, 'Paraná', 9),
(3260, 'Concordia', 9),
(2820, 'Gualeguaychú', 9),

-- Corrientes (id_provincia: 10)
(3400, 'Corrientes', 10),
(3450, 'Goya', 10),
(3420, 'Esquina', 10),

-- Santiago del Estero (id_provincia: 11)
(4200, 'Santiago del Estero', 11),
(4300, 'La Banda', 11),
(4230, 'Añatuya', 11),

-- San Juan (id_provincia: 12)
(5400, 'San Juan', 12),
(5460, 'Caucete', 12),
(5407, 'Pocito', 12),

-- Jujuy (id_provincia: 13)
(4600, 'San Salvador de Jujuy', 13),
(4624, 'Tilcara', 13),
(4640, 'La Quiaca', 13),

-- Río Negro (id_provincia: 14)
(8500, 'Viedma', 14),
(8400, 'Bariloche', 14),
(8332, 'Cipolletti', 14),

-- Neuquén (id_provincia: 15)
(8300, 'Neuquén', 15),
(8370, 'Zapala', 15),
(8340, 'San Martín de los Andes', 15),

-- Formosa (id_provincia: 16)
(3600, 'Formosa', 16),
(3630, 'Clorinda', 16),

-- Chubut (id_provincia: 17)
(9100, 'Rawson', 17),
(9200, 'Trelew', 17),
(9000, 'Comodoro Rivadavia', 17),

-- San Luis (id_provincia: 18)
(5700, 'San Luis', 18),
(5720, 'Villa Mercedes', 18),

-- Catamarca (id_provincia: 19)
(4700, 'San Fernando del Valle de Catamarca', 19),
(4715, 'Belén', 19),

-- La Rioja (id_provincia: 20)
(5300, 'La Rioja', 20),
(5310, 'Chilecito', 20),

-- La Pampa (id_provincia: 21)
(6300, 'Santa Rosa', 21),
(6360, 'General Pico', 21),

-- Santa Cruz (id_provincia: 22)
(9400, 'Río Gallegos', 22),
(9300, 'Caleta Olivia', 22),

-- Tierra del Fuego (id_provincia: 23)
(9410, 'Ushuaia', 23),
(9420, 'Río Grande', 23);

-- Usuarios
INSERT INTO usuarios (id_usuario, dni, email, password, fecha_nac, nombre, apellido, es_conductor, telefono, api_key) 
VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 12345678, 'juan.perez@example.com', 'hashedpassword1', '1990-01-01', 'Juan', 'Pérez', FALSE, '111111111', 'ae07886b-0fcd-4ae8-8674-993e85f10663'),
    ('987f6543-e21c-54d3-b789-426614174001', 87654321, 'ana.gomez@example.com', 'hashedpassword2', '1985-05-15', 'Ana', 'Gómez', TRUE, '222222222', '684b61b1-b980-46fb-92a6-dcb8c837c5b9'),
    ('456e7890-e21c-78d3-b456-426614174002', 34567890, 'maria.lopez@example.com', 'hashedpassword3', '1992-03-12', 'María', 'López', FALSE, '333333333', '7fd7a37c-51a8-45f9-a3e0-ad108422bc3b'),
    ('789a1234-e21c-98d3-b123-426614174003', 65432198, 'carlos.martinez@example.com', 'hashedpassword4', '1988-07-08', 'Carlos', 'Martínez', TRUE, '444444444', '87e9fa7a-3db2-4527-be8b-0f3e23c16f5e');


-- Domicilios
INSERT INTO domicilios (calle, numero, piso, depto, descripcion, id_localidad, id_usuario)
VALUES 
    ('Av. Rivadavia', 1234, NULL, NULL, 'Casa principal', 1, '123e4567-e89b-12d3-a456-426614174000'),
    ('San Martín', 5678, 3, 'B', 'Departamento', 2, '987f6543-e21c-54d3-b789-426614174001'),
    ('Córdoba', 91011, NULL, NULL, 'Casa secundaria', 3, '456e7890-e21c-78d3-b456-426614174002'),
    ('Santa Fe', 1213, 2, 'A', 'Oficina', 1, '789a1234-e21c-98d3-b123-426614174003'),
    ('Mendoza', 1387, 3, 'A', 'Oficina', 1, NULL);


-- Marcas
INSERT INTO marcas (id_marca, nombre) 
VALUES 
    (1, 'Fiat'),
    (2, 'Ford');

-- Modelos
INSERT INTO modelos (id_modelo, nombre, id_marca)
VALUES 
    (1, 'Palio', 1), 
    (2, 'Ranger', 2);

-- Tipos de Vehículos
INSERT INTO tipos_vehiculos (id_tipo_vehiculo, nombre) 
VALUES 
    (1, 'Camioneta'), 
    (2, 'Auto');

-- Conductores
INSERT INTO conductores (id_conductor, id_estado)
VALUES 
    ('987f6543-e21c-54d3-b789-426614174001', 1),
    ('789a1234-e21c-98d3-b123-426614174003', 2);

-- Vehículos
INSERT INTO vehiculos (id_vehiculo, patente, anio, color, descripcion, id_modelo, id_tipo_vehiculo, id_conductor)
VALUES 
    (1, 'ABC123', 2020, 'Blanco', 'Camioneta doble cabina', 1, 1, '987f6543-e21c-54d3-b789-426614174001'),
    (2, 'XYZ789', 2019, 'Negro', 'Auto deportivo', 2, 2, '789a1234-e21c-98d3-b123-426614174003');

-- Fichas Médicas
INSERT INTO fichas_medicas (
    altura, 
    peso, 
    enfermedad_cardiaca, 
    enfermedad_respiratoria, 
    alergias, 
    epilepsia, 
    diabetes, 
    compartir, 
    id_conductor
) VALUES 
(
    175, 
    75.50, 
    null, 
    'Asma leve', 
    'Polen', 
    FALSE, 
    FALSE, 
    TRUE, 
    '987f6543-e21c-54d3-b789-426614174001'
),
(
    180, 
    85.00, 
    'Hipertensión', 
    'Asma', 
    null, 
    TRUE, 
    TRUE, 
    FALSE, 
    '789a1234-e21c-98d3-b123-426614174003'
);

-- Licencias
INSERT INTO licencias (numero, categoria, fechaVencimiento, id_conductor)
VALUES 
    (12345678, 'B1', '2025-12-31', '987f6543-e21c-54d3-b789-426614174001'),
    (87654321, 'C1', '2026-06-30', '789a1234-e21c-98d3-b123-426614174003');

-- Envíos
INSERT INTO envios (nro_seguimiento, descripcion, fecha, hora, peso_gramos, monto, id_cliente, id_estado, id_origen, id_destino)
VALUES 
    (10000001, 'Paquete pequeño', '2024-12-03', '10:30:00', 500.00, 100.50, '123e4567-e89b-12d3-a456-426614174000', 1, 1, 5),
    (10000002, 'Electrodoméstico', '2024-12-03', '14:00:00', 2000.00, 300.75, '456e7890-e21c-78d3-b456-426614174002', 2, 3, 4);

-- Coordenadas
INSERT INTO coordenadas (latitud, longitud) VALUES
    (-34.603722, -58.381592),
    (-31.420083, -64.188776);

-- Viajes
INSERT INTO viajes (checkpoint_actual, fecha_inicio, fecha_fin, id_conductor, nro_seguimiento, origen_cord, destino_cord) VALUES
    (1, '2025-01-01 10:00:00', NULL, '987f6543-e21c-54d3-b789-426614174001', 10000001, 1, 2);

-- Checkpoints
INSERT INTO checkpoints (id_checkpoint, numero, id_viaje) VALUES
    (1, 1, 1),
    (2, 2, 1);
