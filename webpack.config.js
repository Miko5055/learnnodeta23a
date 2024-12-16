import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import fetch from "node-fetch";
import * as sass from 'sass' // Sass loader implementation

// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async () => {
  console.log("__dirname:", __dirname);

  // Fetch character data
  let response = await fetch("https://rickandmortyapi.com/api/character/?page=4");
  let json = await response.json();
  let characters = json.results;

  // Generate HtmlWebpackPlugin instances for character pages
  let pages = characters.map((character) => {
    return new HtmlWebpackPlugin({
      template: "./src/character.njk",
      filename: `character_${character.id}.html`,
      templateParameters: { character },
    });
  });

  return {
    entry: "./src/index.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"), // Correct usage
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"), // Correct usage
      },
      compress: true,
      port: 9000,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/i,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                implementation: sass, // Correct implementation
                sassOptions: {
                  quietDeps: true,
                },
              },
            },
          ],
        },
        {
          test: /\.njk$/,
          use: [
            {
              loader: "simple-nunjucks-loader",
              options: {},
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.njk",
        filename: "index.html",
        templateParameters: { characters },
      }),
      ...pages,
    ],
  };
};
