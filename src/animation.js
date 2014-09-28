//


/**
 * @fileoverview xxx
 */


canvasfx.animation = {};



/**
 * @param {number=} targetFramerate
 * @constructor
 * @extends {canvasfx.Object}
 */
canvasfx.animation.Animation = function(targetFramerate) {
  canvasfx.Object.call(this);

  /**
   * @protected
   * @type {boolean}
   */
  this.autoReverse = false;

  /**
   * @protected
   * @type {number}
   */
  this.cycleCount = 1.0;

  /**
   * @protected
   * @type {canvasfx.util.Duration}
   */
  this.cycleDuration = canvasfx.util.Duration.ZERO;

  /**
   * @protected
   * @type {canvasfx.util.Duration}
   */
  this.currentTime = canvasfx.util.Duration.ZERO;

  /**
   * @protected
   * @type {canvasfx.util.Duration}
   */
  this.delay = canvasfx.util.Duration.ZERO;

  /**
   * @protected
   * @type {canvasfx.event.EventHandler}
   */
  this.onFinished = null;

  /**
   * @protected
   * @type {number}
   */
  this.rate = 1.0;

  /**
   * @protected
   * @type {canvasfx.animation.Animation.Status}
   */
  this.status = canvasfx.animation.Animation.Status.STOPPED;

  /**
   * @private
   * @type {canvasfx.animation.AnimationTimer}
   */
  this.timer_ = null;
};
canvasfx.inherit(canvasfx.animation.Animation, canvasfx.Object);


/**
 * @enum {string}
 */
canvasfx.animation.Animation.Status = {
  PAUSED: 'paused',
  RUNNING: 'running',
  STOPPED: 'stopped'
};


/**
 * @return {boolean}
 */
canvasfx.animation.Animation.prototype.isAutoReverse = function() {
  return this.autoReverse;
};


/**
 * @return {number}
 */
canvasfx.animation.Animation.prototype.getCycleCount = function() {
  return this.cycleCount;
};


/**
 * @return {canvasfx.util.Duration}
 */
canvasfx.animation.Animation.prototype.getCycleDuration = function() {
  return this.cycleDuration;
};


/**
 * @return {canvasfx.util.Duration}
 */
canvasfx.animation.Animation.prototype.getCurrentTime = function() {
  return this.currentTime;
};


/**
 * @return {canvasfx.util.Duration}
 */
canvasfx.animation.Animation.prototype.getDelay = function() {
  return this.delay;
};


/**
 * @return {canvasfx.event.EventHandler}
 */
canvasfx.animation.Animation.prototype.getOnFinished = function() {
  return this.onFinished;
};


/**
 * @return {number}
 */
canvasfx.animation.Animation.prototype.getRate = function() {
  return this.rate;
};

/**
 * @return {canvasfx.animation.Animation.Status}
 */
canvasfx.animation.Animation.prototype.getStatus = function() {
  return this.status;
};


/**
 * @return {canvasfx.util.Duration}
 */
canvasfx.animation.Animation.prototype.getTotalDuration = function() {
  return new canvasfx.util.Duration(
      this.cycleCount * this.cycleDuration.toMillis()
  );
};


/**
 */
canvasfx.animation.Animation.prototype.pause = function() {
  if (this.status != canvasfx.animation.Animation.Status.RUNNING) {
    return;
  }
  this.status = canvasfx.animation.Animation.Status.PAUSED;
};


/**
 * @todo private access
 */
canvasfx.animation.Animation.prototype.play = function() {
  if (this.status == canvasfx.animation.Animation.Status.RUNNING) {
    return;
  }
  this.status = canvasfx.animation.Animation.Status.RUNNING;

  if (this.timer_) {
    return;
  }

  var me = this;
  this.timer_ = (function() {
    var beforeTime = Date.now();
    var delta = 0;
    var time = canvasfx.util.Duration.ZERO;

    var t = new canvasfx.animation.AnimationTimer();
    t.handle = function(now) {
      delta = now - beforeTime;
      beforeTime = now;

      delta *= me.rate;

      if (me.status != canvasfx.animation.Animation.Status.RUNNING) {
        return;
      }

      time = time.add(new canvasfx.util.Duration(delta));
      if (time.lessThan(me.delay)) {
        return;
      }

      me.currentTime =
          me.currentTime.add(new canvasfx.util.Duration(delta));
      if (me.currentTime.greaterThan(me.getTotalDuration())) {
        me.currentTime = me.getTotalDuration();
      }

      var reverse = !!(parseInt(
          me.currentTime.toMillis() / me.cycleDuration.toMillis()
          ) % 2) && me.autoReverse;
      var progress =
          me.currentTime.toMillis() % me.cycleDuration.toMillis() /
              me.cycleDuration.toMillis();

      if (progress == 0 && !me.autoReverse) {
        progress = 1.0;
      }
      progress = reverse ? (1 - progress) : progress;

      me.update(progress);

      if (me.currentTime.greaterThanOrEqualTo(me.getTotalDuration())) {
        var event = new canvasfx.event.ActionEvent();
        if (me.onFinished) {
          me.onFinished.handle(event);
        }
        t.stop();
        me.stop();
      }
    };
    return t;
  })();
  this.timer_.start();
};


