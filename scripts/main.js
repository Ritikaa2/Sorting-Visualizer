// ====== GLOBAL STATE ======
let ARR = [];
let comparisons = 0;
let swaps = 0;

const container = document.getElementById("array_container");
const sizeSlider = document.getElementById("a_size");
const speedSlider = document.getElementById("a_speed");
const arrayType = document.getElementById("array_type");
const generateBtn = document.getElementById("a_generate");
const startBtn = document.getElementById("start_sort");
const algoSelect = document.getElementById("algo_select");

const compSpan = document.getElementById("comparison_count");
const swapSpan = document.getElementById("swap_count");

const timeWorst = document.getElementById("Time_Worst");
const timeAvg = document.getElementById("Time_Average");
const timeBest = document.getElementById("Time_Best");
const spaceWorst = document.getElementById("Space_Worst");

// delay map: 1(slowest)..5(fastest)
function currentDelay() {
  const v = Number(speedSlider.value);
  const map = {1: 200, 2: 120, 3: 60, 4: 25, 5: 5};
  return map[v] || 60;
}

function getBars() {
  return container.querySelectorAll(".bar");
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  compSpan.textContent = "0";
  swapSpan.textContent = "0";
}

function incComparison(n = 1) {
  comparisons += n;
  compSpan.textContent = String(comparisons);
}

function incSwap(n = 1) {
  swaps += n;
  swapSpan.textContent = String(swaps);
}

function setComplexities(algo) {
  const data = {
    bubble:  {best: "Ω(n)", avg: "Θ(n²)", worst: "O(n²)", space: "O(1)"},
    selection:{best: "Ω(n²)", avg: "Θ(n²)", worst: "O(n²)", space: "O(1)"},
    insertion:{best: "Ω(n)", avg: "Θ(n²)", worst: "O(n²)", space: "O(1)"},
    merge:   {best: "Ω(n log n)", avg: "Θ(n log n)", worst: "O(n log n)", space: "O(n)"},
    quick:   {best: "Ω(n log n)", avg: "Θ(n log n)", worst: "O(n²)", space: "O(log n)"},
    heap:    {best: "Ω(n log n)", avg: "Θ(n log n)", worst: "O(n log n)", space: "O(1)"}
  };
  const c = data[algo];
  if (!c) return;
  timeBest.textContent = c.best;
  timeAvg.textContent = c.avg;
  timeWorst.textContent = c.worst;
  spaceWorst.textContent = c.space;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate array based on type
function generateArray() {
  const n = Number(sizeSlider.value);
  const type = arrayType.value;
  ARR = new Array(n);
  const min = 10, max = 500;

  if (type === "random") {
    for (let i=0;i<n;i++) ARR[i] = randomInt(min, max);
  } else if (type === "sorted") {
    const step = Math.max(1, Math.floor((max-min)/n));
    for (let i=0;i<n;i++) ARR[i] = min + i*step;
  } else if (type === "reverse") {
    const step = Math.max(1, Math.floor((max-min)/n));
    for (let i=0;i<n;i++) ARR[i] = max - i*step;
  } else if (type === "almost_sorted") {
    const step = Math.max(1, Math.floor((max-min)/n));
    for (let i=0;i<n;i++) ARR[i] = min + i*step;
    // do a few random swaps
    for (let k=0;k<Math.max(3, Math.floor(n*0.05)); k++) {
      const i = randomInt(0, n-1);
      const j = randomInt(0, n-1);
      [ARR[i], ARR[j]] = [ARR[j], ARR[i]];
    }
  }
  drawBars();
  resetStats();
  clearHighlights();
}

function clearHighlights() {
  getBars().forEach(b => b.classList.remove("compare","swap","sorted"));
}

function drawBars() {
  container.innerHTML = "";
  const n = ARR.length;
  const widthPercent = (100 / n);
  for (let i=0;i<n;i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${ARR[i]}px`;
    bar.style.width = `calc(${widthPercent}% - 2px)`; // minus margins
    container.appendChild(bar);
  }
}

function disableUI(disabled) {
  sizeSlider.disabled = disabled;
  speedSlider.disabled = disabled;
  arrayType.disabled = disabled;
  generateBtn.disabled = disabled;
  algoSelect.disabled = disabled;
  startBtn.disabled = disabled;
}

function markSortedUpTo(k) {
  const bars = getBars();
  for (let i = bars.length - 1; i >= bars.length - 1 - k && i >= 0; i--) {
    bars[i].classList.add("sorted");
  }
}

function markAllSorted() {
  getBars().forEach(b => {
    b.classList.remove("compare","swap");
    b.classList.add("sorted");
  });
}

// ====== EVENTS ======
generateBtn.addEventListener("click", generateArray);
sizeSlider.addEventListener("input", generateArray);
arrayType.addEventListener("change", generateArray);
algoSelect.addEventListener("change", () => setComplexities(algoSelect.value));

startBtn.addEventListener("click", async () => {
  disableUI(true);
  resetStats();
  clearHighlights();
  setComplexities(algoSelect.value);

  const algo = algoSelect.value;
  const delayGetter = () => currentDelay();

  try {
    if (algo === "bubble") await bubbleSort(ARR, delayGetter);
    else if (algo === "selection") await selectionSort(ARR, delayGetter);
    else if (algo === "insertion") await insertionSort(ARR, delayGetter);
    else if (algo === "merge") await mergeSort(ARR, delayGetter);
    else if (algo === "quick") await quickSort(ARR, delayGetter);
    else if (algo === "heap") await heapSort(ARR, delayGetter);
  } catch (e) {
    console.error(e);
  } finally {
    markAllSorted();
    disableUI(false);
  }
});

// Initial setup
setComplexities(algoSelect.value);
generateArray();

// ====== SHARED HELPERS (used by algorithms) ======
async function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function visualizeCompare(i, j, delay) {
  const bars = getBars();
  bars[i].classList.add("compare");
  bars[j].classList.add("compare");
  incComparison();
  await sleep(delay);
  bars[i].classList.remove("compare");
  bars[j].classList.remove("compare");
}

async function visualizeSwap(i, j, delay) {
  const bars = getBars();
  bars[i].classList.add("swap");
  bars[j].classList.add("swap");

  // swap heights in DOM
  const hi = bars[i].style.height;
  const hj = bars[j].style.height;
  bars[i].style.height = hj;
  bars[j].style.height = hi;
  // swap in ARR
  [ARR[i], ARR[j]] = [ARR[j], ARR[i]];

  incSwap();
  await sleep(delay);
  bars[i].classList.remove("swap");
  bars[j].classList.remove("swap");
}

async function setBarHeight(i, h, delay, classname = "") {
  const bars = getBars();
  if (classname) bars[i].classList.add(classname);
  bars[i].style.height = `${h}px`;
  await sleep(delay);
  if (classname) bars[i].classList.remove(classname);
}

// expose helpers globally for algorithms
window.__helpers__ = {
  sleep, visualizeCompare, visualizeSwap, setBarHeight, getBars,
  incComparison, incSwap, currentDelay
};
