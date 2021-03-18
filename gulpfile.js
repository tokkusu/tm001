'use strict'

const { src, dest, parallel, series, watch } = require('gulp'),
      scss         = require('gulp-sass'),
      concat       = require('gulp-concat'),
      browsersync  = require('browser-sync').create(),
      uglify       = require('gulp-uglify-es').default,
      autoprefixer = require('gulp-autoprefixer'),
      imagemin     = require('gulp-imagemin'),
      svgSprite    = require('gulp-svg-sprite'),
      cheerio      = require('gulp-cheerio'),
      webp         = require('gulp-webp'),      
      flatMap      = require('flat-map').default,
      scaleImages  = require('gulp-scale-images'),
      ttf2woff     = require('gulp-ttf2woff'),
      ttf2woff2    = require('gulp-ttf2woff2'),
      fonter       = require('gulp-fonter'),
      replace      = require('gulp-replace'),
      changed      = require('gulp-changed'), 
      fs           = require('fs'),     
      del          = require('del');

// ------- Начало объявления путей -------

let projectFolder = "dist",
    sourceFolder  = "app";

let path = {
   build: {
      html: projectFolder + "/",
      css: projectFolder + "/css/",
      js: projectFolder + "/js/",
      img: projectFolder + "/images/",
      fonts: projectFolder + "/fonts/"
   },
   src: {
      html: sourceFolder + "/index.html",
      css: sourceFolder + "/scss/style.scss",
      js: sourceFolder + "/js/script.js",      
      img: sourceFolder + "/images/*.*",
      svg: sourceFolder + "/images/svg/*.*",
      optiimg: sourceFolder + "/images/optimized/",     
      fonts: sourceFolder + "/fonts/*.*"
   },
   watch: {
      html: sourceFolder + "/**/*.html",
      css: sourceFolder + "/scss/**/*.scss",
      js: sourceFolder + "/js/**/*.js",
      img: sourceFolder + "/images/**/*.*"      
   },
   clean: "./" + projectFolder + "/"
}

// ------- Конец объявления путей -------

function browserSync() {
   browsersync.init({
      server: {
         baseDir: "./" + projectFolder + "/"
      }      
   });
}

function html() {
   return src(path.src.html)
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}

function css() {
   return src(path.src.css)
      .pipe(scss({ outputStyle: 'compressed' }))
      .pipe(concat('style.min.css'))
      .pipe(autoprefixer({ overrideBrowserslist: ["last 5 versions"] }))
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}

function js() {
   return src(path.src.js)
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
}


// ------- Начало обработки картинок -------

function optimizeWebp() {
   return src(path.src.img)
      .pipe(changed(path.build.img))      
      .pipe(webp({quality: 75}))      
      .pipe(dest(path.src.optiimg))
      .pipe(src(path.src.optiimg))
      .pipe(dest(path.build.img))
}

function optimizeImages() {
   return src(path.src.img)
      .pipe(changed(path.build.img))      
      .pipe(imagemin([
         imagemin.gifsicle({ interlaced: true }),
         imagemin.mozjpeg({ quality: 75, progressive: true }),
         imagemin.optipng({ optimizationLevel: 5 })         
      ]))    
      .pipe(dest(path.src.optiimg))
      .pipe(src(path.src.optiimg))
      .pipe(dest(path.build.img))
}

function optimizeSvg() {
   return src(path.src.svg)   
   .pipe(imagemin([
      imagemin.svgo({
         plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
         ]
      })
   ]))   
   .pipe(svgSprite({
         dest: "/dist/images/",
         mode: {
            stack: {        
               dest: "/dist/images/",       
               sprite: "svgicons.svg",
               example: true
            }
         }
   }))  
   .pipe(cheerio({
      run: function ($) {
         $('[fill]').removeAttr('fill');
         $('[stroke]').removeAttr('stroke');
         $('[style]').removeAttr('style');
         $('[fill-opacity]').removeAttr('fill-opacity');
         $('[opacity]').removeAttr('opacity');
         
      },
      parserOptions: {xmlMode: true}
   }))
   .pipe(replace('&gt;', '>'))   
   .pipe(dest(path.build.img))   
}

