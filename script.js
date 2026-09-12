const rankData = {
    epic: {
        name: "Epic",
        image: "assets/ranks/epic.webp"
    },

    legend: {
        name: "Legend",
        image: "assets/ranks/legend.png"
    },

    mythic: {
        name: "Mythic",
        image: "assets/ranks/mythic.png"
    },

    honor: {
        name: "Mythical Honor",
        image: "assets/ranks/honor.png"
    },

    glory: {
        name: "Mythical Glory",
        image: "assets/ranks/glory.png"
    },

    immortal: {
        name: "Immortal",
        image: "assets/ranks/immortal.png"
    }
};


const rankPrices = {

    "epic-legend": 50000,
    "epic-mythic": 100000,
    "epic-honor": 150000,
    "epic-glory": 200000,
    "epic-immortal": 400000,

    "legend-mythic": 50000,
    "legend-honor": 100000,
    "legend-glory": 150000,
    "legend-immortal": 350000,

    "mythic-honor": 50000,
    "mythic-glory": 100000,
    "mythic-immortal": 300000,

    "honor-glory": 50000,
    "honor-immortal": 250000,

    "glory-immortal": 200000
};


const fromRank = document.getElementById("fromRank");
const toRank = document.getElementById("toRank");

const fromRankImage = document.getElementById("fromRankImage");
const toRankImage = document.getElementById("toRankImage");

const fromRankName = document.getElementById("fromRankName");
const toRankName = document.getElementById("toRankName");

const rankPrice = document.getElementById("rankPrice");
const rankMessage = document.getElementById("rankMessage");


function updateRankCalculator() {

    const from = fromRank.value;
    const to = toRank.value;

    const fromData = rankData[from];
    const toData = rankData[to];

    fromRankImage.src = fromData.image;
    fromRankName.textContent = fromData.name;

    toRankImage.src = toData.image;
    toRankName.textContent = toData.name;

    const priceKey = `${from}-${to}`;

    const price = rankPrices[priceKey];

    if (price) {

        rankPrice.innerHTML =
            `${price.toLocaleString("ru-RU")} <span>so‘m</span>`;

        rankMessage.textContent =
            `${fromData.name} → ${toData.name}`;

    } else {

        rankPrice.innerHTML =
            `— <span>so‘m</span>`;

        rankMessage.textContent =
            "Bu yo‘nalish mavjud emas";
    }
}


fromRank.addEventListener("change", function () {

    const fromIndex = Object.keys(rankData).indexOf(fromRank.value);

    const options = Array.from(toRank.options);

    options.forEach(option => {

        const toIndex =
            Object.keys(rankData).indexOf(option.value);

        option.disabled =
            toIndex <= fromIndex;
    });

    const selectedOption =
        options.find(option => !option.disabled);

    if (selectedOption) {
        toRank.value = selectedOption.value;
    }

    updateRankCalculator();
});


toRank.addEventListener(
    "change",
    updateRankCalculator
);


updateRankCalculator();
// =========================
// STAR CALCULATOR
// =========================

const starRank = document.getElementById("starRank");
const starCount = document.getElementById("starCount");
const starPrice = document.getElementById("starPrice");
const starMessage = document.getElementById("starMessage");

const starRates = {
    warrior: 2000,
    glory: 4000,
    immortal: 6000
};
const starLimits = {
    warrior: 170,
    glory: 50,
    immortal: null
};

function updateStarCalculator() {

    const rate = starRates[starRank.value];
    const limit = starLimits[starRank.value];
    const count = Number(starCount.value);

    if (limit !== null && count > limit) {

        starPrice.innerHTML =
            `— <span>so‘m</span>`;

        starMessage.textContent =
            `❌ Maksimal ${limit} ⭐`;

        starMessage.style.color = "#ff4d6d";

        return;
    }

    if (count < 1 || isNaN(count)) {

        starPrice.innerHTML =
            `— <span>so‘m</span>`;

        starMessage.textContent =
            `❌ Kamida 1 ⭐ kiriting`;

        starMessage.style.color = "#ff4d6d";

        return;
    }

    starMessage.style.color = "";

    const total = count * rate;

    starPrice.innerHTML =
        `${total.toLocaleString("ru-RU")} <span>so‘m</span>`;

    starMessage.textContent =
        `${count} ⭐ × ${rate.toLocaleString("ru-RU")} so‘m`;
}


