const withMT = require("@material-tailwind/html/utils/withMT");

module.exports = withMT({
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('@tailwindcss/forms'),
  ],
});

