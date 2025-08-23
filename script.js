let appData = {
  clans: [],
  matches: []
};

async function loadData() {
  try {
    const response = await fetch("./public/data.json?nocache=" + Date.now());
    if (!response.ok) throw new Error("JSON yüklenemedi");

    const data = await response.json();
    // Verileri global değişkenlere aktar
    if (Array.isArray(data.clans)) clans = data.clans;
    if (Array.isArray(data.maps)) maps = data.maps;
    if (Array.isArray(data.modList)) modList = data.modList;

    render();
  } catch (err) {
    console.error("Hata:", err);
  }
}


loadData();






// Utility functions
const uid = () => Math.random().toString(36).slice(2, 9);

// Default data
const DEFAULT_MAPS = [
    { id: uid(), name: "Ascent", img: "", active: true },
    { id: uid(), name: "Bind", img: "", active: true },
    { id: uid(), name: "Haven", img: "", active: true },
    { id: uid(), name: "Icebox", img: "", active: true },
    { id: uid(), name: "Lotus", img: "", active: true },
    { id: uid(), name: "Sunset", img: "", active: true },
];

// Emojis
const EMOJI = {
    check: "✅",
    cross: "❌",
    map: "🗺️",
    dice: "🎲",
    shield: "🛡️",
    sword: "⚔️",
    loud: "📣",
    crown: "👑",
};

// Global state
let isAdmin = false;
let editMode = false;
let currentEditingClan = null;
let currentEditingMap = null;

let clans = [
    { id: uid(), name: "Alpha", logo: "", players: ["Ayaz", "Ece"], points: 0 },
    { id: uid(), name: "Bravo", logo: "", players: ["Mert", "Zeynep"], points: 0 },
];

let maps = [...DEFAULT_MAPS];
let modList = ["BIÇAK", "TABANCA", "GENEL", "DÜRBÜN"];

// Veto state
let vetoState = {
    teamA: "",
    teamB: "",
    mode: "BIÇAK",
    firstBanTeam: "",
    banned: [],
    finalMap: "",
    sidePickerTeam: "",
    sideChoice: "",
    winner: ""
};

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const adminStatus = document.getElementById('admin-status');
const logoutBtn = document.getElementById('logout-btn');
const editModeToggle = document.getElementById('edit-mode');
const adminTab = document.getElementById('admin-tab');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAuth();
    initializeVeto();
    initializeAdmin();
    render();
});

// Tab functionality
function initializeTabs() {
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // Function to switch tabs
    function switchTab(targetTab) {
        // Update tab triggers
        tabTriggers.forEach(t => t.classList.remove('active'));
        const activeTrigger = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeTrigger) activeTrigger.classList.add('active');
        
        // Update tab content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${targetTab}-tab`) {
                content.classList.add('active');
            }
        });
        
        // Update navigation links
        navLinks.forEach(link => link.classList.remove('active'));
        const activeNavLink = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeNavLink) activeNavLink.classList.add('active');
    }

    // Tab trigger click events
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (trigger.disabled) return;
            const targetTab = trigger.dataset.tab;
            switchTab(targetTab);
        });
    });

    // Navigation link click events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.tab;
            switchTab(targetTab);
        });
    });
}

