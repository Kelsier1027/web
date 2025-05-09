export const STRING_UTIL = {

    _textEncoder: new TextEncoder(),

    /**
     * @ngdoc 基於全形=3、ASCII=1的算法，計算中文字長度。
     * @param str 要計算長度的字串。
     * @return 該字串的特殊算法長度。
     */
    utf8Length(str: string): number {
        return this._textEncoder.encode(str).length;
    },

    /**
     * @ngdoc 基於全形=3、ASCII=1的算法，計算中文字長度後，取得全形=1，ASCII=1/3的長度數字。
     * @param str 要計算長度的字串。
     * @return 該字串的特殊算法長度。
     */
    utf8LengthForView(str: string): number {
        return Math.ceil(this.utf8Length(str) / 3);
    },

    /**
     * @ngdoc 基於全形=3、ASCII=1的算法，判斷字串是否大於指定長度。
     * @param str 要計算長度的字串。
     * @param mandarinWordCount 最大允許 (`<=`) 的中文字數。
     * @return `str` 的特殊算法長度是否 `<=` `mandarinWordCount`。
     */
    hasUtf8LengthNotMoreThan(str: string, mandarinWordCount: number): boolean {
        return this.utf8Length(str) <= mandarinWordCount * 3;
    },

    /**
     * 基於全型=3，ASCII=1的算法，削減字串直到指定長度。
     * @param str 要削減長度的字串。
     * @param targetMandarinWordCount 最大允許 (`<=`) 的中文字數。
     */
    spliceUntilUtf8Length(str: string, targetMandarinWordCount: number): string {
        const targetBytesCount = targetMandarinWordCount * 3;
        let result = '';
        let currLength = 0;

        const splits = str.split('');

        for (let i = 0; i < splits.length; i++) {
            const nextWord = splits[i];
            const nextLength = this.utf8Length(nextWord);

            currLength += nextLength;

            if (currLength > targetBytesCount)
                return result;

            result += nextWord;
        }

        return result;
    },

    /**
     * 把數字轉換成千分位形式的字串。
     * @param price 價格的 number
     */
    priceToString(price: number, fractionDigits: number = 0): string {
        return price.toLocaleString('en-US', {maximumFractionDigits: fractionDigits});
    }
}