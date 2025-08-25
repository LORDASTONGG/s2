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

// === LANGUAGE SWITCHER ===
const translations = {
  tr: {
    'lang': 'EN',
    'site-title': 'S2SONSİLAH',
    'site-subtitle': 'D187: SIN STREETS',
    'nav-home': 'Ana Sayfa',
    'nav-rank': 'Klan Sıralaması',
    'nav-match': 'Maç Oluştur',
    'nav-news': 'Haberler',
    'nav-maps': 'Haritalar',
    'nav-admin': 'Admin',
    'maps-page-title': 'HARITALAR',
    'maps-page-subtitle': 'S2 Son Silah\'ta savaşacağın efsanevi haritalar ve hikayeleri',
    'home-title': "ARENA'YA HOSGELDIN!",
    'home-subtitle': 'Adrenalin dolu savaşlara hazır mısın? Hemen indir ve aksiyona katıl!',
    'download-btn': '🎮 OYUNU İNDİR',
    'discord-btn': "💬 DİSCORD'A KATIL",
    'announcements-title': '✨DUYURULAR✨',
    'announcements-1': '🔥YENİ TURNUVA ZAMANI : BELİRSİZ BELİRLENECEK',
    'announcements-2': '📰 Haberler kanalı eklenmiştir güncel duyuruları takip edebileceğiniz bir kategoridir.',
    'rankings-title': 'SIRALAMA',
    'clans-title': 'KLANLAR',
    'login-title': 'Admin Girişi',
    'login-btn': 'Giriş Yap',
    'admin-panel-title': 'Admin Paneli',
    'admin-tip-1': '• Klan ekle/sil, logo ve oyuncu listesi düzenle.',
    'admin-tip-2': '• Harita galerisine görsel yükle, aktif/pasif yap.',
    'admin-tip-3': '• Mod listesini düzenle.',
    'admin-tip-4': '• Veto & Kura sekmesinde maç sonuçlarını işleyip kazanana <strong>+3</strong> puan ekle.',
    'admin-tip-5': '• Kalıcılık için <strong>JSON Dışa Aktar</strong> ile yedekle, gerekirse <strong>İçe Aktar</strong>.',
    'news-main-title': '⚡ GÜNCEL HABERLER',
    'news-main-desc': 'En yeni gelişmeler, topluluk başarıları, sürpriz etkinlikler ve daha fazlası burada!<br><span class="news-highlight" data-i18n="news-main-highlight">Her gün yeni bir heyecan, her hafta yeni bir mücadele!</span>',
    'news-main-highlight': 'Her gün yeni bir heyecan, her hafta yeni bir mücadele!',
    'footer-scroll-1': 'S2 Son Silah • Kar Amacı Gütmeyen Özel Sunucu Projesinin Resmi Web Sitesi',
    'footer-scroll-2': 'S2 Son Silah Özel Sunucu topluluğu için oluşturulan resmi web sitesine hoş geldiniz! Burada bulacaklarınız:',
    'footer-scroll-3': 'En son güncellemeler ve yenilikler',
    'footer-scroll-4': 'Oyun içi etkinliklerle ilgili duyurular',
    'footer-scroll-5': 'Topluluk haberleri ve özel içerikler',
    'footer-scroll-6': 'Amacımız S2 Son Silah deneyiminizi geliştirmek ve oyuncuları bir araya getirmek.',
    'footer-copyright': '&copy; Lordastong 2025 S2 Son Silah websitesi.',
    'mods-title': 'Modlar',
    'mod-input-placeholder': 'Mod ekle (örn. BO1)',
    'add-mod-btn': 'Ekle',
    'clear-mods-btn': 'Temizle',
    'info-title': 'Bilgi',
    'info-text': 'Bu site s2 son silah için klan turnuvalarına özel olarak hazırlanmıştır en iyi sıralama kimin ise özel ödülleri olacaktır.',
    'important-title': 'ÖNEMLİ',
    'important-text-1': 'GÜNCELLEME YAPTIKTAN SONRA DIŞARI AKTAR DİYİP GELEN DOSYAYI LORDASTONGA VERİNİZ',
    'important-text-2': 'DOSYA KAYIDI ALMAYI HİÇ UNUTMAYIN PUAN EKLERSENİZ BİLE KAYIT ALIN !!!!',
  
    // Map stories (TR)
    'map-1-story': 'Özel tim ekibi, Çetelerin terk edilmiş bir depoda silah kaçakçılığı yaptığı bilgisini alır ve depoyu dört bir yandan kuşatırlar. Tüm silahların ele geçirilmesi, gangsterlerin planlarını alt üst edecektir. Öte yandan çeteler de bu operasyona hazırlıksız yakalanmayacaktır.',
    'map-2-story': 'Önemli devlet adamları ile önde gelen yatırımcılar küçük bir köyün yakınlarında yer alan ufak bir hava alanının muhitini turistik bölgeye dönüştürme projesini görüşmek amacıyla toplanırlar. Politikanın ve ekonominin en önemli isimlerinin katılacağı bu toplantı hakkında bilgi edinen çeteler suikast düzenleme amacıyla bölgede konuşlanır. Toplantı başlar fakat iki tarafın da kaybedecek çok şeyi vardır.',
    'map-3-story': 'Şehrin ıssız bir bölgesinde yer alan terk edilmiş bir hastane. Silahlı çete üyeleri çok özel bir görev için burayı ele geçirmiş durumda. Görevin amacı ölü bir çete liderinin vücuduna gizlenmiş paha biçilemez mücevheri cesetten çıkartmak. Bu kirli operasyonun ortasında Özel Tim birlikleri hastaneyi kuşatıp ani bir saldırı düzenler ve etraf bir anda savaş alanine döner. Mücevheri ele geçiren çete üyelerinin önündeki tek engel, Özel Timin kapadığı yolu açıp oradan tüymektir.',
    'map-4-story': 'Bir kaç el ateşle başlayan çatışma, huzur dolu kasabayı tam bir savaş alanına çevirmiştir. Özel tim ekiplerinden kaçan çeteler köşeye sıkışmış, umutsuzca kasabayı ateşe vermeye başlamışlardır. Özel tim ekipleri düşmanları ortadan kaldırmayı amaçlarken, çeteler de peşlerindeki ekiplerden kurtulup olay yerini terk etmeye çalışmaktadırlar.',
    'map-5-story': 'Küçük bir şehir kasabasında Çete üyelerinin toplantı yapacağı istihbaratını alan Özel Tim üyeleri toplantının gece geç vakitlere kadar süreceğini bildiğinden geç saatlerde bir baskın düzenler. Ormanlık alanda ve soğuk hava şartlarının zorluğu sebebiyle Çete üyeleri de bu baskına kaçmak yerine karşı ateş ile cevap verir.',
    'map-6-story': 'Çetelerinin pek çoğu refah ve güçlerini korumak adına, silah ve uyuşturucu kaçakçılığı gibi en kanunsuz işlere karışmaya cesaret eder olmuştur. Özel Tim\'in aldığı bilgiye göre birkaç gangster çetesi tehlikeli silahların kaçakçılığını yapmak için eski bir gemiyi kullanmaktadır. Görevleri gemiye sızmak ve gangsterleri durdurmak olan ekipler işe koyulur. Fakat durumdan haberdar olan çeteler, ekipleri tuzağa düşürürler. Özel tim ekipleri okyanusun ortasında, eski bir gemide çaresizce düşmanla çatışmaya girmek zorunda kalırlar.',
    'map-7-story': 'Çete üyelerinin bir gece kulübü sahibiyle görülecek işlerinin olduğu istihbaratını alan Özel Tim ekipleri kulübe doğru yola çıkar. Özel Tim için bu kaçırılmaması gereken bir fırsattır Kulübün etrafı sarılır. Klüpteki ışık ve müzik curcunası arasında çevredeki sivillere zarar gelmemesi açısından ekipler ateşli silah ve patlayıcıları bırakmak zorunda kalmıştır. Pist ışıkları ve müzik eşliğinde verilen bu savaşı bakalım kim kazanacak?',
    'map-8-story': 'Çetelerin mali işlerini tutan bir elemanın telsiz konuşmalarını dinleyen Özel tim ekipleri elemanı eski atık işleme reaktöründe sıkıştırırlar. Fakat reaktör yanıcı, patlayıcı gazla doludur. Bomba ve ateşli silahların kullanılması büyük tehlike arz edeceğinden düşmanlar birbirlerini başka yollarla halletmelidir.',
    'map-9-story': 'Uzun süredir bir vurgunun peşinde koşan Juan\'ın Çetesi, bu kez gözünü Kapalı Çarşı\'ya dikmişti. Kapalıçarşı\'nın esrarengiz yüzünü de kullanarak gizli bir plan yapan Juan büyük vurgun için gün saymaya başlamıştı. Harika plan ile Kapalı Çarşı\'daki tüm dükkanları yağmalayıp kimsenin ruhu duymadan "logar kapağını" patlatıp şehrin altından kaçacaklardı. Ancak diğer tarafta Özel Tim Liderlerinden Ivan, muhbirleri sayesinde, Juan\'ın bu planından haberi olur. Ivan\'ın her zaman söylediği söz yine gerçek olmuştu: "O çete üyeleri her zaman birbirlerini satar..." Gece büyük vurgunu tamamlamak için buluşan Juan ve Çetesi, Kapalıçarşı\'nın Kubbelerine tırmanarak burada ortalığın iyice sakinleşmesini beklerler. Sabaha karşı içeride bulunan zincirli bölgelerden içeri giren Çete amacına çok yakındır... Ancak bu durum Ivan\'ın Özel Timler ile birlikte Kapalı Çarşı\'yı kuşatmasına kadar sürdü... Daha sonra uzun süren çatışmalar başladı...',
    'map-10-story': 'Kanunsuz işlerle kazandıkları pis malların teslimatı için terkedilmiş bir bölge seçen Çete Üyeleri, Özel Tim tarafından köşeye sıkıştırılmıştır. Çete üyeleri bir yandan uzun süredir topladıkları bu malları kaybetmemek bir yandan da arkada bir yerde gizli bir yol bulmak ve zaman kazanmak için çatışmaya girerler.',
    'map-11-story': 'Özel Tim, dağlar arasında bulunan Cennet isimli ufak bir kasabada Çete üyelerinin silah temin ettiğine dair duyumlar alır. Dört tarafı dağlarla çevrili bu sakin ve barışçıl kasaba, bu özelliğinden dolayı dış dünyanın ilgisini çekmeyecek bir mekandır. Yapılan araştırmalar sonucu Özel Tim, kasabanın Çete üyelerinin ini olduğunu öğrenir. Çeşitli patlayıcılar başta olmak üzere pek çok silahın saklandığı kasabaya normal yollardan giriş imkansızdır. Akşam saatlerinde tenha bir köşedeki duvarı imha ederek kasabaya sızan Tim\'in amacı Çete silahlarını ele geçirip yok etmektir.',
    'map-12-story': 'Arka sokaklarda Çetenin hüküm sürdüğü bölgelere rutin baskınlardan birini yapan Özel Tim durumun ciddiyetini farkedememiştir. Çete üyeleri Özel Tim\'i kuracakları C4 bombalarla bozguna uğratmak istemektedir.',
    'map-13-story': 'Çete Üyelerinin eylemleri giderek daha da büyümeye başlar. Bu yüzden Özel Tim ekipleri saha operasyonlarını genişletir. Çete üyeleri, operasyonlar yüzünden geri adım atmak zorunda kalırlar. Can havliyle Özel Tim ekiplerini eski bir petrol rafinerisinin konuşlandığı bir yerleşim merkezine çeken çete üyeleri, C4 patlayıcı ile rafineyi havaya uçurup tüm SWAT ekiplerinden kurtulmayı planlamaktadırlar. Fakat yılların tecrübeli Özel Tim birlikleri bu tuzağa düşmeyecek kadar zekidir.',
    'map-14-story': 'Çetelerin eylemleri giderek daha da büyümeye başlar. Bu yüzden Özel tim ekipleri saha operasyonlarını genişletir. Can havliyle Özel tim ekiplerini eski bir petrol rafinerisin konuşlandığı bir yerleşim merkezine çeken gangster çetesi C4 patlayıcı ile rafineyi havaya uçurup tüm Özel tim ekiplerinden kurtulmayı planlamaktadırlar. Fakat yılların tecrübeli Özel tim ekibi bu tuzağa düşmeyecek kadar zekidir.',
    'map-15-story': 'Özel tim ekipleri büyük bir uyuşturucu ağına ilişkin istihbarat alır bu ağın kökünü kazımak için operasyona başlarlar. Malın saklandığı depoya doğru harekete geçen ekipleri gangster çeteleri karşılar.',
    'map-16-story': 'Çetelerin en önemli liderlerinden birinin bir dağ köyünde saklandığı istihbaratını alan ekipler köyün çevresini kuşatarak herkesi sorguya almaya başlar. Aramaların sonuna yaklaşılırken çeteler Özel tim ekiplerine karşı saldırıya geçer.',
    'map-17-story': 'Çetelerin mali işlerini tutan bir elemanın telsiz konuşmalarını dinleyen Özel tim ekipleri elemanı kanalizasyon tünellerinde takip ederler. Fakat iyice derinlere inen ekipler sonu olmayan tünellerde kapana sıkışır. Bakalım ekipler gangsterlerin bu tuzağından canlı çıkabilecekler mi?',
    'map-18-story': 'Belediye tarafından şehir geri dönüşüm çalışmaları sonucu eski binaları yenilemeye başlanır. İşçilerden birisi gangsterlerin kullandığı eski bir binada yüklü miktarda para bulur. Paralarını işçilerden geri almak için binayı kuşatan gangster çetesinin hemen ardından olay yerine Özel tim ekipleri de teşrif etmişlerdir.',
    'map-19-story': 'Gangsterler, şehrin bir bölümünün elektriklerinin sağlandığı büyük makinaları imha etmek ve halka korku salmak için harekete geçerler. Bunun istihbaratını alan Özel Tim ekipleri de olaya müdahale etmek için harekete geçerler.',
    'map-20-story': 'Ekonominin kalbinin attığı plazalar muhitinde çok önemli bir finans firmasının gökdelenini ele geçiren gangster çeteleri, gökdeleni yerle bir ederek ekonomiye darbe indirmek ve yarattıkları kaosla binadan kaçmak istemişlerdir. Fakat SWAT ekipleri yıkımı engelleyerek çeteleri gökdelende sıkıştırmışlardır. Kaçacak yerleri olmayan gangsterler direnişe geçer. Gökdelene tam olarak giriş yapamayan SWAT ekipleri çevreye keskin nişancılar yerleştirerek düşmanı alt etmeye çalışır. Her bir silah sesinde birinin yere yığıldı bu karmaşa ortamında bakalım en son kim hayatta kalacaktır?',
    'map-21-story': 'Zengin ve Fakir insanların arasında ki fark genişliyorken, insanlar yaşamak için Çete Üyelerine katılıyorlardı. Bu kalabalıklaşma Çete Üyelerinin organizasyon yapmalarını zorlaştırıyordu. Sığınak yerlerinin bazıları hariç çoğu S.W.A.T gözetimi altındaydı. Bu yüzden Çete Üyeleri cesurca özel bir tesis kılığında depoları ve özel mekanları yeniden organize ederek karargahlarına katmaya karar verdiler. Yapılanma planı iyi gidiyor gibi görünüyordu. Yarı zamanlı hükümetin izni ile çalışan bir işçinin gizli silah ve malzemeleri bulup Özel Tim\'e haber vermesiyle her şey değişti. Özel Tim bölgede neler olduğunu araştırmak için bir Silahlı ekip göndermeye karar verir ve Çete Üyeleriyle aralarında büyük bir çatışma çıkacaktır.',
  },
  en: {
    'lang': 'TR',
    'site-title': 'S2SONSILAH',
    'site-subtitle': 'D187: SIN STREETS',
    'nav-home': 'Home',
    'nav-rank': 'Clan Rankings',
    'nav-match': 'Create Match',
    'nav-news': 'News',
    'nav-maps': 'Maps',
    'nav-admin': 'Admin',
    'maps-page-title': 'MAPS',
    'maps-page-subtitle': 'Legendary maps and their stories in S2 Son Silah',
    'home-title': 'WELCOME TO THE ARENA!',
    'home-subtitle': 'Are you ready for adrenaline-filled battles? Download now and join the action!',
    'download-btn': '🎮 DOWNLOAD GAME',
    'discord-btn': '💬 JOIN DISCORD',
    'announcements-title': '✨ANNOUNCEMENTS✨',
    'announcements-1': '🔥NEW TOURNAMENT TIME: TO BE ANNOUNCED',
    'announcements-2': '📰 News channel has been added, follow for the latest updates.',
    'rankings-title': 'RANKINGS',
    'clans-title': 'CLANS',
    'login-title': 'Admin Login',
    'login-btn': 'Login',
    'admin-panel-title': 'Admin Panel',
    'admin-tip-1': '• Add/remove clans, edit logo and player list.',
    'admin-tip-2': '• Upload images to the map gallery, set active/inactive.',
    'admin-tip-3': '• Edit the mod list.',
    'admin-tip-4': '• In the Veto & Draw tab, process match results and add <strong>+3</strong> points to the winner.',
    'admin-tip-5': '• For persistence, use <strong>Export JSON</strong> to backup, <strong>Import</strong> if needed.',
    'news-main-title': '⚡ LATEST NEWS',
    'news-main-desc': 'The latest developments, community achievements, surprise events and more are here!<br><span class="news-highlight" data-i18n="news-main-highlight">A new excitement every day, a new challenge every week!</span>',
    'news-main-highlight': 'A new excitement every day, a new challenge every week!',
    'footer-scroll-1': 'S2 Son Silah • Official Website of the Non-Profit Private Server Project',
    'footer-scroll-2': 'Welcome to the official website created for the S2 Son Silah Private Server community! Here you will find:',
    'footer-scroll-3': 'The latest updates and innovations',
    'footer-scroll-4': 'Announcements about in-game events',
    'footer-scroll-5': 'Community news and exclusive content',
    'footer-scroll-6': 'Our mission is to enhance your S2 Son Silah experience and bring players together.',
    'footer-copyright': '&copy; Lordastong 2025 S2 Son Silah website.',
    'mods-title': 'Mods',
    'mod-input-placeholder': 'Add mod (e.g. BO1)',
    'add-mod-btn': 'Add',
    'clear-mods-btn': 'Clear',
    'info-title': 'Info',
    'info-text': 'This site is specially prepared for S2 Son Silah clan tournaments. The top ranking will receive special rewards.',
    'important-title': 'IMPORTANT',
    'important-text-1': 'AFTER MAKING AN UPDATE, EXPORT THE FILE AND GIVE IT TO LORDASTONG.',
    'important-text-2': 'NEVER FORGET TO SAVE THE FILE, EVEN IF YOU ONLY ADD POINTS!!!!',
  
    // Map stories (EN)
    'map-1-story': 'The special forces learn that gangs are trafficking weapons in an abandoned warehouse and surround it from all sides. Seizing all weapons will ruin the gangsters\' plans. However, the gangs are not unprepared for this operation.',
    'map-2-story': 'High-profile statesmen and investors gather near a small airfield by a village to discuss turning the area into a tourist hub. Learning about this meeting, gangs position themselves to carry out an assassination. The meeting starts, but both sides have a lot at stake.',
    'map-3-story': 'In a deserted part of the city stands an abandoned hospital. Armed gang members have seized it for a special mission: to extract a priceless jewel hidden in the body of a deceased gang leader. As special forces surround the hospital and launch a sudden assault, the place turns into a battlefield. The only way out for the gang, who seize the jewel, is to break through the blocked path and escape.',
    'map-4-story': 'A few gunshots turn a peaceful town into a war zone. Cornered gang members fleeing special forces start setting the town on fire. While special forces aim to neutralize the enemies, the gangs try to shake pursuit and flee the area.',
    'map-5-story': 'Receiving intel that gang members will meet in a small town, special forces raid late at night. Due to the forest terrain and harsh cold, the gang responds with gunfire instead of fleeing.',
    'map-6-story': 'To preserve their wealth and power, many gangs dare to engage in illicit arms and drug trafficking. Special forces learn that several gangs are using an old ship to smuggle dangerous weapons. The team\'s mission is to infiltrate the ship and stop them, but the gangs set a trap. In the middle of the ocean, on an old ship, the team is forced into a hopeless firefight.',
    'map-7-story': 'Special forces receive intel that gang members will meet a nightclub owner. It\'s an opportunity not to be missed, so they surround the club. To avoid harming civilians amid the lights and music, the team must drop firearms and explosives. Under flashing lights and pounding music—who will win?',
    'map-8-story': 'Listening to the radio chatter of a gang\'s accountant, special forces corner him in an old waste-processing reactor. The reactor is filled with flammable, explosive gas. Since bombs and firearms would be too dangerous, the enemies must eliminate each other by other means.',
    'map-9-story': 'Juan\'s gang has long chased a big score and now targets the Grand Bazaar. Using its maze-like layout, Juan prepares a secret plan to loot all the shops and then blow a manhole cover to escape through the underground. But Special Forces leader Ivan learns of the plan from informants—“Gang members always sell each other out.” As Juan\'s crew climbs the domes to wait for calm, special forces surround the bazaar. A long firefight follows…',
    'map-10-story': 'Gang members choose an abandoned area to deliver dirty goods obtained illegally, but special forces corner them. They fight both to avoid losing the goods and to find a hidden escape route to buy time.',
    'map-11-story': 'Special forces receive intel that gangs are arming themselves in a small town called Paradise, tucked among the mountains. Surrounded by peaks and out of sight, the town is a perfect hideout. After investigation, the team confirms it\'s a gang den packed with explosives and weapons. They breach a remote wall at dusk to infiltrate and destroy the cache.',
    'map-12-story': 'During a routine raid in backstreets controlled by gangs, special forces underestimate the threat. The gang plans to rout them using planted C4 charges.',
    'map-13-story': 'Gang activity escalates, so special forces expand field operations. Pressured by the crackdown, gangs lure them to a settlement near an old oil refinery, planning to blow it up with C4 and escape all SWAT teams. But the seasoned special forces won\'t fall for the trap.',
    'map-14-story': 'Gang operations keep growing, forcing special forces to extend field missions. A gang draws them to a settlement by an old oil refinery, planning to demolish it with C4 and get rid of all special forces. The veteran team is too smart to be trapped.',
    'map-15-story': 'Special forces gather intel on a large drug network and launch an operation to dismantle it. As they move toward the stash warehouse, gangsters engage them.',
    'map-16-story': 'With intel that a key gang leader is hiding in a mountain village, special forces surround the area and begin questioning everyone. As the search nears its end, gangs launch an attack.',
    'map-17-story': 'Tracking a gang accountant through sewer tunnels by monitoring radio chatter, special forces go too deep and get trapped in endless tunnels. Will they make it out alive?',
    'map-18-story': 'As part of an urban renewal effort, workers start refurbishing old buildings. One finds a stash of cash in a gang hideout. The gang surrounds the building to reclaim their money—soon after, special forces also arrive on scene.',
    'map-19-story': 'Gangs move to destroy the major machines powering a part of the city to spread fear. Special forces mobilize to stop the attack.',
    'map-20-story': 'Gangs seize a financial firm\'s skyscraper in the business district, aiming to demolish it and escape amid the chaos. SWAT prevents the demolition and traps them inside. With snipers positioned outside, every shot drops someone—who will survive last?',
    'map-21-story': 'As the gap between rich and poor widens, more people join gangs to survive, complicating their organization. Most shelters are under S.W.A.T surveillance, so gangs boldly convert depots and venues into a headquarters disguised as a private facility. A part-time government worker discovers hidden weapons and informs special forces—prompting an armed response and a major clash.',
  }
};

