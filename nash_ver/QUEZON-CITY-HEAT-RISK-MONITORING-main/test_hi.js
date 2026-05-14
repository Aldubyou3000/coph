function calcHeatIndex(temp, humidity) {
  if (temp < 27) return temp;
  if (humidity < 40) return temp;
  const T = temp, R = humidity;
  const hi =
    -8.78469475556 +
     1.61139411    * T +
     2.33854883889 * R +
    -0.14611605    * T * R +
    -0.012308094   * T * T +
    -0.0164248277778 * R * R +
     0.002211732   * T * T * R +
     0.00072546    * T * R * R +
    -0.000003582   * T * T * R * R;
  return Math.min(70, Math.max(temp, hi));
}

console.log("30C, 50% RH:", calcHeatIndex(30, 50));
console.log("35C, 70% RH:", calcHeatIndex(35, 70));
console.log("40C, 75% RH:", calcHeatIndex(40, 75));