// Проверка прямо во время ввода
starCount.addEventListener("input", function () {

    const limit = starLimits[starRank.value];

    let value = this.value;

    // Только цифры
    value = value.replace(/\D/g, "");

    // Убираем нули в начале
    value = value.replace(/^0+(?=\d)/, "");

    // Не даём ввести больше максимума
    if (limit !== null && Number(value) > limit) {
        value = String(limit);
    }

    this.value = value;

    updateStarCalculator();
});


// При смене диапазона обновляем калькулятор
starRank.addEventListener(
    "change",
    function () {

        const limit = starLimits[starRank.value];

        if (limit !== null) {
            starCount.max = limit;

            if (Number(starCount.value) > limit) {
                starCount.value = limit;
            }

        } else {
            starCount.removeAttribute("max");
        }

        updateStarCalculator();
    }
);


// Первый запуск
updateStarCalculator();

// =========================
// MMR CALCULATOR
// =========================

const currentMMR = document.getElementById("currentMMR");
const targetMMR = document.getElementById("targetMMR");

const mmrPrice = document.getElementById("mmrPrice");
const mmrMessage = document.getElementById("mmrMessage");


// Цена за прохождение каждого диапазона
function getMMRPrice(mmr) {

    let price = 0;

    // 1000 → 5000
    if (mmr > 1000) {

        const points = Math.min(mmr, 5000) - 1000;

        price += (points / 4000) * 300000;
    }

    // 5000 → 8000
    if (mmr > 5000) {

        const points =
            Math.min(mmr, 8000) - 5000;

        price += (points / 1000) * 200000;
    }

    // 8000 → 10000
    if (mmr > 8000) {

        const points =
            Math.min(mmr, 10000) - 8000;

        price += (points / 1000) * 400000;
    }

    // 10000+
    if (mmr > 10000) {

        const points = mmr - 10000;

        price += (points / 1000) * 800000;
    }

    return price;
}


function updateMMRCalculator() {

    const current = Number(currentMMR.value);
    const target = Number(targetMMR.value);

    // Проверка MMR
    if (
        !current ||
        !target ||
        current < 1000 ||
        target < 1000
    ) {

        mmrPrice.innerHTML =
            `— <span>so‘m</span>`;

        mmrMessage.textContent =
            "MMR 1 000 dan boshlanadi";

        mmrMessage.style.color = "#ff4d6d";

        return;
    }


    // Нельзя ставить цель ниже текущего MMR
    if (target <= current) {

        mmrPrice.innerHTML =
            `— <span>so‘m</span>`;

        mmrMessage.textContent =
            "Kerakli MMR joriy MMR dan yuqori bo‘lishi kerak";

        mmrMessage.style.color = "#ff4d6d";

        return;
    }


    // Считаем цену
    const price =
        getMMRPrice(target) -
        getMMRPrice(current);


    mmrPrice.innerHTML =
        `${price.toLocaleString("ru-RU")} <span>so‘m</span>`;

    mmrMessage.textContent =
        `${current.toLocaleString("ru-RU")} → ${target.toLocaleString("ru-RU")} MMR`;

    mmrMessage.style.color = "";
}


// Обновляем при вводе
currentMMR.addEventListener(
    "input",
    updateMMRCalculator
);

targetMMR.addEventListener(
    "input",
    updateMMRCalculator
);


// Первый запуск
updateMMRCalculator();

// =========================
// WINRATE CALCULATOR
// =========================

const currentWinrate =
    document.getElementById("currentWinrate");

const gamesPlayed =
    document.getElementById("gamesPlayed");

const targetWinrate =
    document.getElementById("targetWinrate");