/**
 * @param {boolean} value
 */
canvasfx.animation.Animation.prototype.setAutoReverse = function(value) {
  this.autoReverse = value;
};


/**
 * @param {number} value
 */
canvasfx.animation.Animation.prototype.setCycleCount = function(value) {
  this.cycleCount = value;
};


/**
 * @protected
 * @param {canvasfx.util.Duration} value
 */
canvasfx.animation.Animation.prototype.setCycleDuration = function(value) {
  this.cycleDuration = value;
};


/**
 * @param {canvasfx.util.Duration} value
 */
canvasfx.animation.Animation.prototype.setDelay = function(value) {
  this.delay = value;
};


/**
 * @param {canvasfx.event.EventListener} value
 */
canvasfx.animation.Animation.prototype.setOnFinished = function(value) {
  this.onFinished = value;
};


/**
 * @param {number} value
 */
canvasfx.animation.Animation.prototype.setRate = function(value) {
  this.rate = value;
};


/**
 * @protected
 * @param {boolean} progress
 */
canvasfx.animation.Animation.prototype.update = function(progress) {};


/**
 */
canvasfx.animation.Animation.prototype.stop = function() {
  if (this.status != canvasfx.animation.Animation.Status.RUNNING) {
    return;
  }
  this.status = canvasfx.animation.Animation.Status.STOPPED;
  if (this.timer_) {
    this.timer_.stop();
    this.timer_ = null;
  }
  this.currentTime = canvasfx.util.Duration.ZERO;
};



/**
 * @param {...canvasfx.animation.KeyFrame} var_args
 * @constructor
 * @extends {canvasfx.animation.Animation}
 */
canvasfx.animation.Timeline = function(var_args) {
  canvasfx.animation.Animation.call(this);

  /**
   * @private
   * @type {Array}
   */
  this.keyFrames_ = Array.prototype.slice.call(arguments);

  /**
   * @private
   * @type {Array}
   */
  this.animations_ = [];
};
canvasfx.inherit(canvasfx.animation.Timeline, canvasfx.animation.Animation);


/**
 * @return {Array}
 */
canvasfx.animation.Timeline.prototype.getKeyFrames = function() {
  return this.keyFrames_;
};


/**
 * @override
 */
canvasfx.animation.Timeline.prototype.pause = function() {
  this.animations_.forEach(function(element) {
    element.pause();
  });
};


/**
 * @param {boolean} progress
 * @param {boolean} reverse
 * @override
 */
canvasfx.animation.Timeline.prototype.play = function() {
  var me = this;
  this.keyFrames_.forEach(function(element, index) {
    var animation = me.animations_[index];
    if (animation &&
        animation.status != canvasfx.animation.Animation.Status.STOPPED) {
      //
    } else {
      animation = new canvasfx.animation.Animation();
      animation.setDelay(element.getTime());
      animation.setOnFinished(element.getOnFinished());
      me.animations_[index] = animation;
    }
  });
  this.animations_ = this.animations_.slice(0, this.keyFrames_.length);
  this.animations_.forEach(function(element) {
    element.play();
  });
};


/**
 * @override
 */
canvasfx.animation.Timeline.prototype.stop = function() {
  this.animations_.forEach(function(element) {
    element.stop();
  });
};


/**
 * @override
 */
canvasfx.animation.Timeline.prototype.update = function() {};



/**
 * @param {canvasfx.util.Duration} time
 * @param {canvasfx.event.EventHandler} onFinished
 * @constructor
 * @extends {canvasfx.Object}
 */