// Authentication
function initializeAuth() {
    loginBtn.addEventListener('click', () => {
        document.getElementById('login-modal').classList.remove('hidden');
    });

    logoutBtn.addEventListener('click', () => {
        isAdmin = false;
        editMode = false;
        updateAuthUI();
        render();
    });

    editModeToggle.addEventListener('change', (e) => {
        editMode = e.target.checked;
        render();
    });

    // Login modal
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('login-modal').classList.add('hidden');
    });

    document.getElementById('login-submit').addEventListener('click', () => {
        const nickname = document.getElementById('login-nickname').value;
        const password = document.getElementById('login-password').value;
        
        if (nickname === 'lordastong' && password === 'berkay2121') {
            isAdmin = true;
            editMode = true;
            editModeToggle.checked = true;
            updateAuthUI();
            document.getElementById('login-modal').classList.add('hidden');
            render();
        } 
        if (nickname === 'yafes' && password === 'yafes2121') {
            isAdmin = true;
            editMode = true;
            editModeToggle.checked = true;
            updateAuthUI();
            document.getElementById('login-modal').classList.add('hidden');
            render();
        } 
        if (nickname === 'falt' && password === 'falt2121') {
            isAdmin = true;
            editMode = true;
            editModeToggle.checked = true;
            updateAuthUI();
            document.getElementById('login-modal').classList.add('hidden');
            render();
        } 
        if (nickname === 'fe' && password === 'fe2121') {
            isAdmin = true;
            editMode = true;
            editModeToggle.checked = true;
            updateAuthUI();
            document.getElementById('login-modal').classList.add('hidden');
            render();
        } 
        
    });

    // Close modal on outside click
    document.getElementById('login-modal').addEventListener('click', (e) => {
        if (e.target.id === 'login-modal') {
            document.getElementById('login-modal').classList.add('hidden');
        }
    });
}

function updateAuthUI() {
    if (isAdmin) {
        loginBtn.classList.add('hidden');
        adminStatus.classList.remove('hidden');
        adminTab.disabled = false;
        
        // Enable admin navigation link
        const adminNavLink = document.getElementById('admin-nav-link');
        if (adminNavLink) {
            adminNavLink.disabled = false;
            adminNavLink.classList.remove('disabled');
        }
    } else {
        loginBtn.classList.remove('hidden');
        adminStatus.classList.add('hidden');
        adminTab.disabled = true;
        
        // Disable admin navigation link
        const adminNavLink = document.getElementById('admin-nav-link');
        if (adminNavLink) {
            adminNavLink.disabled = true;
            adminNavLink.classList.add('disabled');
        }
    }
}

// Veto functionality
function initializeVeto() {
    const teamASelect = document.getElementById('team-a');
    const teamBSelect = document.getElementById('team-b');
    const gameModeSelect = document.getElementById('game-mode');
    const drawFirstBanBtn = document.getElementById('draw-first-ban');
    const drawSidePickerBtn = document.getElementById('draw-side-picker');
    const sideChoiceSelect = document.getElementById('side-choice');
    const copySummaryBtn = document.getElementById('copy-summary');
    const resetVetoBtn = document.getElementById('reset-veto');
    const teamAWinsBtn = document.getElementById('team-a-wins');
    const teamBWinsBtn = document.getElementById('team-b-wins');

    teamASelect.addEventListener('change', (e) => {
        vetoState.teamA = e.target.value;
        if (e.target.value === vetoState.teamB) {
            vetoState.teamB = "";
        }
        resetVetoFlow();
        updateVetoUI();
    });

    teamBSelect.addEventListener('change', (e) => {
        vetoState.teamB = e.target.value;
        if (e.target.value === vetoState.teamA) {
            vetoState.teamA = "";
        }
        resetVetoFlow();
        updateVetoUI();
    });

    gameModeSelect.addEventListener('change', (e) => {
        vetoState.mode = e.target.value;
        updateVetoUI();
    });

    drawFirstBanBtn.addEventListener('click', () => {
        if (vetoState.teamA && vetoState.teamB) {
            const teams = [vetoState.teamA, vetoState.teamB];
            vetoState.firstBanTeam = teams[Math.floor(Math.random() * teams.length)];
            updateVetoUI();
        }
    });

    drawSidePickerBtn.addEventListener('click', () => {
        if (vetoState.teamA && vetoState.teamB) {
            const teams = [vetoState.teamA, vetoState.teamB];
            vetoState.sidePickerTeam = teams[Math.floor(Math.random() * teams.length)];
            updateVetoUI();
        }
    });

    sideChoiceSelect.addEventListener('change', (e) => {
        vetoState.sideChoice = e.target.value;
        updateVetoUI();
    });

    copySummaryBtn.addEventListener('click', async () => {
        const summary = generateMatchSummary();
        try {
            await navigator.clipboard.writeText(summary);
            alert('Özet kopyalandı!');
        } catch (err) {
            console.error('Kopyalama hatası:', err);
        }
    });

    resetVetoBtn.addEventListener('click', () => {
        resetVetoFlow();
        updateVetoUI();
    });

    teamAWinsBtn.addEventListener('click', () => {
        vetoState.winner = vetoState.teamA;
        alert('Not: Puan eklemek için Admin sekmesinde elle düzenleyin.');
        updateVetoUI();
    });

    teamBWinsBtn.addEventListener('click', () => {
        vetoState.winner = vetoState.teamB;
        alert('Not: Puan eklemek için Admin sekmesinde elle düzenleyin.');
        updateVetoUI();
    });
}

