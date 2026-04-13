async function selectionSort(A, delayGetter) {
  const { visualizeCompare, visualizeSwap, getBars, sleep } = window.__helpers__;
  const n = A.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      const delay = delayGetter();
      await visualizeCompare(minIdx, j, delay);
      if (A[j] < A[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const delay = delayGetter();
      await visualizeSwap(i, minIdx, delay);
    }
    const bars = getBars();
    if (bars[i]) bars[i].classList.add("sorted");
  }
}