module.exports = {

    resolve: (fullPath) => {
        //let currPath = cc.url.raw('resources/');
        //return fullPath.sub(currPath.length);
        return fullPath.sub(3);
    },

    join: () => {
        return cc.path.join.apply(null, arguments);
    }
}