function resetVetoFlow() {
    vetoState.firstBanTeam = "";
    vetoState.banned = [];
    vetoState.finalMap = "";
    vetoState.sidePickerTeam = "";
    vetoState.sideChoice = "";
    vetoState.winner = "";
}

function updateVetoUI() {
    // Update team selects
    updateTeamSelects();
    
    // Update draw button state
    const drawFirstBanBtn = document.getElementById('draw-first-ban');
    drawFirstBanBtn.disabled = !(vetoState.teamA && vetoState.teamB);
    
    // Update first ban result
    const firstBanResult = document.getElementById('first-ban-result');
    const firstBanTeamSpan = document.getElementById('first-ban-team');
    if (vetoState.firstBanTeam) {
        const teamName = clans.find(c => c.id === vetoState.firstBanTeam)?.name || "?";
        firstBanTeamSpan.textContent = teamName;
        firstBanResult.classList.remove('hidden');
    } else {
        firstBanResult.classList.add('hidden');
    }
    
    // Update maps grid
    updateMapsGrid();
    
    // Update final map section
    updateFinalMapSection();
    
    // Update match summary section
    updateMatchSummarySection();
    
    // Update status panel
    updateStatusPanel();
    
    // Update progress
    updateProgress();
}

function updateTeamSelects() {
    const teamASelect = document.getElementById('team-a');
    const teamBSelect = document.getElementById('team-b');
    
    // Clear and populate team A
    teamASelect.innerHTML = '<option value="">Seç</option>';
    clans.forEach(clan => {
        const option = document.createElement('option');
        option.value = clan.id;
        option.textContent = clan.name;
        option.selected = clan.id === vetoState.teamA;
        teamASelect.appendChild(option);
    });
    
    // Clear and populate team B
    teamBSelect.innerHTML = '<option value="">Seç</option>';
    clans.forEach(clan => {
        if (clan.id !== vetoState.teamA) {
            const option = document.createElement('option');
            option.value = clan.id;
            option.textContent = clan.name;
            option.selected = clan.id === vetoState.teamB;
            teamBSelect.appendChild(option);
        }
    });
}

function updateMapsGrid() {
    const mapsGrid = document.getElementById('maps-grid');
    const activeMaps = maps.filter(m => m.active);
    
    mapsGrid.innerHTML = '';
    
    activeMaps.forEach(map => {
        const mapCard = document.createElement('div');
        mapCard.className = `map-card ${vetoState.banned.includes(map.id) ? 'banned' : ''}`;
        
        const isBanned = vetoState.banned.includes(map.id);
        const isSelected = vetoState.finalMap === map.id;
        
        mapCard.innerHTML = `
            <div class="map-image">
                ${map.img ? `<img src="${map.img}" alt="${map.name}">` : `<div>${map.name}</div>`}
            </div>
            <div class="map-content">
                <div class="map-actions">
                    <div class="map-name">${map.name}</div>
                    ${!vetoState.finalMap ? `
                        <button class="btn ${isBanned ? 'btn-secondary' : 'btn-destructive'}" onclick="toggleMapBan('${map.id}')">
                            ${isBanned ? 'Geri Al' : 'Banla'}
                        </button>
                    ` : `
                        <div class="map-status ${isSelected ? 'selected' : 'eliminated'}">
                            ${isSelected ? 'Seçildi' : 'Elendi'}
                        </div>
                    `}
                </div>
            </div>
        `;
        
        mapsGrid.appendChild(mapCard);
    });
}

