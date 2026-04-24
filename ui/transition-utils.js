export function getTransitionDurationMs(element) {
  const styles = window.getComputedStyle(element);
  const durations = styles.transitionDuration.split(",").map(parseTimeToMs);
  const delays = styles.transitionDelay.split(",").map(parseTimeToMs);
  const count = Math.max(durations.length, delays.length);

  let total = 0;
  for (let index = 0; index < count; index += 1) {
    const duration = durations[index] ?? durations[durations.length - 1] ?? 0;
    const delay = delays[index] ?? delays[delays.length - 1] ?? 0;
    total = Math.max(total, duration + delay);
  }

  return total;
}

function parseTimeToMs(value) {
  const text = value.trim();
  if (text.endsWith("ms")) {
    return Number.parseFloat(text) || 0;
  }
  if (text.endsWith("s")) {
    return (Number.parseFloat(text) || 0) * 1000;
  }
  return Number.parseFloat(text) || 0;
}