canvasfx.animation.KeyFrame = function(time, onFinished) {
  canvasfx.Object.call(this);

  /**
   * @private
   * @type {canvasfx.util.Duration}
   */
  this.time_ = time;

  /**
   * @private
   * @type {canvasfx.event.EventHandler}
   */
  this.onFinished_ = onFinished;
};
canvasfx.inherit(canvasfx.animation.KeyFrame, canvasfx.Object);


/**
 * @return {canvasfx.event.EventHandler}
 */
canvasfx.animation.KeyFrame.prototype.getOnFinished = function() {
  return this.onFinished_;
};


/**
 * @return {canvasfx.util.Duration}
 */
canvasfx.animation.KeyFrame.prototype.getTime = function() {
  return this.time_;
};



/**
 * @constructor
 * @extends {canvasfx.animation.Animation}
 */
canvasfx.animation.Transition = function() {
  canvasfx.animation.Animation.call(this);

  /**
   * @protected
   * @type {canvasfx.util.Duration}
   */
  this.duration = new canvasfx.util.Duration(400);

  /**
   * @protected
   * @type {?canvasfx.scene.Node}
   */
  this.node = null;
};
canvasfx.inherit(canvasfx.animation.Transition, canvasfx.animation.Animation);


/**
 * @return {canvasfx.util.Duration}
 */
canvasfx.animation.Transition.prototype.getDuration = function() {
  return this.duration;
};


/**
 * @return {canvasfx.scene.Node}
 */
canvasfx.animation.Transition.prototype.getNode = function() {
  return this.node;
};


/**
 * @param {canvasfx.util.Duration} value
 */
canvasfx.animation.Transition.prototype.setDuration = function(value) {
  this.duration = value;
};


/**
 * @param {canvasfx.scene.Node} value
 */
canvasfx.animation.Transition.prototype.setNode = function(value) {
  this.node = value;
};



/**
 * @param {canvasfx.util.Duration=} duration
 * @param {canvasfx.scene.Node=} node
 * @constructor
 * @extends {canvasfx.animation.Transition}
 */
canvasfx.animation.FadeTransition = function(duration, node) {
  canvasfx.animation.Transition.call(this);

  this.duration =
      canvasfx.supplement(duration, new canvasfx.util.Duration(400));
  this.node = node;

  /**
   * @private
   * @type {number}
   */
  this.byValue_ = 0.0;

  /**
   * @private
   * @type {number|NaN}
   */
  this.fromValue_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.toValue_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.startValue_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.endValue_ = NaN;
};
canvasfx.inherit(canvasfx.animation.FadeTransition,
    canvasfx.animation.Transition);


/**
 * @return {number}
 */
canvasfx.animation.FadeTransition.prototype.getByValue = function() {
  return this.byValue_;
};


/**
 * @return {number|NaN}
 */
canvasfx.animation.FadeTransition.prototype.getFromValue = function() {
  return this.fromValue_;
};


/**
 * @return {number|NaN}
 */
canvasfx.animation.FadeTransition.prototype.getToValue = function() {
  return this.toValue_;
};


/**
 * @override
 */
canvasfx.animation.FadeTransition.prototype.play = function() {
  this.cycleDuration = this.duration;

  if (!this.node) {
    return;
  }

  this.startValue_ = NaN;
  this.endValue_ = NaN;

  this.startValue_ = this.fromValue_;
  if (isNaN(this.startValue_)) {
    this.startValue_ = this.node.getOpacity();
  }
  this.endValue_ = this.toValue_;
  if (isNaN(this.endValue_)) {
    this.endValue_ = this.startValue_ + this.byValue_;
  }

  canvasfx.animation.Animation.prototype.play.call(this);
};


/**
 * @param {number} value
 */
canvasfx.animation.FadeTransition.prototype.setByValue = function(value) {
  this.byValue_ = value;
};


/**
 * @param {number|NaN} value
 */
canvasfx.animation.FadeTransition.prototype.setFromValue = function(value) {
  this.fromValue_ = value;
};


/**
 * @param {number|NaN} value
 */
canvasfx.animation.FadeTransition.prototype.setToValue = function(value) {
  this.toValue_ = value;
};


/**
 * @param {boolean} progress
 * @override
 */
