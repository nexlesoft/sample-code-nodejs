module.exports = {
    removeDuplicate: function (arr) {
        return arr.sort().filter(function (item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    },
    chunkArray(ary, chunk_size) {
        let index = 0;
        const arrayLength = ary.length;
        var tempArray = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            const myChunk = ary.slice(index, index + chunk_size);
            tempArray.push(myChunk);
        }

        return tempArray;
    },
    sortConversations(conversations, isAsc) {
        if (conversations && conversations.length > 0) {
            const result = conversations.sort((a, b) => {
                return isAsc ? a.ts - b.ts : b.ts - a.ts;
            });
            return result;
        }
        return [];
    }

};