function toggleMapBan(mapId) {
    const activeMaps = maps.filter(m => m.active);
    
    if (vetoState.banned.includes(mapId)) {
        vetoState.banned = vetoState.banned.filter(id => id !== mapId);
    } else {
        vetoState.banned.push(mapId);
        
        // Check if only one map remains
        const remaining = activeMaps.filter(m => !vetoState.banned.includes(m.id));
        if (remaining.length === 1) {
            vetoState.finalMap = remaining[0].id;
        }
    }
    
    updateVetoUI();
}

function updateFinalMapSection() {
    const finalMapSection = document.getElementById('final-map-section');
    const finalMapName = document.getElementById('final-map-name');
    
    if (vetoState.finalMap) {
        const mapName = maps.find(m => m.id === vetoState.finalMap)?.name || "?";
        finalMapName.textContent = mapName;
        finalMapSection.classList.remove('hidden');
    } else {
        finalMapSection.classList.add('hidden');
    }
}

function updateMatchSummarySection() {
    const matchSummarySection = document.getElementById('match-summary-section');
    const matchSummary = document.getElementById('match-summary');
    const teamAWinsBtn = document.getElementById('team-a-wins');
    const teamBWinsBtn = document.getElementById('team-b-wins');
    
    if (vetoState.finalMap && vetoState.sidePickerTeam && vetoState.sideChoice) {
        const summary = generateMatchSummary();
        matchSummary.value = summary;
        matchSummarySection.classList.remove('hidden');
        
        // Update win buttons
        const teamAName = clans.find(c => c.id === vetoState.teamA)?.name || "Takım A";
        const teamBName = clans.find(c => c.id === vetoState.teamB)?.name || "Takım B";
        
        teamAWinsBtn.textContent = `${teamAName} Kazandı (+3)`;
        teamBWinsBtn.textContent = `${teamBName} Kazandı (+3)`;
        
        teamAWinsBtn.className = `btn ${vetoState.winner === vetoState.teamA ? 'btn-primary' : 'btn-secondary'}`;
        teamBWinsBtn.className = `btn ${vetoState.winner === vetoState.teamB ? 'btn-primary' : 'btn-secondary'}`;
    } else {
        matchSummarySection.classList.add('hidden');
    }
}

function generateMatchSummary() {
    const teamAName = clans.find(c => c.id === vetoState.teamA)?.name || "A";
    const teamBName = clans.find(c => c.id === vetoState.teamB)?.name || "B";
    const mapName = maps.find(m => m.id === vetoState.finalMap)?.name || "?";
    const firstBanName = vetoState.firstBanTeam ? clans.find(c => c.id === vetoState.firstBanTeam)?.name : "";
    const sidePickerName = vetoState.sidePickerTeam ? clans.find(c => c.id === vetoState.sidePickerTeam)?.name : "";
    const bans = vetoState.banned
        .map(id => maps.find(m => m.id === id)?.name)
        .filter(Boolean)
        .join(", ");

    return [
        `${EMOJI.loud} Maç Duyurusu`,
        `${EMOJI.sword} Takımlar: ${teamAName} vs ${teamBName}`,
        `${EMOJI.dice} Mod: ${vetoState.mode}`,
        `${EMOJI.dice} İlk banlayacak takım (kura): ${firstBanName}`,
        `${EMOJI.cross} Banlanan haritalar: ${bans || "-"}`,
        `${EMOJI.map} Oynanacak harita: ${mapName}`,
        `${EMOJI.dice} Taraf seçimi (kura): ${sidePickerName}`,
        `${vetoState.sideChoice === "Saldırı" ? EMOJI.sword : EMOJI.shield} Seçilen taraf: ${vetoState.sideChoice}`,
    ].join("\n");
}

