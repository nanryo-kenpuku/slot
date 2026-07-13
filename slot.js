let drinkAllItems = [];
let jellyAllItems = [];
let allItems = [];
let soundOff = [];
let retrySpan = [];
let ooatari = [];
let ooatariPercent = [];
let omake = [];
let omakePercent = [];
let isSpinning = false;
let slotInterval;
let audioCtx;

const jellyColors = [
    "#F8BBD0",
    "#F48FB1",
    "#F06292",
    "#EC407A",
    "#CE93D8",
    "#E1BEE7",
    "#FFCDD2",
    "#FCE4EC",
    "#FF80AB",
    "#F3E5F5"
];
const drinkColors = [
    "#E3F2FD",
    "#BBDEFB",
    "#90CAF9",
    "#64B5F6",
    "#81D4FA",
    "#80DEEA",
    "#B2EBF2",
    "#B2DFDB",
    "#C8E6C9",
    "#DCEDC8"
];
const randomColors = [
    "#FFCDD2", // ピンク
    "#F8BBD0", // ベビーピンク
    "#F48FB1", // ローズ
    "#FFE082", // ライトイエロー
    "#FFF59D", // パステルイエロー
    "#C5E1A5", // ライトグリーン
    "#A5D6A7", // ミント
    "#B2DFDB", // エメラルド
    "#80DEEA", // アクア
    "#81D4FA", // スカイブルー
    "#90CAF9", // ライトブルー
    "#BBDEFB", // アイスブルー
    "#B39DDB", // ラベンダー
    "#D1C4E9", // パープル
    "#FFCCBC", // ピーチ
    "#FFE0B2", // オレンジ
    "#F5F5F5", // ホワイト
    "#E0F7FA"  // シアンホワイト
];
$(function () {
    //チケット選択画面
    document.getElementById('ticket-overlay').style.display = 'flex';
    blockButton('init');

});

function toggleSlot() {
    const mainBtn = document.getElementById('main-btn');
    const slotDisplay = document.getElementById('slot-display');
    // 追加：ボタンが「もう一回チャレンジ」状態ならチケット画面へ戻す
    if (mainBtn.textContent === "もう一回チャレンジ") {
        // チケット選択画面
        document.getElementById('ticket-overlay').style.display = 'flex';
        //ボタン制御
        blockButton('init');
        return;
    }

    if (!isSpinning) {
        isSpinning = true;
        //タップ音
        playSound('tick');

        //ボタン制御
        blockButton('start');

        slotInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * allItems.length);
            const item = allItems[randomIndex];
            const display = document.getElementById('slot-display');

            // 表示内容を反映
            display.innerHTML = item;

            if (item.length > 10) {
                display.style.fontSize = "20px"; // 長い場合
            } else if (item.length > 6) {
                display.style.fontSize = "25px"; // 普通の場合
            } else {
                display.style.fontSize = "35px"; // 短い場合
            }
            //ルーレット音
            playSound('');

        }, 80);//文字の変わるスピード

    } else {
        clearInterval(slotInterval);
        isSpinning = false;
        //ボタン制御
        blockButton('stop');

        //あたり画面に商品名を出す
        copySlotStyle();

        if ((ooatari == true && Math.random() < (ooatariPercent / 100))) {
            // 大当たりの場合、
            overlay.className = 'overlay-ooatari'; // 背景キラキラ
            document.getElementById('hit-btn').textContent = "大当たり！！";
            overlay.style.display = 'flex';

            //設定画面で数値が見られるように
            incrementCounter("ooatari");

        } else if ((omake == true && Math.random() < (omakePercent / 100))) {
            // おまけの場合、
            overlay.className = 'overlay-omake'; // 背景グレー
            document.getElementById('hit-btn').textContent = "おまけがもらえるよ";
            overlay.style.display = 'flex';
            //設定画面で数値が見られるように
            incrementCounter("omake");
        }

        confetti({
            particleCount: 100, // 粒子を増やす
            spread: 100,        // 広がりを大きく
            origin: { y: 0.6 }
        });
        confetti({
            particleCount: 100,
            angle: 60,
            scalar: 1.2,        // 紙吹雪の大きさ
            spread: 55,
            origin: { x: 0, y: 0.6 } // 左下から
        });
        confetti({
            particleCount: 100,
            angle: 120,
            scalar: 1.2,        // 紙吹雪の大きさ
            spread: 55,
            origin: { x: 1, y: 0.6 } // 右下から
        });
        confetti({
            particleCount: 200,
            scalar: 1.2,        // 紙吹雪の大きさ
            spread: 100,        // 広がりを大きく
            shapes: ['square', 'circle', 'star', 'heart'], // これらをランダムに混ぜる
            colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
        });
    }
}


function playSound(type) {
    if (soundOff == true) {
        return;
    }
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    if (type === 'tick') {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523, audioCtx.currentTime);
        //osc.frequency.setValueAtTime(400 + (Math.random() * 400), audioCtx.currentTime);//リズム変化
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    }
}

