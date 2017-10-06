// Some hardcoded defaults
const exponent = 1.414;
const base = 18; // px

function stepX(context) {
  const sketch = context.api();
  const steps = showInputPopover(context, 'Y Steps...', 1);
  const moveBy = calcStep(steps);
  moveSelectionBy(context, moveBy, 0);
}

function stepY(context) {
  const sketch = context.api();
  const steps = showInputPopover(context, 'Y Steps...', 1);
  const moveBy = calcStep(steps);
  moveSelectionBy(context, 0, moveBy);
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
function calcStep(s) {
  return (base * scale(s, exponent)).toFixed(2);
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
    layer.frame().setX(newX);
    layer.frame().setY(newY);
  })
}