canvasfx.animation.FadeTransition.prototype.update = function(progress) {
  if (!this.node) {
    return;
  }

  var value = this.startValue_ -
      this.startValue_ * progress + this.endValue_ * progress;

  this.node.setOpacity(value);
};



/**
 * @param {canvasfx.util.Duration=} duration
 * @param {canvasfx.scene.Node=} node
 * @constructor
 * @extends {canvasfx.animation.Transition}
 */
canvasfx.animation.RotateTransition = function(duration, node) {
  canvasfx.animation.Transition.call(this);

  this.duration =
      canvasfx.supplement(duration, new canvasfx.util.Duration(400));
  this.node = node;

  /**
   * @private
   * @type {number}
   */
  this.byAngle_ = 0.0;

  /**
   * @private
   * @type {number|NaN}
   */
  this.fromAngle_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.toAngle_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.startAngle_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.endAngle_ = NaN;
};
canvasfx.inherit(canvasfx.animation.RotateTransition,
    canvasfx.animation.Transition);


/**
 * @return {number}
 */
canvasfx.animation.RotateTransition.prototype.getByAngle = function() {
  return this.byAngle_;
};


/**
 * @return {number|NaN}
 */
canvasfx.animation.RotateTransition.prototype.getFromAngle = function() {
  return this.fromAngle_;
};


/**
 * @return {number|NaN}
 */
canvasfx.animation.RotateTransition.prototype.getToAngle = function() {
  return this.toAngle_;
};


/**
 * @override
 */
canvasfx.animation.RotateTransition.prototype.play = function() {
  this.cycleDuration = this.duration;

  if (!this.node) {
    return;
  }

  this.startAngle_ = NaN;
  this.endAngle_ = NaN;

  this.startAngle_ = this.fromAngle_;
  if (isNaN(this.startAngle_)) {
    this.startAngle_ = this.node.getRotate();
  }
  this.endAngle_ = this.toAngle_;
  if (isNaN(this.endAngle_)) {
    this.endAngle_ = this.startAngle_ + this.byAngle_;
  }

  canvasfx.animation.Animation.prototype.play.call(this);
};


/**
 * @param {number} value
 */
canvasfx.animation.RotateTransition.prototype.setByAngle = function(value) {
  this.byAngle_ = value;
};


/**
 * @param {number|NaN} value
 */
canvasfx.animation.RotateTransition.prototype.setFromAngle = function(value) {
  this.fromAngle_ = value;
};


/**
 * @param {number|NaN} value
 */
canvasfx.animation.RotateTransition.prototype.setToAngle = function(value) {
  this.toAngle_ = value;
};


/**
 * @param {boolean} progress
 * @override
 */
canvasfx.animation.RotateTransition.prototype.update = function(progress) {
  if (!this.node) {
    return;
  }

  var angle = this.startAngle_ -
      this.startAngle_ * progress + this.endAngle_ * progress;

  this.node.setRotate(angle);
};



/**
 * @param {canvasfx.util.Duration=} duration
 * @param {canvasfx.scene.Node=} node
 * @constructor
 * @extends {canvasfx.animation.Transition}
 */
canvasfx.animation.TranslateTransition = function(duration, node) {
  canvasfx.animation.Transition.call(this);

  this.duration =
      canvasfx.supplement(duration, new canvasfx.util.Duration(400));
  this.node = node;

  /**
   * @private
   * @type {number}
   */
  this.byX_ = 0.0;

  /**
   * @private
   * @type {number}
   */
  this.byY_ = 0.0;

  /**
   * @private
   * @type {number|NaN}
   */
  this.fromX_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.fromY_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.toX_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.toY_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.startX_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.startY_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.endX_ = NaN;

  /**
   * @private
   * @type {number|NaN}
   */
  this.endY_ = NaN;
};
canvasfx.inherit(canvasfx.animation.TranslateTransition,
    canvasfx.animation.Transition);


/**
 * @return {number}
 */
canvasfx.animation.TranslateTransition.prototype.getByX = function() {
  return this.byX_;
};


/**
 * @return {number}
 */
canvasfx.animation.TranslateTransition.prototype.getByY = function() {
  return this.byY_;
};


/**
 * @return {number|NaN}
 */
canvasfx.animation.TranslateTransition.prototype.getFromX = function() {
  return this.fromX_;
};


/**
 * @return {number|NaN}
 */
