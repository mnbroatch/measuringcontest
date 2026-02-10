// recurse and replace. circular references not allowed
export default function transformJSON(data, rules) {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    for (const rule of rules) {
      if (rule.test(value)) {
        return rule.replace(value);
      }
    }
    return value;
  });
}
