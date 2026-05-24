// Obispo Lácteo - Local Database Fallback for Offline / file:// protocol usage
(function() {
  const defaultDb = {
    users: [
      { id: 1, name: "Admin User", role: "Administrador", status: "Activo", email: "admin@obispodairy.com", password: "admin123", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcSnQrQ5pnPKfo4ASmtyif9pnTArxqW6D57jMNAI1OZrT3aHyj4TR-0f8KA0_ZS766n_9nl0kQfZUNyQB8JTEUS1ZLo0SXHF29-p7ttfJRn2pwyAE3RBN0n4UodadbGH_bGS1fDMc_7NJyPkeOybCHd8OIjUX_uCmRHBWlcgvpTqv8durYfuWtoyJtiVkcF1EPwONiG_F34liZA5ptQ83TaZmgI6lgcPlwizpLfbp1yamU6mK7a3LXsi8H5rP4_EHBs3dza0xFBWE" },
      { id: 2, name: "Dra. Maria Mendoza", role: "Veterinario", status: "Activo", email: "veterinario@obispodairy.com", password: "vet123", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhCyxLO2Hb3F75HAUXLZIJGTVsyM1Ul7FTiwJRExwn5Pz1_ApGAgfv2ceaglS0MC7WhJSf53ug7F_eRdgVjdq89nIZuOIEPvhxF4HD1kPKvrXCkVISs6e64xjBybc6BWadyXRhSQE6hm2sT33F0ZonszGQ6UxaZKKZgTNCkUFfRhriOR36eQD_ZlvoKObiWijAuy1NTe-Piv4keH0WAqqr2CHfT6vSX09KE5EHCYqTVGL6GX8tRBu9M_E5XdMsGkvU-GyH5IY5Eww" },
      { id: 5, name: "Dra. Maria Mendoza (Alt)", role: "Veterinario", status: "Activo", email: "veterinario@obispodairy.com", password: "veterinario1", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhCyxLO2Hb3F75HAUXLZIJGTVsyM1Ul7FTiwJRExwn5Pz1_ApGAgfv2ceaglS0MC7WhJSf53ug7F_eRdgVjdq89nIZuOIEPvhxF4HD1kPKvrXCkVISs6e64xjBybc6BWadyXRhSQE6hm2sT33F0ZonszGQ6UxaZKKZgTNCkUFfRhriOR36eQD_ZlvoKObiWijAuy1NTe-Piv4keH0WAqqr2CHfT6vSX09KE5EHCYqTVGL6GX8tRBu9M_E5XdMsGkvU-GyH5IY5Eww" },
      { id: 3, name: "Jose Sanchez", role: "Operario", status: "Inactivo", email: "jose@obispodairy.com", password: "ope123", avatar: "JS" },
      { id: 6, name: "Jose Sanchez (Alt)", role: "Operario", status: "Activo", email: "operador1@obispodairy.com", password: "operador1", avatar: "JS" },
      { id: 4, name: "Ana Valero", role: "Operario", status: "Activo", email: "ana@obispodairy.com", password: "ope123", avatar: "AV" },
      { id: 7, name: "Ana Valero (Alt)", role: "Operario", status: "Activo", email: "operador2@obispodairy.com", password: "operador2", avatar: "AV" }
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

  // Helper to read database from localStorage
  function readLocalDb() {
    let dbStr = localStorage.getItem('obispo_local_db');
    if (!dbStr) {
      localStorage.setItem('obispo_local_db', JSON.stringify(defaultDb));
      return JSON.parse(JSON.stringify(defaultDb));
    }
    try {
      const db = JSON.parse(dbStr);
      // Auto-merge any default users that might be missing in local storage
      let modified = false;
      defaultDb.users.forEach(defUser => {
        const exists = db.users.some(u => u.email === defUser.email && u.password === defUser.password);
        if (!exists) {
          db.users.push(defUser);
          modified = true;
        }
      });
      if (modified) {
        localStorage.setItem('obispo_local_db', JSON.stringify(db));
      }
      return db;
    } catch (e) {
      console.warn("Error parsing obispo_local_db, resetting to default", e);
      localStorage.setItem('obispo_local_db', JSON.stringify(defaultDb));
      return JSON.parse(JSON.stringify(defaultDb));
    }
  }

  // Helper to write database to localStorage
  function writeLocalDb(db) {
    localStorage.setItem('obispo_local_db', JSON.stringify(db));
  }

  // Intercept if running on file:// protocol (local offline) or deployed on GitHub Pages static site
  if (window.location.protocol === 'file:' || window.location.hostname.endsWith('github.io')) {
    console.log("Obispo Lácteo running in LOCAL OFFLINE MODE (GitHub Pages or local file). Intercepting API calls.");

    // Store reference to original fetch
    const originalFetch = window.fetch;

    // Override fetch globally
    window.fetch = function(input, init) {
      let url = typeof input === 'string' ? input : input.url;
      // Normalize URL relative path
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const parsed = new URL(url);
        url = parsed.pathname;
      }
      
      // If it's not an API call, let it go (though it shouldn't happen for relative assets under file://)
      if (!url.includes('/api/')) {
        return originalFetch(input, init);
      }

      console.log(`[Local API Mock] Request: ${init ? init.method || 'GET' : 'GET'} ${url}`);

      const db = readLocalDb();
      const method = init ? (init.method || 'GET').toUpperCase() : 'GET';
      let requestBody = null;
      if (init && init.body) {
        try {
          requestBody = JSON.parse(init.body);
        } catch (e) {
          requestBody = init.body;
        }
      }

      let responseData = null;
      let responseStatus = 200;

      try {
        // Router mock
        if (url === '/api/login' && method === 'POST') {
          const { email, password } = requestBody;
          const user = db.users.find(u => u.email === email && u.password === password);
          if (!user) {
            responseData = { error: "Credenciales incorrectas" };
            responseStatus = 401;
          } else if (user.status !== 'Activo') {
            responseData = { error: "Su cuenta ha sido desactivada. Por favor comuníquese con el admin." };
            responseStatus = 403;
          } else {
            responseData = user;
          }
        } 
        
        else if (url.startsWith('/api/users/') && method === 'GET') {
          const id = parseInt(url.split('/').pop());
          const user = db.users.find(u => u.id === id);
          if (user) {
            responseData = user;
          } else {
            responseData = { error: "User not found" };
            responseStatus = 404;
          }
        } 
        
        else if (url.startsWith('/api/users/') && url.endsWith('/status') && method === 'PUT') {
          const id = parseInt(url.split('/')[3]);
          const user = db.users.find(u => u.id === id);
          if (user) {
            user.status = requestBody.status;
            writeLocalDb(db);
            responseData = user;
          } else {
            responseData = { error: "User not found" };
            responseStatus = 404;
          }
        } 
        
        else if (url.startsWith('/api/users/') && method === 'PUT') {
          const id = parseInt(url.split('/').pop());
          const user = db.users.find(u => u.id === id);
          if (user) {
            user.name = requestBody.name || user.name;
            user.email = requestBody.email || user.email;
            user.password = requestBody.password || user.password;
            user.avatar = requestBody.avatar || user.avatar;
            user.role = requestBody.role || user.role;
            writeLocalDb(db);
            responseData = user;
          } else {
            responseData = { error: "User not found" };
            responseStatus = 404;
          }
        } 
        
        else if (url === '/api/users' && method === 'GET') {
          responseData = db.users;
        } 
        
        else if (url === '/api/users' && method === 'POST') {
          const newUser = {
            id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
            name: requestBody.name,
            role: requestBody.role,
            status: requestBody.status || "Activo",
            email: requestBody.email || (requestBody.name.split(' ')[0].toLowerCase() + "@obispodairy.com"),
            password: requestBody.password || "12345",
            avatar: requestBody.avatar || requestBody.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          };
          db.users.push(newUser);
          writeLocalDb(db);
          responseData = newUser;
          responseStatus = 201;
        } 
        
        else if (url === '/api/dashboard' && method === 'GET') {
          const todayLiters = db.milkingRecords.reduce((sum, rec) => sum + rec.liters, 0);
          const activeUnitsCount = db.units.filter(u => u.status === 'Activa').length;
          const criticalItemsCount = db.inventory.filter(i => i.status === 'CRÍTICO').length;

          responseData = {
            todayLiters: parseFloat(todayLiters.toFixed(1)),
            activeUnits: activeUnitsCount,
            criticalStockAlerts: criticalItemsCount,
            milkingRecords: db.milkingRecords.slice(0, 5),
            healthyPercentage: db.animals.length > 0 ? Math.round((db.animals.filter(a => a.status === 'Saludable').length / db.animals.length) * 100) : 100,
            units: db.units
          };
        } 
        
        else if (url === '/api/inventory' && method === 'GET') {
          responseData = db.inventory;
        } 
        
        else if (url === '/api/inventory' && method === 'POST') {
          const newItem = {
            id: db.inventory.length > 0 ? Math.max(...db.inventory.map(i => i.id)) + 1 : 1,
            name: requestBody.name,
            category: requestBody.category,
            stock: parseFloat(requestBody.stock),
            unit: requestBody.unit || "kg",
            status: requestBody.status || "OK"
          };
          db.inventory.push(newItem);
          writeLocalDb(db);
          responseData = newItem;
          responseStatus = 201;
        } 
        
        else if (url.startsWith('/api/inventory/') && url.endsWith('/stock') && method === 'PUT') {
          const id = parseInt(url.split('/')[3]);
          const item = db.inventory.find(i => i.id === id);
          if (item) {
            item.stock = parseFloat(requestBody.stock);
            if (item.stock === 0) item.status = "CRÍTICO";
            else if (item.stock < 50) item.status = "BAJO";
            else item.status = "OK";
            writeLocalDb(db);
            responseData = item;
          } else {
            responseData = { error: "Item not found" };
            responseStatus = 404;
          }
        } 
        
        else if (url === '/api/units' && method === 'GET') {
          responseData = db.units;
        } 
        
        else if (url === '/api/units' && method === 'POST') {
          const newUnit = {
            id: db.units.length > 0 ? Math.max(...db.units.map(u => u.id)) + 1 : 1,
            name: requestBody.name,
            owner: requestBody.owner,
            animalCount: parseInt(requestBody.animalCount) || 0,
            productionToday: parseFloat(requestBody.productionToday) || 0,
            healthAvg: requestBody.healthAvg || "Excelente",
            status: requestBody.status || "Activa",
            image: requestBody.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCiQj84qzExSTNZP9H_WPszqMEUQEn2D4g232SiZw_f6jJderu2YiED_j_YD7qRdXa86uHRTt00MvjdYqMYjAV2WkswqR_3t8YYZK6ohaO6J6SY8zZGpeq191anjsbExl-eS1G-IvTEgc6kz4ERvR0kw-dmC89849DSrlgfzlQOc86AoAp1xq653i5OhyS0c42UAWuF_TvZ-ufOM8mztT9b0MBx_w8_sAYlttHl00dREu_Atvpvc2tn848fgWzRXXC42vNODqFs0zc"
          };
          db.units.push(newUnit);
          writeLocalDb(db);
          responseData = newUnit;
          responseStatus = 201;
        } 
        
        else if (url === '/api/milking' && method === 'GET') {
          responseData = db.milkingRecords;
        } 
        
        else if (url === '/api/milking' && method === 'POST') {
          const now = new Date();
          let hours = now.getHours();
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12;
          const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
          const dateStr = now.toISOString().split('T')[0];

          const newRecord = {
            id: db.milkingRecords.length > 0 ? Math.max(...db.milkingRecords.map(m => m.id)) + 1 : 1,
            unitName: requestBody.unitName,
            liters: parseFloat(requestBody.liters),
            shift: requestBody.shift === 'morning' ? 'Mañana' : 'Tarde',
            time: timeStr,
            status: "VERIFICADO",
            date: dateStr
          };
          db.milkingRecords.unshift(newRecord);

          // Update production today of the unit
          const unit = db.units.find(u => u.name.toLowerCase().includes(requestBody.unitName.split(' - ')[0].toLowerCase()));
          if (unit) {
            unit.productionToday = parseFloat((unit.productionToday + newRecord.liters).toFixed(1));
          }

          writeLocalDb(db);
          responseData = newRecord;
          responseStatus = 201;
        } 
        
        else if (url === '/api/animals' && method === 'GET') {
          responseData = db.animals;
        } 
        
        else if (url.startsWith('/api/animals/') && url.endsWith('/events') && method === 'POST') {
          const id = url.split('/')[3];
          const animal = db.animals.find(a => a.id === id);
          if (animal) {
            const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            const now = new Date();
            const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

            const newEvent = {
              id: db.healthEvents.length > 0 ? Math.max(...db.healthEvents.map(e => e.id)) + 1 : 1,
              animalId: id,
              type: requestBody.type,
              details: requestBody.details,
              veterinarian: requestBody.veterinarian || "Dra. Mendoza",
              date: dateStr
            };
            db.healthEvents.unshift(newEvent);

            if (requestBody.status) {
              animal.status = requestBody.status;
            }
            if (requestBody.type.toLowerCase().includes("vacun")) {
              animal.lastVaccination = dateStr;
            }

            writeLocalDb(db);
            responseData = newEvent;
            responseStatus = 201;
          } else {
            responseData = { error: "Animal not found" };
            responseStatus = 404;
          }
        } 
        
        else if (url.startsWith('/api/animals/') && url.endsWith('/notes') && method === 'PUT') {
          const id = url.split('/')[3];
          const animal = db.animals.find(a => a.id === id);
          if (animal) {
            animal.notes = requestBody.notes;
            writeLocalDb(db);
            responseData = animal;
          } else {
            responseData = { error: "Animal not found" };
            responseStatus = 404;
          }
        } 
        
        else if (url.startsWith('/api/animals/') && method === 'GET') {
          const id = url.split('/').pop();
          const animal = db.animals.find(a => a.id === id);
          if (animal) {
            const events = db.healthEvents.filter(e => e.animalId === id);
            responseData = { ...animal, events };
          } else {
            responseData = { error: "Animal not found" };
            responseStatus = 404;
          }
        } 
        
        else if (url === '/api/health-summary' && method === 'GET') {
          const healthyCount = db.animals.filter(a => a.status === 'Saludable').length;
          const percentage = db.animals.length > 0 ? Math.round((healthyCount / db.animals.length) * 100) : 100;
          responseData = {
            healthyPercentage: percentage,
            inTreatment: db.animals.filter(a => a.status === 'En Tratamiento').length,
            underObservation: db.animals.filter(a => a.status === 'Bajo Observación').length,
            birthsThisMonth: db.animals.filter(a => a.age < 1).length,
            checkups: db.checkups,
            animals: db.animals,
            healthEvents: db.healthEvents
          };
        } 
        
        else if (url === '/api/reports' && method === 'GET') {
          const totalLiters = db.milkingRecords.reduce((sum, rec) => sum + rec.liters, 0);
          const avgLitres = db.animals.length > 0 ? (totalLiters / 30 / db.animals.length).toFixed(1) : 0;
          
          // Generate chart data based on local milking records dates
          const chartData = [
            { day: "01 Nov", liters: 120 },
            { day: "05 Nov", liters: 240 },
            { day: "10 Nov", liters: 180 },
            { day: "15 Nov", liters: 410 },
            { day: "20 Nov", liters: 280 },
            { day: "25 Nov", liters: 320 },
            { day: "30 Nov", liters: 155 }
          ];

          // Dynamic UPP production ranking
          const totals = {};
          db.milkingRecords.forEach(rec => {
            const name = rec.unitName;
            const liters = parseFloat(rec.liters) || 0;
            totals[name] = (totals[name] || 0) + liters;
          });

          const ranking = Object.keys(totals)
            .map(name => ({ name: name, liters: totals[name] }))
            .sort((a, b) => b.liters - a.liters)
            .map((item, index) => ({
              rank: index + 1,
              name: item.name,
              liters: item.liters.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
            }));

          responseData = {
            totalLiters: parseFloat(totalLiters.toFixed(1)),
            avgLitersPerCow: parseFloat(avgLitres) || 18.4,
            projectionNextMonth: parseFloat((totalLiters * 1.08).toFixed(1)),
            chartData: chartData,
            ranking: ranking,
            records: db.milkingRecords
          };
        } 
        
        else {
          console.warn(`[Local API Mock] Unsupported endpoint: ${method} ${url}. Returning 404.`);
          responseData = { error: "Not found" };
          responseStatus = 404;
        }
      } catch (err) {
        console.error("[Local API Mock] Internal error processing mock endpoint", err);
        responseData = { error: "Internal server error mock" };
        responseStatus = 500;
      }

      // Return a standard Mock Response object
      const responseInit = {
        status: responseStatus,
        statusText: responseStatus === 200 || responseStatus === 201 ? 'OK' : 'Error',
        headers: { 'Content-Type': 'application/json' }
      };

      const mockResponse = new Response(JSON.stringify(responseData), responseInit);
      // Return response wrapped in a promise to match native fetch return signature
      return Promise.resolve(mockResponse);
    };
  }
})();