canvasfx.animation.TranslateTransition.prototype.getFromY = function() {
  return this.fromY_;
};


/**
 * @return {number|NaN}
 */
canvasfx.animation.TranslateTransition.prototype.getToX = function() {
  return this.toX_;
};


/**
 * @return {number|NaN}
 */
canvasfx.animation.TranslateTransition.prototype.getToY = function() {
  return this.toY_;
};


/**
 * @override
 */
canvasfx.animation.TranslateTransition.prototype.play = function() {
  this.cycleDuration = this.duration;

  if (!this.node) {
    return;
  }

  this.startX_ = NaN;
  this.endX_ = NaN;

  this.startX_ = this.fromX_;
  if (isNaN(this.startX_)) {
    this.startX_ = this.node.getTranslateX();
  }
  this.endX_ = this.toX_;
  if (isNaN(this.endX_)) {
    this.endX_ = this.startX_ + this.byX_;
  }

  this.startY_ = NaN;
  this.endY_ = NaN;

  this.startY_ = this.fromY_;
  if (isNaN(this.startY_)) {
    this.startY_ = this.node.getTranslateY();
  }
  this.endY_ = this.toY_;
  if (isNaN(this.endY_)) {
    this.endY_ = this.startY_ + this.byY_;
  }

  canvasfx.animation.Animation.prototype.play.call(this);
};


/**
 * @param {number} value
 */
canvasfx.animation.TranslateTransition.prototype.setByX = function(value) {
  this.byX_ = value;
};


/**
 * @param {number} value
 */
canvasfx.animation.TranslateTransition.prototype.setByY = function(value) {
  this.byY_ = value;
};


/**
 * @param {number|NaN} value
 */
canvasfx.animation.TranslateTransition.prototype.setFromX = function(value) {
  this.fromX_ = value;
};


/**
 * @param {number|NaN} value
 */
canvasfx.animation.TranslateTransition.prototype.setFromY = function(value) {
  this.fromY_ = value;
};


/**
 * @param {number|NaN} value
 */
canvasfx.animation.TranslateTransition.prototype.setToX = function(value) {
  this.toX_ = value;
};


/**
 * @param {number|NaN} value
 */
canvasfx.animation.TranslateTransition.prototype.setToY = function(value) {
  this.toY_ = value;
};


/**
 * @param {boolean} progress
 * @override
 */
canvasfx.animation.TranslateTransition.prototype.update = function(progress) {
  if (!this.node) {
    return;
  }

  var x = this.startX_ -
      this.startX_ * progress + this.endX_ * progress;
  var y = this.startY_ -
      this.startY_ * progress + this.endY_ * progress;

  this.node.setTranslateX(x);
  this.node.setTranslateY(y);
};



/**
 * @constructor
 * @extends {canvasfx.Object}
 */
canvasfx.animation.AnimationTimer = function() {
  canvasfx.Object.call(this);

  /**
   * @private
   * @type {number}
   */
  this.id_ = null;
};
canvasfx.inherit(canvasfx.animation.AnimationTimer, canvasfx.Object);


/**
 * @param {number} now
 */
canvasfx.animation.AnimationTimer.prototype.handle = canvasfx.abstractMethod;


/**
 */
canvasfx.animation.AnimationTimer.prototype.start = function() {
  this.stop();

  var me = this;
  (function animationLoop() {
    me.id_ = canvasfx.animation.AnimationTimer.requestAnimationFrame_()(
        animationLoop
        );
    me.handle(Date.now());
  })();
};


/**
 */
canvasfx.animation.AnimationTimer.prototype.stop = function() {
  canvasfx.animation.AnimationTimer.cancelAnimationFrame_()(
      this.id_
  );
  this.id_ = null;
};


/**
 * @const
 * @private
 * @return {Function}
 */
canvasfx.animation.AnimationTimer.requestAnimationFrame_ = function() {
  return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      /** @param {Function} callback */
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
};


/**
 * @const
 * @private
 * @return {Function}
 */
canvasfx.animation.AnimationTimer.cancelAnimationFrame_ = function() {
  return window.cancelAnimationFrame ||
      window.cancelRequestAnimationFrame ||
      window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame ||
      window.oCancelRequestAnimationFrame ||
      window.msCancelRequestAnimationFrame ||
      /** @param {number} id */
      function(id) {
        window.clearTimeout(id);
      };
};
