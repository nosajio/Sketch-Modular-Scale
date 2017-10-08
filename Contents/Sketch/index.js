const defaults = {
  exponent: '1.414',
  base: '18',
};

function stepX(context) {
  const sketch = context.api();
  const steps = showInputPopover(context, 'Y Steps...', 1);
  const moveBy = calcStep(context, steps);
  moveSelectionBy(context, moveBy, 0);
}

function stepY(context) {
  const sketch = context.api();
  const steps = showInputPopover(context, 'Y Steps...', 1);
  const moveBy = calcStep(context, steps);
  moveSelectionBy(context, 0, moveBy);
}

function scaleWidth(context) {
  const sketch = context.api();
  const steps = showInputPopover(context, 'Width steps...', 1);
  const scaleTo = calcStep(context, steps);
  scaleWidthTo(context, scaleTo);
}

function scaleHeight(context) {
  const sketch = context.api();
  const steps = showInputPopover(context, 'Height steps...', 1);
  const scaleTo = calcStep(context, steps);
  scaleHeightTo(context, scaleTo);
}

function setExponent(context) {
  const sketch = context.api();
  const defaultValue = sketch.settingForKey('ModularScaleExponent') || defaults.exponent;
  const value = showInputPopover(context, 'Exponent number (ratio)', defaultValue);
  sketch.setSettingForKey('ModularScaleExponent', value);
}

function setBase(context) {
  const sketch = context.api();
  const defaultValue = sketch.settingForKey('ModularScaleBase') || defaults.base;
  const value = showInputPopover(context, 'Base number (pixels)', defaultValue);
  sketch.setSettingForKey('ModularScaleBase', value);
}

function showInputPopover(context, message = '', initialValue = '') {
  const { document } = context;
  return [document askForUserInput:message initialValue:initialValue];
}

/**
 * Compute the scale value for step
 * @param {number} step
 * @param {number} exp
 * @return {number} - floating point value
 */
function scale(step, exp) {
  let output = 1;
  if (step > 0) {
    while (step--) {
      output *= exp;
    }
  } else {
    let invertedStep = step * -1; // Flip the negative step value to positive
    while (invertedStep--) {
      output /= exp;
    }
  }
  return output.toFixed(3);
}

/**
 * Calculate the amount to move based on step
 * @param {number} s
 */
function calcStep(context, s) {
  const sketch = context.api();
  const exponent = parseFloat( sketch.settingForKey('ModularScaleExponent') || defaults.exponent );
  const base = parseFloat( sketch.settingForKey('ModularScaleBase') || defaults.base );
  return (base * scale(s, exponent)).toFixed(2);
}

/**
 * Change width of layer to value
 * @param {} context
 * @param {number} newWidth
 */
function scaleWidthTo(context, newWidth) {
  const { selection } = context;
  selection.forEach(layer => {
    const layerFrame = layer.frame();
    const widthHeight = [parseFloat(layerFrame.width()), parseFloat(layerFrame.height())];
    // Figure out the ratio of height:width so that the shape looks good when scaled
    const widthHeightRatio = widthHeight[1] / widthHeight[0];
    const newHeight = parseFloat( newWidth * widthHeightRatio );
    layer.frame().setWidth(newWidth);
    layer.frame().setHeight(newHeight);
  })
}

/**
 * Change height of layer to value
 * @param {} context
 * @param {number} newWidth
 */
function scaleHeightTo(context, newHeight) {
  const { selection } = context;
  selection.forEach(layer => {
    const layerFrame = layer.frame();
    const heightWidth = [parseFloat(layerFrame.height()), parseFloat(layerFrame.width())];
    // Figure out the ratio of height:width so that the shape looks good when scaled
    const heightWidthRatio = heightWidth[1] / heightWidth[0];
    const newWidth = parseFloat( newHeight * heightWidthRatio );
    layer.frame().setWidth(newWidth);
    layer.frame().setHeight(newHeight);
  })
}

/**
 * Change the selected layer(s) x, y values by n
 * @param {} context
 * @param {number} x
 * @param {number} y
 */
function moveSelectionBy(context, x, y) {
  const { selection } = context;
  selection.forEach(layer => {
    const layerFrame = layer.frame();
    const newX = parseFloat(layerFrame.x()) + parseFloat(x);
    const newY = parseFloat(layerFrame.y()) + parseFloat(y);
    layer.frame().setX( Math.round(newX) );
    layer.frame().setY( Math.round(newY) );
  })
}
