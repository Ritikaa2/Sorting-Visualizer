async function mergeSort(A, delayGetter) {
  const { setBarHeight, sleep, incComparison } = window.__helpers__;

  async function _merge(l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;

    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = A[l + i];
    for (let j = 0; j < n2; j++) R[j] = A[m + 1 + j];

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      incComparison();
      const delay = delayGetter();
      if (L[i] <= R[j]) {
        A[k] = L[i];
        await setBarHeight(k, A[k], delay, "swap");
        i++;
      } else {
        A[k] = R[j];
        await setBarHeight(k, A[k], delay, "swap");
        j++;
      }
      k++;
    }
    while (i < n1) {
      const delay = delayGetter();
      A[k] = L[i]; 
      await setBarHeight(k, A[k], delay, "swap");
      i++; k++;
    }
    while (j < n2) {
      const delay = delayGetter();
      A[k] = R[j]; 
      await setBarHeight(k, A[k], delay, "swap");
      j++; k++;
    }
  }

  async function _ms(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await _ms(l, m);
    await _ms(m + 1, r);
    await _merge(l, m, r);
  }

  await _ms(0, A.length - 1);
}