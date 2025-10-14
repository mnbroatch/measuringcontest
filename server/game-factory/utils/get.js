export default function get (obj, pathArray) {
  let current = obj;
  
  for (const step of pathArray) {
    if (step?.flatten) {
      current = current.flat();
      if (step.map) {
        current = current.map(item => get(item, step.map));
      }
    } else {
      current = current[step];
    }
  }
  
  return current;
}