function updateStatusPanel() {
    const teamAName = clans.find(c => c.id === vetoState.teamA)?.name || "-";
    const teamBName = clans.find(c => c.id === vetoState.teamB)?.name || "-";
    const firstBanName = vetoState.firstBanTeam ? clans.find(c => c.id === vetoState.firstBanTeam)?.name : "-";
    const mapName = vetoState.finalMap ? maps.find(m => m.id === vetoState.finalMap)?.name : "-";
    const sidePickerName = vetoState.sidePickerTeam ? clans.find(c => c.id === vetoState.sidePickerTeam)?.name : "-";
    const activeMaps = maps.filter(m => m.active);
    
    document.getElementById('status-team-a').textContent = teamAName;
    document.getElementById('status-team-b').textContent = teamBName;
    document.getElementById('status-mode').textContent = vetoState.mode;
    document.getElementById('status-first-ban').textContent = firstBanName;
    document.getElementById('status-banned').textContent = vetoState.banned.length ? `${vetoState.banned.length} / ${activeMaps.length}` : "-";
    document.getElementById('status-map').textContent = mapName;
    document.getElementById('status-side-picker').textContent = sidePickerName;
    document.getElementById('status-side').textContent = vetoState.sideChoice || "-";
}

function updateProgress() {
    const steps = [
        !!vetoState.teamA,
        !!vetoState.teamB,
        !!vetoState.firstBanTeam,
        !!vetoState.finalMap,
        !!vetoState.sidePickerTeam,
        !!vetoState.sideChoice
    ];
    
    const completed = steps.filter(Boolean).length;
    const progress = (completed / steps.length) * 100;
    
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

// Admin functionality
function initializeAdmin() {
    // Clan management
    document.getElementById('add-clan').addEventListener('click', () => {
        clans.push({
            id: uid(),
            name: "Yeni Klan",
            logo: "",
            players: [],
            points: 0
        });
        render();
    });

    document.getElementById('export-data').addEventListener('click', exportData);

    

    // Map management
    document.getElementById('add-map').addEventListener('click', () => {
        maps.push({
            id: uid(),
            name: "Yeni Harita",
            img: "",
            active: true
        });
        render();
    });

    // Mod management
    document.getElementById('add-mod').addEventListener('click', () => {
        const input = document.getElementById('new-mod');
        const value = input.value.trim();
        if (value && !modList.includes(value)) {
            modList.push(value);
            input.value = '';
            render();
        }
    });

    document.getElementById('clear-mods').addEventListener('click', () => {
        modList = [];
        render();
    });

    // Enter key for mod input
    document.getElementById('new-mod').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('add-mod').click();
        }
    });
}

function exportData() {
    const data = { clans, maps, modList };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klan-sistemi-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}


// Clan management functions
function editClan(clanId) {
    const clan = clans.find(c => c.id === clanId);
    if (!clan) return;

    currentEditingClan = clanId;
    
    document.getElementById('edit-clan-name').value = clan.name;
    document.getElementById('edit-clan-points').value = clan.points;
    
    renderEditClanPlayers(clan.players);
    
    document.getElementById('edit-clan-modal').classList.remove('hidden');
}

function closeEditClanModal() {
    document.getElementById('edit-clan-modal').classList.add('hidden');
    currentEditingClan = null;
}

function renderEditClanPlayers(players) {
    const container = document.getElementById('edit-clan-players');
    container.innerHTML = '';
    
    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        playerDiv.innerHTML = `
            <span>${player}</span>
            <button class="player-remove" onclick="removePlayerFromEdit(${index})">&times;</button>
        `;
        container.appendChild(playerDiv);
    });
}

function addPlayer() {
    const input = document.getElementById('new-player');
    const value = input.value.trim();
    if (!value) return;

    const clan = clans.find(c => c.id === currentEditingClan);
    if (clan) {
        clan.players.push(value);
        renderEditClanPlayers(clan.players);
        input.value = '';
    }
}

