/**
 * 
 * @param array 
 */
export function filterArray<T, M>(array: (T | M)[], remove: M) {
    let index = 0;
    let removeCount = 0;

    for (const element of array) {
        if (element !== remove) {
            if (removeCount > 0) {
                array[index - removeCount] = element;
                array[index] = remove;
            }
        }
        else {
            removeCount++;
        }

        index++;
    }

    if (removeCount > 0) {
        array.length -= removeCount;
    }
}