const winrateWins =
    document.getElementById("winrateWins");

const winrateMessage =
    document.getElementById("winrateMessage");
    const winratePrice =
    document.getElementById("winratePrice");


function updateWinrateCalculator() {

    const current = Number(currentWinrate.value);
    const games = Number(gamesPlayed.value);
    const target = Number(targetWinrate.value);


    // Проверка данных
    if (
        isNaN(current) ||
        isNaN(games) ||
        isNaN(target) ||
        games < 1 ||
        current < 0 ||
        current > 100 ||
        target < 0 ||
        target > 100
    ) {

        winrateWins.innerHTML =
            `— <span>g‘alaba</span>`;

        winrateMessage.textContent =
            "Ma'lumotlarni to‘g‘ri kiriting";

        winrateMessage.style.color = "#ff4d6d";

        return;
    }


    // Цель уже достигнута
    if (target <= current) {

        winrateWins.innerHTML =
            `0 <span>g‘alaba</span>`;

        winrateMessage.textContent =
            "Sizning Winrate maqsadga yetgan";

        winrateMessage.style.color = "";

        return;
    }


    // Невозможно достичь 100%,
    // если уже есть проигрыши
    if (target >= 100 && current < 100) {

        winrateWins.innerHTML =
            `— <span>g‘alaba</span>`;

        winrateMessage.textContent =
            "100% Winrate ga erishish mumkin emas";

        winrateMessage.style.color = "#ff4d6d";

        return;
    }


    // Текущее количество побед
 // Считаем необходимые победы
const requiredWins =
    Math.ceil(
        ((target - current) * games) /
        (100 - target)
    );
       const totalPrice = requiredWins * 8000;

winrateWins.innerHTML =
    `${requiredWins} <span>g‘alaba</span>`;

winrateMessage.textContent =
    `${current}% → ${target}% Winrate`;

winratePrice.textContent =
    `${totalPrice.toLocaleString("ru-RU")} so‘m`;

winrateMessage.style.color = "";}


// Обновляем при вводе
currentWinrate.addEventListener(
    "input",
    updateWinrateCalculator
);

gamesPlayed.addEventListener(
    "input",
    updateWinrateCalculator
);

targetWinrate.addEventListener(
    "input",
    updateWinrateCalculator
);


// Первый запуск
updateWinrateCalculator();

// ORDER MODAL
function openOrder(service) {
    const modal = document.getElementById("orderModal");
    const selectedService = document.getElementById("selectedService");

    selectedService.textContent = service;
    modal.classList.add("active");
}

function closeOrder() {
    const modal = document.getElementById("orderModal");
    modal.classList.remove("active");
    
}
function buyRankBoost() {
    const from = fromRank.value;
    const to = toRank.value;

    const fromName = rankData[from].name;
    const toName = rankData[to].name;

    const price = rankPrices[`${from}-${to}`];

    if (!price) {
        alert("Bu yo‘nalish mavjud emas");
        return;
    }

 

    const message =
        `🏆 Rank Boost\n` +
        `📈 ${fromName} → ${toName}\n` +
        `💰 Narx: ${price.toLocaleString("ru-RU")} so'm`;

    document.getElementById("orderConfirmContent").innerHTML =
        message.replace(/\n/g, "<br>");

    document.getElementById("orderConfirmModal").classList.add("active");

    window.currentOrderMessage = message;
}

function updateAccountField() {
    const type = document.getElementById("accountType").value;
    const label = document.getElementById("accountLabel");
    const input = document.getElementById("accountData");

    label.textContent = type;

    const placeholders = {
        "Moonton Account": "Введите ID или данные Moonton Account",
        "Google Account": "Введите Google Account",
        "Facebook": "Введите ссылку или данные Facebook",
        "Telegram": "Введите @username Telegram",
        "TikTok": "Введите @username TikTok",
        "VK": "Введите ссылку или данные VK"
    };

    input.placeholder = placeholders[type];
}

function closeOrderConfirm() {
    document.getElementById("orderConfirmModal").classList.remove("active");
}

