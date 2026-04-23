export function renderIntoTargets(targets, className, buildNodes) {
  targets.forEach((target) => {
    if (!target) {
      return;
    }

    target.className = className;
    target.innerHTML = "";

    buildNodes().forEach((node) => {
      target.appendChild(node);
    });
  });
}