function removePlayerFromEdit(index) {
    const clan = clans.find(c => c.id === currentEditingClan);
    if (clan) {
        clan.players.splice(index, 1);
        renderEditClanPlayers(clan.players);
    }
}

function clearPlayers() {
    const clan = clans.find(c => c.id === currentEditingClan);
    if (clan) {
        clan.players = [];
        renderEditClanPlayers(clan.players);
    }
}

function saveClan() {
    const clan = clans.find(c => c.id === currentEditingClan);
    if (!clan) return;

    clan.name = document.getElementById('edit-clan-name').value;
    clan.points = parseInt(document.getElementById('edit-clan-points').value) || 0;
    
    const logoFile = document.getElementById('edit-clan-logo').files[0];
    if (logoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            clan.logo = e.target.result;
            render();
        };
        reader.readAsDataURL(logoFile);
    }
    
    closeEditClanModal();
    render();
}

function deleteClan(clanId) {
    if (confirm('Bu klanı silmek istediğinizden emin misiniz?')) {
        clans = clans.filter(c => c.id !== clanId);
        render();
    }
}

// Map management functions
function editMap(mapId) {
    const map = maps.find(m => m.id === mapId);
    if (!map) return;

    currentEditingMap = mapId;
    
    document.getElementById('edit-map-name').value = map.name;
    document.getElementById('edit-map-active').checked = map.active;
    
    document.getElementById('edit-map-modal').classList.remove('hidden');
}

function closeEditMapModal() {
    document.getElementById('edit-map-modal').classList.add('hidden');
    currentEditingMap = null;
}

function saveMap() {
    const map = maps.find(m => m.id === currentEditingMap);
    if (!map) return;

    map.name = document.getElementById('edit-map-name').value;
    map.active = document.getElementById('edit-map-active').checked;
    
    const imageFile = document.getElementById('edit-map-image').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            map.img = e.target.result;
            render();
        };
        reader.readAsDataURL(imageFile);
    }
    
    closeEditMapModal();
    render();
}

function deleteMap(mapId) {
    if (confirm('Bu haritayı silmek istediğinizden emin misiniz?')) {
        maps = maps.filter(m => m.id !== mapId);
        render();
    }
}

function toggleMapActive(mapId) {
    const map = maps.find(m => m.id === mapId);
    if (map) {
        map.active = !map.active;
        render();
    }
}

// Render functions
function render() {
    renderRankings();
    renderClanGallery();
    renderAdminClanGallery();
    renderAdminMapGallery();
    renderModList();
    renderAdminControls();
    updateVetoUI();
}

function renderRankings() {
    const container = document.getElementById('rankings-list');
    const sortedClans = [...clans].sort((a, b) => b.points - a.points);
    
    container.innerHTML = '';
    
    sortedClans.forEach((clan, index) => {
        const rankingDiv = document.createElement('div');
        rankingDiv.className = 'ranking-item';
        
        rankingDiv.innerHTML = `
            <div class="ranking-position">${index + 1}</div>
            <div class="logo-circle ${!clan.logo ? 'placeholder' : ''}">
                ${clan.logo ? `<img src="${clan.logo}" alt="${clan.name}">` : 'Logo'}
            </div>
            <div class="ranking-info">
                <div class="ranking-name">${clan.name}</div>
                <div class="ranking-players">Oyuncular: ${clan.players.join(', ') || '-'}</div>
            </div>
            <div class="ranking-points">${clan.points} puan</div>
        `;
        
        container.appendChild(rankingDiv);
    });
}

