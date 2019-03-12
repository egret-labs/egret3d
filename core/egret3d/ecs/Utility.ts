namespace paper.utility {
    /**
     * 
     * @param array 
     */
    export function filterArray(array: any[], remove: any) {
        let index = 0;
        let removeCount = 0;

        for (const element of array) {
            if (element !== remove) {
                if (removeCount > 0) {
                    array[index - removeCount] = element;
                    array[index] = null;
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
}