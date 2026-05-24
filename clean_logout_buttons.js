const fs = require('fs');
const path = require('path');

const publicDir = 'c:/Users/Jaspe Alex/Desktop/stitch_gesti_n_de_producci_n_l_ctea/obispo_dairy_system/public';
const files = [
    'index.html',
    'ordeno.html',
    'unidades.html',
    'inventario.html',
    'salud.html',
    'reportes.html',
    'historial.html',
    'usuarios.html'
];

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\r\n/g, '\n'); // Normalize Windows line endings to \n

    // Search for any sequence of one or more logout buttons followed by the user avatar link
    const pattern = /(?:<button @click="logout"[\s\S]*?<\/button>\s*)+<a href="usuarios\.html"[\s\S]*?<\/a>/g;
    
    // We want to replace it with exactly ONE logout button and the user avatar link
    const singleButtonWithAvatar = `<button @click="logout" class="w-10 h-10 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center cursor-pointer" title="Cerrar Sesión">
    <span class="material-symbols-outlined text-[20px]" data-icon="logout">logout</span>
  </button>
  <a href="usuarios.html" class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container flex items-center justify-center bg-primary text-on-primary text-sm font-bold active:scale-95 transition-transform duration-150 shadow-sm">
    <img v-if="currentUser && currentUser.avatar && (currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:'))" alt="User profile" class="w-full h-full object-cover" :src="currentUser.avatar"/>
    <span v-else>{{ currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US' }}</span>
  </a>`;

    if (pattern.test(content)) {
        content = content.replace(pattern, singleButtonWithAvatar);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned logout buttons for: ${file}`);
    } else {
        console.log(`No duplicated logout buttons found for: ${file}`);
    }
});
