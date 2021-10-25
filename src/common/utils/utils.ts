export default class Utils {

    public static isEmptyObject(obj: {}): boolean {
        return Object.keys(obj).length === 0;
    }
}