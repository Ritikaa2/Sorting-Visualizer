async function heapSort(A, delayGetter) {
  const { visualizeSwap, sleep, incComparison } = window.__helpers__;

  async function heapify(n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      incComparison();
      await sleep(delayGetter()/2);
      if (A[l] > A[largest]) largest = l;
    }
    if (r < n) {
      incComparison();
      await sleep(delayGetter()/2);
      if (A[r] > A[largest]) largest = r;
    }
    if (largest !== i) {
      await visualizeSwap(i, largest, delayGetter());
      await heapify(n, largest);
    }
  }

  const n = A.length;
  for (let i = Math.floor(n/2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    await visualizeSwap(0, i, delayGetter());
    await heapify(i, 0);
  }
}