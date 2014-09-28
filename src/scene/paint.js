//


/**
 * @fileoverview xxx
 */


canvasfx.scene.paint = {};



/**
 * @param {number|string=} red
 * @param {number=} green
 * @param {number=} blue
 * @param {number=} opacity
 * @constructor
 * @extends {canvasfx.Object}
 */
canvasfx.scene.paint.Color = function(red, green, blue, opacity) {
  canvasfx.Object.call(this);

  red = canvasfx.supplement(red, 0.0);
  green = canvasfx.supplement(green, 0.0);
  blue = canvasfx.supplement(blue, 0.0);
  opacity = canvasfx.supplement(opacity, 1.0);

  // TODO: parse web color string
  if (typeof red === 'string' && red.charAt(0) == '#') {
    var colorString = red.substr(1);
    if (colorString.length == 3) {
      colorString =
          colorString.charAt(0) + colorString.charAt(0) +
          colorString.charAt(1) + colorString.charAt(1) +
          colorString.charAt(2) + colorString.charAt(2);
    }
    red = parseInt(colorString.substr(0, 2), 16);
    green = parseInt(colorString.substr(2, 2), 16);
    blue = parseInt(colorString.substr(4, 2), 16);
  }

  /**
   * @private
   * @type {number}
   */
  this.red_ = (red <= 1) ? red : red / 255;

  /**
   * @private
   * @type {number}
   */
  this.green_ = (green <= 1) ? green : green / 255;

  /**
   * @private
   * @type {number}
   */
  this.blue_ = (blue <= 1) ? blue : blue / 255;

  /**
   * @private
   * @type {number}
   */
  this.opacity_ = (opacity <= 1) ? opacity : opacity / 255;
};
canvasfx.inherit(canvasfx.scene.paint.Color, canvasfx.Object);


/**
 * @return {number}
 */
canvasfx.scene.paint.Color.prototype.getBlue = function() {
  return this.blue_;
};


/**
 * @return {number}
 */
canvasfx.scene.paint.Color.prototype.getGreen = function() {
  return this.green_;
};


/**
 * @return {number}
 */
canvasfx.scene.paint.Color.prototype.getOpacity = function() {
  return this.opacity_;
};


/**
 * @return {number}
 */
canvasfx.scene.paint.Color.prototype.getRed = function() {
  return this.red_;
};


/**
 * @return {string}
 */
canvasfx.scene.paint.Color.prototype.getWeb = function() {
  return '#' +
      ('00' + (this.red_ * 255).toString(16)).slice(-2) +
      ('00' + (this.green_ * 255).toString(16)).slice(-2) +
      ('00' + (this.blue_ * 255).toString(16)).slice(-2);
};


/**
 * @const
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number=} opacity
 * @return {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.color = function(red, green, blue, opacity) {
  return new canvasfx.scene.paint.Color(red, green, blue, opacity);
};


/**
 * @const
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number=} opacity
 * @return {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.rgb = function(red, green, blue, opacity) {
  return new canvasfx.scene.paint.Color(red, green, blue, opacity);
};


/**
 * @const
 * @param {string} colorString
 * @return {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.web = function(colorString) {
  return new canvasfx.scene.paint.Color(colorString);
};


/**
 * @const
 * @type {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.RED =
    canvasfx.scene.paint.Color.web('#ff0000');


/**
 * @const
 * @type {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.GREEN =
    canvasfx.scene.paint.Color.web('#00ff00');


/**
 * @const
 * @type {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.BLUE =
    canvasfx.scene.paint.Color.web('#0000ff');


/**
 * @const
 * @type {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.BLACK =
    canvasfx.scene.paint.Color.web('#000000');


/**
 * @const
 * @type {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.GRAY =
    canvasfx.scene.paint.Color.web('#808080');


/**
 * @const
 * @type {canvasfx.scene.paint.Color}
 */
canvasfx.scene.paint.Color.WHITE =
    canvasfx.scene.paint.Color.web('#ffffff');