function closeButton() {
    //ボタン制御
    blockButton(); // ボタンを非活性化する関数へ
    overlay.style.display = 'none';
};

function selectCategory(type) {
    const body = document.body; // body要素を取得
    const container = document.querySelector('.container'); // containerを取得


    const slotTitle = document.getElementById('slot-title');
    const slotDisplay = document.getElementById('slot-display');
    const mainBtn = document.getElementById('main-btn');

    if (type === 'jelly') {
        allItems = jellyAllItems;

        slotTitle.textContent = "ゼリー・スロット";
        slotTitle.style.color = "#d81b60"; // 濃いピンク
        slotDisplay.style.borderColor = "#ff80ab"; // 鮮やかなピンクの枠
        slotDisplay.style.color = "#d81b60";
        slotDisplay.style.background = "#fff0f5";

        mainBtn.style.backgroundColor = "#ff4081";
        mainBtn.style.boxShadow = "0 8px #880e4f";

        //body.style.background = "linear-gradient(135deg, #fce4ec, #f8bbd0)";
        body.style.background = randomGradient(jellyColors);
        container.style.borderColor = "#ff80ab"; // 鮮やかなピンクの縁
        //container.style.borderColor =  jellyColors[Math.floor(Math.random() * jellyColors.length)];

    } else if (type === 'drink') {
        allItems = drinkAllItems;
        slotTitle.textContent = "ドリンク・スロット";
        slotTitle.style.color = "#0d47a1"; // 濃いブルー
        slotDisplay.style.borderColor = "#64b5f6"; // 鮮やかなブルーの枠
        slotDisplay.style.color = "#0d47a1";
        slotDisplay.style.background = "#e3f2fd";

        mainBtn.style.backgroundColor = "#2196f3";
        mainBtn.style.boxShadow = "0 8px #0d47a1";

        //body.style.background = "linear-gradient(135deg, #e3f2fd, #bbdefb)"; // ブルー系
        body.style.background = randomGradient(drinkColors);
        container.style.borderColor = "#64b5f6"; // 鮮やかなブルーの縁
    } else {
        // 'all' の場合

        allItems = [...drinkAllItems, ...jellyAllItems];
        for (let i = allItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
        }

        slotTitle.textContent = "ランダム・スロット";
        slotTitle.style.color = "#f57c00"; // 元のオレンジ
        slotDisplay.style.borderColor = "#ffb74d"; // 元のオレンジの枠
        slotDisplay.style.color = "#e65100";
        slotDisplay.style.background = "#fff3e0";
        // ボタンの配色（元のオレンジ系）
        mainBtn.style.backgroundColor = "#ff9800";
        mainBtn.style.boxShadow = "0 8px #d84315";

        //body.style.background = "linear-gradient(135deg, #fff9c4, #b3e5fc)"; // 元の黄色・水色
        body.style.background = randomGradient(randomColors);
        container.style.borderColor = "#ffeb3b"; // 黄色い縁
    }

    if (allItems.length === 0) {
        alert("売り切れです。ごめんなさい！！");
        return;
    } else {
        const slotDisplay = document.getElementById('slot-display');
        slotDisplay.textContent = "READY?";
        document.getElementById('select-overlay').style.display = 'none';
    }
}
function selectTicket() {
    document.getElementById('ticket-overlay').style.display = 'none';
    document.getElementById('select-overlay').style.display = 'flex';

}

