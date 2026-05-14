// 遊戲數據設定
const quizData = [
    {
        question: "第一站：選擇你的出生國家（這將決定你的初始預算）",
        options: [
            { text: "奈及利亞 (預算: 10 USD)", value: 10, type: "init" },
            { text: "美國 (預算: 200 美金)", value: 200, type: "init" },
            { text: "蘇丹 (預算: 50 台幣)", value: 50, type: "init" }
        ]
    },
    {
        question: "早餐想吃什麼？",
        options: [
            { text: "水煮蛋", cost: 0.1 }, // 以總預算比例或固定數值
            { text: "精緻早午餐", cost: 0.7 },
            { text: "不吃", cost: 0 }
        ]
    },
    {
        question: "看到一件超好看的衣服，買嗎？",
        options: [
            { text: "買", cost: 0.3 },
            { text: "不買", cost: 0 }
        ]
    },
    {
        question: "晚餐的安排？",
        options: [
            { text: "馬鈴薯2顆", cost: 0.15 },
            { text: "米其林餐廳", cost: 0.5 },
            { text: "便當", cost: 0.05 }
        ]
    }
];

let currentQuestionIndex = 0;
let balance = 0;

const questionEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const balanceEl = document.getElementById('balance');
const resultCard = document.getElementById('result-card');
const quizCard = document.getElementById('quiz-card');

function loadQuestion() {
    const currentQuiz = quizData[currentQuestionIndex];
    questionEl.innerText = currentQuiz.question;
    optionsContainer.innerHTML = '';

    currentQuiz.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option.text;
        btn.onclick = () => handleSelect(option);
        optionsContainer.appendChild(btn);
    });
}

function handleSelect(option) {
    if (option.type === "init") {
        balance = option.value;
    } else {
        // 這裡示範扣除固定比例，你也可以改成固定金額
        const logicCost = Math.round(balance * option.cost);
        balance -= logicCost;
    }

    updateBalanceDisplay();
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function updateBalanceDisplay() {
    balanceEl.innerText = balance.toLocaleString();
    if (balance < 0) {
        document.getElementById('balance-container').style.background = "#e74c3c";
    }
}

function showResult() {
    quizCard.classList.add('hidden');
    resultCard.classList.remove('hidden');
    const status = balance >= 0 ? 
        `挑戰成功！剩下 ${balance} 元，` : 
        `破產啦！欠了 ${Math.abs(balance)} 元，`;
    document.getElementById('final-status').innerText = status;
}

// 初始化啟動
loadQuestion();