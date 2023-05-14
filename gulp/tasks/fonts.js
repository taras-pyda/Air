import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
  return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`)
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: 'FONTS',
        message: 'Error: <% error.message %>',
      })
    ))
    .pipe(fonter({
      formats: ['ttf'],
    }))
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
};

export const ttfToWoff = () => {
  return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`)
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: 'FONTS',
        message: 'Error: <% error.message %>',
      })
    ))
    .pipe(fonter({
      formats: ['woff'],
    }))
    .pipe(app.gulp.dest(app.path.build.fonts))
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(app.gulp.dest(app.path.build.fonts));
};

export const fontsStyle = () => {
  const fontsFile = `${app.path.srcFolder}/scss/_fonts.scss`;
  const cb = () => {};

  fs.readdir(app.path.build.fonts, (_, fontsFiles) => {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);

        let newFileOnly;

        for (let i = 0; i < fontsFiles.length; i++) {
          const fontFileName = fontsFiles[i].split('.')[0];

          if (newFileOnly !== fontFileName) {
            const fontName = fontFileName.split('-')[0]
              ? fontFileName.split('-')[0]
              : fontFileName;
            let fontWeight = fontFileName.split('-')[1]
              ? fontFileName.split('-')[1]
              : fontFileName;
            const fontStyle = fontWeight.toLowerCase().includes('italic')
              ? 'italic'
              : 'normal';

            switch (fontWeight.toLowerCase()) {
              case 'thin':
              case 'thinitalic':
                fontWeight = 100;
                break;

              case 'extralight':
              case 'extralightitalic':
                fontWeight = 200;
                break;

              case 'light':
              case 'lightitalic':
                fontWeight = 300;
                break;

              case 'medium':
              case 'mediumitalic':
                fontWeight = 500;
                break;

              case 'semibold':
              case 'semibolditalic':
                fontWeight = 600;
                break;

              case 'bold':
              case 'bolditalic':
                fontWeight = 700;
                break;

              case 'extrabold':
              case 'extrabolditalic':
              case 'heavy':
              case 'heavyitalic':
                fontWeight = 800;
                break;

              case 'black':
              case 'blackitalic':
                fontWeight = 900;
                break;

              default:
                fontWeight = 400;
            };

            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\r\n`,
              cb,
            );

            newFileOnly = fontFileName;
          };
        };
      } else {
        console.log('File scss/_fonts.scss is already exist. To update the file, you need to delete it.')
      };
    };
  });

  return app.gulp.src(app.path.srcFolder);
};
