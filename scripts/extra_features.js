// Theme toggle + descriptions
(function() {
  const btn = document.getElementById("theme_toggle");
  const desc = document.getElementById("algo_description");
  const select = document.getElementById("algo_select");

  const descriptions = {
    bubble: "Adjacent elements compare & swap; repeated passes push largest to end. Simple but slow.",
    selection: "Find minimum and place at correct index each pass. Fewer swaps, still O(n^2).",
    insertion: "Build sorted prefix by inserting current element into its right place. Fast on nearly-sorted data.",
    merge: "Divide & conquer; merge sorted halves. Stable, O(n log n), needs extra space.",
    quick: "Partition around pivot and recurse. Average O(n log n), in-place, fast in practice.",
    heap: "Build max-heap, repeatedly extract max to end. In-place O(n log n)."
  };

  function updateDescription() {
    const key = select.value;
    desc.textContent = descriptions[key] || "Select an algorithm to see details.";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const light = document.body.classList.contains("light-mode");
    btn.textContent = light ? "🌚 Light Mode" : "🌙 Dark Mode";
  });

  select.addEventListener("change", updateDescription);
  updateDescription();
})();