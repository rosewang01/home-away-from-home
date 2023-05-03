/**
 * Function that turns an input string into itself but in Title Case
 * @param str 
 * @returns str in Title Case
 */

const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
}

export {toTitleCase}