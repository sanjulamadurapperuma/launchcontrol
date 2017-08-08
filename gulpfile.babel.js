import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";

const browserSync = BrowserSync.create();
const hugoBin = "hugo";
const defaultArgs = ["-d", "../dist", "-s", "site", "-v"];

// Development tasks
gulp.task("hugo", ["setDevEnv"], (cb) => buildSite(cb));
gulp.task("hugo-preview", ["setDevEnv"], (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));

// Build tasks
gulp.task("build", ["setProdEnv", "css", "js"], (cb) => buildSite(cb));
gulp.task("build-preview", ["setProdEnv", "css", "js"], (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));

// Compile CSS
gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([cssImport({from: "./src/css/main.css"}), cssnext()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

// Transpile javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// Development serve/watch tasks
gulp.task("server", ["hugo", "css", "js"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/css/**/*.css", ["css"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

// Set environment var for development
gulp.task("setDevEnv", () => {
  process.env.NODE_ENV = "development";
});

// Set environment var for production
gulp.task("setProdEnv", () => {
  process.env.NODE_ENV = "production";
});

// Build all assets & page
function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
