// Utility scss
import spaces from '../../styles/utils/spacing.module.scss';

/**
 * Selector class factory for spacial geometry utility component
 * 
 * @param {string | string[]} spacing - Array of strings or a single string to select spacing class
 * @returns {string} Returns string of class references
 */
const Spacing = (spacing: string | string[]): string => {
  let classes: string[] = [];

  if (Array.isArray(spacing)) {
    spacing.forEach(space => {
      if (spaces[space]) {
        classes.push(spaces[space]);
      }
    });
  } else {
    if (spaces[spacing]) {
      classes.push(spaces[spacing]);
    }
  }

  return classes.join(' ');
};

export default Spacing;