function renderClanGallery() {
    const container = document.getElementById('clan-gallery');
    container.innerHTML = '';
    
    clans.forEach(clan => {
        const clanDiv = document.createElement('div');
        clanDiv.className = 'clan-card';
        
        clanDiv.innerHTML = `
            <div class="clan-header">
                <div class="logo-circle ${!clan.logo ? 'placeholder' : ''}">
                    ${clan.logo ? `<img src="${clan.logo}" alt="${clan.name}">` : 'Logo'}
                </div>
                <div class="clan-name">${clan.name}</div>
            </div>
            <div class="clan-players">
                ${clan.players.map(player => `<div class="player-badge">${player}</div>`).join('')}
            </div>
            <div class="clan-footer">
                <div class="clan-points">Puan: <strong>${clan.points}</strong></div>
            </div>
        `;
        
        container.appendChild(clanDiv);
    });
}

function renderAdminClanGallery() {
    const container = document.getElementById('admin-clan-gallery');
    container.innerHTML = '';
    
    clans.forEach(clan => {
        const clanDiv = document.createElement('div');
        clanDiv.className = 'clan-card';
        
        clanDiv.innerHTML = `
            <div class="clan-header">
                <div class="logo-circle ${!clan.logo ? 'placeholder' : ''}">
                    ${clan.logo ? `<img src="${clan.logo}" alt="${clan.name}">` : 'Logo'}
                </div>
                <div class="clan-name">${clan.name}</div>
            </div>
            <div class="clan-players">
                ${clan.players.map(player => `<div class="player-badge">${player}</div>`).join('')}
            </div>
            <div class="clan-footer">
                <div class="clan-points">Puan: <strong>${clan.points}</strong></div>
                ${editMode ? `
                    <div class="clan-actions">
                        <button class="btn btn-secondary btn-icon" onclick="editClan('${clan.id}')" title="Düzenle">
                            ✏️
                        </button>
                        <button class="btn btn-destructive btn-icon" onclick="deleteClan('${clan.id}')" title="Sil">
                            🗑️
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        container.appendChild(clanDiv);
    });
}

function renderAdminMapGallery() {
    const container = document.getElementById('admin-map-gallery');
    container.innerHTML = '';
    
    maps.forEach(map => {
        const mapDiv = document.createElement('div');
        mapDiv.className = `map-card ${!map.active ? 'inactive' : ''}`;
        
        mapDiv.innerHTML = `
            <div class="map-image">
                ${map.img ? `<img src="${map.img}" alt="${map.name}">` : `<div>${map.name}</div>`}
            </div>
            <div class="map-content">
                <div class="map-name">${map.name}</div>
                <div class="map-actions">
                    ${editMode ? `
                        <div class="button-group">
                            <button class="btn btn-secondary btn-icon" onclick="editMap('${map.id}')" title="Düzenle">
                                ✏️
                            </button>
                            <button class="btn btn-secondary" onclick="toggleMapActive('${map.id}')">
                                ${map.active ? 'Pasifleştir' : 'Aktifleştir'}
                            </button>
                            <button class="btn btn-destructive btn-icon" onclick="deleteMap('${map.id}')" title="Sil">
                                🗑️
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        container.appendChild(mapDiv);
    });
}

function renderModList() {
    const container = document.getElementById('mod-list');
    container.innerHTML = '';
    
    modList.forEach(mod => {
        const modDiv = document.createElement('div');
        modDiv.className = 'mod-badge';
        modDiv.textContent = mod;
        container.appendChild(modDiv);
    });
}

function renderAdminControls() {
    const clanControls = document.getElementById('admin-controls-clans');
    const mapControls = document.getElementById('admin-controls-maps');
    const modControls = document.getElementById('admin-controls-mods');
    
    if (editMode) {
        clanControls.classList.remove('hidden');
        mapControls.classList.remove('hidden');
        modControls.classList.remove('hidden');
    } else {
        clanControls.classList.add('hidden');
        mapControls.classList.add('hidden');
        modControls.classList.add('hidden');
    }
}










// Close modals on outside click
document.getElementById('edit-clan-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-clan-modal') {
        closeEditClanModal();
    }
});

document.getElementById('edit-map-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-map-modal') {
        closeEditMapModal();
    }
});

// Enter key for player input
document.getElementById('new-player').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPlayer();
    }
});