let currentLang = 'tr';

function updateLanguage() {
  const t = translations[currentLang];
  // Genel: data-i18n ile işaretli tüm elementleri çevir
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      // Eğer HTML içeriği varsa (ör. içinde <br> veya <span> varsa) innerHTML kullan
      if (t[key].includes('<') || t[key].includes('&')) {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });
  // Footer scrolling text (özel)
  const scrollItems = document.querySelectorAll('.footer-scrolling-text .scrolling-item');
  const scrollKeys = [
    'footer-scroll-1', 'footer-scroll-2', 'footer-scroll-3', 'footer-scroll-4', 'footer-scroll-5', 'footer-scroll-6',
    'footer-scroll-1', 'footer-scroll-2', 'footer-scroll-3', 'footer-scroll-4', 'footer-scroll-5', 'footer-scroll-6'
  ];
  scrollItems.forEach((el, i) => {
    if (scrollKeys[i]) el.textContent = t[scrollKeys[i]];
  });
  // Footer copyright
  const copyright = document.querySelector('.footer-bottom p');
  if (copyright) copyright.innerHTML = t['footer-copyright'];
  // Dil butonu
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.textContent = t['lang'];
}

document.addEventListener('DOMContentLoaded', function () {
  updateLanguage();
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      currentLang = (currentLang === 'tr') ? 'en' : 'tr';
      updateLanguage();
    });
  }
});
// === END LANGUAGE SWITCHER ===

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
            
            // Show maps section after first ban is drawn
            const mapsSection = document.getElementById('maps-section');
            if (mapsSection) {
                mapsSection.classList.remove('hidden');
            }
            
            updateVetoUI();
        }
    });

    drawSidePickerBtn.addEventListener('click', () => {
        if (vetoState.teamA && vetoState.teamB) {
            const teams = [vetoState.teamA, vetoState.teamB];
            vetoState.sidePickerTeam = teams[Math.floor(Math.random() * teams.length)];
            updateVetoUI();
            updateSidePickerResult();
        }
    });

    sideChoiceSelect.addEventListener('change', (e) => {
        vetoState.sideChoice = e.target.value;
        updateVetoUI();
    });

    copySummaryBtn.addEventListener('click', async () => {
        console.log('Copy button clicked');
        try {
            console.log('Generating image...');
            const canvas = await generateMatchSummaryImage();
            console.log('Canvas created:', canvas);
            
            canvas.toBlob(async (blob) => {
                console.log('Blob created:', blob);
                try {
                    if (navigator.clipboard && navigator.clipboard.write) {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        showNotification('Maç özeti resim olarak panoya kopyalandı!', 'success');
                    } else {
                        throw new Error('Clipboard API not supported');
                    }
                } catch (err) {
                    console.error('Resim kopyalama hatası:', err);
                    // Fallback to text
                    const summary = generateMatchSummary();
                    await navigator.clipboard.writeText(summary);
                    showNotification('Maç özeti metin olarak kopyalandı!', 'success');
                }
            }, 'image/png');
        } catch (err) {
            console.error('Resim oluşturma hatası:', err);
            // Fallback to text
            const summary = generateMatchSummary();
            try {
                await navigator.clipboard.writeText(summary);
                showNotification('Maç özeti metin olarak kopyalandı!', 'success');
            } catch (textErr) {
                showNotification('Kopyalama başarısız!', 'error');
            }
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
    
    // Hide result boxes
    const sidePickerResult = document.getElementById('side-picker-result');
    if (sidePickerResult) {
        sidePickerResult.classList.add('hidden');
    }
    
    // Hide maps section until first ban is drawn
    const mapsSection = document.getElementById('maps-section');
    if (mapsSection) {
        mapsSection.classList.add('hidden');
    }
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
        `${EMOJI.loud} **Maç Duyurusu**`,
        `${EMOJI.sword} **Takımlar:** ${teamAName} vs ${teamBName}`,
        `${EMOJI.dice} **Mod:** ${vetoState.mode}`,
        `${EMOJI.map} **Oynanacak harita:** ${mapName}`,
        `${EMOJI.dice} **Taraf seçimi (kura):** ${sidePickerName}`,
        `${vetoState.sideChoice === "Saldırı" ? EMOJI.sword : EMOJI.shield} **Seçilen taraf:** ${vetoState.sideChoice}`,
    ].join("\n");
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        padding: 15px;
        border-radius: 5px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Generate match summary as image using Canvas
function generateMatchSummaryImage() {
    return new Promise((resolve) => {
        console.log('Creating canvas...');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Canvas dimensions
        canvas.width = 700;
        canvas.height = 450;
        console.log('Canvas size set:', canvas.width, 'x', canvas.height);
        
        // Site color palette background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#1f1f1f');
        gradient.addColorStop(1, '#1b1b1b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border with site accent colors
        const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        borderGradient.addColorStop(0, '#ef4444');
        borderGradient.addColorStop(0.5, '#0ea5e9');
        borderGradient.addColorStop(1, '#ef4444');
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 4;
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
        
        // Inner shadow effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        // Get data
        const teamAName = clans.find(c => c.id === vetoState.teamA)?.name || "A";
        const teamBName = clans.find(c => c.id === vetoState.teamB)?.name || "B";
        const mapName = maps.find(m => m.id === vetoState.finalMap)?.name || "?";
        const sidePickerName = vetoState.sidePickerTeam ? clans.find(c => c.id === vetoState.sidePickerTeam)?.name : "";
        
        console.log('Match data:', { teamAName, teamBName, mapName, sidePickerName });
        
        // Reset shadow for text
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // Text styling
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Title with emoji
        ctx.font = 'bold 32px Arial';
        const titleGradient = ctx.createLinearGradient(0, 50, 0, 80);
        titleGradient.addColorStop(0, '#ffffff');
        titleGradient.addColorStop(1, '#e0e0e0');
        ctx.fillStyle = titleGradient;
        ctx.fillText('🔊 MAÇ DUYURUSU', canvas.width / 2, 70);
        
        // Teams with sword emoji and site colors
        ctx.font = 'bold 28px Arial';
        const teamGradient = ctx.createLinearGradient(0, 100, 0, 130);
        teamGradient.addColorStop(0, '#ef4444');
        teamGradient.addColorStop(1, '#dc2626');
        ctx.fillStyle = teamGradient;
        ctx.fillText(`⚔️ ${teamAName} vs ${teamBName}`, canvas.width / 2, 125);
        
        // Mode with dice emoji
        ctx.font = '22px Arial';
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(`🎲 Mod: ${vetoState.mode}`, canvas.width / 2, 170);
        
        // Map with map emoji and gold color
        ctx.font = 'bold 26px Arial';
        const mapGradient = ctx.createLinearGradient(0, 200, 0, 230);
        mapGradient.addColorStop(0, '#ffd700');
        mapGradient.addColorStop(1, '#ffb300');
        ctx.fillStyle = mapGradient;
        ctx.fillText(`🗺️ Oynanacak harita: ${mapName}`, canvas.width / 2, 215);
        
        // Side picker with dice emoji and blue accent
        ctx.font = '22px Arial';
        const sideGradient = ctx.createLinearGradient(0, 250, 0, 280);
        sideGradient.addColorStop(0, '#0ea5e9');
        sideGradient.addColorStop(1, '#0284c7');
        ctx.fillStyle = sideGradient;
        ctx.fillText(`🎲 Taraf seçimi: ${sidePickerName}`, canvas.width / 2, 260);
        
        // Selected side with appropriate emoji
        if (vetoState.sideChoice) {
            ctx.font = 'bold 24px Arial';
            const sideEmoji = vetoState.sideChoice === "Saldırı" ? "⚔️" : "🛡️";
            const choiceGradient = ctx.createLinearGradient(0, 290, 0, 320);
            if (vetoState.sideChoice === "Saldırı") {
                choiceGradient.addColorStop(0, '#ef4444');
                choiceGradient.addColorStop(1, '#dc2626');
            } else {
                choiceGradient.addColorStop(0, '#51cf66');
                choiceGradient.addColorStop(1, '#37b24d');
            }
            ctx.fillStyle = choiceGradient;
            ctx.fillText(`${sideEmoji} Seçilen taraf: ${vetoState.sideChoice}`, canvas.width / 2, 305);
        }
        
        // Decorative line
        const lineGradient = ctx.createLinearGradient(150, 350, 550, 350);
        lineGradient.addColorStop(0, 'transparent');
        lineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        lineGradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(150, 350);
        ctx.lineTo(550, 350);
        ctx.stroke();
        
        // Footer with gaming emoji
        ctx.font = '18px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('🎮 S2 SON SİLAH TURNUVA🎮', canvas.width / 2, 390);
        
        // Date at the bottom
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        const currentDate = new Date().toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        ctx.fillText(`📅 ${currentDate}`, canvas.width / 2, 420);
        
        console.log('Canvas drawing completed');
        resolve(canvas);
    });
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
        const playerObj = typeof player === 'string' ? {name: player, kills: 0, deaths: 0} : player;
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        playerDiv.innerHTML = `
            <div class="player-info" onclick="editPlayerStats(${index})">
                <span class="player-name">${playerObj.name}</span>
                <span class="player-stats">K: ${playerObj.kills} D: ${playerObj.deaths} (${playerObj.kills - playerObj.deaths})</span>
            </div>
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
        clan.players.push({name: value, kills: 0, deaths: 0});
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
    renderPlayerRankings();
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
                <div class="ranking-players">Oyuncular: ${clan.players.map(p => typeof p === 'string' ? p : p.name).join(', ') || '-'}</div>
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
                ${clan.players.map(player => `<div class="player-badge">${typeof player === 'string' ? player : player.name}</div>`).join('')}
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
                ${clan.players.map(player => `<div class="player-badge">${typeof player === 'string' ? player : player.name}</div>`).join('')}
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

// Player stats editing functions
function editPlayerStats(playerIndex) {
    const clan = clans.find(c => c.id === currentEditingClan);
    if (!clan) return;
    
    const player = clan.players[playerIndex];
    const playerObj = typeof player === 'string' ? {name: player, kills: 0, deaths: 0} : player;
    
    const kills = prompt(`${playerObj.name} - Kill sayısını girin:`, playerObj.kills);
    const deaths = prompt(`${playerObj.name} - Death sayısını girin:`, playerObj.deaths);
    
    if (kills !== null && deaths !== null) {
        clan.players[playerIndex] = {
            name: playerObj.name,
            kills: parseInt(kills) || 0,
            deaths: parseInt(deaths) || 0
        };
        renderEditClanPlayers(clan.players);
    }
}

// Player ranking functions
function getAllPlayers() {
    const allPlayers = [];
    clans.forEach(clan => {
        clan.players.forEach(player => {
            const playerObj = typeof player === 'string' ? {name: player, kills: 0, deaths: 0} : player;
            allPlayers.push({
                ...playerObj,
                clan: clan.name,
                score: playerObj.kills - playerObj.deaths
            });
        });
    });
    return allPlayers.sort((a, b) => b.score - a.score);
}

function renderPlayerRankings() {
    const tbody = document.getElementById('player-rankings-tbody');
    if (!tbody) return;
    
    const players = getAllPlayers().slice(0, 50); // Top 50 players
    
    tbody.innerHTML = '';
    
    players.forEach((player, index) => {
        const row = document.createElement('tr');
        
        // Add ranking colors for top 3
        let rankClass = '';
        if (index === 0) rankClass = 'rank-first';
        else if (index === 1) rankClass = 'rank-second';
        else if (index === 2) rankClass = 'rank-third';
        else rankClass = 'rank-other';
        
        row.className = rankClass;
        
        const position = index === 0 ? '🏆 1' : index + 1;
        
        row.innerHTML = `
            <td class="rank-position">${position}</td>
            <td class="player-name" title="${player.clan}">${player.name}</td>
            <td class="kills">${player.kills}</td>
            <td class="deaths">${player.deaths}</td>
            <td class="score">${player.score}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function exportPlayerRankings() {
    const players = getAllPlayers();
    const data = {
        exportDate: new Date().toISOString(),
        totalPlayers: players.length,
        players: players
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oyuncu-siralamasi-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Side picker result function
function updateSidePickerResult() {
    const sidePickerResult = document.getElementById('side-picker-result');
    const sidePickerTeamSpan = document.getElementById('side-picker-team');
    
    if (vetoState.sidePickerTeam) {
        const teamName = clans.find(c => c.id === vetoState.sidePickerTeam)?.name || "?";
        sidePickerTeamSpan.textContent = teamName;
        sidePickerResult.classList.remove('hidden');
    } else {
        sidePickerResult.classList.add('hidden');
    }
}

// Enter key for player input
document.getElementById('new-player').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPlayer();
    }
});
