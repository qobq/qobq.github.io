export class NumberHelper {
    static formatNumber(num) {
        num = typeof num === 'string' ? parseFloat(num) : Number(num);
        if (typeof num !== 'number' || isNaN(num)) {
            return '';
        }

        if (num < 1000) {
            return num.toString();
        }

        const units = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q'];
        let unitIndex = -1;
        let scaledNum = num;

        while (scaledNum >= 1000 && unitIndex < units.length - 1) {
            scaledNum /= 1000;
            unitIndex++;
        }

        const roundedNum = Math.round(scaledNum * 10) / 10;

        return roundedNum + units[unitIndex];
    }

    static formatNumberPercent(num) {
        num = typeof num === 'string' ? parseFloat(num) : Number(num);
        if (typeof num !== 'number' || isNaN(num)) {
            return '';
        }

        const roundedNum = Math.round(num) / 10;

        return roundedNum + '%';
    }

    static formatStringLength(str, n) {
        if (str == null) {
            return ' '.repeat(n);
        }

        const stringToFormat = typeof str === 'string' ? str : String(str);

        if (stringToFormat.length < n) {
            return stringToFormat + ' '.repeat(n - stringToFormat.length);
        } else if (stringToFormat.length > n) {
            return stringToFormat.substring(0, n);
        }
        return stringToFormat;
    }

    static fn(n, l) {
        return this.formatStringLength(this.formatNumber(n), l);
    }

    static fnp(n, l) {
        return this.formatStringLength(this.formatNumberPercent(n), l);
    }
}