function blockButton(type) {
    const mainBtn = document.getElementById('main-btn');
    const endTime = localStorage.getItem('blockEndTime');
    const now = Date.now();

    if (type === 'init') {
        //データ取得
        fetchLatestConfig();

        if (endTime && now < endTime) {
            // まだ経過していない場合
            mainBtn.disabled = true;
            mainBtn.textContent = "またチャレンジしてね";
            // 残り時間後に再度チェックして有効化する
            setTimeout(blockButton, endTime - now);

        } else {
            mainBtn.disabled = false;
            mainBtn.classList.remove("stop-jelly", "stop-drink", "stop-random");
            mainBtn.textContent = "スタート！";
        }

    } else if (type === 'start') {
        mainBtn.textContent = "ストップ！";
        //もう一回の間隔（ミリ秒　×　指定時間）
        const endTime = Date.now() + (1000 * retrySpan);
        localStorage.setItem('blockEndTime', endTime);

        // 現在のカテゴリーに合わせてクラスを付与
        const currentTitle = document.getElementById('slot-title').textContent;
        if (currentTitle.includes("ゼリー")) {
            mainBtn.classList.add("stop-jelly");
        } else if (currentTitle.includes("ドリンク")) {
            mainBtn.classList.add("stop-drink");
        } else {
            mainBtn.classList.add("stop-random");
        }

    } else if (type === 'stop') {
        mainBtn.disabled = true;
        mainBtn.textContent = "またチャレンジしてね";
        //もう一回の間隔（ミリ秒　×　指定時間）
        const endTime = Date.now() + (1000 * retrySpan);
        localStorage.setItem('blockEndTime', endTime);
        setTimeout(blockButton, endTime - now);
    } else {

        if (endTime && now < endTime) {
            // まだ経過していない場合
            mainBtn.disabled = true;
            mainBtn.textContent = "またチャレンジしてね";
            // 残り時間後に再度チェックして有効化する
            setTimeout(blockButton, endTime - now);
        } else {
            // 経過している場合
            localStorage.removeItem('blockEndTime'); // 不要になったので削除
            mainBtn.classList.remove("stop-jelly", "stop-drink", "stop-random");

            mainBtn.disabled = false;
            mainBtn.textContent = "もう一回チャレンジ";
        }
    }
}
// スライダーの初期化をDOM構築完了後に実行する
window.addEventListener('DOMContentLoaded', (event) => {
    const knob = document.getElementById('slider-knob');
    const track = document.getElementById('slider-track');

    // 要素が存在する場合のみ処理を行うようにチェックを入れる
    if (!knob || !track) return;

    let isDragging = false;

    // 共通の移動処理関数
    function handleMove(clientX) {
        if (!isDragging) return;
        const trackRect = track.getBoundingClientRect();
        let newLeft = clientX - trackRect.left - 30;

        if (newLeft < 0) newLeft = 0;
        if (newLeft > trackRect.width - 60) {

            playSound('tick');//音を鳴らす
            newLeft = trackRect.width - 60;
            selectTicket();
            isDragging = false;
            knob.style.left = '0px';
            return;
        }
        knob.style.left = newLeft + 'px';
    }

    // イベントリスナーの登録
    //knob.addEventListener('mousedown', () => isDragging = true);
    knob.addEventListener('mousedown', (e) => {
        isDragging = true;
        // バイブレーション（対応端末のみ）[cite: 1]
        if (navigator.vibrate) navigator.vibrate(50);
    });

    document.addEventListener('mousemove', (e) => handleMove(e.clientX));
    document.addEventListener('mouseup', () => { isDragging = false; knob.style.left = '0px'; });

    //knob.addEventListener('touchstart', (e) => { isDragging = true; });
    // タッチ開始時の処理にも同様に追加します
    knob.addEventListener('touchstart', (e) => {
        isDragging = true;
        // バイブレーション（対応端末のみ）[cite: 1]
        if (navigator.vibrate) navigator.vibrate(50);
    });


    document.addEventListener('touchmove', (e) => {
        handleMove(e.touches[0].clientX);
        e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', () => { isDragging = false; knob.style.left = '0px'; });
});
// スライダーを動かし始めたとき（mousedown/touchstart）
function triggerVibration() {
    if (navigator.vibrate) {
        navigator.vibrate(50); // 50ミリ秒だけ振動させる
    }
}
// 最新のconfigを取得する関数
function fetchLatestConfig() {

    $("#loading").css("display", "flex");

    $.getJSON(
        "https://slot-nanryo-default-rtdb.firebaseio.com/config.json",
        function (config) {

            drinkAllItems = (config.drinkEnabledItems || []).filter(item => item && item.length > 0);
            jellyAllItems = (config.jellyEnabledItems || []).filter(item => item && item.length > 0);

            // 1. 両方の配列を結合して allItems を作成
            allItems = [...drinkAllItems, ...jellyAllItems];
            // 2. allItems をランダムにシャッフルする（Fisher-Yatesシャッフル）
            for (let i = allItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
            }
            soundOff = config.soundOff;
            retrySpan = config.retrySpan;
            ooatari = config.ooatari;
            ooatariPercent = config.ooatariPercent;
            omake = config.omake;
            omakePercent = config.omakePercent;

        }
    ).always(function () {
        $("#loading").hide();
    });
}
function getToday() {
    const now = new Date();
    return now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");
}
//カウントアップ関数
function incrementCounter(type) {

    const today = getToday();
    const url = "https://slot-nanryo-default-rtdb.firebaseio.com/counter/" +
        today + "/" + type + ".json";
    $.get(url, function (count) {

        if (count == null) {
            count = 0;
        }
        $.ajax({
            url: url,
            type: "PUT",
            data: JSON.stringify(count + 1)
        });
    });

}
// ランダムな2色グラデーションを作成
function randomGradient(colors) {
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    let color2;
    do {
        color2 = colors[Math.floor(Math.random() * colors.length)];
    } while (color1 === color2);
    const angle = Math.floor(Math.random() * 360);
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}
function copySlotStyle() {
    const original = document.getElementById('slot-display');
    const target = document.getElementById('result-display');
    const computedStyle = window.getComputedStyle(original);

    // 1. 文字（中身）をコピー
    target.innerText = original.innerText;

    // 2. スタイルをすべてコピー
    target.style.backgroundColor = computedStyle.backgroundColor;
    target.style.color = computedStyle.color;
    target.style.borderColor = computedStyle.borderColor;
    target.style.boxShadow = computedStyle.boxShadow;
    
    // 【追加】フォントサイズもコピー
    target.style.fontSize = computedStyle.fontSize;
    
    // 必要に応じて高さや余白も合わせる場合
    target.style.height = computedStyle.height;
}
