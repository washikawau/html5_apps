import webpack from "webpack";

const config: webpack.Configuration = {
  mode: 'development',
  devtool: "inline-source-map",
  entry: './src/main.ts',
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js',],
  },
};

export default config;
