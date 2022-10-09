const fs = require('fs');
const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
import * as webpack from 'webpack';
import 'webpack-dev-server'; // dont remove this import, it's for webpack-dev-server type
import HtmlWebpackPlugin from 'html-webpack-plugin';
const COMPRESS = true;

const getEntriesByParsingTemplateNames = (templatesFolderName, atRoot = true) => {
  const folderPath = resolve(__dirname, `./src/${templatesFolderName}`);
  const entryObj: webpack.EntryObject = {};
  const templateRegx = /(.*)(\.)(ejs|html)/g;
  fs.readdirSync(folderPath).forEach((o: string) => {
    if (!o.match(templateRegx)) return;
    let entryName: string = o.replace(templateRegx, `$1`);
    const entryRegex = /(.*)(\.)(.*)/g;
    if (entryName.match(entryRegex)) {
      entryName = entryName.replace(entryRegex, `$3`);
    }

    const entryDependency = atRoot ? entryName : `${templatesFolderName}/${entryName}`

    let entryPath = resolve(__dirname, `src/ts/${entryDependency}.ts`);
    // entry stylesheet
    let entryStyleSheetPath = resolve(__dirname, `./src/scss/${entryDependency}.scss`);

    entryPath = fs.existsSync(entryPath) ? entryPath : undefined;
    entryStyleSheetPath = fs.existsSync(entryStyleSheetPath) ? entryStyleSheetPath : undefined;

    // import es6-promise and scss util automatically
    entryObj[entryName] = ['es6-promise/auto', entryPath, './src/scss/reset.scss', entryStyleSheetPath].filter(function (x: string | undefined) {
      return x !== undefined;
    });

  })
  return entryObj;
}

const getTemaplteInstancesByParsingTemplateNames = (templatesFolderName, atRoot = true) => {
  const forderPath = resolve(__dirname, `./src/${templatesFolderName}`);
  return fs.readdirSync(forderPath).map((fullFileName: string) => {
    const templateRegx = /(.*)(\.)(ejs|html)/g;
    const ejsRegex = /(.*)(\.ejs)/g;
    const entryRegex = /(.*)(\.)(.*)(\.)(ejs|html)/g;
    if (!fullFileName.match(templateRegx)) return;
    const isEjs = fullFileName.match(ejsRegex);
    let outputFileName = fullFileName.replace(templateRegx, `$1`);
    let entryName = outputFileName;
    if (fullFileName.match(entryRegex)) {
      outputFileName = fullFileName.replace(entryRegex, `$1`);
      entryName = fullFileName.replace(entryRegex, `$3`);
    }
    const ejsFilePath = resolve(forderPath, `${fullFileName}`);
    const data = fs.readFileSync(ejsFilePath, 'utf8')
    if (!data) {
      fs.writeFile(ejsFilePath, ' ', () => { });
      console.warn(`WARNING : ${fullFileName} is an empty file`);
    }

    return new HtmlWebpackPlugin({
      cache: false,
      chunks: [entryName],
      filename: `${atRoot ? '' : templatesFolderName + '/'}${outputFileName}.html`,
      template: isEjs ? ejsFilePath : ejsFilePath.replace(ejsRegex, `$1.html`),
      favicon: 'src/assets/images/logo.svg',
      minify: COMPRESS ? {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      } : false
    })
  }).filter(function (x: HtmlWebpackPlugin | undefined) {
    return x !== undefined;
  });
}

const pageEntries: webpack.EntryObject = getEntriesByParsingTemplateNames('pages');
//generate htmlWebpackPlugin instances
const pageEntryTemplates: HtmlWebpackPlugin[] = getTemaplteInstancesByParsingTemplateNames('pages');


const config = (env: any, argv: any): webpack.Configuration => {
  const configObj: webpack.Configuration = {
    entry: pageEntries,
    output: {
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: '[id].[chunkhash].js',
      path: resolve(__dirname, 'dist'),
      clean: true
    },
    target: ['web', 'es6'],
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      open: true,
      compress: true,
      watchFiles: [
        'src/pages/*.html',
        'src/template/*.html',
        'src/template/**/*.html',
        'src/pages/*.ejs',
        'src/template/*.ejs',
        'src/template/**/*.ejs',
      ],// this is important
      port: 8080
    },
    mode: 'development',
    experiments: {
      topLevelAwait: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: ['@babel/plugin-syntax-top-level-await'],
              },
            },
            'ts-loader'
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: COMPRESS
              }
            }
          ],
        },
        {
          test: /\.ejs$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: COMPRESS
              }
            },
            {
              loader: 'template-ejs-loader',
              options: {
                data: {
                  mode: argv.mode
                }
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext]'
          }
        },
        {
          test: /\.(sass|scss|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [
                    require('postcss-preset-env')()
                  ]
                }
              }
            },
            (() => {
              return COMPRESS ? 'sass-loader' : {
                loader: 'sass-loader',
                options: { sourceMap: true, sassOptions: { minimize: false, outputStyle: 'expanded' } }
              }
            })()

          ]
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]'
          }
        }

      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', 'json'],
      alias: {
        '@img': resolve(__dirname, './src/assets/images/'),
        '@font': resolve(__dirname, './src/assets/fonts/')
      }
    },
    optimization: {
      minimize: COMPRESS,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          test: /\.js(\?.*)?$/i,
          extractComments: false
        }),
        new CssMinimizerPlugin()
      ],
      splitChunks: { name: 'vendor', chunks: 'all' }
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    plugins: [
      new webpack.DefinePlugin({
        'PROCESS.MODE': JSON.stringify(argv.mode)
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      }),
      new CopyPlugin(
        {
          patterns: [
            {
              from: 'src/static',
              to: 'static',
              globOptions: {
                dot: true,
                ignore: ['**/.DS_Store', '**/.gitkeep'],
              },
              noErrorOnMissing: true,
            },
            {
              from: 'src/assets/images',
              to: 'assets/images',
              globOptions: {
                dot: true,
                ignore: ['**/.DS_Store', '**/.gitkeep'],
              },
              noErrorOnMissing: true,
            }
          ],
        }
      ),
      ...pageEntryTemplates

    ].filter(function (x) {
      return x !== undefined;
    })
  }
  return configObj;
}


export default config;