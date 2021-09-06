/**
 * 缓动函数
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
 * 
 * 感谢张鑫旭大佬 https://github.com/zhangxinxu/Tween
 */

interface SpeedType {
  easeIn: (...arr: number[]) => number
  easeOut: (...arr: number[]) => number
}

// 二次方的缓动
export const quad: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d
    return c * (t /= d) * t + b
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d
    return -c * (t /= d) * (t - 2) + b
  }
}

// 三次方的缓动
export const cubic: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d
    return c * (t /= d) * t * t + b
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d
    return c * ((t = t / d - 1) * t * t + 1) + b
  }
}

// 四次方的缓动
export const quart: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d
    return c * (t /= d) * t * t * t + b
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d
    return -c * ((t = t / d - 1) * t * t * t - 1) + b
  }
}

// 五次方的缓动
export const quint: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d
    return c * (t /= d) * t * t * t * t + b
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b
  }
}

// 正弦曲线的缓动
export const sine: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d
    return c * Math.sin(t / d * (Math.PI / 2)) + b
  }
}

// 指数曲线的缓动
export const expo: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
  }
}

// 圆形曲线的缓动
export const circ: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
  }
}
