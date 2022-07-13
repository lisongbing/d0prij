let protobuf = require('protobuf');
let builder = protobuf.newBuilder();

function PBHelper() {
    this.protoMap = null;
}

PBHelper.prototype = {
    loadFile: function (path, packageName, callback) {
        // 暂时注释
        protobuf.Util.IS_NODE = cc.sys.isNative;
        builder.importRoot = path;
        const self = this
        protobuf.protoFromFile(path+ '/gate', ()=>{
            window.PB = builder.build(packageName);
            self.registerProtoMap();
            if (callback) {
                callback();
            }
        }, builder);
    },

    mkLong: function (value, unsigned) {
        if (value && typeof value.low === 'number' && typeof value.high === 'number' && typeof value.unsigned === 'boolean'
            && value.low === value.low && value.high === value.high)
            return new protobuf.Long(value.low, value.high, typeof unsigned === 'undefined' ? value.unsigned : unsigned);
        if (typeof value === 'string')
            return protobuf.Long.fromString(value, unsigned || false, 10);
        if (typeof value === 'number')
            return protobuf.Long.fromNumber(value, unsigned || false);
        throw Error("not convertible to Long");
    },

    newReq: function (api) {
        let obj = this.protoMap[api];
        let req = new obj.req();
        return req;
    },

    newResp: function (api, data) {
        let obj = this.protoMap[api];
        return obj.resp.decode(data);
    },

    registerProtoMap: function () {
        let proMap = require('ProtoMap');
        this.protoMap = proMap.registerProtoMap();
    },
}

module.exports = PBHelper;