function confirmOrder() {

    const message = window.currentOrderMessage || "";

    if (!message) {
        alert("Buyurtma topilmadi");
        return;
    }

    const accountType =
        document.getElementById("accountType").value;

    const accountData =
        document.getElementById("accountData").value.trim();

    if (!accountData) {
        alert("Account ma'lumotlarini kiriting");
        return;
    }

    const finalMessage =
        message +
        `\n🔐 Account: ${accountType}` +
        `\n👤 Ma'lumot: ${accountData}`;

    window.currentOrderMessage = finalMessage;

    // Закрываем окно подтверждения
    closeOrderConfirm();

    // Показываем окно оплаты
    document.getElementById("paymentAmount").textContent =
        getOrderPrice(finalMessage);

    document.getElementById("paymentModal").classList.add("active");
}

function getOrderPrice(message) {
    const match = message.match(/💰 Narx: ([\d\s]+) so'm/);

    if (match) {
        return match[1] + " so'm";
    }

    return "0 so'm";
}

function closePayment() {
    document.getElementById("paymentModal").classList.remove("active");
}

function paymentDone() {
    const telegramUsername = "nyronGG";
    const message = window.currentOrderMessage || "";

    if (!message) {
        alert("Buyurtma topilmadi");
        return;
    }

    const telegramMessage =
        `📩 YANGI BUYURTMA\n\n` +
        `${message}\n\n` +
        `💳 TO‘LOV QILINDI\n` +
        `✅ Mijoz to‘lovni amalga oshirdi\n\n` +
        `📸 Chek Telegram orqali yuboriladi.\n` +
        `🔐 Parol va boshqa maxfiy ma'lumotlar Telegram orqali yuboriladi.`;

    window.location.href =
        `https://t.me/${telegramUsername}?text=${encodeURIComponent(telegramMessage)}`;
}

function buyStarBoost() {
    const rank = starRank.value;
    const count = Number(starCount.value);
    const rate = starRates[rank];
    const total = count * rate;

    if (!count || count < 1) {
        alert("Kamida 1 ⭐ kiriting");
        return;
    }

    const limit = starLimits[rank];

    if (limit !== null && count > limit) {
        alert(`Maksimal ${limit} ⭐`);
        return;
    }

   

    const rankName = starRank.options[starRank.selectedIndex].text;

    const message =
        `⭐ Star Boost\n` +
        `🎮 ${rankName}\n` +
        `⭐ Yulduzlar: ${count}\n` +
        `💰 Narx: ${total.toLocaleString("ru-RU")} so'm`;

    document.getElementById("orderConfirmContent").innerHTML =
        message.replace(/\n/g, "<br>");

    document.getElementById("orderConfirmModal").classList.add("active");

    window.currentOrderMessage = message;
}
function buyMMRBoost() {
    const current = Number(currentMMR.value);
    const target = Number(targetMMR.value);

    if (!current || !target || current < 1000 || target < 1000) {
        alert("MMR 1 000 dan boshlanadi");
        return;
    }

    if (target <= current) {
        alert("Kerakli MMR joriy MMR dan yuqori bo‘lishi kerak");
        return;
    }

    const price =
        getMMRPrice(target) -
        getMMRPrice(current);

 

    const message =
        `📈 MMR Up\n` +
        `🎮 ${current.toLocaleString("ru-RU")} → ${target.toLocaleString("ru-RU")} MMR\n` +

        `💰 Narx: ${price.toLocaleString("ru-RU")} so'm`;

    document.getElementById("orderConfirmContent").innerHTML =
        message.replace(/\n/g, "<br>");

    document.getElementById("orderConfirmModal").classList.add("active");

    window.currentOrderMessage = message;
}
function buyWinrateBoost() {
    const current = Number(currentWinrate.value);
    const games = Number(gamesPlayed.value);
    const target = Number(targetWinrate.value);

    if (
        isNaN(current) ||
        isNaN(games) ||
        isNaN(target) ||
        games < 1 ||
        current < 0 ||
        current > 100 ||
        target < 0 ||
        target > 100
    ) {
        alert("Ma'lumotlarni to‘g‘ri kiriting");
        return;
    }

    if (target <= current) {
        alert("Kerakli Winrate joriy Winrate dan yuqori bo‘lishi kerak");
        return;
    }

    if (target >= 100 && current < 100) {
        alert("100% Winrate ga erishish mumkin emas");
        return;
    }

    const requiredWins =
        Math.ceil(
            ((target - current) * games) /
            (100 - target)
        );

    const totalPrice = requiredWins * 8000;

   

    const message =
        `🔥 Winrate Boost\n` +
        `📊 Joriy Winrate: ${current}%\n` +
        `🎮 O‘ynalgan o‘yinlar: ${games}\n` +
        `🎯 Kerakli Winrate: ${target}%\n` +
        `🏆 Kerakli g‘alabalar: ${requiredWins}\n` +
    
        `💰 Narx: ${totalPrice.toLocaleString("ru-RU")} so'm`;

    document.getElementById("orderConfirmContent").innerHTML =
        message.replace(/\n/g, "<br>");

    document.getElementById("orderConfirmModal").classList.add("active");

    window.currentOrderMessage = message;
}
function buySpecialBoost(stars) {
    const prices = {
        111: 450000,
        222: 1000000,
        333: 1666000,
        444: 2330000,
        555: 2999000,
        666: 3666000,
        777: 4333000,
        888: 4999000,
        999: 5666000,
        1111: 6999000
    };

    const price = prices[stars];

    if (!price) {
        alert("Bu xizmat mavjud emas");
        return;
    }

   

    const message =
        `🚀 Special Boost\n` +
        `⭐ Yulduzlar: ${stars}\n` +
        `💰 Narx: ${price.toLocaleString("ru-RU")} so'm`;

    document.getElementById("orderConfirmContent").innerHTML =
        message.replace(/\n/g, "<br>");

    document.getElementById("orderConfirmModal").classList.add("active");

    window.currentOrderMessage = message;
}
function openBoosterModal(booster) {
    const modal = document.getElementById("boosterModal");
    const avatar = document.getElementById("boosterModalAvatar");

    if (!modal) return;

    if (booster === "nyron") {
        if (avatar) {
            avatar.src = "assets/boosters/NYRON.png";
            avatar.alt = "NYRON";
        }
    }

    if (booster === "tess") {
        if (avatar) {
            avatar.src = "assets/boosters/tess.jpg";
            avatar.alt = "Tess";
        }
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeBoosterModal() {
    const modal = document.getElementById("boosterModal");

    if (!modal) return;

    modal.classList.remove("active");
    document.body.style.overflow = "";
}
/* =========================================
   ✨ SCROLL REVEAL
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(
        ".section-title, .service-card, .rank-calculator, .star-calculator, .mmr-calculator, .winrate-calculator, .special-card, .booster-card, .about-content, .contact-button"
    );

    revealElements.forEach((element) => {
        element.classList.add("scroll-reveal");
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
});

// ===============================
// POLICY MODALS
// ===============================

function openPolicy(type) {

    const modal = document.getElementById("policyModal");
    const content = document.getElementById("policyContent");

    if (!modal || !content) return;

    if (type === "privacy") {

        content.innerHTML = `
            <h2>🔐 Maxfiylik siyosati</h2>

            <p><strong>Oxirgi yangilanish: 2026-yil</strong></p>

            <h3>1. Ma'lumotlarni himoya qilish</h3>
            <p>
                Buyurtma berish vaqtida taqdim etilgan ma'lumotlar
                faqat buyurtmani bajarish va mijoz bilan bog'lanish
                maqsadida ishlatiladi.
            </p>

            <h3>2. Akkaunt xavfsizligi</h3>
            <p>
                NYRON BOOST mijoz akkauntini o'g'irlash,
                sotish yoki uchinchi shaxslarga berishni taqiqlaydi.
                Akkaunt ma'lumotlari faqat buyurtmani bajarish
                uchun ishlatiladi.
            </p>

            <h3>3. Maxfiy ma'lumotlar</h3>
            <p>
                Sayt orqali bank karta PIN-kodi, SMS-kod,
                Telegram kodi yoki boshqa maxfiy tasdiqlash
                kodlarini yubormang.
            </p>

            <h3>4. Uchinchi shaxslar</h3>
            <p>
                Mijozning shaxsiy va akkaunt ma'lumotlari
                qonuniy asos bo'lmagan holda uchinchi shaxslarga
                berilmaydi.
            </p>

            <h3>5. To'lov ma'lumotlari</h3>
            <p>
                To'lov karta ma'lumotlari NYRON BOOST tomonidan
                saqlanmaydi. To'lov tasdig'i Telegram orqali
                yuboriladi.
            </p>

            <h3>6. Aloqa</h3>
            <p>
                📲 Telegram: @nyronGG
            </p>
        `;

    } else if (type === "rules") {

        content.innerHTML = `
            <h2>📜 Foydalanish qoidalari</h2>

            <h3>1. Buyurtma berish</h3>
            <p>
                Mijoz kerakli xizmatni tanlaydi, buyurtma
                ma'lumotlarini tekshiradi va ko'rsatilgan
                summani to'laydi.
            </p>

            <h3>2. Xizmatlar</h3>
            <p>
                🏆 Rank Boost<br>
                ⭐ Star Boost<br>
                📈 MMR Up<br>
                🔥 Winrate Boost<br>
                💎 Universal / Special Boost
            </p>

            <h3>3. Akkaunt xavfsizligi</h3>
            <p>
                NYRON BOOST akkauntni o'g'irlamaydi, sotmaydi,
                boshqa shaxsga bermaydi va buyurtma maqsadidan
                tashqari foydalanmaydi.
            </p>

            <h3>4. To'lov</h3>
            <p>
                To'lovdan oldin xizmat turi, buyurtma ma'lumotlari
                va yakuniy narxni tekshiring.
                To'lov amalga oshirilgandan so'ng chekni
                Telegram orqali yuboring.
            </p>

            <h3>5. Bekor qilish va qaytarish</h3>
            <p>
                Buyurtma bajarilishi boshlanmagan bo'lsa,
                bekor qilish yoki mablag'ni qaytarish masalasi
                Telegram orqali individual ko'rib chiqiladi.
            </p>

            <h3>6. Mijoz huquqlari</h3>
            <p>
                Mijoz xizmat, narx va buyurtma shartlari haqida
                tushunarli ma'lumot olish huquqiga ega.
            </p>

            <h3>7. Nizolar</h3>
            <p>
                Kelishmovchiliklar birinchi navbatda muzokara
                orqali hal qilinadi. Zarur hollarda nizolar
                O'zbekiston Respublikasining amaldagi
                qonunchiligiga muvofiq ko'rib chiqiladi.
            </p>

            <h3>8. Aloqa</h3>
            <p>
                📲 Telegram: @nyronGG
            </p>
        `;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}


function closePolicy() {

    const modal = document.getElementById("policyModal");

    if (!modal) return;

    modal.classList.remove("active");
    document.body.style.overflow = "";
}


// Закрытие при клике вне окна
document.addEventListener("click", function(event) {

    const modal = document.getElementById("policyModal");

    if (event.target === modal) {
        closePolicy();
    }

});



function copyCard(cardId) {
    const card = document.getElementById(cardId);

    if (!card) return;

    const cardNumber = card.textContent.trim();

    navigator.clipboard.writeText(cardNumber).then(() => {

        const button = card.parentElement.querySelector("button");

        if (!button) return;

        const oldText = button.innerHTML;

        button.innerHTML = "✅ Nusxalandi!";

        setTimeout(() => {
            button.innerHTML = oldText;
        }, 1800);

    }).catch(() => {
        alert("Kartani nusxalashda xatolik yuz berdi.");
    });
}
