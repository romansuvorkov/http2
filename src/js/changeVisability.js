export default function changeVisability(inputEl, removedClass, targetClass) {
  inputEl.classList.remove(removedClass);
  inputEl.classList.add(targetClass);
}
