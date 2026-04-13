async function bubbleSort(A, delayGetter) {
  const { visualizeCompare, visualizeSwap, sleep, getBars } = window.__helpers__;
  const n = A.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      const delay = delayGetter();
      await visualizeCompare(j, j+1, delay);
      if (A[j] > A[j+1]) {
        await visualizeSwap(j, j+1, delay);
        swapped = true;
      }
    }
    // mark last element of this pass as sorted
    const bars = getBars();
    if (bars[n - 1 - i]) bars[n - 1 - i].classList.add("sorted");
    if (!swapped) break;
  }
}