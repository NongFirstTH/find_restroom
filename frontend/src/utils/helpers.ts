export const formatTime = (t?: string) => {
  if (!t) return "—";
  
  const [h, m] = t.split(":");
  const hour = parseInt(h);

  return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};
