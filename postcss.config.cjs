module.exports = {
  plugins: {
    "postcss-px-to-viewport-8-plugin": {
      viewportWidth: 375, // 设计稿宽度
      unitPrecision: 5, // 小数位
      viewportUnit: "vw", // 转换单位
      selectorBlackList: [".ignore", ".no-vw"], // 不转换的类
      minPixelValue: 1, // 最小转换值
      mediaQuery: false, // 媒体查询是否转换
    },
  },
};
