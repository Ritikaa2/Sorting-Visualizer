async function insertionSort(A, delayGetter) {
  const { visualizeCompare, setBarHeight, sleep, incSwap } = window.__helpers__;
  const n = A.length;
  for (let i = 1; i < n; i++) {
    let key = A[i];
    let j = i - 1;
    const delay = delayGetter();
    while (j >= 0) {
      await visualizeCompare(j, j+1, delay);
      if (A[j] > key) {
        A[j+1] = A[j];
        await setBarHeight(j+1, A[j+1], delay, "swap");
        incSwap();
        j--;
      } else {
        break;
      }
    }
    A[j+1] = key;
    await setBarHeight(j+1, key, delay, "swap");
  }
}