async function quickSort(A, delayGetter) {
  const { visualizeCompare, visualizeSwap, sleep, incComparison } = window.__helpers__;

  async function partition(low, high) {
    const pivot = A[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      const delay = delayGetter();
      incComparison();
      await sleep(delay / 2);
      if (A[j] <= pivot) {
        i++;
        await visualizeSwap(i, j, delay);
      }
    }
    await visualizeSwap(i + 1, high, delayGetter());
    return i + 1;
  }

  async function _qs(low, high) {
    if (low < high) {
      const pi = await partition(low, high);
      await _qs(low, pi - 1);
      await _qs(pi + 1, high);
    }
  }
  await _qs(0, A.length - 1);
}