function imagesScaleArr(file, cb) {
   const img220 = file.clone();
   img220.scale = { maxWidth: 220 };
   // const img768 = file.clone();
   // img768.scale = { maxWidth: 768 };
   // const img992 = file.clone();
   // img992.scale = { maxWidth: 992 };
   // cb(null, [img220, img768, img992]);
   cb(null, [img220]);
}

// Исключение путей для src()
// src("path", {dot: true, ignore: projectFolder + '/images/*.{svg,ico,gif,SVG,ICO,GIF}'})

function imagesScale() {
   return src(path.src.optiimg + '*.*')
      .pipe(flatMap(imagesScaleArr))
      .pipe(scaleImages())
      .pipe(dest(path.build.img))      
}

// ------- Конец обработки картинок -------


// ------- Начало обработки шрифтов -------

function ttfToWoff() {
   return src(path.src.fonts, {dot: true, ignore: sourceFolder + '/fonts/*.{otf,OTF}'})
      .pipe(ttf2woff())
      .pipe(dest(path.build.fonts))      
}

function ttfToWoff2() {
   return src(path.src.fonts, {dot: true, ignore: sourceFolder + '/fonts/*.{otf,OTF}'})
      .pipe(ttf2woff2())
      .pipe(dest(path.build.fonts))      
}

function otfToTtf() {
   return src(sourceFolder + '/fonts/*.otf')
      .pipe(fonter({
         formats: ['ttf']
      }))
      .pipe(dest(sourceFolder + '/fonts/'))      
}

async function fontsStyle(params) {
   let file_content = fs.readFileSync(sourceFolder + '/scss/_fonts.scss'); 
   if (file_content == '') {
      fs.writeFile(sourceFolder + '/scss/_fonts.scss', '', cb); 
      return fs.readdir(path.build.fonts, function (err, items) {
         if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
               let fontname = items[i].split('.');
               fontname = fontname[0];
               if (c_fontname != fontname) {
                  fs.appendFile(sourceFolder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb); 
               }
               c_fontname = fontname;
            }
         }
      })
   } 
}
   
function cb() {}

// ------- Конец обработки шрифтов -------


// ------- Начало обработки готовых решений -------

function vendorjs() {
   return src(['node_modules/jquery/dist/jquery.js',
               'node_modules/slick-carousel/slick/slick.js',
               'node_modules/jquery-scrollify/jquery.scrollify.js'])
      .pipe(concat('vendors.min.js'))
      .pipe(uglify())
      .pipe(dest(path.build.js))
}

function vendorcss() {
   return src(['node_modules/normalize.css/normalize.css',
               'node_modules/slick-carousel/slick/slick.css'])
      .pipe(concat('_libs.scss'))
      .pipe(dest(sourceFolder + '/scss/'))
}    

// ------- Конец обработки готовых решений -------


function watchFiles() {
   watch([path.watch.css], css);
   watch([path.watch.js], js);
   watch([path.watch.html], html);//.on('change', browsersync.reload);
   //watch([path.watch.img], images);
}

function clean() {
   return del([path.clean, path.src.optiimg + '*.*']);
}


// ------- Конфигурация последовательности тасков -------

let vendors = parallel(vendorcss, vendorjs),
    fonts   = series(otfToTtf, parallel(ttfToWoff, ttfToWoff2), fontsStyle),
    img     = series(optimizeWebp, optimizeImages),
    source  = parallel(js, css, fonts),
    dev     = series(parallel(html, vendors), source, img),
    prod    = series(clean, parallel(html, vendors), source, img);

exports.vendors     = vendors;
exports.prod        = prod;
exports.dev         = dev;
exports.img         = img;
exports.imagesScale = imagesScale;
exports.optimizeSvg = optimizeSvg;
exports.clean       = clean;

exports.default = parallel(dev, browserSync, watchFiles);