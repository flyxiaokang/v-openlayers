export function extend(subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    //修正原型的constructor指向
    if (!superClass.prototype.contrucotor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}