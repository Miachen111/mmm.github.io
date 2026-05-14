// 遊戲數據設定
//https://data.worldbank.org/indicator/NE.CON.PRVT.PC.KD

// 定義資料表：第一層是洲，第二層是該洲的國家跟那洲的消費水準
// 以2015為基準年 以數據庫有的最近年 美金匯率以32.0計算 excel表
const geoData = {
    "亞洲": [
        { name: "Bangladesh", budget: 116 },
        { name: "China", budget: 470 },
        { name: "India", budget: 125 },
        { name: "Japan", budget: 1713 },
        { name: "Saudi Arabia", budget: 1040 },
        { name: "Taiwan", budget: 2660 },
        { name: "Yemen, Rep.", budget: 109 }
    ],
    "歐洲": [
        { name: "Germany", budget: 1977 },
        { name: "United Kingdom", budget: 2566 },
        { name: "Greece", budget: 1272 },
        { name: "Norway", budget: 2937 },
        { name: "Ukraine", budget: 182 },
    ],
    "美洲": [
        { name: "Bolivia", budget: 192 },
        { name: "Brazil", budget: 545 },
        { name: "Haiti", budget: 111 },
        { name: "Mexico", budget: 655 },
        { name: "United States", budget: 3854 }
    ],
    "大洋洲": [
        { name: "Australia", budget: 2961 },
        { name: "New Zealand", budget: 2294 },
        { name: "Solomon Islands", budget: 127 }
    ],
    "非洲": [
        { name: "Burundi", budget: 17 },
        { name: "Central African Republic", budget: 40 },
        { name: "Congo, Dem. Rep.", budget: 27 },
        { name: "Madagascar", budget: 29 },
        { name: "Mozambique", budget: 39 },
        { name: "Somalia, Fed. Rep.", budget: 55 }
    ]
};

// 消費題目清單
const expenseQuestions = [
    { q: "早安，早餐吃什麼？",
         opts: [
            { t: "奢華全套早午餐", c: 700 }, 
            { t: "星巴克松露嫩蛋三明治配大杯那堤", c: 220 },
            { t: "早餐店蘿蔔糕加蛋配豆漿", c: 70 },
            { t: "超商肉鬆飯糰", c:25},
            { t: "茶葉蛋", c:10},
            { t: "不吃", c:0}
        ] 
    },
    { q: "去上班，交通方式?", 
        opts: [
            { t: "Uber", c: 300 },
            { t: "捷運", c: 40 },
            { t: "公車", c:25},
            { t: "走路", c:0}
        ] 
    },
    { q: "中午了，午餐吃什麼？", 
        opts: [
            { t: "無菜單料理", c: 2000 },
            { t: "鼎泰豐", c: 800 },
            { t: "拉麵", c:300 },
            { t: "雞腿便當", c:90 },
            { t: "滷肉飯", c:50},
            { t: "不吃", c:0}
        ] 
    },
    { q: "下午茶時間到", 
        opts: [
            { t: "千層蛋糕配咖啡", c: 500 }, 
            { t: "手搖飲", c: 65 },
            { t: "不吃", c:0}
        ] 
    },
    { q: "下班逛街，買衣服嗎？", 
        opts: [
            { t: "買", c: 1000 }, 
            { t: "不買", c: 0 }
        ] 
    },
    { q: "晚餐吃什麼？", 
        opts: [
            { t: "無菜單料理", c: 2000 },
            { t: "鼎泰豐", c: 800 },
            { t: "拉麵", c:300 },
            { t: "雞腿便當", c:90 },
            { t: "滷肉飯", c:50},
            { t: "不吃", c:0}
        ] 
    },
    { q: "怎麼回家?", 
        opts: [
            { t: "Uber", c: 300 },
            { t: "捷運", c: 40 },
            { t: "公車", c:25},
            { t: "走路", c:0}
        ] 
    },    
    { q: "住哪？", 
        opts: [
            { t: "豪華大別墅", c: 4500 },
            { t: "普通公寓", c: 900 },
            { t: "合租套房", c: 500 },
            { t: "破舊雅房", c: 300 },
            { t: "睡路邊", c:0 }
        ] 
    }
];

let balance = 0;
let currentStep = 0; // 控制目前在哪一關
let selectedContinent = "";

const questionText = document.getElementById('question-text');
const optionsBox = document.getElementById('options-container');
const balanceDisplay = document.getElementById('balance');

function startLevel() {
    optionsBox.innerHTML = ''; // 清空舊按鈕

    // --- 第一關：選五大洲 ---
    if (currentStep === 0) {
        questionText.innerText = "請選擇你出生的洲：";
        // 直接從 geoData 抓出所有的「鍵 (Key)」：亞洲, 歐洲...
        Object.keys(geoData).forEach(continent => {
            makeButton(continent, () => {
                selectedContinent = continent; // 儲存選擇
                currentStep = 1;
                startLevel();
            });
        });
    } 
    // --- 第二關：根據剛才選的洲，顯示對應國家 ---
    else if (currentStep === 1) {
        questionText.innerText = `在 ${selectedContinent}，你出生的國家？`;
        // 這裡完全不用 if，直接用選好的 continent 去抓 array
        geoData[selectedContinent].forEach(country => {
            makeButton(country.name, () => {
                balance = country.budget; // 設定初始金額
                updateUI();
                currentStep = 2; // 進入消費題目
                startLevel();
            });
        });
    }
    // --- 第三關以後：消費題目 ---
    else {
        const quizIdx = currentStep - 2;
        if (quizIdx < expenseQuestions.length) {
            const currentQ = expenseQuestions[quizIdx];
            questionText.innerText = currentQ.q;
            currentQ.opts.forEach(opt => {
                makeButton(opt.t, () => {
                    balance -= opt.c;
                    updateUI();
                    currentStep++;
                    startLevel();
                });
            });
        } else {
            finishGame();
        }
    }
}

function makeButton(text, clickEvent) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.onclick = clickEvent;
    optionsBox.appendChild(btn);
}

function updateUI() {
    balanceDisplay.innerText = balance.toLocaleString();
}

function finishGame() {
    questionText.innerText = "測驗結束！";
    optionsBox.innerHTML = `<h3>你的今日餘額為：${balance}</h3><button onclick="location.reload()">重新玩</button>`;
}

// 啟動遊戲
startLevel();