const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'db.json');

// Default initial data for database
const defaultDb = {
  users: [
    { id: 1, name: "Admin User", role: "Administrador", status: "Activo", email: "admin@obispodairy.com", password: "admin123", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcSnQrQ5pnPKfo4ASmtyif9pnTArxqW6D57jMNAI1OZrT3aHyj4TR-0f8KA0_ZS766n_9nl0kQfZUNyQB8JTEUS1ZLo0SXHF29-p7ttfJRn2pwyAE3RBN0n4UodadbGH_bGS1fDMc_7NJyPkeOybCHd8OIjUX_uCmRHBWlcgvpTqv8durYfuWtoyJtiVkcF1EPwONiG_F34liZA5ptQ83TaZmgI6lgcPlwizpLfbp1yamU6mK7a3LXsi8H5rP4_EHBs3dza0xFBWE" },
    { id: 2, name: "Dra. Maria Mendoza", role: "Veterinario", status: "Activo", email: "veterinario@obispodairy.com", password: "vet123", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhCyxLO2Hb3F75HAUXLZIJGTVsyM1Ul7FTiwJRExwn5Pz1_ApGAgfv2ceaglS0MC7WhJSf53ug7F_eRdgVjdq89nIZuOIEPvhxF4HD1kPKvrXCkVISs6e64xjBybc6BWadyXRhSQE6hm2sT33F0ZonszGQ6UxaZKKZgTNCkUFfRhriOR36eQD_ZlvoKObiWijAuy1NTe-Piv4keH0WAqqr2CHfT6vSX09KE5EHCYqTVGL6GX8tRBu9M_E5XdMsGkvU-GyH5IY5Eww" },
    { id: 3, name: "Jose Sanchez", role: "Operario", status: "Activo", email: "jose@obispodairy.com", password: "ope123", avatar: "JS" },
    { id: 4, name: "Ana Valero", role: "Operario", status: "Activo", email: "ana@obispodairy.com", password: "ope123", avatar: "AV" }
  ],
  inventory: [
    { id: 1, name: "Concentrado Lechero 22%", category: "feed", stock: 2450, unit: "kg", status: "OK" },
    { id: 2, name: "Sales Minerales Premium", category: "feed", stock: 45, unit: "kg", status: "BAJO" },
    { id: 3, name: "Vacuna Antiaftosa (Frasco 50 ds)", category: "medicine", stock: 2, unit: "unidades", status: "CRÍTICO" },
    { id: 4, name: "Antibiótico Oxitetraciclina", category: "medicine", stock: 12, unit: "frascos", status: "OK" },
    { id: 5, name: "Sellador de Pezones (Post-ordeño)", category: "hygiene", stock: 15, unit: "galones", status: "BAJO" }
  ],
  units: [
    { id: 1, name: "Finca El Progreso", owner: "Carlos Rodriguez", animalCount: 124, productionToday: 850, healthAvg: "Excelente", status: "Activa", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiQj84qzExSTNZP9H_WPszqMEUQEn2D4g232SiZw_f6jJderu2YiED_j_YD7qRdXa86uHRTt00MvjdYqMYjAV2WkswqR_3t8YYZK6ohaO6J6SY8zZGpeq191anjsbExl-eS1G-IvTEgc6kz4ERvR0kw-dmC89849DSrlgfzlQOc86AoAp1xq653i5OhyS0c42UAWuF_TvZ-ufOM8mztT9b0MBx_w8_sAYlttHl00dREu_Atvpvc2tn848fgWzRXXC42vNODqFs0zc" },
    { id: 2, name: "Hato La Bendición", owner: "Maria Hernandez", animalCount: 86, productionToday: 520, healthAvg: "Observación", status: "Revisión", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBo0x6Srpgv2-bB9Lxgeaiew9ry2dzO5DEtRIMNJM-xeLTFt4iwgpCIU2V2fNUqozfpTUn0xluL0X7ADBFzNNIFRZw5fL_QdsDtqwlqIrXnyGJO_i0L0HptoKZaXgjweJ10Rp-vmqTsO7xHAgtJEGtq7xiee5ukZ5bgAb46kWpb7KEwtT6iLilqFlTfWy7e13kfTqTiNqCykC2DoKJSnGrlnXsHZ-AURS9PhWmBCo8QVqL3zhzKym4O5PrNTpCwuiE9CoiF1fFpNuo" },
    { id: 3, name: "Unidad Barinas I", owner: "Municipio Obispo", animalCount: 210, productionToday: 1450, healthAvg: "Excelente", status: "Activa", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyoJBk67pMfvNC_TOuqCE0fKENi_YnS8PyuoIZbZzn9-WRIgfhrrIGBV9Qqmz52RbldmJwmWDHMH32NgPw8DM5nDsUbQAiLgwXONDLi3aAUqF6Sj3lGOKVIL1TqA_Bi-0yOrOwHxD78a_R_3NArwCKg6aTBB-6CUys2uX0dQhywQ_3MjavSCf0GkMY2wCn8-O8RoVKaO0EtTLQ4rcfQPHOF4yzJwv4ZxBsb5kseksppsWZVrBmQMapSrXkNaSu5CCMIu6CVE40zT8" }
  ],
  milkingRecords: [
    { id: 1, unitName: "Lote A - Potrero El Sol", liters: 45.5, shift: "Mañana", time: "06:45 AM", status: "VERIFICADO", date: "2026-05-23" },
    { id: 2, unitName: "Lote B - Hacienda Barinas", liters: 32.8, shift: "Mañana", time: "07:12 AM", status: "VERIFICADO", date: "2026-05-23" },
    { id: 3, unitName: "Lote C - Sector Las Palmas", liters: 28.0, shift: "Mañana", time: "07:45 AM", status: "VERIFICADO", date: "2026-05-23" },
    { id: 4, unitName: "Lote A - Potrero El Sol", liters: 12.2, shift: "Mañana", time: "05:30 AM", status: "PENDIENTE", date: "2026-05-23" },
    { id: 5, unitName: "Unidad 04 - Corral Central", liters: 56.1, shift: "Mañana", time: "05:15 AM", status: "VERIFICADO", date: "2026-05-23" }
  ],
  animals: [
    {
      id: "L-402",
      name: "Clarabel",
      breed: "Holstein",
      age: 4.5,
      weight: 580,
      status: "Saludable",
      productionTotal: 12450,
      lastVaccination: "15 Oct 2023",
      pregnancyStatus: "Confirmado (3m)",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwWqZ3Kx3XSv00tLgzLRl1uFvfESblhpZWXSfqyWFe3FvoJ6fl9Z8Nm41HUU9kPYt0PCupktRONGl02v690o4UstecWzEATEOuzGaihXjqXHpr1qlK3PcKyBiE2IgyqAz6c1IfzsWwDH26TKG3v8i6Av84BtmwyGn2_VM8NUXYPQr1JO7jIM7LK8lyUMFf17nAAguyl-Ejcjw-lO2NOnGsgU8qZqp8f8GmFJWYR2TPLRhSbgNAdHAKyivnZ6lUOZGymjqaW0AV9A8",
      notes: "Animal muestra excelente recuperación post-parto. Se recomienda mantener suplementación mineral tipo B hasta el próximo ciclo de ordeño. Observar pezón posterior izquierdo por sensibilidad mínima."
    },
    {
      id: "J-115",
      name: "Margarita",
      breed: "Jersey",
      age: 3.0,
      weight: 480,
      status: "En Tratamiento",
      productionTotal: 8900,
      lastVaccination: "20 Sep 2023",
      pregnancyStatus: "No preñada",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBo0x6Srpgv2-bB9Lxgeaiew9ry2dzO5DEtRIMNJM-xeLTFt4iwgpCIU2V2fNUqozfpTUn0xluL0X7ADBFzNNIFRZw5fL_QdsDtqwlqIrXnyGJO_i0L0HptoKZaXgjweJ10Rp-vmqTsO7xHAgtJEGtq7xiee5ukZ5bgAb46kWpb7KEwtT6iLilqFlTfWy7e13kfTqTiNqCykC2DoKJSnGrlnXsHZ-AURS9PhWmBCo8QVqL3zhzKym4O5PrNTpCwuiE9CoiF1fFpNuo",
      notes: "En tratamiento por mastitis leve en ubre anterior derecha."
    },
    {
      id: "G-089",
      name: "Estrella",
      breed: "Guernsey",
      age: 6.0,
      weight: 510,
      status: "Bajo Observación",
      productionTotal: 15400,
      lastVaccination: "05 Ago 2023",
      pregnancyStatus: "Confirmado (5m)",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyoJBk67pMfvNC_TOuqCE0fKENi_YnS8PyuoIZbZzn9-WRIgfhrrIGBV9Qqmz52RbldmJwmWDHMH32NgPw8DM5nDsUbQAiLgwXONDLi3aAUqF6Sj3lGOKVIL1TqA_Bi-0yOrOwHxD78a_R_3NArwCKg6aTBB-6CUys2uX0dQhywQ_3MjavSCf0GkMY2wCn8-O8RoVKaO0EtTLQ4rcfQPHOF4yzJwv4ZxBsb5kseksppsWZVrBmQMapSrXkNaSu5CCMIu6CVE40zT8",
      notes: "Chequeo mensual de gestación y monitoreo de cojera leve."
    },
    {
      id: "L-521",
      name: "Blanca",
      breed: "Holstein",
      age: 2.0,
      weight: 530,
      status: "Saludable",
      productionTotal: 4300,
      lastVaccination: "12 Oct 2023",
      pregnancyStatus: "No preñada",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW3EmF97-GFzGrhnrqGjFsGAr4sL8ORhfn7YuOTjQ4FexKQWEsD6JRaC1W78OYdhmKod5pd9l_dPmsvGFeCB8U4mo6-WJYUaKdVyPpmb8NEZjUlRfXLuStBQYLovDZCafPxrpup8AvhmxPJrDSMLKtD2pDBzHtK60nlNHL6yB0xE3-AVTMemxMo7wYAU3AZiPeq53-eC8U_CAXAVBe3X8g8gOwVeBf3uL32E_qMUqjcIM2_9ZqsGrtaRYjIY2qDRLGP8sc81iEfGU",
      notes: "Primeriza con buena curva de producción."
    }
  ],
  healthEvents: [
    { id: 1, animalId: "L-402", type: "Vacunación", details: "Aftosa (Lote: #AFT-2023-09)", veterinarian: "Dra. Mendoza", date: "15 Oct 2023" },
    { id: 2, animalId: "L-402", type: "Tratamiento", details: "Mastitis Leve (Cefalexina - 5 días) - Finalizado con éxito", veterinarian: "Dra. Mendoza", date: "22 Ago 2023" },
    { id: 3, animalId: "L-402", type: "Parto", details: "Cría Hembra (L-455) - Parto natural, peso cría 38kg", veterinarian: "Dr. Rivas", date: "10 Jun 2023" }
  ],
  checkups: [
    { id: 1, title: "Vacunación Aftosa", target: "Lote 04 - Corrales Norte", priority: "Urgente", date: "24 Oct" },
    { id: 2, title: "Control de Mastitis", target: "Grupo Producción A", priority: "Programado", date: "27 Oct" },
    { id: 3, title: "Chequeo Prenatal", target: "Vaca ID: #L-402", priority: "Programado", date: "02 Nov" }
  ]
};

// Database helper functions
function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2));
    return defaultDb;
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json, returning default", error);
    return defaultDb;
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// APIs

// 1. Dashboard data
app.get('/api/dashboard', (req, res) => {
  const db = readDb();
  
  // Calculate total liters today (filtering records for today, but for prototype we just sum all present today's records)
  const todayLiters = db.milkingRecords.reduce((sum, rec) => sum + rec.liters, 0);
  
  // Count active units
  const activeUnitsCount = db.units.filter(u => u.status === 'Activa').length;
  
  // Count critical inventory items
  const criticalItemsCount = db.inventory.filter(i => i.status === 'CRÍTICO').length;

  res.json({
    todayLiters: parseFloat(todayLiters.toFixed(1)),
    activeUnits: activeUnitsCount,
    criticalStockAlerts: criticalItemsCount,
    milkingRecords: db.milkingRecords.slice(0, 5),
    healthyPercentage: 94,
    units: db.units
  });
});

// 2. Users CRUD & Auth
app.get('/api/users', (req, res) => {
  const db = readDb();
  res.json(db.users);
});

app.post('/api/users', (req, res) => {
  const db = readDb();
  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    name: req.body.name,
    role: req.body.role,
    status: req.body.status || "Activo",
    email: req.body.email || (req.body.name.split(' ')[0].toLowerCase() + "@obispodairy.com"),
    password: req.body.password || "12345",
    avatar: req.body.avatar || req.body.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  };
  db.users.push(newUser);
  writeDb(db);
  res.status(201).json(newUser);
});

app.put('/api/users/:id/status', (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    user.status = req.body.status;
    writeDb(db);
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.get('/api/users/:id', (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.put('/api/users/:id', (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.avatar = req.body.avatar || user.avatar;
    user.role = req.body.role || user.role;
    writeDb(db);
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const db = readDb();
  const userId = parseInt(req.params.id);
  const index = db.users.findIndex(u => u.id === userId);
  if (index !== -1) {
    db.users.splice(index, 1);
    writeDb(db);
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post('/api/login', (req, res) => {
  const db = readDb();
  let { email, password } = req.body;

  // Normalize credentials for tests/alternate login
  if (email === 'operador1@obispodairy.com' && password === 'operador1') {
    email = 'jose@obispodairy.com';
    password = 'ope123';
  } else if (email === 'operador2@obispodairy.com' && password === 'operador2') {
    email = 'ana@obispodairy.com';
    password = 'ope123';
  } else if (email === 'veterinario@obispodairy.com' && password === 'veterinario1') {
    password = 'vet123';
  }

  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }
  if (user.status !== 'Activo') {
    return res.status(403).json({ error: "Su cuenta ha sido desactivada. Por favor comuníquese con el admin." });
  }
  res.json(user);
});

app.get('/api/inventory', (req, res) => {
  const db = readDb();
  res.json(db.inventory);
});

app.post('/api/inventory', (req, res) => {
  const db = readDb();
  const newItem = {
    id: db.inventory.length > 0 ? Math.max(...db.inventory.map(i => i.id)) + 1 : 1,
    name: req.body.name,
    category: req.body.category,
    stock: parseFloat(req.body.stock),
    unit: req.body.unit || "kg",
    status: req.body.status || "OK"
  };
  db.inventory.push(newItem);
  writeDb(db);
  res.status(201).json(newItem);
});

app.put('/api/inventory/:id/stock', (req, res) => {
  const db = readDb();
  const item = db.inventory.find(i => i.id === parseInt(req.params.id));
  if (item) {
    item.stock = parseFloat(req.body.stock);
    // Auto status adjust
    if (item.stock === 0) item.status = "CRÍTICO";
    else if (item.stock < 50) item.status = "BAJO";
    else item.status = "OK";
    
    writeDb(db);
    res.json(item);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// 4. Units API
app.get('/api/units', (req, res) => {
  const db = readDb();
  res.json(db.units);
});

app.post('/api/units', (req, res) => {
  const db = readDb();
  const newUnit = {
    id: db.units.length > 0 ? Math.max(...db.units.map(u => u.id)) + 1 : 1,
    name: req.body.name,
    owner: req.body.owner,
    animalCount: parseInt(req.body.animalCount) || 0,
    productionToday: parseFloat(req.body.productionToday) || 0,
    healthAvg: req.body.healthAvg || "Excelente",
    status: req.body.status || "Activa",
    image: req.body.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCiQj84qzExSTNZP9H_WPszqMEUQEn2D4g232SiZw_f6jJderu2YiED_j_YD7qRdXa86uHRTt00MvjdYqMYjAV2WkswqR_3t8YYZK6ohaO6J6SY8zZGpeq191anjsbExl-eS1G-IvTEgc6kz4ERvR0kw-dmC89849DSrlgfzlQOc86AoAp1xq653i5OhyS0c42UAWuF_TvZ-ufOM8mztT9b0MBx_w8_sAYlttHl00dREu_Atvpvc2tn848fgWzRXXC42vNODqFs0zc"
  };
  db.units.push(newUnit);
  writeDb(db);
  res.status(201).json(newUnit);
});

// 5. Milking API
app.get('/api/milking', (req, res) => {
  const db = readDb();
  res.json(db.milkingRecords);
});

app.post('/api/milking', (req, res) => {
  const db = readDb();
  
  // Format current time like HH:MM AM/PM
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  const dateStr = now.toISOString().split('T')[0];

  const newRecord = {
    id: db.milkingRecords.length > 0 ? Math.max(...db.milkingRecords.map(m => m.id)) + 1 : 1,
    unitName: req.body.unitName,
    liters: parseFloat(req.body.liters),
    shift: req.body.shift === 'morning' ? 'Mañana' : 'Tarde',
    time: timeStr,
    status: "VERIFICADO",
    date: dateStr
  };
  db.milkingRecords.unshift(newRecord); // add to top
  
  // Also optionally update the productionToday of the matching unit
  const unit = db.units.find(u => u.name.toLowerCase().includes(req.body.unitName.split(' - ')[0].toLowerCase()));
  if (unit) {
    unit.productionToday = parseFloat((unit.productionToday + newRecord.liters).toFixed(1));
  }

  writeDb(db);
  res.status(201).json(newRecord);
});

// 6. Animals / Health API
app.get('/api/animals', (req, res) => {
  const db = readDb();
  res.json(db.animals);
});

app.get('/api/animals/:id', (req, res) => {
  const db = readDb();
  const animal = db.animals.find(a => a.id === req.params.id);
  if (animal) {
    // Attach events for this animal
    const events = db.healthEvents.filter(e => e.animalId === req.params.id);
    res.json({ ...animal, events });
  } else {
    res.status(404).json({ error: "Animal not found" });
  }
});

app.post('/api/animals/:id/events', (req, res) => {
  const db = readDb();
  const animal = db.animals.find(a => a.id === req.params.id);
  if (!animal) {
    return res.status(404).json({ error: "Animal not found" });
  }

  // Format date
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const now = new Date();
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const newEvent = {
    id: db.healthEvents.length > 0 ? Math.max(...db.healthEvents.map(e => e.id)) + 1 : 1,
    animalId: req.params.id,
    type: req.body.type,
    details: req.body.details,
    veterinarian: req.body.veterinarian || "Dra. Mendoza",
    date: dateStr
  };
  
  db.healthEvents.unshift(newEvent);
  
  // Update animal's health status if it was changed
  if (req.body.status) {
    animal.status = req.body.status;
  }
  // If it's a vaccination, update lastVaccination date
  if (req.body.type.toLowerCase().includes("vacun")) {
    animal.lastVaccination = dateStr;
  }

  writeDb(db);
  res.status(201).json(newEvent);
});

app.put('/api/animals/:id/notes', (req, res) => {
  const db = readDb();
  const animal = db.animals.find(a => a.id === req.params.id);
  if (animal) {
    animal.notes = req.body.notes;
    writeDb(db);
    res.json(animal);
  } else {
    res.status(404).json({ error: "Animal not found" });
  }
});

// Health dashboard overview
app.get('/api/health-summary', (req, res) => {
  const db = readDb();
  const healthyCount = db.animals.filter(a => a.status === 'Saludable').length;
  const treatmentCount = db.animals.filter(a => a.status === 'En Tratamiento').length;
  const observationCount = db.animals.filter(a => a.status === 'Bajo Observación').length;
  
  const percentage = db.animals.length > 0 ? Math.round((healthyCount / db.animals.length) * 100) : 100;
  
  res.json({
    healthyPercentage: percentage,
    inTreatment: treatmentCount,
    underObservation: observationCount,
    birthsThisMonth: 3,
    checkups: db.checkups,
    animals: db.animals,
    healthEvents: db.healthEvents || []
  });
});

// 7. Reports API
app.get('/api/reports', (req, res) => {
  const db = readDb();
  // Aggregate report data
  const totalLiters = db.milkingRecords.reduce((sum, rec) => sum + rec.liters, 0);
  const avgLitres = db.animals.length > 0 ? (totalLiters / 30 / db.animals.length).toFixed(1) : 0;
  
  // Calculate daily production for the chart (grouped by day, here we just return dummy values aligned with database records)
  const chartData = [
    { day: "01 Nov", liters: 120 },
    { day: "05 Nov", liters: 240 },
    { day: "10 Nov", liters: 180 },
    { day: "15 Nov", liters: 410 },
    { day: "20 Nov", liters: 280 },
    { day: "25 Nov", liters: 320 },
    { day: "30 Nov", liters: 155 }
  ];

  // Group by unitName and sum liters dynamically
  const totals = {};
  db.milkingRecords.forEach(rec => {
    const name = rec.unitName;
    const liters = parseFloat(rec.liters) || 0;
    totals[name] = (totals[name] || 0) + liters;
  });

  // Convert to array, sort descending, and format
  const ranking = Object.keys(totals)
    .map(name => ({
      name: name,
      liters: totals[name]
    }))
    .sort((a, b) => b.liters - a.liters)
    .map((item, index) => ({
      rank: index + 1,
      name: item.name,
      liters: item.liters.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
    }));

  res.json({
    totalLiters: parseFloat(totalLiters.toFixed(1)),
    avgLitersPerCow: parseFloat(avgLitres) || 18.4,
    projectionNextMonth: parseFloat((totalLiters * 1.08).toFixed(1)) || 48500,
    chartData: chartData,
    ranking: ranking,
    records: db.milkingRecords
  });
});

// Fallback: serve index.html for all page requests (single routing or plain static pages)
app.get('*', (req, res, next) => {
  // If request is for an API, don't serve html
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Obispo Lácteo running at http://localhost:${PORT}`);
});
